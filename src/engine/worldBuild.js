import { CHAMPIONSHIP_CLUBS, ENGLAND_ROSTERS, FICTIONAL_CLUB_NAMES, LEAGUE_ONE_CLUBS, LEAGUE_TWO_CLUBS, MLS_ROSTERS, PREMIER_LEAGUE_CLUBS, USL_CHAMPIONSHIP_TEAMS, USL_LEAGUE_ONE_TEAMS, USL_LEAGUE_TWO_TEAMS } from "../data/rosters";
import { findEnglandRealRoster, generateAcademyProspect, generateDraftProspect, generateFictionalSquad, makeClub, randInt, realPlayerToRuntime } from "./playerGen";
import { ACADEMY_STAR_THRESHOLDS, DRAFT_PHASES, ENGLAND_TIER_META, TARGET_TIER_SIZE, TIER_META } from "./constants";
import { ensureMlsConferences, generateDoubleRoundRobin, initialMlsConference } from "./leagueSim";

export function buildEnglandWorld(sharedUsedNames, tierIdOffset = 0) {
  const usedNames = sharedUsedNames || new Set();
  Object.values(ENGLAND_ROSTERS).forEach((team) => team.players.forEach((p) => usedNames.add(p.name)));

  const plClubs = PREMIER_LEAGUE_CLUBS.map((name) => {
    const players = findEnglandRealRoster(name);
    return makeClub({
      name,
      squad: players.map((p) => realPlayerToRuntime(p, tierIdOffset + 0)),
      isReal: true,
      budget: randInt(80_000_000, 300_000_000),
      academyEligible: true,
    });
  });
  const champClubs = CHAMPIONSHIP_CLUBS.map((name) => {
    const players = findEnglandRealRoster(name);
    return makeClub({
      name,
      squad: players.map((p) => realPlayerToRuntime(p, tierIdOffset + 1)),
      isReal: true,
      budget: randInt(8_000_000, 50_000_000),
      academyEligible: true,
    });
  });
  const l1Clubs = LEAGUE_ONE_CLUBS.map((name) =>
    makeClub({
      name,
      squad: generateFictionalSquad(ENGLAND_TIER_META[2].baseRating, 8, usedNames, 6),
      isReal: false,
      budget: randInt(1_500_000, 6_000_000),
      academyEligible: true,
    })
  );
  const l2Clubs = LEAGUE_TWO_CLUBS.map((name) =>
    makeClub({
      name,
      squad: generateFictionalSquad(ENGLAND_TIER_META[3].baseRating, 8, usedNames, 7),
      isReal: false,
      budget: randInt(300_000, 1_500_000),
      academyEligible: false,
    })
  );
  // Premier League and Championship clubs already run established academies
  // from day one (the real English academy system runs deep) — same
  // founding-club treatment MLS clubs get. League One academies are real
  // but more modest, so they start smaller/sometimes not yet built. Star
  // rating is tied to each club's actual squad quality (real data for PL/
  // Championship) rather than pure randomness, so a stronger real club
  // reliably gets a stronger-rated academy, not an arbitrary roll. 5-star
  // academies are genuinely rare — at most the top 2 clubs in the entire
  // world, matching how few clubs run a truly elite academy in reality.
  const avgOvr = (c) => c.squad.reduce((s, p) => s + p.overall, 0) / c.squad.length;
  // cutoffs: [{count, stars}, ...] — top `count` ranked clubs get `stars`,
  // remaining clubs get the last entry's stars.
  const rankByCutoffs = (clubs, cutoffs) => {
    const sorted = [...clubs].sort((a, b) => avgOvr(b) - avgOvr(a));
    const starById = {};
    let idx = 0;
    for (const { count, stars } of cutoffs) {
      for (let i = 0; i < count && idx < sorted.length; i++, idx++) starById[sorted[idx].id] = stars;
    }
    while (idx < sorted.length) { starById[sorted[idx].id] = cutoffs[cutoffs.length - 1].stars; idx++; }
    return starById;
  };
  const plStars = rankByCutoffs(plClubs, [
    { count: 2, stars: 5 }, // the very best — max 2 in the whole world
    { count: 6, stars: 4 },
    { count: 12, stars: 3 },
  ]);
  plClubs.forEach((c) => {
    c.academyStars = plStars[c.id];
    c.academyInvested = ACADEMY_STAR_THRESHOLDS[c.academyStars];
    c.youthPlayers = Array.from({ length: randInt(3, 5) }, () => generateAcademyProspect(c.academyStars));
  });
  const champStars = rankByCutoffs(champClubs, [
    { count: 3, stars: 4 },
    { count: 8, stars: 3 },
    { count: 13, stars: 2 },
  ]);
  champClubs.forEach((c) => {
    c.academyStars = champStars[c.id];
    c.academyInvested = ACADEMY_STAR_THRESHOLDS[c.academyStars];
    c.youthPlayers = Array.from({ length: randInt(2, 4) }, () => generateAcademyProspect(c.academyStars));
  });
  const l1Stars = rankByCutoffs(l1Clubs, [
    { count: 6, stars: 2 },
    { count: 9, stars: 1 },
    { count: 9, stars: 0 },
  ]);
  l1Clubs.forEach((c) => {
    c.academyStars = l1Stars[c.id];
    c.academyInvested = ACADEMY_STAR_THRESHOLDS[c.academyStars];
    if (c.academyStars > 0) c.youthPlayers = Array.from({ length: randInt(1, 3) }, () => generateAcademyProspect(c.academyStars));
  });

  const tiers = [
    { id: tierIdOffset + 0, name: ENGLAND_TIER_META[0].name, clubs: plClubs, fixtures: [] },
    { id: tierIdOffset + 1, name: ENGLAND_TIER_META[1].name, clubs: champClubs, fixtures: [] },
    { id: tierIdOffset + 2, name: ENGLAND_TIER_META[2].name, clubs: l1Clubs, fixtures: [] },
    { id: tierIdOffset + 3, name: ENGLAND_TIER_META[3].name, clubs: l2Clubs, fixtures: [] },
  ];
  tiers.forEach((t) => {
    t.fixtures = generateDoubleRoundRobin(t.clubs.map((c) => c.id));
  });
  return tiers;
}

