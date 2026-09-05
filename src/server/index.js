const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Paths
const srcPath = path.join(__dirname, "..");
const componentsPath = path.join(srcPath, "components");
const pagesPath = path.join(srcPath, "pages");
const layoutsPath = path.join(srcPath, "layouts");
const publicPath = path.join(__dirname, "..", "..", "public");

// Nunjucks configuration
const env = nunjucks.configure(
  [pagesPath, layoutsPath, componentsPath, publicPath],
  {
    autoescape: true,
    express: app,
    watch: true,
    noCache: process.env.NODE_ENV !== "production",
  },
);

// Add component/partial lookup helpers to nunjucks
env.addGlobal("includeComponent", (name, context) => {
  // Convention: src/components/<name>/<name>.tpl.html (flat fallback supported)
  const candidates = [`${name}/${name}.tpl.html`, `${name}.tpl.html`];
  for (const tpl of candidates) {
    try {
      // SafeString: component output is trusted template HTML, must not be escaped
      return new nunjucks.runtime.SafeString(nunjucks.render(tpl, context));
    } catch (e) {
      if (!/template not found/.test(e.message)) {
        console.error(`Error rendering component ${name}:`, e.message);
        return `<!-- Component "${name}" failed to render: ${e.message} -->`;
      }
    }
  }
  console.error(
    `Component "${name}" not found (tried ${candidates.join(", ")})`,
  );
  return `<!-- Component "${name}" not found -->`;
});

env.addGlobal("includeCSS", (name) => {
  return `<link rel="stylesheet" href="/css/${name}.css">`;
});

env.addGlobal("includeJS", (name) => {
  return `<script src="/js/${name}.js"></script>`;
});

// Serve static files from public/ directory
app.use(express.static(publicPath));

// Serve CSS/JS from src/styles if they exist
app.use("/css", express.static(path.join(srcPath, "styles")));
// Serve component stylesheets (each component owns its CSS)
app.use("/css/components", express.static(componentsPath));
app.use("/js", express.static(path.join(publicPath, "js")));

// Pages routes - serve .tpl.html files from pages directory
app.get("/", (_req, res) => {
  res.render("index.tpl.html", {
    title: "Web Templating",
    page: "home",
    year: new Date().getFullYear(),
  });
});

app.get("/page/:name", (req, res) => {
  const pageName = req.params.name;
  res.render(`${pageName}.tpl.html`, {
    title:
      pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, " "),
    page: pageName,
    year: new Date().getFullYear(),
    // State variants are passed through the query string, so a single page
    // template can render every state of its components (?variant=empty etc).
    query: req.query,
  });
});

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    templatePaths: {
      components: componentsPath,
      pages: pagesPath,
      layouts: layoutsPath,
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Web templating dev server running at http://localhost:${PORT}`);
  console.log(`Serving from: ${publicPath}`);
  console.log(`Templates from: ${srcPath}`);
});
