document.addEventListener("DOMContentLoaded", () => {
  // === DOM ELEMENT REFERENCES ===
  const modal = document.getElementById("addModal");
  const addBtn = document.querySelector(".AddBtn");
  const deleteBtn = document.querySelector(".DeleteBtn");
  const confirmDeleteBtn = document.querySelector(".ConfirmDeleteBtn");
  const closeBtn = document.querySelector(".CloseBtn");
  const form = modal.querySelector("form");
  const shortcutsList = document.querySelector(".ShortcutsList");

  // === CONSTANTS ===
  const STORAGE_KEY = "shortcuts";
  const DEFAULT_SHORTCUTS = [
    { url: "https://proton.me/" },
    { url: "https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat&duckai=1" },
    { url: "https://github.com/CoderCat346" }
  ];

  // === STATE ===
  let deleteMode = false;

  // Placeholder element to show where dragged item will land
  const placeholder = document.createElement("div");
  placeholder.className = "ShortcutPlaceholder";

  // === LOAD SHORTCUTS FROM STORAGE OR DEFAULT ===
  const loadShortcuts = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let shortcuts;

    if (saved) {
      try {
        shortcuts = JSON.parse(saved);
      } catch (err) {
        shortcuts = [];
      }
    } else {
      shortcuts = DEFAULT_SHORTCUTS;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
    }

    shortcuts.forEach((item) => {
      if (item.url) {
        addShortcutElement(item.url);
      }
    });
  };

  // === SAVE CURRENT SHORTCUT LIST TO LOCALSTORAGE ===
  const saveShortcuts = () => {
    const links = [...shortcutsList.querySelectorAll("a.ShortcutBtn")].map(link => ({
      url: link.href
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  };

  // === CREATE AND APPEND A SHORTCUT ELEMENT ===
  const addShortcutElement = (url) => {
    if (!url || !url.startsWith("http")) return;

    let domain;
    try {
      domain = new URL(url).hostname;
    } catch (e) {
      return;
    }

    const shortcut = document.createElement("a");
    shortcut.href = url;
    shortcut.target = "_blank";
    shortcut.className = "ShortcutBtn";
    shortcut.draggable = true;
    shortcut.dataset.url = url;

    const img = document.createElement("img");
    img.src = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    img.alt = domain;
    img.style.width = "24px";
    img.style.height = "24px";

    shortcut.appendChild(img);

    // === DELETE MODE CLICK ===
    shortcut.addEventListener("click", (e) => {
      if (!deleteMode) return;
      e.preventDefault();
      shortcut.classList.toggle("SelectedForDelete");
    });

    // === DRAG & DROP EVENTS (DESKTOP) ===
    shortcut.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", shortcut.dataset.url);
      shortcut.classList.add("dragging");
    });

    shortcut.addEventListener("dragend", () => {
      shortcut.classList.remove("dragging");
      if (placeholder.parentNode) placeholder.remove();
    });

    shortcut.addEventListener("dragover", (e) => {
      e.preventDefault(); // Needed to allow drop
      const dragging = document.querySelector(".dragging");
      if (dragging && dragging !== shortcut && shortcut.parentNode === shortcutsList) {
        shortcutsList.insertBefore(placeholder, shortcut);
      }
    });

    shortcut.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggedUrl = e.dataTransfer.getData("text/plain");
      const draggedEl = [...shortcutsList.children].find(
        el => el.dataset.url === draggedUrl
      );
      if (draggedEl && draggedEl !== shortcut) {
        shortcutsList.insertBefore(draggedEl, shortcut);
        saveShortcuts();
      }
      if (placeholder.parentNode) placeholder.remove();
    });

    // === TOUCH SUPPORT (MOBILE DEVICES) ===
    let touchStartY = 0;

    shortcut.addEventListener("touchstart", (e) => {
      shortcut.classList.add("dragging");
      touchStartY = e.touches[0].clientY;
    });

    shortcut.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const dragging = document.querySelector(".dragging");

      if (target && target.classList.contains("ShortcutBtn") && target !== dragging) {
        shortcutsList.insertBefore(placeholder, target);
      }

      e.preventDefault(); // Prevents scrolling during drag
    });

    shortcut.addEventListener("touchend", () => {
      const dragging = document.querySelector(".dragging");
      if (placeholder.parentNode && dragging) {
        shortcutsList.insertBefore(dragging, placeholder);
        saveShortcuts();
      }
      if (dragging) dragging.classList.remove("dragging");
      if (placeholder.parentNode) placeholder.remove();
    });

    // Add to DOM
    shortcutsList.appendChild(shortcut);
  };

  // === TOGGLE DELETE MODE ===
  deleteBtn.addEventListener("click", () => {
    deleteMode = !deleteMode;
    confirmDeleteBtn.style.display = deleteMode ? "block" : "none";
  });

  // === DELETE CONFIRMED SHORTCUTS ===
  confirmDeleteBtn.addEventListener("click", () => {
    const selected = shortcutsList.querySelectorAll(".SelectedForDelete");
    selected.forEach(el => el.remove());
    saveShortcuts();
    confirmDeleteBtn.style.display = "none";
    deleteMode = false;
  });

  // === OPEN ADD MODAL ===
  addBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // === CLOSE ADD MODAL ===
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // === CLOSE MODAL BY CLICKING OUTSIDE ===
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // === HANDLE SHORTCUT FORM SUBMISSION ===
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = form.querySelector('input[type="url"]').value.trim();
    if (!url || !url.startsWith("http")) return;

    addShortcutElement(url);
    saveShortcuts();
    form.reset();
    modal.style.display = "none";
  });

  // === INIT ===
  loadShortcuts();
});
