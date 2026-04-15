// ═══ MAIN MODULE — Entry point ═══
import { state, saveGame, applyDecay, getDayNum } from './state.js';
import { getClassBonuses, detectClass } from './classes.js';
import { getLvBonuses, initEvolution, gainXP, checkEvo } from './evolution.js';
import { updateUI, logMessage, notify, showAchievement, updateButtonStates, openClassInfo } from './ui.js';
import { drawPet, startIdleAnimation, bounceSprite } from './animations.js';
import { D } from './renderer.js';
import { STAGES, CAT_PAL, CAT_GRID } from './sprites.js';
import { initStars, spawnEmoji } from './particles.js';
import { playSound } from './sound.js';
import { getSeasonInfo } from './seasons.js';
import { initAchievements, checkAchievements } from './achievements.js';
import { initQuests, openQuestLog, checkQuestMilestones } from './quests.js';
import { initActions, performAction, workoutUnlocked, runRandomEvent } from './actions.js';
import { initSpending, openSpendLog, submitSpend } from './spending.js';
import { openHistoryScreen } from './history.js';

// ─── Wire up Evolution module callbacks ───
initEvolution(notify, logMessage, () => drawPet(detectClass), detectClass);

// ─── Wire up Achievements callbacks ───
initAchievements(showAchievement, logMessage, gainXP);

// ─── Wire up Quest callbacks ───
initQuests(showAchievement, logMessage, gainXP);

// ─── Wire up Actions callbacks ───
initActions(
  logMessage,
  notify,
  () => updateUI(detectClass),
  () => updateButtonStates(workoutUnlocked),
  bounceSprite
);

// ─── Wire up Spending callbacks ───
initSpending(
  logMessage,
  spawnEmoji,
  gainXP,
  () => updateUI(detectClass),
  notify
);

// ─── Draw sushi cat ───
function drawCat() {
  const canvas = document.getElementById('sushiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  D(ctx, 8, 8, CAT_GRID, CAT_PAL);
}

// ─── Button handler ───
function handleButtonClick(action) {
  if (action === 'logspend') {
    openSpendLog();
  } else if (action === 'quests') {
    openQuestLog();
  } else {
    performAction(action);
  }
}

// ─── Wire all action buttons ───
document.querySelectorAll('.action-btn[data-action]').forEach(btn => {
  const action = btn.dataset.action;
  btn.addEventListener('click', () => handleButtonClick(action));
});

// ─── Overlay close buttons ───
const closeMap = {
  spendCancelBtn: 'spendOverlay',
  spendSubmitBtn: null, // handled separately
  questCloseBtn: 'questOverlay',
  classCloseBtn: 'classOverlay',
  evoCloseBtn: 'evoOverlay',
  seasonCloseBtn: 'seasonOverlay',
  historyCloseBtn: 'historyOverlay',
};

Object.entries(closeMap).forEach(([btnId, overlayId]) => {
  const btn = document.getElementById(btnId);
  if (btn && overlayId) {
    btn.addEventListener('click', () => {
      const overlay = document.getElementById(overlayId);
      if (overlay) overlay.classList.remove('show');
    });
  }
});

// Spend submit
const spendSubmitBtn = document.getElementById('spendSubmitBtn');
if (spendSubmitBtn) spendSubmitBtn.addEventListener('click', () => submitSpend());

// Class bar click
const classBar = document.getElementById('classBar');
if (classBar) classBar.addEventListener('click', () => openClassInfo());

// Expose openHistoryScreen for any future use
window.openHistoryScreen = openHistoryScreen;
window.classesModule = { openClassInfo };

// ─── Game tick (every 30s) ───
function tick() {
  applyDecay(getLvBonuses, getClassBonuses);
  runRandomEvent();

  const G = state.G;
  if (G.nrg < 15) logMessage('Energy getting low...', 'b');
  if (G.disc < 10) logMessage('Discipline crumbling... gold leaking...', 'b');

  updateUI(detectClass);
  saveGame();
  updateButtonStates(workoutUnlocked);
}

setInterval(tick, 30000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) tick();
});

// ─── Init ───
const lastTickBefore = state.G.lastTick || Date.now();
applyDecay(getLvBonuses, getClassBonuses);

drawPet(detectClass);
drawCat();
updateUI(detectClass);
updateButtonStates(workoutUnlocked);
initStars();
startIdleAnimation(detectClass);

const hrsAway = Math.floor((Date.now() - lastTickBefore) / 3600000);
if (hrsAway > 0) logMessage('You were away for ~' + hrsAway + ' hours. Stats decayed.', 's');
logMessage('System active. Day ' + getDayNum() + '. You are ' + STAGES[state.G.stage].rank + '-Rank.', 's');
logMessage('"Purpose without structure is just enthusiasm on a timer."', 'l');
saveGame();
