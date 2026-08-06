import { choice, clamp } from "./playerGen";
import { AI_TRANSFER_ATTEMPTS_PER_TIER, DEFAULT_WORLD_RECORDS, DIFFICULTY_MODES, DISQUALIFICATION_FUNDING_PER_PLAYER, DP_REVENUE_PER_OVERALL, FULL_TIER_META, MAX_DESIGNATED_PLAYERS, MAX_SQUAD_SIZE, MIN_PRIZE_POOL, MIN_SQUAD_SIZE, MLS_SALARY_CAP, OWNERSHIP_DEPOSIT, OWNERSHIP_DEPOSIT_WAGED, PRIZE_DECAY, PRIZE_SHARE, SEASON_BONUS } from "./constants";

export function distributePrizeMoney(table, poolAmount) {
  const n = table.length;
  const amounts = {};
  const midCount = Math.min(7, Math.max(0, n - 3));
  const restCount = Math.max(0, n - 3 - midCount);
  const midEach = midCount > 0 ? Math.round((poolAmount * PRIZE_SHARE.midBand) / midCount) : 0;
  const restEach = restCount > 0 ? Math.round((poolAmount * PRIZE_SHARE.restBand) / restCount) : 0;
  table.forEach((row, i) => {
    let amt;
    if (i === 0) amt = Math.round(poolAmount * PRIZE_SHARE.first);
    else if (i === 1) amt = Math.round(poolAmount * PRIZE_SHARE.second);
    else if (i === 2) amt = Math.round(poolAmount * PRIZE_SHARE.third);
    else if (i < 3 + midCount) amt = midEach;
    else amt = restEach;
    amounts[row.clubId] = amt;
  });
  return amounts;
}

export function computeEventBonuses(table, tierIdx) {
  const cfg = SEASON_BONUS[tierIdx];
  const amounts = {};
  table.forEach((row, i) => {
    let amt;
    if (i === 0) amt = cfg.champion;
    else if (i === 1) amt = cfg.runnerUp;
    else if (i < 8) amt = cfg.midBand;
    else amt = cfg.rest;
    amounts[row.clubId] = amt;
  });
  return amounts;
}

export function decayPrizePools(prizePools) {
  const decayed = prizePools.map((p, i) => Math.max(MIN_PRIZE_POOL[i], Math.round(p * PRIZE_DECAY)));
  for (let i = decayed.length - 2; i >= 0; i--) {
    decayed[i] = Math.max(decayed[i], decayed[i + 1]);
  }
  return decayed;
}

export function applyDisqualificationCheck(club, tierIdx) {
  const short = MIN_SQUAD_SIZE - club.squad.length;
  if (short > 0) {
    if (club.disqualified) return { club, notice: null }; // already flagged, no repeat payout
    // Deeper in debt (or already thin on funds) gets proportionally more —
    // a well-funded club just needs the transfer money, a broke one needs
    // real help to climb back to a legal roster.
    const financialMultiplier = club.budget < 0 ? 1.6 : club.budget < 1_000_000 ? 1.25 : 1.0;
    const funding = Math.round(short * DISQUALIFICATION_FUNDING_PER_PLAYER[tierIdx] * financialMultiplier);
    return {
      club: { ...club, disqualified: true, budget: club.budget + funding },
      notice: { clubName: club.name, short, funding, resolved: false },
    };
  }
  if (club.disqualified) {
    return { club: { ...club, disqualified: false }, notice: { clubName: club.name, resolved: true } };
  }
  return { club, notice: null };
}

export function trimSquad(squad) {
  if (squad.length <= MAX_SQUAD_SIZE) return squad;
  const scored = squad.map((p) => ({ p, score: p.overall + p.potential * 0.2 - p.age * 0.3 }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, MAX_SQUAD_SIZE).map((s) => s.p);
}

export function stableUnitFromString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000; // 0..1
}

