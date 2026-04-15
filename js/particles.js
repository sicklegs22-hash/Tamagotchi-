// ═══ PARTICLES MODULE ═══
import { state } from './state.js';

export function initStars() {
  const vp = document.getElementById('viewport');
  if (!vp) return;
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 50 + '%';
    s.style.setProperty('--d', (2 + Math.random() * 4) + 's');
    s.style.animationDelay = Math.random() * 3 + 's';
    vp.appendChild(s);
  }
}

export function spawnEmoji(emoji) {
  const ef = document.getElementById('effectsLayer');
  if (!ef) return;
  const el = document.createElement('div');
  el.className = 'emo';
  el.textContent = emoji;
  el.style.left = (25 + Math.random() * 50) + '%';
  el.style.top = '35%';
  ef.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}
