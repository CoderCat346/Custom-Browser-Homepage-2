document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("addModal");
  const addBtn = document.querySelector(".AddBtn");
  const deleteBtn = document.querySelector(".DeleteBtn");
  const confirmDeleteBtn = document.querySelector(".ConfirmDeleteBtn");
  const closeBtn = document.querySelector(".CloseBtn");
  const form = modal.querySelector("form");
  const shortcutsList = document.querySelector(".ShortcutsList");

  const STORAGE_KEY = "shortcuts";
  const DEFAULT_SHORTCUTS = [
    { url: "https://proton.me/" },
    { url: "https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat&duckai=1" },
    { url: "https://github.com/CoderCat346" }
  ];

  let deleteMode = false;

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

  const saveShortcuts = () => {
    const links = [...shortcutsList.querySelectorAll("a")].map(link => ({
      url: link.href
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  };

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

    // For delete mode
    shortcut.addEventListener("click", (e) => {
      if (!deleteMode) return;
      e.preventDefault();
      shortcut.classList.toggle("SelectedForDelete");
    });

    // DRAG AND DROP EVENTS
    shortcut.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", shortcut.dataset.url);
      shortcut.classList.add("dragging");
    });

    shortcut.addEventListener("dragend", () => {
      shortcut.classList.remove("dragging");
    });

    shortcut.addEventListener("dragover", (e) => {
      e.preventDefault();
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
    });

    shortcutsList.appendChild(shortcut);
  };

  deleteBtn.addEventListener("click", () => {
    deleteMode = !deleteMode;
    confirmDeleteBtn.style.display = deleteMode ? "block" : "none";
  });

  confirmDeleteBtn.addEventListener("click", () => {
    const selected = shortcutsList.querySelectorAll(".SelectedForDelete");
    selected.forEach(el => el.remove());
    saveShortcuts();
    confirmDeleteBtn.style.display = "none";
    deleteMode = false;
  });

  addBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = form.querySelector('input[type="url"]').value.trim();
    if (!url || !url.startsWith("http")) return;

    addShortcutElement(url);
    saveShortcuts();
    form.reset();
    modal.style.display = "none";
  });

  loadShortcuts();
});