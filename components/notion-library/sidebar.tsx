"use client";

import { useState, useLayoutEffect } from "react";
import { toast } from "sonner";
import {
  Home,
  Inbox,
  Search,
  Plus,
  FileText,
  Library,
  CircleHelp,
  Trash2,
  ChevronsUpDown,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  Hash,
  Star,
  StarOff,
  Link2,
  Copy,
  PencilLine,
  CornerUpRight,
  Repeat2,
  ArrowUpRight,
  PanelRight,
  ArrowUp,
  ArrowDown,
  EyeOff,
  Settings2,
  ChevronsLeft,
  Settings,
  LogOut,
  ArrowUpCircle,
  Mail,
  UserRoundPlus,
  Check,
  MessageSquare,
  Mic,
  Database,
  PenSquare,
  X,
  TableProperties,
} from "lucide-react";
import { Dropdown, MenuItem, MenuLabel, MenuSeparator, useClickOutside } from "./menu";
import { TrashPopover } from "./trash-popover";
import { HelpPopover } from "./help-popover";
import { SupportChatModal } from "./support-chat-modal";
import { SettingsModal } from "./settings-modal";
import { InviteMembersModal } from "./invite-members-modal";
import { AddAccountModal } from "./add-account-modal";
import { NewWorkspaceModal } from "./new-workspace-modal";
import { NewAgentModal } from "./new-agent-modal";
import { ChatPanel, MeetingsPanel, InboxPanel } from "./sidebar-panels";

function FaceIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Left Eyebrow */}
      <path d="M35 48 C37 42 45 42 47 48" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      {/* Right Eyebrow + Nose */}
      <path d="M52 48 C54 41 64 41 66 48 M52 48 C51 52 50 60 50 67 L44 71" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Eyes */}
      <circle cx="41" cy="52" r="3.5" fill="currentColor" />
      <circle cx="59" cy="52" r="3.5" fill="currentColor" />
    </svg>
  );
}

type SidebarTab = "home" | "chat" | "meetings" | "inbox";

type NavKey =
  | "home"
  | "new-page"
  | "welcome"
  | "todo"
  | "library"
  | "help"
  | "trash";

/** Metadata for the known pages (icon / kind), used by Recents / Private / Favorites. */
const PAGE_META: Record<string, { kind: "page" | "meeting" | "database"; heading?: string; icon: React.ReactNode }> = {
  "New database": { kind: "database", icon: <TableProperties className="h-[18px] w-[18px] text-[#5F5E59]" strokeWidth={1.8} /> },
  "New page": { kind: "page", icon: <FileText className="h-[18px] w-[18px]" strokeWidth={1.8} /> },
  "Welcome to Notion": { kind: "page", icon: <span className="text-[15px] leading-none">👋</span> },
  "To Do List": { kind: "page", icon: <span className="text-[15px] leading-none">✅</span> },
  "@Today 4:07 AM": { kind: "meeting", heading: "Meeting @Today", icon: <FileText className="h-[18px] w-[18px]" strokeWidth={1.8} /> },
};

/**
 * Left sidebar of the Notion Library page — pixel clone with working nav.
 */
