"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Trash2,
  ChevronDown,
  UserCircle2,
  FileText,
  Library,
  CircleHelp,
  Check,
} from "lucide-react";
import { useClickOutside, Dropdown } from "./menu";

type FilterItem = { id: string; icon: React.ReactNode; name: string };

const MEMBERS: FilterItem[] = [
  {
    id: "alex",
    icon: (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E3E2E0] text-[10px] font-medium text-[#5F5E59]">
        A
      </span>
    ),
    name: "Alex Morgan",
  },
];

const PAGES: FilterItem[] = [
  { id: "todo", icon: <span className="text-[15px] leading-none">✅</span>, name: "To Do List" },
  { id: "welcome", icon: <span className="text-[15px] leading-none">👋</span>, name: "Welcome to Notion" },
  { id: "new", icon: <FileText className="h-[18px] w-[18px] text-[#91918E]" strokeWidth={1.7} />, name: "New page" },
];

const TEAMSPACES: FilterItem[] = [];

/**
 * Notion "Trash" popover — opens from the sidebar Trash row.
 * The three filter pills (Last edited by / In / Teamspaces) open searchable
 * pickers, matching real Notion.
 */
export function TrashPopover({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const ref = useClickOutside(onClose, "#trash-trigger");

  return (
    <div
      ref={ref}
      className="fixed left-[262px] top-[378px] z-[60] w-[414px] rounded-[10px] bg-white p-1.5 text-[14px] text-[#2C2C2B]"
      style={{
        boxShadow:
          "rgba(25,25,25,0.05) 0px 20px 24px 0px, rgba(25,25,25,0.027) 0px 5px 8px 0px, rgba(42,28,0,0.07) 0px 0px 0px 1px",
      }}
    >
      {/* Search box */}
      <div className="px-1 pt-0.5">
        <div className="flex h-7 items-center rounded-md bg-[rgba(66,35,3,0.03)] px-1.5 focus-within:shadow-[inset_0_0_0_1px_#2383E2,0_0_0_1px_#2383E2]">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
            placeholder="Search pages in Trash"
            className="w-full bg-transparent text-[14px] leading-5 text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]"
          />
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1 px-1 pb-1 pt-2">
        <PillFilter
          icon={<UserCircle2 className="h-4 w-4" strokeWidth={1.8} />}
          label="Last edited by"
          placeholder="Search"
          items={MEMBERS}
          emptyText="No results found"
        />
        <PillFilter
          icon={<FileText className="h-4 w-4" strokeWidth={1.8} />}
          label="In"
          placeholder="Search pages"
          items={PAGES}
          emptyText="No results found"
        />
        <PillFilter
          icon={<Library className="h-4 w-4" strokeWidth={1.8} />}
          label="Teamspaces"
          placeholder="Search teamspaces"
          items={TEAMSPACES}
          emptyText="No results found"
        />
      </div>

      {/* Body — empty state */}
      <div className="flex min-h-[240px] flex-col items-center justify-center">
        <Trash2 className="h-6 w-6 text-[#B9B8B4]" strokeWidth={1.6} />
        <div className="mt-2 text-[17px] font-semibold leading-[22px] text-[#2C2C2B]">
          No results
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between gap-3 px-2 pb-2 pt-2">
        <p className="max-w-[340px] text-[12px] leading-4 text-[#7D7A75]">
          Once a page has been in Trash for 30 days, it will be automatically deleted
        </p>
        <button
          onClick={() => toast("Learn about Trash")}
          className="flex h-5 w-5 shrink-0 items-center justify-center text-[#9B9A97] hover:text-[#5F5E59]"
          aria-label="Help"
        >
          <CircleHelp className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

function PillFilter({
  icon,
  label,
  placeholder,
  items,
  emptyText,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  items: FilterItem[];
  emptyText: string;
}) {
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filtered = items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase()));
  const active = (open: boolean) => open || selectedId !== null;

  return (
    <Dropdown
      width={264}
      trigger={(open, toggle) => (
        <button
          onClick={toggle}
          className={
            "flex h-[26px] items-center gap-1 rounded-md px-1.5 text-[14px] transition-colors " +
            (active(open)
              ? "bg-[#2383E2]/10 text-[#2383E2]"
              : "text-[#2C2C2B] hover:bg-black/[0.04]")
          }
        >
          <span className={active(open) ? "text-[#2383E2]" : "text-[#5F5E59]"}>{icon}</span>
          {label}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
        </button>
      )}
    >
      {(close) => (
        <div className="p-0.5">
          {/* Search inside the picker */}
          <div className="mb-0.5 flex h-7 items-center rounded-md bg-[rgba(66,35,3,0.03)] px-1.5 focus-within:shadow-[inset_0_0_0_1px_#2383E2]">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-[14px] leading-5 text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]"
            />
          </div>
          {/* Results */}
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedId((prev) => (prev === item.id ? null : item.id));
                  toast(`${label}: ${item.name}`);
                  close();
                }}
                className="flex h-8 w-full items-center gap-2 rounded-md px-1.5 text-left text-[14px] text-[#2C2C2B] transition-colors hover:bg-black/[0.05]"
              >
                <span className="flex h-[18px] w-[18px] items-center justify-center">{item.icon}</span>
                <span className="flex-1 truncate">{item.name}</span>
                {selectedId === item.id && (
                  <Check className="h-4 w-4 text-[#2383E2]" strokeWidth={2.2} />
                )}
              </button>
            ))
          ) : (
            <div className="px-2 py-2 text-[14px] text-[#9B9A97]">{emptyText}</div>
          )}
        </div>
      )}
    </Dropdown>
  );
}