export function ownershipDepositFor(tierIdx, difficulty, club, tierClubs) {
  const base = DIFFICULTY_MODES[difficulty]?.wagesDeducted ? OWNERSHIP_DEPOSIT_WAGED[tierIdx] : OWNERSHIP_DEPOSIT[tierIdx];
  if (!club) return base; // generic per-tier figure when no specific club is in play (e.g. the funds preview on Club Select)
  // Reputation-driven scaling is the dominant factor now — real club
  // wealth correlates strongly with standing, and the old formula's flat
  // ±10% noise term plus a weak, absolute reputation>60 threshold let a
  // mid-table club randomly out-earn a genuine superclub (reported: a
  // 72-overall side with more funding than Liverpool or Man City). Uses
  // percentile within the TIER'S OWN reputation spread rather than a
  // fixed absolute threshold, so the same shape works at any tier
  // regardless of that tier's actual reputation range.
  let percentile = 0.5;
  if (tierClubs && tierClubs.length > 1) {
    const reps = tierClubs.map((c) => c.reputation ?? 60);
    const lo = Math.min(...reps), hi = Math.max(...reps);
    percentile = hi > lo ? ((club.reputation ?? 60) - lo) / (hi - lo) : 0.5;
  }
  // 0.55x at the very bottom of the tier's reputation spread, up to 2.2x
  // at the very top — a real, meaningful spread rather than a nudge.
  let multiplier = 0.55 + percentile * 1.65;
  const noise = (stableUnitFromString(club.id) - 0.5) * 0.08; // ±4% texture only, no longer strong enough to override the reputation signal
  multiplier += noise;
  // The true handful of superclubs (top 2 by reputation) get an extra
  // step on top of the smooth curve — Man City/Real Madrid-tier money,
  // a step change rather than just "a bit more than 3rd place."
  if (tierClubs && tierClubs.length > 3) {
    const ranked = [...tierClubs].sort((a, b) => (b.reputation - a.reputation) || (a.id < b.id ? -1 : 1));
    const rank = ranked.findIndex((c) => c.id === club.id);
    if (rank === 0) multiplier *= 1.2;
    else if (rank === 1) multiplier *= 1.1;
  }
  return Math.round(base * Math.max(0.4, multiplier));
}

export function effectivePayroll(squad, designatedPlayerIds) {
  const dpSet = new Set(designatedPlayerIds || []);
  return squad.reduce((s, p) => s + (dpSet.has(p.id) ? Math.min(p.wage, 200_000) : p.wage), 0);
}

export function dpRevenueForClub(club) {
  const dpSet = new Set(club.designatedPlayerIds || []);
  if (dpSet.size === 0) return 0;
  return club.squad.filter((p) => dpSet.has(p.id)).reduce((s, p) => s + p.overall * DP_REVENUE_PER_OVERALL, 0);
}

export function marketValue(p) {
  // Recalibrated again after feedback that even the previous rebalance
  // still undervalued elite players — target points now: a 75 overall
  // established player should land around $7M, a 90 overall around
  // $80-120M. Steeper growth curve to hit both ends correctly.
  const base = 11.26 * Math.pow(1.194, p.overall);
  let ageFactor = p.age <= 23 ? 1.5 : p.age <= 26 ? 1.2 : p.age <= 29 ? 1.0 : p.age <= 32 ? 0.55 : 0.25;
  // true megastars keep real commercial/marquee value even late in their
  // career — an aging legend doesn't collapse to bench-player money
  if (p.overall >= 85) ageFactor = Math.max(ageFactor, 0.6);
  // Wonderkid premium: a real gap to potential is worth far more than a
  // small linear bump, and matters more the younger the player is (more
  // years of runway to actually get there, more resale value ahead) — real
  // transfer markets often price a teenage wonderkid above an established
  // veteran at the same current overall for exactly this reason.
  const gap = p.potential - p.overall;
  const youthBonus = p.age <= 21 ? 1.4 : p.age <= 23 ? 1.15 : 1.0;
  const potFactor = 1 + gap * 0.09 * youthBonus;
  // form: we don't track a separate running form stat, but morale already
  // reflects recent results for this exact player, so it doubles as one
  const formFactor = 0.85 + (p.morale / 100) * 0.3;
  const raw = base * ageFactor * potFactor * formFactor;
  return Math.min(280_000_000, Math.round(raw / 1000) * 1000);
}

