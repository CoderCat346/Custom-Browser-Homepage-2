const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const clearBtn = document.getElementById('clear-button');
const suggestionsBox = document.getElementById('suggestions');

// Redirect to Brave Search
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (query) {
    window.location.href = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
  }
});

// Clear button
clearBtn.addEventListener('click', () => {
  input.value = '';
  suggestionsBox.innerHTML = '';
  input.focus();
});