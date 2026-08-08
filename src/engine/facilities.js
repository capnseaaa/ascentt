import {
  ATTENDANCE_RATE_MAX, ATTENDANCE_RATE_MIN, FACILITY_COST_MULTIPLIER, FACILITY_FIRST_UPGRADE_MATCHDAYS,
  FACILITY_MAINTENANCE_RATE, FACILITY_MAX_LEVEL, FACILITY_TIER_RANGE, FACILITY_TYPES, FACILITY_UPGRADES_PER_SEASON,
  FACILITY_WORLD_CLASS_LEVEL, FAN_HAPPINESS_DEFAULT, FAN_HAPPINESS_EXPECTATION_DELTA, FAN_HAPPINESS_MATCH_DELTA,
  FAN_HAPPINESS_REVERSION_RATE, FAN_HAPPINESS_SEASON_DELTA, MERCHANDISE_BASE_FRACTION, OWNERSHIP_DEPOSIT_WAGED,
  SPONSORSHIP_BASE_FRACTION, STADIUM_BASE_CAPACITY, STADIUM_CAPACITY_PER_LEVEL, TICKET_PRICE_DEFAULT_FRACTION,
  TICKET_PRICE_RANGE,
} from "./constants";
// Local clamp/randInt/choice rather than importing from playerGen.js —
// playerGen.js needs to import trainingGrowthMultiplier FROM this file,
// and a two-way import between the same two modules is a circular
// dependency worth just avoiding outright rather than relying on it
// happening to work.
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
function choice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// The four facilities managed entirely through this new system. Academy
// keeps its own existing cost/star system (already built, tested, and
// wired into prospect generation) — only its UPGRADE TIMING gets folded
// into the shared rules here (season cap, first-upgrade construction
// delay), not its pricing.
export const NEW_FACILITY_TYPES = ["training", "medical", "scouting", "stadium"];

// Placeholder used inside makeClub before world generation overrides it
// with a real rank-based assignment — same pattern academyStars already
// uses (starts at a flat placeholder, gets set for real once the whole
// tier's clubs exist and can be ranked against each other).
export function defaultFacilities() {
  const f = {};
  NEW_FACILITY_TYPES.forEach((type) => { f[type] = { level: 1, upgrading: null, hasEverUpgraded: false }; });
  return f;
}

// The real upgrade ceiling for a club currently playing in this tier —
// distinct from FACILITY_TIER_RANGE's max, which only bounds where a club
// can START. The Premier League is the one tier where genuine investment
// can push past the normal level-5 ceiling into "World Class" (level 6) —
// costly, but not restricted to any particular club the way starting
// assignment is. Every other tier has a hard structural ceiling: a League
// Two club cannot out-invest its way to Premier League-grade facilities,
// no matter how much money it has.
export function facilityMaxUpgradeLevel(tierIdx) {
  if (tierIdx === 4) return FACILITY_WORLD_CLASS_LEVEL;
  return FACILITY_TIER_RANGE[tierIdx][1];
}

// Auto-assigns a full set of starting facility levels for a brand-new
// club, based on where it ranks (by reputation) within its own tier —
// same underlying idea the academy star-assignment already used (better
// clubs start with better infrastructure), extended to all 4 new
// facilities and given real per-facility texture instead of one flat
// number applied everywhere.
export function autoAssignFacilities(tierIdx, percentile, isTopSixInTier) {
  const [minL, maxL] = FACILITY_TIER_RANGE[tierIdx];
  let base;
  if (tierIdx === 4) {
    // Premier League: weighted toward 4 — level 5 is possible but not
    // guaranteed even for a top-6 club, and nobody outside the top 6
    // starts there at all.
    if (isTopSixInTier && Math.random() < 0.5) base = 5;
    else if (percentile < 0.65) base = 4;
    else base = 3;
  } else {
    // Elsewhere: a straightforward linear read of where this club sits
    // in its own tier's reputation spread, mapped onto that tier's range.
    base = Math.round(maxL - percentile * (maxL - minL));
  }
  const autoAssignCap = tierIdx === 4 ? (isTopSixInTier ? 5 : 4) : maxL; // nobody starts at PL's World Class tier; non-top-6 PL clubs can't be nudged past 4 either
  const facilities = {};
  NEW_FACILITY_TYPES.forEach((type) => {
    facilities[type] = { level: clamp(base + randInt(-1, 1), minL, autoAssignCap), upgrading: null, hasEverUpgraded: false };
  });
  // One real strength and (where there's room) one real weak spot, so two
  // clubs with similar overall standing don't come out looking identical
  // across the board — a club that's always invested heavily in Medical
  // but let its Stadium slide, for instance.
  const signature = choice(NEW_FACILITY_TYPES);
  facilities[signature].level = clamp(facilities[signature].level + 1, minL, autoAssignCap);
  const weakSpotPool = NEW_FACILITY_TYPES.filter((t) => t !== signature);
  const weakSpot = choice(weakSpotPool);
  facilities[weakSpot].level = clamp(facilities[weakSpot].level - 1, minL, autoAssignCap);
  return facilities;
}

