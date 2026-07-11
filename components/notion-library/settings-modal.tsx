"use client";

import { useState } from "react";
import {
  X,
  SlidersHorizontal,
  Bell,
  Mail,
  Settings2,
  Users,
  Download,
  Grid2x2,
  Network,
  Globe,
  Smile,
  Building2,
  ArrowUpCircle,
} from "lucide-react";
import { useClickOutside } from "./menu";
import { NotionAiMark } from "./icons";
import {
  PreferencesPane,
  AccountPane,
  NotificationsPane,
  MailCalendarPane,
  GeneralPane,
  PeoplePane,
  ImportPane,
  NotionAiPane,
  ConnectionsPane,
  McpPane,
  PublicPagesPane,
  EmojiPane,
  TeamspacesPane,
  UpgradePane,
} from "./settings-panes";

type Section =
  | "account" | "preferences" | "notifications" | "mail"
  | "general" | "people" | "import"
  | "ai" | "connections" | "mcp" | "public" | "emoji"
  | "teamspaces" | "upgrade";

const NAV: { group: string; items: { id: Section; label: string; icon: React.ReactNode; blue?: boolean }[] }[] = [
  {
    group: "Account",
    items: [
      { id: "account", label: "Alex Morgan", icon: <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#E3E2E0] text-[9px] font-medium text-[#5F5E59]">A</span> },
      { id: "preferences", label: "Preferences", icon: <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} /> },
      { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" strokeWidth={1.8} /> },
      { id: "mail", label: "Mail & Calendar", icon: <Mail className="h-4 w-4" strokeWidth={1.8} /> },
    ],
  },
  {
    group: "Workspace",
    items: [
      { id: "general", label: "General", icon: <Settings2 className="h-4 w-4" strokeWidth={1.8} /> },
      { id: "people", label: "People", icon: <Users className="h-4 w-4" strokeWidth={1.8} /> },
      { id: "import", label: "Import", icon: <Download className="h-4 w-4" strokeWidth={1.8} /> },
    ],
  },
  {
    group: "Features",
    items: [
      { id: "ai", label: "Notion AI", icon: <NotionAiMark className="h-4 w-4 text-[#37352F]" /> },
      { id: "connections", label: "Connections", icon: <Grid2x2 className="h-4 w-4" strokeWidth={1.8} /> },
      { id: "mcp", label: "Notion MCP", icon: <Network className="h-4 w-4" strokeWidth={1.8} /> },
      { id: "public", label: "Public pages", icon: <Globe className="h-4 w-4" strokeWidth={1.8} /> },
      { id: "emoji", label: "Emoji", icon: <Smile className="h-4 w-4" strokeWidth={1.8} /> },
    ],
  },
  {
    group: "Admin",
    items: [{ id: "teamspaces", label: "Teamspaces", icon: <Building2 className="h-4 w-4" strokeWidth={1.8} /> }],
  },
  {
    group: "Access & billing",
    items: [{ id: "upgrade", label: "Upgrade plan", icon: <ArrowUpCircle className="h-4 w-4 text-[#2383E2]" strokeWidth={1.8} />, blue: true }],
  },
];

function Pane({ section }: { section: Section }) {
  switch (section) {
    case "account": return <AccountPane />;
    case "preferences": return <PreferencesPane />;
    case "notifications": return <NotificationsPane />;
    case "mail": return <MailCalendarPane />;
    case "general": return <GeneralPane />;
    case "people": return <PeoplePane />;
    case "import": return <ImportPane />;
    case "ai": return <NotionAiPane />;
    case "connections": return <ConnectionsPane />;
    case "mcp": return <McpPane />;
    case "public": return <PublicPagesPane />;
    case "emoji": return <EmojiPane />;
    case "teamspaces": return <TeamspacesPane />;
    case "upgrade": return <UpgradePane />;
  }
}

export function SettingsModal({ onClose, initialSection }: { onClose: () => void; initialSection?: string }) {
  const [section, setSection] = useState<Section>((initialSection as Section) || "preferences");
  const ref = useClickOutside(onClose);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
      <div
        ref={ref}
        className="flex h-[840px] max-h-[92vh] w-[1150px] max-w-[94vw] overflow-hidden rounded-xl bg-white shadow-[0_16px_48px_rgba(0,0,0,0.24)]"
      >
        {/* Left nav */}
        <div className="w-[248px] shrink-0 overflow-y-auto border-r border-black/[0.06] p-3">
          {NAV.map((g) => (
            <div key={g.group} className="mb-2">
              <div className="px-2 pb-1 pt-2 text-[12px] font-medium text-[#9B9A97]">{g.group}</div>
              {g.items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => setSection(it.id)}
                  className={
                    "flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] transition-colors " +
                    (it.blue
                      ? "text-[#2383E2] hover:bg-black/[0.04]"
                      : section === it.id
                        ? "bg-black/[0.06] text-[#2C2C2B]"
                        : "text-[#37352F] hover:bg-black/[0.04]")
                  }
                >
                  <span className={it.blue ? "text-[#2383E2]" : "text-[#8A8985]"}>{it.icon}</span>
                  {it.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Right pane */}
        <div className="relative flex-1 overflow-y-auto px-14 py-10">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-md text-[#9B9A97] hover:bg-black/[0.05]"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </button>
          <Pane section={section} />
        </div>
      </div>
    </div>
  );
}
