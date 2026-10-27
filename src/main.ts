import './style.css'

type Category = 'Todos' | 'Clássicos' | 'Especiais' | 'Acompanhamentos'

const images = {
  hero: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1800&q=85',
  classic: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=85',
  double: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=1000&q=85',
  bacon: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=85',
  chicken: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=1000&q=85',
  fries: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1000&q=85',
  story: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85',
  detail: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=1800&q=85',
  table: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1000&q=85',
  kitchen: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85',
}

const products = [
  { name: 'Brasa Classic', category: 'Clássicos' as Category, description: 'Artesanal, cheddar, alface, tomate e molho da casa.', image: images.classic, number: '01' },
  { name: 'Double Smash', category: 'Clássicos' as Category, description: 'Dois discos de carne, queijo derretido, cebola e molho especial.', image: images.double, number: '02' },
  { name: 'Bacon Fire', category: 'Especiais' as Category, description: 'Bacon crocante, cheddar e um molho defumado de respeito.', image: images.bacon, number: '03' },
  { name: 'Crispy Chicken', category: 'Especiais' as Category, description: 'Frango crocante, folhas frescas e maionese temperada.', image: images.chicken, number: '04' },
  { name: 'Brasa Fries', category: 'Acompanhamentos' as Category, description: 'Batatas douradas e crocantes para dividir — ou não.', image: images.fries, number: '05' },
]

const icon = (name: string) => {
  const paths: Record<string, string> = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  }
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <header class="site-header" id="top">
    <a class="brand" href="#top" aria-label="Brasa Burger, início"><span>BRASA</span><i>BURGER</i></a>
    <nav class="desktop-nav" aria-label="Navegação principal">
      <a href="#menu">Cardápio</a><a href="#story">Nossa história</a><a href="#experience">Experiência</a><a href="#contact">Contato</a>
    </nav>
    <a class="header-cta" href="#menu">Fazer pedido ${icon('arrow')}</a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="mobile-nav" aria-label="Abrir menu">${icon('menu')}</button>
  </header>
  <div class="mobile-nav" id="mobile-nav" aria-hidden="true"><a href="#menu">Cardápio</a><a href="#story">Nossa história</a><a href="#experience">Experiência</a><a href="#contact">Contato</a><a class="mobile-order" href="#menu">Fazer pedido ${icon('arrow')}</a></div>

  <main>
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-backdrop"></div><div class="hero-grain"></div>
      <div class="hero-content reveal"><p class="eyebrow">ARTISAN BURGERS <span>/</span> MADE WITH PASSION</p><h1 id="hero-title">Não é só<br /><em>um burger.</em><br />É uma experiência.</h1><p class="hero-copy">Pão macio, carne suculenta e combinações que transformam cada mordida em um momento especial.</p><div class="hero-actions"><a class="button button-light" href="#menu">Explorar cardápio ${icon('arrow')}</a><a class="text-link" href="#story">Conheça a brasa <span>↓</span></a></div></div>
      <div class="hero-stamp">BB<br /><span>EST.</span> 2024</div><div class="scroll-cue"><span>SCROLL TO TASTE</span><i></i></div>
    </section>

    <section class="manifesto section-dark"><div class="manifesto-label reveal">01 <span>/</span> O MANIFESTO</div><div class="manifesto-copy"><p class="display reveal">O extraordinário<br />está nos <em>detalhes.</em></p><div class="manifesto-lines"><p class="reveal">Um bom hambúrguer começa na escolha dos ingredientes.</p><p class="reveal">A temperatura define o ponto. O queijo encontra a carne.</p><p class="reveal">E quando tudo se encontra, não é apenas fome que se satisfaz.</p><strong class="reveal">É vontade de repetir.</strong></div></div></section>

    <section class="menu-section" id="menu"><div class="section-top reveal"><div><p class="eyebrow dark">02 <span>/</span> O CARDÁPIO</p><h2>Escolha sua próxima<br /><em>obsessão.</em></h2></div><p class="section-intro">Combinações artesanais criadas para quem leva hambúrguer a sério.</p></div><div class="filters" role="group" aria-label="Filtrar cardápio">${(['Todos', 'Clássicos', 'Especiais', 'Acompanhamentos'] as Category[]).map((cat, i) => `<button class="filter ${i === 0 ? 'active' : ''}" data-filter="${cat}">${cat}</button>`).join('')}</div><div class="product-grid" id="product-grid"></div></section>

    <section class="feature"><div class="feature-image"><img src="${images.detail}" alt="Cheeseburger artesanal com queijo derretido" loading="lazy" /></div><div class="feature-copy"><p class="eyebrow">03 <span>/</span> A ASSINATURA</p><h2>Camadas de sabor.<br /><em>Zero compromissos.</em></h2><p>O tipo de burger que pede duas mãos, guardanapo e mais cinco minutos à mesa. Feito para ser lembrado.</p><a class="button button-orange" href="#menu">Ver o cardápio ${icon('arrow')}</a><span class="feature-mark">BRASA<br />&amp; CO.</span></div></section>

    <section class="story" id="story"><div class="story-image reveal"><img src="${images.story}" alt="Interior acolhedor de um restaurante contemporâneo" loading="lazy" /><span class="image-caption">Atmosfera que abre o apetite</span></div><div class="story-copy reveal"><p class="eyebrow dark">04 <span>/</span> NOSSA HISTÓRIA</p><h2>Feito para quem ama<br /><em>burger de verdade.</em></h2><p>A Brasa nasceu de uma obsessão simples: fazer o burger que a gente gostaria de encontrar em qualquer cidade. Sem pressa, sem atalhos e com espaço para cada ingrediente aparecer.</p><p>Da chapa quente ao último detalhe da mesa, cada escolha tem um motivo — e você sente isso na primeira mordida.</p><a class="text-link dark-link" href="#experience">Vem sentir a experiência <span>↗</span></a></div></section>

    <section class="experience" id="experience"><div class="section-top reveal"><div><p class="eyebrow">05 <span>/</span> A EXPERIÊNCIA</p><h2>Bons burgers.<br /><em>Bons momentos.</em></h2></div><p class="section-intro light">A mesa fica melhor quando a comida tem história para contar.</p></div><div class="experience-grid"><figure class="exp-large reveal"><img src="${images.table}" alt="Hambúrguer e batatas servidos à mesa" loading="lazy" /><figcaption>O ritual começa quando chega à mesa</figcaption></figure><figure class="exp-small reveal"><img src="${images.kitchen}" alt="Preparo artesanal em uma cozinha de restaurante" loading="lazy" /><figcaption>Feito na hora, do nosso jeito</figcaption></figure></div></section>

    <section class="final-cta" id="contact"><div class="final-mark">BRASA<br /><span>BURGER</span></div><p class="eyebrow">06 <span>/</span> O PRÓXIMO MOMENTO</p><h2>A fome passa.<br /><em>A vontade de voltar fica.</em></h2><p>Explore nossas combinações e escolha o seu próximo favorito.</p><a class="button button-light" href="#menu">Fazer meu pedido ${icon('arrow')}</a></section>
  </main>
  <footer class="footer"><div class="footer-brand"><a class="brand" href="#top"><span>BRASA</span><i>BURGER</i></a><p>Artesanal, intenso,<br />feito na brasa.</p></div><div class="footer-links"><div><span>Explore</span><a href="#menu">Cardápio</a><a href="#story">Nossa história</a><a href="#experience">Experiência</a></div><div><span>Fale com a gente</span><p>Contato em configuração</p><p>Horários em configuração</p></div><div><span>Siga a brasa</span><a href="#contact" aria-label="Instagram">Instagram ${icon('instagram')}</a></div></div><div class="footer-bottom"><span>© 2024 Brasa Burger</span><span>Fotografias: Unsplash — uso demonstrativo</span><a href="#top">Voltar ao topo ↑</a></div></footer>
