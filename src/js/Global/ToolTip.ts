// Tooltip.ts - Adds delayed tooltips to UI buttons

document.addEventListener("DOMContentLoaded", () => {
  const tooltipMap: Record<string, string> = {
    AddBtn: "Add Shortcut",
    DeleteBtn: "Delete Shortcut",
    ConfirmDeleteBtn: "Confirm Delete",
    SettingsBtn: "Settings",
    ThemeToggleBtn: "Toggle Theme",
    BackendToggleBtn: "Toggle Backend"
    // Add more mappings as needed
  };

  Object.entries(tooltipMap).forEach(([className, tooltipText]) => {
    const buttons = document.querySelectorAll<HTMLElement>(`.${className}`);

    buttons.forEach((btn) => {
      // Add custom properties to each button element
      const button = btn as HTMLElement & {
        _tooltipTimer?: number;
        _tooltipElement?: HTMLDivElement | null;
      };

      let hoverTimer: number;

      button.addEventListener("mouseenter", () => {
        hoverTimer = window.setTimeout(() => {
          showTooltip(button, tooltipText);
        }, 500);
        button._tooltipTimer = hoverTimer;
      });

      button.addEventListener("mouseleave", (e) => {
        clearTimeout(button._tooltipTimer);
        hideTooltip(e);
      });
    });
  });

  // Function to create and display a tooltip
  function showTooltip(
    button: HTMLElement & { _tooltipElement?: HTMLDivElement | null },
    text: string
  ): void {
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
      pointerEvents: "none"
    });

    document.body.appendChild(tooltip);

    const rect = button.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;

    let left = rect.left + rect.width / 2;
    let top = rect.top - 8;

    // Ensure tooltip doesn't go off screen
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
      tooltip.style.opacity = "1";
    });

    button._tooltipElement = tooltip;
  }

  // Function to remove tooltip
  function hideTooltip(e: MouseEvent): void {
    const target = e.currentTarget as HTMLElement & {
      _tooltipTimer?: number;
      _tooltipElement?: HTMLDivElement | null;
    };

    clearTimeout(target._tooltipTimer);
    const tooltip = target._tooltipElement;
    if (tooltip) {
      tooltip.remove();
      target._tooltipElement = null;
    }
  }
});