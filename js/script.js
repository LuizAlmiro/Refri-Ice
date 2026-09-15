/* =========================================================
   REFRI ICE — script.js
   Comportamentos gerais do site
   ========================================================= */

(function () {
  const config = window.REFRI_ICE || {};

  /* ---- Cabeçalho ganha borda/sombra ao rolar ---- */
  const header = document.querySelector('.site-header');

  function handleScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---- Ano automático no rodapé ---- */
  document.querySelectorAll('[data-current-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Anos de experiência calculados a partir da fundação ---- */
  document.querySelectorAll('[data-years-since]').forEach(function (el) {
    const desde = parseInt(el.getAttribute('data-years-since'), 10);
    if (desde) el.textContent = new Date().getFullYear() - desde;
  });

  /* ---- Mantém os links de WhatsApp com o número do site-config.js ---- */
  if (config.whatsapp) {
    document.querySelectorAll('a[data-whatsapp]').forEach(function (link) {
      try {
        const url = new URL(link.href);
        const texto = url.searchParams.get('text');
        link.href = config.linkWhatsApp(texto);
      } catch (e) {
        /* mantém o link original */
      }
    });
  }

  /* ---- Marca o link ativo no menu conforme a página atual ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav__list a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ---- Revela elementos ao rolar a página ---- */
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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
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
