import { useState, useEffect, useCallback } from "react";
import type { Exercise, Visibility } from "./types/exercise";
import type { TrainingSession } from "./types/session";
import type { ClubPrinciplesData } from "./types/principles";
import {
  getExercises,
  saveExercise,
  deleteExercise,
  duplicateExercise,
  getSessions,
  saveSession,
  deleteSession,
  duplicateSession,
  createExerciseSnapshot,
  getClubPrinciples,
  saveClubPrinciples,
  resetDemoData,
} from "./lib/storage";

import { AppShell, type ActiveTab } from "./components/layout/AppShell";
import { DashboardView } from "./components/dashboard/DashboardView";
import { ExerciseListView } from "./components/exercises/ExerciseListView";
import { ExerciseDetailView } from "./components/exercises/ExerciseDetailView";
import { ExerciseFormView } from "./components/exercises/ExerciseFormView";
import { SessionListView } from "./components/sessions/SessionListView";
import { SessionDetailView } from "./components/sessions/SessionDetailView";
import { SessionBuilderView } from "./components/sessions/SessionBuilderView";
import { ClubLibraryView } from "./components/club/ClubLibraryView";
import { ClubPrinciplesView } from "./components/principles/ClubPrinciplesView";
import { StatusAnnouncer } from "./components/common/StatusAnnouncer";
import { generateUniqueId } from "./lib/utils";
import DesignSystemShowcase from "./DesignSystemShowcase";
import { ArrowLeft } from "lucide-react";

