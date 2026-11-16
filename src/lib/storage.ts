import type { Exercise } from "../types/exercise";
import type { TrainingSession, ExerciseSnapshot } from "../types/session";
import type { ClubPrinciplesData } from "../types/principles";
import type { ClubTaxonomy } from "../types/settings";
import {
  SEED_EXERCISES,
  SEED_SESSIONS,
  SEED_PRINCIPLES,
  DEFAULT_CATEGORIES,
  DEFAULT_AGE_GROUPS,
} from "../data/seedData";

const STORAGE_KEYS = {
  EXERCISES: "football-coach-prototype:v1:exercises",
  SESSIONS: "football-coach-prototype:v1:sessions",
  PRINCIPLES: "football-coach-prototype:v1:principles",
  TAXONOMIES: "football-coach-prototype:v1:taxonomies",
  INITIALIZED: "football-coach-prototype:v1:initialized",
};

// Safe localStorage helper
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to read from localStorage key "${key}":`, error);
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to write to localStorage key "${key}":`, error);
  }
}

// Default taxonomy fallback
const DEFAULT_TAXONOMY: ClubTaxonomy = {
  categories: DEFAULT_CATEGORIES,
  ageGroups: DEFAULT_AGE_GROUPS,
};

// Ensure initial seed data is loaded once
export function initializeStorage(): void {
  const isInitialized = safeGetItem(STORAGE_KEYS.INITIALIZED);
  if (!isInitialized) {
    if (!safeGetItem(STORAGE_KEYS.EXERCISES)) {
      safeSetItem(STORAGE_KEYS.EXERCISES, JSON.stringify(SEED_EXERCISES));
    }
    if (!safeGetItem(STORAGE_KEYS.SESSIONS)) {
      safeSetItem(STORAGE_KEYS.SESSIONS, JSON.stringify(SEED_SESSIONS));
    }
    if (!safeGetItem(STORAGE_KEYS.PRINCIPLES)) {
      safeSetItem(STORAGE_KEYS.PRINCIPLES, JSON.stringify(SEED_PRINCIPLES));
    }
    if (!safeGetItem(STORAGE_KEYS.TAXONOMIES)) {
      safeSetItem(STORAGE_KEYS.TAXONOMIES, JSON.stringify(DEFAULT_TAXONOMY));
    }
    safeSetItem(STORAGE_KEYS.INITIALIZED, "true");
  }
}

// Reset everything to seed data
export function resetDemoData(): void {
  safeSetItem(STORAGE_KEYS.EXERCISES, JSON.stringify(SEED_EXERCISES));
  safeSetItem(STORAGE_KEYS.SESSIONS, JSON.stringify(SEED_SESSIONS));
  safeSetItem(STORAGE_KEYS.PRINCIPLES, JSON.stringify(SEED_PRINCIPLES));
  safeSetItem(STORAGE_KEYS.TAXONOMIES, JSON.stringify(DEFAULT_TAXONOMY));
  safeSetItem(STORAGE_KEYS.INITIALIZED, "true");
}

/* ==================== TAXONOMIES (CATEGORIES & AGE GROUPS) ==================== */

export function getTaxonomies(): ClubTaxonomy {
  initializeStorage();
  const raw = safeGetItem(STORAGE_KEYS.TAXONOMIES);
  if (!raw) return DEFAULT_TAXONOMY;
  try {
    const parsed = JSON.parse(raw) as ClubTaxonomy;
    return {
      categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
      ageGroups: parsed.ageGroups?.length ? parsed.ageGroups : DEFAULT_AGE_GROUPS,
    };
  } catch (e) {
    console.error("Error parsing taxonomies from storage", e);
    return DEFAULT_TAXONOMY;
  }
}

export function saveTaxonomies(taxonomies: ClubTaxonomy): void {
  safeSetItem(STORAGE_KEYS.TAXONOMIES, JSON.stringify(taxonomies));
}

// Add a new Category
export function addCategory(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;
  const current = getTaxonomies();
  if (current.categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
    return false; // Already exists
  }
  current.categories.push(trimmed);
  saveTaxonomies(current);
  return true;
}

