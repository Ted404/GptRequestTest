const THEME_KEY = "site_theme";
const themeToggle = document.getElementById("theme_toggle");

initTheme();

function initTheme() {
    const defaultTheme = document.body.dataset.defaultTheme || "light";
    const saved = localStorage.getItem(THEME_KEY);
    applyTheme(saved || defaultTheme);
}

function applyTheme(theme) {
    const normalized = theme === "dark" ? "dark" : "light";
    document.body.classList.toggle("light", normalized === "light");
    document.body.classList.toggle("dark", normalized === "dark");
    localStorage.setItem(THEME_KEY, normalized);

    if (themeToggle) {
        themeToggle.setAttribute("aria-label", normalized === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }

    document.querySelectorAll("img[data-logo-light][data-logo-dark]").forEach((img) => {
        const lightSrc = img.getAttribute("data-logo-light");
        const darkSrc = img.getAttribute("data-logo-dark");
        img.setAttribute("src", normalized === "dark" ? darkSrc : lightSrc);
    });
}

function toggleTheme() {
    const isDark = document.body.classList.contains("dark");
    applyTheme(isDark ? "light" : "dark");
}
