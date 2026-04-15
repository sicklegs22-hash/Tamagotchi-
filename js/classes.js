// ═══ CLASSES MODULE ═══
import { state, hasAchv } from './state.js';

export const CLASSES = {
  knight: {
    name: 'KNIGHT', icon: '⚔️',
    desc: 'Heavy plate, sword and shield. Discipline through iron. The fortress that walks.',
    alignment: 'Lawful Good',
    weakness: 'Happiness decays 25% faster. The armour weighs on the soul.',
    passives: ['Train gives +3 extra Discipline', 'Sleep gives +2 extra Energy', 'Happiness decays 25% faster'],
    abilities: [
      { name: 'Iron Discipline', desc: 'Train gives +3 bonus Discipline', color: 'var(--gl3)' },
      { name: 'Shield Wall', desc: 'Sleep regenerates +2 extra Energy', color: 'var(--gl3)' }
    ],
    check: () => {
      const G = state.G;
      return (G.totalTrained + G.totalSlept) > G.totalActions * 0.4 && G.totalTrained >= 8 && G.totalSlept >= 6;
    }
  },
  pyromancer: {
    name: 'PYROMANCER', icon: '🔥',
    desc: 'Flame-touched, chaotic, brilliant. You build and burn with equal passion.',
    alignment: 'Chaotic Neutral',
    weakness: 'Gold decays 40% faster. The flames consume everything.',
    passives: ['Build gives +5 extra Happiness', 'Train gives +2 energy instead of costing', 'Gold decays 40% faster'],
    abilities: [
      { name: 'Flame Craft', desc: 'Build gives +5 bonus Happiness', color: '#ff6820' },
      { name: 'Burning Will', desc: 'Train restores +2 Energy instead of costing', color: '#ff6820' }
    ],
    check: () => {
      const G = state.G;
      return G.totalBuilt >= 6 && G.totalTrained >= 4 && (G.totalBlown || 0) >= 2 && G.totalBuilt > (G.totalSaved || 0) * 2;
    }
  },
  sorcerer: {
    name: 'SORCERER', icon: '🌙',
    desc: 'Knowledge is the only weapon you need. You market, build, and plan with arcane precision.',
    alignment: 'Neutral Balanced',
    weakness: 'Energy decays 30% faster. The mind runs hotter than the body.',
    passives: ['Market gives +5 extra Focus', 'Budget action gives double bonuses', 'Energy decays 30% faster'],
    abilities: [
      { name: 'Arcane Mind', desc: 'Market gives +5 bonus Focus', color: 'var(--pr)' },
      { name: 'Runic Budget', desc: 'Budget action gives double Discipline and Focus', color: 'var(--pr)' }
    ],
    check: () => {
      const G = state.G;
      return G.totalMarketed >= 8 && G.totalBuilt >= 4 && G.totalMarketed > G.totalSold * 1.5;
    }
  },
  thief: {
    name: 'THIEF', icon: '🗡️',
    desc: 'Swift fingers, quicker deals. You sell fast, move faster, and never get caught lacking.',
    alignment: 'Chaotic Neutral',
    weakness: 'Discipline decays 35% faster. Hard to stay structured.',
    passives: ['Sell earns 35% more gold', 'Sell cooldown reduced 40%', 'Discipline decays 35% faster'],
    abilities: [
      { name: 'Quick Blade', desc: 'Sell earns 35% more gold', color: '#70c850' },
      { name: 'Shadow Step', desc: 'Sell cooldown reduced to ~7 minutes', color: '#70c850' }
    ],
    check: () => {
      const G = state.G;
      return G.totalSold >= 10 && G.totalSold > (G.totalTrained + (G.totalBuilt || 0)) * 2;
    }
  },
  cleric: {
    name: 'CLERIC', icon: '⛪',
    desc: 'Holy discipline, prayer, and rest. You keep the party alive through sleep and devotion.',
    alignment: 'Lawful Good',
    weakness: 'Sales skill decays 30% faster. Service over sales.',
    passives: ['Sleep gives +5 extra Energy & Happiness', 'Date gives +8 extra Happiness', 'Sales decays 30% faster'],
    abilities: [
      { name: 'Sacred Rest', desc: 'Sleep gives +5 bonus Energy and +3 Happiness', color: '#f0e070' },
      { name: 'Holy Bond', desc: 'Date gives +8 bonus Happiness', color: '#f0e070' }
    ],
    check: () => {
      const G = state.G;
      return G.totalSlept >= 10 && (G.totalDates || 0) >= 6 && (G.totalSlept + (G.totalDates || 0)) > G.totalActions * 0.45;
    }
  },
  mage: {
    name: 'MAGE', icon: '🔮',
    desc: 'Books before blades. You plan every move, budget every coin, and never leave chaos to chance.',
    alignment: 'Lawful Balanced',
    weakness: 'Happiness decays 20% faster. Too much planning, not enough living.',
    passives: ['Budget gives +20 Discipline and +15 Focus', 'Market gives +4 Sales', 'Happiness decays 20% faster'],
    abilities: [
      { name: 'Grand Tome', desc: 'Budget action gives +20 Discipline and +15 Focus', color: '#60c0ff' },
      { name: 'Arcane Market', desc: 'Market gives +4 bonus Sales', color: '#60c0ff' }
    ],
    check: () => {
      const G = state.G;
      return G.budgetSet && G.totalMarketed >= 6 && G.quests.budget && G.totalMarketed > G.totalTrained;
    }
  },
  warrior: {
    name: 'WARRIOR', icon: '🛡️',
    desc: 'Battle-worn iron. You grind through workouts, training, and discipline every single day.',
    alignment: 'Lawful Neutral',
    weakness: 'Gold income 20% lower. You chose the grind over the hustle.',
    passives: ['Train gives +2 all stats', 'Workout cooldown reduced 25%', 'Gold income 20% lower'],
    abilities: [
      { name: 'Battle Hardened', desc: 'Train gives +2 bonus to all stats', color: '#c03020' },
      { name: 'Relentless', desc: 'Workout cooldown reduced by 25%', color: '#c03020' }
    ],
    check: () => {
      const G = state.G;
      return G.totalTrained >= 8 && G.totalWorkouts >= 4 && (G.totalTrained + G.totalWorkouts) > G.totalActions * 0.4;
    }
  },
  fighter: {
    name: 'FIGHTER', icon: '👊',
    desc: 'Fists over philosophy. You train hard, sleep harder, and never back down from a grind.',
    alignment: 'Neutral Good',
    weakness: 'Focus decays 30% faster. Too much action, not enough planning.',
    passives: ['Workout gives +15 Discipline instead of +10', 'Train does not cost Energy', 'Focus decays 30% faster'],
    abilities: [
      { name: 'Iron Fist', desc: 'Workout grants +15 Discipline (up from +10)', color: '#d08030' },
      { name: 'Endurance', desc: 'Train costs 0 Energy', color: '#d08030' }
    ],
    check: () => {
      const G = state.G;
      return G.totalWorkouts >= 5 && G.totalTrained >= 6 && G.totalWorkouts > (G.totalBuilt || 0) && G.totalWorkouts > (G.totalSaved || 0);
    }
  },
  berserker: {
    name: 'BERSERKER', icon: '💢',
    desc: 'No armour. No plan. Just raw power and fury. You blow gold and train anyway.',
    alignment: 'Chaotic Self-Focused',
    weakness: 'Discipline decays 50% faster. Chaos is your natural state.',
    passives: ['Train gives +50% more to all stats', 'Blow$ gives +5 Discipline (not -8)', 'Discipline decays 50% faster'],
    abilities: [
      { name: 'Berserker Rage', desc: 'Train gives +50% bonus to all stat gains', color: '#e02020' },
      { name: 'Wild Abandon', desc: 'Blow$ gives +5 Discipline instead of -8', color: '#e02020' }
    ],
    check: () => {
      const G = state.G;
      return (G.totalBlown || 0) >= 5 && G.totalTrained >= 5 && (G.totalBlown || 0) > (G.totalSaved || 0);
    }
  },
  death_knight: {
    name: 'DEATH KNIGHT', icon: '💀',
    desc: 'You rose from the ashes of failure. Shadow and sovereignty merged into one. Arise.',
    alignment: 'Lawful Evil',
    weakness: 'Happiness frozen at 50 max. The darkness cannot be warmed.',
    passives: ['All stat gains +25%', 'Decay reduced 30%', 'Happiness capped at 50'],
    abilities: [
      { name: 'Shadow Arise', desc: 'All stat gains boosted 25%', color: '#9040e0' },
      { name: 'Death March', desc: 'All decay rates reduced 30%', color: '#9040e0' }
    ],
    secret: true,
    unlockHint: 'Reach S-Rank once and prestige',
    check: () => (state.G.prestigeCount || 0) >= 1
  },
  blood_knight: {
    name: 'BLOOD KNIGHT', icon: '🩸',
    desc: 'Your discipline is forged in sacrifice. Every $0 day feeds the crimson blade.',
    alignment: 'Lawful Neutral',
    weakness: 'No weakness. The blood debt is already paid.',
    passives: ['$0 spend days give +20 Discipline', 'Sell gives +50% gold', 'No decay penalty'],
    abilities: [
      { name: 'Blood Tithe', desc: '$0 spending days give +20 Discipline', color: '#e00030' },
      { name: 'Crimson Deal', desc: 'Sell gives 50% more gold', color: '#e00030' }
    ],
    secret: true,
    unlockHint: 'Log $0 spending 5 times',
    check: () => (state.G.spendLog || []).filter(e => e.amt === 0).length >= 5
  },
  necromancer: {
    name: 'NECROMANCER', icon: '👻',
    desc: 'You raise the dead — past actions, forgotten habits, buried goals. All serve you now.',
    alignment: 'Neutral Evil',
    weakness: 'Happiness decays 50% faster. The undead feel no joy.',
    passives: ['Level 25+ gives double XP', 'Failed actions still give 50% XP', 'Happiness decays 50% faster'],
    abilities: [
      { name: 'Undying Grind', desc: 'Gain double XP at level 25+', color: '#40c060' },
      { name: 'Soul Harvest', desc: 'All actions give +2 bonus XP', color: '#40c060' }
    ],
    secret: true,
    unlockHint: 'Reach level 25',
    check: () => state.G.lv >= 25
  },
  default: {
    name: 'WANDERER', icon: '🗺',
    desc: 'No clear path yet. The class will emerge from your choices.',
    alignment: 'True Neutral',
    weakness: 'No bonuses. No penalties. Just potential.',
    passives: ['No bonuses yet — keep playing to discover your class'],
    abilities: [{ name: 'Undiscovered', desc: 'Play more to unlock your class identity', color: 'var(--t3)' }],
    check: () => true
  }
};

