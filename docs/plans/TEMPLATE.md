# Plan Template — canonical spec format

This is the single source of truth for what an agreed page spec looks like.
Copy everything below the rule into a new `docs/plans/<page>.md` and fill it
in. Every section must be filled or explicitly marked **N/A** (with a reason)
before the status may move to `agreed` — "we'll figure it out later" is not a
filled section.

Guidance for each section is given as italic blockquotes; delete the guidance
from the real spec and keep the headings in order. Extra sections are allowed
(page-specific domain models, interaction deep-dives) but must come *after*
Core Requirements and before Layout & Responsive Strategy, so the canonical
ordering stays scannable.

---

> Status: **draft** — one of `draft | agreed | implemented | translated`.
> While agreed, this sentence should say the spec is the single source of
> truth for the page and that deviations get reflected here first.

*What belongs here: the lifecycle status (see `docs/plans/README.md` for the
definitions) plus one line on how to treat the document. Start every new plan
at `draft`.*

## Summary

*One short paragraph: what the page is, who uses it, and what "success" looks
like on it. Then a bulleted list of the key design insights — the 3–6
decisions that shape everything below. If a later section contradicts an
insight here, one of them is wrong; fix it before agreeing.*

Example insights:

- **Single primary action** — the page has exactly one prominent control; everything else is secondary.
- **Reading-first layout** — content occupies a centred measure; navigation never competes with it.
- **Mobile-first** — the primary action is sticky and thumb-reachable on phones.

## Core Requirements

*The functional contract, as numbered/bulleted requirements. Each requirement
is testable — "the page shows the import progress" is not; "the import shows
a determinate progress bar with percentage and a cancel button" is. Where a
requirement has interacting states, capture them as a state matrix table —
this is the format reviewers and the builder both read.*

Example state matrix:

| Item selected | Upload running | Toolbar state |
|---|---|---|
| No | No | Add only; actions disabled |
| Yes | No | Add + Delete + Rename enabled |
| Yes | Yes | Add + Cancel; Delete disabled |

## Components

*One `### <component-name>` subsection per component, kebab-case, matching the
future `src/components/<name>/` directory name. For each component: its
purpose in one line; the inputs/context it expects (props, mock data, tokens
it consumes); **every** visual and interactive state — normal, hover/focus,
disabled, empty, loading, error — as a terse state list; and accessibility
notes inline (roles, keyboard behaviour, announcements) rather than deferred
to the a11y section. A component without a state list is under-specified and
must not be agreed.*

Example:

### `status-pill`

Small label communicating item state (draft / active / archived).

- Inputs: `status` string; consumes `--accent*` / `--text-muted` tokens.
- States: **Draft** (muted) / **Active** (accent) / **Archived** (low-contrast, strike-free).
- A11y: the state is carried by the text, not colour alone; decorative dot is `aria-hidden`.

## Layout & Responsive Strategy

*Mobile-first: describe the < 640px layout, then each breakpoint where
structure actually changes. Name the CSS technique for each structural swap
(`grid-template-areas` for order-preserving rearranges, container queries
when the component — not the page — should decide its own layout). Include a
text/ASCII sketch of the major layouts, and note DOM order explicitly: it
must match visual reading order at every breakpoint so focus order and screen
readers stay correct. Call out anything sticky, full-bleed, or scroll-locked.*

Example sketch convention:

```text
Desktop                          Mobile
┌───────────┬─────────┐   ┌──────────────┐
│ list      │ details │   │ list         │
│ (scroll)  │ pane    │   │ [sticky add] │
└───────────┴─────────┘   └──────────────┘
```

## Content States

*Per dynamic area: empty, loading, error, and edge cases — what renders, in
what prominence, with what copy. Empty states that need user action (invite
teammates, create first item) say so explicitly and name the most prominent
element in that state. Edge cases worth pre-deciding: very long values
(truncation strategy), duplicated names, empty-to-populated transitions,
concurrent updates, connection loss.*

## Visual Direction & Token Strategy

*Spec-level only — **no hex/oklch values here**. Describe the intended
character (calm/administrative, playful, dense/tool-like), which semantic
tokens from `tokens.css` each major element draws on (`--surface`,
`--accent`, `--danger`, …), and any contrast guardrails: text sizes and their
required ratios per theme, anything that must not rely on colour alone, and
whether disabled controls must remain readable. If the page motivates a new
theme or new semantic tokens, say so and justify it — the default is to reuse
what exists.*

## Accessibility Specification

*The page-level a11y contract: landmarks and their nesting, exactly one
`<h1>` and the heading order, live regions (what gets announced and at what
politeness — and what must *not* announce, e.g. per-item noise), focus order
and any explicit focus management (moving focus into dialogs, returning it to
triggers, focusing new content on swap), skip links, visible focus rings in
both themes, and reduced-motion behaviour for every animation named anywhere
in this spec. Component-level details live with the components; this section
is the page-wide view and the cross-check.*

## Practical Feasibility Notes

*Browser baseline (name the newest feature relied on and its fallback story),
progressive-enhancement callouts (what degrades, to what), performance notes
(anything large: data, images, fonts — and its loading strategy), and known
pitfalls worth writing down before implementation starts. If a technique is
experimental, the fallback must be usable, not broken.*

## Target-App Considerations

*What the **real application** must own for this page to work: data flow,
realtime events, races and edge cases, server-side validation, auth,
persistence. The mockup deliberately doesn't solve these — it demonstrates
the states; the wiring is the target app's job. Write the contract the target
app must satisfy (events, ordering guarantees, failure modes) and note any
race conditions the design must not preclude. This section is how the mockup
stays honest about what it faked.*

## Out of Scope

*Explicitly cut items, one line each — features discussed and deferred, seeds
rejected, anything the design should not preclude but must not include. If a
cut item has a future home, point at it (usually Extension Points below).
"Explicitly" is the point: unlisted ideas resurface as scope creep; listed
ones don't.*

## Open Questions

*Unresolved decisions, each phrased so an answer can close it. Questions that
got answered during planning move out of this list into the sections they
affected (or an inline "Resolved:" note) — this section must be empty of
blockers before the status becomes `agreed`.*

## Extension Points

*What the design leaves room for: follow-on features that slot in without
restructuring, components deliberately built to be shared across pages, and
themes/variants the token strategy makes cheap. This is the section that
justifies small structural investments made now.*
