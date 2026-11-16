import { useState, useMemo } from "react";
import type { Exercise } from "../../types/exercise";
import type { TrainingSession } from "../../types/session";
import {
  Search,
  Copy,
  PlusCircle,
  Clock,
  ArrowRight,
  Info,
} from "lucide-react";
import { Badge } from "../common/Badge";
import { PitchDiagramView } from "../diagram/PitchDiagramView";

interface ClubLibraryViewProps {
  exercises: Exercise[];
  sessions: TrainingSession[];
  onOpenExercise: (id: string) => void;
  onOpenSession: (id: string) => void;
  onDuplicateExercise: (exerciseId: string) => void;
  onDuplicateSession: (sessionId: string) => void;
  onUseInSession: (exercise: Exercise) => void;
}

export function ClubLibraryView({
  exercises,
  sessions,
  onOpenExercise,
  onOpenSession,
  onDuplicateExercise,
  onDuplicateSession,
  onUseInSession,
}: ClubLibraryViewProps) {
  const [activeTab, setActiveTab] = useState<"exercises" | "sessions">("exercises");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Club-shared exercises only
  const clubExercises = useMemo(() => {
    return exercises.filter((ex) => ex.visibility === "club");
  }, [exercises]);

  // Club-shared sessions only
  const clubSessions = useMemo(() => {
    return sessions.filter((s) => s.visibility === "club");
  }, [sessions]);

  // Filtered exercises
  const filteredExercises = useMemo(() => {
    return clubExercises.filter((ex) => {
      const matchesSearch =
        searchQuery === "" ||
        ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.creatorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === "All" || ex.theme === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [clubExercises, searchQuery, selectedCategory]);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return clubSessions.filter((s) => {
      return (
        searchQuery === "" ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.creatorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [clubSessions, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--fc-text)]">
            Club Library
          </h1>
          <span className="rounded-full bg-[var(--fc-pale-green)] px-3 py-1 text-xs font-bold text-[var(--fc-forest)]">
            Shared Material
          </span>
        </div>
        <p className="mt-1 text-sm text-[var(--fc-text-muted)]">
          Explore shared drills and sessions created by fellow club academy coaches.
        </p>
      </div>

      {/* Prototype Simulated Club Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-[#bfdbfe] bg-[#eff6ff] p-4 text-xs text-[#1e40af] leading-relaxed">
        <Info className="size-5 shrink-0 text-[#1d4ed8] mt-0.5" />
        <div>
          <span className="font-bold">Simulated Club Sharing:</span> In this front-end prototype, all shared content is stored locally. You can test two distinct reuse workflows:
          <strong className="block mt-1 font-semibold">
            1. "Use in session": Directly references the drill in your session plan without creating a duplicate in your library.
          </strong>
          <strong className="block font-semibold">
            2. "Duplicate into my library": Creates an independent, editable copy in your personal exercises.
          </strong>
        </div>
      </div>

      {/* Tabs: Exercises vs Training Sessions */}
      <div className="flex items-center gap-3 border-b border-[var(--fc-border)]">
        <button
          type="button"
          onClick={() => setActiveTab("exercises")}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === "exercises"
              ? "border-[var(--fc-forest)] text-[var(--fc-forest)]"
              : "border-transparent text-[var(--fc-text-muted)] hover:text-[var(--fc-text)]"
          }`}
        >
          Shared Exercises ({clubExercises.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sessions")}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === "sessions"
              ? "border-[var(--fc-forest)] text-[var(--fc-forest)]"
              : "border-transparent text-[var(--fc-text-muted)] hover:text-[var(--fc-text)]"
          }`}
        >
          Shared Training Sessions ({clubSessions.length})
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--fc-text-muted)]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search club ${activeTab}...`}
            aria-label={`Search club ${activeTab}`}
            className="h-11 w-full rounded-lg border border-[var(--fc-border-strong)] bg-white pl-10 pr-4 text-sm text-[var(--fc-text)] placeholder:text-[var(--fc-text-muted)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          />
        </div>

        {activeTab === "exercises" && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter shared drills by theme"
            className="h-11 rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-sm font-medium text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            <option value="All">All Categories</option>
            <option value="Warm-up">Warm-up</option>
            <option value="Passing & Receiving">Passing & Receiving</option>
            <option value="Possession">Possession</option>
            <option value="Dribbling & 1v1">Dribbling & 1v1</option>
            <option value="Defending">Defending</option>
            <option value="Shooting & Finishing">Shooting & Finishing</option>
            <option value="Transition">Transition</option>
          </select>
        )}
      </div>

      {/* Content for Exercises Tab */}
      {activeTab === "exercises" && (
        <div className="space-y-5">
          {filteredExercises.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="group flex flex-col justify-between rounded-xl border border-[var(--fc-border)] bg-white p-5 text-left shadow-xs transition hover:border-[#6f8374] hover:shadow-md"
                >
                  <div>
                    {/* Header: Theme & Creator */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--fc-forest)]">
                        {exercise.theme}
                      </span>
                      <Badge variant="club">Shared by {exercise.creatorName.split(" ")[1] || "Club"}</Badge>
                    </div>

                    {/* Title */}
                    <button
                      type="button"
                      onClick={() => onOpenExercise(exercise.id)}
                      className="text-left text-lg font-bold text-[var(--fc-text)] group-hover:text-[var(--fc-forest)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                    >
                      {exercise.title}
                    </button>

                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--fc-text-muted)]">
                      {exercise.description}
                    </p>

                    {/* Diagram Preview */}
                    {exercise.diagram && exercise.diagram.objects.length > 0 && (
                      <div className="mt-3.5 overflow-hidden rounded-lg border border-[var(--fc-border)] bg-[#e8f2ea]/60">
                        <PitchDiagramView diagram={exercise.diagram} title={exercise.title} className="max-h-28" />
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-[var(--fc-border)] space-y-2">
                    <div className="flex items-center justify-between text-xs text-[var(--fc-text-muted)] mb-2">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="size-3.5" />
                        {exercise.durationMinutes}m
                      </span>
                      <span>{exercise.ageGroups[0] || "All"}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onUseInSession(exercise)}
                        className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-[var(--fc-green)] px-2.5 text-xs font-bold text-white hover:bg-[var(--fc-forest)] transition focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                      >
                        <PlusCircle className="size-3.5" />
                        <span>Use in session</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicateExercise(exercise.id)}
                        className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-[var(--fc-border-strong)] bg-white px-2.5 text-xs font-bold text-[var(--fc-text)] hover:bg-[#f7f9f7] transition focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                      >
                        <Copy className="size-3.5 text-[var(--fc-text-muted)]" />
                        <span>Duplicate</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--fc-border)] bg-white p-10 text-center text-sm text-[var(--fc-text-muted)]">
              No shared exercises found matching your search.
            </div>
          )}
        </div>
      )}

      {/* Content for Sessions Tab */}
      {activeTab === "sessions" && (
        <div className="space-y-5">
          {filteredSessions.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {filteredSessions.map((session) => {
                const totalDuration = session.items.reduce(
                  (acc, item) => acc + (item.plannedDurationMinutes || 0),
                  0
                );
                return (
                  <div
                    key={session.id}
                    className="flex flex-col justify-between rounded-xl border border-[var(--fc-border)] bg-white p-6 shadow-xs hover:border-[#6f8374] transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--fc-forest)]">
                          {session.theme}
                        </span>
                        <Badge variant="club">Shared by {session.creatorName}</Badge>
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenSession(session.id)}
                        className="text-left text-xl font-bold text-[var(--fc-text)] hover:text-[var(--fc-forest)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                      >
                        {session.title}
                      </button>

                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--fc-text-muted)]">
                        {session.description}
                      </p>

                      <div className="mt-4 flex items-center gap-3 text-xs text-[var(--fc-text-muted)]">
                        <span className="font-bold text-[var(--fc-text)] flex items-center gap-1">
                          <Clock className="size-3.5 text-[var(--fc-green)]" />
                          {totalDuration} mins
                        </span>
                        <span>•</span>
                        <span>{session.items.length} drills</span>
                        <span>•</span>
                        <span className="font-semibold text-[var(--fc-forest)]">{session.ageGroup}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[var(--fc-border)] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onDuplicateSession(session.id)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-xs font-bold text-[var(--fc-text)] hover:bg-[#f7f9f7] transition"
                      >
                        <Copy className="size-3.5 text-[var(--fc-text-muted)]" />
                        <span>Duplicate to my sessions</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenSession(session.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--fc-green)] hover:text-[var(--fc-forest)]"
                      >
                        <span>View plan</span>
                        <ArrowRight className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--fc-border)] bg-white p-10 text-center text-sm text-[var(--fc-text-muted)]">
              No shared training sessions found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
