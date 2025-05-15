const sidebar = document.getElementById("SettingsSidebar");
const settingsBtn = document.querySelector(".SettingsBtn");

// Open sidebar
settingsBtn.addEventListener("click", () => {
    sidebar.classList.add("open");
});

// Close sidebar when clicking outside of it
document.addEventListener("click", (event) => {
    const isClickInside = sidebar.contains(event.target) || settingsBtn.contains(event.target);
    if (!isClickInside) {
        sidebar.classList.remove("open");
    }
});