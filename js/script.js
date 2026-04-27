/* =========================================================
   CASA BRASIL GRILL — JS PREMIUM EDITION
   Header · menu · filtros · busca · pedido · reservas · WhatsApp
   + micro-interações premium (preloader, parallax, magnetic)
   ========================================================= */

/* ===== Elementos ===== */
const siteHeader = document.querySelector("#siteHeader");
const navToggle = document.querySelector("#navToggle");
const navList = document.querySelector("#navList");
const navLinks = document.querySelectorAll(".nav-link");
const revealItems = document.querySelectorAll(".reveal");
const toast = document.querySelector("#toast");
const cursorGlow = document.querySelector("#cursorGlow");

const orderDrawer = document.querySelector("#orderDrawer");
const drawerClose = document.querySelector("#drawerClose");
const floatingOrder = document.querySelector("#floatingOrder");
const floatingTotal = document.querySelector("#floatingTotal");
const orderItems = document.querySelector("#orderItems");
const orderTotal = document.querySelector("#orderTotal");
const finishOrder = document.querySelector("#finishOrder");
const sendWhatsAppOrder = document.querySelector("#sendWhatsAppOrder");
const reservationWhatsApp = document.querySelector("#reservationWhatsApp");
const WHATSAPP_NUMBER = "551140022026";

let order = [];

/* =========================================================
   PRELOADER - removido (não havia necessidade real, causava
   "Cb" travado no topo em alguns ambientes)
   Se quiser reativar: descomente o bloco abaixo
   ========================================================= */
// window.addEventListener("load", () => {
//   const preloader = document.querySelector("#preloader");
//   if (preloader) preloader.remove();
// });

// Remoção imediata caso esteja no DOM
const _preloader = document.querySelector("#preloader");
if (_preloader) _preloader.remove();

/* =========================================================
   HEADER scroll - blur progressivo
   ========================================================= */
