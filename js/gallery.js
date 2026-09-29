/* =========================================================
   REFRI ICE — gallery.js
   Visualizador de fotos e vídeos das obras.
   Cada item da galeria é um link para o arquivo (funciona
   mesmo sem JavaScript); com JS, abre em tela cheia com
   navegação por setas.
   ========================================================= */

(function () {
  const galerias = document.querySelectorAll('[data-gallery]');
  if (!galerias.length || typeof HTMLDialogElement === 'undefined') return;

  const icone = function (id) {
    return '<svg aria-hidden="true"><use href="#' + id + '"/></svg>';
  };

  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Visualizador de fotos e vídeos');
  dialog.innerHTML =
    '<div class="lightbox__stage" data-stage></div>' +
    '<div class="lightbox__bar"><span class="lightbox__caption" data-caption></span><span class="lightbox__count" data-count></span></div>' +
    '<button type="button" class="lightbox__btn lightbox__close" data-close aria-label="Fechar">' + icone('i-x') + '</button>' +
    '<button type="button" class="lightbox__btn lightbox__prev" data-prev aria-label="Anterior">' + icone('i-chevron-left') + '</button>' +
    '<button type="button" class="lightbox__btn lightbox__next" data-next aria-label="Próximo">' + icone('i-chevron-right') + '</button>';
  document.body.appendChild(dialog);

  const stage = dialog.querySelector('[data-stage]');
  const caption = dialog.querySelector('[data-caption]');
  const count = dialog.querySelector('[data-count]');

  let itens = [];
  let atual = 0;

  function mostrar(indice) {
    atual = (indice + itens.length) % itens.length;
    const link = itens[atual];
    const texto = link.getAttribute('data-caption') || '';

    stage.replaceChildren();

    if (link.hasAttribute('data-video')) {
      const video = document.createElement('video');
      video.src = link.getAttribute('href');
      video.poster = link.getAttribute('data-poster') || '';
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute('aria-label', texto);
      stage.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = link.getAttribute('href');
      img.alt = link.querySelector('img') ? link.querySelector('img').alt : texto;
      stage.appendChild(img);
    }

    caption.textContent = texto;
    count.textContent = (atual + 1) + ' de ' + itens.length;
  }

  function fechar() {
    stage.replaceChildren(); // interrompe o vídeo
    if (dialog.open) dialog.close();
  }

  galerias.forEach(function (galeria) {
    const links = Array.prototype.slice.call(galeria.querySelectorAll('a'));
    links.forEach(function (link, i) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        itens = links;
        mostrar(i);
        dialog.showModal();
      });
    });
  });

  dialog.querySelector('[data-close]').addEventListener('click', fechar);
  dialog.querySelector('[data-prev]').addEventListener('click', function () { mostrar(atual - 1); });
  dialog.querySelector('[data-next]').addEventListener('click', function () { mostrar(atual + 1); });

  // Fecha ao clicar fora da mídia
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog || event.target === stage) fechar();
  });

  dialog.addEventListener('cancel', function (event) {
    event.preventDefault();
    fechar();
  });

  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') mostrar(atual - 1);
    if (event.key === 'ArrowRight') mostrar(atual + 1);
  });

  // Deslizar para os lados no celular
  let inicioX = null;
  stage.addEventListener('touchstart', function (event) {
    inicioX = event.touches[0].clientX;
  }, { passive: true });
  stage.addEventListener('touchend', function (event) {
    if (inicioX === null) return;
    const dx = event.changedTouches[0].clientX - inicioX;
    if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
    inicioX = null;
  }, { passive: true });
})();
