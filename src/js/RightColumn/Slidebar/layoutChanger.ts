document.addEventListener("DOMContentLoaded", () => {
  // Get the range input element by ID and assert it's an HTMLInputElement (non-null)
  const rangeInput = document.getElementById("layoutRatio") as HTMLInputElement;

  // Get display elements and columns, use non-null assertion (!) because we're sure they exist
  const leftPercentDisplay = document.getElementById("leftPercent")!;
  const rightPercentDisplay = document.getElementById("rightPercent")!;
  const column1 = document.querySelector(".WidgetColumn1") as HTMLElement;
  const column2 = document.querySelector(".WidgetColumn2") as HTMLElement;

  /**
   * Update the UI and layout widths based on left column percentage
   * @param leftPercent Percentage width of left column (0-100)
   */
  function applyLayoutRatio(leftPercent: number) {
    // Calculate right column width so total is always 100%
    const rightPercent = 100 - leftPercent;

    // Update text content for the percentage displays
    leftPercentDisplay.textContent = leftPercent.toString();
    rightPercentDisplay.textContent = rightPercent.toString();

    // Set CSS widths for both columns
    column1.style.width = `${leftPercent}%`;
    column2.style.width = `${rightPercent}%`;
  }

  // Load saved layout ratio from localStorage or default to 75%
  const saved = localStorage.getItem("layoutRatio");
  const initialLeft = saved ? parseInt(saved, 10) : 75;

  // Set the range input's value to the loaded or default value
  rangeInput.value = initialLeft.toString();

  // Apply initial layout widths based on loaded/default value
  applyLayoutRatio(initialLeft);

  // Listen for changes on the range input
  rangeInput.addEventListener("input", () => {
    // Parse the new left column width percentage from input value
    const left = parseInt(rangeInput.value, 10);

    // Save the new layout ratio to localStorage for persistence
    localStorage.setItem("layoutRatio", left.toString());

    // Apply the new layout widths to columns and displays
    applyLayoutRatio(left);
  });
});
