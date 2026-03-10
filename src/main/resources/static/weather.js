const cityForm = document.getElementById("city_form");
const cityInput = document.getElementById("city_input");
const cityName = document.getElementById("city_name");
const temperature = document.getElementById("temperature");
const summary = document.getElementById("summary");
const icon = document.getElementById("icon");
const mainValue = document.getElementById("main_value");
const descriptionValue = document.getElementById("description_value");
const feelsValue = document.getElementById("feels_value");
const humidityValue = document.getElementById("humidity_value");
const windValue = document.getElementById("wind_value");
const iconValue = document.getElementById("icon_value");
const statusEl = document.getElementById("status");
const menuPanel = document.getElementById("menu_panel");
const menuOverlay = document.getElementById("menu_overlay");
const rainBg = document.querySelector(".rain-bg");
const citySuggestionsEl = document.getElementById("city_suggestions");

const CITY_SUGGESTIONS = Array.isArray(window.WORLD_CITY_SUGGESTIONS)
    ? [...new Set(window.WORLD_CITY_SUGGESTIONS)]
    : ["Dubai", "Cebu", "Manila", "London", "New York"];

const WEATHER_BACKGROUNDS = {
    clear: "https://images.pexels.com/photos/2098428/pexels-photo-2098428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2400",
    clouds: "https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2400",
    rain: "https://images.pexels.com/photos/69927/rain-floor-water-wet-69927.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2400",
    drizzle: "https://images.pexels.com/photos/110874/pexels-photo-110874.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2400",
    thunderstorm: "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2400",
    snow: "https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2400",
    mist: "https://images.pexels.com/photos/167684/pexels-photo-167684.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2400",
    haze: "https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2400",
    smoke: "https://images.pexels.com/photos/1834399/pexels-photo-1834399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2400",
    fog: "https://images.pexels.com/photos/1743165/pexels-photo-1743165.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2400",
    default: "https://images.pexels.com/photos/531756/pexels-photo-531756.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2400"
};

let currentSuggestions = [];
let activeSuggestionIndex = -1;

cityForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;
    hideSuggestions();
    await loadWeather(city);
});

cityInput.addEventListener("input", () => {
    renderSuggestions(cityInput.value.trim());
});

cityInput.addEventListener("keydown", (event) => {
    if (!currentSuggestions.length) return;

    if (event.key === "ArrowDown") {
        event.preventDefault();
        activeSuggestionIndex = Math.min(activeSuggestionIndex + 1, currentSuggestions.length - 1);
        drawSuggestions();
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, 0);
        drawSuggestions();
    } else if (event.key === "Enter" && activeSuggestionIndex >= 0) {
        event.preventDefault();
        applySuggestion(currentSuggestions[activeSuggestionIndex]);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
        hideSuggestions();
    }
});

document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!target.closest(".city-picker")) {
        hideSuggestions();
    }
});

async function loadWeather(city) {
    statusEl.textContent = "Loading weather...";

    try {
        const res = await fetch(`/weather?city=${encodeURIComponent(city)}`);
        if (!res.ok) {
            const text = await res.text();
            statusEl.textContent = `Failed to load weather: ${text}`;
            return;
        }

        const data = await res.json();
        renderWeather(city, data);
        statusEl.textContent = "";
    } catch (err) {
        statusEl.textContent = `Error: ${err.message}`;
    }
}

function renderWeather(city, data) {
    cityName.textContent = city;
    temperature.textContent = `${Math.round(data.temperature)}°C`;
    summary.textContent = `${data.main} · ${data.description}`;

    mainValue.textContent = data.main;
    descriptionValue.textContent = data.description;
    feelsValue.textContent = `${Math.round(data.feelsLike)}°C`;
    humidityValue.textContent = `${data.humidity}%`;
    windValue.textContent = `${data.windSpeed} m/s`;
    iconValue.textContent = data.icon;

    icon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    applyWeatherBackground(data.main, data.description);
}

function renderSuggestions(query) {
    const normalized = normalizeText(query);
    if (!normalized) {
        hideSuggestions();
        return;
    }

    const ranked = CITY_SUGGESTIONS
        .map((city) => ({ city, score: matchScore(normalized, city) }))
        .filter((item) => item.score < Number.POSITIVE_INFINITY)
        .sort((a, b) => a.score - b.score || a.city.localeCompare(b.city))
        .slice(0, 7)
        .map((item) => item.city);

    if (!ranked.length) {
        hideSuggestions();
        return;
    }

    currentSuggestions = ranked;
    activeSuggestionIndex = 0;
    drawSuggestions();
}

function drawSuggestions() {
    if (!citySuggestionsEl) return;

    citySuggestionsEl.innerHTML = "";
    currentSuggestions.forEach((city, index) => {
        const option = document.createElement("div");
        option.className = "city-option" + (index === activeSuggestionIndex ? " active" : "");
        option.textContent = city;
        option.addEventListener("mousedown", (event) => {
            event.preventDefault();
            applySuggestion(city);
        });
        citySuggestionsEl.appendChild(option);
    });
    citySuggestionsEl.hidden = false;
}

function hideSuggestions() {
    currentSuggestions = [];
    activeSuggestionIndex = -1;
    if (!citySuggestionsEl) return;
    citySuggestionsEl.hidden = true;
    citySuggestionsEl.innerHTML = "";
}

function applySuggestion(city) {
    cityInput.value = city;
    hideSuggestions();
}

function normalizeText(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function matchScore(query, city) {
    const candidate = normalizeText(city);
    if (!query) return Number.POSITIVE_INFINITY;
    if (candidate === query) return 0;
    if (candidate.startsWith(query)) return 1;
    if (candidate.includes(query)) return 2;

    const distance = levenshtein(query, candidate);
    if (distance <= 2) return 3 + distance;

    if (query.length >= 5 && distance <= 3) return 7 + distance;
    return Number.POSITIVE_INFINITY;
}

function levenshtein(a, b) {
    const rows = a.length + 1;
    const cols = b.length + 1;
    const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));

    for (let i = 0; i < rows; i += 1) dp[i][0] = i;
    for (let j = 0; j < cols; j += 1) dp[0][j] = j;

    for (let i = 1; i < rows; i += 1) {
        for (let j = 1; j < cols; j += 1) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }

    return dp[a.length][b.length];
}

function applyWeatherBackground(main, description) {
    if (!rainBg) return;
    const key = String(main || description || "default").toLowerCase();
    const selected =
        WEATHER_BACKGROUNDS[key] ||
        WEATHER_BACKGROUNDS[(description || "").toLowerCase()] ||
        WEATHER_BACKGROUNDS.default;
    rainBg.style.backgroundImage =
        `linear-gradient(150deg, rgba(10,19,26,0.58), rgba(12,26,34,0.58)), url("${selected}")`;
    rainBg.style.backgroundSize = "cover";
    rainBg.style.backgroundPosition = "center";
}

function toggleMenu() {
    const open = menuPanel.classList.contains("open");
    if (open) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    menuPanel.classList.add("open");
    menuOverlay.classList.add("open");
}

function closeMenu() {
    menuPanel.classList.remove("open");
    menuOverlay.classList.remove("open");
}

loadWeather(cityInput.value.trim());
