"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  SlidersHorizontal,
  Mic,
  ArrowUp,
  ChevronDown,
  X,
  LayoutGrid,
  Table2,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { NotionAiMark } from "./icons";

const APPS = ["#E01E5A", "#4285F4", "#0F9D58", "#F4B400", "#7B68EE", "#000000", "#2EB67D", "#E44D26", "#1A73E8", "#EA4C89"];

const SUGGESTIONS = [
  { icon: <LayoutGrid className="h-4 w-4" strokeWidth={1.8} />, label: "Create Slides" },
  { icon: <Table2 className="h-4 w-4" strokeWidth={1.8} />, label: "Spreadsheets" },
  { icon: <BookOpen className="h-4 w-4" strokeWidth={1.8} />, label: "Research" },
  { icon: <Sparkles className="h-4 w-4" strokeWidth={1.8} />, label: "Visualize" },
];

/** The Notion AI chat landing view — "How can I help you today?". */
export function ChatView() {
  const [msg, setMsg] = useState("");
  const [showApps, setShowApps] = useState(true);

  const send = () => {
    if (!msg.trim()) return;
    toast.success("Asked Notion AI");
    setMsg("");
  };

  return (
    <main className="flex h-dvh flex-1 flex-col items-center justify-center bg-white px-6">
      <div className="w-full max-w-[720px]">
        {/* Logo + heading */}
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F1F0ED] text-[#37352F]">
            <NotionAiMark className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-[28px] font-semibold text-[#2C2C2B]">
            How can I help you today?
          </h1>
        </div>

        {/* Prompt box */}
        <div className="mt-6 rounded-2xl border border-black/[0.12] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder="Do anything with AI…"
            className="w-full resize-none bg-transparent px-4 pt-3.5 text-[15px] text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]"
          />
          <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
            <div className="flex items-center gap-0.5">
              <ChatIcon onClick={() => toast("Add context")}><Plus className="h-[18px] w-[18px]" strokeWidth={1.9} /></ChatIcon>
              <ChatIcon onClick={() => toast("Settings")}><SlidersHorizontal className="h-[18px] w-[18px]" strokeWidth={1.8} /></ChatIcon>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => toast("Model: Auto")}
                className="flex items-center gap-0.5 rounded-md px-1.5 py-1 text-[14px] text-[#5F5E59] hover:bg-black/[0.04]"
              >
                Auto
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
              <ChatIcon onClick={() => toast("Voice")}><Mic className="h-[18px] w-[18px]" strokeWidth={1.8} /></ChatIcon>
              <button
                onClick={send}
                aria-label="Send"
                className={
                  "flex h-7 w-7 items-center justify-center rounded-full transition-colors " +
                  (msg.trim() ? "bg-[#2383E2] text-white hover:bg-[#1a73d0]" : "bg-black/[0.06] text-[#9B9A97]")
                }
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </div>

        {/* Get better answers from your apps */}
        {showApps && (
          <div className="mt-2 flex items-center gap-2 px-1">
            <span className="text-[13px] text-[#9B9A97]">Get better answers from your apps</span>
            <div className="flex items-center gap-1">
              {APPS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => toast("Connect app")}
                  className="h-4 w-4 rounded-[3px]"
                  style={{ backgroundColor: c }}
                  aria-label="Connect app"
                />
              ))}
            </div>
            <button
              onClick={() => setShowApps(false)}
              className="ml-1 flex h-5 w-5 items-center justify-center rounded text-[#9B9A97] hover:bg-black/[0.05]"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        )}

        {/* Suggestions */}
        <div className="mt-7 flex items-center justify-center gap-6">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => { setMsg(s.label + " "); toast(s.label); }}
              className="flex items-center gap-1.5 text-[14px] text-[#5F5E59] transition-colors hover:text-[#2C2C2B]"
            >
              <span className="text-[#8A8985]">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

function ChatIcon({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md text-[#5F5E59] transition-colors hover:bg-black/[0.05]"
    >
      {children}
    </button>
  );
}
