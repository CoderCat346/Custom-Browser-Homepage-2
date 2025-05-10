// scripts/theme-toggle.js

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const btn = document.querySelector('.ThemeToggleBtn');

  // Set theme from local storage on page load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
  }

  // Toggle theme on button click
  btn.addEventListener('click', () => {
    const isLight = body.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
});
