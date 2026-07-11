"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Apple, Fingerprint, Building2 } from "lucide-react";
import { useClickOutside } from "./menu";

function GoogleG() {
  return <span className="text-[20px] font-bold leading-none" style={{ color: "#4285F4" }}>G</span>;
}

function MicrosoftSquares() {
  return (
    <span className="grid grid-cols-2 gap-[2px]">
      <span className="h-[9px] w-[9px] bg-[#F25022]" />
      <span className="h-[9px] w-[9px] bg-[#7FBA00]" />
      <span className="h-[9px] w-[9px] bg-[#00A4EF]" />
      <span className="h-[9px] w-[9px] bg-[#FFB900]" />
    </span>
  );
}

const PROVIDERS = [
  { name: "Google", icon: <GoogleG /> },
  { name: "Apple", icon: <Apple className="h-5 w-5 text-[#2C2C2B]" strokeWidth={0} fill="currentColor" /> },
  { name: "Microsoft", icon: <MicrosoftSquares /> },
  { name: "Passkey", icon: <Fingerprint className="h-5 w-5 text-[#2C2C2B]" strokeWidth={1.8} /> },
  { name: "SSO", icon: <Building2 className="h-5 w-5 text-[#2C2C2B]" strokeWidth={1.8} /> },
];

/** "Add another account" sign-in modal — opens from workspace switcher → Add account. */
export function AddAccountModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const ref = useClickOutside(onClose);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
      <div
        ref={ref}
        className="relative w-[500px] max-w-[94vw] rounded-xl bg-white px-10 pb-10 pt-4 shadow-[0_16px_48px_rgba(0,0,0,0.24)]"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-4 text-[14px] text-[#5F5E59] hover:text-[#2C2C2B]"
        >
          Cancel
        </button>

        <div className="mt-6 text-center">
          <h2 className="text-[24px] font-bold text-[#2C2C2B]">Add another account</h2>
          <p className="mx-auto mt-2 max-w-[360px] text-[14px] leading-6 text-[#787774]">
            Use Notion for something new across work or life. Your current account will stay logged in.
          </p>
        </div>

        {/* Email */}
        <div className="mt-7">
          <div className="mb-1.5 text-[13px] font-medium text-[#2C2C2B]">Email</div>
          <input
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
            placeholder="Enter your email address…"
            className="w-full rounded-md border border-[#2383E2] px-3 py-2.5 text-[14px] text-[#2C2C2B] shadow-[0_0_0_1px_#2383E2] outline-none placeholder:text-[#9B9A97]"
          />
          <div className="mt-2 text-[12px] text-[#9B9A97]">Use an organization email to easily collaborate with teammates</div>
        </div>

        <button
          onClick={() => { toast("Continue"); }}
          className="mt-4 flex h-10 w-full items-center justify-center rounded-md bg-[#2383E2] text-[14px] font-medium text-white hover:bg-[#1a73d0]"
        >
          Continue
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3 text-[13px] text-[#9B9A97]">
          <span className="h-px flex-1 bg-black/[0.08]" />
          or continue with
          <span className="h-px flex-1 bg-black/[0.08]" />
        </div>

        {/* Providers */}
        <div className="grid grid-cols-3 gap-2.5">
          {PROVIDERS.map((p) => (
            <button
              key={p.name}
              onClick={() => toast(`Continue with ${p.name}`)}
              className="flex flex-col items-center justify-center gap-2 rounded-lg border border-black/[0.12] py-4 transition-colors hover:bg-black/[0.02]"
            >
              <span className="flex h-6 items-center justify-center">{p.icon}</span>
              <span className="text-[14px] font-medium text-[#2C2C2B]">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
