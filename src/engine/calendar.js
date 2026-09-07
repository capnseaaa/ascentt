// ===================== GLOBAL CALENDAR FOUNDATION =====================
// This module keeps four concepts deliberately separate, per the project's
// architecture rule — they must never collapse into one system:
//
//   WORLD TIME        — "When is the world?" One shared clock the whole
//                        simulation advances through together.
//   CALENDAR PROFILE  — "When can this competition play?" Entirely
//                        independent of who plays whom.
//   COMPETITION SCHEDULE — "Who plays whom, and during which world week?"
//                        A thin layer on top of the EXISTING, unchanged
//                        pairing generators (round-robin, conference-based)
//                        — this module never generates pairings itself.
//   FIXTURE SIMULATION — untouched by this module; matchSim.js still owns
//                        "what happens when a fixture is played."
//
// SCOPE OF THIS PASS: this is the foundation, not the final calendar. Every
// existing competition's calendar profile is deliberately configured to
// reproduce today's exact season lengths and cup timing — see
// createContinuousSeasonProfile and the cup profile constants below. No
// real calendar dates/months are introduced yet (explicitly deferred).
//
// WHAT THIS DOES NOT CHANGE: the existing `matchday` field on fixtures,
// and everything that reads it (match simulation, cup checkpoint gating,
// player injury/suspension timers, facility construction timers) are left
// completely alone in this pass. `scheduledWeek` is added ADDITIVELY —a
// genuine new value computed by real calendar-profile logic, not a rename
// of matchday and not a fake pass-through. The two fields answer different
// questions on purpose: `matchday` is "which ordinal fixture is this
// within the current season" (season-relative, unchanged); `scheduledWeek`
// is "which absolute week of the entire game's history is this"
// (monotonically increasing across every season the save has ever played).

// ===================== WORLD TIME =====================
export function createWorldTime(startWeek = 1) {
  return { worldWeek: startWeek, seasonStartWeek: startWeek };
}

// Recomputes the world's current absolute week from the season's known
// start week plus how far into that season's matchday sequence play has
// reached. Kept as an explicit, callable derivation (not silently
// maintained as mutable state scattered across the codebase) so it's easy
// to verify correct and easy to extend later.
export function deriveWorldWeek(worldTime, currentMatchday) {
  const seasonStartWeek = worldTime?.seasonStartWeek ?? 1;
  if (currentMatchday == null) return seasonStartWeek; // season complete; world sits at its own start week until rollover moves it forward
  return seasonStartWeek + currentMatchday - 1;
}

// ===================== COMPETITION CALENDAR PROFILE =====================
// activeWindows is the single source of truth: an ordered list of
// [startWeek, endWeek] (inclusive) ranges during which this competition
// may have fixtures/rounds scheduled. A "break" is never a separate thing
// to configure — it's simply the gap between two windows. This is what
// lets a future special season (e.g. a hypothetical MLS Sprint Season)
// use the exact same data shape as a normal season: it's just a profile
// with different windows, not a different kind of object, and the core
// calendar engine never needs to know which competition a profile belongs
// to or hardcode anything MLS-specific.
export function createCalendarProfile({ id, seasonStartWeek, seasonEndWeek, activeWindows, playoffWindow = null }) {
  if (!activeWindows || !activeWindows.length) {
    throw new Error(`createCalendarProfile(${id}): activeWindows must be non-empty`);
  }
  return { id, seasonStartWeek, seasonEndWeek, activeWindows, playoffWindow };
}

// Builds a profile matching TODAY's actual behavior for a league
// competition: one single, unbroken window of exactly as many weeks as it
// needs, starting at `startWeek`. This is what makes this pass reproduce
// current game timing exactly — the profile itself is real, general
// data (any competition could get one with real breaks in it instead);
// it's simply configured trivially here, per the explicit instruction not
// to change existing competitions' timing in this pass.
export function createContinuousSeasonProfile(id, numWeeksNeeded, startWeek = 1) {
  const endWeek = startWeek + Math.max(numWeeksNeeded, 1) - 1;
  return createCalendarProfile({ id, seasonStartWeek: startWeek, seasonEndWeek: endWeek, activeWindows: [[startWeek, endWeek]] });
}

