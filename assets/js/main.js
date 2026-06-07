// Dynamic Header & Footer Loader
async function loadComponents() {
  const headerEl = document.getElementById('header');
  const footerEl = document.getElementById('footer');

  try {
    const promises = [];

    if (headerEl) {
      promises.push(
        fetch('components/header.html')
          .then(res => {
            if (!res.ok) throw new Error('Failed to load header');
            return res.text();
          })
          .then(html => {
            headerEl.innerHTML = html;
            initHeaderInteractions();
          })
      );
    }

    if (footerEl) {
      promises.push(
        fetch('components/footer.html')
          .then(res => {
            if (!res.ok) throw new Error('Failed to load footer');
            return res.text();
          })
          .then(html => {
            footerEl.innerHTML = html;
          })
      );
    }

    await Promise.all(promises);
    setActiveNavLink();
    initSmoothScrolling();
  } catch (error) {
    console.error('Error loading shared components:', error);
  }
}

// Set active class on navigation links
function setActiveNavLink() {
  const path = window.location.pathname;
  const currentPage = path.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Extract base page name (e.g. index.html from index.html#about)
    const baseHref = href.split('#')[0];
    
    if (baseHref === currentPage) {
      link.classList.add('active');
      // Also highlight parent dropdown if nested
      const parentDropdown = link.closest('.dropdown');
      if (parentDropdown) {
        const toggle = parentDropdown.querySelector('.dropdown-toggle');
        if (toggle) toggle.classList.add('active');
      }
    } else {
      link.classList.remove('active');
    }
  });
}

// Initialize Header-specific interactions (mobile menu, scroll background, dropdowns)
function initHeaderInteractions() {
  const headerEl = document.getElementById('header');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  // Sticky header on scroll
  if (headerEl) {
    const checkScroll = () => {
      if (window.scrollY > 50) {
        headerEl.classList.add('scrolled');
      } else {
        headerEl.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Run once in case already scrolled
  }

  // Mobile menu toggle
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      menuBtn.innerHTML = navLinks.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  }

  // Mobile dropdown toggles
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 992) {
        const dropdown = this.parentElement;
        const isAlreadyActive = dropdown.classList.contains('active');
        
        // Prevent default only if navigating on mobile and it's a dropdown toggle trigger
        if (!isAlreadyActive || this.getAttribute('href').startsWith('#')) {
          e.preventDefault();
        }
        
        dropdown.classList.toggle('active');

        // Close other dropdowns
        document.querySelectorAll('.dropdown').forEach(item => {
          if (item !== dropdown) {
            item.classList.remove('active');
          }
        });
      }
    });
  });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.startsWith('#team') || href.startsWith('#join')) return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 80, // Offset for sticky header
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          if (menuBtn) menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
      }
    });
  });
}

// Page Specific: Stats Counter
function initStatsCounter() {
  const counters = document.querySelectorAll('.hero-stat-number');
  counters.forEach(counter => {
    const icon = counter.querySelector('i');
    const target = parseInt(counter.textContent.replace(/\D/g, ''));
    if (isNaN(target)) return;
    
    let count = 0;
    const increment = Math.ceil(target / 150);
    const update = () => {
      count += increment;
      if (count > target) count = target;
      counter.innerHTML = (icon ? icon.outerHTML : '') + ' ' + count + '+';
      if (count < target) requestAnimationFrame(update);
    };
    update();
  });
}

// Page Specific: Project Filters
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projects.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.textContent.trim().toLowerCase();
        projects.forEach(project => {
          const categoryEl = project.querySelector('.project-category');
          if (!categoryEl) return;
          const projectCat = categoryEl.textContent.trim().toLowerCase();
          
          if (category === 'all' || projectCat === category) {
            project.style.display = 'block';
          } else {
            project.style.display = 'none';
          }
        });
      });
    });
  }
}

// Modals Setup
function openModal(type) {
  const modal = document.getElementById(`${type}-modal`);
  if (modal) modal.style.display = 'flex';
}

// Set up window modal closing listener
window.addEventListener('click', function (event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
});

// Utility click-handlers for specific actions
function openGoogleForm() {
  window.open('https://forms.gle/KGJoR7rwcvGyLoyv9', '_blank');
}

// Form Submission handlers
let submitted = false;

function handleFormSubmit() {
  submitted = true;
  const submitBtn = document.querySelector('.contact-form .btn');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
  }
}

function showSuccessMessage() {
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  const submitBtn = document.querySelector('.contact-form .btn');
  const form = document.querySelector('.contact-form form');

  if (successMessage) successMessage.style.display = 'block';
  if (errorMessage) errorMessage.style.display = 'none';

  if (submitBtn) {
    submitBtn.innerHTML = 'Send Message';
    submitBtn.disabled = false;
  }

  if (form) {
    setTimeout(() => {
      form.reset();
    }, 1000);
  }

  setTimeout(() => {
    if (successMessage) successMessage.style.display = 'none';
  }, 5000);

  submitted = false;
}

function showErrorMessage() {
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  const submitBtn = document.querySelector('.contact-form .btn');

  if (errorMessage) errorMessage.style.display = 'block';
  if (successMessage) successMessage.style.display = 'none';

  if (submitBtn) {
    submitBtn.innerHTML = 'Send Message';
    submitBtn.disabled = false;
  }

  submitted = false;
}

// Run loader and page-specific handlers
document.addEventListener('DOMContentLoaded', () => {
  // Load Header and Footer templates
  loadComponents();

  // Stats Counters
  initStatsCounter();

  // Project Filters
  initProjectFilters();

  // Setup error fallback for form if needed
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', () => {
      setTimeout(() => {
        if (submitted) {
          showErrorMessage();
        }
      }, 10000);
    });
  }
});