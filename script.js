/* ==========================================================================
   BELLA MASSA — script.js
   Contém: dados do cardápio, lógica do carrinho, cálculo de totais
   e montagem da mensagem enviada para o WhatsApp.
   ========================================================================== */

/* =========================================================
   CONFIGURAÇÕES — troque pelos dados reais do seu restaurante
   ========================================================= */
const WHATSAPP_NUMBER = "5599999999999"; // TODO: coloque aqui o número real com DDI 55 + DDD, só números
const FRETE_VALOR = 8;        // taxa de entrega padrão em R$
const FRETE_GRATIS_ACIMA = 80; // valor mínimo do subtotal para frete grátis

/* =========================================================
   CARDÁPIO — para adicionar/remover itens, edite este array.
  Cada produto precisa de: id (único), nome, descricao, preco, categoria e imagem
   categorias disponíveis: tradicionais | especiais | doces | bebidas
   ========================================================= */
const produtos = [
  // ---- Entradas ----
  { id: "e1", nome: "Pão de Alho Artesanal", descricao: "Pão feito na casa, recheado com alho, manteiga de ervas e gratinado.", preco: 22.00, categoria: "entradas", imagem: "images/pao-de-alho.png" },
  { id: "e2", nome: "Bruschetta Caprese", descricao: "Fatias de pão italiano com tomate, muçarela de búfala e manjericão fresco.", preco: 28.00, categoria: "entradas", imagem: "images/Classic-Bruschetta.png" },
  { id: "e3", nome: "Provolone à Milanesa", descricao: "Provolone empanado e frito, servido com molho de tomate artesanal.", preco: 32.00, categoria: "entradas", imagem: "images/Provolone-à-Milanesa.png" },
  { id: "e4", nome: "Carpaccio de Carne", descricao: "Fatias finas de carne, lascas de parmesão, rúcula e molho especial.", preco: 38.00, categoria: "entradas", imagem: "images/carpaccio.png" },

  // ---- Massas ----
  { id: "m1", nome: "Fettuccine ao Sugo", descricao: "Massa fresca com molho de tomate caseiro e manjericão.", preco: 36.00, categoria: "massas", imagem: "images/fettuccine.png" },
  { id: "m2", nome: "Nhoque ao Molho Branco", descricao: "Nhoque de batata artesanal com molho branco cremoso.", preco: 39.00, categoria: "massas", imagem: "images/nhoque.png" },
  { id: "m3", nome: "Penne ao Molho Rosé", descricao: "Penne em molho rosé com toque de parmesão.", preco: 38.00, categoria: "massas", imagem: "images/penne.png" },
  { id: "m4", nome: "Lasanha à Bolonhesa", descricao: "Camadas de massa fresca, molho bolonhesa e queijo gratinado.", preco: 44.00, categoria: "massas", imagem: "images/lasanha.png" },

  // ---- Pizzas Tradicionais ----
  { id: "p1", nome: "Calabresa", descricao: "Molho de tomate artesanal, muçarela, calabresa fatiada, cebola e orégano.", preco: 42.00, categoria: "tradicionais", imagem: "images/calabresa.png" },
  { id: "p2", nome: "Muçarela", descricao: "Molho de tomate artesanal, muçarela caprichada, rodelas de tomate e orégano.", preco: 38.00, categoria: "tradicionais", imagem: "images/mucarela.png" },
  { id: "p3", nome: "Margherita", descricao: "Molho de tomate, muçarela, rodelas de tomate, manjericão fresco e azeite de oliva.", preco: 44.00, categoria: "tradicionais", imagem: "images/margarita.png" },
  { id: "p4", nome: "Frango com Catupiry", descricao: "Molho de tomate, muçarela, frango desfiado temperado e o legítimo Catupiry.", preco: 46.00, categoria: "tradicionais", imagem: "images/catupiry.png" },

  // ---- Pizzas Especiais ----
  { id: "p5", nome: "Portuguesa", descricao: "Molho de tomate, muçarela, presunto, ovos, cebola, ervilha e azeitonas pretas.", preco: 48.00, categoria: "especiais", imagem: "images/portuguesa.png" },
  { id: "p6", nome: "Quatro Queijos", descricao: "Molho de tomate, muçarela, provolone, parmesão e gorgonzola.", preco: 50.00, categoria: "especiais", imagem: "images/Pizza-4-queijo.png" },
  { id: "p7", nome: "Quatro Estações", descricao: "Quatro sabores divididos: calabresa, muçarela, palmito e cogumelos.", preco: 52.00, categoria: "especiais", imagem: "images/quatro-estacoes.png" },
  { id: "p10", nome: "Abobrinha", descricao: "Muçarela,Abobrinha,Parmesão e alho", preco: 48.00, categoria: "especiais", imagem: "images/abobrinha.png"},
  { id: "p11", nome: "Lombo", descricao: "Lombo canadense,Muçarela e Requeijao cremoso", preco: 48.00, categoria: "especiais", imagem: "images/lombo.png"},

  // ---- Pizzas Doces ----
  { id: "p8", nome: "Chocolate com Morango", descricao: "Chocolate ao leite derretido coberto com morangos frescos .", preco: 45.00, categoria: "doces", imagem: "images/morango.png" },
  { id: "p9", nome: "Romeu e Julieta", descricao: "A combinação perfeita de muçarela e goiabada cremosa.", preco: 42.00, categoria: "doces", imagem: "images/romeu-julieta.png" },

  // ---- Bebidas ----
  { id: "b1", nome: "Refrigerante Lata (350ml)", descricao: "Gelado, na lata.", preco: 6.00, categoria: "bebidas", imagem: "images/lata.png" },
  { id: "b2", nome: "Refrigerante 2 Litros", descricao: "Ideal para dividir.", preco: 12.00, categoria: "bebidas", imagem: "images/2litros.png" },
  { id: "b3", nome: "Suco Natural (Laranja / Limão)", descricao: "Feito na hora.", preco: 8.00, categoria: "bebidas", imagem: "images/suco.png" },
  { id: "b4", nome: "Água Mineral (Com ou Sem Gás)", descricao: "500ml.", preco: 4.50, categoria: "bebidas", imagem: "images/agua.png" },
];

