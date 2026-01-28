import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

/**
 * useAOS Hook
 * Initializes AOS (Animate On Scroll) library for scroll animations
 * @param {Object} options - AOS configuration options
 */
export const useAOS = (options = {}) => {
  useEffect(() => {
    const defaultOptions = {
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
      offset: 100,
      ...options,
    };

    AOS.init(defaultOptions);

    // Refresh AOS on component mount
    return () => {
      AOS.refresh();
    };
  }, []);
};
