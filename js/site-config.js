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
     Atendemos toda a Grande São Paulo: a capital e os demais
     municípios da Região Metropolitana (39 no total).
     cidadesInteiras: municípios atendidos em qualquer bairro.
     bairrosPorCidade: use só se algum município passar a ser
     atendido apenas em bairros específicos, ex.:
       { 'Cidade X': ['Bairro 1', 'Bairro 2'] }
     A comparação ignora acentos, hífens e maiúsculas. */
  cobertura: {
    cidadesInteiras: [
      'São Paulo',
      'Arujá', 'Barueri', 'Biritiba Mirim', 'Caieiras', 'Cajamar', 'Carapicuíba',
      'Cotia', 'Diadema', 'Embu das Artes', 'Embu-Guaçu', 'Ferraz de Vasconcelos',
      'Francisco Morato', 'Franco da Rocha', 'Guararema', 'Guarulhos',
      'Itapecerica da Serra', 'Itapevi', 'Itaquaquecetuba', 'Jandira', 'Juquitiba',
      'Mairiporã', 'Mauá', 'Mogi das Cruzes', 'Osasco', 'Pirapora do Bom Jesus', 'Poá',
      'Ribeirão Pires', 'Rio Grande da Serra', 'Salesópolis', 'Santa Isabel',
      'Santana de Parnaíba', 'Santo André', 'São Bernardo do Campo',
      'São Caetano do Sul', 'São Lourenço da Serra', 'Suzano', 'Taboão da Serra',
      'Vargem Grande Paulista'
    ],
    bairrosPorCidade: {}
  },

  /* ---- Mapa da página inicial ----
     O contorno da área vem de js/area-cobertura.js; aqui ficam
     o nome exibido e o ponto onde ele aparece. */
  mapa: {
    rotulo: 'Toda a Grande São Paulo',
    lat: -23.5505,
    lng: -46.6333
  }
};

/* Monta um link de WhatsApp com mensagem pronta */
window.REFRI_ICE.linkWhatsApp = function (mensagem) {
  const base = 'https://wa.me/' + window.REFRI_ICE.whatsapp;
  return mensagem ? base + '?text=' + encodeURIComponent(mensagem) : base;
};
