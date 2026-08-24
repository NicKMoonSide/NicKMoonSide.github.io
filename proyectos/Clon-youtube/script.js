const mediaRoot = "canal/";
const dataPath = "data.json";
const channelNav = document.querySelector("#channel-nav");
const shortsGrid = document.querySelector("#shorts-grid");
const videoGrid = document.querySelector("#video-grid");
const emptySearch = document.querySelector("#empty-search");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const sidebar = document.querySelector("#sidebar");
const sidebarOverlay = document.querySelector("#sidebar-overlay");

const assetPath = (folder, file) =>
  `${mediaRoot}${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;

function findChannel(data, name) {
  return (
    data.channels.find((channel) => channel.name === name) || data.channels[0]
  );
}

function renderChannelNav(data) {
  channelNav.innerHTML = data.channels
    .slice(0, 6)
    .map(
      (channel) => `
    <a class="nav-item channel-nav-item" href="#videos-title">
      <img src="${assetPath(channel.folder, "logo.png")}" alt="">
      <span>${channel.name}</span>
    </a>`,
    )
    .join("");
}

function renderShorts(data) {
  shortsGrid.innerHTML = data.shorts
    .map(
      (short) => `
    <article class="short-card" data-search="${short.title} ${short.channel}">
      <div class="media-frame preview-media" tabindex="0">
        <img src="${assetPath(short.folder, "portada-1.png")}" alt="${short.title}" loading="lazy">
        <video muted loop playsinline preload="metadata" src="${assetPath(short.folder, short.video)}"></video>
        <span class="media-overlay">▶</span>
      </div>
      <h3>${short.title}</h3>
      <p>${short.channel}</p>
    </article>`,
    )
    .join("");
}

function renderVideos(data, category = "Todos", query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const videos = data.videos.filter((video) => {
    const categoryMatch = category === "Todos" || video.category === category;
    const queryMatch =
      !normalizedQuery ||
      `${video.title} ${video.channel} ${video.category}`
        .toLowerCase()
        .includes(normalizedQuery);
    return categoryMatch && queryMatch;
  });
  videoGrid.innerHTML = videos
    .map((video, index) => {
      const channel = findChannel(data, video.channel);
      const videoTag = video.video
        ? `<video muted loop playsinline preload="metadata" src="${assetPath(video.folder, video.video)}"></video>`
        : "";
      return `
      <article class="video-card" style="animation-delay:${index * 45}ms" data-search="${video.title} ${video.channel}">
        <div class="media-frame preview-media" tabindex="0">
          <img src="${assetPath(video.folder, video.thumbnail)}" alt="${video.title}" loading="lazy">
          ${videoTag}<span class="duration">${video.duration}</span>
        </div>
        <div class="video-info">
          <img class="channel-avatar" src="${assetPath(channel.folder, "logo.png")}" alt="">
          <div><h3>${video.title}</h3><p>${video.channel}</p><p>${video.views} · ${video.age}</p></div>
        </div>
      </article>`;
    })
    .join("");
  emptySearch.hidden = videos.length > 0;
  attachPreviewEvents();
}

function attachPreviewEvents() {
  document.querySelectorAll(".preview-media").forEach((media) => {
    const video = media.querySelector("video");
    if (!video) return;
    const start = () => {
      media.classList.add("is-playing");
      video.play().catch(() => {});
    };
    const stop = () => {
      video.pause();
      video.currentTime = 0;
      media.classList.remove("is-playing");
    };
    media.addEventListener("pointerenter", start);
    media.addEventListener("pointerleave", stop);
    media.addEventListener("focusin", start);
    media.addEventListener("focusout", stop);
  });
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("visible");
}

document.querySelector("#menu-toggle").addEventListener("click", () => {
  sidebar.classList.toggle("open");
  sidebarOverlay.classList.toggle("visible");
});
sidebarOverlay.addEventListener("click", closeSidebar);
sidebar.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeSidebar();
});

fetch(dataPath)
  .then((response) => response.json())
  .then((data) => {
    renderChannelNav(data);
    renderShorts(data);
    renderVideos(data);
    document.querySelectorAll(".category").forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll(".category")
          .forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        renderVideos(data, button.dataset.category, searchInput.value);
      });
    });
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const activeCategory =
        document.querySelector(".category.active").dataset.category;
      renderVideos(data, activeCategory, searchInput.value);
    });
    searchInput.addEventListener("input", () => {
      const activeCategory =
        document.querySelector(".category.active").dataset.category;
      renderVideos(data, activeCategory, searchInput.value);
    });
  })
  .catch(() => {
    emptySearch.hidden = false;
    emptySearch.textContent = "No se pudieron cargar los videos.";
  });