/* Estado do carrinho: { [id]: quantidade } — fica só na memória da página */
let carrinho = {};
let categoriaAtual = "tradicionais";

/* =========================================================
   FORMATAÇÃO DE MOEDA
   ========================================================= */
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/* =========================================================
   RENDERIZAÇÃO DO CARDÁPIO
   ========================================================= */
const menuGrid = document.getElementById("menuGrid");

function renderizarMenu() {
  const itensDaCategoria = produtos.filter(p => p.categoria === categoriaAtual);
  menuGrid.innerHTML = itensDaCategoria.map(produto => `
    <article class="product-card">
      <div class="product-photo-wrap">
        <img src="${produto.imagem}" alt="${produto.nome}" class="product-photo" loading="lazy"
             onerror="this.classList.add('img-missing'); this.parentElement.classList.add('no-photo')">
      </div>
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <div class="product-card-footer">
        <span class="product-price">${formatarMoeda(produto.preco)}</span>
        <button class="add-btn" type="button" data-id="${produto.id}" aria-label="Adicionar ${produto.nome} ao carrinho">+</button>
      </div>
    </article>
  `).join("");
}

document.getElementById("menuTabs").addEventListener("click", (e) => {
  const botao = e.target.closest(".tab-btn");
  if (!botao) return;
  categoriaAtual = botao.dataset.cat;
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.toggle("is-active", b === botao);
    b.setAttribute("aria-selected", b === botao ? "true" : "false");
  });
  renderizarMenu();
});

menuGrid.addEventListener("click", (e) => {
  const botao = e.target.closest(".add-btn");
  if (!botao) return;
  adicionarAoCarrinho(botao.dataset.id);
  abrirCarrinho();
});

