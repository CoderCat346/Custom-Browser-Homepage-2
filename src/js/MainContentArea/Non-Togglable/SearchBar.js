document.addEventListener('DOMContentLoaded', () => {
  const FAVICON_PROXY = 'https://backendcbh2.onrender.com/favicon?url=';

  const engines = {
    brave: {
      url: 'https://search.brave.com/search?q=',
      icon: FAVICON_PROXY + 'https://brave.com'
    },
    duckduckgo: {
      url: 'https://duckduckgo.com/?q=',
      icon: FAVICON_PROXY + 'https://duckduckgo.com'
    },
    startpage: {
      url: 'https://www.startpage.com/sp/search?q=',
      icon: FAVICON_PROXY + 'https://startpage.com'
    }
  };
  

  let current = 'brave';

  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-button');
  const selector = document.getElementById('engine-selector');
  const currentIcon = document.getElementById('current-icon');
  const engineList = document.getElementById('engine-list');

  // Populate icons
  Object.entries(engines).forEach(([key, data]) => {
    const icon = document.createElement('img');
    icon.src = data.icon;
    icon.dataset.engine = key;
    icon.alt = key;
    icon.addEventListener('click', () => {
      current = key;
      currentIcon.src = data.icon;
      selector.classList.remove('expanded');
    });
    engineList.appendChild(icon);
  });

  // Set default engine
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
