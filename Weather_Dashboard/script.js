const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const statusMessage = document.getElementById("statusMessage");
const weatherPanel = document.getElementById("weatherPanel");
const weatherContent = document.querySelector(".weather-content");

const locationName = document.getElementById("locationName");
const conditionText = document.getElementById("conditionText");
const weatherIcon = document.getElementById("weatherIcon");
const currentTemp = document.getElementById("currentTemp");
const feelsLike = document.getElementById("feelsLike");
const windSpeed = document.getElementById("windSpeed");
const humidity = document.getElementById("humidity");
const forecastRange = document.getElementById("forecastRange");
const forecastList = document.getElementById("forecastList");
const globeLocation = document.getElementById("globeLocation");
const earthCanvas = document.getElementById("earthCanvas");
const earthContext = earthCanvas.getContext("2d");

const globeState = {
  rotation: -20,
  targetRotation: -20,
  centerLat: 15,
  targetLat: 15,
  zoom: 1,
  targetZoom: 1,
  marker: null
};

const continentShapes = [
  [
    [-168, 70],
    [-140, 62],
    [-125, 50],
    [-118, 34],
    [-104, 22],
    [-88, 18],
    [-80, 26],
    [-68, 45],
    [-58, 55],
    [-78, 68],
    [-118, 74]
  ],
  [
    [-82, 12],
    [-70, 6],
    [-62, -8],
    [-58, -22],
    [-66, -40],
    [-74, -54],
    [-82, -28],
    [-88, -8]
  ],
  [
    [-18, 35],
    [6, 37],
    [30, 30],
    [48, 12],
    [42, -16],
    [26, -34],
    [12, -35],
    [-5, -18],
    [-15, 5]
  ],
  [
    [-10, 54],
    [18, 66],
    [52, 58],
    [90, 62],
    [128, 48],
    [146, 28],
    [110, 8],
    [78, 20],
    [46, 8],
    [28, 28],
    [4, 36]
  ],
  [
    [112, -10],
    [150, -16],
    [154, -34],
    [134, -42],
    [114, -32]
  ],
  [
    [-52, 74],
    [-22, 78],
    [-18, 66],
    [-44, 60]
  ]
];

const weatherCodes = {
  0: ["Clear sky", "☀"],
  1: ["Mainly clear", "🌤"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁"],
  45: ["Fog", "🌫"],
  48: ["Depositing rime fog", "🌫"],
  51: ["Light drizzle", "🌦"],
  53: ["Moderate drizzle", "🌦"],
  55: ["Dense drizzle", "🌧"],
  61: ["Slight rain", "🌧"],
  63: ["Moderate rain", "🌧"],
  65: ["Heavy rain", "⛈"],
  71: ["Slight snow", "🌨"],
  73: ["Moderate snow", "🌨"],
  75: ["Heavy snow", "❄"],
  80: ["Slight rain showers", "🌦"],
  81: ["Rain showers", "🌧"],
  82: ["Violent rain showers", "⛈"],
  95: ["Thunderstorm", "⛈"],
  96: ["Thunderstorm with hail", "⛈"],
  99: ["Thunderstorm with heavy hail", "⛈"]
};

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    showStatus("Type a city name first.", "error");
    return;
  }

  await loadWeather(city);
});

async function loadWeather(city) {
  setLoading(true);

  try {
    const place = await geocodeCity(city);
    focusGlobe(place);
    const weather = await getForecast(place);

    renderWeather(place, weather);
    showStatus(`Updated weather for ${place.name}.`, "success");
  } catch (error) {
    weatherPanel.classList.add("is-empty");
    weatherContent.hidden = true;
    showStatus(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function geocodeCity(city) {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}` +
    "&count=1&language=en&format=json";
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new Error("Could not search for that city right now.");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("No city found. Check the spelling and try again.");
  }

  return data.results[0];
}

async function getForecast(place) {
  const params = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    forecast_days: "5",
    timezone: "auto"
  });
  const response = await fetchWithTimeout(
    `https://api.open-meteo.com/v1/forecast?${params}`
  );

  if (!response.ok) {
    throw new Error("Weather data is unavailable for that city.");
  }

  return response.json();
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Weather data took too long to respond. Try again in a moment.");
    }

    throw new Error("Could not retrieve weather data. Check your connection and try again.");
  } finally {
    clearTimeout(timeoutId);
  }
}

