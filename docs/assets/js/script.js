// UI5 FE Mockserver Tutorial - Interactive Features

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function () {
  // Create mobile nav toggle button
  const mobileToggle = document.createElement('button');
  mobileToggle.className = 'mobile-nav-toggle';
  mobileToggle.innerHTML = '☰';
  mobileToggle.setAttribute('aria-label', 'Toggle navigation');
  document.body.insertBefore(mobileToggle, document.body.firstChild);

  const sidebar = document.querySelector('.sidebar');

  // Toggle mobile navigation
  mobileToggle.addEventListener('click', function () {
    sidebar.classList.toggle('open');
    this.innerHTML = sidebar.classList.contains('open') ? '✕' : '☰';
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', function (e) {
    if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
      sidebar.classList.remove('open');
      mobileToggle.innerHTML = '☰';
    }
  });

  // Close mobile nav when clicking nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
      sidebar.classList.remove('open');
      mobileToggle.innerHTML = '☰';
    });
  });

  // Initialize syntax highlighting
  initializeSyntaxHighlighting();

  // Initialize copy-to-clipboard functionality
  initializeCopyButtons();

  // Set active navigation item
  setActiveNavigation();

  // Initialize smooth scrolling for anchor links
  initializeSmoothScrolling();
});

// Syntax highlighting initialization
function initializeSyntaxHighlighting() {
  // Load Prism.js from CDN if not already loaded
  if (typeof Prism === 'undefined') {
    const prismCSS = document.createElement('link');
    prismCSS.rel = 'stylesheet';
    prismCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
    document.head.appendChild(prismCSS);

    const prismJS = document.createElement('script');
    prismJS.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
    prismJS.onload = function () {
      // Load additional language components
      loadPrismLanguages();
    };
    document.head.appendChild(prismJS);
  } else {
    // Prism is already loaded, just highlight
    Prism.highlightAll();
  }
}

// Load additional Prism.js language components
function loadPrismLanguages() {
  const languages = ['bash', 'javascript', 'json', 'yaml', 'typescript', 'markup'];

  languages.forEach(lang => {
    const script = document.createElement('script');
    script.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${lang}.min.js`;
    script.onload = function () {
      Prism.highlightAll();
    };
    document.head.appendChild(script);
  });
}

// Copy to clipboard functionality
function initializeCopyButtons() {
  document.querySelectorAll('pre[class*="language-"]').forEach(function (pre) {
    // Skip if button already exists
    if (pre.querySelector('.copy-button')) return;

    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';
    button.addEventListener('click', function () {
      const code = pre.querySelector('code');
      const text = code.textContent;

      navigator.clipboard
        .writeText(text)
        .then(function () {
          button.textContent = 'Copied!';
          setTimeout(function () {
            button.textContent = 'Copy';
          }, 2000);
        })
        .catch(function () {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);

          button.textContent = 'Copied!';
          setTimeout(function () {
            button.textContent = 'Copy';
          }, 2000);
        });
    });

    pre.appendChild(button);
  });
}

// Set active navigation item based on current page
function setActiveNavigation() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.classList.remove('active');

    // Check if link href matches current path
    const linkPath = new URL(link.href).pathname;
    if (
      linkPath === currentPath ||
      (currentPath.endsWith('/') && linkPath === currentPath.slice(0, -1)) ||
      (linkPath.endsWith('/') && currentPath === linkPath.slice(0, -1))
    ) {
      link.classList.add('active');
    }
  });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

// Progress tracking for completed exercises
function markExerciseCompleted(exerciseId) {
  const completedExercises = getCompletedExercises();
  if (!completedExercises.includes(exerciseId)) {
    completedExercises.push(exerciseId);
    localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
    updateNavigationProgress();
  }
}

function getCompletedExercises() {
  const stored = localStorage.getItem('completedExercises');
  return stored ? JSON.parse(stored) : [];
}

function updateNavigationProgress() {
  const completedExercises = getCompletedExercises();
  const navLinks = document.querySelectorAll('.nav-link[data-exercise]');

  navLinks.forEach(link => {
    const exerciseId = link.getAttribute('data-exercise');
    if (completedExercises.includes(exerciseId)) {
      link.classList.add('completed');
    }
  });
}

// Initialize progress tracking on page load
document.addEventListener('DOMContentLoaded', function () {
  updateNavigationProgress();
});

// Exercise completion button functionality
function initializeExerciseCompletion() {
  const completeButton = document.querySelector('.complete-exercise');
  if (completeButton) {
    completeButton.addEventListener('click', function () {
      const exerciseId = this.getAttribute('data-exercise');
      markExerciseCompleted(exerciseId);
      this.textContent = 'Exercise Completed!';
      this.disabled = true;
      this.classList.add('btn-success');
    });
  }
}

// Auto-scroll to section based on URL hash
function handleHashNavigation() {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(function () {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }
}

// Handle browser back/forward with hash navigation
window.addEventListener('hashchange', handleHashNavigation);
document.addEventListener('DOMContentLoaded', handleHashNavigation);

// Search functionality (if search input exists)
function initializeSearch() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase();
      const navItems = document.querySelectorAll('.nav-item');

      navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const text = link.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  initializeExerciseCompletion();
  initializeSearch();
});

// Export functions for potential external use
window.TutorialUtils = {
  markExerciseCompleted,
  getCompletedExercises,
  updateNavigationProgress,
};
