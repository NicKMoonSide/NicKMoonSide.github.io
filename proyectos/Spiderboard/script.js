const STORAGE_KEY = "spiderboard.tasks.v1";
const columns = [
  { id: "backlog", title: "BACKLOG", color: "var(--yellow)" },
  { id: "todo", title: "DO IT", color: "var(--red)" },
  { id: "progress", title: "IN PROGRESS", color: "var(--blue)" },
  { id: "review", title: "REVIEW", color: "var(--mint)" },
  { id: "done", title: "DONE", color: "var(--yellow)" },
];
const starterTasks = [
  [
    "Investigación sobre IA generativa",
    "Terminar y consolidar la investigación aplicada a requisitos.",
    "academic",
    "high",
    "progress",
  ],
  [
    "Mapeo sistemático del estado del arte",
    "Completar el mapeo y ordenar las fuentes clave.",
    "academic",
    "high",
    "todo",
  ],
  [
    "Aprender C a nivel profundo",
    "Pasar de ejercicios base a pequeños proyectos.",
    "learning",
    "medium",
    "backlog",
  ],
  [
    "Dominar Bash y Zsh",
    "Mejorar la terminal y el flujo de trabajo diario.",
    "technical",
    "medium",
    "todo",
  ],
  [
    "Arquitectura Full Stack Rust + JS",
    "Construir una pieza que conecte ambas capas.",
    "technical",
    "high",
    "progress",
  ],
  [
    "Profundizar en Linux",
    "Entender la relación entre UNIX, GNU, MINIX y Linux.",
    "learning",
    "low",
    "backlog",
  ],
  [
    "Artículo final/publicable",
    "Llevar el artículo a una versión lista para publicar.",
    "academic",
    "high",
    "review",
  ],
  [
    "Construcción de portafolio técnico",
    "Mantener proyectos y aprendizajes visibles.",
    "career",
    "medium",
    "done",
  ],
];
let tasks = loadTasks();
let editingId = null;
let activeFilter = "all";
let contextTaskId = null;
const board = document.getElementById("board");
const modalBackdrop = document.getElementById("modal-backdrop");
const form = document.getElementById("task-form");
const columnSelect = document.getElementById("task-column");

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch (error) {
    console.warn("Memoria local no disponible", error);
  }
  return starterTasks.map(
    ([title, description, area, priority, column], index) => ({
      id: `starter-${index}`,
      title,
      description,
      area,
      priority,
      column,
    }),
  );
}
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  document.getElementById("save-status").textContent = "CAMBIOS GUARDADOS";
  setTimeout(() => {
    document.getElementById("save-status").textContent = "MEMORIA LOCAL ACTIVA";
  }, 1500);
}
function escapeHtml(value = "") {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char],
  );
}
function visibleTasks() {
  return activeFilter === "all"
    ? tasks
    : tasks.filter((task) =>
        activeFilter === "high"
          ? task.priority === "high"
          : task.area === activeFilter,
      );
}
function render() {
  const visible = visibleTasks();
  board.innerHTML = columns
    .map((column, index) => {
      const columnTasks = visible.filter((task) => task.column === column.id);
      return `<article class="column" style="--tilt:${index % 2 ? ".25deg" : "-.25deg"}"><header class="column-header" style="border-color:${column.color}"><h2>${column.title}</h2><span class="column-count">${columnTasks.length}</span></header><div class="column-body" data-column="${column.id}">${columnTasks.length ? columnTasks.map(renderTask).join("") : '<p class="empty-state">Nada aquí todavía.</p>'}</div></article>`;
    })
    .join("");
  document.getElementById("task-count").textContent = `${tasks.length} TAREAS`;
  document.getElementById("done-count").textContent =
    `${tasks.filter((task) => task.column === "done").length} COMPLETADAS`;
  bindBoardEvents();
}
function renderTask(task, index) {
  return `<article class="task-card" draggable="true" data-task-id="${task.id}" style="animation-delay:${index * 35}ms"><span class="task-label ${task.priority}">${task.priority === "high" ? "URGENTE" : task.priority === "medium" ? "ENFOQUE" : "TRAZA"}</span><h3>${escapeHtml(task.title)}</h3><p>${escapeHtml(task.description)}</p><span class="task-area">${task.area}</span></article>`;
}
function bindBoardEvents() {
  document.querySelectorAll(".task-card").forEach((card) => {
    card.addEventListener("dragstart", (event) =>
      event.dataTransfer.setData("text/plain", card.dataset.taskId),
    );
    card.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      openContextMenu(event.clientX, event.clientY, card.dataset.taskId);
    });
  });
  document.querySelectorAll(".column-body").forEach((body) => {
    body.addEventListener("dragover", (event) => {
      event.preventDefault();
      body.classList.add("drag-over");
    });
    body.addEventListener("dragleave", () =>
      body.classList.remove("drag-over"),
    );
    body.addEventListener("drop", (event) => {
      event.preventDefault();
      const task = tasks.find(
        (item) => item.id === event.dataTransfer.getData("text/plain"),
      );
      if (task) {
        task.column = body.dataset.column;
        saveTasks();
        render();
        showToast("Tarea movida");
      }
    });
  });
}
function openModal(task = null) {
  editingId = task?.id || null;
  document.getElementById("modal-title").textContent = task
    ? "EDITAR TAREA"
    : "AÑADIR TAREA";
  document.getElementById("task-title").value = task?.title || "";
  document.getElementById("task-description").value = task?.description || "";
  document.getElementById("task-column").value = task?.column || "todo";
  document.getElementById("task-priority").value = task?.priority || "medium";
  document.getElementById("task-area").value = task?.area || "learning";
  modalBackdrop.hidden = false;
  document.getElementById("task-title").focus();
}
function closeModal() {
  modalBackdrop.hidden = true;
  editingId = null;
}
function openContextMenu(x, y, id) {
  contextTaskId = id;
  const menu = document.getElementById("context-menu");
  menu.hidden = false;
  menu.style.left = `${Math.min(x, innerWidth - 205)}px`;
  menu.style.top = `${Math.min(y, innerHeight - 150)}px`;
}
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 1800);
}
columnSelect.innerHTML = columns
  .map((column) => `<option value="${column.id}">${column.title}</option>`)
  .join("");
