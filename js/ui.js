// ═══ UI MODULE ═══
import { state, avg, getDayNum, isNight, getCooldown, cl, XP_PER_LV, LOCALE } from './state.js';
import { STAGES } from './sprites.js';
import { CLASSES, detectClass, detectAlignment, getAlignmentDesc } from './classes.js';
import { getSeasonInfo, checkSeasonReset } from './seasons.js';
import { checkEvo } from './evolution.js';
import { checkAchievements } from './achievements.js';
import { checkQuestMilestones } from './quests.js';

let evbTimer, achTimer;

export function logMessage(text, cls) {
  const log = document.getElementById('activityLog');
  if (!log) return;
  const p = document.createElement('p');
  if (cls) p.className = cls;
  p.textContent = text;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
  if (log.children.length > 50) log.removeChild(log.firstChild);
}

export function notify(text) {
  const t = document.getElementById('eventBanner');
  if (!t) return;
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(evbTimer);
  evbTimer = setTimeout(() => t.classList.remove('show'), 2000);
}

export function showAchievement(text) {
  const a = document.getElementById('achievementPopup');
  if (!a) return;
  a.textContent = '🏆 ' + text;
  a.classList.add('show');
  clearTimeout(achTimer);
  achTimer = setTimeout(() => a.classList.remove('show'), 2500);
}

export function updateUI(detectClassOverride) {
  const G = state.G;
  G.disc = cl(G.disc); G.nrg = cl(G.nrg); G.foc = cl(G.foc);
  G.sal = cl(G.sal);   G.hap = cl(G.hap); G.gold = Math.max(0, G.gold);

  // Stat bars
  const bars = [
    { b: 'discBar', v: 'discVal', val: G.disc, cls: 'disc-fill' },
    { b: 'nrgBar',  v: 'nrgVal',  val: G.nrg,  cls: 'nrg-fill'  },
    { b: 'focBar',  v: 'focVal',  val: G.foc,  cls: 'foc-fill'  },
    { b: 'salBar',  v: 'salVal',  val: G.sal,  cls: 'sal-fill'  },
    { b: 'hapBar',  v: 'hapVal',  val: G.hap,  cls: 'hap-fill'  },
  ];
  bars.forEach(d => {
    const bar = document.getElementById(d.b);
    const val = document.getElementById(d.v);
    if (bar) bar.style.width = d.val + '%';
    if (val) val.textContent = d.val;
  });

  // XP bar
  const xpPct = Math.floor(G.xp / XP_PER_LV * 100);
  const xpBar = document.getElementById('xpBar');
  const xpVal = document.getElementById('xpVal');
  if (xpBar) xpBar.style.width = xpPct + '%';
  if (xpVal) xpVal.textContent = G.xp;

  // Header
  const goldEl = document.getElementById('goldDisplay');
  const rankEl = document.getElementById('rankBadge');
  const lvEl = document.getElementById('levelDisplay');
  const dayEl = document.getElementById('dayDisplay');
  if (goldEl) goldEl.textContent = G.gold + 'G';
  if (rankEl) rankEl.textContent = STAGES[G.stage].rank;
  if (lvEl) lvEl.textContent = 'LV ' + G.lv;
  if (dayEl) dayEl.textContent = (isNight() ? 'NIGHT' : 'DAY') + ' ' + getDayNum();

  // Viewport day/night
  const vp = document.getElementById('viewport');
  if (vp) vp.className = 'viewport ' + (isNight() ? 'night' : 'day');

  // Mood text
  const a = avg();
  let mood = 'IDLE', mc = 'var(--t3)';
  if (a >= 88)      { mood = 'SOVEREIGN';  mc = 'var(--gd)'; }
  else if (a >= 76) { mood = 'POWERFUL';   mc = 'var(--g)'; }
  else if (a >= 62) { mood = 'STRONG';     mc = 'var(--gl3)'; }
  else if (a >= 48) { mood = 'GRINDING';   mc = 'var(--pr)'; }
  else if (a >= 30) { mood = 'STRUGGLING'; mc = 'var(--gd)'; }
  else if (a >= 15) { mood = 'SUFFERING';  mc = 'var(--r)'; }
  else              { mood = 'DYING';       mc = 'var(--r)'; }
  const moodEl = document.getElementById('moodText');
  if (moodEl) { moodEl.textContent = mood; moodEl.style.color = mc; }

  // Class bar
  const cls = detectClassOverride ? detectClassOverride() : detectClass();
  const clsData = CLASSES[cls];
  const classIcon = document.getElementById('classIcon');
  const className = document.getElementById('className');
  const classAlign = document.getElementById('classAlign');
  if (classIcon) classIcon.textContent = clsData.icon;
  if (className) className.textContent = clsData.name;
  if (classAlign) classAlign.textContent = detectAlignment();

  // Season bar
  const si = getSeasonInfo();
  const seasonLabel = document.getElementById('seasonLabel');
  const seasonDays = document.getElementById('seasonDays');
  const prestigeLabel = document.getElementById('prestigeLabel');
  if (seasonLabel) seasonLabel.textContent = 'SEASON ' + (si.season + 1);
  if (seasonDays) seasonDays.textContent = '— ' + si.daysLeft + ' DAYS LEFT';
  if (prestigeLabel) prestigeLabel.textContent = si.season > 0 ? si.season + '\u00d7 PRESTIGE' : ''; // \u00d7 = ×

  checkSeasonReset();
  checkEvo();
  checkAchievements();
}