function renderWeather(place, weather) {
  const current = weather.current;
  const codeInfo = getWeatherCodeInfo(current.weather_code);
  const region = [place.admin1, place.country].filter(Boolean).join(", ");

  weatherPanel.classList.remove("is-empty");
  weatherContent.hidden = false;

  locationName.textContent = region ? `${place.name}, ${region}` : place.name;
  conditionText.textContent = codeInfo.label;
  weatherIcon.textContent = codeInfo.icon;
  currentTemp.textContent = `${Math.round(current.temperature_2m)}°F`;
  feelsLike.textContent = `${Math.round(current.apparent_temperature)}°F`;
  windSpeed.textContent = `${Math.round(current.wind_speed_10m)} mph`;
  humidity.textContent = `${current.relative_humidity_2m}%`;
  focusGlobe(place);

  renderForecast(weather.daily);
}

function focusGlobe(place) {
  const region = [place.admin1, place.country].filter(Boolean).join(", ");
  const label = region ? `${place.name}, ${region}` : place.name;

  globeLocation.textContent = label;
  globeState.marker = {
    lat: place.latitude,
    lon: place.longitude,
    label
  };
  globeState.targetLat = Math.max(-48, Math.min(48, place.latitude));
  globeState.targetRotation = -place.longitude;
  globeState.targetZoom = 1.75;
}

function renderForecast(daily) {
  forecastList.innerHTML = "";
  forecastRange.textContent = `${formatShortDate(daily.time[0])} - ${formatShortDate(
    daily.time[daily.time.length - 1]
  )}`;

  daily.time.forEach((date, index) => {
    const codeInfo = getWeatherCodeInfo(daily.weather_code[index]);
    const card = document.createElement("article");
    card.className = "forecast-card";

    card.innerHTML = `
      <div>
        <p class="forecast-day">${formatWeekday(date, index)}</p>
        <span class="forecast-range">${formatShortDate(date)}</span>
      </div>
      <div class="forecast-icon">${codeInfo.icon}</div>
      <div>
        <p class="forecast-temp">${Math.round(daily.temperature_2m_max[index])}° / ${Math.round(
          daily.temperature_2m_min[index]
        )}°</p>
        <p class="forecast-condition">${codeInfo.label}</p>
      </div>
    `;

    forecastList.append(card);
  });
}

function getWeatherCodeInfo(code) {
  const [label, icon] = weatherCodes[code] || ["Mixed conditions", "🌡"];
  return { label, icon };
}

function formatWeekday(dateString, index) {
  if (index === 0) {
    return "Today";
  }

  return new Intl.DateTimeFormat("en", { weekday: "short" }).format(
    new Date(`${dateString}T12:00:00`)
  );
}

function formatShortDate(dateString) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
    new Date(`${dateString}T12:00:00`)
  );
}

function setLoading(isLoading) {
  const button = searchForm.querySelector("button");
  button.disabled = isLoading;
  button.textContent = isLoading ? "Loading..." : "Search";

  if (isLoading) {
    showStatus("Loading weather data...", "loading");
  }
}

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = "status-message";

  if (type === "error") {
    statusMessage.classList.add("is-error");
  }

  if (type === "loading") {
    statusMessage.classList.add("is-loading");
  }
}

function resizeEarthCanvas() {
  const rect = earthCanvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  earthCanvas.width = Math.max(1, Math.floor(rect.width * scale));
  earthCanvas.height = Math.max(1, Math.floor(rect.height * scale));
  earthContext.setTransform(scale, 0, 0, scale, 0, 0);
}

function animateGlobe() {
  globeState.rotation = moveTowardAngle(
    globeState.rotation,
    globeState.targetRotation,
    0.045
  );
  globeState.centerLat += (globeState.targetLat - globeState.centerLat) * 0.045;
  globeState.zoom += (globeState.targetZoom - globeState.zoom) * 0.055;

  if (!globeState.marker) {
    globeState.targetRotation -= 0.05;
  }

  drawGlobe();
  requestAnimationFrame(animateGlobe);
}

