export const business = {
  // Código do país + DDD + número comercial, somente dígitos.
  whatsapp: '',
}
export type Product = { id: string; name: string; category: string; description: string; image: string; price: number | null }
const photo = (id: string) => 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=900&q=80'
// Preços em centavos. null indica que o valor comercial não foi fornecido.
export const products: Product[] = [
  { id: 'classic', name: 'Brasa Classic', category: 'Clássicos', description: 'Hambúrguer artesanal, cheddar, alface, tomate e molho da casa.', image: photo('photo-1550547660-d9450f859349'), price: null },
  { id: 'double', name: 'Double Smash', category: 'Clássicos', description: 'Dois discos de carne, queijo derretido, cebola e molho especial.', image: photo('photo-1572802419224-296b0aeee0d9'), price: null },
  { id: 'bacon', name: 'Bacon Fire', category: 'Especiais', description: 'Hambúrguer artesanal, bacon crocante, cheddar e molho defumado.', image: photo('photo-1586190848861-99aa4a171e90'), price: null },
  { id: 'chicken', name: 'Crispy Chicken', category: 'Especiais', description: 'Frango crocante, alface fresca e maionese temperada.', image: photo('photo-1606755962773-d324e0a13086'), price: null },
  { id: 'fries', name: 'Brasa Fries', category: 'Acompanhamentos', description: 'Batatas douradas e crocantes para acompanhar seu burger.', image: photo('photo-1573080496219-bb080dd4f877'), price: null },
]
