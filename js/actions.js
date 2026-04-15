// ═══ ACTIONS MODULE ═══
import { state, cl, getCooldown, COOLDOWNS, saveGame } from './state.js';
import { getClassBonuses } from './classes.js';
import { getLvBonuses, gainXP } from './evolution.js';
import { spawnEmoji } from './particles.js';
import { playSound } from './sound.js';

// Callbacks
let _logMessage = null;
let _notify = null;
let _updateUI = null;
let _updateButtonStates = null;
let _bounceSprite = null;

export function initActions(logMsg, notify, updateUI, updateBtns, bounce) {
  _logMessage = logMsg;
  _notify = notify;
  _updateUI = updateUI;
  _updateButtonStates = updateBtns;
  _bounceSprite = bounce;
}

export const EVENTS = [
  { msg: 'Sushi knocked your coffee off the desk.', effect: () => { const G = state.G; G.nrg = cl(G.nrg - 5); G.hap = cl(G.hap + 3); }, emoji: '🐱', logCls: 'l' },
  { msg: 'A customer left a 5-star review!', effect: () => { const G = state.G; G.hap = cl(G.hap + 8); G.gold += 50; }, emoji: '⭐', logCls: 'go' },
  { msg: 'Unexpected bill arrived.', effect: () => { const G = state.G; G.gold -= 80; G.hap = cl(G.hap - 4); }, emoji: '📄', logCls: 'b' },
  { msg: 'Kayla brought you dinner.', effect: () => { const G = state.G; G.nrg = cl(G.nrg + 10); G.hap = cl(G.hap + 8); }, emoji: '🍜', logCls: 'g' },
  { msg: 'You found a freelance Shopify gig!', effect: () => { const G = state.G; G.gold += 300; G.foc = cl(G.foc + 5); }, emoji: '💻', logCls: 'go' },
  { msg: 'Instagram algorithm blessed you today.', effect: () => { const G = state.G; G.sal = cl(G.sal + 5); G.gold += 80; }, emoji: '📱', logCls: 'go' },
  { msg: 'MTG Arena update dropped. Temptation...', effect: () => { const G = state.G; G.foc = cl(G.foc - 6); G.hap = cl(G.hap + 5); }, emoji: '🃏', logCls: 'b' },
  { msg: "You got a great night's sleep naturally.", effect: () => { const G = state.G; G.nrg = cl(G.nrg + 12); }, emoji: '🌙', logCls: 'g' },
  { msg: 'Compare Club bonus hit your account!', effect: () => { const G = state.G; G.gold += 500; G.hap = cl(G.hap + 5); }, emoji: '💰', logCls: 'go' },
  { msg: 'Builder\'s Trance whispers: "Just one more SVG..."', effect: () => { const G = state.G; G.foc = cl(G.foc - 5); G.hap = cl(G.hap + 4); }, emoji: '🌀', logCls: 'b' },
  { msg: 'Sushi fell asleep on your keyboard. Unwanted but wholesome code pushed.', effect: () => { const G = state.G; G.hap = cl(G.hap + 6); G.foc = cl(G.foc - 2); }, emoji: '😸', logCls: 'l' },
  { msg: 'A stranger on Reddit praised your pixel art.', effect: () => { const G = state.G; G.hap = cl(G.hap + 5); G.sal = cl(G.sal + 3); }, emoji: '🎨', logCls: 'go' },
  { msg: 'Power nap hit different today.', effect: () => { const G = state.G; G.nrg = cl(G.nrg + 8); G.foc = cl(G.foc + 3); }, emoji: '⚡', logCls: 'g' },
  { msg: 'You found $20 in your jacket pocket.', effect: () => { const G = state.G; G.gold += 120; G.hap = cl(G.hap + 3); }, emoji: '🧥', logCls: 'go' },
  { msg: 'Kayla wants to watch a movie tonight.', effect: () => { const G = state.G; G.hap = cl(G.hap + 6); G.nrg = cl(G.nrg - 2); }, emoji: '🎬', logCls: 'g' },
  { msg: 'Got sucked into a YouTube rabbit hole.', effect: () => { const G = state.G; G.foc = cl(G.foc - 7); G.nrg = cl(G.nrg - 3); }, emoji: '📺', logCls: 'b' },
  { msg: 'Morning routine was perfect today.', effect: () => { const G = state.G; G.disc = cl(G.disc + 6); G.nrg = cl(G.nrg + 4); }, emoji: '☀️', logCls: 'g' },
  { msg: 'The gym was empty. Perfect session.', effect: () => { const G = state.G; G.disc = cl(G.disc + 4); G.hap = cl(G.hap + 5); }, emoji: '🏋️', logCls: 'g' },
  { msg: 'A product broke in production. Hotfix time.', effect: () => { const G = state.G; G.foc = cl(G.foc + 5); G.nrg = cl(G.nrg - 6); G.hap = cl(G.hap - 3); }, emoji: '🔥', logCls: 'b' },
  { msg: 'Passive income hit while you slept!', effect: () => { const G = state.G; G.gold += 200; G.disc = cl(G.disc + 3); }, emoji: '💎', logCls: 'go' },
  { msg: 'Someone copied your design. Flattering but annoying.', effect: () => { const G = state.G; G.hap = cl(G.hap - 3); G.sal = cl(G.sal + 2); }, emoji: '😤', logCls: 'l' },
  { msg: 'Meal prep Sunday saved future you.', effect: () => { const G = state.G; G.disc = cl(G.disc + 4); G.gold += 30; G.nrg = cl(G.nrg + 3); }, emoji: '🥗', logCls: 'g' },
];

