// Loading Screen Functionality
let loadingProgress = 0;
let assetsLoaded = 0;
let totalAssets = 0;
const progressFill = document.getElementById("progress-fill");
const progressPercentage = document.getElementById("progress-percentage");
const loadingScreen = document.getElementById("loading-screen");

// Check if coming from welcome page for seamless transition
const urlParams = new URLSearchParams(window.location.search);
const isComingFromWelcome =
  urlParams.get("from") === "welcome" ||
  (document.referrer.includes(window.location.origin) &&
    !document.referrer.includes("/website/"));

// Start loading animation and asset tracking
document.addEventListener("DOMContentLoaded", function () {
  // If coming from welcome page, show a faster, more seamless loading
  if (isComingFromWelcome) {
    startSeamlessTransition();
  } else {
    trackAssetLoading();
    startLoadingAnimation();
  }
});

function startSeamlessTransition() {
  // Add smooth fade-in classes for seamless transition
  const loadingContent = document.querySelector(".loading-content");
  if (loadingContent) {
    loadingContent.classList.add("from-welcome");
  }

  // Much faster loading for seamless transition
  totalAssets = 5; // Reduced for faster loading

  // Quick progress animation with slight delay to allow fade-in
  setTimeout(() => {
    const quickInterval = setInterval(() => {
      loadingProgress += 25;
      updateProgressBar(loadingProgress);

      if (loadingProgress >= 100) {
        clearInterval(quickInterval);
        setTimeout(() => {
          hideLoadingScreen();
          // Clean up URL parameter after transition
          if (urlParams.get("from") === "welcome") {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
          }
        }, 600); // Slightly longer delay to enjoy the smooth transition
      }
    }, 200); // Slightly slower for better visual effect
  }, 100); // Small delay to allow initial fade-in
}

function trackAssetLoading() {
  // Count total assets to load
  const images = document.querySelectorAll("img");
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  const scripts = document.querySelectorAll("script[src]");

  totalAssets = images.length + stylesheets.length + scripts.length + 3; // +3 for fonts

  // Track image loading
  images.forEach((img) => {
    if (img.complete) {
      incrementProgress();
    } else {
      img.addEventListener("load", incrementProgress);
      img.addEventListener("error", incrementProgress);
    }
  });

  // Track stylesheet loading
  stylesheets.forEach((link) => {
    if (link.sheet) {
      incrementProgress();
    } else {
      link.addEventListener("load", incrementProgress);
      link.addEventListener("error", incrementProgress);
    }
  });

  // Track script loading
  scripts.forEach((script) => {
    script.addEventListener("load", incrementProgress);
    script.addEventListener("error", incrementProgress);
  });

  // Track font loading
  if (document.fonts) {
    document.fonts.ready.then(() => {
      incrementProgress(); // Comic Neue
      incrementProgress(); // Fredoka One
      incrementProgress(); // Font Awesome
    });
  } else {
    // Fallback for older browsers
    setTimeout(() => {
      incrementProgress();
      incrementProgress();
      incrementProgress();
    }, 1000);
  }

  // Fallback: ensure loading completes even if some assets fail
  setTimeout(() => {
    if (loadingProgress < 100) {
      loadingProgress = 100;
      updateProgressBar(100);
      setTimeout(hideLoadingScreen, 500);
    }
  }, 1000); // 1 second maximum loading time
}

function incrementProgress() {
  assetsLoaded++;
  const realProgress = (assetsLoaded / totalAssets) * 100;
  loadingProgress = Math.max(loadingProgress, realProgress);

  if (loadingProgress >= 100) {
    setTimeout(hideLoadingScreen, 500);
  }
}

function startLoadingAnimation() {
  const loadingInterval = setInterval(() => {
    // Smooth progress animation that catches up to real progress
    const targetProgress = Math.min(loadingProgress, 100);
    const currentProgress = progressFill
      ? parseFloat(progressFill.style.width) || 0
      : 0;

    if (currentProgress < targetProgress) {
      const increment = Math.min(
        (targetProgress - currentProgress) * 0.1 + 1,
        5
      );
      const newProgress = Math.min(currentProgress + increment, targetProgress);
      updateProgressBar(newProgress);

      if (newProgress >= 100) {
        clearInterval(loadingInterval);
      }
    }
  }, 50); // Update every 50ms for smooth animation
}

function updateProgressBar(progress) {
  if (progressFill && progressPercentage) {
    progressFill.style.width = progress + "%";
    progressPercentage.textContent = Math.round(progress) + "%";
  }
}