// Cost to reach `targetLevel` for a club in the given tier.
export function facilityUpgradeCost(targetLevel, tierIdx) {
  const base = OWNERSHIP_DEPOSIT_WAGED[tierIdx];
  return Math.round(base * FACILITY_COST_MULTIPLIER[targetLevel]);
}

export function canStartFacilityUpgrade(club, facilityType, tierIdx) {
  const f = club.facilities?.[facilityType];
  if (!f) return { ok: false, reason: "Unknown facility." };
  const ceiling = facilityMaxUpgradeLevel(tierIdx);
  if (f.level > ceiling) return { ok: false, reason: "Above what's normal for this level of the pyramid — get promoted to build further, or downgrade to cut costs." };
  if (f.level >= ceiling) return { ok: false, reason: tierIdx === 4 && ceiling === FACILITY_WORLD_CLASS_LEVEL ? "Already World Class — the maximum, even for the Premier League." : "Already at the maximum level for this tier." };
  if (f.upgrading) return { ok: false, reason: "Already upgrading." };
  const used = club.facilityUpgradesThisSeason || 0;
  const cap = FACILITY_UPGRADES_PER_SEASON[tierIdx];
  if (used >= cap) return { ok: false, reason: `You can only start ${cap} facility upgrade${cap === 1 ? "" : "s"} per season at this level of the pyramid.` };
  const cost = facilityUpgradeCost(f.level + 1, tierIdx);
  if (club.budget < cost) return { ok: false, reason: "Not enough budget." };
  return { ok: true, cost, targetLevel: f.level + 1 };
}

// Downgrading is instant — cutting a program or trimming staff doesn't
// take construction time the way building something new does. Always
// available (even while grandfathered above the current tier's normal
// ceiling after a relegation), never forced — a club that can still
// afford its upkeep has no reason to. Refunds nothing; this is about
// cutting ongoing costs, not recovering the original investment.
export function downgradeFacility(club, facilityType) {
  const f = club.facilities?.[facilityType];
  if (!f || f.level <= 0) return false;
  if (f.upgrading) return false; // resolve or wait out an in-progress upgrade first
  f.level -= 1;
  return true;
}

// Mutates club in place: deducts cost, marks the facility as under
// construction. Returns true/false for whether it actually started.
export function startFacilityUpgrade(club, facilityType, tierIdx, currentMatchday) {
  const check = canStartFacilityUpgrade(club, facilityType, tierIdx);
  if (!check.ok) return false;
  const f = club.facilities[facilityType];
  club.budget -= check.cost;
  const isFirstUpgrade = !f.hasEverUpgraded;
  f.upgrading = isFirstUpgrade
    ? { targetLevel: check.targetLevel, completesAtMatchday: (currentMatchday ?? 1) + FACILITY_FIRST_UPGRADE_MATCHDAYS }
    : { targetLevel: check.targetLevel, completesAtSeasonEnd: true };
  f.hasEverUpgraded = true;
  club.facilityUpgradesThisSeason = (club.facilityUpgradesThisSeason || 0) + 1;
  return true;
}

