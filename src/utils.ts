import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getSectionScrollAnchor(section: HTMLElement) {
  const customAnchor = section.querySelector("[data-scroll-anchor]");

  if (customAnchor instanceof HTMLElement) {
    return customAnchor;
  }

  const heading = section.querySelector("h1, h2");

  if (heading instanceof HTMLElement) {
    return heading.parentElement instanceof HTMLElement ? heading.parentElement : heading;
  }

  const sectionRoot = section.firstElementChild;

  if (sectionRoot instanceof HTMLElement && sectionRoot.firstElementChild instanceof HTMLElement) {
    return sectionRoot.firstElementChild;
  }

  if (sectionRoot instanceof HTMLElement) {
    return sectionRoot;
  }

  return section;
}

function getSectionScrollOffset() {
  if (typeof window === "undefined") return 0;

  const nav = document.querySelector("[data-site-nav]");
  const navHeight =
    nav instanceof HTMLElement ? nav.getBoundingClientRect().height : window.innerWidth < 768 ? 68 : 76;
  const breathingRoom = window.innerWidth < 768 ? 20 : 28;

  return navHeight + breathingRoom;
}

export function scrollSectionIntoView(sectionId: string, behavior: ScrollBehavior = "smooth") {
  if (typeof window === "undefined") return;

  const section = document.getElementById(sectionId);
  if (!(section instanceof HTMLElement)) return;

  const anchor = getSectionScrollAnchor(section);
  const topOffset = getSectionScrollOffset();
  const targetTop = Math.max(0, window.scrollY + anchor.getBoundingClientRect().top - topOffset);

  window.scrollTo({ top: targetTop, behavior });
}
