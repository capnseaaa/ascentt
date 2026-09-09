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

// ===================== WORLD CALENDAR (year / month / week-of-year) =====================
// Ascentt uses a deliberate, idealized 52-week (364-day) game calendar
// year — a foundational rule, not a shortcut chosen just to make the math
// easy. It makes deriveCalendarDate a pure, permanently stable, closed-
// form function: the same World Week always produces the same year/
// month/week-of-year, forever — no leap years, no 53-week years, nothing
// that could ever drift or need reconciling. Year/month/week-of-year are
// NEVER stored anywhere; they only ever exist as the output of this
// function, computed on demand from World Week.
//
// 52 doesn't divide evenly into 12 real months, so months use the classic
// "4-4-5" fiscal-calendar pattern (each 13-week quarter split 4+4+5 weeks)
// — a genuine, long-established convention, not an arbitrary split
// invented to fill a table.
export const WEEKS_PER_YEAR = 52;
export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// 1-indexed week-of-year each month starts on. Sums to exactly 52.
export const MONTH_START_WEEKS = [1, 5, 9, 14, 18, 22, 27, 31, 35, 40, 44, 48];

export function deriveCalendarDate(worldWeek) {
  const yearIndex = Math.floor((worldWeek - 1) / WEEKS_PER_YEAR);
  const weekOfYear = ((worldWeek - 1) % WEEKS_PER_YEAR) + 1;
  let month = 0;
  for (let i = MONTH_START_WEEKS.length - 1; i >= 0; i--) {
    if (weekOfYear >= MONTH_START_WEEKS[i]) { month = i; break; }
  }
  return { year: yearIndex + 1, weekOfYear, month, monthName: MONTH_NAMES[month] };
}

// Given a target month/week-within-month, finds the next absolute World
// Week at or after `fromWorldWeek` whose derived calendar date matches —
// used only by CALENDAR_ANCHORED season anchors (not used by anything
// today, since every current competition stays ROLLING per product
// decision — this exists to prove the architecture supports a future
// calendar-anchored competition without needing new engine code when
// that day comes). Closed-form — not a search loop.
export function resolveCalendarAnchor(targetMonth, targetWeekWithinMonth, fromWorldWeek) {
  const targetWeekOfYear = MONTH_START_WEEKS[targetMonth] + (targetWeekWithinMonth - 1);
  const { year } = deriveCalendarDate(fromWorldWeek);
  let candidate = (year - 1) * WEEKS_PER_YEAR + targetWeekOfYear;
  if (candidate < fromWorldWeek) candidate += WEEKS_PER_YEAR; // this year's occurrence already passed — use next year's
  return candidate;
}

// ===================== COMPETITION SEASON TEMPLATE =====================
// A template is season-relative and reusable across every season — it
// never stores an absolute World Week. `anchorRule` says how to compute
// THIS season's anchor (ROLLING: right after last season ended, unchanged
// mechanism; CALENDAR_ANCHORED: a specific real calendar month/week,
// closed-form via resolveCalendarAnchor). `activeWindowOffsets` and
// `cupWindowOffsets` are both relative to whatever anchor gets resolved —
// a competition never needs its own bespoke anchor logic; cups in
// particular simply reuse their host pyramid's already-resolved anchor
// (see resolveCupSeasonCalendar below), not an independently-computed one.
// `successorTemplateId` lets a one-off transitional season (e.g. a future
// MLS Sprint Season) hand off to a different template for the following
// season — expressed as data, never as a special-case branch anywhere in
// this file.
export function createCompetitionSeasonTemplate({ id, anchorRule, seasonLengthWeeks, activeWindowOffsets, cupWindowOffsets = null, successorTemplateId = null }) {
  return { id, anchorRule, seasonLengthWeeks, activeWindowOffsets, cupWindowOffsets, successorTemplateId };
}

// Resolves an anchor rule into a single absolute World Week. ROLLING
// defers entirely to the existing, unchanged rolling mechanism
// (computeNextSeasonStartWeek) — this function doesn't reimplement it,
// only dispatches to it.
export function resolveSeasonAnchor(anchorRule, context) {
  if (anchorRule.mode === "ROLLING") {
    return computeNextSeasonStartWeek(context.outgoingTierCalendarProfiles || [], context.outgoingCupCalendarProfiles || []);
  }
  if (anchorRule.mode === "CALENDAR_ANCHORED") {
    return resolveCalendarAnchor(anchorRule.targetMonth, anchorRule.targetWeekWithinMonth, context.fromWorldWeek);
  }
  throw new Error(`resolveSeasonAnchor: unknown anchor mode "${anchorRule.mode}"`);
}

// Resolves a template's regular-season windows into an absolute
// CalendarProfile for ONE specific season, given an already-known anchor.
// Produces the exact same shape createCalendarProfile always has —
// activeWeeksOf/isWeekActive/assignFixturesToCalendar/
// isCompetitionScheduleComplete all keep working completely unchanged
// regardless of which anchor mode produced the anchor passed in here.
export function resolveCompetitionCalendar(template, anchorWorldWeek) {
  const activeWindows = template.activeWindowOffsets.map(([s, e]) => [anchorWorldWeek + s, anchorWorldWeek + e]);
  return createCalendarProfile({
    id: template.id,
    seasonStartWeek: anchorWorldWeek,
    seasonEndWeek: anchorWorldWeek + template.seasonLengthWeeks - 1,
    activeWindows,
  });
}

// Cup-specific resolution: turns a template's round-offset list into an
// absolute, this-season-only sparse CalendarProfile, sharing the SAME
// anchor World Week its host pyramid's leagues already resolved this
// season — never an independently-computed anchor, never a permanent
// absolute week stored anywhere. This is the direct fix for the confirmed
// bug where cup checkpoints could never fire again after early season 1
// (the old cup profiles were computed once, at module load, and never
// re-anchored).
export function resolveCupSeasonCalendar(template, hostAnchorWorldWeek) {
  const weeks = template.cupWindowOffsets.map((offset) => hostAnchorWorldWeek + offset);
  return createSparseWeeksProfile(template.id, weeks);
}


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
