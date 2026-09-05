# web-templating

A reusable, project-agnostic development environment for designing web UI as
framework-agnostic HTML/CSS mockups. Clone it at the start of a new project,
design the UI here with AI-agent assistance, then export the components for
consumption by your real application.

There is no framework here — just real HTML and CSS, Nunjucks for composition
only, a local dev server for preview, and a token architecture that keeps
component styles semantic. The target application "translates" the mockup into
its own stack.

## Workflow

```
 plan ──────► build ──────► preview ──────► export ──────► translate
(docs/plans/)  (src/)       (npm run dev)   (npm run       (real app
 via designer  via builder                  build)         consumes
 agent)        agent                                       dist/)
```

## Directory conventions

| Path | Purpose |
|---|---|
| `docs/plans/` | Page design specs. One markdown file per page, per `TEMPLATE.md`. |
| `docs/agents/` | Canonical, harness-agnostic agent prompts (designer, builder). |
| `.pi/agents/` | Disposable pi-harness shims of the canonical prompts. |
| `src/components/<name>/` | One directory per component: `<name>.tpl.html` + `<name>.css`. |
| `src/pages/` | Full mockup pages, served at `/page/<name>`. |
| `src/layouts/` | Page scaffolds. `base.tpl.html` is the root. |
| `src/styles/tokens.css` | Semantic token layer — the only place raw colour values live. |
| `src/styles/mockup.css` | Shared mockup-site helpers (containers, skip-link, chrome). |
| `src/server/` | The Nunjucks dev server (`npm run dev`). |
| `src/build.js` | The export build → `dist/` (`npm run build`). |
| `examples/` | A worked example of the full pipeline. |
| `public/` | Dev-server chrome (styles the mockup site itself, not your pages). |
| `dist/` | Build output (gitignored). |

## Using it for a new project

1. **Clone** this repo as the starting point for your design phase.
2. **Plan** — for each page/view, run a planning discussion per
   `docs/plans/AGENTS.md` (using the designer prompt from `docs/agents/`)
   until `docs/plans/<page>.md` reaches `Status: agreed`.
3. **Build** — hand the agreed spec to the builder prompt
   (`docs/agents/component-builder.md`) to produce components and pages in
   `src/`.
4. **Preview** — `npm run dev`, then open `/page/<name>`. State variants from
   the spec are represented as query params, e.g. `/page/demo?variant=empty`.
5. **Export** — `npm run build` bundles components + tokens into `dist/`.
6. **Check** — `npm run check` lints component CSS for raw colour values;
   everything must consume semantic tokens from `src/styles/tokens.css`.
7. **Translate** — the target application consumes `dist/` and re-expresses
   the markup in its own stack. Mark plans `translated` as they land there.

## Wiring agents into your harness

`docs/agents/` is the canonical source of agent prompts; they are plain
markdown with no YAML frontmatter and no harness-specific tool names, so they
can be loaded by pi, Claude Code, or pasted into a plain chat.

`.pi/agents/` shows the worked example of adapting them for a specific harness
(thin YAML frontmatter + full body inline). Treat it as disposable — if it
drifts from `docs/agents/`, fix or delete it.

## Once the first real plan lands

`examples/` exists to demonstrate the pipeline end-to-end. Once your first
real plan is agreed and implemented, delete `examples/` (and the demo page's
nav entry) — or keep it as reference. Same for `PLAN.md`, which documents how
this repository itself was built.
