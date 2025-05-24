const OPENWEATHER_API_KEY = 'd47f5ca5b91bf63f8b3abf8acdc13dcd';
const CACHE_DURATION_MS = 60 * 60 * 1000;

const cityInput = document.getElementById('city-input');
const resultDiv = document.getElementById('weather-result');

// Function to determine which API to call based on backend toggle
async function fetchWeather(city) {
  resultDiv.textContent = 'Loading...';

  const backendBase = ApiRouter.getApiBase("api/weather");
  const cleanCity = city.split(':')[0].trim().toLowerCase();

  if (!cleanCity) {
    resultDiv.textContent = 'Invalid city name.';
    return;
  }

  try {
    let data;

    if (backendBase) {
      // Use backend proxy
      const res = await fetch(`${backendBase}?city=${encodeURIComponent(cleanCity)}`);
      data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch weather from backend');
    } else {
      // Use direct OpenWeather API
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanCity)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch weather from OpenWeather');
      const raw = await res.json();

      data = {
        city: raw.name,
        temperature: `${raw.main.temp} °C`,
        wind: `${raw.wind.speed} m/s`,
        description: raw.weather[0].description
      };
    }

    resultDiv.innerHTML = `
      <p><strong>${data.city}</strong></p>
      <p>Temperature: ${data.temperature}</p>
      <p>Wind: ${data.wind}</p>
      <p>Condition: ${data.description}</p>
    `;
  } catch (err) {
    resultDiv.textContent = `Error: ${err.message}`;
  }
}

// Auto-load on page ready
window.addEventListener('DOMContentLoaded', () => {
  const savedCity = localStorage.getItem('weatherCity');
  if (savedCity) {
    cityInput.value = savedCity;
    fetchWeather(savedCity);

    setInterval(() => {
      fetchWeather(savedCity);
    }, CACHE_DURATION_MS);
  }
});

// Manual trigger
document.getElementById('get-weather').addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (!city) {
    resultDiv.textContent = 'Please enter a city name.';
    return;
  }

  localStorage.setItem('weatherCity', city);
  fetchWeather(city);
});

ApiRouter.onBackendChange(() => {
  const city = localStorage.getItem('weatherCity');
  if (city) fetchWeather(city); // re-fetch weather using updated routing
});