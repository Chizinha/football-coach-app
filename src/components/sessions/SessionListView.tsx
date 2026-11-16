import { useState } from "react";
import type { TrainingSession } from "../../types/session";
import {
  Plus,
  Clock,
  Layers,
  ArrowRight,
  Search,
} from "lucide-react";
import { Badge } from "../common/Badge";

interface SessionListViewProps {
  sessions: TrainingSession[];
  onCreateSession: () => void;
  onOpenSession: (id: string) => void;
}

export function SessionListView({
  sessions,
  onCreateSession,
  onOpenSession,
}: SessionListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = sessions.filter((sess) => {
    return (
      searchQuery === "" ||
      sess.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.ageGroup.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--fc-text)]">
              Training Sessions
            </h1>
            <span className="rounded-full bg-[var(--fc-pale-green)] px-3 py-1 text-xs font-bold text-[var(--fc-forest)]">
              {filteredSessions.length} {filteredSessions.length === 1 ? "session" : "sessions"}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--fc-text-muted)]">
            Assemble multi-exercise plans with timed drills and coaching notes.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateSession}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--fc-green)] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[var(--fc-forest)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)] shrink-0"
        >
          <Plus className="size-4" />
          <span>Create session</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--fc-text-muted)]" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search training sessions by title, theme, or age..."
          aria-label="Search training sessions"
          className="h-11 w-full rounded-lg border border-[var(--fc-border-strong)] bg-white pl-10 pr-4 text-sm text-[var(--fc-text)] placeholder:text-[var(--fc-text-muted)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
        >
        </input>
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredSessions.map((session) => {
            const totalDuration = session.items.reduce(
              (acc, item) => acc + (item.plannedDurationMinutes || 0),
              0
            );
            return (
              <button
                key={session.id}
                type="button"
                onClick={() => onOpenSession(session.id)}
                className="group flex flex-col justify-between rounded-xl border border-[var(--fc-border)] bg-white p-6 text-left shadow-xs transition hover:border-[#6f8374] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--fc-forest)]">
                      {session.theme}
                    </span>
                    <Badge variant={session.visibility === "club" ? "club" : "neutral"}>
                      {session.visibility === "club" ? "Club shared" : "Private"}
                    </Badge>
                  </div>

                  <h2 className="text-xl font-bold text-[var(--fc-text)] group-hover:text-[var(--fc-forest)] transition-colors">
                    {session.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--fc-text-muted)]">
                    {session.description}
                  </p>

                  {/* Exercise Item Sequence Preview */}
                  <div className="mt-4 space-y-1.5 rounded-lg border border-[var(--fc-border)] bg-[#f7f9f7] p-3">
                    <span className="text-[11px] font-bold text-[var(--fc-text-muted)] uppercase tracking-wider block">
                      Exercise Plan ({session.items.length} drills)
                    </span>
                    <div className="space-y-1">
                      {session.items.slice(0, 3).map((item, idx) => (
                        <div key={item.id} className="flex items-center justify-between text-xs text-[var(--fc-text)]">
                          <span className="truncate max-w-[240px]">
                            {idx + 1}. {item.exerciseSnapshot.title}
                          </span>
                          <span className="text-[var(--fc-text-muted)] shrink-0 font-medium">
                            {item.plannedDurationMinutes}m
                          </span>
                        </div>
                      ))}
                      {session.items.length > 3 && (
                        <p className="text-[11px] font-semibold text-[var(--fc-green)]">
                          + {session.items.length - 3} more drills...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[var(--fc-border)] flex items-center justify-between text-xs text-[var(--fc-text-muted)]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-bold text-[var(--fc-text)]">
                      <Clock className="size-3.5 text-[var(--fc-green)]" />
                      {totalDuration} mins total
                    </span>
                    <span>•</span>
                    <span className="font-medium text-[var(--fc-forest)]">
                      {session.ageGroup}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-semibold text-[var(--fc-green)] group-hover:translate-x-0.5 transition-transform">
                    View session <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--fc-border)] bg-white p-12 text-center">
          <Layers className="size-10 text-[var(--fc-text-muted)] mb-3" />
          <h3 className="text-base font-bold text-[var(--fc-text)]">No training sessions found</h3>
          <p className="mt-1 text-sm text-[var(--fc-text-muted)] max-w-sm">
            Create your first session plan by combining warm-ups, tactical drills, and match play.
          </p>
          <button
            type="button"
            onClick={onCreateSession}
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--fc-green)] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[var(--fc-forest)]"
          >
            <Plus className="size-4" />
            <span>Create new session</span>
          </button>
        </div>
      )}
    </div>
  );
}
