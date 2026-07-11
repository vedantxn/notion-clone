"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Clock,
  Star,
  Users,
  Lock,
  Sparkles,
  FileText,
  UserCircle2,
  Navigation,
  ChevronRight,
  FilePlus2,
  LayoutTemplate,
  Import,
  FileAudio,
} from "lucide-react";
import { Dropdown, MenuItem, MenuLabel, MenuSeparator } from "./menu";
import { NotionFilterIcon, NotionSearchIcon, NotionSettingsIcon } from "./icons";

type TabKey = "recents" | "favorites" | "shared" | "private" | "notes";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "recents", label: "Recents", icon: <Clock className="h-4 w-4" strokeWidth={1.8} /> },
  { key: "favorites", label: "Favorites", icon: <Star className="h-4 w-4" strokeWidth={1.8} /> },
  { key: "shared", label: "Shared", icon: <Users className="h-4 w-4" strokeWidth={1.8} /> },
  { key: "private", label: "Private", icon: <Lock className="h-4 w-4" strokeWidth={1.8} /> },
  { key: "notes", label: "AI Meeting Notes", icon: <FileAudio className="h-4 w-4" strokeWidth={1.8} /> },
];

const EMPTY_COPY: Record<TabKey, { title: string; sub: string }> = {
  recents: { title: "Your recent pages will appear here", sub: "Pages you open will show up here for quick access" },
  favorites: { title: "Your favorite pages will appear here", sub: "Add pages to your favorites for quick access from anywhere in your workspace" },
  shared: { title: "Your shared pages will appear here", sub: "Pages shared with you and others will show up here" },
  private: { title: "Your private pages will appear here", sub: "Pages only you can see will show up here" },
  notes: { title: "", sub: "" },
};

type PageRow = {
  id: string;
  icon: React.ReactNode;
  title: string;
  createdBy: string;
  source: string;
  lastEdited: string;
  lastVisited: string;
  expandable?: boolean;
};

const ROWS: PageRow[] = [
  { id: "new-page", icon: <FileText className="h-[18px] w-[18px] text-[#91918E]" strokeWidth={1.7} />, title: "New page", createdBy: "Alex Morgan", source: "Private", lastEdited: "1h ago", lastVisited: "2m ago" },
  { id: "welcome", icon: <span className="text-[15px] leading-none">👋</span>, title: "Welcome to Notion", createdBy: "Alex Morgan", source: "Private", lastEdited: "1h ago", lastVisited: "2m ago" },
  { id: "todo", icon: <span className="text-[15px] leading-none">✅</span>, title: "To Do List", createdBy: "Alex Morgan", source: "Private", lastEdited: "1h ago", lastVisited: "2m ago", expandable: true },
];

const TAB_ROWS: Record<TabKey, PageRow[]> = {
  recents: ROWS,
  private: ROWS,
  favorites: [],
  shared: [],
  notes: [],
};

const COL = { by: "w-[200px]", src: "w-[200px]", edited: "w-[200px]", visited: "w-[200px]" };

