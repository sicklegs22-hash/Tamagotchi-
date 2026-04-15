// ═══ SOUND MODULE ═══
// Web Audio API 8-bit sound generation

let audioCtx = null;
let muted = false;

function getCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  }
  return audioCtx;
}

function beep(freq, duration, type = 'square', vol = 0.12) {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

export function playSound(type) {
  switch (type) {
    case 'action': beep(440, 0.08); break;
    case 'gain':   beep(520, 0.1); setTimeout(() => beep(660, 0.1), 80); break;
    case 'loss':   beep(220, 0.15, 'sawtooth'); break;
    case 'levelup':
      beep(440, 0.1); setTimeout(() => beep(554, 0.1), 100);
      setTimeout(() => beep(659, 0.1), 200); setTimeout(() => beep(880, 0.2), 300); break;
    case 'evolution':
      [440, 554, 659, 880, 1108].forEach((f, i) => setTimeout(() => beep(f, 0.15), i * 120)); break;
    case 'achievement':
      beep(660, 0.08); setTimeout(() => beep(880, 0.08), 80); setTimeout(() => beep(1100, 0.15), 160); break;
    case 'gold':   beep(660, 0.07); setTimeout(() => beep(880, 0.1), 70); break;
    case 'error':  beep(180, 0.2, 'sawtooth', 0.08); break;
  }
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

export function isMuted() { return muted; }
