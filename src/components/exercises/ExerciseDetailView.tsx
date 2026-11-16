import { useState } from "react";
import type { Exercise } from "../../types/exercise";
import type { TrainingSession } from "../../types/session";
import {
  ArrowLeft,
  Edit3,
  Copy,
  PlusCircle,
  Share2,
  Trash2,
  Clock,
  Users,
  Target,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { Badge } from "../common/Badge";
import { ConfirmModal } from "../common/ConfirmModal";
import { PitchDiagramView } from "../diagram/PitchDiagramView";

interface ExerciseDetailViewProps {
  exercise: Exercise;
  sessions: TrainingSession[];
  onBack: () => void;
  onEdit: (exercise: Exercise) => void;
  onDuplicate: (exerciseId: string) => void;
  onToggleVisibility: (exercise: Exercise) => void;
  onDelete: (exerciseId: string) => void;
  onAddToSession: (exercise: Exercise, sessionId: string) => void;
}

export function ExerciseDetailView({
  exercise,
  sessions,
  onBack,
  onEdit,
  onDuplicate,
  onToggleVisibility,
  onDelete,
  onAddToSession,
}: ExerciseDetailViewProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addToSessionOpen, setAddToSessionOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || "");

  const handleConfirmAddToSession = () => {
    if (selectedSessionId) {
      onAddToSession(exercise, selectedSessionId);
      setAddToSessionOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top Navigation & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--fc-border)] pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--fc-text)] hover:text-[var(--fc-forest)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <ArrowLeft className="size-4" />
          <span>Back to exercises</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add to Session Button */}
          <button
            type="button"
            onClick={() => setAddToSessionOpen(true)}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-xs font-semibold text-[var(--fc-text)] hover:bg-[#f7f9f7] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            <PlusCircle className="size-3.5 text-[var(--fc-green)]" />
            <span>Add to session</span>
          </button>

          {/* Duplicate Button */}
          <button
            type="button"
            onClick={() => onDuplicate(exercise.id)}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-xs font-semibold text-[var(--fc-text)] hover:bg-[#f7f9f7] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            <Copy className="size-3.5 text-[var(--fc-text-muted)]" />
            <span>Duplicate</span>
          </button>

          {/* Toggle Visibility (Private / Club) */}
          <button
            type="button"
            onClick={() => onToggleVisibility(exercise)}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-xs font-semibold text-[var(--fc-text)] hover:bg-[#f7f9f7] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
            title={exercise.visibility === "club" ? "Make private" : "Share with club"}
          >
            <Share2 className="size-3.5 text-[var(--fc-forest)]" />
            <span>{exercise.visibility === "club" ? "Make private" : "Share with club"}</span>
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit(exercise)}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[var(--fc-green)] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[var(--fc-forest)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            <Edit3 className="size-3.5" />
            <span>Edit exercise</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            aria-label="Delete exercise"
            className="inline-flex h-10 size-10 items-center justify-center rounded-lg border border-[#fecaca] bg-[#fef3f2] text-[#b42318] hover:bg-[#fee2e2] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-2xl border border-[var(--fc-border)] bg-white p-6 md:p-8 shadow-xs space-y-6">
        {/* Header Metadata */}
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--fc-forest)]">
              {exercise.theme}
            </span>
            <Badge variant={exercise.visibility === "club" ? "club" : "neutral"}>
              {exercise.visibility === "club" ? "Club shared" : "Private (Draft)"}
            </Badge>
            <span className="text-xs text-[var(--fc-text-muted)]">
              Created by {exercise.creatorName}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--fc-text)]">
            {exercise.title}
          </h1>

          <p className="mt-2 text-base leading-relaxed text-[var(--fc-text-muted)]">
            {exercise.description}
          </p>
        </div>

        {/* Quick Facts Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-[var(--fc-border)] bg-[#f7f9f7] p-4 text-xs">
          <div>
            <span className="block font-semibold text-[var(--fc-text-muted)]">Duration</span>
            <span className="mt-0.5 flex items-center gap-1 text-sm font-bold text-[var(--fc-text)]">
              <Clock className="size-4 text-[var(--fc-green)]" />
              {exercise.durationMinutes} mins
            </span>
          </div>

          <div>
            <span className="block font-semibold text-[var(--fc-text-muted)]">Player Count</span>
            <span className="mt-0.5 flex items-center gap-1 text-sm font-bold text-[var(--fc-text)]">
              <Users className="size-4 text-[var(--fc-green)]" />
              {exercise.playerCount ? `${exercise.playerCount.min}–${exercise.playerCount.max} players` : "Flexible"}
            </span>
          </div>

          <div>
            <span className="block font-semibold text-[var(--fc-text-muted)]">Age Groups</span>
            <span className="mt-0.5 block text-sm font-bold text-[var(--fc-text)]">
              {exercise.ageGroups.join(", ")}
            </span>
          </div>

          <div>
            <span className="block font-semibold text-[var(--fc-text-muted)]">Playing Area</span>
            <span className="mt-0.5 block text-sm font-bold text-[var(--fc-text)]">
              {exercise.playingArea || "Standard Area"}
            </span>
          </div>
        </div>

        {/* Tactical Diagram */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--fc-text)]">Tactical Diagram</h2>
            <span className="text-xs text-[var(--fc-text-muted)]">Static pitch layout</span>
          </div>

          <PitchDiagramView diagram={exercise.diagram} title={exercise.title} />

          {/* Written Diagram Description (Essential Accessibility Requirement) */}
          {exercise.diagramDescription && (
            <div className="rounded-lg border border-[var(--fc-border)] bg-[#f7f9f7] p-3 text-xs text-[var(--fc-text)] leading-relaxed">
              <span className="font-bold text-[var(--fc-forest)]">Diagram movement summary: </span>
              {exercise.diagramDescription}
            </div>
          )}
        </div>

        {/* Setup and Organisation */}
        <div className="space-y-2 pt-2 border-t border-[var(--fc-border)]">
          <h2 className="text-base font-bold text-[var(--fc-text)]">Setup & Organisation</h2>
          <p className="text-sm leading-relaxed text-[var(--fc-text)] bg-white p-3 rounded-lg border border-[var(--fc-border)]">
            {exercise.setup}
          </p>
          {exercise.equipment && exercise.equipment.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-semibold text-[var(--fc-text-muted)] mr-1">Equipment:</span>
              {exercise.equipment.map((item, idx) => (
                <span
                  key={idx}
                  className="rounded bg-[#f0f3f0] px-2 py-0.5 text-xs text-[var(--fc-text)] border border-[var(--fc-border)]"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Numbered Step-by-Step Instructions */}
        <div className="space-y-3 pt-2 border-t border-[var(--fc-border)]">
          <h2 className="text-base font-bold text-[var(--fc-text)]">Instructions</h2>
          <ol className="space-y-2.5">
            {exercise.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-[var(--fc-text)]">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--fc-pale-green)] text-xs font-bold text-[var(--fc-forest)]">
                  {idx + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Coaching Points */}
        <div className="space-y-3 pt-2 border-t border-[var(--fc-border)]">
          <h2 className="text-base font-bold text-[var(--fc-text)]">Key Coaching Points</h2>
          <ul className="space-y-2">
            {exercise.coachingPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-[var(--fc-text)]">
                <CheckCircle2 className="size-4 text-[var(--fc-green)] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Progressions / Variations */}
        {exercise.progressions && exercise.progressions.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[var(--fc-border)]">
            <h2 className="text-base font-bold text-[var(--fc-text)]">Progressions & Variations</h2>
            <ul className="space-y-2">
              {exercise.progressions.map((prog, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-[var(--fc-text-muted)]">
                  <Target className="size-4 text-[var(--fc-forest)] shrink-0 mt-0.5" />
                  <span>{prog}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Add to Training Session Modal */}
      {addToSessionOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-to-session-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-xl border border-[var(--fc-border)] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-[var(--fc-pale-green)] text-[var(--fc-forest)]">
                <Layers className="size-5" />
              </div>
              <div>
                <h3 id="add-to-session-title" className="text-lg font-bold text-[var(--fc-text)]">
                  Add Exercise to Session
                </h3>
                <p className="text-xs text-[var(--fc-text-muted)]">
                  Choose a training session from your library.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label htmlFor="session-select" className="text-xs font-bold text-[var(--fc-text)]">
                Select Training Session
              </label>
              <select
                id="session-select"
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="w-full h-11 rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.ageGroup})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[var(--fc-border)]">
              <button
                type="button"
                onClick={() => setAddToSessionOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--fc-border)] bg-white px-4 text-xs font-semibold text-[var(--fc-text)] hover:bg-[#f7f9f7]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAddToSession}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--fc-green)] px-4 text-xs font-semibold text-white hover:bg-[var(--fc-forest)]"
              >
                Add to session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title={`Delete "${exercise.title}"?`}
        description="Are you sure you want to delete this exercise from your local library? This action cannot be undone."
        confirmLabel="Delete exercise"
        cancelLabel="Keep exercise"
        isDestructive={true}
        onConfirm={() => {
          onDelete(exercise.id);
          setDeleteModalOpen(false);
        }}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
