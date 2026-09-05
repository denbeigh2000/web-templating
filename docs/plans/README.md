# Plans

Design specs for the pages/views of the product being designed. One markdown
file per page, written against `TEMPLATE.md` through a planning discussion
(see `AGENTS.md` in this directory).

## Lifecycle

Plans move through four statuses, recorded in the blockquote at the top of
each file:

- **draft** — the spec is being written/iterated during the planning
  discussion. Sections may be incomplete; nothing downstream may consume it.
- **agreed** — every TEMPLATE.md section is filled or explicitly N/A and the
  discussion has converged. The spec is now the single source of truth for
  the page; deviations get reflected here first. Ready for the builder role.
- **implemented (mockup)** — the builder has produced the components/pages
  and the mockup matches the spec. Query-param state variants cover the
  spec's state lists.
- **translated (real app)** — the target application has implemented the
  design; the plan is retained as reference for what was agreed and why.

## Status table

| Plan | Status | Notes |
|---|---|---|
| *(example: `settings.md`)* | *(draft)* | *(one-line note, e.g. "awaiting decision on notification model")* |
