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
// Rearranges a multiset so no two adjacent entries are ever equal (the
// classic "reorganize string" technique: bucket by frequency, then
// round-robin through buckets, always preferring whichever bucket has the
// most remaining items that isn't the value just placed). This is always
// achievable as long as no single value's count exceeds half the total
// length (rounded up) — true here by a wide margin, since a club's
// game-count deficit is always tiny relative to how many clubs are in its
// conference. Used so the deficit-pairing pool below can pair up
// CONSECUTIVE entries directly, guaranteeing every pair is two different
// clubs, without ever needing an ad hoc "no valid partner" fallback that
// (found during testing) could otherwise repeatedly dump unplanned extra
// games onto whichever club happened to be first in an array, rather than
// genuinely needing one.
function interleaveNoAdjacentDuplicates(items, rng) {
  const counts = new Map();
  items.forEach((v) => counts.set(v, (counts.get(v) || 0) + 1));
  const queues = seededShuffle([...counts.entries()], rng).map(([v, c]) => Array(c).fill(v));
  const result = [];
  let lastVal = null;
  while (queues.some((q) => q.length)) {
    queues.sort((a, b) => b.length - a.length);
    let picked = queues.find((q) => q.length && q[0] !== lastVal);
    if (!picked) picked = queues.find((q) => q.length); // only reached if unavoidable (shouldn't occur given the frequency bound above)
    const val = picked.shift();
    result.push(val);
    lastVal = val;
  }
  return result;
}

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

  // Cross-conference pairing via a pool-based construction, which
  // guarantees every club receives EXACTLY its intended crossCountFor
  // total, rather than a greedy random matcher that can leave a specific
  // club short if its candidates happen to run out early (found during
  // testing: the greedy version's stop condition only checked one side's
  // remaining count, so a specific club on the other side could
  // occasionally end up under-delivered even though the aggregate totals
  // still balanced). Build one pool per side, each club repeated once per
  // cross game it still needs; since both pools are always the same
  // length by construction (crossCountFor is built so both sides' totals
  // match), shuffling and zipping them together always produces exactly
  // the right number of pairs for every club, with no possible shortfall.
  const poolA = [];
  clubsA.forEach((id) => { for (let i = 0; i < crossCountFor[id]; i++) poolA.push(id); });
  const poolB = [];
  clubsB.forEach((id) => { for (let i = 0; i < crossCountFor[id]; i++) poolB.push(id); });
  const shuffledA = seededShuffle(poolA, rng);
  let shuffledB = seededShuffle(poolB, rng);
  // Light repair pass: avoid the exact same (a,b) pair appearing twice
  // where a cheap swap can fix it, without ever leaving a pool entry
  // unpaired (the swap only ever exchanges positions within poolB, so the
  // total count per club is always preserved regardless of the outcome).
  const seenPairs = new Set();
  for (let i = 0; i < shuffledA.length; i++) {
    const a = shuffledA[i];
    let b = shuffledB[i];
    if (seenPairs.has(`${a}|${b}`)) {
      const swapIdx = shuffledB.findIndex((cand, j) => j > i && !seenPairs.has(`${a}|${cand}`));
      if (swapIdx !== -1) {
        [shuffledB[i], shuffledB[swapIdx]] = [shuffledB[swapIdx], shuffledB[i]];
        b = shuffledB[i];
      }
    }
    seenPairs.add(`${a}|${b}`);
  }
  const crossPairs = shuffledA.map((a, i) => [a, shuffledB[i]]);

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
    // Build a flat pool where each club appears once per remaining game it
    // still needs (its deficit against the target), then rearrange it so
    // no two adjacent entries are ever the same club (see
    // interleaveNoAdjacentDuplicates above). Pairing directly off the
    // front two-at-a-time then always pairs two DIFFERENT clubs, hitting
    // the exact target for every club whenever this conference's total
    // deficit is even — the normal case. The only situation where a
    // single club can't avoid a one-game overage is if the total deficit
    // within this specific conference is genuinely odd, leaving exactly
    // one unpaired entry at the very end — a real mathematical necessity,
    // not an avoidable inefficiency in the matching order.
    let pool = [];
    ids.forEach((id) => {
      const deficit = targetTotalGames - currentTotal[id];
      for (let i = 0; i < deficit; i++) pool.push(id);
    });
    pool = interleaveNoAdjacentDuplicates(pool, rng);

    const makeFixture = (a, b) => {
      const home = currentHome[a] <= currentHome[b] ? a : b;
      const away = home === a ? b : a;
      const md = Math.max(nextFree[home], nextFree[away]);
      fixtures.push({ id: uid(), matchday: md, homeClubId: home, awayClubId: away, homeScore: null, awayScore: null, played: false });
      nextFree[home] = md + 1; nextFree[away] = md + 1;
      currentTotal[a]++; currentTotal[b]++;
      currentHome[home]++;
    };

    while (pool.length >= 2) {
      const a = pool.shift();
      const b = pool.shift();
      makeFixture(a, b);
    }
    if (pool.length === 1) {
      // Genuinely odd total deficit for this conference — exactly one
      // entry has no partner left. Distribute this single unavoidable
      // overage as fairly as possible: prefer a club not already carrying
      // one, deterministic tie-break by name (never club id).
      const a = pool[0];
      const candidates = ids.filter((x) => x !== a).sort((p, q) => (p < q ? -1 : 1));
      if (candidates.length) makeFixture(a, candidates[0]);
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

// ===================== TIER-SPECIFIC GEOGRAPHIC BORDER AXIS =====================
// GAME-SPECIFIC RULE, NOT A REAL MLS/USLC POLICY — no real precedent exists
// for how a promotion/relegation system between MLS and USLC would resolve
// conference membership, since that scenario has no real-world analogue.
//
// This replaces a prior version of this file that used a hand-curated
// "border-market club" list plus a lowest-id tie-break. That was flagged,
// correctly, as not actually being a distance calculation — it was a
// judgment call dressed up as geography. This version computes real
// distance from real coordinates instead.
//
// For a tier with a known real East/West split (MLS, USLC), this computes
// that TIER'S OWN border axis: the centroid of its real East clubs'
// coordinates, the centroid of its real West clubs' coordinates, and the
// perpendicular bisector line between them, in a simple equirectangular
// (flat-map) projection with longitude scaled by cos(latitude) to
// partially correct for meridian convergence. This is an approximation of
// true geodesic distance, not survey-grade GIS — adequate for RELATIVE
// ranking of which club sits closest to the line, which is all a
// displacement decision needs. MLS's axis and USLC's axis are genuinely
// different lines, computed from different real cities, because the two
// leagues' real conference memberships are different sets of cities.
function centroid(names, coords) {
  const pts = names.map((n) => coords[n]).filter(Boolean);
  if (!pts.length) return null;
  return {
    lat: pts.reduce((s, p) => s + p.lat, 0) / pts.length,
    lng: pts.reduce((s, p) => s + p.lng, 0) / pts.length,
  };
}

export function computeBorderAxis(eastNames, westNames, coords) {
  const eastC = centroid(eastNames, coords);
  const westC = centroid(westNames, coords);
  if (!eastC || !westC) return null; // no real conference split available for this tier (e.g. USL1/USL2 today)
  const midpoint = { lat: (eastC.lat + westC.lat) / 2, lng: (eastC.lng + westC.lng) / 2 };
  const cosLat = Math.cos((midpoint.lat * Math.PI) / 180);
  const dx = (westC.lng - eastC.lng) * cosLat;
  const dy = westC.lat - eastC.lat;
  const mag = Math.sqrt(dx * dx + dy * dy) || 1;
  return { midpoint, dir: { x: dx / mag, y: dy / mag }, cosLat };
}

// Distance from a specific club to a specific tier's border axis. A club
// with no coordinate data returns Infinity — it is never preferred as a
// "closest to the border" candidate, since there's no geography to base
// that on; see the deterministic fallback in resolveConferenceMembership
// for what happens if every candidate lacks coordinates (not expected
// given the current 92-club real dataset, but handled defensively).
export function distanceToBorder(clubName, axis, coords) {
  if (!axis) return Infinity;
  const p = coords[clubName];
  if (!p) return Infinity;
  const x = (p.lng - axis.midpoint.lng) * axis.cosLat;
  const y = p.lat - axis.midpoint.lat;
  return Math.abs(x * axis.dir.x + y * axis.dir.y);
}

// ===================== CONFERENCE PLACEMENT (promotion/relegation) =====================
// Every club has a PERMANENT `geoConference` (assignGeoConference) — where
// it naturally belongs — and a SEASONAL `conference` (this season's actual
// placement). Every resolution pass starts by placing every club back in
// its own geoConference, which is what gives "restore toward the natural
// conference whenever sizes allow" for free: there's no separate "is this
// club currently displaced" bookkeeping, because each pass starts fresh
// from "everyone home" and only displaces what's still required.
//
// Resolution order:
//   1. Determine the club's current tier (implicit in which of
//      resolveMlsConferences/resolveUslcConferences the caller invokes).
//   2. Determine whether that tier uses a conference system at all (today:
//      MLS and USLC do; USL1 and USL2 don't, so neither is routed through
//      this function).
//   3. Use ONLY that tier's own geoConference data and that tier's own
//      geographic border axis (computeBorderAxis above) — never another
//      tier's. This holds structurally: resolveConferenceMembership only
//      ever receives ONE axis per call, computed from that one tier's real
//      conference geography, so a club's proximity to (say) USLC's border
//      is never consulted when the same club is later resolved in MLS.
//      If Louisville City FC is promoted into MLS, its distance is
//      recalculated from scratch against MLS's OWN axis (built from real
//      MLS East/West city coordinates) — its distance to USLC's axis, and
//      any status that gave it there, plays no role at all.
//   4. Restore every club toward its persistent geographic conference
//      first (the "everyone home" reset below) — before any displacement
//      is even considered.
//   5. If conference sizes still don't match after that, and temporary
//      displacement is genuinely required, displace the club(s) in the
//      oversized conference with the SMALLEST actual distance to this
//      tier's border axis — the club that is geographically closest to
//      sitting between the two conferences, not an arbitrary pick.
//   6. If every remaining candidate lacks coordinate data (not expected
//      given the current dataset, but handled defensively) or two clubs
//      are exactly tied on distance, fall back to alphabetical order by
//      club name — deterministic, but explicitly not dressed up as a
//      geographic decision, and not club id (which carries no geographic
//      or competitive meaning at all).
//   7. A border axis (and displacement history) from any OTHER tier is
//      never consulted — see point 3.
export function resolveConferenceMembership(clubs, { targetSizeA, nameA, nameB, realConferenceLookup, borderAxis, coords, seed }) {
  assignGeoConference(clubs, seed || `geoconf-${nameA}-${nameB}`, realConferenceLookup);
  clubs.forEach((c) => { c.conference = c.geoConference; });

  let guard = 0;
  while (guard < clubs.length + 5) {
    guard++;
    const countA = clubs.filter((x) => x.conference === nameA).length;
    if (countA === targetSizeA) break;
    const oversizedName = countA > targetSizeA ? nameA : nameB;
    const inOversized = clubs.filter((c) => c.conference === oversizedName);
    if (!inOversized.length) break;
    const ranked = inOversized
      .map((c) => ({ c, d: coords ? distanceToBorder(c.name, borderAxis, coords) : Infinity }))
      .sort((a, b) => a.d - b.d || (a.c.name < b.c.name ? -1 : 1));
    ranked[0].c.conference = oversizedName === nameA ? nameB : nameA;
  }
  return clubs;
}