export function updateButtonStates(workoutUnlockedFn) {
  const G = state.G;
  document.querySelectorAll('.action-btn[data-action]').forEach(btn => {
    const action = btn.dataset.action;
    if (!action) return;
    const hint = btn.querySelector('.btn-hint');

    if (action === 'logspend' || action === 'quests' || action === 'budget') {
      btn.disabled = false;
      if (action === 'budget' && hint) {
        hint.textContent = G.budgetSet ? '$' + G.dailyBudget + '/DAY' : '+DISC +FOC';
      }
      return;
    }

    if (action === 'workout') {
      const unlocked = workoutUnlockedFn ? workoutUnlockedFn() : true;
      if (!unlocked) {
        btn.disabled = true;
        const hrsLeft = Math.max(0, Math.ceil((172800000 - (Date.now() - G.created)) / 3600000));
        if (hint) hint.textContent = 'UNLOCKS: ' + hrsLeft + 'h';
        return;
      }
    }

    const cd = getCooldown(action);
    if (cd > 0) {
      btn.disabled = true;
      if (hint) hint.textContent = cd >= 60 ? Math.ceil(cd / 60) + 'h CD' : cd + 'm CD';
    } else {
      btn.disabled = false;
      const labels = {
        sleep: '+NRG +DISC', save: '+DISC +GOLD', market: '+FOCUS +DISC',
        sell: '+GOLD +SAL', train: '+ALL -NRG', build: '+HAP -FOC',
        date: '+HAP +NRG', workout: '+DISC +HAP +FOC', blow: '+HAP -GOLD',
      };
      if (hint && labels[action]) hint.textContent = labels[action];
    }
  });

  // Streak indicator
  const si = document.getElementById('streakIndicator');
  if (si) {
    if (G.streak >= 2) {
      si.textContent = G.streak >= 3 ? '🔥 ' + G.streak + 'x STREAK (+30% bonus!)' : '⚡ ' + G.streak + 'x streak (3x for bonus)';
    } else {
      si.textContent = '';
    }
  }

  checkQuestMilestones();
}

export function openClassInfo() {
  const cls = detectClass();
  const c = CLASSES[cls];
  const align = detectAlignment();

  const title = document.getElementById('classInfoTitle');
  const icon = document.getElementById('classInfoIcon');
  const desc = document.getElementById('classInfoDesc');
  const sections = document.getElementById('classInfoSections');

  if (title) title.textContent = c.name;
  if (icon) icon.textContent = c.icon;
  if (desc) desc.textContent = c.desc;

  if (sections) {
    sections.innerHTML = `
      <div class="info-section-label">ALIGNMENT</div>
      <p style="font-size:12px;color:var(--gl3);margin-bottom:4px">${align}</p>
      <p style="font-size:10px;color:var(--t3);margin-bottom:10px">${getAlignmentDesc(align)}</p>
      <div class="info-section-label">ACTIVE ABILITIES</div>
      ${c.abilities.map(a => `<div class="ability-item"><div style="font-size:12px;font-weight:600;color:${a.color}">${a.name}</div><div style="font-size:10px;color:var(--t3)">${a.desc}</div></div>`).join('')}
      <div class="info-section-label">PASSIVE BONUSES</div>
      ${c.passives.map(p => `<div style="font-size:10px;color:var(--t2);padding:2px 0">• ${p}</div>`).join('')}
      <div class="info-section-label">CLASS WEAKNESS</div>
      <p style="font-size:11px;color:var(--r);margin-bottom:6px">${c.weakness}</p>
    `;
  }

  const overlay = document.getElementById('classOverlay');
  if (overlay) overlay.classList.add('show');
}
