// Scroll reveals and pointer tilt (docs/03-design-system.md §8). The CSS in
// global.css does the animating; this only flags what entered the viewport
// and feeds the pointer position to [data-tilt] elements. Runs only when the
// inline script in BaseLayout armed the page (no reduced motion).

declare global {
  interface Window {
    __motion?: boolean;
  }
}

/** Blocks revealed on scroll: must match the selectors in global.css */
const REVEAL = "main :is(section, header) > .container-site > *, main section.container-site > *, [data-stagger]";
/** Largest tilt, in degrees */
const TILT_MAX = 7;

const reveal = () => {
  const targets = document.querySelectorAll<HTMLElement>(REVEAL);
  if (!("IntersectionObserver" in window)) {
    for (const el of targets) el.classList.add("is-in");
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  for (const el of targets) observer.observe(el);
};

const tilt = () => {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  for (const el of document.querySelectorAll<HTMLElement>("[data-tilt]")) {
    let frame = 0;
    el.addEventListener("pointermove", (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = el.getBoundingClientRect();
        // -0.5 … 0.5 from the element's centre
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        el.dataset.tilting = "";
        el.style.setProperty("--ry", `${(x * TILT_MAX * 2).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${(-y * TILT_MAX * 2).toFixed(2)}deg`);
      });
    });
    el.addEventListener("pointerleave", () => {
      cancelAnimationFrame(frame);
      delete el.dataset.tilting;
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
    });
  }
};

export const startMotion = () => {
  if (!document.documentElement.classList.contains("motion")) return;
  window.__motion = true;
  reveal();
  tilt();
};
