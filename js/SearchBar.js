document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-button');
  const suggestionsBox = document.getElementById('suggestions');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
    }
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    if (suggestionsBox) {
      suggestionsBox.innerHTML = '';  // Clear suggestions only if the element exists
    }
    searchInput.focus();
  });  
});