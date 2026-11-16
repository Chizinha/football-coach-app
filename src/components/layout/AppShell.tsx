import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Layers,
  BookOpen,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Menu,
  X,
  User,
} from "lucide-react";
import { ConfirmModal } from "../common/ConfirmModal";

export type ActiveTab = "dashboard" | "exercises" | "sessions" | "club" | "principles" | "showcase";

interface AppShellProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  onResetDemoData: () => void;
  children: ReactNode;
}

export function AppShell({
  activeTab,
  onNavigate,
  onResetDemoData,
  children,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const mainNavItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "exercises" as const, label: "Exercises", icon: ClipboardList },
    { id: "sessions" as const, label: "Training sessions", icon: Layers },
    { id: "club" as const, label: "Club library", icon: BookOpen },
    { id: "principles" as const, label: "Club principles", icon: ShieldCheck },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[var(--fc-app-bg)] text-[var(--fc-text)] font-sans antialiased">
      {/* Skip to Main Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[var(--fc-forest)] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex md:w-[var(--fc-sidebar-width)] md:flex-col md:fixed md:inset-y-0 border-r border-[var(--fc-border)] bg-[var(--fc-white)] z-30"
        aria-label="Main Navigation"
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-[var(--fc-border)] px-6">
          <div
            className="flex size-9 items-center justify-center rounded-lg bg-[var(--fc-forest)] text-white font-bold"
            aria-hidden="true"
          >
            FC
          </div>
          <div>
            <span className="block text-base font-bold leading-tight tracking-tight text-[var(--fc-text)]">
              Football Coach
            </span>
            <span className="block text-xs font-medium text-[var(--fc-text-muted)]">
              Club Prototype v0.2
            </span>
          </div>
        </div>

        {/* Coach Demo Profile Badge */}
        <div className="mx-4 my-3 flex items-center gap-2.5 rounded-lg bg-[var(--fc-pale-green)] px-3 py-2 text-xs font-medium text-[var(--fc-forest)]">
          <div className="flex size-6 items-center justify-center rounded-full bg-white text-[var(--fc-forest)] shadow-xs">
            <User className="size-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">Demo Coach</p>
            <p className="truncate text-[10px] text-[var(--fc-text-muted)]">Local prototype</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Club Sections">
          {mainNavItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNavClick(id)}
                aria-current={isActive ? "page" : undefined}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)] ${
                  isActive
                    ? "bg-[var(--fc-pale-green)] text-[var(--fc-forest)] border-l-3 border-[var(--fc-forest)] pl-2.5"
                    : "text-[var(--fc-text)] hover:bg-[#f0f3f0] hover:text-[var(--fc-forest)]"
                }`}
              >
                <Icon
                  className={`size-5 shrink-0 ${
                    isActive ? "text-[var(--fc-forest)]" : "text-[var(--fc-text-muted)] group-hover:text-[var(--fc-forest)]"
                  }`}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions (Reset Demo Data & Dev Showcase) */}
        <div className="border-t border-[var(--fc-border)] p-3 space-y-1">
          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--fc-text-muted)] hover:bg-[#fff7ed] hover:text-[var(--fc-warning)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)]"
            title="Reset data to initial demo state"
          >
            <RotateCcw className="size-4 shrink-0" aria-hidden="true" />
            <span>Reset demo data</span>
          </button>

          {/* Development Showcase Link */}
          <button
            type="button"
            onClick={() => handleNavClick("showcase")}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--fc-forest)] ${
              activeTab === "showcase"
                ? "bg-[var(--fc-pale-green)] text-[var(--fc-forest)] font-semibold"
                : "text-[var(--fc-text-muted)] hover:bg-[#f0f3f0] hover:text-[var(--fc-text)]"
            }`}
          >
            <Sparkles className="size-4 shrink-0 text-[#267a43]" aria-hidden="true" />
            <span>Design system showcase</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 inset-x-0 h-14 border-b border-[var(--fc-border)] bg-white px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md bg-[var(--fc-forest)] text-white text-xs font-bold">
            FC
          </div>
          <span className="font-bold text-sm text-[var(--fc-text)]">Football Coach</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--fc-border)] text-[var(--fc-text)] hover:bg-[#f0f3f0] focus-visible:outline-[var(--fc-forest)]"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="md:hidden fixed inset-0 z-50 flex flex-col bg-white p-6 pt-16 animate-in slide-in-from-top-4"
        >
          <div className="flex justify-between items-center pb-4 border-b border-[var(--fc-border)]">
            <span className="font-bold text-base text-[var(--fc-text)]">Menu & Navigation</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation"
              className="rounded-lg p-2 text-[var(--fc-text)] hover:bg-[#f0f3f0]"
            >
              <X className="size-6" />
            </button>
          </div>

          <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
            {mainNavItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavClick(id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex w-full items-center gap-3.5 rounded-lg px-4 py-3 text-base font-semibold ${
                    isActive
                      ? "bg-[var(--fc-pale-green)] text-[var(--fc-forest)]"
                      : "text-[var(--fc-text)] hover:bg-[#f0f3f0]"
                  }`}
                >
                  <Icon className="size-5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[var(--fc-border)] space-y-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setConfirmResetOpen(true);
              }}
              className="flex w-full items-center gap-3 rounded-lg border border-[#fed7aa] bg-[#fff7ed] px-4 py-3 text-sm font-semibold text-[var(--fc-warning)]"
            >
              <RotateCcw className="size-4" />
              <span>Reset demo data</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("showcase")}
              className="flex w-full items-center gap-3 rounded-lg border border-[var(--fc-border)] bg-[#f7f9f7] px-4 py-3 text-sm font-semibold text-[var(--fc-text)]"
            >
              <Sparkles className="size-4 text-[#267a43]" />
              <span>Design system showcase</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:pl-[var(--fc-sidebar-width)] flex flex-col min-h-screen">
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-12 max-w-[var(--fc-content-max)] w-full mx-auto outline-none"
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 h-16 border-t border-[var(--fc-border)] bg-white px-2 flex items-center justify-around z-40"
      >
        {mainNavItems.slice(0, 4).map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleNavClick(id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 px-2 text-xs font-semibold rounded-md ${
                isActive
                  ? "text-[var(--fc-forest)] font-bold"
                  : "text-[var(--fc-text-muted)] hover:text-[var(--fc-text)]"
              }`}
            >
              <Icon className={`size-5 ${isActive ? "text-[var(--fc-forest)]" : "text-[var(--fc-text-muted)]"}`} />
              <span className="mt-0.5 text-[10px] leading-tight">{label.split(" ")[0]}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => handleNavClick("principles")}
          aria-current={activeTab === "principles" ? "page" : undefined}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 px-2 text-xs font-semibold rounded-md ${
            activeTab === "principles"
              ? "text-[var(--fc-forest)] font-bold"
              : "text-[var(--fc-text-muted)] hover:text-[var(--fc-text)]"
          }`}
        >
          <ShieldCheck className={`size-5 ${activeTab === "principles" ? "text-[var(--fc-forest)]" : "text-[var(--fc-text-muted)]"}`} />
          <span className="mt-0.5 text-[10px] leading-tight">Principles</span>
        </button>
      </nav>

      {/* Reset Confirmation Dialog */}
      <ConfirmModal
        isOpen={confirmResetOpen}
        title="Reset demo data to initial state?"
        description="This will restore all exercises, training sessions, and club guidelines to the original seed data. Any newly created exercises or custom changes in your local browser will be replaced."
        confirmLabel="Reset demo data"
        cancelLabel="Keep my changes"
        isDestructive={true}
        onConfirm={() => {
          onResetDemoData();
          setConfirmResetOpen(false);
        }}
        onCancel={() => setConfirmResetOpen(false)}
      />
    </div>
  );
}
