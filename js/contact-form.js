/* =========================================================
   REFRI ICE — contact-form.js
   Validação básica e feedback do formulário de contato.

   >>> ESTE FORMULÁRIO AINDA NÃO ENVIA E-MAIL <<<
   Para receber as solicitações de fato, conecte a um serviço
   de envio (ex: Formspree, EmailJS) ou a um backend próprio,
   substituindo a função "enviar()" abaixo.
   ========================================================= */

(function () {
  const form = document.querySelector('[data-contact-form]');
  const feedback = document.querySelector('[data-contact-feedback]');

  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Placeholder: aqui entraria a chamada real de envio.
    enviar(new FormData(form));

    feedback.textContent = 'Solicitação recebida! Em breve entraremos em contato.';
    feedback.style.color = 'var(--success)';
    form.reset();
  });

  function enviar(dadosFormulario) {
    // Substitua por uma chamada fetch() ao seu serviço de envio.
    console.log('Dados do formulário (exemplo):', Object.fromEntries(dadosFormulario));
  }
})();