// Update / Rename Category (and cascade to all exercises and session snapshots)
export function updateCategory(oldName: string, newName: string): boolean {
  const trimmed = newName.trim();
  if (!trimmed || oldName === trimmed) return false;
  const current = getTaxonomies();
  const index = current.categories.indexOf(oldName);
  if (index === -1) return false;

  current.categories[index] = trimmed;
  saveTaxonomies(current);

  // Cascade update to exercises
  const exercises = getExercises();
  let exUpdated = false;
  const updatedExercises = exercises.map((ex) => {
    if (ex.theme === oldName) {
      exUpdated = true;
      return { ...ex, theme: trimmed };
    }
    return ex;
  });
  if (exUpdated) {
    safeSetItem(STORAGE_KEYS.EXERCISES, JSON.stringify(updatedExercises));
  }

  // Cascade update to session snapshots
  const sessions = getSessions();
  let sessUpdated = false;
  const updatedSessions = sessions.map((sess) => {
    let sessionChanged = false;
    let sTheme = sess.theme;
    if (sess.theme === oldName) {
      sTheme = trimmed;
      sessionChanged = true;
    }
    const updatedItems = sess.items.map((item) => {
      if (item.exerciseSnapshot.theme === oldName) {
        sessionChanged = true;
        return {
          ...item,
          exerciseSnapshot: {
            ...item.exerciseSnapshot,
            theme: trimmed,
          },
        };
      }
      return item;
    });

    if (sessionChanged) {
      sessUpdated = true;
      return { ...sess, theme: sTheme, items: updatedItems };
    }
    return sess;
  });
  if (sessUpdated) {
    safeSetItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));
  }

  return true;
}

// Delete Category
export function deleteCategory(name: string): boolean {
  const current = getTaxonomies();
  if (current.categories.length <= 1) return false; // Keep at least one
  current.categories = current.categories.filter((c) => c !== name);
  saveTaxonomies(current);
  return true;
}

// Add a new Age Group
export function addAgeGroup(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;
  const current = getTaxonomies();
  if (current.ageGroups.some((a) => a.toLowerCase() === trimmed.toLowerCase())) {
    return false;
  }
  current.ageGroups.push(trimmed);
  saveTaxonomies(current);
  return true;
}

// Update / Rename Age Group (and cascade to exercises and sessions)
export function updateAgeGroup(oldName: string, newName: string): boolean {
  const trimmed = newName.trim();
  if (!trimmed || oldName === trimmed) return false;
  const current = getTaxonomies();
  const index = current.ageGroups.indexOf(oldName);
  if (index === -1) return false;

  current.ageGroups[index] = trimmed;
  saveTaxonomies(current);

  // Cascade to exercises
  const exercises = getExercises();
  let exUpdated = false;
  const updatedExercises = exercises.map((ex) => {
    if (ex.ageGroups.includes(oldName)) {
      exUpdated = true;
      return {
        ...ex,
        ageGroups: ex.ageGroups.map((ag) => (ag === oldName ? trimmed : ag)),
      };
    }
    return ex;
  });
  if (exUpdated) {
    safeSetItem(STORAGE_KEYS.EXERCISES, JSON.stringify(updatedExercises));
  }

  // Cascade to sessions
  const sessions = getSessions();
  let sessUpdated = false;
  const updatedSessions = sessions.map((sess) => {
    if (sess.ageGroup === oldName) {
      sessUpdated = true;
      return { ...sess, ageGroup: trimmed };
    }
    return sess;
  });
  if (sessUpdated) {
    safeSetItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));
  }

  return true;
}

// Delete Age Group
export function deleteAgeGroup(name: string): boolean {
  const current = getTaxonomies();
  if (current.ageGroups.length <= 1) return false; // Keep at least one
  current.ageGroups = current.ageGroups.filter((a) => a !== name);
  saveTaxonomies(current);
  return true;
}

/* ==================== EXERCISES ==================== */

export function getExercises(): Exercise[] {
  initializeStorage();
  const raw = safeGetItem(STORAGE_KEYS.EXERCISES);
  if (!raw) return SEED_EXERCISES;
  try {
    return JSON.parse(raw) as Exercise[];
  } catch (e) {
    console.error("Error parsing exercises from storage", e);
    return SEED_EXERCISES;
  }
}

export function getExerciseById(id: string): Exercise | undefined {
  const list = getExercises();
  return list.find((ex) => ex.id === id);
}

