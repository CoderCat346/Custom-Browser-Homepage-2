document.querySelector(".SettingsBtn").addEventListener("click", () => {
    document.getElementById("SettingsSidebar").classList.add("open");
});

document.getElementById("closeSettingsBtn").addEventListener("click", () => {
    document.getElementById("SettingsSidebar").classList.remove("open");
});
