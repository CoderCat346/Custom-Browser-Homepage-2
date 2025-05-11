const widget = document.getElementById("news-widget-wrapper");

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
const STORAGE_KEY = "rss-provider";
const CATEGORIES_KEY = "rss-categories";
let currentProvider = localStorage.getItem(STORAGE_KEY) || "bbc";
let selectedCategories = JSON.parse(localStorage.getItem(CATEGORIES_KEY)) || [];

async function fetchRSS(url) {
  if (!url) return [];
  try {
    const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    const data = await res.json();
    if (data.status !== "ok") throw new Error("Invalid RSS");
    return data.items.slice(0, 5);
  } catch (err) {
    console.warn("RSS error:", err.message);
    return [];
  }
}

async function createSection(name, url) {
  const section = document.createElement("div");
  section.className = "rss-section";

  const heading = document.createElement("h3");
  heading.textContent = name[0].toUpperCase() + name.slice(1);
  section.appendChild(heading);

  const items = await fetchRSS(url);
  if (items.length === 0) {
    section.innerHTML += `<p>No items available.</p>`;
    return section;
  }

  const list = document.createElement("ul");
  for (let item of items) {
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

function createCategoryCheckboxes() {
  const categorySection = document.createElement("div");
  categorySection.className = "rss-category-selection";

  CATEGORIES.forEach((category) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = category;
    checkbox.checked = selectedCategories.includes(category);

    checkbox.onchange = () => {
      if (checkbox.checked) {
        selectedCategories.push(category);
      } else {
        selectedCategories = selectedCategories.filter((cat) => cat !== category);
      }
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(selectedCategories));
      renderWidget();
    };

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(category.charAt(0).toUpperCase() + category.slice(1)));
    categorySection.appendChild(label);
  });

  return categorySection;
}

async function renderWidget() {
  widget.innerHTML = "";

  const select = document.createElement("select");
  for (let key in PROVIDERS) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = PROVIDERS[key].name;
    if (key === currentProvider) opt.selected = true;
    select.appendChild(opt);
  }
  select.onchange = () => {
    currentProvider = select.value;
    localStorage.setItem(STORAGE_KEY, currentProvider);
    renderWidget();
  };

  widget.appendChild(select);

  const feeds = PROVIDERS[currentProvider].feeds;
  for (let cat of selectedCategories) {
    const url = feeds[cat];
    if (url) {
      const section = await createSection(cat, url);
      widget.appendChild(section);
    }
  }

  widget.appendChild(createCategoryCheckboxes());
}

renderWidget();