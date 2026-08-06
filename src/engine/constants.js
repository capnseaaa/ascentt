export const DIFFICULTY_MODES = {
  rookie: { label: "Rookie", wagesDeducted: false, eventBonuses: false, boardPressure: false, boardMessages: false, dps: false, injuryMultiplier: 0.5 },
  pro: { label: "Pro", wagesDeducted: true, eventBonuses: true, boardPressure: false, boardMessages: true, dps: false, injuryMultiplier: 1.0 },
  executive: { label: "Executive", wagesDeducted: true, eventBonuses: true, boardPressure: true, boardMessages: true, dps: true, injuryMultiplier: 1.0 },
};

export const WAGE_BANDS = [
  { young: 90_000, senior: 126_000, vetLow: 250_000, vetHigh: 600_000, starLow: 700_000, starHigh: 9_000_000 }, // MLS
  { young: 34_000, senior: 42_000, vetLow: 50_000, vetHigh: 60_000, starLow: 96_000, starHigh: 180_000 }, // USL Championship
  { young: 15_000, senior: 20_000, vetLow: 24_000, vetHigh: 36_000, starLow: 36_000, starHigh: 55_000 }, // USL League One
  { young: 0, senior: 0, vetLow: 0, vetHigh: 0, starLow: 0, starHigh: 0 }, // USL League Two — amateur
  { young: 600_000, senior: 1_200_000, vetLow: 2_000_000, vetHigh: 6_000_000, starLow: 8_000_000, starHigh: 20_000_000 }, // Premier League
  { young: 80_000, senior: 150_000, vetLow: 250_000, vetHigh: 600_000, starLow: 800_000, starHigh: 2_500_000 }, // Championship
  { young: 30_000, senior: 50_000, vetLow: 70_000, vetHigh: 120_000, starLow: 150_000, starHigh: 300_000 }, // League One
  { young: 15_000, senior: 25_000, vetLow: 35_000, vetHigh: 55_000, starLow: 60_000, starHigh: 100_000 }, // League Two
];

export const TIER_OVERALL_CEILING = [86, 70, 60, 52, 99, 85, 75, 65];

export const TIER_META = [
  { id: 0, name: "MLS", short: "MLS", color: "#C9A24B", baseRating: 68 },
  { id: 1, name: "USL Championship", short: "USLC", color: "#9BA8B0", baseRating: 58 },
  { id: 2, name: "USL League One", short: "USL1", color: "#B0703F", baseRating: 48 },
  { id: 3, name: "USL League Two", short: "USL2", color: "#6B7B70", baseRating: 40 },
];

export const ENGLAND_TIER_META = [
  { id: 0, name: "Premier League", short: "PL", color: "#3D0A5B", baseRating: 74 },
  { id: 1, name: "Championship", short: "CH", color: "#1C4E80", baseRating: 64 },
  { id: 2, name: "League One", short: "L1", color: "#B0703F", baseRating: 54 },
  { id: 3, name: "League Two", short: "L2", color: "#6B7B70", baseRating: 46 },
];

export const FULL_TIER_META = [...TIER_META, ...ENGLAND_TIER_META.map((t) => ({ ...t, id: t.id + 4 }))];

export const ACADEMY_STAR_THRESHOLDS = [0, 750_000, 2_000_000, 4_000_000, 7_000_000, 11_000_000];

export const ACADEMY_START_COST = ACADEMY_STAR_THRESHOLDS[1];

export const ACADEMY_INVEST_INCREMENT = 1_500_000;

export const ACADEMY_PROMOTE_MIN_AGE = 16;

export const ACADEMY_MAX_PROSPECTS = 10;

export const DRAFT_PHASES = [
  { tierIdx: 0, rounds: 3 },
  { tierIdx: 1, rounds: 2 },
  { tierIdx: 2, rounds: 1 },
];

export const PROMOTE_RELEGATE_COUNT = 3;

export const TARGET_TIER_SIZE = 20;

export const ENGLAND_AUTO_PROMOTE_BY_TIER = { 5: 2, 6: 2, 7: 3 };

export const PARACHUTE_PAYMENT_SCHEDULE = [40_000_000, 30_000_000, 15_000_000];

export const BASE_GOAL_RATE = 1.35;

export const HOME_ADVANTAGE = 1.12;

export const YELLOW_CARD_BASE_RATE = 1.15;

export const RED_CARD_CHANCE = 0.02;

export const INJURY_BASE_RATE = 0.12;

export const FITNESS_DRAIN_MIN = 12;

export const FITNESS_DRAIN_MAX = 22;

export const MORALE_DELTA = { win: 6, loss: -5, draw: 2 };

export const FORMATION_SLOTS = {
  "4-4-2": { GK: 1, DEF: 4, MID: 4, FWD: 2 },
  "4-3-3": { GK: 1, DEF: 4, MID: 3, FWD: 3 },
  "3-5-2": { GK: 1, DEF: 3, MID: 5, FWD: 2 },
  "5-3-2": { GK: 1, DEF: 5, MID: 3, FWD: 2 },
  "4-2-3-1": { GK: 1, DEF: 4, MID: 5, FWD: 1 },
  "4-3-2-1": { GK: 1, DEF: 4, MID: 5, FWD: 1 },
  "3-4-3": { GK: 1, DEF: 3, MID: 4, FWD: 3 },
  "4-3-1-2": { GK: 1, DEF: 4, MID: 4, FWD: 2 },
};

