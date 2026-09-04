// ===================== SEEDED SCHEDULING =====================
// This module is scoped deliberately narrowly: seeded determinism here
// applies ONLY to fixture generation and conference placement for
// conference-based leagues (MLS, USL Championship). It does not extend to
// match simulation, player generation, or any other random system in the
// engine — those remain unseeded by design (expanding determinism further
// is a separate, larger project).

// Deterministic string -> 32-bit int hash (xfnv1a), then mulberry32 PRNG.
// Same seed string always produces the same sequence of values.
function hashSeed(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function makeSeededRng(seedString) {
  let a = hashSeed(seedString) || 1;
  return function seededRandom() {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(arr, rng) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function seededChoice(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

// ===================== PERSISTENT GEOGRAPHIC IDENTITY =====================
// Every USA-pyramid club (MLS, USLC, USL1, USL2 alike) carries a permanent
// `geoConference` ("East"/"West") assigned once, the first time the club is
// ever seen, and never overwritten afterward by any balancing logic. This is
// deliberately a SEPARATE field from `conference` (this SEASON's actual
// placement) — see resolveConferenceMembership below for how the two
// interact. Real MLS/USLC clubs get their real-world conference; every
// other club (fictional filler, or a real club with no known MLS/USLC
// membership, e.g. a USL1/USL2-only club) gets a deterministic, seeded,
// roughly-balanced fallback assignment — there is no real geographic data
// available for these clubs in the engine's data model, so this is
// explicitly an engine approximation, not a claim about real geography.
export function assignGeoConference(clubs, seed, realConferenceLookup) {
  const rng = makeSeededRng(seed);
  clubs.forEach((c) => {
    if (c.geoConference === "East" || c.geoConference === "West") return; // already permanently tagged, never touched again
    const real = realConferenceLookup ? realConferenceLookup(c.name) : null;
    if (real === "East" || real === "West") c.geoConference = real;
  });
  const needsFallback = clubs.filter((c) => c.geoConference !== "East" && c.geoConference !== "West");
  const sorted = [...needsFallback].sort((a, b) => (a.name < b.name ? -1 : 1));
  sorted.forEach((c) => {
    const eastCount = clubs.filter((x) => x.geoConference === "East").length;
    const westCount = clubs.filter((x) => x.geoConference === "West").length;
    if (eastCount === westCount) c.geoConference = rng() < 0.5 ? "East" : "West";
    else c.geoConference = eastCount < westCount ? "East" : "West";
  });
  return clubs;
}

// ===================== CONFERENCE INTRA-CONFERENCE BASE SCHEDULE =====================
function conferenceDoubleRoundRobin(clubIds, startMatchday, uid) {
  const clubs = [...clubIds];
  if (clubs.length % 2 === 1) clubs.push("BYE");
  const n = clubs.length;
  const fixed = clubs[0];
  let rest = clubs.slice(1);
  const rounds = [];
  for (let r = 0; r < n - 1; r++) {
    const half = n / 2 - 1;
    const left = [fixed, ...rest.slice(0, half)];
    const right = [...rest.slice(half)].reverse();
    rounds.push(left.map((h, i) => [h, right[i]]));
    rest = [rest[rest.length - 1], ...rest.slice(0, rest.length - 1)];
  }
  const fixtures = [];
  const nextFree = {};
  clubIds.forEach((id) => { nextFree[id] = startMatchday; });
  const emit = (pairsPerRound, mdOffset) => {
    pairsPerRound.forEach((pairs, idx) => {
      const matchday = startMatchday + mdOffset + idx;
      pairs.forEach(([home, away]) => {
        if (home === "BYE" || away === "BYE") return;
        fixtures.push({ id: uid(), matchday, homeClubId: home, awayClubId: away, homeScore: null, awayScore: null, played: false });
        nextFree[home] = Math.max(nextFree[home], matchday + 1);
        nextFree[away] = Math.max(nextFree[away], matchday + 1);
      });
    });
  };
  emit(rounds, 0);
  const secondLegMdOffset = n - 1;
  emit(rounds.map((pairs) => pairs.map(([h, a]) => [a, h])), secondLegMdOffset);
  const nextMatchday = startMatchday + 2 * (n - 1);
  return { fixtures, nextMatchday, nextFree };
}

// ===================== EXACT-BALANCE CROSS-CONFERENCE CONSTRUCTION =====================
// Provably exact, not an approximation, when both conferences are the same
// size `n` and the cross-conference cap is even (MLS: 15/15, cap 6).
// East position i plays West positions (i+offset)..(i+offset+cap-1) mod n;
// offset and the West ordering are seeded (variety season to season) but
// the balance guarantee holds for ANY offset/ordering — see proof in the
// accompanying implementation report.
function buildExactCrossSchedule(eastIds, westIds, cap, rng, uid, nextFree) {
  const n = eastIds.length;
  if (westIds.length !== n || cap % 2 !== 0 || cap > n || cap <= 0) return null;
  const westOrder = seededShuffle(westIds, rng);
  const offset = Math.floor(rng() * n);
  const fixtures = [];
  for (let i = 0; i < n; i++) {
    const east = eastIds[i];
    for (let k = 0; k < cap; k++) {
      const westIdx = (i + offset + k) % n;
      const west = westOrder[westIdx];
      const homeIsEast = k < cap / 2;
      const home = homeIsEast ? east : west;
      const away = homeIsEast ? west : east;
      const md = Math.max(nextFree[home], nextFree[away]);
      fixtures.push({ id: uid(), matchday: md, homeClubId: home, awayClubId: away, homeScore: null, awayScore: null, played: false });
      nextFree[home] = md + 1; nextFree[away] = md + 1;
    }
  }
  return fixtures;
}

// ===================== CROSS-CONFERENCE + EXTRA-INTRA DISTRIBUTION (fallback) =====================
// Used when the exact construction doesn't apply (uneven conference sizes,
// e.g. USLC's 13/12, or an odd cap). ENGINE APPROXIMATION of an
// undocumented real selection rule — see the accompanying report for the
// documented totals this reproduces exactly (only the pairings are
// approximated). Home/away converges to within +/-1 of even per club.
function buildApproximateCrossAndExtraSchedule(clubsA, clubsB, targetTotalGames, crossConferenceCap, baseIntraCount, rng, uid, nextFree) {
  const fixtures = [];
  const smaller = clubsA.length <= clubsB.length ? clubsA : clubsB;
  const larger = smaller === clubsA ? clubsB : clubsA;
  const totalCrossEndpoints = smaller.length * crossConferenceCap;
  const largerBase = Math.floor(totalCrossEndpoints / larger.length);
  const largerRemainder = totalCrossEndpoints - largerBase * larger.length;
  const largerShuffled = seededShuffle(larger, rng);
  const crossCountFor = {};
  smaller.forEach((id) => { crossCountFor[id] = crossConferenceCap; });
  largerShuffled.forEach((id, idx) => { crossCountFor[id] = largerBase + (idx < largerRemainder ? 1 : 0); });

  const remaining = {};
  clubsA.concat(clubsB).forEach((id) => { remaining[id] = crossCountFor[id]; });
  const crossPairs = [];
  let guard = 0;
  while (clubsA.some((id) => remaining[id] > 0) && guard < 5000) {
    guard++;
    const aPool = seededShuffle(clubsA.filter((id) => remaining[id] > 0), rng);
    const bPool = seededShuffle(clubsB.filter((id) => remaining[id] > 0), rng);
    if (!aPool.length || !bPool.length) break;
    for (const a of aPool) {
      if (remaining[a] <= 0) continue;
      const candidates = bPool.filter((b) => remaining[b] > 0 && !crossPairs.some((p) => p[0] === a && p[1] === b));
      if (!candidates.length) continue;
      const b = seededChoice(candidates, rng);
      crossPairs.push([a, b]);
      remaining[a]--; remaining[b]--;
    }
  }

  const crossHomeTarget = {};
  clubsA.concat(clubsB).forEach((id) => { crossHomeTarget[id] = Math.round((crossCountFor[id] ?? 0) / 2); });
  const homeCountCross = {};
  clubsA.concat(clubsB).forEach((id) => { homeCountCross[id] = 0; });
  const shuffledCrossPairs = seededShuffle(crossPairs, rng);
  shuffledCrossPairs.forEach(([a, b]) => {
    const aShortfall = crossHomeTarget[a] - homeCountCross[a];
    const bShortfall = crossHomeTarget[b] - homeCountCross[b];
    const home = aShortfall !== bShortfall ? (aShortfall > bShortfall ? a : b) : (rng() < 0.5 ? a : b);
    const away = home === a ? b : a;
    const md = Math.max(nextFree[home], nextFree[away]);
    fixtures.push({ id: uid(), matchday: md, homeClubId: home, awayClubId: away, homeScore: null, awayScore: null, played: false });
    nextFree[home] = md + 1; nextFree[away] = md + 1;
    homeCountCross[home]++;
  });

  const currentTotal = {};
  clubsA.concat(clubsB).forEach((id) => { currentTotal[id] = baseIntraCount[id]; });
  fixtures.forEach((f) => { currentTotal[f.homeClubId]++; currentTotal[f.awayClubId]++; });
  const currentHome = {};
  clubsA.concat(clubsB).forEach((id) => { currentHome[id] = 0; });
  fixtures.forEach((f) => { currentHome[f.homeClubId]++; });

  const finalizeConference = (ids) => {
    const usedExtraAgainst = {};
    ids.forEach((id) => { usedExtraAgainst[id] = new Set(); });
    let guard2 = 0;
    while (ids.some((id) => currentTotal[id] < targetTotalGames) && guard2 < ids.length * 6) {
      guard2++;
      for (const id of ids) {
        if (currentTotal[id] >= targetTotalGames) continue;
        // Prefer another club that's also still under target (keeps both
        // totals converging toward the target together); if none remain
        // (e.g. an odd number of deficit clubs left, so exactly one can't
        // be paired with another deficit club), fall back to any
        // not-yet-doubled same-conference opponent even if it's already
        // at/over target — a small overage on one club is preferable to
        // a permanent shortfall on another.
        const preferredCandidates = ids.filter((other) => other !== id && currentTotal[other] < targetTotalGames && !usedExtraAgainst[id].has(other));
        const fallbackCandidates = ids.filter((other) => other !== id && !usedExtraAgainst[id].has(other));
        const candidates = preferredCandidates.length ? preferredCandidates : fallbackCandidates;
        if (!candidates.length) continue;
        const opp = seededChoice(seededShuffle(candidates, rng), rng);
        usedExtraAgainst[id].add(opp);
        usedExtraAgainst[opp].add(id);
        const home = currentHome[id] <= currentHome[opp] ? id : opp;
        const away = home === id ? opp : id;
        const md = Math.max(nextFree[home], nextFree[away]);
        fixtures.push({ id: uid(), matchday: md, homeClubId: home, awayClubId: away, homeScore: null, awayScore: null, played: false });
        nextFree[home] = md + 1; nextFree[away] = md + 1;
        currentTotal[id]++; currentTotal[opp]++;
        currentHome[home]++;
      }
    }
  };
  finalizeConference(clubsA);
  finalizeConference(clubsB);
  return fixtures;
}

export function generateConferenceSeasonSchedule({ conferences, targetTotalGames, crossConferenceCap, seed, uid }) {
  const confNames = Object.keys(conferences);
  if (confNames.length !== 2) throw new Error("generateConferenceSeasonSchedule expects exactly two conferences");
  const [nameA, nameB] = confNames;
  const clubsA = conferences[nameA];
  const clubsB = conferences[nameB];
  const rng = makeSeededRng(seed);

  const baseA = conferenceDoubleRoundRobin(clubsA, 1, uid);
  const baseB = conferenceDoubleRoundRobin(clubsB, 1, uid);
  const fixtures = [...baseA.fixtures, ...baseB.fixtures];
  const nextFree = { ...baseA.nextFree, ...baseB.nextFree };
  const baseIntraCount = {};
  clubsA.forEach((id) => { baseIntraCount[id] = 2 * (clubsA.length - 1); });
  clubsB.forEach((id) => { baseIntraCount[id] = 2 * (clubsB.length - 1); });

  const exactCross = buildExactCrossSchedule(clubsA, clubsB, crossConferenceCap, rng, uid, nextFree);
  if (exactCross) {
    return [...fixtures, ...exactCross];
  }
  return [...fixtures, ...buildApproximateCrossAndExtraSchedule(clubsA, clubsB, targetTotalGames, crossConferenceCap, baseIntraCount, rng, uid, nextFree)];
}

// ===================== CONFERENCE PLACEMENT (promotion/relegation) =====================
// GAME-SPECIFIC RULE, NOT A REAL MLS/USLC POLICY — no real precedent exists.
//
// Every club has a PERMANENT `geoConference` (assignGeoConference) — where
// it naturally belongs, entirely independent of border-market status — and
// a SEASONAL `conference` (this season's actual placement). Every
// resolution pass starts by placing every club back in its own
// geoConference, which is what gives step 4 below (restore toward the
// natural conference whenever sizes allow) for free: there's no separate
// "is this club currently displaced" bookkeeping, because each pass starts
// fresh from "everyone home" and only displaces what's still required.
//
// Resolution order, exactly as specified:
//   1. Determine the club's current tier (implicit in which of
//      resolveMlsConferences/resolveUslcConferences the caller invokes).
//   2. Determine whether that tier uses a conference system at all (today:
//      MLS and USLC do; USL1 and USL2 don't, so neither is ever routed
//      through this function).
//   3. Use ONLY that tier's own geoConference data and TIER-SCOPED
//      BORDER-MARKET DATA — see note below. Never another tier's list.
//   4. Restore every club toward its persistent geographic conference
//      first (the "everyone home" reset above) — this happens before any
//      displacement is even considered.
//   5. If conference sizes still don't match after that, and temporary
//      displacement is genuinely required, prefer an eligible club from
//      THIS TIER's own border-market list.
//   6. If no border-market candidate exists in this tier's list, fall back
//      to the deterministic tie-break (lowest club id).
//   7. A border-market designation from any OTHER tier is never consulted
//      and never a reason to move a club — see TIER-SCOPED BORDER-MARKET
//      DATA below for why this holds structurally, not just by convention.
//
// TIER-SCOPED BORDER-MARKET DATA — each tier's border-market list is
// judgment-based curation (clubs whose real metro area is broadly closer
// to the middle of the country, and therefore a more plausible temporary
// fit for either conference than most of their conference's other
// members). It is NOT derived from measured distances or coordinates (the
// engine has no such data) and is NOT a global property of a club — it is
// scoped strictly to one specific tier's conference system. A club's
// membership on one tier's list has no bearing on any other tier: this
// isn't a policy the caller has to remember to enforce, it's a structural
// consequence of resolveConferenceMembership only ever receiving ONE
// border list per call, for the one specific tier being resolved. If
// Louisville City FC (on USLC's list) is promoted into MLS, the MLS
// resolution call passes MLS_BORDER_MARKET_CLUBS — a set that doesn't
// contain Louisville — so Louisville gets no border-market preference in
// MLS; it is evaluated purely on its geoConference and, if displacement
// is needed, against MLS's own list, exactly like any other MLS club with
// no border-market status at all. This is used strictly as a
// conflict-resolution tie-break — never a reason to move a club that
// doesn't need to move, and never something that makes a club "regularly"
// cross conferences.
//
// USL1_BORDER_MARKET_CLUBS and USL2_BORDER_MARKET_CLUBS are empty today,
// because neither tier is currently routed through a conference resolver
// at all (real USL1 is a single flat group; real USL2's 158-club/20-
// division structure is out of scope, see project notes) — not because
// those clubs are considered geographically inflexible. They exist as
// explicit, tier-scoped placeholders: the day either tier gains a real
// conference structure, populating its own list is a data change, not new
// resolver code, and it would carry exactly the same tier-scoping
// guarantee MLS and USLC already have.
export const MLS_BORDER_MARKET_CLUBS = new Set([
  "Minnesota United FC", "Sporting Kansas City", "St. Louis City SC",
  "Nashville SC", "Atlanta United FC",
]);
export const USLC_BORDER_MARKET_CLUBS = new Set([
  "FC Tulsa", "San Antonio FC",
  "Louisville City FC", "Indy Eleven",
]);
export const USL1_BORDER_MARKET_CLUBS = new Set([]);
export const USL2_BORDER_MARKET_CLUBS = new Set([]);

export function resolveConferenceMembership(clubs, { targetSizeA, nameA, nameB, realConferenceLookup, borderMarketNames, seed }) {
  assignGeoConference(clubs, seed || `geoconf-${nameA}-${nameB}`, realConferenceLookup);
  clubs.forEach((c) => { c.conference = c.geoConference; });

  const border = new Set(borderMarketNames || []);
  let guard = 0;
  while (guard < clubs.length + 5) {
    guard++;
    const countA = clubs.filter((x) => x.conference === nameA).length;
    if (countA === targetSizeA) break;
    const oversizedName = countA > targetSizeA ? nameA : nameB;
    const inOversized = clubs.filter((c) => c.conference === oversizedName);
    const borderCandidates = inOversized.filter((c) => border.has(c.name)).sort((a, b) => (a.id < b.id ? -1 : 1));
    const candidates = borderCandidates.length ? borderCandidates : inOversized.sort((a, b) => (a.id < b.id ? -1 : 1));
    if (!candidates.length) break;
    candidates[0].conference = oversizedName === nameA ? nameB : nameA;
  }
  return clubs;
}
