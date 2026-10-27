# Brasa Burger

Loja demonstrativa em Vite + TypeScript, com catálogo, busca, detalhes, sacola persistente e mensagem de pedido para WhatsApp.

## Executar

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

## Produção

```sh
npm run build
```

No Vercel: framework Vite, comando npm run build, diretório dist. Navegação usa hash e não necessita reescritas.

## Configurar atendimento

Em src/store.ts, preencha business.whatsapp com o número comercial internacional (código do país, DDD e número, somente dígitos). Cadastre cada price em centavos. null exibe valor a consultar. Nenhum dado comercial real foi presumido.

Sem telefone, o envio fica desabilitado. Ao continuar, o WhatsApp abre com uma mensagem preparada; a pessoa precisa enviá-la e a loja confirma o pedido. O site não processa pagamento.

Fotografias ilustrativas referenciadas externamente do Unsplash. A procedência/licença de cada arquivo ainda precisa ser documentada antes de uso comercial; as imagens não representam pratos reais da marca. Fontes dependem do Google Fonts. Não foi realizado deploy automaticamente.
