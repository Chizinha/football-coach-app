import { useState, type FormEvent } from "react";
import type {
  Exercise,
  ExerciseCategory,
  AgeGroup,
  DiagramDocument,
  Visibility,
} from "../../types/exercise";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { PitchDiagramEditor } from "../diagram/PitchDiagramEditor";

interface ExerciseFormViewProps {
  initialExercise?: Exercise | null;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

const CATEGORIES: ExerciseCategory[] = [
  "Warm-up",
  "Passing & Receiving",
  "Possession",
  "Dribbling & 1v1",
  "Defending",
  "Shooting & Finishing",
  "Transition",
];

const AGE_OPTIONS: AgeGroup[] = [
  "U7–U9",
  "U10–U12",
  "U13–U15",
  "U16–U19",
  "Senior",
  "All ages",
];

export function ExerciseFormView({
  initialExercise,
  onSave,
  onCancel,
}: ExerciseFormViewProps) {
  const isEditing = Boolean(initialExercise);

  // Form States
  const [title, setTitle] = useState(initialExercise?.title || "");
  const [description, setDescription] = useState(initialExercise?.description || "");
  const [theme, setTheme] = useState<ExerciseCategory>(initialExercise?.theme || "Passing & Receiving");
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>(initialExercise?.ageGroups || ["U13–U15"]);
  const [durationMinutes, setDurationMinutes] = useState(initialExercise?.durationMinutes || 15);
  const [playerMin, setPlayerMin] = useState(initialExercise?.playerCount?.min || 8);
  const [playerMax, setPlayerMax] = useState(initialExercise?.playerCount?.max || 12);
  const [playingArea, setPlayingArea] = useState(initialExercise?.playingArea || "20m x 20m grid");
  const [equipmentInput, setEquipmentInput] = useState(initialExercise?.equipment?.join(", ") || "Cones, Balls, Bibs");
  const [setup, setSetup] = useState(initialExercise?.setup || "");
  const [instructions, setInstructions] = useState<string[]>(
    initialExercise?.instructions && initialExercise.instructions.length > 0
      ? initialExercise.instructions
      : [""]
  );
  const [coachingPoints, setCoachingPoints] = useState<string[]>(
    initialExercise?.coachingPoints && initialExercise.coachingPoints.length > 0
      ? initialExercise.coachingPoints
      : [""]
  );
  const [progressions, setProgressions] = useState<string[]>(
    initialExercise?.progressions || []
  );
  const [diagram, setDiagram] = useState<DiagramDocument | undefined>(
    initialExercise?.diagram || {
      version: "1.0",
      pitchType: "half",
      viewBox: "0 0 1000 600",
      objects: [],
    }
  );
  const [diagramDescription, setDiagramDescription] = useState(initialExercise?.diagramDescription || "");
  const [visibility, setVisibility] = useState<Visibility>(initialExercise?.visibility || "private");

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic instruction items
  const handleInstructionChange = (index: number, val: string) => {
    const updated = [...instructions];
    updated[index] = val;
    setInstructions(updated);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleRemoveInstruction = (index: number) => {
    if (instructions.length <= 1) return;
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  // Dynamic coaching points
  const handleCoachingPointChange = (index: number, val: string) => {
    const updated = [...coachingPoints];
    updated[index] = val;
    setCoachingPoints(updated);
  };

  const handleAddCoachingPoint = () => {
    setCoachingPoints([...coachingPoints, ""]);
  };

  const handleRemoveCoachingPoint = (index: number) => {
    setCoachingPoints(coachingPoints.filter((_, i) => i !== index));
  };

  // Dynamic progressions
  const handleProgressionChange = (index: number, val: string) => {
    const updated = [...progressions];
    updated[index] = val;
    setProgressions(updated);
  };

  const handleAddProgression = () => {
    setProgressions([...progressions, ""]);
  };

  const handleRemoveProgression = (index: number) => {
    setProgressions(progressions.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Exercise title is required.";
    }

    const cleanInstructions = instructions.filter((i) => i.trim().length > 0);
    if (cleanInstructions.length === 0) {
      newErrors.instructions = "At least one instruction step is required.";
    }

    if (diagram && diagram.objects.length > 0 && !diagramDescription.trim()) {
      newErrors.diagramDescription = "Please provide a written description explaining the diagram's movement.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const now = new Date().toISOString();
    const equipment = equipmentInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const exerciseToSave: Exercise = {
      id: initialExercise?.id || `ex-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || "Football coaching exercise",
      theme,
      ageGroups: ageGroups.length > 0 ? ageGroups : ["All ages"],
      durationMinutes: Number(durationMinutes) || 15,
      playerCount: {
        min: Number(playerMin) || 6,
        max: Number(playerMax) || 12,
      },
      equipment,
      playingArea: playingArea.trim(),
      setup: setup.trim() || "Standard exercise setup.",
      instructions: cleanInstructions,
      coachingPoints: coachingPoints.filter((p) => p.trim().length > 0),
      progressions: progressions.filter((p) => p.trim().length > 0),
      diagram,
      diagramDescription: diagramDescription.trim(),
      visibility,
      creatorName: initialExercise?.creatorName || "Demo Coach",
      createdAt: initialExercise?.createdAt || now,
      updatedAt: now,
    };

    onSave(exerciseToSave);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
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
          {isEditing ? "Edit Exercise" : "Create New Exercise"}
        </h1>
      </div>

      {/* Validation Error Summary */}
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="rounded-xl border border-[var(--fc-border)] bg-white p-6 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[var(--fc-text)] border-b border-[var(--fc-border)] pb-2">
            1. Basic Information
          </h2>

          {/* Title */}
          <div>
            <label htmlFor="ex-title" className="block text-sm font-bold text-[var(--fc-text)]">
              Exercise Title <span className="text-[#b42318]">*</span>
            </label>
            <input
              id="ex-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 4v2 Rondo with Counter-Pressing"
              className={`mt-1.5 h-11 w-full rounded-lg border px-3 text-sm text-[var(--fc-text)] placeholder:text-[var(--fc-text-muted)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)] ${
                errors.title ? "border-[#b42318]" : "border-[var(--fc-border-strong)]"
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-[#b42318]">{errors.title}</p>}
          </div>

          {/* Objective / Description */}
          <div>
            <label htmlFor="ex-desc" className="block text-sm font-bold text-[var(--fc-text)]">
              Short Objective / Summary
            </label>
            <textarea
              id="ex-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief explanation of what this exercise achieves (e.g. Develops 1-touch pass rhythm and immediate counter-press)..."
              className="mt-1.5 w-full rounded-lg border border-[var(--fc-border-strong)] p-3 text-sm text-[var(--fc-text)] placeholder:text-[var(--fc-text-muted)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
            />
          </div>

          {/* Theme & Visibility */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ex-theme" className="block text-sm font-bold text-[var(--fc-text)]">
                Theme / Category
              </label>
              <select
                id="ex-theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value as ExerciseCategory)}
                className="mt-1.5 h-11 w-full rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ex-visibility" className="block text-sm font-bold text-[var(--fc-text)]">
                Visibility
              </label>
              <select
                id="ex-visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                className="mt-1.5 h-11 w-full rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
              >
                <option value="private">Private (Only visible to you)</option>
                <option value="club">Shared with club (Visible to all club coaches)</option>
              </select>
            </div>
          </div>

          {/* Age Group & Duration */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="ex-age" className="block text-sm font-bold text-[var(--fc-text)]">
                Primary Age Group
              </label>
              <select
                id="ex-age"
                value={ageGroups[0] || "U13–U15"}
                onChange={(e) => setAgeGroups([e.target.value as AgeGroup])}
                className="mt-1.5 h-11 w-full rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
              >
                {AGE_OPTIONS.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ex-duration" className="block text-sm font-bold text-[var(--fc-text)]">
                Planned Duration (Mins)
              </label>
              <input
                id="ex-duration"
                type="number"
                min="1"
                max="120"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="mt-1.5 h-11 w-full rounded-lg border border-[var(--fc-border-strong)] px-3 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="ex-pmin" className="block text-xs font-bold text-[var(--fc-text)]">
                  Min Players
                </label>
                <input
                  id="ex-pmin"
                  type="number"
                  min="1"
                  max="40"
                  value={playerMin}
                  onChange={(e) => setPlayerMin(Number(e.target.value))}
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--fc-border-strong)] px-3 text-sm text-[var(--fc-text)]"
                />
              </div>
              <div>
                <label htmlFor="ex-pmax" className="block text-xs font-bold text-[var(--fc-text)]">
                  Max Players
                </label>
                <input
                  id="ex-pmax"
                  type="number"
                  min="1"
                  max="40"
                  value={playerMax}
                  onChange={(e) => setPlayerMax(Number(e.target.value))}
                  className="mt-1.5 h-11 w-full rounded-lg border border-[var(--fc-border-strong)] px-3 text-sm text-[var(--fc-text)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Pitch Diagram Section */}
        <div className="rounded-xl border border-[var(--fc-border)] bg-white p-6 shadow-xs space-y-4">
          <div className="border-b border-[var(--fc-border)] pb-2">
            <h2 className="text-base font-bold text-[var(--fc-text)]">
              2. Tactical Pitch Diagram
            </h2>
            <p className="text-xs text-[var(--fc-text-muted)] mt-1">
              Add players, cones, balls, and arrows to visualize the exercise.
            </p>
          </div>

          <PitchDiagramEditor diagram={diagram} onChange={(d) => setDiagram(d)} />

          {/* Written Diagram Description */}
          <div>
            <label htmlFor="ex-diag-desc" className="block text-sm font-bold text-[var(--fc-text)]">
              Written Diagram Description <span className="text-[#b42318]">*</span>
            </label>
            <p className="text-xs text-[var(--fc-text-muted)] mt-0.5 mb-1.5">
              Explain the visual setup and movement vectors for accessibility and non-visual reading.
            </p>
            <textarea
              id="ex-diag-desc"
              rows={2}
              value={diagramDescription}
              onChange={(e) => setDiagramDescription(e.target.value)}
              placeholder="e.g. 10x10m square grid with four Team A blue players stationed on outer edges and two Team B red defenders pressing in the central corridor..."
              className={`w-full rounded-lg border p-3 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)] ${
                errors.diagramDescription ? "border-[#b42318]" : "border-[var(--fc-border-strong)]"
              }`}
            />
            {errors.diagramDescription && (
              <p className="mt-1 text-xs text-[#b42318]">{errors.diagramDescription}</p>
            )}
          </div>
        </div>

        {/* Setup, Equipment & Area */}
        <div className="rounded-xl border border-[var(--fc-border)] bg-white p-6 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[var(--fc-text)] border-b border-[var(--fc-border)] pb-2">
            3. Setup & Equipment
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ex-area" className="block text-sm font-bold text-[var(--fc-text)]">
                Playing Area Dimensions
              </label>
              <input
                id="ex-area"
                type="text"
                value={playingArea}
                onChange={(e) => setPlayingArea(e.target.value)}
                placeholder="e.g. 20m x 20m square, Half pitch"
                className="mt-1.5 h-11 w-full rounded-lg border border-[var(--fc-border-strong)] px-3 text-sm text-[var(--fc-text)]"
              />
            </div>

            <div>
              <label htmlFor="ex-equip" className="block text-sm font-bold text-[var(--fc-text)]">
                Equipment Needed (Comma-separated)
              </label>
              <input
                id="ex-equip"
                type="text"
                value={equipmentInput}
                onChange={(e) => setEquipmentInput(e.target.value)}
                placeholder="e.g. 6 Cones, 4 Balls, Pinnies"
                className="mt-1.5 h-11 w-full rounded-lg border border-[var(--fc-border-strong)] px-3 text-sm text-[var(--fc-text)]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="ex-setup" className="block text-sm font-bold text-[var(--fc-text)]">
              Setup & Organisation Details
            </label>
            <textarea
              id="ex-setup"
              rows={3}
              value={setup}
              onChange={(e) => setSetup(e.target.value)}
              placeholder="Describe where cones and stations are placed, player starting positions, and rotations..."
              className="mt-1.5 w-full rounded-lg border border-[var(--fc-border-strong)] p-3 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
            />
          </div>
        </div>

        {/* Instructions & Coaching Points */}
        <div className="rounded-xl border border-[var(--fc-border)] bg-white p-6 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[var(--fc-text)] border-b border-[var(--fc-border)] pb-2">
            4. Instructions & Coaching Points
          </h2>

          {/* Numbered Steps */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-[var(--fc-text)]">
                Numbered Instructions <span className="text-[#b42318]">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddInstruction}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--fc-green)] hover:text-[var(--fc-forest)]"
              >
                <Plus className="size-3.5" />
                <span>Add step</span>
              </button>
            </div>

            <div className="space-y-2">
              {instructions.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--fc-pale-green)] text-xs font-bold text-[var(--fc-forest)]">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleInstructionChange(idx, e.target.value)}
                    placeholder={`Step ${idx + 1} details...`}
                    className="h-10 flex-1 rounded-lg border border-[var(--fc-border-strong)] px-3 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                  />
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(idx)}
                      aria-label={`Remove step ${idx + 1}`}
                      className="p-2 text-[var(--fc-text-muted)] hover:text-[#b42318]"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.instructions && (
              <p className="mt-1 text-xs text-[#b42318]">{errors.instructions}</p>
            )}
          </div>

          {/* Coaching Points */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-[var(--fc-text)]">
                Key Coaching Points
              </label>
              <button
                type="button"
                onClick={handleAddCoachingPoint}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--fc-green)] hover:text-[var(--fc-forest)]"
              >
                <Plus className="size-3.5" />
                <span>Add coaching point</span>
              </button>
            </div>

            <div className="space-y-2">
              {coachingPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[var(--fc-green)] font-bold">•</span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handleCoachingPointChange(idx, e.target.value)}
                    placeholder="e.g. Open body shape to receive across the body..."
                    className="h-10 flex-1 rounded-lg border border-[var(--fc-border-strong)] px-3 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                  />
                  {coachingPoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCoachingPoint(idx)}
                      aria-label="Remove coaching point"
                      className="p-2 text-[var(--fc-text-muted)] hover:text-[#b42318]"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Progressions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-[var(--fc-text)]">
                Progressions & Variations (Optional)
              </label>
              <button
                type="button"
                onClick={handleAddProgression}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--fc-green)] hover:text-[var(--fc-forest)]"
              >
                <Plus className="size-3.5" />
                <span>Add progression</span>
              </button>
            </div>

            <div className="space-y-2">
              {progressions.map((prog, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[var(--fc-forest)] font-bold">→</span>
                  <input
                    type="text"
                    value={prog}
                    onChange={(e) => handleProgressionChange(idx, e.target.value)}
                    placeholder="e.g. Limit attackers to 1-touch or add a recovery defender..."
                    className="h-10 flex-1 rounded-lg border border-[var(--fc-border-strong)] px-3 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveProgression(idx)}
                    aria-label="Remove progression"
                    className="p-2 text-[var(--fc-text-muted)] hover:text-[#b42318]"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
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
            <span>Save exercise</span>
          </button>
        </div>
      </form>
    </div>
  );
}