function hideLoadingScreen() {
  if (loadingScreen) {
    loadingScreen.classList.add("fade-out");
    // Remove the loading screen from DOM after animation completes
    setTimeout(() => {
      loadingScreen.style.display = "none";
      // Enable body scrolling
      document.body.style.overflow = "auto";

      // Check for mobile device and show notice if needed
      checkAndShowMobileNotice();
    }, 800);
  }
}

// Mobile Detection and Notice Functionality
function isMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Check for mobile user agents
  const mobileRegex =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;

  // Also check screen size for additional mobile detection
  const isSmallScreen = window.innerWidth <= 768;

  // Check for touch capability
  const hasTouchScreen =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  return mobileRegex.test(userAgent) || (isSmallScreen && hasTouchScreen);
}

function checkAndShowMobileNotice() {
  if (isMobileDevice()) {
    showMobileNotice();
  }
}

function showMobileNotice() {
  const mobileNotice = document.getElementById("mobile-notice");
  const continueBtn = document.getElementById("mobile-continue-btn");

  if (mobileNotice) {
    // Show the mobile notice
    mobileNotice.classList.remove("show");

    // Prevent body scrolling while notice is shown
    document.body.style.overflow = "show";

    // Show continue button after 2 seconds
    setTimeout(() => {
      if (continueBtn) {
        continueBtn.classList.remove("show");
      }
    }, 500);

    // Add click handler for continue button
    if (continueBtn) {
      continueBtn.addEventListener("click", hideMobileNotice);
    }
  }
}

function hideMobileNotice() {
  const mobileNotice = document.getElementById("mobile-notice");

  if (mobileNotice) {
    mobileNotice.classList.add("hidden");

    // Re-enable body scrolling
    setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 500);
  }
}

// Prevent scrolling while loading
document.body.style.overflow = "hidden";

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initSmoothScrolling();
  initFloatingCards();
  initStatsCounter();
  initScrollEffects();
  initNavbarEffects();
  fetchGitHubStats();
  initPlayfulInteractions();
  createRandomEmojis();
}); // Smooth scrolling for navigation links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Enhanced floating card interactions
function initFloatingCards() {
  const cards = document.querySelectorAll(".floating-card");

  cards.forEach((card, index) => {
    // Add random initial delay to animations
    card.style.animationDelay = `${index * 0.5}s`;

    // Add hover effect that changes card colors
    card.addEventListener("mouseenter", function () {
      const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#ef4444"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      this.style.borderColor = randomColor;
      const icon = this.querySelector("i");
      if (icon) {
        icon.style.color = randomColor;
      }
    });

    card.addEventListener("mouseleave", function () {
      this.style.borderColor = "rgba(255, 255, 255, 0.1)";
      const icon = this.querySelector("i");
      if (icon) {
        icon.style.color = "#6366f1";
      }
    });

    // Add click effect
    card.addEventListener("click", function () {
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
    });
  });
}

// Animated counter for statistics
function initStatsCounter() {
  const statNumbers = document.querySelectorAll(".stat-number");
  let hasAnimated = false;

  function animateStats() {
    if (hasAnimated) return;

    statNumbers.forEach((stat) => {
      const target =
        parseInt(stat.getAttribute("data-count")) ||
        Math.floor(Math.random() * 100) + 1;
      let current = 0;
      const increment = target / 60; // 60 frames for smooth animation

      function updateCount() {
        if (current < target) {
          current += increment;
          stat.textContent = Math.floor(current);
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target;
        }
      }

      updateCount();
    });

    hasAnimated = true;
  }

  // Trigger animation when stats section is visible
  const statsSection = document.querySelector(".stats-container");
  if (statsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(statsSection);
  }
}

// Scroll-triggered animations
function initScrollEffects() {
  const animatedElements = document.querySelectorAll(
    ".feature-card, .step, .example-tag"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// Navbar scroll effects
function initNavbarEffects() {
  const header = document.querySelector(".header");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      header.style.background = "rgba(15, 15, 35, 0.98)";
      header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
    } else {
      header.style.background = "rgba(15, 15, 35, 0.95)";
      header.style.boxShadow = "none";
    }

    // Hide/show navbar on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }

    lastScrollY = currentScrollY;
  });
}

