"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  MessageSquarePlus,
  Columns2,
  ChevronsRight,
  Plus,
  SlidersHorizontal,
  Mic,
  ArrowUp,
  X,
  Presentation,
  NotebookPen,
  FileText,
} from "lucide-react";
import { NotionAiMark } from "./icons";

type Suggestion = { icon: React.ReactNode; label: string; badge?: string };

const SUGGESTIONS: Suggestion[] = [
  { icon: <span className="text-[15px] leading-none">🦆</span>, label: "Personalize your Notion AI" },
  { icon: <Presentation className="h-[17px] w-[17px] text-[#5F5E59]" strokeWidth={1.7} />, label: "Create a slide deck", badge: "New" },
  { icon: <NotebookPen className="h-[17px] w-[17px] text-[#5F5E59]" strokeWidth={1.7} />, label: "Write meeting agenda" },
  { icon: <FileText className="h-[17px] w-[17px] text-[#5F5E59]" strokeWidth={1.7} />, label: "Analyze PDFs or images" },
];

/** Right-docked Notion AI chat panel (opens from the floating AI button). */
export function AiChatPanel({ onClose, contextTitle }: { onClose: () => void; contextTitle?: string }) {
  const [text, setText] = useState("");
  const [hasContext, setHasContext] = useState(true);

  const send = () => {
    if (!text.trim()) return;
    toast(`Asked AI: ${text.trim()}`);
    setText("");
  };

  return (
    <div className="flex h-dvh w-[400px] shrink-0 flex-col border-l border-black/[0.08] bg-white text-[#2C2C2B]">
      {/* Header */}
      <div className="flex h-11 shrink-0 items-center justify-between px-3">
        <button
          onClick={() => toast("Chat history")}
          className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[14px] font-medium text-[#37352F] hover:bg-black/[0.04]"
        >
          New AI chat
          <ChevronDown className="h-3.5 w-3.5 text-[#9B9A97]" strokeWidth={2} />
        </button>
        <div className="flex items-center gap-0.5 text-[#5F5E59]">
          <HdrIcon label="Start new chat" onClick={() => { setText(""); toast("New chat"); }}>
            <MessageSquarePlus className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </HdrIcon>
          <HdrIcon label="Switch chat mode" onClick={() => toast("Switch chat mode")}>
            <Columns2 className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </HdrIcon>
          <HdrIcon label="Hide chat" onClick={onClose}>
            <ChevronsRight className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </HdrIcon>
        </div>
      </div>

      {/* Empty-state body — anchored just above the composer */}
      <div className="flex flex-1 flex-col justify-end px-4 pb-3">
        <button
          onClick={() => toast("Personalize your Notion AI")}
          aria-label="Open personalization settings"
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.08] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
        >
          <NotionAiMark className="h-6 w-6 text-[#37352F]" />
        </button>

        <h2 className="mb-3 text-[19px] font-semibold text-[#2C2C2B]">How can I help you today?</h2>

        <div className="flex flex-col">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => setText(s.label)}
              className="flex h-9 items-center gap-2.5 rounded-md px-1.5 text-left transition-colors hover:bg-black/[0.04]"
            >
              <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">{s.icon}</span>
              <span className="text-[14px] text-[#2C2C2B]">{s.label}</span>
              {s.badge && (
                <span className="rounded bg-[#EAF3FB] px-1.5 py-px text-[11px] font-medium text-[#2383E2]">{s.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="px-3 pb-4">
        <div className="rounded-2xl border border-[#2383E2]/70 bg-white p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          {hasContext && (
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <span className="flex h-6 items-center gap-1.5 rounded-md bg-black/[0.05] pl-1.5 pr-1 text-[13px] text-[#37352F]">
                <FileText className="h-3.5 w-3.5 text-[#91918E]" strokeWidth={1.7} />
                {contextTitle ?? "New page"}
                <button onClick={() => setHasContext(false)} aria-label="Remove" className="flex h-4 w-4 items-center justify-center rounded text-[#9B9A97] hover:bg-black/[0.08]">
                  <X className="h-3 w-3" strokeWidth={2.2} />
                </button>
              </span>
            </div>
          )}

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
              if (e.key === "Escape") onClose();
            }}
            rows={1}
            placeholder="Do anything with AI…"
            className="max-h-32 w-full resize-none bg-transparent px-1 text-[15px] text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]"
          />

          <div className="mt-1.5 flex items-center justify-between">
            <div className="flex items-center gap-0.5 text-[#5F5E59]">
              <CmpIcon label="Give context" onClick={() => setHasContext(true)}>
                <Plus className="h-[18px] w-[18px]" strokeWidth={1.9} />
              </CmpIcon>
              <CmpIcon label="Settings" onClick={() => toast("AI settings")}>
                <SlidersHorizontal className="h-[17px] w-[17px]" strokeWidth={1.8} />
              </CmpIcon>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => toast("Model: Auto")} className="flex h-7 items-center gap-1 rounded-md px-2 text-[13px] font-medium text-[#5F5E59] hover:bg-black/[0.05]">
                Auto
                <ChevronDown className="h-3 w-3 text-[#9B9A97]" strokeWidth={2} />
              </button>
              <CmpIcon label="Start voice recording" onClick={() => toast("Voice recording")}>
                <Mic className="h-[17px] w-[17px]" strokeWidth={1.8} />
              </CmpIcon>
              <button
                onClick={send}
                disabled={!text.trim()}
                aria-label="Submit AI message"
                className={
                  "flex h-7 w-7 items-center justify-center rounded-full transition-colors " +
                  (text.trim() ? "bg-[#2383E2] text-white hover:bg-[#1a73d0]" : "bg-black/[0.06] text-[#B4B1AB]")
                }
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HdrIcon({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-black/[0.05]">
      {children}
    </button>
  );
}

function CmpIcon({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-black/[0.05]">
      {children}
    </button>
  );
}