export const FORMATION_NOTES = {
  "4-4-2": "Balanced and simple — solid if your squad doesn't lean hard toward attack or defense.",
  "4-3-3": "Rewards a strong front line and wide attacking players — needs goals to back it up.",
  "3-5-2": "Midfield-heavy — best with a deep, strong MID line to control games, but thinner at the back.",
  "5-3-2": "Extra defensive cover — good if your DEF is your strongest line or you're facing a tough attack.",
  "4-2-3-1": "Flexible, MID-heavy setup — good if you have one standout striker and depth through the middle.",
  "4-3-2-1": "The \"Christmas tree\" — a deep midfield block feeding one out-and-out striker, same shape as 4-2-3-1 in this game's terms but built for control through the middle.",
  "3-4-3": "Committed and attacking — three at the back freeing up numbers further forward, but exposed if your defense isn't sharp.",
  "4-3-1-2": "A flat midfield three feeding a playmaker in the hole, with two strikers up top — same shape as 4-4-2 in this game's terms, built for a creative #10.",
};

export const ATTACK_MOD = { defensive: 0.85, balanced: 1.0, attacking: 1.15 };

export const DEFENSE_MOD = { defensive: 1.15, balanced: 1.0, attacking: 0.85 };

export const PRESS_MOD = { low: 0.95, medium: 1.0, high: 1.08 };

export const SCORER_WEIGHTS = { FWD: 50, MID: 30, DEF: 15, GK: 5 };

export const UNHAPPY_BENCH_STREAK_THRESHOLD = 6;

export const UNHAPPY_MORALE_THRESHOLD = 15;

export const FORCED_DEPARTURE_BENCH_THRESHOLD = 15;

export const PRIZE_SHARE = { first: 0.25, second: 0.15, third: 0.10, midBand: 0.30, restBand: 0.20 };

export const PRIZE_DECAY = 0.93;

export const MIN_PRIZE_POOL = [1_200_000, 600_000, 250_000, 100_000, 6_000_000, 800_000, 300_000, 100_000];

export const OWNERSHIP_DEPOSIT = [5_000_000, 2_000_000, 900_000, 350_000, 32_000_000, 3_000_000, 800_000, 300_000];

export const OWNERSHIP_DEPOSIT_WAGED = [16_000_000, 2_400_000, 1_000_000, 350_000, 110_000_000, 2_600_000, 900_000, 350_000];

export const SEASON_BONUS = [
  { champion: 55_000, runnerUp: 20_000, midBand: 8_000, rest: 2_000 }, // MLS
  { champion: 40_000, runnerUp: 15_000, midBand: 5_000, rest: 1_000 }, // USL Championship
  { champion: 20_000, runnerUp: 8_000, midBand: 2_500, rest: 500 }, // USL League One
  { champion: 0, runnerUp: 0, midBand: 0, rest: 0 }, // USL League Two
  { champion: 100_000, runnerUp: 40_000, midBand: 15_000, rest: 4_000 }, // Premier League
  { champion: 45_000, runnerUp: 18_000, midBand: 6_000, rest: 1_200 }, // Championship
  { champion: 22_000, runnerUp: 9_000, midBand: 3_000, rest: 600 }, // League One
  { champion: 0, runnerUp: 0, midBand: 0, rest: 0 }, // League Two
];

export const MAX_SQUAD_SIZE = 32;

export const MIN_SQUAD_SIZE = 16;

export const DISQUALIFICATION_FUNDING_PER_PLAYER = [400_000, 120_000, 50_000, 15_000, 1_000_000, 150_000, 60_000, 15_000];

export const US_OPEN_CUP_CHAMPION_PRIZE = 600_000;

export const US_OPEN_CUP_RUNNERUP_PRIZE = 250_000;

export const US_OPEN_CUP_GIANT_KILLER_BONUS = 50_000;

export const FA_CUP_ROUND_MATCHDAYS = [4, 8, 12, 16, 20, 24, 28, 32];

export const EFL_CUP_ROUND_MATCHDAYS = [2, 6, 10, 14, 18, 22, 26, 30];

export const FA_CUP_STAGE_PRIZES = { 7: 47_750, 6: 79_500, 5: 121_500, 4: 127_000, 3: 477_000, 2: 954_000 };

export const FA_CUP_CHAMPION_PRIZE = 2_000_000;

export const FA_CUP_RUNNERUP_PRIZE = 1_000_000;

export const FA_CUP_ROUND3_LOSER_CONSOLATION = 26_500;

export const EFL_CUP_STAGE_PRIZES = { 7: 5_000, 6: 7_000, 5: 10_000, 4: 15_000, 3: 25_000, 2: 25_000 };

export const EFL_CUP_CHAMPION_PRIZE = 100_000;

export const EFL_CUP_RUNNERUP_PRIZE = 50_000;

