// Get references to the form, input field, and clear button
const searchForm = document.getElementById('search-form'); // The search form element
const searchInput = document.getElementById('search-input'); // The search text field

// Search form submission handler
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();     // Prevent default form submission (page reload)
    const searchQuery = searchInput.value.trim(); // Get and trim the user input

    if (searchQuery !== '') {
        // Construct search engine URL (Startpage here, can be replaced)
        const searchUrl = `https://search.brave.com/search?q=${encodeURIComponent(searchQuery)}`;
        window.location.href = searchUrl; // Redirect to the search results
    } else {
        console.log('Please enter a search term.'); // Optional fallback
    }
});