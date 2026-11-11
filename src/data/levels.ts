import { Level, Cell } from '@/types/game';

const createCell = (type: Cell['type'], hasCoin = false, hasObstacle = false): Cell => ({
  type,
  hasCoin,
  hasObstacle,
});

const P = () => createCell('path');
const G = () => createCell('grass');
const H = () => createCell('home');
const W = () => createCell('water');
const O = () => createCell('path', false, true);
const C = () => createCell('path', true);

// Level 1-2: Guided mode (3x3)
export const level1: Level = {
  id: 1,
  name: 'Första stegen',
  description: 'Hjälp karaktären hem! Tryck på pilarna.',
  gridSize: 3,
  grid: [
    [G(), P(), H()],
    [G(), P(), G()],
    [P(), P(), G()],
  ],
  startPosition: { x: 0, y: 2 },
  homePosition: { x: 2, y: 0 },
  mode: 'guided',
  stars: 0,
  maxStars: 3,
  unlocked: true,
  completed: false,
  optimalMoves: 4,
};

export const level2: Level = {
  id: 2,
  name: 'Runt hörnet',
  description: 'En ny väg att utforska!',
  gridSize: 3,
  grid: [
    [H(), P(), P()],
    [G(), G(), P()],
    [G(), G(), P()],
  ],
  startPosition: { x: 2, y: 2 },
  homePosition: { x: 0, y: 0 },
  mode: 'guided',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 4,
};

// Level 3-4: Guided mode (4x4)
export const level3: Level = {
  id: 3,
  name: 'Längre vägen',
  description: 'Nu blir det lite längre!',
  gridSize: 4,
  grid: [
    [P(), P(), P(), H()],
    [P(), G(), G(), G()],
    [P(), G(), G(), G()],
    [P(), G(), G(), G()],
  ],
  startPosition: { x: 0, y: 3 },
  homePosition: { x: 3, y: 0 },
  mode: 'guided',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 6,
};

export const level4: Level = {
  id: 4,
  name: 'Sicksack',
  description: 'Kan du följa den slingrande vägen?',
  gridSize: 4,
  grid: [
    [G(), G(), P(), H()],
    [G(), P(), P(), G()],
    [G(), P(), G(), G()],
    [P(), P(), G(), G()],
  ],
  startPosition: { x: 0, y: 3 },
  homePosition: { x: 3, y: 0 },
  mode: 'guided',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 6,
};

// Level 5-6: Plan mode (4x4)
export const level5: Level = {
  id: 5,
  name: 'Tänk först!',
  description: 'Skriv hela koden innan du kör!',
  gridSize: 4,
  grid: [
    [H(), P(), P(), G()],
    [G(), G(), P(), G()],
    [G(), G(), P(), P()],
    [G(), G(), G(), P()],
  ],
  startPosition: { x: 3, y: 3 },
  homePosition: { x: 0, y: 0 },
  mode: 'plan',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 6,
};

export const level6: Level = {
  id: 6,
  name: 'Labyrinten',
  description: 'Hitta rätt väg genom labyrinten!',
  gridSize: 4,
  grid: [
    [P(), P(), P(), H()],
    [P(), G(), G(), G()],
    [P(), P(), P(), G()],
    [G(), G(), P(), G()],
  ],
  startPosition: { x: 2, y: 3 },
  homePosition: { x: 3, y: 0 },
  mode: 'plan',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 7,
};

// Level 7-8: Plan mode (5x5)
export const level7: Level = {
  id: 7,
  name: 'Stora äventyret',
  description: 'En större bana att utforska!',
  gridSize: 5,
  grid: [
    [G(), G(), G(), P(), H()],
    [G(), G(), P(), P(), G()],
    [G(), G(), P(), G(), G()],
    [G(), P(), P(), G(), G()],
    [P(), P(), G(), G(), G()],
  ],
  startPosition: { x: 0, y: 4 },
  homePosition: { x: 4, y: 0 },
  mode: 'plan',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 8,
};

export const level8: Level = {
  id: 8,
  name: 'Snirklig stig',
  description: 'En klurig väg att planera!',
  gridSize: 5,
  grid: [
    [H(), P(), G(), G(), G()],
    [G(), P(), P(), P(), G()],
    [G(), G(), G(), P(), G()],
    [G(), G(), P(), P(), G()],
    [G(), G(), P(), P(), P()],
  ],
  startPosition: { x: 4, y: 4 },
  homePosition: { x: 0, y: 0 },
  mode: 'plan',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 8,
};

// Level 9-10: Master mode (5x5 with coins and obstacles)
export const level9: Level = {
  id: 9,
  name: 'Myntjakten',
  description: 'Samla mynt på vägen hem!',
  gridSize: 5,
  grid: [
    [G(), G(), C(), P(), H()],
    [G(), G(), P(), G(), G()],
    [C(), P(), P(), G(), G()],
    [G(), P(), G(), G(), G()],
    [P(), P(), G(), G(), G()],
  ],
  startPosition: { x: 0, y: 4 },
  homePosition: { x: 4, y: 0 },
  mode: 'master',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 8,
};

export const level10: Level = {
  id: 10,
  name: 'Ultimata utmaningen',
  description: 'Akta vattnet och samla mynten!',
  gridSize: 5,
  grid: [
    [H(), P(), C(), G(), G()],
    [G(), P(), W(), W(), G()],
    [G(), P(), P(), P(), G()],
    [G(), W(), W(), P(), G()],
    [G(), G(), C(), P(), P()],
  ],
  startPosition: { x: 4, y: 4 },
  homePosition: { x: 0, y: 0 },
  mode: 'master',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 8,
};

