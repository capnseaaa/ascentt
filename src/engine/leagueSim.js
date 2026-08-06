import { choice, clamp, computeRealisticWage, computeReputation, growPlayer, growYouthProspect, makePlayer, randInt, retirementChance, uid } from "./playerGen";
import { DEFAULT_WORLD_RECORDS, DIFFICULTY_MODES, ENGLAND_AUTO_PROMOTE_BY_TIER, ENGLAND_TIER_META, MID_SEASON_WINDOW_MATCHDAY, MIN_PRIZE_POOL, MIN_SQUAD_SIZE, PARACHUTE_PAYMENT_SCHEDULE, PROMOTE_RELEGATE_COUNT, TIER_META, TIER_OVERALL_CEILING } from "./constants";
import { runDraft } from "./worldBuild";
import { computeTable, simulateMatch, squadStrength } from "./matchSim";
import { applyDisqualificationCheck, checkTransferRecord, computeEventBonuses, decayPrizePools, distributePrizeMoney, dpRevenueForClub, effectivePayroll, ownershipDepositFor, runTransferWindow, trimSquad } from "./finance";
import { MLS_EAST_CLUBS } from "../data/rosters";

export function generateDoubleRoundRobin(clubIds) {
  const firstLeg = generateRoundRobin(clubIds);
  const firstLegMatchdays = firstLeg.length ? Math.max(...firstLeg.map((f) => f.matchday)) : 0;
  const secondLeg = firstLeg.map((f) => ({
    ...f,
    id: uid(),
    matchday: f.matchday + firstLegMatchdays,
    homeClubId: f.awayClubId,
    awayClubId: f.homeClubId,
  }));
  return [...firstLeg, ...secondLeg];
}

export function generateRoundRobin(clubIds) {
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
    const pairs = left.map((h, i) => [h, right[i]]);
    rounds.push(pairs);
    rest = [rest[rest.length - 1], ...rest.slice(0, rest.length - 1)];
  }
  const fixtures = [];
  rounds.forEach((pairs, idx) => {
    const matchday = idx + 1;
    pairs.forEach(([home, away]) => {
      if (home === "BYE" || away === "BYE") return;
      fixtures.push({ id: uid(), matchday, homeClubId: home, awayClubId: away, homeScore: null, awayScore: null, played: false });
    });
  });
  return fixtures;
}

export function runPromotionPlayoffN(lowerTable, lowerTierClubs, matchday, autoCount) {
  if (lowerTable.length < autoCount + 4) {
    return { autoPromoted: lowerTable.slice(0, autoCount).map((r) => r.clubId), playoffPromoted: lowerTable[autoCount]?.clubId, bracket: null };
  }
  const clubById = (id) => lowerTierClubs.find((c) => c.id === id);
  const autoPromoted = lowerTable.slice(0, autoCount).map((r) => r.clubId);
  const s1 = clubById(lowerTable[autoCount].clubId), s2 = clubById(lowerTable[autoCount + 1].clubId);
  const s3 = clubById(lowerTable[autoCount + 2].clubId), s4 = clubById(lowerTable[autoCount + 3].clubId);
  const semi1 = resolveKnockoutMatch(s1, s4, matchday);
  const semi2 = resolveKnockoutMatch(s2, s3, matchday);
  const final = resolveKnockoutMatch(semi1.winner, semi2.winner, matchday);
  return { autoPromoted, playoffPromoted: final.winner.id, bracket: { semi1, semi2, final } };
}

export function drawPromotionPlayoffSeeds(table, tierClubs, autoCount) {
  if (table.length < autoCount + 4) return null;
  const clubById = (id) => tierClubs.find((c) => c.id === id);
  const autoPromoted = table.slice(0, autoCount).map((r) => r.clubId);
  return {
    autoPromoted,
    s1: clubById(table[autoCount].clubId),
    s2: clubById(table[autoCount + 1].clubId),
    s3: clubById(table[autoCount + 2].clubId),
    s4: clubById(table[autoCount + 3].clubId),
  };
}

export function computeUserPlayoffQualification(tier, userClubId) {
  const autoCount = ENGLAND_AUTO_PROMOTE_BY_TIER[tier.id];
  if (autoCount == null) return { qualifies: false };
  const table = computeTable(tier);
  const seeds = drawPromotionPlayoffSeeds(table, tier.clubs, autoCount);
  if (!seeds) return { qualifies: false };
  const inPlayoff = [seeds.s1, seeds.s2, seeds.s3, seeds.s4].some((c) => c.id === userClubId);
  return { qualifies: inPlayoff, autoCount, seeds, table };
}