// Fetch real GitHub statistics
async function fetchGitHubStats() {
  try {
    const response = await fetch(
      "https://api.github.com/repos/aadishsamir123/unipo"
    );
    const data = await response.json();

    // Update stats with real data
    const statNumbers = document.querySelectorAll(".stat-number");
    if (statNumbers.length >= 3) {
      statNumbers[0].setAttribute("data-count", data.subscribers_count || 1);
      statNumbers[1].setAttribute("data-count", data.open_issues_count || 0);
      statNumbers[2].setAttribute("data-count", data.size || 1);
    }

    // Fetch contributors
    const contributorsResponse = await fetch(
      "https://api.github.com/repos/aadishsamir123/unipo/contributors"
    );
    const contributors = await contributorsResponse.json();

    if (Array.isArray(contributors) && statNumbers.length >= 1) {
      statNumbers[0].setAttribute("data-count", contributors.length);
    }
  } catch (error) {
    console.log("Could not fetch GitHub stats:", error);
    // Use fallback values
    const statNumbers = document.querySelectorAll(".stat-number");
    if (statNumbers.length >= 3) {
      statNumbers[0].setAttribute(
        "data-count",
        Math.floor(Math.random() * 20) + 1
      );
      statNumbers[1].setAttribute(
        "data-count",
        Math.floor(Math.random() * 50) + 1
      );
      statNumbers[2].setAttribute(
        "data-count",
        Math.floor(Math.random() * 100) + 1
      );
    }
  }
}

// Particle effect for hero section
function createParticles() {
  const hero = document.querySelector(".hero");
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(99, 102, 241, 0.5);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
    hero.appendChild(particle);
  }
}

// Add typing effect to hero title
function initTypingEffect() {
  const heroTitle = document.querySelector(".hero-title");
  if (!heroTitle) return;

  const originalText = heroTitle.innerHTML;
  const words = originalText.split(" ");
  let currentWordIndex = 0;

  function typeWord() {
    if (currentWordIndex < words.length) {
      const currentWords = words.slice(0, currentWordIndex + 1).join(" ");
      heroTitle.innerHTML = currentWords;
      currentWordIndex++;
      setTimeout(typeWord, 300);
    }
  }

  // Start typing effect after a short delay
  heroTitle.innerHTML = "";
  setTimeout(typeWord, 1000);
}

