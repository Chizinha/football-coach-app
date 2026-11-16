import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus modal when opened
      confirmButtonRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onCancel();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-xl border border-[#dde3de] bg-white p-6 shadow-xl animate-in zoom-in-95"
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
              isDestructive ? "bg-[#fef3f2] text-[#b42318]" : "bg-[#eff6ff] text-[#1d4ed8]"
            }`}
          >
            <AlertTriangle className="size-5" />
          </div>
          <div className="flex-1">
            <h2 id="modal-title" className="text-lg font-bold text-[#202821]">
              {title}
            </h2>
            <p id="modal-description" className="mt-2 text-sm leading-relaxed text-[#5b665e]">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            className="rounded-md p-1.5 text-[#5b665e] hover:bg-[#f0f3f0] hover:text-[#202821] focus-visible:outline-[#174d32]"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-[#dde3de] bg-white px-4 text-sm font-semibold text-[#202821] hover:bg-[#f7f9f7] focus-visible:outline-[#174d32]"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className={`inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white focus-visible:outline-[#174d32] ${
              isDestructive
                ? "bg-[#b42318] hover:bg-[#912018]"
                : "bg-[#267a43] hover:bg-[#174d32]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