const CLASS_ORDER = [
  'death_knight', 'blood_knight', 'necromancer',
  'berserker', 'fighter', 'warrior', 'thief',
  'pyromancer', 'cleric', 'mage', 'sorcerer', 'knight', 'default'
];

export function detectClass() {
  for (const id of CLASS_ORDER) {
    if (CLASSES[id].check()) return id;
  }
  return 'default';
}

export function getClassBonuses() {
  const cls = detectClass();
  return {
    classId: cls,
    sellBonus: cls === 'thief' ? 1.35 : cls === 'blood_knight' ? 1.5 : 1,
    trainAllBonus: cls === 'warrior' ? 2 : cls === 'berserker' ? 2 : cls === 'knight' ? 3 : 0,
    trainBerserkerMult: cls === 'berserker' ? 1.5 : 1,
    buildHapBonus: cls === 'pyromancer' ? 5 : 0,
    dateHapBonus: cls === 'cleric' ? 8 : 0,
    sleepNrgBonus: cls === 'cleric' ? 5 : cls === 'knight' ? 2 : 0,
    sleepHapBonus: cls === 'cleric' ? 3 : 0,
    allGainMult: cls === 'death_knight' ? 1.25 : 1,
    decayMult: cls === 'death_knight' ? 0.7 : 1,
    focusDecayMult: cls === 'sorcerer' ? 1.3 : cls === 'fighter' ? 1.3 : 1,
    hapDecayMult: { warrior: 1.2, knight: 1.25, mage: 1.2, necromancer: 1.5, death_knight: 99 }[cls] ?? 1,
    hapCap: cls === 'death_knight' ? 50 : 100,
    workoutCdMult: cls === 'warrior' ? 0.75 : cls === 'fighter' ? 0.75 : 1,
    workoutDiscBonus: cls === 'fighter' ? 5 : 0,
    trainNrgCost: cls === 'fighter' ? 0 : 6,
    blowDiscBonus: cls === 'berserker' ? 5 : 0,
    blowNoPenalty: cls === 'berserker',
    nrgDecayMult: cls === 'sorcerer' ? 1.3 : 1,
    salDecayMult: cls === 'cleric' ? 1.3 : 1,
    discDecayMult: cls === 'thief' ? 1.35 : cls === 'berserker' ? 1.5 : 1,
    xpMult: cls === 'necromancer' ? 2 : 1,
    sellCdMult: cls === 'thief' ? 0.6 : 1,
    goldDecayMult: cls === 'pyromancer' ? 1.4 : 1,
    marketFocusBonus: cls === 'sorcerer' ? 5 : 0,
    marketSalBonus: cls === 'mage' ? 4 : 0,
    budgetDiscBonus: cls === 'mage' ? 20 : cls === 'sorcerer' ? 0 : 0,
    budgetFocBonus: cls === 'mage' ? 15 : 0,
    budgetDouble: cls === 'sorcerer',
  };
}

