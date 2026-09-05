# docs/agents/ — Agent prompts

Canonical, harness-agnostic agent prompts for this repository's workflow:

- `web-designer.md` — the designer role: facilitates a planning discussion and
  writes the spec in `docs/plans/<page>.md`. Reads files, writes nothing but
  the spec.
- `component-builder.md` — the builder role: implements an `agreed` spec as
  components and pages in `src/`.

These files have no YAML frontmatter and no harness-specific tool names in the
body, so they can be loaded by any harness (pi, Claude Code, a plain chat
paste, etc.).

`.pi/agents/` contains disposable pi-harness shims of these prompts (full body
inline with pi YAML frontmatter). It is an adapter layer, not a source of
truth — **`docs/agents/` is canonical**. If the two disagree, fix the shim (or
delete it) and keep editing here.
