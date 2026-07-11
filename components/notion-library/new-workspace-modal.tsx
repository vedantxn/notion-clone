"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, X, Building2, Home, School, Plus, Link2 } from "lucide-react";
import { useClickOutside } from "./menu";

const OPTIONS = [
  { id: "work", icon: <Building2 className="h-7 w-7" strokeWidth={1.5} />, title: "For work", desc: "Track projects, company goals, meeting notes" },
  { id: "personal", icon: <Home className="h-7 w-7" strokeWidth={1.5} />, title: "For personal life", desc: "Write better, think more clearly, stay organized" },
  { id: "school", icon: <School className="h-7 w-7" strokeWidth={1.5} />, title: "For school", desc: "Keep notes, research, and tasks in one place" },
];

/**
 * Multi-step "new workspace" flow (matches Notion):
 *  - "For work"      → "Who else is on your team?" step → Continue → create
 *  - "For personal"/ "For school" → create immediately
 * Creating opens a "Getting Started" page via onCreated().
 */
export function NewWorkspaceModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [step, setStep] = useState<"select" | "team">("select");
  const [emails, setEmails] = useState<string[]>(["", "", ""]);
  const ref = useClickOutside(onClose);

  const create = () => {
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
      <div
        ref={ref}
        className="relative w-[580px] max-w-[94vw] rounded-xl bg-white px-8 pb-8 pt-6 shadow-[0_16px_48px_rgba(0,0,0,0.24)]"
      >
        {step === "select" ? (
          <>
            <button onClick={() => toast("Back")} aria-label="Back" className="absolute left-6 top-6 flex h-6 w-6 items-center justify-center text-[#5F5E59] hover:text-[#2C2C2B]">
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2} />
            </button>
            <button onClick={onClose} aria-label="Close" className="absolute right-6 top-6 flex h-6 w-6 items-center justify-center text-[#9B9A97] hover:text-[#2C2C2B]">
              <X className="h-[18px] w-[18px]" strokeWidth={2} />
            </button>

            <div className="text-center">
              <h2 className="text-[20px] font-bold text-[#2C2C2B]">What is this space for?</h2>
              <p className="mt-1.5 text-[14px] text-[#787774]">Just a few more steps to unlock your new workspace</p>
            </div>

            <div className="mt-6 space-y-3">
              {OPTIONS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => (o.id === "work" ? setStep("team") : create())}
                  className="flex w-full items-center gap-4 rounded-lg border border-black/[0.1] px-4 py-4 text-left transition-colors hover:bg-black/[0.02]"
                >
                  <span className="shrink-0 text-[#5F5E59]">{o.icon}</span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold text-[#2C2C2B]">{o.title}</span>
                    <span className="mt-0.5 block text-[13px] text-[#9B9A97]">{o.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button onClick={() => setStep("select")} aria-label="Back" className="absolute left-6 top-6 flex h-6 w-6 items-center justify-center text-[#5F5E59] hover:text-[#2C2C2B]">
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2} />
            </button>

            <div className="text-center">
              <h2 className="text-[20px] font-bold text-[#2C2C2B]">Who else is on your team?</h2>
              <p className="mt-1.5 text-[14px] text-[#787774]">Add your team members by email</p>
            </div>

            <div className="mt-6">
              <div className="mb-2 text-[13px] font-medium text-[#2C2C2B]">Invite your team</div>
              <div className="space-y-2">
                {emails.map((v, i) => (
                  <input
                    key={i}
                    value={v}
                    onChange={(e) => setEmails((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))}
                    placeholder="name@company.com"
                    className="w-full rounded-md border border-black/[0.12] px-3 py-2 text-[14px] text-[#2C2C2B] outline-none focus:border-[#2383E2] placeholder:text-[#9B9A97]"
                  />
                ))}
              </div>
              <button onClick={() => setEmails((a) => [...a, ""])} className="mt-3 flex items-center gap-1.5 text-[14px] text-[#5F5E59] hover:text-[#2C2C2B]">
                <Plus className="h-4 w-4" strokeWidth={2} />Add more or bulk invite
              </button>
              <button onClick={() => toast("Copied invite link")} className="mt-2.5 flex items-center gap-1.5 text-[14px] font-medium text-[#2383E2] hover:opacity-80">
                <Link2 className="h-4 w-4" strokeWidth={1.9} />Copy invite link
              </button>
            </div>

            <div className="my-5 h-px bg-black/[0.06]" />

            <button
              onClick={create}
              className="flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-[#2383E2] text-[14px] font-medium text-white hover:bg-[#1a73d0]"
            >
              Continue <ArrowLeft className="h-4 w-4 rotate-180" strokeWidth={2.2} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
