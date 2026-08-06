import { choice, clamp, randInt } from "./playerGen";
import { ATTACK_MOD, BASE_GOAL_RATE, DEFAULT_WORLD_RECORDS, DEFENSE_MOD, DIFFICULTY_MODES, DP_XI_AURA_CAP, DP_XI_AURA_PER_PLAYER, FITNESS_DRAIN_MAX, FITNESS_DRAIN_MIN, FORMATION_SLOTS, FULL_TIER_META, HOME_ADVANTAGE, INJURY_BASE_RATE, MAX_SQUAD_SIZE, MORALE_DELTA, PRESS_MOD, RED_CARD_CHANCE, RIVALRY_PAIRS, RIVALRY_REPUTATION_BUMP, RIVALRY_REVENUE_BONUS, SCORER_WEIGHTS, UNHAPPY_BENCH_STREAK_THRESHOLD, UNHAPPY_MORALE_THRESHOLD, WIN_BONUS, YELLOW_CARD_BASE_RATE } from "./constants";
import { applyDisqualificationCheck, marketValue } from "./finance";

export function samplePoisson(lambda) {
  if (lambda <= 0) return 0;
  const L = Math.exp(-lambda);
  let k = 0, p = 1.0;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

export function effectiveRating(p) {
  const fitnessFactor = 0.7 + 0.3 * (p.fitness / 100);
  const moraleFactor = 0.85 + 0.15 * (p.morale / 100);
  return p.overall * fitnessFactor * moraleFactor;
}

export function isAvailable(p, matchday) {
  const notInjured = p.injuredUntilMatchday == null || p.injuredUntilMatchday < matchday;
  const notSuspended = p.suspendedUntilMatchday == null || p.suspendedUntilMatchday < matchday;
  return notInjured && notSuspended;
}

export function unavailableReason(p, matchday) {
  if (p.injuredUntilMatchday != null && p.injuredUntilMatchday >= matchday) return "injured";
  if (p.suspendedUntilMatchday != null && p.suspendedUntilMatchday >= matchday) return "suspended";
  return null;
}

export function lineupScore(mode, p) {
  if (mode === "youth") return -p.age * 1000 + effectiveRating(p);
  if (mode === "auto") return effectiveRating(p) + p.fitness * 0.15;
  if (mode === "best") return p.overall - (p.fitness < 40 ? (40 - p.fitness) * 0.5 : 0);
  return effectiveRating(p);
}

export function startingXI(club, matchday) {
  const mode = club.tactics.lineupMode || "best";
  const isCupMatch = matchday === 9999;
  const restThreshold = club.tactics.restThreshold ?? 0;
  const hardAvailable = club.squad.filter((p) => isAvailable(p, matchday));
  // Rest preferences apply regardless of lineup mode — Best/Youth/Auto all
  // respect them the same way, they just change who's eligible to be
  // picked FROM, not how picking within that pool works.
  let available = hardAvailable.filter((p) => {
    if (isCupMatch && p.holdBackForCup) return false;
    if (p.restRequested || p.restIndefinitely) return false;
    if (p.fitness < restThreshold) return false;
    return true;
  });

  const slots = FORMATION_SLOTS[club.tactics.formation] || FORMATION_SLOTS["4-4-2"];
  const byPos = { GK: [], DEF: [], MID: [], FWD: [] };
  available.forEach((p) => { (byPos[p.position] || byPos.MID).push(p); });
  // Custom mode: the manager's own picks come first within each position
  // bucket (highest priority), everyone else still sorted by score behind
  // them — so a custom XI stays exactly what was chosen whenever those
  // players are actually available, and reuses all the same gap-filling
  // logic below (same-position reserves, then hardAvailable as a last
  // resort) the moment a chosen player is injured, suspended, or rested.
  const customSet = mode === "custom" && club.tactics.customXI ? new Set(club.tactics.customXI) : null;
  Object.keys(byPos).forEach((pos) => byPos[pos].sort((a, b) => {
    if (customSet) {
      const aIn = customSet.has(a.id), bIn = customSet.has(b.id);
      if (aIn !== bIn) return aIn ? -1 : 1;
    }
    return lineupScore(mode, b) - lineupScore(mode, a);
  }));

  const chosen = [];
  const chosenIds = new Set();
  Object.entries(slots).forEach(([pos, count]) => {
    (byPos[pos] || []).slice(0, count).forEach((p) => { chosen.push(p); chosenIds.add(p.id); });
  });
  // If a specific position came up short (usually because the rest
  // threshold preference benched someone there), first look for another
  // player who plays that same position and is actually eligible to play
  // — just resting below the preferred threshold, not injured/suspended/
  // held back — before falling back to filling the gap with a different
  // position entirely. A tired-but-fit attacker should fill an attacking
  // gap before a fresh midfielder does. Deliberately does NOT use a
  // blanket "if too few players remain, ignore every rest preference"
  // safety valve here — that used to silently undo ALL of a user's rest
  // choices at once (even for unrelated positions) the moment resting
  // several players pushed the total pool below 11, which is exactly why
  // a deliberately-rested-around player still wouldn't get picked. Instead
  // each shortfall is filled individually, only reaching past a rest
  // preference for the specific slot that's actually short.
  Object.entries(slots).forEach(([pos, count]) => {
    const filledInPos = chosen.filter((p) => p.position === pos).length;
    if (filledInPos >= count) return;
    const samePositionReserves = hardAvailable
      .filter((p) => p.position === pos && !chosenIds.has(p.id))
      .sort((a, b) => lineupScore(mode, b) - lineupScore(mode, a));
    for (const p of samePositionReserves) {
      if (chosen.filter((c) => c.position === pos).length >= count) break;
      chosen.push(p);
      chosenIds.add(p.id);
    }
  });
  const totalSlots = Object.values(slots).reduce((a, b) => a + b, 0);
  if (chosen.length < totalSlots) {
    // Last resort — draw from hardAvailable (still respects injury/
    // suspension/hold-back-for-cup, just not the soft rest preferences),
    // so a real XI is always fielded without wiping out every rest choice
    // to do it.
    const remaining = hardAvailable.filter((p) => !chosenIds.has(p.id) && p.position !== "GK").sort((a, b) => lineupScore(mode, b) - lineupScore(mode, a));
    for (const p of remaining) {
      if (chosen.length >= totalSlots) break;
      chosen.push(p);
      chosenIds.add(p.id);
    }
  }
  return chosen;
}

export function clubLineRatings(club) {
  const byPos = { GK: [], DEF: [], MID: [], FWD: [] };
  club.squad.forEach((p) => { (byPos[p.position] || byPos.MID).push(p.overall); });
  const topAvg = (arr, n) => {
    if (!arr.length) return 0;
    const sorted = [...arr].sort((a, b) => b - a).slice(0, n);
    return sorted.reduce((s, v) => s + v, 0) / sorted.length;
  };
  const toStars = (avg) => clamp(Math.round(((avg - 45) / 10) * 2) / 2, 0.5, 5);
  return {
    def: toStars(topAvg(byPos.DEF, 4)),
    mid: toStars(topAvg(byPos.MID, 4)),
    att: toStars(topAvg(byPos.FWD, 3)),
  };
}

export function xiLineRatings(xi) {
  const byPos = { DEF: [], MID: [], FWD: [] };
  xi.forEach((p) => { if (byPos[p.position]) byPos[p.position].push(p.overall); });
  const avg = (arr) => (arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0);
  const toStars = (a) => (a === 0 ? 0 : clamp(Math.round(((a - 45) / 10) * 2) / 2, 0.5, 5));
  return {
    def: toStars(avg(byPos.DEF)),
    mid: toStars(avg(byPos.MID)),
    att: toStars(avg(byPos.FWD)),
  };
}

export function captainChemistryFactor(club, xi) {
  if (xi.length === 0) return 1.0;
  let captain = xi.find((p) => p.id === club.captainId);
  if (!captain) {
    // The designated captain isn't in today's XI (injured, suspended,
    // rotated out) — real teams don't just play without a captain, the
    // armband passes to whoever's actually out there with the highest
    // leadership instead of the bonus going unused.
    captain = [...xi].sort((a, b) => b.leadership - a.leadership)[0];
  }
  return clamp(1 + (captain.leadership - 50) / 1000, 0.95, 1.05);
}

export function dpAuraFactor(club, xi) {
  const dpSet = new Set(club.designatedPlayerIds || []);
  if (dpSet.size === 0) return 1.0;
  const dpInXi = xi.filter((p) => dpSet.has(p.id)).length;
  return 1 + Math.min(dpInXi * DP_XI_AURA_PER_PLAYER, DP_XI_AURA_CAP);
}

export function squadStrength(club, matchday) {
  const xi = startingXI(club, matchday);
  if (xi.length === 0) return 0;
  const avg = xi.reduce((s, p) => s + effectiveRating(p), 0) / xi.length;
  return avg * captainChemistryFactor(club, xi) * dpAuraFactor(club, xi);
}

export function attackStrength(club, matchday) {
  return squadStrength(club, matchday) * ATTACK_MOD[club.tactics.style] * PRESS_MOD[club.tactics.press];
}

export function defenseStrength(club, matchday) {
  return squadStrength(club, matchday) * DEFENSE_MOD[club.tactics.style];
}

export function expectedGoals(attacker, defender, matchday, isHome) {
  const atk = attackStrength(attacker, matchday);
  const dfn = defenseStrength(defender, matchday);
  const ratio = atk / Math.max(dfn, 1.0);
  let rate = BASE_GOAL_RATE * Math.pow(ratio, 1.15);
  if (isHome) rate *= HOME_ADVANTAGE;
  return Math.max(0.1, rate);
}

export function weightedScorer(xi) {
  const pool = xi.map((p) => [p, SCORER_WEIGHTS[p.position] ?? 10]);
  const total = pool.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [p, w] of pool) {
    r -= w;
    if (r <= 0) return p;
  }
  return xi[0];
}

