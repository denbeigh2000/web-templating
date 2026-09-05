# AGENTS.md — web-templating

## Premise

This repository is a **reusable, project-agnostic development environment** for
designing web UI as framework-agnostic HTML/CSS mockups. It exists to be cloned
at the start of a new project, used to design and validate that project's UI,
and then left behind (or kept as reference) once the real application exists.

The workflow has three roles and one loop:

1. **Plan** — develop rich page design specs in `docs/plans/` via interactive
   discussion with an AI agent (the *designer* role). Specs are written in
   markdown, one file per page/view, and evolved through conversation until
   every design decision is explicit.
2. **Build** — an agent (the *builder* role) turns an agreed spec into
   component templates + CSS, previewed through a local Nunjucks dev server.
   Static, real markup — behaviour is stubbed, not faked with frameworks.
3. **Export** — `npm run build` bundles components + tokens into `dist/` for
   consumption by the real application. The target app "translates" the mockup.

Then repeat per page/flow for the life of the design phase.

## Directory conventions

- `src/components/<name>/<name>.tpl.html` + `<name>.css` — one directory per
  component. The template and stylesheet are siblings; the dev server's
  `includeComponent` global resolves `<name>/<name>.tpl.html` with a
  `<name>.tpl.html` fallback.
- `src/pages/<name>.tpl.html` — full pages, served at `/page/<name>`.
- `src/layouts/base.tpl.html` — page scaffold (header, nav, skip-link,
  styles/scripts extension points). New layout variants are siblings of it.
- `src/styles/tokens.css` — the semantic token layer (the only place raw
  colour values live). `src/styles/mockup.css` — mockup-site layout helpers
  (containers, site header/footer, skip-link).
- `public/` — dev-server chrome (main.css, main.js). This styles the mockup
  site itself, not the pages under design.
- `docs/plans/` — page design specs. `docs/agents/` — canonical agent prompts.
- `examples/` — a worked example of the full pipeline (safe to delete once a
  real plan lands, or keep as reference).
- `dist/` — build output (never committed).

## Generation rules

- **Component CSS consumes ONLY semantic tokens from `tokens.css`** — never
  raw colour values (hex/rgb/oklch/hsl). Hover/pressed/disabled variants are
  derived with `color-mix()` from semantic tokens, not hand-authored. `npm run
  check` enforces this.
- **One CSS file per component**, living next to its template. Shared
  component-agnostic rules (skip-link, focus rings, mockup chrome) belong in
  `mockup.css`, not duplicated per component.
- **Template logic stays minimal.** Nunjucks is for composition (includes,
  blocks, loops over mock data) — no business logic. Pages are static mockups
  with real markup so the target app can wire behaviour later. JavaScript is
  minimal and progressive; if an interaction can be demonstrated with pure
  HTML/CSS, it should be.
- **State variants are query params.** The dev server passes query strings
  through to page templates — use them (`/page/demo?variant=empty`) to
  represent states the spec lists, rather than separate template files.
- **Theming.** Pages opt into a theme by wrapping content in a theme class
  (e.g. `.theme-default` from `tokens.css`). Components never know which theme
  is active; they consume semantic tokens only.
- **A11y is part of the spec, not a cleanup pass.** Landmarks, heading order,
  focus order, live regions, and reduced-motion behaviour come from the plan.

## Workflow

1. Start (or continue) a planning discussion per `docs/plans/AGENTS.md`,
   producing `docs/plans/<page>.md` using `docs/plans/TEMPLATE.md`. A spec is
   not done until its status is `agreed`.
2. Hand the agreed spec to the builder role (`docs/agents/component-builder.md`)
   to implement components and pages.
3. Preview with `npm run dev` (`/page/<name>`, plus query-param state variants).
4. Export with `npm run build`; lint with `npm run check`.
5. Update the plan's status to `implemented` when the mockup matches the spec.

See `docs/plans/AGENTS.md` for the planning phase and `docs/agents/` for the
full agent prompts. `.pi/agents/` holds disposable pi-harness shims of those
prompts; `docs/agents/` is canonical.
