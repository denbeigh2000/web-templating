# Mini Demo — Team Directory

> Status: **agreed** — this spec is the single source of truth for the demo
> page; deviations get reflected here first. It is a worked example of the
> plan format: a short, deliberately trivial spec that shows the full plan
> → build → preview → export pipeline. Delete `examples/` once your first
> real plan lands, or keep it as reference.

## Summary

A single "team directory" page: a responsive grid of person cards showing
who is on the team and their current availability. Used here to demonstrate
the repository's conventions end-to-end; in a real project this shape fits
any card-grid-over-data page (directory, dashboard, search results).

Key insights:

- **Two components, one composition** — all structure lives in `card-grid`;
  `person-card` knows nothing about the page or the grid.
- **Status is text, not colour** — the availability pill always carries a
  readable word; the coloured dot is decorative.
- **Empty is a designed state** — an empty directory renders a call to
  action, not a blank region.
- **States via query params** — `?variant=empty` and `?variant=edge` show
  the grid's empty state and long-value truncation without extra templates.

## Core Requirements

1. The page renders a grid of person cards; each card shows an avatar
   placeholder (initials), the person's name, their role, and — when
   present — an availability status pill.
2. Status is one of `available`, `busy`, `away`, or absent. The pill always
   displays the status word as text.
3. When the people list is empty, the grid renders an empty state with a
   title and hint instead of an empty container.
4. Long names and roles truncate with an ellipsis; the full value stays in
   the DOM (title attribute) for inspection.
5. Page variants: default (mixed statuses), `?variant=empty` (no people),
   `?variant=edge` (long-name truncation).

## Components

### `person-card`

One person's identity and availability on a raised surface.

- Inputs: `person` object — `name` (string), `role` (string), `initials`
  (string, for the avatar placeholder), `status` (optional: `available` |
  `busy` | `away`). Consumes `--surface*`, `--text*`, `--accent*`,
  `--border*`, `--danger`, spacing/radius/typography tokens.
- States: **default** (no status) / **available** (accent dot) / **busy**
  (danger dot) / **away** (muted dot) / **long content** (truncating).
  The card is non-interactive in this demo; no hover/focus affordance.
- A11y: the avatar initials block is decorative (`aria-hidden`); the status
  is carried by the pill's text, never colour alone; name is a heading so
  the grid reads as a document outline.

### `card-grid`

Layout component: responsive grid of cards, plus the empty state.

- Inputs: `people` (array passed to `person-card`), `emptyTitle`,
  `emptyHint` (strings for the empty state). Consumes spacing/border
  tokens only — it owns no colours beyond surfaces.
- States: **populated** (auto-fill grid) / **empty** (sunken panel with
  title + hint).
- A11y: renders as a list (`<ul role="list">`) so screen readers announce
  the item count; the empty state is a labelled region in normal flow.

## Layout & Responsive Strategy

Mobile-first: single-column grid under 480px; above that the grid is
`repeat(auto-fill, minmax(15rem, 1fr))` — no media queries, the container
decides. Cards keep a horizontal avatar/body/pill row at every width; the
pill wraps below the body if space runs out (flex wrap).

```text
Wide (>= 3 columns)      Narrow (1 column)
┌─────┐ ┌─────┐ ┌─────┐   ┌─────┐
│card │ │card │ │card │   │card │
└─────┘ └─────┘ └─────┘   ├─────┤
┌─────┐ ┌─────┐           │card │
│card │ │card │           └─────┘
```

DOM order is page heading → grid → appendix; it matches visual and focus
order at every width. The state appendix is `inert` so its duplicate cards
are skipped by keyboard focus.

## Content States

- **Populated** — the normal grid.
- **Empty** (`?variant=empty`) — sunken panel: "No one here yet" with a
  hint that the directory fills as the mock data grows. Most prominent
  element: the empty-state title.
- **Edge** (`?variant=edge`) — one card with a very long name and role to
  demonstrate single-line ellipsis truncation; `title` attributes carry
  the full values.

No loading/error states: the mockup has no data layer (see Target-App
Considerations).

## Visual Direction & Token Strategy

Calm and administrative. Cards sit on `--surface-raised` over the page's
`--surface`, separated by `--border`; names in `--text`, roles in
`--text-muted`; the avatar placeholder uses `--accent-soft` background with
`--accent` initials. Status dots map onto existing semantics: `available`
→ `--accent`, `busy` → `--danger`, `away` → `--text-muted`. No new tokens,
no new themes. Contrast guardrails: role text uses `--text-muted`, which
the token layer already keeps above 4.5:1 against `--surface-raised` in
both light and dark; the status word never relies on the dot's colour.

## Accessibility Specification

One `<h1>` (page title), `<h2>` for the grid section, `<h3>` per card name;
appendix follows the same order. Landmarks come from the base layout
(header/nav/main/footer) plus a skip link. No live regions — nothing on
this page changes asynchronously. Focus order is DOM order; the appendix
is `inert`. No animation, so reduced motion is N/A.

## Practical Feasibility Notes

Newest feature relied on: `light-dark()` colour values from `tokens.css`
(evergreen browsers; older browsers fall back to the light values' first
channel — acceptable for a mockup). Auto-fill grid and flex truncation are
baseline. No fonts, images, or JS beyond the dev-server chrome. Pitfall to
avoid: putting `min-width: 0` only on the avatar and forgetting the body
column — the flex child needs it or the ellipsis never kicks in.

## Target-App Considerations

The real application owns the data: fetching the people list, realtime
availability changes (the status pill is the natural live-update target —
announce changes via a polite live region, not per-card), error and
loading states, and persistence. The mockup hard-codes its data with
Nunjucks `set` and deliberately solves none of this.

## Out of Scope

- Search/filtering over the directory.
- Click-through person profiles (cards are non-interactive here).
- Photos — avatars are initials placeholders by design.
- Pagination or virtualisation for large teams.

## Open Questions

None — this example is intentionally closed.

## Extension Points

`person-card` is built to be reused by any page listing people; making it
a link later only needs an `href` input. A new status simply maps a dot
colour to an existing semantic token (or motivates a new one in
`tokens.css`, not in the component). `card-grid`'s empty-state slot is
generic enough to host any "nothing yet" panel.
