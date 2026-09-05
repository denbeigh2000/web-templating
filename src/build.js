#!/usr/bin/env node
/**
 * Export build: bundles components + tokens into dist/ for consumption by
 * the target application.
 *
 * - Each src/components/<name>/ containing <name>.tpl.html is copied to
 *   dist/components/<name>/ (template + stylesheet, if present).
 * - src/styles/tokens.css is copied to dist/tokens.css.
 * - dist/manifest.json describes the export.
 *
 * Dependency-free (fs + path only). Deterministic: same input produces the
 * same output, with `generatedAt` the only exception.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const componentsDir = path.join(root, 'src', 'components');
const tokensSrc = path.join(root, 'src', 'styles', 'tokens.css');
const distDir = path.join(root, 'dist');

function copy(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

// Discover components: a directory under src/components/ counts only if it
// contains <name>.tpl.html.
const components = [];
if (fs.existsSync(componentsDir)) {
  for (const entry of fs.readdirSync(componentsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    const html = path.join(componentsDir, name, `${name}.tpl.html`);
    if (!fs.existsSync(html)) continue;
    const css = path.join(componentsDir, name, `${name}.css`);
    components.push({
      name,
      html: `${name}.tpl.html`,
      css: fs.existsSync(css) ? `${name}.css` : undefined,
    });
  }
}

// Start dist/ from scratch so the export is idempotent.
fs.rmSync(distDir, { recursive: true, force: true });

for (const component of components) {
  const srcDir = path.join(componentsDir, component.name);
  const destDir = path.join(distDir, 'components', component.name);
  copy(path.join(srcDir, component.html), path.join(destDir, component.html));
  if (component.css) copy(path.join(srcDir, component.css), path.join(destDir, component.css));
}

copy(tokensSrc, path.join(distDir, 'tokens.css'));

const manifest = {
  generatedAt: new Date().toISOString(),
  components: components.map(({ name, html, css }) => (css ? { name, html, css } : { name, html })),
  tokens: 'tokens.css',
};
fs.writeFileSync(path.join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

console.log(`Exported ${components.length} component(s) to dist/`);
for (const component of components) {
  console.log(`  - ${component.name} (${component.html}${component.css ? ` + ${component.css}` : ''})`);
}
