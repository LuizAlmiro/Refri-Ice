/* =========================================================
   REFRI ICE — cep-checker.js
   Verificador de cobertura: consulta o CEP na API ViaCEP e
   compara cidade/bairro com a área definida em site-config.js.

   Também expõe REFRI_ICE.consultarCep(cep), usado pelo
   formulário de contato.
   ========================================================= */

(function () {
  const config = window.REFRI_ICE || {};
  const cobertura = config.cobertura || { cidadesInteiras: [], bairrosPorCidade: {} };

  function normalizar(texto) {
    return (texto || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Compara palavras inteiras ("Sé" não deve casar com "Jardim Sesmarias")
  function contemTermo(texto, termo) {
    const escapado = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(^|[^a-z0-9])' + escapado + '($|[^a-z0-9])').test(texto);
  }

  function avaliar(dados) {
    if (dados.uf !== 'SP') return 'nao';

    const cidade = normalizar(dados.localidade);
    const bairro = normalizar(dados.bairro);

    if (cobertura.cidadesInteiras.some(function (c) { return normalizar(c) === cidade; })) {
      return 'sim';
    }

    const chave = Object.keys(cobertura.bairrosPorCidade).find(function (c) {
      return normalizar(c) === cidade;
    });
    if (!chave) return 'nao';

    // CEP geral da cidade (sem bairro): precisa confirmar com a equipe
    if (!bairro) return 'consultar';

    return cobertura.bairrosPorCidade[chave].some(function (b) {
      return contemTermo(bairro, normalizar(b));
    }) ? 'sim' : 'nao';
  }

  function formatarCep(valor) {
    const digitos = (valor || '').replace(/\D/g, '').slice(0, 8);
    return digitos.length > 5 ? digitos.slice(0, 5) + '-' + digitos.slice(5) : digitos;
  }

  /* Retorna Promise<{ situacao: 'sim'|'nao'|'consultar', dados }>
     ou rejeita com Error('invalido' | 'nao-encontrado' | 'rede') */
  function consultarCep(cep) {
    const digitos = (cep || '').replace(/\D/g, '');
    if (digitos.length !== 8) return Promise.reject(new Error('invalido'));

    return fetch('https://viacep.com.br/ws/' + digitos + '/json/')
      .catch(function () { throw new Error('rede'); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status === 400 ? 'invalido' : 'rede');
        return res.json();
      })
      .then(function (dados) {
        if (dados.erro) throw new Error('nao-encontrado');
        return { situacao: avaliar(dados), dados: dados };
      });
  }

  config.consultarCep = consultarCep;
  config.formatarCep = formatarCep;

  /* ---------- Painéis de verificação na página ---------- */
  function el(tag, classe, texto) {
    const node = document.createElement(tag);
    if (classe) node.className = classe;
    if (texto) node.textContent = texto;
    return node;
  }

  function renderResultado(alvo, tipo, icone, titulo, detalhe, link) {
    alvo.replaceChildren();
    const box = el('div', 'cep-result cep-result--' + tipo);
    box.appendChild(el('span', 'cep-result__icon', icone));

    const corpo = el('div');
    if (titulo) corpo.appendChild(el('strong', null, titulo));
    if (detalhe) corpo.appendChild(el('small', null, detalhe));
    if (link) {
      const a = el('a', null, link.texto);
      a.href = link.href;
      a.target = '_blank';
      a.rel = 'noopener';
      corpo.appendChild(a);
    }
    box.appendChild(corpo);
    alvo.appendChild(box);
  }

  function initPanel(panel) {
    const form = panel.querySelector('[data-cep-form]');
    const input = panel.querySelector('[data-cep-input]');
    const button = panel.querySelector('[data-cep-submit]');
    const result = panel.querySelector('[data-cep-result]');

    if (!form || !input || !result) return;

    input.addEventListener('input', function () {
      input.value = formatarCep(input.value);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const cep = formatarCep(input.value);

      if (cep.length !== 9) {
        renderResultado(result, 'no', '!', 'CEP incompleto', 'Digite os 8 números do CEP.');
        input.focus();
        return;
      }

      renderResultado(result, 'loading', '', null, 'Consultando CEP…');
      if (button) button.disabled = true;

      consultarCep(cep)
        .then(function (resposta) {
          const d = resposta.dados;
          const local = [(d.bairro || '').replace(/\.$/, ''), d.localidade].filter(Boolean).join(', ');

          if (resposta.situacao === 'sim') {
            renderResultado(result, 'ok', '✓', 'Atendemos ' + local + '!', d.logradouro || null, {
              texto: 'Pedir orçamento para este endereço →',
              href: config.linkWhatsApp('Olá, Refri Ice! Meu CEP é ' + cep + ' (' + local + ') e gostaria de um orçamento.')
            });
          } else {
            renderResultado(
              result, 'no', '!',
              resposta.situacao === 'consultar'
                ? 'Precisamos confirmar esse endereço'
                : local + ' está fora da nossa área principal',
              'Fale com a gente pelo WhatsApp: podemos avaliar o seu atendimento.',
              {
                texto: 'Consultar pelo WhatsApp →',
                href: config.linkWhatsApp('Olá, Refri Ice! Vocês atendem o CEP ' + cep + ' (' + local + ')?')
              }
            );
          }
        })
        .catch(function (erro) {
          const mensagens = {
            'invalido': ['CEP inválido', 'Confira os números digitados.'],
            'nao-encontrado': ['CEP não encontrado', 'Confira os números digitados.'],
            'rede': ['Não foi possível consultar agora', 'Tente de novo ou fale direto com a gente.']
          };
          const msg = mensagens[erro.message] || mensagens.rede;
          renderResultado(result, 'no', '!', msg[0], msg[1], erro.message === 'rede' ? {
            texto: 'Chamar no WhatsApp →',
            href: config.linkWhatsApp('Olá, Refri Ice! Vocês atendem o CEP ' + cep + '?')
          } : null);
        })
        .finally(function () {
          if (button) button.disabled = false;
        });
    });
  }

  document.querySelectorAll('[data-coverage-panel]').forEach(initPanel);
})();