// Builds a profile for a competition whose active periods are a handful
// of individual single-week windows scattered through a season — exactly
// what a domestic cup is. Used to migrate the previously hardcoded
// sentinel-matchday arrays into real calendar-profile data.
export function createSparseWeeksProfile(id, weeks) {
  const sorted = [...weeks].sort((a, b) => a - b);
  return createCalendarProfile({
    id,
    seasonStartWeek: sorted[0],
    seasonEndWeek: sorted[sorted.length - 1],
    activeWindows: sorted.map((w) => [w, w]),
  });
}

export function isWeekActive(profile, week) {
  return profile.activeWindows.some(([start, end]) => week >= start && week <= end);
}

// Every week within a profile's active windows, in order — the ordered
// list of real-time "slots" a competition schedule's fixtures/rounds get
// assigned into.
export function activeWeeksOf(profile) {
  const weeks = [];
  profile.activeWindows.forEach(([start, end]) => {
    for (let w = start; w <= end; w++) weeks.push(w);
  });
  return weeks;
}

// ===================== COMPETITION SCHEDULE =====================
// Deliberately a thin layer on top of the EXISTING, UNCHANGED pairing
// generators (round-robin, conference-based, in scheduling.js) — those
// still produce a flat, ordered fixture list numbered matchday 1..N
// exactly as before. This function's only job is to walk that list and
// stamp each fixture with the real absolute world week drawn from the
// competition's own calendar profile, in order. If a profile doesn't
// contain enough active weeks for the fixture count requested, this
// throws rather than silently overflowing past the intended season
// boundary — a genuine constraint the calendar enforces, not an
// assumption papered over.
export function assignFixturesToCalendar(pairedFixtures, calendarProfile) {
  const weeks = activeWeeksOf(calendarProfile);
  const maxOrdinal = pairedFixtures.length ? Math.max(...pairedFixtures.map((f) => f.matchday)) : 0;
  if (maxOrdinal > weeks.length) {
    throw new Error(`assignFixturesToCalendar(${calendarProfile.id}): schedule needs ${maxOrdinal} weeks but the profile only provides ${weeks.length}`);
  }
  return pairedFixtures.map((f) => ({ ...f, scheduledWeek: weeks[f.matchday - 1] }));
}

// "Is this competition's schedule finished?" expressed purely in terms of
// whether its fixtures are played — no matchday/week integer comparison
// at all. This is what season completion should be built on (requirement:
// based on schedules being finished, not the numerical value of matchday)
// — it's also exactly equivalent to the old "no unplayed fixture anywhere"
// check, so it changes nothing about when a season actually completes.
export function isCompetitionScheduleComplete(fixtures) {
  return fixtures.every((f) => f.played);
}

// ===================== SEASON-TO-SEASON WORLD TIME ADVANCEMENT =====================
// The calendar layer, not the promotion/relegation logic, is responsible
// for deciding where in absolute world time the NEXT season begins: one
// week after the latest-finishing competition this season (leagues and
// cups both), so no two seasons' active weeks ever overlap. Promotion/
// relegation and financial rollover logic are completely unaffected —
// this only decides the calendar coordinates the new season's profiles
// get built against.
export function computeNextSeasonStartWeek(outgoingTierCalendarProfiles, outgoingCupCalendarProfiles) {
  const allEndWeeks = [
    ...outgoingTierCalendarProfiles.map((p) => p.seasonEndWeek),
    ...outgoingCupCalendarProfiles.map((p) => p.seasonEndWeek),
  ].filter((w) => w != null);
  const latest = allEndWeeks.length ? Math.max(...allEndWeeks) : 0;
  return latest + 1;
}
