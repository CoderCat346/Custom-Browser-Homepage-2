const BACKEND_URL = 'http://localhost:4000'; // <-- change to your backend URL if deployed
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

const cityInput = document.getElementById('city-input');
const resultDiv = document.getElementById('weather-result');

// Unified weather fetch function
async function fetchWeather(city) {
  resultDiv.textContent = 'Loading...';

  try {
    const res = await fetch(`${BACKEND_URL}/api/weather?city=${encodeURIComponent(city)}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Failed to fetch weather');

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

// Load saved city on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedCity = localStorage.getItem('weatherCity');
  if (savedCity) {
    cityInput.value = savedCity;
    fetchWeather(savedCity);

    // OPTIONAL: auto-refresh every hour while the page stays open
    setInterval(() => {
      fetchWeather(savedCity);
    }, CACHE_DURATION_MS);
  }
});

// Manual "Get Weather" button
document.getElementById('get-weather').addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (!city) {
    resultDiv.textContent = 'Please enter a city name.';
    return;
  }

  localStorage.setItem('weatherCity', city); // Save for auto-load
  fetchWeather(city);
});
