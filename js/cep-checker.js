/* =========================================================
   REFRI ICE — cep-checker.js
   Painel de Cobertura: consulta o CEP (API ViaCEP) e verifica
   se o bairro retornado está na lista de áreas atendidas.

   >>> EDITE A LISTA "BAIRROS_ATENDIDOS" ABAIXO <<<
   Adicione/remova os bairros da capital de São Paulo que a
   Refri Ice realmente atende. A comparação ignora acentos e
   maiúsculas/minúsculas.
   ========================================================= */

(function () {
  // Lista de exemplo — substitua pelos bairros reais atendidos.
  const BAIRROS_ATENDIDOS = [
    'Moema', 'Vila Mariana', 'Saúde', 'Campo Belo', 'Santo Amaro',
    'Brooklin', 'Itaim Bibi', 'Jardim Paulista', 'Pinheiros',
    'Vila Madalena', 'Butantã', 'Vila Olímpia', 'Morumbi',
    'Cidade Monções', 'Campo Grande', 'Jabaquara', 'Chácara Klabin'
  ];

  function normalizar(texto) {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  const BAIRROS_NORMALIZADOS = BAIRROS_ATENDIDOS.map(normalizar);

  function atende(bairro) {
    const alvo = normalizar(bairro);
    return BAIRROS_NORMALIZADOS.some(function (b) {
      return alvo.includes(b) || b.includes(alvo);
    });
  }

  function initPanel(panel) {
    const form = panel.querySelector('[data-cep-form]');
    const input = panel.querySelector('[data-cep-input]');
    const button = panel.querySelector('[data-cep-submit]');
    const led = panel.querySelector('[data-cep-led]');
    const readout = panel.querySelector('[data-cep-readout]');

    if (!form || !input || !readout) return;

    input.addEventListener('input', function () {
      input.value = input.value.replace(/\D/g, '').slice(0, 8);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const cep = input.value.replace(/\D/g, '');

      if (cep.length !== 8) {
        setEstado('erro', 'CEP inválido. Digite os 8 números do CEP.');
        return;
      }

      setEstado('checando');
      button.disabled = true;

      fetch('https://viacep.com.br/ws/' + cep + '/json/')
        .then(function (res) {
          if (!res.ok) throw new Error('Falha na consulta');
          return res.json();
        })
        .then(function (data) {
          button.disabled = false;

          if (data.erro) {
            setEstado('erro', 'CEP não encontrado. Confira o número digitado.');
            return;
          }

          if (data.uf !== 'SP' || normalizar(data.localidade) !== normalizar('São Paulo')) {
            setEstado('fora-cidade', null, data);
            return;
          }

          if (atende(data.bairro)) {
            setEstado('atendido', null, data);
          } else {
            setEstado('nao-atendido', null, data);
          }
        })
        .catch(function () {
          button.disabled = false;
          setEstado('erro', 'Não foi possível consultar o CEP agora. Tente novamente.');
        });
    });

    function setEstado(estado, mensagemErro, dados) {
      if (led) {
        led.classList.remove('is-checking', 'is-success', 'is-danger');
      }

      if (estado === 'checando') {
        if (led) led.classList.add('is-checking');
        readout.innerHTML = '<p class="readout-idle">Consultando endereço…</p>';
        return;
      }

      if (estado === 'erro') {
        if (led) led.classList.add('is-danger');
        readout.innerHTML = '<p class="readout-note" style="color:var(--danger)">' + mensagemErro + '</p>';
        return;
      }

      if (estado === 'fora-cidade') {
        if (led) led.classList.add('is-danger');
        readout.innerHTML =
          linha('Cidade', dados.localidade + ' / ' + dados.uf) +
          '<p class="readout-status no">FORA DA ÁREA</p>' +
          '<p class="readout-note">Atendemos apenas a capital de São Paulo.</p>';
        return;
      }

      if (estado === 'atendido') {
        if (led) led.classList.add('is-success');
        readout.innerHTML =
          linha('Endereço', dados.logradouro || '—') +
          linha('Bairro', dados.bairro || '—') +
          linha('Cidade', dados.localidade + ' / ' + dados.uf) +
          '<p class="readout-status ok">✓ ATENDIDO</p>' +
          '<p class="readout-note">Ótimo! Fazemos atendimento na sua região.</p>';
        return;
      }

      if (estado === 'nao-atendido') {
        if (led) led.classList.add('is-danger');
        readout.innerHTML =
          linha('Endereço', dados.logradouro || '—') +
          linha('Bairro', dados.bairro || '—') +
          linha('Cidade', dados.localidade + ' / ' + dados.uf) +
          '<p class="readout-status no">✕ FORA DA ÁREA</p>' +
          '<p class="readout-note">Ainda não atendemos esse bairro. Fale com a gente para confirmar.</p>';
      }
    }

    function linha(label, valor) {
      return '<div class="readout-line"><span>' + label + '</span><span>' + valor + '</span></div>';
    }
  }

  document.querySelectorAll('[data-coverage-panel]').forEach(initPanel);
})();