export function computeRecommendationScore(player, userClub, difficulty, tierIdx, tierClubs) {
  // Roster's already full — there's no realistic recommendation here at
  // all until someone's sold or released first.
  if (userClub.squad.length >= MAX_SQUAD_SIZE) return -Infinity;

  const squadAtPos = userClub.squad.filter((p) => p.position === player.position);
  const avgAtPos = squadAtPos.length ? squadAtPos.reduce((s, p) => s + p.overall, 0) / squadAtPos.length : 0;
  const bestAtPos = squadAtPos.length ? Math.max(...squadAtPos.map((p) => p.overall)) : 0;
  const depthCount = squadAtPos.length;
  const expiringCount = squadAtPos.filter((p) => p.contractYearsLeft <= 1).length;

  // Hard quality floor: extreme "need" (a razor-thin or weak position)
  // could previously push a genuinely bad player's score positive purely
  // off desperation, even for an MLS club — a 35-45 overall signing is
  // never actually a recommendation regardless of how thin the position
  // is. Two independent floors: never far below what's normal for the
  // club's own tier, and never a clear downgrade from what's already
  // rostered there (unless the position is empty, a true emergency).
  const tierFloor = FULL_TIER_META[tierIdx].baseRating - 15;
  if (player.overall < tierFloor) return -Infinity;
  if (depthCount > 0 && player.overall < avgAtPos - 10) return -Infinity;

  // Need: a weak, thin, or soon-to-be-depleted position group is a bigger
  // priority than topping up a position that's already deep and strong.
  // A squad only ever needs ~2 keepers, never the 4 that makes sense as a
  // depth target for outfield lines — without this split, every listed GK
  // registered as "thin" and flooded the recommendations.
  const idealDepth = player.position === "GK" ? 2 : 4;
  let needScore = 0;
  needScore += Math.max(0, 60 - avgAtPos) * 0.6;
  needScore += Math.max(0, idealDepth - depthCount) * 8;
  needScore += expiringCount * 10;

  // Upgrade: how much better is this player than the best you've already got there
  const upgrade = player.overall - bestAtPos;
  const upgradeScore = clamp(upgrade * 3, -30, 40);

  // Age: some preference for players who fit a normal development
  // timeline; an older signing needs to be a clear upgrade to justify itself
  let ageScore = 0;
  if (player.age <= 26) ageScore += 6;
  else if (player.age >= 31 && upgrade < 8) ageScore -= 10;

  // Afford it at all? Transfer fee first — if not, this isn't a real
  // recommendation regardless of how good a fit it looks on paper.
  if (userClub.budget < player.askingPrice) return -Infinity;

  // Wage affordability: genuinely blowing the MLS hard salary cap (with no
  // open DP slot to shield it) is a real rule, so that's still a hard
  // exclusion — you literally cannot complete that signing. Financial
  // strain is a steep score penalty rather than a block, and the Market's
  // Buy button asks for confirmation before actually completing a
  // financially risky signing. "Remaining room" now includes the
  // guaranteed ownership deposit for next season, same as the Payroll
  // modal already shows — comparing only current budget against payroll
  // (ignoring the deposit that's coming regardless) meant this flagged a
  // signing as risky even when the club was clearly projected to be in
  // the green, which didn't match what the Payroll modal itself said.
  let financeScore = 10;
  if (DIFFICULTY_MODES[difficulty]?.wagesDeducted) {
    const currentPayroll = effectivePayroll(userClub.squad, userClub.designatedPlayerIds);
    const isDpEligible = tierIdx === 0 && DIFFICULTY_MODES[difficulty]?.dps && (userClub.designatedPlayerIds || []).length < MAX_DESIGNATED_PLAYERS;
    const capRoom = tierIdx === 0 ? MLS_SALARY_CAP - currentPayroll : Infinity;
    if (!isDpEligible && player.wage > capRoom) return -Infinity; // would blow the MLS cap outright, and can't be shielded as a DP
    const deposit = tierClubs ? ownershipDepositFor(tierIdx, difficulty, userClub, tierClubs) : 0;
    const remainingRoom = userClub.budget + deposit - currentPayroll;
    if (player.wage > 0 && remainingRoom <= 0) financeScore -= 30;
    else if (player.wage > remainingRoom * 0.9) financeScore -= 18;
    const wageShare = player.wage / Math.max(remainingRoom, 1);
    financeScore -= clamp(wageShare * 15, 0, 20);
  }

  // A single signing eating a large share of the transfer budget crowds out
  // every other move that season — even when technically affordable,
  // recommending it as a top pick reads as bad advice ($40-50M out of an
  // $80M budget, for instance) since it leaves nothing for anything else.
  // Applies to every squad now, not just a short-staffed one — a big-ticket
  // option is still reachable by manually sorting by Rating or Price, this
  // only affects what actually gets pushed as a smart use of the budget.
  // Threshold loosened (0.35→0.45) and the penalty softened after the
  // market-value rebalance — a genuinely elite upgrade can legitimately
  // cost well over a third of even a large budget, and that shouldn't
  // automatically bury it under a wall of cheap depth signings.
  if (userClub.budget > 0) {
    const priceShare = player.askingPrice / userClub.budget;
    if (priceShare > 0.45) financeScore -= clamp((priceShare - 0.45) * 65, 0, 35);
  }

  // A squad genuinely below the minimum needed to field a full team has an
  // even sharper reason to prioritize cheap depth over one marquee name —
  // stacks on top of the general budget-share penalty above.
  if (userClub.squad.length < MIN_SQUAD_SIZE && userClub.budget > 0) {
    const priceShare = player.askingPrice / userClub.budget;
    if (priceShare > 0.5) financeScore -= clamp((priceShare - 0.5) * 30, 0, 25);
  }

  return needScore + upgradeScore + ageScore + financeScore;
}

