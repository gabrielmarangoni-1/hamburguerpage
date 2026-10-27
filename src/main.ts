import './style.css'
import { products, business } from './store'

type Cart = Record<string, number>
type View = 'cardapio' | 'sacola' | 'sobre'
const key = 'brasa-cart-v2'
const esc = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!))
const money = (price: number | null) => price === null ? 'Valor a consultar' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price / 100)
const icon = (name: string) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ({ bag: '<path d="M5 7h14l1 14H4L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>', menu: '<path d="M4 5h16M4 12h16M4 19h16"/>', about: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>', plus: '<path d="M12 5v14M5 12h14"/>', arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>', close: '<path d="m6 6 12 12M18 6 6 18"/>', minus: '<path d="M5 12h14"/>' }[name] || '') + '</svg>'
let cart: Cart = {}
try {
  const saved: unknown = JSON.parse(localStorage.getItem(key) || '{}')
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    for (const product of products) {
      const quantity = (saved as Record<string, unknown>)[product.id]
      if (typeof quantity === 'number' && Number.isInteger(quantity) && quantity > 0 && quantity <= 99) cart[product.id] = quantity
    }
  }
} catch { /* A damaged browser store must not block ordering. */ }
let view: View = 'cardapio'
let category = 'Todos'
let query = ''
let notes = ''
let toastTimer = 0
const count = () => Object.values(cart).reduce((sum, value) => sum + value, 0)
const selected = () => products.filter(product => cart[product.id])
const total = () => selected().some(product => product.price === null) ? 'A confirmar com a loja' : money(selected().reduce((sum, product) => sum + (product.price || 0) * cart[product.id], 0))
const whatsappReady = /^\d{10,15}$/.test(business.whatsapp)
document.querySelector('#app')!.innerHTML = '<a class="skip-link" href="#main">Pular para o conteúdo</a><header class="app-header"><a class="brand" href="#cardapio" aria-label="Brasa Burger, cardápio">BRASA<span>BURGER</span></a><nav class="desktop-nav" aria-label="Navegação principal"><a href="#cardapio">Cardápio</a><a href="#sobre">A Brasa</a></nav><a class="cart-link" href="#sacola">' + icon('bag') + ' Sacola <span class="count">0</span></a></header><main id="main" class="shell" tabindex="-1"></main><footer class="footer shell"><span>BRASA BURGER · Projeto demonstrativo</span><span>Fotografias ilustrativas. Valores e atendimento sujeitos à confirmação.</span></footer><nav class="mobile-nav" aria-label="Navegação móvel"><a href="#cardapio">' + icon('menu') + '<span>Cardápio</span></a><a href="#sacola">' + icon('bag') + '<span>Sacola <span class="count">0</span></span></a><a href="#sobre">' + icon('about') + '<span>A Brasa</span></a></nav><div class="toast" role="status" aria-live="polite"></div><dialog class="product-dialog" aria-labelledby="detail-title"></dialog>'
const main = document.querySelector<HTMLElement>('#main')!
const dialog = document.querySelector<HTMLDialogElement>('dialog')!
const notify = (message: string) => {
  const toast = document.querySelector<HTMLElement>('.toast')!
  toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2800)
}
const persist = () => {
  try { localStorage.setItem(key, JSON.stringify(cart)) } catch { notify('Sacola mantida nesta sessão. Seu navegador não permitiu salvá-la.') }
  document.querySelectorAll('.count').forEach(element => { element.textContent = String(count()) })
}
const summary = (checkout = false) => '<section class="summary" aria-label="Resumo da sacola"><h2>Seu pedido</h2><div class="summary-row"><span>Itens na sacola</span><strong>' + count() + '</strong></div><div class="summary-row"><span>Total</span><strong>' + (count() ? total() : 'Nenhum item') + '</strong></div><p>Disponibilidade, valores e entrega são confirmados na conversa.</p>' + (!whatsappReady ? '<p class="notice">Pedidos pelo WhatsApp ainda indisponíveis. Você pode montar sua sacola e voltar depois.</p>' : '') + (checkout ? '<button class="primary" data-checkout ' + (!count() || !whatsappReady ? 'disabled' : '') + '>Continuar no WhatsApp ' + icon('arrow') + '</button>' : '<a class="primary" href="#sacola">Revisar sacola ' + icon('arrow') + '</a>') + '</section>'
const productCards = () => {
  const items = products.filter(product => (category === 'Todos' || product.category === category) && (product.name + ' ' + product.description).toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')))
  return items.length ? items.map(product => '<article class="product-card"><button class="product-photo" data-detail="' + product.id + '" aria-label="Ver detalhes de ' + product.name + '"><img src="' + product.image + '" alt="Fotografia ilustrativa de ' + product.name + '" width="600" height="480" loading="lazy"></button><div class="product-content"><span class="product-category">' + product.category + '</span><h3><button data-detail="' + product.id + '">' + product.name + '</button></h3><p>' + product.description + '</p><div class="product-bottom"><span class="price">' + money(product.price) + '</span><button class="secondary" data-add="' + product.id + '" aria-label="Adicionar ' + product.name + '">' + icon('plus') + ' Adicionar</button></div></div></article>').join('') : '<div class="empty-state"><h3>Nenhum burger por aqui.</h3><p>Tente outro nome ou veja todas as categorias.</p><button class="secondary" data-reset>Limpar filtros</button></div>'
}
const updateProducts = () => {
  document.querySelector('#products')!.innerHTML = productCards()
  document.querySelectorAll<HTMLButtonElement>('[data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)))
  document.querySelector<HTMLButtonElement>('[data-clear]')!.hidden = !query
}
function render() {
  document.title = ({ cardapio: 'Cardápio', sacola: 'Sua sacola', sobre: 'A Brasa' })[view] + ' · Brasa Burger'
  document.querySelectorAll<HTMLAnchorElement>('nav a').forEach(link => {
    if (link.hash === '#' + view) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current')
  })
  if (view === 'cardapio') {
    main.innerHTML = '<section class="intro"><div class="intro-copy"><h1>Fome de<br><em>algo de verdade.</em></h1><p>Escolha seu burger, monte a sacola e combine seu pedido direto com a Brasa.</p><a href="#catalogo" class="button">Escolher meu burger ' + icon('arrow') + '</a></div><img src="' + products[0].image + '" alt="Hambúrguer artesanal — fotografia ilustrativa" width="900" height="640" fetchpriority="high"></section><div class="catalog-layout"><section id="catalogo"><div class="catalog-toolbar"><h2>O que vai ser hoje?</h2><div class="search-field"><label for="search">Buscar no cardápio</label><div><input id="search" type="search" placeholder="Burger, bacon, batatas…" value="' + esc(query) + '"><button data-clear aria-label="Limpar busca" ' + (!query ? 'hidden' : '') + '>' + icon('close') + '</button></div></div></div><div class="filters" role="group" aria-label="Categorias">' + ['Todos', 'Clássicos', 'Especiais', 'Acompanhamentos'].map(label => '<button data-category="' + label + '" aria-pressed="' + (category === label) + '">' + label + '</button>').join('') + '</div><div class="product-grid" id="products">' + productCards() + '</div></section><aside class="order-aside">' + summary() + '</aside></div>'
  } else if (view === 'sacola') {
    main.innerHTML = '<div class="page-heading"><a href="#cardapio">Voltar ao cardápio</a><h1>Sua sacola.</h1><p>Do seu jeito, até o último detalhe.</p></div>' + (count() ? '<div class="cart-layout"><section aria-label="Itens selecionados">' + selected().map(product => '<article class="cart-item"><img src="' + product.image + '" alt="" width="120" height="120"><div class="cart-item-info"><h2>' + product.name + '</h2><p>' + money(product.price) + '</p><button class="remove" data-remove="' + product.id + '">Remover ' + product.name + '</button></div><div class="quantity"><button data-change="' + product.id + '" data-delta="-1" aria-label="Diminuir ' + product.name + '">' + icon('minus') + '</button><span aria-label="Quantidade">' + cart[product.id] + '</span><button data-change="' + product.id + '" data-delta="1" aria-label="Aumentar ' + product.name + '" ' + (cart[product.id] >= 99 ? 'disabled' : '') + '>' + icon('plus') + '</button></div></article>').join('') + '<div class="field"><label for="notes">Observações do pedido <span>(opcional)</span></label><textarea id="notes" maxlength="500" rows="4" placeholder="Ex.: sem cebola. A loja confirma se pode atender.">' + esc(notes) + '</textarea><p>Até 500 caracteres. Evite incluir dados de pagamento.</p></div></section><aside>' + summary(true) + '</aside></div>' : '<section class="empty-state"><span class="empty-icon">' + icon('bag') + '</span><h2>Falta escolher seu favorito.</h2><p>Os produtos que você adicionar aparecem aqui.</p><a class="primary" href="#cardapio">Explorar cardápio ' + icon('arrow') + '</a></section>')
  } else {
    main.innerHTML = '<div class="page-heading"><h1>Prazer, Brasa.</h1><p>Um conceito de hamburgueria artesanal, feito para quem gosta de escolher cada mordida.</p></div><section class="about-layout"><img src="' + products[2].image + '" alt="Fotografia ilustrativa de hambúrguer" width="800" height="800"><div><h2>O sabor começa<br>na escolha.</h2><p>Clássicos, combinações especiais e acompanhamentos. Um cardápio direto para você encontrar o que combina com a sua fome.</p><p>Esta loja é um projeto demonstrativo. As fotografias são ilustrativas e não representam pratos ou instalações reais da Brasa.</p><a class="primary" href="#cardapio">Conhecer o cardápio ' + icon('arrow') + '</a></div></section><section class="steps"><h2>Como funciona o pedido</h2><ol><li><h3>Escolha seus favoritos</h3><p>Adicione os produtos e ajuste as quantidades.</p></li><li><h3>Revise a sacola</h3><p>Confira os itens e inclua uma observação, se quiser.</p></li><li><h3>Converse com a loja</h3><p>Quando o atendimento estiver disponível, abra o WhatsApp e envie a mensagem. A loja confirma valores, disponibilidade e entrega.</p></li></ol></section>'
  }
  persist()
}
const navigate = () => {
  const hash = location.hash.slice(1)
  if (hash === 'catalogo' && document.querySelector('#catalogo')) { document.querySelector('#catalogo')!.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); return }
  if (hash === 'main') { main.focus(); return }
  view = hash === 'sacola' || hash === 'sobre' ? hash : 'cardapio'
  render(); window.scrollTo(0, 0); main.focus({ preventScroll: true })
}
window.addEventListener('hashchange', navigate)
document.addEventListener('input', event => {
  const target = event.target as HTMLInputElement
  if (target.id === 'search') { query = target.value; updateProducts() }
  if (target.id === 'notes') notes = target.value.slice(0, 500)
})
document.addEventListener('click', event => {
  const button = (event.target as Element).closest<HTMLElement>('button')
  if (!button) return
  if (button.hasAttribute('data-clear') || button.hasAttribute('data-reset')) {
    query = ''; if (button.hasAttribute('data-reset')) category = 'Todos'
    const input = document.querySelector<HTMLInputElement>('#search')!; input.value = ''; updateProducts(); input.focus()
  }
  if (button.dataset.category) { category = button.dataset.category; updateProducts() }
  const id = button.dataset.add || button.dataset.change || button.dataset.remove || button.dataset.detail
  const product = products.find(item => item.id === id)
  if (product && button.dataset.detail) {
    dialog.innerHTML = '<button class="dialog-close secondary" data-close aria-label="Fechar detalhes">' + icon('close') + '</button><img class="detail-image" src="' + product.image + '" alt="Fotografia ilustrativa de ' + product.name + '" width="600" height="480"><div class="detail-body"><span class="product-category">' + product.category + '</span><h2 id="detail-title">' + product.name + '</h2><p>' + product.description + '</p><p>Fotografia ilustrativa. Consulte ingredientes e restrições alimentares com a loja.</p><div class="detail-actions"><strong>' + money(product.price) + '</strong><button class="primary" data-add="' + product.id + '">Adicionar à sacola ' + icon('plus') + '</button></div></div>'
    dialog.showModal()
  }
  if (button.hasAttribute('data-close')) dialog.close()
  if (product && (button.dataset.add || button.dataset.change || button.dataset.remove)) {
    const quantity = button.dataset.remove ? 0 : Math.min(99, (cart[product.id] || 0) + (button.dataset.add ? 1 : Number(button.dataset.delta)))
    if (quantity <= 0) delete cart[product.id]; else cart[product.id] = quantity
    if (dialog.open) dialog.close()
    if (view === 'sacola') {
      const delta = button.dataset.delta; render()
      const target = document.querySelector<HTMLElement>('[data-change="' + product.id + '"][data-delta="' + delta + '"]') || main
      target.focus({ preventScroll: true })
    } else { document.querySelector('.order-aside')!.innerHTML = summary(); persist() }
    notify(button.dataset.add ? product.name + ' adicionado à sacola.' : quantity <= 0 ? product.name + ' removido da sacola.' : 'Quantidade atualizada: ' + quantity + '.')
  }
  if (button.hasAttribute('data-checkout') && count() && whatsappReady) {
    const message = ['Olá! Gostaria de consultar este pedido:', ...selected().map(product => cart[product.id] + ' × ' + product.name), notes ? 'Observações: ' + notes : '', 'Por favor, confirmem valores, disponibilidade e opções de entrega.'].filter(Boolean).join('\n')
    window.open('https://wa.me/' + business.whatsapp + '?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer')
  }
})
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close() } })
navigate()