type ExerciseSubView = "list" | "detail" | "create" | "edit";
type SessionSubView = "list" | "detail" | "create" | "edit";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#design-system" || hash === "#showcase") {
        return "showcase";
      }
    }
    return "dashboard";
  });
  const [exerciseSubView, setExerciseSubView] = useState<ExerciseSubView>("list");
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const [sessionSubView, setSessionSubView] = useState<SessionSubView>("list");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);

  // Status Notification
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Data State
  const [exercises, setExercises] = useState<Exercise[]>(() => getExercises());
  const [sessions, setSessions] = useState<TrainingSession[]>(() => getSessions());
  const [principles, setPrinciples] = useState<ClubPrinciplesData>(() => getClubPrinciples());

  const reloadData = useCallback(() => {
    setExercises(getExercises());
    setSessions(getSessions());
    setPrinciples(getClubPrinciples());
  }, []);

  // Listen for hashchange events
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#design-system" || hash === "#showcase") {
        setActiveTab("showcase");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Navigate handler
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === "exercises") {
      setExerciseSubView("list");
      setSelectedExerciseId(null);
    } else if (tab === "sessions") {
      setSessionSubView("list");
      setSelectedSessionId(null);
    }
    // Update hash for dev bookmarking
    if (tab === "showcase") {
      window.location.hash = "#design-system";
    } else {
      if (window.location.hash === "#design-system") {
        history.replaceState(null, "", " ");
      }
    }
  };

  /* ==================== EXERCISE HANDLERS ==================== */

  const handleOpenExercise = (id: string) => {
    setSelectedExerciseId(id);
    setExerciseSubView("detail");
    setActiveTab("exercises");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartCreateExercise = () => {
    setEditingExercise(null);
    setExerciseSubView("create");
    setActiveTab("exercises");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setExerciseSubView("edit");
    setActiveTab("exercises");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveExercise = (exerciseToSave: Exercise) => {
    saveExercise(exerciseToSave);
    reloadData();
    setSelectedExerciseId(exerciseToSave.id);
    setExerciseSubView("detail");
    setStatusMessage(`Exercise "${exerciseToSave.title}" saved successfully.`);
  };

  const handleDeleteExercise = (id: string) => {
    deleteExercise(id);
    reloadData();
    setSelectedExerciseId(null);
    setExerciseSubView("list");
    setStatusMessage("Exercise deleted from your library.");
  };

  const handleDuplicateExercise = (sourceId: string) => {
    const copy = duplicateExercise(sourceId);
    reloadData();
    if (copy) {
      setSelectedExerciseId(copy.id);
      setExerciseSubView("detail");
      setStatusMessage(`Duplicated as "${copy.title}" in your library.`);
    }
  };

  const handleToggleExerciseVisibility = (exercise: Exercise) => {
    const nextVis: Visibility = exercise.visibility === "club" ? "private" : "club";
    const updated: Exercise = { ...exercise, visibility: nextVis };
    saveExercise(updated);
    reloadData();
    setStatusMessage(
      nextVis === "club"
        ? `"${exercise.title}" is now shared with the club.`
        : `"${exercise.title}" is now private.`
    );
  };

  /* ==================== SESSION HANDLERS ==================== */

  const handleOpenSession = (id: string) => {
    setSelectedSessionId(id);
    setSessionSubView("detail");
    setActiveTab("sessions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartCreateSession = () => {
    setEditingSession(null);
    setSessionSubView("create");
    setActiveTab("sessions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartEditSession = (session: TrainingSession) => {
    setEditingSession(session);
    setSessionSubView("edit");
    setActiveTab("sessions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveSession = (sessionToSave: TrainingSession) => {
    saveSession(sessionToSave);
    reloadData();
    setSelectedSessionId(sessionToSave.id);
    setSessionSubView("detail");
    setStatusMessage(`Session "${sessionToSave.title}" saved successfully.`);
  };

  const handleDeleteSession = (id: string) => {
    deleteSession(id);
    reloadData();
    setSelectedSessionId(null);
    setSessionSubView("list");
    setStatusMessage("Training session deleted.");
  };

  const handleDuplicateSession = (sourceId: string) => {
    const copy = duplicateSession(sourceId);
    reloadData();
    if (copy) {
      setSelectedSessionId(copy.id);
      setSessionSubView("detail");
      setStatusMessage(`Duplicated as "${copy.title}".`);
    }
  };

  const handleToggleSessionVisibility = (session: TrainingSession) => {
    const nextVis: Visibility = session.visibility === "club" ? "private" : "club";
    const updated: TrainingSession = { ...session, visibility: nextVis };
    saveSession(updated);
    reloadData();
    setStatusMessage(
      nextVis === "club"
        ? `"${session.title}" is now shared with the club.`
        : `"${session.title}" is now private.`
    );
  };

  const handleAddExerciseToSession = (exercise: Exercise, sessionId: string) => {
    const targetSession = sessions.find((s) => s.id === sessionId);
    if (!targetSession) return;

    const newItem = {
      id: generateUniqueId("sitem"),
      sourceExerciseId: exercise.id,
      sourceVisibility: exercise.visibility,
      order: targetSession.items.length + 1,
      plannedDurationMinutes: exercise.durationMinutes || 15,
      sessionNotes: "",
      exerciseSnapshot: createExerciseSnapshot(exercise),
    };

    const updatedSession: TrainingSession = {
      ...targetSession,
      items: [...targetSession.items, newItem],
      updatedAt: new Date().toISOString(),
    };

    saveSession(updatedSession);
    reloadData();
    setStatusMessage(`Added "${exercise.title}" to session "${targetSession.title}".`);
  };

  /* ==================== CLUB & DIRECT USE HANDLERS ==================== */

  // Direct Use in Session from Club Library (does NOT duplicate into personal library)
  const handleUseInSessionDirectly = (exercise: Exercise) => {
    // Open session selector or add to most recent session
    if (sessions.length > 0) {
      const targetSession = sessions[0];
      handleAddExerciseToSession(exercise, targetSession.id);
    } else {
      // If no session exists, create one with this exercise
      const newSession: TrainingSession = {
        id: generateUniqueId("sess"),
        title: `Training Session with ${exercise.title}`,
        description: `Training session focused on ${exercise.theme}`,
        theme: exercise.theme,
        ageGroup: exercise.ageGroups[0] || "All ages",
        visibility: "private",
        creatorName: "Demo Coach",
        items: [
          {
            id: generateUniqueId("sitem"),
            sourceExerciseId: exercise.id,
            sourceVisibility: exercise.visibility,
            order: 1,
            plannedDurationMinutes: exercise.durationMinutes || 15,
            sessionNotes: "",
            exerciseSnapshot: createExerciseSnapshot(exercise),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveSession(newSession);
      reloadData();
      handleOpenSession(newSession.id);
      setStatusMessage(`Created new session directly using "${exercise.title}".`);
    }
  };

  /* ==================== PRINCIPLES & DEMO RESET HANDLERS ==================== */

  const handleSavePrinciples = (newPrinciples: ClubPrinciplesData) => {
    saveClubPrinciples(newPrinciples);
    reloadData();
    setStatusMessage("Club guidelines and principles updated successfully.");
  };

  const handleResetDemoData = () => {
    resetDemoData();
    reloadData();
    setExerciseSubView("list");
    setSessionSubView("list");
    setSelectedExerciseId(null);
    setSelectedSessionId(null);
    setActiveTab("dashboard");
    setStatusMessage("All demo data reset to initial prototype state.");
  };

  /* ==================== RENDER SELECTED TAB ==================== */

  const activeExercise = exercises.find((ex) => ex.id === selectedExerciseId);
  const activeSession = sessions.find((s) => s.id === selectedSessionId);

  // If in Dev Showcase view
  if (activeTab === "showcase") {
    return (
      <div className="relative min-h-screen bg-[var(--fc-app-bg)]">
        {/* Banner to return to Coach App */}
        <div className="sticky top-0 z-50 flex items-center justify-between border-b border-[var(--fc-border-strong)] bg-[var(--fc-forest)] px-6 py-2.5 text-white shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="rounded bg-white/20 px-2 py-0.5">DEV REFERENCE</span>
            <span>Design System Showcase</span>
          </div>
          <button
            type="button"
            onClick={() => handleTabChange("dashboard")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[var(--fc-forest)] hover:bg-[#e8f2ea] transition"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Football Coach App</span>
          </button>
        </div>
        <DesignSystemShowcase />
      </div>
    );
  }

  return (
    <AppShell
      activeTab={activeTab}
      onNavigate={handleTabChange}
      onResetDemoData={handleResetDemoData}
    >
      {/* Toast Announcement */}
      <StatusAnnouncer message={statusMessage} onClear={() => setStatusMessage(null)} />

      {/* Tab: Dashboard */}
      {activeTab === "dashboard" && (
        <DashboardView
          exercises={exercises}
          sessions={sessions}
          onNavigate={handleTabChange}
          onCreateExercise={handleStartCreateExercise}
          onCreateSession={handleStartCreateSession}
          onOpenExercise={handleOpenExercise}
          onOpenSession={handleOpenSession}
        />
      )}

      {/* Tab: Exercises */}
      {activeTab === "exercises" && (
        <>
          {exerciseSubView === "list" && (
            <ExerciseListView
              exercises={exercises}
              onCreateExercise={handleStartCreateExercise}
              onOpenExercise={handleOpenExercise}
            />
          )}

          {exerciseSubView === "detail" && activeExercise && (
            <ExerciseDetailView
              exercise={activeExercise}
              sessions={sessions}
              onBack={() => setExerciseSubView("list")}
              onEdit={handleStartEditExercise}
              onDuplicate={handleDuplicateExercise}
              onToggleVisibility={handleToggleExerciseVisibility}
              onDelete={handleDeleteExercise}
              onAddToSession={handleAddExerciseToSession}
            />
          )}

          {(exerciseSubView === "create" || exerciseSubView === "edit") && (
            <ExerciseFormView
              initialExercise={editingExercise}
              onSave={handleSaveExercise}
              onCancel={() => {
                if (selectedExerciseId && exerciseSubView === "edit") {
                  setExerciseSubView("detail");
                } else {
                  setExerciseSubView("list");
                }
              }}
            />
          )}
        </>
      )}

      {/* Tab: Training Sessions */}
      {activeTab === "sessions" && (
        <>
          {sessionSubView === "list" && (
            <SessionListView
              sessions={sessions}
              onCreateSession={handleStartCreateSession}
              onOpenSession={handleOpenSession}
            />
          )}

          {sessionSubView === "detail" && activeSession && (
            <SessionDetailView
              session={activeSession}
              onBack={() => setSessionSubView("list")}
              onEdit={handleStartEditSession}
              onDuplicate={handleDuplicateSession}
              onDelete={handleDeleteSession}
              onToggleVisibility={handleToggleSessionVisibility}
            />
          )}

          {(sessionSubView === "create" || sessionSubView === "edit") && (
            <SessionBuilderView
              initialSession={editingSession}
              availableExercises={exercises}
              onSave={handleSaveSession}
              onCancel={() => {
                if (selectedSessionId && sessionSubView === "edit") {
                  setSessionSubView("detail");
                } else {
                  setSessionSubView("list");
                }
              }}
            />
          )}
        </>
      )}

      {/* Tab: Club Library */}
      {activeTab === "club" && (
        <ClubLibraryView
          exercises={exercises}
          sessions={sessions}
          onOpenExercise={handleOpenExercise}
          onOpenSession={handleOpenSession}
          onDuplicateExercise={handleDuplicateExercise}
          onDuplicateSession={handleDuplicateSession}
          onUseInSession={handleUseInSessionDirectly}
        />
      )}

      {/* Tab: Club Principles */}
      {activeTab === "principles" && (
        <ClubPrinciplesView
          principles={principles}
          onSave={handleSavePrinciples}
        />
      )}
    </AppShell>
  );
}
