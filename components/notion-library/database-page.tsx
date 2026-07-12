"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Plus,
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  X,
  Check,
  FileText,
  MoreHorizontal,
  TableProperties,
  Search,
  Lock,
  ChevronDown,
  Table2,
  Lightbulb,
  Calendar,
  Target,
  Type,
  Hash,
  CircleDot,
  Tags,
  CircleDashed,
  User,
  Paperclip,
  CheckSquare,
  Link2,
  AtSign,
  Phone,
  Clock,
  Sigma,
  ArrowLeftRight,
  UserCircle2,
  Trash2,
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

function IterateIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M11.9 5.35A4.55 4.55 0 1 0 12.2 10"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path
        d="M10.45 3.55h2.4v2.4"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="1.55" fill="currentColor" />
    </svg>
  );
}

type TemplatePreviewKey = "tasks" | "projects" | "docs";

const TEMPLATE_PREVIEWS: Record<TemplatePreviewKey, { title: string; description: string; tone: "green" | "blue" | "red" }> = {
  tasks: {
    title: "Tasks Tracker",
    description: "Stay organized with tasks, your way.",
    tone: "green",
  },
  projects: {
    title: "Projects",
    description: "Manage projects start to finish.",
    tone: "blue",
  },
  docs: {
    title: "Document Hub",
    description: "Collaborate on docs in one hub.",
    tone: "red",
  },
};

type PropertyTypeKey =
  | "text" | "number" | "select" | "multi_select" | "status" | "date"
  | "person" | "files" | "checkbox" | "url" | "email" | "phone"
  | "formula" | "relation" | "created_time" | "created_by"
  | "last_edited_time" | "last_edited_by";

type PropertyTypeDef = { key: PropertyTypeKey; label: string; icon: React.ReactNode };

const PROPERTY_TYPE_GROUPS: { group: string; types: PropertyTypeDef[] }[] = [
  {
    group: "Type",
    types: [
      { key: "text", label: "Text", icon: <Type className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "number", label: "Number", icon: <Hash className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "select", label: "Select", icon: <CircleDot className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "multi_select", label: "Multi-select", icon: <Tags className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "status", label: "Status", icon: <CircleDashed className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "date", label: "Date", icon: <Calendar className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "person", label: "Person", icon: <User className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "files", label: "Files & media", icon: <Paperclip className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "checkbox", label: "Checkbox", icon: <CheckSquare className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "url", label: "URL", icon: <Link2 className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "email", label: "Email", icon: <AtSign className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "phone", label: "Phone", icon: <Phone className="h-4 w-4" strokeWidth={1.9} /> },
    ],
  },
  {
    group: "Advanced",
    types: [
      { key: "formula", label: "Formula", icon: <Sigma className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "relation", label: "Relation", icon: <ArrowLeftRight className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "created_time", label: "Created time", icon: <Clock className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "created_by", label: "Created by", icon: <UserCircle2 className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "last_edited_time", label: "Last edited time", icon: <Clock className="h-4 w-4" strokeWidth={1.9} /> },
      { key: "last_edited_by", label: "Last edited by", icon: <UserCircle2 className="h-4 w-4" strokeWidth={1.9} /> },
    ],
  },
];

const PROPERTY_TYPE_MAP: Record<PropertyTypeKey, PropertyTypeDef> = Object.fromEntries(
  PROPERTY_TYPE_GROUPS.flatMap((g) => g.types).map((t) => [t.key, t]),
) as Record<PropertyTypeKey, PropertyTypeDef>;

// Notion's light option-chip palette.
const SELECT_COLORS = [
  { bg: "bg-[#E3E2E0]", text: "text-[#37352F]", dot: "bg-[#9B9A97]" },
  { bg: "bg-[#FADEC9]", text: "text-[#5C3B23]", dot: "bg-[#C4835A]" },
  { bg: "bg-[#FDECC8]", text: "text-[#584421]", dot: "bg-[#CB9433]" },
  { bg: "bg-[#DBEDDB]", text: "text-[#1C3829]", dot: "bg-[#4F9768]" },
  { bg: "bg-[#D3E5EF]", text: "text-[#183347]", dot: "bg-[#529CCA]" },
  { bg: "bg-[#E8DEEE]", text: "text-[#412454]", dot: "bg-[#9A6DD7]" },
  { bg: "bg-[#F5E0E9]", text: "text-[#4C2337]", dot: "bg-[#E255A1]" },
  { bg: "bg-[#FFE2DD]", text: "text-[#5D1715]", dot: "bg-[#FF7369]" },
];

type SelectOption = { id: string; name: string; color: number };

type DatabaseProperty = { id: string; name: string; type: PropertyTypeKey; options?: SelectOption[]; formula?: string };

type CellValue = string | string[] | boolean | undefined;

const ROW_IDS = ["r0", "r1", "r2", "r3"];

// Pages a Relation property can point at.
const RELATION_PAGES: { title: string; icon: React.ReactNode }[] = [
  { title: "Welcome to Notion", icon: <span className="text-[13px] leading-none">👋</span> },
  { title: "To Do List", icon: <span className="text-[13px] leading-none">✅</span> },
  { title: "New page", icon: <FileText className="h-3.5 w-3.5 text-[#91918E]" strokeWidth={1.8} /> },
  { title: "Getting Started", icon: <FileText className="h-3.5 w-3.5 text-[#91918E]" strokeWidth={1.8} /> },
  { title: "Project roadmap", icon: <FileText className="h-3.5 w-3.5 text-[#91918E]" strokeWidth={1.8} /> },
];

let propIdCounter = 0;
let optIdCounter = 0;

