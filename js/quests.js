// ═══ QUESTS MODULE ═══
import { state, getDayNum } from './state.js';
import { hasAchv } from './state.js';

let _showAchievement = null;
let _logMessage = null;
let _gainXP = null;

export function initQuests(showAch, logMsg, gainXP) {
  _showAchievement = showAch;
  _logMessage = logMsg;
  _gainXP = gainXP;
}

function workoutUnlocked() {
  return (Date.now() - state.G.created) >= 172800000;
}

export function openQuestLog() {
  const G = state.G;
  const ql = document.getElementById('questList');
  if (!ql) return;
  ql.innerHTML = '';

  const woUnlocked = workoutUnlocked();
  const woHrsLeft = Math.max(0, Math.ceil((172800000 - (Date.now() - G.created)) / 3600000));

  const quests = [
    { name: 'Set a Daily Budget', desc: 'Set your non-essential spending limit.', done: G.quests.budget, locked: false },
    { name: 'Log a Zero-Spend Day', desc: 'Log $0 in non-essential spending.', done: G.quests.zero_spend_day, locked: false },
    { name: 'First Workout', desc: 'Complete your first workout.' + (woUnlocked ? '' : ' Unlocks in ' + woHrsLeft + 'hrs.'), done: G.quests.first_workout, locked: !woUnlocked },
    { name: '3 Workouts Complete', desc: 'Build the exercise habit.', done: G.quests.workout_3, locked: !woUnlocked },
    { name: 'Sleep 7 Times', desc: 'Hit sleep 7 times total.', done: G.quests.sleep_7 || false, locked: false },
    { name: 'Save 10 Times', desc: 'Consistent saving habit.', done: hasAchv('saver_10'), locked: false },
    { name: 'Market 5 Times', desc: 'Apply sales brain to LW.', done: G.quests.market_5 || false, locked: false },
    { name: 'Reach D-Rank', desc: 'Average stats above 30.', done: G.stage >= 1, locked: false },
    { name: 'Reach B-Rank Knight', desc: 'Evolve to the full knight.', done: G.stage >= 3, locked: false },
    { name: 'Reach S-Rank Sovereign', desc: 'The final evolution. Freedom.', done: G.stage >= 5, locked: false },
    { name: '5,000 Gold Saved', desc: 'First real financial cushion.', done: G.gold >= 5000 || hasAchv('rich'), locked: false },
    { name: 'All Stats Above 50', desc: 'The balanced warrior.', done: hasAchv('all_50'), locked: false },
  ];

  quests.forEach(q => {
    const d = document.createElement('div');
    d.className = 'quest-item' + (q.done ? ' done' : '') + (q.locked ? ' locked' : '');
    d.innerHTML = `<div class="quest-check"></div><div><div class="quest-name">${q.name}</div><div class="quest-desc">${q.desc}</div></div>`;
    ql.appendChild(d);
  });

  const overlay = document.getElementById('questOverlay');
  if (overlay) overlay.classList.add('show');
}

export function checkQuestMilestones() {
  const G = state.G;
  if (G.totalSlept >= 7 && !G.quests.sleep_7) {
    G.quests.sleep_7 = true;
    if (_showAchievement) _showAchievement('Sleep Schedule (7x)!');
    if (_logMessage) _logMessage('Quest: Sleep 7 times complete!', 'go');
    if (_gainXP) _gainXP(25);
  }
  if (G.totalMarketed >= 5 && !G.quests.market_5) {
    G.quests.market_5 = true;
    if (_showAchievement) _showAchievement('Marketing Brain (5x)!');
    if (_logMessage) _logMessage('Quest: Market 5 times complete!', 'go');
    if (_gainXP) _gainXP(25);
  }
  if (G.stage >= 1 && !G.quests.evolved_once) {
    G.quests.evolved_once = true;
    if (_gainXP) _gainXP(20);
  }
}
