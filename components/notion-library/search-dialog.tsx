"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Search,
  PanelRight,
  ListFilter,
  User,
  FileText,
  Plus,
  Link2,
  ArrowUpRight,
  Mic,
  Settings2,
  ChevronDown,
  CornerDownLeft,
} from "lucide-react";
import { useClickOutside } from "./menu";

type OpenDoc = (doc: { title: string; kind: "meeting" | "page"; heading?: string }) => void;

type SubItem = { icon: React.ReactNode; label: string };
type Result = {
  id: string;
  icon: React.ReactNode;
  title: string;
  section: string;
  kind: "meeting" | "page";
  heading?: string;
  preview?: SubItem[];
};

const micChip = (
  <span className="flex h-[18px] w-[18px] items-center justify-center rounded bg-[#F1F0ED] text-[#5F5E59]">
    <Mic className="h-3 w-3" strokeWidth={1.9} />
  </span>
);

const docIcon = <FileText className="h-[17px] w-[17px] text-[#91918E]" strokeWidth={1.7} />;

const RESULTS: Result[] = [
  {
    id: "today",
    icon: docIcon,
    title: "@Today 4:07 AM",
    section: "Today",
    kind: "meeting",
    heading: "Meeting @Today",
    preview: [{ icon: micChip, label: "Meeting @Today" }],
  },
  { id: "todo", icon: <span className="text-[15px] leading-none">✅</span>, title: "To Do List", section: "Today", kind: "page" },
  { id: "welcome", icon: <span className="text-[15px] leading-none">👋</span>, title: "Welcome to Notion", section: "Today", kind: "page" },
];

/** Notion search modal (⌘K / sidebar search): filter row + results + live preview pane. */
export function SearchDialog({ onClose, onOpenDoc }: { onClose: () => void; onOpenDoc: OpenDoc }) {
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string>(RESULTS[0].id);
  const [showPreview, setShowPreview] = useState(true);
  const ref = useClickOutside(onClose);

  const results = q ? RESULTS.filter((r) => r.title.toLowerCase().includes(q.toLowerCase())) : RESULTS;
  const selected = results.find((r) => r.id === selectedId) ?? results[0];

  const open = (r?: Result) => {
    if (!r) return;
    onOpenDoc({ title: r.title, kind: r.kind, heading: r.heading });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center bg-black/30 pt-[72px]">
      <div
        ref={ref}
        className="flex h-[715px] max-h-[82vh] w-[980px] max-w-[94vw] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_18px_56px_rgba(0,0,0,0.28)]"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-3">
          <Search className="h-5 w-5 text-[#9B9A97]" strokeWidth={1.9} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter") open(selected);
            }}
            placeholder="Search or ask a question in Alex Morgan&rsquo;s Space…"
            className="flex-1 bg-transparent text-[16px] text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]"
          />
          <button
            onClick={() => setShowPreview((v) => !v)}
            aria-label="Toggle preview"
            className={
              "flex h-7 w-7 items-center justify-center rounded-md " +
              (showPreview ? "text-[#2383E2]" : "text-[#9B9A97] hover:bg-black/[0.05]")
            }
          >
            <PanelRight className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
          <button
            onClick={() => toast("Search filters")}
            aria-label="Filters"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2383E2] text-white hover:bg-[#1a73d0]"
          >
            <ListFilter className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 px-4 pb-2.5">
          <Chip onClick={() => toast("Title only")}>
            <span className="text-[13px] font-semibold leading-none">Aa</span>
            Title only
          </Chip>
          <Chip onClick={() => toast("Created by")}>
            <User className="h-3.5 w-3.5" strokeWidth={1.8} />
            Created by
            <ChevronDown className="h-3 w-3 text-[#9B9A97]" strokeWidth={2} />
          </Chip>
          <Chip onClick={() => toast("In")}>
            <FileText className="h-3.5 w-3.5" strokeWidth={1.8} />
            In
            <ChevronDown className="h-3 w-3 text-[#9B9A97]" strokeWidth={2} />
          </Chip>
          <Chip onClick={() => toast("Add filter")}>
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Filter
          </Chip>
        </div>

        {/* Body: results + preview */}
        <div className="flex min-h-0 flex-1">
          {/* Results list */}
          <div className="min-w-0 flex-1 overflow-y-auto px-3 pt-2">
            {results.length > 0 ? (
              <>
                <div className="px-2 pb-1 text-[12px] font-medium text-[#91918E]">
                  {q ? "Best matches" : "Today"}
                </div>
                {results.map((r) => (
                  <button
                    key={r.id}
                    onMouseEnter={() => setSelectedId(r.id)}
                    onClick={() => open(r)}
                    className={
                      "flex h-[38px] w-full items-center gap-2.5 rounded-lg px-2.5 text-left transition-colors " +
                      (selected?.id === r.id ? "bg-black/[0.05]" : "hover:bg-black/[0.03]")
                    }
                  >
                    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">{r.icon}</span>
                    <span className="flex-1 truncate text-[14px] text-[#2C2C2B]">{r.title}</span>
                  </button>
                ))}
              </>
            ) : (
              <div className="px-2 py-8 text-center text-[14px] text-[#9B9A97]">
                No results for &ldquo;{q}&rdquo;
              </div>
            )}
          </div>

          {/* Preview pane */}
          {showPreview && selected && (
            <div className="w-[360px] shrink-0 p-3">
              <div className="flex h-full flex-col rounded-xl bg-[#FBFBFA] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]">
                {/* preview toolbar */}
                <div className="flex items-center justify-end gap-1 px-3 pt-3">
                  <PvIcon onClick={() => toast("Copy link")}><Link2 className="h-4 w-4" strokeWidth={1.8} /></PvIcon>
                  <PvIcon onClick={() => open(selected)}><ArrowUpRight className="h-4 w-4" strokeWidth={1.8} /></PvIcon>
                </div>
                {/* preview body */}
                <div className="flex-1 px-6 pt-8">
                  <h3 className="text-[22px] font-bold leading-tight text-[#2C2C2B]">{selected.title}</h3>
                  {selected.preview && (
                    <div className="mt-4 space-y-1">
                      {selected.preview.map((s, i) => (
                        <div key={i} className="flex items-center gap-2.5 rounded-md border border-black/[0.06] px-2.5 py-2">
                          {s.icon}
                          <span className="text-[14px] text-[#2C2C2B]">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/[0.06] px-4 py-2.5 text-[13px] text-[#9B9A97]">
          <span className="flex items-center gap-1.5">
            <span className="flex items-center gap-0.5">
              <Key>⌘</Key>
              <Key><CornerDownLeft className="h-3 w-3" strokeWidth={2} /></Key>
            </span>
            Open in new tab
          </span>
          <button
            onClick={() => toast("Search settings")}
            aria-label="Search settings"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#9B9A97] hover:bg-black/[0.05]"
          >
            <Settings2 className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-7 items-center gap-1.5 rounded-md border border-black/[0.09] px-2.5 text-[13px] font-medium text-[#5F5E59] transition-colors hover:bg-black/[0.03]"
    >
      {children}
    </button>
  );
}

function PvIcon({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md text-[#5F5E59] transition-colors hover:bg-black/[0.05]"
    >
      {children}
    </button>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded bg-black/[0.05] px-1 text-[11px] text-[#787774]">
      {children}
    </span>
  );
}
