import { ENGLAND_ROSTERS, NATIONALITY_POOLS } from "../data/rosters";
import { ACADEMY_STAR_THRESHOLDS, FULL_TIER_META, TIER_META, TIER_OVERALL_CEILING, WAGE_BANDS } from "./constants";
import { marketValue } from "./finance";

export function randomName(usedNames) {
  for (let attempt = 0; attempt < 25; attempt++) {
    const pool = choice(NATIONALITY_POOLS);
    const name = `${choice(pool.first)} ${choice(pool.last)}`;
    if (!usedNames || !usedNames.has(name)) {
      if (usedNames) usedNames.add(name);
      return name;
    }
  }
  // pool exhausted (extremely unlikely) — fall back to a disambiguated name
  const pool = choice(NATIONALITY_POOLS);
  const name = `${choice(pool.first)} ${choice(pool.last)} ${randInt(2, 99)}`;
  if (usedNames) usedNames.add(name);
  return name;
}

export function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

export function choice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export function uid() { return Math.random().toString(36).slice(2, 10); }

export function computePotential(age, overall) {
  let gap;
  if (age <= 20) gap = randInt(10, 22);
  else if (age <= 23) gap = randInt(6, 14);
  else if (age <= 26) {
    gap = randInt(2, 8);
    if (Math.random() < 0.12) gap += randInt(6, 12); // hidden-gem: still has real upside
  } else if (age <= 29) {
    gap = randInt(0, 4);
    if (Math.random() < 0.08) gap += randInt(5, 10); // rarer hidden gem this late
  } else {
    gap = 0; // 30+ — what you see is what you get, no more real ceiling left
  }
  let potential = Math.min(99, overall + gap);
  // breakout dice roll only makes sense for players young enough to still develop
  if (age <= 21 && Math.random() < 0.04) {
    potential = Math.min(99, potential + randInt(10, 25));
  }
  return Math.max(potential, overall);
}

export function randomPlayerAge() {
  const r = Math.random();
  if (r < 0.22) return randInt(16, 20);
  if (r < 0.70) return randInt(21, 28);
  if (r < 0.92) return randInt(29, 33);
  return randInt(34, 38);
}

export function retirementChance(age) {
  if (age < 34) return 0;
  const table = { 34: 0.05, 35: 0.10, 36: 0.18, 37: 0.30, 38: 0.45, 39: 0.65, 40: 0.85 };
  return table[age] ?? 1.0;
}

export function growPlayer(p, tierIdx) {
  const age = p.age + 1;
  let delta;
  if (p.overall < p.potential) {
    if (age <= 21) delta = randInt(2, 5);
    else if (age <= 25) delta = randInt(1, 4);
    else if (age <= 29) delta = randInt(0, 2);
    else delta = randInt(-1, 1);
    delta = Math.min(delta, p.potential - p.overall);
  } else {
    if (age >= 33) delta = randInt(-4, -1);
    else if (age >= 30) delta = randInt(-2, 0);
    else delta = 0;
  }
  // rare late breakout: potential itself can still climb, but only for
  // players young enough that a real breakout is plausible
  let potential = p.potential;
  if (age <= 24 && Math.random() < 0.03) {
    potential = Math.min(99, potential + randInt(5, 15));
  }
  const ceiling = tierIdx != null ? (TIER_OVERALL_CEILING[tierIdx] ?? 99) : 99;
  // Cap potential to the tier ceiling too, so future growth deltas actually
  // stop rather than continuing to chase an inflated number every season —
  // but never pulled back below whatever the player has already
  // legitimately reached (a pre-existing save could already be over it).
  potential = Math.max(p.overall, Math.min(potential, ceiling));
  let overall = clamp(p.overall + delta, 30, 99);
  // The ceiling only ever blocks GROWTH past it — it must never forcibly
  // slash a player who's already above it (e.g. an existing save from
  // before this cap existed, or before a ceiling was lowered further) back
  // down in one abrupt step. Only clamp when this season's change would
  // actually be an increase past the ceiling; a decline (aging out) is
  // left to play out normally.
  if (delta > 0 && overall > ceiling) overall = Math.max(p.overall, ceiling);
  // Legacy correction: a player already sitting above the ceiling — from
  // before this cap existed, or from a ceiling that's since been lowered —
  // would otherwise stay frozen there forever once they're past the age
  // where natural decline kicks in. Gently nudge them back down toward the
  // ceiling every season instead, faster the further over they are, so an
  // existing save actually self-corrects over a handful of seasons rather
  // than an abrupt reset OR a permanent, unrealistic plateau.
  if (overall > ceiling) {
    const excess = overall - ceiling;
    overall -= Math.max(1, Math.round(excess * 0.15));
    overall = Math.max(overall, ceiling);
  }
  const attrDelta = Math.round(delta * 0.6);
  return {
    ...p,
    age,
    potential,
    overall,
    pace: clamp(p.pace + attrDelta + randInt(-2, 2), 15, 99),
    shooting: clamp(p.shooting + attrDelta + randInt(-2, 2), 15, 99),
    passing: clamp(p.passing + attrDelta + randInt(-2, 2), 15, 99),
    defense: clamp(p.defense + attrDelta + randInt(-2, 2), 15, 99),
    physical: clamp(p.physical + attrDelta + randInt(-2, 2), 15, 99),
  };
}

