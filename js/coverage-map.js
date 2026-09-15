/* =========================================================
   REFRI ICE — coverage-map.js
   Mapa real (OpenStreetMap + Leaflet) com as regiões atendidas.
   As regiões e coordenadas ficam em site-config.js (mapa).
   ========================================================= */

(function () {
  const container = document.querySelector('[data-coverage-map]');
  const regioes = (window.REFRI_ICE && window.REFRI_ICE.mapa) || [];

  if (!container || !regioes.length) return;

  // Sem a biblioteca (sem internet ou CDN bloqueado): mostra link para o mapa externo
  if (!window.L) {
    container.innerHTML =
      '<p class="coverage-map__fallback">Não foi possível carregar o mapa. ' +
      '<a href="https://www.openstreetmap.org/#map=12/-23.545/-46.760" target="_blank" rel="noopener">Abrir no OpenStreetMap</a></p>';
    return;
  }

  container.replaceChildren();

  const toque = window.matchMedia('(pointer: coarse)').matches;

  const map = L.map(container, {
    scrollWheelZoom: false,   // não "prende" a rolagem da página
    dragging: !toque,         // no celular, um dedo continua rolando a página
    tap: false,
    zoomSnap: 0.25
  });

  map.attributionControl.setPrefix(false);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
  }).addTo(map);

  const icone = L.divIcon({
    className: 'map-pin',
    html: '<span class="map-pin__pulse"></span><span class="map-pin__dot"></span>',
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });

  const deslocamentos = { top: [0, -12], bottom: [0, 12], left: [-12, 0], right: [12, 0] };
  const limites = L.latLngBounds([]);

  regioes.forEach(function (r) {
    const centro = [r.lat, r.lng];
    const direcao = r.rotulo || 'top';

    L.circle(centro, {
      radius: r.raio,
      color: '#0b7fc4',
      weight: 2,
      opacity: 0.8,
      fillColor: '#28aaeb',
      fillOpacity: 0.2
    }).addTo(map);

    L.marker(centro, { icon: icone, keyboard: false, alt: r.nome })
      .bindTooltip(r.nome, {
        permanent: true,
        direction: direcao,
        offset: deslocamentos[direcao],
        className: 'map-label map-label--' + direcao
      })
      .addTo(map);

    // Enquadra os círculos inteiros, não só os centros
    limites.extend(L.latLng(centro).toBounds(r.raio * 2));
  });

  function enquadrar() {
    map.invalidateSize();
    map.fitBounds(limites, { padding: [24, 24] });
  }

  enquadrar();

  // Reenquadra quando o tamanho do mapa muda (ex.: girar o celular)
  if ('ResizeObserver' in window) {
    new ResizeObserver(enquadrar).observe(container);
  }
})();
