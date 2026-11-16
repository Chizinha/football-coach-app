import { useState, useMemo } from "react";
import type { Exercise, ExerciseCategory, AgeGroup } from "../../types/exercise";
import {
  Plus,
  Search,
  Clock,
  Users,
  Filter,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "../common/Badge";
import { PitchDiagramView } from "../diagram/PitchDiagramView";

interface ExerciseListViewProps {
  exercises: Exercise[];
  onCreateExercise: () => void;
  onOpenExercise: (id: string) => void;
}

const CATEGORIES: ("All" | ExerciseCategory)[] = [
  "All",
  "Warm-up",
  "Passing & Receiving",
  "Possession",
  "Dribbling & 1v1",
  "Defending",
  "Shooting & Finishing",
  "Transition",
];

const AGE_GROUPS: ("All" | AgeGroup)[] = [
  "All",
  "U7–U9",
  "U10–U12",
  "U13–U15",
  "U16–U19",
  "Senior",
];

export function ExerciseListView({
  exercises,
  onCreateExercise,
  onOpenExercise,
}: ExerciseListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | ExerciseCategory>("All");
  const [selectedAge, setSelectedAge] = useState<"All" | AgeGroup>("All");

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch =
        searchQuery === "" ||
        ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.theme.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || ex.theme === selectedCategory;

      const matchesAge =
        selectedAge === "All" ||
        ex.ageGroups.includes(selectedAge) ||
        ex.ageGroups.includes("All ages");

      return matchesSearch && matchesCategory && matchesAge;
    });
  }, [exercises, searchQuery, selectedCategory, selectedAge]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--fc-text)]">
              Exercises
            </h1>
            <span className="rounded-full bg-[var(--fc-pale-green)] px-3 py-1 text-xs font-bold text-[var(--fc-forest)]">
              {filteredExercises.length} {filteredExercises.length === 1 ? "exercise" : "exercises"}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--fc-text-muted)]">
            Browse, plan, and create drills with tactical pitch diagrams.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateExercise}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--fc-green)] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[var(--fc-forest)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)] shrink-0"
        >
          <Plus className="size-4" />
          <span>Create exercise</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--fc-text-muted)]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises by title, objective, or theme..."
            aria-label="Search exercises"
            className="h-11 w-full rounded-lg border border-[var(--fc-border-strong)] bg-white pl-10 pr-4 text-sm text-[var(--fc-text)] placeholder:text-[var(--fc-text-muted)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          />
        </div>

        {/* Category Select */}
        <div className="flex items-center gap-2">
          <label htmlFor="category-select" className="sr-only">Filter by Category</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as "All" | ExerciseCategory)}
            aria-label="Filter by theme category"
            className="h-11 rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-sm font-medium text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          {/* Age Group Select */}
          <label htmlFor="age-select" className="sr-only">Filter by Age Group</label>
          <select
            id="age-select"
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value as "All" | AgeGroup)}
            aria-label="Filter by age group"
            className="h-11 rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-sm font-medium text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            {AGE_GROUPS.map((age) => (
              <option key={age} value={age}>
                {age === "All" ? "All Ages" : age}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <Filter className="size-3.5 text-[var(--fc-text-muted)] mr-1 shrink-0" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-3 py-1 font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? "bg-[var(--fc-forest)] text-white shadow-xs"
                : "bg-white text-[var(--fc-text-muted)] border border-[var(--fc-border)] hover:bg-[#f0f3f0]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercise Card Grid */}
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              type="button"
              onClick={() => onOpenExercise(exercise.id)}
              className="group flex flex-col justify-between rounded-xl border border-[var(--fc-border)] bg-white p-5 text-left shadow-xs transition hover:border-[#6f8374] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
            >
              <div>
                {/* Header: Theme & Visibility */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--fc-forest)]">
                    {exercise.theme}
                  </span>
                  <Badge variant={exercise.visibility === "club" ? "club" : "neutral"}>
                    {exercise.visibility === "club" ? "Club shared" : "Private"}
                  </Badge>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-[var(--fc-text)] group-hover:text-[var(--fc-forest)] transition-colors">
                  {exercise.title}
                </h2>

                {/* Objective Description */}
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--fc-text-muted)]">
                  {exercise.description}
                </p>

                {/* Tactical Diagram Thumbnail Preview if available */}
                {exercise.diagram && exercise.diagram.objects.length > 0 && (
                  <div className="mt-3.5 overflow-hidden rounded-lg border border-[var(--fc-border)] bg-[#e8f2ea]/60">
                    <PitchDiagramView diagram={exercise.diagram} title={exercise.title} className="max-h-32" />
                  </div>
                )}
              </div>

              {/* Card Footer: Metadata and Action */}
              <div className="mt-4 pt-3 border-t border-[var(--fc-border)] flex items-center justify-between text-xs text-[var(--fc-text-muted)]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="size-3.5" />
                    {exercise.durationMinutes}m
                  </span>
                  {exercise.playerCount && (
                    <span className="flex items-center gap-1 font-medium">
                      <Users className="size-3.5" />
                      {exercise.playerCount.min}–{exercise.playerCount.max}p
                    </span>
                  )}
                  <span className="truncate max-w-[80px]">
                    {exercise.ageGroups[0] || "All"}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 font-semibold text-[var(--fc-green)] group-hover:translate-x-0.5 transition-transform">
                  View <ArrowRight className="size-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--fc-border)] bg-white p-12 text-center">
          <ShieldAlert className="size-10 text-[var(--fc-text-muted)] mb-3" />
          <h3 className="text-base font-bold text-[var(--fc-text)]">No exercises found</h3>
          <p className="mt-1 text-sm text-[var(--fc-text-muted)] max-w-sm">
            No exercises match your current search and filters. Try adjusting your query or create a new exercise.
          </p>
          <button
            type="button"
            onClick={onCreateExercise}
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--fc-green)] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[var(--fc-forest)]"
          >
            <Plus className="size-4" />
            <span>Create new exercise</span>
          </button>
        </div>
      )}
    </div>
  );
}