export function Sidebar({
  active,
  onNavigate,
  onOpenDoc,
  activeDoc,
  onOpenChat,
  onOpenSearch,
  onOpenLibraryTab,
  favorites,
  onToggleFavorite,
  collapsed = false,
  onCollapse,
}: {
  active: NavKey;
  onNavigate: (key: NavKey, label: string) => void;
  onOpenDoc: (doc: { title: string; kind: "meeting" | "page" | "database"; heading?: string }) => void;
  activeDoc: string | null;
  onOpenChat: () => void;
  onOpenSearch: () => void;
  onOpenLibraryTab?: (tab: "recents" | "favorites" | "shared" | "private" | "notes") => void;
  favorites: Set<string>;
  onToggleFavorite: (title: string) => void;
  collapsed?: boolean;
  onCollapse?: () => void;
}) {
  const [trashOpen, setTrashOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<string | undefined>(undefined);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [newWsOpen, setNewWsOpen] = useState(false);
  const [newAgentOpen, setNewAgentOpen] = useState(false);
  const [tab, setTab] = useState<SidebarTab>("home");
  const [openNewNoteMenu, setOpenNewNoteMenu] = useState(false);
  const [hiddenRecents, setHiddenRecents] = useState<Set<string>>(new Set());
  const [hiddenPages, setHiddenPages] = useState<Set<string>>(new Set());
  const trashPage = (title: string) => setHiddenPages((s) => new Set(s).add(title));
  const toggleFavorite = onToggleFavorite;
  const favList = [...favorites].filter((t) => !hiddenPages.has(t));
  return (
    <div
      className={`shrink-0 transition-[width] duration-200 ease-out ${
        collapsed ? "overflow-hidden" : "overflow-visible"
      }`}
      style={{ width: collapsed ? 0 : 270 }}
    >
    <aside className="relative flex h-dvh w-[270px] flex-col bg-[#F9F8F7] text-[#5F5E59] select-none">
      {/* Workspace switcher */}
      <div className="group/ws flex items-center gap-0.5 px-2 pt-3">
        <div className="min-w-0 flex-1">
        <Dropdown
          width={260}
          trigger={(open, toggle) => (
            <button
              onClick={toggle}
              className={
                "flex h-9 w-full items-center gap-2 rounded-md px-1.5 text-left transition-colors hover:bg-black/[0.03] " +
                (open ? "bg-black/[0.04]" : "")
              }
            >
              <span className="flex h-5 w-5 items-center justify-center text-[15px] leading-none">
                🏠
              </span>
              <span className="flex-1 truncate text-[14px] font-normal text-[#2C2C2B]">
                Alex Morgan&rsquo;s Space
              </span>
              <ChevronsUpDown className="h-3.5 w-3.5 text-[#9B9A97]" strokeWidth={2} />
            </button>
          )}
        >
          {(close) => (
            <>
              {/* Workspace header */}
              <div className="flex items-center gap-2.5 px-2 py-1.5">
                <span className="text-[26px] leading-none">🏠</span>
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold text-[#2C2C2B]">Alex Morgan&rsquo;s Space</div>
                  <div className="text-[12px] text-[#9B9A97]">Free Plan · 1 member</div>
                </div>
              </div>
              <MenuSeparator />
              <MenuItem
                blue
                icon={<ArrowUpCircle className="h-4 w-4" strokeWidth={1.8} />}
                onClick={() => { setSettingsSection("upgrade"); setSettingsOpen(true); close(); }}
              >
                Upgrade
              </MenuItem>
              <MenuItem
                icon={<Settings className="h-4 w-4" strokeWidth={1.8} />}
                onClick={() => { setSettingsSection(undefined); setSettingsOpen(true); close(); }}
              >
                Settings
              </MenuItem>
              <MenuItem
                icon={<Mail className="h-4 w-4" strokeWidth={1.8} />}
                onClick={() => { setInviteOpen(true); close(); }}
              >
                Invite members
              </MenuItem>
              <MenuItem
                icon={<UserRoundPlus className="h-4 w-4" strokeWidth={1.8} />}
                onClick={() => { setAddAccountOpen(true); close(); }}
              >
                Add account
              </MenuItem>
              <MenuSeparator />
              <div className="truncate px-2 pb-1 pt-1.5 text-[12px] text-[#9B9A97]">alex.morgan@example.com</div>
              <MenuItem
                icon={<span className="text-[15px] leading-none">🏠</span>}
                trailing={<Check className="h-4 w-4 text-[#2C2C2B]" strokeWidth={2} />}
                onClick={() => { toast.success("Alex Morgan’s Space"); close(); }}
              >
                Alex Morgan&rsquo;s Space
              </MenuItem>
              <MenuItem
                blue
                icon={<Plus className="h-4 w-4" strokeWidth={2} />}
                onClick={() => { setNewWsOpen(true); close(); }}
              >
                New workspace
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                icon={<LogOut className="h-4 w-4" strokeWidth={1.8} />}
                onClick={() => { toast("Logged out"); close(); }}
              >
                Log out
              </MenuItem>
            </>
          )}
        </Dropdown>
        </div>
        <button
          onClick={onCollapse}
          aria-label="Close sidebar"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#5F5E59] opacity-100 transition hover:bg-black/[0.06]"
        >
          <ChevronsLeft className="h-[18px] w-[18px]" strokeWidth={1.9} />
        </button>
      </div>

      {/* Top nav row — tabs (Home / Chat / Meetings / Inbox) + Search */}
      <div className="flex items-center gap-1 px-2 pt-1">
        <TopTab
          label="Home"
          active={tab === "home"}
          onClick={() => { setTab("home"); onNavigate("home", "Home"); }}
          icon={<Home className="h-[18px] w-[18px]" strokeWidth={1.9} />}
        />
        <TopTab
          label="Chat"
          active={tab === "chat"}
          onClick={() => setTab("chat")}
          icon={<ChatBubbleIcon className="h-[18px] w-[18px]" />}
        />
        <TopTab
          label="Meetings"
          active={tab === "meetings"}
          onClick={() => setTab("meetings")}
          icon={<PaperMicrophoneIcon className="h-[18px] w-[18px]" />}
        />
        <TopTab
          label="Inbox"
          active={tab === "inbox"}
          onClick={() => setTab("inbox")}
          icon={<Inbox className="h-[18px] w-[18px]" strokeWidth={1.9} />}
        />
        <button
          onClick={onOpenSearch}
          aria-label="Search"
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-[#5F5E59] transition-colors hover:bg-black/[0.05]"
        >
          <Search className="h-[18px] w-[18px]" strokeWidth={1.9} />
        </button>
      </div>

      {/* Scrollable middle — switches with the active tab */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {tab === "chat" && <ChatPanel onOpenChat={onOpenChat} />}
        {tab === "meetings" && <MeetingsPanel onOpenDoc={onOpenDoc} activeDoc={activeDoc} />}
        {tab === "inbox" && <InboxPanel />}
        {tab === "home" && (
        <div className="px-2 pt-3">
        {/* Setup card */}
        <div className="mb-1 rounded-xl border border-black/[0.08] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="mb-2 text-[14px] font-medium text-[#2C2C2B]">
            Set up your workspace
          </div>
          <div className="relative h-1 w-full rounded-full bg-black/[0.06]">
            <div className="h-1 w-[15%] rounded-full bg-[#2783DE]" />
            <div className="absolute -top-[9px] left-[13%] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] text-black">
              <FaceIcon className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* Recents */}
        <div className="mt-3">
          <SectionLabel
            actions
            onOpenLibrary={() => onOpenLibraryTab?.("recents")}
            onAddPage={() => onOpenDoc({ title: "New page", kind: "page" })}
          >
            Recents
          </SectionLabel>
          {(
            [
              { title: "New database", kind: "database", icon: <TableProperties className="h-[18px] w-[18px] text-[#5F5E59]" strokeWidth={1.8} /> },
              { title: "New page", kind: "page", icon: <FileText className="h-[18px] w-[18px]" strokeWidth={1.8} /> },
              { title: "Welcome to Notion", kind: "page", icon: <span className="text-[15px] leading-none">👋</span> },
              { title: "@Today 4:07 AM", kind: "meeting", heading: "Meeting @Today", icon: <FileText className="h-[18px] w-[18px]" strokeWidth={1.8} /> },
              { title: "To Do List", kind: "page", icon: <span className="text-[15px] leading-none">✅</span> },
            ] as { title: string; kind: "page" | "meeting" | "database"; heading?: string; icon: React.ReactNode }[]
          )
            .filter((r) => !hiddenRecents.has(r.title) && !hiddenPages.has(r.title))
            .map((r) => (
              <Row
                key={r.title}
                page
                recents
                icon={r.icon}
                active={activeDoc === r.title}
                onClick={() => onOpenDoc({ title: r.title, kind: r.kind, heading: r.heading })}
                onAddPage={() => onOpenDoc({ title: "New page", kind: "page" })}
                onTrash={() => trashPage(r.title)}
                favorited={favorites.has(r.title)}
                onToggleFavorite={() => toggleFavorite(r.title)}
                onRemoveFromRecents={() => {
                  setHiddenRecents((s) => new Set(s).add(r.title));
                  toast(`Removed ${r.title} from Recents`);
                }}
              >
                {r.title}
              </Row>
            ))}
        </div>

        {/* Favorites — appears only once at least one page is favorited */}
        {favList.length > 0 && (
          <div className="mt-3">
            <SectionLabel actions onOpenLibrary={() => onOpenLibraryTab?.("favorites")} onAddPage={() => onOpenDoc({ title: "New page", kind: "page" })}>
              Favorites
            </SectionLabel>
            {favList.map((title) => {
              const meta = PAGE_META[title] ?? { kind: "page" as const, icon: <FileText className="h-[18px] w-[18px]" strokeWidth={1.8} /> };
              return (
                <Row
                  key={title}
                  page
                  icon={meta.icon}
                  active={activeDoc === title}
                  onClick={() => onOpenDoc({ title, kind: meta.kind, heading: meta.heading })}
                  onAddPage={() => onOpenDoc({ title: "New page", kind: "page" })}
                  onTrash={() => trashPage(title)}
                  favorited
                  onToggleFavorite={() => toggleFavorite(title)}
                >
                  {title}
                </Row>
              );
            })}
          </div>
        )}

        {/* Agents */}
        <div className="mt-3">
        <SectionLabel>Agents</SectionLabel>
        <Row
          icon={<Plus className="h-[18px] w-[18px]" strokeWidth={2} />}
          onClick={() => setNewAgentOpen(true)}
        >
          New agent
        </Row>
        </div>

        {/* Private */}
        <div className="mt-3">
          <SectionLabel
            actions
            sortable
            onOpenLibrary={() => onOpenLibraryTab?.("private")}
            onAddPage={() => onOpenDoc({ title: "New page", kind: "page" })}
          >
            Private
          </SectionLabel>
          {(
            [
              { title: "New database", kind: "database", icon: <TableProperties className="h-[18px] w-[18px] text-[#5F5E59]" strokeWidth={1.8} /> },
              { title: "New page", kind: "page", icon: <FileText className="h-[18px] w-[18px]" strokeWidth={1.8} /> },
              { title: "Welcome to Notion", kind: "page", icon: <span className="text-[15px] leading-none">👋</span> },
              { title: "To Do List", kind: "page", icon: <span className="text-[15px] leading-none">✅</span> },
            ] as { title: string; kind: "page" | "meeting" | "database"; heading?: string; icon: React.ReactNode }[]
          )
            .filter((r) => !hiddenPages.has(r.title))
            .map((r) => (
              <Row
                key={r.title}
                page
                icon={r.icon}
                active={activeDoc === r.title}
                onClick={() => onOpenDoc({ title: r.title, kind: r.kind, heading: r.heading })}
                onAddPage={() => onOpenDoc({ title: "New page", kind: "page" })}
                onTrash={() => trashPage(r.title)}
                favorited={favorites.has(r.title)}
                onToggleFavorite={() => toggleFavorite(r.title)}
              >
                {r.title}
              </Row>
            ))}
        </div>

        {/* Standalone rows */}
        <div className="mt-3">
          <Row
            icon={<Library className="h-[18px] w-[18px]" strokeWidth={1.8} />}
            active={active === "library"}
            onClick={() => onNavigate("library", "Library")}
          >
            Library
          </Row>
          <Row
            id="help-trigger"
            icon={
              <span className="relative">
                <CircleHelp className="h-[18px] w-[18px]" strokeWidth={1.8} />
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#2783DE]" />
              </span>
            }
            active={helpOpen}
            onClick={() => setHelpOpen((v) => !v)}
          >
            Help
          </Row>
          <Row
            id="trash-trigger"
            icon={<Trash2 className="h-[18px] w-[18px]" strokeWidth={1.8} />}
            active={trashOpen}
            onClick={() => setTrashOpen((v) => !v)}
          >
            Trash
          </Row>
        </div>
        </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-6 relative">
        <button
          onClick={onOpenChat}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white text-[14px] font-medium text-[#2C2C2B] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-black/[0.02] pl-4"
        >
          <FaceIcon className="h-4 w-4 text-[#2C2C2B]" />
          New chat
          <span className="text-[12px] text-[#9B9A97] ml-auto pr-2">⌘O</span>
        </button>
        <div className="relative">
          <button
            onClick={() => setOpenNewNoteMenu(!openNewNoteMenu)}
            aria-label="New page options"
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.08] text-[#2C2C2B] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all ${
              openNewNoteMenu ? "bg-black/[0.08] hover:bg-black/[0.12] scale-105" : "bg-white hover:bg-black/[0.02]"
            }`}
          >
            {openNewNoteMenu ? (
              <X className="h-4 w-4 text-[#2C2C2B]" strokeWidth={2} />
            ) : (
              <PenSquare className="h-[18px] w-[18px] text-[#2C2C2B]" strokeWidth={1.8} />
            )}
          </button>
          
          {openNewNoteMenu && (
            <div className="absolute left-[-12px] bottom-12 z-50 mb-1 w-[200px] rounded-xl border border-black/[0.08] bg-white p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-[#37352F] text-[14px] select-none">
              <button
                onClick={() => {
                  setOpenNewNoteMenu(false);
                  onOpenDoc?.({ title: "New page", kind: "page" });
                }}
                className="flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-left hover:bg-black/[0.04]"
              >
                <FileText className="h-[17px] w-[17px] text-[#5F5E59]" strokeWidth={1.8} />
                <span className="font-medium text-[#2C2C2B]">Page</span>
              </button>
              <button
                onClick={() => {
                  setOpenNewNoteMenu(false);
                  onOpenChat();
                }}
                className="flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-left hover:bg-black/[0.04]"
              >
                <MessageSquare className="h-[17px] w-[17px] text-[#5F5E59]" strokeWidth={1.8} />
                <span className="font-medium text-[#2C2C2B]">Chat</span>
              </button>
              <button
                onClick={() => {
                  setOpenNewNoteMenu(false);
                  onOpenDoc?.({ title: "New AI meeting note", kind: "meeting", heading: "AI Meeting Notes" });
                }}
                className="flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-left hover:bg-black/[0.04]"
              >
                <Mic className="h-[17px] w-[17px] text-[#5F5E59]" strokeWidth={1.8} />
                <span className="font-medium text-[#2C2C2B]">AI Meeting Notes</span>
              </button>
              <button
                onClick={() => {
                  setOpenNewNoteMenu(false);
                  onOpenDoc?.({ title: "New database", kind: "database" });
                }}
                className="flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-left hover:bg-black/[0.04]"
              >
                <Database className="h-[17px] w-[17px] text-[#5F5E59]" strokeWidth={1.8} />
                <span className="font-medium text-[#2C2C2B]">Database</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {openNewNoteMenu && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setOpenNewNoteMenu(false)}
        />
      )}

      {trashOpen && <TrashPopover onClose={() => setTrashOpen(false)} />}
      {helpOpen && (
        <HelpPopover
          onClose={() => setHelpOpen(false)}
          onOpenSupport={() => setSupportOpen(true)}
        />
      )}
      {supportOpen && <SupportChatModal onClose={() => setSupportOpen(false)} />}
      {settingsOpen && <SettingsModal initialSection={settingsSection} onClose={() => setSettingsOpen(false)} />}
      {inviteOpen && <InviteMembersModal onClose={() => setInviteOpen(false)} />}
      {addAccountOpen && <AddAccountModal onClose={() => setAddAccountOpen(false)} />}
      {newAgentOpen && <NewAgentModal onClose={() => setNewAgentOpen(false)} />}
      {newWsOpen && (
        <NewWorkspaceModal
          onClose={() => setNewWsOpen(false)}
          onCreated={() => {
            toast.success("Workspace created");
            onOpenDoc({ title: "Getting Started", kind: "page" });
          }}
        />
      )}
    </aside>
    </div>
  );
}

function TopTab({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={
        active
          ? "flex h-8 items-center gap-1.5 rounded-full pl-2 pr-2.5 text-[14px] font-medium text-[#2C2C2B] bg-[rgba(42,28,0,0.07)]"
          : "flex h-7 w-7 items-center justify-center rounded-md text-[#5F5E59] transition-colors hover:bg-black/[0.05]"
      }
    >
      {icon}
      {active && label}
    </button>
  );
}

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={className}
      fill="currentColor"
    >
      <path d="M16.938 9.353c0-2.97-2.539-5.54-6.545-5.697L10 3.648c-4.232 0-6.938 2.639-6.938 5.705 0 1.438.583 2.752 1.617 3.76a.63.63 0 0 1 .18.546 7.3 7.3 0 0 1-.89 2.528c1.108-.13 2.12-.614 3.01-1.344l.063-.044a.63.63 0 0 1 .505-.073 9 9 0 0 0 2.454.333l.392-.007c4.006-.158 6.545-2.728 6.545-5.699m1.25 0c0 3.803-3.234 6.766-7.747 6.948l-.44.008a10.2 10.2 0 0 1-2.485-.299c-1.349 1.022-2.985 1.62-4.826 1.428a.625.625 0 0 1-.406-1.033c.712-.817 1.096-1.737 1.284-2.642-1.116-1.197-1.756-2.733-1.756-4.41 0-3.925 3.447-6.955 8.189-6.955l.44.009c4.512.181 7.747 3.143 7.747 6.946" />
    </svg>
  );
}

function PaperMicrophoneIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={className}
      fill="currentColor"
    >
      <path d="M16.958 13.771a.625.625 0 0 1 1.028.71 4.8 4.8 0 0 1-3.326 2.033v.997h2.21a.625.625 0 0 1 0 1.25H11.2a.625.625 0 1 1 0-1.25h2.21v-.997a4.8 4.8 0 0 1-3.326-2.032.626.626 0 0 1 1.029-.711 3.55 3.55 0 0 0 2.922 1.535 3.55 3.55 0 0 0 2.923-1.535" />
      <path d="M12.535 1.239c1.174 0 2.125.951 2.125 2.125v3.032a4 4 0 0 0-.447-.053l-.178-.005q-.32 0-.625.058V3.364a.875.875 0 0 0-.875-.875h-7.5a.875.875 0 0 0-.875.875v11c0 .483.392.875.875.875h4.054c.331.47.728.891 1.178 1.25H5.035a2.125 2.125 0 0 1-2.125-2.125v-11c0-1.174.951-2.125 2.125-2.125z" />
      <path d="M14.035 7.588a2.2 2.2 0 0 1 2.2 2.2v2.52a2.2 2.2 0 0 1-4.4 0v-2.52a2.2 2.2 0 0 1 2.2-2.2m0 1.25a.95.95 0 0 0-.95.95v2.52a.95.95 0 0 0 1.9 0v-2.52a.95.95 0 0 0-.95-.95M9 6.902a.55.55 0 0 1 0 1.1H6.285a.55.55 0 0 1 0-1.1zm2.285-2.5a.55.55 0 1 1 0 1.1h-5a.55.55 0 0 1 0-1.1z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Fixed-position menu (escapes the sidebar's overflow clipping)        */
/* ------------------------------------------------------------------ */

function FixedMenu({
  anchor,
  width = 244,
  onClose,
  children,
}: {
  anchor: DOMRect;
  width?: number;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useClickOutside(onClose);
  const left = Math.min(anchor.left, window.innerWidth - width - 8);
  // Clamp the top after measuring so a tall menu near the bottom stays fully visible.
  const [top, setTop] = useState(Math.min(anchor.bottom + 4, window.innerHeight - 8));
  useLayoutEffect(() => {
    const h = ref.current?.offsetHeight ?? 0;
    setTop(Math.max(8, Math.min(anchor.bottom + 4, window.innerHeight - h - 8)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchor]);
  return (
    <div
      ref={ref}
      style={{ position: "fixed", top, left, width }}
      className="z-[200] overflow-hidden rounded-lg border border-black/[0.08] bg-white p-1 text-[#5F5E59] shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
    >
      {children}
    </div>
  );
}

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[12px] text-[#9B9A97]">{children}</span>
);

/** The page context menu that opens from a row's "⋯" (Delete, duplicate, and more…). */
function PageMenu({
  anchor,
  label,
  onClose,
  onOpen,
  onTrash,
  recents,
  onRemoveFromRecents,
  favorited,
  onToggleFavorite,
}: {
  anchor: DOMRect;
  label: string;
  onClose: () => void;
  onOpen: () => void;
  onTrash: () => void;
  recents?: boolean;
  onRemoveFromRecents?: () => void;
  favorited?: boolean;
  onToggleFavorite?: () => void;
}) {
  const [moveRect, setMoveRect] = useState<DOMRect | null>(null);
  const done = (fn: () => void) => () => { fn(); onClose(); };
  return (
    <FixedMenu anchor={anchor} onClose={onClose}>
      <MenuLabel>Page</MenuLabel>
      <MenuItem
        icon={favorited ? <StarOff className="h-4 w-4" strokeWidth={1.8} /> : <Star className="h-4 w-4" strokeWidth={1.8} />}
        onClick={done(() => onToggleFavorite?.())}
      >
        {favorited ? "Remove from Favorites" : "Add to Favorites"}
      </MenuItem>
      {recents && (
        <MenuItem icon={<EyeOff className="h-4 w-4" strokeWidth={1.8} />} onClick={done(() => onRemoveFromRecents?.())}>Remove from Recents</MenuItem>
      )}
      {recents && <MenuSeparator />}
      <MenuItem icon={<Link2 className="h-4 w-4" strokeWidth={1.8} />} onClick={done(() => toast("Copied link"))}>Copy link</MenuItem>
      <MenuItem icon={<Copy className="h-4 w-4" strokeWidth={1.8} />} trailing={<Kbd>⌘D</Kbd>} onClick={done(() => toast(`Duplicated ${label}`))}>Duplicate</MenuItem>
      <MenuItem icon={<PencilLine className="h-4 w-4" strokeWidth={1.8} />} trailing={<Kbd>⌘⇧R</Kbd>} onClick={done(() => toast("Rename"))}>Rename</MenuItem>
      <button
        onClick={(e) => setMoveRect(e.currentTarget.getBoundingClientRect())}
        className={
          "flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] transition-colors hover:bg-black/[0.05] " +
          (moveRect ? "bg-black/[0.05]" : "")
        }
      >
        <span className="flex h-4 w-4 items-center justify-center text-[#8A8985]"><CornerUpRight className="h-4 w-4" strokeWidth={1.8} /></span>
        <span className="flex-1 truncate">Move to</span>
        <Kbd>⌘⇧P</Kbd>
      </button>
      <MenuItem icon={<Trash2 className="h-4 w-4" strokeWidth={1.8} />} onClick={done(() => { toast(`Moved ${label} to Trash`); onTrash(); })}>Move to Trash</MenuItem>
      <MenuSeparator />
      <MenuItem icon={<Repeat2 className="h-4 w-4" strokeWidth={1.8} />} onClick={done(() => toast("Turned into wiki"))}>Turn into wiki</MenuItem>
      <MenuSeparator />
      <MenuItem icon={<ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />} trailing={<Kbd>⌘⇧↵</Kbd>} onClick={done(onOpen)}>Open in new tab</MenuItem>
      <MenuItem icon={<PanelRight className="h-4 w-4" strokeWidth={1.8} />} trailing={<Kbd>⌥Click</Kbd>} onClick={done(onOpen)}>Open in side peek</MenuItem>
      <MenuSeparator />
      <div className="px-2 py-1 text-[12px] leading-4 text-[#9B9A97]">
        Last edited by Alex Morgan
        <br />
        Today
      </div>

      {moveRect && (
        <MoveToPicker
          rect={moveRect}
          label={label}
          onClose={() => setMoveRect(null)}
          onPicked={onClose}
        />
      )}
    </FixedMenu>
  );
}

const MOVE_SUGGESTIONS = ["New page", "Welcome to Notion", "To Do List", "@Today 4:07 AM"];

/** The "Move page to…" picker that opens from the row menu's "Move to". */
function MoveToPicker({
  rect,
  label,
  onClose,
  onPicked,
}: {
  rect: DOMRect;
  label: string;
  onClose: () => void;
  onPicked: () => void;
}) {
  const [q, setQ] = useState("");
  const width = 264;
  let left = rect.right + 8;
  if (left + width > window.innerWidth) left = rect.left - width - 8;
  const top = Math.max(8, Math.min(rect.top - 8, window.innerHeight - 300));
  const results = MOVE_SUGGESTIONS.filter((t) => t.toLowerCase().includes(q.toLowerCase()));
  const pick = (t: string) => { toast(`Moved ${label} to ${t}`); onClose(); onPicked(); };

  return (
    <div
      style={{ position: "fixed", top, left, width }}
      className="z-[210] flex flex-col overflow-hidden rounded-lg border border-black/[0.08] bg-white p-1 shadow-[0_8px_28px_rgba(0,0,0,0.2)]"
    >
      <div className="px-1 pt-0.5">
        <div className="flex h-8 items-center gap-1.5 rounded-md bg-[rgba(66,35,3,0.03)] px-2 focus-within:shadow-[inset_0_0_0_1px_#2383E2]">
          <Search className="h-4 w-4 text-[#8A8985]" strokeWidth={1.8} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
            placeholder="Move page to…"
            className="w-full bg-transparent text-[14px] text-[#2C2C2B] outline-none placeholder:text-[#9B9A97]"
          />
        </div>
      </div>
      <div className="px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-[#9B9A97]">Suggested</div>
      {results.length > 0 ? (
        results.map((t) => (
          <button
            key={t}
            onClick={() => pick(t)}
            className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-[14px] text-[#2C2C2B] transition-colors hover:bg-black/[0.05]"
          >
            <FileText className="h-4 w-4 text-[#91918E]" strokeWidth={1.7} />
            <span className="flex-1 truncate">{t}</span>
          </button>
        ))
      ) : (
        <div className="px-2 py-2 text-[14px] text-[#9B9A97]">No results</div>
      )}
      <div className="mt-1 border-t border-black/[0.06] pt-1">
        <button
          onClick={() => pick("Alex Morgan’s Space")}
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

/** A row inside a menu that supports hover + a trailing value/chevron. */
function MRow({
  icon,
  children,
  trailing,
  onClick,
  onEnter,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
  onEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onEnter}
      className="flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[14px] text-[#37352F] transition-colors hover:bg-black/[0.05]"
    >
      <span className="flex h-4 w-4 items-center justify-center text-[#8A8985]">{icon}</span>
      <span className="flex-1 truncate">{children}</span>
      {trailing}
    </button>
  );
}

const SubValue = ({ children }: { children: React.ReactNode }) => (
  <span className="flex items-center gap-1 text-[13px] text-[#9B9A97]">
    {children}
    <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
  </span>
);

/** A flyout that lists selectable options with a checkmark on the current one. */
function Flyout({
  rect,
  options,
  selected,
  onPick,
}: {
  rect: DOMRect;
  options: string[];
  selected: string;
  onPick: (v: string) => void;
}) {
  const width = 176;
  let left = rect.right - 4;
  if (left + width > window.innerWidth) left = rect.left - width + 4;
  const top = Math.min(rect.top - 5, window.innerHeight - options.length * 32 - 16);
  return (
    <div
      style={{ position: "fixed", top, left, width }}
      className="z-[210] overflow-hidden rounded-lg border border-black/[0.08] bg-white p-1 shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
    >
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onPick(o)}
          className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-[14px] text-[#37352F] transition-colors hover:bg-black/[0.05]"
        >
          <span className="flex-1 truncate">{o}</span>
          {o === selected && <Check className="h-4 w-4 text-[#37352F]" strokeWidth={2} />}
        </button>
      ))}
    </div>
  );
}

/** The section options menu that opens from a section header "⋯" (Open menu). */
function SectionMenu({ anchor, onClose, sortable }: { anchor: DOMRect; onClose: () => void; sortable?: boolean }) {
  const [sortBy, setSortBy] = useState("Last edited");
  const [show, setShow] = useState("10 items");
  const [sub, setSub] = useState<{ type: "sort" | "show"; rect: DOMRect } | null>(null);
  const done = (fn: () => void) => () => { fn(); onClose(); };
  const openSub = (type: "sort" | "show") => (e: React.MouseEvent<HTMLButtonElement>) =>
    setSub({ type, rect: e.currentTarget.getBoundingClientRect() });

  return (
    <FixedMenu anchor={anchor} width={236} onClose={onClose}>
      {sortable && (
        <MRow icon={<ArrowUpDown className="h-4 w-4" strokeWidth={1.8} />} onEnter={openSub("sort")} trailing={<SubValue>{sortBy}</SubValue>}>Sort</MRow>
      )}
      <MRow icon={<Hash className="h-4 w-4" strokeWidth={1.8} />} onEnter={openSub("show")} trailing={<SubValue>{show.replace(" items", "")}</SubValue>}>Show</MRow>
      <MRow icon={<ArrowUp className="h-4 w-4" strokeWidth={1.8} />} onEnter={() => setSub(null)} onClick={done(() => toast("Moved up"))}>Move up</MRow>
      <MRow icon={<ArrowDown className="h-4 w-4" strokeWidth={1.8} />} onEnter={() => setSub(null)} onClick={done(() => toast("Moved down"))}>Move down</MRow>
      <MRow icon={<EyeOff className="h-4 w-4" strokeWidth={1.8} />} onEnter={() => setSub(null)} onClick={done(() => toast("Section hidden"))}>Hide section</MRow>
      <MenuSeparator />
      <MRow icon={<Settings2 className="h-4 w-4" strokeWidth={1.8} />} onEnter={() => setSub(null)} onClick={done(() => toast("Customize sidebar"))}>Customize sidebar</MRow>

      {sub?.type === "sort" && (
        <Flyout
          rect={sub.rect}
          options={["Manual", "Last edited"]}
          selected={sortBy}
          onPick={(v) => { setSortBy(v); toast(`Sorted by ${v}`); setSub(null); }}
        />
      )}
      {sub?.type === "show" && (
        <Flyout
          rect={sub.rect}
          options={["5 items", "10 items", "15 items", "20 items", "100 items"]}
          selected={show}
          onPick={(v) => { setShow(v); toast(`Show ${v}`); setSub(null); }}
        />
      )}
    </FixedMenu>
  );
}

function SectionLabel({
  children,
  actions,
  sortable,
  onOpenLibrary,
  onAddPage,
}: {
  children: React.ReactNode;
  actions?: boolean;
  sortable?: boolean;
  onOpenLibrary?: () => void;
  onAddPage?: () => void;
}) {
  const [menu, setMenu] = useState<DOMRect | null>(null);
  return (
    <div className="group/sec flex h-[26px] items-center px-2 text-[12px] font-medium text-[#91918E]">
      <span className="flex-1 truncate">{children}</span>
      {actions && (
        <span className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover/sec:opacity-100">
          <SectionIcon label="Open in Library" onClick={() => onOpenLibrary?.()}><Library className="h-[14px] w-[14px]" strokeWidth={1.8} /></SectionIcon>
          <SectionIcon label="Open menu" onClick={(e) => setMenu(e.currentTarget.getBoundingClientRect())}><MoreHorizontal className="h-[15px] w-[15px]" strokeWidth={1.9} /></SectionIcon>
          <SectionIcon label="Add a page" onClick={() => onAddPage?.()}><Plus className="h-[15px] w-[15px]" strokeWidth={2} /></SectionIcon>
        </span>
      )}
      {menu && <SectionMenu anchor={menu} sortable={sortable} onClose={() => setMenu(null)} />}
    </div>
  );
}

function SectionIcon({ label, children, onClick }: { label: string; children: React.ReactNode; onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-[22px] w-[22px] items-center justify-center rounded text-[#8A8985] transition-colors hover:bg-black/[0.06]"
    >
      {children}
    </button>
  );
}

function Row({
  icon,
  children,
  active,
  onClick,
  id,
  page,
  onAddPage,
  recents,
  onRemoveFromRecents,
  onTrash,
  favorited,
  onToggleFavorite,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  id?: string;
  page?: boolean;
  onAddPage?: () => void;
  recents?: boolean;
  onRemoveFromRecents?: () => void;
  onTrash?: () => void;
  favorited?: boolean;
  onToggleFavorite?: () => void;
}) {
  const [menu, setMenu] = useState<DOMRect | null>(null);
  const label = typeof children === "string" ? children : "Page";
  return (
    <div
      id={id}
      role="button"
      onClick={onClick}
      className={
        "group/row flex h-[30px] w-full cursor-pointer items-center gap-2 rounded-md px-2 text-left text-[14px] transition-colors " +
        (active
          ? "bg-black/[0.03] font-medium text-[#2C2C2B]"
          : "font-normal text-[#5F5E59] hover:bg-black/[0.03]")
      }
    >
      <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center text-[#8A8985]">
        {page ? (
          <>
            <span className="transition-opacity group-hover/row:opacity-0">{icon}</span>
            <button
              onClick={(e) => { e.stopPropagation(); toast("No pages inside"); }}
              aria-label="Expand"
              className="absolute inset-0 hidden items-center justify-center rounded text-[#9B9A97] hover:bg-black/[0.08] group-hover/row:flex"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </>
        ) : (
          icon
        )}
      </span>
      <span className="flex-1 truncate">{children}</span>
      {page && (
        <span className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover/row:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); setMenu(e.currentTarget.getBoundingClientRect()); }}
            aria-label="Delete, duplicate, and more…"
            className="flex h-[22px] w-[22px] items-center justify-center rounded text-[#8A8985] hover:bg-black/[0.08]"
          >
            <MoreHorizontal className="h-4 w-4" strokeWidth={1.9} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toast(`Added a page inside ${label}`); onAddPage?.(); }}
            aria-label="Add a page inside"
            className="flex h-[22px] w-[22px] items-center justify-center rounded text-[#8A8985] hover:bg-black/[0.08]"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </button>
        </span>
      )}
      {menu && (
        <PageMenu
          anchor={menu}
          label={label}
          onClose={() => setMenu(null)}
          onOpen={() => { toast(`Opened ${label}`); onClick?.(); }}
          onTrash={() => onTrash?.()}
          recents={recents}
          onRemoveFromRecents={onRemoveFromRecents}
          favorited={favorited}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </div>
  );
}

export type { NavKey };
