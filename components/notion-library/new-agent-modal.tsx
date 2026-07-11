"use client";

import { toast } from "sonner";
import { Check, Clock, CreditCard } from "lucide-react";
import { useClickOutside } from "./menu";
import { NotionAiMark } from "./icons";

const STEPS = [
  { icon: <Check className="h-4 w-4 text-white" strokeWidth={3} />, filled: true, title: "Today", desc: "Full access to Notion AI and the best features in our Business Plan" },
  { icon: <Clock className="h-4 w-4 text-[#5F5E59]" strokeWidth={1.8} />, title: "Day 10", desc: "We'll remind you of your trial ending" },
  { icon: <CreditCard className="h-4 w-4 text-[#5F5E59]" strokeWidth={1.8} />, title: "Day 14", desc: "You'll review charges and decide" },
];

function FaceRow({ items }: { items: string[] }) {
  return (
    <div className="flex items-center">
      {items.map((e, i) => (
        <span key={i} className={"flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#F1F0ED] text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.12)] " + (i > 0 ? "-ml-2.5" : "")}>{e}</span>
      ))}
    </div>
  );
}

function AppRow() {
  const apps: [string, string][] = [["#4A154B", "S"], ["#000000", "G"], ["ai", ""], ["#1FA463", "D"], ["#0052CC", "J"]];
  return (
    <div className="flex items-center">
      {apps.map(([c, l], i) => (
        <span key={i} className={"flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[12px] font-bold text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] " + (i > 0 ? "-ml-2" : "")} style={{ backgroundColor: c === "ai" ? "#F1F0ED" : c }}>
          {c === "ai" ? <NotionAiMark className="h-4 w-4 text-[#37352F]" /> : l}
        </span>
      ))}
    </div>
  );
}

function Waveform() {
  const bars = [2, 4, 7, 5, 9, 6, 3, 8, 5, 2, 6, 4];
  return (
    <div className="flex items-center gap-[3px]">
      {bars.map((h, i) => <span key={i} className="w-[3px] rounded-full bg-[#9B9A97]" style={{ height: h * 3 }} />)}
    </div>
  );
}

const CARDS = [
  { title: "Custom Agents automate work for your team", illo: <FaceRow items={["🧑‍🦰", "🐤", "🧑‍💼"]} /> },
  {
    title: "Eliminate manual work with Notion AI",
    illo: (
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F0ED] text-[#37352F]"><NotionAiMark className="h-4 w-4" /></span>
        <span className="rounded-md border border-[#2383E2]/60 bg-white px-2.5 py-1.5 text-[12px] text-[#9B9A97] shadow-[0_0_0_1px_#2383E2]">Ask AI anything…</span>
      </div>
    ),
  },
  { title: "Never miss a detail with AI Meeting Notes", illo: <div className="flex items-center gap-3"><Waveform /><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F0ED] text-[16px]">🎧</span></div> },
  { title: "Answers from Slack, Github and more", illo: <AppRow /> },
];

/** Notion AI trial upsell — opens from Agents → New agent (Custom Agents need a paid plan). */
export function NewAgentModal({ onClose }: { onClose: () => void }) {
  const ref = useClickOutside(onClose);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
      <div ref={ref} className="flex w-[880px] max-w-[94vw] gap-8 rounded-2xl bg-white p-8 shadow-[0_16px_48px_rgba(0,0,0,0.24)]">
        {/* Left */}
        <div className="flex w-[320px] shrink-0 flex-col">
          <h2 className="text-[24px] font-bold leading-[1.25] text-[#2C2C2B]">Use 14 days of free Notion AI and more!</h2>

          <div className="mt-6 flex-1 space-y-5">
            {STEPS.map((s) => (
              <div key={s.title} className="flex gap-3">
                <span className={"mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full " + (s.filled ? "bg-[#2383E2]" : "bg-black/[0.05]")}>{s.icon}</span>
                <div>
                  <div className="text-[14px] font-semibold text-[#2C2C2B]">{s.title}</div>
                  <div className="mt-0.5 text-[13px] leading-5 text-[#787774]">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => { toast.success("Free trial started"); onClose(); }} className="mt-6 flex h-10 w-full items-center justify-center rounded-md bg-[#2383E2] text-[14px] font-medium text-white hover:bg-[#1a73d0]">Start free trial</button>
          <button onClick={onClose} className="mt-1 flex h-10 w-full items-center justify-center rounded-md text-[14px] font-medium text-[#5F5E59] hover:bg-black/[0.03]">Maybe later</button>
        </div>

        {/* Right 2x2 */}
        <div className="grid flex-1 grid-cols-2 gap-3">
          {CARDS.map((c) => (
            <div key={c.title} className="flex flex-col items-center justify-between rounded-xl bg-black/[0.02] p-5 text-center">
              <div className="text-[14px] font-medium leading-5 text-[#2C2C2B]">{c.title}</div>
              <div className="mt-5 flex h-14 items-center justify-center">{c.illo}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
