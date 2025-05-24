// news.js

const widget = document.getElementById("news-widget-wrapper");

// All RSS providers and their feeds by category
const PROVIDERS = {
  bbc: {
    name: "BBC",
    feeds: {
      world: "https://feeds.bbci.co.uk/news/world/rss.xml",
      sports: "https://feeds.bbci.co.uk/sport/rss.xml?edition=uk",
      finance: "https://feeds.bbci.co.uk/news/business/rss.xml",
      tech: "https://feeds.bbci.co.uk/news/technology/rss.xml",
      education: "https://feeds.bbci.co.uk/news/education/rss.xml",
      environment: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml"
    }
  },
  thehindu: {
    name: "The Hindu",
    feeds: {
      world: "https://www.thehindu.com/news/international/feeder/default.rss",
      sports: "https://www.thehindu.com/sport/feeder/default.rss",
      finance: "https://www.thehindu.com/business/feeder/default.rss",
      tech: "https://www.thehindu.com/sci-tech/technology/feeder/default.rss",
      education: "https://www.thehindu.com/news/education/feeder/default.rss",
      environment: "https://www.thehindu.com/sci-tech/energy-and-environment/feeder/default.rss"
    }
  },
  aljazeera: {
    name: "Al Jazeera",
    feeds: {
      world: "https://www.aljazeera.com/xml/rss/all.xml",
      sports: "https://www.aljazeera.com/xml/rss/sport.xml",
      finance: "https://www.aljazeera.com/xml/rss/economy.xml",
      tech: "",
      education: "",
      environment: ""
    }
  },
  indianexpress: {
    name: "Indian Express",
    feeds: {
      world: "https://indianexpress.com/section/world/feed/",
      sports: "https://indianexpress.com/section/sports/feed/",
      tech: "https://indianexpress.com/section/technology/feed/",
      finance: "https://indianexpress.com/section/business/feed/",
      education: "https://indianexpress.com/section/education/feed/",
      environment: ""
    }
  },
  bloomberg: {
    name: "Bloomberg",
    feeds: {
      finance: "https://www.bloomberg.com/feed/podcast/etf-report.xml",
      tech: "https://www.bloomberg.com/feed/podcast/big-take.xml"
    }
  },
  reuters: {
    name: "Reuters",
    feeds: {
      world: "https://feeds.reuters.com/reuters/worldNews",
      finance: "https://feeds.reuters.com/reuters/businessNews",
      tech: "https://feeds.reuters.com/reuters/technologyNews",
      environment: "https://feeds.reuters.com/reuters/environment"
    }
  },
  guardian: {
    name: "The Guardian",
    feeds: {
      world: "https://www.theguardian.com/world/rss",
      environment: "https://www.theguardian.com/environment/rss",
      tech: "https://www.theguardian.com/uk/technology/rss",
      education: "https://www.theguardian.com/education/rss"
    }
  },
  nytimes: {
    name: "NY Times",
    feeds: {
      world: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
      tech: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
      finance: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
      education: "https://rss.nytimes.com/services/xml/rss/nyt/Education.xml",
      environment: "https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml"
    }
  }
};

const CATEGORIES = ["world", "sports", "finance", "tech", "education", "environment"];

const STORAGE_PROVIDER = "rss-provider";
const STORAGE_CATEGORIES = "rss-categories";

// Load user choices or defaults
let currentProvider = localStorage.getItem(STORAGE_PROVIDER) || "bbc";
let selectedCategories = JSON.parse(localStorage.getItem(STORAGE_CATEGORIES)) || CATEGORIES.slice(0, 3);

// Helper to build the RSS fetch URL based on ApiRouter preference and feed URL
function getEndpointURL(feedUrl) {
  const apiBase = ApiRouter.getApiBase("api/rss");
  if (!apiBase) {
    // direct mode: use public rss2json proxy
    return `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
  }
  // backend proxy mode (default or custom)
  return `${apiBase}?url=${encodeURIComponent(feedUrl)}`;
}

// Cache fetch with TTL in minutes
async function fetchRSSWithCache(feedUrl, cacheKey, ttlMinutes = 10) {
  const now = Date.now();
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (now - parsed.timestamp < ttlMinutes * 60 * 1000) {
        return parsed.items;
      }
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  try {
    const endpoint = getEndpointURL(feedUrl);
    const res = await fetch(endpoint);
    const data = await res.json();

    if (data.status !== "ok" || !data.items) throw new Error("Invalid RSS feed");

    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, items: data.items }));
    return data.items;
  } catch (err) {
    console.warn("RSS fetch failed:", err.message);
    return [];
  }
}

// Create section for one category feed
async function createSection(category, feedUrl) {
  const section = document.createElement("div");
  section.className = "rss-section";

  const heading = document.createElement("h3");
  heading.textContent = category.charAt(0).toUpperCase() + category.slice(1);
  section.appendChild(heading);

  const cacheKey = `rss-cache-${currentProvider}-${category}`;
  const items = await fetchRSSWithCache(feedUrl, cacheKey);

  if (!items || items.length === 0) {
    section.innerHTML += `<p>No items available.</p>`;
    return section;
  }

  const list = document.createElement("ul");
  for (let item of items.slice(0, 5)) {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = item.link;
    link.textContent = item.title;
    link.target = "_blank";
    li.appendChild(link);
    list.appendChild(li);
  }
  section.appendChild(list);
  return section;
}

// Create category checkbox selectors UI
function createCategoryCheckboxes() {
  const wrapper = document.createElement("div");
  wrapper.className = "rss-category-selection";

  CATEGORIES.forEach(cat => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = cat;
    checkbox.checked = selectedCategories.includes(cat);

    checkbox.onchange = () => {
      if (checkbox.checked) {
        selectedCategories.push(cat);
      } else {
        selectedCategories = selectedCategories.filter(c => c !== cat);
      }
      localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(selectedCategories));
      renderWidget();
    };

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(cat.charAt(0).toUpperCase() + cat.slice(1)));
    wrapper.appendChild(label);
  });

  return wrapper;
}

// Main render function
async function renderWidget() {
  if (!widget) return;

  widget.innerHTML = "";

  // Provider dropdown
  const providerSelect = document.createElement("select");
  for (const key in PROVIDERS) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = PROVIDERS[key].name;
    if (key === currentProvider) option.selected = true;
    providerSelect.appendChild(option);
  }
  providerSelect.onchange = () => {
    currentProvider = providerSelect.value;
    localStorage.setItem(STORAGE_PROVIDER, currentProvider);
    renderWidget();
  };
  widget.appendChild(providerSelect);

  // Render sections for selected categories
  const feeds = PROVIDERS[currentProvider].feeds;
  for (const category of selectedCategories) {
    const feedUrl = feeds[category];
    if (feedUrl) {
      const section = await createSection(category, feedUrl);
      widget.appendChild(section);
    }
  }

  // Append category selectors
  widget.appendChild(createCategoryCheckboxes());
}

// Re-render widget when backend routing preference changes
ApiRouter.onBackendChange(() => {
  renderWidget();
});

// Initial widget render
renderWidget();
