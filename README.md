# Refri Ice — Refrigeração & Climatização

Site institucional da Refri Ice: instalação, manutenção e desinstalação de ar-condicionado
em São Paulo (Pinheiros, Lapa, Morumbi e Centro), Osasco, Barueri e Alphaville.

Site estático: HTML, CSS e JavaScript, sem etapa de build.

## Páginas

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Início: serviços, tipos de aparelho, como funciona, empresas, cobertura, dúvidas |
| `servicos.html` | Detalhe de instalação, manutenção, desinstalação e contratos para empresas |
| `sobre.html` | História, trajetória, qualificações e dados da empresa |
| `contato.html` | Formulário de orçamento e canais de atendimento |

## Onde editar as informações

Quase tudo o que muda com o tempo está em **`js/site-config.js`**:

- **WhatsApp** (`whatsapp`): número usado em todos os botões do site.
- **E-mail** (`emailOrcamentos`): endereço que recebe os pedidos do formulário.
- **Área de cobertura** (`cobertura`): cidades e bairros aceitos pelo verificador de CEP.
  `cidadesInteiras` vale para o município todo; `bairrosPorCidade`, só para os bairros listados.
- **Mapa** (`mapa`): posição, raio e rótulo de cada região mostrada na página inicial.

Textos, telefones exibidos e horários ficam direto no HTML de cada página.

## Formulário de orçamento

O envio usa o [FormSubmit](https://formsubmit.co) (gratuito, sem cadastro). No **primeiro**
pedido enviado pelo site publicado, o FormSubmit manda um e-mail de confirmação para o
endereço configurado em `site-config.js`; basta clicar em *Activate Form* uma vez.

Se o envio por e-mail falhar, o site oferece ao cliente mandar o mesmo pedido pelo WhatsApp.

## Estrutura

```
css/    style.css (base) · header.css · components.css · sections.css · footer.css
js/     site-config.js · menu.js · script.js · cep-checker.js · contact-form.js · coverage-map.js
img/    logo, favicons e ícones
```

## Serviços externos usados

- [ViaCEP](https://viacep.com.br) — consulta de CEP do verificador de cobertura.
- [OpenStreetMap](https://www.openstreetmap.org/copyright) + [Leaflet](https://leafletjs.com) — mapa da área atendida (o crédito ao OpenStreetMap deve ser mantido).
- [Google Fonts](https://fonts.google.com) — fontes Saira e Figtree.
- [FormSubmit](https://formsubmit.co) — envio do formulário por e-mail.

## Rodar localmente

Abrir `index.html` no navegador já funciona. Para um ambiente mais próximo do publicado,
sirva a pasta em um servidor local, por exemplo:

```bash
npx serve .
```