export function applyBenchUnhappiness(club, xi, difficulty) {
  if (difficulty === "rookie") return;
  const xiIds = new Set(xi.map((p) => p.id));
  // A bigger-profile club's players are a little more demanding about
  // playing time — not dramatically so, just a modest lean using the
  // club's own reputation as the stand-in for "how high a flight is
  // this." Keeps this local to the club/player data already in hand
  // instead of needing every match-sim call site to also know its tier.
  const tierPressure = clamp(((club.reputation ?? 60) - 50) / 45, -0.3, 0.5); // roughly -0.3 at low reputation, +0.5 at the very top
  club.squad.forEach((p) => {
    if (xiIds.has(p.id)) {
      p.benchStreak = 0;
      return;
    }
    // an injured or suspended player sitting out isn't a squad-management
    // complaint — only fit players building frustration from being left
    // out count here
    if (p.injuredUntilMatchday != null || p.suspendedUntilMatchday != null) return;
    p.benchStreak = (p.benchStreak || 0) + 1;
    p.morale = clamp(p.morale - 1, 0, 100);
    const isStarOrProspect = p.overall >= 80 || (p.age <= 21 && (p.potential - p.overall) >= 10);
    if (isStarOrProspect && !p.transferRequested && !p.transferListed && (p.benchStreak >= UNHAPPY_BENCH_STREAK_THRESHOLD || p.morale <= UNHAPPY_MORALE_THRESHOLD)) {
      if (Math.random() < 0.15 * (1 + tierPressure)) {
        p.transferRequested = true;
        p.transferListed = true;
        p.askingPrice = Math.round(marketValue({ ...p, morale: p.morale ?? 60 }) * 0.85);
      }
    }
  });
}

