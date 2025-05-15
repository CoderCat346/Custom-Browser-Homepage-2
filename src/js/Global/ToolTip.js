// Wait until the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  // Map button class names to their respective tooltip text
  const tooltipMap = {
    AddBtn: "Add Shortcut",
    DeleteBtn: "Delete Shortcut",
    ConfirmDeleteBtn: "Confirm Delete",
    SettingsBtn: "Settings",
    ThemeToggleBtn: "Toggle Theme",
    // Add more mappings here as needed
  };

  // Iterate over each entry in the tooltipMap
  Object.entries(tooltipMap).forEach(([className, tooltipText]) => {
    const buttons = document.querySelectorAll(`.${className}`);

    buttons.forEach(btn => {
      let hoverTimer;

      btn.addEventListener("mouseenter", () => {
        hoverTimer = setTimeout(() => {
          showTooltip(btn, tooltipText);
        }, 500); // Delay in milliseconds
        btn._tooltipTimer = hoverTimer;
      });

      btn.addEventListener("mouseleave", (e) => {
        clearTimeout(btn._tooltipTimer);
        hideTooltip(e);
      });
    });
  });

  // Show tooltip function
  function showTooltip(button, text) {
    const tooltip = document.createElement("div");
    tooltip.className = "js-tooltip";
    tooltip.textContent = text;

    Object.assign(tooltip.style, {
      position: "absolute",
      background: "var(--bg-darker)",
      color: "var(--fg-light)",
      padding: "4px 8px",
      borderRadius: "var(--radius-sm)",
      fontSize: "14px",
      whiteSpace: "nowrap",
      boxShadow: "var(--shadow-modal)",
      zIndex: 9999,
      transition: "opacity 0.2s ease",
      opacity: 0,
      pointerEvents: "none",
    });

    document.body.appendChild(tooltip);

    const rect = button.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;

    let left = rect.left + rect.width / 2;
    let top = rect.top - 8;

    if (left - tooltipWidth / 2 < 4) {
      left = tooltipWidth / 2 + 4;
    }
    if (left + tooltipWidth / 2 > window.innerWidth - 4) {
      left = window.innerWidth - tooltipWidth / 2 - 4;
    }
    if (top - tooltipHeight < 4) {
      top = rect.bottom + 8 + tooltipHeight;
      tooltip.style.transform = "translate(-50%, 0)";
    } else {
      tooltip.style.transform = "translate(-50%, -100%)";
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    requestAnimationFrame(() => {
      tooltip.style.opacity = 1;
    });

    button._tooltipElement = tooltip;
  }

  // Hide tooltip function
  function hideTooltip(e) {
    clearTimeout(e.currentTarget._tooltipTimer);
    const tooltip = e.currentTarget._tooltipElement;
    if (tooltip) {
      tooltip.remove();
      e.currentTarget._tooltipElement = null;
    }
  }
});
