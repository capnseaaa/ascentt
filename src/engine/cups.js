import { shuffle } from "./playerGen";
import { EFL_CUP_CHAMPION_PRIZE, EFL_CUP_ROUND_MATCHDAYS, EFL_CUP_RUNNERUP_PRIZE, EFL_CUP_STAGE_PRIZES, ENGLAND_CUP_STAGE_NAMES, FA_CUP_CHAMPION_PRIZE, FA_CUP_ROUND3_LOSER_CONSOLATION, FA_CUP_ROUND_MATCHDAYS, FA_CUP_RUNNERUP_PRIZE, FA_CUP_STAGE_PRIZES, FULL_TIER_META, LATER_CUP_ROUND_LABELS, US_OPEN_CUP_CHAMPION_PRIZE, US_OPEN_CUP_GIANT_KILLER_BONUS, US_OPEN_CUP_ROUND_MATCHDAYS, US_OPEN_CUP_RUNNERUP_PRIZE } from "./constants";
import { computeTable } from "./matchSim";
import { resolveKnockoutMatch } from "./leagueSim";
import { activeWeeksOf, createCompetitionSeasonTemplate, resolveCupSeasonCalendar } from "./calendar";

// Cup timing is now a reusable, season-relative TEMPLATE, resolved fresh
// into an absolute CalendarProfile every season — never a permanent
// absolute-week constant. This is the direct fix for the confirmed bug
// where the old static profiles (computed once, at module load) could
// never fire again after early season 1, since the world week they were
// compared against kept growing every season while the profile's own
// weeks stayed fixed forever.
//
// The offsets below are the SAME round spacing as before (e.g. US Open
// Cup round 1 was matchday 3 when the world always started at week 1 —
// as an offset from that anchor, that's 3-1=2), just re-expressed
// relative to a season anchor instead of baked in as absolute weeks.
// anchorRule is included for completeness/documentation, but cups never
// resolve their own anchor (see resolveCupSeasonCalendar) — they always
// share their host pyramid's already-resolved anchor for that season.
export const US_OPEN_CUP_TEMPLATE = createCompetitionSeasonTemplate({
  id: "us_open_cup",
  anchorRule: { mode: "ROLLING" }, // shares the USA pyramid's own rolling anchor — see resolveCupSeasonCalendar
  seasonLengthWeeks: null, // cups don't have a continuous regular-season window; only round offsets matter
  activeWindowOffsets: [],
  cupWindowOffsets: US_OPEN_CUP_ROUND_MATCHDAYS.map((w) => w - 1),
});
export const FA_CUP_TEMPLATE = createCompetitionSeasonTemplate({
  id: "fa_cup",
  anchorRule: { mode: "ROLLING" }, // shares England's own rolling anchor
  seasonLengthWeeks: null,
  activeWindowOffsets: [],
  cupWindowOffsets: FA_CUP_ROUND_MATCHDAYS.map((w) => w - 1),
});
export const EFL_CUP_TEMPLATE = createCompetitionSeasonTemplate({
  id: "efl_cup",
  anchorRule: { mode: "ROLLING" },
  seasonLengthWeeks: null,
  activeWindowOffsets: [],
  cupWindowOffsets: EFL_CUP_ROUND_MATCHDAYS.map((w) => w - 1),
});

// Called once per season (world build for season 1, rollover for every
// season after) with that season's already-resolved USA/England anchor —
// the SAME anchor value the league tiers for that pyramid just resolved,
// never independently computed. Returns the three fresh, season-specific
// CalendarProfiles to attach to state (see App.jsx).
export function resolveCupCalendarsForSeason(usaAnchorWorldWeek, englandAnchorWorldWeek) {
  return {
    usOpenCupCalendar: resolveCupSeasonCalendar(US_OPEN_CUP_TEMPLATE, usaAnchorWorldWeek),
    faCupCalendar: resolveCupSeasonCalendar(FA_CUP_TEMPLATE, englandAnchorWorldWeek),
    eflCupCalendar: resolveCupSeasonCalendar(EFL_CUP_TEMPLATE, englandAnchorWorldWeek),
  };
}

