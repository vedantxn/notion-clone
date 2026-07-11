"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Lock,
  ChevronDown,
  ChevronRight,
  Link2,
  Star,
  MoreHorizontal,
  Pencil,
  Lightbulb,
  SlidersHorizontal,
  Volume2,
  Copy,
  UserPlus,
  MonitorPlay,
  Search,
  FileText,
  ListChecks,
  ClipboardCopy,
  CornerUpRight,
  Trash2,
  Baseline,
  MoveHorizontal,
  Sparkles,
  PencilLine,
  Languages,
  Undo2,
  Download,
  Upload,
  Repeat2,
  HelpCircle,
  Globe,
  Check,
} from "lucide-react";
import { Dropdown, MenuLabel, useClickOutside } from "./menu";
import { PageEditor } from "./page-editor";
import { WelcomePage } from "./welcome-page";
import { TodoListPage } from "./todo-list-page";
import { NotionAiMark } from "./icons";

/**
 * Main-content view for an opened page / meeting note.
 * Meeting notes render the Notion "Meeting @Today" card (Notes tab,
 * Start transcribing, AI summary placeholder, consent footer).
 */
export function DocumentView({
  title,
  kind,
  heading,
  favorited,
  onToggleFavorite,
}: {
  title: string;
  kind: "meeting" | "page";
  heading?: string;
  favorited?: boolean;
  onToggleFavorite?: () => void;
}) {
  const isWelcome = title === "Welcome to Notion";
  const isTodo = title === "To Do List";
  const isNewPage = title === "New page";

  // Page layout controls (driven by the Actions "⋯" menu)
  const [pageFont, setPageFont] = useState("Default");
  const [smallText, setSmallText] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const fontFamily =
    pageFont === "Serif"
      ? "Georgia, 'Times New Roman', serif"
      : pageFont === "Mono"
      ? "ui-monospace, 'SF Mono', Menlo, monospace"
      : "inherit";

  return (
    <main className="flex h-dvh flex-1 flex-col overflow-y-auto bg-white text-[#2C2C2B]">
      {/* Top bar */}
      <div className="flex h-11 shrink-0 items-center justify-between px-3">
        <div className="flex items-center gap-1.5 text-[14px] text-[#5F5E59]">
          {isWelcome ? (
            <span className="text-[15px] leading-none">👋</span>
          ) : isTodo ? (
            <ListChecks className="h-4 w-4 text-[#448361]" strokeWidth={2} />
          ) : isNewPage ? null : (
            <MonitorPlay className="h-4 w-4 text-[#8A8985]" strokeWidth={1.7} />
          )}
          <span className="max-w-[220px] truncate">{title}</span>
          <Lock className="ml-1 h-3.5 w-3.5 text-[#9B9A97]" strokeWidth={1.8} />
          <Dropdown
            width={412}
            align="left"
            trigger={(open, toggle) => (
              <button
                onClick={toggle}
                className={
                  "flex items-center gap-0.5 rounded px-1 text-[#5F5E59] hover:bg-black/[0.04] " +
                  (open ? "bg-black/[0.04]" : "")
                }
              >
                Private
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            )}
          >
            {(close) => <MovePageMenu close={close} />}
          </Dropdown>
        </div>
        <div className="flex items-center gap-1 text-[#5F5E59]">
          <span className="mr-1 text-[13px] text-[#9B9A97]">Edited just now</span>
          <Dropdown
            width={460}
            align="right"
            trigger={(open, toggle) => (
              <button
                onClick={toggle}
                className={
                  "flex h-7 items-center gap-1 rounded-md px-2 text-[14px] text-[#5F5E59] hover:bg-black/[0.04] " +
                  (open ? "bg-black/[0.04]" : "")
                }
              >
                <Lock className="h-3.5 w-3.5" strokeWidth={1.8} />
                Share
              </button>
            )}
          >
            {(close) => <SharePopover close={close} />}
          </Dropdown>
          <TopIcon onClick={() => toast("Copied link")}><Link2 className="h-[18px] w-[18px]" strokeWidth={1.8} /></TopIcon>
          <TopIcon onClick={() => onToggleFavorite?.()}>
            <Star
              className={"h-[18px] w-[18px] " + (favorited ? "fill-[#EAB308] text-[#EAB308]" : "")}
              strokeWidth={1.8}
            />
          </TopIcon>
          <Dropdown
            width={280}
            align="right"
            trigger={(open, toggle) => (
              <button
                onClick={toggle}
                className={
                  "flex h-7 w-7 items-center justify-center rounded-md text-[#5F5E59] transition-colors hover:bg-black/[0.04] " +
                  (open ? "bg-black/[0.04]" : "")
                }
              >
                <MoreHorizontal className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </button>
            )}
          >
            {(close) => (
              <ActionsMenu
                close={close}
                onTrash={() => close()}
                font={pageFont}
                setFont={setPageFont}
                smallText={smallText}
                setSmallText={setSmallText}
                fullWidth={fullWidth}
                setFullWidth={setFullWidth}
              />
            )}
          </Dropdown>
        </div>
      </div>

      {/* Content column — font / small-text applied here, cascading to the page */}
      <div className={"flex flex-1 flex-col " + (smallText ? "text-[15px]" : "")} style={{ fontFamily }}>
        {kind === "meeting" ? (
          <div className={"mx-auto w-full px-16 pt-16 " + (fullWidth ? "max-w-full" : "max-w-[900px]")}>
            <h1 className="text-[44px] font-bold leading-[1.1] text-[#B4B1AB]">{title}</h1>
            <MeetingCard heading={heading ?? "Meeting @Today"} />
          </div>
        ) : isWelcome ? (
          <WelcomePage fullWidth={fullWidth} />
        ) : isTodo ? (
          <TodoListPage fullWidth={fullWidth} />
        ) : (
          <PageEditor key={title} pageTitle={title} fullWidth={fullWidth} />
        )}
      </div>
    </main>
  );
}