export function applyFitnessAndMorale(xi, result) {
  const delta = MORALE_DELTA[result];
  xi.forEach((p) => {
    p.fitness = clamp(p.fitness - randInt(FITNESS_DRAIN_MIN, FITNESS_DRAIN_MAX), 0, 100);
    p.morale = clamp(p.morale + delta, 0, 100);
  });
}

export function recordAppearances(xi, matchday) {
  xi.forEach((p) => {
    p.caps = (p.caps || 0) + 1;
    p.lastPlayedMatchday = matchday;
  });
}

export function applyCardsAndInjuries(xi, clubName, matchday, events, difficulty) {
  const sentOff = new Set();
  const carded = new Set();
  const eligible = () => xi.filter((p) => !sentOff.has(p.id));

  const yellows = samplePoisson(YELLOW_CARD_BASE_RATE);
  for (let i = 0; i < yellows; i++) {
    const pool = eligible();
    if (!pool.length) break;
    const p = choice(pool);
    if (carded.has(p.id)) {
      // second bookable offense this match — automatic red, sent off
      sentOff.add(p.id);
      p.suspendedUntilMatchday = matchday + 1;
      p.lastYellowMatchday = null;
      events.push({ type: "red_card", club: clubName, player: p.name, reason: "second yellow" });
      continue;
    }
    carded.add(p.id);
    events.push({ type: "yellow_card", club: clubName, player: p.name });
    p.seasonYellowCards = (p.seasonYellowCards || 0) + 1;
    // Real accumulation rule (simplified): a 1-match ban every 5th yellow
    // card banked in a season, then the count resets. The old rule — a
    // suspension for being booked in two CONSECUTIVE matches — was far
    // more punishing than reality over a full 38-46 game season, since
    // that coincidence happens often across a whole squad; 5-per-season
    // is genuinely rare, matching how seldom this actually bites in
    // real football.
    if (p.seasonYellowCards >= 5) {
      p.suspendedUntilMatchday = matchday + 1;
      p.seasonYellowCards = 0;
      events.push({ type: "suspension", club: clubName, player: p.name, reason: "five bookings this season" });
    }
  }

  if (Math.random() < RED_CARD_CHANCE) {
    const pool = eligible();
    if (pool.length) {
      const p = choice(pool);
      sentOff.add(p.id);
      p.suspendedUntilMatchday = matchday + 1;
      events.push({ type: "red_card", club: clubName, player: p.name });
    }
  }

  // Injury risk is now per-player and fitness-dependent — a tired player
  // is meaningfully more likely to pick up a knock than a fresh one,
  // which is the actual payoff for rest/rotation mattering at all. Rookie
  // mode dials the overall rate down since it's meant to be the gentler,
  // learn-the-game difficulty — the feature exists everywhere, but its
  // bite depends on which mode you're in.
  const injuryMultiplier = DIFFICULTY_MODES[difficulty]?.injuryMultiplier ?? 1.0;
  xi.forEach((p) => {
    if (sentOff.has(p.id)) return; // already off — no fresh injury on top of a red card
    const fitnessRisk = p.fitness < 50 ? ((50 - p.fitness) / 50) * 0.05 : 0;
    const chance = (INJURY_BASE_RATE / xi.length + fitnessRisk) * injuryMultiplier;
    if (Math.random() < chance) {
      const duration = choice([1, 1, 2, 2, 3, 5]);
      p.injuredUntilMatchday = matchday + duration;
      events.push({ type: "injury", club: clubName, player: p.name, outFor: duration });
    }
  });
}