// Called every matchday for every club — completes any upgrade whose
// matchday-based construction timer has elapsed. Season-end upgrades are
// handled separately, at rollover. Academy keeps its own star-count field
// (academyStars/academyUpgrading, not part of `club.facilities`) since its
// pricing/prospect-quality system is untouched — but its UPGRADE TIMING
// folds in here too, so there's only one place to remember to call this,
// not two separate "did I wire this for both facilities and academy"
// call sites (exactly the kind of thing that's gone missing for England
// before).
export function progressFacilityConstruction(club, currentMatchday) {
  if (club.facilities) {
    NEW_FACILITY_TYPES.forEach((type) => {
      const f = club.facilities[type];
      if (f?.upgrading?.completesAtMatchday != null && currentMatchday >= f.upgrading.completesAtMatchday) {
        f.level = f.upgrading.targetLevel;
        f.upgrading = null;
      }
    });
  }
  if (club.academyUpgrading?.completesAtMatchday != null && currentMatchday >= club.academyUpgrading.completesAtMatchday) {
    club.academyStars = club.academyUpgrading.targetStars;
    if (club.academyUpgrading.pendingInvested != null) club.academyInvested = club.academyUpgrading.pendingInvested;
    club.academyUpgrading = null;
  }
}

// Called at rollover for every club — completes season-end upgrades (both
// the 4 new facilities AND academy's own star system) and resets the
// per-season upgrade counter for the new season.
export function completeSeasonEndFacilityUpgrades(club) {
  if (club.facilities) {
    NEW_FACILITY_TYPES.forEach((type) => {
      const f = club.facilities[type];
      if (f?.upgrading?.completesAtSeasonEnd) {
        f.level = f.upgrading.targetLevel;
        f.upgrading = null;
      }
    });
  }
  if (club.academyUpgrading?.completesAtSeasonEnd) {
    club.academyStars = club.academyUpgrading.targetStars;
    if (club.academyUpgrading.pendingInvested != null) club.academyInvested = club.academyUpgrading.pendingInvested;
    club.academyUpgrading = null;
  }
  club.facilityUpgradesThisSeason = 0;
}

// Ongoing per-season upkeep across all facilities (new ones + academy,
// since a well-built academy costs real money to run too even though its
// own upgrade pricing stays separate). Level 0 (nothing built at all) is
// free to maintain — anything actually built, even level 1, carries a
// real ongoing cost.
export function facilityMaintenanceCost(club, tierIdx) {
  const base = OWNERSHIP_DEPOSIT_WAGED[tierIdx];
  let total = 0;
  NEW_FACILITY_TYPES.forEach((type) => {
    const level = club.facilities?.[type]?.level ?? 0;
    if (level <= 0) return;
    total += base * FACILITY_COST_MULTIPLIER[level] * FACILITY_MAINTENANCE_RATE;
  });
  const academyStars = club.academyStars || 0;
  if (academyStars > 0) total += base * 0.15 * FACILITY_MAINTENANCE_RATE * academyStars;
  return Math.round(total);
}

// ===================== EFFECTS =====================

// Training: growth-speed multiplier. Level 1 (baseline) matches the old
// tierFactor floor (0.85x) so a club that never touches this facility
// sees no regression from before it existed; level 5 reaches 1.4x.
export function trainingGrowthMultiplier(level) {
  return 0.85 + ((level ?? 1) - 1) * (0.55 / (FACILITY_MAX_LEVEL - 1));
}

// Medical: injury frequency and duration multipliers. Level 1 = no
// change from baseline; level 5 = meaningfully fewer, shorter injuries.
export function medicalInjuryFrequencyMultiplier(level) {
  return 1 - ((level ?? 1) - 1) * (0.4 / (FACILITY_MAX_LEVEL - 1));
}
export function medicalInjuryDurationMultiplier(level) {
  return 1 - ((level ?? 1) - 1) * (0.35 / (FACILITY_MAX_LEVEL - 1));
}

// Scouting: how wide a fog-of-war band surrounds a scouted player's TRUE
// potential when shown to the user — level 1 shows a wide ±12 range,
// level 5 reveals the exact figure.
export function scoutingPotentialFogRange(level) {
  return Math.round(12 - ((level ?? 1) - 1) * (12 / (FACILITY_MAX_LEVEL - 1)));
}
export function scoutedPotentialRange(truePotential, level) {
  const fog = scoutingPotentialFogRange(level);
  if (fog <= 0) return { low: truePotential, high: truePotential, exact: true };
  return { low: clamp(truePotential - fog, 1, 99), high: clamp(truePotential + fog, 1, 99), exact: false };
}

