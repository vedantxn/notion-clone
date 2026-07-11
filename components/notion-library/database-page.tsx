"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  ArrowUpRight,
  Database,
  ArrowDown,
  ArrowUp,
  X,
  Check,
  Target,
  FileText,
  MoreHorizontal,
  TableProperties,
} from "lucide-react";

// FaceIcon helper drawing
function FaceIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M35 48 C37 42 45 42 47 48" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M52 48 C54 41 64 41 66 48 M52 48 C51 52 50 60 50 67 L44 71" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="41" cy="52" r="3.5" fill="currentColor" />
      <circle cx="59" cy="52" r="3.5" fill="currentColor" />
    </svg>
  );
}

export function DatabasePage({ fullWidth }: { fullWidth?: boolean }) {
  const [panelOpen, setPanelOpen] = useState(true);
  const [aiText, setAiText] = useState("");

  const handleAiSend = () => {
    if (!aiText.trim()) return;
    toast(`AI creating database: ${aiText}`);
    setAiText("");
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden text-[#2C2C2B] bg-white">
      {/* Left Area: Main Database Table View */}
      <div className="flex-1 flex flex-col overflow-y-auto px-16 pt-16">
        <div className={fullWidth ? "max-w-full" : "max-w-[900px] w-full mx-auto"}>
          {/* Page Title */}
          <h1 className="text-[44px] font-bold leading-[1.1] text-[#2C2C2B] mb-6">New database</h1>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 border-b border-black/[0.08] pb-1.5 mb-6">
            <button className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#F1F0EF] text-[14px] font-semibold text-[#37352F]">
              <TableProperties className="h-4 w-4 text-[#37352F]" />
              Table
            </button>
          </div>

          {/* Database Grid Table */}
          <div className="border border-black/[0.08] rounded-lg overflow-hidden bg-white text-[14px]">
            {/* Table Header */}
            <div className="flex border-b border-black/[0.08] bg-[#F9F8F7] text-[#5F5E59] font-medium">
              <div className="w-[300px] px-3 py-2 border-r border-black/[0.08] flex items-center gap-1.5">
                <span className="text-[12px] font-semibold text-[#8A8985]">Aa</span>
                <span>Name</span>
              </div>
              <div className="flex-1 px-3 py-2 flex items-center gap-1 text-[#8A8985] cursor-pointer hover:bg-black/[0.03]">
                <Plus className="h-3.5 w-3.5" />
                <span>Add property</span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-black/[0.06]">
              {/* Row 1: + New page */}
              <div className="flex hover:bg-black/[0.02]">
                <div className="w-[300px] px-3 py-2 border-r border-black/[0.08] flex items-center gap-1.5 text-[#9B9A97] cursor-pointer">
                  <Plus className="h-3.5 w-3.5" />
                  <span>New page</span>
                </div>
                <div className="flex-1 px-3 py-2"></div>
              </div>

              {/* Row 2: Empty row */}
              <div className="flex h-9">
                <div className="w-[300px] border-r border-black/[0.08]"></div>
                <div className="flex-1"></div>
              </div>

              {/* Row 3: Empty row */}
              <div className="flex h-9">
                <div className="w-[300px] border-r border-black/[0.08]"></div>
                <div className="flex-1"></div>
              </div>

              {/* Row 4: Empty row */}
              <div className="flex h-9">
                <div className="w-[300px] border-r border-black/[0.08]"></div>
                <div className="flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Area: New Database Panel */}
      {panelOpen && (
        <aside className="w-[320px] shrink-0 border-l border-black/[0.08] bg-[#FCFCFB] p-4 flex flex-col gap-4 select-none overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[15px] text-[#2C2C2B]">New database</h2>
            <button
              onClick={() => setPanelOpen(false)}
              className="flex h-6 w-6 items-center justify-center rounded hover:bg-black/[0.05] text-[#8A8985]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* AI Prompt Box */}
          <div className="rounded-xl border border-[#2383E2]/70 bg-white p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white border border-black/[0.06] text-black">
              <FaceIcon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 flex flex-col">
              <textarea
                value={aiText}
                onChange={(e) => setAiText(e.target.value)}
                placeholder="Describe what you want to build"
                className="w-full resize-none text-[13px] text-[#2C2C2B] outline-none placeholder:text-[#9B9A97] min-h-[44px] bg-transparent"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAiSend();
                  }
                }}
              />
              <div className="flex justify-end mt-1">
                <button
                  onClick={handleAiSend}
                  disabled={!aiText.trim()}
                  className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                    aiText.trim() ? "bg-[#2383E2] text-white hover:bg-[#1a73d0]" : "bg-black/[0.06] text-[#B4B1AB]"
                  }`}
                >
                  <ArrowUp className="h-3 w-3" strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-0.5 text-[13.5px] text-[#2C2C2B]">
            <button
              onClick={() => toast("Created empty database")}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-black/[0.04]"
            >
              <Plus className="h-4 w-4 text-[#5F5E59]" strokeWidth={2} />
              <span className="font-medium">New empty data source</span>
            </button>
            <button
              onClick={() => toast("Import CSV clicked")}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-black/[0.04]"
            >
              <ArrowDown className="h-4 w-4 text-[#5F5E59]" strokeWidth={2} />
              <span className="font-medium">Import CSV</span>
            </button>
          </div>

          {/* Suggested Templates */}
          <div className="flex flex-col gap-1 mt-2">
            <h3 className="text-[11.5px] font-semibold text-[#8A8985] uppercase tracking-wider px-2.5">
              Suggested
            </h3>
            
            {/* Tasks Tracker */}
            <button
              onClick={() => toast("Selected template: Tasks Tracker")}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-black/[0.04] text-[13.5px]"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E2F5EC] text-[#0F7B48]">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="font-medium text-[#2C2C2B]">Tasks Tracker</span>
            </button>

            {/* Projects */}
            <button
              onClick={() => toast("Selected template: Projects")}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-black/[0.04] text-[13.5px]"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E5F1FD] text-[#2383E2]">
                <Target className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="font-medium text-[#2C2C2B]">Projects</span>
            </button>

            {/* Document Hub */}
            <button
              onClick={() => toast("Selected template: Document Hub")}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-black/[0.04] text-[13.5px]"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FCE8E6] text-[#E5484D]">
                <FileText className="h-3 w-3" strokeWidth={2.5} />
              </span>
              <span className="font-medium text-[#2C2C2B]">Document Hub</span>
            </button>

            {/* More templates */}
            <button
              onClick={() => toast("Opened template library")}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-black/[0.04] text-[13.5px]"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-[#5F5E59]">
                <MoreHorizontal className="h-3 w-3" />
              </span>
              <span className="font-medium text-[#2C2C2B]">More templates</span>
            </button>
          </div>

          <div className="border-b border-black/[0.08] my-1" />

          {/* Link to existing */}
          <button
            onClick={() => toast("Linking to existing data source")}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-black/[0.04] text-[13.5px]"
          >
            <ArrowUpRight className="h-4 w-4 text-[#5F5E59]" strokeWidth={2} />
            <span className="font-medium text-[#2C2C2B]">Link to existing data source</span>
          </button>
        </aside>
      )}
    </div>
  );
}
