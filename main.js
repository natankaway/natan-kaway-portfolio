document.addEventListener('DOMContentLoaded', () => {
  
  // Remove body loading state once loaded
  setTimeout(() => {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  }, 100);

  /* ==========================================================================
     Bilingual Translation Logic
     ========================================================================== */
  const langToggleBtns = document.querySelectorAll('.lang-toggle-btn');
  const langToggleBtnsMobile = document.querySelectorAll('.lang-toggle-btn-mobile');
  
  // Set initial language from localStorage or default to English
  let currentLang = localStorage.getItem('portfolio-lang') || 'en';
  setLanguage(currentLang);

  function setLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('portfolio-lang', lang);
    currentLang = lang;

    // Update active state on language toggle buttons
    const allLabels = document.querySelectorAll('.lang-label, .lang-label-mobile');
    allLabels.forEach(label => {
      if (label.getAttribute('data-lang-val') === lang) {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    });

    // Update page title/description dynamically for SEO if desired
    if (lang === 'pt') {
      document.title = "Natan Kaway — Product Engineer e Solo Builder";
    } else {
      document.title = "Natan Kaway — Product Engineer & Solo Builder";
    }
  }

  // Bind click events for all toggle buttons
  langToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLang = currentLang === 'en' ? 'pt' : 'en';
      setLanguage(targetLang);
    });
  });

  if (langToggleBtnsMobile) {
    langToggleBtnsMobile.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetLang = currentLang === 'en' ? 'pt' : 'en';
        setLanguage(targetLang);
      });
    });
  }


  /* ==========================================================================
     Dual-Layer Custom Cursor (Desktop Only)
     ========================================================================== */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;
  const lerpFactor = 0.15; // Delay rate
  
  let isHovering = false;
  let isTouchDevice = false;
  let isReducedMotion = false;

  // Check touch capabilities
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches) {
    isTouchDevice = true;
  }

  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isReducedMotion = true;
  }

  if (!isTouchDevice && !isReducedMotion) {
    // Show cursor elements
    cursorDot.style.display = 'block';
    cursorRing.style.display = 'block';

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Update dot position instantly
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Animate outer ring with lerp
    const updateCursorRing = () => {
      ringX += (mouseX - ringX) * lerpFactor;
      ringY += (mouseY - ringY) * lerpFactor;
      
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      
      requestAnimationFrame(updateCursorRing);
    };
    requestAnimationFrame(updateCursorRing);

    // Dynamic hover effects for interactive elements
    const updateHoverStates = () => {
      // Find all interactive triggers
      const triggers = document.querySelectorAll('a, button, .cursor-trigger, .stack-tag, .stack-pill, .evidence-block, .trust-item');
      
      triggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => {
          cursorRing.classList.add('hover-active');
          cursorDot.classList.add('hover-active');
        });
        
        trigger.addEventListener('mouseleave', () => {
          cursorRing.classList.remove('hover-active');
          cursorDot.classList.remove('hover-active');
        });
      });
    };

    updateHoverStates();

    // Re-run hover triggers in case DOM changes
    const observer = new MutationObserver(updateHoverStates);
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    // Keep cursors hidden
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }


  /* ==========================================================================
     IntersectionObserver Scroll Reveals (Fallback & Load animations)
     ========================================================================== */
  const revealItems = document.querySelectorAll('.reveal-item');
  
  // Set up staggered animations
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    rootMargin: '0px 0px -10% 0px', // Trigger slightly before element enters view
    threshold: 0.1
  });

  // Stagger delays for child nodes where helpful
  revealItems.forEach((item, index) => {
    // Only apply IntersectionObserver reveals if CSS Scroll-driven animations are unsupported
    // or if the element is inside the Hero section (which needs instant page load reveals)
    const isInHero = item.closest('.hero-section') !== null;
    const supportsScrollDriven = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
    
    if (isInHero || !supportsScrollDriven || isReducedMotion) {
      revealObserver.observe(item);
    }
  });


  /* ==========================================================================
     Header Scroll Effects
     ========================================================================== */
  const header = document.querySelector('header');
  const scrollThreshold = 50;

  const checkScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Run once in case user starts refreshed/scrolled


  /* ==========================================================================
     Mobile Overlay Navigation Menu
     ========================================================================== */
  const menuToggleBtn = document.querySelector('.menu-toggle-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuToggleBtn && mobileMenu) {
    const toggleMobileMenu = () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        mobileMenu.classList.remove('open');
        menuToggleBtn.classList.remove('open');
        document.body.style.overflow = ''; // Enable scroll
      } else {
        mobileMenu.classList.add('open');
        menuToggleBtn.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock scroll
      }
    };

    menuToggleBtn.addEventListener('click', toggleMobileMenu);

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggleBtn.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

});
