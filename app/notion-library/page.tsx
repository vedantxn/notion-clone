"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sidebar, type NavKey } from "@/components/notion-library/sidebar";
import { MainPanel } from "@/components/notion-library/main-panel";
import { DocumentView } from "@/components/notion-library/document-view";
import { ChatView } from "@/components/notion-library/chat-view";
import { HomeView } from "@/components/notion-library/home-view";
import { SearchDialog } from "@/components/notion-library/search-dialog";
import { AiChatPanel } from "@/components/notion-library/ai-chat-panel";
import { NotionAiMark } from "@/components/notion-library/icons";
import { PanelLeft } from "lucide-react";

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

const NOTION_FONT =
  'ui-sans-serif, -apple-system, system-ui, "Segoe UI Variable Display", "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"';

const PLACEHOLDER: Partial<Record<NavKey, { emoji: string; title: string }>> = {
  home: { emoji: "🏠", title: "Home" },
  "new-page": { emoji: "📄", title: "New page" },
  welcome: { emoji: "👋", title: "Welcome to Notion" },
  todo: { emoji: "✅", title: "To Do List" },
  help: { emoji: "❓", title: "Help" },
  trash: { emoji: "🗑️", title: "Trash" },
};

export type OpenDoc = { title: string; kind: "meeting" | "page" | "database"; heading?: string };

export default function NotionLibraryPage() {
  const [nav, setNav] = useState<NavKey>("library");
  const [doc, setDoc] = useState<OpenDoc | null>(null);
  const [chat, setChat] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [libraryTab, setLibraryTab] = useState<"recents" | "favorites" | "shared" | "private" | "notes">("favorites");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (title: string) =>
    setFavorites((s) => {
      const next = new Set(s);
      if (next.has(title)) { next.delete(title); toast(`Removed ${title} from Favorites`); }
      else { next.add(title); toast(`Added ${title} to Favorites`); }
      return next;
    });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleNavigate(key: NavKey, label: string) {
    setNav(key);
    setDoc(null); // leaving to a nav destination closes any open doc
    setChat(false);
    if (key === "library") setLibraryTab("favorites");
    if (key !== "library" && key !== "home") toast(`Opened ${label}`);
  }

  function handleOpenLibraryTab(tab: "recents" | "favorites" | "shared" | "private" | "notes") {
    setNav("library");
    setDoc(null);
    setChat(false);
    setLibraryTab(tab);
  }

  function handleOpenDoc(d: OpenDoc) {
    setDoc(d);
    setChat(false);
  }

  function handleOpenChat() {
    setChat(true);
    setDoc(null);
  }

  const placeholder = PLACEHOLDER[nav];

  let main: React.ReactNode;
  if (chat) {
    main = <ChatView />;
  } else if (doc) {
    main = (
      <DocumentView
        title={doc.title}
        kind={doc.kind}
        heading={doc.heading}
        favorited={favorites.has(doc.title)}
        onToggleFavorite={() => toggleFavorite(doc.title)}
      />
    );
  } else if (nav === "home") {
    main = <HomeView onOpenDoc={handleOpenDoc} />;
  } else if (nav === "library") {
    main = <MainPanel key={libraryTab} initialTab={libraryTab} />;
  } else {
    main = (
      <main className="flex h-dvh flex-1 flex-col items-center justify-center bg-white text-[#2C2C2B]">
        <div className="text-[48px]">{placeholder?.emoji}</div>
        <div className="mt-3 text-[24px] font-semibold">{placeholder?.title}</div>
        <div className="mt-1 text-[14px] text-[#7D7A75]">This is the {placeholder?.title} page.</div>
      </main>
    );
  }

  return (
    <div
      className="flex h-dvh w-full overflow-hidden bg-white antialiased"
      style={{ fontFamily: NOTION_FONT }}
    >
      <Sidebar
        active={nav}
        onNavigate={handleNavigate}
        onOpenDoc={handleOpenDoc}
        activeDoc={doc?.title ?? null}
        onOpenChat={handleOpenChat}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenLibraryTab={handleOpenLibraryTab}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        collapsed={!sidebarOpen}
        onCollapse={() => setSidebarOpen(false)}
      />

      {/* Main area — gains a left gutter for the hamburger when the sidebar is collapsed */}
      <div className={"relative flex h-dvh min-w-0 flex-1 flex-col " + (!sidebarOpen ? "pl-9" : "")}>
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="absolute left-1.5 top-2.5 z-30 flex h-7 w-7 items-center justify-center rounded-md text-[#5F5E59] transition-colors hover:bg-black/[0.06]"
          >
            <PanelLeft className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
        )}
        {main}
      </div>

      {/* Right-docked Notion AI chat panel */}
      {aiOpen && (
        <AiChatPanel onClose={() => setAiOpen(false)} contextTitle={doc?.title} />
      )}

      {searchOpen && (
        <SearchDialog onClose={() => setSearchOpen(false)} onOpenDoc={handleOpenDoc} />
      )}

      {/* Floating AI button (bottom-right) — hidden while the panel is open */}
      {!aiOpen && (
        <button
          onClick={() => setAiOpen(true)}
          className="fixed bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#37352F] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-transform hover:scale-105"
          aria-label="Notion AI"
        >
          <FaceIcon className="h-[22px] w-[22px] text-[#2C2C2B]" />
        </button>
      )}
    </div>
  );
}
