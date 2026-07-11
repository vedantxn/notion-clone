"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  MessageSquare,
  Check,
  FileText,
  Square,
  Inbox,
  Archive,
  Clock,
  MonitorPlay,
} from "lucide-react";
import { Dropdown, MenuLabel } from "./menu";
import { NotionAiMark } from "./icons";

function SectionLabel({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: () => void;
}) {
  return (
    <div className="flex h-[26px] items-center justify-between px-2 text-[12px] font-medium text-[#91918E]">
      <span>{children}</span>
      {action && (
        <button
          onClick={action}
          className="flex h-5 w-5 items-center justify-center rounded text-[#91918E] hover:bg-black/[0.05]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

/* ---------------- Chat ---------------- */
export function ChatPanel({ onOpenChat }: { onOpenChat: () => void }) {
  return (
    <div className="px-2 pt-3">
      <SectionLabel>Notion AI</SectionLabel>
      <div className="flex gap-3 px-2 pb-1 pt-1">
        <AgentAvatar
          label="Notion AI"
          onClick={onOpenChat}
          circle={
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#37352F] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <NotionAiMark className="h-6 w-6" />
            </span>
          }
        />
        <AgentAvatar
          label="New agent"
          onClick={() => toast("New agent")}
          circle={
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-black/[0.18] text-[#9B9A97]">
              <Plus className="h-5 w-5" strokeWidth={1.8} />
            </span>
          }
        />
      </div>

      <div className="mt-2">
        <SectionLabel action={onOpenChat}>Today</SectionLabel>
        <ThreadRow
          icon={<MessageSquare className="h-[18px] w-[18px] text-[#8A8985]" strokeWidth={1.7} />}
          title="Welcome to Notion"
          time="2h"
          onClick={onOpenChat}
        />
      </div>
    </div>
  );
}

function AgentAvatar({
  circle,
  label,
  onClick,
}: {
  circle: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="flex w-14 flex-col items-center gap-1.5">
      {circle}
      <span className="truncate text-[12px] text-[#5F5E59]">{label}</span>
    </button>
  );
}

function ThreadRow({
  icon,
  title,
  time,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  time: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-[30px] w-full items-center gap-2 rounded-md px-2 text-left text-[14px] text-[#2C2C2B] transition-colors hover:bg-black/[0.03]"
    >
      <span className="flex h-[18px] w-[18px] items-center justify-center">{icon}</span>
      <span className="flex-1 truncate">{title}</span>
      <span className="text-[12px] text-[#9B9A97]">{time}</span>
    </button>
  );
}

/* ---------------- Meetings ---------------- */
type MeetingNote = { id: string; label: string; pageTitle: string; muted: boolean };

type OpenDoc = (doc: { title: string; kind: "meeting" | "page"; heading?: string }) => void;

export function MeetingsPanel({
  onOpenDoc,
  activeDoc,
}: {
  onOpenDoc: OpenDoc;
  activeDoc: string | null;
}) {
  const [notes, setNotes] = useState<MeetingNote[]>([
    { id: "ideas", label: "Ideas session", pageTitle: "Ideas session", muted: true },
    { id: "podcast", label: "Podcast transcription", pageTitle: "Podcast transcription", muted: true },
  ]);

  const open = (n: MeetingNote) =>
    onOpenDoc({ title: n.pageTitle, kind: "meeting", heading: n.label });

  // "New AI meeting note" creates a note AND opens it — like Notion.
  // Sidebar label is "Meeting @Today"; the page title is the timestamp.
  const createNote = () => {
    const stamp = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const note: MeetingNote = {
      id: "m" + Date.now(),
      label: "Meeting @Today",
      pageTitle: `@Today ${stamp}`,
      muted: false,
    };
    setNotes((prev) => [note, ...prev]);
    open(note);
  };

  return (
    <div className="px-2 pt-3">
      <SectionLabel>Upcoming</SectionLabel>
      <TwoLineCard
        icon={
          <span className="flex h-[17px] w-[17px] items-center justify-center rounded-[3px] border border-[#4285F4] bg-white text-[9px] font-bold leading-none text-[#4285F4]">
            31
          </span>
        }
        title="Connect your calendar"
        subtitle="See all your events and start meeting notes for them."
        onClick={() => toast("Connect your calendar")}
      />
      <EventRow title="Brainstorm" time="8 – 9 AM" onClick={() => onOpenDoc({ title: "Brainstorm", kind: "meeting", heading: "Brainstorm" })} />
      <EventRow title="Project overview" time="9 – 10 AM" onClick={() => onOpenDoc({ title: "Project overview", kind: "meeting", heading: "Project overview" })} />

      <div className="mt-3">
        <SectionLabel>Today</SectionLabel>
        <TwoLineCard
          icon={<Plus className="h-[18px] w-[18px] text-[#8A8985]" strokeWidth={1.9} />}
          title="New AI meeting note"
          subtitle="Take detailed notes in your meetings without needing to type"
          onClick={createNote}
        />
        {notes.map((n) => (
          <NoteRow
            key={n.id}
            title={n.label}
            muted={n.muted}
            active={activeDoc === n.pageTitle}
            onClick={() => open(n)}
          />
        ))}
      </div>
    </div>
  );
}

function TwoLineCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-black/[0.03]"
    >
      <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-medium text-[#2C2C2B]">{title}</span>
        <span className="block text-[12px] leading-4 text-[#91918E]">{subtitle}</span>
      </span>
    </button>
  );
}

function EventRow({
  title,
  time,
  onClick,
}: {
  title: string;
  time: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-[30px] w-full items-center gap-2 rounded-md px-2 text-left transition-colors hover:bg-black/[0.03]"
    >
      <Square className="h-3.5 w-3.5 text-[#C6C4C0]" strokeWidth={1.8} />
      <span className="flex-1 truncate text-[14px] text-[#91918E]">{title}</span>
      <span className="text-[12px] text-[#91918E]">{time}</span>
    </button>
  );
}

function NoteRow({
  title,
  muted,
  active,
  onClick,
}: {
  title: string;
  muted: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex h-[30px] w-full items-center gap-2 rounded-md px-2 text-left transition-colors " +
        (active ? "bg-black/[0.04]" : "hover:bg-black/[0.03]")
      }
    >
      {muted ? (
        <FileText className="h-[18px] w-[18px] text-[#C6C4C0]" strokeWidth={1.7} />
      ) : (
        <MonitorPlay className="h-[18px] w-[18px] text-[#8A8985]" strokeWidth={1.7} />
      )}
      <span className={"flex-1 truncate text-[14px] " + (muted ? "text-[#91918E]" : "text-[#2C2C2B]")}>
        {title}
      </span>
    </button>
  );
}

/* ---------------- Inbox ---------------- */
const INBOX_FILTERS = [
  { id: "all", label: "Unread & read", icon: <Inbox className="h-[18px] w-[18px]" strokeWidth={1.7} /> },
  {
    id: "unread",
    label: "Unread",
    icon: (
      <span className="relative flex h-[18px] w-[18px] items-center justify-center">
        <Square className="h-[18px] w-[18px]" strokeWidth={1.7} />
        <span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-current" />
      </span>
    ),
  },
  { id: "archived", label: "Archived", icon: <Archive className="h-[18px] w-[18px]" strokeWidth={1.7} /> },
  { id: "workspace", label: "All workspace updates", icon: <Clock className="h-[18px] w-[18px]" strokeWidth={1.7} /> },
];

export function InboxPanel() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <Check className="h-6 w-6 text-[#B9B8B4]" strokeWidth={1.8} />
      <div className="mt-3 text-[14px] text-[#5F5E59]">You&rsquo;re all caught up</div>
      <Dropdown
        width={240}
        align="center"
        trigger={(open, toggle) => (
          <button
            onClick={toggle}
            className={
              "mt-3 flex h-7 items-center rounded-md border border-[rgba(28,19,1,0.11)] px-2 text-[14px] font-medium text-[#2C2C2B] transition-colors hover:bg-black/[0.03] " +
              (open ? "bg-black/[0.03]" : "")
            }
          >
            Edit filter
          </button>
        )}
      >
        {(close) => (
          <>
            <MenuLabel>Filter</MenuLabel>
            {INBOX_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => { setFilter(f.id); toast(`Filter: ${f.label}`); close(); }}
                className="flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#2C2C2B] transition-colors hover:bg-black/[0.05]"
              >
                <span className="flex h-[18px] w-[18px] items-center justify-center text-[#5F5E59]">
                  {f.icon}
                </span>
                <span className="flex-1 truncate">{f.label}</span>
                {filter === f.id && <Check className="h-4 w-4 text-[#2C2C2B]" strokeWidth={2} />}
              </button>
            ))}
          </>
        )}
      </Dropdown>
    </div>
  );
}
