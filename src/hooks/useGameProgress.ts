import { useState, useEffect, useCallback } from 'react';
import { GameProgress, CharacterType } from '@/types/game';

const STORAGE_KEY = 'kodaventyret-progress';

const defaultProgress: GameProgress = {
  unlockedLevels: [1],
  levelStars: {},
  totalStars: 0,
  selectedCharacter: 'mouse',
};

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress({ ...defaultProgress, ...parsed });
      } catch {
        setProgress(defaultProgress);
      }
    }
  }, []);

  const saveProgress = useCallback((newProgress: GameProgress) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  }, []);

  const completeLevel = useCallback((levelId: number, stars: number) => {
    setProgress((prev) => {
      const currentStars = prev.levelStars[levelId] || 0;
      const newStars = Math.max(currentStars, stars);
      const starDiff = newStars - currentStars;
      
      const newUnlocked = prev.unlockedLevels.includes(levelId + 1)
        ? prev.unlockedLevels
        : [...prev.unlockedLevels, levelId + 1];

      const newProgress: GameProgress = {
        ...prev,
        unlockedLevels: newUnlocked,
        levelStars: { ...prev.levelStars, [levelId]: newStars },
        totalStars: prev.totalStars + starDiff,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      return newProgress;
    });
  }, []);

  const selectCharacter = useCallback((character: CharacterType) => {
    setProgress((prev) => {
      const newProgress = { ...prev, selectedCharacter: character };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      return newProgress;
    });
  }, []);

  const resetProgress = useCallback(() => {
    saveProgress(defaultProgress);
  }, [saveProgress]);

  const isLevelUnlocked = useCallback(
    (levelId: number) => progress.unlockedLevels.includes(levelId),
    [progress.unlockedLevels]
  );

  const getLevelStars = useCallback(
    (levelId: number) => progress.levelStars[levelId] || 0,
    [progress.levelStars]
  );

  return {
    progress,
    completeLevel,
    selectCharacter,
    resetProgress,
    isLevelUnlocked,
    getLevelStars,
  };
}