export function DatabasePage({ fullWidth }: { fullWidth?: boolean }) {
  const [panelOpen, setPanelOpen] = useState(true);
  const [aiText, setAiText] = useState("");
  const [customizingTemplate, setCustomizingTemplate] = useState<TemplatePreviewKey | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [properties, setProperties] = useState<DatabaseProperty[]>([]);
  const [addPropOpen, setAddPropOpen] = useState(false);
  const [cells, setCells] = useState<Record<string, CellValue>>({});
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const addProperty = (type: PropertyTypeKey) => {
    const def = PROPERTY_TYPE_MAP[type];
    setProperties((prev) => [
      ...prev,
      { id: `prop-${++propIdCounter}`, name: def.label, type, formula: type === "formula" ? "" : undefined },
    ]);
    setAddPropOpen(false);
  };

  const renameProperty = (id: string, name: string) => {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const setFormula = (id: string, formula: string) => {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, formula } : p)));
  };

  const removeProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setCells((prev) => {
      const next: Record<string, CellValue> = {};
      for (const k of Object.keys(prev)) if (!k.endsWith(`:${id}`)) next[k] = prev[k];
      return next;
    });
  };

  const setCell = (rowId: string, propId: string, val: CellValue) =>
    setCells((prev) => ({ ...prev, [`${rowId}:${propId}`]: val }));

  const addOption = (propId: string, name: string): SelectOption => {
    const opt: SelectOption = { id: `opt-${++optIdCounter}`, name, color: optIdCounter % SELECT_COLORS.length };
    setProperties((prev) =>
      prev.map((p) => (p.id === propId ? { ...p, options: [...(p.options ?? []), opt] } : p)),
    );
    return opt;
  };

  const handleAiSend = () => {
    if (!aiText.trim()) return;
    toast(`AI creating database: ${aiText}`);
    setAiText("");
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden text-[#2C2C2B] bg-white">
      {/* Left Area: Main Database Table View */}
      <div className="flex-1 flex flex-col overflow-y-auto px-8 pt-[86px] xl:px-16">
        <div className={fullWidth ? "max-w-full" : "max-w-[960px] w-full mx-auto"}>
          {/* Page Title */}
          <h1 className="mb-8 whitespace-nowrap text-[56px] font-bold leading-[1.08] tracking-[-0.01em] text-[#2C2C2B]">New database</h1>

          {/* Tab Switcher */}
          <div className="mb-8 flex items-center gap-1.5 border-b border-black/[0.08] pb-2">
            <button className="flex h-10 items-center gap-1.5 rounded-md bg-[#F1F0EF] px-3 text-[16px] font-semibold text-[#37352F]">
              <TableProperties className="h-4 w-4 text-[#37352F]" />
              Table
            </button>
          </div>

          {/* Database Grid Table */}
          <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white text-[16px]">
            <div className="overflow-x-auto">
              <div className="w-max min-w-[760px]">
                {/* Table Header */}
                <div className="flex h-[52px] border-b border-black/[0.08] bg-[#FBFAF9] font-medium text-[#5F5E59]">
                  <div className="flex w-[320px] shrink-0 items-center gap-1.5 border-r border-black/[0.08] px-4">
                    <span className="text-[14px] font-semibold text-[#8A8985]">Aa</span>
                    <span>Name</span>
                  </div>

                  {properties.map((prop) => (
                    <PropertyColumnHeader
                      key={prop.id}
                      property={prop}
                      onRename={(name) => renameProperty(prop.id, name)}
                      onRemove={() => removeProperty(prop.id)}
                    />
                  ))}

                  <button
                    ref={addBtnRef}
                    onClick={() => setAddPropOpen((v) => !v)}
                    className="flex flex-1 cursor-pointer items-center gap-1 px-4 text-[#8A8985] hover:bg-black/[0.03]"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="whitespace-nowrap">Add property</span>
                  </button>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-black/[0.06]">
                  {ROW_IDS.map((rowId, r) => {
                    // Row values keyed by property name (used to evaluate formulas).
                    const rowValues: Record<string, CellValue> = {};
                    for (const p of properties) rowValues[p.name] = cells[`${rowId}:${p.id}`];
                    return (
                    <div key={rowId} className="flex h-12 hover:bg-black/[0.02]">
                      {r === 0 ? (
                        <div className="flex w-[320px] shrink-0 cursor-pointer items-center gap-1.5 border-r border-black/[0.08] px-4 text-[#9B9A97]">
                          <Plus className="h-4 w-4" />
                          <span>New page</span>
                        </div>
                      ) : (
                        <div className="w-[320px] shrink-0 border-r border-black/[0.08]"></div>
                      )}
                      {properties.map((prop) => (
                        <EditableCell
                          key={prop.id}
                          property={prop}
                          value={cells[`${rowId}:${prop.id}`]}
                          rowValues={rowValues}
                          onChange={(val) => setCell(rowId, prop.id, val)}
                          onAddOption={(name) => addOption(prop.id, name)}
                          onSetFormula={(expr) => setFormula(prop.id, expr)}
                        />
                      ))}
                      <div className="flex-1"></div>
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Area: New Database Panel */}
      {panelOpen && (
        <div className="relative w-[290px] shrink-0">
          <aside className="flex h-full w-[290px] select-none flex-col overflow-y-auto border-l border-black/[0.08] bg-[#FCFCFB]">
            {/* Header */}
            <div className="flex h-[42px] items-center px-4 pb-1 pt-3.5">
              <h2 className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[#2C2C2B]">New database</h2>
              <button
                onClick={() => setPanelOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.035] text-[#8A8985] hover:bg-black/[0.07]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* AI Prompt Box */}
            <div className="px-[11px] py-2.5">
              <div className="flex min-h-[82px] rounded-xl border border-[#2383E2]/70 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="mt-2.5 ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/[0.035] text-[#5F5E59]">
                  <FaceIcon className="h-3.5 w-3.5" />
                </div>
                <div className="relative flex-1 px-2 pb-1 pt-1.5">
                  <textarea
                    value={aiText}
                    onChange={(e) => setAiText(e.target.value)}
                    placeholder="Describe what you want to build"
                    className="min-h-11 w-full resize-none bg-transparent pr-7 text-[14px] leading-5 text-[#2C2C2B] outline-none placeholder:text-[#8F8E8A]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAiSend();
                      }
                    }}
                  />
                  <button
                    onClick={handleAiSend}
                    disabled={!aiText.trim()}
                    className={`absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                      aiText.trim() ? "bg-[#2383E2] text-white hover:bg-[#1a73d0]" : "bg-black/[0.06] text-[#B4B1AB]"
                    }`}
                  >
                    <ArrowUp className="h-3.5 w-3.5" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-col text-[14px] text-[#2C2C2B]">
              <button
                onClick={() => toast("Created empty database")}
                className="mx-1.5 flex items-center rounded-md p-1.5 text-left hover:bg-black/[0.04]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-black/[0.035] text-[#5F5E59]">
                  <Plus className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="truncate text-[14px] leading-5">New empty data source</span>
              </button>
              <button
                onClick={() => toast("Import CSV clicked")}
                className="mx-1.5 flex items-center rounded-md p-1.5 text-left hover:bg-black/[0.04]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#5F5E59]">
                  <ArrowDown className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="truncate text-[14px] leading-5">Import CSV</span>
              </button>
            </div>

            {/* Suggested Templates */}
            <div className="mt-2 flex flex-col">
              <h3 className="px-4 py-1 text-[11.5px] font-semibold uppercase tracking-wider text-[#8A8985]">
                Suggested
              </h3>
              
              <TemplateButton
                icon={
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#E2F5EC] text-[#0F7B48]">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                }
                label="Tasks Tracker"
                onSelect={() => setCustomizingTemplate("tasks")}
              />

              <TemplateButton
                icon={
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#E5F1FD] text-[#2383E2]">
                    <IterateIcon />
                  </span>
                }
                label="Projects"
                onSelect={() => setCustomizingTemplate("projects")}
              />

              <TemplateButton
                icon={
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#FCE8E6] text-[#E5484D]">
                    <FileText className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                }
                label="Document Hub"
                onSelect={() => setCustomizingTemplate("docs")}
              />

              <button
                onClick={() => setGalleryOpen(true)}
                className="mx-1.5 flex items-center rounded-md p-1.5 text-left text-[14px] hover:bg-black/[0.04]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#5F5E59]">
                  <MoreHorizontal className="h-5 w-5" />
                </span>
                <span className="truncate text-[14px] leading-5 text-[#5F5E59]">More templates</span>
              </button>
            </div>

            <div className="mx-[11px] my-2 border-b border-black/[0.08]" />

            {/* Link to existing */}
            <button
              onClick={() => toast("Linking to existing data source")}
              className="mx-1.5 flex items-center rounded-md p-1.5 text-left text-[14px] hover:bg-black/[0.04]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#5F5E59]">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="truncate text-[14px] leading-5 text-[#2C2C2B]">Link to existing data source</span>
            </button>
          </aside>
        </div>
      )}
      {galleryOpen && (
        <TemplateGalleryModal
          onClose={() => setGalleryOpen(false)}
          onSelectTemplate={(key) => {
            setGalleryOpen(false);
            setCustomizingTemplate(key);
          }}
        />
      )}
      {customizingTemplate && (
        <TemplateCustomizeModal
          templateKey={customizingTemplate}
          onClose={() => setCustomizingTemplate(null)}
        />
      )}
      {addPropOpen && (
        <PropertyTypeMenu
          anchorRef={addBtnRef}
          onPick={addProperty}
          onClose={() => setAddPropOpen(false)}
        />
      )}
    </div>
  );
}

function PropertyColumnHeader({
  property,
  onRename,
  onRemove,
}: {
  property: DatabaseProperty;
  onRename: (name: string) => void;
  onRemove: () => void;
}) {
  const def = PROPERTY_TYPE_MAP[property.type];
  return (
    <div className="group relative flex w-[160px] shrink-0 items-center gap-1.5 border-r border-black/[0.08] px-3">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[#8A8985] [&_svg]:h-4 [&_svg]:w-4">
        {def.icon}
      </span>
      <input
        value={property.name}
        onChange={(e) => onRename(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-[#5F5E59] outline-none"
        aria-label="Property name"
      />
      <button
        onClick={onRemove}
        aria-label="Delete property"
        className="hidden h-6 w-6 shrink-0 items-center justify-center rounded text-[#9B9A97] hover:bg-black/[0.06] hover:text-[#5F5E59] group-hover:flex"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.9} />
      </button>
    </div>
  );
}

function CellShell({
  innerRef,
  onClick,
  children,
}: {
  innerRef?: React.Ref<HTMLDivElement>;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={innerRef}
      onClick={onClick}
      className="flex h-full w-[160px] shrink-0 cursor-pointer items-center gap-1 overflow-hidden border-r border-black/[0.08] px-2 text-[14px] hover:bg-black/[0.015]"
    >
      {children}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E28026] text-[10px] font-semibold text-white">
      {name[0]}
    </span>
  );
}

function PersonChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.04] py-0.5 pl-0.5 pr-2 text-[13px] text-[#2C2C2B]">
      <Avatar name={name} />
      {name}
    </span>
  );
}

function OptionChip({ name, color, withDot }: { name: string; color: (typeof SELECT_COLORS)[number]; withDot?: boolean }) {
  return (
    <span className={`inline-flex h-[20px] max-w-full items-center gap-1 rounded-[4px] px-1.5 text-[13px] font-medium ${color.bg} ${color.text}`}>
      {withDot && <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${color.dot}`} />}
      <span className="truncate">{name}</span>
    </span>
  );
}

function formatCellDate(str: string) {
  try {
    return new Date(str + "T00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return str;
  }
}

function CellPopover({
  anchorRef,
  width = 240,
  onClose,
  children,
}: {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  width?: number;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const rect = anchorRef.current?.getBoundingClientRect();
  const left = rect ? Math.min(rect.left, window.innerWidth - width - 8) : 0;
  const top = rect ? rect.bottom + 2 : 0;
  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      <div
        className="fixed z-[91] rounded-lg border border-black/[0.08] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
        style={{ left, top, width }}
      >
        {children}
      </div>
    </>
  );
}

function SelectPopover({
  anchorRef,
  property,
  selected,
  withDot,
  onToggle,
  onCreate,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  property: DatabaseProperty;
  selected: string[];
  withDot?: boolean;
  onToggle: (name: string) => void;
  onCreate: (name: string) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const options = property.options ?? [];
  const ql = q.trim().toLowerCase();
  const filtered = options.filter((o) => o.name.toLowerCase().includes(ql));
  const exact = options.some((o) => o.name.toLowerCase() === ql);
  const rect = anchorRef.current?.getBoundingClientRect();
  const left = rect ? Math.min(rect.left, window.innerWidth - 258) : 0;
  const top = rect ? rect.bottom + 2 : 0;
  const nextColor = SELECT_COLORS[options.length % SELECT_COLORS.length];

  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      <div className="fixed z-[91] w-[250px] rounded-lg border border-black/[0.08] bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.16)]" style={{ left, top }}>
        <div className="p-1">
          <div className="flex items-center rounded-md bg-black/[0.04] px-2 py-1.5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] focus-within:bg-white focus-within:shadow-[inset_0_0_0_1px_#2383E2]">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && q.trim() && !exact) onCreate(q.trim());
              }}
              placeholder="Search or create an option…"
              className="h-full w-full bg-transparent text-[14px] text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]"
            />
          </div>
        </div>
        <div className="max-h-[240px] overflow-y-auto pb-1">
          <div className="px-2 py-1 text-[11px] font-medium text-[#8A8985]">Select an option or create one</div>
          {filtered.map((o) => {
            const isSel = selected.includes(o.name);
            return (
              <button
                key={o.id}
                onClick={() => onToggle(o.name)}
                className="flex w-full items-center justify-between gap-2 rounded px-2 py-1 text-left hover:bg-black/[0.05]"
              >
                <OptionChip name={o.name} color={SELECT_COLORS[o.color]} withDot={withDot} />
                {isSel && <Check className="h-4 w-4 shrink-0 text-[#5F5E59]" strokeWidth={2.2} />}
              </button>
            );
          })}
          {q.trim() && !exact && (
            <button
              onClick={() => onCreate(q.trim())}
              className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-[14px] text-[#5F5E59] hover:bg-black/[0.05]"
            >
              Create
              <OptionChip name={q.trim()} color={nextColor} withDot={withDot} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function EditableCell({
  property,
  value,
  rowValues,
  onChange,
  onAddOption,
  onSetFormula,
}: {
  property: DatabaseProperty;
  value: CellValue;
  rowValues: Record<string, CellValue>;
  onChange: (val: CellValue) => void;
  onAddOption: (name: string) => void;
  onSetFormula: (expr: string) => void;
}) {
  const type = property.type;
  const cellRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  // Checkbox — toggle
  if (type === "checkbox") {
    const checked = value === true;
    return (
      <CellShell onClick={() => onChange(!checked)}>
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-[3px] border-[1.5px] ${
            checked ? "border-[#2383E2] bg-[#2383E2]" : "border-black/25"
          }`}
        >
          {checked && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
        </span>
      </CellShell>
    );
  }

  // Inline text-like inputs
  if (type === "text" || type === "number" || type === "url" || type === "email" || type === "phone") {
    const str = typeof value === "string" ? value : "";
    const inputType = type === "number" ? "number" : type === "url" ? "url" : type === "email" ? "email" : type === "phone" ? "tel" : "text";
    return (
      <CellShell onClick={() => setEditing(true)}>
        {editing ? (
          <input
            autoFocus
            type={inputType}
            defaultValue={str}
            onBlur={(e) => {
              onChange(e.target.value || undefined);
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              if (e.key === "Escape") setEditing(false);
            }}
            className="h-full w-full bg-transparent text-[14px] text-[#2C2C2B] outline-none"
          />
        ) : (
          <span className={`truncate ${type === "url" || type === "email" ? "text-[#2383E2] underline" : "text-[#2C2C2B]"}`}>{str}</span>
        )}
      </CellShell>
    );
  }

  // Date
  if (type === "date") {
    const str = typeof value === "string" ? value : "";
    return (
      <>
        <CellShell innerRef={cellRef} onClick={() => setOpen(true)}>
          <span className="truncate text-[#2C2C2B]">{str ? formatCellDate(str) : ""}</span>
        </CellShell>
        {open && (
          <CellPopover anchorRef={cellRef} width={232} onClose={() => setOpen(false)}>
            <div className="p-2">
              <input
                autoFocus
                type="date"
                value={str}
                onChange={(e) => onChange(e.target.value || undefined)}
                className="h-8 w-full rounded border border-black/[0.12] px-2 text-[14px] text-[#2C2C2B] outline-none focus:border-[#2383E2]"
              />
              {str && (
                <button
                  onClick={() => { onChange(undefined); setOpen(false); }}
                  className="mt-1 flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[13px] text-[#5F5E59] hover:bg-black/[0.05]"
                >
                  <X className="h-3.5 w-3.5" /> Clear
                </button>
              )}
            </div>
          </CellPopover>
        )}
      </>
    );
  }

  // Person (editable) — created_by / last_edited_by are auto (read-only)
  if (type === "person" || type === "created_by" || type === "last_edited_by") {
    if (type !== "person") {
      return (
        <CellShell>
          <PersonChip name="Alex Morgan" />
        </CellShell>
      );
    }
    const name = typeof value === "string" ? value : "";
    return (
      <>
        <CellShell innerRef={cellRef} onClick={() => setOpen(true)}>
          {name ? <PersonChip name={name} /> : null}
        </CellShell>
        {open && (
          <CellPopover anchorRef={cellRef} width={230} onClose={() => setOpen(false)}>
            <div className="p-1">
              <div className="px-2 py-1 text-[11px] font-medium text-[#8A8985]">Select a person</div>
              {["Alex Morgan", "Abhishek Sharma"].map((p) => (
                <button
                  key={p}
                  onClick={() => { onChange(name === p ? undefined : p); setOpen(false); }}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[14px] hover:bg-black/[0.05]"
                >
                  <Avatar name={p} />
                  {p}
                  {name === p && <Check className="ml-auto h-4 w-4 text-[#5F5E59]" strokeWidth={2.2} />}
                </button>
              ))}
            </div>
          </CellPopover>
        )}
      </>
    );
  }

  // Select / Status / Multi-select
  if (type === "select" || type === "status" || type === "multi_select") {
    const multi = type === "multi_select";
    const withDot = type === "status";
    const selected = multi
      ? (Array.isArray(value) ? value : [])
      : (typeof value === "string" && value ? [value] : []);
    return (
      <>
        <CellShell innerRef={cellRef} onClick={() => setOpen(true)}>
          {selected.map((n) => {
            const opt = (property.options ?? []).find((o) => o.name === n);
            return <OptionChip key={n} name={n} color={SELECT_COLORS[opt?.color ?? 0]} withDot={withDot} />;
          })}
        </CellShell>
        {open && (
          <SelectPopover
            anchorRef={cellRef}
            property={property}
            selected={selected}
            withDot={withDot}
            onToggle={(n) => {
              if (multi) {
                const set = new Set(selected);
                if (set.has(n)) set.delete(n);
                else set.add(n);
                onChange([...set]);
              } else {
                onChange(selected.includes(n) ? undefined : n);
                setOpen(false);
              }
            }}
            onCreate={(n) => {
              onAddOption(n);
              if (multi) onChange([...selected, n]);
              else { onChange(n); setOpen(false); }
            }}
            onClose={() => setOpen(false)}
          />
        )}
      </>
    );
  }

  // Relation — link to pages in another data source
  if (type === "relation") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <>
        <CellShell innerRef={cellRef} onClick={() => setOpen(true)}>
          {selected.map((title) => {
            const page = RELATION_PAGES.find((p) => p.title === title);
            return (
              <span key={title} className="inline-flex items-center gap-1 rounded-[4px] bg-black/[0.05] px-1.5 py-0.5 text-[13px] text-[#37352F]">
                <span className="flex h-3.5 w-3.5 items-center justify-center [&_svg]:h-3.5 [&_svg]:w-3.5">{page?.icon}</span>
                <span className="max-w-[90px] truncate underline decoration-black/20">{title}</span>
              </span>
            );
          })}
        </CellShell>
        {open && (
          <RelationPopover
            anchorRef={cellRef}
            selected={selected}
            onToggle={(title) => {
              const set = new Set(selected);
              if (set.has(title)) set.delete(title);
              else set.add(title);
              onChange([...set]);
            }}
            onClose={() => setOpen(false)}
          />
        )}
      </>
    );
  }

  // Formula — read-only computed result; click to edit the expression
  if (type === "formula") {
    const expr = property.formula ?? "";
    const result = expr.trim() ? evalFormula(expr, rowValues) : "";
    return (
      <>
        <CellShell innerRef={cellRef} onClick={() => setOpen(true)}>
          <span className="truncate text-[#37352F]">{result === "" ? "" : String(result)}</span>
        </CellShell>
        {open && (
          <FormulaPopover
            anchorRef={cellRef}
            expr={expr}
            rowValues={rowValues}
            propertyNames={Object.keys(rowValues).filter((n) => n !== property.name)}
            onChange={onSetFormula}
            onClose={() => setOpen(false)}
          />
        )}
      </>
    );
  }

  // Computed / read-only
  if (type === "created_time" || type === "last_edited_time") {
    return (
      <CellShell>
        <span className="text-[#7D7A75]">Just now</span>
      </CellShell>
    );
  }

  return <CellShell>{null}</CellShell>;
}

function RelationPopover({
  anchorRef,
  selected,
  onToggle,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  selected: string[];
  onToggle: (title: string) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const rect = anchorRef.current?.getBoundingClientRect();
  const left = rect ? Math.min(rect.left, window.innerWidth - 268) : 0;
  const top = rect ? rect.bottom + 2 : 0;
  const ql = q.trim().toLowerCase();
  const pages = RELATION_PAGES.filter((p) => p.title.toLowerCase().includes(ql));

  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      <div className="fixed z-[91] w-[260px] rounded-lg border border-black/[0.08] bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.16)]" style={{ left, top }}>
        <div className="p-1">
          <div className="flex items-center rounded-md bg-black/[0.04] px-2 py-1.5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] focus-within:bg-white focus-within:shadow-[inset_0_0_0_1px_#2383E2]">
            <Search className="h-3.5 w-3.5 shrink-0 text-[#8A8985]" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Link a page…"
              className="ml-1.5 h-full w-full bg-transparent text-[14px] text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]"
            />
          </div>
        </div>
        <div className="max-h-[240px] overflow-y-auto pb-1">
          <div className="px-2 py-1 text-[11px] font-medium text-[#8A8985]">Link a page</div>
          {pages.map((p) => {
            const isSel = selected.includes(p.title);
            return (
              <button
                key={p.title}
                onClick={() => onToggle(p.title)}
                className="flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left hover:bg-black/[0.05]"
              >
                <span className="flex min-w-0 items-center gap-2 text-[14px] text-[#37352F]">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center">{p.icon}</span>
                  <span className="truncate">{p.title}</span>
                </span>
                {isSel && <Check className="h-4 w-4 shrink-0 text-[#5F5E59]" strokeWidth={2.2} />}
              </button>
            );
          })}
          {pages.length === 0 && <div className="px-2 py-3 text-center text-[13px] text-[#9B9A97]">No pages found</div>}
        </div>
      </div>
    </>
  );
}

const FORMULA_HELP = [
  'prop("Name")  — a property value',
  "+ − × ÷ and ( )  — arithmetic",
  "if(cond, a, b), round(x), length(x)",
  "upper(x), lower(x), concat(a, b)",
];

function FormulaPopover({
  anchorRef,
  expr,
  rowValues,
  propertyNames,
  onChange,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  expr: string;
  rowValues: Record<string, CellValue>;
  propertyNames: string[];
  onChange: (expr: string) => void;
  onClose: () => void;
}) {
  const rect = anchorRef.current?.getBoundingClientRect();
  const width = 320;
  const left = rect ? Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)) : 0;
  const top = rect ? rect.bottom + 2 : 0;
  let preview: string;
  try {
    preview = expr.trim() ? String(evalFormula(expr, rowValues)) : "";
  } catch {
    preview = "";
  }

  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      <div className="fixed z-[91] rounded-lg border border-black/[0.08] bg-white p-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.16)]" style={{ left, top, width }}>
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[#8A8985]">Edit formula</div>
        <textarea
          autoFocus
          value={expr}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          spellCheck={false}
          placeholder='e.g. round(prop("Price") * 1.2)'
          className="w-full resize-none rounded-md border border-black/[0.12] bg-[#FBFAF9] px-2 py-1.5 font-mono text-[13px] text-[#2C2C2B] outline-none focus:border-[#2383E2]"
        />
        <div className="mt-2 flex items-center gap-2 rounded-md bg-black/[0.03] px-2 py-1.5 text-[13px]">
          <span className="text-[#9B9A97]">Result</span>
          <span className="min-w-0 flex-1 truncate font-medium text-[#37352F]">{preview}</span>
        </div>
        {propertyNames.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {propertyNames.map((n) => (
              <button
                key={n}
                onClick={() => onChange((expr ? expr + " " : "") + `prop("${n}")`)}
                className="rounded bg-black/[0.05] px-1.5 py-0.5 text-[12px] text-[#37352F] hover:bg-black/[0.09]"
              >
                {n}
              </button>
            ))}
          </div>
        )}
        <div className="mt-2 border-t border-black/[0.06] pt-1.5 text-[11.5px] leading-[1.5] text-[#9B9A97]">
          {FORMULA_HELP.map((h) => (
            <div key={h}>{h}</div>
          ))}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Minimal formula evaluator: numbers, strings, prop("Name"), arithmetic,
// comparisons, and a handful of functions. Returns a string/number, or "" on error.
// ---------------------------------------------------------------------------
type Tok = { t: "num" | "str" | "id" | "op"; v: string };

function tokenizeFormula(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  const ops = ["==", "!=", ">=", "<="];
  while (i < src.length) {
    const c = src[i];
    if (c === " " || c === "\t" || c === "\n") { i++; continue; }
    if (c === '"' || c === "'") {
      let s = "";
      const quote = c;
      i++;
      while (i < src.length && src[i] !== quote) { s += src[i]; i++; }
      i++;
      toks.push({ t: "str", v: s });
      continue;
    }
    if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] ?? ""))) {
      let n = "";
      while (i < src.length && /[0-9.]/.test(src[i])) { n += src[i]; i++; }
      toks.push({ t: "num", v: n });
      continue;
    }
    if (/[a-zA-Z_]/.test(c)) {
      let id = "";
      while (i < src.length && /[a-zA-Z0-9_]/.test(src[i])) { id += src[i]; i++; }
      toks.push({ t: "id", v: id });
      continue;
    }
    const two = src.slice(i, i + 2);
    if (ops.includes(two)) { toks.push({ t: "op", v: two }); i += 2; continue; }
    toks.push({ t: "op", v: c });
    i++;
  }
  return toks;
}

