"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Clock,
  Star,
  Users,
  Lock,
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
  ChevronDown,
  SlidersHorizontal,
  GripVertical,
  Trash2,
} from "lucide-react";
import { Dropdown, MenuItem, MenuLabel, MenuSeparator } from "./menu";
import { NotionFilterIcon, NotionSearchIcon, NotionSettingsIcon } from "./icons";
import { SortPanel, type SortRule } from "./sort-panel";
import { GroupPanel } from "./group-panel";
import { FilterPanel, type FilterRule, FILTER_FIELDS } from "./filter-panel";

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

type PageStatus = "Not started" | "In progress" | "Done";

type LayoutKind = "table" | "list" | "gallery" | "board" | "calendar" | "timeline" | "chart";

const BOARD_STATUSES: PageStatus[] = ["Not started", "In progress", "Done"];

// Light status tints reused by Board / Calendar / Timeline.
const STATUS_STYLE: Record<PageStatus, { chip: string; dot: string; bar: string }> = {
  "Not started": { chip: "bg-[rgba(28,19,1,0.11)] text-[#494846]", dot: "bg-[#8A8985]", bar: "bg-[#C7C5C0]" },
  "In progress": { chip: "bg-[rgba(0,118,217,0.20)] text-[#264A72]", dot: "bg-[#3B82D0]", bar: "bg-[#5A9BD8]" },
  Done: { chip: "bg-[rgba(0,96,38,0.157)] text-[#2A533C]", dot: "bg-[#3C8A5F]", bar: "bg-[#5FA97C]" },
};

type PageRow = {
  id: string;
  icon: React.ReactNode;
  title: string;
  createdBy: string;
  source: string;
  lastEdited: string;
  lastVisited: string;
  status: PageStatus;
  day: number; // day-of-month used by Calendar / Timeline
  span?: number; // number of days the timeline bar spans (default 3)
  expandable?: boolean;
};

const ROWS: PageRow[] = [
  { id: "new-page-1", icon: <FileText className="h-[18px] w-[18px] text-[#91918E]" strokeWidth={1.7} />, title: "New page", createdBy: "Abhishek Sharma", source: "Private", lastEdited: "3h ago", lastVisited: "3h ago", status: "Not started", day: 4, span: 3 },
  { id: "new-page-2", icon: <FileText className="h-[18px] w-[18px] text-[#91918E]" strokeWidth={1.7} />, title: "New page", createdBy: "Abhishek Sharma", source: "Private", lastEdited: "3h ago", lastVisited: "3h ago", status: "In progress", day: 9, span: 4 },
  { id: "yesterday-page", icon: <FileText className="h-[18px] w-[18px] text-[#91918E]" strokeWidth={1.7} />, title: "@Yesterday 4:07 AM", createdBy: "Abhishek Sharma", source: "Private", lastEdited: "20h ago", lastVisited: "20h ago", status: "In progress", day: 12, span: 2 },
  { id: "new-page-3", icon: <FileText className="h-[18px] w-[18px] text-[#91918E]" strokeWidth={1.7} />, title: "New page", createdBy: "Abhishek Sharma", source: "Private", lastEdited: "23h ago", lastVisited: "23h ago", status: "Not started", day: 16, span: 3 },
  { id: "welcome", icon: <span className="text-[15px] leading-none">👋</span>, title: "Welcome to Notion", createdBy: "Alex Morgan", source: "Private", lastEdited: "1d ago", lastVisited: "1d ago", status: "Done", day: 21, span: 5 },
  { id: "todo", icon: <span className="text-[15px] leading-none">✅</span>, title: "To Do List", createdBy: "Alex Morgan", source: "Private", lastEdited: "1d ago", lastVisited: "1d ago", status: "Done", day: 25, span: 3, expandable: true },
];

// Convert a relative time label ("3h ago", "1d ago", "Just now") into minutes-ago
// so time-based columns can be sorted.
function ageRank(label: string): number {
  const m = label.match(/(\d+)\s*(m|h|d|w)/i);
  if (!m) return 0;
  const n = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  return unit === "m" ? n : unit === "h" ? n * 60 : unit === "d" ? n * 1440 : n * 10080;
}

const TAB_ROWS: Record<TabKey, PageRow[]> = {
  recents: ROWS,
  private: ROWS,
  favorites: [],
  shared: [],
  notes: [],
};

const COL = { by: "w-[200px]", src: "w-[200px]", edited: "w-[200px]", visited: "w-[200px]" };

