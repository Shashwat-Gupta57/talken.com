// js/theme-loader.js (for non-homepage pages)
document.addEventListener('DOMContentLoaded', function() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
});
