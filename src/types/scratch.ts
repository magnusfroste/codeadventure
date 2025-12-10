import { CharacterType } from './game';

export type BlockType = 
  | 'start'
  | 'stop'
  | 'move_up'
  | 'move_down'
  | 'move_left'
  | 'move_right'
  | 'jump'
  | 'loop';

export interface Block {
  id: string;
  type: BlockType;
  value?: number; // For loop count
  children?: Block[]; // For loop contents
}

export interface BlockDefinition {
  type: BlockType;
  label: string;
  emoji: string;
  color: string;
  category: 'control' | 'movement' | 'action';
  hasValue?: boolean;
  hasChildren?: boolean;
  defaultValue?: number;
}

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  start: {
    type: 'start',
    label: 'START',
    emoji: '🟢',
    color: 'bg-green-500',
    category: 'control',
  },
  stop: {
    type: 'stop',
    label: 'STOPP',
    emoji: '🔴',
    color: 'bg-red-500',
    category: 'control',
  },
  move_up: {
    type: 'move_up',
    label: 'Gå upp',
    emoji: '⬆️',
    color: 'bg-blue-500',
    category: 'movement',
  },
  move_down: {
    type: 'move_down',
    label: 'Gå ner',
    emoji: '⬇️',
    color: 'bg-blue-500',
    category: 'movement',
  },
  move_left: {
    type: 'move_left',
    label: 'Gå vänster',
    emoji: '⬅️',
    color: 'bg-blue-500',
    category: 'movement',
  },
  move_right: {
    type: 'move_right',
    label: 'Gå höger',
    emoji: '➡️',
    color: 'bg-blue-500',
    category: 'movement',
  },
  jump: {
    type: 'jump',
    label: 'Hoppa',
    emoji: '🦘',
    color: 'bg-purple-500',
    category: 'action',
  },
  loop: {
    type: 'loop',
    label: 'Upprepa',
    emoji: '🔄',
    color: 'bg-orange-500',
    category: 'control',
    hasValue: true,
    hasChildren: true,
    defaultValue: 3,
  },
};

export interface ScratchProject {
  id: string;
  name: string;
  character: CharacterType;
  blocks: Block[];
  createdAt: Date;
}

export interface StageState {
  characterX: number;
  characterY: number;
  isJumping: boolean;
  rotation: number;
}