function updateHeader() {
  if (!siteHeader) return;
  siteHeader.classList.toggle("scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("load", updateHeader);

/* =========================================================
   MENU mobile
   ========================================================= */
function closeMenu() {
  if (!navToggle || !navList) return;
  navToggle.classList.remove("active");
  navList.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
}

function toggleMenu() {
  if (!navToggle || !navList) return;
  const isOpen = navList.classList.toggle("open");
  navToggle.classList.toggle("active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
}

if (navToggle) {
  navToggle.addEventListener("click", toggleMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeDrawer();
  }
});

/* =========================================================
   CURSOR GLOW - smooth follow com lerp
   ========================================================= */
let mouseX = 0;
let mouseY = 0;
let glowX = 0;
let glowY = 0;

document.addEventListener("pointermove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

function animateGlow() {
  if (cursorGlow) {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
  }
  requestAnimationFrame(animateGlow);
}
animateGlow();

/* =========================================================
   REVEAL ON SCROLL - staggered
   ========================================================= */
function initReveal() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;

        // Delay escalonado se múltiplos elementos aparecem juntos
        const delay = entry.target.dataset.revealDelay || index * 80;
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, delay);

        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

initReveal();

/* =========================================================
   PARALLAX SUTIL no hero
   ========================================================= */
const heroPremium = document.querySelector(".hero-premium");
const heroFire = document.querySelector(".hero-fire");

if (heroPremium && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          heroPremium.style.backgroundPosition = `center ${50 + scrolled * 0.05}%`;
          if (heroFire) {
            heroFire.style.transform = `translateY(${scrolled * 0.15}px) scale(${1 + scrolled * 0.0003})`;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* =========================================================
   MAGNETIC BUTTONS - removido
   Os botões novos têm um look mais clean (estilo Linear/Vercel)
   onde o magnetic não combina. Hover sutil é suficiente.
   ========================================================= */

/* =========================================================
   TOAST
   ========================================================= */
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

/* =========================================================
   PEDIDO RÁPIDO
   ========================================================= */
function formatCurrency(value) {
  return `R$ ${value.toFixed(0)}`;
}

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function buildWhatsAppOrderUrl() {
  if (order.length === 0) {
    return buildWhatsAppUrl("Olá, Casa Brasil Grill. Gostaria de fazer uma reserva.");
  }

  const lines = order.map((item) =>
    `• ${item.qty}x ${item.name} — ${formatCurrency(item.price * item.qty)}`
  );
  const total = formatCurrency(getOrderTotal());

  const message = [
    "Olá, Casa Brasil Grill.",
    "Gostaria de fazer o seguinte pedido/reserva:",
    "",
    ...lines,
    "",
    `Total estimado: ${total}`,
    "",
    "Meu nome:",
    "Telefone:",
    "Data e horário desejados:",
    "Observações:"
  ].join("\n");

  return buildWhatsAppUrl(message);
}

function getOrderTotal() {
  return order.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function openDrawer() {
  if (!orderDrawer) return;
  orderDrawer.classList.add("open");
  document.body.classList.add("drawer-open");
}

function closeDrawer() {
  if (!orderDrawer) return;
  orderDrawer.classList.remove("open");
  document.body.classList.remove("drawer-open");
}

function renderOrder() {
  if (!orderItems || !orderTotal || !floatingTotal) return;

  const total = getOrderTotal();
  orderTotal.textContent = formatCurrency(total);
  floatingTotal.textContent = formatCurrency(total);

  if (finishOrder) {
    const summary = order.map((item) => `${item.qty}x ${item.name}`).join(", ");
    finishOrder.href = summary
      ? `reservas.html?pedido=${encodeURIComponent(summary)}`
      : "reservas.html";
  }

  if (sendWhatsAppOrder) {
    sendWhatsAppOrder.href = buildWhatsAppOrderUrl();
    sendWhatsAppOrder.classList.toggle("disabled-link", order.length === 0);
  }

  if (order.length === 0) {
    orderItems.innerHTML = '<p class="empty-order">Nenhum prato adicionado ainda.</p>';
    return;
  }

  orderItems.innerHTML = order
    .map(
      (item) => `
    <div class="order-item">
      <div>
        <h4>${item.name}</h4>
        <small>${formatCurrency(item.price)} cada</small>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" data-action="minus" data-name="${item.name}" type="button" aria-label="Remover">−</button>
        <span>${item.qty}</span>
        <button class="qty-btn" data-action="plus" data-name="${item.name}" type="button" aria-label="Adicionar">+</button>
      </div>
    </div>
  `
    )
    .join("");
}

function addToOrder(name, price) {
  const existing = order.find((item) => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    order.push({ name, price: Number(price), qty: 1 });
  }
  renderOrder();
  showToast(`${name} adicionado ao pedido`);
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest(".add-btn");
  if (addButton) {
    const name = addButton.dataset.name;
    const price = addButton.dataset.price;
    if (name && price) {
      addToOrder(name, price);
      // pequeno feedback visual
      addButton.style.transform = "scale(0.92)";
      setTimeout(() => { addButton.style.transform = ""; }, 180);
    }
  }

  const comboButton = event.target.closest(".add-combo-btn");
  if (comboButton) {
    addToOrder("Combo do Chef", 150);
    openDrawer();
  }

  const openOrderBtn = event.target.closest(".open-order-btn");
  if (openOrderBtn) {
    openDrawer();
  }
});

if (floatingOrder) {
  floatingOrder.addEventListener("click", openDrawer);
}

if (drawerClose) {
  drawerClose.addEventListener("click", closeDrawer);
}

if (orderItems) {
  orderItems.addEventListener("click", (event) => {
    const button = event.target.closest(".qty-btn");
    if (!button) return;

    const name = button.dataset.name;
    const action = button.dataset.action;
    const item = order.find((orderItem) => orderItem.name === name);

    if (!item) return;

    if (action === "plus") {
      item.qty += 1;
    }

    if (action === "minus") {
      item.qty -= 1;
      if (item.qty <= 0) {
        order = order.filter((orderItem) => orderItem.name !== name);
      }
    }

    renderOrder();
  });
}

renderOrder();

/* =========================================================
   FILTROS E BUSCA DO CARDÁPIO
   ========================================================= */
const filterButtons = document.querySelectorAll(".filter-btn");
const menuRows = document.querySelectorAll(".menu-row");
const menuSearch = document.querySelector("#menuSearch");
const noResults = document.querySelector("#noResults");

let activeFilter = "todos";

function filterMenu() {
  const searchTerm = menuSearch ? menuSearch.value.trim().toLowerCase() : "";
  let visibleCount = 0;

  menuRows.forEach((row) => {
    const category = row.dataset.category;
    const title = row.dataset.title || "";
    const matchesFilter = activeFilter === "todos" || category === activeFilter;
    const matchesSearch = !searchTerm || title.includes(searchTerm);

    const shouldShow = matchesFilter && matchesSearch;
    row.classList.toggle("hidden", !shouldShow);

    if (shouldShow) visibleCount += 1;
  });

  if (noResults) {
    noResults.classList.toggle("show", visibleCount === 0);
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "todos";
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    filterMenu();
  });
});

if (menuSearch) {
  menuSearch.addEventListener("input", filterMenu);
}

/* =========================================================
   FORMULÁRIO DE RESERVA + WhatsApp automático
   ========================================================= */
const reservationForm = document.querySelector("#reservationForm");

function getReservationFormMessage() {
  if (!reservationForm) {
    return "Olá, Casa Brasil Grill. Gostaria de fazer uma reserva.";
  }

  const formData = new FormData(reservationForm);
  const nome = formData.get("nome") || "";
  const telefone = formData.get("telefone") || "";
  const data = formData.get("data") || "";
  const horario = formData.get("horario") || "";
  const pessoas = formData.get("pessoas") || "";
  const ocasiao = formData.get("ocasiao") || "";
  const mensagem = formData.get("mensagem") || "";

  return [
    "Olá, Casa Brasil Grill.",
    "Gostaria de fazer uma reserva.",
    "",
    `Nome: ${nome}`,
    `Telefone: ${telefone}`,
    `Data: ${data}`,
    `Horário: ${horario}`,
    `Pessoas: ${pessoas}`,
    `Ocasião: ${ocasiao}`,
    "",
    `Observações: ${mensagem}`
  ].join("\n");
}

function updateReservationWhatsApp() {
  if (!reservationWhatsApp) return;
  reservationWhatsApp.href = buildWhatsAppUrl(getReservationFormMessage());
}

if (reservationForm) {
  const params = new URLSearchParams(window.location.search);
  const pedido = params.get("pedido");
  if (pedido) {
    const messageField = reservationForm.querySelector("textarea[name='mensagem']");
    if (messageField) {
      messageField.value = `Pedido de interesse: ${pedido}`;
    }
  }

  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameInput = reservationForm.querySelector("input[name='nome']");
    const name = nameInput ? nameInput.value.trim() : "";
    showToast(name ? `${name}, sua reserva foi registrada com sucesso` : "Reserva registrada");
    if (reservationWhatsApp) {
      reservationWhatsApp.href = buildWhatsAppUrl(getReservationFormMessage());
    }
    reservationForm.reset();
    updateReservationWhatsApp();
  });
}

if (reservationForm && reservationWhatsApp) {
  reservationForm.addEventListener("input", updateReservationWhatsApp);
  reservationForm.addEventListener("change", updateReservationWhatsApp);
  updateReservationWhatsApp();
}