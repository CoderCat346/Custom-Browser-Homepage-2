// ThemeToggleBtn.ts
// Handles toggling between dark and light themes, saving preference in localStorage.

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body!;
  const btn = document.querySelector('.ThemeToggleBtn') as HTMLElement | null;

  if (!btn) return; // Exit if button is not found

  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
  }

  // Toggle theme and store preference
  btn.addEventListener('click', () => {
    const isLight = body.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
});