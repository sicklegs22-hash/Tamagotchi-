// ═══ EVOLUTION MODULE ═══
import { state, avg, THRESH, XP_PER_LV, cl } from './state.js';
import { STAGES, CLASS_SPRITES } from './sprites.js';
import { D } from './renderer.js';

// Callbacks to avoid circular deps
let _notify = null;
let _logMessage = null;
let _drawPet = null;
let _detectClass = null;

export function initEvolution(notify, logMsg, drawPet, detectClass) {
  _notify = notify;
  _logMessage = logMsg;
  _drawPet = drawPet;
  _detectClass = detectClass;
}

export function gainXP(amt) {
  const G = state.G;
  G.xp += amt;
  while (G.xp >= XP_PER_LV) {
    G.xp -= XP_PER_LV;
    G.lv++;
    const perk = getLvPerk(G.lv);
    if (_logMessage) _logMessage('LEVEL UP! Now LV ' + G.lv + ' — ' + perk, 's');
    if (_notify) _notify('LEVEL UP — LV ' + G.lv);
    applyLvMilestone(G);
  }
}

function applyLvMilestone(G) {
  if (G.lv % 10 === 0) {
    G.disc = cl(G.disc + 5); G.nrg = cl(G.nrg + 5);
    G.foc = cl(G.foc + 5);  G.sal = cl(G.sal + 5); G.hap = cl(G.hap + 5);
  } else if (G.lv % 3 === 0) {
    G.gold += G.lv * 5;
  }
}

export function getLvPerk(lv) {
  if (lv % 10 === 0) return 'Milestone! All stats +5';
  if (lv % 5 === 0) return 'Decay reduced! (-' + (lv * 0.5) + '%)';
  if (lv % 3 === 0) return 'Gold bonus! +' + lv * 5 + 'G';
  return 'Stat gains +' + Math.floor(lv / 2) + '%';
}

export function getLvBonuses() {
  const lv = state.G.lv;
  return {
    gainMult: 1 + Math.floor(lv / 2) * 0.01,
    decayMult: Math.max(0.5, 1 - Math.floor(lv / 5) * 0.005),
    goldBonus: Math.floor(lv / 3) * 5,
  };
}

export function checkEvo() {
  const G = state.G;
  const a = avg();
  let t = 0;
  for (let i = THRESH.length - 1; i >= 0; i--) {
    if (a >= THRESH[i]) { t = i; break; }
  }
  if (t > G.stage) {
    G.stage = t;
    if (_drawPet) _drawPet();
    showEvoOverlay();
  } else if (t < G.stage) {
    G.stage = t;
    if (_drawPet) _drawPet();
    if (_notify) _notify('DE-EVOLVED...');
    if (_logMessage) _logMessage('Stats dropped. Devolved to ' + STAGES[G.stage].name + '.', 'b');
  }
}

export function showEvoOverlay() {
  const G = state.G;
  const s = STAGES[G.stage];
  const cls = _detectClass ? _detectClass() : 'default';
  const hasClassSprite = G.stage >= 3 && cls !== 'default' && CLASS_SPRITES[cls] && CLASS_SPRITES[cls][G.stage];
  const title = hasClassSprite ? (cls.replace('_', ' ').toUpperCase() + ' — ' + s.name) : s.name;

  const evTitle = document.getElementById('evoTitle');
  const evDesc = document.getElementById('evoDesc');
  const evCanvas = document.getElementById('evoCanvas');

  if (evTitle) evTitle.textContent = title;
  if (evDesc) evDesc.textContent = s.desc;
  if (evCanvas) {
    const ec = evCanvas.getContext('2d');
    ec.imageSmoothingEnabled = false;
    if (hasClassSprite) {
      D(ec, 24, 32, CLASS_SPRITES[cls][G.stage].grid, CLASS_SPRITES[cls][G.stage].pal);
    } else {
      D(ec, 24, 32, s.grid, s.pal);
    }
  }

  const evo = document.getElementById('evoOverlay');
  if (evo) evo.classList.add('show');
  if (_logMessage) _logMessage('EVOLUTION: ' + title + '!', 's');
}
