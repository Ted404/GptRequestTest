const STORAGE_KEY = "chat_history_v1";
const questionInput = document.getElementById("question");
const responseContainer = document.getElementById("response");

let messages = loadHistory();
renderHistory();

questionInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        ask();
    }
});

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