export function rolloverEnglandSeason(tiers, parachutePayments, difficulty, prizePools, userClubId, precomputedPromotionPlayoffs) {
  const playoffMatchday = 9999;
  const tables = tiers.map(computeTable);
  const clubsById = {};
  tiers.forEach((t) => t.clubs.forEach((c) => (clubsById[c.id] = c)));
  const newTierClubIds = tiers.map((t) => t.clubs.map((c) => c.id));
  const events = [];

  for (let i = 0; i < tiers.length; i++) {
    const champion = clubsById[tables[i][0].clubId];
    events.push({ clubId: champion.id, clubName: champion.name, tier: tiers[i].id, type: "champion" });
  }

  const relegationCounts = [3, 3, 4]; // PL, Championship, League One bottoms
  const autoPromoteCounts = [2, 2, 3]; // Championship, League One, League Two tops

  const promotionPlayoffs = [];
  for (let i = 0; i < tiers.length - 1; i++) {
    const upperTable = tables[i];
    const lowerTable = tables[i + 1];
    const relegated = upperTable.slice(-relegationCounts[i]).map((r) => r.clubId);
    // Reuse the exact playoff the user already watched/simmed interactively
    // where one exists for this boundary, instead of re-simulating a fresh
    // (and potentially different) random result.
    const playoff = precomputedPromotionPlayoffs?.[tiers[i + 1].id]
      || runPromotionPlayoffN(lowerTable, tiers[i + 1].clubs, playoffMatchday, autoPromoteCounts[i]);
    const promoted = [...playoff.autoPromoted, playoff.playoffPromoted];
    newTierClubIds[i] = newTierClubIds[i].filter((id) => !relegated.includes(id)).concat(promoted);
    newTierClubIds[i + 1] = newTierClubIds[i + 1].filter((id) => !promoted.includes(id)).concat(relegated);
    relegated.forEach((id) => events.push({ clubId: id, clubName: clubsById[id].name, from: tiers[i].id, to: tiers[i + 1].id, type: "relegated" }));
    promoted.forEach((id) => events.push({ clubId: id, clubName: clubsById[id].name, from: tiers[i + 1].id, to: tiers[i].id, type: "promoted" }));
    if (playoff.bracket) promotionPlayoffs.push({ tierIdx: tiers[i + 1].id, bracket: playoff.bracket });
  }

  // Season-end financial reconciliation — prize money, ownership deposit,
  // and wage bill deduction. This was entirely missing before: England
  // clubs' budgets never actually changed at season end beyond parachute
  // payments and per-match win bonuses, so the "ownership deposit" shown
  // in the season summary was never really being added. Mirrors exactly
  // what MLS's own rolloverSeason already does, using tiers[i].id (the
  // real global tier id, 4-7) wherever a tier-indexed table is involved.
  const eventBonusesOn = DIFFICULTY_MODES[difficulty]?.eventBonuses;
  const prizeAmountsByTier = tables.map((table, i) =>
    eventBonusesOn ? computeEventBonuses(table, tiers[i].id) : distributePrizeMoney(table, prizePools?.[i] ?? MIN_PRIZE_POOL[tiers[i].id])
  );
  const newPrizePools = prizePools ? decayPrizePools(prizePools) : tiers.map((t) => MIN_PRIZE_POOL[t.id]);
  let userPrize = 0;
  prizeAmountsByTier.forEach((amounts) => { if (amounts[userClubId] != null) userPrize = amounts[userClubId]; });
  const positionById = {};
  tables.forEach((table) => table.forEach((row, idx) => { positionById[row.clubId] = idx + 1; }));
  const tierSizeById = {};
  tables.forEach((table, i) => table.forEach((row) => { tierSizeById[row.clubId] = tiers[i].clubs.length; }));
  let userPayroll = 0;

  const newTiers = tiers.map((t, i) => {
    const clubs = newTierClubIds[i].map((id) => {
      const club = clubsById[id];
      const isUser = id === userClubId;
      let squad = club.squad.map((p) => {
        const grown = growPlayer(p, t.id);
        // contractYearsLeft was never being decremented here at all — this
        // is England's own rollover, separate from MLS's, and this step
        // had simply never been ported over. Real players' contracts never
        // actually reached the renewal threshold as a result, so the Renew
        // button could never appear for anyone, ever.
        return { ...grown, contractYearsLeft: grown.contractYearsLeft - 1, fitness: 100, morale: 60, injuredUntilMatchday: null, suspendedUntilMatchday: null, lastYellowMatchday: null, seasonGoals: 0 };
      });
      const retiring = squad.filter((p) => Math.random() < retirementChance(p.age));
      const retiredIds = new Set(retiring.map((p) => p.id));
      squad = squad.filter((p) => !retiredIds.has(p.id));
      if (isUser) {
        squad = squad.filter((p) => p.contractYearsLeft > 0);
        if (club.designatedPlayerIds?.length) {
          const stillOnRoster = new Set(squad.map((p) => p.id));
          club.designatedPlayerIds = club.designatedPlayerIds.filter((id) => stillOnRoster.has(id));
        }
      } else {
        // AI renews its good players instead of always churning them —
        // same shape as MLS's own logic: best 1-2 players almost always
        // renewed, mid-tier squad players usually do, fringe players are
        // what actually turns over most seasons.
        const byRank = [...squad].sort((a, b) => b.overall - a.overall);
        const rankById = new Map(byRank.map((p, idx) => [p.id, idx]));
        squad = squad.map((p) => {
          if (p.contractYearsLeft > 0) return p;
          const rank = rankById.get(p.id);
          const renewChance = rank <= 1 ? 0.9 : rank <= 5 ? 0.7 : 0.4;
          if (Math.random() < renewChance) {
            return { ...p, contractYearsLeft: randInt(2, 4), wage: Math.round(p.wage * 1.05) };
          }
          return null;
        }).filter(Boolean);
      }
      while (squad.length < MIN_SQUAD_SIZE) {
        squad.push(makePlayer(choice(["GK", "DEF", "MID", "FWD"]), ENGLAND_TIER_META[i].baseRating + randInt(-8, 8), undefined, t.id));
      }
      // Same correction MLS's rollover does: a real player still on the
      // crude overall*50 placeholder wage from realPlayerToRuntime gets
      // set to a tier-realistic wage once, here — this was previously
      // never happening for England at all, since England has its own
      // rollover function that didn't include this step.
      squad = squad.map((p) => (
        !p.wageSet ? { ...p, wage: computeRealisticWage(p.overall, p.age, t.id, p.potential), wageSet: true } : p
      ));
      const payroll = DIFFICULTY_MODES[difficulty]?.wagesDeducted ? effectivePayroll(squad, club.designatedPlayerIds) : 0;
      if (id === userClubId) userPayroll = payroll;
      const prize = prizeAmountsByTier[i][id] ?? 0;
      const squadReputation = computeReputation(squad);
      const finishPosition = positionById[id];
      const finishTierSize = tierSizeById[id];
      let performanceNudge = 0;
      if (finishPosition != null && finishTierSize != null) {
        if (finishPosition === 1) performanceNudge = 2;
        else if (finishPosition <= 3) performanceNudge = 1;
        else if (finishPosition >= finishTierSize - 2) performanceNudge = -1;
      }
      const reputation = clamp(Math.round((club.reputation ?? squadReputation) * 0.75 + squadReputation * 0.25) + performanceNudge, 20, 95);
      // Academy prospects (club.youthPlayers) were never being aged or
      // developed here at all — same recurring gap as the contract-decrement
      // bug: MLS's rollover already runs every prospect through
      // growYouthProspect every season, England's own rollover simply never
      // included the step, so an England club's prospects sat completely
      // frozen at whatever age/stats they were generated with, forever.
      const youthPlayers = (club.youthPlayers || []).map((p) => growYouthProspect(p, club.academyStars || 0));
      return {
        ...club,
        squad,
        youthPlayers,
        reputation,
        budget: club.budget + prize + ownershipDepositFor(t.id, difficulty, club, t.clubs) - payroll,
      };
    });
    return { id: t.id, name: t.name, clubs, fixtures: generateDoubleRoundRobin(clubs.map((c) => c.id)) };
  });

  // Pay out this season's parachute installment to anyone already on a
  // schedule from an earlier relegation, then start fresh 3-year schedules
  // (paying the first installment immediately) for clubs relegated from
  // the Premier League this season.
  const allNewClubs = newTiers.flatMap((t) => t.clubs);
  const plTierId = tiers[0].id;
  const clubIsNowInPL = (id) => newTiers.find((t) => t.id === plTierId)?.clubs.some((c) => c.id === id) ?? false;
  const newSchedule = {};
  Object.entries(parachutePayments || {}).forEach(([clubId, remaining]) => {
    if (!remaining || remaining.length === 0) return;
    if (clubIsNowInPL(clubId)) return; // promoted straight back — no longer needs cushioning
    const club = allNewClubs.find((c) => c.id === clubId);
    if (club) club.budget += remaining[0];
    const rest = remaining.slice(1);
    if (rest.length > 0) newSchedule[clubId] = rest;
  });
  const plRelegatedIds = events.filter((e) => e.type === "relegated" && e.from === plTierId).map((e) => e.clubId);
  plRelegatedIds.forEach((clubId) => {
    const [firstPayment, ...restPayments] = PARACHUTE_PAYMENT_SCHEDULE;
    const club = allNewClubs.find((c) => c.id === clubId);
    if (club) club.budget += firstPayment;
    if (restPayments.length > 0) newSchedule[clubId] = restPayments;
  });

  return { tiers: newTiers, events, tables, parachutePayments: newSchedule, promotionPlayoffs, newPrizePools, userPrize, userPayroll };
}