// ===== Skogens hjälpare (11-14): uppdrag på vägen =====
export const level11: Level = {
  id: 11,
  name: 'Äpplet först',
  description: 'Hämta äpplet 🍎 och gå sedan hem!',
  gridSize: 3,
  grid: [
    [P(), G(), H()],
    [P(), P(), P()],
    [P(), G(), G()],
  ],
  startPosition: { x: 0, y: 2 },
  homePosition: { x: 2, y: 0 },
  goals: [{ position: { x: 0, y: 0 }, emoji: '🍎', label: 'Äpplet' }],
  mode: 'guided',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 6,
};

export const level12: Level = {
  id: 12,
  name: 'Två vänner',
  description: 'Hälsa på kaninen 🐰 först, sedan igelkotten 🦔!',
  gridSize: 4,
  grid: [
    [P(), P(), P(), H()],
    [P(), G(), G(), P()],
    [P(), G(), G(), P()],
    [P(), P(), P(), P()],
  ],
  startPosition: { x: 0, y: 3 },
  homePosition: { x: 3, y: 0 },
  goals: [
    { position: { x: 2, y: 3 }, emoji: '🐰', label: 'Kaninen' },
    { position: { x: 3, y: 1 }, emoji: '🦔', label: 'Igelkotten' },
  ],
  mode: 'guided',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 6,
};

export const level13: Level = {
  id: 13,
  name: 'Två vägar',
  description: 'Två vägar leder hem. Vilken är kortast?',
  gridSize: 4,
  grid: [
    [H(), P(), P(), P()],
    [P(), G(), G(), P()],
    [P(), G(), G(), P()],
    [P(), P(), P(), P()],
  ],
  startPosition: { x: 1, y: 3 },
  homePosition: { x: 0, y: 0 },
  mode: 'plan',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 4,
};

export const level14: Level = {
  id: 14,
  name: 'Svampplockaren',
  description: 'Planera vägen: plocka svampen 🍄 och gå hem!',
  gridSize: 4,
  grid: [
    [G(), G(), P(), H()],
    [P(), P(), P(), G()],
    [P(), G(), P(), G()],
    [P(), P(), P(), G()],
  ],
  startPosition: { x: 0, y: 3 },
  homePosition: { x: 3, y: 0 },
  goals: [{ position: { x: 0, y: 1 }, emoji: '🍄', label: 'Svampen' }],
  mode: 'plan',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 6,
};

// ===== Robots verkstad (15-18): laga och förutse kod =====
export const level15: Level = {
  id: 15,
  name: 'Saknad pil',
  description: 'Roboten tappade en pil! Lägg till den som fattas.',
  gridSize: 4,
  grid: [
    [P(), P(), P(), H()],
    [P(), G(), G(), G()],
    [P(), G(), G(), G()],
    [P(), G(), G(), G()],
  ],
  startPosition: { x: 0, y: 3 },
  homePosition: { x: 3, y: 0 },
  startCode: ['up', 'up', 'up', 'right', 'right'],
  mode: 'plan',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 6,
};

export const level16: Level = {
  id: 16,
  name: 'Fel pil',
  description: 'En pil pekar åt fel håll. Hitta den och byt ut den!',
  gridSize: 4,
  grid: [
    [G(), G(), G(), H()],
    [G(), P(), P(), P()],
    [G(), P(), G(), G()],
    [P(), P(), G(), G()],
  ],
  startPosition: { x: 0, y: 3 },
  homePosition: { x: 3, y: 0 },
  startCode: ['right', 'up', 'up', 'right', 'right', 'down'],
  mode: 'plan',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 6,
};

export const level17: Level = {
  id: 17,
  name: 'En pil för mycket',
  description: 'Koden har en extra pil. Tryck på den för att ta bort den!',
  gridSize: 5,
  grid: [
    [G(), G(), G(), G(), H()],
    [G(), G(), G(), G(), P()],
    [P(), P(), P(), P(), P()],
    [P(), G(), G(), G(), G()],
    [P(), G(), G(), G(), G()],
  ],
  startPosition: { x: 0, y: 4 },
  homePosition: { x: 4, y: 0 },
  startCode: ['up', 'up', 'up', 'right', 'right', 'right', 'right', 'up', 'up'],
  mode: 'plan',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 8,
};

export const level18: Level = {
  id: 18,
  name: 'Vart går roboten?',
  description: 'Läs koden. Peka var du tror roboten hamnar – tryck sedan KÖR!',
  gridSize: 5,
  grid: [
    [H(), P(), P(), G(), G()],
    [G(), G(), P(), G(), G()],
    [G(), G(), P(), P(), P()],
    [G(), G(), G(), G(), P()],
    [G(), G(), G(), G(), P()],
  ],
  startPosition: { x: 4, y: 4 },
  homePosition: { x: 0, y: 0 },
  startCode: ['up', 'up', 'left', 'left', 'up', 'up', 'left', 'left'],
  mode: 'plan',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 8,
};

export const allLevels: Level[] = [
  level1, level2, level3, level4, level5,
  level6, level7, level8, level9, level10,
  level11, level12, level13, level14,
  level15, level16, level17, level18,
];

// Validate all levels in development mode
if (import.meta.env?.DEV) {
  import('@/utils/levelValidator').then(({ validateAllLevels }) => {
    validateAllLevels(allLevels);
  });
}
