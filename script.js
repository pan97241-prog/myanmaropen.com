(() => {
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const backdrop = document.querySelector('[data-menu-backdrop]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setMenu = (open) => {
    header.classList.toggle('is-menu-open', open);
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  };

  menuToggle?.addEventListener('click', () => setMenu(!header.classList.contains('is-menu-open')));
  backdrop?.addEventListener('click', () => setMenu(false));
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760 && header.classList.contains('is-menu-open')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('is-menu-open')) setMenu(false);
  });

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const navLinks = [...document.querySelectorAll('.desktop-nav .nav-link')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', anchor.getAttribute('href'));
    });
  });

  const counterSection = document.querySelector('[data-counter-section]');
  const counters = [...document.querySelectorAll('[data-counter]')];
  let countersStarted = false;
  const animateCounters = () => {
    if (countersStarted) return;
    countersStarted = true;
    counters.forEach((counter) => {
      const target = Number(counter.dataset.value);
      if (reduceMotion) {
        counter.textContent = target.toLocaleString();
        return;
      }
      const duration = 1450;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        counter.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };
  if (counterSection) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        animateCounters();
        observer.disconnect();
      }
    }, { threshold: .35 });
    counterObserver.observe(counterSection);
  }

  const tabButtons = [...document.querySelectorAll('[data-tab-target]')];
  const tabPanels = [...document.querySelectorAll('.tab-panel')];
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.tabTarget;
      tabButtons.forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      tabPanels.forEach((panel) => {
        const active = panel.id === targetId;
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      });
    });
  });

  const newsletterForm = document.querySelector('[data-newsletter-form]');
  const formSuccess = document.querySelector('[data-form-success]');
  newsletterForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    newsletterForm.reset();
    formSuccess.hidden = false;
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