export function ensureMlsConferences(mlsClubs) {
  mlsClubs.forEach((c) => {
    if (c.conference !== "East" && c.conference !== "West") {
      const eastCount = mlsClubs.filter((x) => x.conference === "East").length;
      const westCount = mlsClubs.filter((x) => x.conference === "West").length;
      c.conference = eastCount <= westCount ? "East" : "West";
    }
  });
}

export function initialMlsConference(clubName) {
  return MLS_EAST_CLUBS.has(clubName) ? "East" : null; // null = not an original club, needs balancing
}

export function resolveKnockoutMatch(home, away, matchday) {
  const fixture = { homeScore: null, awayScore: null, played: false };
  const result = simulateMatch(fixture, home, away, matchday);
  if (fixture.homeScore === fixture.awayScore) {
    const homeStrength = squadStrength(home, matchday);
    const awayStrength = squadStrength(away, matchday);
    const total = homeStrength + awayStrength;
    const homeWinChance = total > 0 ? homeStrength / total : 0.5;
    const homeWon = Math.random() < homeWinChance;
    return { winner: homeWon ? home : away, result, wentToPenalties: true };
  }
  return { winner: fixture.homeScore > fixture.awayScore ? home : away, result, wentToPenalties: false };
}

export function bestOfThreeSeries(higherSeed, lowerSeed, matchday) {
  let hWins = 0, lWins = 0;
  const games = [];
  for (let g = 0; g < 3 && hWins < 2 && lWins < 2; g++) {
    const homeIsHigher = g !== 1;
    const home = homeIsHigher ? higherSeed : lowerSeed;
    const away = homeIsHigher ? lowerSeed : higherSeed;
    const outcome = resolveKnockoutMatch(home, away, matchday);
    games.push(outcome);
    if (outcome.winner.id === higherSeed.id) hWins++; else lWins++;
  }
  return { winner: hWins > lWins ? higherSeed : lowerSeed, games, hWins, lWins };
}

