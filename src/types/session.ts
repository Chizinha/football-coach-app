import type { DiagramDocument, ExerciseCategory, Visibility } from "./exercise";

export interface ExerciseSnapshot {
  id: string;
  title: string;
  description: string;
  theme: ExerciseCategory;
  durationMinutes: number;
  setup: string;
  instructions: string[];
  coachingPoints: string[];
  diagram?: DiagramDocument;
  diagramDescription?: string;
}

export interface SessionExercise {
  id: string; // Unique ID for this item in the session
  sourceExerciseId: string;
  sourceVisibility: Visibility;
  order: number;
  plannedDurationMinutes: number;
  sessionNotes?: string;
  exerciseSnapshot: ExerciseSnapshot;
}

export interface TrainingSession {
  id: string;
  title: string;
  description: string;
  theme: string;
  ageGroup: string;
  visibility: Visibility;
  creatorName: string;
  items: SessionExercise[];
  createdAt: string;
  updatedAt: string;
  sourceSessionId?: string;
}
