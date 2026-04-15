// ═══ SEASONS MODULE ═══
import { state, saveGame, freshState } from './state.js';

const SEASON_DURATION_MS = 90 * 24 * 3600000;

export function getSeasonInfo() {
  const G = state.G;
  const start = G.seasonStart || G.created;
  const now = Date.now();
  const elapsed = now - start;
  const remaining = SEASON_DURATION_MS - elapsed;
  const daysLeft = Math.max(0, Math.ceil(remaining / 86400000));
  const season = G.prestigeCount || 0;
  return { season, daysLeft, elapsed, shouldReset: remaining <= 0 };
}

export function checkSeasonReset() {
  const info = getSeasonInfo();
  if (info.shouldReset) triggerSeasonReset();
}

export function triggerSeasonReset() {
  const G = state.G;
  const prestige = (G.prestigeCount || 0) + 1;
  const lifetimeStats = G.lifetimeStats || {};
  const seasonHistory = G.seasonHistory || [];

  // Save season summary
  seasonHistory.push({
    season: prestige - 1,
    endDate: Date.now(),
    finalStage: G.stage,
    finalLv: G.lv,
    totalActions: G.totalActions,
    gold: G.gold,
  });

  const newState = freshState();
  newState.prestigeCount = prestige;
  newState.seasonStart = Date.now();
  newState.created = Date.now();
  newState.lifetimeStats = lifetimeStats;
  newState.seasonHistory = seasonHistory;
  // Carry over 25% of gold
  newState.gold = Math.floor(G.gold * 0.25);

  state.G = newState;
  saveGame();
  showSeasonResetOverlay(prestige);
}

function showSeasonResetOverlay(prestige) {
  const title = document.getElementById('seasonTitle');
  const desc = document.getElementById('seasonDesc');
  const overlay = document.getElementById('seasonOverlay');

  if (title) title.textContent = 'SEASON ' + prestige + ' BEGIN';
  if (desc) desc.innerHTML = `90 days have passed. Your character resets — but the prestige remains.<br><span style="color:var(--gd)">Prestige ${prestige}x — The journey restarts.</span>`;
  if (overlay) overlay.classList.add('show');
}
