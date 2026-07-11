"use client";

import { toast } from "sonner";
import { Clock, BookOpen, Calendar, Plus, Play, Video } from "lucide-react";

type OpenDoc = (doc: { title: string; kind: "meeting" | "page"; heading?: string }) => void;

const RECENTS = [
  { icon: <span className="text-[22px]">✅</span>, title: "To Do List", time: "2h ago" },
  { icon: <span className="text-[22px]">👋</span>, title: "Welcome to Notion", time: "2h ago" },
  { icon: <FileGlyph />, title: "New page", time: "2h ago" },
];

const LEARN = [
  { title: "What is a block?", meta: "2m read", play: false, bg: "#EFEAE2", emoji: "🧱" },
  { title: "Create your first page", meta: "2m watch", play: true, bg: "#E7EDF2", emoji: "📄" },
  { title: "Create a subpage", meta: "2m read", play: false, bg: "#EDE9E4", emoji: "🗂️" },
  { title: "Customize & style content", meta: "9m read", play: false, bg: "#F1E9EE", emoji: "🎨" },
];

const EVENTS = [
  { day: "Today", date: "Jul 11", title: "Team standup", time: "9 AM · Office", join: true },
  { day: "Sun", date: "Jul 12", title: "Project check-in", time: "10 AM · Office", join: false },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function HomeView({ onOpenDoc }: { onOpenDoc: OpenDoc }) {
  return (
    <main className="flex h-dvh flex-1 flex-col overflow-y-auto bg-white">
      <div className="mx-auto w-full max-w-[960px] px-10 pb-24 pt-14">
        <h1 className="text-center text-[32px] font-bold text-[#2C2C2B]">{greeting()}</h1>

        {/* Recently visited */}
        <SectionHeader icon={<Clock className="h-4 w-4" strokeWidth={1.8} />}>
          Recently visited
        </SectionHeader>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {RECENTS.map((r) => (
            <button
              key={r.title}
              onClick={() => onOpenDoc({ title: r.title, kind: "page" })}
              className="flex h-[132px] w-[172px] shrink-0 flex-col rounded-lg border border-black/[0.08] bg-white p-3 text-left transition-colors hover:bg-black/[0.02]"
            >
              <div className="flex h-8 items-start">{r.icon}</div>
              <div className="mt-auto">
                <div className="truncate text-[14px] font-medium text-[#2C2C2B]">{r.title}</div>
                <div className="mt-1.5 flex items-center gap-1 text-[12px] text-[#9B9A97]">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#E3E2E0] text-[9px] font-medium text-[#5F5E59]">A</span>
                  {r.time}
                </div>
              </div>
            </button>
          ))}
          <button
            onClick={() => onOpenDoc({ title: "New page", kind: "page" })}
            className="flex h-[132px] w-[172px] shrink-0 flex-col items-start justify-start rounded-lg border border-dashed border-black/[0.12] bg-white p-3 text-left text-[#9B9A97] transition-colors hover:bg-black/[0.02]"
          >
            <Plus className="h-6 w-6" strokeWidth={1.7} />
            <div className="mt-auto text-[14px] font-medium text-[#9B9A97]">New page</div>
          </button>
        </div>

        {/* Learn */}
        <SectionHeader icon={<BookOpen className="h-4 w-4" strokeWidth={1.8} />}>Learn</SectionHeader>
        <div className="flex gap-4 overflow-x-auto pb-1">
          {LEARN.map((l) => (
            <button
              key={l.title}
              onClick={() => toast(l.title)}
              className="flex w-[230px] shrink-0 flex-col overflow-hidden rounded-xl border border-black/[0.08] bg-white text-left transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
            >
              <div className="flex h-[130px] items-center justify-center text-[40px]" style={{ backgroundColor: l.bg }}>
                {l.emoji}
              </div>
              <div className="px-3.5 py-3">
                <div className="text-[15px] font-medium text-[#2C2C2B]">{l.title}</div>
                <div className="mt-2 flex items-center gap-1.5 text-[13px] text-[#9B9A97]">
                  {l.play ? <Play className="h-3.5 w-3.5" strokeWidth={1.8} /> : <BookOpen className="h-3.5 w-3.5" strokeWidth={1.8} />}
                  {l.meta}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Upcoming events */}
        <SectionHeader icon={<Calendar className="h-4 w-4" strokeWidth={1.8} />}>Upcoming events</SectionHeader>
        <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-xl border border-black/[0.08]">
          {/* Left promo */}
          <div className="flex flex-col justify-center border-r border-black/[0.06] p-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.04] text-[#8A8985]">
              <Calendar className="h-5 w-5" strokeWidth={1.7} />
            </span>
            <div className="mt-3 text-[16px] font-semibold text-[#2C2C2B]">
              Connect AI Meeting Notes with your Calendar events
            </div>
            <p className="mt-1.5 text-[14px] leading-6 text-[#787774]">
              Join calls, transcribe audio, and summarize meetings all in Notion.
            </p>
            <button
              onClick={() => toast("Connect calendar")}
              className="mt-4 flex h-8 w-fit items-center rounded-md bg-[#2383E2] px-3 text-[14px] font-medium text-white hover:bg-[#1a73d0]"
            >
              Connect calendar
            </button>
          </div>
          {/* Right event list */}
          <div className="p-3">
            {EVENTS.map((e) => (
              <div key={e.title} className="flex gap-3 rounded-lg px-3 py-2.5">
                <div className="w-12 shrink-0 text-[13px] leading-tight text-[#9B9A97]">
                  <div>{e.day}</div>
                  <div>{e.date}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-medium text-[#2C2C2B]">{e.title}</div>
                  <div className="text-[13px] text-[#9B9A97]">{e.time}</div>
                  {e.join && (
                    <button
                      onClick={() => toast("Join and take notes")}
                      className="mt-2 flex h-7 items-center gap-1.5 rounded-md bg-black/[0.05] px-2 text-[13px] font-medium text-[#5F5E59] hover:bg-black/[0.08]"
                    >
                      <Video className="h-3.5 w-3.5" strokeWidth={1.8} />
                      Join and take notes
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function SectionHeader({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-3 mt-9 flex items-center gap-1.5 text-[14px] font-medium text-[#7D7A75]">
      {icon}
      {children}
    </div>
  );
}

function FileGlyph() {
  return (
    <span className="flex h-6 w-5 flex-col rounded-sm border border-[#C6C4C0] bg-white">
      <span className="mt-1 ml-1 h-0.5 w-2.5 bg-[#D9D8D5]" />
      <span className="mt-1 ml-1 h-0.5 w-2 bg-[#D9D8D5]" />
    </span>
  );
}