export function simulateMatch(fixture, home, away, matchday, difficulty) {
  const homeXI = startingXI(home, matchday);
  const awayXI = startingXI(away, matchday);
  // Debuts: caps === 0 means this is genuinely their first-ever appearance
  // — captured BEFORE recordAppearances increments it, since that's the
  // only moment this is knowable.
  const debutants = [
    ...homeXI.filter((p) => !p.caps).map((p) => ({ name: p.name, age: p.age, clubName: home.name })),
    ...awayXI.filter((p) => !p.caps).map((p) => ({ name: p.name, age: p.age, clubName: away.name })),
  ];
  recordAppearances(homeXI, matchday);
  recordAppearances(awayXI, matchday);
  // A "rest next match" request is used up once that match is actually
  // played, whether the player sat out or (safety valve) had to play
  // anyway — either way, this match was their "next match."
  home.squad.forEach((p) => { p.restRequested = false; });
  away.squad.forEach((p) => { p.restRequested = false; });

  const homeXg = expectedGoals(home, away, matchday, true);
  const awayXg = expectedGoals(away, home, matchday, false);
  const homeGoals = samplePoisson(homeXg);
  const awayGoals = samplePoisson(awayXg);

  const events = [];
  // Goals-this-match per scorer, used to detect a hat-trick the moment it
  // happens and note exactly when (real hat-trick record needs the timing
  // of the 3rd goal, not just that one occurred).
  const goalsThisMatchByScorer = new Map();
  const hatTricks = [];
  const scorerRefs = [];
  for (let i = 0; i < homeGoals; i++) {
    const scorer = homeXI.length ? weightedScorer(homeXI) : null;
    if (scorer) {
      scorer.seasonGoals = (scorer.seasonGoals || 0) + 1;
      scorer.careerGoals = (scorer.careerGoals || 0) + 1;
      scorerRefs.push({ playerRef: scorer, clubName: home.name });
      const minute = randInt(1, 90);
      const count = (goalsThisMatchByScorer.get(scorer.id) || 0) + 1;
      goalsThisMatchByScorer.set(scorer.id, count);
      if (count === 3) hatTricks.push({ playerName: scorer.name, clubName: home.name, minute });
      events.push({ type: "goal", club: home.name, player: scorer.name, minute });
    } else {
      events.push({ type: "goal", club: home.name, player: "Unknown", minute: randInt(1, 90) });
    }
  }
  for (let i = 0; i < awayGoals; i++) {
    const scorer = awayXI.length ? weightedScorer(awayXI) : null;
    if (scorer) {
      scorer.seasonGoals = (scorer.seasonGoals || 0) + 1;
      scorer.careerGoals = (scorer.careerGoals || 0) + 1;
      scorerRefs.push({ playerRef: scorer, clubName: away.name });
      const minute = randInt(1, 90);
      const count = (goalsThisMatchByScorer.get(scorer.id) || 0) + 1;
      goalsThisMatchByScorer.set(scorer.id, count);
      if (count === 3) hatTricks.push({ playerName: scorer.name, clubName: away.name, minute });
      events.push({ type: "goal", club: away.name, player: scorer.name, minute });
    } else {
      events.push({ type: "goal", club: away.name, player: "Unknown", minute: randInt(1, 90) });
    }
  }
  events.sort((a, b) => (a.type === "goal" ? a.minute : 999) - (b.type === "goal" ? b.minute : 999));

  applyCardsAndInjuries(homeXI, home.name, matchday, events, difficulty);
  applyCardsAndInjuries(awayXI, away.name, matchday, events, difficulty);

  let homeResult, awayResult;
  if (homeGoals > awayGoals) { homeResult = "win"; awayResult = "loss"; }
  else if (homeGoals < awayGoals) { homeResult = "loss"; awayResult = "win"; }
  else { homeResult = awayResult = "draw"; }

  applyFitnessAndMorale(homeXI, homeResult);
  applyFitnessAndMorale(awayXI, awayResult);
  applyBenchUnhappiness(home, homeXI, difficulty);
  applyBenchUnhappiness(away, awayXI, difficulty);

  fixture.homeScore = homeGoals;
  fixture.awayScore = awayGoals;
  fixture.played = true;
  fixture.homeResult = homeResult;
  fixture.awayResult = awayResult;

  return { homeClub: home.name, awayClub: away.name, homeScore: homeGoals, awayScore: awayGoals, events, debutants, hatTricks, scorerRefs };
}