export function detectAlignment() {
  const G = state.G;
  const chaos = G.totalBuilt * 2 + G.totalBlown * 3;
  const order = G.totalSaved * 2 + G.totalMarketed * 2 + G.totalSlept;
  const good = G.totalDates * 2 + G.totalSlept + G.totalSaved;
  const self = G.totalBuilt + G.totalBlown * 2 + G.totalSold;

  let law = order > chaos ? 'Lawful' : 'Chaotic';
  if (Math.abs(order - chaos) < 10) law = 'Neutral';
  let moral = good > self ? 'Good' : 'Self-Focused';
  if (Math.abs(good - self) < 8) moral = 'Balanced';

  return law + ' ' + moral;
}

export function getAlignmentDesc(align) {
  const descs = {
    'Lawful Good': 'Structure and care. The Commander path.',
    'Lawful Balanced': 'Disciplined but practical. The Merchant or Warrior.',
    'Lawful Self-Focused': 'Disciplined grinder. Risk of burnout.',
    'Neutral Good': 'Caring without rigidity. The Guardian path.',
    'Neutral Balanced': 'Adaptable. No strong pull yet.',
    'Neutral Self-Focused': 'Pragmatic. Results matter more than method.',
    'Chaotic Good': 'Creative spirit with a good heart. Build + Date heavy.',
    'Chaotic Balanced': 'The Restless Builder. Talented but unfocused.',
    'Chaotic Self-Focused': 'The old pattern. Spending, building, no structure. The Sieve.',
  };
  return descs[align] || 'Your path is forming.';
}
