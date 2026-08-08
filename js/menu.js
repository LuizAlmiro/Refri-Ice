/* =========================================================
   REFRI ICE — menu.js
   Controle do menu mobile (abrir/fechar)
   ========================================================= */

(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Fecha o menu ao clicar em um link (útil em navegação mobile)
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();
