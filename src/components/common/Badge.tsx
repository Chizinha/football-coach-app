import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "neutral" | "primary" | "success" | "warning" | "info" | "club" | "private";
  className?: string;
}

export function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  const variantStyles = {
    neutral: "bg-[#f0f3f0] text-[#5b665e] border-[#dde3de]",
    primary: "bg-[#e8f2ea] text-[#174d32] border-[#dde3de]",
    success: "bg-[#e8f2ea] text-[#174d32] border-[#dde3de]",
    warning: "bg-[#fff7ed] text-[#8a4b08] border-[#fed7aa]",
    info: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
    club: "bg-[#e8f2ea] text-[#174d32] border-[#dde3de]",
    private: "bg-[#f0f3f0] text-[#5b665e] border-[#dde3de]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
