const sidebar = document.getElementById("SettingsSidebar");
const settingsBtn = document.querySelector(".SettingsBtn");

if (sidebar && settingsBtn) {
  // Open sidebar
  settingsBtn.addEventListener("click", () => {
    sidebar.classList.add("open");
  });

  // Close sidebar when clicking outside of it
  document.addEventListener("click", (event) => {
    const target = event.target as Node | null;
    const isClickInside =
      target !== null && (sidebar.contains(target) || settingsBtn.contains(target));
    if (!isClickInside) {
      sidebar.classList.remove("open");
    }
  });
} else {
  console.error("Sidebar or SettingsBtn element not found.");
}