export function computeRealisticWage(overall, age, tierIdx, potential) {
  const b = WAGE_BANDS[tierIdx] ?? WAGE_BANDS[3];
  if (b.starHigh === 0) return 0;
  if (overall >= 82) {
    const t = clamp((overall - 82) / 13, 0, 1);
    return Math.round(b.starLow + t * (b.starHigh - b.starLow));
  }
  if (age <= 23) {
    // A real wonderkid's wage reflects the transfer premium clubs pay for
    // their ceiling, not just their current, still-developing overall — a
    // splashy signing should feel like one in the wage bill too, not just
    // the one-time fee. Scales the same "young" baseline up toward the
    // veteran-star range as the gap to potential grows.
    const gap = potential != null ? Math.max(0, potential - overall) : 0;
    if (gap >= 8) {
      const t = clamp((gap - 8) / 17, 0, 1);
      return Math.round(b.young + t * (b.starLow - b.young));
    }
    return b.young;
  }
  if (overall <= 65) return b.senior;
  const t = clamp((overall - 65) / 17, 0, 1);
  return Math.round(b.vetLow + t * (b.vetHigh - b.vetLow));
}

export function squadPayroll(squad) {
  return squad.reduce((s, p) => s + (p.wage || 0), 0);
}

export function makePlayer(position, overall, usedNames) {
  const rating = clamp(overall, 35, 95);
  const age = randomPlayerAge();
  return {
    id: uid(),
    name: randomName(usedNames),
    position,
    age,
    potential: computePotential(age, rating),
    overall: rating,
    pace: clamp(rating + randInt(-5, 5), 20, 99),
    shooting: clamp(rating + randInt(-5, 5), 20, 99),
    passing: clamp(rating + randInt(-5, 5), 20, 99),
    defense: clamp(rating + randInt(-5, 5), 20, 99),
    physical: clamp(rating + randInt(-5, 5), 20, 99),
    leadership: clamp(randInt(15, 55) + Math.round((age - 18) * 2.2), 15, 99),
    fitness: 100,
    morale: 70,
    injuredUntilMatchday: null,
    suspendedUntilMatchday: null,
    lastYellowMatchday: null,
    caps: 0,
    lastPlayedMatchday: null,
    contractYearsLeft: randInt(2, 5),
    wage: Math.round(rating * 50), // crude placeholder — corrected to a real tier-scaled wage the first time it passes through rolloverSeason
    wageSet: false,
    transferListed: false,
    askingPrice: null,
  };
}

export function generateFictionalSquad(baseRating, spread = 8, usedNames) {
  const layout = [
    "GK","GK","DEF","DEF","DEF","DEF","DEF","MID","MID","MID","MID","MID","FWD","FWD","FWD",
  ];
  return layout.map((pos) => makePlayer(pos, baseRating + randInt(-spread, spread), usedNames));
}

export function realPlayerToRuntime(p, tierIdx) {
  const potential = computePotential(p.age, p.overall);
  return {
    id: uid(),
    name: p.name,
    position: p.position,
    age: p.age,
    potential,
    overall: p.overall,
    pace: p.pace,
    shooting: p.shooting,
    passing: p.passing,
    defense: p.defense,
    physical: p.physical,
    leadership: clamp(randInt(15, 55) + Math.round((p.age - 18) * 2.2), 15, 99),
    fitness: 100,
    morale: 70,
    injuredUntilMatchday: null,
    suspendedUntilMatchday: null,
    lastYellowMatchday: null,
    caps: 0,
    lastPlayedMatchday: null,
    contractYearsLeft: randInt(2, 5),
    // Real wage computed immediately — this used to be a crude overall*50
    // placeholder only corrected the first time a player passed through a
    // season rollover, which meant every real player showed a tiny,
    // unrealistic wage for the entirety of Season 1 (rollover doesn't run
    // until a season ends). Now it's right from the very first matchday.
    wage: computeRealisticWage(p.overall, p.age, tierIdx ?? 0, potential),
    wageSet: true,
    transferListed: false,
    askingPrice: null,
  };
}

