import "./style.css";

const app = document.querySelector("#app");
const artworks = [
  ["Pulse", "Digital heartbeat", "/images/pulse.svg"],
  ["Orbit", "Soft geometry", "/images/orbit.svg"],
  ["Frequency", "Moving signal", "/images/frequency.svg"],
  ["Terrain", "Quiet topography", "/images/terrain.svg"],
  ["Afterglow", "Light in motion", "/images/afterglow.svg"],
  ["Monolith", "Solid state", "/images/monolith.svg"],
];

app.innerHTML = `
  <main class="gallery-shell">
    <header class="gallery-header">
      <div class="brand"><span class="brand-dot"></span> / ARCHIVE 06</div>
      <div class="header-note">SPATIAL IMAGE STUDY <span>2026</span></div>
    </header>
    <section class="gallery-stage" aria-label="Galería 3D">
      <div id="scene" class="scene"><div class="card-wheel"></div></div>
      <div class="stage-copy">
        <p class="eyebrow">A SMALL COLLECTION</p>
        <h1>Images in<br><em>orbit.</em></h1>
        <p class="description">Six visual fragments arranged in a slow, tactile rotation.</p>
      </div>
      <div class="stage-meta"><span>DRAG TO EXPLORE</span><span class="meta-line"></span><span id="counter">01 / 06</span></div>
      <button class="nav-button previous" type="button" aria-label="Imagen anterior">←</button>
      <button class="nav-button next" type="button" aria-label="Imagen siguiente">→</button>
    </section>
    <footer class="gallery-footer"><span>THREE-DIMENSIONAL GALLERY</span><span>SCROLL / DRAG / ARROW KEYS</span></footer>
  </main>
`;

const sceneHost = document.querySelector("#scene");
const wheel = document.querySelector(".card-wheel");
const step = 360 / artworks.length;
const cards = artworks.map(([title, subtitle, image], index) => {
  const card = document.createElement("article");
  card.className = `art-card${index === 0 ? " active" : ""}`;
  card.style.setProperty("--angle", `${index * step}deg`);
  card.innerHTML = `<img src="${image}" alt="${title}: ${subtitle}"><div class="card-label"><strong>${title}</strong><span>${subtitle}</span></div>`;
  wheel.appendChild(card);
  return card;
});
let targetRotation = 0;
let currentRotation = 0;
let activeIndex = 0;
let pointerStart = null;
const counter = document.querySelector("#counter");

function goTo(direction) {
  activeIndex = (activeIndex + direction + artworks.length) % artworks.length;
  targetRotation -= direction * step;
  counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / 06`;
}

document.querySelector(".previous").addEventListener("click", () => goTo(-1));
document.querySelector(".next").addEventListener("click", () => goTo(1));
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") goTo(-1);
  if (event.key === "ArrowRight") goTo(1);
});
sceneHost.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    goTo(event.deltaY > 0 ? 1 : -1);
  },
  { passive: false },
);
sceneHost.addEventListener("pointerdown", (event) => {
  pointerStart = event.clientX;
  sceneHost.setPointerCapture(event.pointerId);
});
sceneHost.addEventListener("pointerup", (event) => {
  if (pointerStart !== null && Math.abs(event.clientX - pointerStart) > 35)
    goTo(event.clientX < pointerStart ? 1 : -1);
  pointerStart = null;
});

function animate() {
  requestAnimationFrame(animate);
  currentRotation += (targetRotation - currentRotation) * 0.075;
  wheel.style.transform = `translate(-50%, -50%) rotateY(${currentRotation}deg)`;
  cards.forEach((card, index) => {
    const normalized = Math.abs(
      (((index * step + currentRotation) % 360) + 360) % 360,
    );
    const distance = Math.min(normalized, 360 - normalized);
    card.classList.toggle("active", distance < step / 2);
  });
}
animate();
