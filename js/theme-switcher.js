// Theme switching functionality
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle")

  if (!themeToggle) return

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

  // Update button text and icon
  function updateButtonText() {
    const icon = currentTheme === "dark" ? "☀️" : "🌙"
    const text = currentTheme === "dark" ? "Light Mode" : "Dark Mode"
    themeToggle.innerHTML = `<span class="theme-icon">${icon}</span> ${text}`
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
