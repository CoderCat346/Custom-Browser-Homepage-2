// WidgetToggle.ts

document.addEventListener("DOMContentLoaded", () => {
  const maxWidgets = 2;

  // Get all widget toggle checkboxes
  const checkboxes = document.querySelectorAll<HTMLInputElement>(".widget-toggle");

  // Get warning element for exceeding widget limit
  const warning = document.getElementById("widgetLimitWarning") as HTMLElement | null;

  // Map widget labels to their DOM element IDs
  const widgetMap: Record<string, string> = {
    Quran: "Quran-widget-wrapper",
    Weather: "weather-widget-wrapper",
    RSS: "rss-widget-wrapper",
    News: "news-widget-wrapper",
  };

  // Function to show/hide widgets and enforce maxWidgets limit
  function updateVisibility(): void {
    const selected = Array.from(checkboxes).filter(cb => cb.checked);

    checkboxes.forEach(cb => {
      const widgetId = widgetMap[cb.value];
      const widget = document.getElementById(widgetId);

      if (widget) {
        widget.style.display = cb.checked ? "block" : "none";

        // If Quran widget is turned ON and not already loaded, load it
        if (cb.checked && cb.value === "Quran" && widget.dataset.loaded !== "true") {
          if (typeof window.loadQuranWidget === "function") {
            window.loadQuranWidget();
            widget.dataset.loaded = "true"; // Avoid duplicate loads
          }
        }
      }
    });

    // If more than allowed widgets are selected, revert last toggle and show warning
    if (selected.length > maxWidgets) {
      if (warning) warning.style.display = "inline";
      selected[selected.length - 1].checked = false;
      updateVisibility(); // Re-apply after reverting
    } else {
      if (warning) warning.style.display = "none";
    }

    // Save enabled widget names to localStorage
    const selectedValues = selected.map(cb => cb.value);
    localStorage.setItem("enabledWidgets", JSON.stringify(selectedValues));
  }

  // Restore widget state from localStorage on page load
  const saved = JSON.parse(localStorage.getItem("enabledWidgets") || "[]");

  checkboxes.forEach(cb => {
    cb.checked = saved.includes(cb.value);
  });

  updateVisibility(); // Apply saved state

  // Attach change listener to checkboxes
  checkboxes.forEach(cb => {
    cb.addEventListener("change", updateVisibility);
  });
});

// Declare global function (loaded from external module or attached via window)
interface Window {
  loadQuranWidget?: () => void;
}