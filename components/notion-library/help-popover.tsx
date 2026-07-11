"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  BookText,
  MessageSquareText,
  MoreHorizontal,
  ChevronRight,
  Rocket,
} from "lucide-react";
import { useClickOutside } from "./menu";

const URLS = {
  documentation: "https://www.notion.so/help",
  support: "https://www.notion.so/help/contact-us",
  releases: "https://www.notion.so/releases",
  twitter: "https://x.com/NotionHQ",
  terms: "https://www.notion.so/notion/Terms-and-Privacy-28ffdd083dc3473e9c2da6ec011b58ac",
  status: "https://status.notion.so",
};

function openUrl(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Notion "Help" popover — opens from the sidebar Help row.
 * Items open real Notion URLs in a new tab; "More" opens a right-flyout submenu.
 * Same bug-free toggle/click-outside pattern as TrashPopover.
 */
export function HelpPopover({
  onClose,
  onOpenSupport,
}: {
  onClose: () => void;
  onOpenSupport: () => void;
}) {
  const ref = useClickOutside(onClose, "#help-trigger");
  const [subOpen, setSubOpen] = useState(false);

  const go = (url: string) => {
    openUrl(url);
    onClose();
  };

  const openSupport = () => {
    onOpenSupport();
    onClose();
  };

  return (
    <div
      ref={ref}
      className="fixed left-[262px] top-[385px] z-[60] w-[260px] rounded-[10px] bg-white p-1.5 text-[14px] text-[#2C2C2B]"
      style={{
        boxShadow:
          "rgba(25,25,25,0.05) 0px 20px 24px 0px, rgba(25,25,25,0.027) 0px 5px 8px 0px, rgba(42,28,0,0.07) 0px 0px 0px 1px",
      }}
    >
      {/* Primary actions */}
      <MenuRow
        icon={<BookText className="h-[18px] w-[18px]" strokeWidth={1.7} />}
        onClick={() => go(URLS.documentation)}
      >
        Documentation
      </MenuRow>
      <MenuRow
        icon={<MessageSquareText className="h-[18px] w-[18px]" strokeWidth={1.7} />}
        onClick={openSupport}
      >
        Get support
      </MenuRow>

      {/* More — hover to open submenu */}
      <div
        className="relative"
        onMouseEnter={() => setSubOpen(true)}
        onMouseLeave={() => setSubOpen(false)}
      >
        <MenuRow
          icon={<MoreHorizontal className="h-[18px] w-[18px]" strokeWidth={1.7} />}
          trailing={<ChevronRight className="h-4 w-4 text-[#9B9A97]" strokeWidth={2} />}
          highlighted={subOpen}
        >
          More
        </MenuRow>
        {subOpen && <MoreSubmenu onNavigate={go} onClose={onClose} />}
      </div>

      {/* What's new */}
      <div className="px-2 pb-1 pt-2.5 text-[12px] font-medium text-[#7D7A75]">
        What&rsquo;s new?
      </div>
      <BulletRow onClick={() => go(URLS.releases)}>Share Notion Workers</BulletRow>
      <BulletRow onClick={() => go(URLS.releases)}>Notion Agents iOS app</BulletRow>
      <BulletRow onClick={() => go(URLS.releases)}>Notion 3.6</BulletRow>
      <MenuRow
        icon={<Rocket className="h-[18px] w-[18px]" strokeWidth={1.7} />}
        onClick={() => go(URLS.releases)}
      >
        View all releases
      </MenuRow>
    </div>
  );
}

function MoreSubmenu({
  onNavigate,
  onClose,
}: {
  onNavigate: (url: string) => void;
  onClose: () => void;
}) {
  const action = (label: string) => {
    toast(label);
    onClose();
  };
  return (
    <div
      className="absolute left-full top-0 z-[70] ml-1 w-[240px] rounded-[10px] bg-white p-1.5"
      style={{
        boxShadow:
          "rgba(25,25,25,0.05) 0px 20px 24px 0px, rgba(25,25,25,0.027) 0px 5px 8px 0px, rgba(42,28,0,0.07) 0px 0px 0px 1px",
      }}
    >
      <SubRow onClick={() => action("Keyboard shortcuts")} shortcut="⌘⌥/">
        Keyboard shortcuts
      </SubRow>
      <SubRow onClick={() => onNavigate(URLS.twitter)}>X (formerly Twitter)</SubRow>
      <SubRow onClick={() => onNavigate(URLS.terms)}>Terms &amp; privacy</SubRow>
      <SubRow onClick={() => onNavigate(URLS.status)}>Status</SubRow>
      <SubRow onClick={() => action("Local backups")}>Local backups</SubRow>
      <SubRow onClick={() => action("Clearing page cache…")}>Clear page cache</SubRow>
      <div className="mt-1 border-t border-black/[0.06] px-2 pb-0.5 pt-2 text-[12px] leading-4 text-[#9B9A97]">
        <div>Notion 3.5.23.13.20260710.1700</div>
        <div>Updated 3 hours ago</div>
      </div>
    </div>
  );
}

function MenuRow({
  icon,
  children,
  trailing,
  onClick,
  highlighted,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
  highlighted?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#2C2C2B] transition-colors hover:bg-black/[0.05] " +
        (highlighted ? "bg-black/[0.05]" : "")
      }
    >
      <span className="flex h-[18px] w-[18px] items-center justify-center text-[#5F5E59]">
        {icon}
      </span>
      <span className="flex-1 truncate">{children}</span>
      {trailing}
    </button>
  );
}

function SubRow({
  children,
  onClick,
  shortcut,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  shortcut?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#2C2C2B] transition-colors hover:bg-black/[0.05]"
    >
      <span className="flex-1 truncate">{children}</span>
      {shortcut && <span className="text-[12px] text-[#9B9A97]">{shortcut}</span>}
    </button>
  );
}

function BulletRow({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#2C2C2B] transition-colors hover:bg-black/[0.05]"
    >
      <span className="flex h-[18px] w-[18px] items-center justify-center">
        <span className="h-[5px] w-[5px] rounded-full bg-[#B9B8B4]" />
      </span>
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
}
