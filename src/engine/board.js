import { clamp } from "./playerGen";
import { ACADEMY_PROMOTE_MIN_AGE, ACADEMY_START_COST, BOARD_MESSAGE_FORMATIONS, DIFFICULTY_MODES, FULL_TIER_META, MIN_SQUAD_SIZE, PROMOTE_RELEGATE_COUNT } from "./constants";
import { clubLineRatings, computeTable, startingXI } from "./matchSim";

export function weakestPositionMessage(squad) {
  const positions = ["GK", "DEF", "MID", "FWD"];
  const avgByPos = {};
  positions.forEach((pos) => {
    const players = squad.filter((p) => p.position === pos);
    avgByPos[pos] = players.length ? players.reduce((s, p) => s + p.overall, 0) / players.length : 50;
  });
  const weakest = positions.reduce((a, b) => (avgByPos[a] <= avgByPos[b] ? a : b));
  const minOverall = Math.min(92, Math.round(avgByPos[weakest] + 8));
  return { position: weakest, minOverall };
}

export function generateBoardMessage(club) {
  const roll = Math.random();
  if (roll < 0.4) {
    const { position, minOverall } = weakestPositionMessage(club.squad);
    return { kind: "sign_position", position, minOverall, description: `The board wants a ${position} rated ${minOverall}+ overall signed before next season.` };
  }
  if (roll < 0.6) {
    const options = BOARD_MESSAGE_FORMATIONS.filter((f) => f !== club.tactics?.formation);
    const formation = options[Math.floor(Math.random() * options.length)] ?? BOARD_MESSAGE_FORMATIONS[0];
    return { kind: "use_formation", formation, description: `The board wants to see a ${formation} setup by the end of the season.` };
  }
  if (roll < 0.8) {
    return { kind: "youth_mode", description: "The board wants to see more academy players getting first-team minutes — switch to Youth lineup mode by the end of the season." };
  }
  const candidates = club.squad.filter((p) => p.age <= 26);
  const pool = candidates.length ? candidates : club.squad;
  const target = pool[Math.floor(Math.random() * pool.length)];
  if (!target) return null;
  return { kind: "loan_out", playerId: target.id, playerName: target.name, description: `The board wants ${target.name} out on loan for experience before next season.` };
}

export function checkBoardMessageCompliance(message, clubPre, signingsThisSeason, playersOnLoan) {
  if (message.kind === "sign_position") {
    return (signingsThisSeason || []).some((s) => s.position === message.position && s.overall >= message.minOverall);
  }
  if (message.kind === "use_formation") {
    return clubPre.tactics?.formation === message.formation;
  }
  if (message.kind === "youth_mode") {
    return clubPre.tactics?.lineupMode === "youth";
  }
  if (message.kind === "loan_out") {
    return (playersOnLoan || []).some((entry) => entry.player.id === message.playerId);
  }
  return false;
}

export function boardMessageNoticeText(message, compliant) {
  if (message.kind === "sign_position") {
    return compliant
      ? `The board is pleased you brought in a ${message.minOverall}+ overall ${message.position} as they'd asked — happiness up.`
      : `The board is unhappy you never signed the ${message.minOverall}+ overall ${message.position} they specifically asked for — happiness down.`;
  }
  if (message.kind === "use_formation") {
    return compliant
      ? `The board is pleased you brought in the ${message.formation} setup they wanted — happiness up.`
      : `The board is unhappy you never switched to the ${message.formation} setup they specifically asked for — happiness down.`;
  }
  if (message.kind === "youth_mode") {
    return compliant
      ? "The board is pleased to see academy players getting real minutes — happiness up."
      : "The board is unhappy the academy still isn't getting real first-team minutes — happiness down.";
  }
  if (message.kind === "loan_out") {
    return compliant
      ? `The board is pleased you sent ${message.playerName} out on loan as they'd asked — happiness up.`
      : `The board is unhappy ${message.playerName} never went out on loan as they'd specifically asked — happiness down.`;
  }
  return "";
}

export function generateBoardObjective(reputation, tierIdx, tierClubs, recentFinishPosition) {
  const tierSize = tierClubs.length;
  const sorted = [...tierClubs.map((c) => c.reputation)].sort((a, b) => a - b);
  const rankBelowOrEqual = sorted.filter((r) => r <= reputation).length;
  const repPercentile = tierSize > 0 ? rankBelowOrEqual / tierSize : 0.5;

  // Recent form matters too, not just reputation — reputation moves slowly
  // (season-to-season drift is mostly retained, not reset) and can end up
  // nearly uniform across a whole lower tier where every club started at
  // the same generated baseline, so its percentile alone can be almost
  // arbitrary. A club that just finished dead last shouldn't have the
  // board demanding a title regardless of what reputation says — use
  // whichever signal is more conservative.
  let percentile = repPercentile;
  if (recentFinishPosition != null && tierSize > 0) {
    const formPercentile = 1 - (recentFinishPosition - 1) / tierSize;
    percentile = Math.min(repPercentile, formPercentile);
  }

  if (percentile >= 0.85) {
    return { type: "title", description: `Win the ${FULL_TIER_META[tierIdx].name} title`, targetPosition: 1 };
  }
  if (percentile >= 0.6) {
    return { type: "top_half", description: "Finish in the top half of the table", targetPosition: Math.ceil(tierSize / 2) };
  }
  if (percentile >= 0.3) {
    return { type: "mid_table", description: "Finish mid-table, clear of any relegation trouble", targetPosition: tierSize - PROMOTE_RELEGATE_COUNT - 2 };
  }
  return { type: "avoid_relegation", description: "Avoid relegation", targetPosition: tierSize - PROMOTE_RELEGATE_COUNT };
}

