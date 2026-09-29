/* =========================================================
   REFRI ICE — coverage-map.js
   Mapa real (OpenStreetMap + Leaflet) com a área atendida:
   toda a Grande São Paulo. O contorno fica em
   js/area-cobertura.js e o rótulo em site-config.js (mapa).
   ========================================================= */

(function () {
  const container = document.querySelector('[data-coverage-map]');
  const area = window.REFRI_ICE_AREA;
  const config = (window.REFRI_ICE && window.REFRI_ICE.mapa) || {};

  if (!container || !area || !area.length) return;

  // Sem a biblioteca (sem internet ou CDN bloqueado): mostra link para o mapa externo
  if (!window.L) {
    container.innerHTML =
      '<p class="coverage-map__fallback">Não foi possível carregar o mapa. ' +
      '<a href="https://www.openstreetmap.org/relation/2661855" target="_blank" rel="noopener">Ver a Grande São Paulo no OpenStreetMap</a></p>';
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

  // Área atendida: contorno da Região Metropolitana de São Paulo
  const regiao = L.polygon(area, {
    color: '#0b7fc4',
    weight: 2.5,
    opacity: 0.9,
    fillColor: '#28aaeb',
    fillOpacity: 0.18,
    interactive: false
  }).addTo(map);

  if (config.rotulo) {
    const icone = L.divIcon({
      className: 'map-pin',
      html: '<span class="map-pin__pulse"></span><span class="map-pin__dot"></span>',
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    L.marker([config.lat, config.lng], { icon: icone, keyboard: false, alt: config.rotulo })
      .bindTooltip(config.rotulo, {
        permanent: true,
        direction: 'top',
        offset: [0, -12],
        className: 'map-label map-label--top'
      })
      .addTo(map);
  }

  function enquadrar() {
    map.invalidateSize();
    map.fitBounds(regiao.getBounds(), { padding: [16, 16] });
  }

  enquadrar();

  // Reenquadra quando o tamanho do mapa muda (ex.: girar o celular)
  if ('ResizeObserver' in window) {
    new ResizeObserver(enquadrar).observe(container);
  }
})();