export function runMlsPlayoffs(mlsTable, mlsClubs, matchday) {
  ensureMlsConferences(mlsClubs);
  const clubById = (id) => mlsClubs.find((c) => c.id === id);

  function runConference(conferenceName) {
    const rows = mlsTable.filter((r) => clubById(r.clubId)?.conference === conferenceName);
    if (rows.length < 9) return null;
    const seeds = rows.slice(0, 9).map((r) => clubById(r.clubId)).filter(Boolean);
    if (seeds.length < 9) return null;
    const [s1, s2, s3, s4, s5, s6, s7, s8, s9] = seeds;
    const wildcard = resolveKnockoutMatch(s8, s9, matchday);
    const r1a = bestOfThreeSeries(s1, wildcard.winner, matchday);
    const r1b = bestOfThreeSeries(s2, s7, matchday);
    const r1c = bestOfThreeSeries(s3, s6, matchday);
    const r1d = bestOfThreeSeries(s4, s5, matchday);
    const semiA = resolveKnockoutMatch(r1a.winner, r1d.winner, matchday);
    const semiB = resolveKnockoutMatch(r1b.winner, r1c.winner, matchday);
    const confFinal = resolveKnockoutMatch(semiA.winner, semiB.winner, matchday);
    return { champion: confFinal.winner, seeds, wildcard, r1a, r1b, r1c, r1d, semiA, semiB, confFinal };
  }

  const east = runConference("East");
  const west = runConference("West");
  if (!east || !west) return null;

  const eastRank = mlsTable.findIndex((r) => r.clubId === east.champion.id);
  const westRank = mlsTable.findIndex((r) => r.clubId === west.champion.id);
  const finalHome = eastRank <= westRank ? east.champion : west.champion;
  const finalAway = finalHome.id === east.champion.id ? west.champion : east.champion;
  const finalResult = resolveKnockoutMatch(finalHome, finalAway, matchday);

  const qualifiers = new Set([...east.seeds, ...west.seeds].map((c) => c.id));
  const finalists = new Set([east.champion.id, west.champion.id]);
  const otherQualifiers = [...qualifiers].filter((id) => !finalists.has(id));

  return {
    east, west,
    champion: finalResult.winner,
    runnerUp: finalResult.winner.id === east.champion.id ? west.champion : east.champion,
    finalResult,
    otherQualifiers,
  };
}

export function runPromotionPlayoff(lowerTable, lowerTierClubs, matchday) {
  if (lowerTable.length < 6) return { autoPromoted: lowerTable.slice(0, 2).map((r) => r.clubId), playoffPromoted: lowerTable[2]?.clubId, bracket: null };
  const clubById = (id) => lowerTierClubs.find((c) => c.id === id);
  const autoPromoted = lowerTable.slice(0, 2).map((r) => r.clubId);
  const s3 = clubById(lowerTable[2].clubId), s4 = clubById(lowerTable[3].clubId);
  const s5 = clubById(lowerTable[4].clubId), s6 = clubById(lowerTable[5].clubId);
  const semi1 = resolveKnockoutMatch(s3, s6, matchday);
  const semi2 = resolveKnockoutMatch(s4, s5, matchday);
  const final = resolveKnockoutMatch(semi1.winner, semi2.winner, matchday);
  return { autoPromoted, playoffPromoted: final.winner.id, bracket: { semi1, semi2, final } };
}

