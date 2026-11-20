import { useState } from "react";
import type { ClubPrinciplesData, PrincipleSection } from "../../types/principles";
import {
  Edit3,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { Badge } from "../common/Badge";

interface ClubPrinciplesViewProps {
  principles: ClubPrinciplesData;
  onSave: (data: ClubPrinciplesData) => void;
}

export function ClubPrinciplesView({ principles, onSave }: ClubPrinciplesViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableSections, setEditableSections] = useState<PrincipleSection[]>(
    principles.sections
  );

  const handleSectionTextChange = (secIdx: number, pIdx: number, value: string) => {
    const updated = [...editableSections];
    updated[secIdx].content[pIdx] = value;
    setEditableSections(updated);
  };

  const handleAddParagraph = (secIdx: number) => {
    const updated = [...editableSections];
    updated[secIdx].content.push("");
    setEditableSections(updated);
  };

  const handleRemoveParagraph = (secIdx: number, pIdx: number) => {
    const updated = [...editableSections];
    if (updated[secIdx].content.length <= 1) return;
    updated[secIdx].content = updated[secIdx].content.filter((_, i) => i !== pIdx);
    setEditableSections(updated);
  };

  const handleCalloutChange = (secIdx: number, value: string) => {
    const updated = [...editableSections];
    updated[secIdx].callout = value;
    setEditableSections(updated);
  };

  const handleSave = () => {
    onSave({
      version: "1.0",
      updatedAt: new Date().toISOString(),
      sections: editableSections,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableSections(principles.sections);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--fc-border)] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--fc-text)]">
              Club Principles & Methodology
            </h1>
            <Badge variant="primary">Guidance</Badge>
          </div>
          <p className="mt-1 text-sm text-[var(--fc-text-muted)]">
            Our shared tactical DNA, session standards, and coaching expectations.
          </p>
        </div>

        {/* Edit / Save Toggle */}
        <div>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--fc-border-strong)] bg-white px-4 text-xs font-semibold text-[var(--fc-text)] hover:bg-[#f7f9f7]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[var(--fc-green)] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[var(--fc-forest)]"
              >
                <Save className="size-3.5" />
                <span>Save guidelines</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[var(--fc-border-strong)] bg-white px-4 text-xs font-semibold text-[var(--fc-text)] hover:bg-[#f7f9f7] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
            >
              <Edit3 className="size-3.5 text-[var(--fc-forest)]" />
              <span>Edit guidelines</span>
            </button>
          )}
        </div>
      </div>

      {/* Demo Notice */}
      <div className="rounded-xl border border-[var(--fc-border)] bg-[#f7f9f7] p-4 text-xs text-[var(--fc-text-muted)]">
        <span className="font-bold text-[var(--fc-text)]">Demo Content Note: </span>
        These club principles serve as an interactive baseline for testing. You can edit this text locally using the "Edit guidelines" button above, and your modifications will persist in your browser.
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {editableSections.map((section, secIdx) => (
          <div
            key={section.id}
            className="rounded-2xl border border-[var(--fc-border)] bg-white p-6 md:p-8 shadow-xs space-y-4"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--fc-forest)]">
                Standard {secIdx + 1}
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-[var(--fc-text)] mt-1">
                {section.title}
              </h2>
              <p className="text-xs text-[var(--fc-text-muted)] mt-0.5">
                {section.subtitle}
              </p>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-3 pt-2">
              {section.content.map((para, pIdx) => (
                <div key={pIdx} className="space-y-1">
                  {isEditing ? (
                    <div className="flex items-start gap-2">
                      <textarea
                        rows={2}
                        value={para}
                        onChange={(e) => handleSectionTextChange(secIdx, pIdx, e.target.value)}
                        aria-label={`Paragraph ${pIdx + 1}`}
                        className="flex-1 rounded-lg border border-[var(--fc-border-strong)] p-2.5 text-sm text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                      />
                      {section.content.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveParagraph(secIdx, pIdx)}
                          aria-label="Remove paragraph"
                          className="p-2 text-[var(--fc-text-muted)] hover:text-[#b42318] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)] rounded"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-[var(--fc-text)]">
                      {para}
                    </p>
                  )}
                </div>
              ))}

              {isEditing && (
                <button
                  type="button"
                  onClick={() => handleAddParagraph(secIdx)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--fc-green)] hover:text-[var(--fc-forest)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)] rounded"
                >
                  <Plus className="size-3.5" aria-hidden="true" />
                  <span>Add paragraph</span>
                </button>
              )}
            </div>

            {/* Highlight Callout Box */}
            {(section.callout || isEditing) && (
              <div className="rounded-xl border border-[var(--fc-border)] bg-[var(--fc-pale-green)]/40 p-4">
                {isEditing ? (
                  <div>
                    <label htmlFor={`callout-${secIdx}`} className="block text-xs font-bold text-[var(--fc-forest)] mb-1">
                      Callout Rule:
                    </label>
                    <input
                      id={`callout-${secIdx}`}
                      type="text"
                      value={section.callout || ""}
                      onChange={(e) => handleCalloutChange(secIdx, e.target.value)}
                      placeholder="e.g. Core club rule..."
                      className="w-full rounded-md border border-[var(--fc-border-strong)] bg-white px-3 py-1.5 text-xs text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                    />
                  </div>
                ) : (
                  <p className="text-xs font-bold text-[var(--fc-forest)] leading-relaxed">
                    💡 {section.callout}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