function MeetingCard({ heading }: { heading: string }) {
  return (
    <div className="mt-7 overflow-hidden rounded-xl border border-black/[0.09] bg-[#FCFCFB] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4">
        <h2 className="text-[18px] font-semibold text-[#2C2C2B]">{heading}</h2>
        <span className="relative">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/[0.06] text-[#5F5E59]">
            <UserPlus className="h-3 w-3" strokeWidth={2} />
          </span>
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#E5484D]" />
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 pt-3">
        <button
          onClick={() => toast("Notes")}
          className="flex h-7 items-center gap-1.5 rounded-md bg-black/[0.05] px-2 text-[14px] font-medium text-[#2C2C2B]"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
          Notes
        </button>
        <div className="flex items-center gap-1">
          <CardIcon onClick={() => toast("Ideas")}><Lightbulb className="h-[18px] w-[18px]" strokeWidth={1.8} /></CardIcon>
          <CardIcon onClick={() => toast("Options")}><SlidersHorizontal className="h-[18px] w-[18px]" strokeWidth={1.8} /></CardIcon>
          <div className="ml-1 flex h-8 items-stretch overflow-hidden rounded-md bg-[#2383E2] text-white">
            <button
              onClick={() => toast.success("Started transcribing")}
              className="flex items-center px-3 text-[14px] font-medium hover:bg-[#1a73d0]"
            >
              Start transcribing
            </button>
            <button
              onClick={() => toast("Transcription options")}
              className="flex items-center border-l border-white/25 px-1.5 hover:bg-[#1a73d0]"
            >
              <ChevronDown className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-8 text-[15px] text-[#9B9A97]">
        Notion AI will summarize the notes and transcript
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 border-t border-black/[0.06] px-4 py-2.5 text-[13px] text-[#9B9A97]">
        <span>Instructions:</span>
        <button
          onClick={() => toast("Instructions: Auto")}
          className="flex items-center gap-0.5 font-medium text-[#2C2C2B] hover:opacity-80"
        >
          Auto
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        <span className="h-4 w-px bg-black/[0.1]" />
        <span className="flex-1 truncate">
          Everyone being transcribed has given consent. By starting, you confirm everyone consents.
        </span>
        <CardIcon onClick={() => toast("Play")}><Volume2 className="h-4 w-4" strokeWidth={1.8} /></CardIcon>
        <CardIcon onClick={() => toast("Copy")}><Copy className="h-4 w-4" strokeWidth={1.8} /></CardIcon>
      </div>
    </div>
  );
}

type MoveTarget = {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: { icon: React.ReactNode; title: string }[];
};

const docIcon = <FileText className="h-[18px] w-[18px] text-[#91918E]" strokeWidth={1.7} />;

const MOVE_TARGETS: MoveTarget[] = [
  { id: "new-page", icon: docIcon, title: "New page", children: [] },
  {
    id: "welcome",
    icon: <span className="text-[15px] leading-none">👋</span>,
    title: "Welcome to Notion",
    children: [
      { icon: docIcon, title: "Getting Started" },
      { icon: docIcon, title: "Tips & Tricks" },
    ],
  },
  {
    id: "todo",
    icon: <span className="text-[15px] leading-none">✅</span>,
    title: "To Do List",
    children: [
      { icon: <span className="text-[15px] leading-none">☑️</span>, title: "Today" },
      { icon: <span className="text-[15px] leading-none">☑️</span>, title: "This week" },
    ],
  },
];

/** The "Move page to…" picker that opens from the Private/breadcrumb control. */
function MovePageMenu({ close }: { close: () => void }) {
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const results = MOVE_TARGETS.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const move = (title: string) => {
    toast(`Moved page to ${title}`);
    close();
  };

  return (
    <div className="flex flex-col">
      {/* Search */}
      <div className="px-1 pt-0.5">
        <div className="flex h-8 items-center gap-1.5 rounded-md bg-[rgba(66,35,3,0.03)] px-2 focus-within:shadow-[inset_0_0_0_1px_#2383E2,0_0_0_1px_#2383E2]">
          <Search className="h-4 w-4 text-[#8A8985]" strokeWidth={1.8} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") close(); }}
            placeholder="Move page to…"
            className="w-full bg-transparent text-[14px] text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]"
          />
        </div>
      </div>

      {/* Suggested */}
      <MenuLabel>Suggested</MenuLabel>
      {results.length > 0 ? (
        results.map((t) => {
          const isOpen = expanded.has(t.id);
          return (
            <div key={t.id}>
              <div className="flex h-8 items-center gap-0.5 rounded-md pr-1.5 transition-colors hover:bg-black/[0.05]">
                <button
                  onClick={(e) => { e.stopPropagation(); toggle(t.id); }}
                  aria-label={isOpen ? "Collapse" : "Expand"}
                  className="flex h-5 w-5 items-center justify-center rounded text-[#9B9A97] hover:bg-black/[0.06]"
                >
                  <ChevronRight
                    className={"h-3.5 w-3.5 transition-transform " + (isOpen ? "rotate-90" : "")}
                    strokeWidth={2}
                  />
                </button>
                <button
                  onClick={() => move(t.title)}
                  className="flex h-8 flex-1 items-center gap-1.5 text-left text-[14px] text-[#2C2C2B]"
                >
                  <span className="flex h-[18px] w-[18px] items-center justify-center">{t.icon}</span>
                  <span className="flex-1 truncate">{t.title}</span>
                </button>
              </div>

              {isOpen && (
                <div className="ml-5 border-l border-black/[0.06] pl-1">
                  {t.children.length > 0 ? (
                    t.children.map((c) => (
                      <button
                        key={c.title}
                        onClick={() => move(c.title)}
                        className="flex h-8 w-full items-center gap-1.5 rounded-md px-1.5 text-left text-[14px] text-[#2C2C2B] transition-colors hover:bg-black/[0.05]"
                      >
                        <span className="flex h-[18px] w-[18px] items-center justify-center">{c.icon}</span>
                        <span className="flex-1 truncate">{c.title}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-[13px] text-[#9B9A97]">No pages inside</div>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="px-2 py-2 text-[14px] text-[#9B9A97]">No results</div>
      )}

      {/* Workspace footer */}
      <div className="mt-1 border-t border-black/[0.06] pt-1">
        <button
          onClick={() => { toast("Alex Morgan’s Space"); close(); }}
          className="flex h-9 w-full items-center justify-center gap-1.5 rounded-md text-[14px] text-[#5F5E59] transition-colors hover:bg-black/[0.05]"
        >
          <span className="text-[14px] leading-none">🏠</span>
          Alex Morgan&rsquo;s Space
          <ChevronDown className="h-3.5 w-3.5 text-[#9B9A97]" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Share popover (Share / Publish)                                      */
/* ------------------------------------------------------------------ */

const ACCESS_OPTIONS = [
  { label: "Full access", desc: "Edit, suggest, comment, and share" },
  { label: "Can edit", desc: "Edit, suggest, and comment" },
  { label: "Can comment", desc: "Suggest and comment" },
  { label: "Can view", desc: "" },
  { label: "Remove", desc: "", danger: true },
];

const GENERAL_OPTIONS = [
  { label: "Only people invited", icon: <Lock className="h-4 w-4" strokeWidth={1.8} /> },
  { label: "Anyone on the web with link", icon: <Globe className="h-4 w-4" strokeWidth={1.8} /> },
];

/** A small fixed-position dropdown used inside the Share popover (access levels). */
function ShareFlyout({
  rect,
  options,
  selected,
  width = 280,
  mode = "below",
  onPick,
  onClose,
}: {
  rect: DOMRect;
  options: { label: string; desc?: string; danger?: boolean; icon?: React.ReactNode }[];
  selected: string;
  width?: number;
  mode?: "below" | "left";
  onPick: (v: string) => void;
  onClose: () => void;
}) {
  const ref = useClickOutside(onClose);
  const left = mode === "left"
    ? Math.max(8, rect.left - width - 4)
    : Math.min(rect.right - width, window.innerWidth - width - 8);
  const top = mode === "left"
    ? Math.max(8, Math.min(rect.top - 4, window.innerHeight - options.length * 34 - 16))
    : Math.min(rect.bottom + 4, window.innerHeight - options.length * 40 - 16);
  return (
    <div
      ref={ref}
      style={{ position: "fixed", top, left, width }}
      className="z-[220] overflow-hidden rounded-lg border border-black/[0.08] bg-white p-1 shadow-[0_8px_28px_rgba(0,0,0,0.2)]"
    >
      {options.map((o) => (
        <button
          key={o.label}
          onClick={() => onPick(o.label)}
          className={"flex w-full items-start gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-black/[0.05] " + (o.danger ? "text-[#D44C47]" : "text-[#37352F]")}
        >
          {o.icon && <span className="mt-0.5 flex h-4 w-4 items-center justify-center text-[#5F5E59]">{o.icon}</span>}
          <span className="min-w-0 flex-1">
            <span className="block text-[14px]">{o.label}</span>
            {o.desc && <span className="block text-[12px] text-[#9B9A97]">{o.desc}</span>}
          </span>
          {o.label === selected && <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#37352F]" strokeWidth={2} />}
        </button>
      ))}
    </div>
  );
}

function SharePopover({ close }: { close: () => void }) {
  const [tab, setTab] = useState<"share" | "publish">("share");
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState("Full access");
  const [general, setGeneral] = useState("Only people invited");
  const [sub, setSub] = useState<{ type: "access" | "general"; rect: DOMRect } | null>(null);
  const generalIcon = general === "Only people invited" ? <Lock className="h-4 w-4 text-[#5F5E59]" strokeWidth={1.8} /> : <Globe className="h-4 w-4 text-[#5F5E59]" strokeWidth={1.8} />;

  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-black/[0.07] px-1 pb-2">
        <button onClick={() => setTab("share")} className={"relative pb-1.5 text-[14px] font-medium " + (tab === "share" ? "text-[#2C2C2B]" : "text-[#9B9A97]")}>
          Share
          {tab === "share" && <span className="absolute -bottom-[9px] left-0 right-0 h-[2px] bg-[#2C2C2B]" />}
        </button>
        <button onClick={() => setTab("publish")} className={"relative pb-1.5 text-[14px] font-medium " + (tab === "publish" ? "text-[#2C2C2B]" : "text-[#9B9A97]")}>
          Publish
          {tab === "publish" && <span className="absolute -bottom-[9px] left-0 right-0 h-[2px] bg-[#2C2C2B]" />}
        </button>
      </div>

      {tab === "share" ? (
        <>
          <div className="flex items-center gap-2 px-1 pt-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or group, separated by commas"
              className="h-9 flex-1 rounded-md border border-black/[0.14] px-2.5 text-[14px] text-[#2C2C2B] outline-none focus:border-[#2383E2] placeholder:text-[#9B9A97]"
            />
            <button
              onClick={() => { if (email.trim()) { toast(`Invited ${email.trim()}`); setEmail(""); } }}
              className="flex h-9 items-center rounded-md bg-[#2383E2] px-3.5 text-[14px] font-medium text-white hover:bg-[#1a73d0]"
            >
              Share
            </button>
          </div>

          <div className="flex items-center gap-2.5 px-1 py-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E3E2E0] text-[13px] font-medium text-[#5F5E59]">A</span>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] text-[#2C2C2B]">Alex Morgan <span className="text-[#9B9A97]">(You)</span></div>
              <div className="truncate text-[12px] text-[#9B9A97]">alex.morgan@example.com</div>
            </div>
            <button
              onClick={(e) => setSub({ type: "access", rect: e.currentTarget.getBoundingClientRect() })}
              className="flex items-center gap-0.5 rounded px-1 py-0.5 text-[13px] text-[#5F5E59] hover:bg-black/[0.04] hover:text-[#2C2C2B]"
            >
              {access} <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>

          <div className="px-1 pt-1 text-[12px] font-medium text-[#9B9A97]">General access</div>
          <button
            onClick={(e) => setSub({ type: "general", rect: e.currentTarget.getBoundingClientRect() })}
            className="mt-0.5 flex w-full items-center gap-2.5 rounded-md px-1 py-1.5 transition-colors hover:bg-black/[0.03]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.05]">{generalIcon}</span>
            <span className="flex items-center gap-0.5 text-[14px] text-[#2C2C2B]">{general} <ChevronDown className="h-3.5 w-3.5 text-[#9B9A97]" strokeWidth={2} /></span>
          </button>

          <div className="mt-1 flex items-center justify-between border-t border-black/[0.06] px-1 pt-2">
            <button onClick={() => toast("Learn about sharing")} className="flex items-center gap-1.5 text-[13px] text-[#9B9A97] hover:text-[#5F5E59]">
              <HelpCircle className="h-4 w-4" strokeWidth={1.8} /> Learn about sharing
            </button>
            <button onClick={() => { toast("Copied link"); close(); }} className="flex items-center gap-1.5 text-[13px] font-medium text-[#5F5E59] hover:text-[#2C2C2B]">
              <Link2 className="h-4 w-4" strokeWidth={1.8} /> Copy link
            </button>
          </div>

          {sub?.type === "access" && (
            <ShareFlyout
              rect={sub.rect}
              options={ACCESS_OPTIONS}
              selected={access}
              onClose={() => setSub(null)}
              onPick={(v) => {
                if (v === "Remove") toast("You can’t remove yourself");
                else { setAccess(v); toast(`Access: ${v}`); }
                setSub(null);
              }}
            />
          )}
          {sub?.type === "general" && (
            <ShareFlyout
              rect={sub.rect}
              options={GENERAL_OPTIONS}
              selected={general}
              width={300}
              onClose={() => setSub(null)}
              onPick={(v) => { setGeneral(v); toast(v); setSub(null); }}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col items-center px-4 py-7 text-center">
          <Globe className="h-9 w-9 text-[#9B9A97]" strokeWidth={1.4} />
          <div className="mt-3 text-[15px] font-semibold text-[#2C2C2B]">Publish to web</div>
          <div className="mt-1 text-[13px] leading-5 text-[#787774]">Create a site, share your work with anyone, and collect responses.</div>
          <button onClick={() => { toast("Published to web"); close(); }} className="mt-4 flex h-9 items-center rounded-md bg-[#2383E2] px-4 text-[14px] font-medium text-white hover:bg-[#1a73d0]">
            Publish
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Actions menu (the "⋯" top-bar menu)                                 */
/* ------------------------------------------------------------------ */

function AItem({ icon, children, kbd, chevron, onClick }: { icon: React.ReactNode; children: React.ReactNode; kbd?: string; chevron?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] transition-colors hover:bg-black/[0.05]">
      <span className="flex h-4 w-4 items-center justify-center text-[#5F5E59]">{icon}</span>
      <span className="flex-1 truncate">{children}</span>
      {kbd && <span className="text-[12px] text-[#9B9A97]">{kbd}</span>}
      {chevron && <ChevronRight className="h-3.5 w-3.5 text-[#9B9A97]" strokeWidth={2} />}
    </button>
  );
}

function AToggle({ icon, children, on, onToggle }: { icon: React.ReactNode; children: React.ReactNode; on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] transition-colors hover:bg-black/[0.05]">
      <span className="flex h-4 w-4 items-center justify-center text-[#5F5E59]">{icon}</span>
      <span className="flex-1 truncate">{children}</span>
      <span className={"relative h-4 w-7 rounded-full transition-colors " + (on ? "bg-[#2383E2]" : "bg-black/[0.18]")}>
        <span className={"absolute top-[2px] h-3 w-3 rounded-full bg-white transition-all " + (on ? "left-[14px]" : "left-[2px]")} />
      </span>
    </button>
  );
}

const ASep = () => <div className="my-1 h-px bg-black/[0.06]" />;

function ASubItem({ icon, children, kbd, chevron, active, onOpen }: { icon: React.ReactNode; children: React.ReactNode; kbd?: string; chevron?: boolean; active?: boolean; onOpen: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <button onClick={onOpen} className={"flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] transition-colors hover:bg-black/[0.05] " + (active ? "bg-black/[0.05]" : "")}>
      <span className="flex h-4 w-4 items-center justify-center text-[#5F5E59]">{icon}</span>
      <span className="flex-1 truncate">{children}</span>
      {kbd && <span className="text-[12px] text-[#9B9A97]">{kbd}</span>}
      {chevron && <ChevronRight className="h-3.5 w-3.5 text-[#9B9A97]" strokeWidth={2} />}
    </button>
  );
}

const MOVE_OPTS = [{ label: "New page" }, { label: "Welcome to Notion" }, { label: "To Do List" }, { label: "@Today 4:07 AM" }];
const AI_OPTS = [{ label: "Summarize" }, { label: "Improve writing" }, { label: "Continue writing" }, { label: "Find action items" }, { label: "Brainstorm ideas" }, { label: "Translate" }];
const LANG_OPTS = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Portuguese"].map((l) => ({ label: l }));

function ActionsMenu({
  close,
  onTrash,
  font,
  setFont,
  smallText,
  setSmallText,
  fullWidth,
  setFullWidth,
}: {
  close: () => void;
  onTrash: () => void;
  font: string;
  setFont: (f: string) => void;
  smallText: boolean;
  setSmallText: (v: boolean) => void;
  fullWidth: boolean;
  setFullWidth: (v: boolean) => void;
}) {
  const [locked, setLocked] = useState(false);
  const [sub, setSub] = useState<{ type: "move" | "ai" | "translate"; rect: DOMRect } | null>(null);
  const done = (fn: () => void) => () => { fn(); close(); };
  const openSub = (type: "move" | "ai" | "translate") => (e: React.MouseEvent<HTMLButtonElement>) =>
    setSub({ type, rect: e.currentTarget.getBoundingClientRect() });

  return (
    <div className="max-h-[74vh] overflow-y-auto">
      {/* Search */}
      <div className="px-1 pt-0.5">
        <div className="flex h-8 items-center gap-1.5 rounded-md bg-[rgba(66,35,3,0.03)] px-2 focus-within:shadow-[inset_0_0_0_1px_#2383E2]">
          <Search className="h-4 w-4 text-[#8A8985]" strokeWidth={1.8} />
          <input placeholder="Search actions…" className="w-full bg-transparent text-[14px] text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]" />
        </div>
      </div>

      {/* Font style — actually changes the page font */}
      <div className="flex gap-2 px-1 py-2">
        {["Default", "Serif", "Mono"].map((f) => (
          <button key={f} onClick={() => { setFont(f); toast(`Font: ${f}`); }} className={"flex flex-1 flex-col items-center gap-1 rounded-md border py-1.5 transition-colors hover:bg-black/[0.03] " + (font === f ? "border-[#2383E2]" : "border-black/[0.09]")}>
            <span className={"text-[19px] leading-none " + (font === f ? "text-[#2383E2]" : "text-[#37352F]")} style={{ fontFamily: f === "Serif" ? "Georgia, serif" : f === "Mono" ? "ui-monospace, monospace" : "inherit" }}>Ag</span>
            <span className={"text-[11px] " + (font === f ? "text-[#2383E2]" : "text-[#9B9A97]")}>{f}</span>
          </button>
        ))}
      </div>

      <AItem icon={<Link2 className="h-4 w-4" strokeWidth={1.8} />} kbd="⌘⌥L" onClick={done(() => toast("Copied link"))}>Copy link</AItem>
      <AItem icon={<ClipboardCopy className="h-4 w-4" strokeWidth={1.8} />} onClick={done(() => toast("Copied page contents"))}>Copy page contents</AItem>
      <AItem icon={<Copy className="h-4 w-4" strokeWidth={1.8} />} kbd="⌘D" onClick={done(() => toast("Duplicated"))}>Duplicate</AItem>
      <ASubItem icon={<CornerUpRight className="h-4 w-4" strokeWidth={1.8} />} kbd="⌘⇧P" active={sub?.type === "move"} onOpen={openSub("move")}>Move to</ASubItem>
      <AItem icon={<Trash2 className="h-4 w-4" strokeWidth={1.8} />} onClick={done(() => { toast("Moved to Trash"); onTrash(); })}>Move to Trash</AItem>
      <ASep />
      <AToggle icon={<Baseline className="h-4 w-4" strokeWidth={1.8} />} on={smallText} onToggle={() => setSmallText(!smallText)}>Small text</AToggle>
      <AToggle icon={<MoveHorizontal className="h-4 w-4" strokeWidth={1.8} />} on={fullWidth} onToggle={() => setFullWidth(!fullWidth)}>Full width</AToggle>
      <AItem icon={<SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />} onClick={done(() => toast("Customize page"))}>Customize page</AItem>
      <ASep />
      <AToggle icon={<Lock className="h-4 w-4" strokeWidth={1.8} />} on={locked} onToggle={() => setLocked((v) => !v)}>Lock page</AToggle>
      <ASubItem icon={<NotionAiMark className="h-4 w-4 text-[#37352F]" />} chevron active={sub?.type === "ai"} onOpen={openSub("ai")}>Use with AI</ASubItem>
      <ASep />
      <AItem icon={<PencilLine className="h-4 w-4" strokeWidth={1.8} />} onClick={done(() => toast("Suggest edits"))}>Suggest edits</AItem>
      <ASubItem icon={<Languages className="h-4 w-4" strokeWidth={1.8} />} chevron active={sub?.type === "translate"} onOpen={openSub("translate")}>Translate</ASubItem>
      <ASep />
      <AItem icon={<Undo2 className="h-4 w-4" strokeWidth={1.8} />} kbd="⌘Z" onClick={done(() => toast("Undo"))}>Undo</AItem>
      <ASep />
      <AItem icon={<Download className="h-4 w-4" strokeWidth={1.8} />} onClick={done(() => toast("Import"))}>Import</AItem>
      <AItem icon={<Upload className="h-4 w-4" strokeWidth={1.8} />} onClick={done(() => toast("Export"))}>Export</AItem>
      <ASep />
      <AItem icon={<Repeat2 className="h-4 w-4" strokeWidth={1.8} />} onClick={done(() => toast("Turned into wiki"))}>Turn into wiki</AItem>

      {sub?.type === "move" && (
        <ShareFlyout rect={sub.rect} mode="left" width={240} options={MOVE_OPTS} selected="" onClose={() => setSub(null)} onPick={(v) => { toast(`Moved to ${v}`); setSub(null); close(); }} />
      )}
      {sub?.type === "ai" && (
        <ShareFlyout rect={sub.rect} mode="left" width={220} options={AI_OPTS} selected="" onClose={() => setSub(null)} onPick={(v) => { toast(v); setSub(null); close(); }} />
      )}
      {sub?.type === "translate" && (
        <ShareFlyout rect={sub.rect} mode="left" width={190} options={LANG_OPTS} selected="" onClose={() => setSub(null)} onPick={(v) => { toast(`Translate to ${v}`); setSub(null); close(); }} />
      )}
    </div>
  );
}

function TopIcon({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md text-[#5F5E59] transition-colors hover:bg-black/[0.04]"
    >
      {children}
    </button>
  );
}

function CardIcon({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md text-[#5F5E59] transition-colors hover:bg-black/[0.05]"
    >
      {children}
    </button>
  );
}
