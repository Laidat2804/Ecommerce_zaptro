import React, { useState, useEffect, useRef } from "react";

/**
 * useLazyLoad Hook
 * Provides lazy loading functionality for images using Intersection Observer
 */
export const useLazyLoad = (options = {}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const imageRef = useRef();

  const defaultOptions = {
    rootMargin: "50px",
    threshold: 0,
    ...options,
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && imageRef.current) {
          const src = imageRef.current.dataset.src;
          if (src) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              setImageSrc(src);
              setIsLoading(false);
            };
            img.onerror = () => {
              setError("Failed to load image");
              setIsLoading(false);
            };
            observer.unobserve(entry.target);
          }
        }
      });
    }, defaultOptions);

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [defaultOptions]);

  return { imageRef, imageSrc, isLoading, error };
};
