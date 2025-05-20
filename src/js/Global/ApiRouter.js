// ApiRouter.js
// This file exposes a global ApiRouter object to manage backend API routing preferences.

window.ApiRouter = (function () {
  const BACKEND_KEY = 'apiBackendPreference';

  // Get saved backend preference from localStorage or return 'default'
  function getBackendPref() {
    return localStorage.getItem(BACKEND_KEY) || 'default';
  }

  // Save backend preference and notify listeners via a custom event
  function setBackendPref(pref) {
    localStorage.setItem(BACKEND_KEY, pref);
    document.dispatchEvent(new CustomEvent('backendPreferenceChanged', { detail: pref }));
  }

  // Given a relative API path like 'api/quran',
  // returns full URL depending on user preference:
  // - null if user wants direct API call (no backend)
  // - URL with default backend prefix if 'default'
  // - URL with custom backend prefix if 'custom:<url>'
  function getApiBase(path) {
    const pref = getBackendPref();

    if (pref === 'direct') {
      // Use direct API calls (frontend calls APIs directly)
      return null;
    }

    if (pref === 'default') {
      // Use your recommended backend URL here
      const backendBase = 'https://backendcbh2.onrender.com/';
      return backendBase + path;
    }

    if (pref.startsWith('custom:')) {
      // Use user provided custom backend URL
      let customBase = pref.slice(7);
      // Ensure it ends with slash for proper concatenation
      if (!customBase.endsWith('/')) customBase += '/';
      return customBase + path;
    }

    // Fallback to null (direct API)
    return null;
  }

  // Register a callback to run whenever backend preference changes
  // Useful for widgets to reload their data live on change
  function onBackendChange(callback) {
    document.addEventListener('backendPreferenceChanged', e => {
      callback(e.detail);
    });
  }

  // Expose public methods
  return {
    getBackendPref,
    setBackendPref,
    getApiBase,
    onBackendChange,
  };
})();