export function runFlatPlayoffBracket(table, clubs, matchday, size) {
  if (table.length < size) return null;
  const clubById = (id) => clubs.find((c) => c.id === id);
  const seeds = table.slice(0, size).map((r) => clubById(r.clubId));
  const pairIndices = [];
  for (let i = 0; i < size / 2; i++) pairIndices.push([i, size - 1 - i]);
  let currentRound = pairIndices.map(([a, b]) => [seeds[a], seeds[b]]);
  const rounds = [];
  let finalMatchup = null;
  let champion = null;
  while (currentRound.length > 0) {
    const results = currentRound.map(([home, away]) => resolveKnockoutMatch(home, away, matchday));
    rounds.push(results);
    if (results.length === 1) {
      finalMatchup = currentRound[0];
      champion = results[0].winner;
      break;
    }
    const winners = results.map((r) => r.winner);
    const nextPairs = [];
    for (let i = 0; i < winners.length; i += 2) nextPairs.push([winners[i], winners[i + 1]]);
    currentRound = nextPairs;
  }
  const runnerUp = finalMatchup[0].id === champion.id ? finalMatchup[1] : finalMatchup[0];
  return { champion, runnerUp, rounds, qualifiers: seeds.map((c) => c.id) };
}

export function computeSeasonPlayoffs(tiers, userClubId, difficulty) {
  const tables = tiers.map(computeTable);
  const playoffMatchday = 9999; // sentinel — playoffs happen after the season, past any lingering injury/suspension cutoffs
  const promotionPlayoffs = [];
  const movementByBoundary = [];

  for (let i = 0; i < tiers.length - 1; i++) {
    const upperTable = tables[i];
    const lowerTable = tables[i + 1];
    const relegated = upperTable.slice(-PROMOTE_RELEGATE_COUNT).map((r) => r.clubId);
    let promoted;
    if (i === 0) {
      // MLS <-> USL Championship: no real-world promotion into MLS, so this
      // boundary stays simple table-based movement, same as always.
      promoted = lowerTable.slice(0, PROMOTE_RELEGATE_COUNT).map((r) => r.clubId);
    } else {
      // Top 2 promote automatically; the last spot is decided by a 4-team
      // playoff among 3rd-6th place, like most real pro/rel leagues do it.
      const playoff = runPromotionPlayoff(lowerTable, tiers[i + 1].clubs, playoffMatchday);
      promoted = [...playoff.autoPromoted, playoff.playoffPromoted];
      promotionPlayoffs.push({ tierIdx: i + 1, ...playoff });
    }
    movementByBoundary.push({ upperTierIdx: i, promoted, relegated });
  }

  // MLS Cup Playoffs & USL Championship playoff always happen — the sporting
  // outcome (who wins the Cup) isn't an economic feature, so it shouldn't be
  // tied to difficulty mode. Only the real-dollar bonuses tied to results
  // are Pro/Executive-exclusive (handled separately, in rolloverSeason).
  const mlsPlayoffResult = runMlsPlayoffs(tables[0], tiers[0].clubs, playoffMatchday);
  // USL Championship runs its own real playoff too — top 8, single
  // elimination, no conferences. Crowns the USL Cup separately from the
  // Players' Shield (the regular-season table topper).
  const uslcPlayoffResult = runFlatPlayoffBracket(tables[1], tiers[1].clubs, playoffMatchday, 8);

  return { tables, movementByBoundary, promotionPlayoffs, mlsPlayoffResult, uslcPlayoffResult };
}

export function computeSeasonAwards(tier) {
  const allPlayers = tier.clubs.flatMap((c) => c.squad.map((p) => ({ ...p, clubName: c.name })));
  if (!allPlayers.length) return null;
  const scorers = allPlayers.filter((p) => (p.seasonGoals || 0) > 0);
  const topScorer = scorers.length ? [...scorers].sort((a, b) => b.seasonGoals - a.seasonGoals)[0] : null;

  const byPos = { GK: [], DEF: [], MID: [], FWD: [] };
  allPlayers.forEach((p) => { (byPos[p.position] || byPos.MID).push(p); });
  const top = (arr, n) => [...arr].sort((a, b) => b.overall - a.overall).slice(0, n);
  const teamOfSeason = { GK: top(byPos.GK, 1), DEF: top(byPos.DEF, 4), MID: top(byPos.MID, 4), FWD: top(byPos.FWD, 2) };

  const youngPlayers = allPlayers.filter((p) => p.age <= 21);
  const bestYoungPlayer = youngPlayers.length ? [...youngPlayers].sort((a, b) => b.overall - a.overall)[0] : null;

  return { topScorer, teamOfSeason, bestYoungPlayer };
}

