/* =========================================================
   REFRI ICE — menu.js
   Controle do menu mobile (abrir/fechar)
   ========================================================= */

(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const header = document.querySelector('.site-header');

  if (!toggle || !nav) return;

  function setOpen(isOpen) {
    if (isOpen && header) {
      // O menu abre logo abaixo do cabeçalho, onde quer que ele esteja na tela
      nav.style.setProperty('--nav-top', header.getBoundingClientRect().bottom + 'px');
    }
    nav.classList.toggle('is-open', isOpen);
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  toggle.addEventListener('click', function () {
    setOpen(!nav.classList.contains('is-open'));
  });

  // Fecha ao clicar em um link ou apertar Esc
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setOpen(false);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Ao voltar para o layout desktop, garante o menu fechado
  window.matchMedia('(min-width: 901px)').addEventListener('change', function (mq) {
    if (mq.matches) setOpen(false);
  });
})();
