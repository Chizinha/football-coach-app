import { useState, type FormEvent } from "react";
import type { TrainingSession, SessionExercise } from "../../types/session";
import type { Exercise, Visibility } from "../../types/exercise";
import { createExerciseSnapshot } from "../../lib/storage";
import { generateUniqueId } from "../../lib/utils";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Clock,
  Layers,
  AlertCircle,
} from "lucide-react";

interface SessionBuilderViewProps {
  initialSession?: TrainingSession | null;
  availableExercises: Exercise[];
  onSave: (session: TrainingSession) => void;
  onCancel: () => void;
}

export function SessionBuilderView({
  initialSession,
  availableExercises,
  onSave,
  onCancel,
}: SessionBuilderViewProps) {
  const isEditing = Boolean(initialSession);

  // Form State
  const [title, setTitle] = useState(initialSession?.title || "");
  const [description, setDescription] = useState(initialSession?.description || "");
  const [theme, setTheme] = useState(initialSession?.theme || "Passing & Positional Play");
  const [ageGroup, setAgeGroup] = useState(initialSession?.ageGroup || "U14–U16");
  const [visibility, setVisibility] = useState<Visibility>(initialSession?.visibility || "private");
  const [items, setItems] = useState<SessionExercise[]>(
    initialSession?.items || []
  );

  // Modal for adding exercises to session
  const [addExerciseModalOpen, setAddExerciseModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic Total Duration calculation
  const totalDuration = items.reduce(
    (sum, item) => sum + (Number(item.plannedDurationMinutes) || 0),
    0
  );

  // Reorder Exercises (Explicit Move Up / Move Down buttons per accessibility spec)
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    // re-index order
    newItems.forEach((it, i) => (it.order = i + 1));
    setItems(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    // re-index order
    newItems.forEach((it, i) => (it.order = i + 1));
    setItems(newItems);
  };

  // Remove item
  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    newItems.forEach((it, i) => (it.order = i + 1));
    setItems(newItems);
  };

  // Update planned duration of item
  const handleDurationChange = (index: number, duration: number) => {
    const newItems = [...items];
    newItems[index].plannedDurationMinutes = duration;
    setItems(newItems);
  };

  // Update session notes for item
  const handleNotesChange = (index: number, notes: string) => {
    const newItems = [...items];
    newItems[index].sessionNotes = notes;
    setItems(newItems);
  };

  // Add exercise from available library (with snapshotting)
  const handleAddExerciseToSession = (exercise: Exercise) => {
    const newItem: SessionExercise = {
      id: generateUniqueId("sitem"),
      sourceExerciseId: exercise.id,
      sourceVisibility: exercise.visibility,
      order: items.length + 1,
      plannedDurationMinutes: exercise.durationMinutes || 15,
      sessionNotes: "",
      exerciseSnapshot: createExerciseSnapshot(exercise),
    };
    setItems([...items, newItem]);
    setAddExerciseModalOpen(false);
  };

  // Submit Handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Session title is required.";
    }

    if (items.length === 0) {
      newErrors.items = "Please add at least one exercise to the session plan.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const now = new Date().toISOString();
    const sessionToSave: TrainingSession = {
      id: initialSession?.id || `sess-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || "Football training session plan.",
      theme: theme.trim(),
      ageGroup: ageGroup.trim(),
      visibility,
      creatorName: initialSession?.creatorName || "Demo Coach",
      items,
      createdAt: initialSession?.createdAt || now,
      updatedAt: now,
    };

    onSave(sessionToSave);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[var(--fc-border)] pb-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--fc-text)] hover:text-[var(--fc-forest)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <ArrowLeft className="size-4" />
          <span>Cancel & Back</span>
        </button>

        <h1 className="text-xl font-bold text-[var(--fc-text)]">
          {isEditing ? "Edit Training Session" : "Build Training Session"}
        </h1>
      </div>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-[#fecaca] bg-[#fef3f2] p-4 text-sm text-[#b42318] space-y-1"
        >
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="size-5" />
            <span>Please correct the errors before saving:</span>
          </div>
          <ul className="list-disc pl-7 text-xs space-y-1">
            {Object.values(errors).map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Builder Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Session Meta */}
        <div className="rounded-xl border border-[var(--fc-border)] bg-white p-6 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[var(--fc-text)] border-b border-[var(--fc-border)] pb-2">
            1. Session Overview
          </h2>

          <div>
            <label htmlFor="sess-title" className="block text-sm font-bold text-[var(--fc-text)]">
              Session Title <span className="text-[#b42318]">*</span>
            </label>
            <input
              id="sess-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Attacking Overloads & Wing Delivery"
              className={`mt-1.5 h-11 w-full rounded-lg border px-3 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)] ${
                errors.title ? "border-[#b42318]" : "border-[var(--fc-border-strong)]"
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-[#b42318]">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="sess-desc" className="block text-sm font-bold text-[var(--fc-text)]">
              Session Objective & Coaching Aim
            </label>
            <textarea
              id="sess-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overall focus and session progression objective..."
              className="mt-1.5 w-full rounded-lg border border-[var(--fc-border-strong)] p-3 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="sess-theme" className="block text-sm font-bold text-[var(--fc-text)]">
                Main Theme
              </label>
              <input
                id="sess-theme"
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. Passing & Transition"
                className="mt-1.5 h-11 w-full rounded-lg border border-[var(--fc-border-strong)] px-3 text-sm text-[var(--fc-text)]"
              />
            </div>

            <div>
              <label htmlFor="sess-age" className="block text-sm font-bold text-[var(--fc-text)]">
                Target Age Group
              </label>
              <input
                id="sess-age"
                type="text"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                placeholder="e.g. U14–U16"
                className="mt-1.5 h-11 w-full rounded-lg border border-[var(--fc-border-strong)] px-3 text-sm text-[var(--fc-text)]"
              />
            </div>

            <div>
              <label htmlFor="sess-vis" className="block text-sm font-bold text-[var(--fc-text)]">
                Visibility
              </label>
              <select
                id="sess-vis"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                className="mt-1.5 h-11 w-full rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-sm text-[var(--fc-text)]"
              >
                <option value="private">Private (Only you)</option>
                <option value="club">Shared with club</option>
              </select>
            </div>
          </div>
        </div>

        {/* Exercises Sequence Builder */}
        <div className="rounded-xl border border-[var(--fc-border)] bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--fc-border)] pb-3">
            <div>
              <h2 className="text-base font-bold text-[var(--fc-text)]">
                2. Exercise Plan & Timeline
              </h2>
              <p className="text-xs text-[var(--fc-text-muted)] mt-0.5">
                Reorder drills using the Move Up/Down buttons. Adjust durations and add coach notes.
              </p>
            </div>

            {/* Total Duration Counter Badge */}
            <div className="flex items-center gap-2 rounded-lg bg-[var(--fc-pale-green)] px-3.5 py-2 text-sm font-bold text-[var(--fc-forest)]">
              <Clock className="size-4" />
              <span>Total: {totalDuration} mins</span>
            </div>
          </div>

          {errors.items && <p className="text-xs text-[#b42318]">{errors.items}</p>}

          {/* Items List */}
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[var(--fc-border)] bg-[#f7f9f7] p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center rounded-full bg-[var(--fc-forest)] text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-sm text-[var(--fc-text)]">
                          {item.exerciseSnapshot.title}
                        </span>
                        <span className="ml-2 text-xs font-semibold text-[var(--fc-forest)]">
                          ({item.exerciseSnapshot.theme})
                        </span>
                      </div>
                    </div>

                    {/* Reorder and Delete controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        aria-label={`Move drill ${idx + 1} up`}
                        className="p-1.5 rounded-md border border-[var(--fc-border)] bg-white text-[var(--fc-text)] disabled:opacity-40 hover:bg-[#e8f2ea] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                      >
                        <ArrowUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === items.length - 1}
                        aria-label={`Move drill ${idx + 1} down`}
                        className="p-1.5 rounded-md border border-[var(--fc-border)] bg-white text-[var(--fc-text)] disabled:opacity-40 hover:bg-[#e8f2ea] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                      >
                        <ArrowDown className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        aria-label={`Remove drill ${idx + 1}`}
                        className="p-1.5 rounded-md border border-[#fecaca] bg-white text-[#b42318] hover:bg-[#fef3f2]"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Planned Duration & Coach Note per drill */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-[var(--fc-border)]">
                    <div className="sm:col-span-1">
                      <label htmlFor={`dur-${idx}`} className="block text-xs font-bold text-[var(--fc-text)]">
                        Planned Mins
                      </label>
                      <input
                        id={`dur-${idx}`}
                        type="number"
                        min="1"
                        max="90"
                        value={item.plannedDurationMinutes}
                        onChange={(e) => handleDurationChange(idx, Number(e.target.value))}
                        className="mt-1 h-9 w-full rounded-md border border-[var(--fc-border-strong)] bg-white px-2.5 text-xs text-[var(--fc-text)]"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor={`notes-${idx}`} className="block text-xs font-bold text-[var(--fc-text)]">
                        Session Notes / Focus Points
                      </label>
                      <input
                        id={`notes-${idx}`}
                        type="text"
                        value={item.sessionNotes || ""}
                        onChange={(e) => handleNotesChange(idx, e.target.value)}
                        placeholder="e.g. Focus on 2-touch limit and dynamic support angles..."
                        className="mt-1 h-9 w-full rounded-md border border-[var(--fc-border-strong)] bg-white px-3 text-xs text-[var(--fc-text)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--fc-border)] bg-[#f7f9f7] p-8 text-center">
              <Layers className="size-8 text-[var(--fc-text-muted)] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[var(--fc-text)]">No exercises in this session plan yet</p>
              <p className="text-xs text-[var(--fc-text-muted)] mt-1">
                Add exercises from your library or the club collection below.
              </p>
            </div>
          )}

          {/* Add Exercise Action Button */}
          <button
            type="button"
            onClick={() => setAddExerciseModalOpen(true)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--fc-forest)] bg-[var(--fc-pale-green)]/30 text-sm font-bold text-[var(--fc-forest)] hover:bg-[var(--fc-pale-green)]/60 transition"
          >
            <Plus className="size-4" />
            <span>Add exercise to session</span>
          </button>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--fc-border)]">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-[var(--fc-border-strong)] bg-white px-5 text-sm font-semibold text-[var(--fc-text)] hover:bg-[#f7f9f7] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--fc-green)] px-6 text-sm font-semibold text-white shadow-xs hover:bg-[var(--fc-forest)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            <Save className="size-4" />
            <span>Save training session</span>
          </button>
        </div>
      </form>

      {/* Add Exercise Modal */}
      {addExerciseModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-drill-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-[var(--fc-border)] bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--fc-border)] p-5">
              <div>
                <h3 id="add-drill-title" className="text-lg font-bold text-[var(--fc-text)]">
                  Add Exercise to Session
                </h3>
                <p className="text-xs text-[var(--fc-text-muted)] mt-0.5">
                  Select an exercise to snapshot into this session plan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddExerciseModalOpen(false)}
                className="text-xs font-semibold text-[var(--fc-text-muted)] hover:text-[var(--fc-text)]"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {availableExercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => handleAddExerciseToSession(ex)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleAddExerciseToSession(ex);
                    }
                  }}
                  className="flex items-center justify-between rounded-xl border border-[var(--fc-border)] p-4 cursor-pointer hover:border-[#6f8374] hover:bg-[#f7f9f7] transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[var(--fc-text)]">
                        {ex.title}
                      </span>
                      <span className="rounded bg-[#e8f2ea] px-2 py-0.5 text-[10px] font-bold text-[var(--fc-forest)]">
                        {ex.theme}
                      </span>
                    </div>
                    <p className="line-clamp-1 text-xs text-[var(--fc-text-muted)]">
                      {ex.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[var(--fc-text-muted)]">
                      <span>{ex.durationMinutes} mins</span>
                      <span>•</span>
                      <span>{ex.ageGroups.join(", ")}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddExerciseToSession(ex);
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--fc-green)] px-3 text-xs font-semibold text-white shadow-xs hover:bg-[var(--fc-forest)]"
                  >
                    <Plus className="size-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
