// ═══ ACHIEVEMENTS MODULE ═══
import { state, hasAchv, addAchv } from './state.js';

export const ACHS = {
  first_save:  { name: 'First Deposit',            check: () => state.G.totalSaved >= 1 },
  saver_10:    { name: 'Disciplined Saver (10x)',   check: () => state.G.totalSaved >= 10 },
  seller_5:    { name: 'Born Closer (5 sales)',     check: () => state.G.totalSold >= 5 },
  seller_20:   { name: 'Sales Machine (20 sales)',  check: () => state.G.totalSold >= 20 },
  slept_5:     { name: 'Sleep Schedule (5x)',       check: () => state.G.totalSlept >= 5 },
  marketer:    { name: 'Marketing Brain (10x)',     check: () => state.G.totalMarketed >= 10 },
  rich:        { name: '5000 Gold Club',            check: () => state.G.gold >= 5000 },
  richer:      { name: '20000 Gold Fortress',       check: () => state.G.gold >= 20000 },
  disc_50:     { name: 'Discipline Over 50',        check: () => state.G.disc >= 50 },
  disc_80:     { name: 'Iron Will (Disc 80+)',      check: () => state.G.disc >= 80 },
  focus_50:    { name: 'Laser Focus (50+)',         check: () => state.G.foc >= 50 },
  all_50:      { name: 'Balanced Warrior',          check: () => state.G.disc >= 50 && state.G.nrg >= 50 && state.G.foc >= 50 && state.G.sal >= 50 && state.G.hap >= 50 },
  brank:       { name: 'B-Rank Knight',             check: () => state.G.stage >= 3 },
  srank:       { name: 'S-Rank Sovereign',          check: () => state.G.stage >= 5 },
  no_blow:     { name: 'Sieve Slayer (50 acts, 0 blows)', check: () => state.G.totalActions >= 50 && state.G.totalBlown === 0 },
  lv10:        { name: 'Level 10',                  check: () => state.G.lv >= 10 },
  lv25:        { name: 'Level 25',                  check: () => state.G.lv >= 25 },
  streak5:     { name: '5x Streak',                 check: () => state.G.streak >= 5 },
};

// Callbacks set by ui.js to avoid circular deps
let _showAchievement = null;
let _logMessage = null;
let _gainXP = null;

export function initAchievements(showAch, logMsg, gainXP) {
  _showAchievement = showAch;
  _logMessage = logMsg;
  _gainXP = gainXP;
}

export function checkAchievements() {
  Object.entries(ACHS).forEach(([k, a]) => {
    if (!hasAchv(k) && a.check()) {
      addAchv(k, state.G);
      if (_showAchievement) _showAchievement(a.name);
      if (_logMessage) _logMessage('Achievement: ' + a.name, 'go');
      if (_gainXP) _gainXP(20);
    }
  });
}
