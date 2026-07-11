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
  ChevronLeft,
  X,
  Plus,
  Eye,
  FilePlus2,
  LayoutTemplate,
  Import,
  FileAudio,
} from "lucide-react";
import { Dropdown, MenuItem, MenuLabel, MenuSeparator } from "./menu";
import { NotionFilterIcon, NotionSearchIcon, NotionSettingsIcon } from "./icons";
import { SortPanel, type SortRule } from "./sort-panel";
import { GroupPanel } from "./group-panel";

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
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortPanelOpen, setSortPanelOpen] = useState(false);
  const [sortRules, setSortRules] = useState<SortRule[]>([
    { id: "1", field: "Last edited time", direction: "desc" },
  ]);
  const [groupPanelOpen, setGroupPanelOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("none");
  const copy = EMPTY_COPY[active];
  const isNotes = active === "notes";

  const allRows = TAB_ROWS[active];
  const filteredRows =
    search && search.length > 0
      ? allRows.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
      : allRows;
  const rows = [...filteredRows].sort((a, b) => {
    const result = a.title.localeCompare(b.title);
    return sortDirection === "asc" ? result : -result;
  });

  const toggleSort = () => {
    setSortDirection((direction) => {
      const next = direction === "asc" ? "desc" : "asc";
      toast(next === "asc" ? "Sorted A to Z" : "Sorted Z to A");
      return next;
    });
  };

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
              width={290}
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

          {/* Toolbar: filter, active sort, search, settings */}
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

            <ToolbarBtn onClick={() => setSortPanelOpen(true)} label={sortDirection === "asc" ? "Sort Z to A" : "Sort A to Z"}>
              <SortUpDownIcon className={"h-[18px] w-[18px] transition-transform " + (sortDirection === "desc" ? "rotate-180" : "")} />
            </ToolbarBtn>

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
                <CollectionSettingsMenu
                  sortLabel={sortDirection === "asc" ? "Title A to Z" : "Title Z to A"}
                  onSort={() => {
                    toggleSort();
                    close();
                  }}
                  onGroup={() => {
                    setGroupPanelOpen(true);
                    close();
                  }}
                  onClose={close}
                />
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

      {sortPanelOpen && (
        <SortPanel
          sortRules={sortRules}
          onClose={() => setSortPanelOpen(false)}
          onAddSort={(rule) => setSortRules([...sortRules, rule])}
          onRemoveSort={(id) => setSortRules(sortRules.filter((r) => r.id !== id))}
          onUpdateSort={(id, direction) =>
            setSortRules(
              sortRules.map((r) => (r.id === id ? { ...r, direction } : r))
            )
          }
        />
      )}

      {groupPanelOpen && (
        <GroupPanel
          selectedGroup={selectedGroup}
          onClose={() => setGroupPanelOpen(false)}
          onGroupChange={(groupId) => {
            setSelectedGroup(groupId);
            if (groupId === "none") {
              toast("Grouping removed");
            } else {
              toast(`Grouped by ${groupId.replace(/_/g, " ")}`);
            }
          }}
        />
      )}
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

function CollectionSettingsMenu({
  sortLabel,
  onSort,
  onGroup,
  onClose,
}: {
  sortLabel: string;
  onSort: () => void;
  onGroup: () => void;
  onClose: () => void;
}) {
  const [view, setView] = useState<"main" | "visibility" | "filter">("main");
  const [hidden, setHidden] = useState<Set<string>>(new Set(["Last visited time", "Created time", "Created by", "Last edited by", "Source"]));
  const [filterQuery, setFilterQuery] = useState("");

  const toggleVisibility = (label: string) => {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  if (view === "visibility") {
    const shown = ["Page name", "Last edited time"].filter((label) => !hidden.has(label));
    const hiddenItems = ["Last visited time", "Created time", "Created by", "Last edited by", "Source"].filter((label) => hidden.has(label));

    return (
      <div className="w-full py-1">
        <button
          onClick={() => setView("main")}
          className="mb-1 flex h-8 w-full items-center gap-1.5 rounded-md px-2 text-[14px] text-[#37352F] transition-colors hover:bg-black/[0.05]"
        >
          <ChevronLeft className="h-4 w-4 text-[#9B9A97]" strokeWidth={2} />
          Property visibility
        </button>
        <PropertySection
          title="Shown in table"
          action="Hide all"
          items={shown}
          hidden={hidden}
          onToggle={toggleVisibility}
        />
        <PropertySection
          title="Hidden in table"
          action="Show all"
          items={hiddenItems}
          hidden={hidden}
          onToggle={toggleVisibility}
        />
      </div>
    );
  }

  if (view === "filter") {
    const filterOptions = ["Page name", "Created by", "Created time", "Last edited by", "Last edited time", "Last visited time"];
    const visibleOptions = filterOptions.filter((label) =>
      label.toLowerCase().includes(filterQuery.toLowerCase())
    );

    return (
      <div className="flex w-full flex-col py-0">
        <SubmenuHeader title="Add filter" onBack={() => setView("main")} onClose={onClose} />
        <div className="px-2 pb-1.5 pt-2">
          <div className="flex h-7 items-center rounded-md bg-black/[0.035] px-2 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.10)] focus-within:bg-white focus-within:shadow-[inset_0_0_0_1px_rgba(35,131,226,0.55)]">
            <input
              autoFocus
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter by..."
              className="h-full w-full bg-transparent text-[14px] text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]"
            />
          </div>
        </div>
        <div className="max-h-[248px] overflow-y-auto py-1">
          {visibleOptions.map((label, index) => (
            <PropertyOptionRow
              key={label}
              label={label}
              active={index === 0}
              onClick={() => toast(`Filter by ${label}`)}
            />
          ))}
        </div>
        <MenuSeparator />
        <button
          onClick={() => toast("Add advanced filter")}
          className="flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#5F5E59] transition-colors hover:bg-black/[0.05]"
        >
          <Plus className="h-5 w-5" strokeWidth={1.8} />
          <span>Add advanced filter</span>
        </button>
      </div>
    );
  }

  return (
    <div className="py-0.5">
      <SettingsMenuRow
        icon={<Eye className="h-5 w-5" strokeWidth={1.7} />}
        label="Property visibility"
        value="2"
        onClick={() => setView("visibility")}
      />
      <SettingsMenuRow
        icon={<NotionFilterIcon className="h-5 w-5" />}
        label="Filter"
        onClick={() => setView("filter")}
      />
      <SettingsMenuRow
        icon={<ArrowUpDownIcon className="h-5 w-5" />}
        label="Sort"
        value={sortLabel}
        onClick={onSort}
      />
      <SettingsMenuRow
        icon={<SquareGridBelowLinesIcon className="h-5 w-5" />}
        label="Group"
        onClick={onGroup}
      />
      <MenuSeparator />
      <MenuLabel>Layout</MenuLabel>
      <MenuItem onClick={() => { toast("Layout: List"); onClose(); }}>List</MenuItem>
      <MenuItem onClick={() => { toast("Layout: Gallery"); onClose(); }}>Gallery</MenuItem>
    </div>
  );
}

function SubmenuHeader({ title, onBack, onClose }: { title: string; onBack: () => void; onClose: () => void }) {
  return (
    <div className="flex h-[42px] items-center border-b border-black/[0.06] px-3 pb-1.5 pt-3.5">
      <button
        onClick={onBack}
        aria-label="Back"
        className="-ml-0.5 mr-2 flex h-[22px] w-[22px] items-center justify-center rounded-md text-[#5F5E59] transition-colors hover:bg-black/[0.05]"
      >
        <ArrowStraightLeftSmallIcon className="h-4 w-4" />
      </button>
      <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[#2C2C2B]">{title}</span>
      <button
        onClick={onClose}
        aria-label="Close"
        className="flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.04] text-[#5F5E59] transition-colors hover:bg-black/[0.08]"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}

function PropertyOptionRow({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={
        "flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] transition-colors hover:bg-black/[0.05] " +
        (active ? "bg-black/[0.04]" : "")
      }
    >
      <span className="ml-1 flex h-5 w-5 items-center justify-center text-[#5F5E59]">{propertyIconFor(label)}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  );
}

function PropertySection({
  title,
  action,
  items,
  hidden,
  onToggle,
}: {
  title: string;
  action: string;
  items: string[];
  hidden: Set<string>;
  onToggle: (label: string) => void;
}) {
  return (
    <div className="pb-1">
      <div className="flex h-[23px] items-center justify-between px-2 text-[12px] text-[#9B9A97]">
        <span>{title}</span>
        <button
          onClick={() => toast(action)}
          className="rounded px-1.5 py-0.5 text-[12px] text-[#2383E2] transition-colors hover:bg-[#2383E2]/10"
        >
          {action}
        </button>
      </div>
      <div className="flex flex-col">
        {items.map((item) => (
          <PropertyVisibilityRow key={item} label={item} hidden={hidden.has(item)} onToggle={() => onToggle(item)} />
        ))}
      </div>
    </div>
  );
}

function PropertyVisibilityRow({ label, hidden, onToggle }: { label: string; hidden: boolean; onToggle: () => void }) {
  return (
    <div className="flex h-8 items-center rounded-md px-1.5 text-[14px] text-[#37352F] transition-colors hover:bg-black/[0.05]">
      <span className="mr-1.5 flex h-6 w-[18px] items-center justify-center text-[#B5B3AF]">
        <DragHandleIcon className="h-5 w-5" />
      </span>
      <span className="flex h-5 w-5 items-center justify-center text-[#5F5E59]">
        {propertyIconFor(label)}
      </span>
      <span className="ml-2 min-w-0 flex-1 truncate">{label}</span>
      <button
        onClick={onToggle}
        aria-label="Toggle property visibility"
        className="flex h-7 w-7 items-center justify-center rounded-md text-[#5F5E59] transition-colors hover:bg-black/[0.05]"
      >
        {hidden ? <EyeSlashFillSmallIcon className="h-4 w-4" /> : <EyeFillSmallIcon className="h-4 w-4" />}
      </button>
    </div>
  );
}

function propertyIconFor(label: string) {
  if (label === "Page name") return <FileText className="h-4 w-4" strokeWidth={1.8} />;
  if (label === "Source") return <Navigation className="h-4 w-4 -rotate-45" strokeWidth={1.8} />;
  if (label.includes("by")) return <UserCircle2 className="h-4 w-4" strokeWidth={1.8} />;
  return <Clock className="h-4 w-4" strokeWidth={1.8} />;
}

function SettingsMenuRow({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] transition-colors hover:bg-black/[0.05]"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[#5F5E59]">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {value && <span className="max-w-[150px] truncate text-[#9B9A97]">{value}</span>}
      <ChevronRight className="h-4 w-4 shrink-0 text-[#9B9A97]" strokeWidth={2} />
    </button>
  );
}

function SortUpDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M6 3.5v13" />
      <path d="M3.6 5.9 6 3.5l2.4 2.4" />
      <path d="M14 16.5v-13" />
      <path d="m11.6 14.1 2.4 2.4 2.4-2.4" />
    </svg>
  );
}

function ArrowUpDownIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={className} fill="currentColor">
      <path d="M14.076 3.45a.625.625 0 0 0-.884 0l-3.498 3.5a.625.625 0 1 0 .884.884l2.43-2.431v10.705a.625.625 0 0 0 1.25 0V5.402l2.431 2.43a.625.625 0 0 0 .884-.883zM2.427 12.167a.625.625 0 0 1 .884 0l2.43 2.431V3.893a.625.625 0 0 1 1.25 0v10.705l2.432-2.43a.625.625 0 0 1 .883.883L6.81 16.55a.625.625 0 0 1-.884 0l-3.498-3.498a.625.625 0 0 1 0-.884" />
    </svg>
  );
}

function SquareGridBelowLinesIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={className} fill="currentColor">
      <path d="M3.925 2.95a.55.55 0 0 0 0 1.1h12.15a.55.55 0 1 0 0-1.1zm0 7.767a.55.55 0 1 0 0 1.1h12.15a.55.55 0 0 0 0-1.1zm-.55-4.234a1 1 0 0 1 1-1h1.8a1 1 0 0 1 1 1v1.8a1 1 0 0 1-1 1h-1.8a1 1 0 0 1-1-1zm1.1.1v1.6h1.6v-1.6zm4.625-1.1a1 1 0 0 0-1 1v1.8a1 1 0 0 0 1 1h1.8a1 1 0 0 0 1-1v-1.8a1 1 0 0 0-1-1zm.1 2.7v-1.6h1.6v1.6zm3.625-1.7a1 1 0 0 1 1-1h1.8a1 1 0 0 1 1 1v1.8a1 1 0 0 1-1 1h-1.8a1 1 0 0 1-1-1zm1.1.1v1.6h1.6v-1.6zm-9.55 6.667a1 1 0 0 0-1 1v1.8a1 1 0 0 0 1 1h1.8a1 1 0 0 0 1-1v-1.8a1 1 0 0 0-1-1zm.1 2.7v-1.6h1.6v1.6zm3.625-1.7a1 1 0 0 1 1-1h1.8a1 1 0 0 1 1 1v1.8a1 1 0 0 1-1 1H9.1a1 1 0 0 1-1-1zm1.1.1v1.6h1.6v-1.6zm4.625-1.1a1 1 0 0 0-1 1v1.8a1 1 0 0 0 1 1h1.8a1 1 0 0 0 1-1v-1.8a1 1 0 0 0-1-1zm.1 2.7v-1.6h1.6v1.6z" />
    </svg>
  );
}

function DragHandleIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={className} fill="currentColor">
      <path d="M6.25 4a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0m5 0a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0m1.25 7.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5M6.25 10a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0m6.25 7.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5M6.25 16a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0" />
    </svg>
  );
}

function ArrowStraightLeftSmallIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={className} fill="currentColor">
      <path d="M7.242 12.243a.626.626 0 0 1-.884 0l-3.8-3.801a.625.625 0 0 1 0-.884l3.8-3.8a.626.626 0 0 1 .884.884L4.51 7.375H13a.625.625 0 1 1 0 1.25H4.51l2.733 2.733a.626.626 0 0 1 0 .885" />
    </svg>
  );
}

function EyeFillSmallIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={className} fill="currentColor">
      <path d="M8 7.122a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75" />
      <path d="M8 3.26c3.125 0 5.857 1.673 7.152 4.141l.065.144c.11.293.11.617 0 .91l-.065.145c-1.295 2.468-4.027 4.14-7.152 4.14-3.027 0-5.685-1.57-7.026-3.912L.848 8.6a1.29 1.29 0 0 1 0-1.199l.126-.228C2.314 4.83 4.972 3.26 8 3.26m0 2.112a2.626 2.626 0 0 0-2.625 2.626l.014.269A2.626 2.626 0 0 0 7.73 10.61l.269.014a2.626 2.626 0 0 0 2.611-2.357l.014-.269A2.626 2.626 0 0 0 8 5.372" />
    </svg>
  );
}

function EyeSlashFillSmallIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={className} fill="currentColor">
      <path d="M3.142 2.332a.55.55 0 0 1 .695-.017l.081.076.227.265.008.01 8.772 10.235.057.082a.551.551 0 0 1-.819.701l-.08-.076-1.18-1.376A8.5 8.5 0 0 1 8 12.74c-3.027 0-5.685-1.569-7.026-3.911L.848 8.6a1.29 1.29 0 0 1 0-1.198l.126-.228c.705-1.233 1.776-2.251 3.073-2.94l-.965-1.125-.063-.092a.55.55 0 0 1 .123-.684m2.77 4.078a2.6 2.6 0 0 0-.537 1.588l.014.268a2.626 2.626 0 0 0 2.343 2.344l.268.014c.453 0 .878-.118 1.25-.32L8.023 8.872 8 8.874a.875.875 0 0 1-.861-1.032zM8 3.26c3.125 0 5.857 1.673 7.153 4.141l.064.144c.11.293.11.617 0 .91l-.065.144a7.5 7.5 0 0 1-2.255 2.578L10.58 8.474q.02-.102.031-.208l.014-.268A2.626 2.626 0 0 0 8 5.372l-.077.002-1.66-1.937A8.6 8.6 0 0 1 8 3.261" />
    </svg>
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
