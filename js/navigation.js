// Navigation functionality for top nav and right sidebar
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle")
  const rightSidebar = document.getElementById("rightSidebar")
  const sidebarOverlay = document.getElementById("sidebarOverlay")
  const floatingNavHeader = document.getElementById("floatingNavHeader")

  // Menu toggle functionality
  if (menuToggle && rightSidebar) {
    menuToggle.addEventListener("click", () => {
      rightSidebar.classList.toggle("active")
      sidebarOverlay.classList.toggle("active")
      floatingNavHeader.classList.toggle("active")
      menuToggle.classList.toggle("active")
    })

    // Close sidebar when clicking overlay
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener("click", () => {
        rightSidebar.classList.remove("active")
        sidebarOverlay.classList.remove("active")
        floatingNavHeader.classList.remove("active")
        menuToggle.classList.remove("active")
      })
    }

    // Close sidebar when clicking on a link
    const menuLinks = rightSidebar.querySelectorAll("a")
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        rightSidebar.classList.remove("active")
        sidebarOverlay.classList.remove("active")
        floatingNavHeader.classList.remove("active")
        menuToggle.classList.remove("active")
      })
    })
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      rightSidebar.classList.remove("active")
      sidebarOverlay.classList.remove("active")
      floatingNavHeader.classList.remove("active")
      menuToggle.classList.remove("active")
    }
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
})
