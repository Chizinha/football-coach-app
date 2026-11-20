import { useState, type FormEvent } from "react";
import type { ClubTaxonomy } from "../../types/settings";
import type { Exercise } from "../../types/exercise";
import type { TrainingSession } from "../../types/session";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  Tag,
  Users,
} from "lucide-react";
import { Badge } from "../common/Badge";
import { ConfirmModal } from "../common/ConfirmModal";

interface AdminSettingsViewProps {
  taxonomy: ClubTaxonomy;
  exercises: Exercise[];
  sessions: TrainingSession[];
  onAddCategory: (name: string) => boolean;
  onUpdateCategory: (oldName: string, newName: string) => boolean;
  onDeleteCategory: (name: string) => boolean;
  onAddAgeGroup: (name: string) => boolean;
  onUpdateAgeGroup: (oldName: string, newName: string) => boolean;
  onDeleteAgeGroup: (name: string) => boolean;
}

export function AdminSettingsView({
  taxonomy,
  exercises,
  sessions,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddAgeGroup,
  onUpdateAgeGroup,
  onDeleteAgeGroup,
}: AdminSettingsViewProps) {
  // Category state
  const [newCatName, setNewCatName] = useState("");
  const [catError, setCatError] = useState<string | null>(null);
  const [editingCatOldName, setEditingCatOldName] = useState<string | null>(null);
  const [editingCatNewName, setEditingCatNewName] = useState("");

  // Age group state
  const [newAgeName, setNewAgeName] = useState("");
  const [ageError, setAgeError] = useState<string | null>(null);
  const [editingAgeOldName, setEditingAgeOldName] = useState<string | null>(null);
  const [editingAgeNewName, setEditingAgeNewName] = useState("");

  // Delete modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "category" | "ageGroup";
    name: string;
    inUseCount: number;
  } | null>(null);

  // Category usage counts
  const getCategoryUsage = (catName: string) => {
    return exercises.filter((ex) => ex.theme.toLowerCase() === catName.toLowerCase()).length;
  };

  // Age group usage counts
  const getAgeGroupUsage = (ageName: string) => {
    const exCount = exercises.filter((ex) =>
      ex.ageGroups.some((ag) => ag.toLowerCase() === ageName.toLowerCase())
    ).length;
    const sessCount = sessions.filter(
      (s) => s.ageGroup.toLowerCase() === ageName.toLowerCase()
    ).length;
    return exCount + sessCount;
  };

  // Add Category Submit
  const handleAddCategorySubmit = (e: FormEvent) => {
    e.preventDefault();
    setCatError(null);
    if (!newCatName.trim()) {
      setCatError("Category name cannot be empty.");
      return;
    }
    const success = onAddCategory(newCatName);
    if (!success) {
      setCatError("This category already exists.");
      return;
    }
    setNewCatName("");
  };

  // Inline Category Save
  const handleSaveCatEdit = (oldName: string) => {
    if (!editingCatNewName.trim()) return;
    onUpdateCategory(oldName, editingCatNewName);
    setEditingCatOldName(null);
  };

  // Add Age Group Submit
  const handleAddAgeSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAgeError(null);
    if (!newAgeName.trim()) {
      setAgeError("Age group name cannot be empty.");
      return;
    }
    const success = onAddAgeGroup(newAgeName);
    if (!success) {
      setAgeError("This age group already exists.");
      return;
    }
    setNewAgeName("");
  };

  // Inline Age Group Save
  const handleSaveAgeEdit = (oldName: string) => {
    if (!editingAgeNewName.trim()) return;
    onUpdateAgeGroup(oldName, editingAgeNewName);
    setEditingAgeOldName(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--fc-text)]">
            Club Settings & Administration
          </h1>
          <Badge variant="primary">Admin Mode</Badge>
        </div>
        <p className="mt-1 text-sm text-[var(--fc-text-muted)]">
          Manage exercise categories and squad age groups. All changes immediately propagate across library filters, exercise creation forms, and session planning.
        </p>
      </div>

      {/* Two Column Layout: Categories & Age Groups */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Panel 1: Exercise Categories */}
        <section
          aria-labelledby="categories-heading"
          className="rounded-2xl border border-[var(--fc-border)] bg-white p-6 shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--fc-border)]">
              <div className="flex items-center gap-2">
                <Tag className="size-5 text-[var(--fc-forest)]" />
                <h2 id="categories-heading" className="text-lg font-bold text-[var(--fc-text)]">
                  Exercise Categories / Themes
                </h2>
              </div>
              <span className="text-xs font-semibold text-[var(--fc-text-muted)]">
                {taxonomy.categories.length} total
              </span>
            </div>

            <p className="text-xs text-[var(--fc-text-muted)]">
              Categories define tactical themes (e.g. Passing, Transition, Defending) used in drill categorization and filters.
            </p>

            {/* Add Category Form */}
            <form onSubmit={handleAddCategorySubmit} className="space-y-2 pt-1">
              <label htmlFor="new-cat-input" className="block text-xs font-bold text-[var(--fc-text)]">
                Add New Category
              </label>
              <div className="flex gap-2">
                <input
                  id="new-cat-input"
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Set Pieces & Free Kicks"
                  aria-describedby={catError ? "cat-error-msg" : undefined}
                  className="h-11 flex-1 rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-sm text-[var(--fc-text)] placeholder:text-[var(--fc-text-muted)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[var(--fc-green)] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[var(--fc-forest)] transition focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)] shrink-0"
                >
                  <Plus className="size-4" />
                  <span>Add</span>
                </button>
              </div>
              {catError && (
                <p id="cat-error-msg" className="text-xs text-[#b42318] flex items-center gap-1">
                  <AlertCircle className="size-3.5" />
                  <span>{catError}</span>
                </p>
              )}
            </form>

            {/* Categories List */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-[var(--fc-text-muted)] uppercase tracking-wider block">
                Existing Categories
              </span>
              <ul className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {taxonomy.categories.map((cat) => {
                  const usage = getCategoryUsage(cat);
                  const isEditing = editingCatOldName === cat;

                  return (
                    <li
                      key={cat}
                      className="flex items-center justify-between rounded-lg border border-[var(--fc-border)] bg-[#f7f9f7] p-2.5 sm:px-3 text-sm"
                    >
                      {isEditing ? (
                        <div className="flex-1 flex items-center gap-2 mr-2">
                          <input
                            type="text"
                            value={editingCatNewName}
                            onChange={(e) => setEditingCatNewName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveCatEdit(cat);
                              if (e.key === "Escape") setEditingCatOldName(null);
                            }}
                            autoFocus
                            aria-label={`Edit name for category ${cat}`}
                            className="h-9 flex-1 rounded border border-[var(--fc-border-strong)] bg-white px-2 text-xs text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveCatEdit(cat)}
                            aria-label="Save category name"
                            className="p-1.5 rounded bg-[var(--fc-green)] text-white hover:bg-[var(--fc-forest)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                          >
                            <Check className="size-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCatOldName(null)}
                            aria-label="Cancel editing"
                            className="p-1.5 rounded border border-[var(--fc-border)] bg-white text-[var(--fc-text-muted)] hover:bg-[#f0f3f0] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                          >
                            <X className="size-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[var(--fc-text)]">{cat}</span>
                            <span
                              className="rounded-full bg-white border border-[var(--fc-border)] px-2 py-0.5 text-[11px] font-medium text-[var(--fc-text-muted)]"
                              title={`${usage} exercises use this category`}
                            >
                              {usage} {usage === 1 ? "drill" : "drills"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCatOldName(cat);
                                setEditingCatNewName(cat);
                              }}
                              aria-label={`Edit category ${cat}`}
                              className="inline-flex size-9 items-center justify-center rounded-md border border-[var(--fc-border)] bg-white text-[var(--fc-text)] hover:bg-[#e8f2ea] hover:text-[var(--fc-forest)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                            >
                              <Edit2 className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirm({
                                  type: "category",
                                  name: cat,
                                  inUseCount: usage,
                                })
                              }
                              aria-label={`Delete category ${cat}`}
                              className="inline-flex size-9 items-center justify-center rounded-md border border-[#fecaca] bg-white text-[#b42318] hover:bg-[#fef3f2] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* Panel 2: Squad Age Groups */}
        <section
          aria-labelledby="age-groups-heading"
          className="rounded-2xl border border-[var(--fc-border)] bg-white p-6 shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--fc-border)]">
              <div className="flex items-center gap-2">
                <Users className="size-5 text-[var(--fc-forest)]" />
                <h2 id="age-groups-heading" className="text-lg font-bold text-[var(--fc-text)]">
                  Squad Age Groups
                </h2>
              </div>
              <span className="text-xs font-semibold text-[var(--fc-text-muted)]">
                {taxonomy.ageGroups.length} total
              </span>
            </div>

            <p className="text-xs text-[var(--fc-text-muted)]">
              Age groups define target developmental tiers (e.g. U10–U12, Senior) for exercises and training session rosters.
            </p>

            {/* Add Age Group Form */}
            <form onSubmit={handleAddAgeSubmit} className="space-y-2 pt-1">
              <label htmlFor="new-age-input" className="block text-xs font-bold text-[var(--fc-text)]">
                Add New Age Group
              </label>
              <div className="flex gap-2">
                <input
                  id="new-age-input"
                  type="text"
                  value={newAgeName}
                  onChange={(e) => setNewAgeName(e.target.value)}
                  placeholder="e.g. U21 Academy or Women's 1st"
                  aria-describedby={ageError ? "age-error-msg" : undefined}
                  className="h-11 flex-1 rounded-lg border border-[var(--fc-border-strong)] bg-white px-3 text-sm text-[var(--fc-text)] placeholder:text-[var(--fc-text-muted)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[var(--fc-green)] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[var(--fc-forest)] transition focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)] shrink-0"
                >
                  <Plus className="size-4" />
                  <span>Add</span>
                </button>
              </div>
              {ageError && (
                <p id="age-error-msg" className="text-xs text-[#b42318] flex items-center gap-1">
                  <AlertCircle className="size-3.5" />
                  <span>{ageError}</span>
                </p>
              )}
            </form>

            {/* Age Groups List */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-[var(--fc-text-muted)] uppercase tracking-wider block">
                Existing Age Groups
              </span>
              <ul className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {taxonomy.ageGroups.map((age) => {
                  const usage = getAgeGroupUsage(age);
                  const isEditing = editingAgeOldName === age;

                  return (
                    <li
                      key={age}
                      className="flex items-center justify-between rounded-lg border border-[var(--fc-border)] bg-[#f7f9f7] p-2.5 sm:px-3 text-sm"
                    >
                      {isEditing ? (
                        <div className="flex-1 flex items-center gap-2 mr-2">
                          <input
                            type="text"
                            value={editingAgeNewName}
                            onChange={(e) => setEditingAgeNewName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveAgeEdit(age);
                              if (e.key === "Escape") setEditingAgeOldName(null);
                            }}
                            autoFocus
                            aria-label={`Edit name for age group ${age}`}
                            className="h-9 flex-1 rounded border border-[var(--fc-border-strong)] bg-white px-2 text-xs text-[var(--fc-text)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveAgeEdit(age)}
                            aria-label="Save age group name"
                            className="p-1.5 rounded bg-[var(--fc-green)] text-white hover:bg-[var(--fc-forest)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                          >
                            <Check className="size-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingAgeOldName(null)}
                            aria-label="Cancel editing"
                            className="p-1.5 rounded border border-[var(--fc-border)] bg-white text-[var(--fc-text-muted)] hover:bg-[#f0f3f0] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                          >
                            <X className="size-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[var(--fc-text)]">{age}</span>
                            <span
                              className="rounded-full bg-white border border-[var(--fc-border)] px-2 py-0.5 text-[11px] font-medium text-[var(--fc-text-muted)]"
                              title={`${usage} exercises/sessions use this age group`}
                            >
                              {usage} {usage === 1 ? "plan" : "plans"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAgeOldName(age);
                                setEditingAgeNewName(age);
                              }}
                              aria-label={`Edit age group ${age}`}
                              className="inline-flex size-9 items-center justify-center rounded-md border border-[var(--fc-border)] bg-white text-[var(--fc-text)] hover:bg-[#e8f2ea] hover:text-[var(--fc-forest)] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                            >
                              <Edit2 className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirm({
                                  type: "ageGroup",
                                  name: age,
                                  inUseCount: usage,
                                })
                              }
                              aria-label={`Delete age group ${age}`}
                              className="inline-flex size-9 items-center justify-center rounded-md border border-[#fecaca] bg-white text-[#b42318] hover:bg-[#fef3f2] focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <ConfirmModal
          isOpen={true}
          title={`Delete ${deleteConfirm.type === "category" ? "category" : "age group"} "${deleteConfirm.name}"?`}
          description={
            deleteConfirm.inUseCount > 0
              ? `Warning: There are currently ${deleteConfirm.inUseCount} exercises or sessions categorized under "${deleteConfirm.name}". Deleting it will remove it from future filter lists.`
              : `Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`
          }
          confirmLabel={`Delete ${deleteConfirm.name}`}
          cancelLabel="Cancel"
          isDestructive={true}
          onConfirm={() => {
            if (deleteConfirm.type === "category") {
              onDeleteCategory(deleteConfirm.name);
            } else {
              onDeleteAgeGroup(deleteConfirm.name);
            }
            setDeleteConfirm(null);
          }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
