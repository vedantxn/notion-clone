"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, ChevronRight, ImagePlus, MessageSquarePlus } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Rich-text segments                                                          */
/* -------------------------------------------------------------------------- */

type Seg =
  | { t: string }
  | { b: string }
  | { code: string }
  | { codeRed: string }
  | { link: string; href: string }
  | { emoji: string };

const t = (s: string): Seg => ({ t: s });
const b = (s: string): Seg => ({ b: s });
const code = (s: string): Seg => ({ code: s });
const codeRed = (s: string): Seg => ({ codeRed: s });
const link = (s: string, href = "#"): Seg => ({ link: s, href });
const emoji = (s: string): Seg => ({ emoji: s });

function RichText({ segs, struck }: { segs: Seg[]; struck?: boolean }) {
  return (
    <>
      {segs.map((s, i) => {
        if ("b" in s) return <strong key={i} className="font-semibold">{s.b}</strong>;
        if ("code" in s)
          return (
            <code key={i} className="rounded bg-[rgba(135,131,120,0.15)] px-1 py-px font-mono text-[85%] text-[#EB5757]">
              {s.code}
            </code>
          );
        if ("codeRed" in s)
          return (
            <code key={i} className="rounded bg-[rgba(135,131,120,0.15)] px-1 py-px font-mono text-[85%] text-[#EB5757]">
              {s.codeRed}
            </code>
          );
        if ("link" in s)
          return (
            <a
              key={i}
              href={s.href}
              onClick={(e) => { e.preventDefault(); toast(s.link); }}
              className="text-inherit underline decoration-[#C6C4C0] underline-offset-2 hover:decoration-[#37352F]"
            >
              {s.link}
            </a>
          );
        if ("emoji" in s) return <span key={i}>{s.emoji}</span>;
        return <span key={i}>{s.t}</span>;
      })}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* To-do tree                                                                  */
/* -------------------------------------------------------------------------- */

type Todo = { id: string; segs: Seg[]; checked?: boolean; children?: Todo[] };

const TODOS: Todo[] = [
  { id: "acct", checked: true, segs: [t("Create an account with Notion")] },
  {
    id: "desktop",
    segs: [
      link("Download the desktop app", "https://notion.so/dynamic-download/desktop"),
      t(" to unlock offline mode and take Notion with you wherever you go"),
    ],
  },
  {
    id: "agent",
    segs: [
      t("Start building with Notion Agent "),
      emoji("👀"),
      t(". Tell it what you’re here to do, and Agent will create it for you in seconds."),
    ],
  },
  {
    id: "slash",
    segs: [
      t("Click anywhere below and type "),
      code("/"),
      t(" to see what you can create – headers, tables, to-do’s, etc."),
    ],
    children: [
      {
        id: "page",
        segs: [t("Type "), codeRed("/page"), t(" to add a "), b("new page"), t(" and nest anything, anywhere")],
      },
    ],
  },
  {
    id: "sidebar",
    segs: [
      b("Find"),
      t(", "),
      b("organize"),
      t(", and "),
      b("add new pages"),
      t(" using the sidebar to the left "),
      emoji("👈"),
    ],
    children: [
      {
        id: "todolist",
        segs: [t("Check out the "), b("To Do List"), t(" we added for you with more tips and tricks to best use Notion")],
      },
      {
        id: "meet",
        segs: [t("Make a new page and type "), codeRed("/meet"), t(" to capture meeting notes and thoughts effortlessly")],
        children: [
          {
            id: "meetings-tab",
            segs: [t("Afterwards, find all your meetings in one place in the "), link("Meetings tab", "https://www.notion.so/meet")],
          },
        ],
      },
    ],
  },
];

function TodoRow({
  node,
  checkedIds,
  onToggle,
}: {
  node: Todo;
  checkedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const checked = checkedIds.has(node.id);
  return (
    <div>
      <div className="group flex items-start gap-2 py-[3px]">
        <button
          onClick={() => onToggle(node.id)}
          aria-label="Toggle to-do"
          className={
            "mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors " +
            (checked ? "border-[#2383E2] bg-[#2383E2] text-white" : "border-[#C6C4C0] hover:bg-black/[0.04]")
          }
        >
          {checked && <Check className="h-3 w-3" strokeWidth={3} />}
        </button>
        <div
          className={
            "text-[16px] leading-[1.6] " + (checked ? "text-[#9B9A97] line-through" : "text-[#2C2C2B]")
          }
        >
          <RichText segs={node.segs} />
        </div>
      </div>
      {node.children && node.children.length > 0 && (
        <div className="ml-[26px]">
          {node.children.map((c) => (
            <TodoRow key={c.id} node={c} checkedIds={checkedIds} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Toggle block                                                                */
/* -------------------------------------------------------------------------- */

const TOGGLE_TIPS: Seg[][] = [
  [t("Click "), b("Marketplace"), t(" in your sidebar to try setups from our incredible community")],
  [
    t("Check out "),
    b("Notion Academy"),
    t(" to level up your Notion knowledge through guided courses (and earn badges while you’re at it!)"),
  ],
];

function ToggleBlock() {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-[3px]">
      <div className="flex items-start gap-1">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Collapse" : "Expand"}
          className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#5F5E59] hover:bg-black/[0.06]"
        >
          <ChevronRight className={"h-4 w-4 transition-transform " + (open ? "rotate-90" : "")} strokeWidth={2.2} />
        </button>
        <div className="text-[16px] leading-[1.6] text-[#2C2C2B]">
          This is a toggle block. Click the little triangle to see a few more useful tips!
        </div>
      </div>
      {open && (
        <div className="ml-[26px] mt-0.5">
          {TOGGLE_TIPS.map((segs, i) => (
            <div key={i} className="flex items-start gap-2 py-[3px]">
              <span className="mt-[10px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#2C2C2B]" />
              <div className="text-[16px] leading-[1.6] text-[#2C2C2B]">
                <RichText segs={segs} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export function WelcomePage({ fullWidth }: { fullWidth?: boolean }) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    () => new Set(TODOS.filter((t) => t.checked).map((t) => t.id))
  );

  const onToggle = (id: string) =>
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className={"mx-auto w-full px-16 pt-14 pb-24 " + (fullWidth ? "max-w-full" : "max-w-[720px]")}>
      {/* Page icon + hover controls */}
      <div className="group">
        <div className="text-[78px] leading-none">👋</div>
        <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => toast("Add cover")}
            className="flex h-7 items-center gap-1.5 rounded-md px-1.5 text-[14px] text-[#9B9A97] hover:bg-black/[0.04]"
          >
            <ImagePlus className="h-4 w-4" strokeWidth={1.8} />
            Add cover
          </button>
          <button
            onClick={() => toast("Add comment")}
            className="flex h-7 items-center gap-1.5 rounded-md px-1.5 text-[14px] text-[#9B9A97] hover:bg-black/[0.04]"
          >
            <MessageSquarePlus className="h-4 w-4" strokeWidth={1.8} />
            Add comment
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="mt-1 mb-4 text-[40px] font-bold leading-[1.2] text-[#2C2C2B]">Welcome to Notion</h1>

      {/* To-do checklist */}
      <div>
        {TODOS.map((node) => (
          <TodoRow key={node.id} node={node} checkedIds={checkedIds} onToggle={onToggle} />
        ))}
        <ToggleBlock />
      </div>
    </div>
  );
}
