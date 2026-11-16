import type { Exercise } from "../types/exercise";
import type { TrainingSession, ExerciseSnapshot } from "../types/session";
import type { ClubPrinciplesData } from "../types/principles";
import { SEED_EXERCISES, SEED_SESSIONS, SEED_PRINCIPLES } from "../data/seedData";

const STORAGE_KEYS = {
  EXERCISES: "football-coach-prototype:v1:exercises",
  SESSIONS: "football-coach-prototype:v1:sessions",
  PRINCIPLES: "football-coach-prototype:v1:principles",
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
    safeSetItem(STORAGE_KEYS.INITIALIZED, "true");
  }
}

// Reset everything to seed data
export function resetDemoData(): void {
  safeSetItem(STORAGE_KEYS.EXERCISES, JSON.stringify(SEED_EXERCISES));
  safeSetItem(STORAGE_KEYS.SESSIONS, JSON.stringify(SEED_SESSIONS));
  safeSetItem(STORAGE_KEYS.PRINCIPLES, JSON.stringify(SEED_PRINCIPLES));
  safeSetItem(STORAGE_KEYS.INITIALIZED, "true");
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
