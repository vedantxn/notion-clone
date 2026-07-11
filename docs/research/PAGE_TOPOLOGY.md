# PAGE TOPOLOGY — Notion Library / Favorites

Layout: two-column flex. Fixed left sidebar (270px, bg #F9F8F7) + main content (white, flex-1).

## Left Sidebar (270px, bg #F9F8F7, color #5F5E59 / #2C2C2B)
1. **Workspace switcher** — house emoji avatar + "Abhishek Sharma's Space" + chevron. ~14px/500.
2. **Top nav row** — Home pill (active) + icon buttons: chat, meeting/record, inbox, search.
3. **"Set up your workspace" card** — white card, rounded, subtle border/shadow; label + progress slider with a duck-emoji thumb.
4. **Agents** section — grey uppercase-ish label "Agents" + "＋ New agent" row.
5. **Private** section — label "Private" + rows: 📄 New page, 👋 Welcome to Notion, ✅ To Do List.
6. **Standalone rows** — 📚 Library (active), ❓ Help (blue dot), 🗑 Trash.
7. **Footer** — pinned bottom: "🎋 New chat  ⌘O" pill button + compose icon button.
8. **Floating bottom-right** — small circular Notion-AI logo button (overlays main content corner).

## Main Content (flex-1, white, ~96px side padding)
1. **Header row** — H1 "Library" (32px/700, #2C2C2B) on left; blue "New page" button (#2783DE) top-right.
2. **Tab bar** — Recents, Favorites (active pill), Shared, Private, AI Meeting Notes; right side: filter/sort/search/settings icons.
3. **Table header** — columns: 📄 Page name | 👤 Created by | ➤ Source | 🕐 Last edited time. Muted #7D7A75.
4. **Table body** — empty state centered: star icon + two lines of muted text.

## z-index / overlays
- Floating AI button bottom-right overlays content.
- No sticky/scroll behaviors; single static viewport.

## Build plan (components, isolated route app/notion-library/)
- `Sidebar.tsx` (workspace switcher, nav, setup card, sections, footer)
- `MainPanel.tsx` (header + tab bar + table header + empty state)
- `page.tsx` (two-column shell + floating AI button)
