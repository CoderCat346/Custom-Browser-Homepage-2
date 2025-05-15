document.addEventListener("DOMContentLoaded", function () {
  const maxWidgets = 2;
  const checkboxes = document.querySelectorAll(".widget-toggle");
  const warning = document.getElementById("widgetLimitWarning");

  const widgetMap = {
    "Quran": "Quran-widget-wrapper",
    "Weather": "weather-widget-wrapper",
    "RSS": "rss-widget-wrapper",
    "News": "news-widget-wrapper"
  };

  function updateVisibility() {
    const selected = Array.from(checkboxes).filter(cb => cb.checked);
    checkboxes.forEach(cb => {
      const widgetId = widgetMap[cb.value];
      const widget = document.getElementById(widgetId);
      if (widget) {
        widget.style.display = cb.checked ? "block" : "none";

        // 🟢 If Quran widget is turned ON and not already loaded, load its content
        if (cb.checked && cb.value === "Quran" && widget.dataset.loaded !== "true") {
          if (typeof loadQuranWidget === "function") {
            loadQuranWidget();
            widget.dataset.loaded = "true"; // Avoid duplicate API calls
          }
        }
      }
    });

    // Limit enforcement
    if (selected.length > maxWidgets) {
      warning.style.display = "inline";
      // Uncheck the last selected one
      selected[selected.length - 1].checked = false;
      updateVisibility(); // recursively adjust
    } else {
      warning.style.display = "none";
    }

    // Persist to localStorage
    const selectedValues = selected.map(cb => cb.value);
    localStorage.setItem("enabledWidgets", JSON.stringify(selectedValues));
  }

  // On load: restore selection from localStorage
  const saved = JSON.parse(localStorage.getItem("enabledWidgets") || "[]");
  checkboxes.forEach(cb => {
    cb.checked = saved.includes(cb.value);
  });
  updateVisibility();

  checkboxes.forEach(cb => {
    cb.addEventListener("change", updateVisibility);
  });
});