export function defaultCaptain(squad) {
  if (!squad.length) return null;
  return [...squad].sort((a, b) => b.leadership - a.leadership)[0].id;
}

export function computeReputation(squad) {
  if (!squad.length) return 50;
  const avgOverall = squad.reduce((s, p) => s + p.overall, 0) / squad.length;
  // The old slope (×4, offset 50) hit the 95 ceiling at avgOverall ~71 —
  // for a real Premier League roster (avgOverall commonly 70-82), that
  // meant 17 of 20 clubs clamped to the exact same reputation value,
  // regardless of Man City vs. Sunderland-level quality. Board objectives
  // and club funding both key off reputation percentile within the tier,
  // so this one clamp was quietly breaking both — every club "should win
  // the league," and funding barely tracked actual club strength.
  // Rescaled so a genuinely elite squad (~85 avg) reaches the ceiling,
  // not a solidly-mid-table one — spreads the realistic range out instead
  // of bunching most of the league at the top.
  return clamp(Math.round((avgOverall - 60) * 3 + 20), 20, 95);
}

export function makeClub({ name, squad, isReal, budget, academyEligible }) {
  return {
    id: uid(),
    name,
    isReal: !!isReal,
    squad,
    captainId: defaultCaptain(squad),
    tactics: { formation: "4-4-2", style: "balanced", press: "medium", lineupMode: "best", restThreshold: 0 },
    budget: budget ?? randInt(3_000_000, 8_000_000),
    reputation: computeReputation(squad),
    academyEligible: !!academyEligible,
    academyStars: 0,
    academyInvested: 0,
    youthPlayers: [],
    tryoutCandidates: [],
    boardHappiness: 60,
    boardObjective: null,
    boardMessage: null,
    leagueTitles: 0,
    designatedPlayerIds: [],
    conference: null,
    disqualified: false,
  };
}

export function findEnglandRealRoster(clubName) {
  const slug = Object.keys(ENGLAND_ROSTERS).find((k) => ENGLAND_ROSTERS[k].name === clubName);
  return slug ? ENGLAND_ROSTERS[slug].players : null;
}

export function academyStarsForInvestment(invested) {
  let stars = 0;
  for (let i = 1; i < ACADEMY_STAR_THRESHOLDS.length; i++) {
    if (invested >= ACADEMY_STAR_THRESHOLDS[i]) stars = i;
  }
  return stars;
}

export function academySigningCost(academyStars) {
  return 50_000 + academyStars * 20_000;
}

export function generateAcademyProspect(academyStars) {
  const position = choice(["GK", "DEF", "DEF", "MID", "MID", "MID", "FWD"]);
  // Real academy intake isn't a single age — a club takes in kids anywhere
  // from 12 up through their mid-teens. An older intake prospect has had a
  // few more years to develop, so their starting overall scales up a
  // little with age rather than every intake starting from the same blank
  // 12-year-old baseline.
  const age = randInt(12, 15);
  const ageBonus = (age - 12) * 2;
  const potential = clamp(randInt(50, 65) + academyStars * 5 + randInt(-5, 5), 40, 95);
  const overall = clamp(20 + academyStars * 2 + ageBonus + randInt(-3, 3), 15, 46);
  return {
    id: uid(), name: randomName(), position, age, potential, overall,
    pace: clamp(overall + randInt(-5, 5), 10, 60),
    shooting: clamp(overall + randInt(-5, 5), 10, 60),
    passing: clamp(overall + randInt(-5, 5), 10, 60),
    defense: clamp(overall + randInt(-5, 5), 10, 60),
    physical: clamp(overall + randInt(-5, 5), 10, 60),
    leadership: clamp(randInt(10, 30), 10, 50),
    isYouth: true,
  };
}

export function growYouthProspect(p, academyStars) {
  const age = p.age + 1;
  const growth = randInt(2, 4) + academyStars;
  const overall = clamp(Math.min(p.potential, p.overall + growth), 10, 99);
  const attrDelta = Math.round(growth * 0.6);
  return {
    ...p, age, overall,
    pace: clamp(p.pace + attrDelta + randInt(-2, 2), 10, 99),
    shooting: clamp(p.shooting + attrDelta + randInt(-2, 2), 10, 99),
    passing: clamp(p.passing + attrDelta + randInt(-2, 2), 10, 99),
    defense: clamp(p.defense + attrDelta + randInt(-2, 2), 10, 99),
    physical: clamp(p.physical + attrDelta + randInt(-2, 2), 10, 99),
  };
}

