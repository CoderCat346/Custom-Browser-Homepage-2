// Quran.js

(function () {
  const arabicEl = document.getElementById("ayah-arabic");
  const translationEl = document.getElementById("ayah-translation");
  const infoEl = document.getElementById("ayah-info");

  /**
   * Generates a random Ayah number between 1 and 6236.
   * Used only when directly calling the public API.
   */
  const getRandomAyahNumber = () => Math.floor(Math.random() * 6236) + 1;

  /**
   * Displays Ayah content in the DOM.
   * @param {Object} ayah - Ayah content to render.
   */
  function renderAyah({ arabic, translation, surah, numberInSurah }) {
    arabicEl.textContent = arabic;
    translationEl.textContent = translation;
    infoEl.textContent = `Surah ${surah}, Ayah ${numberInSurah}`;
  }

  /**
   * Handles loading of ayah depending on backend preference.
   * Uses backend proxy or direct API based on user setting.
   */
  async function loadQuranWidget() {
    const endpoint = ApiRouter.getApiBase('api/quran');

    try {
      if (endpoint) {
        // Use backend (handles randomness + formatting)
        const res = await fetch(endpoint);
        const data = await res.json();
        renderAyah(data);
      } else {
        // Use direct public API (generate random ayah here)
        const ayahNum = getRandomAyahNumber();
        const url = `https://api.alquran.cloud/v1/ayah/${ayahNum}/editions/quran-simple,en.asad`;
        const res = await fetch(url);
        const data = await res.json();

        const formatted = {
          arabic: data.data[0].text,
          translation: data.data[1].text,
          surah: data.data[1].surah.englishName,
          numberInSurah: data.data[1].numberInSurah
        };

        renderAyah(formatted);
      }
    } catch (err) {
      console.error("Quran widget failed to load:", err);
    }
  }

  // Load on start
  loadQuranWidget();

  // Reload live when user switches API routing method
  ApiRouter.onBackendChange(() => {
    loadQuranWidget();
  });

})();
