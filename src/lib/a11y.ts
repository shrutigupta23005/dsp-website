/**
 * Announce a message to screen readers via an aria-live region.
 * Use for: wishlist toggle, compare add/remove, filter changes.
 */
export function announceToScreenReader(message: string) {
  if (typeof document === "undefined") return;

  const el = document.createElement("div");
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.setAttribute("aria-atomic", "true");
  el.style.position = "absolute";
  el.style.width = "1px";
  el.style.height = "1px";
  el.style.padding = "0";
  el.style.margin = "-1px";
  el.style.overflow = "hidden";
  el.style.clip = "rect(0, 0, 0, 0)";
  el.style.whiteSpace = "nowrap";
  el.style.border = "0";

  document.body.appendChild(el);

  // Small delay so screen readers pick up the change
  requestAnimationFrame(() => {
    el.textContent = message;
  });

  setTimeout(() => {
    document.body.removeChild(el);
  }, 1000);
}

/**
 * Trap focus within an element (for modals, drawers, lightboxes).
 * Returns a cleanup function to remove the event listener.
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    const focusableElements = element.querySelectorAll(focusableSelectors);
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (!firstFocusable) return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  element.addEventListener("keydown", handleKeyDown);
  return () => element.removeEventListener("keydown", handleKeyDown);
}

/**
 * Check if user prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