export function isFinanciallyRisky(player, userClub, difficulty, tierIdx, tierClubs) {
  if (!DIFFICULTY_MODES[difficulty]?.wagesDeducted) return false;
  const currentPayroll = effectivePayroll(userClub.squad, userClub.designatedPlayerIds);
  const deposit = (tierClubs && tierIdx != null) ? ownershipDepositFor(tierIdx, difficulty, userClub, tierClubs) : 0;
  const remainingRoom = userClub.budget + deposit - currentPayroll;
  if (player.wage > 0 && remainingRoom <= 0) return true;
  if (player.wage > remainingRoom * 0.9) return true;
  return false;
}

export function recommendationReason(player, userClub, xi) {
  const squadAtPos = userClub.squad.filter((p) => p.position === player.position);
  const bestAtPos = squadAtPos.length ? Math.max(...squadAtPos.map((p) => p.overall)) : 0;
  const depthCount = squadAtPos.length;
  const upgrade = player.overall - bestAtPos;
  const reasons = [];
  if (depthCount === 0) reasons.push(`no ${player.position} on your roster right now`);
  else if (depthCount <= 2) reasons.push(`thin at ${player.position} (${depthCount} on roster)`);

  // Prioritize naming an actual STARTER this would replace — that's a far
  // more actionable, concrete signal than just "your weakest bench player
  // at this position," which might not even be someone you're playing.
  const startersAtPos = (xi || []).filter((p) => p.position === player.position);
  const weakestStarter = startersAtPos.length ? [...startersAtPos].sort((a, b) => a.overall - b.overall)[0] : null;
  const weakestAtPos = squadAtPos.length ? [...squadAtPos].sort((a, b) => a.overall - b.overall)[0] : null;

  if (weakestStarter && player.overall > weakestStarter.overall + 3) {
    reasons.push(`would replace ${weakestStarter.name} in your starting XI (${weakestStarter.overall} OVR)`);
  } else if (weakestAtPos && player.overall > weakestAtPos.overall + 3) {
    reasons.push(`would replace ${weakestAtPos.name} (${weakestAtPos.overall} OVR)`);
  } else if (upgrade > 5) {
    reasons.push(`+${upgrade} OVR upgrade`);
  } else if (upgrade > 0) {
    reasons.push("modest upgrade");
  }
  if (player.age <= 23) reasons.push(`age ${player.age}, room to grow`);
  return reasons.length ? reasons.join(" · ") : "solid depth option";
}

