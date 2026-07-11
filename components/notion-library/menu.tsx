"use client";

import { useEffect, useRef, useState } from "react";

export function useClickOutside(onClose: () => void, ignoreSelector?: string) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as Element;
      if (ref.current && ref.current.contains(target)) return;
      // Ignore clicks on the trigger so it can toggle the popover itself.
      if (ignoreSelector && target.closest?.(ignoreSelector)) return;
      onClose();
    }
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
    };
  }, [onClose, ignoreSelector]);
  return ref;
}

/**
 * Lightweight click-to-open dropdown. `trigger` is the button; `children` is the
 * menu content shown in a floating panel below/near it.
 */
export function Dropdown({
  trigger,
  children,
  align = "left",
  width = 220,
}: {
  trigger: (open: boolean, toggle: () => void) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: "left" | "right" | "center";
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  const posStyle =
    align === "center"
      ? { left: "50%", transform: "translateX(-50%)" }
      : { [align === "right" ? "right" : "left"]: 0 };
  return (
    <div ref={ref} className="relative">
      {trigger(open, () => setOpen((v) => !v))}
      {open && (
        <div
          className="absolute z-50 mt-1 overflow-hidden rounded-lg border border-black/[0.08] bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
          style={{
            width,
            ...posStyle,
          }}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function MenuItem({
  icon,
  children,
  onClick,
  danger,
  blue,
  trailing,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  blue?: boolean;
  trailing?: React.ReactNode;
}) {
  const textColor = danger ? "text-[#D44C47]" : blue ? "text-[#2383E2]" : "text-[#37352F]";
  const iconColor = danger ? "text-[#D44C47]" : blue ? "text-[#2383E2]" : "text-[#8A8985]";
  return (
    <button
      onClick={onClick}
      className={
        "flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] transition-colors hover:bg-black/[0.05] " +
        textColor
      }
    >
      {icon && (
        <span className={"flex h-4 w-4 items-center justify-center " + iconColor}>
          {icon}
        </span>
      )}
      <span className="flex-1 truncate">{children}</span>
      {trailing}
    </button>
  );
}

export function MenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-[#9B9A97]">
      {children}
    </div>
  );
}

export function MenuSeparator() {
  return <div className="my-1 h-px bg-black/[0.06]" />;
}
