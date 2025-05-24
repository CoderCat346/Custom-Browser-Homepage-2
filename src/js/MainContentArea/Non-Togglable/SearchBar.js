document.addEventListener('DOMContentLoaded', () => {
  // Function to get favicon URL respecting backend toggle
  function getFaviconUrl(siteUrl) {
    const base = ApiRouter.getApiBase("favicon"); // your global backend toggle helper
    if (base) {
      return `${base}?url=${encodeURIComponent(siteUrl)}`;
    } else {
      try {
        const domain = new URL(siteUrl).hostname.replace(/^www\./, '');
        return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
      } catch {
        return siteUrl; // fallback
      }
    }
  }

  const engines = {
    brave: {
      url: 'https://search.brave.com/search?q=',
      icon: getFaviconUrl('https://brave.com')
    },
    duckduckgo: {
      url: 'https://duckduckgo.com/?q=',
      icon: getFaviconUrl('https://duckduckgo.com')
    },
    startpage: {
      url: 'https://www.startpage.com/sp/search?q=',
      icon: getFaviconUrl('https://startpage.com')
    }
  };

  let current = 'brave';

  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-button');
  const selector = document.getElementById('engine-selector');
  const currentIcon = document.getElementById('current-icon');
  const engineList = document.getElementById('engine-list');

  // Populate icons dynamically
  Object.entries(engines).forEach(([key, data]) => {
    const icon = document.createElement('img');
    icon.src = data.icon;
    icon.dataset.engine = key;
    icon.alt = key;
    icon.style.cursor = 'pointer'; // improve UX
    icon.addEventListener('click', () => {
      current = key;
      currentIcon.src = data.icon;
      selector.classList.remove('expanded');
    });
    engineList.appendChild(icon);
  });

  // Set default icon AFTER populating icons
  currentIcon.src = engines[current].icon;

  // Submit handler
  form.addEventListener('submit', e => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) {
      window.location.href = engines[current].url + encodeURIComponent(query);
    }
  });

  // Clear input
  clearBtn.addEventListener('click', () => {
    input.value = '';
    input.focus();
  });

  // Expand selector
  selector.addEventListener('click', e => {
    if (!e.target.dataset.engine) {
      selector.classList.toggle('expanded');
    }
  });
});