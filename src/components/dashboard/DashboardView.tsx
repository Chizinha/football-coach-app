import type { Exercise } from "../../types/exercise";
import type { TrainingSession } from "../../types/session";
import type { ActiveTab } from "../layout/AppShell";
import { Plus, ArrowRight, ClipboardList, Layers, BookOpen, Clock, Users, ShieldCheck } from "lucide-react";
import { Badge } from "../common/Badge";

interface DashboardViewProps {
  exercises: Exercise[];
  sessions: TrainingSession[];
  onNavigate: (tab: ActiveTab) => void;
  onCreateExercise: () => void;
  onCreateSession: () => void;
  onOpenExercise: (id: string) => void;
  onOpenSession: (id: string) => void;
}

export function DashboardView({
  exercises,
  sessions,
  onNavigate,
  onCreateExercise,
  onCreateSession,
  onOpenExercise,
  onOpenSession,
}: DashboardViewProps) {
  // Recent exercises (last 3)
  const recentExercises = [...exercises]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  // Recent sessions (last 2)
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 2);

  // Club shared count
  const clubExercisesCount = exercises.filter((e) => e.visibility === "club").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[var(--fc-border)] bg-white p-6 md:p-8 shadow-xs">
        <div className="max-w-2xl">
          <Badge variant="primary" className="mb-3">
            Local Front-End Prototype
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--fc-text)]">
            Welcome, Coach
          </h1>
          <p className="mt-2 text-base text-[var(--fc-text-muted)] leading-relaxed">
            Plan training sessions, build tactical pitch diagrams, and explore shared coaching material across your club. All changes are saved locally in your browser.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onCreateExercise}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--fc-green)] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[var(--fc-forest)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            <Plus className="size-4" />
            <span>Create exercise</span>
          </button>
          <button
            type="button"
            onClick={onCreateSession}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--fc-border-strong)] bg-white px-5 text-sm font-semibold text-[var(--fc-text)] shadow-xs hover:bg-[#f7f9f7] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            <Plus className="size-4" />
            <span>Create training session</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => onNavigate("exercises")}
          className="flex flex-col rounded-xl border border-[var(--fc-border)] bg-white p-5 text-left shadow-xs transition hover:border-[#6f8374] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <div className="flex items-center justify-between text-[var(--fc-text-muted)]">
            <span className="text-sm font-semibold">Total exercises</span>
            <ClipboardList className="size-5 text-[var(--fc-green)]" />
          </div>
          <span className="mt-3 text-3xl font-bold text-[var(--fc-text)]">{exercises.length}</span>
          <span className="mt-1 text-xs text-[var(--fc-text-muted)]">In your exercise library</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("sessions")}
          className="flex flex-col rounded-xl border border-[var(--fc-border)] bg-white p-5 text-left shadow-xs transition hover:border-[#6f8374] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <div className="flex items-center justify-between text-[var(--fc-text-muted)]">
            <span className="text-sm font-semibold">Training sessions</span>
            <Layers className="size-5 text-[var(--fc-green)]" />
          </div>
          <span className="mt-3 text-3xl font-bold text-[var(--fc-text)]">{sessions.length}</span>
          <span className="mt-1 text-xs text-[var(--fc-text-muted)]">Planned sessions</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("club")}
          className="flex flex-col rounded-xl border border-[var(--fc-border)] bg-white p-5 text-left shadow-xs transition hover:border-[#6f8374] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <div className="flex items-center justify-between text-[var(--fc-text-muted)]">
            <span className="text-sm font-semibold">Club shared</span>
            <BookOpen className="size-5 text-[var(--fc-green)]" />
          </div>
          <span className="mt-3 text-3xl font-bold text-[var(--fc-text)]">{clubExercisesCount}</span>
          <span className="mt-1 text-xs text-[var(--fc-text-muted)]">Available from coaches</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("principles")}
          className="flex flex-col rounded-xl border border-[var(--fc-border)] bg-white p-5 text-left shadow-xs transition hover:border-[#6f8374] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
          <div className="flex items-center justify-between text-[var(--fc-text-muted)]">
            <span className="text-sm font-semibold">Club principles</span>
            <ShieldCheck className="size-5 text-[var(--fc-green)]" />
          </div>
          <span className="mt-3 text-lg font-bold text-[var(--fc-text)]">Guidance</span>
          <span className="mt-1 text-xs text-[var(--fc-text-muted)]">Read club standards</span>
        </button>
      </div>

      {/* Two Column Layout: Recent Exercises & Recent Sessions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Exercises */}
        <div className="rounded-xl border border-[var(--fc-border)] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--fc-border)]">
            <h2 className="text-lg font-bold text-[var(--fc-text)]">Recent exercises</h2>
            <button
              type="button"
              onClick={() => onNavigate("exercises")}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--fc-green)] hover:text-[var(--fc-forest)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
            >
              <span>View all</span>
              <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {recentExercises.map((ex) => (
              <div
                key={ex.id}
                onClick={() => onOpenExercise(ex.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpenExercise(ex.id);
                  }
                }}
                className="group flex cursor-pointer items-start justify-between rounded-lg border border-[var(--fc-border)] p-4 hover:border-[#6f8374] hover:bg-[#f7f9f7] transition focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--fc-text)] group-hover:text-[var(--fc-forest)]">
                      {ex.title}
                    </span>
                    <Badge variant={ex.visibility === "club" ? "club" : "neutral"}>
                      {ex.visibility === "club" ? "Club shared" : "Private"}
                    </Badge>
                  </div>
                  <p className="line-clamp-1 text-xs text-[var(--fc-text-muted)]">
                    {ex.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[var(--fc-text-muted)] pt-1">
                    <span className="font-medium text-[var(--fc-forest)]">{ex.theme}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {ex.durationMinutes}m
                    </span>
                    {ex.playerCount && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />
                          {ex.playerCount.min}–{ex.playerCount.max}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <ArrowRight className="size-4 text-[var(--fc-text-muted)] group-hover:text-[var(--fc-forest)] transition-transform group-hover:translate-x-0.5 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Training Sessions */}
        <div className="rounded-xl border border-[var(--fc-border)] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--fc-border)]">
            <h2 className="text-lg font-bold text-[var(--fc-text)]">Recent training sessions</h2>
            <button
              type="button"
              onClick={() => onNavigate("sessions")}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--fc-green)] hover:text-[var(--fc-forest)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
            >
              <span>View all</span>
              <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {recentSessions.map((sess) => {
              const totalMinutes = sess.items.reduce(
                (sum, item) => sum + (item.plannedDurationMinutes || 0),
                0
              );
              return (
                <div
                  key={sess.id}
                  onClick={() => onOpenSession(sess.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpenSession(sess.id);
                    }
                  }}
                  className="group flex cursor-pointer items-start justify-between rounded-lg border border-[var(--fc-border)] p-4 hover:border-[#6f8374] hover:bg-[#f7f9f7] transition focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--fc-text)] group-hover:text-[var(--fc-forest)]">
                        {sess.title}
                      </span>
                      <Badge variant={sess.visibility === "club" ? "club" : "neutral"}>
                        {sess.visibility === "club" ? "Club shared" : "Private"}
                      </Badge>
                    </div>
                    <p className="line-clamp-1 text-xs text-[var(--fc-text-muted)]">
                      {sess.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[var(--fc-text-muted)] pt-1">
                      <span className="font-medium text-[var(--fc-forest)]">{sess.ageGroup}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {totalMinutes} mins total
                      </span>
                      <span>•</span>
                      <span>{sess.items.length} exercises</span>
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-[var(--fc-text-muted)] group-hover:text-[var(--fc-forest)] transition-transform group-hover:translate-x-0.5 mt-1" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
