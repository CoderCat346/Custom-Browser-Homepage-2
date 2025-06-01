// Immediately invoked function to isolate scope
(() => {
  // DOM elements where Ayah content will be injected
  const arabicEl = document.getElementById("ayah-arabic") as HTMLElement | null;
  const translationEl = document.getElementById("ayah-translation") as HTMLElement | null;
  const infoEl = document.getElementById("ayah-info") as HTMLElement | null;
  const widgetEl = document.getElementById("QuranWidget") as HTMLElement | null; // Widget container element

  // Type definition for Ayah data structure
  interface RenderAyahParams {
    arabic: string;
    translation: string;
    surah: string;
    numberInSurah: number;
  }

  // Generates a random Ayah number between 1 and 6236
  const getRandomAyahNumber = (): number => Math.floor(Math.random() * 6236) + 1;

  // Injects Ayah content into the DOM
  function renderAyah({ arabic, translation, surah, numberInSurah }: RenderAyahParams): void {
    if (!arabicEl || !translationEl || !infoEl) return;
    arabicEl.textContent = arabic;
    translationEl.textContent = translation;
    infoEl.textContent = `Surah ${surah}, Ayah ${numberInSurah}`;
  }

  // Loads Ayah either via backend proxy or direct public API
  async function loadQuranWidget(): Promise<void> {
    const endpoint = ApiRouter.getApiBase("api/quran");

    try {
      if (endpoint) {
        // Use backend-provided Ayah data
        const res = await fetch(endpoint);
        const data: RenderAyahParams = await res.json();
        renderAyah(data);
      } else {
        // Fallback to public API using randomly selected Ayah
        const ayahNum = getRandomAyahNumber();
        const url = `https://api.alquran.cloud/v1/ayah/${ayahNum}/editions/quran-simple,en.asad`;
        const res = await fetch(url);
        const data = await res.json();

        // Manually format response from the public API
        const formatted: RenderAyahParams = {
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

  // Add runtime type casting to safely access optional hook
  const router = ApiRouter as {
    getApiBase: (key: string) => string | null;
    onBackendChange?: (cb: () => void) => void;
  };

  // Load Ayah on initial load
  loadQuranWidget();

  // Reload widget if user switches API mode and widget is visible
  if (router.onBackendChange) {
    router.onBackendChange(() => {
      if (widgetEl?.style.display !== "none") {
        loadQuranWidget();
      }
    });
  }

  // Expose the function globally for external widget control (like toggle)
  (window as any).loadQuranWidget = loadQuranWidget;
})();
