import { useState, useCallback, useRef } from 'react';
import { Block, BlockType, BLOCK_DEFINITIONS } from '@/types/scratch';
import { CharacterType } from '@/types/game';

const STEP_SIZE = 40;
const STAGE_WIDTH = 400;
const STAGE_HEIGHT = 300;
const ANIMATION_DELAY = 400;

interface StageState {
  x: number;
  y: number;
  isJumping: boolean;
  rotation: number;
}

export function useScratchEngine(character: CharacterType) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [stageState, setStageState] = useState<StageState>({
    x: STAGE_WIDTH / 2,
    y: STAGE_HEIGHT / 2,
    isJumping: false,
    rotation: 0,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const runningRef = useRef(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addBlock = useCallback((type: BlockType) => {
    const def = BLOCK_DEFINITIONS[type];
    const newBlock: Block = {
      id: generateId(),
      type,
      value: def.defaultValue,
      children: def.hasChildren ? [] : undefined,
    };
    setBlocks((prev) => [...prev, newBlock]);
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const updateBlockValue = useCallback((id: string, value: number) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, value } : b))
    );
  }, []);

  const addBlockToLoop = useCallback((loopId: string, type: BlockType) => {
    const def = BLOCK_DEFINITIONS[type];
    const newBlock: Block = {
      id: generateId(),
      type,
      value: def.defaultValue,
    };
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === loopId
          ? { ...b, children: [...(b.children || []), newBlock] }
          : b
      )
    );
  }, []);

  const removeBlockFromLoop = useCallback((loopId: string, blockId: string) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === loopId
          ? { ...b, children: (b.children || []).filter((c) => c.id !== blockId) }
          : b
      )
    );
  }, []);

  const moveBlocks = useCallback((fromIndex: number, toIndex: number) => {
    setBlocks((prev) => {
      const newBlocks = [...prev];
      const [removed] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, removed);
      return newBlocks;
    });
  }, []);

  const clearBlocks = useCallback(() => {
    setBlocks([]);
  }, []);

  const resetStage = useCallback(() => {
    setStageState({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
      isJumping: false,
      rotation: 0,
    });
  }, []);

  const clampPosition = (x: number, y: number) => ({
    x: Math.max(30, Math.min(STAGE_WIDTH - 30, x)),
    y: Math.max(30, Math.min(STAGE_HEIGHT - 30, y)),
  });

  const executeBlock = useCallback(
    async (block: Block): Promise<boolean> => {
      if (!runningRef.current) return false;

      setActiveBlockId(block.id);
      await new Promise((r) => setTimeout(r, ANIMATION_DELAY / 2));

      switch (block.type) {
        case 'start':
          break;

        case 'stop':
          runningRef.current = false;
          return false;

        case 'move_up':
          setStageState((prev) => {
            const clamped = clampPosition(prev.x, prev.y - STEP_SIZE);
            return { ...prev, ...clamped };
          });
          break;

        case 'move_down':
          setStageState((prev) => {
            const clamped = clampPosition(prev.x, prev.y + STEP_SIZE);
            return { ...prev, ...clamped };
          });
          break;

        case 'move_left':
          setStageState((prev) => {
            const clamped = clampPosition(prev.x - STEP_SIZE, prev.y);
            return { ...prev, ...clamped, rotation: -15 };
          });
          setTimeout(() => setStageState((prev) => ({ ...prev, rotation: 0 })), 200);
          break;

        case 'move_right':
          setStageState((prev) => {
            const clamped = clampPosition(prev.x + STEP_SIZE, prev.y);
            return { ...prev, ...clamped, rotation: 15 };
          });
          setTimeout(() => setStageState((prev) => ({ ...prev, rotation: 0 })), 200);
          break;

        case 'jump':
          setStageState((prev) => ({ ...prev, isJumping: true }));
          await new Promise((r) => setTimeout(r, 300));
          setStageState((prev) => ({ ...prev, isJumping: false }));
          break;

        case 'loop':
          const repeatCount = block.value || 1;
          for (let i = 0; i < repeatCount; i++) {
            if (!runningRef.current) break;
            for (const child of block.children || []) {
              if (!runningRef.current) break;
              await executeBlock(child);
              await new Promise((r) => setTimeout(r, ANIMATION_DELAY / 2));
            }
          }
          break;
      }

      await new Promise((r) => setTimeout(r, ANIMATION_DELAY / 2));
      return runningRef.current;
    },
    []
  );

  const runProgram = useCallback(async () => {
    if (blocks.length === 0 || blocks[0].type !== 'start') {
      return { success: false, error: 'Programmet måste börja med START!' };
    }

    runningRef.current = true;
    setIsRunning(true);
    resetStage();

    await new Promise((r) => setTimeout(r, 300));

    for (const block of blocks) {
      if (!runningRef.current) break;
      const shouldContinue = await executeBlock(block);
      if (!shouldContinue) break;
    }

    setActiveBlockId(null);
    setIsRunning(false);
    runningRef.current = false;

    return { success: true };
  }, [blocks, executeBlock, resetStage]);

  const stopProgram = useCallback(() => {
    runningRef.current = false;
    setIsRunning(false);
    setActiveBlockId(null);
  }, []);

  return {
    blocks,
    setBlocks,
    stageState,
    isRunning,
    activeBlockId,
    addBlock,
    removeBlock,
    updateBlockValue,
    addBlockToLoop,
    removeBlockFromLoop,
    moveBlocks,
    clearBlocks,
    resetStage,
    runProgram,
    stopProgram,
  };
}