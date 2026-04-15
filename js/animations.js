// ═══ ANIMATIONS MODULE ═══
import { D } from './renderer.js';
import { STAGES, CLASS_SPRITES } from './sprites.js';
import { state } from './state.js';

let animFrame = 0;
let idleInterval = null;
let catInterval = null;
let catFlip = false;

export function drawPet(detectClassFn) {
  const canvas = document.getElementById('petCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const G = state.G;
  const stage = G.stage;
  let grid, pal;

  if (stage >= 3 && detectClassFn) {
    const cls = detectClassFn();
    if (cls !== 'default' && CLASS_SPRITES[cls] && CLASS_SPRITES[cls][stage]) {
      grid = CLASS_SPRITES[cls][stage].grid;
      pal = CLASS_SPRITES[cls][stage].pal;
    } else {
      grid = STAGES[stage].grid;
      pal = STAGES[stage].pal;
    }
  } else {
    grid = STAGES[stage].grid;
    pal = STAGES[stage].pal;
  }
  D(ctx, 24, 32, grid, pal);
}

export function startIdleAnimation(detectClassFn) {
  if (idleInterval) clearInterval(idleInterval);
  idleInterval = setInterval(() => {
    animFrame = animFrame === 0 ? 1 : 0;
    const pet = document.getElementById('petCanvas');
    if (pet) pet.style.transform = animFrame === 0 ? '' : 'translateY(-1px)';
  }, 800);

  // Cat idle animation
  const sushiCanvas = document.getElementById('sushiCanvas');
  if (sushiCanvas && catInterval === null) {
    catInterval = setInterval(() => {
      catFlip = !catFlip;
      sushiCanvas.style.transform = catFlip ? 'scaleX(-1) translateY(-1px)' : '';
    }, 1200);
  }
}

export function bounceSprite() {
  const pet = document.getElementById('petCanvas');
  if (!pet) return;
  pet.style.transform = 'translateY(-5px)';
  setTimeout(() => { pet.style.transform = ''; }, 150);
}

export function flashSprite() {
  const pet = document.getElementById('petCanvas');
  if (!pet) return;
  pet.style.filter = 'brightness(2)';
  setTimeout(() => { pet.style.filter = ''; }, 200);
}
