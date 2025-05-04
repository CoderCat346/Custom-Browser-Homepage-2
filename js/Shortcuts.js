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

  // Load shortcuts from localStorage or use defaults
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

  // Save current shortcut list to localStorage
  const saveShortcuts = () => {
    const links = [...shortcutsList.querySelectorAll("a")].map(link => ({
      url: link.href
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  };

  // Add a shortcut button with favicon
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

    const img = document.createElement("img");
    img.src = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    img.alt = domain;
    img.style.width = "24px";
    img.style.height = "24px";

    shortcut.appendChild(img);

    // Click to mark for delete in delete mode
    shortcut.addEventListener("click", (e) => {
      if (!deleteMode) return;
      e.preventDefault();
      shortcut.classList.toggle("SelectedForDelete");
    });

    shortcutsList.appendChild(shortcut);
  };

  // Toggle delete mode on and off
  deleteBtn.addEventListener("click", () => {
    deleteMode = !deleteMode;
    confirmDeleteBtn.style.display = deleteMode ? "block" : "none";
  });

  // Confirm deletion of selected shortcuts
  confirmDeleteBtn.addEventListener("click", () => {
    const selected = shortcutsList.querySelectorAll(".SelectedForDelete");
    selected.forEach(el => el.remove());
    saveShortcuts();
    confirmDeleteBtn.style.display = "none";
    deleteMode = false;
  });

  // Open modal
  addBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal if clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Handle form submission
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
