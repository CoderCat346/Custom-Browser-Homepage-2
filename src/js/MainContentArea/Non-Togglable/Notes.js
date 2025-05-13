const notesArea = document.getElementById("notes-area");

// Load saved notes
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("notes");
  if (saved) notesArea.value = saved;
});

// Auto-save as user types (debounced for performance)
let timeout;
notesArea.addEventListener("input", () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    localStorage.setItem("notes", notesArea.value);
  }, 300); // saves 300ms after the last keystroke
});