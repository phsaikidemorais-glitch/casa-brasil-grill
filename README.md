# Casa Brasil Grill — Versão Final com WhatsApp e Imagens Reais

Projeto fictício de restaurante brasileiro premium com identidade visual, imagens realistas, cardápio interativo e fluxo de pedido/reserva via WhatsApp.

## O que tem nesta versão

- Home premium com imagem hero realista
- Logo aplicado no header, footer e favicon
- Cardápio com fotos próprias dos pratos
- Busca no cardápio
- Filtros por categoria
- Pedido rápido com resumo lateral
- Botão flutuante de pedido
- WhatsApp automático com mensagem pronta
- Formulário de reserva
- Reserva pelo WhatsApp com dados preenchidos
- Página de ambiente
- Página de contato
- Responsivo para desktop e mobile

## Como rodar

No terminal, dentro da pasta do projeto:

```bash
python -m http.server 5500
```

Abra no navegador:

```txt
http://localhost:5500
```

Ou use a extensão Live Server no VS Code.

## Estrutura

```txt
casa-brasil-grill-final-whatsapp-real/
├── index.html
├── cardapio.html
├── reservas.html
├── sobre.html
├── contato.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── imagens/
   ├── logo-principal.png
   ├── logo-branco.png
   ├── logo-monograma.png
   ├── favicon.png
   ├── hero-brasa-casa-brasil.png
   ├── picanha-premium.png
   ├── feijoada-premium.png
   ├── coxinha-artesanal.png
   ├── drink-caipirinha.png
   ├── acai-especial.png
   ├── mesa-reserva-premium.png
   ├── ambiente-casa-brasil.png
   └── mockup-apresentacao-casa-brasil.png

```

## WhatsApp

O número usado no JavaScript é fictício:

```js
const WHATSAPP_NUMBER = "551140022026";
```

Para usar com cliente real, troque pelo número do restaurante com DDI e DDD.
