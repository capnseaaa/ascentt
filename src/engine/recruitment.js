// Stage 3: Universal Recruitment Ecosystem.
//
// Core rule this whole module exists to serve: a club is never auto-filled
// just because it has a vacancy. New players enter the WORLD (the
// free-agent pool — see playerGen.generateWorldFreeAgents), never a specific
// club; a club with a real need instead RECRUITS from the ecosystem —
// academy promotion, a free-agent signing, or a transfer (handled by
// finance.js's runTransferWindow/runAiToAiTransfers, not here). This module
// covers the academy pipeline (objective 2) and the need-based decision of
// "promote vs sign a free agent vs leave it to the transfer market"
// (objective 7), weighted by each club's recruitmentStyle (objective 6).
//
// Universal by construction: every function here takes whatever `tiers`
// array it's handed and has no notion of which country that is — the same
// function is called once for USA's 4 tiers and once for England's 4 tiers
// (see App.jsx's doRollover), with no `if (country === ...)` anywhere in
// this file. The "never cross into the other country's pool" property is a
// structural consequence of always being called with a single country's own
// tiers/free-agent-pool slice, not a rule enforced here.
import { ACADEMY_EXIT_AGE, ACADEMY_MAX_PROSPECTS, ACADEMY_PROMOTE_MIN_AGE, FULL_TIER_META, HEALTHY_SQUAD_SIZE, MAX_SQUAD_SIZE, RECRUITMENT_STYLE_CHANGE_CHANCE_MAX, RECRUITMENT_STYLE_CHANGE_CHANCE_MIN } from "./constants";
import { computeRecommendationScore, computeWeakestPosition } from "./finance";
import { clamp, computeRealisticWage, generateAcademyProspect, promoteYouthToFirstTeam, randInt, RECRUITMENT_STYLES } from "./playerGen";

// Per-club, per-season chance of taking in one new academy prospect, for any
// club with academyStars > 0. Not every eligible club every season — a real
// academy intake happens on its own cycle, not in lockstep across the whole
// pyramid. Chosen (not hand-tuned against a target population) to keep
// academies visibly active over a multi-season save without flooding
// ACADEMY_MAX_PROSPECTS immediately.
const ACADEMY_INTAKE_CHANCE = 0.35;

// recruitmentStyle -> probability of attempting an academy promotion first,
// when a club has a real need. An "academy" club leans hard on its own
// pipeline; a "transfer" club mostly skips straight to the market (handled
// entirely by finance.js's transfer engines, run separately); "balanced"
// splits roughly down the middle.
const PROMOTE_ATTEMPT_CHANCE = { academy: 0.75, balanced: 0.4, transfer: 0.15 };
// recruitmentStyle -> probability of attempting a free-agent signing when
// promotion either wasn't attempted or found no suitable candidate.
const SIGN_FA_ATTEMPT_CHANCE = { academy: 0.25, balanced: 0.35, transfer: 0.55 };