function drawGlobe() {
  const width = earthCanvas.clientWidth;
  const height = earthCanvas.clientHeight;
  const context = earthContext;
  const radius = Math.min(width, height) * 0.34 * globeState.zoom;
  const cx = width * 0.5;
  const cy = height * 0.52;

  context.clearRect(0, 0, width, height);
  drawStars(context, width, height);

  context.save();
  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.clip();

  const ocean = context.createRadialGradient(
    cx - radius * 0.32,
    cy - radius * 0.36,
    radius * 0.08,
    cx,
    cy,
    radius
  );
  ocean.addColorStop(0, "#7dd3fc");
  ocean.addColorStop(0.38, "#0ea5e9");
  ocean.addColorStop(1, "#082f49");
  context.fillStyle = ocean;
  context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  drawGrid(context, cx, cy, radius);
  drawContinents(context, cx, cy, radius);

  const shade = context.createRadialGradient(
    cx - radius * 0.35,
    cy - radius * 0.35,
    radius * 0.2,
    cx + radius * 0.3,
    cy + radius * 0.2,
    radius * 1.2
  );
  shade.addColorStop(0, "rgba(255,255,255,0.2)");
  shade.addColorStop(0.55, "rgba(0,0,0,0)");
  shade.addColorStop(1, "rgba(0,0,0,0.42)");
  context.fillStyle = shade;
  context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  if (globeState.marker) {
    drawMarker(context, cx, cy, radius, globeState.marker);
  }

  context.restore();

  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.strokeStyle = "rgba(224, 242, 254, 0.5)";
  context.lineWidth = 2;
  context.stroke();
}

function drawStars(context, width, height) {
  context.fillStyle = "rgba(255, 255, 255, 0.34)";

  for (let index = 0; index < 38; index += 1) {
    const x = (index * 97) % width;
    const y = (index * 53) % height;
    const size = index % 5 === 0 ? 1.8 : 1;
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
    context.fill();
  }
}

function drawGrid(context, cx, cy, radius) {
  context.strokeStyle = "rgba(224, 242, 254, 0.22)";
  context.lineWidth = 1;

  for (let lat = -60; lat <= 60; lat += 30) {
    drawProjectedPath(context, cx, cy, radius, buildLatitudeLine(lat));
  }

  for (let lon = -150; lon <= 180; lon += 30) {
    drawProjectedPath(context, cx, cy, radius, buildLongitudeLine(lon));
  }
}

function drawContinents(context, cx, cy, radius) {
  context.fillStyle = "rgba(52, 211, 153, 0.78)";
  context.strokeStyle = "rgba(6, 78, 59, 0.48)";
  context.lineWidth = 1;

  continentShapes.forEach((shape) => {
    drawProjectedPath(context, cx, cy, radius, shape, true);
  });
}

function drawMarker(context, cx, cy, radius, marker) {
  const point = projectPoint(marker.lat, marker.lon, cx, cy, radius);

  if (!point.visible) {
    return;
  }

  context.beginPath();
  context.arc(point.x, point.y, 18, 0, Math.PI * 2);
  context.fillStyle = "rgba(251, 191, 36, 0.18)";
  context.fill();

  context.beginPath();
  context.arc(point.x, point.y, 7, 0, Math.PI * 2);
  context.fillStyle = "#fbbf24";
  context.fill();
  context.strokeStyle = "#fff7ed";
  context.lineWidth = 2;
  context.stroke();
}

function drawProjectedPath(context, cx, cy, radius, points, closePath = false) {
  let started = false;

  context.beginPath();

  points.forEach(([lon, lat]) => {
    const point = projectPoint(lat, lon, cx, cy, radius);

    if (!point.visible) {
      started = false;
      return;
    }

    if (!started) {
      context.moveTo(point.x, point.y);
      started = true;
      return;
    }

    context.lineTo(point.x, point.y);
  });

  if (closePath) {
    context.closePath();
    context.fill();
  }

  context.stroke();
}

function projectPoint(lat, lon, cx, cy, radius) {
  const latRad = toRadians(lat - globeState.centerLat);
  const lonRad = toRadians(lon + globeState.rotation);
  const x = radius * Math.cos(latRad) * Math.sin(lonRad);
  const y = -radius * Math.sin(latRad);
  const z = Math.cos(latRad) * Math.cos(lonRad);

  return {
    x: cx + x,
    y: cy + y,
    visible: z > -0.08
  };
}

function buildLatitudeLine(lat) {
  const points = [];

  for (let lon = -180; lon <= 180; lon += 4) {
    points.push([lon, lat]);
  }

  return points;
}

function buildLongitudeLine(lon) {
  const points = [];

  for (let lat = -80; lat <= 80; lat += 4) {
    points.push([lon, lat]);
  }

  return points;
}

function moveTowardAngle(current, target, amount) {
  const delta = ((((target - current) % 360) + 540) % 360) - 180;
  return current + delta * amount;
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

window.addEventListener("resize", resizeEarthCanvas);
resizeEarthCanvas();
animateGlobe();

window.weatherDashboard = {
  focusGlobe,
  globeState
};
