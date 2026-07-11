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
  FileText,
  Palmtree,
  Trash2,
} from "lucide-react";

type Suggestion = { icon: React.ReactNode; label: string; badge?: string };

const SUGGESTIONS: Suggestion[] = [
  { icon: <span className="text-[15px] leading-none">🦆</span>, label: "Personalize your Notion AI" },
  { icon: <span className="text-[15px] leading-none">💻</span>, label: "Create HTML", badge: "New" },
  { icon: <span className="text-[15px] leading-none">📝</span>, label: "Write meeting agenda" },
  { icon: <span className="text-[15px] leading-none">📄</span>, label: "Analyze PDFs or images" },
];

/** Right-docked Notion AI chat panel (opens from the floating AI button). */
export function AiChatPanel({ onClose, contextTitle }: { onClose: () => void; contextTitle?: string }) {
  const [text, setText] = useState("");
  const [hasContext, setHasContext] = useState(true);

  // Popover States
  const [openPlusMenu, setOpenPlusMenu] = useState(false);
  const [openSettingsMenu, setOpenSettingsMenu] = useState(false);
  const [openModelMenu, setOpenModelMenu] = useState(false);
  const [openLayoutMenu, setOpenLayoutMenu] = useState(false);

  const [activeModel, setActiveModel] = useState("Auto");
  const [activeLayout, setActiveLayout] = useState("Sidebar");

  const send = () => {
    if (!text.trim()) return;
    toast(`Asked AI: ${text.trim()}`);
    setText("");
  };

  return (
    <div className="flex h-dvh w-[400px] shrink-0 flex-col border-l border-black/[0.08] bg-white text-[#2C2C2B] relative">
      
      {/* Header */}
      <div className="flex h-11 shrink-0 items-center justify-between px-3 border-b border-black/[0.04]">
        <button
          onClick={() => toast("Chat history")}
          className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[14px] font-medium text-[#37352F] hover:bg-black/[0.04]"
        >
          New AI chat
          <ChevronDown className="h-3.5 w-3.5 text-[#9B9A97]" strokeWidth={2} />
        </button>
        <div className="flex items-center gap-0.5 text-[#5F5E59]">
          <button
            onClick={() => { setText(""); toast("New chat"); }}
            aria-label="Start new chat"
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-black/[0.05]"
          >
            <MessageSquarePlus className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
          
          {/* Layout Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenLayoutMenu(!openLayoutMenu)}
              aria-label="Switch chat mode"
              className="flex h-7 w-7 items-center justify-center rounded hover:bg-black/[0.05]"
            >
              <Columns2 className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </button>
            {openLayoutMenu && (
              <div className="absolute right-0 top-8 z-50 w-[160px] rounded-lg border border-black/[0.08] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-[#37352F] text-[14px]">
                {["Sidebar", "Floating", "Full screen"].map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setActiveLayout(l);
                      setOpenLayoutMenu(false);
                      toast(`Layout mode: ${l}`);
                    }}
                    className="flex h-8 w-full items-center justify-between px-3.5 hover:bg-black/[0.04] text-left"
                  >
                    <span>{l}</span>
                    {activeLayout === l && (
                      <svg className="h-4 w-4 text-[#2C2C2B]" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M11.834 3.309a.625.625 0 0 1 1.072.642l-5.244 8.74a.625.625 0 0 1-1.01.085L3.155 8.699a.626.626 0 0 1 .95-.813l2.93 3.419z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Hide chat"
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-black/[0.05]"
          >
            <ChevronsRight className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Empty-state body — anchored just above the composer */}
      <div className="flex flex-1 flex-col justify-end px-4 pb-3 select-none">
        
        {/* Palm tree circle avatar logo */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-black/[0.08] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-black">
          <Palmtree className="h-7 w-7 text-[#37352F]" strokeWidth={1.6} />
        </div>

        <h2 className="mb-3 text-[19px] font-semibold text-[#2C2C2B]">How can I help you today?</h2>

        <div className="flex flex-col space-y-0.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => setText(s.label)}
              className="flex h-9 items-center gap-2.5 rounded-md px-1.5 text-left transition-colors hover:bg-black/[0.04]"
            >
              <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">{s.icon}</span>
              <span className="text-[14px] text-[#2C2C2B] font-medium">{s.label}</span>
              {s.badge && (
                <span className="rounded bg-[#EAF3FB] px-1.5 py-px text-[11px] font-semibold text-[#2383E2]">{s.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="px-3 pb-4">
        <div className="rounded-2xl border border-black/[0.12] focus-within:border-[#2383E2]/70 bg-[#F9F8F7] p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {hasContext && (
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <span className="flex h-6 items-center gap-1.5 rounded bg-black/[0.05] pl-1.5 pr-1 text-[13px] text-[#37352F]">
                <FileText className="h-3.5 w-3.5 text-[#5F5E59]" strokeWidth={1.7} />
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
            placeholder="Do anything with AI..."
            className="max-h-32 w-full resize-none bg-transparent px-1 text-[14px] text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]"
          />

          <div className="mt-1.5 flex items-center justify-between">
            <div className="flex items-center gap-0.5 text-[#5F5E59]">
              
              {/* Plus Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setOpenPlusMenu(!openPlusMenu)}
                  className="flex h-7 w-7 items-center justify-center rounded text-[#5F5E59] hover:bg-black/[0.05]"
                  aria-label="Add context"
                >
                  <Plus className="h-[18px] w-[18px]" strokeWidth={1.9} />
                </button>
                {openPlusMenu && (
                  <div className="absolute left-0 bottom-8 z-50 mb-1 w-[220px] rounded-lg border border-black/[0.08] bg-white py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-[#37352F] text-[13px] select-none">
                    <button
                      onClick={() => {
                        setOpenPlusMenu(false);
                        toast("Add images, PDFs, or CSVs clicked");
                      }}
                      className="flex h-9 w-full items-center gap-2 px-3 hover:bg-black/[0.04] text-left"
                    >
                      <span>📎</span>
                      <span className="font-medium">Add images, PDFs, or CSVs</span>
                    </button>
                    <button
                      onClick={() => {
                        setOpenPlusMenu(false);
                        toast("Mention pages or people clicked");
                      }}
                      className="flex h-9 w-full items-center gap-2 px-3 hover:bg-black/[0.04] text-left"
                    >
                      <span>@</span>
                      <span className="font-medium">Mention pages or people</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Sliders settings button */}
              <div className="relative">
                <button
                  onClick={() => setOpenSettingsMenu(!openSettingsMenu)}
                  className="flex h-7 w-7 items-center justify-center rounded text-[#5F5E59] hover:bg-black/[0.05]"
                  aria-label="Tune settings"
                >
                  <SlidersHorizontal className="h-[17px] w-[17px]" strokeWidth={1.8} />
                </button>
                {openSettingsMenu && (
                  <div className="absolute left-0 bottom-8 z-50 mb-1 w-[200px] rounded-lg border border-black/[0.08] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-[#37352F] text-[13px] select-none">
                    <button
                      onClick={() => {
                        setOpenSettingsMenu(false);
                        toast("Opened sources");
                      }}
                      className="flex h-8 w-full items-center justify-between px-3 hover:bg-black/[0.04] text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span>☍</span>
                        <span className="font-medium">My sources</span>
                      </div>
                      <span className="text-[12px] text-[#8A8985] flex items-center gap-0.5">3 <ChevronDown className="h-3 w-3 -rotate-90" /></span>
                    </button>
                    <button
                      onClick={() => {
                        setOpenSettingsMenu(false);
                        toast("Opened mode selection");
                      }}
                      className="flex h-8 w-full items-center justify-between px-3 hover:bg-black/[0.04] text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span>⌨</span>
                        <span className="font-medium">Mode</span>
                      </div>
                      <span className="text-[12px] text-[#8A8985] flex items-center gap-0.5">Default <ChevronDown className="h-3 w-3 -rotate-90" /></span>
                    </button>
                    <button
                      onClick={() => {
                        setOpenSettingsMenu(false);
                        toast("Personalize clicked");
                      }}
                      className="flex h-8 w-full items-center gap-2 px-3 hover:bg-black/[0.04] text-left"
                    >
                      <span>🦆</span>
                      <span className="font-medium">Personalize</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
            
            <div className="flex items-center gap-1">
              {/* Model Dropdown Selection */}
              <div className="relative">
                <button
                  onClick={() => setOpenModelMenu(!openModelMenu)}
                  className="flex h-7 items-center gap-1 rounded-md px-2 text-[13px] font-medium text-[#5F5E59] hover:bg-black/[0.05]"
                >
                  {activeModel}
                  <ChevronDown className="h-3 w-3 text-[#9B9A97]" strokeWidth={2} />
                </button>
                {openModelMenu && (
                  <div className="absolute right-0 bottom-8 z-50 mb-1 w-[240px] max-h-[300px] overflow-y-auto rounded-lg border border-black/[0.08] bg-white p-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-[#37352F] text-[13px] select-none">
                    <div className="px-2 py-1 text-[11px] font-semibold text-[#8A8985] uppercase tracking-wider flex items-center gap-1.5">
                      <span>Select a model</span>
                      <span className="bg-black/[0.05] rounded px-1 text-[9px] lowercase font-normal">Beta</span>
                    </div>
                    {[
                      "Sonnet 4.6",
                      "Sonnet 5",
                      "Opus 4.7",
                      "Opus 4.8",
                      "Fable 5",
                      "Gemini 3.1 Pro",
                      "GPT-5.6 Sol",
                      "GPT-5.6 Terra",
                      "GPT-5.2",
                      "GPT-5.4",
                      "GPT-5.5",
                      "Grok 4.3",
                      "SpaceXAI 4.5",
                      "Grok Build 0.1"
                    ].map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setActiveModel(m);
                          setOpenModelMenu(false);
                          toast(`Model switched to ${m}`);
                        }}
                        className="flex h-8 w-full items-center justify-between rounded px-2 hover:bg-black/[0.04] text-left"
                      >
                        <span>{m}</span>
                        {activeModel === m && (
                          <svg className="h-4 w-4 text-[#2C2C2B]" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M11.834 3.309a.625.625 0 0 1 1.072.642l-5.244 8.74a.625.625 0 0 1-1.01.085L3.155 8.699a.626.626 0 0 1 .95-.813l2.93 3.419z" />
                          </svg>
                        )}
                      </button>
                    ))}

                    <div className="my-1 h-[1px] bg-black/[0.06]" />

                    <div className="px-2 py-1 text-[11px] font-semibold text-[#8A8985] uppercase tracking-wider flex items-center gap-1.5">
                      <span>Small models</span>
                      <span className="bg-black/[0.05] rounded px-1 text-[9px] lowercase font-normal">Beta</span>
                    </div>
                    {[
                      "Gemini 3.5 Flash"
                    ].map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setActiveModel(m);
                          setOpenModelMenu(false);
                          toast(`Model switched to ${m}`);
                        }}
                        className="flex h-8 w-full items-center justify-between rounded px-2 hover:bg-black/[0.04] text-left"
                      >
                        <span>{m}</span>
                        {activeModel === m && (
                          <svg className="h-4 w-4 text-[#2C2C2B]" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M11.834 3.309a.625.625 0 0 1 1.072.642l-5.244 8.74a.625.625 0 0 1-1.01.085L3.155 8.699a.626.626 0 0 1 .95-.813l2.93 3.419z" />
                          </svg>
                        )}
                      </button>
                    ))}
                    
                    <div className="my-1 h-[1px] bg-black/[0.06]" />

                    <div className="px-2 py-1 text-[11px] font-semibold text-[#8A8985] uppercase tracking-wider flex items-center gap-1.5">
                      <span>Open models (US-hosted)</span>
                      <span className="bg-black/[0.05] rounded px-1 text-[9px] lowercase font-normal">Beta</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => toast("Voice recording")}
                aria-label="Start voice recording"
                className="flex h-7 w-7 items-center justify-center rounded text-[#5F5E59] hover:bg-black/[0.05]"
              >
                <Mic className="h-[17px] w-[17px]" strokeWidth={1.8} />
              </button>
              
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

      {/* Backdrop overlay for closing dropdown menus */}
      {(openPlusMenu || openSettingsMenu || openModelMenu || openLayoutMenu) && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => {
            setOpenPlusMenu(false);
            setOpenSettingsMenu(false);
            setOpenModelMenu(false);
            setOpenLayoutMenu(false);
          }}
        />
      )}
    </div>
  );
}