export function rolloverSeason(tiers, userClubId, prizePools, difficulty, precomputedPlayoffs) {
  const { tables, movementByBoundary, promotionPlayoffs, mlsPlayoffResult, uslcPlayoffResult } =
    precomputedPlayoffs || computeSeasonPlayoffs(tiers, userClubId, difficulty);
  const userTierIdxForAwards = tiers.findIndex((t) => t.clubs.some((c) => c.id === userClubId));
  const seasonAwards = userTierIdxForAwards !== -1 ? computeSeasonAwards(tiers[userTierIdxForAwards]) : null;
  const newTierClubIds = tiers.map((t) => t.clubs.map((c) => c.id));
  const clubsById = {};
  tiers.forEach((t) => t.clubs.forEach((c) => (clubsById[c.id] = c)));

  const events = []; // {clubName, from, to, type: 'promoted'|'relegated'|'champion'}

  for (let i = 0; i < tiers.length; i++) {
    const champion = clubsById[tables[i][0].clubId];
    events.push({ clubId: champion.id, clubName: champion.name, tier: i, type: "champion" });
  }

  movementByBoundary.forEach(({ upperTierIdx: i, promoted, relegated }) => {
    newTierClubIds[i] = newTierClubIds[i].filter((id) => !relegated.includes(id)).concat(promoted);
    newTierClubIds[i + 1] = newTierClubIds[i + 1].filter((id) => !promoted.includes(id)).concat(relegated);

    relegated.forEach((id) => events.push({ clubId: id, clubName: clubsById[id].name, from: i, to: i + 1, type: "relegated" }));
    promoted.forEach((id) => events.push({ clubId: id, clubName: clubsById[id].name, from: i + 1, to: i, type: "promoted" }));
  });

  // A player's wage should only ever move when their contract actually
  // renews (an explicit action, whether the user's own renewal or the
  // AI's auto-renewal logic below) — never automatically just because
  // their club got promoted or relegated. The only thing rebased here is
  // a brand-new player's still-crude placeholder wage, corrected once to
  // something tier-realistic the first time they pass through a rollover.

  // Prize money: on Rookie, distributed by final standing from a per-tier
  // pool that shrinks a little every season (simple, no real-world figures
  // needed). On Pro/Executive, real-world-calibrated season bonuses apply
  // instead — Shield-style money for now; once playoffs exist, MLS Cup /
  // conference / playoff-qualifier bonuses layer in on top of this.
  const eventBonusesOn = DIFFICULTY_MODES[difficulty]?.eventBonuses;
  const prizeAmountsByTier = tables.map((table, i) =>
    eventBonusesOn ? computeEventBonuses(table, i) : distributePrizeMoney(table, prizePools[i])
  );
  const newPrizePools = decayPrizePools(prizePools);
  let userPrize = 0;
  prizeAmountsByTier.forEach((amounts) => { if (amounts[userClubId] != null) userPrize = amounts[userClubId]; });

  // Contracts: age and grow/decline every player, decrement contracts, refresh
  // fitness/injuries/suspensions. Also checks retirement (34+, climbing odds,
  // forced by 41). AI clubs auto-replace expired/retired contracts to keep
  // the world populated. The user's own club does NOT get auto-replaced —
  // a contract that reaches 0, or a player who retires, leaves as-is and the
  // slot stays open, so renewing ahead of time is a real decision.
  // Reputation was previously frozen at world-creation — a club's board
  // expectations never budged no matter how the club actually performed or
  // how its squad evolved. Track each club's finishing position this season
  // so reputation can drift with results, not just sit fixed forever.
  const positionById = {};
  const tierSizeById = {};
  tables.forEach((table) => {
    table.forEach((row, idx) => {
      positionById[row.clubId] = idx + 1;
      tierSizeById[row.clubId] = table.length;
    });
  });

  let userRetirements = [];
  let userDisqualificationNotice = null;
  let userDpRevenue = 0;
  const newTiers = tiers.map((t, i) => {
    const clubs = newTierClubIds[i].map((id) => {
      const club = clubsById[id];
      const baseRating = TIER_META[i].baseRating;
      const isUser = id === userClubId;
      let squad = club.squad.map((p) => {
        const grown = growPlayer(p, t.id);
        return {
          ...grown,
          contractYearsLeft: grown.contractYearsLeft - 1,
          fitness: Math.min(100, grown.fitness + 40),
          morale: Math.round(grown.morale + (55 - grown.morale) * 0.4),
          injuredUntilMatchday: null,
          suspendedUntilMatchday: null,
          lastYellowMatchday: null,
          seasonGoals: 0,
          seasonYellowCards: 0,
        };
      });
      const retiring = squad.filter((p) => Math.random() < retirementChance(p.age));
      if (isUser && retiring.length) userRetirements = userRetirements.concat(retiring.map((p) => p.name));
      const retiredIds = new Set(retiring.map((p) => p.id));
      squad = squad.filter((p) => !retiredIds.has(p.id));
      if (isUser) {
        squad = squad.filter((p) => p.contractYearsLeft > 0);
        // A retired or expired-contract player who was a Designated Player
        // needs that slot actually freed up — otherwise it stays occupied
        // forever by someone no longer even on the roster.
        if (club.designatedPlayerIds?.length) {
          const stillOnRoster = new Set(squad.map((p) => p.id));
          club.designatedPlayerIds = club.designatedPlayerIds.filter((id) => stillOnRoster.has(id));
        }
      } else {
        // AI renews its good players instead of always churning them for a
        // random replacement — a club's best 1-2 players almost always get
        // renewed, mid-tier squad players usually do, fringe players are the
        // ones who actually turn over most seasons.
        const byRank = [...squad].sort((a, b) => b.overall - a.overall);
        const rankById = new Map(byRank.map((p, i) => [p.id, i]));
        squad = squad.map((p) => {
          if (p.contractYearsLeft > 0) return p;
          const rank = rankById.get(p.id);
          const renewChance = rank <= 1 ? 0.9 : rank <= 5 ? 0.7 : 0.4;
          if (Math.random() < renewChance) {
            return { ...p, contractYearsLeft: randInt(2, 4), wage: Math.round(p.wage * 1.05) };
          }
          // MLS occasionally lands a marquee free-agent signing instead of
          // just generating another academy-tier prospect — without this,
          // the pool of genuinely elite (85+) players only ever shrinks as
          // real stars age out, since replacements otherwise cluster near
          // the tier's base rating.
          if (i === 0 && Math.random() < 0.06) {
            return makePlayer(p.position, Math.min(baseRating + randInt(18, 30), TIER_OVERALL_CEILING[0]), undefined, t.id);
          }
          return makePlayer(p.position, baseRating + randInt(-8, 8), undefined, t.id);
        });
        // top back up to a full squad if retirements left an AI club short
        while (squad.length < MIN_SQUAD_SIZE) {
          squad.push(makePlayer(choice(["GK", "DEF", "MID", "FWD"]), baseRating + randInt(-8, 8), undefined, t.id));
        }
      }
      const prize = prizeAmountsByTier[i][id] ?? 0;
      const youthPlayers = (club.youthPlayers || []).map((p) => growYouthProspect(p, club.academyStars || 0));
      // A fresh draft pick, academy promotion, or new signing still on a
      // crude placeholder wage gets corrected to something tier-realistic
      // once, here. Anyone who already has a real wage keeps it exactly as
      // is — even through a promotion or relegation — until their
      // contract actually comes up for renewal.
      squad = squad.map((p) => (
        !p.wageSet ? { ...p, wage: computeRealisticWage(p.overall, p.age, i, p.potential), wageSet: true } : p
      ));
      const payroll = DIFFICULTY_MODES[difficulty]?.wagesDeducted ? effectivePayroll(squad, club.designatedPlayerIds) : 0;

      // Reputation drifts each season: mostly it tracks the squad's evolving
      // quality (transfers in/out, aging, academy graduates), but a strong
      // or weak finish nudges it a bit further in that direction too — a
      // club overachieving its target builds prestige beyond just its
      // player ratings, same as an underachieving one loses some. Blended
      // rather than replaced outright so a single freak season can't swing
      // it wildly; a club's history still has weight.
      const squadReputation = computeReputation(squad);
      const finishPosition = positionById[id];
      const finishTierSize = tierSizeById[id];
      let performanceNudge = 0;
      if (finishPosition != null && finishTierSize != null) {
        if (finishPosition === 1) performanceNudge = 2;
        else if (finishPosition <= 3) performanceNudge = 1;
        else if (finishPosition >= finishTierSize - 2) performanceNudge = -1;
      }
      const reputation = clamp(Math.round(club.reputation * 0.75 + squadReputation * 0.25) + performanceNudge, 20, 95);
      // Designated Players sell tickets and jerseys — a flat per-season
      // revenue bump scaled to their quality, same difficulty gate as the
      // rest of the wage/prize economics.
      const dpRevenue = DIFFICULTY_MODES[difficulty]?.wagesDeducted ? dpRevenueForClub(club) : 0;
      if (id === userClubId) userDpRevenue = dpRevenue;

      const rolledClub = {
        ...club,
        squad,
        reputation,
        budget: club.budget + prize + ownershipDepositFor(i, difficulty, club, t.clubs) + dpRevenue - payroll,
        academyEligible: !!club.academyEligible || i <= 1,
        youthPlayers,
        tryoutCandidates: [], // last window's tryout candidates don't carry over — sign or lose them
      };
      const { club: checkedClub, notice } = applyDisqualificationCheck(rolledClub, i);
      if (notice && id === userClubId) userDisqualificationNotice = notice;
      return checkedClub;
    });
    return { id: t.id, name: t.name, clubs, fixtures: generateRoundRobin(clubs.map((c) => c.id)) };
  });

  const windowResult = runTransferWindow(newTiers, userClubId);
  const userDraftPicks = runDraft(tables, newTiers, userClubId);

  // MLS Cup Playoffs payouts: champion/runner-up also banked their conference
  // championship bonus on the way there; every other team that made the
  // 18-team bracket gets a smaller qualifier bonus. Winners get paid
  // regardless of difficulty mode — this money is separate from the
  // per-win/wage economics that Pro/Executive add.
  let userMlsPlayoff = null;
  if (mlsPlayoffResult) {
    const mlsClubsAfter = newTiers[0].clubs;
    const payOut = (clubId, amount) => {
      const c = mlsClubsAfter.find((cl) => cl.id === clubId);
      if (c) c.budget += amount;
    };
    payOut(mlsPlayoffResult.champion.id, 300_000 + 35_000);
    payOut(mlsPlayoffResult.runnerUp.id, 100_000 + 35_000);
    mlsPlayoffResult.otherQualifiers.forEach((id) => payOut(id, 20_000));

    if (userClubId === mlsPlayoffResult.champion.id) userMlsPlayoff = { result: "champion", amount: 335_000 };
    else if (userClubId === mlsPlayoffResult.runnerUp.id) userMlsPlayoff = { result: "runner-up", amount: 135_000 };
    else if (mlsPlayoffResult.otherQualifiers.includes(userClubId)) userMlsPlayoff = { result: "qualifier", amount: 20_000 };
  }

  // USL Championship's own playoff (real, separate from the promotion
  // playoff below it): champion/runner-up money, small consolation for the
  // rest of the bracket. Paid out regardless of difficulty, same as MLS.
  let userUslcPlayoff = null;
  if (uslcPlayoffResult) {
    const uslcClubsAfter = newTiers[1].clubs;
    const payOutUslc = (clubId, amount) => {
      const c = uslcClubsAfter.find((cl) => cl.id === clubId);
      if (c) c.budget += amount;
    };
    const otherUslcQualifiers = uslcPlayoffResult.qualifiers.filter(
      (id) => id !== uslcPlayoffResult.champion.id && id !== uslcPlayoffResult.runnerUp.id
    );
    payOutUslc(uslcPlayoffResult.champion.id, 40_000);
    payOutUslc(uslcPlayoffResult.runnerUp.id, 15_000);
    otherUslcQualifiers.forEach((id) => payOutUslc(id, 5_000));

    if (userClubId === uslcPlayoffResult.champion.id) userUslcPlayoff = { result: "champion", amount: 40_000 };
    else if (userClubId === uslcPlayoffResult.runnerUp.id) userUslcPlayoff = { result: "runner-up", amount: 15_000 };
    else if (otherUslcQualifiers.includes(userClubId)) userUslcPlayoff = { result: "qualifier", amount: 5_000 };
  }

  const userClubAfter = newTiers.flatMap((t) => t.clubs).find((c) => c.id === userClubId);
  const userPayroll = DIFFICULTY_MODES[difficulty]?.wagesDeducted && userClubAfter ? effectivePayroll(userClubAfter.squad, userClubAfter.designatedPlayerIds) : 0;
  // Draft additions are the one pure-growth step with no natural release —
  // cap every club (except the user's, whose picks aren't applied until
  // they choose Keep) so the world can't balloon season over season.
  newTiers.forEach((t) => {
    t.clubs.forEach((c) => {
      if (c.id !== userClubId) c.squad = trimSquad(c.squad);
    });
  });

  const userOriginalTierIdx = tiers.findIndex((t) => t.clubs.some((c) => c.id === userClubId));
  const userPromotionPlayoff = promotionPlayoffs.find((pp) => pp.tierIdx === userOriginalTierIdx);

  return {
    newTiers, events, tables, windowResult, newPrizePools, userPrize, userRetirements, userDraftPicks, userPayroll,
    mlsPlayoffResult, userMlsPlayoff, uslcPlayoffResult, userUslcPlayoff, promotionPlayoffs, userPromotionPlayoff,
    userDisqualificationNotice, userDpRevenue, seasonAwards,
  };
}

