document.addEventListener("DOMContentLoaded", () => {
    const rangeInput = document.getElementById("layoutRatio");
    const leftPercentDisplay = document.getElementById("leftPercent");
    const rightPercentDisplay = document.getElementById("rightPercent");
    const column1 = document.querySelector(".WidgetColumn1");
    const column2 = document.querySelector(".WidgetColumn2");

    function applyLayoutRatio(leftPercent) {
        const rightPercent = 100 - leftPercent;
        leftPercentDisplay.textContent = leftPercent;
        rightPercentDisplay.textContent = rightPercent;
        column1.style.width = `${leftPercent}%`;
        column2.style.width = `${rightPercent}%`;
    }

    // Load from localStorage or fallback
    const saved = localStorage.getItem("layoutRatio");
    const initialLeft = saved ? parseInt(saved, 10) : 75;
    rangeInput.value = initialLeft;
    applyLayoutRatio(initialLeft);

    // Update on input
    rangeInput.addEventListener("input", () => {
        const left = parseInt(rangeInput.value, 10);
        localStorage.setItem("layoutRatio", left);
        applyLayoutRatio(left);
    });
});