export function buildFullWorld() {
  const usedNames = new Set();
  const usaTiers = buildInitialWorld(usedNames);
  const englandTiers = buildEnglandWorld(usedNames, 4);
  return [...usaTiers, ...englandTiers];
}

export function buildInitialWorld(sharedUsedNames) {
  let nameIdx = 0;
  const nextFictionalName = () => FICTIONAL_CLUB_NAMES[nameIdx++ % FICTIONAL_CLUB_NAMES.length];
  const usedNames = sharedUsedNames || new Set(); // shared across the whole world so no two players share a name

  // Tier 0: MLS — real rosters + fictional filler to reach TARGET_TIER_SIZE
  const realSlugs = Object.keys(MLS_ROSTERS);
  const mlsClubs = realSlugs.map((slug) => {
    const team = MLS_ROSTERS[slug];
    team.players.forEach((p) => usedNames.add(p.name));
    return makeClub({
      name: team.name,
      squad: team.players.map((p) => realPlayerToRuntime(p, 0)),
      isReal: true,
      budget: randInt(8_000_000, 18_000_000),
      academyEligible: true,
    });
  });
  while (mlsClubs.length < TARGET_TIER_SIZE) {
    mlsClubs.push(
      makeClub({
        name: `${nextFictionalName()} (Expansion)`,
        squad: generateFictionalSquad(TIER_META[0].baseRating, 8, usedNames, 0),
        isReal: false,
        budget: randInt(6_000_000, 12_000_000),
        academyEligible: true,
      })
    );
  }
  // Founding MLS clubs start with an already-established academy — a perk
  // of being top-flight from day one. A club that gets promoted into MLS
  // later doesn't get this for free; they have to build their own.
  mlsClubs.forEach((c) => {
    c.academyStars = randInt(2, 3);
    c.academyInvested = ACADEMY_STAR_THRESHOLDS[c.academyStars];
    c.conference = initialMlsConference(c.name);
    // An already-established academy comes with an already-established
    // crop of prospects, not an empty pipeline you have to build from
    // scratch on day one.
    const startingCount = randInt(3, 5);
    c.youthPlayers = Array.from({ length: startingCount }, () => generateAcademyProspect(c.academyStars));
  });
  ensureMlsConferences(mlsClubs); // balances any expansion filler clubs that aren't real East/West members

  // Tier 1: USL Championship — real clubs, generated rosters
  const uslcClubs = USL_CHAMPIONSHIP_TEAMS.map((name) =>
    makeClub({
      name,
      squad: generateFictionalSquad(TIER_META[1].baseRating, 8, usedNames, 1),
      isReal: false,
      budget: randInt(1_500_000, 4_000_000),
      academyEligible: true,
    })
  );

  // Tier 2: USL League One — real clubs, generated rosters (no academies —
  // these clubs run open tryouts instead)
  const usl1Clubs = USL_LEAGUE_ONE_TEAMS.map((name) =>
    makeClub({
      name,
      squad: generateFictionalSquad(TIER_META[2].baseRating, 8, usedNames, 2),
      isReal: false,
      budget: randInt(600_000, 1_800_000),
    })
  );

  // Tier 3: USL League Two — real clubs (representative sample), generated rosters
  const usl2Clubs = USL_LEAGUE_TWO_TEAMS.map((name) =>
    makeClub({
      name,
      squad: generateFictionalSquad(TIER_META[3].baseRating, 8, usedNames, 3),
      isReal: false,
      budget: randInt(150_000, 500_000),
    })
  );

  return [
    { id: 0, name: TIER_META[0].name, clubs: mlsClubs, fixtures: [] },
    { id: 1, name: TIER_META[1].name, clubs: uslcClubs, fixtures: [] },
    { id: 2, name: TIER_META[2].name, clubs: usl1Clubs, fixtures: [] },
    { id: 3, name: TIER_META[3].name, clubs: usl2Clubs, fixtures: [] },
  ];
}

export function runDraft(tables, newTiers, userClubId) {
  const clubsByIdInNewTiers = {};
  newTiers.forEach((t) => t.clubs.forEach((c) => (clubsByIdInNewTiers[c.id] = c)));
  const userPicks = [];

  DRAFT_PHASES.forEach(({ tierIdx, rounds }) => {
    const order = [...tables[tierIdx]].reverse().map((r) => r.clubId); // worst finisher first
    const baseRating = TIER_META[tierIdx].baseRating + 6; // draft prospects skew a bit above replacement level
    for (let round = 0; round < rounds; round++) {
      order.forEach((clubId, posInRound) => {
        const roundQuality = baseRating - round * 3; // later rounds within a phase are slightly weaker
        const prospect = generateDraftProspect(roundQuality);
        if (clubId === userClubId) {
          userPicks.push({ prospect, tierIdx, round: round + 1 });
        } else {
          const club = clubsByIdInNewTiers[clubId];
          if (club) club.squad.push(prospect);
        }
      });
    }
  });

  return userPicks;
}
