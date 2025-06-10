document.addEventListener("DOMContentLoaded", () => {
  const clearBtn = document.getElementById("clearStorageBtn");
  if (!clearBtn) {
    console.warn('Element with id "clearStorageBtn" not found.');
    return;
  }
  clearBtn.addEventListener("click", () => {
    localStorage.clear();
    location.reload(); // Reloads the current page
    alert("Local history has been cleared.");
  });
});