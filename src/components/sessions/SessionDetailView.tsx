import { useState } from "react";
import type { TrainingSession } from "../../types/session";
import {
  ArrowLeft,
  Edit3,
  Copy,
  Trash2,
  Clock,
  ChevronDown,
  ChevronUp,
  Share2,
} from "lucide-react";
import { Badge } from "../common/Badge";
import { ConfirmModal } from "../common/ConfirmModal";
import { PitchDiagramView } from "../diagram/PitchDiagramView";

interface SessionDetailViewProps {
  session: TrainingSession;
  onBack: () => void;
  onEdit: (session: TrainingSession) => void;
  onDuplicate: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onToggleVisibility: (session: TrainingSession) => void;
}

export function SessionDetailView({
  session,
  onBack,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleVisibility,
}: SessionDetailViewProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expandedItemIds, setExpandedItemIds] = useState<Record<string, boolean>>({
    [session.items[0]?.id || ""]: true, // Expand first by default
  });

  const toggleExpand = (id: string) => {
    setExpandedItemIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalDuration = session.items.reduce(
    (acc, item) => acc + (item.plannedDurationMinutes || 0),
    0
  );

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
          <span>Back to sessions</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Duplicate */}
          <button
            type="button"
            onClick={() => onDuplicate(session.id)}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-xs font-semibold text-[var(--fc-text)] hover:bg-[#f7f9f7] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            <Copy className="size-3.5 text-[var(--fc-text-muted)]" />
            <span>Duplicate</span>
          </button>

          {/* Visibility Toggle */}
          <button
            type="button"
            onClick={() => onToggleVisibility(session)}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-xs font-semibold text-[var(--fc-text)] hover:bg-[#f7f9f7] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            <Share2 className="size-3.5 text-[var(--fc-forest)]" />
            <span>{session.visibility === "club" ? "Make private" : "Share with club"}</span>
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(session)}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[var(--fc-green)] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[var(--fc-forest)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            <Edit3 className="size-3.5" />
            <span>Edit session</span>
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            aria-label="Delete training session"
            className="inline-flex h-10 size-10 items-center justify-center rounded-lg border border-[#fecaca] bg-[#fef3f2] text-[#b42318] hover:bg-[#fee2e2] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Session Overview Header */}
      <div className="rounded-2xl border border-[var(--fc-border)] bg-white p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--fc-forest)]">
            {session.theme}
          </span>
          <Badge variant={session.visibility === "club" ? "club" : "neutral"}>
            {session.visibility === "club" ? "Club shared" : "Private (Draft)"}
          </Badge>
          <span className="text-xs text-[var(--fc-text-muted)]">
            Created by {session.creatorName}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--fc-text)]">
          {session.title}
        </h1>

        <p className="text-base text-[var(--fc-text-muted)] leading-relaxed">
          {session.description}
        </p>

        {/* Key Stats Bar */}
        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-[var(--fc-border)] bg-[#f7f9f7] p-4 text-xs">
          <div>
            <span className="block font-semibold text-[var(--fc-text-muted)]">Total Planned Duration</span>
            <span className="mt-0.5 flex items-center gap-1 text-base font-bold text-[var(--fc-text)]">
              <Clock className="size-4 text-[var(--fc-green)]" />
              {totalDuration} minutes
            </span>
          </div>

          <div>
            <span className="block font-semibold text-[var(--fc-text-muted)]">Target Squad / Age</span>
            <span className="mt-0.5 block text-base font-bold text-[var(--fc-text)]">
              {session.ageGroup}
            </span>
          </div>

          <div>
            <span className="block font-semibold text-[var(--fc-text-muted)]">Number of Exercises</span>
            <span className="mt-0.5 block text-base font-bold text-[var(--fc-text)]">
              {session.items.length} drills
            </span>
          </div>
        </div>
      </div>

      {/* Ordered Exercises Plan */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--fc-text)]">
          Session Exercise Timeline ({session.items.length} drills)
        </h2>

        {session.items.map((item, idx) => {
          const isExpanded = Boolean(expandedItemIds[item.id]);
          const snap = item.exerciseSnapshot;

          return (
            <div
              key={item.id}
              className="rounded-xl border border-[var(--fc-border)] bg-white shadow-xs overflow-hidden transition-all"
            >
              {/* Timeline Header Row */}
              <div
                onClick={() => toggleExpand(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleExpand(item.id);
                  }
                }}
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#f7f9f7] transition select-none focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
              >
                <div className="flex items-center gap-3.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--fc-forest)] text-xs font-bold text-white shadow-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-[var(--fc-text)]">
                        {snap.title}
                      </span>
                      <span className="text-xs font-semibold text-[var(--fc-forest)] bg-[var(--fc-pale-green)] px-2 py-0.5 rounded">
                        {snap.theme}
                      </span>
                    </div>
                    {item.sessionNotes && (
                      <p className="text-xs text-[var(--fc-text-muted)] mt-1 line-clamp-1 italic">
                        Note: {item.sessionNotes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[var(--fc-forest)] bg-[#f0f3f0] px-2.5 py-1 rounded-md">
                    {item.plannedDurationMinutes} mins
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="size-5 text-[var(--fc-text-muted)]" />
                  ) : (
                    <ChevronDown className="size-5 text-[var(--fc-text-muted)]" />
                  )}
                </div>
              </div>

              {/* Expanded Exercise Content & Diagram */}
              {isExpanded && (
                <div className="border-t border-[var(--fc-border)] bg-[#f7f9f7]/40 p-5 space-y-5 animate-in fade-in">
                  {/* Session Coach Notes Callout */}
                  {item.sessionNotes && (
                    <div className="rounded-lg border border-[var(--fc-border)] bg-white p-3.5 text-xs text-[var(--fc-text)] shadow-2xs">
                      <span className="font-bold text-[var(--fc-forest)] block mb-1">
                        Session-Specific Coaching Note:
                      </span>
                      <p className="leading-relaxed text-[var(--fc-text)]">{item.sessionNotes}</p>
                    </div>
                  )}

                  {/* Diagram Preview */}
                  {snap.diagram && snap.diagram.objects.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[var(--fc-text)] block">
                        Tactical Setup Diagram:
                      </span>
                      <PitchDiagramView diagram={snap.diagram} title={snap.title} />
                      {snap.diagramDescription && (
                        <p className="text-xs text-[var(--fc-text-muted)] italic">
                          {snap.diagramDescription}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Instructions */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[var(--fc-text)] block">
                      Instructions:
                    </span>
                    <ol className="list-decimal pl-5 text-xs space-y-1 text-[var(--fc-text)]">
                      {snap.instructions.map((ins, i) => (
                        <li key={i}>{ins}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Coaching Points */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[var(--fc-text)] block">
                      Key Coaching Points:
                    </span>
                    <ul className="list-disc pl-5 text-xs space-y-1 text-[var(--fc-text)]">
                      {snap.coachingPoints.map((cp, i) => (
                        <li key={i}>{cp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title={`Delete "${session.title}"?`}
        description="Are you sure you want to delete this training session from your local library? This action cannot be undone."
        confirmLabel="Delete session"
        cancelLabel="Keep session"
        isDestructive={true}
        onConfirm={() => {
          onDelete(session.id);
          setDeleteModalOpen(false);
        }}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
