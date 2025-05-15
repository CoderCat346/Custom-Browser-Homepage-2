document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("clearStorageBtn").addEventListener("click", () => {
    localStorage.clear();
    location.reload(); // Reloads the current page
    alert("Local history has been cleared.");
  });
})