/* =========================================================
   LÓGICA DO CARRINHO
   ========================================================= */
function adicionarAoCarrinho(id) {
  carrinho[id] = (carrinho[id] || 0) + 1;
  renderizarCarrinho();
}

function alterarQuantidade(id, delta) {
  if (!carrinho[id]) return;
  carrinho[id] += delta;
  if (carrinho[id] <= 0) delete carrinho[id];
  renderizarCarrinho();
}

function removerItem(id) {
  delete carrinho[id];
  renderizarCarrinho();
}

function calcularSubtotal() {
  return Object.entries(carrinho).reduce((total, [id, qtd]) => {
    const produto = produtos.find(p => p.id === id);
    return total + (produto ? produto.preco * qtd : 0);
  }, 0);
}

function calcularFrete(subtotal) {
  if (subtotal === 0) return 0;
  return subtotal >= FRETE_GRATIS_ACIMA ? 0 : FRETE_VALOR;
}

const cartItemsEl = document.getElementById("cartItems");
const cartEmptyMsg = document.getElementById("cartEmptyMsg");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartDeliveryEl = document.getElementById("cartDelivery");
const cartTotalEl = document.getElementById("cartTotal");
const deliveryHintEl = document.getElementById("deliveryHint");
const cartCountEl = document.getElementById("cartCount");
const fabCartCountEl = document.getElementById("fabCartCount");

function renderizarCarrinho() {
  const idsNoCarrinho = Object.keys(carrinho);
  const totalItens = Object.values(carrinho).reduce((a, b) => a + b, 0);

  // Contadores nos botões de carrinho
  cartCountEl.textContent = totalItens;
  fabCartCountEl.textContent = totalItens;

  // Lista de itens
  if (idsNoCarrinho.length === 0) {
    cartEmptyMsg.style.display = "block";
    cartItemsEl.querySelectorAll(".cart-item").forEach(el => el.remove());
  } else {
    cartEmptyMsg.style.display = "none";
    cartItemsEl.innerHTML = idsNoCarrinho.map(id => {
      const produto = produtos.find(p => p.id === id);
      const qtd = carrinho[id];
      const totalItem = produto.preco * qtd;
      return `
        <div class="cart-item" data-id="${id}">
          <span class="cart-item-name">${produto.nome}</span>
          <button class="cart-item-remove" type="button" data-action="remover" data-id="${id}">remover</button>
          <span class="cart-item-price">${formatarMoeda(produto.preco)} / un.</span>
          <div class="qty-control">
            <button class="qty-btn" type="button" data-action="menos" data-id="${id}" aria-label="Diminuir quantidade">−</button>
            <span class="qty-value">${qtd}</span>
            <button class="qty-btn" type="button" data-action="mais" data-id="${id}" aria-label="Aumentar quantidade">+</button>
            <span class="cart-item-total">${formatarMoeda(totalItem)}</span>
          </div>
        </div>
      `;
    }).join("") + cartEmptyMsg.outerHTML;
    // Garante que a msg de vazio (escondida) continue no DOM para reaproveitar o elemento
    cartItemsEl.querySelector("#cartEmptyMsg").style.display = "none";
  }

  // Totais
  const subtotal = calcularSubtotal();
  const frete = calcularFrete(subtotal);
  const total = subtotal + frete;

  cartSubtotalEl.textContent = formatarMoeda(subtotal);
  cartDeliveryEl.textContent = frete === 0 ? "Grátis" : formatarMoeda(frete);
  cartTotalEl.textContent = formatarMoeda(total);

  if (subtotal === 0) {
    deliveryHintEl.textContent = `Frete grátis a partir de ${formatarMoeda(FRETE_GRATIS_ACIMA)}`;
  } else if (subtotal >= FRETE_GRATIS_ACIMA) {
    deliveryHintEl.textContent = "Você ganhou frete grátis! 🎉";
  } else {
    const faltam = FRETE_GRATIS_ACIMA - subtotal;
    deliveryHintEl.textContent = `Faltam ${formatarMoeda(faltam)} para o frete grátis`;
  }
}

