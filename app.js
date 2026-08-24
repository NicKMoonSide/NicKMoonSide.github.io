const fallbackData = {
  profile: {
    name: "Jose Nicolas Muñoz Cortez",
    role: "Estudiante de Ingeniería de Software",
    description:
      "Soy estudiante de Ingeniería de Software en la Escuela Superior Politécnica de Chimborazo, apasionado por la tecnología, el diseño y el desarrollo de experiencias digitales. Me interesa aprender a desplegar y lanzar frontend de aplicaciones web, además de fortalecer mis habilidades en UX/UI y prototipado.",
  },
  projects: [
    {
      title: "Organizador personal",
      description:
        "Tablero híbrido Kanban + Scrum para convertir pendientes, aprendizaje y proyectos en acción.",
      tags: ["Kanban", "Scrum", "LocalStorage", "Responsive"],
      link: "proyectos/Spiderboard/index.html",
      image: "mi-galeria-3d/public/images/monolith.svg",
    },
    {
      title: "Clon Tuenti ;)",
      description:
        "Prototipo móvil de una aplicación de telefonía con saldo, promociones y consumo de datos, voz y SMS.",
      tags: ["HTML", "CSS", "JavaScript", "Mobile UI"],
      link: "proyectos/Clon%20T/index.html",
      image: "mi-galeria-3d/public/images/orbit.svg",
    },
    {
      title: "Clon de YouTube",
      description:
        "Interfaz responsive inspirada en YouTube con videos, Shorts, filtros, búsqueda y previews multimedia.",
      tags: ["HTML", "CSS", "JavaScript", "Responsive", "Multimedia"],
      link: "proyectos/Clon-youtube/index.html",
      image: "mi-galeria-3d/public/images/frequency.svg",
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
const copyButtons = document.querySelectorAll(".copy-button");

document.addEventListener("click", (event) => {
  const interactiveElement = event.target.closest("a, button");
  if (!interactiveElement) return;

  const ripple = document.createElement("span");
  ripple.className = "space-ripple";
  ripple.style.left = `${event.clientX}px`;
  ripple.style.top = `${event.clientY}px`;
  document.body.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
});

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const originalLabel = button.textContent.trim();

    try {
      await copyText(button.dataset.copyValue);
      button.textContent = "Copiado";
      button.classList.add("copy-button-success");
    } catch (error) {
      button.textContent = "No se pudo copiar";
    }

    window.setTimeout(() => {
      button.textContent = originalLabel;
      button.classList.remove("copy-button-success");
    }, 1800);
  });
});

function renderProfile(profile) {
  if (!profile) return;
  profileName.textContent = profile.name || fallbackData.profile.name;
  profileRole.textContent = profile.role || fallbackData.profile.role;
  profileDescription.textContent =
    profile.description || fallbackData.profile.description;
}

function renderProjects(projects) {
  const items = projects && projects.length ? projects : fallbackData.projects;
  const step = 360 / items.length;

  projectsGrid.innerHTML = `
    <div class="project-scene">
      <div class="project-wheel">
        ${items
          .map(
            (project, index) => `
          <a class="project-orbit-card${index === 0 ? " active" : ""}"
            href="${project.link || "#"}" target="_blank" rel="noreferrer"
            style="--angle: ${index * step}deg">
            <img src="${project.image || "mi-galeria-3d/public/images/pulse.svg"}" alt="Vista previa de ${project.title}">
            <span class="project-card-info">
              <strong>${project.title}</strong>
              <span>${project.description}</span>
              <small>${(project.tags || []).join(" / ")}</small>
            </span>
          </a>
        `,
          )
          .join("")}
      </div>
      <button class="gallery-exit" type="button" aria-label="Salir de la galería" title="Salir de la galería">→</button>
    </div>
  `;

  const scene = projectsGrid.querySelector(".project-scene");
  const wheel = projectsGrid.querySelector(".project-wheel");
  const cards = [...projectsGrid.querySelectorAll(".project-orbit-card")];
  let targetRotation = 0;
  let currentRotation = 0;
  let activeIndex = 0;
  let pointerStart = null;

  const goTo = (direction) => {
    activeIndex = (activeIndex + direction + items.length) % items.length;
    targetRotation -= direction * step;
  };

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      goTo(event.key === "ArrowRight" ? 1 : -1);
    }
  });

  projectsGrid.querySelector(".gallery-exit").addEventListener("click", () => {
    document.body.classList.add("horizontal-journey");
    document
      .getElementById("certificados")
      .scrollIntoView({ behavior: "smooth" });
  });
  scene.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      goTo(event.deltaY > 0 ? 1 : -1);
    },
    { passive: false },
  );
  scene.addEventListener("pointerdown", (event) => {
    pointerStart = event.clientX;
    scene.setPointerCapture(event.pointerId);
  });
  scene.addEventListener("pointerup", (event) => {
    if (pointerStart !== null && Math.abs(event.clientX - pointerStart) > 35) {
      goTo(event.clientX < pointerStart ? 1 : -1);
    }
    pointerStart = null;
  });

  const animate = () => {
    currentRotation += (targetRotation - currentRotation) * 0.075;
    wheel.style.transform = `translate(-50%, -50%) rotateY(${currentRotation}deg)`;
    cards.forEach((card, index) => {
      const normalized = Math.abs(
        (((index * step + currentRotation) % 360) + 360) % 360,
      );
      const distance = Math.min(normalized, 360 - normalized);
      card.classList.toggle("active", distance < step / 2);
    });
    window.requestAnimationFrame(animate);
  };
  animate();
}

function setupJourneyLocks() {
  const projectsSection = document.getElementById("proyectos");
  const certificatesSection = document.getElementById("certificados");
  const certificatesGridElement =
    certificatesSection.querySelector(".certificates-grid");

  window.addEventListener(
    "wheel",
    (event) => {
      const projectsBox = projectsSection.getBoundingClientRect();
      const projectsArePinned =
        projectsBox.top <= 1 && projectsBox.bottom >= window.innerHeight - 1;
      const horizontalMode =
        document.body.classList.contains("horizontal-journey");

      if (!horizontalMode && projectsArePinned && event.deltaY > 0) {
        event.preventDefault();
        window.scrollTo({ top: window.scrollY, behavior: "auto" });
        return;
      }

      if (!horizontalMode) return;

      const certificatesBox = certificatesSection.getBoundingClientRect();
      const certificatesArePinned =
        certificatesBox.top <= 1 &&
        certificatesBox.bottom >= window.innerHeight - 1;
      if (!certificatesArePinned) return;

      const atStart = certificatesGridElement.scrollLeft <= 0;
      const atEnd =
        certificatesGridElement.scrollLeft +
          certificatesGridElement.clientWidth >=
        certificatesGridElement.scrollWidth - 8;
      event.preventDefault();
      if (event.deltaY < 0 && atStart) return;
      if (event.deltaY > 0 && atEnd) {
        document.getElementById("redes").scrollIntoView({ behavior: "smooth" });
        return;
      }
      certificatesGridElement.scrollBy({
        left: event.deltaY,
        behavior: "auto",
      });
    },
    { passive: false },
  );
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
  setupJourneyLocks();
});
