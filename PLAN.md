# PLAN.md — Build the `web-templating` template repository

You are an agent executing this plan in the repository it lives in (`~/dev/web-templating`, currently empty except for `.git`). Work through the phases in order. The plan is self-contained: everything you need is here.

## Premise

This repository is a **reusable, project-agnostic development environment** for designing web UI as framework-agnostic HTML/CSS mockups, with this workflow:

1. Clone the repo for a new project.
2. Develop rich page design specs in `docs/plans/` via interactive discussion with an AI agent ("designer" role).
3. Generate HTML component templates + CSS from those specs with an agent ("builder" role), using a local Nunjucks dev server to preview.
4. Export the components for consumption by the real application.
5. Repeat for the next project.

The workflow and its conventions were proven in a real project (`/Users/denbeigh/dev/wikirace-designs` — a WikiRace game mockup repo). That repo is the **source** you will harvest generic machinery from. It is NOT being exported wholesale: it is becoming a real product of its own, and it contains project-specific content (Wikipedia game mockups) that must not appear here.

## Ground rules

- **Commit regularly.** After every numbered step (and any meaningful sub-step), `git add` and commit with a terse imperative message, ≤50 chars (e.g. `scaffold dev server`, `add plan template`). Do not batch multiple phases into one commit.
- **No WikiRace content.** Do not copy any WikiRace page, plan, component, fixture, or theme palette into this repo. Machinery, conventions, and *architecture* are fair game; content and branding are not.
- **Don't modify the source repo.** `/Users/denbeigh/dev/wikirace-designs` is read-only for you.
- **Stay framework-agnostic.** Vanilla HTML/CSS + Nunjucks for composition only. No framework lock-in, no build pipeline beyond what's specified.
- **Project-agnostic everything.** Any name, brand, palette, or domain concept from WikiRace must be replaced with something neutral (the repo name, "the demo", a neutral palette).
- If a decision genuinely isn't covered here, make the boring choice and note it in the commit message body — don't stop to ask.

## Final target structure

```
web-templating/
├── PLAN.md                    # this file (leave in place when done)
├── README.md                  # clone-and-go guide
├── package.json
├── .gitignore
├── .envrc                     # optional but included (user uses nix)
├── shell.nix
├── AGENTS.md                  # root agent instructions (generic)
├── docs/
│   ├── plans/
│   │   ├── README.md          # plan lifecycle + status table
│   │   ├── AGENTS.md          # how to run a planning discussion
│   │   └── TEMPLATE.md        # the canonical spec format
│   └── agents/
│       ├── web-designer.md    # canonical, harness-agnostic designer prompt
│       └── component-builder.md
├── .pi/agents/                # pi harness shims (thin frontmatter + body)
├── src/
│   ├── server/index.js        # express + nunjucks dev server
│   ├── build.js               # generic exporter → dist/
│   ├── styles/
│   │   ├── tokens.css         # token architecture w/ neutral default palette
│   │   └── mockup.css         # mockup-site layout helpers
│   ├── layouts/base.tpl.html
│   ├── components/            # seeded by the example (phase 6)
│   └── pages/index.tpl.html
│       pages/demo.tpl.html    # example page (phase 6)
├── examples/mini-demo.md      # worked example of a plan (phase 6)
├── tools/check-tokens.js      # conformance lint (phase 7)
└── public/
    ├── css/main.css
    └── js/main.js
```

## Source repo reference

Source: `/Users/denbeigh/dev/wikirace-designs`. Key paths you'll read from:

- `src/server/index.js` — dev server (copy + genericize)
- `src/styles/tokens.css` — token architecture (copy the *strategy*, replace the palette)
- `src/styles/mockup.css` — mockup-site helpers (copy + review)
- `src/layouts/base.tpl.html` — page scaffold (copy + de-brand)
- `public/css/main.css`, `public/js/main.js` — site chrome (copy + de-brand)
- `.gitignore` — copy verbatim
- `docs/plans/lobby.md`, `docs/plans/game.md`, `docs/plans/postgame.md` — read these to understand the spec *format*; do not copy their content
- `~/.pi/agent/agents/web-designer.md` — designer agent prompt (copy + adapt, phase 5)

---

## Phase 0 — Init