export function saveExercise(exercise: Exercise): void {
  const list = getExercises();
  const index = list.findIndex((ex) => ex.id === exercise.id);
  const now = new Date().toISOString();
  const updatedExercise = { ...exercise, updatedAt: now };

  if (index >= 0) {
    list[index] = updatedExercise;
  } else {
    list.unshift(updatedExercise);
  }
  safeSetItem(STORAGE_KEYS.EXERCISES, JSON.stringify(list));
}

export function deleteExercise(id: string): void {
  const list = getExercises();
  const filtered = list.filter((ex) => ex.id !== id);
  safeSetItem(STORAGE_KEYS.EXERCISES, JSON.stringify(filtered));
}

export function duplicateExercise(sourceId: string, newTitleSuffix = " (Copy)"): Exercise | null {
  const source = getExerciseById(sourceId);
  if (!source) return null;

  const now = new Date().toISOString();
  const newId = `ex-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const duplicate: Exercise = {
    ...source,
    id: newId,
    title: `${source.title}${newTitleSuffix}`,
    visibility: "private", // Duplicated copies are private by default per spec
    creatorName: "Demo Coach",
    createdAt: now,
    updatedAt: now,
    sourceExerciseId: source.id,
    diagram: source.diagram ? JSON.parse(JSON.stringify(source.diagram)) : undefined,
  };

  saveExercise(duplicate);
  return duplicate;
}

/* ==================== TRAINING SESSIONS ==================== */

export function getSessions(): TrainingSession[] {
  initializeStorage();
  const raw = safeGetItem(STORAGE_KEYS.SESSIONS);
  if (!raw) return SEED_SESSIONS;
  try {
    return JSON.parse(raw) as TrainingSession[];
  } catch (e) {
    console.error("Error parsing sessions from storage", e);
    return SEED_SESSIONS;
  }
}

export function getSessionById(id: string): TrainingSession | undefined {
  const list = getSessions();
  return list.find((s) => s.id === id);
}

export function saveSession(session: TrainingSession): void {
  const list = getSessions();
  const index = list.findIndex((s) => s.id === session.id);
  const now = new Date().toISOString();
  const updatedSession = { ...session, updatedAt: now };

  if (index >= 0) {
    list[index] = updatedSession;
  } else {
    list.unshift(updatedSession);
  }
  safeSetItem(STORAGE_KEYS.SESSIONS, JSON.stringify(list));
}

export function deleteSession(id: string): void {
  const list = getSessions();
  const filtered = list.filter((s) => s.id !== id);
  safeSetItem(STORAGE_KEYS.SESSIONS, JSON.stringify(filtered));
}

export function duplicateSession(sourceId: string, newTitleSuffix = " (Copy)"): TrainingSession | null {
  const source = getSessionById(sourceId);
  if (!source) return null;

  const now = new Date().toISOString();
  const newId = `sess-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const duplicate: TrainingSession = {
    ...source,
    id: newId,
    title: `${source.title}${newTitleSuffix}`,
    visibility: "private",
    creatorName: "Demo Coach",
    createdAt: now,
    updatedAt: now,
    sourceSessionId: source.id,
    items: JSON.parse(JSON.stringify(source.items)),
  };

  saveSession(duplicate);
  return duplicate;
}

// Create an exercise snapshot for inclusion in a session item
export function createExerciseSnapshot(exercise: Exercise): ExerciseSnapshot {
  return {
    id: exercise.id,
    title: exercise.title,
    description: exercise.description,
    theme: exercise.theme,
    durationMinutes: exercise.durationMinutes,
    setup: exercise.setup,
    instructions: [...exercise.instructions],
    coachingPoints: [...exercise.coachingPoints],
    diagram: exercise.diagram ? JSON.parse(JSON.stringify(exercise.diagram)) : undefined,
    diagramDescription: exercise.diagramDescription,
  };
}

/* ==================== CLUB PRINCIPLES ==================== */

export function getClubPrinciples(): ClubPrinciplesData {
  initializeStorage();
  const raw = safeGetItem(STORAGE_KEYS.PRINCIPLES);
  if (!raw) return SEED_PRINCIPLES;
  try {
    return JSON.parse(raw) as ClubPrinciplesData;
  } catch (e) {
    console.error("Error parsing principles from storage", e);
    return SEED_PRINCIPLES;
  }
}

export function saveClubPrinciples(data: ClubPrinciplesData): void {
  const now = new Date().toISOString();
  const updated = { ...data, updatedAt: now };
  safeSetItem(STORAGE_KEYS.PRINCIPLES, JSON.stringify(updated));
}