// Add easter egg - Konami code
function initEasterEgg() {
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];
  let userInput = [];

  document.addEventListener("keydown", function (e) {
    userInput.push(e.code);

    if (userInput.length > konamiCode.length) {
      userInput.shift();
    }

    if (userInput.join(",") === konamiCode.join(",")) {
      activateEasterEgg();
      userInput = [];
    }
  });

  function activateEasterEgg() {
    const body = document.body;
    body.style.animation = "rainbow 2s ease-in-out infinite";

    setTimeout(() => {
      body.style.animation = "";
    }, 5000);

    // Add rainbow animation to CSS
    if (!document.querySelector("#rainbow-style")) {
      const style = document.createElement("style");
      style.id = "rainbow-style";
      style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    25% { filter: hue-rotate(90deg); }
                    50% { filter: hue-rotate(180deg); }
                    75% { filter: hue-rotate(270deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
      document.head.appendChild(style);
    }
  }
}

// Initialize easter egg
initEasterEgg();

// Add some fun interactions
document.addEventListener("click", function (e) {
  // Create click ripple effect
  const ripple = document.createElement("div");
  ripple.style.cssText = `
        position: fixed;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 9999;
        left: ${e.clientX - 25}px;
        top: ${e.clientY - 25}px;
        width: 50px;
        height: 50px;
    `;

  document.body.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
});

// Add ripple animation to CSS
const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Performance optimization - throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Apply throttling to scroll events
window.addEventListener(
  "scroll",
  throttle(function () {
    // Any additional scroll-based animations can go here
  }, 100)
);

// Playful interactions for Hack Club theme
function initPlayfulInteractions() {
  // Add fun cursor trail
  document.addEventListener("mousemove", createCursorTrail);

  // Make the hack club banner extra interactive
  const banner = document.querySelector(".hack-club-banner");
  if (banner) {
    banner.addEventListener("click", function () {
      this.style.animation = "rainbowShimmer 0.5s ease-in-out";
      setTimeout(() => {
        this.style.animation = "rainbowShimmer 3s ease-in-out infinite";
      }, 500);
    });
  }

  // Add bounce effect to emoji buttons
  const emojiButtons = document.querySelectorAll(".example-tag");
  emojiButtons.forEach((button) => {
    button.addEventListener("click", function () {
      this.style.transform = "scale(0.8)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);

      // Create explosion of mini emojis
      createEmojiExplosion(this);
    });
  });
}

// Create random floating emojis
function createRandomEmojis() {
  const emojis = ["🚀", "🎨", "⭐", "🌈", "💫", "🦄", "🎪", "🎭", "🎨", "✨"];

  setInterval(() => {
    if (Math.random() > 0.7) {
      // 30% chance every interval
      const emoji = document.createElement("div");
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.cssText = `
                position: fixed;
                font-size: 2rem;
                pointer-events: none;
                z-index: 9999;
                left: ${Math.random() * 100}vw;
                top: 100vh;
                animation: floatUp 4s ease-out forwards;
            `;

      document.body.appendChild(emoji);

      setTimeout(() => emoji.remove(), 4000);
    }
  }, 2000);
}

// Cursor trail effect
function createCursorTrail(e) {
  if (Math.random() > 0.8) {
    // Only sometimes for performance
    const trail = document.createElement("div");
    trail.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${e.clientX - 3}px;
            top: ${e.clientY - 3}px;
            animation: fadeOut 1s ease-out forwards;
        `;

    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 1000);
  }
}

// Emoji explosion effect
function createEmojiExplosion(element) {
  const explosionEmojis = ["💥", "⭐", "✨", "🎉", "🎊"];
  const rect = element.getBoundingClientRect();

  for (let i = 0; i < 5; i++) {
    const emoji = document.createElement("div");
    emoji.textContent =
      explosionEmojis[Math.floor(Math.random() * explosionEmojis.length)];
    emoji.style.cssText = `
            position: fixed;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 9999;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            animation: explode${i} 1s ease-out forwards;
        `;

    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 1000);
  }
}

// Add explosion animations to CSS
const explosionStyle = document.createElement("style");
explosionStyle.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }
    
    @keyframes explode0 {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(-30px, -30px) scale(0); opacity: 0; }
    }
    
    @keyframes explode1 {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(30px, -30px) scale(0); opacity: 0; }
    }
    
    @keyframes explode2 {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(-30px, 30px) scale(0); opacity: 0; }
    }
    
    @keyframes explode3 {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(30px, 30px) scale(0); opacity: 0; }
    }
    
    @keyframes explode4 {
        0% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(0, -40px) scale(0); opacity: 0; }
    }
`;
document.head.appendChild(explosionStyle);

// Sticky Header Functionality
function initStickyHeader() {
  const header = document.querySelector(".header");
  const banner = document.querySelector(".hack-club-banner");
  let lastScrollTop = 0;
  let ticking = false;

  function updateHeader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const bannerHeight = banner ? banner.offsetHeight : 50;

    // Add scrolled class when scrolled past the banner
    if (scrollTop > bannerHeight) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    lastScrollTop = scrollTop;
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  // Listen for scroll events
  window.addEventListener("scroll", requestTick, { passive: true });

  // Initial check
  updateHeader();
}

// Initialize sticky header when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Small delay to ensure all elements are rendered
  setTimeout(initStickyHeader, 100);
});

// Mobile Navigation Functionality
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileNavDrawer = document.getElementById("mobile-nav-drawer");
  const mobileNavOverlay = document.getElementById("mobile-nav-overlay");
  const mobileNavClose = document.getElementById("mobile-nav-close");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  function openMobileNav() {
    mobileNavDrawer.classList.add("active");
    mobileNavOverlay.classList.add("active");
    mobileMenuBtn.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMobileNav() {
    mobileNavDrawer.classList.remove("active");
    mobileNavOverlay.classList.remove("active");
    mobileMenuBtn.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Event listeners for mobile navigation
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", openMobileNav);
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener("click", closeMobileNav);
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener("click", closeMobileNav);
  }

  // Close mobile nav when clicking on links
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setTimeout(closeMobileNav, 300);
    });
  });

  // Close mobile nav on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileNavDrawer.classList.contains("active")) {
      closeMobileNav();
    }
  });

  // Handle orientation change
  window.addEventListener("orientationchange", function () {
    setTimeout(() => {
      if (
        window.innerWidth > 768 &&
        mobileNavDrawer.classList.contains("active")
      ) {
        closeMobileNav();
      }
    }, 100);
  });

  // Touch gesture support for mobile nav
  let touchStartX = 0;
  let touchStartY = 0;
  const touchThreshold = 50;

  document.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  document.addEventListener("touchend", function (e) {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX - touchEndX;
    const deltaY = Math.abs(touchStartY - touchEndY);

    // Swipe right to left to open nav (from right edge)
    if (
      touchStartX > window.innerWidth - 50 &&
      deltaX < -touchThreshold &&
      deltaY < 100
    ) {
      openMobileNav();
    }

    // Swipe left to right to close nav
    if (
      mobileNavDrawer.classList.contains("active") &&
      deltaX > touchThreshold &&
      deltaY < 100
    ) {
      closeMobileNav();
    }

    touchStartX = 0;
    touchStartY = 0;
  });
});