1. `git init` is already done. Create `.gitignore` copied verbatim from the source repo. Commit: `init gitignore`.
2. Create `shell.nix` with a minimal mkShell (nodejs only — the source's typescript/beautifulsoup4 were for its wiki-specific build). Create `.envrc` containing `use nix`. Commit: `add nix shell`.

## Phase 1 — Dev server scaffold

Copy machinery from the source, then genericize:

1. `package.json`: new — name `web-templating`, description "Framework-agnostic HTML/CSS mockup environment with reusable components and Nunjucks templating". Scripts: `dev` → `nodemon src/server/index.js`, `start` → `node src/server/index.js`, `build` → `node src/build.js` (phase 4 implements this). Dependencies: `express`, `nunjucks`; devDependencies: `nodemon`. Nothing else — no linkedom/postcss (those were the source repo's wiki-fixture tooling). `npm install`. Commit: `scaffold package`.
2. `src/server/index.js`: copy from source, then edit:
   - Remove the `/fixtures` static route and its comment entirely.
   - De-brand all user-facing strings ("WikiRace dev server" → "Web templating dev server", titles, etc.).
   - Keep: the nunjucks multi-path configure, `includeComponent` global with the `<name>/<name>.tpl.html` + `<name>.tpl.html` fallback convention (this convention is core — preserve exactly, including the SafeString trust comment), `includeCSS`/`includeJS` globals, the static mounts for `public/`, `src/styles` at `/css`, and `src/components` at `/css/components`, the `/page/:name` route (including query passing — state variants via query string are a general-purpose feature), and the `/health` endpoint.
   - The `/` route renders `index.tpl.html`. Commit: `add dev server`.
3. `src/layouts/base.tpl.html`: copy from source and de-brand — title becomes `{{ title }}`, the logo/link text becomes a neutral `Web Templating` or reads from a variable, the nav links become `Home` plus links to any pages you create later (start with just Home). Preserve the `skip-link`, the `{% block styles %}` / `{% block scripts %}` extension points, and the overall structure. Commit: `add base layout`.
4. `public/css/main.css`: copy from source, replace the header comment with a neutral one ("Web Templating — mockup-site chrome: scaffold styles for the dev server itself; page themes live in src/styles/"). The variable set inside is generic — keep it. `public/js/main.js`: copy as-is after a quick read; if it contains anything project-specific, strip that (keep whatever trivial behaviour it has). Commit: `add site chrome`.
5. `src/pages/index.tpl.html`: write fresh — a simple index extending base layout, listing available pages (initially just the demo once it exists), with a short blurb about the workflow. Commit: `add index page`.

Verify: `npm run dev` serves `/` without errors. Kill it. Commit any fixups.

## Phase 2 — Token architecture

1. `src/styles/tokens.css`: read the source file first. **Copy the architecture, not the palette.** The file's header comment documents the strategy — keep that documentation (reworded to be repo-neutral, drop the WikiRace/lobby.md reference):
   - Semantic tokens declared as OKLCH `light-dark()` pairs; "system" theme is the default via `color-scheme: light dark`; explicit themes are one rule (`html { color-scheme: light }` etc.).
   - Components consume ONLY the semantic layer; hover/pressed/disabled derived with `color-mix()`, never hand-authored.
   - Layer is self-contained (spacing/radius/typography included) so components + tokens export as a unit.
   Then write a **neutral default palette** (slate/grey surfaces, a blue primary accent, a secondary accent of your choice — ordinary, not themed) with the same token names and structure as the source: `--surface`, `--surface-raised`, `--surface-sunken`, `--text`, `--text-muted`, `--border`, `--border-strong`, `--accent`, `--accent-ink`, `--accent-soft`, `--accent-secondary*`, `--danger`, the derived `--accent-hover`/`--accent-active`/etc. via `color-mix()`, plus the spacing/radius/typography tokens from the source file. Wrap in a `.theme-default` class (mirroring how the source scopes `.theme-warm` so pages opt into a theme). Commit: `add token architecture`.
2. `src/styles/mockup.css`: copy from source; review and strip any WikiRace-specific rules, keeping the generic mockup-site layout helpers (containers, skip-link, site header/footer). Commit: `add mockup helpers`.

## Phase 3 — Docs: workflow, plans, template

This is the heart of the template repo. Read the three plan docs in the source (`docs/plans/lobby.md`, `game.md`, `postgame.md`) to absorb the format, then write:

1. **Root `AGENTS.md`** (generic — this replaces the source's WikiRace-specific one):
   - The premise section from this plan's "Premise", written for future agents working in a clone.
   - Conventions: components in `src/components/<name>/<name>.tpl.html` + `<name>.css`; pages in `src/pages/`; layouts in `src/layouts/`; shared styles in `src/styles/`; plans in `docs/plans/`.
   - Generation rules: component CSS consumes ONLY semantic tokens from `tokens.css`; per-component CSS files; template logic stays minimal (Nunjucks for composition, no business logic); static mockups — real markup so the target app can wire behaviour, minimal JS.
   - Workflow: how the phases fit together (plan → build → export), pointing at `docs/plans/AGENTS.md` and `docs/agents/`.
   - Commit: `add root agents guide`.
2. **`docs/plans/TEMPLATE.md`** — the canonical spec format. Derive the section list from the source plans (they evolved past any template; treat them as ground truth for what an agreed spec looks like). Required sections, in order:
   - `> Status: draft | agreed | implemented | translated` blockquote header
   - **Summary** — what the page is, key design insights as a bullet list
   - **Core Requirements** — numbered/bulleted functional requirements, including any state matrices as tables
   - **Components** — one `### <component-name>` per component: purpose, inputs/context it expects, every visual/interactive state, a11y notes inline
   - **Layout & Responsive Strategy** — mobile-first breakpoints, CSS technique callouts (`grid-template-areas`, container queries), a text sketch of the layouts, DOM-order/focus-order notes
   - **Content States** — empty/loading/error/locked/edge cases per dynamic area
   - **Visual Direction & Token Strategy** — spec-level only, no hex/oklch values; which semantic tokens are involved, contrast guardrails
   - **Accessibility Specification** — landmarks, heading order, live regions, focus order, reduced motion
   - **Practical Feasibility Notes** — browser baseline, progressive enhancement, pitfalls
   - **Target-App Considerations** — what the real application must own (data flow, realtime, races/edge cases); the mockup deliberately doesn't solve these
   - **Out of Scope** — explicitly cut items
   - **Open Questions** — unresolved decisions
   - **Extension Points** — what the design leaves room for
   Commit: `add plan template`.
3. **`docs/plans/README.md`** — the lifecycle: statuses `draft → agreed → implemented (mockup) → translated (real app)`, one line each defining the transition; plus a status table listing plans (empty except a placeholder row) that the user maintains. Commit: `add plans readme`.
4. **`docs/plans/AGENTS.md`** — instructions for the agent running a planning discussion. Cover: how to facilitate (probe goals/users/constraints/visual direction before proposing; see the designer agent in `docs/agents/web-designer.md`); write the spec incrementally into `docs/plans/<page>.md` starting at `Status: draft`; every section in TEMPLATE.md must be filled or explicitly marked N/A before the status moves to `agreed`; push back on under-specification (components without states, colours without contrast pairs, interactions without keyboard behaviour); once agreed, hand off to the builder role. Commit: `add planning guide`.

## Phase 4 — Export build step

1. `src/build.js`: write fresh. A deterministic, dependency-free Node script (fs + path only):
   - For each directory in `src/components/` that contains `<name>.tpl.html`, copy `<name>.tpl.html` and `<name>.css` (if present) to `dist/components/<name>/`.
   - Copy `src/styles/tokens.css` to `dist/tokens.css`.
   - Write `dist/manifest.json`: `{ generatedAt, components: [{ name, html, css?, }], tokens: "tokens.css" }`.
   - Log a summary (component count, output dir). Same input → same output (the only nondeterminism allowed is `generatedAt`).
   Commit: `add export build`.
2. Add a `check` script to package.json wiring up phase 7's lint (do this now, implement in phase 7): `"check": "node tools/check-tokens.js"`. Commit: `wire up check script`.

Verify `npm run build` runs clean on the empty components dir (prints 0 components, creates dist/). Add `dist/` to `.gitignore`. Commit if needed.

## Phase 5 — Agent prompts

1. **`docs/agents/web-designer.md`** — the canonical designer prompt. Source: `~/.pi/agent/agents/web-designer.md`. Adapt:
   - Replace the pi YAML frontmatter with a short prose header: title, one-paragraph description, and a note that it needs file read/search access and writes nothing but the spec. No YAML — this file must be loadable by any harness (pi, Claude Code, or pasted into a plain chat).
   - Keep the three-phase process (Understand → Explore Trade-offs → Specify), the tone section, the domain knowledge section, and the "What You Don't Do" section largely intact — they're the value.
   - **Delete the embedded Phase 3 spec template** (the `## Feature: ...` skeleton with its technique list). Replace it with: "Produce the spec using the format defined in `docs/plans/TEMPLATE.md` in this repository — that template is the single source of truth for what an agreed spec looks like." (Keep the modern-CSS technique inventory from the old template as a standalone reference section at the bottom of the file — it's good domain knowledge the designer uses during trade-off discussions.)
   - Add a "Workflow contract" section (clearly marked as repo-specific): in this repository, specs are written to `docs/plans/<page>.md`, status starts at `draft`, facilitation guidance lives in `docs/plans/AGENTS.md`, a spec isn't done until every TEMPLATE.md section is filled or marked N/A, and the designer never writes implementation code.
   Commit: `add designer agent`.
2. **`docs/agents/component-builder.md`** — write fresh. The implementer role:
   - Input: one or more `Status: agreed` plans in `docs/plans/`.
   - Output: components in `src/components/` per root AGENTS.md conventions, pages composed in `src/pages/`, layouts where needed.
   - Rules: implement exactly what the spec says — no redesigning, no unrequested features; consume only semantic tokens; build all listed states (mockup state variants live in the page templates, selected via query string per the server's convention); if the spec has a gap, stop and raise it rather than guessing; on completion, update the plan's Status to `implemented`.
   - Same prose-header treatment as the designer (no YAML frontmatter).
   Commit: `add builder agent`.
3. **`.pi/agents/` shims** — thin pi-specific wrappers: YAML frontmatter (`name`, `description`, `tools`) + a one-line pointer is NOT enough (pi agents need the body inline), so each shim is the full body of its canonical doc with pi-appropriate tool names in frontmatter. Designer: `read, grep, find, ls`. Builder: `read, write, edit, bash, grep, find, ls`. If the exact tool names error when loaded, adjust to pi's current vocabulary. Add a note in `docs/agents/` (a short README or a comment in each file) that `.pi/agents/` is a disposable adapter layer and `docs/agents/` is canonical. Commit: `add pi agent shims`.

## Phase 6 — Worked example

A tiny, fresh example demonstrating the full pipeline — written from scratch, NOT copied from WikiRace:

1. `examples/mini-demo.md` — a short plan document in the TEMPLATE.md format (all sections, but brief — this is a demo, maybe 1–2 pages of markdown) for a trivial "team directory" page: a `person-card` component (avatar placeholder, name, role, optional status pill) and a `card-grid` layout component, one demo page showing both. Status: `agreed`. Commit: `add example plan`.
2. Implement it: `src/components/person-card/`, `src/components/card-grid/`, `src/pages/demo.tpl.html` extending base layout, importing `tokens.css` + `mockup.css` + the two component stylesheets, wrapped in a `.theme-default` div. Realistic mock data via Nunjucks `set`. All states from the plan represented (use `?variant=` query params for state variants, per server convention). Commit: `add demo components and page`.
3. Wire the demo into the base layout nav and the index page's page list. Commit: `wire demo into nav`.

Verify `/page/demo` renders correctly in the dev server, then `npm run build` and confirm the manifest lists both components. Commit fixups.

## Phase 7 — Conformance lint

1. `tools/check-tokens.js`: a small Node script that scans `src/components/**/*.css` for raw colour values outside the token layer — hex literals, `rgb(`/`rgba(`, `oklch(`, `light-dark(`, and `hsl(`. Exceptions: none — component CSS must reference tokens (including derived ones) only. Fails with file/line/rule output on violation; exits 0 and prints a pass summary otherwise. Commit: `add token lint`.
2. Run `npm run check` — must pass on the demo components. Commit fixups if it catches anything (then fix the components, not the lint).

## Phase 8 — README and closeout

1. `README.md`: the clone-and-go guide — premise (short), workflow diagram (plan → build → export → translate), directory conventions table, the workflow as numbered steps for a new project (clone → discuss plans per docs/plans/AGENTS.md → run builder per docs/agents/ → npm run dev to preview → npm run build to export → npm run check), a "wiring agents into your harness" note pointing at docs/agents/ (canonical) with .pi/agents/ as the worked example, and a note that a fresh clone should delete examples/ once its first real plan lands (or keep it as reference). Commit: `add readme`.
2. Final verification sweep, fixing anything found (commit fixes separately):
   - `npm run dev`: `/`, `/page/demo`, `/health` all work; no WikiRace strings anywhere (`grep -ri wikirace .` excluding PLAN.md, node_modules, .git — PLAN.md may mention the source repo).
   - `npm run build` + `npm run check` both pass clean.
   - `git log --oneline` reads as a sensible terse history.
3. Leave PLAN.md in place — it documents how this repo was built.

---

## Completion criteria

- Fresh `git clone` + `npm install` + `npm run dev` serves the index and demo pages.
- `npm run build` produces `dist/` with per-component bundles + manifest; `npm run check` passes.
- `docs/plans/TEMPLATE.md` + `docs/plans/AGENTS.md` are complete enough that an agent could run a planning discussion on a new project without further context.
- `docs/agents/` prompts are harness-agnostic (no YAML frontmatter, no harness-specific tool names in the body).
- Nothing WikiRace-specific is present anywhere except as historical reference inside PLAN.md.
