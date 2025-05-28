const notesArea = document.getElementById("notes-area") as HTMLTextAreaElement | null;

if (notesArea) {
  // Load saved notes
  window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("notes");
    if (saved) notesArea.value = saved;
  });

  // Auto-save as user types (debounced for performance)
  let timeout: number;
  notesArea.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      localStorage.setItem("notes", notesArea!.value);
    }, 300);
  });
} else {
  console.warn("Element with ID 'notes-area' not found.");
}