export function renewalOutcome(p, budget) {
  if (p.morale < 20) {
    return { accepted: false, reason: "too unhappy to even discuss an extension right now" };
  }
  const baseCost = Math.round(marketValue(p) * 0.06);
  let moraleFactor;
  if (p.morale >= 70) moraleFactor = 1.0;
  else if (p.morale >= 50) moraleFactor = 1.2;
  else if (p.morale >= 30) moraleFactor = 1.6;
  else moraleFactor = 2.0;
  const cost = Math.round(baseCost * moraleFactor);
  if (budget < cost) {
    return { accepted: false, reason: "you can't afford the deal they're asking for", cost };
  }
  return { accepted: true, cost };
}

export function listingChance(rankAmongSquad) {
  // A club's outright best player still rarely gets listed (real clubs
  // protect their star), but the first bump (1%→2.5%) still wasn't
  // producing enough visible elite talent in practice — raised again.
  if (rankAmongSquad === 0 || rankAmongSquad === 1) return 0.05;
  if (rankAmongSquad === 2) return 0.1;
  return 0.18;
}

export function runTransferWindow(tiers, userClubId) {
  let listedCount = 0, transferCount = 0;
  const transferLog = [];
  tiers.forEach((t) => {
    t.clubs.forEach((club) => {
      if (club.id === userClubId) return;
      const byRank = [...club.squad].sort((a, b) => b.overall - a.overall);
      byRank.forEach((p, rank) => {
        if (!p.transferListed && Math.random() < listingChance(rank)) {
          p.transferListed = true;
          p.askingPrice = Math.round(marketValue(p) * (1 + Math.random() * 0.3));
          listedCount++;
        }
      });
    });
    t.clubs.forEach((seller) => {
      // The user's own listed players used to be skipped here entirely —
      // AI would only ever consider buying them through the much slower
      // in-season 8% roll, which is why listings could sit for 3-4 seasons.
      // They're included now, and weighted higher: a real market moves
      // faster on a known-available listing during an actual transfer
      // window than it does on a random Tuesday mid-season.
      const isUserSeller = seller.id === userClubId;
      const listedNow = seller.squad.filter((p) => p.transferListed);
      listedNow.forEach((p) => {
        // A player auto-listed from unhappiness (transferRequested) isn't
        // something the user necessarily chose to sell — that's still the
        // user's call ("play them more or let them go"), so it moves at a
        // normal market pace instead of the fast rate meant for a
        // deliberate voluntary listing. Otherwise several unhappy players
        // could get sold off in a single bulk sim with no real say from
        // the user, suddenly gutting the squad below the minimum.
        const buyChance = isUserSeller ? (p.transferRequested ? 0.2 : 0.6) : 0.35;
        if (Math.random() >= buyChance) return;
        const buyers = t.clubs.filter((c) => c.id !== seller.id && c.id !== userClubId && c.budget >= p.askingPrice && c.squad.length < MAX_SQUAD_SIZE);
        if (!buyers.length) return;
        const buyer = choice(buyers);
        const fee = p.askingPrice; // capture before it gets nulled out below — reading it after always came out $0
        buyer.budget -= fee;
        seller.budget += fee;
        p.transferListed = false;
        p.askingPrice = null;
        p.benchStreak = 0;
        p.transferRequested = false;
        seller.squad = seller.squad.filter((sp) => sp.id !== p.id);
        if (seller.designatedPlayerIds?.includes(p.id)) {
          seller.designatedPlayerIds = seller.designatedPlayerIds.filter((id) => id !== p.id);
        }
        buyer.squad.push(p);
        transferCount++;
        // Only AI-to-AI moves (not the user buying/selling) are genuinely
        // "the world moving on its own" — the user already knows about
        // their own transfers, so those don't need a news headline.
        if (!isUserSeller) {
          transferLog.push({ tierId: t.id, playerName: p.name, position: p.position, overall: p.overall, fee, buyerName: buyer.name, sellerName: seller.name });
        }
      });
    });
  });
  return { listedCount, transferCount, transferLog };
}