export function drawCupPairs(entrants) {
  const roster = shuffle(entrants);
  let byeEntrant = null;
  if (roster.length % 2 === 1) byeEntrant = roster.pop();
  const pairs = [];
  for (let i = 0; i < roster.length; i += 2) pairs.push([roster[i], roster[i + 1]]);
  return { pairs, byeEntrant };
}

export function resolveCupPairs(pairs, worldWeek, competitionId) {
  return pairs.map(([homeEntrant, awayEntrant]) => {
    const outcome = resolveKnockoutMatch(homeEntrant.club, awayEntrant.club, worldWeek, competitionId, true);
    const winnerEntrant = outcome.winner.id === homeEntrant.club.id ? homeEntrant : awayEntrant;
    const loserEntrant = winnerEntrant === homeEntrant ? awayEntrant : homeEntrant;
    // Giant-killer: a club from a numerically higher tier index (a lower
    // league) beating one from a lower tier index (a higher league).
    const isUpset = winnerEntrant.tierIdx > loserEntrant.tierIdx;
    return { homeEntrant, awayEntrant, outcome, winnerEntrant, loserEntrant, isUpset };
  });
}

export function playCupRound(entrants, worldWeek, competitionId) {
  const { pairs, byeEntrant } = drawCupPairs(entrants);
  const matches = resolveCupPairs(pairs, worldWeek, competitionId);
  const advancing = byeEntrant ? [...matches.map((m) => m.winnerEntrant), byeEntrant] : matches.map((m) => m.winnerEntrant);
  return { matches, byeEntrant, advancing };
}

export function estimateRoundsRemaining(poolSize) {
  return Math.max(1, Math.ceil(Math.log2(Math.max(poolSize, 2))));
}

export function computeEnglandCupRoundPool(cupKey, progress, englandTiers, eflCupQualifiers) {
  const wrap = (club, tierIdx) => ({ club, tierIdx });
  const roundIndex = progress ? progress.rounds.length : 0;
  // englandTiers[i].id is the tier's real global id (4-7) — use that for
  // the entrant's tierIdx, not the local array position i, or TierBadge
  // and giant-killer detection would show the wrong league entirely.
  const entrantsFromTier = (localTierIdx) => englandTiers[localTierIdx].clubs.map((c) => wrap(c, englandTiers[localTierIdx].id));

  if (cupKey === "fa") {
    // Real FA Cup: League One and League Two enter Round 1. Round 2 is
    // pure knockout among survivors — no new entrants. Round 3 is where
    // the Premier League AND Championship BOTH join together (the same
    // round, not staggered across two separate rounds).
    if (roundIndex === 0) return [...entrantsFromTier(3), ...entrantsFromTier(2)]; // League Two + League One
    if (roundIndex === 2) return [...progress.pool, ...entrantsFromTier(1), ...entrantsFromTier(0)]; // Championship + Premier League join together
    return progress.pool;
  }
  // Real EFL Cup: Championship, League One, and League Two enter Round 1
  // together. Round 2 is where the Premier League clubs NOT in Europe
  // join; Round 3 is where the clubs that qualified for Europe (a proxy
  // here, since this game doesn't model European competitions: the top 5
  // Premier League finishers from the previous season) join a round
  // later, same as the real competition gives its European-playing clubs
  // a bye into the next round.
  if (roundIndex === 0) return [...entrantsFromTier(1), ...entrantsFromTier(2), ...entrantsFromTier(3)];
  if (roundIndex === 1 || roundIndex === 2) {
    const plEntrants = entrantsFromTier(0);
    const europeIds = new Set(eflCupQualifiers?.plTop5 ?? []);
    const nonEurope = plEntrants.filter((e) => !europeIds.has(e.club.id));
    const inEurope = plEntrants.filter((e) => europeIds.has(e.club.id));
    if (roundIndex === 1) return [...progress.pool, ...nonEurope];
    return [...progress.pool, ...inEurope];
  }
  return progress.pool;
}

export function englandCupStageLabel(cupKey, roundIndex, poolSize) {
  if (roundIndex === 0) return "Round 1";
  if (roundIndex === 1) return "Round 2";
  if (roundIndex === 2) return "Round 3"; // structurally fixed for both cups now — FA Cup: Championship+PL join; EFL Cup: Europe-proxy PL clubs join
  const roundsRemaining = estimateRoundsRemaining(poolSize);
  if (roundsRemaining <= 1) return "Final";
  return ENGLAND_CUP_STAGE_NAMES[roundsRemaining] ?? "Round 4";
}

