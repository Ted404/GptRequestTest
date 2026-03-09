const STORAGE_KEY = "chat_history_v1";
const THEME_KEY = "site_theme";
const questionInput = document.getElementById("question");
const responseContainer = document.getElementById("response");
const menuButton = document.getElementById("menu_button");
const menuPanel = document.getElementById("menu_panel");
const menuOverlay = document.getElementById("menu_overlay");
const themeToggle = document.getElementById("theme_toggle");

let messages = loadHistory();
renderHistory();
initTheme();

questionInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        ask();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

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

function openMenu() {
    if (!menuButton || !menuPanel || !menuOverlay) return;
    menuPanel.classList.add("open");
    menuOverlay.classList.add("open");
    menuButton.setAttribute("aria-expanded", "true");
    menuPanel.setAttribute("aria-hidden", "false");
}

function closeMenu() {
    if (!menuButton || !menuPanel || !menuOverlay) return;
    menuPanel.classList.remove("open");
    menuOverlay.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuPanel.setAttribute("aria-hidden", "true");
}

function toggleMenu() {
    if (!menuPanel) return;
    if (menuPanel.classList.contains("open")) {
        closeMenu();
    } else {
        openMenu();
    }
}

function loadHistory() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (_err) {
        return [];
    }
}

function saveHistory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function appendMessage(role, text, token) {
    messages.push({ role, text, token: token ?? null });
    saveHistory();
    renderHistory();
}

function renderHistory() {
    responseContainer.innerHTML = "";

    for (const item of messages) {
        const msg = document.createElement("div");
        msg.classList.add("message");
        msg.classList.add(item.role === "user" ? "user" : item.role);
        msg.textContent = item.text;

        if (item.role === "assistant" && item.token !== null) {
            const meta = document.createElement("div");
            meta.className = "meta";
            meta.textContent = `Tokens: ${item.token}`;
            msg.appendChild(meta);
        }

        responseContainer.appendChild(msg);
    }

    responseContainer.scrollTop = responseContainer.scrollHeight;
}

function clearChat() {
    messages = [];
    saveHistory();
    renderHistory();
}

async function ask() {
    const question = questionInput.value.trim();
    if (!question) return;

    appendMessage("user", question);
    questionInput.value = "";
    questionInput.focus();

    try {
        const res = await fetch("/api/ask", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: question
        });

        if (!res.ok) {
            const errText = await res.text();
            appendMessage("error", `Server error: ${errText}`);
            return;
        }

        const data = await res.json();
        appendMessage("assistant", data.message, data.token);
    } catch (err) {
        appendMessage("error", `Error: ${err.message}`);
    }
}
