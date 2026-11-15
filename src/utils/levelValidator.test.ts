/// <reference types="bun" />
import { test, expect } from 'bun:test';
import { allLevels } from '../data/levels';
import { findPath } from './levelValidator';
import { createProfile, setActiveProfile, getActiveProfile, getProfiles, progressKeyFor, getProfileStars, tutorialKeyForActiveProfile } from '../lib/profiles';

test('all 18 levels have a path through the ordered goals to home', () => {
  expect(allLevels).toHaveLength(18);
  for (const level of allLevels) {
    const path = findPath(level);
    expect(path?.[path.length - 1]).toEqual(level.homePosition);
    for (const p of path ?? []) {
      expect(['grass', 'water'].includes(level.grid[p.y][p.x].type)).toBe(false);
      expect(level.grid[p.y][p.x].hasObstacle).toBe(false);
    }
  }
});

test('level 6 awards the best score for its actual shortest route of 8 moves', () => {
  const level = allLevels[5];
  expect(level.optimalMoves).toBe(8);
  expect((findPath(level)?.length ?? 0) - 1).toBe(8);
});

test('profile progress survives reload and stays separate for each child', () => {
  const data = new Map<string, string>();
  globalThis.localStorage = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => { data.set(k, v); }, removeItem: (k: string) => { data.delete(k); }, clear: () => data.clear(), key: (i: number) => [...data.keys()][i] ?? null, get length() { return data.size; } };
  const a = createProfile('Martin', 'car');
  localStorage.setItem(progressKeyFor(a.id), JSON.stringify({levelStars: {1:3}, unlockedLevels:[1,2]}));
  const b = createProfile('Kim', 'mouse');
  expect(getProfiles()).toHaveLength(2);
  expect(getProfileStars(b.id)).toBe(0);
  setActiveProfile(a.id);
  expect(getActiveProfile()?.name).toBe('Martin');
  expect(getProfileStars(a.id)).toBe(3);
  expect(JSON.parse(localStorage.getItem(progressKeyFor(a.id)) ?? '{}').unlockedLevels).toEqual([1,2]);
});

test('dismissing instructions for Martin does not dismiss them for Kim', () => {
  const [martin, kim] = getProfiles();
  setActiveProfile(martin.id);
  const key = tutorialKeyForActiveProfile();
  localStorage.setItem(key, JSON.stringify(['guided-1']));
  setActiveProfile(kim.id);
  expect(tutorialKeyForActiveProfile()).not.toBe(key);
  expect(localStorage.getItem(tutorialKeyForActiveProfile())).toBeNull();
  setActiveProfile(martin.id);
  expect(JSON.parse(localStorage.getItem(tutorialKeyForActiveProfile()) ?? '[]')).toEqual(['guided-1']);
});
