// Web Templating - Main JavaScript
// Minimal vanilla JS for interactivity

(() => {
  // DOM ready
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    console.log("Web Templating mockup site loaded");

    // Initialize any components that need JS
    initComponents();
  }

  function initComponents() {
    // Placeholder for component initialization
    // Example: dropdowns, modals, tabs, etc.
  }

  // Utility: Debounce
  function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Utility: Throttle
  function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Export utilities globally if needed
  window.WebTemplating = {
    debounce,
    throttle,
    initComponents,
  };
})();
