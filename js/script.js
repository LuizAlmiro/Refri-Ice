/* =========================================================
   REFRI ICE — script.js
   Comportamentos gerais do site
   ========================================================= */

(function () {
  /* ---- Cabeçalho muda de aparência ao rolar ---- */
  const header = document.querySelector('.site-header');

  function handleScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---- Ano automático no rodapé ---- */
  const yearEl = document.querySelector('[data-current-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---- Marca o link ativo no menu conforme a página atual ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav__list a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('is-active');
    }
  });

  /* ---- Revela seções ao rolar a página ---- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