// Stadium: seating capacity.
export function stadiumCapacity(level, tierIdx) {
  return STADIUM_BASE_CAPACITY[tierIdx] + ((level ?? 1) - 1) * STADIUM_CAPACITY_PER_LEVEL[tierIdx];
}

export function defaultTicketPrice(tierIdx) {
  const [lo, hi] = TICKET_PRICE_RANGE[tierIdx];
  return Math.round(lo + (hi - lo) * TICKET_PRICE_DEFAULT_FRACTION);
}

// ===================== FAN HAPPINESS =====================

export function applyMatchFanHappiness(club, outcome, isOverperforming) {
  const cur = club.fanHappiness ?? FAN_HAPPINESS_DEFAULT;
  let delta = FAN_HAPPINESS_MATCH_DELTA[outcome] ?? 0;
  delta += isOverperforming ? FAN_HAPPINESS_EXPECTATION_DELTA : -FAN_HAPPINESS_EXPECTATION_DELTA;
  club.fanHappiness = clamp(cur + delta, 0, 100);
}

export function applySeasonFanHappiness(club, { wonTrophy, promoted, relegated } = {}) {
  let cur = club.fanHappiness ?? FAN_HAPPINESS_DEFAULT;
  if (wonTrophy) cur += FAN_HAPPINESS_SEASON_DELTA.trophy;
  if (promoted) cur += FAN_HAPPINESS_SEASON_DELTA.promoted;
  if (relegated) cur += FAN_HAPPINESS_SEASON_DELTA.relegated;
  cur += (50 - cur) * FAN_HAPPINESS_REVERSION_RATE;
  club.fanHappiness = clamp(cur, 0, 100);
}

// ===================== TICKETING / MATCH-DAY REVENUE =====================

export function attendanceRate(fanHappiness, ticketPrice, tierIdx) {
  const [lo, hi] = TICKET_PRICE_RANGE[tierIdx];
  const priceFraction = clamp((ticketPrice - lo) / (hi - lo || 1), 0, 1);
  const base = ATTENDANCE_RATE_MIN + ((fanHappiness ?? FAN_HAPPINESS_DEFAULT) / 100) * (ATTENDANCE_RATE_MAX - ATTENDANCE_RATE_MIN);
  const priceAdjust = (0.5 - priceFraction) * 0.15;
  return clamp(base + priceAdjust, ATTENDANCE_RATE_MIN * 0.7, ATTENDANCE_RATE_MAX);
}

export function ticketRevenueForMatch(club, tierIdx) {
  const capacity = stadiumCapacity(club.facilities?.stadium?.level, tierIdx);
  const price = club.ticketPrice ?? defaultTicketPrice(tierIdx);
  const rate = attendanceRate(club.fanHappiness, price, tierIdx);
  const attendance = Math.round(capacity * rate);
  return { revenue: attendance * price, attendance, capacity, price };
}

// ===================== SEASONAL REVENUE =====================

export function seasonMerchandiseRevenue(tierIdx, club) {
  const base = OWNERSHIP_DEPOSIT_WAGED[tierIdx] * MERCHANDISE_BASE_FRACTION;
  const repFactor = 0.5 + ((club.reputation ?? 60) / 95) * 1.0;
  const happinessFactor = 0.7 + ((club.fanHappiness ?? FAN_HAPPINESS_DEFAULT) / 100) * 0.6;
  return Math.round(base * repFactor * happinessFactor);
}

export function seasonSponsorshipRevenue(tierIdx, club, finishPosition, tierSize) {
  const base = OWNERSHIP_DEPOSIT_WAGED[tierIdx] * SPONSORSHIP_BASE_FRACTION;
  const repFactor = 0.5 + ((club.reputation ?? 60) / 95) * 1.0;
  const positionFactor = finishPosition != null && tierSize ? 1.3 - (finishPosition / tierSize) * 0.6 : 1.0;
  return Math.round(base * repFactor * positionFactor);
}