document
  .getElementById("add-task")
  .addEventListener("click", () => openModal());
document.getElementById("close-modal").addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeModal();
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const wasEditing = Boolean(editingId);
  const data = Object.fromEntries(new FormData(form));
  if (wasEditing)
    Object.assign(
      tasks.find((task) => task.id === editingId),
      data,
    );
  else tasks.push({ ...data, id: `task-${Date.now()}` });
  saveTasks();
  render();
  closeModal();
  showToast(wasEditing ? "Tarea actualizada" : "Nueva tarea creada");
});
document.getElementById("filter-button").addEventListener("click", () => {
  const menu = document.getElementById("filter-menu");
  menu.hidden = !menu.hidden;
  document
    .getElementById("filter-button")
    .setAttribute("aria-expanded", String(!menu.hidden));
});
document.querySelectorAll("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.getElementById("filter-menu").hidden = true;
    render();
  }),
);
document.getElementById("context-menu").addEventListener("click", (event) => {
  const action = event.target.dataset.action;
  const task = tasks.find((item) => item.id === contextTaskId);
  if (!task) return;
  if (action === "edit") openModal(task);
  if (action === "delete" && confirm("¿Eliminar esta tarea?")) {
    tasks = tasks.filter((item) => item.id !== task.id);
    saveTasks();
    render();
    showToast("Tarea eliminada");
  }
  if (action === "move") {
    const destination = prompt(
      `Mover a: ${columns.map((column) => column.id).join(", ")}`,
      task.column,
    );
    if (columns.some((column) => column.id === destination)) {
      task.column = destination;
      saveTasks();
      render();
      showToast("Tarea movida");
    }
  }
  document.getElementById("context-menu").hidden = true;
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".context-menu"))
    document.getElementById("context-menu").hidden = true;
});
render();