export function boardHappinessDelta(objective, finishPosition, relegated, promoted, budget) {
  let delta = 0;
  if (objective) {
    // A "title" objective is the board's way of saying "get us out of this
    // division" for a lower tier with promotion on the line — actually
    // achieving promotion (whether automatic or by winning the playoff
    // from 3rd-6th) is the substance of that ambition even without
    // literally topping the table, so it counts as meeting it too. There's
    // no promotion at the very top (MLS/Premier League), so this only ever
    // applies where it should.
    const met = finishPosition <= objective.targetPosition || (objective.type === "title" && promoted);
    delta += met ? 12 : -15;
  }
  if (relegated) delta -= 25;
  if (promoted) delta += 15;
  if (budget < 0) delta -= 10;
  return delta;
}

export function jobOfferChanceFor(reputation) {
  // Bumped up (was 4%-18%) — with only one offer ever allowed pending at a
  // time before, a modest-reputation manager could go many seasons without
  // ever seeing one. Now that several can be pending at once, a higher
  // per-rollover roll means the inbox actually reflects "a manager doing
  // reasonably well attracts real interest," not "a rare lottery ticket."
  return clamp(0.08 + (reputation / 99) * 0.17, 0.08, 0.25);
}

export function generateJobOffer(tiers, userClubId, userTierId, currentClubReputation, excludeClubIds = []) {
  const excluded = new Set(excludeClubIds);
  const candidates = tiers.flatMap((t) => t.clubs
    .filter((c) => c.id !== userClubId && !excluded.has(c.id) && c.reputation >= currentClubReputation - 5)
    .map((c) => ({ club: c, tierId: t.id })));
  if (!candidates.length) return null;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    clubId: pick.club.id,
    clubName: pick.club.name,
    tierId: pick.tierId,
    reputation: pick.club.reputation,
    description: `${pick.club.name} (${FULL_TIER_META[pick.tierId].name}) have approached you about taking over as their manager.`,
  };
}

