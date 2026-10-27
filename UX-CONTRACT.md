# Fluxo de pedidos

Fonte de requisitos: briefing Brasa Burger e decisões do usuário nesta conversa: loja com catálogo, sacola e encaminhamento pelo WhatsApp; nenhum pagamento integrado; não inventar dados comerciais.

- Rotas hash: #cardapio, #sacola, #sobre. Navegação via histórico do navegador e ações visíveis em mobile e desktop.
- Produtos e configuração comercial: src/store.ts. Preços em centavos ou null; null nunca é apresentado como gratuito. WhatsApp em formato internacional somente dígitos, vazio desabilita encaminhamento com explicação.
- Sacola salva apenas IDs conhecidos e quantidades inteiras de 1 a 99. Estado inválido não impede uso. Nenhum dado de pagamento é coletado. Observações ficam em memória durante a sessão.
- Adição confirma o nome do produto. Quantidades podem ser reduzidas; zero remove. Remoção explícita sempre disponível. Filtros e busca mantidos ao trocar telas na sessão.
- Revisão apresenta quantidades, valores conhecidos e observação opcional. Abrir WhatsApp mantém sacola; não cria pedido aceito, não envia mensagem automaticamente e não registra pagamento.
- Foco acompanha navegação e atualizações. Detalhes usam dialog com Escape, fundo inerte e retorno ao acionador. Estado vazio oferece retorno ao catálogo. Busca possui limpar explícito e filtros expõem aria-pressed.
- Sem número comercial, não há envio real. Imagens externas e fontes externas ainda dependem de conectividade.