export function computeTable(tier) {
  const stats = {};
  tier.clubs.forEach((c) => {
    stats[c.id] = { clubId: c.id, club: c.name, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, form: [] };
  });
  const chronological = [...tier.fixtures].filter((f) => f.played).sort((a, b) => a.matchday - b.matchday);
  chronological.forEach((fx) => {
    const h = stats[fx.homeClubId], a = stats[fx.awayClubId];
    if (!h || !a) return;
    h.played++; a.played++;
    h.gf += fx.homeScore; h.ga += fx.awayScore;
    a.gf += fx.awayScore; a.ga += fx.homeScore;
    if (fx.homeScore > fx.awayScore) { h.won++; h.points += 3; a.lost++; h.form.push("W"); a.form.push("L"); }
    else if (fx.homeScore < fx.awayScore) { a.won++; a.points += 3; h.lost++; h.form.push("L"); a.form.push("W"); }
    else { h.drawn++; a.drawn++; h.points++; a.points++; h.form.push("D"); a.form.push("D"); }
  });
  Object.values(stats).forEach((r) => { r.form = r.form.slice(-4); });
  return Object.values(stats).sort((r1, r2) => (r2.points - r1.points) || ((r2.gf - r2.ga) - (r1.gf - r1.ga)) || (r2.gf - r1.gf));
}