export function runAiToAiTransfers(tiers, userClubId) {
  const log = [];
  tiers.forEach((tier) => {
    for (let attempt = 0; attempt < AI_TRANSFER_ATTEMPTS_PER_TIER; attempt++) {
      const buyerPool = tier.clubs.filter((c) => c.id !== userClubId && c.squad.length < MAX_SQUAD_SIZE && c.budget > 0);
      if (!buyerPool.length) continue;
      const buyer = buyerPool[Math.floor(Math.random() * buyerPool.length)];

      const positions = ["GK", "DEF", "MID", "FWD"];
      const avgByPos = {};
      positions.forEach((pos) => {
        const players = buyer.squad.filter((p) => p.position === pos);
        avgByPos[pos] = players.length ? players.reduce((s, p) => s + p.overall, 0) / players.length : 50;
      });
      const weakest = positions.reduce((a, b) => (avgByPos[a] <= avgByPos[b] ? a : b));

      const candidates = [];
      tier.clubs.forEach((seller) => {
        if (seller.id === buyer.id || seller.id === userClubId) return;
        if (seller.squad.length <= MIN_SQUAD_SIZE + 2) return; // never gut a seller below a real squad
        seller.squad.forEach((p) => {
          if (p.position !== weakest) return;
          if (p.overall < avgByPos[weakest] + 5) return; // must be a real upgrade, not a lateral move
          candidates.push({ player: p, seller });
        });
      });
      if (!candidates.length) continue;

      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      const fee = Math.round(marketValue(pick.player) * (0.85 + Math.random() * 0.3));
      if (buyer.budget < fee) continue;

      buyer.budget -= fee;
      pick.seller.budget += fee;
      pick.seller.squad = pick.seller.squad.filter((p) => p.id !== pick.player.id);
      buyer.squad = [...buyer.squad, pick.player];
      log.push({
        tierId: tier.id,
        playerName: pick.player.name,
        position: pick.player.position,
        overall: pick.player.overall,
        fee,
        buyerName: buyer.name,
        sellerName: pick.seller.name,
      });
    }
  });
  return log;
}

export function checkTransferRecord(next, playerName, fee, fromClub, toClub, seasonNumber) {
  if (!next.worldRecords) next.worldRecords = { ...DEFAULT_WORLD_RECORDS };
  if (!next.newsFeed) next.newsFeed = [];
  const current = next.worldRecords.biggestTransfer;
  if (!current || fee > current.fee) {
    next.worldRecords.biggestTransfer = { playerName, fee, fromClub, toClub, season: seasonNumber };
    next.newsFeed = [{ season: seasonNumber, headline: `💰 Record fee: ${toClub} sign ${playerName} from ${fromClub} for $${fee.toLocaleString()} — the biggest transfer on record.`, category: "record" }, ...next.newsFeed].slice(0, 40);
  }
}
