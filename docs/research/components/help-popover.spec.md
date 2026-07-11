# HelpPopover Specification

## Overview
- **Target file:** `components/notion-library/help-popover.tsx`
- **Screenshot:** `docs/design-references/real-help.png`
- **Interaction model:** click-driven popover from sidebar "Help" row (NOT page nav). Toggle open/close; click-outside/Esc close. Same bug-free pattern as TrashPopover (trigger wrapped / ignored by click-outside).

## Anchoring
- `fixed`, left **262px** (sidebar right edge), top aligned to the Help button top.
- Panel width **260px**, height content-driven (~269px).

## Panel
- background #FFFFFF, borderRadius 10px
- boxShadow: `rgba(25,25,25,0.05) 0 20px 24px, rgba(25,25,25,0.027) 0 5px 8px, rgba(42,28,0,0.07) 0 0 0 1px`
- padding ~6px

## Top menu items (14px/16.8px, #2C2C2B; icon grey #5F5E59; row h~28; hover bg rgba(0,0,0,0.05))
1. Documentation — book/doc icon
2. Get support — chat-bubble icon
3. More — horizontal dots icon + trailing chevron-right (submenu)

## Section label
- "What's new?" — 12px, color #7D7A75, not uppercase, padding.

## What's-new items
- Bulleted (small • dot marker, grey) rows, 14px #2C2C2B:
  - "Share Notion Workers"
  - "Notion Agents iOS app"
  - "Notion 3.6"
- "View all releases" — leading release icon (rocket/sparkle), same row style.

## Text (verbatim)
Documentation, Get support, More, What's new?, Share Notion Workers, Notion Agents iOS app, Notion 3.6, View all releases

## Behaviors
- Each item: click → toast (demo) + close.
- Click-outside / Esc → close. Re-click Help row → toggle (no bug).

## Responsive
- Desktop only. N/A mobile.