export function MainPanel({ initialTab = "favorites", favorites }: { initialTab?: TabKey; favorites?: Set<string> }) {
  const [active, setActive] = useState<TabKey>(initialTab);
  const [layout, setLayout] = useState<LayoutKind>("table");
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());
  const toggleCol = (label: string) =>
    setHiddenCols((cur) => {
      const next = new Set(cur);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  // Click a table column header to sort by it (toggling direction).
  const sortByField = (field: string) => {
    setSortRules((prev) => {
      const cur = prev[0];
      const nextDir = cur && cur.field === field && cur.direction === "asc" ? "desc" : "asc";
      setSortDirection(nextDir);
      return [{ id: cur?.id ?? "1", field, direction: nextDir }];
    });
  };
  const [search, setSearch] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortPanelOpen, setSortPanelOpen] = useState(false);
  const [sortRules, setSortRules] = useState<SortRule[]>([
    { id: "1", field: "Last edited time", direction: "desc" },
  ]);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const [groupPanelOpen, setGroupPanelOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("none");
  const [openSortPopoverId, setOpenSortPopoverId] = useState<string | null>(null);
  const [openFilterPopoverId, setOpenFilterPopoverId] = useState<string | null>(null);
  const [groupDateBy, setGroupDateBy] = useState<string>("relative");
  const [groupSort, setGroupSort] = useState<string>("oldest_first");
  const [groupHideEmpty, setGroupHideEmpty] = useState<boolean>(false);
  const [hiddenGroups, setHiddenGroups] = useState<string[]>([]);
  const copy = EMPTY_COPY[active];
  const isNotes = active === "notes";

  // Favorites tab reflects the pages the user has starred (deduped by title).
  const allRows =
    active === "favorites"
      ? Array.from(new Map(ROWS.filter((r) => favorites?.has(r.title)).map((r) => [r.title, r])).values())
      : TAB_ROWS[active];
  
  // Apply search query and filter panel rules
  let filteredRows = allRows;
  if (search && search.length > 0) {
    filteredRows = filteredRows.filter((r) =>
      r.title.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (filterRules.length > 0) {
    filteredRows = filteredRows.filter((row) => {
      return filterRules.every((rule) => {
        if (rule.type === "simple") {
          let fieldValue = "";
          if (rule.field === "title") fieldValue = row.title;
          else if (rule.field === "source") fieldValue = row.source;
          else if (rule.field === "createdBy") fieldValue = row.createdBy;
          else if (rule.field === "lastEdited") fieldValue = row.lastEdited;
          else if (rule.field === "lastVisited") fieldValue = row.lastVisited;

          fieldValue = (fieldValue || "").toLowerCase();
          const ruleValue = (rule.value || "").toLowerCase();

          switch (rule.operator) {
            case "contains":
              return fieldValue.includes(ruleValue);
            case "does_not_contain":
              return !fieldValue.includes(ruleValue);
            case "is_empty":
              return fieldValue.trim() === "";
            case "is_not_empty":
              return fieldValue.trim() !== "";
            default:
              return true;
          }
        } else {
          // Advanced rule group logic (evaluate all nested rules)
          const matches = rule.rules.map((nestedRule) => {
            let fieldValue = "";
            if (nestedRule.field === "title") fieldValue = row.title;
            else if (nestedRule.field === "source") fieldValue = row.source;
            else if (nestedRule.field === "createdBy") fieldValue = row.createdBy;
            else if (nestedRule.field === "lastEdited") fieldValue = row.lastEdited;
            else if (nestedRule.field === "lastVisited") fieldValue = row.lastVisited;

            fieldValue = (fieldValue || "").toLowerCase();
            const ruleValue = (nestedRule.value || "").toLowerCase();

            switch (nestedRule.operator) {
              case "contains":
                return fieldValue.includes(ruleValue);
              case "does_not_contain":
                return !fieldValue.includes(ruleValue);
              case "is_empty":
                return fieldValue.trim() === "";
              case "is_not_empty":
                return fieldValue.trim() !== "";
              default:
                return true;
            }
          });

          if (rule.conjunction === "or") {
            return matches.some(Boolean);
          } else {
            return matches.every(Boolean);
          }
        }
      });
    });
  }

  const rows = [...filteredRows].sort((a, b) => {
    const rule = sortRules[0];
    const field = rule?.field ?? "Page name";
    const dir = (rule?.direction ?? (sortDirection === "asc" ? "asc" : "desc")) === "asc" ? 1 : -1;
    let cmp: number;
    if (field === "Created by") cmp = a.createdBy.localeCompare(b.createdBy);
    else if (field === "Source") cmp = a.source.localeCompare(b.source);
    else if (field === "Created time" || field === "Last edited time") cmp = ageRank(a.lastEdited) - ageRank(b.lastEdited);
    else if (field === "Last visited time") cmp = ageRank(a.lastVisited) - ageRank(b.lastVisited);
    else cmp = a.title.localeCompare(b.title);
    return cmp * dir;
  });

  // Grouping helpers
  const getRowGroup = (row: PageRow) => {
    if (selectedGroup === "page_name") {
      return (row.title[0] || "#").toUpperCase();
    }
    if (selectedGroup === "created_by" || selectedGroup === "last_edited_by") {
      return row.createdBy || "Unknown";
    }
    if (selectedGroup === "source") {
      return row.source || "Private";
    }
    if (selectedGroup === "last_edited_time" || selectedGroup === "last_visited_time" || selectedGroup === "created_time") {
      const timeStr = selectedGroup === "last_edited_time" ? row.lastEdited : row.lastVisited;
      if (timeStr.includes("h ago") || timeStr.includes("m ago") || timeStr.includes("just now")) {
        return "Today";
      }
      if (timeStr.includes("1d ago") || timeStr.toLowerCase().includes("yesterday")) {
        return "Yesterday";
      }
      return "Older";
    }
    return "Other";
  };

  const groupsMap: Record<string, PageRow[]> = {};
  rows.forEach((row) => {
    const groupName = getRowGroup(row);
    if (!groupsMap[groupName]) {
      groupsMap[groupName] = [];
    }
    groupsMap[groupName].push(row);
  });

  const isDateField = selectedGroup.includes("time");
  const activeGroups = selectedGroup === "page_name" 
    ? ["N", "W", "T"]
    : isDateField 
      ? ["Today", "Yesterday", "Older"]
      : selectedGroup === "created_by" || selectedGroup === "last_edited_by"
        ? ["Alex Morgan"]
        : [];

  if (!groupHideEmpty) {
    activeGroups.forEach((g) => {
      if (!groupsMap[g]) groupsMap[g] = [];
    });
  }

  const groupNames = Object.keys(groupsMap);
  if (isDateField) {
    const order = ["Today", "Yesterday", "Older"];
    groupNames.sort((a, b) => {
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      const diff = (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
      return groupSort === "oldest_first" ? -diff : diff;
    });
  } else {
    groupNames.sort((a, b) => {
      const res = a.localeCompare(b);
      return groupSort === "alphabetical" ? res : -res;
    });
  }

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
            <ToolbarBtn 
              active={filterPanelOpen || filterRules.length > 0} 
              onClick={() => setFilterPanelOpen(true)} 
              label="Filter"
            >
              <div className="relative">
                <NotionFilterIcon className="h-4 w-4" />
                {filterRules.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-[#E28026]" />
                )}
              </div>
            </ToolbarBtn>

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
              width={290}
              trigger={(open, toggle) => (
                <ToolbarBtn active={open} onClick={toggle} label="Settings">
                  <NotionSettingsIcon className="h-4 w-4" />
                </ToolbarBtn>
              )}
            >
              {(close) => (
                <CollectionSettingsMenu
                  sortLabel={(sortRules[0]?.field ?? "Page name") + ((sortRules[0]?.direction ?? "asc") === "asc" ? " ↑" : " ↓")}
                  groupLabel={groupLabelFor(selectedGroup)}
                  layout={layout}
                  hiddenCols={hiddenCols}
                  onToggleCol={toggleCol}
                  onLayout={(next) => {
                    setLayout(next);
                    close();
                  }}
                  onSort={() => {
                    setSortPanelOpen(true);
                    close();
                  }}
                  onGroup={() => {
                    setGroupPanelOpen(true);
                    close();
                  }}
                  onClose={close}
                  onAddAdvancedFilter={() => {
                    setFilterPanelOpen(true);
                    const newRule: FilterRule = {
                      type: "advanced",
                      id: Date.now().toString(),
                      conjunction: "and",
                      rules: [
                        {
                          id: Date.now().toString() + "-nested",
                          field: "title",
                          operator: "contains",
                          value: "",
                        }
                      ]
                    };
                    setFilterRules((prev) => [...prev, newRule]);
                    close();
                  }}
                  onAddFilter={(fieldName) => {
                    setFilterPanelOpen(true);
                    let fieldKey: "title" | "source" | "createdBy" | "lastEdited" | "lastVisited" = "title";
                    if (fieldName === "Page name") fieldKey = "title";
                    else if (fieldName === "Created by" || fieldName === "Last edited by") fieldKey = "createdBy";
                    else if (fieldName === "Source") fieldKey = "source";
                    else if (fieldName === "Last edited time") fieldKey = "lastEdited";
                    else if (fieldName === "Last visited time") fieldKey = "lastVisited";

                    const newRule: FilterRule = {
                      type: "simple",
                      id: Date.now().toString(),
                      field: fieldKey,
                      operator: "contains",
                      value: "",
                    };
                    setFilterRules((prev) => [...prev, newRule]);
                    close();
                  }}
                />
              )}
            </Dropdown>
          </div>
        </div>
        
        {/* Active Filters and Sort Row */}
        {!isNotes && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 px-1.5">
            {/* Active Sort Pill(s) */}
            {sortRules.map((rule) => {
              const dirSymbol = rule.direction === "desc" ? "↓" : "↑";
              const isPopoverOpen = openSortPopoverId === rule.id;
              return (
                <div key={rule.id} className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenSortPopoverId(isPopoverOpen ? null : rule.id);
                      setOpenFilterPopoverId(null);
                    }}
                    className="flex items-center gap-1.5 px-2.5 h-7 rounded-[4px] bg-[#2383E2]/8 hover:bg-[#2383E2]/15 text-[#2383E2] text-[13px] font-medium transition-colors"
                  >
                    <span>{dirSymbol} {rule.field}</span>
                    <ChevronDown className="h-3 w-3 text-[#2383E2]" strokeWidth={2.5} />
                  </button>

                  {isPopoverOpen && (
                    <div className="absolute left-0 top-8 z-50 mt-1 w-[310px] rounded-lg border border-black/[0.08] bg-white p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-[#37352F] select-none text-[14px]">
                      <div className="flex items-center gap-2 py-1">
                        {/* Drag Handle */}
                        <div className="flex h-5 w-4 items-center justify-center text-[#B9B8B4]">
                          <GripVertical className="h-3.5 w-3.5" />
                        </div>
                        
                        {/* Sort Field */}
                        <button className="flex h-7 items-center gap-1 rounded bg-black/[0.04] px-2 text-[13px] hover:bg-black/[0.08] whitespace-nowrap flex-shrink-0">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Last edited time</span>
                        </button>

                        {/* Direction */}
                        <button 
                          onClick={() => {
                            const newDir = rule.direction === "asc" ? "desc" : "asc";
                            setSortRules(prev => prev.map(r => r.id === rule.id ? { ...r, direction: newDir } : r));
                            setSortDirection(newDir);
                          }}
                          className="flex h-7 items-center gap-1 rounded bg-black/[0.04] px-2 text-[13px] hover:bg-black/[0.08] justify-between whitespace-nowrap flex-shrink-0"
                        >
                          <span>{rule.direction === "desc" ? "Descending" : "Ascending"}</span>
                          <ChevronDown className="h-3 w-3 text-[#9B9A97]" />
                        </button>

                        {/* Close button */}
                        <button 
                          onClick={() => {
                            setSortRules([]);
                            setOpenSortPopoverId(null);
                          }}
                          className="flex h-5 w-5 items-center justify-center rounded text-[#8A8985] hover:bg-black/[0.05]"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="my-1.5 h-[1px] bg-black/[0.06]" />

                      {/* Menu rows */}
                      <button 
                        onClick={() => toast("Advanced sorting is enabled")}
                        className="flex h-8 w-full items-center gap-2 rounded px-2 hover:bg-black/[0.04] text-left"
                      >
                        <Plus className="h-3.5 w-3.5 text-[#5F5E59]" />
                        <span className="text-[13px]">Add sort</span>
                      </button>

                      <button 
                        onClick={() => {
                          setSortRules([]);
                          setOpenSortPopoverId(null);
                          toast("Deleted sort");
                        }}
                        className="flex h-8 w-full items-center gap-2 rounded px-2 hover:bg-black/[0.04] text-[#D4433D] text-left"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="text-[13px]">Delete sort</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Active Filter Pills */}
            {filterRules.map((rule) => {
              const isSimple = rule.type === "simple";
              const simpleRule = isSimple ? rule : null;
              const isDirty = rule.type === "simple"
                ? rule.value.length > 0
                : rule.rules.some((r) => r.value.length > 0);
              const label = rule.type === "simple"
                ? (FILTER_FIELDS.find((f) => f.value === rule.field)?.label || "Filter")
                : `${rule.rules.length} ${rule.rules.length === 1 ? "rule" : "rules"}`;
              
              const isPopoverOpen = openFilterPopoverId === rule.id;

              // Helper for rule icon
              const getRuleIcon = () => {
                if (!isSimple || !simpleRule) return null;
                const field = simpleRule.field;
                if (field === "createdBy") return <UserCircle2 className="h-3.5 w-3.5 text-[#5F5E59]" />;
                if (field === "lastEdited" || field === "lastVisited") return <Clock className="h-3.5 w-3.5 text-[#5F5E59]" />;
                if (field === "title") return <FileText className="h-3.5 w-3.5 text-[#5F5E59]" />;
                if (field === "source") return <Navigation className="h-3.5 w-3.5 text-[#5F5E59] -rotate-45" />;
                return null;
              };

              return (
                <div key={rule.id} className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isSimple) {
                        setOpenFilterPopoverId(isPopoverOpen ? null : rule.id);
                        setOpenSortPopoverId(null);
                      } else {
                        setFilterPanelOpen(true);
                      }
                    }}
                    className={
                      "flex items-center gap-1.5 px-2 h-7 rounded-[4px] bg-black/[0.04] hover:bg-black/[0.08] text-[#37352F] text-[13px] font-normal transition-colors relative " +
                      (!isSimple ? "bg-[#E2F0FD] hover:bg-[#D5EAFD] text-[#2383E2] font-semibold" : "")
                    }
                  >
                    {isSimple && simpleRule ? (
                      <>
                        {getRuleIcon()}
                        {simpleRule.value ? (
                          <span className="font-normal">{label}: {simpleRule.value}</span>
                        ) : (
                          <span className="font-normal">{label}</span>
                        )}
                        <ChevronDown className="h-3 w-3 text-[#9B9A97]" strokeWidth={2} />
                        {isDirty && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E28026] ml-0.5" />
                        )}
                      </>
                    ) : (
                      <>
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        <span>{label}</span>
                        <ChevronDown className="h-3 w-3 text-[#2383E2]" strokeWidth={2.5} />
                        {isDirty && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E28026] ml-0.5" />
                        )}
                      </>
                    )}
                  </button>

                  {isSimple && simpleRule && isPopoverOpen && (
                    <div className="absolute left-0 top-8 z-50 mt-1 w-[280px] rounded-lg border border-black/[0.08] bg-white p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-[#37352F] select-none text-[14px]">
                      {/* Header: Field contains ... */}
                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-1.5 text-[13px] text-[#5F5E59]">
                          <span>{label}</span>
                          <button className="flex items-center gap-0.5 rounded hover:bg-black/[0.05] px-1 py-0.5">
                            <span>contains</span>
                            <ChevronDown className="h-3 w-3 text-[#B9B8B4]" />
                          </button>
                        </div>

                        {/* Options button */}
                        <button 
                          onClick={() => {
                            setFilterPanelOpen(true);
                            setOpenFilterPopoverId(null);
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded text-[#8A8985] hover:bg-black/[0.05]"
                        >
                          <SlidersHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Active tag badge */}
                      {simpleRule.value ? (
                        <div className="flex flex-wrap gap-1 py-1">
                          <span className="flex items-center gap-1.5 bg-black/[0.04] rounded-md pl-1.5 pr-1 py-0.5 text-[13px]">
                            {simpleRule.field === "createdBy" && (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black/[0.08] text-[#5F5E59] text-[9px] font-semibold">
                                {simpleRule.value[0]?.toUpperCase()}
                              </span>
                            )}
                            <span>{simpleRule.value}</span>
                            <button 
                              onClick={() => {
                                setFilterRules(prev => prev.map(r => r.id === rule.id ? { ...r, value: "" } : r));
                              }}
                              className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-black/[0.08]"
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        </div>
                      ) : null}

                      {/* Search and list */}
                      {simpleRule.field === "createdBy" ? (
                        <div className="space-y-1.5 pt-1.5">
                          <input
                            autoFocus
                            placeholder="Search for one or more people…"
                            className="h-7 w-full rounded border border-black/[0.08] px-2 text-[13px] outline-none focus:border-[#2383E2]"
                          />
                          <div className="text-[12px] font-semibold text-[#8A8985] uppercase px-1 pt-1">Me</div>
                          <button
                            onClick={() => {
                              const val = simpleRule.value === "Abhishek Sharma" ? "" : "Abhishek Sharma";
                              setFilterRules(prev => prev.map(r => r.id === rule.id ? { ...r, value: val } : r));
                            }}
                            className="flex h-8 w-full items-center justify-between rounded px-2 hover:bg-black/[0.04] text-left"
                          >
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/[0.08] text-[#5F5E59] text-[10px] font-semibold">
                                A
                              </span>
                              <span>Abhishek Sharma</span>
                            </div>
                            {simpleRule.value === "Abhishek Sharma" && (
                              <svg className="h-4 w-4 text-[#2C2C2B]" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M11.834 3.309a.625.625 0 0 1 1.072.642l-5.244 8.74a.625.625 0 0 1-1.01.085L3.155 8.699a.626.626 0 0 1 .95-.813l2.93 3.419z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="pt-1">
                          <input
                            autoFocus
                            value={simpleRule.value}
                            placeholder="Type a value…"
                            className="h-7 w-full rounded border border-black/[0.08] px-2 text-[13px] outline-none focus:border-[#2383E2]"
                            onChange={(e) => {
                              const val = e.target.value;
                              setFilterRules(prev => prev.map(r => r.id === rule.id ? { ...r, value: val } : r));
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add Filter pill */}
            <button
              onClick={() => {
                setFilterPanelOpen(true);
                const newRule: FilterRule = {
                  type: "simple",
                  id: Date.now().toString(),
                  field: "title",
                  operator: "contains",
                  value: "",
                };
                setFilterRules((prev) => [...prev, newRule]);
              }}
              className="flex items-center gap-1 px-2.5 h-7 rounded-[4px] text-[13px] text-[#7D7A75] hover:bg-black/[0.04] hover:text-[#37352F] transition-colors"
            >
              <Plus className="h-3.5 w-3.5 text-[#7D7A75]" strokeWidth={2} />
              <span>Filter</span>
            </button>
          </div>
        )}

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
          layout === "list" ? (
            <div className="mt-2 pb-16">
              {rows.map((r) => (
                <ListRow key={r.id} row={r} />
              ))}
            </div>
          ) : layout === "gallery" ? (
            <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 pb-16">
              {rows.map((r) => (
                <GalleryCard key={r.id} row={r} />
              ))}
            </div>
          ) : layout === "calendar" ? (
            <CalendarView rows={rows} />
          ) : layout === "timeline" ? (
            <TimelineView rows={rows} />
          ) : layout === "chart" ? (
            <ChartView rows={rows} />
          ) : layout === "board" ? (
            <BoardView rows={rows} />
          ) : (
          <div className="mt-2 overflow-x-auto">
            <div className="min-w-[1180px]">
              {selectedGroup === "none" && <TableHeader hiddenCols={hiddenCols} onSortField={sortByField} />}
              <div className="pb-16 space-y-4">
                {selectedGroup === "none" ? (
                  rows.map((r) => (
                    <Row key={r.id} row={r} hiddenCols={hiddenCols} />
                  ))
                ) : (
                  groupNames.map((groupName) => {
                    const groupRows = groupsMap[groupName] || [];
                    if (groupHideEmpty && groupRows.length === 0) return null;
                    
                    const isCollapsed = hiddenGroups.includes(groupName);
                    
                    return (
                      <div key={groupName} className="space-y-1">
                        {/* Group Header Row */}
                        <div 
                          onClick={() => {
                            setHiddenGroups(prev => 
                              isCollapsed 
                                ? prev.filter(g => g !== groupName)
                                : [...prev, groupName]
                            );
                          }}
                          className="flex items-center gap-1.5 py-1 text-[13px] font-semibold text-[#37352F] cursor-pointer hover:bg-black/[0.03] rounded px-1 select-none w-fit"
                        >
                          {isCollapsed ? (
                            <ChevronRight className="h-3.5 w-3.5 text-[#37352F]" strokeWidth={2.5} />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-[#37352F]" strokeWidth={2.5} />
                          )}
                          <span>{groupName}</span>
                          <span className="text-[12px] font-normal text-[#8A8985] ml-1">{groupRows.length}</span>
                        </div>

                        {/* Group Rows */}
                        {!isCollapsed && (
                          <div className="pl-4 border-l border-black/[0.04] space-y-1">
                            <TableHeader hiddenCols={hiddenCols} onSortField={sortByField} />
                            <div className="space-y-0.5">
                              {groupRows.map((r) => (
                                <Row key={r.id} row={r} hiddenCols={hiddenCols} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          )
        ) : (
          <>
            <div className="mt-2 overflow-x-auto">
              <div className="min-w-[1180px]">
                <TableHeader hiddenCols={hiddenCols} onSortField={sortByField} />
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

      {filterPanelOpen && (
        <FilterPanel
          filterRules={filterRules}
          onClose={() => setFilterPanelOpen(false)}
          onAddFilter={(rule) => setFilterRules((prev) => [...prev, rule])}
          onRemoveFilter={(id) => setFilterRules((prev) => prev.filter((r) => r.id !== id))}
          onUpdateFilter={(id, updates) =>
            setFilterRules((prev) =>
              prev.map((r) => (r.id === id ? ({ ...r, ...updates } as FilterRule) : r))
            )
          }
          onResetFilters={() => setFilterRules([])}
          onAddAdvancedFilter={() => {
            const newRule: FilterRule = {
              type: "advanced",
              id: Date.now().toString(),
              conjunction: "and",
              rules: [
                {
                  id: Date.now().toString() + "-nested",
                  field: "title",
                  operator: "contains",
                  value: "",
                }
              ]
            };
            setFilterRules((prev) => [...prev, newRule]);
          }}
        />
      )}

      {sortPanelOpen && (
        <SortPanel
          sortRules={sortRules}
          onClose={() => setSortPanelOpen(false)}
          onAddSort={(rule) => setSortRules([...sortRules, rule])}
          onRemoveSort={(id) => setSortRules(sortRules.filter((r) => r.id !== id))}
          onUpdateSort={(id, direction) => {
            setSortRules(sortRules.map((r) => (r.id === id ? { ...r, direction } : r)));
            setSortDirection(direction);
          }}
          onUpdateField={(id, field) =>
            setSortRules(sortRules.map((r) => (r.id === id ? { ...r, field } : r)))
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
              toast(`Grouped by ${groupLabelFor(groupId)}`);
            }
          }}
          dateBy={groupDateBy}
          onDateByChange={setGroupDateBy}
          sortOrder={groupSort}
          onSortOrderChange={setGroupSort}
          hideEmpty={groupHideEmpty}
          onHideEmptyChange={setGroupHideEmpty}
          hiddenGroups={hiddenGroups}
          onHiddenGroupsChange={setHiddenGroups}
        />
      )}
      {(openSortPopoverId || openFilterPopoverId) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setOpenSortPopoverId(null);
            setOpenFilterPopoverId(null);
          }}
        />
      )}
    </main>
  );
}

function TableHeader({ hiddenCols, onSortField }: { hiddenCols: Set<string>; onSortField: (field: string) => void }) {
  return (
    <div className="flex items-center border-b border-black/[0.08] text-[14px] text-[#7D7A75]">
      <HeaderCell className="flex-1" icon={<FileText className="h-4 w-4" strokeWidth={1.8} />} onClick={() => onSortField("Page name")}>Page name</HeaderCell>
      {!hiddenCols.has("Created by") && <HeaderCell className={COL.by} icon={<UserCircle2 className="h-4 w-4" strokeWidth={1.8} />} onClick={() => onSortField("Created by")}>Created by</HeaderCell>}
      {!hiddenCols.has("Source") && <HeaderCell className={COL.src} icon={<Navigation className="h-4 w-4 -rotate-45" strokeWidth={1.8} />} onClick={() => onSortField("Source")}>Source</HeaderCell>}
      {!hiddenCols.has("Last edited time") && <HeaderCell className={COL.edited} icon={<Clock className="h-4 w-4" strokeWidth={1.8} />} onClick={() => onSortField("Last edited time")}>Last edited time</HeaderCell>}
      {!hiddenCols.has("Last visited time") && <HeaderCell className={COL.visited} icon={<Clock className="h-4 w-4" strokeWidth={1.8} />} onClick={() => onSortField("Last visited time")}>Last visited time</HeaderCell>}
    </div>
  );
}

function Row({ row, hiddenCols }: { row: PageRow; hiddenCols: Set<string> }) {
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
      {!hiddenCols.has("Created by") && (
        <div className={"flex items-center gap-1.5 " + COL.by}>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E3E2E0] text-[10px] font-medium text-[#5F5E59]">A</span>
          <span className="truncate font-normal text-[#2C2C2B]">{row.createdBy}</span>
        </div>
      )}
      {!hiddenCols.has("Source") && (
        <div className={"flex items-center gap-1.5 " + COL.src}>
          <Lock className="h-3.5 w-3.5 text-[#91918E]" strokeWidth={1.8} />
          <span className="font-medium text-[#2C2C2B]">{row.source}</span>
        </div>
      )}
      {!hiddenCols.has("Last edited time") && <div className={"flex items-center font-normal text-[#2C2C2B] " + COL.edited}>{row.lastEdited}</div>}
      {!hiddenCols.has("Last visited time") && <div className={"flex items-center font-normal text-[#2C2C2B] " + COL.visited}>{row.lastVisited}</div>}
    </div>
  );
}

// List layout: compact full-width rows with the visible properties inlined on the right.
function ListRow({ row }: { row: PageRow }) {
  return (
    <div
      onClick={() => toast(`Opened ${row.title}`)}
      className="group flex h-[42px] cursor-pointer items-center gap-2 border-b border-black/[0.06] px-1 text-[14px] transition-colors hover:bg-black/[0.024]"
    >
      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">{row.icon}</span>
      <span className="min-w-0 flex-1 truncate font-medium text-[#2C2C2B]">{row.title}</span>
      <div className="flex shrink-0 items-center gap-4 text-[13px] text-[#7D7A75]">
        <span className="hidden items-center gap-1.5 sm:flex">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#E3E2E0] text-[9px] font-medium text-[#5F5E59]">A</span>
          <span className="truncate">{row.createdBy}</span>
        </span>
        <span className="hidden items-center gap-1 md:flex">
          <Lock className="h-3.5 w-3.5 text-[#91918E]" strokeWidth={1.8} />
          {row.source}
        </span>
        <span className="w-[64px] text-right">{row.lastEdited}</span>
      </div>
    </div>
  );
}

// Gallery layout: cards in a responsive grid with a cover area, title and properties.
function GalleryCard({ row }: { row: PageRow }) {
  return (
    <button
      onClick={() => toast(`Opened ${row.title}`)}
      className="group flex flex-col overflow-hidden rounded-lg border border-black/[0.09] bg-white text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.10)]"
    >
      <div className="flex h-[124px] items-center justify-center border-b border-black/[0.05] bg-[#F5F4F2]">
        <span className="flex h-8 w-8 items-center justify-center text-[26px] leading-none opacity-90 [&_svg]:h-7 [&_svg]:w-7">
          {row.icon}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center gap-1.5">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">{row.icon}</span>
          <span className="min-w-0 truncate text-[14px] font-medium text-[#2C2C2B]">{row.title}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[#7D7A75]">
          <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#E3E2E0] text-[9px] font-medium text-[#5F5E59]">A</span>
          <span className="truncate">{row.createdBy}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[#7D7A75]">
          <Lock className="h-3.5 w-3.5 text-[#91918E]" strokeWidth={1.8} />
          <span className="truncate">{row.source}</span>
          <span className="text-[#B9B8B4]">·</span>
          <span className="truncate">{row.lastEdited}</span>
        </div>
      </div>
    </button>
  );
}

// Board layout: Kanban columns grouped by Status.
function BoardView({ rows }: { rows: PageRow[] }) {
  return (
    <div className="mt-2 overflow-x-auto pb-16">
      <div className="flex items-start gap-4">
        {BOARD_STATUSES.map((status) => {
          const colRows = rows.filter((r) => r.status === status);
          const style = STATUS_STYLE[status];
          return (
            <div key={status} className="flex w-[260px] shrink-0 flex-col">
              {/* Column header */}
              <div className="group flex h-9 items-center gap-2 px-1">
                <span className={`flex h-[22px] items-center gap-1.5 rounded-md px-2 text-[13px] font-medium ${style.chip}`}>
                  <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                  {status}
                </span>
                <span className="text-[13px] text-[#9B9A97]">{colRows.length}</span>
                <button
                  onClick={() => toast(`New page in ${status}`)}
                  className="ml-auto flex h-6 w-6 items-center justify-center rounded text-[#9B9A97] opacity-0 transition-opacity hover:bg-black/[0.05] group-hover:opacity-100"
                  aria-label="Add page"
                >
                  <Plus className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 pt-1">
                {colRows.map((r) => (
                  <BoardCard key={r.id} row={r} />
                ))}
                <button
                  onClick={() => toast(`New page in ${status}`)}
                  className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[14px] text-[#9B9A97] transition-colors hover:bg-black/[0.03] hover:text-[#5F5E59]"
                >
                  <Plus className="h-4 w-4" strokeWidth={2} />
                  New
                </button>
              </div>
            </div>
          );
        })}

        {/* Add group */}
        <button
          onClick={() => toast("Add a group")}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-md px-2 text-[14px] text-[#9B9A97] transition-colors hover:bg-black/[0.03] hover:text-[#5F5E59]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add group
        </button>
      </div>
    </div>
  );
}

function BoardCard({ row }: { row: PageRow }) {
  return (
    <button
      onClick={() => toast(`Opened ${row.title}`)}
      className="group flex flex-col gap-2 rounded-lg border border-black/[0.08] bg-white p-2.5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.10)]"
    >
      <div className="flex items-center gap-1.5">
        <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center [&_svg]:h-[18px] [&_svg]:w-[18px]">{row.icon}</span>
        <span className="min-w-0 truncate text-[14px] font-medium text-[#2C2C2B]">{row.title}</span>
      </div>
      <div className="flex items-center gap-1.5 text-[12px] text-[#7D7A75]">
        <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#E3E2E0] text-[9px] font-medium text-[#5F5E59]">A</span>
        <span className="truncate">{row.createdBy}</span>
        <span className="text-[#B9B8B4]">·</span>
        <span className="truncate">{row.lastEdited}</span>
      </div>
    </button>
  );
}

// Calendar layout: month grid with page chips placed on their day.
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarView({ rows }: { rows: PageRow[] }) {
  const today = new Date();
  const [view, setView] = useState<{ y: number; m: number }>({ y: today.getFullYear(), m: today.getMonth() });

  const first = new Date(view.y, view.m, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const isCurrentMonth = view.y === today.getFullYear() && view.m === today.getMonth();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const rowsByDay = new Map<number, PageRow[]>();
  if (isCurrentMonth) {
    for (const r of rows) {
      const list = rowsByDay.get(r.day) ?? [];
      list.push(r);
      rowsByDay.set(r.day, list);
    }
  }

  const monthLabel = first.toLocaleString(undefined, { month: "long", year: "numeric" });
  const shift = (delta: number) => {
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };

  return (
    <div className="mt-2 pb-16">
      {/* Month header */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[15px] font-semibold text-[#2C2C2B]">{monthLabel}</span>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => shift(-1)} aria-label="Previous month" className="flex h-7 w-7 items-center justify-center rounded-md text-[#5F5E59] hover:bg-black/[0.05]">
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <button onClick={() => setView({ y: today.getFullYear(), m: today.getMonth() })} className="h-7 rounded-md px-2.5 text-[13px] font-medium text-[#37352F] hover:bg-black/[0.05]">
            Today
          </button>
          <button onClick={() => shift(1)} aria-label="Next month" className="flex h-7 w-7 items-center justify-center rounded-md text-[#5F5E59] hover:bg-black/[0.05]">
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 border-l border-t border-black/[0.08]">
        {WEEKDAYS.map((d) => (
          <div key={d} className="border-b border-r border-black/[0.08] bg-[#FBFAF9] px-2 py-1 text-right text-[12px] font-medium text-[#7D7A75]">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 border-l border-black/[0.08]">
        {cells.map((d, i) => {
          const isToday = isCurrentMonth && d === today.getDate();
          const dayRows = d ? rowsByDay.get(d) ?? [] : [];
          return (
            <div key={i} className="min-h-[112px] border-b border-r border-black/[0.08] p-1">
              {d && (
                <>
                  <div className="mb-1 flex justify-end">
                    <span className={"flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1 text-[12px] " + (isToday ? "bg-[#2383E2] font-semibold text-white" : "text-[#5F5E59]")}>
                      {d}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {dayRows.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => toast(`Opened ${r.title}`)}
                        className="flex items-center gap-1.5 rounded-md border border-black/[0.06] bg-white px-1.5 py-1 text-left text-[12px] shadow-[0_1px_1px_rgba(0,0,0,0.03)] hover:bg-black/[0.02]"
                      >
                        <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center [&_svg]:h-3.5 [&_svg]:w-3.5">{r.icon}</span>
                        <span className="min-w-0 truncate text-[#2C2C2B]">{r.title}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Timeline layout: item rows with status-colored bars positioned by day across a month axis.
function TimelineView({ rows }: { rows: PageRow[] }) {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const dayW = 34;
  const monthLabel = today.toLocaleString(undefined, { month: "long", year: "numeric" });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="mt-2 overflow-x-auto pb-16">
      <div className="mb-2 text-[15px] font-semibold text-[#2C2C2B]">{monthLabel}</div>
      <div className="w-max min-w-full overflow-hidden rounded-lg border border-black/[0.08]">
        {/* Date axis */}
        <div className="flex border-b border-black/[0.08] bg-[#FBFAF9]">
          <div className="w-[200px] shrink-0 border-r border-black/[0.08] px-3 py-1.5 text-[12px] font-medium text-[#7D7A75]">Name</div>
          <div className="flex">
            {days.map((d) => (
              <div
                key={d}
                style={{ width: dayW }}
                className={"shrink-0 border-r border-black/[0.06] py-1.5 text-center text-[11px] " + (d === today.getDate() ? "font-semibold text-[#2383E2]" : "text-[#9B9A97]")}
              >
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {rows.map((r) => {
          const span = r.span ?? 3;
          const style = STATUS_STYLE[r.status];
          return (
            <div key={r.id} className="flex border-b border-black/[0.06] last:border-b-0 hover:bg-black/[0.015]">
              <div className="flex w-[200px] shrink-0 items-center gap-1.5 border-r border-black/[0.08] px-3 py-2">
                <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center [&_svg]:h-[18px] [&_svg]:w-[18px]">{r.icon}</span>
                <span className="min-w-0 truncate text-[14px] text-[#2C2C2B]">{r.title}</span>
              </div>
              <div className="relative flex-1 py-2" style={{ minWidth: daysInMonth * dayW }}>
                <button
                  onClick={() => toast(`Opened ${r.title}`)}
                  style={{ left: (r.day - 1) * dayW + 3, width: span * dayW - 6 }}
                  className={"absolute top-1/2 h-6 -translate-y-1/2 truncate rounded-md px-2 text-left text-[12px] font-medium text-white " + style.bar}
                  title={r.title}
                >
                  {r.title}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Chart layout: vertical bar chart of item counts grouped by Status.
function ChartView({ rows }: { rows: PageRow[] }) {
  const data = BOARD_STATUSES.map((status) => ({
    status,
    count: rows.filter((r) => r.status === status).length,
  }));
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const ticks = Array.from({ length: maxCount + 1 }, (_, i) => maxCount - i); // top → 0
  const plotH = 240;

  return (
    <div className="mt-3 pb-16">
      <div className="w-full max-w-[760px] rounded-xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="mb-1 text-[15px] font-semibold text-[#2C2C2B]">Count by Status</div>
        <div className="mb-5 text-[13px] text-[#7D7A75]">{rows.length} total</div>

        <div className="flex">
          {/* Y-axis */}
          <div className="flex flex-col justify-between pr-2 text-right text-[12px] text-[#9B9A97]" style={{ height: plotH }}>
            {ticks.map((t) => (
              <span key={t} className="leading-none">{t}</span>
            ))}
          </div>

          {/* Plot area */}
          <div className="relative flex-1">
            {/* Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {ticks.map((t) => (
                <div key={t} className="h-px w-full bg-black/[0.06]" />
              ))}
            </div>
            {/* Bars */}
            <div className="relative flex h-full items-end justify-around gap-6" style={{ height: plotH }}>
              {data.map((d) => {
                const style = STATUS_STYLE[d.status];
                return (
                  <div key={d.status} className="flex h-full flex-1 flex-col items-center justify-end">
                    {d.count > 0 && (
                      <span className="mb-1 text-[12px] font-medium text-[#5F5E59]">{d.count}</span>
                    )}
                    <div
                      className={"w-full max-w-[120px] rounded-t-[4px] transition-all " + style.bar}
                      style={{ height: `${(d.count / maxCount) * (plotH - 24)}px` }}
                      title={`${d.status}: ${d.count}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="mt-2 flex justify-around gap-6 pl-6">
          {data.map((d) => (
            <div key={d.status} className="flex flex-1 items-center justify-center gap-1.5 text-[12px] text-[#5F5E59]">
              <span className={"h-2 w-2 rounded-full " + STATUS_STYLE[d.status].dot} />
              <span className="truncate">{d.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TableLayoutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 6.5h12M6 6.5V13" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function ListLayoutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function BoardLayoutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="2.5" width="4" height="11" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="7.5" y="2.5" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="13" y="2.5" width="1.5" height="5.5" rx="0.75" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function GalleryLayoutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="2.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="2.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2" y="9" width="5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="9" width="5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function CalendarLayoutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 6h12M5.5 2v2.5M10.5 2v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function TimelineLayoutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="3" width="7" height="2.5" rx="1.25" fill="currentColor" />
      <rect x="6" y="6.75" width="8" height="2.5" rx="1.25" fill="currentColor" />
      <rect x="3.5" y="10.5" width="6" height="2.5" rx="1.25" fill="currentColor" />
    </svg>
  );
}

function ChartLayoutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 14h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="3" y="8" width="2.4" height="4" rx="0.5" fill="currentColor" />
      <rect x="6.8" y="5" width="2.4" height="7" rx="0.5" fill="currentColor" />
      <rect x="10.6" y="9.5" width="2.4" height="2.5" rx="0.5" fill="currentColor" />
    </svg>
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

const OPTIONAL_COLS = ["Created by", "Source", "Last edited time", "Last visited time"];

// Maps a group field id to its human label (empty when ungrouped).
function groupLabelFor(groupId: string): string {
  switch (groupId) {
    case "page_name": return "Page name";
    case "created_by": return "Created by";
    case "created_time": return "Created time";
    case "last_edited_by": return "Last edited by";
    case "last_edited_time": return "Last edited time";
    case "last_visited_time": return "Last visited time";
    case "source": return "Source";
    default: return "";
  }
}

function CollectionSettingsMenu({
  sortLabel,
  groupLabel,
  layout,
  hiddenCols,
  onToggleCol,
  onLayout,
  onSort,
  onGroup,
  onClose,
  onAddAdvancedFilter,
  onAddFilter,
}: {
  sortLabel: string;
  groupLabel: string;
  layout: LayoutKind;
  hiddenCols: Set<string>;
  onToggleCol: (label: string) => void;
  onLayout: (next: LayoutKind) => void;
  onSort: () => void;
  onGroup: () => void;
  onClose: () => void;
  onAddAdvancedFilter: () => void;
  onAddFilter: (fieldName: string) => void;
}) {
  const [view, setView] = useState<"main" | "visibility" | "filter">("main");
  const [filterQuery, setFilterQuery] = useState("");

  if (view === "visibility") {
    const shown = ["Page name", ...OPTIONAL_COLS.filter((label) => !hiddenCols.has(label))];
    const hiddenItems = OPTIONAL_COLS.filter((label) => hiddenCols.has(label));

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
          hidden={hiddenCols}
          onToggle={onToggleCol}
        />
        <PropertySection
          title="Hidden in table"
          action="Show all"
          items={hiddenItems}
          hidden={hiddenCols}
          onToggle={onToggleCol}
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
              onClick={() => onAddFilter(label)}
            />
          ))}
        </div>
        <MenuSeparator />
        <button
          onClick={onAddAdvancedFilter}
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
        value={String(1 + OPTIONAL_COLS.filter((c) => !hiddenCols.has(c)).length)}
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
        value={groupLabel}
        onClick={onGroup}
      />
      <MenuSeparator />
      <MenuLabel>Layout</MenuLabel>
      <LayoutMenuItem
        icon={<TableLayoutIcon className="h-5 w-5" />}
        label="Table"
        active={layout === "table"}
        onClick={() => onLayout("table")}
      />
      <LayoutMenuItem
        icon={<ListLayoutIcon className="h-5 w-5" />}
        label="List"
        active={layout === "list"}
        onClick={() => onLayout("list")}
      />
      <LayoutMenuItem
        icon={<BoardLayoutIcon className="h-5 w-5" />}
        label="Board"
        active={layout === "board"}
        onClick={() => onLayout("board")}
      />
      <LayoutMenuItem
        icon={<CalendarLayoutIcon className="h-5 w-5" />}
        label="Calendar"
        active={layout === "calendar"}
        onClick={() => onLayout("calendar")}
      />
      <LayoutMenuItem
        icon={<TimelineLayoutIcon className="h-5 w-5" />}
        label="Timeline"
        active={layout === "timeline"}
        onClick={() => onLayout("timeline")}
      />
      <LayoutMenuItem
        icon={<GalleryLayoutIcon className="h-5 w-5" />}
        label="Gallery"
        active={layout === "gallery"}
        onClick={() => onLayout("gallery")}
      />
      <LayoutMenuItem
        icon={<ChartLayoutIcon className="h-5 w-5" />}
        label="Chart"
        active={layout === "chart"}
        onClick={() => onLayout("chart")}
      />
    </div>
  );
}

function LayoutMenuItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] transition-colors hover:bg-black/[0.05]"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[#5F5E59]">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {active && (
        <svg className="h-4 w-4 shrink-0 text-[#2C2C2B]" viewBox="0 0 16 16" fill="currentColor">
          <path d="M11.834 3.309a.625.625 0 0 1 1.072.642l-5.244 8.74a.625.625 0 0 1-1.01.085L3.155 8.699a.626.626 0 0 1 .95-.813l2.93 3.419z" />
        </svg>
      )}
    </button>
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
          onClick={() => items.filter((i) => i !== "Page name").forEach(onToggle)}
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
