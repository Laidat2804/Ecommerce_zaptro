import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

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

    return () => {
      AOS.refresh();
    };
  }, []);
};
