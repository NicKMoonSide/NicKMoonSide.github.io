const whatsappApp = document.getElementById("whatsappApp");
const statusList = document.getElementById("statusList");
const chatList = document.getElementById("chatList");
const moduleToggle = document.getElementById("moduleToggle");

const fallbackData = {
  statuses: [
    { name: "Tú", avatar: "T", highlight: true },
    { name: "Maya", avatar: "M", highlight: false },
    { name: "Luca", avatar: "L", highlight: false },
    { name: "Dani", avatar: "D", highlight: false },
    { name: "Vale", avatar: "V", highlight: false },
  ],
  chats: [
    {
      name: "Ana García",
      time: "09:12",
      preview: "¡Listo! Ya te mando la propuesta final para revisarla.",
      unread: 2,
      status: "sent",
      avatar: "AG",
      favorite: true,
      group: false,
    },
    {
      name: "Mateo Ruiz",
      time: "08:40",
      preview: "Nos vemos hoy a las 18:00 en la reunión del proyecto.",
      unread: 0,
      status: "delivered",
      avatar: "MR",
      favorite: false,
      group: false,
    },
    {
      name: "Equipo diseño",
      time: "Ayer",
      preview: "Sofía: revisé el mockup y quedó más limpio que antes.",
      unread: 5,
      status: "read",
      avatar: "ED",
      favorite: true,
      group: true,
    },
    {
      name: "Laura M.",
      time: "Ayer",
      preview: "Gracias por compartir el concepto. Lo entendí perfectamente.",
      unread: 0,
      status: "read",
      avatar: "LM",
      favorite: true,
      group: false,
    },
  ],
};

function getStatusGlyph(status) {
  const map = {
    sent: "✓",
    delivered: "✓✓",
    read: "✓✓",
    default: "•",
  };
  return map[status] ?? map.default;
}

function renderStatuses(statuses) {
  statusList.innerHTML = statuses
    .map(
      (status, index) => `
      <div class="status-item ${status.highlight ? "is-highlight" : ""}" style="--row-index:${index};">
        <div class="status-avatar">${status.avatar}</div>
        <span>${status.name}</span>
      </div>
    `,
    )
    .join("");
}

function renderChats(chats) {
  chatList.innerHTML = chats
    .map((chat, index) => {
      const unread = Number(chat.unread || 0);
      const statusIcon = getStatusGlyph(chat.status);

      return `
        <article class="chat-row" style="--row-index:${index};">
          <div class="chat-avatar-wrap">
            <div class="chat-avatar">${chat.avatar}</div>
            <div class="chat-mini-label">${chat.name}</div>
          </div>

          <div class="chat-content">
            <div class="chat-head">
              <span class="chat-name">${chat.name}</span>
              <span class="chat-meta">${chat.time}</span>
            </div>

            <div class="chat-preview-row">
              <span class="chat-preview">${chat.preview}</span>
              <span class="chat-state">${statusIcon}</span>
              <span class="chat-badge ${unread > 0 ? "is-visible" : ""}">${unread > 0 ? unread : ""}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadData() {
  try {
    const response = await fetch("./data.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar data.json");
    const data = await response.json();
    renderStatuses(data.statuses || fallbackData.statuses);
    renderChats(data.chats || fallbackData.chats);
  } catch (error) {
    renderStatuses(fallbackData.statuses);
    renderChats(fallbackData.chats);
  }
}

moduleToggle.addEventListener("click", () => {
  whatsappApp.classList.toggle("modular-view");
  const isActive = whatsappApp.classList.contains("modular-view");
  moduleToggle.setAttribute("aria-pressed", String(isActive));
});

loadData();
