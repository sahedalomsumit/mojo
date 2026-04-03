const sections = [...document.querySelectorAll("[data-scroll-section]")];
const body = document.body;

for (const section of sections) {
  section.classList.add("reveal");
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    }
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -12% 0px",
  },
);

for (const section of sections) {
  revealObserver.observe(section);
}

const themeObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      body.dataset.theme = visible.target.dataset.theme || "dark";
    }
  },
  {
    threshold: [0.3, 0.5, 0.7],
  },
);

for (const section of sections) {
  themeObserver.observe(section);
}

const stackItems = [...document.querySelectorAll(".stack-list li")];

const progressTargets = [...document.querySelectorAll(".hero-visual, .feature-plate, .product-stage, .orbital, .news-float")];

let rafPending = false;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function updateScrollState() {
  const vh = window.innerHeight || 1;
  const scrollY = window.scrollY || 0;
  const doc = document.documentElement;
  const maxScroll = Math.max(doc.scrollHeight - vh, 1);
  const pageProgress = clamp(scrollY / maxScroll, 0, 1);
  body.style.setProperty("--story-progress", pageProgress.toFixed(4));

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const progress = clamp(1 - Math.abs(rect.top) / vh, 0, 1);
    section.style.setProperty("--section-progress", progress.toFixed(4));
  }

  for (const node of progressTargets) {
    const rect = node.getBoundingClientRect();
    const progress = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
    node.style.setProperty("--scroll-progress", progress.toFixed(4));
  }

  const activeIndex = clamp(Math.floor((scrollY + vh * 0.35) / vh), 0, stackItems.length - 1);
  stackItems.forEach((item, index) => {
    item.classList.toggle("is-active", index === activeIndex);
  });

  rafPending = false;
}

function requestUpdate() {
  if (!rafPending) {
    rafPending = true;
    window.requestAnimationFrame(updateScrollState);
  }
}

window.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("resize", requestUpdate);
requestUpdate();

const animatedTransforms = [
  { selector: ".hero-visual", x: 10, y: -14, scale: 0.04 },
  { selector: ".feature-plate", x: -12, y: 12, scale: 0.03 },
  { selector: ".product-stage", x: 10, y: -10, scale: 0.02 },
  { selector: ".orbital", x: 0, y: -10, scale: 0.04 },
  { selector: ".news-float", x: 14, y: -12, scale: 0.03 },
];

function animateParallax() {
  const vh = window.innerHeight || 1;

  for (const item of animatedTransforms) {
    const el = document.querySelector(item.selector);
    if (!el) continue;

    const rect = el.getBoundingClientRect();
    const progress = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
    const x = (progress - 0.5) * item.x;
    const y = (0.5 - progress) * item.y;
    const scale = 1 + (progress - 0.5) * item.scale;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }

  window.requestAnimationFrame(animateParallax);
}

window.requestAnimationFrame(animateParallax);
