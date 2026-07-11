# TrashPopover Specification

## Overview
- **Target file:** `components/notion-library/trash-popover.tsx`
- **Screenshot:** `docs/design-references/real-trash.png`
- **Interaction model:** click-driven — clicking the sidebar "Trash" row toggles this popover (NOT a page nav). Click-outside / Esc closes.

## Anchoring
- Floating panel anchored to the sidebar Trash button, opening **upward/right** from it.
- Panel rect on real site: x262 y438, **width 414px**, height ~450px (content-driven).
- In clone: position `fixed`, left ≈ sidebar left edge (~8px), bottom just above the Trash row.

## Panel (container)
- background: #FFFFFF
- borderRadius: 10px
- boxShadow: `rgba(25,25,25,0.05) 0px 20px 24px 0px, rgba(25,25,25,0.027) 0px 5px 8px 0px, rgba(42,28,0,0.07) 0px 0px 0px 1px`
- width: 414px
- padding: ~6px (top area), internal sections have their own padding
- color: #2C2C2B, font 14px/20px system stack

## Search box (top)
- background: rgba(66,35,3,0.03)  (warm light grey)
- borderRadius: 6px
- height: ~28px, padding 3px 6px
- focus ring: `inset 0 0 0 1px #2383E2, 0 0 0 1px #2383E2` (blue)
- input: 14px/20px, color #2C2C2B, placeholder "Search pages in Trash" (#9B9A97)

## Filter pills (row below search)
- Ghost buttons, 14px, color #2C2C2B, height 24px, gap ~6px, hover bg rgba(0,0,0,0.04), radius 6.
- Pill 1: person icon (BLUE #2383E2) + "Last edited by" + chevron-down. width ~141px
- Pill 2: page icon + "In" + chevron-down. width ~60px
- Pill 3: teamspace/library icon + "Teamspaces" + chevron-down. width ~134px

## Body (empty state)
- Large min-height area (~260px). Centered vertically+horizontally:
- Trash icon (lucide Trash2), ~24px, grey #B9B8B4
- "No results" — 17px/600, #2C2C2B, mt ~8

## Footer
- Top: subtle; text 12px/16px, color #7D7A75:
  "Once a page has been in Trash for 30 days, it will be automatically deleted"
- A help "?" circle icon on the right (grey), aligned to footer baseline.
- padding ~ 12px 16px.

## Behaviors
- Search input filters (no items here → always "No results" for demo; typing keeps "No results").
- Filter pills: click → toast (demo) / could open sub-menu; keep as ghost buttons with hover.
- Click outside panel or Esc → close.

## Text (verbatim)
- Placeholder: "Search pages in Trash"
- Pills: "Last edited by", "In", "Teamspaces"
- Empty: "No results"
- Footer: "Once a page has been in Trash for 30 days, it will be automatically deleted"

## Responsive
- Desktop only (Notion app). Fixed 414px panel. N/A mobile reflow.
