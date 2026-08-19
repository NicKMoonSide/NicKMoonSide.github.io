const fallbackData = {
  user: { name: "Nicolás", phone: "099 999 9999" },
  banners: [
    { kicker: "Oferta especial", title: "Duplica tus megas por 30 días" },
    { kicker: "Tu combo ideal", title: "Más datos para disfrutar sin límites" },
    { kicker: "Beneficio exclusivo", title: "Activa tu plan en pocos pasos" },
  ],
  balance: "$12,50",
  expiry: "30/08/2026",
  combo: "Incluye un combo",
  usage: [
    { name: "DATOS", value: "4.2 GB", used: 68, color: "#0868d7" },
    { name: "VOZ", value: "120 min", used: 42, color: "#ef5d96" },
    { name: "SMS", value: "80 SMS", used: 25, color: "#2fbd8b" },
  ],
};

const track = document.getElementById("banner-track");
const dots = document.getElementById("banner-dots");
const usageGrid = document.getElementById("usage-grid");

function renderBanners(items) {
  track.innerHTML = items
    .map(
      (banner, index) => `
    <article class="banner" aria-label="Promoción ${index + 1}">
      <p class="banner-kicker">${banner.kicker}</p>
      <h2>${banner.title}</h2>
    </article>
  `,
    )
    .join("");
  dots.innerHTML = items
    .map(
      (_, index) =>
        `<span class="banner-dot${index === 0 ? " active" : ""}"></span>`,
    )
    .join("");
}

function renderUsage(items) {
  usageGrid.innerHTML = items
    .map(
      (item) => `
    <article class="usage-item">
      <div class="donut" style="--used: ${item.used}; --donut-color: ${item.color}" aria-label="${item.name}: ${item.value}, ${item.used}% utilizado">
        <span class="donut-value">${item.used}%</span>
      </div>
      <span class="usage-name">${item.name}</span>
      <span class="usage-name">${item.value}</span>
    </article>
  `,
    )
    .join("");
}

function render(data) {
  document.getElementById("user-name").textContent = data.user.name;
  document.getElementById("phone-number").textContent = data.user.phone;
  document.getElementById("balance-value").textContent = data.balance;
  document.getElementById("expiry-date").textContent = data.expiry;
  document.getElementById("combo-name").textContent = data.combo;
  renderBanners(data.banners);
  renderUsage(data.usage);
}

async function loadData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("No se pudo cargar data.json");
    render(await response.json());
  } catch (error) {
    console.warn("Usando datos por defecto:", error);
    render(fallbackData);
  }
}

document.getElementById("buy-button").addEventListener("click", () => {
  alert("La compra de saldo estará disponible próximamente.");
});

loadData();