export function previewStageLabel(roundIndex) {
  if (roundIndex === 0) return "Round 1";
  if (roundIndex === 1) return "Round 2";
  if (roundIndex === 2) return "Round 3";
  return "Next round";
}

export function drawNextEnglandCupRound(cupKey, progress, englandTiers, eflCupQualifiers) {
  const pool = computeEnglandCupRoundPool(cupKey, progress, englandTiers, eflCupQualifiers);
  const { pairs, byeEntrant } = drawCupPairs(pool);
  return { roundIndex: progress ? progress.rounds.length : 0, pairs, byeEntrant };
}

export function playNextEnglandCupRound(cupKey, progress, englandTiers, preDrawn, eflCupQualifiers, worldWeek) {
  // Real scheduled World Week now, not a sentinel (9998) — this is the
  // actual fix for the bug where a cup-match injury/suspension could
  // taint a player with a timer value far outside any real season, making
  // them permanently unavailable. competitionId is a real, distinct
  // identifier per cup so suspensions decrement against the correct
  // competition instead of a shared magic number.
  const competitionId = cupKey === "fa" ? "faCup" : "eflCup";
  const roundIndex = progress ? progress.rounds.length : 0;

  let result;
  let poolSize;
  if (preDrawn && preDrawn.roundIndex === roundIndex) {
    poolSize = preDrawn.pairs.length * 2 + (preDrawn.byeEntrant ? 1 : 0);
    const matches = resolveCupPairs(preDrawn.pairs, worldWeek, competitionId);
    const advancing = preDrawn.byeEntrant ? [...matches.map((m) => m.winnerEntrant), preDrawn.byeEntrant] : matches.map((m) => m.winnerEntrant);
    result = { matches, byeEntrant: preDrawn.byeEntrant, advancing };
  } else {
    const pool = computeEnglandCupRoundPool(cupKey, progress, englandTiers, eflCupQualifiers);
    poolSize = pool.length;
    result = playCupRound(pool, worldWeek, competitionId);
  }

  const roundGiantKillers = result.matches.filter((m) => m.isUpset).map((m) => ({ clubId: m.winnerEntrant.club.id, clubName: m.winnerEntrant.club.name }));
  const newRound = { label: englandCupStageLabel(cupKey, roundIndex, poolSize), ...result };
  const rounds = [...(progress?.rounds || []), newRound];
  const giantKillerBonuses = [...(progress?.giantKillerBonuses || []), ...roundGiantKillers];

  if (result.advancing.length === 1) {
    const finalMatch = newRound.matches[0];
    return {
      rounds, giantKillerBonuses, pool: result.advancing, done: true,
      champion: finalMatch.winnerEntrant, runnerUp: finalMatch.loserEntrant,
    };
  }
  return { rounds, giantKillerBonuses, pool: result.advancing, done: false, champion: null, runnerUp: null };
}

// Companion to isCupCheckpointPending: "what IS the next pending checkpoint
// week for this cup" rather than "is this specific candidate week it" —
// used by the world-week scanner to know how far it must advance to reach
// the next thing anywhere in the world that needs processing, cups
// included (previously only league fixtures were visible to that scan).
// Returns null if the cup is done or has no more scheduled rounds.
// Reads the CURRENT SEASON's already-resolved calendar off state
// (stateLike.usOpenCupCalendar) rather than a permanent module-level
// constant — this is what makes the cup work correctly across multiple
// seasons instead of only ever firing once, early in season 1.
export function nextUsOpenCupCheckpointWeek(stateLike) {
  if (stateLike.usOpenCup?.done) return null;
  if (!stateLike.usOpenCupCalendar) return null;
  const weeks = activeWeeksOf(stateLike.usOpenCupCalendar);
  const playedSoFar = stateLike.usOpenCup?.rounds?.length ?? 0;
  return playedSoFar < weeks.length ? weeks[playedSoFar] : null;
}

