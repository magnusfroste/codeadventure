import { CharacterType } from '@/types/game';

export interface ChildProfile {
  id: string;
  name: string;
  character: CharacterType;
}

const PROFILES_KEY = 'kodaventyret-profiles';
const ACTIVE_KEY = 'kodaventyret-active-profile';
const LEGACY_PROGRESS_KEY = 'kodaventyret-progress';

export const progressKeyFor = (id: string) => `kodaventyret-progress-${id}`;

function read(): ChildProfile[] {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
  } catch {
    return [];
  }
}

function write(list: ChildProfile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(list));
}

/** Flytta gamla framsteg (före profiler) till en första profil */
function migrateLegacy() {
  if (read().length > 0) return;
  const legacy = localStorage.getItem(LEGACY_PROGRESS_KEY);
  if (!legacy) return;
  const char = (localStorage.getItem('selectedCharacter') as CharacterType) || 'mouse';
  const profile: ChildProfile = { id: 'p1', name: 'Spelare 1', character: char };
  write([profile]);
  localStorage.setItem(progressKeyFor(profile.id), legacy);
  localStorage.setItem(ACTIVE_KEY, profile.id);
  localStorage.removeItem(LEGACY_PROGRESS_KEY);
}

export function getProfiles(): ChildProfile[] {
  migrateLegacy();
  return read();
}

export function getActiveProfile(): ChildProfile | null {
  const list = getProfiles();
  const id = localStorage.getItem(ACTIVE_KEY);
  return list.find((p) => p.id === id) ?? null;
}

export function setActiveProfile(id: string) {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function createProfile(name: string, character: CharacterType): ChildProfile {
  const profile: ChildProfile = { id: `p${Date.now()}`, name: name.trim(), character };
  write([...getProfiles(), profile]);
  setActiveProfile(profile.id);
  return profile;
}

export function updateProfileCharacter(id: string, character: CharacterType) {
  write(getProfiles().map((p) => (p.id === id ? { ...p, character } : p)));
}

export function deleteProfile(id: string) {
  write(getProfiles().filter((p) => p.id !== id));
  localStorage.removeItem(progressKeyFor(id));
  if (localStorage.getItem(ACTIVE_KEY) === id) localStorage.removeItem(ACTIVE_KEY);
}

export function getProfileStars(id: string): number {
  try {
    const p = JSON.parse(localStorage.getItem(progressKeyFor(id)) || '{}');
    return Object.values((p.levelStars ?? {}) as Record<string, number>).reduce((a, b) => a + b, 0);
  } catch {
    return 0;
  }
}