export function promoteYouthToFirstTeam(p) {
  return {
    ...p, isYouth: false, fitness: 100, morale: 70,
    injuredUntilMatchday: null, suspendedUntilMatchday: null, lastYellowMatchday: null,
    caps: 0, lastPlayedMatchday: null, contractYearsLeft: 3,
    wage: Math.round(p.overall * 30), wageSet: false, transferListed: false, askingPrice: null,
  };
}

export function youthSaleValue(p) {
  if (p.overall >= 60) {
    return marketValue({ ...p, morale: p.morale ?? 60 });
  }
  const baseValue = 500 * Math.pow(1.09, p.overall);
  const potentialGap = Math.max(0, p.potential - p.overall);
  const potentialBonus = 1 + Math.min(potentialGap * 0.01, 0.6);
  return Math.max(20_000, Math.round((baseValue * potentialBonus) / 100) * 100);
}

export function tryoutCost(tierId) {
  // Was hardcoded to two USA-only values (USL League One = $80k, every
  // other tier — including any England tier — fell through to a flat
  // $40k regardless of how much wealthier that tier actually is). Rebuilt
  // as a real scale anchored to those exact two original data points
  // (USL League One's baseRating 48 -> $80k, USL League Two's 40 -> $40k)
  // so USA's existing costs don't change at all, while England's
  // tryout-eligible tiers (League One 54, League Two 46) — genuinely
  // wealthier leagues — now scale up proportionally instead of sharing
  // USA's flat rate by coincidence.
  const baseRating = FULL_TIER_META[tierId]?.baseRating ?? 48;
  return Math.max(20_000, Math.round((-160_000 + baseRating * 5_000) / 1000) * 1000);
}

export function generateTryoutCandidates(tierId) {
  // TIER_META only covers USA (indices 0-3) — using it here meant tryouts
  // crashed immediately for any England club (tierId 4-7), since
  // TIER_META[tierId] was simply undefined. FULL_TIER_META covers all 8.
  const baseRating = FULL_TIER_META[tierId].baseRating;
  const count = randInt(4, 5);
  const candidates = [];
  for (let i = 0; i < count; i++) {
    let rating = baseRating + randInt(-14, 4);
    if (Math.random() < 0.07) {
      // rare gem — good enough to play a tier above this one. Guard against
      // stepping across the USA/England boundary (tierId 4, England's own
      // top flight) into USA's tier 3 — those aren't the same pyramid.
      const oneTierUp = tierId === 4 ? 4 : Math.max(0, tierId - 1);
      rating = FULL_TIER_META[oneTierUp].baseRating + randInt(-5, 5);
    }
    candidates.push(makePlayer(choice(["GK", "DEF", "MID", "FWD"]), rating));
  }
  return candidates;
}

export function tryoutSigningCost(overall) {
  return Math.round(overall * 800);
}

export function generateDraftProspect(baseRating) {
  const position = choice(["GK", "DEF", "DEF", "MID", "MID", "MID", "FWD", "FWD"]);
  const age = randInt(18, 22);
  const overall = clamp(baseRating + randInt(-8, 8), 35, 80);
  const potential = computePotential(age, overall);
  return {
    id: uid(), name: randomName(), position, age, potential, overall,
    pace: clamp(overall + randInt(-5, 5), 20, 99),
    shooting: clamp(overall + randInt(-5, 5), 20, 99),
    passing: clamp(overall + randInt(-5, 5), 20, 99),
    defense: clamp(overall + randInt(-5, 5), 20, 99),
    physical: clamp(overall + randInt(-5, 5), 20, 99),
    leadership: clamp(randInt(15, 55) + Math.round((age - 18) * 2.2), 15, 99),
    fitness: 100, morale: 70, injuredUntilMatchday: null, suspendedUntilMatchday: null,
    lastYellowMatchday: null, caps: 0, lastPlayedMatchday: null,
    contractYearsLeft: randInt(2, 4), wage: Math.round(overall * 40), wageSet: false,
    transferListed: false, askingPrice: null,
  };
}

export function draftProspectValue(p) {
  return Math.max(50_000, Math.round((Math.pow(p.potential, 2.3) * 6) / 1000) * 1000);
}
