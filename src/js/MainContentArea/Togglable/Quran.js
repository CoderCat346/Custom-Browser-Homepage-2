// This function loads a random Ayah and updates the Quran widget.
// It only runs when the Quran widget is toggled ON.
window.loadQuranWidget = function () {
  // Generate a random Ayah number between 1 and 6236 (total number of Ayat in the Quran).
  const ayahNumber = Math.floor(Math.random() * 6236) + 1;

  // Fetch the Ayah from Al Quran Cloud API using two editions:
  //  - "quran-simple" for Arabic text
  //  - "en.asad" for English translation by Muhammad Asad
  fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-simple,en.asad`)
    .then(res => res.json())         // Convert the raw HTTP response to JSON format.
    .then(data => {
      // Extract Arabic text from the first edition in the response array
      const arabic = data.data[0].text;

      // Extract English translation text from the second edition in the response
      const translation = data.data[1].text;

      // Get the English name of the Surah (chapter) the Ayah belongs to
      const surah = data.data[1].surah.englishName;

      // Get the Ayah's position within its Surah (not global number)
      const numberInSurah = data.data[1].numberInSurah;

      // Update the HTML element with the Arabic text of the Ayah
      document.getElementById("ayah-arabic").textContent = arabic;

      // Update the HTML element with the English translation
      document.getElementById("ayah-translation").textContent = translation;

      // Show extra info: Surah name and Ayah number within that Surah
      document.getElementById("ayah-info").textContent = `Surah ${surah}, Ayah ${numberInSurah}`;
    })
    .catch(err => {
      console.error("Failed to load Quran Ayah:", err);
    });
};