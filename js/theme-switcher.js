// Theme switching functionality
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle")

  if (!themeToggle) return

  // Icons for the compact toggle (declared before first use)
  const SUN = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
  const MOON = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'

  // Get system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  // Initialize theme (use saved preference or system preference)
  let currentTheme = localStorage.getItem("theme") || (prefersDark ? "dark" : "light")

  // Apply initial theme
  document.documentElement.setAttribute("data-theme", currentTheme)
  updateButtonText()

  // Toggle function
  themeToggle.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("data-theme", currentTheme)
    localStorage.setItem("theme", currentTheme)
    updateButtonText()

    // Add a subtle animation
    document.body.style.transition = "background-color 0.3s, color 0.3s"
    setTimeout(() => {
      document.body.style.transition = ""
    }, 300)
  })

  function updateButtonText() {
    // Dark active -> offer Sun (switch to light); Light active -> offer Moon
    themeToggle.innerHTML = currentTheme === "dark" ? SUN : MOON
    themeToggle.setAttribute("aria-label", currentTheme === "dark" ? "Switch to light theme" : "Switch to dark theme")
    themeToggle.setAttribute("title", currentTheme === "dark" ? "Light mode" : "Dark mode")
  }

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      currentTheme = e.matches ? "dark" : "light"
      document.documentElement.setAttribute("data-theme", currentTheme)
      updateButtonText()
    }
  })
})
