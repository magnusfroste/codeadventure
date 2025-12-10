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

// Level 1-3: Guided mode (3x3)
export const level1: Level = {
  id: 1,
  name: 'Första stegen',
  description: 'Hjälp karaktären hem! Tryck på pilarna.',
  gridSize: 3,
  grid: [
    [P(), P(), H()],
    [G(), P(), G()],
    [P(), G(), G()],
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
  description: 'En lite längre väg hem!',
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
  unlocked: false,
  completed: false,
  optimalMoves: 4,
};

export const level3: Level = {
  id: 3,
  name: 'Sicksack',
  description: 'Kan du hitta vägen genom sicksacken?',
  gridSize: 3,
  grid: [
    [H(), P(), G()],
    [G(), P(), G()],
    [G(), P(), P()],
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

// Level 4-6: Plan mode (4x4)
export const level4: Level = {
  id: 4,
  name: 'Tänk först!',
  description: 'Skriv hela koden innan du kör!',
  gridSize: 4,
  grid: [
    [P(), P(), P(), H()],
    [G(), G(), G(), G()],
    [G(), G(), G(), G()],
    [P(), G(), G(), G()],
  ],
  startPosition: { x: 0, y: 3 },
  homePosition: { x: 3, y: 0 },
  mode: 'plan',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 6,
};

export const level5: Level = {
  id: 5,
  name: 'Labyrinten',
  description: 'Hitta rätt väg genom labyrinten!',
  gridSize: 4,
  grid: [
    [G(), G(), P(), H()],
    [G(), P(), P(), G()],
    [G(), P(), G(), G()],
    [P(), P(), G(), G()],
  ],
  startPosition: { x: 0, y: 3 },
  homePosition: { x: 3, y: 0 },
  mode: 'plan',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 6,
};

export const level6: Level = {
  id: 6,
  name: 'Utmaningen',
  description: 'En knepig bana att lösa!',
  gridSize: 4,
  grid: [
    [H(), P(), G(), G()],
    [G(), P(), P(), G()],
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

// Level 7-9: Master mode (5x5 with obstacles and coins)
export const level7: Level = {
  id: 7,
  name: 'Mästarbanans början',
  description: 'Samla mynt och undvik hinder!',
  gridSize: 5,
  grid: [
    [G(), G(), C(), P(), H()],
    [G(), G(), P(), G(), G()],
    [G(), P(), P(), G(), G()],
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

export const level8: Level = {
  id: 8,
  name: 'Vattenvägen',
  description: 'Akta vattnet! Samla alla mynt!',
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

export const level9: Level = {
  id: 9,
  name: 'Ultimata utmaningen',
  description: 'Den svåraste banan - lycka till!',
  gridSize: 5,
  grid: [
    [G(), C(), P(), P(), H()],
    [G(), G(), P(), O(), G()],
    [C(), P(), P(), G(), G()],
    [G(), P(), O(), G(), G()],
    [P(), P(), G(), G(), C()],
  ],
  startPosition: { x: 0, y: 4 },
  homePosition: { x: 4, y: 0 },
  mode: 'master',
  stars: 0,
  maxStars: 3,
  unlocked: false,
  completed: false,
  optimalMoves: 10,
};

export const allLevels: Level[] = [
  level1, level2, level3,
  level4, level5, level6,
  level7, level8, level9,
];

// Validate all levels in development mode
if (import.meta.env.DEV) {
  import('@/utils/levelValidator').then(({ validateAllLevels }) => {
    validateAllLevels(allLevels);
  });
}