`

const renderProducts = (filter: Category = 'Todos') => {
  const grid = document.querySelector<HTMLDivElement>('#product-grid')!
  const visible = products.filter((product) => filter === 'Todos' || product.category === filter)
  grid.innerHTML = visible.map((product) => `<article class="product-card reveal visible"><div class="product-image"><img src="${product.image}" alt="${product.name} — ${product.description}" loading="lazy" /><span>${product.number}</span><button aria-label="Adicionar ${product.name} ao pedido" class="add-button">+</button></div><div class="product-meta"><div><span class="category">${product.category}</span><h3>${product.name}</h3></div><p>${product.description}</p></div></article>`).join('')
}
renderProducts()

const header = document.querySelector<HTMLElement>('.site-header')!
const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle')!
const mobileNav = document.querySelector<HTMLElement>('.mobile-nav')!
menuToggle.addEventListener('click', () => { const open = menuToggle.getAttribute('aria-expanded') === 'true'; menuToggle.setAttribute('aria-expanded', String(!open)); menuToggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu'); menuToggle.innerHTML = icon(open ? 'menu' : 'close'); mobileNav.classList.toggle('open', !open); mobileNav.setAttribute('aria-hidden', String(open)) })
document.querySelectorAll<HTMLAnchorElement>('.mobile-nav a').forEach((link) => link.addEventListener('click', () => { menuToggle.click() }))
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30), { passive: true })
document.querySelectorAll<HTMLButtonElement>('.filter').forEach((button) => button.addEventListener('click', () => { document.querySelector('.filter.active')?.classList.remove('active'); button.classList.add('active'); renderProducts(button.dataset.filter as Category) }))
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target) } }), { threshold: 0.12 })
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))
