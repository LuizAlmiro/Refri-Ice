# Refri Ice — Refrigeração & Climatização

Site institucional da Refri Ice: câmaras frias para resfriados e congelados (instalação,
manutenção preventiva e reparo) e serviços de ar-condicionado em toda a Grande São Paulo
(a capital e os 39 municípios da Região Metropolitana).

Site estático: HTML, CSS e JavaScript, sem etapa de build.

## Páginas

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Início: câmara fria, obras, ar-condicionado, como funciona, empresas, cobertura, dúvidas |
| `camara-fria.html` | Câmara fria: serviços, tipos (resfriados e congelados), clientes, galeria completa de obras |
| `servicos.html` | Ar-condicionado: instalação, tipos de aparelho, manutenção, desinstalação e empresas |
| `sobre.html` | História, trajetória, qualificações e dados da empresa |
| `contato.html` | Formulário de orçamento e canais de atendimento |

## Onde editar as informações

Quase tudo o que muda com o tempo está em **`js/site-config.js`**:

- **WhatsApp** (`whatsapp`): número usado em todos os botões do site.
- **E-mail** (`emailOrcamentos`): endereço que recebe os pedidos do formulário.
- **Área de cobertura** (`cobertura`): cidades e bairros aceitos pelo verificador de CEP.
  `cidadesInteiras` vale para o município todo; `bairrosPorCidade`, só para os bairros listados.
- **Mapa** (`mapa`): rótulo e ponto do marcador no mapa da página inicial. O contorno da
  área pintada fica em `js/area-cobertura.js` (Região Metropolitana de São Paulo, extraída do
  OpenStreetMap, relação 2661855, licença ODbL).

Textos, telefones exibidos e horários ficam direto no HTML de cada página.

## Formulário de orçamento

O envio usa o [FormSubmit](https://formsubmit.co) (gratuito, sem cadastro). No **primeiro**
pedido enviado pelo site publicado, o FormSubmit manda um e-mail de confirmação para o
endereço configurado em `site-config.js`; basta clicar em *Activate Form* uma vez.

Se o envio por e-mail falhar, o site oferece ao cliente mandar o mesmo pedido pelo WhatsApp.

## Fotos e vídeos das obras

- Fotos otimizadas para o site ficam em `img/obras/` (JPEG, lado maior de até 1200 px).
- Vídeos ficam em `video/` e só carregam quando o visitante clica (a capa de cada vídeo é
  uma imagem em `img/obras/video-*.jpg`).
- Para incluir uma obra nova na galeria, copie um bloco `<a class="gallery__item" ...>` em
  `index.html` (prévia) ou `camara-fria.html` (galeria completa) e troque imagem e legenda.
  Itens com `gallery__item--tall` ocupam duas linhas da grade.
- Os arquivos originais enviados pelo cliente ficam em `_midia-cliente/`, fora do Git.

### Fotos de ar-condicionado (`img/ar/`)

São fotos de banco de imagens, usadas como ilustração dos serviços (não são obras da Refri Ice).
As licenças do [Pexels](https://www.pexels.com/license/) e do [Unsplash](https://unsplash.com/license)
permitem uso comercial sem necessidade de crédito; as fontes ficam registradas aqui:

| Arquivo | Fonte |
|---|---|
| `ar-instalacao.jpg` | [Pexels #5463576](https://www.pexels.com/photo/5463576/) |
| `ar-manutencao.jpg` | [Pexels #6471912](https://www.pexels.com/photo/6471912/) |
| `ar-ambiente.jpg` | [Pexels #6588597](https://www.pexels.com/photo/6588597/) |
| `ar-condensadora.jpg` | [Unsplash ItJsBJlf5Qw](https://unsplash.com/photos/ItJsBJlf5Qw) — Andrianto Cahyono Putro |
| `ar-desinstalacao.jpg` | [Unsplash 32sdOfMXRC8](https://unsplash.com/photos/32sdOfMXRC8) — Maxwell Odonkor |
| `ar-higienizacao.jpg` | [Unsplash WwzK2S0h6zU](https://unsplash.com/photos/WwzK2S0h6zU) — Birmingham Airduct Cleaning Services |

Quando o cliente tiver fotos reais de instalações de ar-condicionado, basta substituir esses
arquivos mantendo os mesmos nomes.

### Fundo do topo da página inicial (`img/hero-fundo.jpg`)

Foto ilustrativa de equipamentos de refrigeração industrial, do
[Unsplash (Crystal Kwok)](https://unsplash.com/photos/xD5SWy7hMbw), licença Unsplash. Fica atrás de
uma camada azul-marinho (definida em `css/camara-fria.css`, `.hero__bg::after`) que garante a
leitura do texto. Para trocar, substitua o arquivo por outra foto horizontal de pelo menos 1920 px.

## Estrutura

```
css/    style.css (base) · header.css · components.css · sections.css · camara-fria.css · footer.css
js/     site-config.js · menu.js · script.js · cep-checker.js · contact-form.js · coverage-map.js · gallery.js
img/    logo, favicons e obras/ (fotos da galeria)
video/  vídeos das obras
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
