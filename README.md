# Receitas Proteicas de Liso

Landing page estática de Luana Araújo, pronta para publicar na Vercel. Inclui imagens e fonte locais, filtros de receitas, detalhes dos bônus e CTA móvel exibido após o bloco de receitas.

## Deploy na Vercel

1. Importe este repositório em **Add New → Project**.
2. Mantenha **Root Directory** como `./` e **Framework Preset** como **Other**.
3. A configuração está em `vercel.json`: instalação `npm ci --ignore-scripts`, build `npm run build`, saída `dist`.
4. Publique. Não há variáveis de ambiente necessárias.

O projeto usa Node.js 24 e não depende de pacotes externos. Quando o repositório estiver conectado à Vercel, os próximos pushes seguirão as regras de deploy configuradas no projeto.

## Desenvolvimento e verificação

```sh
npm ci --ignore-scripts
npm test
npm run build
python -m http.server 8080 --directory dist
```

## Arquivos

- `public/index.html`: página principal e destino do checkout.
- `public/privacidade/index.html`: política de privacidade.
- `public/assets/liso.css`: visual e responsividade.
- `public/assets/oferta.js`: filtros e comportamento do CTA móvel.
- `public/imgs/`: imagens e fonte.
- `scripts/build.mjs`: gera `dist/` para a Vercel.
- `tests/interactions.test.cjs`: valida filtros e gatilho de rolagem.

## Checkout e Pixel

O botão de compra aponta para `https://pay.cakto.com.br/gg42ydn_1314408`. A oferta anuncia R$17 e informa a taxa de R$0,99 observada no checkout, totalizando R$17,99. Se a taxa mudar na Cakto, atualize o texto da LP.

Meta Pixel configurado: `1146882501637448`, evento `PageView`. A página usa CSP com hash do código inline aprovado. Se editar esse trecho do Pixel, recalcule seu hash SHA-256 na meta Content-Security-Policy; o hash atual corresponde exatamente ao código presente no HTML.

Nenhuma credencial da Cakto, chave de API, arquivo de entrega pago ou documento interno faz parte deste repositório. O Pixel ID e a URL pública do checkout são configurações públicas da página.

## Escopo

Esta é a LP. O conteúdo vendido e as configurações de entrega, garantia e pagamento pertencem à Cakto e não são alterados pelo deploy deste site.
