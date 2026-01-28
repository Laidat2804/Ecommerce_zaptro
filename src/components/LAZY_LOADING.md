# Image Lazy Loading

## 📦 Components & Hooks

### LazyImage Component (`LazyImage.jsx`)

Wrapper component cho images với built-in lazy loading.

**Features:**

- Intersection Observer API
- Automatic image preloading khi visible
- Placeholder animation
- Error handling

**Usage:**

```jsx
import LazyImage from "@/components/LazyImage";

<LazyImage
  src={imageUrl}
  alt="Product image"
  className="w-full h-auto"
  placeholder="bg-gray-200 animate-pulse"
  onLoad={() => console.log("Image loaded")}
/>;
```

**Props:**

- `src` (string, required) - Image URL
- `alt` (string) - Alt text
- `className` (string) - CSS classes
- `placeholder` (string) - Placeholder classes while loading
- `onLoad` (function) - Callback when image loads

---

### useLazyLoad Hook (`useLazyLoad.js`)

Custom hook cho advanced lazy loading control.

**Usage:**

```jsx
import { useLazyLoad } from "@/hooks/useLazyLoad";

function MyComponent() {
  const { imageRef, imageSrc, isLoading, error } = useLazyLoad({
    rootMargin: "50px",
  });

  return (
    <>
      <img
        ref={imageRef}
        data-src={imageUrl}
        src={imageSrc || placeholder}
        alt="Product"
      />
      {isLoading && <Skeleton />}
      {error && <ErrorMessage />}
    </>
  );
}
```

**Returns:**

- `imageRef` - Ref to attach to img element
- `imageSrc` - Loaded image source
- `isLoading` - Loading state
- `error` - Error message if failed

**Options:**

```jsx
{
  rootMargin: "50px",  // Start loading 50px before visible
  threshold: 0,        // Intersection threshold
}
```

---

## 🎯 Performance Benefits

✅ **Reduced Initial Load Time**

- Images load only when needed
- Decreases initial bundle size

✅ **Bandwidth Optimization**

- Don't load images user never scrolls to
- Save bandwidth on mobile devices

✅ **Improved LCP (Largest Contentful Paint)**

- Page appears faster to users
- Better Core Web Vitals score

✅ **Better UX**

- Smooth loading with placeholder animation
- Visual feedback during load

---

## 📊 Implementation Status

| Component       | Status | Type      |
| --------------- | ------ | --------- |
| ProductCard     | ✅     | LazyImage |
| ProductListView | ✅     | LazyImage |
| Carousel        | ⏳     | Pending   |
| SingleProduct   | ⏳     | Pending   |
| MidBanner       | ⏳     | Pending   |

---

## 🚀 Future Improvements

- [ ] Blur-up effect for better UX
- [ ] WebP format support with fallback
- [ ] Srcset for responsive images
- [ ] Native loading="lazy" optimization
- [ ] Service worker caching
- [ ] Progressive image enhancement

---

## 💡 Best Practices

1. **Always provide alt text** for accessibility
2. **Use appropriate placeholder colors** matching content
3. **Set explicit dimensions** to prevent layout shift
4. **Lazy load non-critical images only**
5. **Monitor performance** with Web Vitals
