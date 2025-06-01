document.addEventListener("DOMContentLoaded", () => {
  // === DOM ELEMENT REFERENCES ===
  const modal = document.getElementById("addModal") as HTMLElement;
  const addBtn = document.querySelector(".AddBtn") as HTMLElement;
  const deleteBtn = document.querySelector(".DeleteBtn") as HTMLElement;
  const confirmDeleteBtn = document.querySelector(".ConfirmDeleteBtn") as HTMLElement;
  const closeBtn = document.querySelector(".CloseBtn") as HTMLElement;
  const form = modal.querySelector("form") as HTMLFormElement;
  const shortcutsList = document.querySelector(".ShortcutsList") as HTMLElement;

  // === CONSTANTS ===
  const STORAGE_KEY = "shortcuts";
  const DEFAULT_SHORTCUTS: { url: string }[] = [
    { url: "https://proton.me/" },
    { url: "https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat&duckai=1" },
    { url: "https://github.com/CoderCat346" }
  ];

  // === STATE ===
  let deleteMode = false;

  const placeholder = document.createElement("div");
  placeholder.className = "ShortcutPlaceholder";

  const loadShortcuts = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let shortcuts: { url: string }[];

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
    const links = Array.from(shortcutsList.querySelectorAll("a.ShortcutBtn")).map(link => ({
      url: (link as HTMLAnchorElement).href
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  };

  const getFaviconUrl = (siteUrl: string): string => {
    const base = (window as any).ApiRouter?.getApiBase("favicon");
    if (base) {
      return `${base}?url=${encodeURIComponent(siteUrl)}`;
    } else {
      try {
        const domain = new URL(siteUrl).hostname.replace(/^www\./, "");
        return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
      } catch {
        return siteUrl;
      }
    }
  };

  const addShortcutElement = (url: string): void => {
    if (!url || !url.startsWith("http")) return;

    let domain: string;
    try {
      domain = new URL(url).hostname;
    } catch {
      return;
    }

    const shortcut = document.createElement("a");
    shortcut.href = url;
    shortcut.target = "_blank";
    shortcut.className = "ShortcutBtn";
    shortcut.draggable = true;
    shortcut.dataset.url = url;

    const img = document.createElement("img");
    img.src = getFaviconUrl(url);
    img.alt = "favicon";
    img.style.width = "24px";
    img.style.height = "24px";

    shortcut.appendChild(img);

    shortcut.addEventListener("click", (e) => {
      if (!deleteMode) return;
      e.preventDefault();
      shortcut.classList.toggle("SelectedForDelete");
    });

    shortcut.addEventListener("dragstart", (e: DragEvent) => {
      if (e.dataTransfer) {
        e.dataTransfer.setData("text/plain", shortcut.dataset.url || "");
      }
      shortcut.classList.add("dragging");
    });

    shortcut.addEventListener("dragend", () => {
      shortcut.classList.remove("dragging");
      if (placeholder.parentNode) placeholder.remove();
    });

    shortcut.addEventListener("dragover", (e) => {
      e.preventDefault();
      const dragging = document.querySelector(".dragging");
      if (dragging && dragging !== shortcut && shortcut.parentNode === shortcutsList) {
        shortcutsList.insertBefore(placeholder, shortcut);
      }
    });

    shortcut.addEventListener("drop", (e: DragEvent) => {
      e.preventDefault();
      const draggedUrl = e.dataTransfer?.getData("text/plain") || "";
      const draggedEl = Array.from(shortcutsList.children).find(
        el => (el as HTMLElement).dataset.url === draggedUrl
      );

      if (draggedEl && draggedEl !== shortcut) {
        shortcutsList.insertBefore(draggedEl, shortcut);
        saveShortcuts();
      }
      if (placeholder.parentNode) placeholder.remove();
    });

    // Touch support
    let touchStartY = 0;

    shortcut.addEventListener("touchstart", (e: TouchEvent) => {
      shortcut.classList.add("dragging");
      touchStartY = e.touches[0].clientY;
    });

    shortcut.addEventListener("touchmove", (e: TouchEvent) => {
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const dragging = document.querySelector(".dragging");

      if (target && target.classList.contains("ShortcutBtn") && target !== dragging) {
        shortcutsList.insertBefore(placeholder, target);
      }

      e.preventDefault();
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

  window.addEventListener("click", (e: MouseEvent) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="url"]') as HTMLInputElement;
    const url = input.value.trim();
    if (!url || !url.startsWith("http")) return;

    addShortcutElement(url);
    saveShortcuts();
    form.reset();
    modal.style.display = "none";
  });

  loadShortcuts();
});
