export type Visibility = "private" | "club";

export type PitchType = "full" | "half" | "box";

export type ArrowType = "pass" | "run" | "dribble";

export interface BaseDiagramObject {
  id: string;
  x: number; // In viewBox units 0..1000
  y: number; // In viewBox units 0..600
}

export interface PlayerObject extends BaseDiagramObject {
  type: "player";
  team: "teamA" | "teamB" | "neutral";
  number?: string;
  label?: string;
}

export interface GoalkeeperObject extends BaseDiagramObject {
  type: "goalkeeper";
  team: "teamA" | "teamB";
  label?: string;
}

export interface BallObject extends BaseDiagramObject {
  type: "ball";
}

export interface ConeObject extends BaseDiagramObject {
  type: "cone";
  color?: "orange" | "yellow" | "white";
}

export interface GoalObject extends BaseDiagramObject {
  type: "goal";
  orientation: "north" | "south" | "east" | "west";
  size?: "mini" | "standard";
}

export interface ArrowObject {
  id: string;
  type: "arrow";
  arrowType: ArrowType;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  label?: string;
}

export interface LabelObject extends BaseDiagramObject {
  type: "label";
  text: string;
}

export type DiagramObject =
  | PlayerObject
  | GoalkeeperObject
  | BallObject
  | ConeObject
  | GoalObject
  | ArrowObject
  | LabelObject;

export interface DiagramDocument {
  version: "1.0";
  pitchType: PitchType;
  viewBox: "0 0 1000 600";
  objects: DiagramObject[];
}

export type ExerciseCategory = string;

export type AgeGroup = string;

export interface Exercise {
  id: string;
  title: string;
  description: string;
  theme: ExerciseCategory;
  ageGroups: AgeGroup[];
  durationMinutes: number;
  playerCount?: {
    min: number;
    max: number;
  };
  equipment: string[];
  playingArea?: string;
  setup: string;
  instructions: string[];
  coachingPoints: string[];
  progressions?: string[];
  diagram?: DiagramDocument;
  diagramDescription?: string;
  visibility: Visibility;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  sourceExerciseId?: string; // If duplicated from another exercise
}
