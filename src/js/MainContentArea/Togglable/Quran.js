window.loadQuranWidget = function () {
  fetch('https://backendcbh2.onrender.com/api/quran') // Change to your backend domain in production
    .then(res => res.json())
    .then(data => {
      document.getElementById("ayah-arabic").textContent = data.arabic;
      document.getElementById("ayah-translation").textContent = data.translation;
      document.getElementById("ayah-info").textContent = `Surah ${data.surah}, Ayah ${data.numberInSurah}`;
    })
    .catch(err => {
      console.error("Failed to load Quran Ayah:", err);
    });
};