// Pulls the user's own result out of a matchday's results (there may be
// none — a cup-only matchday, a bye week from an odd fixture count, etc.
// — hence the null return). Shared by every place career stats accumulate.
export function computeMatchOutcome(matches, userClubName) {
  const m = matches.find((r) => r.homeClub === userClubName || r.awayClub === userClubName);
  if (!m) return null;
  const isHome = m.homeClub === userClubName;
  const us = isHome ? m.homeScore : m.awayScore;
  const them = isHome ? m.awayScore : m.homeScore;
  if (us > them) return "win";
  if (us < them) return "loss";
  return "draw";
}

export function simulateMatchdayAcrossTiers(next, currentMatchday) {
  const matches = [];
  let disqualificationNotice = null;
  const eventBonusesOn = DIFFICULTY_MODES[next.difficulty]?.eventBonuses;
  next.tiers.forEach((t) => {
    // recovery between matchdays for the whole squad — starters net a small
    // amount of fatigue, rested players climb back toward full fitness
    t.clubs.forEach((c) => c.squad.forEach((p) => { p.fitness = clamp(p.fitness + 18, 0, 100); }));

    const todays = t.fixtures.filter((f) => f.matchday === currentMatchday && !f.played);
    todays.forEach((fx) => {
      const home = t.clubs.find((c) => c.id === fx.homeClubId);
      const away = t.clubs.find((c) => c.id === fx.awayClubId);
      if (!home || !away) return;
      // A disqualified club can't field a real side — the fixture still
      // happens on the calendar, but resolves as an automatic loss rather
      // than going through full simulation (which assumes 11+ fit players).
      if (home.disqualified || away.disqualified) {
        const homeLoses = home.disqualified;
        fx.homeScore = homeLoses ? 0 : 3;
        fx.awayScore = homeLoses ? 3 : 0;
        fx.played = true;
        home.squad.forEach((p) => { p.restRequested = false; });
        away.squad.forEach((p) => { p.restRequested = false; });
        const result = { homeClub: home.name, awayClub: away.name, homeScore: fx.homeScore, awayScore: fx.awayScore, events: [], disqualifiedMatch: true };
        if (t.id === next.userTierId) matches.push(result);
        return;
      }
      const result = simulateMatch(fx, home, away, currentMatchday, next.difficulty);
      updateWorldRecordsFromMatch(next, result, next.seasonNumber);
      (result.scorerRefs || []).forEach(({ playerRef, clubName }) => checkCareerGoalsRecord(next, playerRef, clubName, next.seasonNumber));
      if (eventBonusesOn && WIN_BONUS[t.id] > 0) {
        if (fx.homeScore > fx.awayScore) home.budget += WIN_BONUS[t.id];
        else if (fx.awayScore > fx.homeScore) away.budget += WIN_BONUS[t.id];
      }
      // Rivalry matches — a small reputation bump for the winner always
      // applies (bragging rights matter regardless of difficulty), while
      // the extra gate revenue only makes sense once revenue is actually
      // tracked (Pro/Executive).
      // A rivalry match gets flagged regardless of result — a draw still
      // deserves the recap/badge treatment, it just doesn't earn anyone
      // the reputation/revenue bump (there's no winner to give it to).
      if (isRivalryMatch(home.name, away.name)) {
        result.isRivalryMatch = true;
        if (fx.homeScore !== fx.awayScore) {
          const winner = fx.homeScore > fx.awayScore ? home : away;
          winner.reputation = clamp(winner.reputation + RIVALRY_REPUTATION_BUMP, 20, 95);
          if (eventBonusesOn) winner.budget += RIVALRY_REVENUE_BONUS;
        }
      }
      if (t.id === next.userTierId) matches.push(result);
    });
    // light responsiveness pass: an already-listed player might get snapped up between windows.
    // The previous bump (8% → 14/22%) fixed slow user sales but had an
    // unintended side effect: compounded across ~34 matchdays in a season,
    // it wiped out nearly the ENTIRE market pool by season's end (229
    // listed dropping to just 7 by the time the user checked). Rolled back
    // to a rate that keeps the market meaningfully populated all season —
    // AI-to-AI listings turn over gradually rather than nearly all clearing
    // out — while still keeping the user's own listings selling reliably
    // within a season, which was the actual point of the original fix.
    t.clubs.forEach((seller) => {
      const isUserSeller = seller.id === next.userClubId;
      seller.squad.forEach((p) => {
        // Same distinction as the preseason window: an unhappy player
        // auto-listed from being benched isn't a listing the user actually
        // chose to make, so it shouldn't move at the fast voluntary-sale
        // rate — that compounding across many matchdays in one bulk sim
        // (Sim to Next Window, Sim Season) is what could suddenly gut a
        // squad below the minimum with no real say from the user.
        const buyChance = isUserSeller ? (p.transferRequested ? 0.03 : 0.1) : 0.025;
        if (p.transferListed && Math.random() < buyChance) {
          // The user's own club must never be randomly picked as the
          // "AI" buyer here — this was silently signing random players
          // onto the user's squad (and spending their budget) with no
          // action or consent from them at all.
          const buyers = t.clubs.filter((c) => c.id !== seller.id && c.id !== next.userClubId && c.budget >= p.askingPrice && c.squad.length < MAX_SQUAD_SIZE);
          if (buyers.length === 0) return;
          const buyer = choice(buyers);
          buyer.budget -= p.askingPrice;
          seller.budget += p.askingPrice;
          p.transferListed = false;
          p.askingPrice = null;
          p.benchStreak = 0;
          p.transferRequested = false;
          seller.squad = seller.squad.filter((sp) => sp.id !== p.id);
          if (seller.designatedPlayerIds?.includes(p.id)) {
            seller.designatedPlayerIds = seller.designatedPlayerIds.filter((id) => id !== p.id);
          }
          buyer.squad.push(p);
        }
      });
    });

    // A sale (or an AI club selling into the user's squad edge cases) can
    // drop a club below the minimum playable squad size mid-season — check
    // every club after this matchday's activity and flag/fund accordingly.
    t.clubs.forEach((club, idx) => {
      const { club: updated, notice } = applyDisqualificationCheck(club, t.id);
      if (updated !== club) t.clubs[idx] = updated;
      if (notice && club.id === next.userClubId) disqualificationNotice = notice;
    });

    // Relegation drama — England's three relegation-battle tiers only (PL,
    // Championship, League One; League Two has nowhere lower to go). Fires
    // exactly once per tier per season, at the point where 5 matchdays
    // remain — real mathematical safety/doom, not a vibes-based guess.
    if (t.id >= 4 && t.id <= 6) {
      const relegationCounts = [3, 3, 4]; // same as the end-of-season rollover uses
      const n = relegationCounts[t.id - 4];
      const remainingFixtures = t.fixtures.filter((f) => !f.played).length;
      const matchesPerMatchday = t.clubs.length / 2;
      const remainingMatchdays = matchesPerMatchday > 0 ? remainingFixtures / matchesPerMatchday : 0;
      if (remainingMatchdays === 5) {
        const table = computeTable(t);
        if (table.length > n) {
          const safetyLineTeam = table[table.length - n - 1];
          const dropZoneTopTeam = table[table.length - n];
          const doomed = table.slice(table.length - n).find((row) => row.points + remainingMatchdays * 3 < safetyLineTeam.points);
          const safe = table.slice(0, table.length - n).reverse().find((row) => row.points > dropZoneTopTeam.points + remainingMatchdays * 3);
          if (!next.newsFeed) next.newsFeed = [];
          if (doomed) {
            const clubName = t.clubs.find((c) => c.id === doomed.clubId)?.name;
            if (clubName) next.newsFeed = [{ season: next.seasonNumber, headline: `⚠️ ${clubName} are mathematically relegated from the ${FULL_TIER_META[t.id].name} with 5 games still to play.`, category: "relegation" }, ...next.newsFeed].slice(0, 40);
          }
          if (safe) {
            const clubName = t.clubs.find((c) => c.id === safe.clubId)?.name;
            if (clubName) next.newsFeed = [{ season: next.seasonNumber, headline: `✅ ${clubName} have mathematically secured their ${FULL_TIER_META[t.id].name} status for next season.`, category: "relegation" }, ...next.newsFeed].slice(0, 40);
          }
        }
      }
    }
  });
  return { matches, disqualificationNotice };
}