cartItemsEl.addEventListener("click", (e) => {
  const botao = e.target.closest("button[data-action]");
  if (!botao) return;
  const { action, id } = botao.dataset;
  if (action === "mais") alterarQuantidade(id, 1);
  if (action === "menos") alterarQuantidade(id, -1);
  if (action === "remover") removerItem(id);
});

/* =========================================================
   ABRIR / FECHAR GAVETA DO CARRINHO
   ========================================================= */
const cartDrawer = document.getElementById("carrinho");
const cartOverlay = document.getElementById("cartOverlay");

function abrirCarrinho() {
  cartDrawer.classList.add("is-open");
  cartOverlay.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function fecharCarrinho() {
  cartDrawer.classList.remove("is-open");
  cartOverlay.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.getElementById("btnOpenCart").addEventListener("click", abrirCarrinho);
document.getElementById("btnFabCart").addEventListener("click", abrirCarrinho);
document.getElementById("btnCloseCart").addEventListener("click", fecharCarrinho);
cartOverlay.addEventListener("click", fecharCarrinho);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fecharCarrinho();
});

/* =========================================================
   ENVIO DO PEDIDO PARA O WHATSAPP
   ========================================================= */
function montarMensagemPedido() {
  const idsNoCarrinho = Object.keys(carrinho);
  if (idsNoCarrinho.length === 0) return null;

  const subtotal = calcularSubtotal();
  const frete = calcularFrete(subtotal);
  const total = subtotal + frete;

  let linhas = ["Olá! Gostaria de fazer o seguinte pedido:", ""];

  idsNoCarrinho.forEach(id => {
    const produto = produtos.find(p => p.id === id);
    const qtd = carrinho[id];
    linhas.push(`• ${qtd}x ${produto.nome} — ${formatarMoeda(produto.preco * qtd)}`);
  });

  linhas.push("");
  linhas.push(`Subtotal: ${formatarMoeda(subtotal)}`);
  linhas.push(`Entrega: ${frete === 0 ? "Grátis" : formatarMoeda(frete)}`);
  linhas.push(`Total: ${formatarMoeda(total)}`);
  linhas.push("");
  linhas.push("Nome:");
  linhas.push("Endereço:");

  return linhas.join("\n");
}

function enviarPedidoWhatsApp() {
  const mensagem = montarMensagemPedido();
  if (!mensagem) {
    alert("Seu carrinho está vazio. Adicione algum item antes de enviar o pedido.");
    return;
  }
  const url = `https://wa.me/${5562991165891}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank", "noopener");
}

document.getElementById("btnCheckoutWhats").addEventListener("click", enviarPedidoWhatsApp);

/* Botões gerais de "falar no WhatsApp" (sem pedido específico) */
function abrirWhatsAppGeral() {
  const mensagem = "Olá! Gostaria de fazer um pedido na Bella Massa.";
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank", "noopener");
}
document.getElementById("btnHeaderWhats").addEventListener("click", abrirWhatsAppGeral);
document.getElementById("btnHeroWhats").addEventListener("click", abrirWhatsAppGeral);
document.getElementById("btnContactWhats").addEventListener("click", abrirWhatsAppGeral);

/* =========================================================
   MENU MOBILE
   ========================================================= */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
navToggle.addEventListener("click", () => {
  const aberto = mainNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", aberto ? "true" : "false");
});
mainNav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") mainNav.classList.remove("is-open");
});

/* =========================================================
   FORMULÁRIO DE CONTATO (demonstrativo — não envia para servidor)
   ========================================================= */
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("formNote").textContent =
    "Mensagem pronta! Conecte este formulário a um serviço de e-mail ou back-end para recebê-la de verdade.";
  e.target.reset();
});

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */
document.getElementById("anoAtual").textContent = new Date().getFullYear();
renderizarMenu();
renderizarCarrinho();
