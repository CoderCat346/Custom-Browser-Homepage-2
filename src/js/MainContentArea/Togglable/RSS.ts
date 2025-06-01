// Type definitions
interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
}

interface RSSResponse {
  status: string;
  items?: RSSItem[];
  error?: string;
}

// DOM elements with type assertions
const rssInput = document.getElementById('rssInput') as HTMLInputElement;
const rssSaveBtn = document.getElementById('rssSaveBtn') as HTMLButtonElement;
const rssContainer = document.getElementById('rssWidgetContainer') as HTMLDivElement;
const rssToggleBtn = document.getElementById('rssToggleBtn') as HTMLButtonElement;
const rssWidgetCreator = document.getElementById('rssWidgetCreator') as HTMLDivElement;

// Toggle visibility of RSS creator UI
rssToggleBtn.addEventListener('click', () => {
  if (rssWidgetCreator.style.display === 'none') {
    rssWidgetCreator.style.display = 'block';
    rssToggleBtn.textContent = 'Hide RSS Widget Creator';
  } else {
    rssWidgetCreator.style.display = 'none';
    rssToggleBtn.textContent = 'Show RSS Widget Creator';
  }
});

// On load: fetch stored RSS feeds and render them
window.addEventListener('DOMContentLoaded', () => {
  const storedFeeds: string[] = JSON.parse(localStorage.getItem('rss_feeds') || '[]');
  storedFeeds.forEach((feedUrl: string) => renderRSSWidget(feedUrl));
});

// Save a new RSS feed widget
rssSaveBtn.addEventListener('click', () => {
  const url = rssInput.value.trim();
  if (!url.startsWith('http')) {
    alert('❌ Please enter a valid RSS feed URL.');
    return;
  }

  const storedFeeds: string[] = JSON.parse(localStorage.getItem('rss_feeds') || '[]');
  if (storedFeeds.includes(url)) {
    alert('⚠️ This feed is already added.');
    return;
  }

  storedFeeds.push(url);
  localStorage.setItem('rss_feeds', JSON.stringify(storedFeeds));
  renderRSSWidget(url);
  rssInput.value = '';
});

// Render a feed card
function renderRSSWidget(feedUrl: string): void {
  const wrapper = document.createElement('div');
  wrapper.classList.add('rss-card');

  const label = document.createElement('h4');
  label.textContent = `📥 Feed: ${feedUrl}`;
  wrapper.appendChild(label);

  const list = document.createElement('ul');
  list.innerHTML = '<li>Loading...</li>';
  wrapper.appendChild(list);

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove RSS Widget';
  removeBtn.onclick = () => {
    if (confirm('Remove this RSS widget?')) {
      const stored: string[] = JSON.parse(localStorage.getItem('rss_feeds') || '[]');
      const updated = stored.filter(url => url !== feedUrl);
      localStorage.setItem('rss_feeds', JSON.stringify(updated));
      rssContainer.removeChild(wrapper);
    }
  };

  wrapper.appendChild(removeBtn);
  rssContainer.appendChild(wrapper);

  const apiBase = ApiRouter.getApiBase("api/rss");
  const apiUrl = apiBase
    ? `${apiBase}?url=${encodeURIComponent(feedUrl)}`
    : `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;

  fetch(apiUrl)
    .then(res => res.json())
    .then((data: RSSResponse) => {
      if (data.status === 'ok' && data.items) {
        const items = data.items;
        list.innerHTML = items.map(item =>
          `<li>
            <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>
            <small>${new Date(item.pubDate).toLocaleString()}</small>
          </li>`
        ).join('');
      } else {
        list.innerHTML = `<li style="color:red">⚠️ Failed to load feed.</li>`;
        console.error('RSS backend error:', data.error || 'Unknown error');
      }
    })
    .catch(err => {
      list.innerHTML = `<li style="color:red">⚠️ Failed to load feed.</li>`;
      console.error('Fetch error:', err);
    });
}

// Re-render RSS widgets when backend routing changes
ApiRouter.onBackendChange(() => {
  rssContainer.innerHTML = '';
  const storedFeeds: string[] = JSON.parse(localStorage.getItem('rss_feeds') || '[]');
  storedFeeds.forEach(feedUrl => renderRSSWidget(feedUrl));
});
