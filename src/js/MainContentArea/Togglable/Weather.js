const BACKEND_URL = 'http://localhost:4000'; // <-- change to your backend URL if deployed

document.getElementById('get-weather').addEventListener('click', async () => {
  const city = document.getElementById('city-input').value.trim();
  const resultDiv = document.getElementById('weather-result');

  if (!city) {
    resultDiv.textContent = 'Please enter a city name.';
    return;
  }

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
});