export function nextEnglandCupCheckpointWeek(stateLike, cupKey) {
  const stateField = cupKey === "fa" ? "faCup" : "eflCup";
  const calendarField = cupKey === "fa" ? "faCupCalendar" : "eflCupCalendar";
  if (stateLike[stateField]?.done) return null;
  if (!stateLike[calendarField]) return null;
  const weeks = activeWeeksOf(stateLike[calendarField]);
  const playedSoFar = stateLike[stateField]?.rounds?.length ?? 0;
  return playedSoFar < weeks.length ? weeks[playedSoFar] : null;
}

export function isCupCheckpointPending(stateLike, matchdayNum) {
  // Both countries' domestic cups now run as persistent world competitions
  // every season, regardless of which pyramid the user is actively playing
  // in (product decision — the non-user side's cup used to never progress
  // at all, confirmed as a bug). The UI recap popup, not this function,
  // is what stays scoped to the user's own side — see App.jsx.
  if (!stateLike.usOpenCupCalendar) return false;
  const idx = activeWeeksOf(stateLike.usOpenCupCalendar).indexOf(matchdayNum);
  if (idx === -1) return false;
  if (stateLike.usOpenCup?.done) return false;
  const playedSoFar = stateLike.usOpenCup?.rounds?.length ?? 0;
  return playedSoFar === idx;
}

export function cupRoundLabel(roundIndex) {
  if (roundIndex === 0) return "Round 1";
  if (roundIndex === 1) return "Round 2";
  return LATER_CUP_ROUND_LABELS[Math.min(roundIndex - 2, LATER_CUP_ROUND_LABELS.length - 1)];
}

export function computeCupRoundPool(progress, tiers, qualifiers) {
  const wrap = (club, tierIdx) => ({ club, tierIdx });
  const roundIndex = progress ? progress.rounds.length : 0;
  const findClubAnywhere = (id) => {
    for (let ti = 0; ti < tiers.length; ti++) {
      const c = tiers[ti].clubs.find((cl) => cl.id === id);
      if (c) return wrap(c, ti);
    }
    return null;
  };
  if (roundIndex === 0) {
    return tiers[3].clubs.map((c) => wrap(c, 3)); // all USL2
  } else if (roundIndex === 1) {
    const usl1Entrants = tiers[2].clubs.map((c) => wrap(c, 2));
    const uslcTop16Ids = qualifiers?.uslcTop16 ?? computeTable(tiers[1]).slice(0, 16).map((r) => r.clubId);
    const top16UslcEntrants = uslcTop16Ids.map(findClubAnywhere).filter(Boolean);
    return [...progress.pool, ...usl1Entrants, ...top16UslcEntrants];
  } else if (roundIndex === 2) {
    const mlsBottom16Ids = qualifiers?.mlsBottom16 ?? computeTable(tiers[0]).slice(-16).map((r) => r.clubId);
    const bottom16MlsEntrants = mlsBottom16Ids.map(findClubAnywhere).filter(Boolean);
    return [...progress.pool, ...bottom16MlsEntrants];
  }
  return progress.pool;
}

export function drawNextUsOpenCupRound(progress, tiers, qualifiers) {
  const pool = computeCupRoundPool(progress, tiers, qualifiers);
  const { pairs, byeEntrant } = drawCupPairs(pool);
  return { roundIndex: progress ? progress.rounds.length : 0, pairs, byeEntrant };
}

export function playNextUsOpenCupRound(progress, tiers, qualifiers, preDrawn, worldWeek) {
  // Real scheduled World Week now, not the old 9999 sentinel — see
  // playNextEnglandCupRound's comment for the full rationale.
  const competitionId = "usOpenCup";
  const roundIndex = progress ? progress.rounds.length : 0;

  let result;
  if (preDrawn && preDrawn.roundIndex === roundIndex) {
    const matches = resolveCupPairs(preDrawn.pairs, worldWeek, competitionId);
    const advancing = preDrawn.byeEntrant ? [...matches.map((m) => m.winnerEntrant), preDrawn.byeEntrant] : matches.map((m) => m.winnerEntrant);
    result = { matches, byeEntrant: preDrawn.byeEntrant, advancing };
  } else {
    const pool = computeCupRoundPool(progress, tiers, qualifiers);
    result = playCupRound(pool, worldWeek, competitionId);
  }

  const roundGiantKillers = result.matches.filter((m) => m.isUpset).map((m) => ({ clubId: m.winnerEntrant.club.id, clubName: m.winnerEntrant.club.name }));
  const newRound = { label: cupRoundLabel(roundIndex), ...result };
  const rounds = [...(progress?.rounds || []), newRound];
  const giantKillerBonuses = [...(progress?.giantKillerBonuses || []), ...roundGiantKillers];

  if (result.advancing.length === 1) {
    const finalMatch = newRound.matches[0];
    return {
      rounds, giantKillerBonuses, pool: result.advancing, done: true,
      champion: finalMatch.winnerEntrant, runnerUp: finalMatch.loserEntrant,
    };
  }
  return { rounds, giantKillerBonuses, pool: result.advancing, done: false, champion: null, runnerUp: null };
}

