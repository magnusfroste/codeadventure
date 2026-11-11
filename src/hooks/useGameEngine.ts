import { useState, useCallback, useRef, useEffect } from 'react';
import { Direction, Position, Level, GameState, CharacterType } from '@/types/game';

const MOVE_DELAY = 400;

export function useGameEngine(level: Level, character: CharacterType) {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: level.id,
    characterPosition: { ...level.startPosition },
    code: [...(level.startCode ?? [])],
    isRunning: false,
    isComplete: false,
    collectedCoins: 0,
    selectedCharacter: character,
  });

  const runningRef = useRef(false);
  // Ref för att alltid ha tillgång till aktuell position synkront
  const positionRef = useRef<Position>({ ...level.startPosition });
  const goalIndexRef = useRef(0);
  const [goalIndex, setGoalIndex] = useState(0);
  const goals = level.goals ?? [];
  /** Index för pilen som körs just nu (-1 = ingen) */
  const [activeStep, setActiveStep] = useState(-1);
  /** Nästa pil vid steg-för-steg-körning */
  const [nextStep, setNextStep] = useState(0);

  // Synka ref med state
  useEffect(() => {
    positionRef.current = gameState.characterPosition;
  }, [gameState.characterPosition]);

  // Återställ speltillståndet när nivån ändras
  useEffect(() => {
    positionRef.current = { ...level.startPosition };
    goalIndexRef.current = 0;
    setGoalIndex(0);
    setActiveStep(-1);
    setNextStep(0);
    setGameState({
      currentLevel: level.id,
      characterPosition: { ...level.startPosition },
      code: [...(level.startCode ?? [])],
      isRunning: false,
      isComplete: false,
      collectedCoins: 0,
      selectedCharacter: character,
    });
  }, [level.id, character]);

  const resetGame = useCallback(() => {
    runningRef.current = false;
    positionRef.current = { ...level.startPosition };
    goalIndexRef.current = 0;
    setGoalIndex(0);
    setActiveStep(-1);
    setNextStep(0);
    setGameState({
      currentLevel: level.id,
      characterPosition: { ...level.startPosition },
      code: [...(level.startCode ?? [])],
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
    setNextStep(0);
    setActiveStep(-1);
  }, []);

  const removeLastDirection = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      code: prev.code.slice(0, -1),
    }));
    setNextStep(0);
    setActiveStep(-1);
  }, []);

  const removeDirectionAt = useCallback((index: number) => {
    setGameState((prev) => ({
      ...prev,
      code: prev.code.filter((_, i) => i !== index),
    }));
    setNextStep(0);
    setActiveStep(-1);
  }, []);

  /** Flytta tillbaka figuren till start men behåll koden */
  const rewind = useCallback(() => {
    positionRef.current = { ...level.startPosition };
    goalIndexRef.current = 0;
    setGoalIndex(0);
    setActiveStep(-1);
    setNextStep(0);
    setGameState((prev) => ({
      ...prev,
      characterPosition: { ...level.startPosition },
      collectedCoins: 0,
      isComplete: false,
    }));
  }, [level]);

  const clearCode = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      code: [],
    }));
    setNextStep(0);
    setActiveStep(-1);
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
      const nextGoal = (level.goals ?? [])[goalIndexRef.current];
      if (nextGoal && nextGoal.position.x === nextPos.x && nextGoal.position.y === nextPos.y) {
        goalIndexRef.current += 1;
        setGoalIndex(goalIndexRef.current);
      }
      const allGoalsDone = goalIndexRef.current >= (level.goals ?? []).length;
      const isHome = allGoalsDone && nextPos.x === level.homePosition.x && nextPos.y === level.homePosition.y;
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

  const runCode = useCallback(async (): Promise<{ success: boolean; stepsUsed: number; reachedHome: boolean }> => {
    if (gameState.code.length === 0) {
      return { success: false, stepsUsed: 0, reachedHome: false };
    }
    // Starta alltid från början
    positionRef.current = { ...level.startPosition };
    goalIndexRef.current = 0;
    setGoalIndex(0);
    setActiveStep(-1);
    setNextStep(0);
    setGameState((prev) => ({ ...prev, characterPosition: { ...level.startPosition }, collectedCoins: 0 }));

    runningRef.current = true;
    setGameState((prev) => ({ ...prev, isRunning: true }));

    let stepsUsed = 0;
    let success = true;
    let reachedHome = false;

    for (const [i, direction] of gameState.code.entries()) {
      if (!runningRef.current) break;

      setActiveStep(i);
      await new Promise((resolve) => setTimeout(resolve, MOVE_DELAY));

      const result = moveCharacter(direction);
      stepsUsed++;

      if (!result.success) {
        success = false;
        break;
      }

      if (result.reachedHome) {
        reachedHome = true;
        break;
      }
    }

    runningRef.current = false;
    setGameState((prev) => ({ ...prev, isRunning: false }));
    if (success) setActiveStep(-1);
    setNextStep(0);

    return { success, stepsUsed, reachedHome };
  }, [gameState.code, moveCharacter, level]);

  /** Kör en enda pil. Börjar om från start när första pilen körs. */
  const stepCode = useCallback((): { success: boolean; reachedHome: boolean; done: boolean; step: number } => {
    const code = gameState.code;
    if (code.length === 0) return { success: false, reachedHome: false, done: true, step: 0 };
    const i = nextStep;
    if (i === 0) {
      positionRef.current = { ...level.startPosition };
      goalIndexRef.current = 0;
      setGoalIndex(0);
    }
    setActiveStep(i);
    const result = moveCharacter(code[i]);
    const done = !result.success || result.reachedHome || i + 1 >= code.length;
    setNextStep(done ? 0 : i + 1);
    return { success: result.success, reachedHome: result.reachedHome, done, step: i + 1 };
  }, [gameState.code, nextStep, level, moveCharacter]);

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
    removeDirectionAt,
    rewind,
    clearCode,
    goalIndex,
    goals,
    runCode,
    stepCode,
    activeStep,
    nextStep,
    executeMove,
    calculateStars,
  };
}