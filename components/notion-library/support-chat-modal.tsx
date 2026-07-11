"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Menu, X, SendHorizontal } from "lucide-react";

/**
 * "Chat with Notion Support" modal — opens from Help → Get support.
 * Centered floating chat widget (AI-powered support chatbot), matching Notion.
 */
export function SupportChatModal({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("");

  const send = () => {
    if (!message.trim()) return;
    toast("Message sent to Notion Support");
    setMessage("");
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* click-outside backdrop (transparent, like Notion) */}
      <button
        aria-label="Close support chat"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      {/* Docked bottom-right, like the Notion support widget */}
      <div className="absolute bottom-4 right-4 flex h-[700px] max-h-[calc(100vh-32px)] w-[420px] flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.22)]">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3.5">
          <button
            onClick={() => toast("Menu")}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#5F5E59] transition-colors hover:bg-black/[0.05]"
            aria-label="Menu"
          >
            <Menu className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
          <div className="flex-1 text-[16px] font-semibold text-[#2C2C2B]">
            Chat with Notion Support
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#5F5E59] transition-colors hover:bg-black/[0.05]"
            aria-label="Close"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
        </div>

        {/* Body — centered Notion Support avatar */}
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-black">
            <NotionMark className="h-11 w-11" />
          </div>
          <div className="mt-4 text-[15px] text-[#787774]">Notion Support</div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <div className="mb-3 text-center text-[13px] text-[#9B9A97]">
            AI-powered Chatbot
          </div>
          <div className="flex items-center gap-2 rounded-[22px] border border-black/[0.12] bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Share feedback or ask a question"
              className="flex-1 bg-transparent text-[14px] text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]"
            />
            <button
              onClick={send}
              className="flex h-6 w-6 items-center justify-center text-[#9B9A97] transition-colors hover:text-[#2C2C2B]"
              aria-label="Send"
            >
              <SendHorizontal className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The Notion app-icon mark (white rounded square + "N") on the black avatar. */
function NotionMark({ className }: { className?: string }) {
  return (
    <span
      className={
        "flex items-center justify-center rounded-[9px] border-2 border-white " +
        (className ?? "")
      }
    >
      <span
        className="text-[24px] font-semibold leading-none text-white"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        N
      </span>
    </span>
  );
}