export function resolveCupRoundInPlace(next, worldWeek) {
  const preDrawn = next.usOpenCup?.pendingDraw;
  const progress = playNextUsOpenCupRound(next.usOpenCup, next.tiers, next.usOpenCupQualifiers, preDrawn, worldWeek);
  const allClubs = next.tiers.flatMap((t) => t.clubs);
  const payOut = (clubId, amount) => {
    const c = allClubs.find((cl) => cl.id === clubId);
    if (c) c.budget += amount;
  };
  const newRound = progress.rounds[progress.rounds.length - 1];
  newRound.matches.forEach((m) => { if (m.isUpset) payOut(m.winnerEntrant.club.id, US_OPEN_CUP_GIANT_KILLER_BONUS); });
  // A real giant-killing (skipping two or more tiers, not just one) is
  // genuinely newsworthy — an ordinary one-tier cup upset happens often
  // enough in a real cup competition that headlining every single one
  // would be noise rather than a real story.
  newRound.matches.forEach((m) => {
    if (m.isUpset && m.winnerEntrant.tierIdx - m.loserEntrant.tierIdx >= 2) {
      if (!next.newsFeed) next.newsFeed = [];
      next.newsFeed = [{ season: next.seasonNumber, headline: `🐉 Giant-killers! ${m.winnerEntrant.club.name} (${FULL_TIER_META[m.winnerEntrant.tierIdx].name}) knock out ${m.loserEntrant.club.name} (${FULL_TIER_META[m.loserEntrant.tierIdx].name}) in the US Open Cup.`, category: "cup" }, ...next.newsFeed].slice(0, 40);
    }
  });
  if (progress.done) {
    payOut(progress.champion.club.id, US_OPEN_CUP_CHAMPION_PRIZE);
    payOut(progress.runnerUp.club.id, US_OPEN_CUP_RUNNERUP_PRIZE);
  }
  next.usOpenCup = { ...progress, pendingDraw: null };
  return newRound;
}