export function computeHints(club, matchday, seenOneTimeHints, recentForm, tier, clearedOneTimeHints) {
  const seen = seenOneTimeHints instanceof Set ? seenOneTimeHints : new Set(seenOneTimeHints || []);
  const cleared = clearedOneTimeHints instanceof Set ? clearedOneTimeHints : new Set(clearedOneTimeHints || []);
  const hints = [];
  // Every hint is readable and clearable now, recurring or not — they used
  // to be split (only one-time hints could be marked read/cleared), which
  // meant a genuinely recurring alert like "players want to leave" could
  // never be cleared and permanently blocked the inbox from ever reaching
  // zero unread. Recurring hints use a matchday-suffixed id so clearing
  // one only dismisses THIS check's instance — if the same problem is
  // still real on a later matchday, it resurfaces as a fresh, unread item
  // instead of staying silenced forever.
  const push = (id, text) => {
    const taggedId = `${id}@${matchday}`;
    if (cleared.has(taggedId)) return;
    hints.push({ id: taggedId, text, oneTime: false, read: seen.has(taggedId) });
  };
  // One-time hints explain a mechanic or nudge toward a feature — no
  // matchday tag, since the explanation itself doesn't go stale.
  const pushOnce = (id, text) => {
    if (cleared.has(id)) return;
    hints.push({ id, text, oneTime: true, read: seen.has(id) });
  };

  // Losing streak — tied to what's actually set right now, not a generic
  // "check the market" nudge. This is the "how do I get out of a rut"
  // answer: a concrete suggestion based on the tactics currently in use.
  const lastThree = (recentForm || []).slice(-3);
  if (lastThree.length === 3 && lastThree.every((r) => r === "L")) {
    let suggestion;
    if (club.tactics.style === "attacking") suggestion = "dialing back to a balanced or defensive style — you may be getting caught out at the back";
    else if (club.tactics.press === "high") suggestion = "dropping to a medium or low press to stay more compact";
    else suggestion = "checking the Tactics tab — the suggested setup there is based on your actual squad, not a guess";
    push("losing-streak", `You've lost your last 3 — try ${suggestion}. Also worth scouting your next opponent from the Fixtures tab before kickoff.`);
  }

  const unhappyPlayers = club.squad.filter((p) => p.transferRequested);
  if (unhappyPlayers.length > 0) {
    const names = unhappyPlayers.slice(0, 2).map((p) => p.name).join(", ");
    push("unhappy-players", `${unhappyPlayers.length === 1 ? `${names} has` : `${names}${unhappyPlayers.length > 2 ? " and others" : ""} have`} asked to leave after being left out — they're listed on the Market at a discount. Play them more or let them go.`);
  }

  const lineRatings = clubLineRatings(club);
  if (lineRatings.def > 0 && lineRatings.def < 2.5) push("thin-def", "Your defense is thin (under 2.5 stars) — check the Market's ★ Recommended tab for a defender.");
  if (lineRatings.mid > 0 && lineRatings.mid < 2.5) push("thin-mid", "Your midfield is under 2.5 stars — check the Market's ★ Recommended tab, a signing there could lift the whole team.");
  if (lineRatings.att > 0 && lineRatings.att < 2.5) push("thin-att", "Your attack is under 2.5 stars — check the Market's ★ Recommended tab, you may be short of goals.");

  const expiring = club.squad.filter((p) => p.contractYearsLeft <= 1);
  if (expiring.length > 0) {
    const names = expiring.slice(0, 3).map((p) => p.name).join(", ");
    push("expiring-contracts", `${expiring.length === 1 ? `${names}'s` : `${expiring.length} deals (${names}${expiring.length > 3 ? ", ..." : ""})`} expiring soon — renew from the Squad tab before you lose them for nothing.`);
  }

  if (club.academyStars > 0) {
    const ready = club.youthPlayers.filter((p) => p.age >= ACADEMY_PROMOTE_MIN_AGE);
    if (ready.length > 0) push("prospects-ready", `${ready.length} academy prospect${ready.length === 1 ? " is" : "s are"} old enough to promote to the first team.`);
    if (club.academyStars < 5) pushOnce("academy-invest-tip", `Your academy is ${club.academyStars}-star — investing further would speed up development and raise the ceiling on new prospects.`);
  }
  if (club.academyEligible && club.academyStars === 0 && club.budget >= ACADEMY_START_COST) {
    pushOnce("academy-eligible-tip", "You're eligible to start an academy and can afford it — a long-term investment in your own talent pipeline.");
  }
  if (!club.academyEligible && club.tryoutCandidates.length === 0) {
    push("host-tryouts", "Consider hosting open tryouts — cheap, and every so often turns up a player better than your level.");
  }

  const xi = startingXI(club, matchday);
  if (xi.length < 11) push("short-xi", `You can only field ${xi.length} — injuries or suspensions are biting into your lineup.`);

  if (club.squad.length < MIN_SQUAD_SIZE) push("thin-squad", `Your squad is thin (under ${MIN_SQUAD_SIZE} players) — a long season could leave you short.`);

  if (club.budget < 300_000) push("low-budget", "Budget is very low — selling a listed player or two could ease the pressure.");

  const captain = club.squad.find((p) => p.id === club.captainId);
  if (captain && captain.leadership < 55) push("weak-captain", `Your captain (${captain.name}) has modest leadership (${captain.leadership}) — a more natural leader in your XI might lift team chemistry.`);

  // "Weakest line" used to fire unconditionally on every single check,
  // which meant the inbox could never actually reach "all read" — Read
  // All has nothing to mark it read WITH, since it's not a one-time hint,
  // it's a live status fact. Now it only shows as the genuine fallback
  // when nothing else recurring is already flagging something — same
  // spirit as its original comment ("stays relevant even when nothing
  // above fired"), just actually behaving that way now.
  const recurringSoFar = hints.filter((h) => !h.oneTime).length;
  if (recurringSoFar === 0) {
    const weakest = ["def", "mid", "att"].reduce((a, b) => (lineRatings[a] <= lineRatings[b] ? a : b));
    const weakestLabel = { def: "defense", mid: "midfield", att: "attack" }[weakest];
    push("weakest-line", `Your ${weakestLabel} is your weakest line (${lineRatings[weakest]}★) — the Market's ★ Recommended tab is worth a scan even if nothing's urgent there.`);
  }

  if (club.tactics.lineupMode === "best") {
    pushOnce("lineup-mode-tip", "You're on Best XI — switching to Auto occasionally keeps players fresher, or try Youth to develop your prospects faster.");
  }

  return hints;
}

export function computeInboxUrgentCount(club, matchday, tier, seenOneTimeHints, difficulty, clearedOneTimeHints, hasJobOffer) {
  const recentForm = tier ? (computeTable(tier).find((r) => r.clubId === club.id)?.form.slice(-5) ?? []) : [];
  const hints = computeHints(club, matchday, seenOneTimeHints, recentForm, tier, clearedOneTimeHints);
  const hasBoardMessage = DIFFICULTY_MODES[difficulty]?.boardMessages && club.boardMessage;
  const unreadHints = hints.filter((h) => !h.read).length;
  return unreadHints + (hasBoardMessage ? 1 : 0) + (hasJobOffer ? 1 : 0);
}
