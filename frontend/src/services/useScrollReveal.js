import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * useScrollReveal: Stabilized for calm, non-jittery, solid page experience.
 * Directional jumps and sliding animations are disabled to prevent page movement.
 */
export function useScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.classList.add("has-scroll-reveal");
    const elements = document.querySelectorAll(
      ".reveal-on-scroll, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade, [data-reveal]"
    );
    elements.forEach((el) => {
      el.classList.add("is-revealed");
      el.style.transform = "none";
      el.style.opacity = "1";
    });
  }, [pathname]);
}

export default useScrollReveal;