// Objective 2 + 7, run once per club per season (per country tiers array —
// see module comment). Mutates club.squad/club.youthPlayers in place, same
// convention finance.js's transfer engines already use in this codebase.
// Returns the updated free-agent pool plus counts for reporting/testing.
export function runClubRecruitment(tiers, freeAgentsPool, userClubId, difficulty) {
  let pool = [...freeAgentsPool];
  let intakeCount = 0, promotionCount = 0, academyExitCount = 0, signedFromPoolCount = 0;

  tiers.forEach((t) => {
    t.clubs.forEach((club) => {
      // The user manages their own academy and signings by hand — this is
      // AI-club recruitment only, same boundary Stage 2's non-renewal AI
      // logic already draws.
      if (club.id === userClubId) return;

      // --- Academy intake (objective 2a) ---
      if ((club.academyStars || 0) > 0 && (club.youthPlayers || []).length < ACADEMY_MAX_PROSPECTS && Math.random() < ACADEMY_INTAKE_CHANCE) {
        club.youthPlayers = [...(club.youthPlayers || []), generateAcademyProspect(club.academyStars)];
        intakeCount++;
      }

      // --- Academy exit for prospects who aged out without being promoted
      // (objective 2c) — Stage 2's "only retirement permanently deletes a
      // player" rule extended to youth: they exit to the free-agent pool
      // instead of vanishing once they're too old to plausibly still be a
      // prospect.
      const staying = [];
      (club.youthPlayers || []).forEach((p) => {
        if (p.age > ACADEMY_EXIT_AGE) {
          const grown = promoteYouthToFirstTeam(p);
          pool.push({ ...grown, wage: computeRealisticWage(grown.overall, grown.age, t.id, grown.potential), wageSet: true });
          academyExitCount++;
        } else {
          staying.push(p);
        }
      });
      club.youthPlayers = staying;

      // --- Determine genuine need (reuses the exact same weakest-position
      // signal runAiToAiTransfers already uses — no second need-detector). A
      // club is only a recruitment candidate if it's actually short on
      // numbers OR has a real hole at one position, not simply "a signing
      // is available."
      const { weakest, avgByPos } = computeWeakestPosition(club);
      const tierBase = FULL_TIER_META[t.id]?.baseRating ?? 50;
      const hasVacancy = club.squad.length < HEALTHY_SQUAD_SIZE || avgByPos[weakest] < Math.max(30, tierBase - 12);
      if (!hasVacancy || club.squad.length >= MAX_SQUAD_SIZE) return;

      const style = club.recruitmentStyle || "balanced";
      let filled = false;

      // --- Objective 2b / 7: promote from academy first, weighted by
      // recruitment identity.
      if (Math.random() < (PROMOTE_ATTEMPT_CHANCE[style] ?? PROMOTE_ATTEMPT_CHANCE.balanced)) {
        const candidates = (club.youthPlayers || []).filter((p) => p.age >= ACADEMY_PROMOTE_MIN_AGE && p.overall >= avgByPos[weakest] - 8);
        if (candidates.length) {
          const pick = [...candidates].sort((a, b) => b.overall - a.overall)[0];
          club.youthPlayers = club.youthPlayers.filter((p) => p.id !== pick.id);
          const promoted = promoteYouthToFirstTeam(pick);
          club.squad = [...club.squad, { ...promoted, wage: computeRealisticWage(promoted.overall, promoted.age, t.id, promoted.potential), wageSet: true }];
          promotionCount++;
          filled = true;
        }
      }

      // --- Objective 3 / 7: sign a free agent, reusing
      // computeRecommendationScore exactly as the Market tab does — not a
      // parallel scoring function. If promotion filled the need, still
      // eligible to try again next season; skip here.
      if (!filled && pool.length && club.squad.length < MAX_SQUAD_SIZE && Math.random() < (SIGN_FA_ATTEMPT_CHANCE[style] ?? SIGN_FA_ATTEMPT_CHANCE.balanced)) {
        const scored = pool
          .map((p) => ({ p, score: computeRecommendationScore({ ...p, askingPrice: 0, transferListed: false }, club, difficulty, t.id, t.clubs) }))
          .filter((e) => e.score > -Infinity)
          .sort((a, b) => b.score - a.score);
        if (scored.length) {
          const pick = scored[0].p;
          // Atomic: removed from the pool and pushed onto the squad in the
          // same synchronous step, so there is no window where the player
          // is nowhere or in both places.
          pool = pool.filter((p) => p.id !== pick.id);
          const signed = {
            ...pick,
            // Objective 13: contract/wage re-initialized like any fresh
            // signing (computeRealisticWage, same helper the Market/
            // rollover paths already use for a placeholder-wage
            // correction) — identity, stats, and age are preserved exactly
            // as they were in the pool.
            contractYearsLeft: randInt(2, 4),
            wage: computeRealisticWage(pick.overall, pick.age, t.id, pick.potential),
            wageSet: true,
            transferListed: false,
            askingPrice: null,
            benchStreak: 0,
            transferRequested: false,
          };
          club.squad = [...club.squad, signed];
          signedFromPoolCount++;
        }
      }
      // Otherwise: leave the vacancy for the transfer market
      // (runTransferWindow / runAiToAiTransfers, called separately) to
      // resolve opportunistically, or for next season — an unresolved
      // vacancy is an expected, real outcome, not a bug.
    });
  });

  return { freeAgents: pool, intakeCount, promotionCount, academyExitCount, signedFromPoolCount };
}

// Stage 4 (Evolving Recruitment Philosophy) — a separate concern from
// everything above this line: this never touches squad/youthPlayers/the
// free-agent pool, and everything above never touches recruitmentStyle. A
// club's recruitmentStability (0 = volatile, 1 = rock-solid; assigned once
// at creation, see playerGen.assignRecruitmentStability) scales its own
// per-season chance of drifting to a different style linearly between
// RECRUITMENT_STYLE_CHANGE_CHANCE_MIN (most stable) and _MAX (least
// stable) — see constants.js for the actual magnitudes and the reasoning
// for why they're deliberately much rarer than ACADEMY_INTAKE_CHANCE or
// jobOfferChanceFor. An old-save club with no recorded stability
// (undefined) falls back to 0.5 (mid-pack), same defensive-default pattern
// used elsewhere in this codebase for a field that predates the save.
export function recruitmentStyleChangeChance(stability) {
  const s = clamp(stability ?? 0.5, 0, 1);
  return RECRUITMENT_STYLE_CHANGE_CHANCE_MAX - s * (RECRUITMENT_STYLE_CHANGE_CHANCE_MAX - RECRUITMENT_STYLE_CHANGE_CHANCE_MIN);
}

// Run once per club per season (per country tiers array — same "universal,
// no country branching" convention as runClubRecruitment above: the caller
// passes a single country's own tiers slice, called once per country from
// App.jsx's doRollover). Mutates club.recruitmentStyle in place when a
// change fires; always picks a style different from the club's current one,
// from the existing RECRUITMENT_STYLES list only — never invents a new
// value. Does NOT exclude the user's own club: unlike runClubRecruitment
// (an active AI decision the user manages by hand for their own club),
// recruitmentStyle drift is passive identity evolution with no UI exposure
// or player-facing control either way, so there's no boundary to draw here.
export function evaluateRecruitmentStyleShift(tiers) {
  let changeCount = 0;
  tiers.forEach((t) => {
    t.clubs.forEach((club) => {
      if (Math.random() < recruitmentStyleChangeChance(club.recruitmentStability)) {
        const options = RECRUITMENT_STYLES.filter((s) => s !== club.recruitmentStyle);
        club.recruitmentStyle = options[Math.floor(Math.random() * options.length)];
        changeCount++;
      }
    });
  });
  return { changeCount };
}