export function isRivalryMatch(nameA, nameB) {
  return RIVALRY_PAIRS.has([nameA, nameB].sort().join("|"));
}

export function updateWorldRecordsFromMatch(next, result, seasonNumber) {
  if (!next.worldRecords) next.worldRecords = { ...DEFAULT_WORLD_RECORDS };
  if (!next.newsFeed) next.newsFeed = [];
  const pushNews = (headline, category) => {
    next.newsFeed = [{ season: seasonNumber, headline, category }, ...next.newsFeed].slice(0, 40);
  };

  // Career goals — checked for every scorer, but we only have names+clubs
  // in `events`, not live player objects, so this checks against the
  // scorer's actual current careerGoals via a lookup the caller provides
  // isn't available here; instead this is invoked per goal-scoring player
  // object directly by the caller (see simulateMatchdayAcrossTiers).

  (result.hatTricks || []).forEach((ht) => {
    const current = next.worldRecords.fastestHatTrick;
    if (!current || ht.minute < current.minute) {
      next.worldRecords.fastestHatTrick = { playerName: ht.playerName, clubName: ht.clubName, minute: ht.minute, season: seasonNumber };
      pushNews(`⚡ Hat-trick! ${ht.playerName} (${ht.clubName}) scores three inside ${ht.minute} minutes — the fastest hat-trick on record.`, "record");
    } else {
      pushNews(`⚽ Hat-trick for ${ht.playerName} (${ht.clubName}).`, "match");
    }
  });

  (result.debutants || []).forEach((d) => {
    const current = next.worldRecords.youngestDebut;
    if (!current || d.age < current.age) {
      next.worldRecords.youngestDebut = { playerName: d.name, clubName: d.clubName, age: d.age, season: seasonNumber };
      pushNews(`🌟 ${d.name} makes their debut for ${d.clubName} at just ${d.age} — the youngest debut on record.`, "record");
    }
  });
}

export function checkCareerGoalsRecord(next, scorer, clubName, seasonNumber) {
  if (!next.worldRecords) next.worldRecords = { ...DEFAULT_WORLD_RECORDS };
  if (!next.newsFeed) next.newsFeed = [];
  const current = next.worldRecords.mostCareerGoals;
  if (!current || scorer.careerGoals > current.goals) {
    next.worldRecords.mostCareerGoals = { playerName: scorer.name, clubName, goals: scorer.careerGoals };
    if (current) {
      next.newsFeed = [{ season: seasonNumber, headline: `📈 ${scorer.name} (${clubName}) breaks the all-time goals record with ${scorer.careerGoals}.`, category: "record" }, ...next.newsFeed].slice(0, 40);
    }
  }
}
