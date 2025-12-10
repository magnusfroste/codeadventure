import { useState, useCallback, useRef, useEffect } from 'react';
import { Direction, Position, Level, GameState, CharacterType } from '@/types/game';

const MOVE_DELAY = 400;

export function useGameEngine(level: Level, character: CharacterType) {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: level.id,
    characterPosition: { ...level.startPosition },
    code: [],
    isRunning: false,
    isComplete: false,
    collectedCoins: 0,
    selectedCharacter: character,
  });

  const runningRef = useRef(false);
  // Ref för att alltid ha tillgång till aktuell position synkront
  const positionRef = useRef<Position>({ ...level.startPosition });

  // Synka ref med state
  useEffect(() => {
    positionRef.current = gameState.characterPosition;
  }, [gameState.characterPosition]);

  const resetGame = useCallback(() => {
    runningRef.current = false;
    positionRef.current = { ...level.startPosition };
    setGameState({
      currentLevel: level.id,
      characterPosition: { ...level.startPosition },
      code: [],
      isRunning: false,
      isComplete: false,
      collectedCoins: 0,
      selectedCharacter: character,
    });
  }, [level, character]);

  const addDirection = useCallback((direction: Direction) => {
    setGameState((prev) => ({
      ...prev,
      code: [...prev.code, direction],
    }));
  }, []);

  const removeLastDirection = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      code: prev.code.slice(0, -1),
    }));
  }, []);

  const clearCode = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      code: [],
    }));
  }, []);

  const getNextPosition = (pos: Position, direction: Direction): Position => {
    switch (direction) {
      case 'up':
        return { x: pos.x, y: pos.y - 1 };
      case 'down':
        return { x: pos.x, y: pos.y + 1 };
      case 'left':
        return { x: pos.x - 1, y: pos.y };
      case 'right':
        return { x: pos.x + 1, y: pos.y };
    }
  };

  const isValidMove = (pos: Position): boolean => {
    if (pos.x < 0 || pos.x >= level.gridSize || pos.y < 0 || pos.y >= level.gridSize) {
      return false;
    }
    const cell = level.grid[pos.y][pos.x];
    return cell.type !== 'grass' && cell.type !== 'water' && !cell.hasObstacle;
  };

  const moveCharacter = useCallback(
    (direction: Direction): { success: boolean; hitObstacle: boolean; reachedHome: boolean; collectedCoin: boolean } => {
      // Läs aktuell position synkront från ref
      const currentPos = positionRef.current;
      const nextPos = getNextPosition(currentPos, direction);

      // Validera synkront - returnera omedelbart om ogiltigt
      if (!isValidMove(nextPos)) {
        return { success: false, hitObstacle: true, reachedHome: false, collectedCoin: false };
      }

      // Beräkna resultat synkront
      const cell = level.grid[nextPos.y][nextPos.x];
      const isHome = nextPos.x === level.homePosition.x && nextPos.y === level.homePosition.y;
      const hasCoin = cell.hasCoin || false;

      // Uppdatera ref FÖRST (synkront) för efterföljande drag
      positionRef.current = nextPos;

      // Uppdatera state för rendering
      setGameState((prev) => ({
        ...prev,
        characterPosition: nextPos,
        collectedCoins: hasCoin ? prev.collectedCoins + 1 : prev.collectedCoins,
        isComplete: isHome,
      }));

      return { success: true, hitObstacle: false, reachedHome: isHome, collectedCoin: hasCoin };
    },
    [level]
  );

  const runCode = useCallback(async (): Promise<{ success: boolean; stepsUsed: number }> => {
    if (gameState.code.length === 0) {
      return { success: false, stepsUsed: 0 };
    }

    runningRef.current = true;
    setGameState((prev) => ({ ...prev, isRunning: true }));

    let stepsUsed = 0;
    let success = true;

    for (const direction of gameState.code) {
      if (!runningRef.current) break;

      await new Promise((resolve) => setTimeout(resolve, MOVE_DELAY));

      const result = moveCharacter(direction);
      stepsUsed++;

      if (!result.success) {
        success = false;
        break;
      }

      if (result.reachedHome) {
        break;
      }
    }

    runningRef.current = false;
    setGameState((prev) => ({ ...prev, isRunning: false }));

    return { success, stepsUsed };
  }, [gameState.code, moveCharacter]);

  const executeMove = useCallback(
    async (direction: Direction): Promise<{ success: boolean; reachedHome: boolean }> => {
      setGameState((prev) => ({ ...prev, code: [...prev.code, direction] }));
      const result = moveCharacter(direction);
      return { success: result.success, reachedHome: result.reachedHome };
    },
    [moveCharacter]
  );

  const calculateStars = useCallback(
    (stepsUsed: number): number => {
      if (stepsUsed <= level.optimalMoves) return 3;
      if (stepsUsed <= level.optimalMoves + 2) return 2;
      return 1;
    },
    [level.optimalMoves]
  );

  return {
    gameState,
    resetGame,
    addDirection,
    removeLastDirection,
    clearCode,
    runCode,
    executeMove,
    calculateStars,
  };
}