export function resolveEnglandCupRoundInPlace(next, cupKey, worldWeek) {
  const stateKey = cupKey === "fa" ? "faCup" : "eflCup";
  const englandTiers = next.tiers.slice(4, 8);
  const preDrawn = next[stateKey]?.pendingDraw;
  // EFL Cup's Europe-proxy (top 5 Premier League finishers) is based on
  // the PREVIOUS season's final table, same as how real European
  // qualification works — not whatever's in progress this year. Season 1
  // has no previous season, so it falls back to current in-progress
  // standings just that one time, same pattern as the US Open Cup uses.
  const eflCupQualifiers = next.eflCupQualifiers ?? {
    // Season 1 has no real previous-season table to draw from — falling
    // back to the CURRENT in-progress table was meaningless (and actively
    // unfair) this early, since every club is still tied 0-0-0 and the
    // "top 5" just came out as whatever arbitrary order ties happened to
    // break in, silently excluding a real mid-table club from Round 2 of
    // the EFL Cup for the rest of the season. Reputation is a far more
    // meaningful stand-in for "presumed top 5" before a ball's been kicked.
    plTop5: [...englandTiers[0].clubs]
      .sort((a, b) => {
        // Reputation alone isn't enough here — most established Premier
        // League clubs share the exact same reputation ceiling, which
        // just replaces one arbitrary tie-break with another. Average
        // squad overall actually differentiates between them.
        if (b.reputation !== a.reputation) return b.reputation - a.reputation;
        const avgA = a.squad.reduce((s, p) => s + p.overall, 0) / a.squad.length;
        const avgB = b.squad.reduce((s, p) => s + p.overall, 0) / b.squad.length;
        return avgB - avgA;
      })
      .slice(0, 5)
      .map((c) => c.id),
  };
  const progress = playNextEnglandCupRound(cupKey, next[stateKey], englandTiers, preDrawn, eflCupQualifiers, worldWeek);
  const allClubs = next.tiers.flatMap((t) => t.clubs);
  const payOut = (clubId, amount) => {
    const c = allClubs.find((cl) => cl.id === clubId);
    if (c) c.budget += amount;
  };
  const stagePrizes = cupKey === "fa" ? FA_CUP_STAGE_PRIZES : EFL_CUP_STAGE_PRIZES;
  const championPrize = cupKey === "fa" ? FA_CUP_CHAMPION_PRIZE : EFL_CUP_CHAMPION_PRIZE;
  const runnerUpPrize = cupKey === "fa" ? FA_CUP_RUNNERUP_PRIZE : EFL_CUP_RUNNERUP_PRIZE;
  const newRound = progress.rounds[progress.rounds.length - 1];
  // Same "genuinely big upset only" threshold as the US Open Cup — skipping
  // two tiers or more, not just one.
  const cupLabel = cupKey === "fa" ? "FA Cup" : "EFL Cup";
  newRound.matches.forEach((m) => {
    if (m.isUpset && m.winnerEntrant.tierIdx - m.loserEntrant.tierIdx >= 2) {
      if (!next.newsFeed) next.newsFeed = [];
      next.newsFeed = [{ season: next.seasonNumber, headline: `🐉 Giant-killers! ${m.winnerEntrant.club.name} (${FULL_TIER_META[m.winnerEntrant.tierIdx].name}) knock out ${m.loserEntrant.club.name} (${FULL_TIER_META[m.loserEntrant.tierIdx].name}) in the ${cupLabel}.`, category: "cup" }, ...next.newsFeed].slice(0, 40);
    }
  });
  // Read the stage straight from the round's own label — the single
  // source of truth for what stage this is — rather than re-deriving it
  // independently from pool size, which double-counted the Round 3 entry
  // jump (Championship + Premier League joining makes the pool bigger,
  // not smaller, right when Round 3 happens).
  const stageKey = { "Round 1": 7, "Round 2": 6, "Round 3": 5, "Round 4": 4, "Quarterfinal": 3, "Semifinal": 2 }[newRound.label];

  if (progress.done) {
    payOut(progress.champion.club.id, championPrize);
    payOut(progress.runnerUp.club.id, runnerUpPrize);
  } else {
    const stagePrize = stagePrizes[stageKey] ?? stagePrizes[7];
    newRound.matches.forEach((m) => payOut(m.winnerEntrant.club.id, stagePrize));
    // Real FA Cup detail: Third Round losers still get a consolation
    // payout, to help sustain lower-league club finances.
    if (cupKey === "fa" && newRound.label === "Round 3") {
      newRound.matches.forEach((m) => payOut(m.loserEntrant.club.id, FA_CUP_ROUND3_LOSER_CONSOLATION));
    }
  }
  next[stateKey] = { ...progress, pendingDraw: null };
  return newRound;
}

export function pendingEnglandCupCheckpoint(stateLike, matchdayNum) {
  // See isCupCheckpointPending above — same product decision applies
  // symmetrically to the FA Cup / EFL Cup, and same reasoning for reading
  // the season's resolved calendar off state rather than a permanent
  // module-level constant.
  const faIdx = stateLike.faCupCalendar ? activeWeeksOf(stateLike.faCupCalendar).indexOf(matchdayNum) : -1;
  if (faIdx !== -1 && !stateLike.faCup?.done && (stateLike.faCup?.rounds?.length ?? 0) === faIdx) return "fa";
  const eflIdx = stateLike.eflCupCalendar ? activeWeeksOf(stateLike.eflCupCalendar).indexOf(matchdayNum) : -1;
  if (eflIdx !== -1 && !stateLike.eflCup?.done && (stateLike.eflCup?.rounds?.length ?? 0) === eflIdx) return "efl";
  return null;
}