export const US_OPEN_CUP_TOTAL_ROUNDS = 8;

export const US_OPEN_CUP_ROUND_MATCHDAYS = [3, 5, 7, 9, 11, 13, 15, 17];

export const LATER_CUP_ROUND_LABELS = ["Round of 32", "Round of 16", "Quarterfinal", "Round of 8", "Semifinal", "Final"];

export const ENGLAND_CUP_STAGE_NAMES = { 4: "Round 4", 3: "Quarterfinal", 2: "Semifinal" };

export const BOARD_MESSAGE_FORMATIONS = ["4-4-2", "4-3-3", "3-5-2", "5-3-2", "4-2-3-1", "4-3-2-1", "3-4-3", "4-3-1-2"];

export const AI_TRANSFER_ATTEMPTS_PER_TIER = 2;

export const SACK_THRESHOLD = 10;

export const MAX_DESIGNATED_PLAYERS = 3;

export const MLS_SALARY_CAP = 6_000_000;

export const DP_REPUTATION_BUMP = 3;

export const DP_XI_AURA_PER_PLAYER = 0.015;

export const DP_XI_AURA_CAP = 0.05;

export const DP_REVENUE_PER_OVERALL = 15_000;

export const MID_SEASON_WINDOW_MATCHDAY = 10;

export const WIN_BONUS = [7_500, 3_000, 1_500, 0, 15_000, 4_000, 2_000, 0];

export const RIVALRIES = [
  ["Portland Timbers", "Seattle Sounders FC"], // Cascadia Cup
  ["Portland Timbers", "Vancouver Whitecaps FC"], // Cascadia Cup
  ["Seattle Sounders FC", "Vancouver Whitecaps FC"], // Cascadia Cup
  ["LA Galaxy", "Los Angeles FC"], // El Tráfico
  ["New York City FC", "New York Red Bulls"], // Hudson River Derby
  ["Real Salt Lake", "Colorado Rapids"], // Rocky Mountain Cup
  ["Toronto FC", "CF Montréal"], // Canadian Classique
  ["Louisville City FC", "Indy Eleven"], // I-64 Derby
  // Texas Triangle / Copa Tejas — three-way rivalry between all of MLS's Texas clubs
  ["FC Dallas", "Houston Dynamo FC"], // the original Texas Derby within the triangle
  ["FC Dallas", "Austin FC"],
  ["Houston Dynamo FC", "Austin FC"],
  // Corrected — this was previously mislabeled with the wrong two clubs.
  // The real Brimstone Cup is FC Dallas vs Chicago Fire FC, contested
  // since 2001.
  ["FC Dallas", "Chicago Fire FC"], // Brimstone Cup
  ["FC Dallas", "Columbus Crew"], // Lamar Hunt Pioneer Cup
  ["New York Red Bulls", "D.C. United"], // Atlantic Cup
  ["LA Galaxy", "San Jose Earthquakes"], // California Clásico
  ["Columbus Crew", "FC Cincinnati"], // Hell Is Real derby
  ["Seattle Sounders FC", "San Jose Earthquakes"], // Heritage Cup
  ["Sporting Kansas City", "St. Louis City SC"], // Midwest expansion-era rivalry
  ["D.C. United", "New England Revolution"],
  ["D.C. United", "Philadelphia Union"],
  ["Inter Miami CF", "Orlando City SC"], // Florida Derby
  ["CF Montréal", "Vancouver Whitecaps FC"], // cross-country, rooted in pre-MLS Canadian competitions
];

export const RIVALRY_PAIRS = new Set(RIVALRIES.map(([a, b]) => [a, b].sort().join("|")));

export const RIVALRY_REVENUE_BONUS = 25_000;

export const RIVALRY_REPUTATION_BUMP = 1;

export const DEFAULT_WORLD_RECORDS = {
  mostCareerGoals: null, // { playerName, clubName, goals }
  biggestTransfer: null, // { playerName, fee, fromClub, toClub, season }
  fastestHatTrick: null, // { playerName, clubName, minute, season }
  youngestDebut: null, // { playerName, clubName, age, season }
  mostLeagueTitles: null, // { clubName, tierId, titles }
};

export const MLS_TOTAL_ROUNDS = 5;

export const USLC_TOTAL_ROUNDS = 3;

export const PROMO_TOTAL_ROUNDS = 2;

export const MAX_POSTSEASON_ROUNDS = Math.max(MLS_TOTAL_ROUNDS, USLC_TOTAL_ROUNDS, PROMO_TOTAL_ROUNDS);

export const MARKET_PAGE_SIZE = 20;

export const STORAGE_KEY = "ascent_career_v1";

export const MANAGER_KEY = "ascent_manager_history_v1";

export const DEFAULT_MANAGER_HISTORY = { trophyLog: [], bestFinish: null, bestFinishUsa: null, bestFinishEngland: null, hasSeenTutorial: false, seenOneTimeHints: [], clearedOneTimeHints: [], managerReputation: 50, careerStats: { gamesPlayed: 0, wins: 0, draws: 0, losses: 0, clubHistory: [], biggestSigning: null } };
