# BEHAVIORS — Notion Library / Favorites page

Target: https://app.notion.com/library/favorites (authenticated app shell)

## Interaction model
- **Overall:** Static desktop app shell. No page scroll on the empty Favorites view.
- **Fixed sidebar** (270px) on the left, always visible. Main content panel to the right.
- **NOT responsive:** at 390px the layout does NOT reflow — the 270px sidebar stays fixed and the
  main content simply overflows to the right (horizontal scroll). Desktop-first, no mobile breakpoint.

## Interaction sweep findings
### Tabs (Recents / Favorites / Shared / Private / AI Meeting Notes)
- **Model:** click-driven. Clicking a tab swaps the main table content (client-side route change to
  `/library/<tab>`). Favorites is active on this URL.
- **Active state:** pill background `rgba(42,28,0,0.07)`, border-radius 20px, padding 6px 12px,
  text color #2C2C2B, weight 500. Inactive tabs: transparent bg, same text color, weight 400.
- Each tab has a small leading icon (clock, star, people, lock, sparkle/notes).

### Sidebar nav
- **Home** top pill is the active/selected top-nav item: bg `rgba(42,28,0,0.07)`, radius full (9999px),
  14px/500, height 32px.
- **Library** list item is active (current page): bg `rgba(0,0,0,0.03)`, radius 6px.
- Hover on any sidebar row: subtle `rgba(0,0,0,0.03)` background appears (standard Notion hover).

### Hover states (general)
- Buttons/rows gain a faint grey wash (`rgba(0,0,0,0.03–0.06)`) on hover, transition ~20ms/instant.
- Blue "New page" button darkens slightly on hover.

### Empty state
- Centered vertically+horizontally in the table body area: outline star icon, a bold-ish line
  "Your favorite pages will appear here" (#7D7A75, 14px/500) and a sub line (14px/400, #7D7A75).

### Right toolbar (in tab row)
- Four icon buttons: filter, sort (up/down arrows), search, and sliders/settings. Icon-only, ghost buttons.

## Fonts
- System UI stack (no web font): `ui-sans-serif, -apple-system, system-ui, "Segoe UI"...`.
