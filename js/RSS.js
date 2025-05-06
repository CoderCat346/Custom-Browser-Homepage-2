// Get DOM elements
const rssInput = document.getElementById('rssInput');
const rssSaveBtn = document.getElementById('rssSaveBtn');
const rssContainer = document.getElementById('rssWidgetContainer');
const rssToggleBtn = document.getElementById('rssToggleBtn');
const rssWidgetCreator = document.getElementById('rssWidgetCreator');

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
  const storedFeeds = JSON.parse(localStorage.getItem('rss_feeds') || '[]');
  storedFeeds.forEach(feedUrl => renderRSSWidget(feedUrl));
});

// Save a new RSS feed widget
rssSaveBtn.addEventListener('click', () => {
  const url = rssInput.value.trim();
  if (!url.startsWith('http')) {
    alert('❌ Please enter a valid RSS feed URL.');
    return;
  }

  const storedFeeds = JSON.parse(localStorage.getItem('rss_feeds') || '[]');
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
function renderRSSWidget(feedUrl) {
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
      const stored = JSON.parse(localStorage.getItem('rss_feeds') || '[]');
      const updated = stored.filter(url => url !== feedUrl);
      localStorage.setItem('rss_feeds', JSON.stringify(updated));
      rssContainer.removeChild(wrapper);
    }
  };

  wrapper.appendChild(removeBtn);
  rssContainer.appendChild(wrapper);

  // Fetch and display feed content
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const items = data.items?.slice(0, 5) || [];
      list.innerHTML = items.map(item =>
        `<li><a href="${item.link}" target="_blank">${item.title}</a>
         <small>${new Date(item.pubDate).toLocaleString()}</small></li>`
      ).join('');
    })
    .catch(err => {
      list.innerHTML = `<li style="color:red">⚠️ Failed to load feed.</li>`;
      console.error('RSS load error:', err);
    });
}
