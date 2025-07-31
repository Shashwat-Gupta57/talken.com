// Navigation functionality
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuToggle = document.getElementById("mobileMenuToggle")
  const sideMenu = document.getElementById("sideMenu")
  const mainContent = document.querySelector(".main-content")

  // Mobile menu toggle functionality
  if (mobileMenuToggle && sideMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      sideMenu.classList.toggle("active")

      // Animate hamburger menu
      const spans = mobileMenuToggle.querySelectorAll("span")
      if (sideMenu.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
        spans[1].style.opacity = "0"
        spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
      } else {
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      }
    })

    // Close mobile menu when clicking outside
    document.addEventListener("click", (event) => {
      if (window.innerWidth <= 768) {
        if (!sideMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
          sideMenu.classList.remove("active")

          // Reset hamburger menu
          const spans = mobileMenuToggle.querySelectorAll("span")
          spans[0].style.transform = "none"
          spans[1].style.opacity = "1"
          spans[2].style.transform = "none"
        }
      }
    })

    // Close mobile menu when clicking on a link
    const menuLinks = sideMenu.querySelectorAll("a")
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          sideMenu.classList.remove("active")

          // Reset hamburger menu
          const spans = mobileMenuToggle.querySelectorAll("span")
          spans[0].style.transform = "none"
          spans[1].style.opacity = "1"
          spans[2].style.transform = "none"
        }
      })
    })
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      sideMenu.classList.remove("active")

      // Reset hamburger menu
      if (mobileMenuToggle) {
        const spans = mobileMenuToggle.querySelectorAll("span")
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      }
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