export function workoutUnlocked() {
  return (Date.now() - state.G.created) >= 172800000;
}

export function openBudgetQuest() {
  const G = state.G;
  if (G.budgetSet) {
    if (_notify) _notify('BUDGET SET: $' + G.dailyBudget + '/DAY');
    if (_logMessage) _logMessage('Your daily budget is $' + G.dailyBudget + '. Log spending to track it.', 's');
    return;
  }
  const amt = prompt('Set your daily non-essential spending budget.\nThis is the max you allow yourself per day on takeaway, MTG, gear, etc.\n\nEnter amount in $:');
  if (amt === null) return;
  const budget = Math.max(0, Math.round(Number(amt)));
  if (budget <= 0) { if (_notify) _notify('INVALID BUDGET'); return; }

  G.dailyBudget = budget;
  G.budgetSet = true;
  G.disc = cl(G.disc + 15);
  G.foc = cl(G.foc + 10);
  G.quests.budget = true;
  spawnEmoji('📋');
  if (_logMessage) _logMessage('Budget set: $' + budget + '/day! Discipline +15, Focus +10.', 'go');
  if (_notify) _notify('QUEST COMPLETE: BUDGET SET');
  gainXP(30);
  if (_updateUI) _updateUI();
  saveGame();
}

export function performAction(type) {
  const G = state.G;

  if (type === 'workout' && !workoutUnlocked()) {
    const hrsLeft = Math.ceil((172800000 - (Date.now() - G.created)) / 3600000);
    if (_notify) _notify('WORKOUT UNLOCKS IN ' + hrsLeft + ' HOURS');
    playSound('error');
    return;
  }

  if (type === 'budget') { openBudgetQuest(); return; }

  const cdLeft = getCooldown(type);
  if (cdLeft > 0) {
    if (_notify) _notify(type.toUpperCase() + ': ' + cdLeft + 'm COOLDOWN');
    playSound('error');
    return;
  }

  G.totalActions++;
  if (type === G.lastAct) { G.streak++; } else { G.streak = 1; G.lastAct = type; }
  const bonus = G.streak >= 3 ? 1.3 : 1;
  const B = getClassBonuses();
  const L = getLvBonuses();
  const m = B.allGainMult * L.gainMult;
  const gBonus = L.goldBonus;

  const cdMult = type === 'workout' ? B.workoutCdMult : type === 'sell' ? B.sellCdMult : 1;
  G.cooldowns[type] = Date.now() + COOLDOWNS[type] * 60000 * cdMult;

  switch (type) {
    case 'sleep':
      G.nrg = cl(G.nrg + (16 + B.sleepNrgBonus) * bonus * m);
      G.disc = cl(G.disc + (4 + B.sleepHapBonus) * bonus * m);
      G.hap = cl(G.hap + B.sleepHapBonus * m);
      G.foc = cl(G.foc + 3 * m);
      G.totalSlept++;
      spawnEmoji('💤');
      if (_logMessage) _logMessage('Slept well. +Energy. (' + COOLDOWNS.sleep + 'm cd)', 'g');
      gainXP(5);
      playSound('gain');
      break;

    case 'save': {
      const sv = Math.floor((50 + G.disc * 2.5 + gBonus) * bonus);
      G.gold += sv;
      G.disc = cl(G.disc + 8 * bonus * m);
      G.hap = cl(G.hap - 1);
      G.totalSaved++;
      spawnEmoji('💰');
      if (_logMessage) _logMessage('Saved ' + sv + 'G. (' + COOLDOWNS.save + 'm cd)', 'go');
      gainXP(8);
      playSound('gold');
      break;
    }

    case 'market':
      G.foc = cl(G.foc + (10 + B.marketFocusBonus) * bonus * m);
      G.nrg = cl(G.nrg - 3);
      G.disc = cl(G.disc + 3 * m);
      G.sal = cl(G.sal + (2 + B.marketSalBonus) * m);
      G.totalMarketed++;
      spawnEmoji('📣');
      if (_logMessage) _logMessage('Marketing done. (' + COOLDOWNS.market + 'm cd)', 'g');
      gainXP(7);
      playSound('gain');
      break;

    case 'sell': {
      const ea = Math.floor((80 + G.sal * 3 + gBonus) * bonus * B.sellBonus);
      G.gold += ea;
      G.sal = cl(G.sal + 3 * m);
      G.nrg = cl(G.nrg - 4);
      G.hap = cl(G.hap + 5);
      G.totalSold++;
      spawnEmoji('🤝');
      if (_logMessage) _logMessage('Deal closed! +' + ea + 'G. (' + COOLDOWNS.sell + 'm cd)', 'go');
      gainXP(6);
      playSound('gold');
      break;
    }

    case 'train': {
      const trainStatBonus = Math.round((5 + B.trainAllBonus) * B.trainBerserkerMult);
      G.disc = cl(G.disc + trainStatBonus * bonus * m);
      G.foc = cl(G.foc + trainStatBonus * bonus * m);
      G.sal = cl(G.sal + Math.round((3 + B.trainAllBonus) * B.trainBerserkerMult) * m);
      G.nrg = cl(G.nrg - B.trainNrgCost);
      G.totalTrained = (G.totalTrained || 0) + 1;
      spawnEmoji('⚔️');
      if (_logMessage) _logMessage('Trained hard. (' + COOLDOWNS.train + 'm cd)', 'g');
      gainXP(10);
      playSound('gain');
      break;
    }

    case 'build':
      G.hap = cl(G.hap + (12 + B.buildHapBonus) * m);
      G.foc = cl(G.foc - 4);
      G.nrg = cl(G.nrg - 1);
      G.totalBuilt = (G.totalBuilt || 0) + 1;
      spawnEmoji('🔨');
      if (_logMessage) _logMessage('Built something. Focus slipped.', 'l');
      if (G.foc < 20 && _logMessage) _logMessage("⚠ Builder's Trance...", 'b');
      gainXP(4);
      playSound('action');
      break;

    case 'date':
      G.hap = cl(G.hap + (15 + B.dateHapBonus) * m);
      G.nrg = cl(G.nrg + 6 * m);
      G.sal = cl(G.sal + 2 * m);
      G.totalDates = (G.totalDates || 0) + 1;
      spawnEmoji('💕');
      if (_logMessage) _logMessage('Date with Kayla. (' + COOLDOWNS.date + 'm cd)', 'g');
      gainXP(5);
      playSound('gain');
      break;

    case 'workout': {
      const woCdMin = Math.round(COOLDOWNS.workout * B.workoutCdMult);
      G.nrg = cl(G.nrg - 8);
      G.disc = cl(G.disc + (10 + B.workoutDiscBonus) * bonus * m);
      G.hap = cl(G.hap + 7 * m);
      G.foc = cl(G.foc + 3 * m);
      G.totalWorkouts++;
      spawnEmoji('💪');
      if (_logMessage) _logMessage('Workout done! (' + Math.round(woCdMin / 60) + 'hr cd)', 'g');
      gainXP(12);
      playSound('gain');
      if (!G.quests.first_workout) {
        G.quests.first_workout = true;
        if (_notify) _notify('QUEST COMPLETE: FIRST WORKOUT!');
        gainXP(25);
      }
      if (G.totalWorkouts >= 3 && !G.quests.workout_3) {
        G.quests.workout_3 = true;
        if (_notify) _notify('QUEST COMPLETE: 3 WORKOUTS!');
        gainXP(40);
      }
      break;
    }

    case 'blow': {
      const blowAmt = Math.floor(50 + Math.random() * 150);
      G.gold = Math.max(0, G.gold - blowAmt);
      G.hap = cl(G.hap + 12);
      if (B.blowNoPenalty) {
        G.disc = cl(G.disc + B.blowDiscBonus);
      } else {
        G.disc = cl(G.disc - 8);
      }
      G.foc = cl(G.foc - 3);
      G.totalBlown = (G.totalBlown || 0) + 1;
      spawnEmoji('💸');
      if (_logMessage) _logMessage('Blew ' + blowAmt + 'G on impulse. The Sieve feeds. (' + (B.blowNoPenalty ? '+DISC ' : '-DISC ') + COOLDOWNS.blow + 'm cd)', 'b');
      if (!B.blowNoPenalty && G.disc < 15 && _logMessage) _logMessage('The Gilded Sieve laughs...', 'b');
      gainXP(1);
      playSound('loss');
      break;
    }
  }

  if (_bounceSprite) _bounceSprite();
  if (_updateUI) _updateUI();
  saveGame();
  if (_updateButtonStates) _updateButtonStates();
}

export function runRandomEvent() {
  const G = state.G;
  const hrsSinceEvent = (Date.now() - G.lastEvent) / 3600000;
  if (hrsSinceEvent >= 1.5 && Math.random() < 0.5) {
    const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    ev.effect();
    spawnEmoji(ev.emoji);
    if (_logMessage) _logMessage(ev.msg, ev.logCls);
    G.lastEvent = Date.now();
  }
}
