import './style.css'
import { products, business } from './store'

type Cart = Record<string, number>
const cartKey = 'brasa-cart-v3'
const icon = (name: string) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${({ arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>', bag: '<path d="M5 7h14l1 14H4L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/>', menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', close: '<path d="m6 6 12 12M18 6 6 18"/>', plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>' } as Record<string, string>)[name] || ''}</svg>`
const money = (price: number | null) => price === null ? 'Consultar' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price / 100)
let cart: Cart = {}
try {
  const stored = JSON.parse(localStorage.getItem(cartKey) || '{}') as Record<string, unknown>
  for (const product of products) if (Number.isInteger(stored[product.id]) && Number(stored[product.id]) > 0) cart[product.id] = Math.min(99, Number(stored[product.id]))
} catch { /* Ignore malformed local state and start with an empty bag. */ }
let category = 'Todos'
let query = ''
let lastTrigger: HTMLElement | null = null
const count = () => Object.values(cart).reduce((total, quantity) => total + quantity, 0)
const selected = () => products.filter(product => cart[product.id])
const whatsappReady = /^\d{10,15}$/.test(business.whatsapp)
const persist = () => { try { localStorage.setItem(cartKey, JSON.stringify(cart)) } catch { /* Keep the bag in memory. */ }; document.querySelectorAll('.bag-count').forEach(item => item.textContent = String(count())) }
const productCards = () => {
  const filtered = products.filter(product => (category === 'Todos' || product.category === category) && `${product.name} ${product.description}`.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')))
  return filtered.length ? filtered.map(product => `<article class="menu-card"><button class="menu-card-image" data-detail="${product.id}" aria-label="Ver ${product.name}"><img src="${product.image}" alt="Fotografia ilustrativa de ${product.name}" width="720" height="560" loading="lazy"><span class="image-index">${String(products.indexOf(product) + 1).padStart(2, '0')}</span></button><div class="menu-card-copy"><span class="menu-card-category">${product.category}</span><h3>${product.name}</h3><p>${product.description}</p><div class="menu-card-bottom"><strong>${money(product.price)}</strong><button class="add-product" data-add="${product.id}" aria-label="Adicionar ${product.name}">${icon('plus')} <span>Adicionar</span></button></div></div></article>`).join('') : '<div class="empty-menu"><h3>Nada encontrado.</h3><p>Tente outra busca ou volte para todos os itens.</p><button class="outline-button" data-reset>Limpar filtros</button></div>'
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <a class="skip-link" href="#menu">Pular para o cardápio</a>
  <header class="site-header" id="top"><a class="wordmark" href="#top" aria-label="Brasa Burger, início">BRASA<span>BURGER</span></a><nav aria-label="Navegação principal"><a href="#menu">Cardápio</a><a href="#story">A Brasa</a><a href="#experience">Experiência</a></nav><button class="bag-button" data-open-bag aria-label="Abrir sacola"><span>Sacola</span>${icon('bag')}<b class="bag-count">0</b></button><button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Abrir menu">${icon('menu')}</button></header>
  <div class="mobile-menu" id="mobile-menu" aria-hidden="true"><a href="#menu">Cardápio</a><a href="#story">A Brasa</a><a href="#experience">Experiência</a><button data-open-bag>Ver sacola <b class="bag-count">0</b></button></div>
  <main>
    <section class="hero" aria-labelledby="hero-title"><div class="hero-photo"></div><div class="hero-shade"></div><div class="hero-content"><p class="kicker">BURGER ARTESANAL · FEITO NA CHAPA</p><h1 id="hero-title">A fome pede<br><em>Brasa.</em></h1><p>Carne suculenta, pão tostado e combinações que fazem o dia ficar melhor.</p><a class="solid-button" href="#menu">Ver o cardápio ${icon('arrow')}</a></div><div class="hero-note">01<br><span>DA CASA</span></div><div class="hero-scroll">ROLE PARA DESCOBRIR <i></i></div></section>
    <section class="marquee" aria-label="Manifesto"><span>CARNE NA CHAPA</span><i>✳</i><span>PÃO TOSTADO</span><i>✳</i><span>VONTADE DE REPETIR</span><i>✳</i><span>CARNE NA CHAPA</span></section>
    <section class="menu-section" id="menu"><div class="section-heading"><div><p class="kicker dark">ESCOLHA COM CALMA</p><h2>O cardápio<br><em>da casa.</em></h2></div><p>Combinações diretas, ingredientes que conversam e espaço para você escolher o que dá vontade.</p></div><div class="menu-controls"><div class="category-tabs" role="group" aria-label="Categorias">${['Todos', 'Clássicos', 'Especiais', 'Acompanhamentos'].map(label => `<button data-category="${label}" aria-pressed="${category === label}">${label}</button>`).join('')}</div><label class="search"><span>Buscar</span><input id="search" type="search" placeholder="burger, bacon…" aria-label="Buscar no cardápio"><button data-clear aria-label="Limpar busca" hidden>${icon('close')}</button></label></div><div class="menu-grid" id="menu-grid">${productCards()}</div></section>
    <section class="manifesto"><div class="manifesto-word">BRASA<br><em>&amp;</em><br>CO.</div><div><p class="kicker dark">O QUE ACREDITA</p><h2>O simples bem feito<br><em>fica na memória.</em></h2><p>Um bom burger não precisa de muita explicação. Precisa de ingredientes honestos, fogo alto e alguém que se importa com o detalhe.</p><a class="text-link" href="#story">Conheça nossa ideia ${icon('arrow')}</a></div></section>
    <section class="feature" id="story"><div class="feature-image"><img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85" alt="Interior de restaurante — fotografia ilustrativa" width="1200" height="900" loading="lazy"><span>UM LUGAR PARA FICAR</span></div><div class="feature-copy"><p class="kicker">A BRASA</p><h2>Feito para<br><em>quem chega com fome.</em></h2><p>Esta é uma identidade visual demonstrativa. As fotos ilustram o clima da marca; pratos, endereço e horários dependem dos dados reais da operação.</p><a class="outline-light" href="#menu">Escolher um burger ${icon('arrow')}</a></div></section>
    <section class="experience" id="experience"><div class="section-heading"><div><p class="kicker dark">PARA ACOMPANHAR</p><h2>Bons burgers.<br><em>Boas histórias.</em></h2></div><p>O melhor momento é aquele em que todo mundo para de falar por alguns segundos.</p></div><div class="experience-grid"><figure><img src="https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1000&q=85" alt="Burger e batatas — fotografia ilustrativa" width="1000" height="1200" loading="lazy"><figcaption>01 / dividir é opcional</figcaption></figure><figure><img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85" alt="Preparo gastronômico — fotografia ilustrativa" width="1000" height="800" loading="lazy"><figcaption>02 / feito no momento</figcaption></figure></div></section>
    <section class="final-cta"><p class="kicker">QUANDO BATER A FOME</p><h2>Você já sabe<br><em>onde encontrar.</em></h2><a class="solid-button" href="#menu">Montar meu pedido ${icon('arrow')}</a><small>Pedidos e valores são confirmados diretamente com a loja.</small></section>
  </main>
  <footer class="site-footer"><div class="footer-inner"><a class="wordmark" href="#top">BRASA<span>BURGER</span></a><p>Artesanal, intenso,<br>feito para repetir.</p><div><a href="#menu">Cardápio</a><a href="#story">A Brasa</a><a href="#top">Voltar ao topo ↑</a></div></div><div class="footer-bottom"><span>© 2024 Brasa Burger</span><span>Fotografias ilustrativas · projeto demonstrativo</span></div></footer>
  <aside class="bag-drawer" aria-label="Sua sacola" aria-hidden="true"><div class="drawer-head"><div><p class="kicker dark">SEU PEDIDO</p><h2>Sacola</h2></div><button data-close-bag aria-label="Fechar sacola">${icon('close')}</button></div><div class="drawer-items"></div><div class="drawer-foot"><p class="drawer-total"><span>Total</span><strong>A confirmar</strong></p><button class="solid-button full" data-whatsapp ${!whatsappReady ? 'disabled' : ''}>Continuar no WhatsApp ${icon('arrow')}</button><small>${whatsappReady ? 'A loja confirma disponibilidade, valores e entrega.' : 'Configure o número comercial em src/store.ts para ativar o atendimento.'}</small></div></aside><div class="drawer-backdrop" hidden></div>
  <dialog class="product-dialog" aria-labelledby="detail-title"></dialog><div class="toast" role="status" aria-live="polite"></div>
`

const grid = document.querySelector<HTMLDivElement>('#menu-grid')!
const bag = document.querySelector<HTMLElement>('.bag-drawer')!
const backdrop = document.querySelector<HTMLElement>('.drawer-backdrop')!
const dialog = document.querySelector<HTMLDialogElement>('.product-dialog')!
const notify = (message: string) => { const toast = document.querySelector<HTMLElement>('.toast')!; toast.textContent = message; toast.classList.add('show'); window.setTimeout(() => toast.classList.remove('show'), 2400) }
const openBag = (trigger?: HTMLElement) => { lastTrigger = trigger || document.querySelector<HTMLElement>('[data-open-bag]'); bag.classList.add('open'); bag.setAttribute('aria-hidden', 'false'); backdrop.hidden = false; document.body.classList.add('drawer-open'); bag.querySelector<HTMLElement>('button')?.focus() }
const closeBag = () => { bag.classList.remove('open'); bag.setAttribute('aria-hidden', 'true'); backdrop.hidden = true; document.body.classList.remove('drawer-open'); lastTrigger?.focus() }
const renderBag = () => {
  persist()
  const list = document.querySelector<HTMLElement>('.drawer-items')!
  list.innerHTML = selected().length ? selected().map(product => `<article class="drawer-item"><img src="${product.image}" alt="" width="72" height="72"><div><strong>${product.name}</strong><span>${money(product.price)}</span><div class="quantity"><button data-quantity="${product.id}" data-delta="-1" aria-label="Diminuir ${product.name}">${icon('minus')}</button><b>${cart[product.id]}</b><button data-quantity="${product.id}" data-delta="1" aria-label="Aumentar ${product.name}">${icon('plus')}</button></div></div></article>`).join('') : '<div class="drawer-empty"><span>✳</span><h3>Sua sacola está vazia.</h3><p>Escolha seu próximo favorito no cardápio.</p><button data-close-bag>Voltar ao cardápio</button></div>'
  document.querySelector<HTMLElement>('.drawer-total strong')!.textContent = count() ? (selected().some(product => product.price === null) ? 'A confirmar' : money(selected().reduce((sum, product) => sum + (product.price || 0) * cart[product.id], 0))) : 'A confirmar'
  const whatsapp = document.querySelector<HTMLButtonElement>('[data-whatsapp]')!; whatsapp.disabled = !whatsappReady || !count()
}
const refreshGrid = () => { grid.innerHTML = productCards(); document.querySelectorAll<HTMLButtonElement>('[data-category]').forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.category === category))); document.querySelector<HTMLButtonElement>('[data-clear]')!.hidden = !query }
document.addEventListener('input', event => { const input = event.target as HTMLInputElement; if (input.id === 'search') { query = input.value; refreshGrid() } })
document.addEventListener('click', event => {
  const target = event.target as HTMLElement
  const button = target.closest<HTMLElement>('button')
  if (button?.dataset.category) { category = button.dataset.category; refreshGrid() }
  if (button?.hasAttribute('data-clear') || button?.hasAttribute('data-reset')) { query = ''; category = button.hasAttribute('data-reset') ? 'Todos' : category; const input = document.querySelector<HTMLInputElement>('#search')!; input.value = ''; refreshGrid(); input.focus() }
  if (button?.dataset.add) { const id = button.dataset.add; cart[id] = Math.min(99, (cart[id] || 0) + 1); renderBag(); notify(`${products.find(product => product.id === id)?.name} adicionado à sacola.`) }
  if (button?.dataset.quantity) { const id = button.dataset.quantity; cart[id] = (cart[id] || 0) + Number(button.dataset.delta); if (cart[id] <= 0) delete cart[id]; renderBag() }
  if (button?.hasAttribute('data-open-bag')) openBag(button)
  if (button?.hasAttribute('data-close-bag') || target === backdrop) closeBag()
  const detailId = button?.dataset.detail
  if (detailId) { const product = products.find(item => item.id === detailId)!; dialog.innerHTML = `<button class="dialog-close" data-close-detail aria-label="Fechar detalhes">${icon('close')}</button><img src="${product.image}" alt="Fotografia ilustrativa de ${product.name}" width="720" height="560"><div><span class="menu-card-category">${product.category}</span><h2 id="detail-title">${product.name}</h2><p>${product.description}</p><strong>${money(product.price)}</strong><button class="solid-button" data-add="${product.id}">Adicionar à sacola ${icon('plus')}</button></div>`; dialog.showModal() }
  if (button?.hasAttribute('data-close-detail')) dialog.close()
  if (button?.hasAttribute('data-whatsapp') && count() && whatsappReady) { const message = ['Olá! Gostaria de consultar este pedido:', ...selected().map(product => `${cart[product.id]} × ${product.name}`), 'Por favor, confirmem valores, disponibilidade e entrega.'].join('\n'); window.open(`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer') }
})
const menuButton = document.querySelector<HTMLButtonElement>('.menu-button')!
const mobileMenu = document.querySelector<HTMLElement>('.mobile-menu')!
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') === 'true'; menuButton.setAttribute('aria-expanded', String(!open)); menuButton.innerHTML = icon(open ? 'menu' : 'close'); mobileMenu.classList.toggle('open', !open); mobileMenu.setAttribute('aria-hidden', String(open)) })
document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', () => menuButton.click()))
document.addEventListener('keydown', event => { if (event.key === 'Escape') { if (dialog.open) dialog.close(); else if (bag.classList.contains('open')) closeBag(); else if (mobileMenu.classList.contains('open')) menuButton.click() } })
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close() })
renderBag()
