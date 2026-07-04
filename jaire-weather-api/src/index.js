const allowedOrigins = new Set([
  "https://jaire101.github.io",
  "http://127.0.0.1:5500",
  "http://localhost:5500"
]);

export default {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(request);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    if (request.method !== "GET") {
      return sendJson(
        {
          error: "Only GET requests are allowed."
        },
        405,
        corsHeaders
      );
    }

    const requestUrl = new URL(request.url);

    if (requestUrl.pathname !== "/weather") {
      return sendJson(
        {
          error: "Use the /weather route with a city query.",
          example: "/weather?city=Phoenix"
        },
        404,
        corsHeaders
      );
    }

    const city = requestUrl.searchParams.get("city")?.trim();

    if (!city) {
      return sendJson(
        {
          error: "Add a city name, such as /weather?city=Phoenix"
        },
        400,
        corsHeaders
      );
    }

    if (city.length > 80) {
      return sendJson(
        {
          error: "City name is too long."
        },
        400,
        corsHeaders
      );
    }

    if (!env.WEATHER_API_KEY) {
      return sendJson(
        {
          error: "Weather API key is not configured."
        },
        500,
        corsHeaders
      );
    }

    const weatherUrl = new URL(
      "https://api.weatherapi.com/v1/forecast.json"
    );

    weatherUrl.searchParams.set("key", env.WEATHER_API_KEY);
    weatherUrl.searchParams.set("q", city);
    weatherUrl.searchParams.set("days", "5");
    weatherUrl.searchParams.set("aqi", "no");
    weatherUrl.searchParams.set("alerts", "no");

    try {
      const weatherResponse = await fetch(weatherUrl.toString());
      const weatherData = await weatherResponse.json();

      if (!weatherResponse.ok) {
        return sendJson(
          {
            error:
              weatherData.error?.message ||
              "Weather data could not be retrieved."
          },
          weatherResponse.status,
          corsHeaders
        );
      }

      return sendJson(
        weatherData,
        200,
        corsHeaders,
        {
          "Cache-Control": "public, max-age=300"
        }
      );
    } catch {
      return sendJson(
        {
          error: "Could not connect to the weather service."
        },
        502,
        corsHeaders
      );
    }
  }
};

function getCorsHeaders(request) {
  const origin = request.headers.get("Origin") || "";

  const allowedOrigin = allowedOrigins.has(origin)
    ? origin
    : "https://jaire101.github.io";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin"
  };
}

function sendJson(data, status, corsHeaders, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      ...extraHeaders,
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
}
