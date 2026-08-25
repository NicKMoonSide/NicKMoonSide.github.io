const fallbackData = {
  profile: {
    name: "Jose Nicolas Muñoz Cortez",
    role: "Estudiante de Ingeniería de Software",
    description:
      "Soy estudiante de Ingeniería de Software en la Escuela Superior Politécnica de Chimborazo, apasionado por la tecnología, el diseño y el desarrollo de experiencias digitales.",
  },
  projects: [
    {
      title: "Organizador personal",
      description:
        "Tablero híbrido Kanban + Scrum para convertir pendientes, aprendizaje y proyectos en acción.",
      tags: ["Kanban", "Scrum", "Responsive"],
      link: "proyectos/Spiderboard/index.html",
      image: "IMG/spiderboard.svg",
    },
    {
      title: "Clon Tuenti ;)",
      description:
        "Prototipo móvil de una aplicación de telefonía con saldo, promociones y consumo de datos.",
      tags: ["HTML", "CSS", "JavaScript"],
      link: "proyectos/Clon%20T/index.html",
      image: "IMG/clon-t.svg",
    },
    {
      title: "Clon de YouTube",
      description:
        "Interfaz responsive inspirada en YouTube con videos, Shorts, filtros y búsqueda.",
      tags: ["HTML", "CSS", "Responsive"],
      link: "proyectos/Clon-youtube/index.html",
      image: "IMG/clon-youtube.svg",
    },
    {
      title: "Mi galería 3D",
      description:
        "Experiencia visual interactiva construida con Three.js y escenas tridimensionales.",
      tags: ["Three.js", "WebGL", "Interacción"],
      link: "proyectos/mi-galeria-3d/index.html",
      image: "IMG/galeria-3d.svg",
    },
  ],
  certificates: [
    {
      name: "Python Essencials 2",
      issuer: "Cisco Networking Academy",
      date: "11-06-2026",
      link: "assets/certificados/PYTHON_2.pdf",
    },
    {
      name: "Linux Bootcamp Course",
      issuer:
        "IEEE Computacional Intelligence Society y Electronic Packaging Society Yachay Tech University student branch",
      date: "02-07-2026",
      link: "assets/certificados/CERTIFICADO%20LINUX.pdf",
    },
    {
      name: "Seguridad de Redes de Comunicación y TI",
      issuer: "IEEE Computer Society ESPOCH student branch chapter",
      date: "10-04-2026",
      link: "assets/certificados/CERTIFICADO%20CIBERSEGURIDAD.pdf",
    },
    {
      name: "GENIUS CODE 2026",
      issuer: "club Polibyte",
      date: "03-31-2026",
      link: "assets/certificados/GENIUS%20CODE%202026.pdf",
    },
  ],
  socials: [
    { name: "GitHub", icon: "G", url: "https://github.com/NicKMoonSide" },
    {
      name: "LinkedIn",
      icon: "in",
      url: "https://www.linkedin.com/in/nicolas-mu%C3%B1oz-319714399/",
    },
    {
      name: "Instagram",
      icon: "◎",
      url: "https://www.instagram.com/nick._.munoz",
    },
  ],
};

const profileName = document.getElementById("profile-name");
const profileRole = document.getElementById("profile-role");
const profileDescription = document.getElementById("profile-description");
const projectsGrid = document.getElementById("projects-grid");
const certificatesGrid = document.getElementById("certificates-grid");
const socialsGrid = document.getElementById("socials-grid");
const yearEl = document.getElementById("year");
const themeToggleButton = document.querySelector(".theme-toggle");
const THEME_STORAGE_KEY = "portfolio-theme-preference";

function applyTheme(theme, animate = false) {
  const normalizedTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = normalizedTheme;
  document.body.dataset.theme = normalizedTheme;
  if (themeToggleButton) {
    const light = normalizedTheme === "light";
    themeToggleButton.setAttribute("aria-pressed", String(light));
    themeToggleButton.setAttribute(
      "aria-label",
      light ? "Cambiar al modo oscuro" : "Cambiar al modo claro",
    );
    themeToggleButton.innerHTML = `<span class="theme-icon">${light ? "☀️" : "🌙"}</span><span class="theme-label">${light ? "Claro" : "Oscuro"}</span>`;
  }
  if (animate) {
    document.body.classList.remove("theme-transitioning");
    void document.body.offsetWidth;
    document.body.classList.add("theme-transitioning");
    window.setTimeout(
      () => document.body.classList.remove("theme-transitioning"),
      900,
    );
  }
}

function initializeTheme() {
  let storedTheme = "dark";
  try {
    storedTheme = localStorage.getItem(THEME_STORAGE_KEY) || storedTheme;
  } catch (error) {
    /* ignore unavailable storage */
  }
  applyTheme(storedTheme);
}

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next, true);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch (error) {
      /* ignore unavailable storage */
    }
  });
}

function renderProfile(profile) {
  profileName.textContent = profile.name;
  profileRole.textContent = profile.role;
  profileDescription.textContent = profile.description;
}

function renderProjects(projects) {
  const items = projects && projects.length ? projects : fallbackData.projects;
  projectsGrid.innerHTML = items
    .map(
      (project, index) => `
    <a class="project-card project-card-featured" href="${project.link || "#"}" target="_blank" rel="noreferrer">
      <div class="project-card-image-wrap">
        <img src="${project.image || "IMG/galeria-3d.svg"}" alt="Primera pantalla de ${project.title}" loading="lazy">
        <span class="project-card-number">0${index + 1}</span>
      </div>
      <div class="project-card-body">
        <p class="section-label">Proyecto</p>
        <h4>${project.title}</h4>
        <p>${project.description}</p>
        <div class="project-tags">${(project.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        <span class="project-link">Abrir proyecto &rarr;</span>
      </div>
    </a>
  `,
    )
    .join("");
}

function renderCertificates(certificates) {
  const items =
    certificates && certificates.length
      ? certificates
      : fallbackData.certificates;
  certificatesGrid.innerHTML = items
    .map(
      (certificate) => `
    <a class="certificate-card" href="${certificate.link || "#"}" target="_blank" rel="noreferrer">
      <p class="section-label">Certificado</p>
      <h4>${certificate.name}</h4>
      <p>${certificate.issuer}</p>
      <div class="cert-meta">${certificate.date}</div>
      <span class="certificate-link">Abrir certificado &rarr;</span>
    </a>
  `,
    )
    .join("");
}

function renderSocials(socials) {
  const items = socials && socials.length ? socials : fallbackData.socials;
  socialsGrid.innerHTML = items
    .map(
      (social) => `
    <a class="social-card" href="${social.url}" target="_blank" rel="noreferrer" aria-label="${social.name}">
      <div class="social-icon">${social.icon}</div><span>${social.name}</span>
    </a>
  `,
    )
    .join("");
}

async function loadData() {
  try {
    const response = await fetch(`data.json?rev=${Date.now()}`);
    if (!response.ok) throw new Error("No se pudo cargar data.json");
    const data = await response.json();
    renderProfile(data.profile || fallbackData.profile);
    renderProjects(data.projects);
    renderCertificates(data.certificates);
    renderSocials(data.socials);
  } catch (error) {
    renderProfile(fallbackData.profile);
    renderProjects(fallbackData.projects);
    renderCertificates(fallbackData.certificates);
    renderSocials(fallbackData.socials);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  yearEl.textContent = new Date().getFullYear();
  initializeTheme();
  loadData();
});
