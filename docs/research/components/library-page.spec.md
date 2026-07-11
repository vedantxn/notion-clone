# Notion Library / Favorites — Component Spec

Isolated build. Route: `app/notion-library/page.tsx`. Components: `components/notion-library/*`.
Font: system stack (`ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif`).
No changes to existing repo code.

## Color tokens (exact, from getComputedStyle)
- Sidebar bg: `#F9F8F7` (rgb 249,248,247)
- Content bg: `#FFFFFF`
- Text primary: `#2C2C2B` (rgb 44,44,43)
- Text secondary/muted: `#7D7A75` (rgb 125,122,117)
- Sidebar item text: `#5F5E59` (rgb 95,94,89)
- Section label text: `#91918E`-ish → use `#5F5E59` at 12px
- Blue primary btn: bg `#2783DE` (rgb 39,131,222), text `#F3F9FD`
- Active tab pill bg: `rgba(42,28,0,0.07)`
- Active sidebar row bg: `rgba(0,0,0,0.03)`
- Hover row bg: `rgba(0,0,0,0.03)`

## Sidebar (width 270px, bg #F9F8F7)
- Workspace switcher: house emoji + "Abhishek Sharma's Space" (14px/400 #2C2C2B) + chevron. Row height ~40, hover bg.
- Top nav row: Home pill (active, bg rgba(42,28,0,0.07), radius 9999px, 14px/500, h32, padding-left 8) with Home icon; then ghost icon buttons: MessageSquare, monitor/record, Inbox, Search.
- "Set up your workspace" card: white bg, border ~1px rgba(0,0,0,0.08), radius 12px, padding ~12px. Title 14px/500 + a progress bar (blue fill ~15%, track light) with a small emoji thumb.
- Section label "Agents": 12px/500 #5F5E59, padding 0 8. Row "＋ New agent" (Plus icon + text 14px, #5F5E59).
- Section label "Private": 12px/500. Rows (14px, #5F5E59, h~28, radius 6, hover): 📄 New page, 👋 Welcome to Notion, ✅ To Do List.
- Standalone rows: 📚 Library (ACTIVE: bg rgba(0,0,0,0.03), 14px/500 #2C2C2B), ❓ Help (blue dot top-right of icon), 🗑 Trash.
- Footer (pinned bottom): "🎋 New chat  ⌘O" pill (white bg, border, radius 9999, h~40) flex-1 + compose icon button (square, border).

## Main panel (flex-1, white, side padding ~96px, top padding ~52px)
- Header: H1 "Library" (32px/700, line-height 38.4px, #2C2C2B) left; blue "New page" button right (14px/500, h32, padding 0 12, radius 6, bg #2783DE, color #F3F9FD).
- Tab bar (row, gap ~4, mt ~12): tabs each 14px, icon+label, padding 6px 12px, radius 20px.
  - Recents (Clock icon), Favorites (Star, ACTIVE pill bg rgba(42,28,0,0.07) 500), Shared (Users), Private (Lock), AI Meeting Notes (Sparkles/notes).
  - Right side (ml-auto): ghost icon buttons ListFilter, ArrowUpDown, Search, SlidersHorizontal.
- Table header row (border-bottom 1px rgba(0,0,0,0.08), h36, text #7D7A75 14px): columns
  - Page name (FileText icon) — flex ~1 / min 420px
  - Created by (UserCircle icon)
  - Source (arrow/Navigation icon)
  - Last edited time (Clock icon)
- Empty state (centered in body, ~mt 140): outline Star icon (~28px, #C6C4C0), line1 "Your favorite pages will appear here" (14px/500 #7D7A75), line2 "Add pages to your favorites for quick access from anywhere in your workspace" (14px/400 #7D7A75, max-width ~340, center).

## Floating
- Bottom-right circular button (~44px, white, border, shadow) with Notion-AI mark (use a small logo glyph / Sparkles).

## Interaction
- Tabs: click switches active pill (client state). Favorites default active; other tabs show their own empty state text ("Recents"→recent pages, etc.) but for the clone keep favorites content; switching just moves the pill + updates the empty-state copy.
- Hover: rows/buttons get rgba(0,0,0,0.03) wash.
- Not responsive; fixed 270 sidebar, content overflows on narrow.
