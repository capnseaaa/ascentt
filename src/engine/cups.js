import { shuffle } from "./playerGen";
import { EFL_CUP_CHAMPION_PRIZE, EFL_CUP_ROUND_MATCHDAYS, EFL_CUP_RUNNERUP_PRIZE, EFL_CUP_STAGE_PRIZES, ENGLAND_CUP_STAGE_NAMES, FA_CUP_CHAMPION_PRIZE, FA_CUP_ROUND3_LOSER_CONSOLATION, FA_CUP_ROUND_MATCHDAYS, FA_CUP_RUNNERUP_PRIZE, FA_CUP_STAGE_PRIZES, FULL_TIER_META, LATER_CUP_ROUND_LABELS, US_OPEN_CUP_CHAMPION_PRIZE, US_OPEN_CUP_GIANT_KILLER_BONUS, US_OPEN_CUP_ROUND_MATCHDAYS, US_OPEN_CUP_RUNNERUP_PRIZE } from "./constants";
import { computeTable } from "./matchSim";
import { resolveKnockoutMatch } from "./leagueSim";

export function drawCupPairs(entrants) {
  const roster = shuffle(entrants);
  let byeEntrant = null;
  if (roster.length % 2 === 1) byeEntrant = roster.pop();
  const pairs = [];
  for (let i = 0; i < roster.length; i += 2) pairs.push([roster[i], roster[i + 1]]);
  return { pairs, byeEntrant };
}

export function resolveCupPairs(pairs, matchday) {
  return pairs.map(([homeEntrant, awayEntrant]) => {
    const outcome = resolveKnockoutMatch(homeEntrant.club, awayEntrant.club, matchday);
    const winnerEntrant = outcome.winner.id === homeEntrant.club.id ? homeEntrant : awayEntrant;
    const loserEntrant = winnerEntrant === homeEntrant ? awayEntrant : homeEntrant;
    // Giant-killer: a club from a numerically higher tier index (a lower
    // league) beating one from a lower tier index (a higher league).
    const isUpset = winnerEntrant.tierIdx > loserEntrant.tierIdx;
    return { homeEntrant, awayEntrant, outcome, winnerEntrant, loserEntrant, isUpset };
  });
}

export function playCupRound(entrants, matchday) {
  const { pairs, byeEntrant } = drawCupPairs(entrants);
  const matches = resolveCupPairs(pairs, matchday);
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

export function playNextEnglandCupRound(cupKey, progress, englandTiers, preDrawn, eflCupQualifiers) {
  const matchday = 9998; // distinct sentinel from the US Open Cup's 9999, so both can coexist in a combined world
  const roundIndex = progress ? progress.rounds.length : 0;

  let result;
  let poolSize;
  if (preDrawn && preDrawn.roundIndex === roundIndex) {
    poolSize = preDrawn.pairs.length * 2 + (preDrawn.byeEntrant ? 1 : 0);
    const matches = resolveCupPairs(preDrawn.pairs, matchday);
    const advancing = preDrawn.byeEntrant ? [...matches.map((m) => m.winnerEntrant), preDrawn.byeEntrant] : matches.map((m) => m.winnerEntrant);
    result = { matches, byeEntrant: preDrawn.byeEntrant, advancing };
  } else {
    const pool = computeEnglandCupRoundPool(cupKey, progress, englandTiers, eflCupQualifiers);
    poolSize = pool.length;
    result = playCupRound(pool, matchday);
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

export function isCupCheckpointPending(stateLike, matchdayNum) {
  if (stateLike.userTierId >= 4) return false; // US Open Cup only exists for the USA pyramid
  const idx = US_OPEN_CUP_ROUND_MATCHDAYS.indexOf(matchdayNum);
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

export function playNextUsOpenCupRound(progress, tiers, qualifiers, preDrawn) {
  const matchday = 9999; // sentinel — distinguishes cup matches from any real league matchday for card/injury logic
  const roundIndex = progress ? progress.rounds.length : 0;

  let result;
  if (preDrawn && preDrawn.roundIndex === roundIndex) {
    const matches = resolveCupPairs(preDrawn.pairs, matchday);
    const advancing = preDrawn.byeEntrant ? [...matches.map((m) => m.winnerEntrant), preDrawn.byeEntrant] : matches.map((m) => m.winnerEntrant);
    result = { matches, byeEntrant: preDrawn.byeEntrant, advancing };
  } else {
    const pool = computeCupRoundPool(progress, tiers, qualifiers);
    result = playCupRound(pool, matchday);
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

export function resolveCupRoundInPlace(next) {
  const preDrawn = next.usOpenCup?.pendingDraw;
  const progress = playNextUsOpenCupRound(next.usOpenCup, next.tiers, next.usOpenCupQualifiers, preDrawn);
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

export function resolveEnglandCupRoundInPlace(next, cupKey) {
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
  const progress = playNextEnglandCupRound(cupKey, next[stateKey], englandTiers, preDrawn, eflCupQualifiers);
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
  if (stateLike.userTierId < 4) return null;
  const faIdx = FA_CUP_ROUND_MATCHDAYS.indexOf(matchdayNum);
  if (faIdx !== -1 && !stateLike.faCup?.done && (stateLike.faCup?.rounds?.length ?? 0) === faIdx) return "fa";
  const eflIdx = EFL_CUP_ROUND_MATCHDAYS.indexOf(matchdayNum);
  if (eflIdx !== -1 && !stateLike.eflCup?.done && (stateLike.eflCup?.rounds?.length ?? 0) === eflIdx) return "efl";
  return null;
}
