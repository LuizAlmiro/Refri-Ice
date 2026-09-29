/* =========================================================
   REFRI ICE — contact-form.js
   Formulário de orçamento: máscaras, verificação do CEP,
   envio por e-mail (FormSubmit) e atalho para o WhatsApp.

   >>> ATIVAÇÃO DO ENVIO POR E-MAIL <<<
   O envio usa o serviço gratuito FormSubmit (formsubmit.co).
   No PRIMEIRO pedido enviado pelo site publicado, o FormSubmit
   manda um e-mail de confirmação para o endereço configurado
   em site-config.js (emailOrcamentos). Basta clicar em
   "Activate Form" nesse e-mail uma única vez.
   ========================================================= */

(function () {
  const config = window.REFRI_ICE || {};
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const status = form.querySelector('[data-contact-status]');
  const submit = form.querySelector('[data-contact-submit]');
  const telefone = form.querySelector('#telefone');
  const cep = form.querySelector('#cep');
  const cepHint = form.querySelector('[data-cep-hint]');

  let localCep = ''; // "Bairro, Cidade" retornado pela consulta

  /* ---------- Campos que mudam conforme o serviço ---------- */
  const servico = form.querySelector('#servico');
  const grupos = form.querySelectorAll('[data-grupo]');
  const quantidadeLabel = form.querySelector('[data-quantidade-label]');
  const marcaLabel = form.querySelector('[data-marca-label]');
  const marca = form.querySelector('#marca');
  const mensagem = form.querySelector('#mensagem');

  const textosPorTipo = {
    camara: {
      quantidade: 'Quantidade de câmaras',
      marca: 'Tamanho aproximado',
      marcaExemplo: 'Ex.: 3 x 2 m, pé-direito de 2,5 m',
      mensagemExemplo: 'Ex.: câmara de congelados para açougue; ou câmara parou de gelar desde ontem.'
    },
    ar: {
      quantidade: 'Quantidade de aparelhos',
      marca: 'Marca e capacidade',
      marcaExemplo: 'Ex.: LG, 12.000 BTUs',
      mensagemExemplo: 'Ex.: instalação em apartamento no 5º andar, condensadora na varanda.'
    },
    geral: {
      quantidade: 'Quantidade',
      marca: 'Equipamento',
      marcaExemplo: 'Ex.: marca, modelo ou tamanho',
      mensagemExemplo: 'Conte o que você precisa.'
    }
  };

  function tipoDoServico() {
    const opcao = servico.options[servico.selectedIndex];
    return (opcao && opcao.getAttribute('data-tipo')) || 'geral';
  }

  function atualizarCampos() {
    const tipo = tipoDoServico();
    const t = textosPorTipo[tipo];
    grupos.forEach(function (g) { g.hidden = g.getAttribute('data-grupo') !== tipo; });
    quantidadeLabel.textContent = t.quantidade;
    marcaLabel.firstChild.textContent = t.marca + ' ';
    marca.placeholder = t.marcaExemplo;
    mensagem.placeholder = t.mensagemExemplo;
  }

  servico.addEventListener('change', atualizarCampos);
  atualizarCampos();

  /* ---------- Máscaras ---------- */
  telefone.addEventListener('input', function () {
    const d = telefone.value.replace(/\D/g, '').slice(0, 11);
    let v = d;
    if (d.length > 2) v = '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length > 7) v = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(d.length - 4);
    telefone.value = v;
  });

  cep.addEventListener('input', function () {
    cep.value = config.formatarCep ? config.formatarCep(cep.value) : cep.value;
    localCep = '';
    setHint('', '');
    if (cep.value.length === 9) verificarCep(cep.value);
  });

  /* ---------- Verificação de cobertura ao digitar o CEP ---------- */
  function setHint(texto, tipo) {
    cepHint.textContent = texto;
    cepHint.classList.toggle('is-ok', tipo === 'ok');
    cepHint.classList.toggle('is-warn', tipo === 'warn');
  }

  function verificarCep(valor) {
    if (!config.consultarCep) return;
    setHint('Consultando CEP…', '');

    config.consultarCep(valor)
      .then(function (resposta) {
        if (cep.value !== valor) return; // o usuário já mudou o CEP
        const d = resposta.dados;
        localCep = [(d.bairro || '').replace(/\.$/, ''), d.localidade].filter(Boolean).join(', ');

        if (resposta.situacao === 'sim') {
          setHint('✓ ' + localCep + ' — atendemos sua região', 'ok');
        } else {
          setHint(localCep + ' — fora da área principal, mas envie que avaliamos', 'warn');
        }
      })
      .catch(function (erro) {
        if (cep.value !== valor) return;
        setHint(erro.message === 'rede' ? '' : 'CEP não encontrado. Confira os números.', erro.message === 'rede' ? '' : 'warn');
      });
  }

  /* ---------- Validação ---------- */
  function validar() {
    let primeiroInvalido = null;

    form.querySelectorAll('[required]').forEach(function (campo) {
      let valido = campo.value.trim() !== '';
      if (campo === telefone) valido = telefone.value.replace(/\D/g, '').length >= 10;
      if (campo === cep) valido = cep.value.replace(/\D/g, '').length === 8;

      campo.closest('.field').classList.toggle('is-invalid', !valido);
      if (!valido && !primeiroInvalido) primeiroInvalido = campo;
    });

    const email = form.querySelector('#email');
    if (email.value && !email.checkValidity()) {
      email.closest('.field').classList.add('is-invalid');
      primeiroInvalido = primeiroInvalido || email;
    } else {
      email.closest('.field').classList.remove('is-invalid');
    }

    if (primeiroInvalido) primeiroInvalido.focus();
    return !primeiroInvalido;
  }

  form.addEventListener('input', function (event) {
    const field = event.target.closest('.field');
    if (field) field.classList.remove('is-invalid');
  });

  /* ---------- Montagem dos dados ---------- */
  function coletar() {
    const f = new FormData(form);
    const tipo = tipoDoServico();
    // Tipo de câmara ou de aparelho, conforme o serviço escolhido
    const equipamento = tipo === 'camara' ? { rotulo: 'Tipo de câmara', valor: f.get('camara') }
      : tipo === 'ar' ? { rotulo: 'Tipo de aparelho', valor: f.get('aparelho') }
      : null;

    return {
      nome: (f.get('nome') || '').trim(),
      telefone: f.get('telefone'),
      email: (f.get('email') || '').trim(),
      cep: f.get('cep'),
      local: localCep,
      servico: f.get('servico'),
      quantidade: f.get('quantidade'),
      rotuloQuantidade: textosPorTipo[tipo].quantidade,
      equipamento: equipamento,
      marca: (f.get('marca') || '').trim(),
      rotuloMarca: textosPorTipo[tipo].marca,
      mensagem: (f.get('mensagem') || '').trim(),
      honey: f.get('_honey')
    };
  }

  function mensagemWhatsApp(d) {
    const linhas = [
      'Olá, Refri Ice! Fiz um pedido de orçamento pelo site:',
      '• Nome: ' + d.nome,
      '• Serviço: ' + d.servico
    ];
    if (d.equipamento) linhas.push('• ' + d.equipamento.rotulo + ': ' + d.equipamento.valor);
    linhas.push('• ' + d.rotuloQuantidade + ': ' + d.quantidade);
    linhas.push('• CEP: ' + d.cep + (d.local ? ' (' + d.local + ')' : ''));
    if (d.marca) linhas.push('• ' + d.rotuloMarca + ': ' + d.marca);
    if (d.mensagem) linhas.push('• Detalhes: ' + d.mensagem);
    return linhas.join('\n');
  }

  function enviarEmail(d) {
    const payload = {
      _subject: 'Novo pedido de orçamento: ' + d.servico + ' — ' + d.nome,
      _template: 'table',
      _captcha: 'false',
      _honey: d.honey || '',
      Nome: d.nome,
      'WhatsApp / Telefone': d.telefone,
      'Serviço': d.servico,
      'Tipo de câmara / aparelho': d.equipamento ? d.equipamento.valor : '—',
      Quantidade: d.quantidade,
      'Equipamento / tamanho': d.marca || '—',
      CEP: d.cep,
      'Bairro / Cidade': d.local || '—',
      Mensagem: d.mensagem || '—'
    };
    if (d.email) payload.email = d.email; // FormSubmit usa este campo como "responder para"

    return fetch('https://formsubmit.co/ajax/' + config.emailOrcamentos, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (json) {
        if (!res.ok || String(json.success) !== 'true') throw new Error(json.message || 'Falha no envio');
        return json;
      });
    });
  }

  /* ---------- Mensagens de retorno ---------- */
  function mostrarStatus(tipo, titulo, texto, linkWhats, rotuloWhats) {
    status.replaceChildren();
    const box = document.createElement('div');
    box.className = 'form-status form-status--' + tipo;

    const strong = document.createElement('strong');
    strong.textContent = titulo;
    box.appendChild(strong);
    box.appendChild(document.createTextNode(texto));

    if (linkWhats) {
      const br = document.createElement('br');
      const a = document.createElement('a');
      a.className = 'btn btn--whatsapp btn--sm';
      a.href = linkWhats;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = rotuloWhats;
      box.appendChild(br);
      box.appendChild(a);
    }

    status.appendChild(box);
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ---------- Envio ---------- */
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!validar()) return;

    const dados = coletar();
    const linkWhats = config.linkWhatsApp(mensagemWhatsApp(dados));

    // Robôs costumam preencher o campo escondido: finge sucesso e não envia
    if (dados.honey) {
      mostrarStatus('ok', 'Pedido enviado!', 'Em breve entraremos em contato.');
      form.reset();
      atualizarCampos();
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Enviando…';

    enviarEmail(dados)
      .then(function () {
        mostrarStatus(
          'ok',
          'Pedido enviado com sucesso!',
          'Recebemos seus dados e vamos retornar com o orçamento. Quer agilizar? Mande o resumo também pelo WhatsApp.',
          linkWhats,
          'Enviar resumo pelo WhatsApp'
        );
        form.reset();
        atualizarCampos();
        localCep = '';
        setHint('', '');
      })
      .catch(function () {
        mostrarStatus(
          'error',
          'Não foi possível enviar pelo site agora.',
          'Seus dados não foram perdidos: envie o pedido pelo WhatsApp com um clique.',
          linkWhats,
          'Enviar pedido pelo WhatsApp'
        );
      })
      .finally(function () {
        submit.disabled = false;
        submit.textContent = 'Enviar pedido de orçamento';
      });
  });
})();
