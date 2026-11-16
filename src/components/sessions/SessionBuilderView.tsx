import { useState, useMemo, type FormEvent } from "react";
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
  Search,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PitchDiagramView } from "../diagram/PitchDiagramView";

interface SessionBuilderViewProps {
  initialSession?: TrainingSession | null;
  availableExercises: Exercise[];
  categories?: string[];
  ageGroups?: string[];
  onSave: (session: TrainingSession) => void;
  onCancel: () => void;
}

export function SessionBuilderView({
  initialSession,
  availableExercises,
  categories = [],
  ageGroups = [],
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

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Library Browser Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedAge, setSelectedAge] = useState<string>("All");
  const [mobileLibraryOpen, setMobileLibraryOpen] = useState(true);

  // Dynamic Total Duration calculation
  const totalDuration = items.reduce(
    (sum, item) => sum + (Number(item.plannedDurationMinutes) || 0),
    0
  );

  // Set of exercise IDs currently in the session
  const inSessionIds = useMemo(() => {
    return new Set(items.map((it) => it.sourceExerciseId));
  }, [items]);

  // Filtered exercises for the integrated drill library panel
  const filteredExercises = useMemo(() => {
    return availableExercises.filter((ex) => {
      const matchesSearch =
        searchQuery === "" ||
        ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.theme.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === "All" || ex.theme === selectedCategory;

      const matchesAge =
        selectedAge === "All" ||
        ex.ageGroups.includes(selectedAge) ||
        ex.ageGroups.includes("All ages");

      return matchesSearch && matchesCat && matchesAge;
    });
  }, [availableExercises, searchQuery, selectedCategory, selectedAge]);

  // Reorder Exercises (Explicit Move Up / Move Down buttons per WCAG)
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    newItems.forEach((it, i) => (it.order = i + 1));
    setItems(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    newItems.forEach((it, i) => (it.order = i + 1));
    setItems(newItems);
  };

  // Remove drill from session
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

  // Add exercise from library into session timeline
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
    setItems((prev) => [...prev, newItem]);
    if (errors.items) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.items;
        return copy;
      });
    }
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

  // Category list with fallback
  const allCategories = categories.length > 0 ? categories : [
    "Warm-up",
    "Passing & Receiving",
    "Possession",
    "Dribbling & 1v1",
    "Defending",
    "Shooting & Finishing",
    "Transition",
  ];

  // Age group list with fallback
  const allAgeGroups = ageGroups.length > 0 ? ageGroups : [
    "U7–U9",
    "U10–U12",
    "U13–U15",
    "U16–U19",
    "Senior",
    "All ages",
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--fc-border)] pb-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--fc-text)] hover:text-[var(--fc-forest)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <ArrowLeft className="size-4" />
          <span>Cancel & Back</span>
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[var(--fc-text)]">
            {isEditing ? "Edit Training Session" : "Build Training Session"}
          </h1>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--fc-green)] px-5 text-xs font-bold text-white shadow-xs hover:bg-[var(--fc-forest)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            <Save className="size-4" />
            <span>Save session</span>
          </button>
        </div>
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

      {/* Main Dual-Column Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column (Session Details & Timeline) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Session Overview */}
          <section
            aria-labelledby="session-overview-heading"
            className="rounded-xl border border-[var(--fc-border)] bg-white p-5 md:p-6 shadow-xs space-y-4"
          >
            <h2 id="session-overview-heading" className="text-base font-bold text-[var(--fc-text)] border-b border-[var(--fc-border)] pb-2">
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
                className={`mt-1 h-11 w-full rounded-lg border px-3 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)] ${
                  errors.title ? "border-[#b42318]" : "border-[var(--fc-border-strong)]"
                }`}
              />
              {errors.title && <p className="mt-1 text-xs text-[#b42318]">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="sess-desc" className="block text-sm font-bold text-[var(--fc-text)]">
                Session Objective & Aim
              </label>
              <textarea
                id="sess-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Coaching aim and session progression..."
                className="mt-1 w-full rounded-lg border border-[var(--fc-border-strong)] p-2.5 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="sess-theme" className="block text-xs font-bold text-[var(--fc-text)]">
                  Theme
                </label>
                <select
                  id="sess-theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-[var(--fc-border-strong)] bg-white px-2.5 text-xs text-[var(--fc-text)]"
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sess-age" className="block text-xs font-bold text-[var(--fc-text)]">
                  Age Group
                </label>
                <select
                  id="sess-age"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-[var(--fc-border-strong)] bg-white px-2.5 text-xs text-[var(--fc-text)]"
                >
                  {allAgeGroups.map((ag) => (
                    <option key={ag} value={ag}>
                      {ag}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sess-vis" className="block text-xs font-bold text-[var(--fc-text)]">
                  Visibility
                </label>
                <select
                  id="sess-vis"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as Visibility)}
                  className="mt-1 h-10 w-full rounded-lg border border-[var(--fc-border-strong)] bg-white px-2.5 text-xs text-[var(--fc-text)]"
                >
                  <option value="private">Private (Only you)</option>
                  <option value="club">Shared with club</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Session Timeline */}
          <section
            aria-labelledby="session-timeline-heading"
            className="rounded-xl border border-[var(--fc-border)] bg-white p-5 md:p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--fc-border)] pb-3">
              <div>
                <h2 id="session-timeline-heading" className="text-base font-bold text-[var(--fc-text)]">
                  2. Session Timeline ({items.length} {items.length === 1 ? "drill" : "drills"})
                </h2>
                <p className="text-xs text-[var(--fc-text-muted)] mt-0.5">
                  Use the Move Up / Down buttons to order drills. Adjust planned minutes and notes.
                </p>
              </div>

              {/* Total Duration Badge */}
              <div className="flex items-center gap-2 rounded-lg bg-[var(--fc-pale-green)] px-3.5 py-1.5 text-sm font-bold text-[var(--fc-forest)]">
                <Clock className="size-4" />
                <span>Total: {totalDuration} mins</span>
              </div>
            </div>

            {errors.items && <p className="text-xs text-[#b42318]">{errors.items}</p>}

            {/* Drills List */}
            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[var(--fc-border)] bg-[#f7f9f7] p-4 space-y-3 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="flex size-7 items-center justify-center rounded-full bg-[var(--fc-forest)] text-xs font-bold text-white shadow-2xs">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-sm text-[var(--fc-text)]">
                            {item.exerciseSnapshot.title}
                          </span>
                          <span className="ml-2 text-[11px] font-semibold text-[var(--fc-forest)] bg-[var(--fc-pale-green)] px-2 py-0.5 rounded">
                            {item.exerciseSnapshot.theme}
                          </span>
                        </div>
                      </div>

                      {/* Explicit Accessible Reorder Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                          aria-label={`Move drill ${idx + 1} up`}
                          className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--fc-border-strong)] bg-white text-[var(--fc-text)] disabled:opacity-30 hover:bg-[#e8f2ea] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                        >
                          <ArrowUp className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === items.length - 1}
                          aria-label={`Move drill ${idx + 1} down`}
                          className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--fc-border-strong)] bg-white text-[var(--fc-text)] disabled:opacity-30 hover:bg-[#e8f2ea] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                        >
                          <ArrowDown className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          aria-label={`Remove drill ${idx + 1} from session`}
                          className="inline-flex size-8 items-center justify-center rounded-md border border-[#fecaca] bg-white text-[#b42318] hover:bg-[#fef3f2] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Drill Planned Duration & Note Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-[var(--fc-border)]">
                      <div className="sm:col-span-1">
                        <label htmlFor={`dur-${item.id}`} className="block text-[11px] font-bold text-[var(--fc-text)]">
                          Duration (Mins)
                        </label>
                        <input
                          id={`dur-${item.id}`}
                          type="number"
                          min="1"
                          max="90"
                          value={item.plannedDurationMinutes}
                          onChange={(e) => handleDurationChange(idx, Number(e.target.value))}
                          className="mt-1 h-8 w-full rounded border border-[var(--fc-border-strong)] bg-white px-2 text-xs text-[var(--fc-text)]"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label htmlFor={`note-${item.id}`} className="block text-[11px] font-bold text-[var(--fc-text)]">
                          Session-Specific Notes / Coaching Cues
                        </label>
                        <input
                          id={`note-${item.id}`}
                          type="text"
                          value={item.sessionNotes || ""}
                          onChange={(e) => handleNotesChange(idx, e.target.value)}
                          placeholder="e.g. Enforce 2-touch limit, highlight 3rd man movement..."
                          className="mt-1 h-8 w-full rounded border border-[var(--fc-border-strong)] bg-white px-2.5 text-xs text-[var(--fc-text)]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--fc-border-strong)] bg-[#f7f9f7] p-8 text-center space-y-2">
                <Layers className="size-8 text-[var(--fc-text-muted)] mx-auto" />
                <p className="text-sm font-bold text-[var(--fc-text)]">No exercises in this session plan yet</p>
                <p className="text-xs text-[var(--fc-text-muted)] max-w-sm mx-auto">
                  Browse the Drill Library panel on the right (or below) and click <strong>"+ Add to plan"</strong> on any drill to build your training session.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column (Integrated Drill Library & Selector Panel) - 5 cols */}
        <aside
          aria-labelledby="drill-library-heading"
          className="lg:col-span-5 rounded-xl border border-[var(--fc-border)] bg-white p-5 shadow-xs lg:sticky lg:top-4 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[var(--fc-border)]">
            <div className="flex items-center gap-2">
              <h2 id="drill-library-heading" className="text-base font-bold text-[var(--fc-text)]">
                Drill Library
              </h2>
              <span className="rounded-full bg-[var(--fc-pale-green)] px-2 py-0.5 text-xs font-bold text-[var(--fc-forest)]">
                {filteredExercises.length}
              </span>
            </div>

            {/* Mobile accordion toggle */}
            <button
              type="button"
              onClick={() => setMobileLibraryOpen(!mobileLibraryOpen)}
              className="lg:hidden inline-flex items-center gap-1 text-xs font-bold text-[var(--fc-forest)]"
            >
              <span>{mobileLibraryOpen ? "Collapse library" : "Open library"}</span>
              {mobileLibraryOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
          </div>

          {/* Drill Library Filter Bar */}
          {mobileLibraryOpen && (
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--fc-text-muted)]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter drills by name or theme..."
                  aria-label="Filter exercises in library"
                  className="h-10 w-full rounded-lg border border-[var(--fc-border-strong)] bg-white pl-9 pr-3 text-xs text-[var(--fc-text)] placeholder:text-[var(--fc-text-muted)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                />
              </div>

              {/* Category & Age Group Selectors */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label htmlFor="lib-cat-filter" className="sr-only">Filter by category</label>
                  <select
                    id="lib-cat-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[var(--fc-border-strong)] bg-white px-2 text-xs text-[var(--fc-text)]"
                  >
                    <option value="All">All Categories</option>
                    {allCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="lib-age-filter" className="sr-only">Filter by age</label>
                  <select
                    id="lib-age-filter"
                    value={selectedAge}
                    onChange={(e) => setSelectedAge(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[var(--fc-border-strong)] bg-white px-2 text-xs text-[var(--fc-text)]"
                  >
                    <option value="All">All Ages</option>
                    {allAgeGroups.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Category Chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className={`rounded-full px-2.5 py-0.5 font-semibold whitespace-nowrap transition ${
                    selectedCategory === "All"
                      ? "bg-[var(--fc-forest)] text-white"
                      : "bg-[#f0f3f0] text-[var(--fc-text-muted)] hover:bg-[#e4eae4]"
                  }`}
                >
                  All
                </button>
                {allCategories.slice(0, 5).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-2.5 py-0.5 font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? "bg-[var(--fc-forest)] text-white"
                        : "bg-[#f0f3f0] text-[var(--fc-text-muted)] hover:bg-[#e4eae4]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Scrollable Exercises List */}
              <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                {filteredExercises.length > 0 ? (
                  filteredExercises.map((exercise) => {
                    const isInSession = inSessionIds.has(exercise.id);

                    return (
                      <div
                        key={exercise.id}
                        className={`rounded-xl border p-3.5 transition flex flex-col justify-between gap-2.5 ${
                          isInSession
                            ? "border-[var(--fc-forest)] bg-[#e8f2ea]/30"
                            : "border-[var(--fc-border)] bg-white hover:border-[#6f8374]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--fc-forest)]">
                              {exercise.theme}
                            </span>
                            {isInSession && (
                              <span className="inline-flex items-center gap-1 rounded bg-[var(--fc-forest)] px-1.5 py-0.5 text-[10px] font-bold text-white">
                                <Check className="size-3" />
                                <span>In session</span>
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-[var(--fc-text)] leading-snug">
                            {exercise.title}
                          </h3>

                          <p className="line-clamp-2 text-[11px] text-[var(--fc-text-muted)] mt-1">
                            {exercise.description}
                          </p>

                          {/* Compact diagram thumbnail */}
                          {exercise.diagram && exercise.diagram.objects.length > 0 && (
                            <div className="mt-2 overflow-hidden rounded border border-[var(--fc-border)] bg-[#e8f2ea]/60">
                              <PitchDiagramView diagram={exercise.diagram} title={exercise.title} className="max-h-20" />
                            </div>
                          )}
                        </div>

                        {/* Card footer with metadata & Add button */}
                        <div className="pt-2 border-t border-[var(--fc-border)] flex items-center justify-between text-[11px] text-[var(--fc-text-muted)]">
                          <span className="flex items-center gap-1 font-semibold">
                            <Clock className="size-3 text-[var(--fc-green)]" />
                            {exercise.durationMinutes}m
                          </span>

                          <button
                            type="button"
                            onClick={() => handleAddExerciseToSession(exercise)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--fc-green)] px-3 text-xs font-bold text-white shadow-2xs hover:bg-[var(--fc-forest)] transition focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                          >
                            <Plus className="size-3.5" />
                            <span>{isInSession ? "Add another" : "Add to plan"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-lg border border-dashed border-[var(--fc-border)] p-6 text-center text-xs text-[var(--fc-text-muted)]">
                    No drills found matching your filters.
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
