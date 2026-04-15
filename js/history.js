// ═══ HISTORY MODULE ═══
import { state, getDayNum } from './state.js';
import { STAGES } from './sprites.js';

export function openHistoryScreen() {
  const G = state.G;
  const content = document.getElementById('historyContent');
  if (!content) return;

  const totalDays = getDayNum();
  const zeroSpendDays = (G.spendLog || []).filter(e => e.amt === 0).length;

  let html = `
    <div class="history-section">
      <div class="history-label">LIFETIME TOTALS</div>
      <div class="history-row"><span>Days Played</span><span>${totalDays}</span></div>
      <div class="history-row"><span>Total Actions</span><span>${G.totalActions}</span></div>
      <div class="history-row"><span>Times Slept</span><span>${G.totalSlept}</span></div>
      <div class="history-row"><span>Times Saved</span><span>${G.totalSaved}</span></div>
      <div class="history-row"><span>Times Marketed</span><span>${G.totalMarketed}</span></div>
      <div class="history-row"><span>Sales Closed</span><span>${G.totalSold}</span></div>
      <div class="history-row"><span>Workouts Done</span><span>${G.totalWorkouts}</span></div>
      <div class="history-row"><span>Things Built</span><span>${G.totalBuilt}</span></div>
      <div class="history-row"><span>Dates Taken</span><span>${G.totalDates}</span></div>
      <div class="history-row"><span>Gold Blown</span><span>${G.totalBlown} times</span></div>
      <div class="history-row"><span>$0 Spend Days</span><span>${zeroSpendDays}</span></div>
      <div class="history-row"><span>Prestige Count</span><span>${G.prestigeCount || 0}x</span></div>
    </div>
  `;

  // Season history
  if (G.seasonHistory && G.seasonHistory.length > 0) {
    html += '<div class="history-section"><div class="history-label">PAST SEASONS</div>';
    G.seasonHistory.forEach(s => {
      html += `<div class="history-row"><span>Season ${s.season + 1}</span><span>${STAGES[s.finalStage] ? STAGES[s.finalStage].rank : '?'}-Rank LV${s.finalLv}</span></div>`;
    });
    html += '</div>';
  }

  // Spend log
  if (G.spendLog && G.spendLog.length > 0) {
    html += '<div class="history-section"><div class="history-label">RECENT SPENDING</div>';
    G.spendLog.slice(-10).reverse().forEach(e => {
      const date = new Date(e.ts).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
      const cls = e.amt === 0 ? ' style="color:var(--g)"' : e.amt > 80 ? ' style="color:var(--r)"' : '';
      html += `<div class="history-row"${cls}><span>${date}</span><span>$${e.amt}</span></div>`;
    });
    html += '</div>';
  }

  content.innerHTML = html;
  const overlay = document.getElementById('historyOverlay');
  if (overlay) overlay.classList.add('show');
}
