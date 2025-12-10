export type Direction = 'up' | 'down' | 'left' | 'right';

export type CellType = 'grass' | 'path' | 'water' | 'obstacle' | 'home' | 'coin';

export type CharacterType = 'mouse' | 'princess' | 'car' | 'cat' | 'robot';

export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  type: CellType;
  hasCoin?: boolean;
  hasObstacle?: boolean;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  gridSize: number;
  grid: Cell[][];
  startPosition: Position;
  homePosition: Position;
  mode: 'guided' | 'plan' | 'master';
  stars: number;
  maxStars: number;
  unlocked: boolean;
  completed: boolean;
  optimalMoves: number;
}

export interface GameState {
  currentLevel: number;
  characterPosition: Position;
  code: Direction[];
  isRunning: boolean;
  isComplete: boolean;
  collectedCoins: number;
  selectedCharacter: CharacterType;
}

export interface GameProgress {
  unlockedLevels: number[];
  levelStars: Record<number, number>;
  totalStars: number;
  selectedCharacter: CharacterType;
}

export const CHARACTER_EMOJIS: Record<CharacterType, string> = {
  mouse: '🐭',
  princess: '👸',
  car: '🚗',
  cat: '🐱',
  robot: '🤖',
};

export const CHARACTER_NAMES: Record<CharacterType, string> = {
  mouse: 'Musen Maja',
  princess: 'Prinsessan Pia',
  car: 'Bilen Brum',
  cat: 'Katten Kull',
  robot: 'Roboten Robo',
};

export const DIRECTION_ARROWS: Record<Direction, string> = {
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};