export function MainPanel({ initialTab = "favorites" }: { initialTab?: TabKey }) {
  const [active, setActive] = useState<TabKey>(initialTab);
  const [search, setSearch] = useState<string | null>(null);
  const copy = EMPTY_COPY[active];
  const isNotes = active === "notes";

  const allRows = TAB_ROWS[active];
  const rows =
    search && search.length > 0
      ? allRows.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
      : allRows;

  return (
    <main className="flex h-dvh flex-1 flex-col overflow-y-auto bg-white text-[#2C2C2B]">
      <div className="w-full px-24 pt-[52px]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h1 className="text-[32px] font-bold leading-[38.4px] text-[#2C2C2B]">Library</h1>
          {isNotes ? (
            <button
              onClick={() => toast.success("Created a new AI meeting note")}
              className="flex h-8 items-center rounded-md bg-[#2783DE] px-3 text-[14px] font-medium text-[#F3F9FD] transition-colors hover:bg-[#1a73d0]"
            >
              New AI meeting note
            </button>
          ) : (
            <Dropdown
              align="right"
              width={220}
              trigger={(open, toggle) => (
                <button
                  onClick={toggle}
                  className={
                    "flex h-8 items-center rounded-md bg-[#2783DE] px-3 text-[14px] font-medium text-[#F3F9FD] transition-colors hover:bg-[#1a73d0] " +
                    (open ? "bg-[#1a73d0]" : "")
                  }
                >
                  New page
                </button>
              )}
            >
              {(close) => (
                <>
                  <MenuItem icon={<FilePlus2 className="h-4 w-4" strokeWidth={1.8} />} onClick={() => { toast.success("Created a new empty page"); close(); }}>Empty page</MenuItem>
                  <MenuItem icon={<LayoutTemplate className="h-4 w-4" strokeWidth={1.8} />} onClick={() => { toast("Browse templates"); close(); }}>Templates</MenuItem>
                  <MenuItem icon={<Import className="h-4 w-4" strokeWidth={1.8} />} onClick={() => { toast("Import"); close(); }}>Import</MenuItem>
                </>
              )}
            </Dropdown>
          )}
        </div>

        {/* Tab bar + toolbar */}
        <div className="mt-3 flex items-center gap-1">
          {TABS.map((t) => {
            const isActive = t.key === active;
            return (
              <button
                key={t.key}
                onClick={() => { setActive(t.key); setSearch(null); }}
                className={
                  "flex h-8 items-center gap-1.5 rounded-[20px] px-3 text-[14px] transition-colors " +
                  (isActive ? "bg-[rgba(42,28,0,0.07)] font-medium text-[#2C2C2B]" : "font-normal text-[#5F5E59] hover:bg-black/[0.03]")
                }
              >
                <span className={isActive ? "text-[#2C2C2B]" : "text-[#8A8985]"}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}

          {/* Toolbar: exactly 3 controls — filter, search, settings */}
          <div className="ml-auto flex items-center gap-0.5">
            <Dropdown
              align="right"
              width={210}
              trigger={(open, toggle) => (
                <ToolbarBtn active={open} onClick={toggle} label="Filter">
                  <NotionFilterIcon className="h-4 w-4" />
                </ToolbarBtn>
              )}
            >
              {(close) => (
                <>
                  <MenuLabel>Filter by</MenuLabel>
                  <MenuItem onClick={() => { toast("Filter: Created by me"); close(); }}>Created by me</MenuItem>
                  <MenuItem onClick={() => { toast("Filter: Shared with me"); close(); }}>Shared with me</MenuItem>
                  <MenuSeparator />
                  <MenuItem onClick={() => { toast("Filter cleared"); close(); }}>Clear filter</MenuItem>
                </>
              )}
            </Dropdown>

            {search !== null ? (
              <div className="flex h-7 items-center gap-1.5 px-1">
                <NotionSearchIcon className="h-4 w-4 text-[#5F5E59]" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Escape") setSearch(null); }}
                  onBlur={() => { if (!search) setSearch(null); }}
                  placeholder="Type to search…"
                  className="w-[180px] bg-transparent text-[14px] text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]"
                />
              </div>
            ) : (
              <ToolbarBtn onClick={() => setSearch("")} label="Search">
                <NotionSearchIcon className="h-4 w-4" />
              </ToolbarBtn>
            )}

            <Dropdown
              align="right"
              width={220}
              trigger={(open, toggle) => (
                <ToolbarBtn active={open} onClick={toggle} label="Settings">
                  <NotionSettingsIcon className="h-4 w-4" />
                </ToolbarBtn>
              )}
            >
              {(close) => (
                <>
                  <MenuLabel>Sort</MenuLabel>
                  <MenuItem onClick={() => { toast("Sorted by Last edited time"); close(); }}>Last edited time</MenuItem>
                  <MenuItem onClick={() => { toast("Sorted by Created time"); close(); }}>Created time</MenuItem>
                  <MenuItem onClick={() => { toast("Sorted by Title"); close(); }}>Title</MenuItem>
                  <MenuSeparator />
                  <MenuLabel>Layout</MenuLabel>
                  <MenuItem onClick={() => { toast("Layout: List"); close(); }}>List</MenuItem>
                  <MenuItem onClick={() => { toast("Layout: Gallery"); close(); }}>Gallery</MenuItem>
                </>
              )}
            </Dropdown>
          </div>
        </div>

        {/* AI Meeting Notes: no table columns, distinct empty state */}
        {isNotes ? (
          <div className="flex flex-col items-center pt-[150px] text-center">
            <FileAudio className="h-8 w-8 text-[#B9B8B4]" strokeWidth={1.5} />
            <div className="mt-4 max-w-[460px] text-[14px] font-normal leading-5 text-[#7D7A75]">
              Find all your AI Meeting Notes, including ones linked to meetings you attended, organized here for easy follow-up.
            </div>
            <button
              onClick={() => toast.success("Created a new AI meeting note")}
              className="mt-4 flex h-8 items-center rounded-md bg-[#2783DE] px-3 text-[14px] font-medium text-[#F3F9FD] transition-colors hover:bg-[#1a73d0]"
            >
              New AI meeting note
            </button>
          </div>
        ) : rows.length > 0 ? (
          <div className="mt-2 overflow-x-auto">
            <div className="min-w-[1180px]">
              <TableHeader />
              <div className="pb-16">
                {rows.map((r) => (
                  <Row key={r.id} row={r} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-2 overflow-x-auto">
              <div className="min-w-[1180px]">
                <TableHeader />
              </div>
            </div>
            <div className="flex flex-col items-center pt-[140px] text-center">
              <Star className="h-7 w-7 text-[#C6C4C0]" strokeWidth={1.6} />
              <div className="mt-4 text-[14px] font-medium text-[#7D7A75]">{copy.title}</div>
              <div className="mt-1 max-w-[340px] text-[14px] font-normal leading-5 text-[#7D7A75]">{copy.sub}</div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function TableHeader() {
  return (
    <div className="flex items-center border-b border-black/[0.08] text-[14px] text-[#7D7A75]">
      <HeaderCell className="flex-1" icon={<FileText className="h-4 w-4" strokeWidth={1.8} />} onClick={() => toast("Sort by Page name")}>Page name</HeaderCell>
      <HeaderCell className={COL.by} icon={<UserCircle2 className="h-4 w-4" strokeWidth={1.8} />} onClick={() => toast("Sort by Created by")}>Created by</HeaderCell>
      <HeaderCell className={COL.src} icon={<Navigation className="h-4 w-4 -rotate-45" strokeWidth={1.8} />} onClick={() => toast("Sort by Source")}>Source</HeaderCell>
      <HeaderCell className={COL.edited} icon={<Clock className="h-4 w-4" strokeWidth={1.8} />} onClick={() => toast("Sort by Last edited time")}>Last edited time</HeaderCell>
      <HeaderCell className={COL.visited} icon={<Clock className="h-4 w-4" strokeWidth={1.8} />} onClick={() => toast("Sort by Last visited time")}>Last visited time</HeaderCell>
    </div>
  );
}

function Row({ row }: { row: PageRow }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => toast(`Opened ${row.title}`)}
      className="group flex h-[37px] cursor-pointer items-center border-b border-black/[0.04] text-[14px] transition-colors hover:bg-black/[0.024]"
    >
      <div className="flex flex-1 items-center gap-1.5 pr-2">
        <span className="flex h-4 w-4 items-center justify-center">
          {row.expandable ? (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
              className="flex h-4 w-4 items-center justify-center rounded text-[#91918E] hover:bg-black/[0.06]"
            >
              <ChevronRight className={"h-3.5 w-3.5 transition-transform " + (expanded ? "rotate-90" : "")} strokeWidth={2} />
            </button>
          ) : null}
        </span>
        <span className="flex h-[18px] w-[18px] items-center justify-center">{row.icon}</span>
        <span className="truncate font-medium text-[#5F5E59]">{row.title}</span>
      </div>
      <div className={"flex items-center gap-1.5 " + COL.by}>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E3E2E0] text-[10px] font-medium text-[#5F5E59]">A</span>
        <span className="truncate font-normal text-[#2C2C2B]">{row.createdBy}</span>
      </div>
      <div className={"flex items-center gap-1.5 " + COL.src}>
        <Lock className="h-3.5 w-3.5 text-[#91918E]" strokeWidth={1.8} />
        <span className="font-medium text-[#2C2C2B]">{row.source}</span>
      </div>
      <div className={"flex items-center font-normal text-[#2C2C2B] " + COL.edited}>{row.lastEdited}</div>
      <div className={"flex items-center font-normal text-[#2C2C2B] " + COL.visited}>{row.lastVisited}</div>
    </div>
  );
}

function ToolbarBtn({ children, onClick, active, label }: { children: React.ReactNode; onClick?: () => void; active?: boolean; label?: string; }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={"flex h-7 w-7 items-center justify-center rounded-md text-[#5F5E59] transition-colors hover:bg-black/[0.05] " + (active ? "bg-black/[0.05]" : "")}
    >
      {children}
    </button>
  );
}

function HeaderCell({ icon, children, className, onClick }: { icon: React.ReactNode; children: React.ReactNode; className?: string; onClick?: () => void; }) {
  return (
    <button onClick={onClick} className={"flex h-9 items-center gap-1.5 rounded-md px-1 text-left transition-colors hover:bg-black/[0.03] " + (className ?? "")}>
      {icon}
      {children}
    </button>
  );
}