export function getCurrentMatchday(next) {
  const tier = next.tiers[next.userTierId];
  const remaining = tier.fixtures.filter((f) => !f.played);
  return remaining.length ? remaining[0].matchday : null;
}

export function maybeTriggerMidWindow(next, justPlayedMatchday) {
  if (justPlayedMatchday !== MID_SEASON_WINDOW_MATCHDAY - 1) return null;
  if (next.midWindowSeason === next.seasonNumber) return null;
  const result = runTransferWindow(next.tiers, next.userClubId);
  next.midWindowSeason = next.seasonNumber;
  // Mid-window AI-to-AI moves used to happen invisibly — mechanically real
  // (players did change hands), but nothing ever told the user about it,
  // so the world felt just as static as before during the season itself.
  // Same treatment as end-of-season AI transfers: news headline + checked
  // against the biggest-transfer record.
  if (result.transferLog?.length) {
    if (!next.worldRecords) next.worldRecords = { ...DEFAULT_WORLD_RECORDS };
    if (!next.newsFeed) next.newsFeed = [];
    result.transferLog.forEach((t) => {
      next.newsFeed = [{ season: next.seasonNumber, headline: `🔁 ${t.buyerName} sign ${t.playerName} (${t.position}, ${t.overall} OVR) from ${t.sellerName} for $${t.fee.toLocaleString()}.`, category: "transfer" }, ...next.newsFeed].slice(0, 40);
      checkTransferRecord(next, t.playerName, t.fee, t.sellerName, t.buyerName, next.seasonNumber);
    });
    next.worldTransferLog = [...(next.worldTransferLog || []), ...result.transferLog.map((t) => ({ ...t, season: next.seasonNumber }))].slice(-150);
  }
  return result;
}
