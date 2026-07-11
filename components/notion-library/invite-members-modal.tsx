"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserRoundPlus, UserRound, ChevronDown } from "lucide-react";
import { useClickOutside } from "./menu";

/** "Add members" modal — opens from workspace switcher → Invite members. */
export function InviteMembersModal({ onClose }: { onClose: () => void }) {
  const [emails, setEmails] = useState("");
  const [message, setMessage] = useState("");
  const ref = useClickOutside(onClose);
  const canSend = emails.trim().length > 0;

  const send = () => {
    if (!canSend) return;
    toast.success("Invite sent");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
      <div
        ref={ref}
        className="w-[440px] max-w-[92vw] rounded-xl bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.24)]"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <UserRoundPlus className="h-6 w-6 text-[#8A8985]" strokeWidth={1.6} />
          <div className="mt-2 text-[16px] font-semibold text-[#2C2C2B]">Add members</div>
          <div className="mt-1 text-[14px] text-[#787774]">Type or paste in emails below, separated by commas</div>
        </div>

        {/* Email input */}
        <input
          autoFocus
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); if (e.key === "Escape") onClose(); }}
          placeholder="Search names or emails"
          className="mt-5 w-full rounded-md border border-[#2383E2] px-3 py-2 text-[14px] text-[#2C2C2B] shadow-[0_0_0_1px_#2383E2] outline-none placeholder:text-[#9B9A97]"
        />

        {/* Role */}
        <div className="mt-4">
          <div className="mb-1.5 text-[13px] font-medium text-[#787774]">Select role</div>
          <button
            onClick={() => toast("Select role")}
            className="flex w-full items-start gap-2.5 rounded-md border border-black/[0.12] px-3 py-2.5 text-left transition-colors hover:bg-black/[0.02]"
          >
            <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-[#8A8985]" strokeWidth={1.8} />
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-medium text-[#2C2C2B]">Workspace owner</span>
              <span className="block text-[13px] leading-5 text-[#9B9A97]">Can change workspace settings and invite new members to the workspace</span>
            </span>
            <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-[#9B9A97]" strokeWidth={2} />
          </button>
        </div>

        {/* Message */}
        <div className="mt-4">
          <div className="mb-1.5 text-[13px] font-medium text-[#787774]">Message</div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a note to your invite…"
            rows={3}
            className="w-full resize-none rounded-md border border-black/[0.12] px-3 py-2 text-[14px] text-[#2C2C2B] outline-none focus:border-[#2383E2] placeholder:text-[#9B9A97]"
          />
        </div>

        {/* Actions */}
        <button
          onClick={send}
          disabled={!canSend}
          className={
            "mt-5 flex h-9 w-full items-center justify-center rounded-md text-[14px] font-medium text-white transition-colors " +
            (canSend ? "bg-[#2383E2] hover:bg-[#1a73d0]" : "cursor-default bg-[#2383E2]/40")
          }
        >
          Send invite
        </button>
        <button
          onClick={onClose}
          className="mt-1 flex h-9 w-full items-center justify-center text-[14px] text-[#5F5E59] transition-colors hover:text-[#2C2C2B]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
