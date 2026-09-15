/* =========================================================
   REFRI ICE — site-config.js
   Dados da empresa usados pelos scripts do site.

   >>> EDITE AQUI para atualizar WhatsApp, e-mail e a área
   de cobertura. Os scripts de CEP, formulário e botões de
   WhatsApp leem tudo deste arquivo.
   ========================================================= */

window.REFRI_ICE = {
  // Número do WhatsApp principal (somente dígitos, com 55 + DDD)
  whatsapp: '5511991321677',

  // E-mail que recebe os pedidos de orçamento do formulário
  emailOrcamentos: 'mkt.refriice@gmail.com',

  /* ---- Área de cobertura (alimenta o verificador de CEP) ----
     cidadesInteiras: municípios atendidos em qualquer bairro.
     bairrosPorCidade: municípios atendidos apenas em bairros
     específicos. A comparação ignora acentos e maiúsculas.
     "Centro" de São Paulo = distritos da Subprefeitura Sé. */
  cobertura: {
    cidadesInteiras: ['Osasco', 'Barueri'],
    bairrosPorCidade: {
      'São Paulo': [
        'Pinheiros', 'Lapa', 'Morumbi',
        'Centro', 'Sé', 'República', 'Bela Vista', 'Consolação',
        'Santa Cecília', 'Bom Retiro', 'Liberdade', 'Cambuci'
      ],
      'Santana de Parnaíba': ['Alphaville']
    }
  },

  /* ---- Mapa da página inicial ----
     Centro aproximado de cada região (latitude, longitude), o
     raio do círculo desenhado, em metros, e a posição opcional
     do nome ('top', 'bottom', 'left' ou 'right'). */
  mapa: [
    { nome: 'Alphaville', lat: -23.4968, lng: -46.8492, raio: 1800 },
    { nome: 'Barueri', lat: -23.5107, lng: -46.8761, raio: 2600, rotulo: 'bottom' },
    { nome: 'Osasco', lat: -23.5329, lng: -46.7917, raio: 3600 },
    { nome: 'Lapa', lat: -23.5226, lng: -46.7036, raio: 1900 },
    { nome: 'Pinheiros', lat: -23.5664, lng: -46.6936, raio: 1900, rotulo: 'right' },
    { nome: 'Morumbi', lat: -23.5968, lng: -46.7196, raio: 2300, rotulo: 'bottom' },
    { nome: 'Centro', lat: -23.5480, lng: -46.6380, raio: 2200 }
  ]
};

/* Monta um link de WhatsApp com mensagem pronta */
window.REFRI_ICE.linkWhatsApp = function (mensagem) {
  const base = 'https://wa.me/' + window.REFRI_ICE.whatsapp;
  return mensagem ? base + '?text=' + encodeURIComponent(mensagem) : base;
};
