import { useState, useCallback } from 'react';
import { GameProgress, CharacterType } from '@/types/game';

import { getActiveProfile, progressKeyFor, updateProfileCharacter } from '@/lib/profiles';

const storageKey = () => {
  const p = getActiveProfile();
  return p ? progressKeyFor(p.id) : 'kodaventyret-progress-gast';
};

const defaultProgress: GameProgress = {
  unlockedLevels: [1],
  levelStars: {},
  totalStars: 0,
  selectedCharacter: 'mouse',
};

function loadProgress(): GameProgress {
  let loaded = defaultProgress;
  try {
    const saved = localStorage.getItem(storageKey());
    if (saved) loaded = { ...defaultProgress, ...JSON.parse(saved) };
  } catch {
    loaded = defaultProgress;
  }
  // Figuren hör till barnets profil
  const profile = getActiveProfile();
  if (profile) loaded = { ...loaded, selectedCharacter: profile.character };
  return loaded;
}

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>(loadProgress);

  const saveProgress = useCallback((newProgress: GameProgress) => {
    setProgress(newProgress);
    localStorage.setItem(storageKey(), JSON.stringify(newProgress));
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

      localStorage.setItem(storageKey(), JSON.stringify(newProgress));
      return newProgress;
    });
  }, []);

  const selectCharacter = useCallback((character: CharacterType) => {
    setProgress((prev) => {
      const newProgress = { ...prev, selectedCharacter: character };
      const profile = getActiveProfile();
      if (profile) updateProfileCharacter(profile.id, character);
      localStorage.setItem(storageKey(), JSON.stringify(newProgress));
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