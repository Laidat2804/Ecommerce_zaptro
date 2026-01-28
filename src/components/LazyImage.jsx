import React, { useState, useEffect } from "react";

/**
 * LazyImage Component
 * Loads images only when they become visible in the viewport
 * Uses Intersection Observer API for efficient performance
 */
const LazyImage = ({
  src,
  alt = "",
  className = "",
  placeholder = "bg-gray-100",
  onLoad,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageRef, setImageRef] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let observer;
    let img;

    if (imageRef && imageSrc === null) {
      // Create intersection observer to detect when image is visible
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Preload image
              img = new Image();
              img.src = src;
              img.onload = () => {
                setImageSrc(src);
                setIsLoading(false);
                if (onLoad) onLoad();
              };
              img.onerror = () => {
                setImageSrc(src);
                setIsLoading(false);
              };
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "50px", // Start loading 50px before image enters viewport
        },
      );

      observer.observe(imageRef);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [imageRef, imageSrc, src, onLoad]);

  return (
    <img
      ref={setImageRef}
      src={
        imageSrc ||
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3C/svg%3E"
      }
      alt={alt}
      className={`${className} ${isLoading ? placeholder : ""} transition-opacity duration-300`}
      loading="lazy"
    />
  );
};

export default LazyImage;
