import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Trophy, TrendingUp, TrendingDown, Users, Sliders, Calendar, ShoppingBag, Award, ChevronRight, X, ArrowUpCircle, ArrowDownCircle, RotateCcw, GraduationCap, Lightbulb, DollarSign, Star, Newspaper } from "lucide-react";
import { academySigningCost, academyStarsForInvestment, clamp, draftProspectValue, generateAcademyProspect, generateTryoutCandidates, growPlayer, promoteYouthToFirstTeam, tryoutCost, tryoutSigningCost, youthSaleValue } from "./engine/playerGen";
import { ACADEMY_INVEST_INCREMENT, ACADEMY_MAX_PROSPECTS, ACADEMY_PROMOTE_MIN_AGE, ACADEMY_START_COST, DEFAULT_MANAGER_HISTORY, DEFAULT_WORLD_RECORDS, DIFFICULTY_MODES, DP_REPUTATION_BUMP, EFL_CUP_ROUND_MATCHDAYS, ENGLAND_TIER_META, FA_CUP_ROUND_MATCHDAYS, FORCED_DEPARTURE_BENCH_THRESHOLD, FORMATION_NOTES, FULL_TIER_META, MANAGER_KEY, MARKET_PAGE_SIZE, MAX_DESIGNATED_PLAYERS, MAX_POSTSEASON_ROUNDS, MAX_SQUAD_SIZE, MIN_SQUAD_SIZE, MLS_SALARY_CAP, MLS_TOTAL_ROUNDS, PARACHUTE_PAYMENT_SCHEDULE, PROMO_TOTAL_ROUNDS, SACK_THRESHOLD, STORAGE_KEY, TIER_META, USLC_TOTAL_ROUNDS, US_OPEN_CUP_ROUND_MATCHDAYS, US_OPEN_CUP_TOTAL_ROUNDS } from "./engine/constants";
import { buildEnglandWorld, buildFullWorld } from "./engine/worldBuild";
import { boardHappinessDelta, boardMessageNoticeText, checkBoardMessageCompliance, computeHints, computeInboxUrgentCount, generateBoardMessage, generateBoardObjective, generateJobOffer, jobOfferChanceFor } from "./engine/board";
import { computeSeasonAwards, computeSeasonPlayoffs, computeUserPlayoffQualification, generateDoubleRoundRobin, getCurrentMatchday, maybeTriggerMidWindow, resolveKnockoutMatch, rolloverEnglandSeason, rolloverSeason } from "./engine/leagueSim";
import { clubLineRatings, computeMatchOutcome, computeTable, isAvailable, isRivalryMatch, simulateMatch, simulateMatchdayAcrossTiers, startingXI, xiLineRatings } from "./engine/matchSim";
import { checkTransferRecord, computeRecommendationScore, effectivePayroll, isFinanciallyRisky, marketValue, ownershipDepositFor, recommendationReason, renewalOutcome, runAiToAiTransfers } from "./engine/finance";
import { cupRoundLabel, drawNextEnglandCupRound, drawNextUsOpenCupRound, isCupCheckpointPending, pendingEnglandCupCheckpoint, previewStageLabel, resolveCupRoundInPlace, resolveEnglandCupRoundInPlace } from "./engine/cups";

/* ============================================================
   FICTIONAL WORLD DATA
   ============================================================ */

// Each pool pairs first/last names from the same background so names stay
// coherent (no "Aki Silva" mismatches) while the roster as a whole is
// genuinely international, the way a real lower-division squad would be.
// Fisher-Yates — used for random knockout pairings (e.g. the US Open Cup)
// where seeding isn't based on standings, just a blind draw.
// Growth room shrinks with age and is capped out by 29 — a 29+ player's
// potential is just their current overall, they are who they are. Young
// players carry a real gap. A rare dice roll (breakout / late bloomer) can
// push someone past what their age curve would normally allow.
// Realistic age spread for generated squads/markets: a fat wonderkid/youth
// tail, a big prime-age bulge, and a real (if smaller) veteran tail — rather
// than a flat 18-33 distribution that starves the market of both ends.
// Retirement odds climb steeply from 34, essentially forced by 41 — most
// players never see 38, a handful grind on to 40.
// A player's own tier realistically caps how far their overall can climb
// through ordinary season-to-season growth. Indexed like FULL_TIER_META
// (0-3 USA MLS→USL2, 4-7 England PL→League Two). Without this, a talented
// low-tier player who never gets scouted or transferred up (the game
// doesn't simulate AI-to-AI transfers) could organically grow all the way
// to the same 99 ceiling as a genuine Premier League/MLS star, which reads
// as completely unrealistic for e.g. a USL Championship squad.
// Rebalanced after feedback that MLS/USL were dominating the very top of
// the market's rating sort ahead of Premier League — the Premier League
// should clearly sit above every American tier, and USL Championship's
// ceiling in particular was still too high.
// Called once per player at every season rollover: ages them a year and
// moves their overall toward (or past) their potential, then declines it
// once they're aging out. Sub-attributes drift loosely along with overall.
// tierIdx (0-7, FULL_TIER_META order) is optional — omitting it (e.g. for
// a one-off call with no tier context) leaves growth uncapped as before.
/* ============================================================
   DIFFICULTY MODES & REALISTIC WAGES
   ============================================================ */

// Annual wage bands per tier, loosely calibrated to real USL/MLS CBA figures.
// USL League Two pays nothing — it's amateur/NCAA-eligible status, by rule.
// ============================================================
// ENGLAND (IN PROGRESS) — not yet wired into the country selector.
// Real 2026-27 Premier League club list confirmed via research:
// promoted Coventry City / Ipswich Town / Hull City replacing
// relegated West Ham United / Burnley / Wolverhampton Wanderers.
// PREMIER_LEAGUE_CLUBS is the full 20-club name list; ENGLAND_ROSTERS
// currently has real, researched 2025-26 rosters for 6 of those clubs
// (the rest still need the same research pass MLS/these six got).
// Ratings are calibrated against real FIFA/EA FC-style overalls, NOT
// rescaled to MLS's numeric range — the Premier League is a genuinely
// stronger league than MLS, so its numbers run higher on purpose.
// ============================================================
// Confirmed 2026-27 EFL Championship 24-club list (real, researched).
// Rosters not yet researched — Premier League tier is done, Championship
// is the next big research push (24 clubs, same depth as PL took).
// Confirmed real 2026-27 club lists (24 clubs each). Per direction: from
// here on, League One and League Two use generated rosters, not
// researched real player data — real club names, generated squads,
// matching how USL League One/Two already work in the USA pyramid.
// Full 4-tier England pyramid. Premier League + Championship use real,
// researched rosters (ENGLAND_ROSTERS); League One + League Two use
// generated squads at their own baseRating — real club names, generated
// players, exactly like USL1/USL2 already work for the USA pyramid.
// Simplification, stated plainly: promotion/relegation math is shared
// with the existing engine (flat top-3/bottom-3 rule), not yet England's
// real varied playoff shapes per tier — that's a separate follow-up.
// The combined world — USA's 4 tiers (ids 0-3) and England's 4 tiers (ids
// 4-7) coexisting side by side. They don't connect to each other (no
// promotion/relegation between USL League Two and the Premier League —
// they're separate pyramids), but they share one player pool for the
// transfer market, so a save can browse and sign from either country
// regardless of which club you manage. Name generation is shared across
// both halves so no two generated players anywhere in the world collide.
// Reputation isn't flat — a club built around real quality talent starts
// with real prestige/expectations attached, same as a legacy big-market club
// vs a scrappy newly-promoted side in real life.
/* ============================================================
   WORLD BUILD — 3-tier pyramid
   ============================================================ */

// Combined USA + England tier metadata, ids 0-3 and 4-7 respectively —
// used wherever a screen (like the Market) needs to look up tier
// name/color/baseRating across the whole shared world.
// USL Championship — the actual second tier of American soccer, 25 clubs
// as of the 2026 season. Club identities are real; since fcratings/EA don't
// rate USL players the way they do MLS, individual rosters here are
// generated (same engine as the lower tiers) rather than scraped real players.
// USL League One — the real third tier, 17 clubs as of the 2026 season.
// USL League Two — real fourth tier, semi-pro/pre-professional. The actual
// league has 158 clubs across 20 regional divisions, far too many to model
// individually, so this is a representative sample of 20 real, currently
// active clubs rather than the full membership.
/* ============================================================
   ACADEMIES — MLS & USL Championship clubs only, sticky once started
   ============================================================ */

// Real academies run a curated intake, not an open-ended pipeline — capping
// it keeps the youth ranks feeling like a hand-picked crop of prospects
// rather than a warehouse you keep stocking indefinitely.
// Academy prospects start at 12 — low current ability, but potential scales
// with academy quality (a better academy finds and nurtures better talent).
// Academy quality decides development speed — a 5-star academy grows a kid
// noticeably faster per year than a fresh 1-star setup.
// Real transfer fees for academy prospects track CURRENT ability first —
// scouts pay a premium for a promising ceiling, but a modest one, not the
// reverse. The old formula scaled off raw potential alone
// (pow(potential, 2.4)), so a barely-developed prospect with a lucky high
// potential roll could fetch six figures before ever playing a competitive
// minute. Below a 60 overall — genuinely still a project, not yet
// first-team caliber — value now stays low and grows with actual ability,
// with a capped potential bonus layered on top. At 60+ overall, a prospect
// is priced exactly like a real player (using the same market curve),
// never more.
/* ============================================================
   OPEN TRYOUTS — USL League One & Two only (no academies there)
   ============================================================ */

/* ============================================================
   HINTS — simple rule-based "what should I do next" suggestions
   ============================================================ */

/* ============================================================
   LEAGUE-WIDE DRAFT — MLS SuperDraft style
   ============================================================ */

// Round 1-3 -> MLS, rounds 4-5 -> USL Championship, round 6 -> USL League One.
// Order within each round is reverse of that tier's just-completed standings
// (worst finisher picks first), mirroring how real sports drafts work.
// Runs the whole draft against the tables computed for the season that just
// ended. Mutates newTiers directly for every AI pick; the user's own pick(s)
// come back separately so the UI can offer Keep/Sell before touching state.
/* ============================================================
   FIXTURE GENERATION (circle method, single round-robin)
   ============================================================ */

// Double round-robin — everyone plays everyone home AND away, matching
// real England scheduling (PL: 20 clubs x 38 games, Championship/L1/L2:
// 24 clubs x 46 games each). Reuses the single round-robin twice, second
// leg with home/away swapped and matchdays offset.
// Generalized promotion playoff: top `autoCount` places promote automatically,
// then a 4-team knockout among the next 4 places (autoCount+1..autoCount+4)
// decides the final promotion spot. autoCount=2 covers Championship/League
// One (top 2 + playoff among 3rd-6th); autoCount=3 covers League Two (top 3
// + playoff among 4th-7th) — both real English formats.
// Which tier (by global id) has a promotion playoff, and how many auto-
// promote ahead of it — Championship and League One both auto-promote 2
// with a playoff for the 3rd spot; League Two auto-promotes 3 with a
// playoff for the 4th. Premier League has no playoff since nothing
// promotes into it from outside the pyramid.
// Draws the 4-team bracket (who plays whom) without resolving any
// matches yet — lets the UI show the pairing before simulating.
// Whether the user's own club sits in the playoff-qualifying range (not
// auto-promoted, not safely out of contention) at the tier they finished
// the season in — used to decide whether "View Promotion Playoff" should
// even be offered, versus going straight to "Continue to Next Season".
// MLS's shape (tier 0 has no real promotion in, tier 1 always runs a
// "USL Championship" playoff) and would give wrong results here. Real
// per-boundary shape used below:
//   PL <-> Championship: bottom 3 of PL relegated; Championship top 2
//     auto-promote + playoff among 3rd-6th for the 3rd spot.
//   Championship <-> League One: bottom 3 of Championship relegated;
//     League One top 2 auto + playoff among 3rd-6th.
//   League One <-> League Two: bottom 4 of League One relegated; League
//     Two top 3 auto + playoff among 4th-7th (League Two's own bottom 2
//     are NOT relegated — there's no tier below it in this game, same as
//     USL League Two never relegates out in the USA pyramid).
// Scope, stated plainly: this handles table movement, fixture
// regeneration, player aging/retirement (reusing the generic
// growPlayer/retirementChance already used for MLS), and Premier League
// relegation parachute payments (see PARACHUTE_PAYMENT_SCHEDULE below).
// Still deferred: wages/contracts/reputation drift/general prize money for
// England — no DP/salary-cap economy the way MLS has one, and building
// that out is separate follow-up work, not something quietly skipped.
// PL relegation parachute payments — real Premier League policy: a
// relegated club gets 3 years of declining payments to cushion the drop
// from PL broadcast revenue to Championship money, since that gap is
// enormous in reality. Stops early if the club gets promoted straight
// back to the Premier League (no longer needs cushioning).
/* ============================================================
   MATCH ENGINE — ported from match_engine.py, extended with formations,
   card accumulation/suspensions, and appearance tracking
   ============================================================ */

// One-line "what this is good for" so the formation buttons aren't just
// unlabeled shapes — helps connect the choice to your actual squad.
// Best XI = your most talented available players, full stop — fitness and
// morale still affect how well they PERFORM once selected (via
// effectiveRating during match simulation), but shouldn't reorder who gets
// picked in the first place. Previously this used effectiveRating for
// selection too, so a much lower-overall but fully-fit player could
// outrank a genuine star who was merely tired — "Best XI" wasn't
// actually picking your best players. A small penalty only kicks in once
// fitness gets genuinely risky (below 40), as a fatigue-injury safety
// margin, not a ranking swing. Youth prioritizes youngest players (weaker
// on paper, but they get the caps/growth), tie-broken by rating. Auto is
// rating with a fitness nudge, so tired starters naturally rotate for
// fresher legs rather than always fielding the same XI regardless of
// fatigue.
// Formation-aware XI picker: fills each positional bucket according to the
// club's lineup mode, then backfills any shortfall with the best remaining
// available players so a thin squad still fields close to 11. This is also
// used by the Tactics tab to preview the projected lineup before playing it.
// Cup matches always use the 9999 sentinel matchday — used here to detect
// "this is a cup match" so hold-back-for-cup preferences apply.
// Club-level DEF/MID/ATT star ratings (out of 5), based on the average
// overall of the best players in each line — roughly how many would start.
// Star ratings are for display/reasoning only — the actual match engine
// uses raw overalls via effectiveRating/squadStrength, never these star
// buckets.
//
// This briefly used a percentile-within-tier scale instead of this fixed
// formula, to spread ratings out more (checked against real MLS data, the
// fixed formula did compress 28 of 30 clubs into a single 2.5★ defense
// bucket). But percentile ranking meant a tier's best club always showed
// 5★ regardless of that tier's actual absolute quality — a "5-star" USL
// Championship defense could still lose to a mediocre MLS attack, which
// read as nonsensical ("5 stars in all but I still lose"). Reverted back
// to the absolute scale: stars reflect real ability level, not just rank
// within your own tier, even if that means some tiers rarely show the
// full range.
// Same star scale as clubLineRatings, but scoped to only the players
// actually in the current starting XI — distinct from the whole-squad
// overview, since a thin bench or an injury crunch should visibly show up
// here even if the squad overall still looks strong.
function StarRow({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push("★");
    else if (i === full && half) stars.push("⯨");
    else stars.push("☆");
  }
  return <span style={{ letterSpacing: 1 }}>{stars.join("")}</span>;
}

// Playing alongside a genuine Designated Player star gives the whole team a
// small confidence lift — separate from and stacked on top of the
// captaincy bonus, capped so it's a nice-to-have rather than a way to
// trivialize match strength through DP stacking alone.
// A player whose frustration (benchStreak) runs this far past the ordinary
// transfer-request threshold has reached a genuine point of no return —
// roughly a season and a half of being left out entirely, ignored, with
// no intervention. Unlike an ordinary transfer request (always defusable
// by unlisting), a player past this point leaves for good at the next
// rollover, no exceptions.
// A fit player left out of the XI match after match gets restless — real
// squad players expect game time. But in reality, an average squad player
// grumbles and loses morale; he doesn't actually walk out over it. It's
// specifically the bigger egos — genuine stars, or a highly-touted young
// player who knows he's destined for better — who'll actually push for a
// move over being benched. Skipped entirely in Rookie mode, which is
// meant to be consequence-light while learning the systems; Pro and
// Executive both have it active.
// A player can only pick up one yellow per match — a second is a red and a
// sent-off. Picking up a yellow in two consecutive matches they played also
// triggers a 1-match suspension (mirrors real accumulation rules, simplified).
/* ============================================================
   TABLE / STANDINGS
   ============================================================ */

/* ============================================================
   SEASON ROLLOVER — promotion/relegation + contracts
   ============================================================ */

// each tier's prize pool shrinks ~7% every season
// hard floor per tier, so decay never bottoms out

// Guaranteed yearly backing from ownership, paid to every club regardless of
// standing — separate from performance bonuses, and sized so a typical squad
// at that tier can actually afford to renew contracts even in a bad season.
// Premier League bumped up after feedback that funds weren't keeping pace
// with real PL-scale wage bills (a full 25-player squad can easily run
// $100M+ in wages alone) — the other tiers are unchanged.
// On Pro/Executive, clubs actually have to fund a real payroll out of this
// money, so the deposit scales up accordingly — mainly matters for MLS,
// where wages can run high; the other tiers' payrolls were already roughly
// in range of their Rookie-level deposit.
// A simple, deterministic string hash — used so a club's funding
// "inconsistency" is stable (same club always lands on the same value)
// rather than re-rolling randomly every time this gets called.
// Real-calibrated season-end bonuses for Pro/Executive mode. For MLS this is
// currently Shield-style money (best regular-season record) — the actual
// MLS Cup / conference / playoff-qualifier bonuses layer in once playoffs
// exist, since those are genuinely playoff-outcome money, not table money.
// USL League Two is intentionally all zeros — amateur status, no bonuses.
// Decays each tier's pool, then floors it against the tier below — the
// lowest tier's pool is the floor for the tier above it, cascading upward,
// so promotion never leaves a club worse off than it would have been had it
// stayed down, even after years of decay.
// A club can't field a competitive team below this — real leagues require a
// minimum registered roster, and a squad this thin can't survive a single
// bad injury run without failing to have 11 fit players.
// Flat emergency funding per missing player, scaled by tier (MLS running out
// of players costs a lot more to fix than a USL2 club needing a couple of
// amateurs) — this is what a club gets when it drops below the minimum
// squad size, meant to be enough to realistically sign back up to strength,
// not free extra budget.
// Checks whether a club has enough players to field a team, and applies or
// clears the "disqualified" flag accordingly. A club dropping below the
// minimum gets a one-time flat injection (scaled by tier, financial
// situation, and how many players they're actually short) to help dig out —
// while disqualified their fixtures still simulate (see
// simulateMatchdayAcrossTiers) but always resolve as a loss, since they
// can't field a real side. Returns { club, notice } — notice is only set on
// the season a club newly crosses into or out of disqualification.
// Keeps a squad from growing forever — draft picks, academy promotions, and
// AI replacements are all pure additions with nothing forcing a release, so
// without this a club's roster (and the whole saved game state) grows every
// single season without bound. Releases the lowest-value players first
// (weighted toward keeping the young/high-potential ones).
/* ============================================================
   PLAYOFFS — MLS Cup bracket + lower-tier promotion playoffs
   ============================================================ */

// Real 2026 MLS conference alignment for the 30 original clubs. Any club
// that enters MLS later (promoted from USL Championship, or an expansion
// filler) doesn't have a real-world conference, so it gets assigned
// whichever side is currently smaller — and that assignment sticks on the
// club from then on, so the split can't silently drift lopsided over a long
// save (which used to make the whole bracket function bail out entirely).
// Ensures every MLS club has a sticky conference, self-balancing any club
// that doesn't have a real-world one yet (new expansion filler, or a club
// freshly promoted from USL Championship).
// Resolves a single knockout match to a decisive winner — no draws allowed
// in playoff football, so a tied 90 minutes goes to a simplified penalty
// shootout weighted by relative squad strength rather than a full
// kick-by-kick simulation.
// Best-of-three: higher seed hosts games 1 and 3, lower seed hosts game 2.
// Each individual game still can't end level, so ties go to the same
// simplified shootout as any other knockout match.
// Full 18-team MLS Cup Playoffs: wild card, best-of-three Round One, single-
// elimination conference semis/finals, then the Cup final. Purely a trophy
// and bonus exercise — it never affects promotion or relegation.
// For USL Championship / League One / League Two→League One boundaries: top
// 2 by table promote automatically, and the last spot goes to a 4-team
// playoff among 3rd-6th place (3v6, 4v5 semis, then a final).
// A flat (no conferences) single-elimination bracket seeded straight off the
// table — used for USL Championship's real playoff, which crowns its own
// champion separately from the regular-season "Players' Shield" table
// topper, same relationship as MLS Cup vs Supporters' Shield.
/* ============================================================
   US OPEN CUP — real bracket structure, adapted for this world's roster
   sizes (30 MLS / 25 USLC / 17 USL1 / 20 USL2). Entrants join at
   different rounds, same as the real tournament: all 20 USL2 clubs start
   in Round 1; all 17 USL1 clubs plus the top 16 USLC clubs (by standings)
   join at Round 2; the bottom 16 MLS clubs (by standings — the rest are
   presumed occupied elsewhere) join once the bracket reaches "Round of
   32". A single-elimination, one-off match throughout — no home/away
   legs. Whenever the pool at a round is odd, one random entrant gets a
   bye to the next round, same as the real Open Cup handles byes.
   ============================================================ */

// A cup match couldn't care less about a club's league position — every
// entrant here is wrapped with the tier it came from, purely so the
// giant-killer bonus (a lower-league team beating a higher-league one)
// can be detected and so the bracket display can show tier badges.
// FA Cup: real staggered entry — League Two and League One enter first,
// Championship joins two rounds later, Premier League joins after that —
// same shape as the real competition's early rounds feeding into where
// the top two tiers come in. EFL Cup: all four tiers enter together from
// Round 1, same as the real competition (a flatter, more egalitarian
// format than the FA Cup). Both reuse the same generic knockout engine
// as the US Open Cup — draw pairs, resolve, advance, repeat until one
// champion remains; uneven pools get a bye exactly like the US version.
// Real per-round prize money (winner's payout for reaching/winning that
// stage), from actual FA Cup / EFL Cup figures. My bracket's total round
// count varies (bigger tiers joining partway through means it isn't
// always exactly the real competition's 7 stages), so rather than index
// by round number directly, each round's prize is picked by how many
// rounds remain until the final — estimated from the pool size about to
// play (roundsRemaining = ceil(log2(poolSize))). That keeps the correct
// large prizes attached to the true Quarterfinal/Semifinal/Final stages
// regardless of how many smaller-tier rounds came before them, and any
// stage further out than "Round 1" just repeats the Round 1 figure —
// realistic, since lower-league qualifying-adjacent rounds don't pay much
// more than that in reality either.
// real FA Cup detail — losers at this stage still get a payout to help lower-league finances

// englandTiers is always the local 4-tier slice (indices 0-3 = PL,
// Championship, League One, League Two), independent of where England
// sits in the combined world — same pattern rolloverEnglandSeason uses.
// Real FA Cup / EFL Cup round names — both competitions use the same
// naming convention (Round 1 through Round 4, then Quarterfinal,
// Semifinal, Final), unlike a generic bracket's "Round of 32" style
// labels. Rounds 1 (and 2, and — for the FA Cup — 3) are structurally
// fixed by which tiers enter when, so those are labeled directly by
// round index. After every tier has entered, the pool only ever shrinks
// (halving, occasionally with a bye), so from that point on the label is
// picked by estimating rounds remaining until the final from the current
// pool size — the same estimate the prize money uses — which correctly
// identifies Round 4/Quarterfinal/Semifinal/Final regardless of exactly
// how many bye-driven extra rounds a particular bracket needs.
// For preview contexts (upcoming schedule, "next round" banners) that only
// have a round index and no pool to estimate from yet — a simpler, looser
// label than the precise one a played round gets.
// Deterministic given this world's fixed pyramid sizes (20/17/16/16
// entrants joining at their fixed points always cascades through exactly
// 8 rounds to a single champion).
// The cup runs DURING the season now, not after it — these are the league
// matchday numbers before which a cup round is due. When the next league
// matchday equals one of these, league play for that turn is replaced by
// a cup round instead (the league fixtures aren't skipped, just delayed —
// they play out normally on the next turn once the cup round is cleared).
// Spread through the first half of the season and capped at 17 so it
// still fits and wraps up comfortably even for USL1 (this world's
// shortest single round-robin, at 17 matchdays), while finishing well
// before MLS's own regular season and playoffs.
// Shared by the bulk-sim loops (checking against a live `next` draft) and
// the component-level pending-round indicator (checking against `state`) —
// both just need "is round N due, and hasn't it been played yet".
// Builds the entrant pool for the next round without resolving anything —
// shared by the preview draw and the actual play-the-round path.
// Draws (but does not play) the next round — a stable pairing that can be
// shown as "who you're about to play" before the match actually happens.
// Store the result and reuse it when actually resolving, since drawing
// again would shuffle to a different pairing.
// Plays exactly the next round of the US Open Cup and returns updated
// progress. `progress` is null/undefined before Round 1. `qualifiers` is
// last season's final standings ({ uslcTop16, mlsBottom16 } club ID
// arrays) — real Open Cup qualification is based on the PREVIOUS season,
// not whatever's in progress this year. In Season 1 there is no previous
// season, so this falls back to current standings just that one time.
// `preDrawn`, if provided (from drawNextUsOpenCupRound), is resolved
// as-is instead of drawing a fresh pairing — keeps the previewed
// opponent consistent with what actually gets played.
// Resolves exactly one cup round in place against a live `next` draft:
// updates next.usOpenCup and pays out prize money the moment it's earned.
// Returns the newly-played round (for recap purposes). Shared by the
// manual "Play This Round" button and the bulk Sim Season / Sim to
// Window auto-resolution.
// Same shape as resolveCupRoundInPlace, for whichever of England's two cups
// (cupKey: "fa" or "efl") is due. Both live in next.faCup/next.eflCup.
// Checks both of England's cups — returns the cup key ("fa"/"efl") whose
// round is due this matchday, or null. USA's isCupCheckpointPending stays
// untouched; this is the England-side equivalent, checked separately since
// an England user's own tier never overlaps with USA's checkpoint schedule.
/* ============================================================
   BOARD PRESSURE — Executive mode only
   ============================================================ */

// Higher-reputation clubs get more demanding objectives, same way a
// legacy contender's board expects more than a newly-promoted club's does.
// Reputation bands don't line up the same way across tiers though — MLS
// reputations cluster ~66-87 while USLC sits ~36-50, so an absolute
// threshold (e.g. reputation >= 75) makes almost every MLS club look like
// a title contender while almost no USLC club ever does. Rank the club's
// reputation against its own tier-mates instead, so "title expectations"
// means "one of the best in this tier" everywhere, not "above a fixed number".
// Picks the squad's weakest position by average overall, and a target
// overall a real step above that average — used to generate the "nosey
// board" transfer demand. Deliberately squad-driven rather than pointing
// at one specific named player (whoever's actually weak, not a fixed
// target that might get bought/sold from under the message by someone
// else before the manager can act).
// The board's demands aren't just "sign this position" anymore — a real
// board also weighs in on tactics and squad usage. Four kinds, randomly
// chosen; each carries everything checkBoardMessageCompliance needs to
// resolve it later without re-deriving anything.
// Resolves a pending board message against what actually happened this
// season. clubPre is the club's state going into rollover (reflects
// whatever tactics were last set); signings/loans are read from the
// season-scoped tracking arrays reset at every rollover.
// Scout tips were pulled back out for a design brainstorm before shipping
// — see chat history if picking this back up later.

// AI-to-AI transfers: until now, players only ever moved when the USER
// bought them — every other club's roster was frozen except for growth
// and rare replacement spawns. That's a real gap: no club ever sells its
// aging star, no rebuild ever happens, promotion/relegation never
// reshapes a squad. This runs once per season, within each tier (keeping
// it same-tier for now — cross-tier moves would need promotion-aware
// logic this doesn't have yet), a handful of attempts at a time so the
// world visibly moves without the whole pyramid churning every season.
// The user's own club is never touched, either as buyer or seller — this
// is strictly the world moving around them, not something being done TO
// them. Every completed deal is logged for the (upcoming) Historical
// Records / News Feed systems to read from.
// Designated Players' real wages don't count against effective payroll —
// mirrors how real MLS DP salaries are mostly exempt from the roster budget.
// Everyone else's wage counts normally.
// A real salary cap for MLS (Executive mode only, where DPs are enabled) —
// without this, Designated Player status was previously a pure freebie:
// it discounted a star's cap hit with nothing forcing anyone over budget in
// the first place. Now non-DP wages have to fit under this number; DPs are
// the ONLY way to exceed it, same as in real MLS. This applies to buying
// and renewing — an existing squad that's already over (e.g. after a wage
// bump elsewhere) isn't retroactively broken, but new spending is gated.
// A marquee DP signing raises what people expect of the club, same as a big
// splashy transfer in real life — reputation only ever ratchets UP from
// this, never down, so cutting a DP later isn't retroactively punished,
// it just stops earning the ongoing perks below.
// Playing alongside a genuine star lifts a team's confidence a little,
// separate from and on top of the captain's leadership bonus — capped so
// it stays a nice-to-have, not a way to trivialize match strength.
// Real Designated Players sell tickets and jerseys — a flat per-season
// revenue bump scaled to the DP's quality, on top of whatever prize money
// or event bonuses are already in play.
// Computes everything playoff- and promotion-related from the CURRENT
// (pre-rollover) standings — callable on its own once the regular season
// ends, so the result can be displayed as a real postseason before the
// player commits to rolling over. rolloverSeason() calls this itself if it
// wasn't given a precomputed result, so behavior is identical either way.
// End-of-season awards for a tier — Golden Boot, Best Young Player, and a
// simple Team of the Season (best-rated player at each slot). Computed
// from THIS season's data (goal tallies, current ratings) before rollover
// regrows/resets anything.
/* ============================================================
   TRANSFER MARKET (windowed — mirrors real preseason/midseason windows)
   ============================================================ */

// window opens once matchday 9 is complete

// Renewals aren't free or unlimited: a very unhappy player just says no, a
// merely unhappy one will only re-sign for a bigger bonus, and it always
// comes out of the budget.
// A club's best couple of players are its "untouchables" — real clubs don't
// routinely shop their two best players, and a DP-tier star getting listed
// alongside squad filler at the same rate was the bug behind Inter Miami
// casually selling Messi for pocket change. Rank 1-2 essentially never list;
// rank 3 can, but rarely.
// Runs a batch of AI market activity: some non-user players go up for sale,
// and some of those get bought by other AI clubs — so by the time the user
// opens the Market tab there's actually something there, and the whole
// pyramid keeps trading in the background between windows.
/* ============================================================ */
export { }; // marker (rest of file continues with React component)
/* ============================================================
   VISUAL TOKENS
   ============================================================ */

const PALETTE = {
  pitch: "#0F3D2E",
  pitchDark: "#0A2B20",
  parchment: "#F2EFE4",
  parchmentDim: "#E7E2D3",
  gold: "#C9A24B",
  silver: "#9BA8B0",
  bronze: "#B0703F",
  crimson: "#8C3A3A",
  ink: "#16232B",
  inkSoft: "#4A5A61",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap');`;

const display = { fontFamily: "'Oswald', sans-serif", letterSpacing: "0.02em" };
const serif = { fontFamily: "'Source Serif 4', Georgia, serif" };
const mono = { fontFamily: "ui-monospace, 'SF Mono', Consolas, monospace" };

function crestColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  return `hsl(${hue}, 45%, 32%)`;
}
function initials(name) {
  const words = name.replace(/\(.*\)/, "").trim().split(/\s+/).filter((w) => !/^(FC|SC|United|Town|City)$/i.test(w));
  const letters = (words.length ? words : name.split(" ")).slice(0, 2).map((w) => w[0]).join("");
  return letters.toUpperCase().slice(0, 3);
}

function Crest({ name, size = 40 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: crestColor(name), color: PALETTE.parchment,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: size * 0.36, flexShrink: 0,
        border: `2px solid ${PALETTE.parchmentDim}`, ...display,
      }}
    >
      {initials(name)}
    </div>
  );
}

// Simple relative-luminance check so badge text always reads clearly,
// regardless of how light or dark a given tier's color is (Premier
// League's dark purple needed light text; MLS's gold needed dark text —
// this picks the right one automatically instead of hardcoding per tier).
function readableTextOn(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16), g = parseInt(hex.substring(2, 4), 16), b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? PALETTE.ink : PALETTE.parchment;
}

function TierBadge({ tierId }) {
  const meta = FULL_TIER_META[tierId];
  return (
    <span
      style={{
        background: meta.color, color: readableTextOn(meta.color), padding: "2px 10px",
        borderRadius: 4, fontSize: 12, fontWeight: 700, ...display,
      }}
    >
      {meta.short}
    </span>
  );
}

/* ============================================================
   CLUB SELECT SCREEN
   ============================================================ */

function formatMoney(amount) {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    const rounded = Math.round(m * 10) / 10;
    const str = Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);
    return `$${str}M`;
  }
  return `$${Math.round(amount / 1000)}K`;
}

// Defensive guard against a corrupted or legacy numeric value (null,
// undefined, NaN) reaching a raw .toLocaleString() call, which throws on
// null/undefined (unlike comparisons or arithmetic, which just silently
// coerce). A NaN value written to state before a fix landed also comes
// back as null after a save/reload, since JSON.stringify(NaN) === "null".
function safeNum(value) {
  return Number.isFinite(value) ? value : 0;
}

