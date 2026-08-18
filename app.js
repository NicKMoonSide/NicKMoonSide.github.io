const fallbackData = {
  profile: {
    name: "Jose Nicolas Muñoz Cortes",
    role: "Estudiante de Ingeniería de Software",
    description:
      "Soy estudiante de Ingeniería de Software en la Escuela Superior Politécnica de Chimborazo, apasionado por la tecnología, el diseño y el desarrollo de experiencias digitales. Me interesa aprender a desplegar y lanzar frontend de aplicaciones web, además de fortalecer mis habilidades en UX/UI y prototipado.",
  },
  projects: [
    {
      title: "Portafolio Personal",
      description:
        "Diseño de una web personal para presentar mi perfil, habilidades y proyectos profesionales.",
      tags: ["HTML", "CSS", "JavaScript"],
      link: "#",
    },
    {
      title: "Prototipado de Interfaces",
      description:
        "Creación de mockups y prototipos centrados en la experiencia del usuario y la navegación intuitiva.",
      tags: ["UX", "Figma", "Prototipado"],
      link: "#",
    },
    {
      title: "Landing Page Web",
      description:
        "Desarrollo de una página de presentación con enfoque visual, clara y moderna.",
      tags: ["Web", "Diseño", "Responsive"],
      link: "#",
    },
  ],
  certificates: [
    {
      name: "Curso de Prototipado",
      issuer: "Formación académica / aprendizaje personal",
      year: "2026",
    },
    {
      name: "Diseño UX/UI",
      issuer: "Cursando y fortaleciendo habilidades",
      year: "En progreso",
    },
  ],
  socials: [
    { name: "GitHub", icon: "G", url: "https://github.com" },
    { name: "LinkedIn", icon: "in", url: "https://linkedin.com" },
    { name: "Instagram", icon: "◎", url: "https://instagram.com" },
  ],
};

const profileName = document.getElementById("profile-name");
const profileRole = document.getElementById("profile-role");
const profileDescription = document.getElementById("profile-description");
const projectsGrid = document.getElementById("projects-grid");
const certificatesGrid = document.getElementById("certificates-grid");
const socialsGrid = document.getElementById("socials-grid");
const yearEl = document.getElementById("year");

function renderProfile(profile) {
  if (!profile) return;
  profileName.textContent = profile.name || fallbackData.profile.name;
  profileRole.textContent = profile.role || fallbackData.profile.role;
  profileDescription.textContent =
    profile.description || fallbackData.profile.description;
}

function renderProjects(projects) {
  const items = projects && projects.length ? projects : fallbackData.projects;

  projectsGrid.innerHTML = items
    .map(
      (project) => `
        <article class="project-card">
          <h4>${project.title}</h4>
          <p>${project.description}</p>
          <div class="project-tags">
            ${(project.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <a class="project-link" href="${project.link || "#"}" target="_blank" rel="noreferrer">
            Ver proyecto →
          </a>
        </article>
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
        <article class="certificate-card">
          <p class="section-label">Certificado</p>
          <h4>${certificate.name}</h4>
          <p>${certificate.issuer}</p>
          <div class="cert-meta">${certificate.year}</div>
        </article>
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
          <div class="social-icon">${social.icon}</div>
          <span>${social.name}</span>
        </a>
      `,
    )
    .join("");
}

async function loadData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("No se pudo cargar data.json");
    const data = await response.json();

    renderProfile(data.profile);
    renderProjects(data.projects);
    renderCertificates(data.certificates);
    renderSocials(data.socials);
  } catch (error) {
    console.warn("Usando datos por defecto:", error);
    renderProfile(fallbackData.profile);
    renderProjects(fallbackData.projects);
    renderCertificates(fallbackData.certificates);
    renderSocials(fallbackData.socials);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  yearEl.textContent = new Date().getFullYear();
  loadData();
});
