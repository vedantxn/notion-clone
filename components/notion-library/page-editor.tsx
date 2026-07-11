"use client";

import { useEffect, useRef, useState } from "react";
import { Check, MonitorPlay, Table2, FileText, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { NotionAiMark } from "./icons";

type BlockType = "text" | "h1" | "h2" | "h3" | "todo" | "bullet";
type Block = { id: string; type: BlockType; text: string; checked?: boolean };
type DocData = { title: string; blocks: Block[] };

const STORE_PREFIX = "notion-clone:page:";

const SLASH_OPTIONS: { type: BlockType; label: string; hint: string }[] = [
  { type: "text", label: "Text", hint: "Just start writing with plain text." },
  { type: "h1", label: "Heading 1", hint: "Big section heading." },
  { type: "h2", label: "Heading 2", hint: "Medium section heading." },
  { type: "h3", label: "Heading 3", hint: "Small section heading." },
  { type: "todo", label: "To-do list", hint: "Track tasks with a checkbox." },
  { type: "bullet", label: "Bulleted list", hint: "Create a simple bulleted list." },
];

let counter = 0;
const uid = () => `b${++counter}-${Math.floor(performance.now())}`;

/* -------- default content for known pages -------- */
function defaultBlocks(title: string): Block[] {
  if (title === "Welcome to Notion") {
    return [
      { id: uid(), type: "h2", text: "Getting Started" },
      { id: uid(), type: "todo", text: "Click anywhere and just start typing", checked: true },
      { id: uid(), type: "todo", text: "Highlight any text to style it", checked: false },
      { id: uid(), type: "todo", text: "Type / to insert blocks", checked: false },
      { id: uid(), type: "text", text: "" },
    ];
  }
  if (title === "To Do List") {
    return [
      { id: uid(), type: "todo", text: "Buy groceries", checked: false },
      { id: uid(), type: "todo", text: "Finish the report", checked: false },
      { id: uid(), type: "todo", text: "Call the dentist", checked: false },
      { id: uid(), type: "text", text: "" },
    ];
  }
  if (title === "Getting Started") {
    return [
      { id: uid(), type: "h2", text: "Welcome to your new workspace! 🎉" },
      { id: uid(), type: "text", text: "Here are a few things to try to get started:" },
      { id: uid(), type: "todo", text: "Create your first page", checked: false },
      { id: uid(), type: "todo", text: "Invite your team", checked: false },
      { id: uid(), type: "todo", text: "Explore templates", checked: false },
      { id: uid(), type: "bullet", text: "Type '/' anywhere to insert blocks" },
      { id: uid(), type: "text", text: "" },
    ];
  }
  return [{ id: uid(), type: "text", text: "" }];
}

function canUseLocalStorage() {
  if (typeof window === "undefined") return false;
  try {
    const storage = window.localStorage;
    return (
      storage !== null &&
      typeof storage.getItem === "function" &&
      typeof storage.setItem === "function"
    );
  } catch {
    return false;
  }
}

function load(title: string): DocData {
  return { title: title === "New page" ? "" : title, blocks: defaultBlocks(title) };
}

export function PageEditor({ pageTitle, fullWidth }: { pageTitle: string; fullWidth?: boolean }) {
  const [data, setData] = useState<DocData>(() => load(pageTitle));

  useEffect(() => {
    if (!canUseLocalStorage()) return;
    try {
      const raw = window.localStorage.getItem(STORE_PREFIX + pageTitle);
      if (raw) {
        const saved = JSON.parse(raw) as DocData;
        if (saved.title === "New page") saved.title = "";
        setData(saved);
      }
    } catch {}
  }, [pageTitle]);
  const [slashFor, setSlashFor] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  // persist (debounced) whenever data changes
  useEffect(() => {
    if (!canUseLocalStorage()) return;
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(STORE_PREFIX + pageTitle, JSON.stringify(data));
      } catch {}
    }, 250);
    return () => clearTimeout(t);
  }, [data, pageTitle]);

  const setTitle = (title: string) => setData((d) => ({ ...d, title }));

  const updateBlock = (id: string, patch: Partial<Block>) =>
    setData((d) => ({ ...d, blocks: d.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)) }));

  const insertAfter = (id: string) => {
    const nb: Block = { id: uid(), type: "text", text: "" };
    setData((d) => {
      const i = d.blocks.findIndex((b) => b.id === id);
      const blocks = [...d.blocks];
      blocks.splice(i + 1, 0, nb);
      return { ...d, blocks };
    });
    setFocusId(nb.id);
  };

  const removeBlock = (id: string) => {
    setData((d) => {
      if (d.blocks.length <= 1) return d;
      const i = d.blocks.findIndex((b) => b.id === id);
      const prev = d.blocks[i - 1];
      if (prev) setFocusId(prev.id);
      return { ...d, blocks: d.blocks.filter((b) => b.id !== id) };
    });
  };

  const applySlash = (id: string, type: BlockType) => {
    updateBlock(id, { type, text: "" });
    setSlashFor(null);
    setFocusId(id);
  };

  const isEmpty = data.blocks.every((b) => !b.text.trim());

  return (
    <div className={"mx-auto flex min-h-[calc(100vh-190px)] w-full flex-col px-16 pt-16 pb-8 " + (fullWidth ? "max-w-full" : "max-w-[720px]")}>
      {/* Title */}
      <h1
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        data-ph="New page"
        onInput={(e) => setTitle(e.currentTarget.textContent ?? "")}
        className="mb-2 text-[40px] font-bold leading-[1.2] text-[#2C2C2B] outline-none empty:before:pointer-events-none empty:before:text-[#D6D4CF] empty:before:content-[attr(data-ph)]"
      >
        {data.title}
      </h1>

      {/* Blocks */}
      {data.blocks.map((b) => (
        <div key={b.id} className="relative">
          <BlockRow
            block={b}
            focused={focusId === b.id}
            onFocused={() => setFocusId(null)}
            onChange={(text) => updateBlock(b.id, { text })}
            onEnter={() => insertAfter(b.id)}
            onEmptyBackspace={() => removeBlock(b.id)}
            onSlash={() => setSlashFor(b.id)}
            onToggleCheck={() => updateBlock(b.id, { checked: !b.checked })}
          />
          {slashFor === b.id && (
            <SlashMenu
              onPick={(type) => applySlash(b.id, type)}
              onClose={() => setSlashFor(null)}
            />
          )}
        </div>
      ))}

      {/* "Get started with" bar — only on an empty page, like Notion */}
      {isEmpty && <GetStartedBar />}
    </div>
  );
}

function TemplatesIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-[15px] w-[15px]" aria-hidden>
      <rect x="1" y="1.5" width="6.4" height="6.4" rx="1.6" fill="#E9962E" />
      <circle cx="4.2" cy="12" r="3.2" fill="#2E7DD6" />
      <path d="M11.2 3.6 L15.4 11 L7 11 Z" fill="#E9C93B" />
    </svg>
  );
}

const STARTERS = [
  {
    icon: (
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black/[0.06]">
        <NotionAiMark className="h-3 w-3 text-[#37352F]" />
      </span>
    ),
    label: "Ask AI",
  },
  { icon: <MonitorPlay className="h-[17px] w-[17px] text-[#5F5E59]" strokeWidth={1.7} />, label: "AI Meeting Notes" },
  { icon: <Table2 className="h-[17px] w-[17px] text-[#5F5E59]" strokeWidth={1.7} />, label: "Database" },
  { icon: <FileText className="h-[17px] w-[17px] text-[#5F5E59]" strokeWidth={1.7} />, label: "Form" },
  { icon: <TemplatesIcon />, label: "Templates" },
];

function GetStartedBar() {
  return (
    <div className="mt-auto -mx-16 flex flex-col items-center pt-16">
      <div className="mb-3 text-[13px] text-[#9B9A97]">Get started with</div>
      <div className="flex items-center justify-center gap-2">
        {STARTERS.map((s) => (
          <button
            key={s.label}
            onClick={() => toast(s.label)}
            className="flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-black/[0.09] bg-white pl-2.5 pr-3.5 text-[14px] font-medium text-[#2C2C2B] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-black/[0.03]"
          >
            {s.icon}
            {s.label}
          </button>
        ))}
        <button
          onClick={() => toast("More")}
          aria-label="More"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/[0.09] bg-white text-[#5F5E59] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-black/[0.03]"
        >
          <MoreHorizontal className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

function BlockRow({
  block,
  focused,
  onFocused,
  onChange,
  onEnter,
  onEmptyBackspace,
  onSlash,
  onToggleCheck,
}: {
  block: Block;
  focused: boolean;
  onFocused: () => void;
  onChange: (text: string) => void;
  onEnter: () => void;
  onEmptyBackspace: () => void;
  onSlash: () => void;
  onToggleCheck: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Set initial text once (uncontrolled to preserve caret).
  useEffect(() => {
    if (ref.current && ref.current.textContent !== block.text) {
      ref.current.textContent = block.text;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.type]);

  useEffect(() => {
    if (focused && ref.current) {
      ref.current.focus();
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      onFocused();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused]);

  const cls: Record<BlockType, string> = {
    text: "text-[16px] leading-[1.75] text-[#2C2C2B]",
    h1: "text-[30px] font-bold leading-tight text-[#2C2C2B] mt-2",
    h2: "text-[24px] font-bold leading-tight text-[#2C2C2B] mt-2",
    h3: "text-[20px] font-semibold leading-tight text-[#2C2C2B] mt-1",
    todo: "text-[16px] leading-[1.75] text-[#2C2C2B]",
    bullet: "text-[16px] leading-[1.75] text-[#2C2C2B]",
  };
  const ph: Record<BlockType, string> = {
    text: "Press '/' for commands",
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    todo: "To-do",
    bullet: "List",
  };

  return (
    <div className="group flex items-start gap-1.5 py-0.5">
      {block.type === "todo" && (
        <button
          onClick={onToggleCheck}
          className={
            "mt-[5px] flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors " +
            (block.checked ? "border-[#2383E2] bg-[#2383E2] text-white" : "border-[#C6C4C0] hover:bg-black/[0.04]")
          }
          aria-label="Toggle"
        >
          {block.checked && <Check className="h-3 w-3" strokeWidth={3} />}
        </button>
      )}
      {block.type === "bullet" && (
        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2C2C2B]" />
      )}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        data-ph={ph[block.type]}
        onInput={(e) => {
          const t = e.currentTarget.textContent ?? "";
          if (t === "/") onSlash();
          onChange(t);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onEnter();
          } else if (e.key === "Backspace" && (e.currentTarget.textContent ?? "") === "") {
            e.preventDefault();
            onEmptyBackspace();
          }
        }}
        className={
          "flex-1 outline-none empty:before:pointer-events-none empty:before:text-[#C6C4C0] empty:before:content-[attr(data-ph)] " +
          cls[block.type] +
          (block.type === "todo" && block.checked ? " text-[#9B9A97] line-through" : "")
        }
      />
    </div>
  );
}

function SlashMenu({
  onPick,
  onClose,
}: {
  onPick: (type: BlockType) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="absolute left-0 top-7 z-50 w-[300px] overflow-hidden rounded-lg border border-black/[0.08] bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.14)]">
      <div className="px-2 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-[#9B9A97]">Basic blocks</div>
      {SLASH_OPTIONS.map((o) => (
        <button
          key={o.type}
          onClick={() => onPick(o.type)}
          className="flex w-full flex-col rounded-md px-2 py-1.5 text-left transition-colors hover:bg-black/[0.05]"
        >
          <span className="text-[14px] text-[#2C2C2B]">{o.label}</span>
          <span className="text-[12px] text-[#9B9A97]">{o.hint}</span>
        </button>
      ))}
    </div>
  );
}