function numify(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isNaN(n) ? 0 : n;
}

function evalFormula(src: string, vars: Record<string, CellValue>): string | number {
  try {
    const toks = tokenizeFormula(src);
    let pos = 0;
    const peek = () => toks[pos];
    const eat = () => toks[pos++];

    const parsePrimary = (): unknown => {
      const tk = peek();
      if (!tk) return 0;
      if (tk.t === "num") { eat(); return parseFloat(tk.v); }
      if (tk.t === "str") { eat(); return tk.v; }
      if (tk.v === "(") { eat(); const e = parseExpr(); if (peek()?.v === ")") eat(); return e; }
      if (tk.v === "-") { eat(); return -numify(parsePrimary()); }
      if (tk.t === "id") {
        eat();
        const name = tk.v;
        if (peek()?.v === "(") {
          eat();
          const args: unknown[] = [];
          if (peek()?.v !== ")") {
            args.push(parseExpr());
            while (peek()?.v === ",") { eat(); args.push(parseExpr()); }
          }
          if (peek()?.v === ")") eat();
          return callFn(name, args, vars);
        }
        if (name === "true") return true;
        if (name === "false") return false;
        return vars[name] ?? "";
      }
      eat();
      return 0;
    };

    const parseMul = (): unknown => {
      let left = parsePrimary();
      while (peek() && (peek().v === "*" || peek().v === "/" || peek().v === "%")) {
        const op = eat().v;
        const right = parsePrimary();
        left = op === "*" ? numify(left) * numify(right) : op === "/" ? numify(left) / numify(right) : numify(left) % numify(right);
      }
      return left;
    };

    const parseAdd = (): unknown => {
      let left = parseMul();
      while (peek() && (peek().v === "+" || peek().v === "-")) {
        const op = eat().v;
        const right = parseMul();
        if (op === "+" && (typeof left === "string" || typeof right === "string")) {
          left = `${left ?? ""}${right ?? ""}`;
        } else {
          left = op === "+" ? numify(left) + numify(right) : numify(left) - numify(right);
        }
      }
      return left;
    };

    const parseExpr = (): unknown => {
      let left = parseAdd();
      while (peek() && ["==", "!=", ">", "<", ">=", "<="].includes(peek().v)) {
        const op = eat().v;
        const right = parseAdd();
        const ln = numify(left), rn = numify(right);
        const bothNum = !isNaN(parseFloat(String(left))) && !isNaN(parseFloat(String(right)));
        const l = bothNum ? ln : left, r = bothNum ? rn : right;
        left =
          op === "==" ? l === r :
          op === "!=" ? l !== r :
          op === ">" ? ln > rn :
          op === "<" ? ln < rn :
          op === ">=" ? ln >= rn :
          ln <= rn;
      }
      return left;
    };

    const out = parseExpr();
    if (typeof out === "boolean") return out ? "true" : "false";
    if (typeof out === "number") return Number.isInteger(out) ? out : Math.round(out * 1000) / 1000;
    return out === undefined || out === null ? "" : String(out);
  } catch {
    return "";
  }
}

