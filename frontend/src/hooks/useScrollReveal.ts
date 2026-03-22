import { useEffect } from "react";

/**
 * Adds the "visible" class to any element with class "reveal-on-scroll"
 * once it enters the viewport (threshold 15%).
 */
export const useScrollReveal = () => {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal-on-scroll");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};