function CountrySelectScreen({ onChoose, onBack }) {
  const countries = [
    {
      key: "usa",
      flag: "🇺🇸",
      title: "United States",
      tagline: "MLS · USL Championship · USL League One · USL League Two",
      points: ["Designated Players & a salary cap, an annual draft, the US Open Cup"],
      ready: true,
    },
    {
      key: "england",
      flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      title: "England",
      tagline: "Premier League · Championship · League One · League Two",
      points: ["The FA Cup and EFL Cup, real prize money at every stage", "Promotion playoffs below the automatic spots, parachute payments after relegation from the top"],
      ready: true,
    },
  ];
  return (
    <div style={{ minHeight: "100vh", background: PALETTE.pitchDark, ...serif }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 20px 80px" }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", color: PALETTE.gold, fontSize: 13, cursor: "pointer", ...display, marginBottom: 16 }}>
            ← Back
          </button>
        )}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ ...display, fontSize: 44, fontWeight: 700, color: PALETTE.parchment, lineHeight: 1 }}>
            ASCENT
          </div>
          <div style={{ color: PALETTE.gold, fontSize: 14, marginTop: 10, letterSpacing: "0.08em", textTransform: "uppercase", ...display }}>
            Choose your pyramid
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {countries.map((c) => (
            <button
              key={c.key}
              onClick={() => onChoose(c.key)}
              style={{
                textAlign: "left", background: PALETTE.pitch, border: `1px solid ${PALETTE.gold}55`, borderRadius: 12,
                padding: 20, cursor: "pointer", color: PALETTE.parchment, display: "flex", flexDirection: "column", gap: 10,
                opacity: c.ready ? 1 : 0.85,
              }}
            >
              <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.gold, display: "flex", alignItems: "center", gap: 8 }}>
                {c.flag} {c.title}
                {!c.ready && (
                  <span style={{ fontSize: 10, fontWeight: 700, background: PALETTE.crimson, color: "#fff", padding: "2px 7px", borderRadius: 4, letterSpacing: "0.04em" }}>
                    IN PROGRESS
                  </span>
                )}
              </div>
              <div style={{ ...display, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.8 }}>{c.tagline}</div>
              <div style={{ height: 1, background: `${PALETTE.gold}33`, margin: "4px 0" }} />
              {c.points.map((pt, i) => (
                <div key={i} style={{ fontSize: 13, ...serif, opacity: 0.9 }}>{pt}</div>
              ))}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EnglandComingSoonScreen({ onBack, onTryTestMode }) {
  return (
    <div style={{ minHeight: "100vh", background: PALETTE.pitchDark, ...serif, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <div style={{ ...display, fontSize: 32, fontWeight: 700, color: PALETTE.gold, marginBottom: 12 }}>
          🏴󠁧󠁢󠁥󠁮󠁧󠁿 England
        </div>
        <div style={{ color: PALETTE.parchment, fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>
          The full pyramid is here — Premier League, Championship, League One and League Two, all with accurate 38/46/46/46-game seasons. Pick any club in any tier.
        </div>
        <div style={{ color: PALETTE.parchment, fontSize: 15, lineHeight: 1.6, marginBottom: 24, opacity: 0.8 }}>
          Not in yet: promotion/relegation into a new season, FA Cup/EFL Cup, transfers, DP/board mechanics. One season at a time for now.
        </div>
        <button
          onClick={onTryTestMode}
          style={{ padding: "12px 24px", borderRadius: 8, border: "none", background: PALETTE.gold, color: PALETTE.ink, fontSize: 14, fontWeight: 700, cursor: "pointer", ...display, marginBottom: 12, width: "100%" }}
        >
          Play the English Pyramid →
        </button>
        <button
          onClick={onBack}
          style={{ padding: "12px 24px", borderRadius: 8, border: `1px solid ${PALETTE.gold}`, background: "none", color: PALETTE.gold, fontSize: 14, fontWeight: 600, cursor: "pointer", ...display, width: "100%" }}
        >
          ← Back to pyramid select
        </button>
      </div>
    </div>
  );
}

// ============================================================
// ENGLAND TEST MODE — standalone, minimal harness for trying the
// researched Premier League data. Deliberately separate from the main
// Dashboard: no promotion/relegation (nothing to move to/from yet), no
// cups, no DP/board mechanics. Just real clubs, real ratings, and match
// simulation, so the data itself can be evaluated before building the
// full pyramid around it.
function EnglandDashboard({ onBack }) {
  const [world, setWorld] = useState(() => buildEnglandWorld());
  const [pick, setPick] = useState(null); // { tierId, clubId }
  const [viewTierId, setViewTierId] = useState(0);
  const [tab, setTab] = useState("table");
  const [recap, setRecap] = useState(null);
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [seasonSummary, setSeasonSummary] = useState(null);

  if (!pick) {
    return (
      <div style={{ minHeight: "100vh", background: PALETTE.pitchDark, ...serif }}>
        <style>{FONT_IMPORT}</style>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 80px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: PALETTE.gold, fontSize: 13, cursor: "pointer", ...display, marginBottom: 16 }}>
            ← Back
          </button>
          <div style={{ ...display, fontSize: 26, fontWeight: 700, color: PALETTE.gold, marginBottom: 4, textAlign: "center" }}>
            Pick Your Club
          </div>
          <div style={{ color: PALETTE.parchment, fontSize: 12, opacity: 0.7, textAlign: "center", marginBottom: 24 }}>
            Full English pyramid — Premier League, Championship, League One, League Two
          </div>
          {world.map((t) => (
            <div key={t.id} style={{ marginBottom: 24 }}>
              <div style={{ ...display, fontSize: 16, fontWeight: 700, color: ENGLAND_TIER_META[t.id].color === "#3D0A5B" ? PALETTE.gold : PALETTE.parchment, marginBottom: 8, borderBottom: `1px solid ${PALETTE.gold}44`, paddingBottom: 4 }}>
                {t.name}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
                {t.clubs.map((c) => {
                  const avgOvr = Math.round(c.squad.reduce((s, p) => s + p.overall, 0) / c.squad.length);
                  return (
                    <button
                      key={c.id}
                      onClick={() => { setPick({ tierId: t.id, clubId: c.id }); setViewTierId(t.id); }}
                      style={{ textAlign: "left", background: PALETTE.pitch, border: `1px solid ${PALETTE.gold}33`, borderRadius: 6, padding: 8, cursor: "pointer", color: PALETTE.parchment }}
                    >
                      <div style={{ ...display, fontWeight: 700, fontSize: 12 }}>{c.name}</div>
                      <div style={{ fontSize: 10, opacity: 0.65, ...mono }}>Avg {avgOvr} {c.isReal ? "" : "(gen)"}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const userTier = world.find((t) => t.id === pick.tierId);
  const userClub = userTier.clubs.find((c) => c.id === pick.clubId);
  const viewTier = world.find((t) => t.id === viewTierId);
  const viewTable = computeTable(viewTier);

  const anyUnplayed = world.some((t) => t.fixtures.some((f) => !f.played));

  const handleSimMatchday = () => {
    const newWorld = world.map((t) => {
      const nextMd = t.fixtures.some((f) => !f.played)
        ? Math.min(...t.fixtures.filter((f) => !f.played).map((f) => f.matchday))
        : null;
      if (nextMd === null) return t;
      const clubs = [...t.clubs];
      const fixtures = [...t.fixtures];
      const matches = [];
      fixtures.filter((f) => f.matchday === nextMd).forEach((fx) => {
        const home = clubs.find((c) => c.id === fx.homeClubId);
        const away = clubs.find((c) => c.id === fx.awayClubId);
        const result = simulateMatch(fx, home, away, nextMd, "pro");
        if (t.id === pick.tierId && (fx.homeClubId === pick.clubId || fx.awayClubId === pick.clubId)) {
          matches.push(result);
        }
      });
      if (matches.length) setRecap({ matchday: nextMd, matches });
      return { ...t, clubs, fixtures };
    });
    setWorld(newWorld);
  };

  const userFixtures = userTier.fixtures.filter((f) => f.homeClubId === pick.clubId || f.awayClubId === pick.clubId);
  const nextFixture = userFixtures.find((f) => !f.played);
  const userMatchday = userTier.fixtures.some((f) => !f.played)
    ? Math.min(...userTier.fixtures.filter((f) => !f.played).map((f) => f.matchday))
    : null;

  return (
    <div style={{ minHeight: "100vh", background: PALETTE.pitchDark, ...serif }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px 80px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: PALETTE.gold, fontSize: 13, cursor: "pointer", ...display, marginBottom: 12 }}>
          ← Exit
        </button>
        <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.gold, marginBottom: 4 }}>{userClub.name}</div>
        <div style={{ color: PALETTE.parchment, fontSize: 12, opacity: 0.7, marginBottom: 4, ...mono }}>
          Season {seasonNumber} — {userTier.name}{userMatchday !== null ? ` — Matchday ${userMatchday}/${userTier.fixtures.length ? Math.max(...userTier.fixtures.map((f) => f.matchday)) : 0}` : " — complete"}
        </div>
        {nextFixture && (
          <div style={{ color: PALETTE.parchment, fontSize: 12, opacity: 0.6, marginBottom: 16, ...mono }}>
            Next: {nextFixture.homeClubId === pick.clubId ? "vs" : "@"} {userTier.clubs.find((c) => c.id === (nextFixture.homeClubId === pick.clubId ? nextFixture.awayClubId : nextFixture.homeClubId)).name}
          </div>
        )}
        <button
          onClick={handleSimMatchday}
          disabled={!anyUnplayed}
          style={{ padding: "10px 20px", borderRadius: 6, border: "none", background: PALETTE.gold, color: PALETTE.ink, fontSize: 13, fontWeight: 700, cursor: anyUnplayed ? "pointer" : "default", opacity: anyUnplayed ? 1 : 0.5, ...display, marginBottom: 16 }}
        >
          Sim Matchday (whole pyramid)
        </button>
        {!anyUnplayed && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: PALETTE.parchment, fontSize: 12, opacity: 0.7, marginBottom: 8, fontStyle: "italic" }}>
              Season {seasonNumber} complete across all four tiers.
            </div>
            <button
              onClick={() => {
                const { tiers: newWorld, events } = rolloverEnglandSeason(world);
                let newTierId = pick.tierId;
                for (const t of newWorld) {
                  if (t.clubs.some((c) => c.id === pick.clubId)) { newTierId = t.id; break; }
                }
                setSeasonSummary({ season: seasonNumber, events });
                setWorld(newWorld);
                setPick({ tierId: newTierId, clubId: pick.clubId });
                setViewTierId(newTierId);
                setSeasonNumber(seasonNumber + 1);
              }}
              style={{ padding: "10px 20px", borderRadius: 6, border: "none", background: PALETTE.gold, color: PALETTE.ink, fontSize: 13, fontWeight: 700, cursor: "pointer", ...display }}
            >
              Start Season {seasonNumber + 1} →
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {["table", "squad", "fixtures"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${PALETTE.gold}`, background: tab === t ? PALETTE.gold : "none", color: tab === t ? PALETTE.ink : PALETTE.gold, fontSize: 12, fontWeight: 600, cursor: "pointer", ...display, textTransform: "capitalize" }}>
              {t}
            </button>
          ))}
        </div>

        {tab === "table" && (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
              {world.map((t) => (
                <button key={t.id} onClick={() => setViewTierId(t.id)} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${PALETTE.gold}66`, background: viewTierId === t.id ? `${PALETTE.gold}33` : "none", color: PALETTE.parchment, fontSize: 11, cursor: "pointer", ...display }}>
                  {t.name}
                </button>
              ))}
            </div>
            <div style={{ background: PALETTE.pitch, borderRadius: 8, overflow: "hidden" }}>
              {viewTable.map((row, i) => {
                const club = viewTier.clubs.find((c) => c.id === row.clubId);
                const isUser = row.clubId === pick.clubId && viewTierId === pick.tierId;
                return (
                  <div key={row.clubId} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", background: isUser ? `${PALETTE.gold}33` : i % 2 ? "#00000022" : "none", color: PALETTE.parchment, fontSize: 12.5, ...serif }}>
                    <span>{i + 1}. {club.name}</span>
                    <span style={{ ...mono }}>{row.points} pts ({row.played}p)</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {tab === "squad" && (
          <div style={{ background: PALETTE.pitch, borderRadius: 8, padding: 8 }}>
            {[...userClub.squad].sort((a, b) => b.overall - a.overall).map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", color: PALETTE.parchment, fontSize: 12.5, ...serif }}>
                <span>{p.name} <span style={{ opacity: 0.6, ...mono, fontSize: 10.5 }}>{p.position}</span></span>
                <span style={{ ...mono, fontWeight: 700 }}>{p.overall}</span>
              </div>
            ))}
          </div>
        )}
        {tab === "fixtures" && (
          <div style={{ background: PALETTE.pitch, borderRadius: 8, padding: 8 }}>
            {userFixtures.map((fx) => {
              const home = userTier.clubs.find((c) => c.id === fx.homeClubId);
              const away = userTier.clubs.find((c) => c.id === fx.awayClubId);
              return (
                <div key={fx.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", color: PALETTE.parchment, fontSize: 12, ...serif, opacity: fx.played ? 1 : 0.6 }}>
                  <span>MD{fx.matchday}: {home.name} vs {away.name}</span>
                  <span style={{ ...mono }}>{fx.played ? `${fx.homeScore}-${fx.awayScore}` : "—"}</span>
                </div>
              );
            })}
          </div>
        )}

        {recap && (
          <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40, padding: 20 }} onClick={() => setRecap(null)}>
            <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 420, width: "100%", padding: 20, maxHeight: "70vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ ...display, fontWeight: 700, fontSize: 16, marginBottom: 10 }}>Matchday {recap.matchday}</div>
              {recap.matches.map((m, i) => (
                <div key={i} style={{ ...serif, fontSize: 13, padding: "4px 0", borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
                  {m.homeClub} <span style={{ ...mono }}>{m.homeScore}-{m.awayScore}</span> {m.awayClub}
                </div>
              ))}
              <button onClick={() => setRecap(null)} style={{ marginTop: 12, width: "100%", padding: "8px 0", borderRadius: 6, border: "none", background: PALETTE.ink, color: "#fff", cursor: "pointer", ...display }}>Close</button>
            </div>
          </div>
        )}
        {seasonSummary && (
          <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40, padding: 20 }} onClick={() => setSeasonSummary(null)}>
            <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 460, width: "100%", padding: 20, maxHeight: "78vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ ...display, fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Season {seasonSummary.season} — Final Results</div>
              <div style={{ ...display, fontWeight: 700, fontSize: 13, marginBottom: 4, marginTop: 8 }}>Champions</div>
              {seasonSummary.events.filter((e) => e.type === "champion").map((e, i) => (
                <div key={i} style={{ ...serif, fontSize: 12.5, padding: "2px 0" }}>{ENGLAND_TIER_META[e.tier].name}: <strong>{e.clubName}</strong></div>
              ))}
              <div style={{ ...display, fontWeight: 700, fontSize: 13, marginBottom: 4, marginTop: 12 }}>Promoted</div>
              {seasonSummary.events.filter((e) => e.type === "promoted").map((e, i) => (
                <div key={i} style={{ ...serif, fontSize: 12.5, padding: "2px 0", color: "#1b6b2f" }}>↑ {e.clubName} ({ENGLAND_TIER_META[e.from].name} → {ENGLAND_TIER_META[e.to].name})</div>
              ))}
              <div style={{ ...display, fontWeight: 700, fontSize: 13, marginBottom: 4, marginTop: 12 }}>Relegated</div>
              {seasonSummary.events.filter((e) => e.type === "relegated").map((e, i) => (
                <div key={i} style={{ ...serif, fontSize: 12.5, padding: "2px 0", color: "#9c1c1c" }}>↓ {e.clubName} ({ENGLAND_TIER_META[e.from].name} → {ENGLAND_TIER_META[e.to].name})</div>
              ))}
              <button onClick={() => setSeasonSummary(null)} style={{ marginTop: 16, width: "100%", padding: "8px 0", borderRadius: 6, border: "none", background: PALETTE.ink, color: "#fff", cursor: "pointer", ...display }}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DifficultySelectScreen({ onChoose, onBack }) {
  const modes = [
    {
      key: "rookie",
      title: "Rookie",
      tagline: "Learn the game",
      points: ["No payroll to manage", "Simple end-of-season prize money", "No board pressure — just play"],
    },
    {
      key: "pro",
      title: "Pro",
      tagline: "Run a real budget",
      points: ["Real wages, tier-scaled, paid every season", "Event-driven bonuses — per-win, shield, cup, playoffs", "Still no board looking over your shoulder"],
    },
    {
      key: "executive",
      title: "Executive",
      tagline: "The full front office",
      points: ["Everything in Pro, plus:", "Marquee-signing mechanics & a salary cap in leagues that use one", "Board objectives, sacking risk, and a career-long happiness score"],
    },
  ];
  return (
    <div style={{ minHeight: "100vh", background: PALETTE.pitchDark, ...serif }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 20px 80px" }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{ background: "none", border: "none", color: PALETTE.gold, fontSize: 13, cursor: "pointer", ...display, marginBottom: 16 }}
          >
            ← Back to pyramid select
          </button>
        )}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ ...display, fontSize: 44, fontWeight: 700, color: PALETTE.parchment, lineHeight: 1 }}>
            ASCENT
          </div>
          <div style={{ color: PALETTE.gold, fontSize: 14, marginTop: 10, letterSpacing: "0.08em", textTransform: "uppercase", ...display }}>
            Choose your difficulty
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => onChoose(m.key)}
              style={{
                textAlign: "left", background: PALETTE.pitch, border: `1px solid ${PALETTE.gold}55`, borderRadius: 12,
                padding: 20, cursor: "pointer", color: PALETTE.parchment, display: "flex", flexDirection: "column", gap: 10,
              }}
            >
              <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.gold }}>{m.title}</div>
              <div style={{ ...display, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.8 }}>{m.tagline}</div>
              <div style={{ height: 1, background: `${PALETTE.gold}33`, margin: "4px 0" }} />
              {m.points.map((pt, i) => (
                <div key={i} style={{ fontSize: 13, ...serif, opacity: 0.9 }}>{pt}</div>
              ))}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClubSelectScreen({ world, onPick, saveWasReset, difficulty, onBack, defaultCountry, managerReputation, managerHistory, isJobSearch, onResetToNewSave }) {
  const [openTier, setOpenTier] = useState(defaultCountry === "england" ? 4 : 0);
  const [showingCareerSummary, setShowingCareerSummary] = useState(false);
  // Reputation gating is a Pro/Executive-only wrinkle, and only applies
  // when this is an actual job search (sacked, or left voluntarily) — a
  // brand new career or a full restart should never be locked out of a
  // club just because reputation hasn't been earned yet. Prestigious clubs
  // (high club.reputation) want some proven pedigree first; modest clubs
  // will take a chance on anyone. requiredRep scales with how far above
  // average the club's own reputation sits.
  const repGatingActive = difficulty !== "rookie" && isJobSearch;
  // Tier-relative, not an absolute cross-country number: USA's club
  // reputations run on a noticeably lower absolute scale than England's
  // (MLS tops out around 87, the Premier League around 95), so a single
  // flat "club.reputation minus X" comparison made a Championship-level
  // manager's reputation clear England's bar easily while barely
  // registering against most of the USA side — nowhere near fair. Instead,
  // each club's requirement is expressed as where it sits within its OWN
  // tier's reputation spread, so the weakest club in any tier is broadly
  // reachable and that tier's own best club is genuinely hard — the same
  // shape whether it's the Championship or USL Championship.
  const requiredRepFor = (club, tierMin, tierMax) => {
    const span = tierMax - tierMin || 1;
    const percentile = (club.reputation - tierMin) / span;
    // Floor dropped from 35 to 5 — reputation itself is clamped down to a
    // floor of 5 (sacked: -20, relegated: -12, both stack), and a required
    // reputation of 35 for even the WORST club in any tier meant a manager
    // whose reputation had genuinely bottomed out could be rejected by
    // every single club in the entire game with no way back in. The tier's
    // weakest club should always be reachable, no matter how bad things
    // have gotten — a real club really would take a chance on anyone
    // rather than go without a manager at all.
    return Math.round(5 + percentile * 85);
  };

  const [confirmingReset, setConfirmingReset] = useState(false);
  if (showingCareerSummary) {
    return <CareerSummaryScreen managerHistory={managerHistory || {}} currentClubName={null} onClose={onResetToNewSave} />;
  }
  return (
    <div style={{ minHeight: "100vh", background: PALETTE.pitchDark, ...serif }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "48px 20px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          {onBack ? (
            <button
              onClick={onBack}
              style={{ background: "none", border: "none", color: PALETTE.silver, fontSize: 11, cursor: "pointer", ...display, opacity: 0.8 }}
            >
              ← Back to league selection
            </button>
          ) : <span />}
          {isJobSearch && onResetToNewSave && (
            confirmingReset ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ ...serif, fontSize: 11, color: PALETTE.silver }}>Start a brand new save instead?</span>
                <button onClick={() => setShowingCareerSummary(true)} style={{ background: "none", border: `1px solid ${PALETTE.crimson}`, color: PALETTE.crimson, fontSize: 11, cursor: "pointer", ...display, padding: "4px 8px", borderRadius: 5 }}>
                  Yes, reset
                </button>
                <button onClick={() => setConfirmingReset(false)} style={{ background: "none", border: `1px solid ${PALETTE.silver}55`, color: PALETTE.silver, fontSize: 11, cursor: "pointer", ...display, padding: "4px 8px", borderRadius: 5 }}>
                  Cancel
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmingReset(true)}
                title="Give up on this career entirely and start a fresh save from scratch"
                style={{ background: "none", border: `1px solid ${PALETTE.silver}55`, color: PALETTE.silver, fontSize: 11, cursor: "pointer", ...display, opacity: 0.8 }}
              >
                Reset to a new save
              </button>
            )
          )}
        </div>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ ...display, fontSize: 56, fontWeight: 700, color: PALETTE.parchment, lineHeight: 1 }}>
            ASCENT
          </div>
          <div style={{ color: PALETTE.gold, fontSize: 15, marginTop: 10, letterSpacing: "0.08em", textTransform: "uppercase", ...display }}>
            Pick a club. Climb the pyramid. Become champions.
          </div>
        </div>

        {saveWasReset && (
          <div style={{ background: `${PALETTE.gold}22`, border: `1px solid ${PALETTE.gold}55`, borderRadius: 8, padding: 14, marginBottom: 24, ...serif, fontSize: 13, color: PALETTE.parchment }}>
            The game's been updated since your last save, and your old save isn't compatible with this version — starting fresh. Sorry about that!
          </div>
        )}

        {FULL_TIER_META.filter((meta) => (defaultCountry === "england" ? meta.id >= 4 : meta.id < 4)).map((meta) => {
          const tier = world[meta.id];
          const isOpen = openTier === meta.id;
          return (
            <div key={meta.id} style={{ marginBottom: 16, border: `1px solid ${meta.color}55`, borderRadius: 10, overflow: "hidden" }}>
              <button
                onClick={() => setOpenTier(isOpen ? -1 : meta.id)}
                style={{
                  width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6,
                  padding: "16px 20px", background: isOpen ? meta.color : `${meta.color}22`,
                  border: "none", cursor: "pointer", color: isOpen ? readableTextOn(meta.color) : PALETTE.parchment,
                  textAlign: "left",
                }}
              >
                <span style={{ ...display, fontSize: 22, fontWeight: 700, textAlign: "left" }}>{meta.name}</span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 14 }}>
                  <span style={{ fontSize: 12.5, ...mono, opacity: 0.85, whiteSpace: "nowrap" }}>
                    {(() => {
                      const roundToHalfStep = (amount) => {
                        const step = amount >= 1_000_000 ? 500_000 : 50_000;
                        return Math.round(amount / step) * step;
                      };
                      const deposits = tier.clubs.map((c) => roundToHalfStep(ownershipDepositFor(meta.id, difficulty, c, tier.clubs)));
                      const lo = Math.min(...deposits);
                      return `Funds: ${formatMoney(lo)}+/season`;
                    })()}
                  </span>
                  <ChevronRight size={20} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                </div>
              </button>
              {isOpen && (() => {
                const tierReps = tier.clubs.map((c) => c.reputation);
                const tierMin = Math.min(...tierReps), tierMax = Math.max(...tierReps);
                return (
                <div style={{ background: PALETTE.pitch, padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 10 }}>
                  {tier.clubs.map((club) => {
                    const avgOvr = Math.round(club.squad.reduce((s, p) => s + p.overall, 0) / club.squad.length);
                    const requiredRep = requiredRepFor(club, tierMin, tierMax);
                    const rejected = repGatingActive && (managerReputation ?? 40) < requiredRep;
                    return (
                      <button
                        key={club.id}
                        onClick={() => { if (!rejected) onPick(meta.id, club.id); }}
                        disabled={rejected}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                          background: rejected ? PALETTE.parchmentDim : PALETTE.parchment, border: "none", borderRadius: 8,
                          cursor: rejected ? "default" : "pointer", textAlign: "left", opacity: rejected ? 0.7 : 1,
                        }}
                      >
                        <Crest name={club.name} size={34} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ ...display, fontWeight: 600, fontSize: 14, color: PALETTE.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {club.name}
                          </div>
                          <div style={{ fontSize: 12, color: rejected ? PALETTE.crimson : PALETTE.inkSoft, ...mono }}>
                            {rejected ? "wants a more proven manager first" : `${club.isReal ? "real roster" : "generated roster"} · OVR ${avgOvr}`}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   SEASON ROLLOVER CEREMONY
   ============================================================ */

function RolloverModal({ events, userClubId, userTierId, seasonNumber, windowResult, userPrize, ownershipDeposit, userRetirements, userPayroll, mlsPlayoffResult, userMlsPlayoff, uslcPlayoffResult, userUslcPlayoff, userPromotionPlayoff, boardNotice, usOpenCup, faCup, eflCup, userUsOpenCup, userFaCup, userEflCup, userDpRevenue, userParachutePayment, seasonAwards, onContinue }) {
  const isEngland = userTierId >= 4;
  const ownCountryTierIds = isEngland ? [4, 5, 6, 7] : [0, 1, 2, 3];
  const champions = events.filter((e) => e.type === "champion" && ownCountryTierIds.includes(e.tier));
  const moves = events.filter((e) => e.type !== "champion" && ownCountryTierIds.includes(e.from));
  const userMove = moves.find((e) => e.clubId === userClubId);
  const userChamp = champions.find((e) => e.clubId === userClubId);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }} onClick={onContinue}>
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 560, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: 28 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ ...display, fontSize: 26, fontWeight: 700, color: PALETTE.ink, marginBottom: 4 }}>
          Season {seasonNumber} complete
        </div>
        <div style={{ ...serif, color: PALETTE.inkSoft, marginBottom: 20, fontSize: 14 }}>
          Here's how the pyramid shook out.
        </div>

        {userChamp && (
          <div style={{ background: PALETTE.gold, borderRadius: 8, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <Trophy size={22} color={PALETTE.ink} />
            <div style={{ ...display, fontWeight: 700, color: PALETTE.ink }}>
              {userChamp.tier === 0 ? "You won the Supporters' Shield!" : userChamp.tier === 1 ? "You won the Players' Shield!" : `You won the ${FULL_TIER_META[userChamp.tier].name} title!`}
            </div>
          </div>
        )}
        {userMove && (
          <div style={{
            background: userMove.type === "promoted" ? "#DCEEDD" : "#F4E0E0", borderRadius: 8, padding: 14, marginBottom: 16,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            {userMove.type === "promoted" ? <ArrowUpCircle size={22} color="#2E7D32" /> : <ArrowDownCircle size={22} color={PALETTE.crimson} />}
            <div style={{ ...display, fontWeight: 700, color: PALETTE.ink }}>
              {userMove.type === "promoted"
                ? `Promoted to ${FULL_TIER_META[userMove.to].name}!`
                : `Relegated to ${FULL_TIER_META[userMove.to].name}.`}
            </div>
          </div>
        )}
        {!userMove && !userChamp && (
          <div style={{ ...serif, color: PALETTE.inkSoft, marginBottom: 16, fontSize: 14 }}>
            Your club stays put — no promotion or relegation this time.
          </div>
        )}

        {(userPrize > 0 || ownershipDeposit > 0) && (
          <div style={{ background: "#E8E2CE", borderRadius: 8, padding: 12, marginBottom: 16, ...serif, fontSize: 14, color: PALETTE.ink }}>
            💰 Ownership deposit: <strong>${ownershipDeposit.toLocaleString()}</strong>{userPrize > 0 && <> · League finish bonus: <strong>${userPrize.toLocaleString()}</strong></>} added to your budget.
          </div>
        )}

        {userPayroll > 0 && (
          <div style={{ background: "#F0E4D8", borderRadius: 8, padding: 12, marginBottom: 16, ...serif, fontSize: 14, color: PALETTE.ink }}>
            🧾 Payroll for the season ahead: <strong>-${userPayroll.toLocaleString()}</strong> deducted from your budget.
          </div>
        )}

        {userDpRevenue > 0 && (
          <div style={{ background: "#E8F0E4", borderRadius: 8, padding: 12, marginBottom: 16, ...serif, fontSize: 14, color: PALETTE.ink }}>
            ⭐ Designated Player gate & jersey revenue: <strong>+${userDpRevenue.toLocaleString()}</strong> added to your budget.
          </div>
        )}

        {userParachutePayment > 0 && (
          <div style={{ background: "#E8F0E4", borderRadius: 8, padding: 12, marginBottom: 16, ...serif, fontSize: 14, color: PALETTE.ink }}>
            🪂 Parachute payment: <strong>+${userParachutePayment.toLocaleString()}</strong> added to your budget.
          </div>
        )}

        {boardNotice && (
          <div style={{ background: "#E4D9C4", border: `1px solid ${PALETTE.bronze}`, borderRadius: 8, padding: 12, marginBottom: 16, ...serif, fontSize: 13.5, color: PALETTE.ink, whiteSpace: "pre-line" }}>
            🪑 {boardNotice}
          </div>
        )}

        {userMlsPlayoff && (
          <div style={{ background: PALETTE.gold, borderRadius: 8, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <Trophy size={20} color={PALETTE.ink} />
            <div style={{ ...display, fontWeight: 700, color: PALETTE.ink }}>
              {userMlsPlayoff.result === "champion" ? "MLS Cup Champions!" : userMlsPlayoff.result === "runner-up" ? "MLS Cup runner-up" : "Made the MLS Cup Playoffs"} — ${userMlsPlayoff.amount.toLocaleString()} playoff bonus.
            </div>
          </div>
        )}

        {userUslcPlayoff && (
          <div style={{ background: PALETTE.silver, borderRadius: 8, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <Trophy size={20} color={PALETTE.ink} />
            <div style={{ ...display, fontWeight: 700, color: PALETTE.ink }}>
              {userUslcPlayoff.result === "champion" ? "USL Cup Champions!" : userUslcPlayoff.result === "runner-up" ? "USL Cup runner-up" : "Made the USL Championship Playoffs"} — ${userUslcPlayoff.amount.toLocaleString()} playoff bonus.
            </div>
          </div>
        )}

        {userUsOpenCup && (
          <div style={{ background: "#D9C6E8", borderRadius: 8, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <Star size={20} color={PALETTE.ink} />
            <div style={{ ...display, fontWeight: 700, color: PALETTE.ink }}>
              {userUsOpenCup.result === "champion" ? "US Open Cup Champions!" : userUsOpenCup.result === "runner-up" ? "US Open Cup runner-up" : `Giant-killer run in the US Open Cup (${userUsOpenCup.giantKillerWins} upset win${userUsOpenCup.giantKillerWins === 1 ? "" : "s"})`} — earned earlier this season.
            </div>
          </div>
        )}

        {userFaCup && (
          <div style={{ background: "#D9C6E8", borderRadius: 8, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <Star size={20} color={PALETTE.ink} />
            <div style={{ ...display, fontWeight: 700, color: PALETTE.ink }}>
              {userFaCup.result === "champion" ? "FA Cup Champions!" : userFaCup.result === "runner-up" ? "FA Cup runner-up" : `Giant-killer run in the FA Cup (${userFaCup.giantKillerWins} upset win${userFaCup.giantKillerWins === 1 ? "" : "s"})`} — earned earlier this season.
            </div>
          </div>
        )}

        {userEflCup && (
          <div style={{ background: "#D9C6E8", borderRadius: 8, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <Star size={20} color={PALETTE.ink} />
            <div style={{ ...display, fontWeight: 700, color: PALETTE.ink }}>
              {userEflCup.result === "champion" ? "EFL Cup Champions!" : userEflCup.result === "runner-up" ? "EFL Cup runner-up" : `Giant-killer run in the EFL Cup (${userEflCup.giantKillerWins} upset win${userEflCup.giantKillerWins === 1 ? "" : "s"})`} — earned earlier this season.
            </div>
          </div>
        )}

        {windowResult && (
          <div style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft, marginBottom: 16 }}>
            Preseason window: {windowResult.listedCount} players listed, {windowResult.transferCount} deals done across the pyramid. Check the Market tab.
          </div>
        )}

        {userRetirements && userRetirements.length > 0 && (
          <div style={{ background: "#EFE6D8", borderRadius: 8, padding: 12, marginBottom: 16, ...serif, fontSize: 13, color: PALETTE.ink }}>
            🎽 Hanging up the boots: <strong>{userRetirements.join(", ")}</strong> retired this offseason.
          </div>
        )}

        <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8, marginTop: 20 }}>
          Champions & Cup Winners
        </div>
        {(() => {
          const rows = [];
          const addShieldOrChamp = (tierIdx, label) => {
            const c = champions.find((e) => e.tier === tierIdx);
            if (c) rows.push({ tierIdx, label, winner: c.clubName });
          };
          const addCupWinner = (label, result, tierIdx) => {
            if (!result) return;
            const championName = result.champion.club ? result.champion.club.name : result.champion.name;
            rows.push({ tierIdx, label, winner: championName });
          };
          if (isEngland) {
            addCupWinner("FA Cup Winner", faCup?.done ? faCup : null, null);
            addCupWinner("EFL Cup Winner", eflCup?.done ? eflCup : null, null);
            addShieldOrChamp(4, `${FULL_TIER_META[4].name} Champion`);
            addShieldOrChamp(5, `${FULL_TIER_META[5].name} Champion`);
            addShieldOrChamp(6, `${FULL_TIER_META[6].name} Champion`);
            addShieldOrChamp(7, `${FULL_TIER_META[7].name} Champion`);
          } else {
            addCupWinner("US Open Cup Winner", usOpenCup?.done ? usOpenCup : null, null);
            addShieldOrChamp(0, "Supporters' Shield");
            addCupWinner("MLS Cup Winner", mlsPlayoffResult, 0);
            addShieldOrChamp(1, "Players' Shield");
            addCupWinner("USL Cup Winner", uslcPlayoffResult, 1);
            addShieldOrChamp(2, `${TIER_META[2].name} Champion`);
            addShieldOrChamp(3, `${TIER_META[3].name} Champion`);
          }

          if (rows.length === 0) return null;
          return (
            <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${PALETTE.parchmentDim}` }}>
              <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 1fr", background: PALETTE.ink, color: PALETTE.parchment, ...display, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                <div style={{ padding: "6px 8px" }}>League</div>
                <div style={{ padding: "6px 8px" }}>Award</div>
                <div style={{ padding: "6px 8px" }}>Winner</div>
              </div>
              {rows.map((r, i) => {
                const tint = r.tierIdx === null ? "#D9C6E822" : `${FULL_TIER_META[r.tierIdx].color}22`;
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr 1fr", background: tint, borderTop: `1px solid ${PALETTE.parchmentDim}`, fontSize: 13, ...serif, color: PALETTE.ink }}>
                    <div style={{ padding: "7px 8px", display: "flex", alignItems: "center" }}>
                      {r.tierIdx === null
                        ? <span style={{ background: PALETTE.gold, color: PALETTE.ink, padding: "2px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700, ...display }}>CUP</span>
                        : <TierBadge tierId={r.tierIdx} />}
                    </div>
                    <div style={{ padding: "7px 8px", fontWeight: 600 }}>{r.label}</div>
                    <div style={{ padding: "7px 8px" }}>{r.winner}</div>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {seasonAwards && (
          <>
            <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8, marginTop: 20 }}>
              Season Awards
            </div>
            {seasonAwards.topScorer && (
              <div style={{ fontSize: 14, color: PALETTE.ink, marginBottom: 4, ...serif }}>
                ⚽ <strong>Golden Boot:</strong> {seasonAwards.topScorer.name} ({seasonAwards.topScorer.clubName}) — {seasonAwards.topScorer.seasonGoals} goals
              </div>
            )}
            {seasonAwards.bestYoungPlayer && (
              <div style={{ fontSize: 14, color: PALETTE.ink, marginBottom: 4, ...serif }}>
                🌟 <strong>Best Young Player:</strong> {seasonAwards.bestYoungPlayer.name} ({seasonAwards.bestYoungPlayer.clubName}, age {seasonAwards.bestYoungPlayer.age}) — {seasonAwards.bestYoungPlayer.overall} OVR
              </div>
            )}
            {seasonAwards.teamOfSeason && (
              <details style={{ marginTop: 6 }}>
                <summary style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft, cursor: "pointer" }}>Team of the Season</summary>
                <div style={{ marginTop: 6 }}>
                  {["GK", "DEF", "MID", "FWD"].flatMap((pos) => seasonAwards.teamOfSeason[pos]).map((p, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, ...serif, color: PALETTE.ink, padding: "3px 0" }}>
                      <span><span style={{ ...mono, color: PALETTE.inkSoft, marginRight: 8, fontSize: 11 }}>{p.position}</span>{p.name} ({p.clubName})</span>
                      <span style={{ ...mono, fontWeight: 700 }}>{p.overall}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </>
        )}

        <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8, marginTop: 16 }}>
          Movement
        </div>
        <div style={{ maxHeight: 160, overflowY: "auto" }}>
          {moves.map((m) => (
            <div key={m.clubId + m.type} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: PALETTE.inkSoft, marginBottom: 3, ...serif }}>
              {m.type === "promoted" ? <TrendingUp size={14} color="#2E7D32" /> : <TrendingDown size={14} color={PALETTE.crimson} />}
              {m.clubName} {m.type === "promoted" ? `→ ${FULL_TIER_META[m.to].short}` : `→ ${FULL_TIER_META[m.to].short}`}
            </div>
          ))}
        </div>

        {userPromotionPlayoff?.bracket && (
          <div style={{ background: "#D9C6E822", borderRadius: 8, padding: 12, marginTop: 16 }}>
            <div style={{ ...display, fontWeight: 700, fontSize: 13, color: PALETTE.ink, marginBottom: 8 }}>
              Promotion Playoff — the last spot up went through this
            </div>
            {[
              { label: "Semifinal", m: userPromotionPlayoff.bracket.semi1 },
              { label: "Semifinal", m: userPromotionPlayoff.bracket.semi2 },
              { label: "Final", m: userPromotionPlayoff.bracket.final },
            ].map((row, i) => (
              <div key={i} style={{ ...serif, fontSize: 12.5, color: PALETTE.ink, padding: "3px 0" }}>
                <span style={{ ...mono, fontSize: 10, opacity: 0.6, marginRight: 6 }}>{row.label}</span>
                {row.m.result.homeClub} <span style={{ ...mono, fontWeight: 700 }}>{row.m.result.homeScore}-{row.m.result.awayScore}</span> {row.m.result.awayClub}
                {row.m.wentToPenalties ? " (pens)" : ""}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onContinue}
          style={{ marginTop: 24, width: "100%", background: PALETTE.pitch, color: PALETTE.parchment, border: "none", borderRadius: 8, padding: "12px 0", fontSize: 15, fontWeight: 600, cursor: "pointer", ...display }}
        >
          Continue to Season {seasonNumber + 1}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   MATCHDAY RECAP PANEL
   ============================================================ */

function RivalryRecapModal({ recap, onClose }) {
  if (!recap) return null;
  const { homeClub, awayClub, homeScore, awayScore, userIsHome, difficulty } = recap;
  const userGoals = userIsHome ? homeScore : awayScore;
  const oppGoals = userIsHome ? awayScore : homeScore;
  const userWon = userGoals > oppGoals;
  const draw = userGoals === oppGoals;
  const eventBonusesOn = DIFFICULTY_MODES[difficulty]?.eventBonuses;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 45, padding: 20 }}
      onClick={onClose}
    >
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 420, width: "100%", padding: 24, border: `3px solid ${PALETTE.crimson}` }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.crimson, display: "flex", alignItems: "center", gap: 8 }}>
            🔥 RIVALRY MATCH
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={PALETTE.inkSoft} /></button>
        </div>
        <div style={{ ...display, fontSize: 18, fontWeight: 700, color: PALETTE.ink, textAlign: "center", margin: "14px 0" }}>
          {homeClub} <span style={{ ...mono }}>{homeScore} - {awayScore}</span> {awayClub}
        </div>
        <div style={{ ...serif, fontSize: 15, color: draw ? PALETTE.inkSoft : userWon ? "#2E7D32" : PALETTE.crimson, textAlign: "center", marginBottom: 8, fontWeight: 600 }}>
          {draw ? "A draw in a fixture like this — nobody's happy, nobody's thrilled." : userWon ? "Bragging rights are yours!" : "A tough one to take from your rivals."}
        </div>
        {userWon && (
          <div style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft, textAlign: "center" }}>
            A small reputation bump for the win{eventBonusesOn ? ", plus a boost in gate revenue from the derby atmosphere." : "."}
          </div>
        )}
        <button
          onClick={onClose}
          style={{ width: "100%", marginTop: 16, background: PALETTE.crimson, color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function CupRecapModal({ recap, userClubId, onClose }) {
  if (!recap) return null;
  const { roundLabel, cupName, cupDone, match } = recap;
  const { homeEntrant, awayEntrant, outcome, winnerEntrant, isUpset } = match;
  const { result, wentToPenalties } = outcome;
  const userWon = winnerEntrant.club.id === userClubId;
  const userEliminated = !userWon;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40, padding: 20 }}
      onClick={onClose}
    >
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 420, width: "100%", padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ ...display, fontSize: 20, fontWeight: 700, color: PALETTE.ink, display: "flex", alignItems: "center", gap: 8 }}>
            <Star size={20} color={PALETTE.gold} /> {cupName || "Cup"} — {roundLabel}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={PALETTE.inkSoft} /></button>
        </div>
        <div style={{ padding: "12px 10px", borderRadius: 8, background: PALETTE.parchmentDim, border: `1px solid ${PALETTE.gold}`, marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "start", columnGap: 8 }}>
            <div style={{ display: "flex", alignItems: "start", gap: 6, textAlign: "left" }}>
              <TierBadge tierId={homeEntrant.tierIdx} />
              <span style={{ ...display, fontWeight: winnerEntrant === homeEntrant ? 700 : 400, fontSize: 15 }}>{result.homeClub}</span>
            </div>
            <span style={{ ...mono, fontWeight: 700, textAlign: "center", whiteSpace: "nowrap" }}>{result.homeScore}-{result.awayScore}</span>
            <div style={{ display: "flex", alignItems: "start", gap: 6, justifyContent: "flex-end", textAlign: "right" }}>
              <span style={{ ...display, fontWeight: winnerEntrant === awayEntrant ? 700 : 400, fontSize: 15 }}>{result.awayClub}</span>
              <TierBadge tierId={awayEntrant.tierIdx} />
            </div>
          </div>
          {wentToPenalties && <div style={{ ...serif, fontSize: 12, color: PALETTE.inkSoft, marginTop: 6, textAlign: "center" }}>Decided on penalties</div>}
        </div>
        <div style={{ ...serif, fontSize: 14, color: userEliminated ? PALETTE.crimson : PALETTE.ink, marginBottom: 8 }}>
          {userWon
            ? cupDone
              ? `You won the ${cupName || "cup"}!`
              : `You're through to the next round${isUpset && winnerEntrant.club.id === userClubId ? " — a real giant-killer result!" : "."}`
            : cupDone
              ? `You lost the final — runners-up in the ${cupName || "cup"} this season.`
              : `You're out of the ${cupName || "cup"} this season.`}
        </div>
        <button
          onClick={onClose}
          style={{ width: "100%", background: PALETTE.pitch, color: PALETTE.parchment, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// A short, honest explanation of what actually decided a match — the
// single biggest line-rating gap between the two sides — so a result
// isn't just a scoreline with no way to learn from it.
function matchWhyExplanation(myRatings, oppRatings, myGoals, oppGoals) {
  const lines = [["defense", "def"], ["midfield", "mid"], ["attack", "att"]];
  const diffs = lines.map(([label, key]) => [label, key, myRatings[key] - oppRatings[key]]);
  const biggest = diffs.reduce((a, b) => (Math.abs(b[2]) > Math.abs(a[2]) ? b : a));
  const [label, key, diff] = biggest;

  if (myGoals === oppGoals) return "An even, hard-fought result — could have gone either way.";
  const won = myGoals > oppGoals;

  // Only attribute the result to a ratings gap when the gap actually points
  // the same direction as what really happened — previously this ignored
  // the scoreline entirely and could claim a team's own strength "was the
  // difference" in a game they lost, or that the opponent's edge "proved
  // too strong" in a game they actually won.
  if (won && diff > 0.5) return `Your ${label} (${myRatings[key]}★ vs their ${oppRatings[key]}★) was the difference.`;
  if (!won && diff < -0.5) return `Their ${label} (${oppRatings[key]}★ vs your ${myRatings[key]}★) proved too strong.`;
  if (won) return "A result that went your way despite a fairly even matchup on paper.";
  return "A tough result to take given how the matchup looked on paper — bound to happen sometimes.";
}

function MatchdayRecap({ results, userClubName, tier, onClose }) {
  if (!results) return null;
  const eventIcon = { goal: "⚽", yellow_card: "🟨", red_card: "🟥", injury: "🩹", suspension: "⛔" };
  const sortedMatches = [...results.matches].sort((a, b) => {
    const aUser = a.homeClub === userClubName || a.awayClub === userClubName;
    const bUser = b.homeClub === userClubName || b.awayClub === userClubName;
    return (bUser ? 1 : 0) - (aUser ? 1 : 0);
  });
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40, padding: 20 }}
      onClick={onClose}
    >
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 480, width: "100%", maxHeight: "80vh", overflowY: "auto", padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.ink }}>Matchday {results.matchday}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={PALETTE.inkSoft} /></button>
        </div>
        {sortedMatches.map((m, i) => {
          const isUser = m.homeClub === userClubName || m.awayClub === userClubName;
          let why = null;
          if (isUser && tier) {
            const myClub = tier.clubs.find((c) => c.name === userClubName);
            const isHome = m.homeClub === userClubName;
            const oppName = isHome ? m.awayClub : m.homeClub;
            const oppClub = tier.clubs.find((c) => c.name === oppName);
            const myGoals = isHome ? m.homeScore : m.awayScore;
            const oppGoals = isHome ? m.awayScore : m.homeScore;
            if (myClub && oppClub) why = matchWhyExplanation(clubLineRatings(myClub), clubLineRatings(oppClub), myGoals, oppGoals);
          }
          return (
            <div key={i} style={{ marginBottom: 14, padding: 10, borderRadius: 8, background: isUser ? PALETTE.parchmentDim : "transparent", border: isUser ? `1px solid ${PALETTE.gold}` : "none" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "start", columnGap: 8 }}>
                <span style={{ ...display, fontWeight: 600, fontSize: 15, color: PALETTE.ink, textAlign: "left" }}>{m.homeClub}</span>
                <span style={{ ...mono, fontWeight: 700, fontSize: 15, color: PALETTE.ink, textAlign: "center", whiteSpace: "nowrap" }}>{m.homeScore} - {m.awayScore}</span>
                <span style={{ ...display, fontWeight: 600, fontSize: 15, color: PALETTE.ink, textAlign: "right" }}>{m.awayClub}</span>
              </div>
              {m.isRivalryMatch && (
                <span style={{ ...display, fontSize: 10, fontWeight: 700, color: PALETTE.crimson, border: `1px solid ${PALETTE.crimson}`, borderRadius: 4, padding: "1px 5px" }}>
                  🔥 RIVALRY
                </span>
              )}
              {isUser && why && (
                <div style={{ marginTop: 4, fontSize: 12, color: PALETTE.inkSoft, ...serif, fontStyle: "italic" }}>{why}</div>
              )}
              {isUser && m.events.length > 0 && (
                <div style={{ marginTop: 6, fontSize: 12.5, color: PALETTE.inkSoft, ...serif }}>
                  {m.events.map((e, j) => (
                    <div key={j}>
                      {eventIcon[e.type]} {e.player} ({e.club}){e.type === "goal" ? ` — ${e.minute}'` : ""}
                      {e.type === "injury" ? ` — out ${e.outFor} matchday(s)` : ""}
                      {e.type === "suspension" ? ` — suspended next match` : ""}
                      {e.type === "red_card" && e.reason === "second yellow" ? ` (2nd yellow)` : ""}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <button
          onClick={onClose}
          style={{ marginTop: 8, width: "100%", background: PALETTE.pitch, color: PALETTE.parchment, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD TABS
   ============================================================ */

function SquadTab({ club, matchday, onToggleList, onRenew, tierId, difficulty, onToggleDP, onToggleRest, onToggleRestIndefinitely, onToggleHoldBack, onLoanOut, playersOnLoan, tier }) {
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [lineupOpen, setLineupOpen] = useState(false);
  const xi = startingXI(club, matchday);
  const xiIds = new Set(xi.map((p) => p.id));
  const posOrder = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
  const xiSorted = [...xi].sort((a, b) => posOrder[a.position] - posOrder[b.position]);

  const sorted = [...club.squad].sort((a, b) => posOrder[a.position] - posOrder[b.position] || b.overall - a.overall);
  const captainOnPitch = xi.some((p) => p.id === club.captainId);
  const actingCaptain = captainOnPitch ? null : [...xi].sort((a, b) => b.leadership - a.leadership)[0];
  const lineRatings = clubLineRatings(club);
  const dpEnabled = tierId === 0 && DIFFICULTY_MODES[difficulty]?.dps;
  const dpIds = new Set(club.designatedPlayerIds || []);

  return (
    <div>
      <div style={{ display: "flex", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
        {[["DEF", lineRatings.def], ["MID", lineRatings.mid], ["ATT", lineRatings.att]].map(([label, val]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase" }}>{label}</span>
            <span style={{ color: PALETTE.gold, fontSize: 16 }}><StarRow value={val} /></span>
          </div>
        ))}
        <span style={{ fontSize: 11, color: PALETTE.inkSoft, ...serif, alignSelf: "center" }}>
          (whole squad — see Tactics tab for your current XI's rating)
        </span>
      </div>

      {playersOnLoan && playersOnLoan.length > 0 && (
        <div style={{ ...serif, fontSize: 12.5, color: PALETTE.inkSoft, marginBottom: 16 }}>
          📤 {playersOnLoan.length} player{playersOnLoan.length === 1 ? "" : "s"} out on loan — {playersOnLoan.map((e) => e.player.name).join(", ")}, back next season.
        </div>
      )}

      {DIFFICULTY_MODES[difficulty]?.boardPressure && (
        <div style={{ border: `1px solid ${PALETTE.parchmentDim}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <span style={{ ...display, fontSize: 11, textTransform: "uppercase", color: PALETTE.inkSoft, letterSpacing: "0.05em" }}>Board happiness</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <div style={{ width: 100, height: 8, background: PALETTE.parchmentDim, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${club.boardHappiness ?? 60}%`, height: "100%", background: (club.boardHappiness ?? 60) < 25 ? PALETTE.crimson : (club.boardHappiness ?? 60) < 50 ? PALETTE.bronze : "#2E7D32" }} />
              </div>
              <span style={{ ...mono, fontSize: 12, color: PALETTE.ink }}>{club.boardHappiness ?? 60}</span>
            </div>
          </div>
          {club.boardObjective && (
            <div>
              <span style={{ ...display, fontSize: 11, textTransform: "uppercase", color: PALETTE.inkSoft, letterSpacing: "0.05em" }}>Objective</span>
              <div style={{ ...serif, fontSize: 13, color: PALETTE.ink }}>{club.boardObjective.description}</div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: 16, border: `1px solid ${PALETTE.parchmentDim}`, borderRadius: 8 }}>
        <button
          onClick={() => setLineupOpen((v) => !v)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px", background: "none", border: "none", cursor: "pointer",
          }}
        >
          <span style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft }}>
            Current lineup — {club.tactics.formation} {captainOnPitch ? "· captain on the pitch" : actingCaptain ? `· ${actingCaptain.name} wears the armband today` : ""}
          </span>
          <ChevronRight size={16} style={{ color: PALETTE.inkSoft, transform: lineupOpen ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
        </button>
        {lineupOpen && (
          <div style={{ padding: "0 14px 14px", display: "flex", flexWrap: "wrap", gap: 6 }}>
            {xiSorted.map((p) => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 6,
                background: PALETTE.parchmentDim, fontSize: 12.5, ...serif,
              }}>
                <span style={{ ...mono, color: PALETTE.inkSoft, fontSize: 11 }}>{p.position}</span>
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                {p.id === club.captainId && <span title="Captain" style={{ color: PALETTE.gold }}>©</span>}
                <span style={{ ...mono, color: PALETTE.inkSoft }}>{p.overall}</span>
              </div>
            ))}
            {xi.length < 11 && (
              <div style={{ fontSize: 12, color: PALETTE.crimson, ...serif, padding: "6px 4px" }}>
                Only {xi.length} available — injuries/suspensions are thinning the squad.
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5, ...serif }}>
          <thead>
            <tr style={{ textAlign: "left", color: PALETTE.inkSoft, borderBottom: `2px solid ${PALETTE.parchmentDim}` }}>
              {["", "Pos", "Name", "Age", "OVR", "POT", "LDR", "Fitness", "Yrs", "Status", ""].map((h) => (
                <th key={h} style={{ padding: "5px 5px", ...display, fontWeight: 600, fontSize: 9.5, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const injured = p.injuredUntilMatchday != null && p.injuredUntilMatchday >= matchday;
              const suspended = !injured && p.suspendedUntilMatchday != null && p.suspendedUntilMatchday >= matchday;
              const expiring = p.contractYearsLeft <= 1;
              const isCaptain = p.id === club.captainId;
              return (
                <tr key={p.id} style={{ borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
                  <td style={{ padding: "5px 2px" }}>{xiIds.has(p.id) ? <span style={{ color: PALETTE.gold, fontWeight: 700 }}>●</span> : ""}</td>
                  <td style={{ padding: "5px 5px", ...mono, fontSize: 10.5 }}>{p.position}</td>
                  <td style={{ padding: "5px 5px", fontWeight: 600, fontSize: 12 }}>{p.name}{isCaptain && <span title="Captain" style={{ color: PALETTE.gold, marginLeft: 4 }}>©</span>}</td>
                  <td style={{ padding: "5px 5px", ...mono, fontSize: 10.5 }}>{p.age}</td>
                  <td style={{ padding: "5px 5px", ...mono, fontWeight: 700, fontSize: 11.5 }}>{p.overall}</td>
                  <td style={{ padding: "5px 5px", ...mono, fontSize: 10.5, color: PALETTE.inkSoft }}>{p.potential}</td>
                  <td style={{ padding: "5px 5px", ...mono, fontSize: 10.5, color: PALETTE.inkSoft }}>{p.leadership ?? "—"}</td>
                  <td style={{ padding: "5px 5px", ...mono, fontSize: 10.5 }}>{p.fitness}</td>
                  <td style={{ padding: "5px 5px", ...mono, fontSize: 10.5, color: expiring ? PALETTE.crimson : PALETTE.ink }}>{p.contractYearsLeft}</td>
                  <td style={{ padding: "5px 5px", fontSize: 10.5, whiteSpace: "nowrap" }}>
                    {injured ? <span style={{ color: PALETTE.crimson }}>injured</span>
                      : suspended ? <span style={{ color: PALETTE.crimson }}>susp.</span>
                      : p.transferRequested ? <span style={{ color: PALETTE.crimson }}>😠 out {formatMoney(p.askingPrice ?? 0)}</span>
                      : p.transferListed ? <span style={{ color: PALETTE.gold }}>listed {formatMoney(p.askingPrice ?? 0)}</span> : ""}
                  </td>
                  <td style={{ padding: "5px 5px", display: "flex", gap: 4, alignItems: "center", position: "relative" }}>
                    <button
                      onClick={() => onToggleList(p.id)}
                      style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: `1px solid ${PALETTE.ink}`, background: "none", cursor: "pointer", ...display }}
                    >
                      {p.transferListed ? "Unlist" : "List"}
                    </button>
                    {expiring && (
                      <button
                        onClick={() => onRenew(p.id)}
                        style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: `1px solid ${PALETTE.gold}`, background: PALETTE.gold, color: PALETTE.ink, cursor: "pointer", ...display, fontWeight: 600 }}
                      >
                        Renew
                      </button>
                    )}
                    <button
                      onClick={() => setOpenActionMenuId(openActionMenuId === p.id ? null : p.id)}
                      title="More actions"
                      style={{
                        fontSize: 14, width: 24, height: 24, borderRadius: "50%", cursor: "pointer", padding: 0, lineHeight: "22px",
                        border: `1px solid ${PALETTE.inkSoft}`, background: openActionMenuId === p.id ? PALETTE.ink : "none",
                        color: openActionMenuId === p.id ? PALETTE.parchment : PALETTE.inkSoft, ...display, fontWeight: 700,
                      }}
                    >
                      +
                    </button>
                    {openActionMenuId === p.id && (
                      <div
                        style={{
                          position: "absolute", top: "100%", right: 0, marginTop: 4, zIndex: 10,
                          background: PALETTE.parchment, border: `1px solid ${PALETTE.inkSoft}`, borderRadius: 8,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)", padding: 6, display: "flex", flexDirection: "column", gap: 4, minWidth: 140,
                        }}
                      >
                        {dpEnabled && (dpIds.has(p.id) || dpIds.size < MAX_DESIGNATED_PLAYERS) && (
                          <button
                            onClick={() => { onToggleDP(p.id); setOpenActionMenuId(null); }}
                            title="Designated Player — wage exempt from payroll"
                            style={{
                              fontSize: 12, padding: "6px 10px", borderRadius: 5, cursor: "pointer", ...display, textAlign: "left",
                              border: `1px solid ${PALETTE.gold}`, background: dpIds.has(p.id) ? PALETTE.gold : "none",
                              color: dpIds.has(p.id) ? PALETTE.ink : PALETTE.gold, fontWeight: dpIds.has(p.id) ? 700 : 400,
                            }}
                          >
                            {dpIds.has(p.id) ? "DP ✓" : "Make DP"}
                          </button>
                        )}
                        {p.age <= 21 && (
                          <button
                            onClick={() => { onLoanOut(p.id); setOpenActionMenuId(null); }}
                            title="Loan out for the season — returns next season, having developed"
                            style={{
                              fontSize: 12, padding: "6px 10px", borderRadius: 5, border: `1px solid ${PALETTE.inkSoft}`,
                              background: "none", color: PALETTE.inkSoft, cursor: "pointer", ...display, textAlign: "left",
                            }}
                          >
                            Loan Out
                          </button>
                        )}
                        <button
                          onClick={() => { onToggleRest(p.id); setOpenActionMenuId(null); }}
                          title="Rest for the next match only"
                          style={{
                            fontSize: 12, padding: "6px 10px", borderRadius: 5, cursor: "pointer", ...display, textAlign: "left",
                            border: `1px solid ${p.restRequested ? PALETTE.bronze : PALETTE.inkSoft}`,
                            background: p.restRequested ? PALETTE.bronze : "none", color: p.restRequested ? "#fff" : PALETTE.inkSoft,
                          }}
                        >
                          💤 Rest 1 game
                        </button>
                        <button
                          onClick={() => { onToggleRestIndefinitely(p.id); setOpenActionMenuId(null); }}
                          title="Rest until you turn it back off"
                          style={{
                            fontSize: 12, padding: "6px 10px", borderRadius: 5, cursor: "pointer", ...display, textAlign: "left",
                            border: `1px solid ${p.restIndefinitely ? PALETTE.crimson : PALETTE.inkSoft}`,
                            background: p.restIndefinitely ? PALETTE.crimson : "none", color: p.restIndefinitely ? "#fff" : PALETTE.inkSoft,
                          }}
                        >
                          ⏸ Rest till further notice
                        </button>
                        <button
                          onClick={() => { onToggleHoldBack(p.id); setOpenActionMenuId(null); }}
                          title="Hold back from cup matches"
                          style={{
                            fontSize: 12, padding: "6px 10px", borderRadius: 5, cursor: "pointer", ...display, textAlign: "left",
                            border: `1px solid ${p.holdBackForCup ? PALETTE.gold : PALETTE.inkSoft}`,
                            background: p.holdBackForCup ? PALETTE.gold : "none", color: p.holdBackForCup ? PALETTE.ink : PALETTE.inkSoft,
                          }}
                        >
                          🛡 Sit out of Cup
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Looks at the squad's actual personnel — which line is strongest, and
// whether the squad is built for pace/attack or physicality/defense — and
// suggests a formation/style/press combo to match, with a plain-language
// reason. This is what answers "how do I set my team up" instead of
// leaving formation/style as unlabeled buttons with no connection to who's
// actually on the roster.
function suggestTactics(club, oppRatings, tier) {
  const lineRatings = clubLineRatings(club);
  const lines = [["def", lineRatings.def], ["mid", lineRatings.mid], ["att", lineRatings.att]];
  const strongest = lines.reduce((a, b) => (b[1] > a[1] ? b : a));
  const attMinusDef = lineRatings.att - lineRatings.def;

  let formation, formationReason;
  if (attMinusDef >= 1) { formation = "4-3-3"; formationReason = `your attack (${lineRatings.att}★) is well ahead of your defense (${lineRatings.def}★)`; }
  else if (attMinusDef <= -1) { formation = "5-3-2"; formationReason = `your defense (${lineRatings.def}★) is your clear strength over your attack (${lineRatings.att}★)`; }
  else if (strongest[0] === "mid") { formation = "4-2-3-1"; formationReason = `your midfield (${lineRatings.mid}★) is your best line`; }
  else { formation = "4-4-2"; formationReason = "your squad is fairly balanced across all three lines"; }

  const outfield = club.squad.filter((p) => p.position !== "GK");
  const avgPace = outfield.length ? outfield.reduce((s, p) => s + p.pace, 0) / outfield.length : 50;
  const avgPhysical = outfield.length ? outfield.reduce((s, p) => s + p.physical, 0) / outfield.length : 50;

  // Opponent-aware override: when the next opponent is scouted and the
  // gap is clear-cut, THIS takes priority over generic squad-personnel
  // logic — this is what makes the suggestion actually respond to who
  // you're about to play, not just describe your own roster back to you.
  let style, press, styleReason;
  if (oppRatings) {
    const attEdge = lineRatings.att - oppRatings.def;
    const defEdge = oppRatings.att - lineRatings.def;
    if (defEdge >= 1 && defEdge >= attEdge) {
      style = "defensive"; press = "low";
      styleReason = `their attack (${oppRatings.att}★) threatens your defense (${lineRatings.def}★) — sit in and stay solid against them`;
    } else if (attEdge >= 1) {
      style = "attacking"; press = avgPace >= 64 ? "high" : "medium";
      styleReason = `your attack (${lineRatings.att}★) should trouble their defense (${oppRatings.def}★) — press the advantage`;
    }
  }
  if (!style) {
    if (attMinusDef >= 1 || avgPace >= 66) {
      style = "attacking"; press = avgPace >= 68 ? "high" : "medium";
      styleReason = avgPace >= 66 ? `your squad's average pace (${Math.round(avgPace)}) supports an attacking, high-tempo approach` : formationReason;
    } else if (attMinusDef <= -1 || avgPhysical >= 66) {
      style = "defensive"; press = "low";
      styleReason = avgPhysical >= 66 ? `your squad is built physical (avg ${Math.round(avgPhysical)}) — sitting in and staying solid suits that` : formationReason;
    } else {
      style = "balanced"; press = "medium";
      styleReason = "nothing about your squad strongly favors one extreme, so a balanced approach is the safer bet";
    }
  }

  return { formation, style, press, reason: `${formationReason[0].toUpperCase()}${formationReason.slice(1)} — ${styleReason === formationReason ? "which also points to" : "and"} ${style}, ${press} press.` };
}

function TacticsTab({ club, matchday, onChange, tier, onSetCaptain, onSwapCustomXI }) {
  const formations = ["4-4-2", "4-3-3", "3-5-2", "5-3-2", "4-2-3-1", "4-3-2-1", "3-4-3", "4-3-1-2"];
  const posOrder = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
  const projected = [...startingXI(club, matchday)].sort((a, b) => posOrder[a.position] - posOrder[b.position]);
  const lineRatings = xiLineRatings(projected);

  // Custom mode's selection surface lives here now: click a projected slot,
  // pick a replacement from a dropdown, rather than toggling players on/off
  // from a list in the Squad tab. Eligibility mirrors the exact same pool
  // startingXI() itself draws from (see the `available` filter there) so a
  // player offered in the dropdown is always someone who'd actually take
  // the pitch if picked — never an injured/suspended/rested player who'd
  // just silently fail to appear after being "swapped in".
  const projectedIds = useMemo(() => new Set(projected.map((p) => p.id)), [projected]);
  const eligiblePool = useMemo(() => {
    const isCupMatch = matchday === 9999;
    const restThreshold = club.tactics.restThreshold ?? 0;
    return club.squad.filter((pl) => {
      if (!isAvailable(pl, matchday)) return false;
      if (isCupMatch && pl.holdBackForCup) return false;
      if (pl.restRequested || pl.restIndefinitely) return false;
      if (pl.fitness < restThreshold) return false;
      return true;
    });
  }, [club.squad, club.tactics.restThreshold, matchday]);
  const swapOptionsFor = (position, excludeId) => eligiblePool
    .filter((pl) => pl.position === position && pl.id !== excludeId && !projectedIds.has(pl.id))
    .sort((a, b) => b.overall - a.overall);

  const Row = ({ label, value, options, field, optionLabels }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ ...display, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(field, opt)}
            style={{
              padding: "8px 14px", borderRadius: 6, cursor: "pointer", ...display, fontSize: 13,
              border: `1.5px solid ${PALETTE.ink}`,
              background: value === opt ? PALETTE.ink : "none",
              color: value === opt ? PALETTE.parchment : PALETTE.ink,
            }}
          >
            {optionLabels ? optionLabels[opt] : opt}
          </button>
        ))}
      </div>
    </div>
  );
  let nextOppRatings = null;
  if (tier) {
    const userFixtures = tier.fixtures.filter((f) => f.homeClubId === club.id || f.awayClubId === club.id);
    const nextFixture = userFixtures.find((f) => !f.played);
    if (nextFixture) {
      const oppId = nextFixture.homeClubId === club.id ? nextFixture.awayClubId : nextFixture.homeClubId;
      const opponent = tier.clubs.find((c) => c.id === oppId);
      if (opponent) nextOppRatings = clubLineRatings(opponent);
    }
  }
  const suggestion = suggestTactics(club, nextOppRatings, tier);
  const matchesSuggestion = club.tactics.formation === suggestion.formation && club.tactics.style === suggestion.style && club.tactics.press === suggestion.press;
  const applySuggestion = () => {
    onChange("formation", suggestion.formation);
    onChange("style", suggestion.style);
    onChange("press", suggestion.press);
  };

  return (
    <div>
      <div style={{ ...display, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8 }}>
        Current XI rating
      </div>
      <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        {[["DEF", lineRatings.def], ["MID", lineRatings.mid], ["ATT", lineRatings.att]].map(([label, val]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase" }}>{label}</span>
            <span style={{ color: PALETTE.gold, fontSize: 16 }}><StarRow value={val} /></span>
          </div>
        ))}
      </div>

      {!matchesSuggestion && (
        <div style={{ background: "#E4D9C4", border: `1px solid ${PALETTE.bronze}`, borderRadius: 8, padding: 14, marginBottom: 20 }}>
          <div style={{ ...display, fontWeight: 700, fontSize: 13, color: PALETTE.ink, marginBottom: 4 }}>
            Suggested for your squad: {suggestion.formation}, {suggestion.style}, {suggestion.press} press
          </div>
          <div style={{ ...serif, fontSize: 12.5, color: PALETTE.inkSoft, marginBottom: 10 }}>{suggestion.reason}</div>
          <button
            onClick={applySuggestion}
            style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: PALETTE.ink, color: PALETTE.parchment, fontSize: 12.5, fontWeight: 600, cursor: "pointer", ...display }}
          >
            Apply Suggestion
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 420, flex: 1, minWidth: 260 }}>
          <Row label="Formation" value={club.tactics.formation} options={formations} field="formation" />
          <div style={{ ...serif, fontSize: 12, color: PALETTE.inkSoft, marginTop: -10, marginBottom: 18 }}>
            {FORMATION_NOTES[club.tactics.formation]}
          </div>
          <Row label="Style" value={club.tactics.style} options={["defensive", "balanced", "attacking"]} field="style" />
          <Row label="Press" value={club.tactics.press} options={["low", "medium", "high"]} field="press" />
          <Row
            label="Lineup Selection"
            value={club.tactics.lineupMode || "best"}
            options={["best", "youth", "auto", "custom"]}
            optionLabels={{ best: "Best XI", youth: "Youth", auto: "Auto", custom: "Custom" }}
            field="lineupMode"
          />
          {(club.tactics.lineupMode === "custom") && (
            <div style={{ ...serif, fontSize: 12, color: PALETTE.inkSoft, marginTop: -10, marginBottom: 18 }}>
              Use the "Swap ▾" menu next to a name in the Projected Lineup to swap that slot for another eligible player. Your picks start whenever they're actually available, same gap-filling as any other mode if someone's later injured, suspended, or rested.
            </div>
          )}
          <div style={{ marginTop: 4, marginBottom: 18 }}>
            <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 6 }}>
              Rest threshold — {club.tactics.restThreshold ?? 0}% fitness
            </div>
            <input
              type="range" min={0} max={80} step={5}
              value={club.tactics.restThreshold ?? 0}
              onChange={(e) => onChange("restThreshold", Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <div style={{ ...serif, fontSize: 11.5, color: PALETTE.inkSoft, marginTop: 4 }}>
              Anyone below this fitness sits out automatically — applies no matter which lineup mode is selected above. Never leaves you short of a full XI.
            </div>
          </div>
        </div>
        <div style={{ minWidth: 280 }}>
          <div style={{ ...display, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8 }}>
            Projected lineup
          </div>
          {projected.map((p) => {
            const isCaptain = p.id === club.captainId;
            const isCustomMode = (club.tactics.lineupMode || "best") === "custom";
            const options = isCustomMode ? swapOptionsFor(p.position, p.id) : [];
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, fontSize: 13, padding: "6px 0", borderBottom: `1px solid ${PALETTE.parchmentDim}`, ...serif }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <span style={{ ...mono, color: PALETTE.inkSoft, marginRight: 8, fontSize: 11 }}>{p.position}</span>
                  {p.name}
                  <span style={{ ...mono, fontWeight: 700, marginLeft: 6 }}>{p.overall}</span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  {isCustomMode && (
                    <select
                      value=""
                      onChange={(e) => { if (e.target.value) onSwapCustomXI(p.id, e.target.value); }}
                      title="Swap this player out for another eligible pick"
                      disabled={options.length === 0}
                      style={{
                        fontSize: 10.5, ...mono, border: `1px solid ${PALETTE.inkSoft}66`, borderRadius: 4,
                        background: PALETTE.parchment, color: options.length === 0 ? `${PALETTE.inkSoft}88` : PALETTE.inkSoft,
                        padding: "2px 3px", maxWidth: 96, cursor: options.length === 0 ? "default" : "pointer",
                      }}
                    >
                      <option value="">{options.length === 0 ? "No swaps" : "Swap ▾"}</option>
                      {options.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.name} ({opt.overall})</option>
                      ))}
                    </select>
                  )}
                  <button
                    onClick={() => onSetCaptain(p.id)}
                    title={isCaptain ? "Captain" : "Make captain"}
                    style={{ fontSize: 14, width: 24, height: 24, borderRadius: 4, cursor: "pointer", padding: 0, border: "none", background: "none", color: isCaptain ? PALETTE.gold : `${PALETTE.inkSoft}66`, flexShrink: 0 }}
                  >
                    ©
                  </button>
                </span>
              </div>
            );
          })}
          {projected.length < 11 && (
            <div style={{ fontSize: 12, color: PALETTE.crimson, marginTop: 8, ...serif }}>
              Only {projected.length} available this matchday.
            </div>

        )}
      </div>
      </div>
    </div>
  );
}

function FormBadges({ form }) {
  const colors = { W: "#2E7D32", D: "#9BA8B0", L: PALETTE.crimson };
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {form.map((r, i) => (
        <span key={i} style={{
          width: 18, height: 18, borderRadius: "50%", background: colors[r], color: "#fff",
          fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", ...mono,
        }}>
          {r}
        </span>
      ))}
    </div>
  );
}

function MatchLine({ label, outcome, revealed = true }) {
  if (!outcome) return null;
  if (!revealed) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", fontSize: 12.5, ...serif, borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
        <span style={{ color: PALETTE.inkSoft, ...mono, width: 90, flexShrink: 0 }}>{label}</span>
        <span style={{ color: PALETTE.inkSoft, fontStyle: "italic" }}>TBD</span>
      </div>
    );
  }
  const { result, wentToPenalties, winner } = outcome;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", fontSize: 12.5, ...serif, borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
      <span style={{ color: PALETTE.inkSoft, ...mono, width: 90, flexShrink: 0 }}>{label}</span>
      <span style={{ flex: 1 }}>
        <span style={{ fontWeight: winner.name === result.homeClub ? 700 : 400 }}>{result.homeClub}</span>
        {" "}<span style={{ ...mono }}>{result.homeScore}-{result.awayScore}</span>{" "}
        <span style={{ fontWeight: winner.name === result.awayClub ? 700 : 400 }}>{result.awayClub}</span>
        {wentToPenalties && <span style={{ color: PALETTE.inkSoft, fontSize: 11 }}> (pens)</span>}
      </span>
    </div>
  );
}

function SeriesLine({ label, series, revealed = true }) {
  if (!series) return null;
  if (!revealed) {
    return (
      <div style={{ padding: "6px 8px", fontSize: 12.5, ...serif, borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
        <span style={{ color: PALETTE.inkSoft, ...mono, width: 90, display: "inline-block" }}>{label}</span>
        <span style={{ color: PALETTE.inkSoft, fontStyle: "italic" }}>TBD</span>
      </div>
    );
  }
  const loserWins = series.hWins > series.lWins ? series.lWins : series.hWins;
  const winnerWins = Math.max(series.hWins, series.lWins);
  const game1 = series.games[0].result;
  const loserName = game1.homeClub === series.winner.name ? game1.awayClub : game1.homeClub;
  return (
    <div style={{ padding: "6px 8px", fontSize: 12.5, ...serif, borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
      <span style={{ color: PALETTE.inkSoft, ...mono, width: 90, display: "inline-block" }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{series.winner.name}</span> beats {loserName}, wins series {winnerWins}-{loserWins}
      <span style={{ color: PALETTE.inkSoft }}> ({series.games.map((g) => `${g.result.homeScore}-${g.result.awayScore}`).join(", ")})</span>
    </div>
  );
}

function ConferenceBracket({ label, conf, revealedRounds }) {
  if (!conf) return null;
  const confChampion = revealedRounds > 3 && conf.confFinal ? conf.confFinal.winner : null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      {confChampion && (
        <div style={{ ...display, fontWeight: 700, fontSize: 13, color: PALETTE.gold, marginBottom: 6 }}>
          🏆 {confChampion.name} — {label} Champion
        </div>
      )}
      <MatchLine label="Conf Final" outcome={conf.confFinal} revealed={revealedRounds > 3} />
      <MatchLine label="Semifinal" outcome={conf.semiA} revealed={revealedRounds > 2} />
      <MatchLine label="Semifinal" outcome={conf.semiB} revealed={revealedRounds > 2} />
      <SeriesLine label="1 seed" series={conf.r1a} revealed={revealedRounds > 1} />
      <SeriesLine label="2 seed" series={conf.r1b} revealed={revealedRounds > 1} />
      <SeriesLine label="3 seed" series={conf.r1c} revealed={revealedRounds > 1} />
      <SeriesLine label="4 seed" series={conf.r1d} revealed={revealedRounds > 1} />
      <MatchLine label="Wild Card" outcome={conf.wildcard} revealed={revealedRounds > 0} />
    </div>
  );
}

// Total "rounds" per competition, for reveal-stepping purposes
// wildcard, round one, conf semis, conf final, cup final
// QF, SF, final
// semis, final
// Unlike MatchLine (built for a single tier's bracket), a US Open Cup match
// is between clubs from potentially different tiers — shows a badge on
// each side and flags a giant-killer upset with a lightning bolt.
function CupMatchLine({ match, userClubId }) {
  const { homeEntrant, awayEntrant, outcome, winnerEntrant, isUpset } = match;
  const { result, wentToPenalties } = outcome;
  const isUserMatch = homeEntrant.club.id === userClubId || awayEntrant.club.id === userClubId;
  const homeWon = winnerEntrant === homeEntrant;
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "start", columnGap: 8, padding: "8px", fontSize: 12.5, ...serif,
      borderBottom: `1px solid ${PALETTE.parchmentDim}`, background: isUserMatch ? `${PALETTE.gold}18` : "none",
    }}>
      <div style={{ display: "flex", alignItems: "start", gap: 5, textAlign: "left" }}>
        <TierBadge tierId={homeEntrant.tierIdx} />
        <span style={{ fontWeight: homeWon ? 700 : 400 }}>{result.homeClub}{isUpset && homeWon ? " ⚡" : ""}</span>
      </div>
      <span style={{ ...mono, flexShrink: 0, textAlign: "center", whiteSpace: "nowrap", padding: "0 4px" }}>
        {result.homeScore}-{result.awayScore}{wentToPenalties ? " (pens)" : ""}
      </span>
      <div style={{ display: "flex", alignItems: "start", gap: 5, justifyContent: "flex-end", textAlign: "right" }}>
        <span style={{ fontWeight: !homeWon ? 700 : 400 }}>{isUpset && !homeWon ? "⚡ " : ""}{result.awayClub}</span>
        <TierBadge tierId={awayEntrant.tierIdx} />
      </div>
    </div>
  );
}

// Once a round's been drawn (but not yet played), find who the user's own
// club is paired against — or whether they drew a bye — so it can be
// shown as a real opponent preview instead of just "a round is coming up."
function findUserDrawnOpponent(pendingDraw, userClubId) {
  if (!pendingDraw) return null;
  if (pendingDraw.byeEntrant?.club.id === userClubId) return { bye: true };
  for (const [home, away] of pendingDraw.pairs) {
    if (home.club.id === userClubId) return { opponent: away, isHome: true };
    if (away.club.id === userClubId) return { opponent: home, isHome: false };
  }
  return null; // not in this round's draw at all (not yet qualified, or eliminated)
}

function UsOpenCupTab({ usOpenCup, pendingRoundIndex, onPlayRound, userClubId }) {
  const hasStarted = !!usOpenCup;
  const done = usOpenCup?.done ?? false;
  const champion = usOpenCup?.champion;
  const drawnOpponent = pendingRoundIndex !== null ? findUserDrawnOpponent(usOpenCup?.pendingDraw, userClubId) : null;

  if (!hasStarted && pendingRoundIndex === null) {
    return (
      <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13, padding: "20px 4px" }}>
        The US Open Cup kicks off at matchday {US_OPEN_CUP_ROUND_MATCHDAYS[0]} — league fixtures pause that week so you can play your cup match here instead.
      </div>
    );
  }

  return (
    <div>
      {done && (
        <div style={{ ...display, fontWeight: 700, fontSize: 16, color: PALETTE.gold, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <TierBadge tierId={champion.tierIdx} /> 🏆 {champion.club.name} win the US Open Cup
        </div>
      )}
      {pendingRoundIndex !== null && (
        <div style={{ background: "#D9C6E8", border: `1px solid ${PALETTE.ink}`, borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <div style={{ ...display, fontWeight: 700, fontSize: 14, color: PALETTE.ink, marginBottom: 8 }}>
            {cupRoundLabel(pendingRoundIndex)} is up this week — league fixtures are on hold until it's played.
          </div>
          {drawnOpponent && (
            <div style={{ ...serif, fontSize: 13, color: PALETTE.ink, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              {drawnOpponent.bye
                ? "You've drawn a bye this round — straight through to the next one."
                : <>Your draw: <TierBadge tierId={drawnOpponent.opponent.tierIdx} /> <strong>{drawnOpponent.isHome ? "vs" : "@"} {drawnOpponent.opponent.club.name}</strong></>}
            </div>
          )}
          <button
            onClick={onPlayRound}
            style={{ padding: "9px 16px", borderRadius: 6, border: "none", background: PALETTE.ink, color: PALETTE.parchment, fontSize: 13, fontWeight: 600, cursor: "pointer", ...display }}
          >
            Play {cupRoundLabel(pendingRoundIndex)}
          </button>
        </div>
      )}
      {!done && pendingRoundIndex === null && hasStarted && (() => {
        const nextTrigger = US_OPEN_CUP_ROUND_MATCHDAYS[usOpenCup.rounds.length];
        return nextTrigger ? (
          <div style={{ ...serif, fontSize: 12.5, color: PALETTE.inkSoft, marginBottom: 16, fontStyle: "italic" }}>
            Next cup round comes up at matchday {nextTrigger}.
          </div>
        ) : null;
      })()}
      {hasStarted && [...usOpenCup.rounds].reverse().map((round, ri) => (
        <div key={ri} style={{ marginBottom: 16 }}>
          <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", marginBottom: 6 }}>{round.label}</div>
          {round.matches.map((m, mi) => <CupMatchLine key={mi} match={m} userClubId={userClubId} />)}
          {round.byeEntrant && (
            <div style={{ ...serif, fontSize: 12, color: PALETTE.inkSoft, padding: "6px 8px", display: "flex", alignItems: "center", gap: 5 }}>
              <TierBadge tierId={round.byeEntrant.tierIdx} /> {round.byeEntrant.club.name} received a bye this round.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Same shape as UsOpenCupTab, generalized for either of England's two cups.
function EnglandCupTab({ cupName, cupProgress, roundMatchdays, pendingRoundIndex, onPlayRound, userClubId }) {
  const hasStarted = !!cupProgress;
  const done = cupProgress?.done ?? false;
  const champion = cupProgress?.champion;

  if (!hasStarted && pendingRoundIndex === null) {
    return (
      <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13, padding: "20px 4px" }}>
        The {cupName} kicks off at matchday {roundMatchdays[0]} — league fixtures pause that week so you can play your cup match here instead.
      </div>
    );
  }

  return (
    <div>
      {done && (
        <div style={{ ...display, fontWeight: 700, fontSize: 16, color: PALETTE.gold, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <TierBadge tierId={champion.tierIdx} /> 🏆 {champion.club.name} win the {cupName}
        </div>
      )}
      {pendingRoundIndex !== null && (
        <div style={{ background: "#D9C6E8", border: `1px solid ${PALETTE.ink}`, borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <div style={{ ...display, fontWeight: 700, fontSize: 14, color: PALETTE.ink, marginBottom: 8 }}>
            {previewStageLabel(pendingRoundIndex)} is up this week — league fixtures are on hold until it's played.
          </div>
          <button
            onClick={onPlayRound}
            style={{ padding: "9px 16px", borderRadius: 6, border: "none", background: PALETTE.ink, color: PALETTE.parchment, fontSize: 13, fontWeight: 600, cursor: "pointer", ...display }}
          >
            Play {previewStageLabel(pendingRoundIndex)}
          </button>
        </div>
      )}
      {!done && pendingRoundIndex === null && hasStarted && (() => {
        const nextTrigger = roundMatchdays[cupProgress.rounds.length];
        return nextTrigger ? (
          <div style={{ ...serif, fontSize: 12.5, color: PALETTE.inkSoft, marginBottom: 16, fontStyle: "italic" }}>
            Next round comes up at matchday {nextTrigger}.
          </div>
        ) : null;
      })()}
      {hasStarted && [...cupProgress.rounds].reverse().map((round, ri) => (
        <div key={ri} style={{ marginBottom: 16 }}>
          <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", marginBottom: 6 }}>{round.label}</div>
          {round.matches.map((m, mi) => <CupMatchLine key={mi} match={m} userClubId={userClubId} />)}
          {round.byeEntrant && (
            <div style={{ ...serif, fontSize: 12, color: PALETTE.inkSoft, padding: "6px 8px", display: "flex", alignItems: "center", gap: 5 }}>
              <TierBadge tierId={round.byeEntrant.tierIdx} /> {round.byeEntrant.club.name} received a bye this round.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Both of England's cups live in the same tab (renamed "Competitions") with
// a switcher between them, since a Premier League club is in both at once.
function CompetitionsTab({ faCup, eflCup, userTierId, state, userClubId, onPlayRound }) {
  const [activeCup, setActiveCup] = useState("fa");
  const pendingFa = pendingEnglandCupCheckpoint(state, state.tiers[userTierId].fixtures.some((f) => !f.played) ? Math.min(...state.tiers[userTierId].fixtures.filter((f) => !f.played).map((f) => f.matchday)) : -1) === "fa"
    ? (faCup?.rounds?.length ?? 0)
    : null;
  const pendingEfl = pendingEnglandCupCheckpoint(state, state.tiers[userTierId].fixtures.some((f) => !f.played) ? Math.min(...state.tiers[userTierId].fixtures.filter((f) => !f.played).map((f) => f.matchday)) : -1) === "efl"
    ? (eflCup?.rounds?.length ?? 0)
    : null;
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{ key: "fa", label: "FA Cup" }, { key: "efl", label: "EFL Cup" }].map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCup(c.key)}
            style={{
              padding: "8px 16px", borderRadius: 6, border: `1px solid ${PALETTE.ink}`, cursor: "pointer", ...display, fontSize: 13, fontWeight: 600,
              background: activeCup === c.key ? PALETTE.ink : "none", color: activeCup === c.key ? PALETTE.parchment : PALETTE.ink,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
      {activeCup === "fa" ? (
        <EnglandCupTab cupName="FA Cup" cupProgress={faCup} roundMatchdays={FA_CUP_ROUND_MATCHDAYS} pendingRoundIndex={pendingFa} onPlayRound={() => onPlayRound("fa")} userClubId={userClubId} />
      ) : (
        <EnglandCupTab cupName="EFL Cup" cupProgress={eflCup} roundMatchdays={EFL_CUP_ROUND_MATCHDAYS} pendingRoundIndex={pendingEfl} onPlayRound={() => onPlayRound("efl")} userClubId={userClubId} />
      )}
    </div>
  );
}

function PlayoffBracketSection({ seasonPlayoffs, tierId, revealedRounds, onSimRound, onSimRest }) {
  if (!seasonPlayoffs) return null;
  const promo = seasonPlayoffs.promotionPlayoffs.find((pp) => pp.tierIdx === tierId);
  const showMls = tierId === 0 && seasonPlayoffs.mlsPlayoffResult;
  const showUslc = tierId === 1 && seasonPlayoffs.uslcPlayoffResult;
  if (!promo && !showMls && !showUslc) return null;

  const myTotalRounds = showMls ? MLS_TOTAL_ROUNDS : showUslc ? USLC_TOTAL_ROUNDS : PROMO_TOTAL_ROUNDS;
  const done = revealedRounds >= myTotalRounds;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft }}>
          Postseason
        </div>
        {!done && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onSimRound}
              style={{ ...display, fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 6, border: "none", background: PALETTE.gold, color: PALETTE.ink, cursor: "pointer" }}
            >
              Sim Next Round
            </button>
            <button
              onClick={onSimRest}
              style={{ ...display, fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 6, border: `1px solid ${PALETTE.ink}`, background: "none", color: PALETTE.ink, cursor: "pointer" }}
            >
              Sim Rest of Postseason
            </button>
          </div>
        )}
      </div>

      {showMls && (
        <div>
          {revealedRounds > 4 && (
            <div style={{ ...display, fontWeight: 700, fontSize: 16, color: PALETTE.gold, marginBottom: 12 }}>
              🏆 {seasonPlayoffs.mlsPlayoffResult.champion.name} win the MLS Cup
            </div>
          )}
          <MatchLine label="MLS Cup" outcome={seasonPlayoffs.mlsPlayoffResult.finalResult} revealed={revealedRounds > 4} />
          <ConferenceBracket label="Eastern Conference" conf={seasonPlayoffs.mlsPlayoffResult.east} revealedRounds={revealedRounds} />
          <ConferenceBracket label="Western Conference" conf={seasonPlayoffs.mlsPlayoffResult.west} revealedRounds={revealedRounds} />
        </div>
      )}

      {showUslc && (
        <div>
          {revealedRounds > 2 && (
            <div style={{ ...display, fontWeight: 700, fontSize: 14, color: PALETTE.gold, marginBottom: 8 }}>
              🏆 {seasonPlayoffs.uslcPlayoffResult.champion.name} win the USL Cup
            </div>
          )}
          <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", marginBottom: 4 }}>Final</div>
          {seasonPlayoffs.uslcPlayoffResult.rounds[2]?.map((o, i) => <MatchLine key={i} label="Final" outcome={o} revealed={revealedRounds > 2} />)}
          <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", margin: "8px 0 4px" }}>Semifinals</div>
          {seasonPlayoffs.uslcPlayoffResult.rounds[1]?.map((o, i) => <MatchLine key={i} label={`SF${i + 1}`} outcome={o} revealed={revealedRounds > 1} />)}
          <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", margin: "8px 0 4px" }}>Quarterfinals</div>
          {seasonPlayoffs.uslcPlayoffResult.rounds[0]?.map((o, i) => <MatchLine key={i} label={`QF${i + 1}`} outcome={o} revealed={revealedRounds > 0} />)}
        </div>
      )}

      {promo && (
        <div>
          <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", marginBottom: 4 }}>
            Promotion Playoff — final spot to {TIER_META[tierId - 1].name}
          </div>
          {promo.bracket ? (
            <>
              <MatchLine label="Semifinal" outcome={promo.bracket.semi1} revealed={revealedRounds > 0} />
              <MatchLine label="Semifinal" outcome={promo.bracket.semi2} revealed={revealedRounds > 0} />
              <MatchLine label="Final" outcome={promo.bracket.final} revealed={revealedRounds > 1} />
              {revealedRounds > 1 && (
                <div style={{ ...display, fontWeight: 700, fontSize: 14, color: PALETTE.gold, marginTop: 8 }}>
                  ⬆️ {promo.bracket.final.winner.name} promoted
                </div>
              )}
            </>
          ) : (
            <div style={{ ...serif, fontSize: 12.5, color: PALETTE.inkSoft }}>Not enough clubs for a playoff this season.</div>
          )}
        </div>
      )}
    </div>
  );
}

function StandingsTable({ table, userClubId, autoQualifyCutoff, wildcardCutoff }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, ...serif }}>
      <thead>
        <tr style={{ textAlign: "left", color: PALETTE.inkSoft, borderBottom: `2px solid ${PALETTE.parchmentDim}` }}>
          {["#", "Club", "P", "W", "D", "L", "GF", "GA", "GD", "Pts", "Form"].map((h) => (
            <th key={h} style={{ padding: "6px 8px", ...display, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.map((row, i) => {
          const isAutoQualifyLine = autoQualifyCutoff != null && i === autoQualifyCutoff - 1;
          const isWildcardLine = wildcardCutoff != null && i === wildcardCutoff - 1;
          return (
          <tr key={row.clubId} style={{
            borderBottom: isAutoQualifyLine ? `2px solid ${PALETTE.ink}` : isWildcardLine ? `2px dashed ${PALETTE.inkSoft}` : `1px solid ${PALETTE.parchmentDim}`,
            background: row.clubId === userClubId ? `${PALETTE.gold}33` : "transparent",
          }}>
            <td style={{ padding: "6px 8px", ...mono }}>{i + 1}</td>
            <td style={{ padding: "6px 8px", fontWeight: row.clubId === userClubId ? 700 : 400 }}>{row.club}</td>
            <td style={{ padding: "6px 8px", ...mono }}>{row.played}</td>
            <td style={{ padding: "6px 8px", ...mono }}>{row.won}</td>
            <td style={{ padding: "6px 8px", ...mono }}>{row.drawn}</td>
            <td style={{ padding: "6px 8px", ...mono }}>{row.lost}</td>
            <td style={{ padding: "6px 8px", ...mono }}>{row.gf}</td>
            <td style={{ padding: "6px 8px", ...mono }}>{row.ga}</td>
            <td style={{ padding: "6px 8px", ...mono }}>{row.gf - row.ga}</td>
            <td style={{ padding: "6px 8px", ...mono, fontWeight: 700 }}>{row.points}</td>
            <td style={{ padding: "6px 8px" }}><FormBadges form={row.form} /></td>
          </tr>
          );
        })}
      </tbody>
      {(autoQualifyCutoff != null || wildcardCutoff != null) && (
        <tfoot>
          <tr>
            <td colSpan={11} style={{ padding: "6px 8px", fontSize: 11, ...serif, color: PALETTE.inkSoft }}>
              {autoQualifyCutoff != null && <span>— solid line: automatic playoff spot </span>}
              {wildcardCutoff != null && <span>&nbsp;&nbsp;·&nbsp;&nbsp;- - - dotted line: wild card contention</span>}
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
}

function TableTab({ tier, userClubId, seasonPlayoffs, revealedRounds, onSimRound, onSimRest }) {
  const [view, setView] = useState("auto"); // "auto" picks bracket-if-postseason, else standings
  const [mlsView, setMlsView] = useState("overall"); // "overall" (Shield standings) | "conference"
  const table = computeTable(tier);

  const promo = seasonPlayoffs?.promotionPlayoffs.find((pp) => pp.tierIdx === tier.id);
  const hasBracket = seasonPlayoffs && (
    (tier.id === 0 && seasonPlayoffs.mlsPlayoffResult) ||
    (tier.id === 1 && seasonPlayoffs.uslcPlayoffResult) ||
    !!promo
  );
  const showingBracket = hasBracket && view !== "standings";

  return (
    <div style={{ overflowX: "auto" }}>
      {hasBracket && (
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button
            onClick={() => setView("auto")}
            style={{ ...display, fontSize: 12, padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: `1px solid ${PALETTE.ink}`, background: showingBracket ? PALETTE.ink : "none", color: showingBracket ? PALETTE.parchment : PALETTE.ink }}
          >
            Bracket
          </button>
          <button
            onClick={() => setView("standings")}
            style={{ ...display, fontSize: 12, padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: `1px solid ${PALETTE.ink}`, background: !showingBracket ? PALETTE.ink : "none", color: !showingBracket ? PALETTE.parchment : PALETTE.ink }}
          >
            Final Standings
          </button>
        </div>
      )}

      {showingBracket ? (
        <PlayoffBracketSection seasonPlayoffs={seasonPlayoffs} tierId={tier.id} revealedRounds={revealedRounds} onSimRound={onSimRound} onSimRest={onSimRest} />
      ) : (
        <>
          {tier.id === 0 && !hasBracket && (
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <button
                onClick={() => setMlsView("overall")}
                style={{ ...display, fontSize: 12, padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: `1px solid ${PALETTE.ink}`, background: mlsView === "overall" ? PALETTE.ink : "none", color: mlsView === "overall" ? PALETTE.parchment : PALETTE.ink }}
              >
                Overall (Shield)
              </button>
              <button
                onClick={() => setMlsView("conference")}
                style={{ ...display, fontSize: 12, padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: `1px solid ${PALETTE.ink}`, background: mlsView === "conference" ? PALETTE.ink : "none", color: mlsView === "conference" ? PALETTE.parchment : PALETTE.ink }}
              >
                By Conference
              </button>
            </div>
          )}
          {tier.id === 0 && mlsView === "conference" && !hasBracket ? (() => {
            const conferenceByClubId = new Map(tier.clubs.map((c) => [c.id, c.conference]));
            return (
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 320 }}>
                  <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", marginBottom: 6 }}>Eastern Conference</div>
                  <StandingsTable table={table.filter((r) => conferenceByClubId.get(r.clubId) === "East")} userClubId={userClubId} autoQualifyCutoff={7} wildcardCutoff={9} />
                </div>
                <div style={{ flex: 1, minWidth: 320 }}>
                  <div style={{ ...display, fontSize: 12, fontWeight: 700, color: PALETTE.inkSoft, textTransform: "uppercase", marginBottom: 6 }}>Western Conference</div>
                  <StandingsTable table={table.filter((r) => conferenceByClubId.get(r.clubId) === "West")} userClubId={userClubId} autoQualifyCutoff={7} wildcardCutoff={9} />
                </div>
              </div>
            );
          })() : (
            <StandingsTable table={table} userClubId={userClubId} />
          )}
        </>
      )}
    </div>
  );
}

// Builds a short preview of what's coming up — interleaving ordinary
// league matchdays with US Open Cup rounds — so a manager can actually
// plan rotation ahead of a cup week instead of finding out reactively.
// This is a preview only (it assumes each cup round gets played on
// schedule), not an authoritative source.
function buildUpcomingSchedule(tier, userClubId, usOpenCup, startMatchday, count, hasOpenCup, faCup, eflCup) {
  const userFixtures = tier.fixtures.filter((f) => f.homeClubId === userClubId || f.awayClubId === userClubId);
  const items = [];
  let usCupRoundsPlayed = usOpenCup?.rounds?.length ?? 0;
  let usCupDone = usOpenCup?.done ?? false;
  let faRoundsPlayed = faCup?.rounds?.length ?? 0;
  let faDone = faCup?.done ?? false;
  let eflRoundsPlayed = eflCup?.rounds?.length ?? 0;
  let eflDone = eflCup?.done ?? false;
  const isEngland = !hasOpenCup && (faCup !== undefined || eflCup !== undefined);
  for (let md = startMatchday; items.length < count && md <= startMatchday + 40; md++) {
    if (hasOpenCup) {
      const cupIdx = US_OPEN_CUP_ROUND_MATCHDAYS.indexOf(md);
      if (!usCupDone && cupIdx !== -1 && cupIdx === usCupRoundsPlayed) {
        items.push({ type: "cup", label: cupRoundLabel(cupIdx), matchday: md, roundIndex: cupIdx, cupName: "US Open Cup" });
        usCupRoundsPlayed++;
        if (usCupRoundsPlayed >= US_OPEN_CUP_TOTAL_ROUNDS) usCupDone = true;
        continue;
      }
    } else if (isEngland) {
      const faIdx = FA_CUP_ROUND_MATCHDAYS.indexOf(md);
      if (!faDone && faIdx !== -1 && faIdx === faRoundsPlayed) {
        items.push({ type: "cup", label: previewStageLabel(faIdx), matchday: md, roundIndex: faIdx, cupName: "FA Cup" });
        faRoundsPlayed++;
        continue;
      }
      const eflIdx = EFL_CUP_ROUND_MATCHDAYS.indexOf(md);
      if (!eflDone && eflIdx !== -1 && eflIdx === eflRoundsPlayed) {
        items.push({ type: "cup", label: previewStageLabel(eflIdx), matchday: md, roundIndex: eflIdx, cupName: "EFL Cup" });
        eflRoundsPlayed++;
        continue;
      }
    }
    const fx = userFixtures.find((f) => f.matchday === md);
    if (fx) {
      const oppId = fx.homeClubId === userClubId ? fx.awayClubId : fx.homeClubId;
      const opp = tier.clubs.find((c) => c.id === oppId);
      const isHome = fx.homeClubId === userClubId;
      items.push({ type: "league", label: opp?.name ?? "?", isHome, matchday: md });
    }
  }
  return items;
}

function FixturesTab({ tier, userClubId, usOpenCup, faCup, eflCup }) {
  const hasOpenCup = tier.id < 4; // US Open Cup only exists for the USA pyramid
  const clubName = (id) => tier.clubs.find((c) => c.id === id)?.name ?? "?";
  const userFixtures = tier.fixtures.filter((f) => f.homeClubId === userClubId || f.awayClubId === userClubId);
  const nextFixture = userFixtures.find((f) => !f.played);
  const opponentId = nextFixture ? (nextFixture.homeClubId === userClubId ? nextFixture.awayClubId : nextFixture.homeClubId) : null;
  const opponent = opponentId ? tier.clubs.find((c) => c.id === opponentId) : null;
  const userClub = tier.clubs.find((c) => c.id === userClubId);

  let scouting = null;
  if (opponent && userClub) {
    const oppRatings = clubLineRatings(opponent);
    const myRatings = clubLineRatings(userClub);
    const table = computeTable(tier);
    const oppRow = table.find((r) => r.clubId === opponentId);
    const oppForm = oppRow ? oppRow.form.slice(-5) : [];
    const diffs = [
      ["theirAttackVsMyDefense", oppRatings.att - myRatings.def], // positive = danger (their attack beats my defense)
      ["myAttackVsTheirDefense", myRatings.att - oppRatings.def], // positive = opportunity (my attack beats their defense)
      ["midfield", myRatings.mid - oppRatings.mid], // positive = my edge
    ];
    const biggestEdge = diffs.reduce((a, b) => (Math.abs(b[1]) > Math.abs(a[1]) ? b : a));
    const oppLosses = oppForm.filter((r) => r === "L").length;
    const oppWins = oppForm.filter((r) => r === "W").length;
    let tip;
    if (Math.abs(biggestEdge[1]) < 1) {
      tip = "This looks like an even matchup on paper — a balanced approach is reasonable.";
    } else if (biggestEdge[0] === "theirAttackVsMyDefense") {
      tip = biggestEdge[1] > 0
        ? `Their attack (${oppRatings.att}★) is notably stronger than your defense (${myRatings.def}★) — consider a more defensive setup.`
        : `Your defense (${myRatings.def}★) should hold up well against their attack (${oppRatings.att}★) — a solid platform to play from.`;
    } else if (biggestEdge[0] === "myAttackVsTheirDefense") {
      tip = biggestEdge[1] > 0
        ? `Your attack (${myRatings.att}★) is notably stronger than their defense (${oppRatings.def}★) — an attacking approach could pay off.`
        : `Their defense (${oppRatings.def}★) is well ahead of your attack (${myRatings.att}★) — goals may be hard to come by.`;
    } else if (biggestEdge[1] > 0) {
      tip = `You have the edge in midfield (${myRatings.mid}★ vs ${oppRatings.mid}★) — control the game through the middle and let your other lines follow.`;
    } else {
      tip = `They control the midfield battle (${oppRatings.mid}★ vs your ${myRatings.mid}★) — a more direct approach may bypass it better than trying to out-possess them.`;
    }
    if (oppForm.length >= 3 && oppLosses >= 3) tip += ` They're out of form lately (${oppForm.join("")}) — a good time to be aggressive.`;
    else if (oppForm.length >= 3 && oppWins >= 4) tip += ` They're red-hot right now (${oppForm.join("")}) — don't take them lightly.`;
    scouting = { opponent, oppRatings, oppForm, tip };
  }

  const nextMd = userFixtures.find((f) => !f.played)?.matchday ?? null;
  const upcoming = nextMd !== null ? buildUpcomingSchedule(tier, userClubId, usOpenCup, nextMd, 12, hasOpenCup, faCup, eflCup) : [];

  return (
    <div>
      {upcoming.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...display, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8 }}>
            Upcoming
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {upcoming.map((item, i) => {
              const relevantCup = item.type === "cup" ? (item.cupName === "US Open Cup" ? usOpenCup : item.cupName === "FA Cup" ? faCup : item.cupName === "EFL Cup" ? eflCup : null) : null;
              const drawn = relevantCup && relevantCup.pendingDraw?.roundIndex === item.roundIndex
                ? findUserDrawnOpponent(relevantCup.pendingDraw, userClubId)
                : null;
              const cupText = drawn
                ? drawn.bye ? `⭐ ${item.cupName} — ${item.label} (bye)` : `⭐ ${item.cupName} — ${item.label}: ${drawn.isHome ? "vs" : "@"} ${drawn.opponent.club.name}`
                : `⭐ ${item.cupName} — ${item.label}`;
              return (
                <div key={i} style={{
                  padding: "6px 10px", borderRadius: 6, fontSize: 12, ...serif,
                  background: item.type === "cup" ? `${PALETTE.gold}22` : PALETTE.parchmentDim,
                  border: item.type === "cup" ? `1px solid ${PALETTE.gold}` : `1px solid ${PALETTE.parchmentDim}`,
                }}>
                  {item.type === "cup" ? cupText : `${item.isHome ? "vs" : "@"} ${item.label}`}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {scouting && (
        <div style={{ background: PALETTE.parchmentDim, borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <div style={{ ...display, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8 }}>
            Next Opponent — {scouting.opponent.name}
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
            {[["DEF", scouting.oppRatings.def], ["MID", scouting.oppRatings.mid], ["ATT", scouting.oppRatings.att]].map(([label, val]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ ...display, fontSize: 11, fontWeight: 700, color: PALETTE.inkSoft }}>{label}</span>
                <span style={{ color: PALETTE.gold, fontSize: 14 }}><StarRow value={val} /></span>
              </div>
            ))}
            {scouting.oppForm.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ ...display, fontSize: 11, fontWeight: 700, color: PALETTE.inkSoft }}>FORM</span>
                <FormBadges form={scouting.oppForm} />
              </div>
            )}
          </div>
          <div style={{ ...serif, fontSize: 12.5, color: PALETTE.ink }}>{scouting.tip}</div>
        </div>
      )}
      {(() => {
        // Build the set of matchdays where an unplayed cup round will
        // interrupt league play, so the full list can show it right where
        // it actually happens instead of leaving it looking like the
        // league fixture at that matchday is just... missing context.
        const cupCheckpointsByMatchday = {};
        if (hasOpenCup) {
          const played = usOpenCup?.rounds?.length ?? 0;
          const done = usOpenCup?.done ?? false;
          if (!done) US_OPEN_CUP_ROUND_MATCHDAYS.forEach((md, idx) => {
            if (idx >= played) cupCheckpointsByMatchday[md] = { cupName: "US Open Cup", label: cupRoundLabel(idx) };
          });
        } else if (faCup !== undefined || eflCup !== undefined) {
          const faPlayed = faCup?.rounds?.length ?? 0;
          if (!faCup?.done) FA_CUP_ROUND_MATCHDAYS.forEach((md, idx) => {
            if (idx >= faPlayed) cupCheckpointsByMatchday[md] = { cupName: "FA Cup", label: previewStageLabel(idx) };
          });
          const eflPlayed = eflCup?.rounds?.length ?? 0;
          if (!eflCup?.done) EFL_CUP_ROUND_MATCHDAYS.forEach((md, idx) => {
            if (idx >= eflPlayed) cupCheckpointsByMatchday[md] = { cupName: "EFL Cup", label: previewStageLabel(idx) };
          });
        }
        return userFixtures.map((f) => {
          const cupHere = !f.played ? cupCheckpointsByMatchday[f.matchday] : null;
          return (
            <React.Fragment key={f.id}>
              {cupHere && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", fontSize: 12, ...serif, background: `${PALETTE.gold}18`, borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
                  <Star size={13} color={PALETTE.gold} />
                  <span>Before this fixture: <strong>{cupHere.cupName} — {cupHere.label}</strong></span>
                </div>
              )}
              <div style={{
                display: "flex", justifyContent: "space-between", padding: "8px 10px", fontSize: 13,
                borderBottom: `1px solid ${PALETTE.parchmentDim}`, ...serif,
                background: (!f.played && f.id === nextFixture?.id) ? `${PALETTE.gold}18` : "none",
              }}>
                <span style={{ color: PALETTE.inkSoft, ...mono, width: 32 }}>MD{f.matchday}</span>
                <span style={{ flex: 1 }}>{clubName(f.homeClubId)} vs {clubName(f.awayClubId)}</span>
                <span style={{ ...mono, fontWeight: 700 }}>{f.played ? `${f.homeScore} - ${f.awayScore}` : "—"}</span>
              </div>
            </React.Fragment>
          );
        });
      })()}
    </div>
  );
}

// Scores a listed player for how good a fit they'd be for this specific
// club right now — not just "is this player good" but "does THIS club need
// THIS player": position need (weak line, thin depth, contracts expiring),
// how much of an upgrade they'd actually be over the incumbents, age fit,
// and whether the club can really afford them (price up front, and wage
// room if wages are tracked). Higher score = better recommendation.
// Same wage-strain signal computeRecommendationScore penalizes, exposed on
// its own so the Market tab can flag a signing as financially risky and
// require confirmation, regardless of which sort mode is active (not just
// when browsing "Recommended").
function MarketTab({ tiers, userClub, userTierId, onBuy, difficulty, matchday }) {
  const [sortField, setSortField] = useState("overall");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);
  // A financially risky signing (wage would strain the budget) no longer
  // gets buried by a hard exclusion — instead Buy asks for confirmation
  // first, same two-step pattern as resetting a save elsewhere in the app.
  const [confirmingBuyId, setConfirmingBuyId] = useState(null);
  const xi = startingXI(userClub, matchday ?? 1);

  const listed = [];
  tiers.forEach((t) => {
    t.clubs.forEach((c) => {
      if (c.id === userClub.id) return;
      c.squad.forEach((p) => {
        if (p.transferListed) listed.push({ player: p, seller: c, tierId: t.id });
      });
    });
  });

  const isRecommended = sortField === "recommended";
  let recommendedList = [];
  if (isRecommended) {
    listed.forEach((entry) => { entry.score = computeRecommendationScore(entry.player, userClub, difficulty, userTierId, tiers[userTierId]?.clubs); });
    const affordable = listed.filter((e) => e.score > -Infinity);
    affordable.sort((a, b) => b.score - a.score);
    // Cap per-position so the list reads as "a couple good options in each
    // area of need" rather than one position (especially GK, which has few
    // real slots to begin with) crowding out everything else. GK capped
    // hard at 1 — a squad rarely needs to shop for more than one keeper
    // at a time, so even 2 felt like too many relative to outfield needs.
    const MAX_PER_POSITION = { GK: 1, DEF: 6, MID: 6, FWD: 6 };
    const perPositionCount = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    const RECOMMENDED_TOTAL = 18;
    for (const entry of affordable) {
      if (recommendedList.length >= RECOMMENDED_TOTAL) break;
      const pos = entry.player.position;
      const cap = MAX_PER_POSITION[pos] ?? 5;
      if ((perPositionCount[pos] ?? 0) >= cap) continue;
      recommendedList.push(entry);
      perPositionCount[pos] = (perPositionCount[pos] ?? 0) + 1;
    }
    // computeRecommendationScore's quality/fit filters can legitimately
    // zero out the whole list — a real budget crunch, or simply nothing
    // that's a clear upgrade right now — but "nothing affordable stands
    // out" isn't the same thing as "nothing affordable exists." If ANY
    // player anywhere is genuinely within budget (fee + wage/cap room,
    // roster space), that's still worth surfacing as a budget-conscious
    // fallback rather than showing a flat dead end.
    if (recommendedList.length === 0 && userClub.squad.length < MAX_SQUAD_SIZE) {
      const currentPayroll = effectivePayroll(userClub.squad, userClub.designatedPlayerIds);
      const capRoom = userTierId === 0 ? MLS_SALARY_CAP - currentPayroll : Infinity;
      const isDpEligible = userTierId === 0 && DIFFICULTY_MODES[difficulty]?.dps && (userClub.designatedPlayerIds || []).length < MAX_DESIGNATED_PLAYERS;
      const deposit = tiers[userTierId]?.clubs ? ownershipDepositFor(userTierId, difficulty, userClub, tiers[userTierId].clubs) : 0;
      const budgetOnly = listed.filter((e) => {
        if (userClub.budget < e.player.askingPrice) return false;
        if (!DIFFICULTY_MODES[difficulty]?.wagesDeducted) return true;
        if (!isDpEligible && e.player.wage > capRoom) return false;
        const remainingRoom = userClub.budget + deposit - currentPayroll;
        if (e.player.wage > 0 && remainingRoom <= 0) return false;
        return true;
      });
      budgetOnly.sort((a, b) => b.player.overall - a.player.overall);
      recommendedList = budgetOnly.slice(0, 6).map((e) => ({ ...e, isFallback: true }));
    }
  } else {
    const dir = sortDir === "asc" ? 1 : -1;
    listed.sort((a, b) => {
      const av = sortField === "price" ? a.player.askingPrice : a.player[sortField];
      const bv = sortField === "price" ? b.player.askingPrice : b.player[sortField];
      return (av - bv) * dir;
    });
  }

  const activeList = isRecommended ? recommendedList : listed;
  const totalPages = Math.max(1, Math.ceil(activeList.length / MARKET_PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages - 1);
  const pageItems = activeList.slice(clampedPage * MARKET_PAGE_SIZE, (clampedPage + 1) * MARKET_PAGE_SIZE);

  const SortButton = ({ field, label }) => (
    <button
      onClick={() => {
        if (field === "recommended") { setSortField("recommended"); setPage(0); return; }
        if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else { setSortField(field); setSortDir("desc"); }
        setPage(0);
      }}
      style={{
        fontSize: 11, padding: "5px 10px", borderRadius: 5, cursor: "pointer", ...display,
        border: `1px solid ${sortField === field ? PALETTE.ink : PALETTE.parchmentDim}`,
        background: sortField === field ? PALETTE.ink : "none",
        color: sortField === field ? PALETTE.parchment : PALETTE.inkSoft,
      }}
    >
      {label}{field !== "recommended" && sortField === field ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
    </button>
  );

  return (
    <div>
      <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 10 }}>
        {listed.length} players listed across the pyramid — your budget: ${safeNum(userClub.budget).toLocaleString()}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        <SortButton field="recommended" label="★ Recommended" />
        <SortButton field="overall" label="Rating" />
        <SortButton field="potential" label="Potential" />
        <SortButton field="age" label="Age" />
        <SortButton field="askingPrice" label="Price" />
      </div>
      {isRecommended && (
        <div style={{ ...serif, fontSize: 12.5, color: PALETTE.inkSoft, marginBottom: 10, fontStyle: "italic" }}>
          Based on your squad's needs, depth, contract situation, and what you can actually afford — not just raw ratings.
        </div>
      )}
      {isRecommended && recommendedList.length > 0 && (() => {
        // Cumulative affordability: how many of these, taken in order, could
        // you actually sign TOGETHER before running out of budget — not just
        // "is this one individually affordable," which said nothing about
        // whether you could make more than one move.
        let remaining = userClub.budget;
        let affordableCount = 0;
        let totalCost = 0;
        for (const entry of recommendedList) {
          if (entry.player.askingPrice > remaining) break;
          remaining -= entry.player.askingPrice;
          totalCost += entry.player.askingPrice;
          affordableCount++;
        }
        if (affordableCount < 2) return null;
        return (
          <div style={{ background: `${PALETTE.gold}22`, border: `1px solid ${PALETTE.gold}`, borderRadius: 8, padding: "8px 12px", marginBottom: 12, ...serif, fontSize: 12.5, color: PALETTE.ink }}>
            💰 You could afford your top {affordableCount} picks here together — ${totalCost.toLocaleString()} total, ${remaining.toLocaleString()} left over.
          </div>
        );
      })()}
      {isRecommended && recommendedList.length > 0 && recommendedList[0]?.isFallback && (
        <div style={{ background: `${PALETTE.parchmentDim}`, borderRadius: 8, padding: "8px 12px", marginBottom: 12, ...serif, fontSize: 12.5, color: PALETTE.inkSoft, fontStyle: "italic" }}>
          Nothing matched your squad's usual needs closely enough to stand out — these are simply the best-rated players you can currently afford.
        </div>
      )}
      {activeList.length === 0 && (
        <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13, padding: "12px 0" }}>
          {isRecommended ? "Nothing on the market is currently within your budget." : "No players listed right now — check back after the next transfer window."}
        </div>
      )}
      {pageItems.map(({ player, seller, tierId, isFallback }) => {
        const canAfford = userClub.budget >= player.askingPrice;
        const risky = canAfford && isFinanciallyRisky(player, userClub, difficulty, userTierId, tiers[userTierId]?.clubs);
        const confirming = confirmingBuyId === player.id;
        return (
          <div key={player.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 8px",
            borderBottom: `1px solid ${PALETTE.parchmentDim}`, fontSize: 13, ...serif,
          }}>
            <div>
              <div style={{ fontWeight: 600 }}>{player.name}</div>
              <div style={{ ...mono, color: PALETTE.inkSoft, fontWeight: 400, fontSize: 12.5, marginTop: 2 }}>
                {player.position} · OVR {player.overall} · POT {player.potential} · age {player.age}
              </div>
              <div style={{ marginTop: 4 }}>
                <TierBadge tierId={tierId} />
              </div>
              <div style={{ fontSize: 12, color: PALETTE.inkSoft, marginTop: 4 }}>from {seller.name}</div>
              {isRecommended && (
                <div style={{ fontSize: 11.5, color: PALETTE.gold, marginTop: 2 }}>
                  ★ {isFallback ? "cheapest option that fits your current budget" : recommendationReason(player, userClub, xi)}
                </div>
              )}
              {risky && !confirming && (
                <div style={{ fontSize: 11.5, color: PALETTE.crimson, marginTop: 2 }}>
                  ⚠ Their wage would strain your budget — you can still sign them.
                </div>
              )}
              {confirming && (
                <div style={{ fontSize: 11.5, color: PALETTE.crimson, marginTop: 2 }}>
                  Sign {player.name} anyway despite the wage strain?
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ ...mono, fontWeight: 700 }}>${player.askingPrice.toLocaleString()}</span>
              {confirming ? (
                <>
                  <button
                    onClick={() => { onBuy(player.id, seller.id, tierId); setConfirmingBuyId(null); }}
                    style={{ padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer", background: PALETTE.crimson, color: PALETTE.parchment, ...display, fontSize: 12, fontWeight: 700 }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmingBuyId(null)}
                    style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${PALETTE.inkSoft}`, background: "none", cursor: "pointer", color: PALETTE.inkSoft, ...display, fontSize: 12 }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    if (!canAfford) return;
                    if (risky) { setConfirmingBuyId(player.id); return; }
                    onBuy(player.id, seller.id, tierId);
                  }}
                  disabled={!canAfford}
                  style={{
                    padding: "6px 12px", borderRadius: 6, border: "none", cursor: canAfford ? "pointer" : "not-allowed",
                    background: canAfford ? PALETTE.pitch : PALETTE.parchmentDim, color: canAfford ? PALETTE.parchment : PALETTE.inkSoft,
                    ...display, fontSize: 12,
                  }}
                >
                  Buy
                </button>
              )}
            </div>
          </div>
        );
      })}
      {activeList.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 16 }}>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={clampedPage === 0}
            style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${PALETTE.ink}`, background: "none", cursor: clampedPage === 0 ? "not-allowed" : "pointer", opacity: clampedPage === 0 ? 0.4 : 1, ...display, fontSize: 12 }}
          >
            ← Prev
          </button>
          <span style={{ ...mono, fontSize: 12, color: PALETTE.inkSoft }}>
            Page {clampedPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={clampedPage >= totalPages - 1}
            style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${PALETTE.ink}`, background: "none", cursor: clampedPage >= totalPages - 1 ? "not-allowed" : "pointer", opacity: clampedPage >= totalPages - 1 ? 0.4 : 1, ...display, fontSize: 12 }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// The world's own headlines — AI-to-AI transfers and record-breaking
// moments, so the pyramid feels alive even in leagues you're not
// currently watching. Purely a read-only feed, newest first (already
// stored that way).
function NewsTab({ newsFeed }) {
  const feed = newsFeed || [];
  return (
    <div>
      <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 10 }}>
        World News
      </div>
      {feed.length === 0 && (
        <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13 }}>Nothing to report yet — check back after a few matchdays.</div>
      )}
      {feed.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 4px", borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...serif, fontSize: 13.5, color: item.category === "record" ? PALETTE.gold : PALETTE.ink, fontWeight: item.category === "record" ? 700 : 400 }}>
              {item.headline}
            </div>
            <div style={{ ...mono, fontSize: 10.5, color: PALETTE.inkSoft, marginTop: 2 }}>Season {item.season}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Shared by TrophyTab (mid-career, viewable any time) and the end-of-career
// epilogue shown right before "Reset to a new save" actually wipes
// everything — same numbers, same formula, so the two never disagree.
function computeCareerSummary(trophyLog, careerStats, currentClubName) {
  const promotions = trophyLog.filter((t) => t.type === "promotion");
  const clubsManaged = Array.from(new Set(trophyLog.filter((t) => t.type === "season-marker").map((t) => t.clubName)));
  const orderedClubs = [
    ...(clubsManaged.includes(currentClubName) ? [currentClubName] : []),
    ...clubsManaged.filter((c) => c !== currentClubName),
  ];
  const clubSummaries = orderedClubs.map((clubName) => {
    const seasons = new Set(trophyLog.filter((t) => t.type === "season-marker" && t.clubName === clubName).map((t) => t.season));
    const wins = trophyLog.filter((t) => t.clubName === clubName && t.note?.startsWith("Won"));
    const counts = {};
    wins.forEach((t) => {
      const label = t.note.replace(/^Won the /, "");
      counts[label] = (counts[label] || 0) + 1;
    });
    return { clubName, seasonCount: seasons.size, trophyCountEntries: Object.entries(counts).sort((a, b) => b[1] - a[1]) };
  });
  const stats = careerStats || { gamesPlayed: 0, wins: 0, draws: 0, losses: 0, biggestSigning: null };
  const totalTrophies = clubSummaries.reduce((s, c) => s + c.trophyCountEntries.reduce((s2, [, n]) => s2 + n, 0), 0);
  const favouriteClub = clubSummaries.reduce((best, c) => (!best || c.seasonCount > best.seasonCount ? c : best), null);
  const winPct = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  const legacyScore = totalTrophies * 100 + promotions.length * 40 + stats.wins * 2 + stats.gamesPlayed;
  return { promotions, clubSummaries, stats, totalTrophies, favouriteClub, winPct, legacyScore };
}

function ManagerStatBlock({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
      <span style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft }}>{label}</span>
      <span style={{ ...display, fontSize: 13, fontWeight: 700, color: PALETTE.ink }}>{value}</span>
    </div>
  );
}

// The end-of-career epilogue — shown once, right before a "Reset to a new
// save" actually wipes managerHistory. This is the LAST chance to see these
// numbers, since closing it is what triggers the real reset.
function CareerSummaryScreen({ managerHistory, currentClubName, onClose }) {
  const { clubSummaries, totalTrophies, favouriteClub, winPct, legacyScore, stats } = computeCareerSummary(
    managerHistory.trophyLog || [], managerHistory.careerStats, currentClubName
  );
  return (
    <div style={{ minHeight: "100vh", background: PALETTE.pitchDark, ...serif, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 480, width: "100%", background: PALETTE.parchment, borderRadius: 12, padding: 32 }}>
        <div style={{ ...display, fontSize: 28, fontWeight: 700, color: PALETTE.ink, textAlign: "center", marginBottom: 4 }}>
          Career Summary
        </div>
        <div style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft, textAlign: "center", marginBottom: 24 }}>
          Closing this starts a brand new save — this is your last look at these numbers.
        </div>
        <ManagerStatBlock label="Games played" value={stats.gamesPlayed} />
        <ManagerStatBlock label="Wins" value={`${stats.wins}W ${stats.draws}D ${stats.losses}L`} />
        <ManagerStatBlock label="Win %" value={`${winPct}%`} />
        <ManagerStatBlock label="Trophies" value={totalTrophies} />
        <ManagerStatBlock label="Clubs" value={clubSummaries.length} />
        <ManagerStatBlock label="Favourite Club" value={favouriteClub ? `${favouriteClub.clubName} (${favouriteClub.seasonCount} seasons)` : "—"} />
        <ManagerStatBlock label="Biggest Signing" value={stats.biggestSigning ? `${stats.biggestSigning.playerName} — $${stats.biggestSigning.fee.toLocaleString()}` : "—"} />
        <ManagerStatBlock label="Legacy Score" value={legacyScore.toLocaleString()} />
        <button
          onClick={onClose}
          style={{ width: "100%", marginTop: 24, padding: "12px 16px", borderRadius: 8, border: "none", background: PALETTE.crimson, color: "#fff", cursor: "pointer", ...display, fontSize: 14, fontWeight: 700 }}
        >
          Close &amp; Start New Save
        </button>
      </div>
    </div>
  );
}

function TrophyTab({ trophyLog, bestFinish, bestFinishUsa, bestFinishEngland, currentClubName, worldRecords, careerStats }) {
  const ordinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  const mutedRed = "#9C6B62"; // on-palette, muted — informational, not alarm-red

  // Relegations only matter as a live warning sign for the club you're
  // currently at — once you've moved on, an old club's relegation is just
  // noise in your own career log, so drop it from History entirely.
  const visibleLog = trophyLog.filter((t) => t.type !== "season-marker" && (t.type !== "relegation" || t.clubName === currentClubName));
  const history = visibleLog.filter((t) => t.type !== "promotion");

  const { promotions, clubSummaries, stats, totalTrophies, favouriteClub, winPct, legacyScore } = computeCareerSummary(trophyLog, careerStats, currentClubName);

  const bestFinishRow = (label, finish) => finish && (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `${PALETTE.gold}22`, border: `1px solid ${PALETTE.gold}55`, borderRadius: 8, marginBottom: 8 }}>
      <Trophy size={22} color={PALETTE.gold} />
      <div>
        <div style={{ ...display, fontWeight: 700, fontSize: 15, color: PALETTE.ink }}>
          {label}Highest finish: {ordinal(finish.position)} place{finish.points != null ? ` · ${finish.points} pts` : ""}
        </div>
        <div style={{ ...serif, fontSize: 12.5, color: PALETTE.inkSoft }}>
          {FULL_TIER_META[finish.tierIdx].name} · Season {finish.season}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 10 }}>
        Manager Career
      </div>
      <div style={{ border: `1px solid ${PALETTE.parchmentDim}`, borderRadius: 8, padding: "4px 14px", marginBottom: 20 }}>
        <ManagerStatBlock label="Games played" value={stats.gamesPlayed} />
        <ManagerStatBlock label="Wins" value={`${stats.wins}W ${stats.draws}D ${stats.losses}L`} />
        <ManagerStatBlock label="Win %" value={`${winPct}%`} />
        <ManagerStatBlock label="Trophies" value={totalTrophies} />
        <ManagerStatBlock label="Clubs managed" value={clubSummaries.length} />
        <ManagerStatBlock label="Favourite club" value={favouriteClub ? `${favouriteClub.clubName} (${favouriteClub.seasonCount} seasons)` : "—"} />
        <ManagerStatBlock label="Biggest signing" value={stats.biggestSigning ? `${stats.biggestSigning.playerName} — $${stats.biggestSigning.fee.toLocaleString()}` : "—"} />
        <ManagerStatBlock label="Legacy Score" value={legacyScore.toLocaleString()} />
      </div>

      <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 10 }}>
        Career Highlights
      </div>
      {bestFinishUsa && bestFinishEngland ? (
        <>
          {bestFinishRow("USA — ", bestFinishUsa)}
          {bestFinishRow("England — ", bestFinishEngland)}
        </>
      ) : bestFinish ? (
        bestFinishRow("", bestFinish)
      ) : (
        <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13, marginBottom: 12 }}>No seasons completed yet.</div>
      )}

      {clubSummaries.map(({ clubName, seasonCount, trophyCountEntries }) => (
        (seasonCount > 0 || trophyCountEntries.length > 0) && (
          <div key={clubName} style={{ padding: "12px 14px", background: PALETTE.parchmentDim, borderRadius: 8, marginTop: 12, marginBottom: 4 }}>
            <div style={{ ...display, fontWeight: 700, fontSize: 14, color: PALETTE.ink, marginBottom: trophyCountEntries.length > 0 ? 8 : 0 }}>
              {clubName} — {seasonCount} season{seasonCount === 1 ? "" : "s"}{clubName === currentClubName ? "" : " (previous club)"}
            </div>
            {trophyCountEntries.length > 0 ? trophyCountEntries.map(([label, count]) => (
              <div key={label} style={{ ...serif, fontSize: 13, color: PALETTE.ink, padding: "2px 0" }}>
                {count}× {label}
              </div>
            )) : (
              <div style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft, padding: "2px 0" }}>No trophies yet.</div>
            )}
          </div>
        )
      ))}

      {worldRecords && (worldRecords.mostCareerGoals || worldRecords.biggestTransfer || worldRecords.fastestHatTrick || worldRecords.youngestDebut || worldRecords.mostLeagueTitles) && (
        <div style={{ marginTop: 16 }}>
          <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 8 }}>
            World Records
          </div>
          <div style={{ border: `1px solid ${PALETTE.parchmentDim}`, borderRadius: 8, overflow: "hidden" }}>
            {worldRecords.mostCareerGoals && (
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${PALETTE.parchmentDim}`, ...serif, fontSize: 13, color: PALETTE.ink }}>
                <span style={{ ...display, fontSize: 11, color: PALETTE.inkSoft }}>MOST CAREER GOALS</span><br />
                {worldRecords.mostCareerGoals.playerName} ({worldRecords.mostCareerGoals.clubName}) — {worldRecords.mostCareerGoals.goals}
              </div>
            )}
            {worldRecords.biggestTransfer && (
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${PALETTE.parchmentDim}`, ...serif, fontSize: 13, color: PALETTE.ink }}>
                <span style={{ ...display, fontSize: 11, color: PALETTE.inkSoft }}>BIGGEST TRANSFER</span><br />
                {worldRecords.biggestTransfer.playerName}: {worldRecords.biggestTransfer.fromClub} → {worldRecords.biggestTransfer.toClub}, ${worldRecords.biggestTransfer.fee.toLocaleString()} (S{worldRecords.biggestTransfer.season})
              </div>
            )}
            {worldRecords.fastestHatTrick && (
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${PALETTE.parchmentDim}`, ...serif, fontSize: 13, color: PALETTE.ink }}>
                <span style={{ ...display, fontSize: 11, color: PALETTE.inkSoft }}>FASTEST HAT-TRICK</span><br />
                {worldRecords.fastestHatTrick.playerName} ({worldRecords.fastestHatTrick.clubName}) — inside {worldRecords.fastestHatTrick.minute} minutes
              </div>
            )}
            {worldRecords.youngestDebut && (
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${PALETTE.parchmentDim}`, ...serif, fontSize: 13, color: PALETTE.ink }}>
                <span style={{ ...display, fontSize: 11, color: PALETTE.inkSoft }}>YOUNGEST DEBUT</span><br />
                {worldRecords.youngestDebut.playerName} ({worldRecords.youngestDebut.clubName}) — age {worldRecords.youngestDebut.age}
              </div>
            )}
            {worldRecords.mostLeagueTitles && (
              <div style={{ padding: "10px 14px", ...serif, fontSize: 13, color: PALETTE.ink }}>
                <span style={{ ...display, fontSize: 11, color: PALETTE.inkSoft }}>MOST LEAGUE TITLES</span><br />
                {worldRecords.mostLeagueTitles.clubName} ({FULL_TIER_META[worldRecords.mostLeagueTitles.tierId]?.name}) — {worldRecords.mostLeagueTitles.titles}
              </div>
            )}
          </div>
        </div>
      )}

      {promotions.map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
          <TrendingUp size={18} color={PALETTE.gold} />
          <div style={{ ...serif, fontSize: 13, color: PALETTE.ink }}>
            <span style={{ fontWeight: 700 }}>{t.clubName}</span> — {t.note} (Season {t.season})
          </div>
        </div>
      ))}
      {promotions.length > 0 && <div style={{ height: 16 }} />}

      <div style={{ height: 1, background: PALETTE.parchmentDim, margin: "4px 0 16px" }} />

      <div style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft, marginBottom: 10 }}>
        History
      </div>
      {history.length === 0 ? (
        <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13 }}>Nothing here yet — win something.</div>
      ) : (
        [...history].reverse().map((t, i) => {
          const isRelegation = t.type === "relegation";
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px", borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
              {isRelegation ? <TrendingDown size={18} color={mutedRed} /> : <Award size={18} color={PALETTE.gold} />}
              <div style={{ ...serif, fontSize: 13, color: isRelegation ? mutedRed : PALETTE.ink }}>
                <span style={{ fontWeight: 700 }}>Season {t.season}</span> — {t.clubName ? `${t.clubName} — ` : ""}{t.note}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function DevelopmentTab({ club, budget, onStartAcademy, onInvestAcademy, onSignYouth, onPromoteYouth, onSellYouth, onHostTryouts, onSignTryout, onDismissTryouts }) {
  if (club.academyEligible) {
    const signCost = academySigningCost(club.academyStars);
    return (
      <div>
        {club.academyStars === 0 ? (
          <div style={{ border: `1px solid ${PALETTE.parchmentDim}`, borderRadius: 8, padding: 16 }}>
            <div style={{ ...display, fontWeight: 700, fontSize: 16, color: PALETTE.ink, marginBottom: 6 }}>Start an Academy</div>
            <div style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft, marginBottom: 12 }}>
              Once started, your academy stays with the club forever — even if you get relegated. It won't come back if you never start one, though.
            </div>
            <button
              onClick={onStartAcademy}
              disabled={budget < ACADEMY_START_COST}
              style={{
                padding: "10px 16px", borderRadius: 6, border: "none", cursor: budget >= ACADEMY_START_COST ? "pointer" : "not-allowed",
                background: budget >= ACADEMY_START_COST ? PALETTE.pitch : PALETTE.parchmentDim, color: budget >= ACADEMY_START_COST ? PALETTE.parchment : PALETTE.inkSoft,
                ...display, fontSize: 13, fontWeight: 600,
              }}
            >
              Start Academy — ${ACADEMY_START_COST.toLocaleString()}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
              <span style={{ ...display, fontSize: 15, fontWeight: 700, color: PALETTE.ink }}>Academy</span>
              <span style={{ color: PALETTE.gold, fontSize: 18 }}><StarRow value={club.academyStars} /></span>
              {club.academyStars < 5 && (
                <button
                  onClick={onInvestAcademy}
                  disabled={budget < ACADEMY_INVEST_INCREMENT}
                  style={{
                    padding: "6px 12px", borderRadius: 6, border: `1px solid ${PALETTE.ink}`, cursor: budget >= ACADEMY_INVEST_INCREMENT ? "pointer" : "not-allowed",
                    background: "none", color: budget >= ACADEMY_INVEST_INCREMENT ? PALETTE.ink : PALETTE.inkSoft, ...display, fontSize: 12,
                  }}
                >
                  Invest ${(ACADEMY_INVEST_INCREMENT / 1_000_000).toFixed(1)}M for next tier
                </button>
              )}
              <button
                onClick={onSignYouth}
                disabled={budget < signCost || club.youthPlayers.length >= ACADEMY_MAX_PROSPECTS}
                style={{
                  padding: "6px 12px", borderRadius: 6, border: "none", cursor: (budget >= signCost && club.youthPlayers.length < ACADEMY_MAX_PROSPECTS) ? "pointer" : "not-allowed",
                  background: (budget >= signCost && club.youthPlayers.length < ACADEMY_MAX_PROSPECTS) ? PALETTE.gold : PALETTE.parchmentDim, color: PALETTE.ink, ...display, fontSize: 12, fontWeight: 600,
                }}
              >
                {club.youthPlayers.length >= ACADEMY_MAX_PROSPECTS ? `Academy Full (${ACADEMY_MAX_PROSPECTS}/${ACADEMY_MAX_PROSPECTS})` : `Sign New Prospect — $${signCost.toLocaleString()}`}
              </button>
            </div>

            {club.youthPlayers.length === 0 ? (
              <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13 }}>No prospects yet — sign one to get started.</div>
            ) : (
              <>
                <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 12, marginBottom: 8 }}>
                  {club.youthPlayers.length} / {ACADEMY_MAX_PROSPECTS} prospects
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, ...serif }}>
                <thead>
                  <tr style={{ textAlign: "left", color: PALETTE.inkSoft, borderBottom: `2px solid ${PALETTE.parchmentDim}` }}>
                    {["Pos", "Name", "Age", "OVR", "POT", ""].map((h) => (
                      <th key={h} style={{ padding: "6px 8px", ...display, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...club.youthPlayers].sort((a, b) => b.potential - a.potential).map((p) => (
                    <tr key={p.id} style={{ borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
                      <td style={{ padding: "6px 8px", ...mono, fontSize: 12 }}>{p.position}</td>
                      <td style={{ padding: "6px 8px", fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: "6px 8px", ...mono }}>{p.age}</td>
                      <td style={{ padding: "6px 8px", ...mono, fontWeight: 700 }}>{p.overall}</td>
                      <td style={{ padding: "6px 8px", ...mono, color: PALETTE.inkSoft }}>{p.potential}</td>
                      <td style={{ padding: "6px 8px", display: "flex", gap: 6 }}>
                        {p.age >= ACADEMY_PROMOTE_MIN_AGE && (
                          <button onClick={() => onPromoteYouth(p.id)} style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: "none", background: PALETTE.gold, color: PALETTE.ink, cursor: "pointer", ...display, fontWeight: 600 }}>
                            Promote
                          </button>
                        )}
                        <button onClick={() => onSellYouth(p.id)} style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: `1px solid ${PALETTE.ink}`, background: "none", cursor: "pointer", ...display }}>
                          Sell (${youthSaleValue(p).toLocaleString()})
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // Not academy-eligible — USL League One / Two clubs run open tryouts instead
  return (
    <div>
      <div style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft, marginBottom: 14 }}>
        Your club can't run an academy at this level — but you can host open tryouts for a shot at some free-agent talent.
        Mostly you'll get squad filler, but every so often someone shows up who could play a tier above.
      </div>
      <button
        onClick={onHostTryouts}
        style={{ padding: "10px 16px", borderRadius: 6, border: "none", background: PALETTE.pitch, color: PALETTE.parchment, cursor: "pointer", ...display, fontSize: 13, fontWeight: 600, marginBottom: 16 }}
      >
        Host Tryouts
      </button>
      {club.tryoutCandidates.length > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft }}>Candidates</span>
            <button onClick={onDismissTryouts} style={{ fontSize: 11, color: PALETTE.inkSoft, background: "none", border: "none", cursor: "pointer", ...display }}>Dismiss all</button>
          </div>
          {club.tryoutCandidates.map((p) => {
            const cost = tryoutSigningCost(p.overall);
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 8px", borderBottom: `1px solid ${PALETTE.parchmentDim}`, fontSize: 13, ...serif }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{p.name}</span>{" "}
                  <span style={{ ...mono, color: PALETTE.inkSoft }}>{p.position} · OVR {p.overall} · age {p.age}</span>
                </div>
                <button
                  onClick={() => onSignTryout(p.id)}
                  disabled={budget < cost}
                  style={{
                    padding: "6px 12px", borderRadius: 6, border: "none", cursor: budget >= cost ? "pointer" : "not-allowed",
                    background: budget >= cost ? PALETTE.gold : PALETTE.parchmentDim, color: PALETTE.ink, ...display, fontSize: 12, fontWeight: 600,
                  }}
                >
                  Sign — ${cost.toLocaleString()}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   DASHBOARD SHELL
   ============================================================ */

const TABS = [
  { id: "squad", label: "Squad", icon: Users },
  { id: "tactics", label: "Tactics", icon: Sliders },
  { id: "table", label: "Table", icon: Trophy },
  { id: "fixtures", label: "Fixtures", icon: Calendar },
  { id: "market", label: "Market", icon: ShoppingBag },
  { id: "development", label: "Development", icon: GraduationCap },
  { id: "opencup", label: "Open Cup", icon: Star },
  { id: "trophies", label: "Trophy Room", icon: Award },
  { id: "news", label: "News", icon: Newspaper },
  { id: "inbox", label: "Inbox", icon: Lightbulb },
];

function SackedScreen({ notice, onContinue }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: PALETTE.pitchDark, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
        <div style={{ ...display, fontSize: 40, fontWeight: 700, color: PALETTE.crimson, marginBottom: 12 }}>
          You've been sacked
        </div>
        <div style={{ ...serif, fontSize: 15, color: PALETTE.parchment, opacity: 0.85, marginBottom: 8 }}>
          {notice.clubName}'s board has let you go.
        </div>
        <div style={{ ...serif, fontSize: 13, color: PALETTE.parchment, opacity: 0.7, marginBottom: 32 }}>
          {notice.reason}
        </div>
        <button
          onClick={onContinue}
          style={{ background: PALETTE.gold, color: PALETTE.ink, border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}
        >
          Find a new club →
        </button>
      </div>
    </div>
  );
}

function DraftModal({ picks, onKeep, onSell }) {
  if (!picks || picks.length === 0) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 46, padding: 20 }}>
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 460, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: 24 }}>
        <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.ink, marginBottom: 4 }}>
          Draft
        </div>
        <div style={{ ...serif, fontSize: 13, color: PALETTE.inkSoft, marginBottom: 16 }}>
          You have {picks.length} pick{picks.length === 1 ? "" : "s"} to resolve. Keep a prospect for your squad, or sell the pick for cash.
        </div>
        {picks.map((pick, i) => {
          const value = draftProspectValue(pick.prospect);
          return (
            <div key={pick.prospect.id} style={{ border: `1px solid ${PALETTE.parchmentDim}`, borderRadius: 8, padding: 14, marginBottom: 12 }}>
              <div style={{ ...display, fontWeight: 700, fontSize: 15, color: PALETTE.ink, marginBottom: 2 }}>
                Round {pick.round} pick — {TIER_META[pick.tierIdx].short}
              </div>
              <div style={{ ...serif, fontSize: 13, color: PALETTE.ink, marginBottom: 10 }}>
                {pick.prospect.name} — <span style={{ ...mono }}>{pick.prospect.position} · OVR {pick.prospect.overall} · POT {pick.prospect.potential} · age {pick.prospect.age}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => onKeep(i)}
                  style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "none", background: PALETTE.pitch, color: PALETTE.parchment, cursor: "pointer", ...display, fontSize: 13, fontWeight: 600 }}
                >
                  Keep
                </button>
                <button
                  onClick={() => onSell(i)}
                  style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: `1px solid ${PALETTE.ink}`, background: "none", color: PALETTE.ink, cursor: "pointer", ...display, fontSize: 13, fontWeight: 600 }}
                >
                  Sell for ${value.toLocaleString()}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Shared between the tab-bar badge count and the tab content itself, so
// they never disagree on what counts as "urgent."
// A real tab now, matching Squad/Tactics/etc — was a floating popup button
// before, which turned out not to read as "the inbox" the way a tab does.
// Board messages live here too (informational only — compliance happens
// through the actual game action, not a button here).
function InboxTab({ club, matchday, tier, managerHistory, setManagerHistory, difficulty, jobOffers, onAcceptJobOffer, onDeclineJobOffer }) {
  const seenOneTimeHints = managerHistory?.seenOneTimeHints || [];
  const clearedOneTimeHints = managerHistory?.clearedOneTimeHints || [];
  const recentForm = tier ? (computeTable(tier).find((r) => r.clubId === club.id)?.form.slice(-5) ?? []) : [];
  const hints = computeHints(club, matchday, seenOneTimeHints, recentForm, tier, clearedOneTimeHints);
  const hasBoardMessage = DIFFICULTY_MODES[difficulty]?.boardMessages && club.boardMessage;
  const hasUnread = hints.some((h) => !h.read);

  // Read All / Clear All now cover every hint shown, recurring or not —
  // they were only ever touching one-time hints before, which is exactly
  // why a recurring alert (like a player wanting to leave) could never be
  // marked read and kept the inbox permanently stuck above zero. Board
  // messages and job offers are deliberately NOT touched by either button:
  // a board demand's consequence applies at rollover regardless of
  // whether you've "read" it, and a job offer needs an actual Accept or
  // Decline, not a passive dismiss that could quietly drop it.
  const markAllRead = () => {
    const ids = hints.map((h) => h.id);
    if (ids.length === 0 || !setManagerHistory) return;
    setManagerHistory((prev) => ({
      ...prev,
      seenOneTimeHints: Array.from(new Set([...(prev.seenOneTimeHints || []), ...ids])),
    }));
  };
  const clearAll = () => {
    const ids = hints.map((h) => h.id);
    if (ids.length === 0 || !setManagerHistory) return;
    setManagerHistory((prev) => ({
      ...prev,
      clearedOneTimeHints: Array.from(new Set([...(prev.clearedOneTimeHints || []), ...ids])),
    }));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ ...display, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: PALETTE.inkSoft }}>Inbox</span>
        <span style={{ display: "flex", gap: 12 }}>
          <button onClick={markAllRead} disabled={!hasUnread} style={{ background: "none", border: "none", cursor: hasUnread ? "pointer" : "default", color: hasUnread ? PALETTE.gold : PALETTE.inkSoft, opacity: hasUnread ? 1 : 0.4, ...display, fontSize: 11 }}>
            Read all
          </button>
          <button onClick={clearAll} style={{ background: "none", border: "none", cursor: "pointer", color: PALETTE.crimson, ...display, fontSize: 11 }}>
            Clear all
          </button>
        </span>
      </div>
      {(jobOffers || []).map((offer) => (
        <div key={offer.clubId} style={{ border: `1px solid ${PALETTE.gold}`, borderRadius: 8, padding: "10px 14px", marginBottom: 10, background: `${PALETTE.gold}11` }}>
          <span style={{ ...display, fontSize: 10.5, textTransform: "uppercase", color: PALETTE.gold, letterSpacing: "0.05em" }}>Job offer</span>
          <div style={{ ...serif, fontSize: 13, color: PALETTE.ink, marginTop: 2, marginBottom: 8 }}>{offer.description}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onAcceptJobOffer(offer.clubId)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: PALETTE.gold, color: PALETTE.ink, ...display, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Accept
            </button>
            <button onClick={() => onDeclineJobOffer(offer.clubId)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${PALETTE.inkSoft}`, background: "none", color: PALETTE.inkSoft, ...display, fontSize: 12, cursor: "pointer" }}>
              Decline
            </button>
          </div>
        </div>
      ))}
      {hasBoardMessage && (
        <div style={{ fontSize: 13, ...serif, color: PALETTE.ink, padding: "10px 4px", borderBottom: `1px solid ${PALETTE.parchmentDim}` }}>
          <span style={{ ...display, fontSize: 10.5, textTransform: "uppercase", color: PALETTE.gold, letterSpacing: "0.05em" }}>Board request</span>
          <div style={{ marginTop: 2 }}>{club.boardMessage.description}</div>
        </div>
      )}
      {hints.map((h, i) => (
        <div key={h.id} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 13, ...serif, color: h.read ? PALETTE.inkSoft : PALETTE.ink, padding: "10px 4px", borderBottom: i < hints.length - 1 ? `1px solid ${PALETTE.parchmentDim}` : "none" }}>
          {!h.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: PALETTE.gold, marginTop: 6, flexShrink: 0 }} />}
          <span>{h.text}</span>
        </div>
      ))}
      {!hasBoardMessage && hints.length === 0 && (
        <div style={{ ...serif, color: PALETTE.inkSoft, fontSize: 13 }}>Nothing needs your attention right now.</div>
      )}
    </div>
  );
}

const ONBOARDING_STEPS = [
  {
    icon: Trophy,
    title: "Welcome to Ascent",
    body: "You're not playing the matches — you're the manager. You pick the team, set the game plan, buy and sell players, and grow young talent. The matches themselves play out on their own once you've made your calls. Skip this anytime with the link below.",
  },
  {
    icon: TrendingUp,
    title: "The Pyramid",
    body: "Pro soccer is organized in tiers, and you'll pick which country's pyramid to manage in. Finish near the top of your tier and you move UP a tier next season. Finish near the bottom and you get sent DOWN. Win it all in the top tier and you're the champion of that country's soccer.",
  },
  {
    icon: Users,
    title: "Running your club",
    body: "Squad is your full roster — set your captain and pick a lineup mode. Tactics is your game plan (formation, style, press) for the next match — set this well and it actually changes how matches play out. Market is where you buy and sell players. Development lets you grow young talent through an academy or open tryouts, depending on your club.",
  },
  {
    icon: Lightbulb,
    title: "If you're ever stuck",
    body: "The gold button in the corner gives you concrete suggestions any time you're not sure what to do. The Market has a ★ Recommended tab built around your squad's actual needs. Tactics has a \"Suggested for your squad\" box. None of this is guesswork you have to do alone.",
  },
  {
    icon: Trophy,
    title: "Pick your difficulty",
    body: "One last thing before you start. Each mode isn't just harder — it asks a different question of you. After this, you'll pick which country's pyramid to manage in.",
    isDifficultyStep: true,
  },
];

// 6 variations — one per country per difficulty — each covering what's
// actually specific to that combination. Each is written to stand on its
// own — describing what that league's own systems do, not how they compare
// to the other country's.
const LEAGUE_TUTORIAL_CONTENT = {
  usa_rookie: {
    title: "American Soccer — Rookie",
    body: "Four tiers: MLS at the top, then USL Championship, USL League One, and USL League Two. MLS and USL Championship clubs run academies; League One and League Two clubs hold open tryouts instead. Ownership funding isn't identical across clubs — bigger, more storied clubs get more from their owners than a modest one in the same league. In Rookie mode there's no wage pressure or board to answer to — just pick the team and get results.",
  },
  usa_pro: {
    title: "American Soccer — Pro",
    body: "Same four-tier pyramid as Rookie, but now your budget is real. Wages come out of it every payroll, so a squad you can't afford will run you into debt. Ownership funding scales with a club's own reputation and standing — a storied, successful club's owners back it more than a modest one gets. No board yet at this level — just you managing the money and the results together.",
  },
  usa_executive: {
    title: "American Soccer — Executive",
    body: "The full MLS experience: a salary cap, Designated Players (marquee signings exempt from it), an annual draft, and a board that sets objectives and can sack you if happiness drops too low. Ownership funding varies by club — reputation, history, and standing all factor into what the owners actually put in season to season. Every decision — from a big signing to a bad losing streak — has consequences beyond just the table.",
  },
  england_rookie: {
    title: "English Football — Rookie",
    body: "Four tiers: the Premier League at the top, then the Championship, League One, and League Two — real seasons throughout (38 games in the Premier League, 46 everywhere else). Premier League, Championship, and League One clubs all run their own academies, with the strongest academies belonging to the biggest clubs; League Two clubs hold open tryouts instead. Below the Premier League, the final promotion spot in each tier isn't just about finishing position — the clubs just below the automatic places go into a playoff for it. Club funding also varies with reputation and history, not just league — a big name gets more from its owners than a modest club at the same level. No wage pressure or board in Rookie mode — just pick the team and get results.",
  },
  england_pro: {
    title: "English Football — Pro",
    body: "Same four-tier pyramid as Rookie — real 38/46-game seasons, academies scaled to each club's real stature, and a promotion playoff below the top two in the Championship, League One, and League Two. Your budget is real at this level too: wages come out of it every payroll, so keeping the wage bill in line with what you're bringing in matters as much as results. What owners actually put in varies by club — reputation, history, and league standing all factor in, so a big name gets more than a modest club in the same division.",
  },
  england_executive: {
    title: "English Football — Executive",
    body: "Everything from Pro — real wages, academies scaled to each club's real stature, and a promotion playoff below the top two in the Championship, League One, and League Two — plus a board with its own objectives and sacking risk. Ownership funding isn't flat across a league either: it scales with a club's own reputation, history, and standing, the same way real ownership groups back their clubs differently. Here it's wages, results, and keeping the board happy.",
  },
};

function LeagueTutorialScreen({ country, difficulty, onContinue, onBack }) {
  const content = LEAGUE_TUTORIAL_CONTENT[`${country}_${difficulty}`];
  return (
    <div style={{ minHeight: "100vh", background: PALETTE.pitchDark, ...serif, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 480, width: "100%", padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Trophy size={24} color={PALETTE.gold} />
          <div style={{ ...display, fontSize: 20, fontWeight: 700, color: PALETTE.ink }}>{content.title}</div>
        </div>
        <div style={{ ...serif, fontSize: 14, color: PALETTE.ink, lineHeight: 1.5, marginBottom: 24 }}>
          {content.body}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: PALETTE.inkSoft, fontSize: 13, cursor: "pointer", ...display }}>
            ← Back
          </button>
          <button
            onClick={onContinue}
            style={{ padding: "10px 20px", borderRadius: 6, border: "none", background: PALETTE.pitch, color: PALETTE.parchment, fontSize: 13, fontWeight: 600, cursor: "pointer", ...display }}
          >
            Pick your club →
          </button>
        </div>
      </div>
    </div>
  );
}

// Shown once per manager (skippable), not once per career — so starting a
// new club after being sacked or retiring doesn't re-trigger the whole
// walkthrough every time.
function OnboardingGuide({ onFinish }) {
  const [step, setStep] = useState(0);
  const isLast = step === ONBOARDING_STEPS.length - 1;
  const current = ONBOARDING_STEPS[step];
  const Icon = current.icon;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }}>
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 480, width: "100%", padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Icon size={24} color={PALETTE.gold} />
          <div style={{ ...display, fontSize: 20, fontWeight: 700, color: PALETTE.ink }}>{current.title}</div>
        </div>
        <div style={{ ...serif, fontSize: 14, color: PALETTE.ink, lineHeight: 1.5, marginBottom: 20 }}>
          {current.body}
        </div>

        {current.isDifficultyStep && (
          <div style={{ background: "#E4D9C4", borderRadius: 8, padding: "10px 14px", marginBottom: 16, ...serif, fontSize: 12.5, color: PALETTE.ink, lineHeight: 1.35 }}>
            <div style={{ marginBottom: 5 }}><strong>Rookie</strong> — no wages, no board. Think like a coach: just pick the team and get results. <em>Start here if you're new.</em></div>
            <div style={{ marginBottom: 5 }}><strong>Pro</strong> — real wages, real bonuses. Think like a budget-conscious manager: don't let payroll outrun income.</div>
            <div><strong>Executive</strong> — adds a board with objectives, sacking risk, and each league's own marquee-signing mechanics. Think like a real GM: balance short-term pressure against long-term reputation.</div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <button
            onClick={onFinish}
            style={{ background: "none", border: "none", color: PALETTE.inkSoft, fontSize: 13, cursor: "pointer", ...serif, textDecoration: "underline" }}
          >
            Skip tutorial
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: PALETTE.inkSoft, ...mono }}>{step + 1} / {ONBOARDING_STEPS.length}</span>
            {step > 0 && (
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                style={{ padding: "10px 16px", borderRadius: 6, border: `1px solid ${PALETTE.parchmentDim}`, background: "none", color: PALETTE.ink, fontSize: 13, fontWeight: 600, cursor: "pointer", ...display }}
              >
                Back
              </button>
            )}
            <button
              onClick={() => (isLast ? onFinish() : setStep((s) => s + 1))}
              style={{ padding: "10px 16px", borderRadius: 6, border: "none", background: PALETTE.pitch, color: PALETTE.parchment, fontSize: 13, fontWeight: 600, cursor: "pointer", ...display }}
            >
              {isLast ? "Start managing →" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PayrollOverlay({ club, difficulty, tierIdx, tier, onClose }) {
  const payroll = effectivePayroll(club.squad, club.designatedPlayerIds);
  // Previously this only ever showed the wage bill draining the CURRENT
  // budget — with no visibility into what actually comes back in before
  // the next payroll, "room left" looked far more dire than reality, since
  // every club also receives a guaranteed ownership deposit each rollover
  // (on top of variable prize money, which genuinely can't be known until
  // the season's final standing, so it's noted rather than guessed at).
  const deposit = ownershipDepositFor(tierIdx, difficulty, club, tier?.clubs);
  const projected = club.budget - payroll;
  const projectedWithIncome = projected + deposit;
  const dpCount = (club.designatedPlayerIds || []).length;
  const capApplies = tierIdx === 0 && DIFFICULTY_MODES[difficulty]?.dps;
  const capRoom = MLS_SALARY_CAP - payroll;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 55, padding: 20 }} onClick={onClose}>
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 380, width: "100%", padding: 22 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ ...display, fontSize: 18, fontWeight: 700, color: PALETTE.ink, marginBottom: 14 }}>
          Payroll — {club.name}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${PALETTE.parchmentDim}`, ...serif, fontSize: 14 }}>
          <span style={{ color: PALETTE.inkSoft }}>Current budget</span>
          <strong>${safeNum(club.budget).toLocaleString()}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${PALETTE.parchmentDim}`, ...serif, fontSize: 14 }}>
          <span style={{ color: PALETTE.inkSoft }}>Squad wage bill ({club.squad.length} players{dpCount > 0 ? `, ${dpCount} DP` : ""})</span>
          <strong>-${payroll.toLocaleString()}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${PALETTE.parchmentDim}`, ...serif, fontSize: 14 }}>
          <span style={{ color: PALETTE.inkSoft }}>Ownership deposit (guaranteed each season)</span>
          <strong style={{ color: PALETTE.gold }}>+${deposit.toLocaleString()}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 4px", ...serif, fontSize: 14 }}>
          <span style={{ color: PALETTE.inkSoft }}>Room left after next payroll</span>
          <strong style={{ color: projectedWithIncome < 0 ? PALETTE.crimson : PALETTE.ink }}>${projectedWithIncome.toLocaleString()}</strong>
        </div>
        <div style={{ ...serif, fontSize: 11.5, color: PALETTE.inkSoft, marginTop: 2, fontStyle: "italic" }}>
          Doesn't include prize money — that depends on where you finish this season, so it can't be known yet.
        </div>
        {projectedWithIncome < 0 && (
          <div style={{ ...serif, fontSize: 12.5, color: PALETTE.crimson, marginTop: 6 }}>
            Your wage bill outruns your budget plus guaranteed income — you'll go into debt at the next payroll unless you free up salary, or prize money covers the gap.
          </div>
        )}
        {capApplies && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 4px", marginTop: 8, borderTop: `1px solid ${PALETTE.parchmentDim}`, ...serif, fontSize: 14 }}>
            <span style={{ color: PALETTE.inkSoft }}>Salary cap room (${MLS_SALARY_CAP.toLocaleString()} cap)</span>
            <strong style={{ color: capRoom < 0 ? PALETTE.crimson : PALETTE.ink }}>${capRoom.toLocaleString()}</strong>
          </div>
        )}
        <button onClick={onClose} style={{ width: "100%", marginTop: 16, background: PALETTE.pitch, color: PALETTE.parchment, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}>
          Close
        </button>
      </div>
    </div>
  );
}

function InfoNotice({ message, onClose }) {
  if (!message) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 47, padding: 20 }} onClick={onClose}>
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 380, width: "100%", padding: 22 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ ...serif, fontSize: 14, color: PALETTE.ink, marginBottom: 16 }}>{message}</div>
        <button onClick={onClose} style={{ width: "100%", background: PALETTE.pitch, color: PALETTE.parchment, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}>
          Got it
        </button>
      </div>
    </div>
  );
}

function RenewalNotice({ notice, onClose }) {
  if (!notice) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 45, padding: 20 }} onClick={onClose}>
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 400, width: "100%", padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.ink, marginBottom: 10 }}>
          {notice.accepted ? "Contract renewed" : "Renewal rejected"}
        </div>
        <div style={{ ...serif, fontSize: 14, color: PALETTE.inkSoft, marginBottom: 16 }}>
          {notice.accepted
            ? `${notice.playerName} signed a new 2-year deal for a $${notice.cost.toLocaleString()} bonus.`
            : `${notice.playerName} turned it down — ${notice.reason}${notice.cost ? ` (asking around $${notice.cost.toLocaleString()})` : ""}.`}
        </div>
        <button onClick={onClose} style={{ width: "100%", background: PALETTE.pitch, color: PALETTE.parchment, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}>
          Got it
        </button>
      </div>
    </div>
  );
}

function WindowNotice({ notice, onClose }) {
  if (!notice) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 45, padding: 20 }} onClick={onClose}>
      <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 400, width: "100%", padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ ...display, fontSize: 22, fontWeight: 700, color: PALETTE.ink, marginBottom: 10 }}>
          {notice.seasonEnded ? "Season complete" : "Transfer window open"}
        </div>
        <div style={{ ...serif, fontSize: 14, color: PALETTE.inkSoft, marginBottom: 16 }}>
          {notice.seasonEnded
            ? "No more windows this season — roll over to kick off the next one."
            : `${notice.listedCount} player${notice.listedCount === 1 ? "" : "s"} listed and ${notice.transferCount} deal${notice.transferCount === 1 ? "" : "s"} done across the pyramid while you weren't looking. Check the Market tab.`}
        </div>
        <button onClick={onClose} style={{ width: "100%", background: PALETTE.pitch, color: PALETTE.parchment, border: "none", borderRadius: 8, padding: "10px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", ...display }}>
          Got it
        </button>
      </div>
    </div>
  );
}

// Per-win bonus paid directly into a club's budget on Pro/Executive — real
// figures scale down tier by tier; League Two is amateur and pays nothing.
// Well-documented real rivalries — kept to pairs that are unambiguous and
// widely recognized, rather than guessing at anything less certain.
// extra gate revenue for a derby, Pro/Executive only
// small, so it doesn't dwarf the season-long reputation system

// Checked after every match — cheap in the common case (a handful of
// comparisons), since text generation only happens on the rare occasion a
// record actually falls. Mutates next.worldRecords and appends to
// next.newsFeed (capped) directly.
// Called once per goal, from simulateMatchdayAcrossTiers, where the actual
// scorer object (with its freshly-incremented careerGoals) is available.
// Called wherever a transfer completes — AI-to-AI (at rollover) or the
// user's own purchase (from handleBuy) — so "biggest transfer ever" covers
// the whole world, not just deals the user personally made.
// Chance and the quality of the interested club both scale with
// reputation — a well-regarded manager attracts real interest, not a
// random USL2 side reaching out to someone who's just won the league.
// Can come from either country now — a manager's reputation is meant to
// travel, not stay locked to whichever side of the pyramid they started on.
function Dashboard({ state, setState, onNewGame, onSacked, onLeaveClub, managerHistory, setManagerHistory, onAcceptJobOffer, onDeclineJobOffer }) {
  const [tab, setTab] = useState("squad");
  const [recap, setRecap] = useState(null);
  const [windowNotice, setWindowNotice] = useState(null);
  const [rollover, setRollover] = useState(null);
  const [renewalNotice, setRenewalNotice] = useState(null);
  const [draftPicks, setDraftPicks] = useState(null);
  const [infoNotice, setInfoNotice] = useState(null);
  const [seasonPlayoffs, setSeasonPlayoffs] = useState(null);
  const [revealedRounds, setRevealedRounds] = useState(0);
  const [cupRecap, setCupRecap] = useState(null);
  const [rivalryRecap, setRivalryRecap] = useState(null);
  const [sackedNotice, setSackedNotice] = useState(null);
  const [showPayroll, setShowPayroll] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  // Tracks the user's England promotion playoff as they sim it match by
  // match — null until they choose to view it, then filled in step by
  // step (semi1 → semi2 → final) rather than resolving invisibly.
  const [englandPlayoffProgress, setEnglandPlayoffProgress] = useState(null);

  const tier = state.tiers[state.userTierId];
  const userClub = tier.clubs.find((c) => c.id === state.userClubId);
  const nextMatchdayFixtures = tier.fixtures.filter((f) => !f.played);
  const currentMatchday = nextMatchdayFixtures.length > 0 ? nextMatchdayFixtures[0].matchday : null;

  // Career-long match record (games/wins/draws/losses) and which clubs the
  // manager has actually managed — feeds the end-of-career stats summary.
  // Batched as {games, wins, draws, losses} deltas rather than one
  // setManagerHistory call per match, since a full "Sim Season" can run
  // 30+ matchdays in one go.
  const applyCareerStatsDelta = (delta) => {
    if (!delta || delta.games === 0) return;
    setManagerHistory((prev) => {
      const stats = prev.careerStats || DEFAULT_MANAGER_HISTORY.careerStats;
      const clubHistory = stats.clubHistory.length && stats.clubHistory[stats.clubHistory.length - 1] === userClub.name
        ? stats.clubHistory
        : [...stats.clubHistory, userClub.name];
      return {
        ...prev,
        careerStats: {
          ...stats,
          gamesPlayed: stats.gamesPlayed + delta.games,
          wins: stats.wins + delta.wins,
          draws: stats.draws + delta.draws,
          losses: stats.losses + delta.losses,
          clubHistory,
        },
      };
    });
  };
  const outcomeToDelta = (outcome) => {
    if (!outcome) return { games: 0, wins: 0, draws: 0, losses: 0 };
    return { games: 1, wins: outcome === "win" ? 1 : 0, draws: outcome === "draw" ? 1 : 0, losses: outcome === "loss" ? 1 : 0 };
  };
  const mergeDelta = (a, b) => ({ games: a.games + b.games, wins: a.wins + b.wins, draws: a.draws + b.draws, losses: a.losses + b.losses });
  const seasonComplete = currentMatchday === null;

  // Board expectations were previously only visible buried in the Squad tab
  // — surface them explicitly the moment a new job starts under board
  // pressure, same way a real new manager gets told what's expected of them
  // in the first meeting with ownership.
  useEffect(() => {
    if (DIFFICULTY_MODES[state.difficulty]?.boardPressure && state.seasonNumber === 1 && userClub.boardObjective) {
      setInfoNotice(`Welcome to ${userClub.name}. The board's expectation this season: ${userClub.boardObjective.description}.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mutateAndSave = useCallback((mutator) => {
    setState((prev) => {
      const next = { ...prev, tiers: prev.tiers.map((t) => ({ ...t, clubs: t.clubs.map((c) => ({ ...c, squad: [...c.squad] })), fixtures: [...t.fixtures] })) };
      mutator(next);
      return next;
    });
  }, [setState]);

  const findUserRivalryMatch = (matches) => matches.find((m) => m.isRivalryMatch && (m.homeClub === userClub.name || m.awayClub === userClub.name));

  const simulateMatchday = () => {
    if (currentMatchday === null) return;
    if (pendingCupRoundIndex !== null) {
      // Auto-resolve the cup round in place rather than force-navigating
      // to the Open Cup tab — that was an intrusive interruption,
      // especially now that the Fixtures tab already surfaces the
      // upcoming cup round and your drawn opponent ahead of time. The
      // match summary for your own cup game still pops up either way.
      mutateAndSave((next) => {
        const newRound = resolveCupRoundInPlace(next);
        const match = findUserCupMatch(newRound);
        if (match) setCupRecap({ roundLabel: newRound.label, cupName: "US Open Cup", cupDone: !!next.usOpenCup?.done, match });
      });
      return;
    }
    if (pendingEnglandCupKey) {
      mutateAndSave((next) => {
        const newRound = resolveEnglandCupRoundInPlace(next, pendingEnglandCupKey);
        const match = findUserCupMatch(newRound);
        const stateKey = pendingEnglandCupKey === "fa" ? "faCup" : "eflCup";
        if (match) setCupRecap({ roundLabel: newRound.label, cupName: pendingEnglandCupKey === "fa" ? "FA Cup" : "EFL Cup", cupDone: !!next[stateKey]?.done, match });
      });
      return;
    }
    mutateAndSave((next) => {
      const { matches, disqualificationNotice } = simulateMatchdayAcrossTiers(next, currentMatchday);
      applyCareerStatsDelta(outcomeToDelta(computeMatchOutcome(matches, userClub.name)));
      const w = maybeTriggerMidWindow(next, currentMatchday);
      setRecap({ matchday: currentMatchday, matches });
      if (w) setWindowNotice(w);
      if (disqualificationNotice) {
        setInfoNotice(disqualificationNotice.resolved
          ? `${disqualificationNotice.clubName} is back above the minimum squad size — disqualification lifted, you're clear to compete normally again.`
          : `${disqualificationNotice.clubName} dropped below the ${MIN_SQUAD_SIZE}-player minimum (short ${disqualificationNotice.short}) — you're disqualified from competing until you sign back up to strength. Emergency funding of $${disqualificationNotice.funding.toLocaleString()} has been added to your budget to help.`);
      }
      const userRivalry = findUserRivalryMatch(matches);
      if (userRivalry) {
        setRivalryRecap({ homeClub: userRivalry.homeClub, awayClub: userRivalry.awayClub, homeScore: userRivalry.homeScore, awayScore: userRivalry.awayScore, userIsHome: userRivalry.homeClub === userClub.name, difficulty: next.difficulty });
      }
    });
  };

  const simulateSeason = () => {
    if (currentMatchday === null) return;
    mutateAndSave((next) => {
      let md = getCurrentMatchday(next);
      let lastNotice = null;
      let lastUserCupMatch = null;
      let lastUserRivalry = null;
      let statsDelta = { games: 0, wins: 0, draws: 0, losses: 0 };
      while (md !== null) {
        if (isCupCheckpointPending(next, md)) {
          const newRound = resolveCupRoundInPlace(next);
          const match = findUserCupMatch(newRound);
          if (match) lastUserCupMatch = { roundLabel: newRound.label, cupName: "US Open Cup", cupDone: !!next.usOpenCup?.done, match };
          md = getCurrentMatchday(next);
          continue;
        }
        const pendingEnglandCup = pendingEnglandCupCheckpoint(next, md);
        if (pendingEnglandCup) {
          const newRound = resolveEnglandCupRoundInPlace(next, pendingEnglandCup);
          const match = findUserCupMatch(newRound);
          const stateKey = pendingEnglandCup === "fa" ? "faCup" : "eflCup";
          if (match) lastUserCupMatch = { roundLabel: newRound.label, cupName: pendingEnglandCup === "fa" ? "FA Cup" : "EFL Cup", cupDone: !!next[stateKey]?.done, match };
          md = getCurrentMatchday(next);
          continue;
        }
        const { matches, disqualificationNotice } = simulateMatchdayAcrossTiers(next, md);
        statsDelta = mergeDelta(statsDelta, outcomeToDelta(computeMatchOutcome(matches, userClub.name)));
        if (disqualificationNotice) lastNotice = disqualificationNotice;
        const userRivalry = findUserRivalryMatch(matches);
        if (userRivalry) lastUserRivalry = userRivalry;
        maybeTriggerMidWindow(next, md);
        md = getCurrentMatchday(next);
      }
      applyCareerStatsDelta(statsDelta);
      if (lastNotice) {
        setInfoNotice(lastNotice.resolved
          ? `${lastNotice.clubName} is back above the minimum squad size at some point this run — disqualification lifted.`
          : `${lastNotice.clubName} dropped below the ${MIN_SQUAD_SIZE}-player minimum during this run — you're disqualified from competing until you sign back up to strength. Emergency funding of $${lastNotice.funding.toLocaleString()} has been added to your budget to help.`);
      } else if (lastUserCupMatch) {
        setCupRecap(lastUserCupMatch);
      } else if (lastUserRivalry) {
        setRivalryRecap({ homeClub: lastUserRivalry.homeClub, awayClub: lastUserRivalry.awayClub, homeScore: lastUserRivalry.homeScore, awayScore: lastUserRivalry.awayScore, userIsHome: lastUserRivalry.homeClub === userClub.name, difficulty: next.difficulty });
      }
    });
  };

  const simulateToNextWindow = () => {
    if (currentMatchday === null) return;
    mutateAndSave((next) => {
      let md = getCurrentMatchday(next);
      let fired = null;
      let lastNotice = null;
      let lastUserCupMatch = null;
      let lastUserRivalry = null;
      let statsDelta = { games: 0, wins: 0, draws: 0, losses: 0 };
      while (md !== null) {
        if (isCupCheckpointPending(next, md)) {
          const newRound = resolveCupRoundInPlace(next);
          const match = findUserCupMatch(newRound);
          if (match) lastUserCupMatch = { roundLabel: newRound.label, cupName: "US Open Cup", cupDone: !!next.usOpenCup?.done, match };
          md = getCurrentMatchday(next);
          continue;
        }
        const pendingEnglandCup = pendingEnglandCupCheckpoint(next, md);
        if (pendingEnglandCup) {
          const newRound = resolveEnglandCupRoundInPlace(next, pendingEnglandCup);
          const match = findUserCupMatch(newRound);
          const stateKey = pendingEnglandCup === "fa" ? "faCup" : "eflCup";
          if (match) lastUserCupMatch = { roundLabel: newRound.label, cupName: pendingEnglandCup === "fa" ? "FA Cup" : "EFL Cup", cupDone: !!next[stateKey]?.done, match };
          md = getCurrentMatchday(next);
          continue;
        }
        const { matches, disqualificationNotice } = simulateMatchdayAcrossTiers(next, md);
        statsDelta = mergeDelta(statsDelta, outcomeToDelta(computeMatchOutcome(matches, userClub.name)));
        if (disqualificationNotice) lastNotice = disqualificationNotice;
        const userRivalry = findUserRivalryMatch(matches);
        if (userRivalry) lastUserRivalry = userRivalry;
        fired = maybeTriggerMidWindow(next, md);
        md = getCurrentMatchday(next);
        if (fired) break;
      }
      applyCareerStatsDelta(statsDelta);
      setWindowNotice(fired ? fired : { seasonEnded: true });
      if (lastNotice) {
        setInfoNotice(lastNotice.resolved
          ? `${lastNotice.clubName} is back above the minimum squad size — disqualification lifted.`
          : `${lastNotice.clubName} dropped below the ${MIN_SQUAD_SIZE}-player minimum — you're disqualified from competing until you sign back up to strength. Emergency funding of $${lastNotice.funding.toLocaleString()} has been added to your budget to help.`);
      } else if (lastUserCupMatch) {
        setCupRecap(lastUserCupMatch);
      } else if (lastUserRivalry) {
        setRivalryRecap({ homeClub: lastUserRivalry.homeClub, awayClub: lastUserRivalry.awayClub, homeScore: lastUserRivalry.homeScore, awayScore: lastUserRivalry.awayScore, userIsHome: lastUserRivalry.homeClub === userClub.name, difficulty: next.difficulty });
      }
    });
  };

  const handleViewPostseason = () => {
    try {
      if (state.userTierId >= 4) {
        // England's promotion playoffs are resolved inside rolloverEnglandSeason
        // directly, not previewed separately — just go straight to rollover.
        setTab("table");
        return;
      }
      setSeasonPlayoffs(computeSeasonPlayoffs(state.tiers.slice(0, 4), state.userClubId, state.difficulty));
      setRevealedRounds(0);
      setTab("table");
    } catch (e) {
      setInfoNotice(`Something went wrong computing the postseason (${e.message}). You can still continue to next season — the regular rollover doesn't depend on this.`);
    }
  };

  const handleSimRound = () => setRevealedRounds((r) => Math.min(MAX_POSTSEASON_ROUNDS, r + 1));
  const handleSimRestOfPostseason = () => setRevealedRounds(MAX_POSTSEASON_ROUNDS);

  // Pops up the user's own cup match once their round is played — same
  // idea as the regular-season matchday recap. Once they lose, they no
  // longer appear in any later round's matches, so this naturally stops
  // popping up without needing separate "eliminated" state.
  const findUserCupMatch = (round) => round.matches.find((m) => m.homeEntrant.club.id === state.userClubId || m.awayEntrant.club.id === state.userClubId);

  // The cup now runs DURING the season: a specific league matchday number
  // comes due, and instead of playing that league matchday, this round
  // of the cup plays first. Nothing else advances until it's done.
  const pendingCupRoundIndex = currentMatchday !== null && isCupCheckpointPending(state, currentMatchday)
    ? US_OPEN_CUP_ROUND_MATCHDAYS.indexOf(currentMatchday)
    : null;
  const pendingEnglandCupKey = currentMatchday !== null ? pendingEnglandCupCheckpoint(state, currentMatchday) : null;

  // The pairing for a cup round is random — drawing it fresh every render
  // would show a different "next opponent" each time. Draw it once, the
  // moment the round becomes due, and store it so the preview stays
  // stable until the round is actually played (which reuses this exact
  // pairing rather than redrawing).
  useEffect(() => {
    if (pendingCupRoundIndex === null) return;
    const existingDraw = state.usOpenCup?.pendingDraw;
    if (existingDraw && existingDraw.roundIndex === pendingCupRoundIndex) return;
    mutateAndSave((next) => {
      const draw = drawNextUsOpenCupRound(next.usOpenCup, next.tiers, next.usOpenCupQualifiers);
      next.usOpenCup = next.usOpenCup
        ? { ...next.usOpenCup, pendingDraw: draw }
        : { rounds: [], giantKillerBonuses: [], pool: null, done: false, champion: null, runnerUp: null, pendingDraw: draw };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCupRoundIndex]);

  // Same idea for England's two cups — draw the pairing once, the moment
  // a round becomes due, so the "next opponent" preview stays stable
  // instead of only appearing after the round is actually played. This
  // mechanic already existed for the US Open Cup; England's cups had the
  // resolve-side plumbing for it but nothing was ever triggering the draw.
  useEffect(() => {
    if (!pendingEnglandCupKey) return;
    const stateKey = pendingEnglandCupKey === "fa" ? "faCup" : "eflCup";
    const existingDraw = state[stateKey]?.pendingDraw;
    const roundIndex = state[stateKey]?.rounds?.length ?? 0;
    if (existingDraw && existingDraw.roundIndex === roundIndex) return;
    mutateAndSave((next) => {
      const englandTiers = next.tiers.slice(4, 8);
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
      const draw = drawNextEnglandCupRound(pendingEnglandCupKey, next[stateKey], englandTiers, eflCupQualifiers);
      next[stateKey] = next[stateKey]
        ? { ...next[stateKey], pendingDraw: draw }
        : { rounds: [], giantKillerBonuses: [], pool: null, done: false, champion: null, runnerUp: null, pendingDraw: draw };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingEnglandCupKey]);

  const handlePlayCupRound = () => {
    mutateAndSave((next) => {
      const newRound = resolveCupRoundInPlace(next);
      const match = findUserCupMatch(newRound);
      if (match) setCupRecap({ roundLabel: newRound.label, cupName: "US Open Cup", cupDone: !!next.usOpenCup?.done, match });
    });
  };

  const handlePlayEnglandCupRound = (cupKey) => {
    mutateAndSave((next) => {
      const newRound = resolveEnglandCupRoundInPlace(next, cupKey);
      const match = findUserCupMatch(newRound);
      const stateKey = cupKey === "fa" ? "faCup" : "eflCup";
      if (match) setCupRecap({ roundLabel: newRound.label, cupName: cupKey === "fa" ? "FA Cup" : "EFL Cup", cupDone: !!next[stateKey]?.done, match });
    });
  };

  const doRollover = (precomputedEnglandPlayoffs) => {
    // The shared world has USA (tiers 0-3) and England (tiers 4-7) side by
    // side but NOT connected — no promotion/relegation between USL League
    // Two and the Premier League, they're separate pyramids. Whichever side
    // the user's own club is on uses the full user-aware rollover (prize
    // money, DP revenue, board pressure, playoffs, trophies for USA;
    // promotion/relegation, aging, retirements for England — England
    // doesn't have wage/DP/prize economics yet, stated plainly, so those
    // fields stay at their defaults for an England save). The OTHER side
    // still advances in the background so both halves of the world keep
    // evolving season to season, just without any user-specific payouts.
    const usaTiers = state.tiers.slice(0, 4);
    const englandTiers = state.tiers.slice(4, 8);
    const userIsEngland = state.userTierId >= 4;

    const usaResult = userIsEngland
      ? rolloverSeason(usaTiers, "__background__", state.prizePools.slice(0, 4), state.difficulty, computeSeasonPlayoffs(usaTiers, "__background__", state.difficulty))
      : rolloverSeason(usaTiers, state.userClubId, state.prizePools.slice(0, 4), state.difficulty, seasonPlayoffs);
    const englandResult = rolloverEnglandSeason(englandTiers, state.parachutePayments, state.difficulty, state.prizePools.slice(4, 8), state.userClubId, precomputedEnglandPlayoffs);

    const newTiers = [...usaResult.newTiers, ...englandResult.tiers];
    // A manager who's actually won things commands more investment from
    // whatever club they're at — not just the slow reputation drift, a
    // direct, visible reward for silverware. Counts real wins only (not
    // runner-up finishes, which share the same trophyLog "trophy" type),
    // capped so a very long career doesn't runaway-scale forever.
    const careerTrophyWins = (managerHistory.trophyLog || []).filter((t) => t.note?.startsWith("Won")).length;
    if (careerTrophyWins > 0) {
      const trophyFundingMultiplier = 1 + Math.min(careerTrophyWins * 0.04, 0.6);
      let userClubInNewTiers = null, userClubNewTierId = null;
      newTiers.forEach((t) => {
        const found = t.clubs.find((c) => c.id === state.userClubId);
        if (found) { userClubInNewTiers = found; userClubNewTierId = t.id; }
      });
      if (userClubInNewTiers) {
        const bonus = Math.round(ownershipDepositFor(userClubNewTierId, state.difficulty, userClubInNewTiers) * (trophyFundingMultiplier - 1));
        userClubInNewTiers.budget += bonus;
      }
    }
    const tables = [...usaResult.tables, ...englandResult.tables];
    const events = [...usaResult.events, ...englandResult.events];
    const newPrizePools = [...usaResult.newPrizePools, ...englandResult.newPrizePools];
    const seasonAwards = userIsEngland ? computeSeasonAwards(englandTiers[state.userTierId - 4]) : usaResult.seasonAwards;
    const windowResult = userIsEngland ? null : usaResult.windowResult;
    const userPrize = userIsEngland ? englandResult.userPrize : usaResult.userPrize;
    const userRetirements = userIsEngland ? [] : usaResult.userRetirements;
    const userDraftPicks = userIsEngland ? [] : usaResult.userDraftPicks;
    const userPayroll = userIsEngland ? englandResult.userPayroll : usaResult.userPayroll;
    const mlsPlayoffResult = usaResult.mlsPlayoffResult;
    const userMlsPlayoff = userIsEngland ? null : usaResult.userMlsPlayoff;
    const uslcPlayoffResult = usaResult.uslcPlayoffResult;
    const userUslcPlayoff = userIsEngland ? null : usaResult.userUslcPlayoff;
    const userPromotionPlayoff = userIsEngland
      ? englandResult.promotionPlayoffs.find((pp) => pp.tierIdx === state.userTierId)
      : usaResult.userPromotionPlayoff;
    const userDisqualificationNotice = userIsEngland ? null : usaResult.userDisqualificationNotice;
    const userDpRevenue = userIsEngland ? 0 : usaResult.userDpRevenue;
    const userParachutePayment = (() => {
      if (!userIsEngland) return 0;
      const wasRelegatedFromPL = events.some((e) => e.type === "relegated" && e.from === 4 && e.clubId === state.userClubId);
      if (wasRelegatedFromPL) return PARACHUTE_PAYMENT_SCHEDULE[0];
      const existingSchedule = state.parachutePayments?.[state.userClubId];
      const promotedToPL = events.some((e) => e.type === "promoted" && e.to === 4 && e.clubId === state.userClubId);
      if (existingSchedule && existingSchedule.length > 0 && !promotedToPL) return existingSchedule[0];
      return 0;
    })();

    // The US Open Cup already ran and paid out mid-season (see
    // handlePlayCupRound) — this is just a historical recap for the
    // season summary, not a fresh payout.
    const cup = state.usOpenCup;
    const faCupSnapshot = state.faCup;
    const eflCupSnapshot = state.eflCup;
    let userUsOpenCup = null;
    if (cup?.done) {
      const userGiantKillerWins = cup.giantKillerBonuses.filter((g) => g.clubId === state.userClubId).length;
      if (state.userClubId === cup.champion.club.id) userUsOpenCup = { result: "champion", giantKillerWins: userGiantKillerWins };
      else if (state.userClubId === cup.runnerUp.club.id) userUsOpenCup = { result: "runner-up", giantKillerWins: userGiantKillerWins };
      else if (userGiantKillerWins > 0) userUsOpenCup = { result: "giant-killer", giantKillerWins: userGiantKillerWins };
    }
    const computeUserEnglandCupResult = (cupSnapshot) => {
      if (!cupSnapshot?.done) return null;
      const userGiantKillerWins = cupSnapshot.giantKillerBonuses.filter((g) => g.clubId === state.userClubId).length;
      if (state.userClubId === cupSnapshot.champion.club.id) return { result: "champion", giantKillerWins: userGiantKillerWins };
      if (state.userClubId === cupSnapshot.runnerUp.club.id) return { result: "runner-up", giantKillerWins: userGiantKillerWins };
      if (userGiantKillerWins > 0) return { result: "giant-killer", giantKillerWins: userGiantKillerWins };
      return null;
    };
    const userFaCup = computeUserEnglandCupResult(faCupSnapshot);
    const userEflCup = computeUserEnglandCupResult(eflCupSnapshot);
    const userMove = events.find((e) => e.clubId === state.userClubId && e.type !== "champion");
    const userChamp = events.find((e) => e.clubId === state.userClubId && e.type === "champion");
    const currentClubName = state.tiers[state.userTierId].clubs.find((c) => c.id === state.userClubId)?.name ?? "";
    const trophyEntries = [];
    // Logged every season regardless of trophies, purely so "seasons at
    // this club" can be counted accurately — a quiet mid-table season
    // wouldn't otherwise leave any entry at all. Filtered out of the
    // visible chronological history in TrophyTab, used only for the count.
    trophyEntries.push({ season: state.seasonNumber, note: "Season completed", type: "season-marker", clubName: currentClubName });
    if (userChamp) {
      const shieldNote = userChamp.tier === 0 ? "Won the Supporters' Shield (best regular-season record)"
        : userChamp.tier === 1 ? "Won the Players' Shield (best regular-season record)"
        : `Won the ${FULL_TIER_META[userChamp.tier].name} title`;
      trophyEntries.push({ season: state.seasonNumber, note: shieldNote, type: "trophy", clubName: currentClubName });
    }
    if (userMove) trophyEntries.push({
      season: state.seasonNumber,
      note: userMove.type === "promoted" ? `Promoted to ${FULL_TIER_META[userMove.to].name}` : `Relegated to ${FULL_TIER_META[userMove.to].name}`,
      type: userMove.type === "promoted" ? "promotion" : "relegation",
      clubName: currentClubName,
    });
    if (userMlsPlayoff?.result === "champion") trophyEntries.push({ season: state.seasonNumber, note: "Won the MLS Cup", type: "trophy", clubName: currentClubName });
    if (mlsPlayoffResult?.east?.confFinal?.winner?.id === state.userClubId) trophyEntries.push({ season: state.seasonNumber, note: "Won the Eastern Conference Championship", type: "trophy", clubName: currentClubName });
    if (mlsPlayoffResult?.west?.confFinal?.winner?.id === state.userClubId) trophyEntries.push({ season: state.seasonNumber, note: "Won the Western Conference Championship", type: "trophy", clubName: currentClubName });
    else if (userMlsPlayoff?.result === "runner-up") trophyEntries.push({ season: state.seasonNumber, note: "MLS Cup runner-up", type: "trophy", clubName: currentClubName });
    if (userUslcPlayoff?.result === "champion") trophyEntries.push({ season: state.seasonNumber, note: "Won the USL Cup", type: "trophy", clubName: currentClubName });
    else if (userUslcPlayoff?.result === "runner-up") trophyEntries.push({ season: state.seasonNumber, note: "USL Cup runner-up", type: "trophy", clubName: currentClubName });
    if (userUsOpenCup?.result === "champion") trophyEntries.push({ season: state.seasonNumber, note: "Won the US Open Cup", type: "trophy", clubName: currentClubName });
    else if (userUsOpenCup?.result === "runner-up") trophyEntries.push({ season: state.seasonNumber, note: "US Open Cup runner-up", type: "trophy", clubName: currentClubName });
    if (userFaCup?.result === "champion") trophyEntries.push({ season: state.seasonNumber, note: "Won the FA Cup", type: "trophy", clubName: currentClubName });
    else if (userFaCup?.result === "runner-up") trophyEntries.push({ season: state.seasonNumber, note: "FA Cup runner-up", type: "trophy", clubName: currentClubName });
    if (userEflCup?.result === "champion") trophyEntries.push({ season: state.seasonNumber, note: "Won the EFL Cup", type: "trophy", clubName: currentClubName });
    else if (userEflCup?.result === "runner-up") trophyEntries.push({ season: state.seasonNumber, note: "EFL Cup runner-up", type: "trophy", clubName: currentClubName });

    // Track the best league finish this manager has ever recorded, across
    // every club and every tier — permanent career history, not tied to
    // whichever club you're currently at. Tracked both overall and split
    // by country, since a manager with careers in both wants to see each
    // one's own peak, not just whichever happens to be globally better.
    // Points are tracked alongside position — position alone can't improve
    // once you're already 1st, so a repeat title with a stronger points
    // record than the one on file is still a genuine career-best and
    // should update the record, not get silently ignored as a "tie."
    const userTable = tables[state.userTierId];
    const userRow = userTable.find((r) => r.clubId === state.userClubId);
    const position = userTable.findIndex((r) => r.clubId === state.userClubId) + 1;
    const points = userRow?.points ?? 0;
    const isBetter = !managerHistory.bestFinish
      || position < managerHistory.bestFinish.position
      || (position === managerHistory.bestFinish.position && state.userTierId < managerHistory.bestFinish.tierIdx)
      || (position === managerHistory.bestFinish.position && state.userTierId === managerHistory.bestFinish.tierIdx && points > (managerHistory.bestFinish.points ?? -1));
    const bestFinish = isBetter ? { position, tierIdx: state.userTierId, season: state.seasonNumber, points } : managerHistory.bestFinish;

    const thisIsEngland = state.userTierId >= 4;
    const priorCountryBest = thisIsEngland ? managerHistory.bestFinishEngland : managerHistory.bestFinishUsa;
    const isBetterForCountry = !priorCountryBest
      || position < priorCountryBest.position
      || (position === priorCountryBest.position && state.userTierId < priorCountryBest.tierIdx)
      || (position === priorCountryBest.position && state.userTierId === priorCountryBest.tierIdx && points > (priorCountryBest.points ?? -1));
    const newCountryBest = isBetterForCountry ? { position, tierIdx: state.userTierId, season: state.seasonNumber, points } : priorCountryBest;
    const bestFinishUsa = thisIsEngland ? managerHistory.bestFinishUsa : newCountryBest;
    const bestFinishEngland = thisIsEngland ? newCountryBest : managerHistory.bestFinishEngland;

    // Board pressure — Executive mode only. Evaluate the objective the board
    // set last time, move happiness accordingly, and set the next one.
    let sackNotice = null;
    let boardNotice = null;
    const nextTierIdx = userMove ? userMove.to : state.userTierId;
    const userClubPreForMessages = state.tiers[state.userTierId].clubs.find((c) => c.id === state.userClubId);
    const userClubPostForMessages = newTiers[nextTierIdx].clubs.find((c) => c.id === state.userClubId);

    // The world moves on its own now too — AI clubs trade with each other,
    // not just with the user. Runs once per rollover, every tier, before
    // anything board-related (doesn't depend on it either way).
    const aiTransferLog = runAiToAiTransfers(newTiers, state.userClubId);

    // World records / news feed — a local scratch object rather than
    // mutating `state` directly (this handler builds its final state via
    // setState at the end, unlike mutateAndSave-style handlers elsewhere).
    const recordsScratch = { worldRecords: state.worldRecords ? { ...state.worldRecords } : { ...DEFAULT_WORLD_RECORDS }, newsFeed: state.newsFeed || [] };
    aiTransferLog.forEach((t) => {
      recordsScratch.newsFeed = [{ season: state.seasonNumber, headline: `🔁 ${t.buyerName} sign ${t.playerName} (${t.position}, ${t.overall} OVR) from ${t.sellerName} for $${t.fee.toLocaleString()}.`, category: "transfer" }, ...recordsScratch.newsFeed].slice(0, 40);
      checkTransferRecord(recordsScratch, t.playerName, t.fee, t.sellerName, t.buyerName, state.seasonNumber);
    });

    // Job offers: a club can proactively reach out about the manager
    // taking over there, delivered through the inbox with real Accept/
    // Decline actions. Up to 3 can be pending at once now — capped so the
    // inbox doesn't flood, but no longer limited to exactly one, so a
    // decent run of seasons can genuinely surface a few real options at
    // once instead of forcing a decision on whichever arrived first.
    let jobOffers = state.jobOffers || [];
    if (jobOffers.length < 3 && Math.random() < jobOfferChanceFor(managerHistory.managerReputation ?? 50)) {
      const newOffer = generateJobOffer(newTiers, state.userClubId, state.userTierId, userClubPostForMessages.reputation, jobOffers.map((o) => o.clubId));
      if (newOffer) jobOffers = [...jobOffers, newOffer];
    }

    // Most league titles — the actual champion of every tier, not just the
    // user's, tracked directly on the club object so it survives manager
    // changes (unlike managerHistory.trophyLog, which is per-career).
    tables.forEach((table, tierIdx) => {
      const championId = table[0]?.clubId;
      if (!championId) return;
      const champion = newTiers[tierIdx]?.clubs.find((c) => c.id === championId);
      if (!champion) return;
      champion.leagueTitles = (champion.leagueTitles || 0) + 1;
      const current = recordsScratch.worldRecords.mostLeagueTitles;
      if (!current || champion.leagueTitles > current.titles) {
        recordsScratch.worldRecords.mostLeagueTitles = { clubName: champion.name, tierId: tierIdx, titles: champion.leagueTitles };
      }
    });

    // Financial distress — the world's own clubs can run into real trouble
    // too, and that now includes the user's — the news feed treats every
    // club the same way rather than quietly leaving the user's own club
    // out of its own world's story. Capped to the worst couple of cases
    // each season so this reads as "notable financial story," not a
    // spreadsheet dump of every club with a slightly negative number.
    {
      const inDebt = newTiers.flatMap((t) => t.clubs)
        .filter((c) => c.budget < -3_000_000)
        .sort((a, b) => a.budget - b.budget)
        .slice(0, 2);
      inDebt.forEach((c) => {
        recordsScratch.newsFeed = [{ season: state.seasonNumber, headline: `📉 ${c.name} are in real financial trouble — $${Math.abs(c.budget).toLocaleString()} in debt.`, category: "finance" }, ...recordsScratch.newsFeed].slice(0, 40);
      });
    }

    // Board messages ("nosey board" demands) — available from Pro difficulty
    // up, independent of the full board-happiness/objective pressure system
    // (which stays Executive-only, below). Deliberately handled here, in
    // the shared post-rollover block rather than either country's own
    // rollover function — this project has hit the MLS-built-but-never-
    // ported-to-England bug enough times that anything board-related
    // belongs where both countries already pass through the same code.
    // Consequences apply to budget for everyone (works identically at any
    // difficulty); Executive additionally feeds into its happiness meter
    // below via messageComplianceDelta.
    let messageComplianceDelta = 0;
    if (DIFFICULTY_MODES[state.difficulty]?.boardMessages) {
      const pendingMessage = userClubPreForMessages.boardMessage;
      let boardMessageNotice = null;
      let messageBudgetDelta = 0;
      if (pendingMessage) {
        const compliant = checkBoardMessageCompliance(pendingMessage, userClubPreForMessages, state.userSigningsThisSeason, state.playersOnLoan);
        messageComplianceDelta = compliant ? 10 : -12;
        const depositScale = ownershipDepositFor(nextTierIdx, state.difficulty);
        messageBudgetDelta = compliant ? Math.round(depositScale * 0.08) : -Math.round(depositScale * 0.05);
        boardMessageNotice = boardMessageNoticeText(pendingMessage, compliant);
      }
      // 25% chance of a fresh demand for next season — never issued while
      // one's already pending, so there's only ever one live demand at a time.
      const newBoardMessage = !pendingMessage && Math.random() < 0.25 ? generateBoardMessage(userClubPostForMessages) : null;
      if (boardMessageNotice) boardNotice = boardNotice ? `${boardNotice}\n\n${boardMessageNotice}` : boardMessageNotice;
      const idxMsg = newTiers[nextTierIdx].clubs.findIndex((c) => c.id === state.userClubId);
      if (idxMsg >= 0) {
        newTiers[nextTierIdx].clubs[idxMsg] = {
          ...newTiers[nextTierIdx].clubs[idxMsg],
          boardMessage: newBoardMessage,
          budget: newTiers[nextTierIdx].clubs[idxMsg].budget + messageBudgetDelta,
        };
      }
    }

    // A star player pushed to the brink (transferRequested, still unresolved
    // going into rollover) sometimes gets a board intervention instead of
    // just being left to fester — a real board doesn't always sit on its
    // hands while a key player threatens to walk. Available Pro and up,
    // same as messages. Succeeds more often when the board has real goodwill
    // (Executive's happiness meter) or, on Pro where that doesn't exist,
    // roughly half the time. A failed or skipped intervention leaves the
    // player's frustration (benchStreak) to keep climbing toward the
    // forced-departure threshold below — nothing here stops that clock.
    let interventionNotice = null;
    if (DIFFICULTY_MODES[state.difficulty]?.boardMessages) {
      const idxInt = newTiers[nextTierIdx].clubs.findIndex((c) => c.id === state.userClubId);
      if (idxInt >= 0) {
        const club = newTiers[nextTierIdx].clubs[idxInt];
        const happinessGoodwill = club.boardHappiness != null ? club.boardHappiness >= 50 : true;
        const unhappyStar = club.squad.find((p) => p.transferRequested && p.overall >= 80);
        if (unhappyStar && happinessGoodwill && Math.random() < 0.4) {
          club.squad = club.squad.map((p) => (p.id === unhappyStar.id
            ? { ...p, transferRequested: false, transferListed: false, askingPrice: null, morale: clamp((p.morale ?? 60) + 20, 0, 100), benchStreak: 0 }
            : p));
          interventionNotice = `The board stepped in to keep ${unhappyStar.name} at the club, smoothing things over before it became a real problem.`;
        }
      }
    }
    if (interventionNotice) boardNotice = boardNotice ? `${boardNotice}\n\n${interventionNotice}` : interventionNotice;

    // Forced departures: a player whose frustration (benchStreak) has run
    // all the way past the ordinary transfer-request threshold reaches a
    // point of no return — real unhappiness a manager ignored for an
    // entire extra season-plus, not something that can be defused by
    // unlisting them at the last minute the way an ordinary transfer
    // request can. They simply leave, for a modest fee, no exceptions.
    let departureNotices = [];
    {
      const idxDep = newTiers[nextTierIdx].clubs.findIndex((c) => c.id === state.userClubId);
      if (idxDep >= 0) {
        const club = newTiers[nextTierIdx].clubs[idxDep];
        const leaving = club.squad.filter((p) => (p.benchStreak || 0) >= FORCED_DEPARTURE_BENCH_THRESHOLD);
        if (leaving.length) {
          const leavingIds = new Set(leaving.map((p) => p.id));
          const fee = leaving.reduce((s, p) => s + Math.round(marketValue(p) * 0.4), 0);
          club.squad = club.squad.filter((p) => !leavingIds.has(p.id));
          club.budget += fee;
          departureNotices = leaving.map((p) => `${p.name}'s patience finally ran out — they forced through a move away from the club, no longer willing to wait it out.`);
        }
      }
    }
    if (departureNotices.length) boardNotice = boardNotice ? `${boardNotice}\n\n${departureNotices.join("\n\n")}` : departureNotices.join("\n\n");

    if (DIFFICULTY_MODES[state.difficulty]?.boardPressure) {
      const userClubPre = state.tiers[state.userTierId].clubs.find((c) => c.id === state.userClubId);
      const currentObjective = userClubPre.boardObjective;
      const userClubPost = newTiers[nextTierIdx].clubs.find((c) => c.id === state.userClubId);
      const debt = userClubPost.budget < 0 ? -userClubPost.budget : 0;
      // Running a deficit already costs a flat -10 via boardHappinessDelta,
      // but a real board is far more forgiving of a small overspend than a
      // genuine crisis — scale an extra penalty with how deep the debt
      // actually runs, and let it factor meaningfully into getting sacked.
      const debtPenalty = debt > 0 ? Math.min(20, Math.round(debt / 500_000)) : 0;

      const delta = boardHappinessDelta(currentObjective, position, userMove?.type === "relegated", userMove?.type === "promoted", userClubPost.budget) - debtPenalty + messageComplianceDelta;
      let newHappiness = clamp((userClubPre.boardHappiness ?? 60) + delta, 0, 100);
      const sacked = newHappiness <= SACK_THRESHOLD;

      // Danger zone: happiness has dropped low enough to be a real concern
      // but not low enough to be sacked yet. Real boards don't just silently
      // wait it out here — some stay patient and back the manager with extra
      // funds to try to fix things, others make clear this is a last chance.
      // Being in actual debt always earns a roll here too, even if happiness
      // hasn't cratered yet — a board notices red ink long before a mid-table
      // finish becomes a happiness problem.
      const DANGER_ZONE_THRESHOLD = 30;
      let emergencyFunding = 0;
      if (!sacked && (newHappiness <= DANGER_ZONE_THRESHOLD || debt > 0)) {
        const boardIsPatient = Math.random() < 0.4;
        if (boardIsPatient) {
          const depositScale = ownershipDepositFor(nextTierIdx, state.difficulty);
          const standardFunding = Math.round(depositScale * (0.25 + Math.random() * 0.15));
          // if there's real debt, make sure the bailout actually covers a
          // meaningful chunk of it rather than being a token gesture
          emergencyFunding = debt > 0 ? Math.max(standardFunding, Math.round(debt * 0.6)) : standardFunding;
          newHappiness = clamp(newHappiness + 5, 0, 100);
          boardNotice = (boardNotice ? `${boardNotice}\n\n` : "") + (debt > 0
            ? `The board convened over the club's finances — ${userClubPre.name} is $${debt.toLocaleString()} in debt. They've agreed to inject $${emergencyFunding.toLocaleString()} to help dig out, but they expect the books back in order soon.`
            : `The board held an emergency meeting about results at ${userClubPre.name}. They've decided to stay patient for now and back you with an extra $${emergencyFunding.toLocaleString()} for the squad — but they'll expect to see it turn around.`);
        } else {
          boardNotice = (boardNotice ? `${boardNotice}\n\n` : "") + (debt > 0
            ? `The board is alarmed by ${userClubPre.name}'s finances — $${debt.toLocaleString()} in debt — and isn't stepping in to cover it. Sort the budget out yourself, or it'll cost you your job.`
            : `The board held an emergency meeting about results at ${userClubPre.name}. They're not pulling the plug yet, but make no mistake — this is a final warning. Turn it around, or you're out.`);
        }
      }

      const nextObjective = generateBoardObjective(userClubPre.reputation, nextTierIdx, newTiers[nextTierIdx].clubs, position);
      const idx = newTiers[nextTierIdx].clubs.findIndex((c) => c.id === state.userClubId);
      if (idx >= 0) {
        newTiers[nextTierIdx].clubs[idx] = {
          ...newTiers[nextTierIdx].clubs[idx],
          boardHappiness: newHappiness,
          boardObjective: nextObjective,
          budget: newTiers[nextTierIdx].clubs[idx].budget + emergencyFunding,
        };
      }
      if (sacked) {
        const promotedThisSeason = userMove?.type === "promoted";
        const positionText = `${position}${position === 1 ? "st" : position === 2 ? "nd" : position === 3 ? "rd" : "th"}`;
        const playoffResult = userMlsPlayoff || userUslcPlayoff;
        const playoffText = playoffResult?.result === "champion" ? " — and still won the playoffs, but that wasn't enough to save your job here."
          : playoffResult?.result === "runner-up" ? " but reached the playoff final, which still wasn't enough to save your job here."
          : playoffResult?.result === "qualifier" ? " but made the playoffs, which still wasn't enough to save your job here."
          : promotedThisSeason ? " — promoted, but that wasn't enough to save your job here."
          : ".";
        sackNotice = {
          clubName: userClubPre.name,
          reason: currentObjective
            ? `The board wanted: ${currentObjective.description}. You finished ${positionText}${playoffText}`
            : "The board has lost confidence in your management.",
        };
      }
    } else if (DIFFICULTY_MODES[state.difficulty]?.wagesDeducted) {
      // Pro mode — no board to answer to, but a club still can't be left to
      // spiral into unmanageable debt indefinitely. Ownership automatically
      // covers part of any shortfall; the rest is on the manager to fix.
      const idx = newTiers[nextTierIdx].clubs.findIndex((c) => c.id === state.userClubId);
      if (idx >= 0) {
        const club = newTiers[nextTierIdx].clubs[idx];
        if (club.budget < 0) {
          const debt = -club.budget;
          const relief = Math.round(debt * 0.6);
          newTiers[nextTierIdx].clubs[idx] = { ...club, budget: club.budget + relief };
          const remaining = debt - relief;
          boardNotice = `Ownership stepped in to cover part of the shortfall — a $${relief.toLocaleString()} injection lands after payroll, but you're still $${remaining.toLocaleString()} in the red. Rein in spending before it happens again.`;
        }
      }
    }

    if (userDisqualificationNotice) {
      const dqText = userDisqualificationNotice.resolved
        ? `${userDisqualificationNotice.clubName} is back above the ${MIN_SQUAD_SIZE}-player minimum — disqualification lifted, you're clear to compete normally again.`
        : `${userDisqualificationNotice.clubName} enters the new season short ${userDisqualificationNotice.short} player${userDisqualificationNotice.short === 1 ? "" : "s"} of the ${MIN_SQUAD_SIZE}-player minimum — you're disqualified from competing until you sign back up to strength. Emergency funding of $${userDisqualificationNotice.funding.toLocaleString()} has been added to your budget to help.`;
      boardNotice = boardNotice ? `${boardNotice}\n\n${dqText}` : dqText;
    }

    // The trophy case belongs to the manager, not the club — record this
    // season's results either way, sacked or not. Manager reputation is
    // also career-long (not tied to any one club) — it's what a new club
    // judges you on when you go looking for your next job, in Pro/
    // Executive mode. Ratchets with clear season outcomes: title wins and
    // promotions build it, relegations knock it down, cup wins add a
    // smaller bump each.
    let repDelta = 2; // a modest nod to accumulated experience — achievements below still matter far more than just surviving seasons
    if (userChamp) repDelta += 18;
    if (userMove?.type === "promoted") repDelta += 10;
    else if (userMove?.type === "relegated") repDelta -= 12;
    [userMlsPlayoff, userUslcPlayoff, userUsOpenCup, userFaCup, userEflCup].forEach((r) => {
      if (r?.result === "champion") repDelta += 8;
      else if (r?.result === "runner-up") repDelta += 3; // reaching a major final is still a real credential, even without winning it
    });
    setManagerHistory((prev) => ({
      ...prev,
      trophyLog: [...prev.trophyLog, ...trophyEntries],
      bestFinish,
      bestFinishUsa,
      bestFinishEngland,
      managerReputation: clamp((prev.managerReputation ?? 40) + repDelta, 5, 99),
    }));

    if (sackNotice) {
      setSackedNotice(sackNotice);
      setSeasonPlayoffs(null);
    setRevealedRounds(0);
      return;
    }

    // Loan returns — anyone due back this season rejoins the squad (if
    // there's room), having developed a bit extra for the time away.
    const nextSeasonNumber = state.seasonNumber + 1;
    const stillOnLoan = [];
    const userNewTierId = userMove ? userMove.to : state.userTierId;
    const userClubAfterMove = newTiers[userNewTierId].clubs.find((c) => c.id === state.userClubId);
    (state.playersOnLoan || []).forEach((entry) => {
      if (entry.returnSeasonNumber !== nextSeasonNumber) { stillOnLoan.push(entry); return; }
      if (userClubAfterMove && userClubAfterMove.squad.length < MAX_SQUAD_SIZE) {
        const developed = growPlayer(growPlayer(entry.player, userNewTierId), userNewTierId); // an extra development pass, on top of what everyone else already gets this rollover
        userClubAfterMove.squad.push({ ...developed, seasonGoals: 0, benchStreak: 0 });
      } else {
        stillOnLoan.push(entry); // squad's full — stay out one more season
      }
    });

    setState((prev) => ({
      ...prev,
      tiers: newTiers,
      userTierId: userMove ? userMove.to : prev.userTierId,
      seasonNumber: prev.seasonNumber + 1,
      midWindowSeason: prev.midWindowSeason,
      prizePools: newPrizePools,
      // US Open Cup qualification is based on the PREVIOUS season's final
      // standings, same as the real tournament (not whatever's happening
      // in-progress this season) — bank this season's final top-16
      // USLC / bottom-16 MLS now, for next season's cup rounds to use.
      usOpenCupQualifiers: {
        uslcTop16: tables[1].slice(0, 16).map((r) => r.clubId),
        mlsBottom16: tables[0].slice(-16).map((r) => r.clubId),
      },
      // Same idea for England: EFL Cup entry point depends on whether a
      // Premier League club qualified for Europe last season — this game
      // doesn't model European competitions, so the top 5 PL finishers
      // stand in as the proxy, banked now for next season's EFL Cup.
      eflCupQualifiers: { plTop5: tables[4].slice(0, 5).map((r) => r.clubId) },
      parachutePayments: englandResult.parachutePayments,
      usOpenCup: null,
      faCup: null,
      eflCup: null,
      playersOnLoan: stillOnLoan,
      userSigningsThisSeason: [],
      // Rolling log of AI-to-AI transfers, capped so a very long save
      // doesn't grow this unbounded — kept for the Historical Records /
      // News Feed work that's next up.
      worldTransferLog: [...(state.worldTransferLog || []), ...aiTransferLog.map((t) => ({ ...t, season: state.seasonNumber }))].slice(-150),
      worldRecords: recordsScratch.worldRecords,
      newsFeed: recordsScratch.newsFeed,
      jobOffers,
    }));
    const userClubForDeposit = state.tiers[state.userTierId].clubs.find((c) => c.id === state.userClubId);
    setRollover({ events, seasonNumber: state.seasonNumber, windowResult, userPrize, ownershipDeposit: ownershipDepositFor(state.userTierId, state.difficulty, userClubForDeposit, state.tiers[state.userTierId].clubs), userRetirements, userPayroll, mlsPlayoffResult, userMlsPlayoff, uslcPlayoffResult, userUslcPlayoff, userPromotionPlayoff, boardNotice, userDpRevenue, userParachutePayment, usOpenCup: cup, faCup: faCupSnapshot, eflCup: eflCupSnapshot, userUsOpenCup, userFaCup, userEflCup, seasonAwards });
    setEnglandPlayoffProgress(null);
    if (userDraftPicks && userDraftPicks.length) setDraftPicks(userDraftPicks);
    setSeasonPlayoffs(null);
    setRevealedRounds(0);
  };

  const handleToggleList = (playerId) => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const p = club.squad.find((pl) => pl.id === playerId);
      p.transferListed = !p.transferListed;
      p.askingPrice = p.transferListed ? marketValue(p) : null;
      if (!p.transferListed && p.transferRequested) {
        // Un-listing an unhappy player is treated as the manager
        // addressing it (a promise of more game time) — clear the
        // complaint rather than leaving the "wants out" badge stuck
        // forever with no way to resolve it.
        p.transferRequested = false;
        p.benchStreak = 0;
      }
    });
  };

  const handleRenew = (playerId) => {
    const p = userClub.squad.find((pl) => pl.id === playerId);
    if (p && state.userTierId === 0 && DIFFICULTY_MODES[state.difficulty]?.dps) {
      const isDp = (userClub.designatedPlayerIds || []).includes(p.id);
      if (!isDp) {
        const newWage = Math.round(p.wage * 1.1);
        const otherNonDpWages = effectivePayroll(userClub.squad.filter((sp) => sp.id !== p.id), userClub.designatedPlayerIds);
        if (otherNonDpWages + newWage > MLS_SALARY_CAP) {
          setInfoNotice(`Renewing ${p.name} at $${newWage.toLocaleString()}/season would push you over the $${MLS_SALARY_CAP.toLocaleString()} salary cap. Make them a Designated Player first, or free up cap room elsewhere.`);
          return;
        }
      }
    }
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const pl = club.squad.find((pl) => pl.id === playerId);
      if (!pl) return;
      const outcome = renewalOutcome(pl, club.budget);
      if (!outcome.accepted) {
        setRenewalNotice({ playerName: pl.name, accepted: false, reason: outcome.reason, cost: outcome.cost });
        return;
      }
      club.budget -= outcome.cost;
      pl.contractYearsLeft += 2;
      pl.wage = Math.round(pl.wage * 1.1);
      pl.wageSet = true;
      setRenewalNotice({ playerName: pl.name, accepted: true, cost: outcome.cost });
    });
  };

  const handleSetCaptain = (playerId) => {
    const club = userClub;
    const picked = club.squad.find((p) => p.id === playerId);
    const xi = startingXI(club, currentMatchday ?? 1);
    const bestLeader = [...xi].sort((a, b) => b.leadership - a.leadership)[0];
    if (picked && bestLeader && bestLeader.id !== picked.id && bestLeader.leadership - picked.leadership >= 10) {
      setInfoNotice(`${picked.name} isn't your strongest leader — ${bestLeader.name} (leadership ${bestLeader.leadership} vs ${picked.leadership}) is currently in your XI and might wear the armband better.`);
    }
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const c = t.clubs.find((cl) => cl.id === next.userClubId);
      c.captainId = playerId;
    });
  };

  const handleToggleDP = (playerId) => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const current = club.designatedPlayerIds || [];
      if (current.includes(playerId)) {
        club.designatedPlayerIds = current.filter((id) => id !== playerId);
      } else if (current.length < MAX_DESIGNATED_PLAYERS) {
        club.designatedPlayerIds = [...current, playerId];
        // A marquee DP signing raises what people expect of the club —
        // reputation only ratchets up from this, never down, so cutting a
        // DP later isn't retroactively punished.
        club.reputation = clamp(club.reputation + DP_REPUTATION_BUMP, 20, 95);
      }
    });
  };

  const handleToggleRest = (playerId) => {
    mutateAndSave((next) => {
      const club = next.tiers[next.userTierId].clubs.find((c) => c.id === next.userClubId);
      const p = club.squad.find((pl) => pl.id === playerId);
      if (p) p.restRequested = !p.restRequested;
    });
  };

  // Unlike restRequested (cleared automatically after the next match this
  // plays), restIndefinitely stays on until the manager explicitly turns
  // it back off — for genuinely parking a player, not just a one-match rest.
  const handleToggleRestIndefinitely = (playerId) => {
    mutateAndSave((next) => {
      const club = next.tiers[next.userTierId].clubs.find((c) => c.id === next.userClubId);
      const p = club.squad.find((pl) => pl.id === playerId);
      if (p) p.restIndefinitely = !p.restIndefinitely;
    });
  };

  // Custom-mode selection now lives in the Tactics tab: click a projected
  // slot, pick a replacement from the "Swap ▾" dropdown. This is syntactic
  // sugar over the same customXI favorites array startingXI() already
  // reads — drop the outgoing player's favorite status (if they had one)
  // and grant it to the incoming player, so the incoming player is now
  // prioritized ahead of the outgoing one within their shared position
  // bucket. The Squad tab still shows a read-only "In XI ✓" badge for
  // visibility, but no longer drives selection itself.
  const handleSwapCustomXI = (outgoingId, incomingId) => {
    mutateAndSave((next) => {
      const club = next.tiers[next.userTierId].clubs.find((c) => c.id === next.userClubId);
      const current = new Set(club.tactics.customXI || []);
      current.delete(outgoingId);
      current.add(incomingId);
      club.tactics.customXI = [...current];
    });
  };

  const handleToggleHoldBack = (playerId) => {
    mutateAndSave((next) => {
      const club = next.tiers[next.userTierId].clubs.find((c) => c.id === next.userClubId);
      const p = club.squad.find((pl) => pl.id === playerId);
      if (p) p.holdBackForCup = !p.holdBackForCup;
    });
  };

  // Loans keep it simple by design — no need to simulate them playing for
  // another club match by match. They leave the squad for the season, a
  // modest fee lands now, and they come back next season a little further
  // along than they'd have developed sitting on the bench.
  const handleLoanOut = (playerId) => {
    mutateAndSave((next) => {
      const club = next.tiers[next.userTierId].clubs.find((c) => c.id === next.userClubId);
      const p = club.squad.find((pl) => pl.id === playerId);
      if (!p) return;
      const fee = Math.round(1_000 * Math.pow(1.08, p.overall));
      club.budget += fee;
      club.squad = club.squad.filter((pl) => pl.id !== playerId);
      if (club.designatedPlayerIds?.includes(playerId)) {
        club.designatedPlayerIds = club.designatedPlayerIds.filter((id) => id !== playerId);
      }
      next.playersOnLoan = [...(next.playersOnLoan || []), { player: p, returnSeasonNumber: next.seasonNumber + 1 }];
    });
  };

  const handleDraftKeep = (pickIndex) => {
    const pick = draftPicks[pickIndex];
    if (!pick) return;
    if (userClub.squad.length >= MAX_SQUAD_SIZE) {
      setInfoNotice(`Your squad is full (max ${MAX_SQUAD_SIZE}) — sell the pick instead, or free up a roster spot first.`);
      return;
    }
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      club.squad.push(pick.prospect);
    });
    setDraftPicks((prev) => prev.filter((_, i) => i !== pickIndex));
  };

  const handleDraftSell = (pickIndex) => {
    const pick = draftPicks[pickIndex];
    if (!pick) return;
    const value = draftProspectValue(pick.prospect);
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      club.budget += value;
    });
    setDraftPicks((prev) => prev.filter((_, i) => i !== pickIndex));
  };

  const handleBuy = (playerId, sellerId, sellerTierId) => {
    if (userClub.squad.length >= MAX_SQUAD_SIZE) {
      setInfoNotice(`Your squad is full (max ${MAX_SQUAD_SIZE}) — sell or release someone before buying.`);
      return;
    }
    // Real salary cap check (MLS + Executive only, where DPs exist): a new
    // signing joins as a non-DP by default, so if their wage would push
    // the non-DP wage bill over the cap, they need an open Designated
    // Player slot to be shielded from it — automatically used here if one
    // is actually free, rather than just blocking the purchase and making
    // the manager go figure out how to free one up manually first.
    let autoSignAsDp = false;
    if (state.userTierId === 0 && DIFFICULTY_MODES[state.difficulty]?.dps) {
      const sourceTier = state.tiers[sellerTierId] ?? state.tiers.find((t) => t.clubs.some((c) => c.id === sellerId));
      const seller = sourceTier?.clubs.find((c) => c.id === sellerId);
      const p = seller?.squad.find((pl) => pl.id === playerId);
      if (p) {
        const currentNonDpWages = effectivePayroll(userClub.squad, userClub.designatedPlayerIds);
        if (currentNonDpWages + p.wage > MLS_SALARY_CAP) {
          const dpSlotOpen = (userClub.designatedPlayerIds || []).length < MAX_DESIGNATED_PLAYERS;
          if (dpSlotOpen) {
            autoSignAsDp = true;
            setInfoNotice(`${p.name}'s wage would have busted the salary cap, so they've been signed as a Designated Player instead — using your open DP slot.`);
          } else {
            setInfoNotice(`Signing ${p.name} at a $${p.wage.toLocaleString()} wage would push you over the $${MLS_SALARY_CAP.toLocaleString()} salary cap, and all ${MAX_DESIGNATED_PLAYERS} Designated Player slots are already used. Free one up, offload some existing wages first, or look elsewhere.`);
            return;
          }
        }
      }
    }
    mutateAndSave((next) => {
      const buyerTier = next.tiers[next.userTierId];
      const buyer = buyerTier.clubs.find((c) => c.id === next.userClubId);
      const sourceTier = next.tiers[sellerTierId] ?? next.tiers.find((t) => t.clubs.some((c) => c.id === sellerId));
      const seller = sourceTier?.clubs.find((c) => c.id === sellerId);
      if (!seller) return;
      const p = seller.squad.find((pl) => pl.id === playerId);
      if (!p || buyer.budget < p.askingPrice) return;
      const fee = p.askingPrice; // capture before it gets nulled out below — reading it after crashes/silently breaks, same mistake already fixed once in runTransferWindow
      buyer.budget -= fee;
      seller.budget += fee;
      p.transferListed = false;
      p.askingPrice = null;
      // A fresh start at a new club — whatever bench frustration or
      // transfer-request history they had at their old club doesn't carry
      // over. Otherwise a player who'd built up bench streak elsewhere
      // could trigger "unhappy" again almost immediately after being
      // bought, before they'd even had a real chance to play here.
      p.benchStreak = 0;
      p.transferRequested = false;
      seller.squad = seller.squad.filter((pl) => pl.id !== playerId);
      if (seller.designatedPlayerIds?.includes(playerId)) {
        seller.designatedPlayerIds = seller.designatedPlayerIds.filter((id) => id !== playerId);
      }
      buyer.squad.push(p);
      if (autoSignAsDp) {
        buyer.designatedPlayerIds = [...(buyer.designatedPlayerIds || []), p.id];
      }
      checkTransferRecord(next, p.name, fee, seller.name, buyer.name, next.seasonNumber);
      setManagerHistory((prev) => {
        const stats = prev.careerStats || DEFAULT_MANAGER_HISTORY.careerStats;
        if (stats.biggestSigning && stats.biggestSigning.fee >= fee) return prev;
        return { ...prev, careerStats: { ...stats, biggestSigning: { playerName: p.name, fee, clubName: buyer.name } } };
      });
      // The user's own transfers used to be deliberately left out of the
      // News Feed (reasoning: "you already know what you just did") — but
      // that also meant the user's own club never showed up in its own
      // world news, which read as their team not being a real part of the
      // story the way every AI club was. Included now, same as any move.
      if (!next.newsFeed) next.newsFeed = [];
      next.newsFeed = [{ season: next.seasonNumber, headline: `🔁 ${buyer.name} sign ${p.name} (${p.position}, ${p.overall} OVR) from ${seller.name} for $${fee.toLocaleString()}.`, category: "transfer" }, ...next.newsFeed].slice(0, 40);
      // Tracked so a pending board message ("sign a quality DEF") can be
      // checked against what actually happened this season at rollover —
      // reset to [] every season, see the season-complete setState below.
      next.userSigningsThisSeason = [...(next.userSigningsThisSeason || []), { position: p.position, overall: p.overall }];
    });
  };

  const handleStartAcademy = () => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      if (!club.academyEligible || club.academyStars > 0 || club.budget < ACADEMY_START_COST) return;
      club.budget -= ACADEMY_START_COST;
      club.academyInvested = ACADEMY_START_COST;
      club.academyStars = 1;
    });
  };

  const handleInvestAcademy = () => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      if (club.academyStars <= 0 || club.academyStars >= 5 || club.budget < ACADEMY_INVEST_INCREMENT) return;
      club.budget -= ACADEMY_INVEST_INCREMENT;
      club.academyInvested += ACADEMY_INVEST_INCREMENT;
      club.academyStars = academyStarsForInvestment(club.academyInvested);
    });
  };

  const handleSignYouth = () => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const cost = academySigningCost(club.academyStars);
      if (club.academyStars <= 0 || club.budget < cost) return;
      if (club.youthPlayers.length >= ACADEMY_MAX_PROSPECTS) return;
      club.budget -= cost;
      club.youthPlayers = [...club.youthPlayers, generateAcademyProspect(club.academyStars)];
    });
  };

  const handlePromoteYouth = (playerId) => {
    if (userClub.squad.length >= MAX_SQUAD_SIZE) {
      setInfoNotice(`Your squad is full (max ${MAX_SQUAD_SIZE}) — sell or release someone before promoting.`);
      return;
    }
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const p = club.youthPlayers.find((yp) => yp.id === playerId);
      if (!p || p.age < ACADEMY_PROMOTE_MIN_AGE) return;
      club.youthPlayers = club.youthPlayers.filter((yp) => yp.id !== playerId);
      club.squad.push(promoteYouthToFirstTeam(p));
    });
  };

  const handleSellYouth = (playerId) => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const p = club.youthPlayers.find((yp) => yp.id === playerId);
      if (!p) return;
      club.budget += youthSaleValue(p);
      club.youthPlayers = club.youthPlayers.filter((yp) => yp.id !== playerId);
    });
  };

  const handleHostTryouts = () => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const cost = tryoutCost(next.userTierId);
      if (club.academyEligible || club.budget < cost) return;
      club.budget -= cost;
      club.tryoutCandidates = generateTryoutCandidates(next.userTierId);
    });
  };

  const handleSignTryoutCandidate = (playerId) => {
    if (userClub.squad.length >= MAX_SQUAD_SIZE) {
      setInfoNotice(`Your squad is full (max ${MAX_SQUAD_SIZE}) — sell or release someone before signing.`);
      return;
    }
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      const p = club.tryoutCandidates.find((c) => c.id === playerId);
      const cost = p ? tryoutSigningCost(p.overall) : 0;
      if (!p || club.budget < cost) return;
      club.budget -= cost;
      club.squad.push(p);
      club.tryoutCandidates = club.tryoutCandidates.filter((c) => c.id !== playerId);
    });
  };

  const handleDismissTryouts = () => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      club.tryoutCandidates = [];
    });
  };

  const handleTacticsChange = (field, value) => {
    mutateAndSave((next) => {
      const t = next.tiers[next.userTierId];
      const club = t.clubs.find((c) => c.id === next.userClubId);
      club.tactics = { ...club.tactics, [field]: value };
    });
  };

  const avgOvr = Math.round(userClub.squad.reduce((s, p) => s + p.overall, 0) / userClub.squad.length);

  return (
    <div style={{ minHeight: "100vh", background: PALETTE.parchment, ...serif }}>
      <style>{FONT_IMPORT}</style>

      {/* header */}
      <div style={{ background: PALETTE.pitch, color: PALETTE.parchment, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Crest name={userClub.name} size={44} />
          <div>
            <div style={{ ...display, fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              {userClub.name}
              {userClub.disqualified && (
                <span style={{ ...display, fontSize: 11, fontWeight: 700, background: PALETTE.crimson, color: "#fff", padding: "2px 8px", borderRadius: 5, letterSpacing: "0.04em" }}>
                  DISQUALIFIED — SIGN PLAYERS
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, opacity: 0.8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <TierBadge tierId={state.userTierId} /> {DIFFICULTY_MODES[state.difficulty]?.label ?? "Rookie"} · OVR {avgOvr} · ${safeNum(userClub.budget).toLocaleString()}
              {DIFFICULTY_MODES[state.difficulty]?.wagesDeducted && (
                <button
                  onClick={() => setShowPayroll(true)}
                  style={{ background: "none", border: `1px solid ${PALETTE.parchment}55`, borderRadius: 5, padding: "2px 8px", color: PALETTE.parchment, fontSize: 11, cursor: "pointer", ...display }}
                >
                  Payroll
                </button>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ textAlign: "right", fontSize: 12, opacity: 0.85 }}>
            Season {state.seasonNumber}<br />
            {seasonComplete ? "Season complete" : `Matchday ${currentMatchday}`}
          </div>
          {seasonComplete ? (() => {
            const isEnglandUser = state.userTierId >= 4;
            const englandQual = isEnglandUser ? computeUserPlayoffQualification(tier, state.userClubId) : { qualifies: false };
            const englandPlayoffDone = englandPlayoffProgress?.final != null;

            if (isEnglandUser) {
              let onClick, label;
              if (englandPlayoffProgress && !englandPlayoffDone) {
                // A playoff is actively in progress — this always wins,
                // regardless of what qualification would recompute to right
                // now. Never show "Continue" while the final is still open.
                onClick = null;
                label = "Finish the playoff below ↓";
              } else if (englandPlayoffProgress && englandPlayoffDone) {
                onClick = () => {
                  const precomputed = {
                    [tier.id]: {
                      autoPromoted: englandPlayoffProgress.seeds.autoPromoted,
                      playoffPromoted: englandPlayoffProgress.final.winner.id,
                      bracket: { semi1: englandPlayoffProgress.semi1, semi2: englandPlayoffProgress.semi2, final: englandPlayoffProgress.final },
                    },
                  };
                  doRollover(precomputed);
                };
                label = "Continue to Next Season →";
              } else if (englandQual.qualifies) {
                onClick = () => setEnglandPlayoffProgress({ seeds: englandQual.seeds, autoCount: englandQual.autoCount, semi1: null, semi2: null, final: null });
                label = "View Promotion Playoff";
              } else {
                onClick = () => doRollover();
                label = "Continue to Next Season →";
              }
              return (
                <button
                  onClick={onClick || undefined}
                  disabled={!onClick}
                  style={{ ...display, fontWeight: 600, fontSize: 13, background: onClick ? PALETTE.gold : PALETTE.parchmentDim, color: PALETTE.ink, border: "none", borderRadius: 6, padding: "10px 16px", cursor: onClick ? "pointer" : "default", opacity: onClick ? 1 : 0.7 }}
                >
                  {label}
                </button>
              );
            }

            // England's promotion playoff resolves invisibly inside
            // rolloverEnglandSeason (not shown round-by-round like MLS Cup/
            // USLC), so there's no bracket to watch — go straight to rollover.
            const userHasBracket = seasonPlayoffs && (
              (state.userTierId === 0 && seasonPlayoffs.mlsPlayoffResult) ||
              (state.userTierId === 1 && seasonPlayoffs.uslcPlayoffResult) ||
              seasonPlayoffs.promotionPlayoffs.some((pp) => pp.tierIdx === state.userTierId)
            );
            const userBracketTotalRounds = state.userTierId === 0 ? MLS_TOTAL_ROUNDS : state.userTierId === 1 ? USLC_TOTAL_ROUNDS : PROMO_TOTAL_ROUNDS;
            const readyToContinue = !seasonPlayoffs || !userHasBracket || revealedRounds >= userBracketTotalRounds;
            return (
              <button
                onClick={!seasonPlayoffs ? handleViewPostseason : readyToContinue ? () => doRollover() : () => setTab("table")}
                style={{ ...display, fontWeight: 600, fontSize: 13, background: PALETTE.gold, color: PALETTE.ink, border: "none", borderRadius: 6, padding: "10px 16px", cursor: "pointer" }}
              >
                {!seasonPlayoffs ? "View Postseason" : readyToContinue ? "Continue to Next Season →" : "Finish watching your bracket →"}
              </button>
            );
          })() : (
            <>
              <button
                onClick={simulateMatchday}
                style={{ ...display, fontWeight: 600, fontSize: 13, background: PALETTE.gold, color: PALETTE.ink, border: "none", borderRadius: 6, padding: "10px 14px", cursor: "pointer" }}
              >
                Sim Matchday
              </button>
              <button
                onClick={simulateToNextWindow}
                style={{ ...display, fontWeight: 600, fontSize: 12.5, background: "none", color: PALETTE.parchment, border: `1px solid ${PALETTE.parchment}55`, borderRadius: 6, padding: "10px 12px", cursor: "pointer" }}
              >
                Sim to Next Window
              </button>
              <button
                onClick={simulateSeason}
                style={{ ...display, fontWeight: 600, fontSize: 12.5, background: "none", color: PALETTE.parchment, border: `1px solid ${PALETTE.parchment}55`, borderRadius: 6, padding: "10px 12px", cursor: "pointer" }}
              >
                Sim Season
              </button>
            </>
          )}
          <button onClick={() => setShowLeaveConfirm(true)} title="Leave this club and look for a new job elsewhere" style={{ ...display, fontWeight: 600, fontSize: 12, background: "none", color: PALETTE.parchment, border: `1px solid ${PALETTE.parchment}55`, borderRadius: 6, padding: "10px 12px", cursor: "pointer" }}>
            Leave Club
          </button>
          <button onClick={onNewGame} title="Abandon career" style={{ background: "none", border: `1px solid ${PALETTE.parchment}55`, borderRadius: 6, padding: "10px", cursor: "pointer" }}>
            <RotateCcw size={16} color={PALETTE.parchment} />
          </button>
        </div>
      </div>

      {englandPlayoffProgress && (() => {
        const { seeds, semi1, semi2, final } = englandPlayoffProgress;
        const matchday = 9997;
        const rows = [
          { key: "semi1", label: "Semifinal 1", a: seeds.s1, b: seeds.s4, result: semi1, ready: true },
          { key: "semi2", label: "Semifinal 2", a: seeds.s2, b: seeds.s3, result: semi2, ready: true },
          { key: "final", label: "Final", a: semi1?.winner, b: semi2?.winner, result: final, ready: !!semi1 && !!semi2 },
        ];
        return (
          <div style={{ background: PALETTE.pitch, padding: "16px 24px", borderBottom: `2px solid ${PALETTE.parchmentDim}` }}>
            <div style={{ ...display, fontWeight: 700, fontSize: 14, color: PALETTE.gold, marginBottom: 10 }}>
              🏆 Promotion Playoff
            </div>
            {rows.map((row) => (
              <div key={row.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 0", borderTop: `1px solid ${PALETTE.parchment}22` }}>
                <div style={{ ...serif, fontSize: 13, color: PALETTE.parchment }}>
                  <span style={{ ...mono, fontSize: 10, opacity: 0.6, marginRight: 6 }}>{row.label}</span>
                  {row.a && row.b ? (
                    row.result
                      ? <>{row.result.result.homeClub} <strong style={{ ...mono }}>{row.result.result.homeScore}-{row.result.result.awayScore}</strong> {row.result.result.awayClub}{row.result.wentToPenalties ? " (pens)" : ""}</>
                      : <>{row.a.name} vs {row.b.name}</>
                  ) : (
                    <span style={{ opacity: 0.6 }}>Winners of the semifinals</span>
                  )}
                </div>
                {!row.result && row.ready && row.a && row.b && (
                  <button
                    onClick={() => {
                      const outcome = resolveKnockoutMatch(row.a, row.b, matchday);
                      setEnglandPlayoffProgress((prev) => ({ ...prev, [row.key]: outcome }));
                    }}
                    style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: PALETTE.gold, color: PALETTE.ink, fontSize: 12, fontWeight: 700, cursor: "pointer", ...display, whiteSpace: "nowrap" }}
                  >
                    Sim {row.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        );
      })()}

      {/* tabs */}
      <div style={{ display: "flex", gap: 4, padding: "10px 24px 0", borderBottom: `2px solid ${PALETTE.parchmentDim}`, flexWrap: "wrap" }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          const label = t.id === "opencup" && state.userTierId >= 4 ? "Competitions" : t.label;
          const inboxCount = t.id === "inbox" ? computeInboxUrgentCount(userClub, currentMatchday ?? (state.seasonNumber > 1 ? 999 : 1), tier, managerHistory?.seenOneTimeHints || [], state.difficulty, managerHistory?.clearedOneTimeHints || [], !!state.jobOffer) : 0;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", border: "none",
                background: "none", cursor: "pointer", ...display, fontSize: 13,
                color: active ? PALETTE.ink : PALETTE.inkSoft, fontWeight: active ? 700 : 500,
                borderBottom: active ? `3px solid ${PALETTE.gold}` : "3px solid transparent",
                position: "relative",
              }}
            >
              <Icon size={15} /> {label}
              {inboxCount > 0 && (
                <span style={{
                  background: PALETTE.crimson, color: "#fff", borderRadius: "50%", width: 16, height: 16,
                  fontSize: 9.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", ...mono,
                }}>
                  {inboxCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        {tab === "squad" && <SquadTab club={userClub} matchday={currentMatchday ?? (state.seasonNumber > 1 ? 999 : 1)} onToggleList={handleToggleList} onRenew={handleRenew} tierId={state.userTierId} difficulty={state.difficulty} onToggleDP={handleToggleDP} onToggleRest={handleToggleRest} onToggleRestIndefinitely={handleToggleRestIndefinitely} onToggleHoldBack={handleToggleHoldBack} onLoanOut={handleLoanOut} playersOnLoan={state.playersOnLoan} tier={tier} />}
        {tab === "tactics" && <TacticsTab club={userClub} matchday={currentMatchday ?? 1} onChange={handleTacticsChange} tier={tier} onSetCaptain={handleSetCaptain} onSwapCustomXI={handleSwapCustomXI} />}
        {tab === "table" && <TableTab tier={tier} userClubId={userClub.id} seasonPlayoffs={seasonPlayoffs} revealedRounds={revealedRounds} onSimRound={handleSimRound} onSimRest={handleSimRestOfPostseason} />}
        {tab === "fixtures" && <FixturesTab tier={tier} userClubId={userClub.id} usOpenCup={state.usOpenCup} faCup={state.faCup} eflCup={state.eflCup} />}
        {tab === "market" && <MarketTab tiers={state.tiers} userClub={userClub} userTierId={state.userTierId} onBuy={handleBuy} difficulty={state.difficulty} matchday={currentMatchday ?? 1} />}
        {tab === "development" && (
          <DevelopmentTab
            club={userClub}
            budget={userClub.budget}
            onStartAcademy={handleStartAcademy}
            onInvestAcademy={handleInvestAcademy}
            onSignYouth={handleSignYouth}
            onPromoteYouth={handlePromoteYouth}
            onSellYouth={handleSellYouth}
            onHostTryouts={handleHostTryouts}
            onSignTryout={handleSignTryoutCandidate}
            onDismissTryouts={handleDismissTryouts}
          />
        )}
        {tab === "opencup" && (
          state.userTierId >= 4 ? (
            <CompetitionsTab
              faCup={state.faCup}
              eflCup={state.eflCup}
              userTierId={state.userTierId}
              state={state}
              userClubId={state.userClubId}
              onPlayRound={handlePlayEnglandCupRound}
            />
          ) : (
            <UsOpenCupTab
              usOpenCup={state.usOpenCup}
              pendingRoundIndex={pendingCupRoundIndex}
              onPlayRound={handlePlayCupRound}
              userClubId={state.userClubId}
            />
          )
        )}
        {tab === "news" && <NewsTab newsFeed={state.newsFeed} />}
        {tab === "inbox" && <InboxTab club={userClub} matchday={currentMatchday ?? (state.seasonNumber > 1 ? 999 : 1)} tier={tier} managerHistory={managerHistory} setManagerHistory={setManagerHistory} difficulty={state.difficulty} jobOffer={state.jobOffer} onAcceptJobOffer={onAcceptJobOffer} onDeclineJobOffer={onDeclineJobOffer} />}
        {tab === "trophies" && <TrophyTab trophyLog={managerHistory.trophyLog} bestFinish={managerHistory.bestFinish} bestFinishUsa={managerHistory.bestFinishUsa} bestFinishEngland={managerHistory.bestFinishEngland} currentClubName={userClub.name} worldRecords={state.worldRecords} />}
      </div>

      {recap && <MatchdayRecap results={recap} userClubName={userClub.name} tier={tier} onClose={() => setRecap(null)} />}
      {cupRecap && <CupRecapModal recap={cupRecap} userClubId={state.userClubId} onClose={() => setCupRecap(null)} />}
      {rivalryRecap && <RivalryRecapModal recap={rivalryRecap} onClose={() => setRivalryRecap(null)} />}
      {windowNotice && <WindowNotice notice={windowNotice} onClose={() => setWindowNotice(null)} />}
      {renewalNotice && <RenewalNotice notice={renewalNotice} onClose={() => setRenewalNotice(null)} />}
      {infoNotice && <InfoNotice message={infoNotice} onClose={() => setInfoNotice(null)} />}
      {sackedNotice && <SackedScreen notice={sackedNotice} onContinue={onSacked} />}
      {showPayroll && <PayrollOverlay club={userClub} difficulty={state.difficulty} tierIdx={state.userTierId} tier={tier} onClose={() => setShowPayroll(false)} />}
      {showLeaveConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }} onClick={() => setShowLeaveConfirm(false)}>
          <div style={{ background: PALETTE.parchment, borderRadius: 12, maxWidth: 380, width: "100%", padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ ...display, fontSize: 18, fontWeight: 700, color: PALETTE.ink, marginBottom: 10 }}>Leave {userClub.name}?</div>
            <div style={{ ...serif, fontSize: 14, color: PALETTE.ink, lineHeight: 1.5, marginBottom: 20 }}>
              You'll look for a new job elsewhere. Your reputation decides which clubs are willing to take you on.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowLeaveConfirm(false)}
                style={{ flex: 1, padding: "10px 0", borderRadius: 6, border: `1px solid ${PALETTE.inkSoft}`, background: "none", color: PALETTE.ink, fontSize: 13, fontWeight: 600, cursor: "pointer", ...display }}
              >
                Stay
              </button>
              <button
                onClick={onLeaveClub}
                style={{ flex: 1, padding: "10px 0", borderRadius: 6, border: "none", background: PALETTE.crimson, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", ...display }}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
      {!rollover && draftPicks && draftPicks.length > 0 && (
        <DraftModal picks={draftPicks} onKeep={handleDraftKeep} onSell={handleDraftSell} />
      )}
      {rollover && (
        <RolloverModal
          events={rollover.events}
          userClubId={state.userClubId}
          userTierId={state.userTierId}
          seasonNumber={rollover.seasonNumber}
          windowResult={rollover.windowResult}
          userPrize={rollover.userPrize}
          ownershipDeposit={rollover.ownershipDeposit}
          userRetirements={rollover.userRetirements}
          userPayroll={rollover.userPayroll}
          mlsPlayoffResult={rollover.mlsPlayoffResult}
          userMlsPlayoff={rollover.userMlsPlayoff}
          uslcPlayoffResult={rollover.uslcPlayoffResult}
          userUslcPlayoff={rollover.userUslcPlayoff}
          userPromotionPlayoff={rollover.userPromotionPlayoff}
          boardNotice={rollover.boardNotice}
          userDpRevenue={rollover.userDpRevenue}
          userParachutePayment={rollover.userParachutePayment}
          usOpenCup={rollover.usOpenCup}
          faCup={rollover.faCup}
          eflCup={rollover.eflCup}
          userUsOpenCup={rollover.userUsOpenCup}
          userFaCup={rollover.userFaCup}
          userEflCup={rollover.userEflCup}
          seasonAwards={rollover.seasonAwards}
          onContinue={() => setRollover(null)}
        />
      )}
    </div>
  );
}

/* ============================================================
   ROOT APP — persistence + screen routing
   ============================================================ */

// Bump this whenever a code change reshapes the save data (new required
// fields on Club/Player, tier count changes, etc.). Old saves that don't
// match get reset instead of crashing the app on load.
const SAVE_VERSION = 2; // bumped: pre-v2 saves could have NaN budgets (from the tier-array bugs) baked in, which JSON.stringify silently turns into null — those saves need a clean reset, not a crash

// Your trophy case is a MANAGER's history, not a specific club's — it
// survives being sacked or starting a new career, so it lives in its own
// storage key rather than inside the per-club save.
function isValidSave(parsed) {
  return (
    parsed &&
    parsed.saveVersion === SAVE_VERSION &&
    Array.isArray(parsed.tiers) &&
    parsed.tiers.length === 8 &&
    typeof parsed.userClubId === "string" &&
    typeof parsed.userTierId === "number"
  );
}

export default function App() {
  const [state, setState] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [saveWasReset, setSaveWasReset] = useState(false);
  const [pendingDifficulty, setPendingDifficulty] = useState(null);
  const [pendingCountry, setPendingCountry] = useState(null);
  const [pendingLeagueTutorialSeen, setPendingLeagueTutorialSeen] = useState(false);
  const [showEnglandTest, setShowEnglandTest] = useState(false);
  // Reputation gating in ClubSelectScreen only applies when this is true —
  // a fresh career (or a full restart) should never lock you out of a
  // club just because you haven't proven yourself yet. It's earned
  // context (sacked, or voluntarily leaving) that makes reputation matter.
  const [isJobSearch, setIsJobSearch] = useState(false);
  // Distinct from state being null (a genuinely fresh game) — this shows
  // the club-picker flow while KEEPING the current world's actual state
  // (tiers, standings, cups, prize pools, other clubs' progress) intact,
  // instead of throwing all of it away and building a brand new random
  // world just because the manager needs a new club.
  const [isPickingNewClub, setIsPickingNewClub] = useState(false);
  const [managerHistory, setManagerHistory] = useState(DEFAULT_MANAGER_HISTORY);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isValidSave(parsed)) {
          setState(parsed);
        } else {
          // save exists but doesn't match what this version of the game
          // expects — don't risk crashing on a half-matching shape
          localStorage.removeItem(STORAGE_KEY);
          setSaveWasReset(true);
        }
      }
    } catch (e) {
      // corrupt/unreadable save — same treatment, start fresh
      try { localStorage.removeItem(STORAGE_KEY); } catch (e2) {}
      setSaveWasReset(true);
    }
    try {
      const rawHistory = localStorage.getItem(MANAGER_KEY);
      if (rawHistory) setManagerHistory({ ...DEFAULT_MANAGER_HISTORY, ...JSON.parse(rawHistory) });
    } catch (e) {
      // no manager history yet, or unreadable — fine, start with an empty case
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(MANAGER_KEY, JSON.stringify(managerHistory));
    } catch (e) {
      // best-effort
    }
  }, [managerHistory, loaded]);

  useEffect(() => {
    if (!loaded || !state) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, saveVersion: SAVE_VERSION }));
    } catch (e) {
      // best-effort — e.g. storage full or disabled
    }
  }, [state, loaded]);

  const handleNewGame = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      // managerHistory (trophy log, best finish, reputation) was never being
      // cleared here — it's stored under its own separate localStorage key
      // so it can persist across a sacking/job change WITHIN a career, but
      // "Reset to a new save" is meant to be a genuine fresh start, and a
      // brand-new club showing a 35-season trophy history from a save that
      // no longer exists is exactly the bug this caused.
      localStorage.removeItem(MANAGER_KEY);
    } catch (e) {}
    setState(null);
    setManagerHistory(DEFAULT_MANAGER_HISTORY);
    setPendingDifficulty(null);
    setPendingCountry(null);
    setPendingLeagueTutorialSeen(false);
    setShowEnglandTest(false);
    setIsJobSearch(false);
    setIsPickingNewClub(false);
  };

  // Getting sacked isn't the same as starting fresh — you keep your
  // difficulty mode and go straight to picking a new club, not back through
  // difficulty selection. Reputation gating turns on here: a struggling
  // manager looking for their next job has to answer for their record.
  const handleSacked = () => {
    setPendingDifficulty(state.difficulty);
    setPendingCountry(state.userTierId >= 4 ? "england" : "usa");
    setPendingLeagueTutorialSeen(true);
    setIsJobSearch(true);
    setIsPickingNewClub(true);
    setManagerHistory((prev) => ({ ...prev, managerReputation: clamp((prev.managerReputation ?? 40) - 20, 5, 99) }));
  };

  // Leaving voluntarily — same flow as being sacked (straight to club
  // select, same difficulty, reputation gating applies since it's a
  // mid-career move) but no reputation penalty, since nobody fired you.
  // Both this and getting sacked keep the actual world exactly as it was
  // — every other club's standings, cups, and progress carry over. The
  // other country was never paused either; its own season just wasn't
  // being actively simmed while you managed elsewhere, so picking a club
  // there shows whatever's already happened.
  const handleLeaveClub = () => {
    setPendingDifficulty(state.difficulty);
    setPendingCountry(state.userTierId >= 4 ? "england" : "usa");
    setPendingLeagueTutorialSeen(true);
    setIsJobSearch(true);
    setIsPickingNewClub(true);
  };

  // Accepting a job offer switches clubs directly, in place — same world,
  // same career, no trip through the club-picker screen since the whole
  // point is a club came to the manager, not the other way around.
  // Uses setState directly rather than mutateAndSave — that helper only
  // exists inside Dashboard's own component scope, not here in App, which
  // is exactly why these two silently failed (or crashed) before: they
  // were calling a function that plain didn't exist in this scope at all.
  const handleAcceptJobOffer = (clubId) => {
    setState((prev) => {
      const offer = (prev.jobOffers || []).find((o) => o.clubId === clubId);
      if (!offer) return prev;
      const tierClubs = prev.tiers[offer.tierId]?.clubs;
      const pickedClub = tierClubs?.find((c) => c.id === offer.clubId);
      // Accepting any one offer settles the whole inbox — the manager
      // took a job, every other pending offer is now moot rather than
      // still sitting there for a club that's no longer being managed by.
      if (!pickedClub) return { ...prev, jobOffers: (prev.jobOffers || []).filter((o) => o.clubId !== clubId) };
      let tiers = prev.tiers;
      if (DIFFICULTY_MODES[prev.difficulty]?.boardPressure) {
        const objective = generateBoardObjective(pickedClub.reputation, offer.tierId, tierClubs);
        tiers = prev.tiers.map((t, idx) => idx !== offer.tierId ? t : {
          ...t,
          clubs: t.clubs.map((c) => c.id === offer.clubId ? { ...c, boardObjective: objective, boardHappiness: c.boardHappiness ?? 60 } : c),
        });
      }
      return { ...prev, tiers, userTierId: offer.tierId, userClubId: offer.clubId, jobOffers: [] };
    });
  };
  const handleDeclineJobOffer = (clubId) => {
    setState((prev) => ({ ...prev, jobOffers: (prev.jobOffers || []).filter((o) => o.clubId !== clubId) }));
  };

  if (!loaded) {
    return <div style={{ minHeight: "100vh", background: PALETTE.pitchDark }} />;
  }

  // Show the tutorial before anything else for a brand-new manager — not
  // after they've already picked a difficulty and club. Skipped entirely
  // for anyone resuming an existing save.
  if (!managerHistory.hasSeenTutorial && !state) {
    return <OnboardingGuide onFinish={() => setManagerHistory((prev) => ({ ...prev, hasSeenTutorial: true }))} />;
  }

  if (isPickingNewClub) {
    if (!pendingCountry) {
      return <CountrySelectScreen onChoose={setPendingCountry} onBack={null} />;
    }
    return <ClubSelectScreen world={state.tiers} defaultCountry={pendingCountry} saveWasReset={false} difficulty={pendingDifficulty} managerReputation={managerHistory.managerReputation} managerHistory={managerHistory} isJobSearch={isJobSearch} onBack={() => setPendingCountry(null)} onResetToNewSave={handleNewGame} onPick={(tierId, clubId) => {
      handlePickNewClubWithinWorld(state, tierId, clubId, setState, setIsPickingNewClub, setIsJobSearch);
    }} />;
  }

  if (!state) {
    if (!pendingDifficulty) {
      return <DifficultySelectScreen onChoose={setPendingDifficulty} onBack={null} />;
    }
    if (!pendingCountry) {
      return <CountrySelectScreen onChoose={setPendingCountry} onBack={() => setPendingDifficulty(null)} />;
    }
    if (!pendingLeagueTutorialSeen && !managerHistory.hasSeenTutorial) {
      return <LeagueTutorialScreen country={pendingCountry} difficulty={pendingDifficulty} onContinue={() => setPendingLeagueTutorialSeen(true)} onBack={() => setPendingCountry(null)} />;
    }
    const previewWorld = buildFullWorld();
    previewWorld.forEach((t) => { t.fixtures = generateDoubleRoundRobin(t.clubs.map((c) => c.id)); });
    return <ClubSelectScreen world={previewWorld} defaultCountry={pendingCountry} saveWasReset={saveWasReset} difficulty={pendingDifficulty} managerReputation={managerHistory.managerReputation} managerHistory={managerHistory} isJobSearch={isJobSearch} onBack={() => setPendingCountry(null)} onResetToNewSave={handleNewGame} onPick={(tierId, clubId) => {
      // re-derive the same picked club/tier from a freshly built world containing it
      handlePickFromPreview(previewWorld, tierId, clubId, pendingDifficulty, setState);
    }} />;
  }

  return <Dashboard state={state} setState={setState} onNewGame={handleNewGame} onSacked={handleSacked} onLeaveClub={handleLeaveClub} managerHistory={managerHistory} setManagerHistory={setManagerHistory} onAcceptJobOffer={handleAcceptJobOffer} onDeclineJobOffer={handleDeclineJobOffer} />;
}

// Used after a sacking or a voluntary Leave Club — the world itself
// (every tier, every other club, all cups and prize pools) is exactly as
// it was; only the manager's own club identity changes. Season number,
// trophy history in managerHistory, and the rest of the pyramid's
// progress all carry straight through.
function handlePickNewClubWithinWorld(existingState, tierId, clubId, setState, setIsPickingNewClub, setIsJobSearch) {
  let tiers = existingState.tiers;
  if (DIFFICULTY_MODES[existingState.difficulty]?.boardPressure) {
    const tierClubs = tiers[tierId].clubs;
    const pickedClub = tierClubs.find((c) => c.id === clubId);
    if (pickedClub) {
      const objective = generateBoardObjective(pickedClub.reputation, tierId, tierClubs);
      tiers = tiers.map((t, idx) => idx !== tierId ? t : {
        ...t,
        clubs: t.clubs.map((c) => c.id === clubId ? { ...c, boardObjective: objective, boardHappiness: c.boardHappiness ?? 60 } : c),
      });
    }
  }
  // jobOffer is explicitly cleared here — whatever was pending belonged to
  // the OLD club context and is stale the moment the user's club changes
  // by any means. Left unset, a leftover offer object silently blocked
  // every future job offer from ever generating again (generation only
  // fires when jobOffer is null), which is exactly why offers could
  // appear to just stop happening after a sacking or a voluntary move.
  setState({ ...existingState, tiers, userTierId: tierId, userClubId: clubId, jobOffer: null });
  setIsPickingNewClub(false);
  setIsJobSearch(false);
}

function handlePickFromPreview(previewWorld, tierId, clubId, difficulty, setState) {
  let tiers = previewWorld;
  if (DIFFICULTY_MODES[difficulty]?.boardPressure) {
    const tierClubs = previewWorld[tierId].clubs;
    const pickedClub = tierClubs.find((c) => c.id === clubId);
    if (pickedClub) {
      const objective = generateBoardObjective(pickedClub.reputation, tierId, tierClubs);
      tiers = previewWorld.map((t, idx) => idx !== tierId ? t : {
        ...t,
        clubs: t.clubs.map((c) => c.id === clubId ? { ...c, boardObjective: objective, boardHappiness: c.boardHappiness ?? 60 } : c),
      });
    }
  }
  setState({
    saveVersion: SAVE_VERSION,
    difficulty,
    tiers,
    userTierId: tierId,
    userClubId: clubId,
    seasonNumber: 1,
    trophyLog: [],
    bestFinish: null,
    midWindowSeason: 0,
    prizePools: [3_000_000, 1_200_000, 500_000, 200_000, 3_000_000, 1_200_000, 500_000, 200_000],
    usOpenCup: null,
    usOpenCupQualifiers: null,
    faCup: null,
    eflCup: null,
    eflCupQualifiers: null,
    parachutePayments: null,
    playersOnLoan: [],
    userSigningsThisSeason: [],
    worldTransferLog: [],
    worldRecords: { ...DEFAULT_WORLD_RECORDS },
    jobOffer: null,
    newsFeed: [],
  });
}
