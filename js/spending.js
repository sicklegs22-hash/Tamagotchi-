// ═══ SPENDING MODULE ═══
import { state, cl, saveGame, LOCALE } from './state.js';

let _logMessage = null;
let _spawnEmoji = null;
let _gainXP = null;
let _updateUI = null;
let _notify = null;

export function initSpending(logMsg, spawnEmoji, gainXP, updateUI, notify) {
  _logMessage = logMsg;
  _spawnEmoji = spawnEmoji;
  _gainXP = gainXP;
  _updateUI = updateUI;
  _notify = notify;
}

export function openSpendLog() {
  const G = state.G;
  const hist = document.getElementById('spendHistory');
  if (hist) {
    hist.innerHTML = '';
    const recent = G.spendLog.slice(-5).reverse();
    if (recent.length) {
      recent.forEach(e => {
        const d = document.createElement('div');
        d.className = 'spend-entry' + (e.amt === 0 ? ' good' : '');
        const date = new Date(e.ts);
        const dateStr = date.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short' });
        d.innerHTML = dateStr + ': <b>$' + e.amt + '</b>' + (e.amt === 0 ? ' — clean day!' : '');
        hist.appendChild(d);
      });
    } else {
      hist.textContent = 'No spending logged yet.';
    }
  }
  const amtInput = document.getElementById('spendAmount');
  if (amtInput) amtInput.value = '';
  const overlay = document.getElementById('spendOverlay');
  if (overlay) overlay.classList.add('show');
}

export function submitSpend() {
  const G = state.G;
  const input = document.getElementById('spendAmount');
  const amt = Math.max(0, Math.round(Number(input ? input.value : 0) || 0));

  G.spendLog.push({ amt, ts: Date.now() });

  if (amt === 0) {
    G.disc = cl(G.disc + 10); G.hap = cl(G.hap + 3);
    if (_spawnEmoji) _spawnEmoji('🌟');
    if (_logMessage) _logMessage('$0 spent today! Discipline +10. Clean day.', 'g');
    if (_gainXP) _gainXP(15);
    if (!G.quests.zero_spend_day) {
      G.quests.zero_spend_day = true;
      if (_notify) _notify('QUEST COMPLETE: ZERO SPEND DAY!');
      if (_gainXP) _gainXP(30);
    }
  } else if (amt <= 30) {
    G.disc = cl(G.disc + 3); G.gold -= amt;
    if (_spawnEmoji) _spawnEmoji('👍');
    if (_logMessage) _logMessage('$' + amt + ' logged. Reasonable. Disc +3.', 'g');
    if (_gainXP) _gainXP(5);
  } else if (amt <= 80) {
    G.disc = cl(G.disc - 3); G.gold -= amt; G.hap = cl(G.hap + 4);
    if (_spawnEmoji) _spawnEmoji('😬');
    if (_logMessage) _logMessage('$' + amt + ' logged. Creeping up. Disc -3.', 'b');
    if (_gainXP) _gainXP(2);
  } else {
    G.disc = cl(G.disc - 10); G.gold -= amt; G.hap = cl(G.hap + 6);
    if (_spawnEmoji) _spawnEmoji('💸');
    if (_logMessage) _logMessage('$' + amt + ' logged. The Sieve wins today. Disc -10.', 'b');
    if (G.disc < 15 && _logMessage) _logMessage('The Gilded Sieve laughs...', 'b');
    if (_gainXP) _gainXP(1);
  }

  // Budget compliance
  if (G.budgetSet && G.dailyBudget > 0) {
    if (amt <= G.dailyBudget) {
      if (_logMessage) _logMessage('Within budget ($' + G.dailyBudget + '/day). +2 Disc.', 'g');
      G.disc = cl(G.disc + 2);
    } else {
      if (_logMessage) _logMessage('Over budget by $' + (amt - G.dailyBudget) + '. -3 Disc.', 'b');
      G.disc = cl(G.disc - 3);
    }
  }

  const overlay = document.getElementById('spendOverlay');
  if (overlay) overlay.classList.remove('show');
  if (_updateUI) _updateUI();
  saveGame();
}