function callFn(name: string, args: unknown[], vars: Record<string, CellValue>): unknown {
  switch (name) {
    case "prop": return vars[String(args[0] ?? "")] ?? "";
    case "if": return args[0] ? args[1] : args[2];
    case "round": return Math.round(numify(args[0]));
    case "floor": return Math.floor(numify(args[0]));
    case "ceil": return Math.ceil(numify(args[0]));
    case "abs": return Math.abs(numify(args[0]));
    case "min": return Math.min(...args.map(numify));
    case "max": return Math.max(...args.map(numify));
    case "length": return String(args[0] ?? "").length;
    case "upper": return String(args[0] ?? "").toUpperCase();
    case "lower": return String(args[0] ?? "").toLowerCase();
    case "concat": return args.map((a) => String(a ?? "")).join("");
    default: return "";
  }
}

function PropertyTypeMenu({
  anchorRef,
  onPick,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onPick: (type: PropertyTypeKey) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const rect = anchorRef.current?.getBoundingClientRect();
  const ql = q.trim().toLowerCase();
  const groups = PROPERTY_TYPE_GROUPS.map((g) => ({
    ...g,
    types: g.types.filter((t) => t.label.toLowerCase().includes(ql)),
  })).filter((g) => g.types.length > 0);

  const left = rect ? Math.min(rect.left, window.innerWidth - 312) : 0;
  const top = rect ? rect.bottom + 4 : 0;

  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      <div
        className="fixed z-[91] w-[300px] rounded-lg border border-black/[0.08] bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
        style={{ left, top }}
      >
        <div className="p-1.5">
          <div className="flex h-8 items-center rounded-md bg-black/[0.04] px-2 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] focus-within:bg-white focus-within:shadow-[inset_0_0_0_1px_#2383E2]">
            <Search className="h-3.5 w-3.5 shrink-0 text-[#8A8985]" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for a property type…"
              className="ml-1.5 h-full w-full bg-transparent text-[14px] text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]"
            />
          </div>
        </div>
        <div className="max-h-[340px] overflow-y-auto pb-1">
          {groups.length === 0 ? (
            <div className="px-3 py-6 text-center text-[13px] text-[#9B9A97]">No property types found</div>
          ) : (
            groups.map((g) => (
              <div key={g.group}>
                <div className="px-3 pb-1 pt-2 text-[11.5px] font-semibold uppercase tracking-wide text-[#9B9A97]">
                  {g.group}
                </div>
                {g.types.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => onPick(t.key)}
                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[14px] text-[#37352F] hover:bg-black/[0.05]"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[#5F5E59] [&_svg]:h-4 [&_svg]:w-4">
                      {t.icon}
                    </span>
                    {t.label}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

function TemplateButton({
  icon,
  label,
  onSelect,
}: {
  icon: React.ReactNode;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="mx-1.5 flex items-center rounded-md p-1.5 text-left text-[14px] hover:bg-black/[0.055]"
    >
      {icon}
      <span className="truncate text-[14px] leading-5 text-[#2C2C2B]">{label}</span>
    </button>
  );
}

function TemplateCustomizeModal({
  templateKey,
  onClose,
}: {
  templateKey: TemplatePreviewKey;
  onClose: () => void;
}) {
  const preview = TEMPLATE_PREVIEWS[templateKey];
  const isProjects = templateKey === "projects";
  const isDocs = templateKey === "docs";
  const features = {
    tasks: ["Priority", "Task type", "Effort level", "Description", "Updated at", "Past due", "Attach file"],
    projects: ["Priority", "Team", "Start and end dates", "Assignee", "Attach file", "Progress", "Budget"],
    docs: ["Created time", "Category", "Last edited by", "Last updated time", "Reviewers"],
  }[templateKey];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[calc(100vh-64px)] w-[min(1180px,calc(100vw-160px))] overflow-hidden rounded-xl bg-[#FCFCFB] text-[#2C2C2B] shadow-[0_24px_48px_rgba(25,25,25,0.24),0_4px_12px_rgba(25,25,25,0.14),0_0_0_1px_rgba(42,28,0,0.07)]"
      >
        <button
          onClick={onClose}
          className="absolute left-6 top-6 z-10 flex h-7 w-7 items-center justify-center rounded-md text-[#8A8985] hover:bg-black/[0.05]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex w-[460px] shrink-0 flex-col px-9 pb-8 pt-[76px]">
          <div>
            <h2 className="text-[27px] font-bold leading-tight text-[#2C2C2B]">Customize {preview.title}</h2>
            <p className="mt-2 text-[17px] font-medium text-[#7D7A75]">Select features to turn on or off</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {features.map((feature, index) => {
              const active = index < (isDocs ? 4 : 5);
              return (
                <button
                  key={feature}
                  className={
                    "flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[18px] font-semibold text-[#2C2C2B] " +
                    (active
                      ? "shadow-[0_0_0_1.5px_#2383E2]"
                      : "shadow-[0_0_0_1px_#E6E5E3]")
                  }
                >
                  <FeatureGlyph label={feature} active={active} />
                  {feature}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              toast(`Started from ${preview.title}`);
              onClose();
            }}
            className="mt-auto h-11 rounded-lg bg-[#2383E2] text-[18px] font-semibold text-white hover:bg-[#1a73d0]"
          >
            Get started
          </button>
        </div>

        <div className="flex flex-1 items-stretch py-6 pr-6">
          <div className="flex flex-1 flex-col rounded-xl border border-black/[0.08] bg-white px-12 py-10 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-4">
              {templateKey === "tasks" ? (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2D9964] text-white">
                  <Check className="h-6 w-6" strokeWidth={3.2} />
                </span>
              ) : templateKey === "projects" ? (
                <IterateIcon className="h-10 w-10 text-[#2383E2]" />
              ) : (
                <FileText className="h-10 w-10 fill-[#D84F4B] text-[#D84F4B]" strokeWidth={1.9} />
              )}
              <h3 className="text-[34px] font-bold text-[#2C2C2B]">{preview.title}</h3>
            </div>

            <div className="mt-6 flex items-center gap-3 text-[18px] font-semibold text-[#7D7A75]">
              <span className="rounded-full bg-[rgba(42,28,0,0.07)] px-3 py-1.5 text-[#2C2C2B]">
                {isProjects ? "➜ By Status" : isDocs ? "★ All Docs" : "★ All Tasks"}
              </span>
              <span>{isProjects ? "★ All Projects" : isDocs ? "♟ My Docs" : "➜ By Status"}</span>
              <span>{isProjects ? "▰ Gantt" : isDocs ? "" : "♟ My Tasks"}</span>
            </div>

            {isProjects ? <ProjectBoardPreview /> : <TemplateTablePreview templateKey={templateKey} />}

            {isProjects && <div className="mt-auto text-right text-[15px] font-semibold text-[#8A8985]">4 hidden properties</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureGlyph({ label, active }: { label: string; active: boolean }) {
  const color = active ? "text-[#2383E2]" : "text-[#8A8985]";
  const glyph = label.includes("date") || label.includes("time") || label.includes("Updated")
    ? "◷"
    : label.includes("Assignee") || label.includes("Reviewer") || label.includes("Team")
      ? "♟"
      : label.includes("Attach")
        ? "↗"
        : label.includes("Progress")
          ? "▰"
          : label.includes("Description") || label.includes("Category")
            ? "☰"
            : "▾";

  return <span className={color}>{glyph}</span>;
}

function TemplateTablePreview({ templateKey }: { templateKey: TemplatePreviewKey }) {
  const rows = templateKey === "docs"
    ? [
        ["Company mission and strategy", "Strategy doc", "Abhishek Sharma"],
        ["Proposal for new year campaign", "Proposal", "Abhishek Sharma"],
        ["Customer feedback report", "Customer research", "Abhishek Sharma"],
      ]
    : [
        ["Improve website copy", "Done", "0"],
        ["Update help center & FAQ", "In progress", "0"],
        ["Publish release notes", "Not started", "0"],
      ];

  return (
    <div className="mt-7 overflow-hidden text-[18px] font-semibold text-[#2C2C2B]">
      <div className="grid grid-cols-[1.6fr_0.9fr_0.9fr] border-b border-black/[0.08] text-[17px] text-[#7D7A75]">
        <div className="py-2">Aa {templateKey === "docs" ? "Doc name" : "Task name"}</div>
        <div className="py-2">{templateKey === "docs" ? "☰ Category" : "✣ Status"}</div>
        <div className="py-2">{templateKey === "docs" ? "☻ Created by" : "☷ Assignee"}</div>
      </div>
      {rows.map((row) => (
        <div key={row[0]} className="grid h-[48px] grid-cols-[1.6fr_0.9fr_0.9fr] border-b border-black/[0.06]">
          <div className="flex items-center truncate pr-3">{row[0]}</div>
          <div className="flex items-center">
            <StatusPill label={row[1]} />
          </div>
          <div className="flex items-center truncate text-[#5F5E59]">{templateKey === "docs" ? row[2] : row[2]}</div>
        </div>
      ))}
    </div>
  );
}

function ProjectBoardPreview() {
  return (
    <div className="mt-5 grid grid-cols-2 gap-4">
      <BoardColumn title="Not started" tone="gray" item="📖 Quarterly sales planning" tag="Medium" />
      <BoardColumn title="In progress" tone="blue" item="📱 Public launch of iOS app" tag="High" />
    </div>
  );
}

function BoardColumn({ title, tone, item, tag }: { title: string; tone: "gray" | "blue"; item: string; tag: string }) {
  return (
    <div className={tone === "blue" ? "rounded-xl bg-[#EAF2FB] p-4" : "rounded-xl bg-black/[0.03] p-4"}>
      <span className={tone === "blue" ? "rounded-full bg-[rgba(0,118,217,0.20)] px-3 py-1 text-[16px] font-semibold text-[#264A72]" : "rounded-full bg-[rgba(28,19,1,0.11)] px-3 py-1 text-[16px] font-semibold text-[#494846]"}>
        {title}
      </span>
      <div className="mt-5 rounded-lg border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="text-[19px] font-bold text-[#2C2C2B]">{item}</div>
        <span className={tag === "High" ? "mt-4 inline-flex rounded bg-[rgba(211,47,47,0.16)] px-2 py-1 text-[13px] font-bold text-[#6D3531]" : "mt-4 inline-flex rounded bg-[rgba(203,145,0,0.20)] px-2 py-1 text-[13px] font-bold text-[#655121]"}>
          {tag}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Template gallery ("More templates") full-screen picker
// ---------------------------------------------------------------------------

type GalleryChip = { label: string; tone: keyof typeof CHIP_TONES };
type GalleryCell = "line" | "avatar" | "empty" | GalleryChip;

// Light-theme status chips inside the white preview (dot + label), values from live extraction.
const CHIP_TONES = {
  gray: "bg-[rgba(28,19,1,0.11)] text-[#494846]",
  blue: "bg-[rgba(0,118,217,0.20)] text-[#264A72]",
  green: "bg-[rgba(0,96,38,0.157)] text-[#2A533C]",
  red: "bg-[rgba(211,47,47,0.16)] text-[#6D3531]",
  orange: "bg-[rgba(186,72,3,0.16)] text-[#6A4222]",
  yellow: "bg-[rgba(203,145,0,0.20)] text-[#655121]",
};

const CHIP_DOT: Record<keyof typeof CHIP_TONES, string> = {
  gray: "bg-[#8A8985]",
  blue: "bg-[#3B82D0]",
  green: "bg-[#3C8A5F]",
  red: "bg-[#C4544F]",
  orange: "bg-[#C1783A]",
  yellow: "bg-[#C0932F]",
};

type GalleryTint = "green" | "blue" | "red" | "orange" | "yellow" | "neutral";

// Card tints (bg / border / text) captured from the live light-theme modal.
const GALLERY_TINTS: Record<GalleryTint, { bg: string; border: string; text: string }> = {
  green: { bg: "bg-[rgba(3,87,31,0.035)]", border: "border-[#D7E6DD]", text: "text-[#2A533C]" },
  blue: { bg: "bg-[rgba(0,128,213,0.047)]", border: "border-[#D6E5F2]", text: "text-[#264A72]" },
  red: { bg: "bg-[rgba(199,3,3,0.035)]", border: "border-[#EEDCDB]", text: "text-[#6D3531]" },
  orange: { bg: "bg-[rgba(186,72,3,0.043)]", border: "border-[#EEE1D6]", text: "text-[#6A4222]" },
  yellow: { bg: "bg-[rgba(207,175,0,0.063)]", border: "border-[#ECE6D2]", text: "text-[#655121]" },
  neutral: { bg: "bg-white", border: "border-[#E9E8E5]", text: "text-[#2C2C2B]" },
};

type GalleryTemplate = {
  key: string;
  customizeKey: TemplatePreviewKey | null;
  title: string;
  description: string;
  tint: GalleryTint;
  previewIcon: React.ReactNode;
  columns: [string, string, string];
  rows: [GalleryCell, GalleryCell, GalleryCell][];
};

const GALLERY_TEMPLATES: GalleryTemplate[] = [
  {
    key: "tasks",
    customizeKey: "tasks",
    title: "Tasks Tracker",
    description: "Stay organized with tasks, your way.",
    tint: "green",
    previewIcon: (
      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[4px] bg-[#2D9964] text-white">
        <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
      </span>
    ),
    columns: ["Task name", "Status", "Assignee"],
    rows: [
      ["line", { label: "Not started", tone: "gray" }, "avatar"],
      ["line", { label: "In progress", tone: "blue" }, "avatar"],
      ["line", { label: "Done", tone: "green" }, "avatar"],
    ],
  },
  {
    key: "projects",
    customizeKey: "projects",
    title: "Projects",
    description: "Manage projects start to finish.",
    tint: "blue",
    previewIcon: <IterateIcon className="h-3.5 w-3.5 text-[#2383E2]" />,
    columns: ["", "", ""],
    rows: [
      [
        { label: "Not started", tone: "gray" },
        { label: "In progress", tone: "blue" },
        { label: "Done", tone: "green" },
      ],
      ["line", "line", "line"],
      ["line", "line", "line"],
    ],
  },
  {
    key: "docs",
    customizeKey: "docs",
    title: "Document Hub",
    description: "Collaborate on docs in one hub.",
    tint: "red",
    previewIcon: <FileText className="h-3.5 w-3.5 fill-[#D84F4B] text-[#D84F4B]" strokeWidth={1.9} />,
    columns: ["Doc name", "Created by", "Created time"],
    rows: [
      ["line", "avatar", "line"],
      ["line", "avatar", "line"],
      ["line", "avatar", "line"],
    ],
  },
  {
    key: "brainstorm",
    customizeKey: null,
    title: "Brainstorm Session",
    description: "Spark new ideas together.",
    tint: "orange",
    previewIcon: <Lightbulb className="h-3.5 w-3.5 fill-[#D89A2E] text-[#D89A2E]" strokeWidth={1.9} />,
    columns: ["Idea", "Created by", "Priority"],
    rows: [
      ["line", "avatar", { label: "High", tone: "red" }],
      ["line", "avatar", { label: "Medium", tone: "yellow" }],
      ["line", "avatar", { label: "Low", tone: "green" }],
    ],
  },
  {
    key: "meeting",
    customizeKey: null,
    title: "Meeting Notes",
    description: "Turn meetings into action.",
    tint: "yellow",
    previewIcon: <Calendar className="h-3.5 w-3.5 text-[#B79A2E]" strokeWidth={2} />,
    columns: ["Meeting name", "Date", "Category"],
    rows: [
      ["line", "line", { label: "Standup", tone: "red" }],
      ["line", "line", { label: "Presentation", tone: "orange" }],
      ["line", "line", { label: "Planning", tone: "blue" }],
    ],
  },
  {
    key: "goals",
    customizeKey: null,
    title: "Goals Tracker",
    description: "Set team goals, achieve together.",
    tint: "blue",
    previewIcon: <Target className="h-3.5 w-3.5 text-[#2383E2]" strokeWidth={2} />,
    columns: ["Goal name", "Owner", "Status"],
    rows: [
      ["line", "avatar", { label: "Done", tone: "green" }],
      ["line", "avatar", { label: "Not started", tone: "gray" }],
      ["line", "avatar", { label: "In progress", tone: "blue" }],
    ],
  },
];

function TemplateGalleryModal({
  onClose,
  onSelectTemplate,
}: {
  onClose: () => void;
  onSelectTemplate: (key: TemplatePreviewKey) => void;
}) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const templates = q
    ? GALLERY_TEMPLATES.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
      )
    : GALLERY_TEMPLATES;

  const handleSelect = (t: GalleryTemplate) => {
    if (t.customizeKey) {
      onSelectTemplate(t.customizeKey);
    } else {
      toast(`Started from ${t.title}`);
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 px-5 py-[64px] sm:py-[110px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[calc(100vh-128px)] min-h-[520px] w-[min(1000px,100%)] flex-col overflow-hidden rounded-xl bg-[#F9F8F7] text-[#2C2C2B] shadow-[0_24px_48px_rgba(25,25,25,0.24),0_4px_12px_rgba(25,25,25,0.14),0_0_0_1px_rgba(42,28,0,0.07)]"
      >
        {/* Header (floats over the scroll area) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[68px] items-center px-4">
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[#8A8985] hover:bg-black/[0.05]"
            >
              <X className="h-5 w-5" />
            </button>
            <button className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[14px] hover:bg-black/[0.04]">
              <span className="font-medium text-[#7D7A75]">Add to</span>
              <Lock className="h-3.5 w-3.5 text-[#8A8985]" />
              <span className="font-medium text-[#2C2C2B]">Private</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#8A8985]" />
            </button>
          </div>
          <div className="pointer-events-auto absolute left-1/2 top-1/2 w-[296px] max-w-[calc(100%-320px)] -translate-x-1/2 -translate-y-1/2">
            <div
              className={`flex h-9 items-center gap-2 rounded-[10px] bg-[rgba(249,249,248,0.8)] px-3 ${
                query
                  ? "shadow-[inset_0_0_0_1px_#2383E2,0_0_0_1px_#2383E2]"
                  : "shadow-[inset_0_0_0_1px_rgba(15,15,15,0.1)] focus-within:shadow-[inset_0_0_0_1px_#2383E2,0_0_0_1px_#2383E2]"
              }`}
            >
              <Search className="h-4 w-4 text-[#8A8985]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-full w-full bg-transparent text-[14px] text-[#2C2C2B] outline-none placeholder:text-[#8F8E8A]"
              />
            </div>
          </div>
          <button
            onClick={() => {
              toast("Created empty database");
              onClose();
            }}
            className="pointer-events-auto ml-auto flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[14px] text-[#2C2C2B] hover:bg-black/[0.04]"
          >
            <Table2 className="h-4 w-4 text-[#5F5E59]" strokeWidth={1.9} />
            Empty database
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 pb-12 pt-[68px]">
          <div className="mx-auto w-[576px] max-w-full">
            {!q && (
              <>
                {/* Build with AI */}
                <GallerySectionLabel icon={<FaceIcon className="h-3.5 w-3.5" />}>
                  Build with AI
                </GallerySectionLabel>
                <div className="mb-9 flex min-h-[76px] rounded-xl border border-black/[0.09] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <div className="ml-2.5 mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/[0.035] text-[#5F5E59]">
                    <FaceIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="relative flex-1 px-2 pb-1 pt-[9px]">
                    <span className="text-[14px] text-[#8F8E8A]">Describe what you want to build</span>
                    <button
                      onClick={() => toast("Describe your database to build with AI")}
                      className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/[0.06] text-[#B4B1AB]"
                    >
                      <ArrowUp className="h-3.5 w-3.5" strokeWidth={3} />
                    </button>
                  </div>
                </div>

                {/* Existing data sources */}
                <GallerySectionLabel icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                  Existing data sources
                </GallerySectionLabel>
                <div className="mb-9 grid grid-cols-[repeat(2,280px)] gap-4">
                  <GalleryTemplateCard
                    tint="neutral"
                    title="Todo List"
                    description="To Do List"
                    previewIcon={<TableProperties className="h-3.5 w-3.5 text-[#5F5E59]" />}
                    previewName="Todo List"
                    columns={["Assignee", "Status", "Due date"]}
                    rows={[
                      ["avatar", { label: "Not started", tone: "gray" }, "line"],
                      ["avatar", { label: "In progress", tone: "blue" }, "line"],
                      ["avatar", { label: "Done", tone: "green" }, "line"],
                    ]}
                    onSelect={() => {
                      toast("Linked Todo List");
                      onClose();
                    }}
                  />
                </div>
              </>
            )}

            {/* Templates */}
            <GallerySectionLabel icon={<TableProperties className="h-3.5 w-3.5" />}>
              Templates
            </GallerySectionLabel>
            {templates.length === 0 ? (
              <div className="py-14 text-center text-[14px] text-[#8A8985]">No templates found</div>
            ) : (
              <div className="grid grid-cols-[repeat(2,280px)] gap-4">
                {templates.map((t) => (
                  <GalleryTemplateCard
                    key={t.key}
                    tint={t.tint}
                    title={t.title}
                    description={t.description}
                    previewIcon={t.previewIcon}
                    previewName={t.title}
                    columns={t.columns}
                    rows={t.rows}
                    onSelect={() => handleSelect(t)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GallerySectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-1.5 text-[14px] font-medium text-[#7D7A75]">
      <span className="text-[#8A8985]">{icon}</span>
      {children}
    </div>
  );
}

function GalleryTemplateCard({
  tint,
  title,
  description,
  previewIcon,
  previewName,
  columns,
  rows,
  onSelect,
}: {
  tint: GalleryTint;
  title: string;
  description: string;
  previewIcon: React.ReactNode;
  previewName: string;
  columns: string[];
  rows: GalleryCell[][];
  onSelect: () => void;
}) {
  const c = GALLERY_TINTS[tint];
  return (
    <button
      onClick={onSelect}
      className={`group flex h-[176px] w-[280px] flex-col overflow-hidden rounded-xl border text-left transition-shadow ${c.bg} ${c.border} hover:shadow-[0_0_0_1px_rgba(15,15,15,0.12)]`}
    >
      <div className="px-5 pb-2.5 pt-5">
        <div className={`text-[14px] font-medium leading-5 ${c.text}`}>{title}</div>
        <div className={`mt-0.5 text-[12px] font-normal leading-4 opacity-70 ${c.text}`}>{description}</div>
      </div>
      {/* White preview that bleeds off the bottom edge */}
      <div className="ml-3 flex-1 rounded-t-[6px] bg-white pl-3 pr-0 pt-3">
        <div className="mb-2.5 flex items-center gap-1.5 text-[12px] font-medium leading-none text-[#2C2C2B]">
          {previewIcon}
          {previewName}
        </div>
        <GalleryMiniTable columns={columns} rows={rows} />
      </div>
    </button>
  );
}

function GalleryMiniTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: GalleryCell[][];
}) {
  return (
    <div>
      {columns.some((c) => c) && (
        <div className="grid grid-cols-3 gap-x-2 pb-1.5 text-[9px] font-medium text-[#7D7A75]">
          {columns.map((c, i) => (
            <span key={i} className="truncate">{c}</span>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-[9px]">
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-3 items-center gap-x-2">
            {row.map((cell, ci) => (
              <GalleryMiniCell key={ci} cell={cell} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryMiniCell({ cell }: { cell: GalleryCell }) {
  if (cell === "empty") return <span />;
  if (cell === "line") return <span className="h-1.5 w-[56px] rounded-full bg-[rgba(42,28,0,0.08)]" />;
  if (cell === "avatar")
    return <span className="h-3.5 w-3.5 rounded-full bg-[#E3E2DF]" />;
  return (
    <span
      className={`flex h-[13px] w-fit items-center gap-1 rounded-[6px] pl-[5px] pr-[7px] text-[8px] font-medium leading-none ${CHIP_TONES[cell.tone]}`}
    >
      <span className={`h-[5px] w-[5px] shrink-0 rounded-full ${CHIP_DOT[cell.tone]}`} />
      <span className="truncate">{cell.label}</span>
    </span>
  );
}

function StatusPill({ label }: { label: string }) {
  const style =
    label === "Done"
      ? { chip: "bg-[rgba(0,96,38,0.157)] text-[#2A533C]", dot: "bg-[#3C8A5F]" }
      : label === "In progress"
        ? { chip: "bg-[rgba(0,118,217,0.20)] text-[#264A72]", dot: "bg-[#3B82D0]" }
        : label === "Not started"
          ? { chip: "bg-[rgba(28,19,1,0.11)] text-[#494846]", dot: "bg-[#8A8985]" }
          : label === "Proposal"
            ? { chip: "bg-[rgba(203,145,0,0.20)] text-[#655121]", dot: "bg-[#C0932F]" }
            : label === "Customer research"
              ? { chip: "bg-[rgba(0,118,217,0.20)] text-[#264A72]", dot: "bg-[#3B82D0]" }
              : { chip: "bg-[rgba(186,72,3,0.16)] text-[#6A4222]", dot: "bg-[#C1783A]" };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[15px] font-semibold ${style.chip}`}>
      <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
}
