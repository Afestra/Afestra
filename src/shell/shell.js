/* ✦ AFESTRA Shell JS
   Reads afestra.config.js and wires up the branded shell.
   Theme toggle, header hydration, config injection.
   ─────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  const cfg = typeof AFESTRA_CONFIG !== "undefined" ? AFESTRA_CONFIG : {};

  // ── Hydrate Header from Config ────────────────────────────
  function hydrateShell() {
    const brandName  = document.getElementById("brandName");
    const appName    = document.getElementById("appName");
    const appVersion = document.getElementById("appVersion");
    const githubLink = document.getElementById("githubLink");

    if (brandName  && cfg.brandName)  brandName.textContent  = cfg.brandName;
    if (appName    && cfg.appName)    appName.textContent    = cfg.appName;
    if (appVersion && cfg.appVersion) appVersion.textContent = "v" + cfg.appVersion;

    // Only show the GitHub badge if a real URL is configured
    if (githubLink) {
      if (cfg.githubUrl && cfg.githubUrl.trim() !== "") {
        githubLink.href = cfg.githubUrl;
        githubLink.style.display = "";
      } else {
        githubLink.style.display = "none";
      }
    }

    // Document title
    if (cfg.appName && cfg.brandName) {
      document.title = cfg.appName + " · " + cfg.brandName;
    }

    // Accent color injection
    if (cfg.accentColor) {
      document.documentElement.style.setProperty("--accent", cfg.accentColor);
      const hex = cfg.accentColor;
      document.documentElement.style.setProperty(
        "--accent-glow", hexToRgba(hex, 0.2)
      );
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", hex);
    }
    if (cfg.accentColorAlt) {
      document.documentElement.style.setProperty("--accent-alt", cfg.accentColorAlt);
    }

    // Initial theme
    const savedTheme = localStorage.getItem("afestra-theme");
    const defaultTheme = cfg.darkMode === false ? "light" : "dark";
    applyTheme(savedTheme || defaultTheme);
  }

  // ── Theme Toggle ──────────────────────────────────────────
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("afestra-theme", theme);

    const moon = document.querySelector(".icon-moon");
    const sun  = document.querySelector(".icon-sun");
    if (moon && sun) {
      if (theme === "dark") {
        moon.style.display = "";
        sun.style.display  = "none";
      } else {
        moon.style.display = "none";
        sun.style.display  = "";
      }
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  }

  // ── Helpers ───────────────────────────────────────────────
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // ── Init ──────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    hydrateShell();

    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  });

})();
