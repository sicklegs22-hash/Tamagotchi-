// ═══ STATE MODULE ═══
export const SAVE_KEY = 'arise_pet_v1';
export const LOCALE = 'en-AU'; // Date formatting locale
export const XP_PER_LV = 100;
export const THRESH = [0, 30, 48, 62, 76, 88];
export const DECAY_PER_HR = { disc: 0.5, nrg: 0.8, foc: 0.4, sal: 0.15, hap: 0.4, gold: 8 };
export const COOLDOWNS = {
  sleep: 20, save: 15, market: 12, sell: 12, train: 30,
  build: 8, date: 45, workout: 240, blow: 60, budget: 1440
};

export function freshState() {
  return {
    disc: 20, nrg: 65, foc: 30, sal: 80, hap: 55,
    gold: 600, xp: 0, lv: 1, stage: 0,
    achv: [],
    totalActions: 0, totalSaved: 0, totalSold: 0, totalSlept: 0,
    totalMarketed: 0, totalBlown: 0, totalWorkouts: 0,
    totalBuilt: 0, totalDates: 0, totalTrained: 0,
    streak: 0, lastAct: '',
    lastTick: Date.now(), lastEvent: Date.now(),
    cooldowns: {}, created: Date.now(),
    spendLog: [], dailyBudget: 0, budgetSet: false,
    prestigeCount: 0, seasonStart: Date.now(),
    quests: {
      budget: false, first_workout: false, workout_3: false,
      sleep_7: false, save_streak: false, market_5: false,
      zero_spend_day: false, evolved_once: false
    },
    class: null,
    lifetimeStats: { totalDaysPlayed: 0, totalActionsEver: 0, totalGoldEarned: 0 },
    statHistory: [],
    seasonHistory: []
  };
}

function loadGameInternal() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return freshState();
    const G = JSON.parse(saved);
    // Migrations / defaults
    if (!G.lastTick) G.lastTick = Date.now();
    if (!G.cooldowns) G.cooldowns = {};
    if (!G.lastEvent) G.lastEvent = Date.now();
    if (!G.created) G.created = Date.now();
    if (!G.spendLog) G.spendLog = [];
    if (!G.quests) G.quests = {};
    if (!G.totalWorkouts) G.totalWorkouts = 0;
    if (!G.dailyBudget) G.dailyBudget = 0;
    if (G.budgetSet === undefined) G.budgetSet = false;
    if (!G.totalBuilt) G.totalBuilt = 0;
    if (!G.totalDates) G.totalDates = 0;
    if (!G.totalTrained) G.totalTrained = 0;
    if (!G.prestigeCount) G.prestigeCount = 0;
    if (!G.seasonStart) G.seasonStart = G.created || Date.now();
    if (!G.lifetimeStats) G.lifetimeStats = { totalDaysPlayed: 0, totalActionsEver: 0, totalGoldEarned: 0 };
    if (!G.statHistory) G.statHistory = [];
    if (!G.seasonHistory) G.seasonHistory = [];
    // achv stored as array, keep as array (convert to Set at runtime via helper)
    if (!Array.isArray(G.achv)) G.achv = [];
    return G;
  } catch (e) {
    return freshState();
  }
}

// Runtime achv Set wrapper — achv is array on disk, Set in memory
export const achvSet = new Set();

export function initAchvSet(G) {
  achvSet.clear();
  (G.achv || []).forEach(a => achvSet.add(a));
}

export function hasAchv(key) { return achvSet.has(key); }
export function addAchv(key, G) {
  achvSet.add(key);
  G.achv = Array.from(achvSet);
}

// The mutable state wrapper
export const state = { G: loadGameInternal() };

// Init the achv set from loaded state
initAchvSet(state.G);

export function saveGame() {
  try {
    const G = state.G;
    const s = Object.assign({}, G, { achv: Array.from(achvSet) });
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
  } catch (e) {}
}

export function loadGame() {
  state.G = loadGameInternal();
  initAchvSet(state.G);
}

export function cl(v) { return Math.max(0, Math.min(100, Math.round(v))); }

export function avg() {
  const G = state.G;
  return Math.floor((G.disc + G.nrg + G.foc + G.sal + G.hap) / 5);
}

export function getDayNum() {
  return Math.floor((Date.now() - state.G.created) / 86400000) + 1;
}

export function isNight() {
  const h = new Date().getHours();
  return h >= 20 || h < 6;
}

export function getCooldown(action) {
  const cd = state.G.cooldowns[action];
  if (!cd) return 0;
  const remaining = (cd - Date.now()) / 60000;
  return remaining > 0 ? Math.ceil(remaining) : 0;
}

export function applyDecay(getLvBonuses, getClassBonuses) {
  const G = state.G;
  const now = Date.now();
  const elapsed = (now - G.lastTick) / 3600000;
  if (elapsed <= 0) return;

  const B = getClassBonuses();
  const L = getLvBonuses();
  const dm = B.decayMult * L.decayMult;

  G.disc = cl(G.disc - DECAY_PER_HR.disc * elapsed * dm * B.discDecayMult);
  G.nrg = cl(G.nrg - DECAY_PER_HR.nrg * elapsed * dm * B.nrgDecayMult);
  G.foc = cl(G.foc - DECAY_PER_HR.foc * elapsed * dm * B.focusDecayMult);
  G.sal = cl(G.sal - DECAY_PER_HR.sal * elapsed * dm * B.salDecayMult);
  G.hap = cl(G.hap - DECAY_PER_HR.hap * elapsed * dm * B.hapDecayMult);
  G.gold = Math.max(0, Math.round(G.gold - DECAY_PER_HR.gold * elapsed * B.goldDecayMult));

  if (G.hap > B.hapCap) G.hap = B.hapCap;

  G.lastTick = now;
}
