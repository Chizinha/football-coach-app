import { useEffect } from "react";

interface StatusAnnouncerProps {
  message: string | null;
  onClear?: () => void;
}

export function StatusAnnouncer({ message, onClear }: StatusAnnouncerProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClear?.();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClear]);

  if (!message) return <div aria-live="polite" aria-atomic="true" className="sr-only" />;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      role="status"
      className="fixed bottom-16 right-4 z-50 flex items-center gap-2 rounded-lg border border-[#dde3de] bg-white px-4 py-3 text-sm font-medium text-[#202821] shadow-lg animate-in fade-in slide-in-from-bottom-2 md:bottom-6"
    >
      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#e8f2ea] text-[#174d32]">
        ✓
      </div>
      <span>{message}</span>
    </div>
  );
}
