# AOS (Animate On Scroll) Integration

## 📦 Setup

AOS library đã được cài đặt:

```bash
npm install aos
```

## 🎯 useAOS Hook

Custom hook để initialize AOS với cấu hình mặc định:

```jsx
import { useAOS } from "@/hooks/useAOS";

function MyComponent() {
  useAOS(); // Initialize AOS for this page/component

  return <div data-aos="fade-up">Animated content</div>;
}
```

**Default Configuration:**

```javascript
{
  duration: 800,      // Animation duration (ms)
  easing: "ease-in-out",
  once: true,         // Animate only once
  mirror: false,      // No animation on scroll up
  offset: 100,        // Trigger when 100px from viewport
}
```

## 🎨 Available Animations

### Fade Animations

- `fade` - Fade in
- `fade-up` - Fade in from bottom
- `fade-down` - Fade in from top
- `fade-left` - Fade in from right
- `fade-right` - Fade in from left
- `fade-up-left` - Diagonal fade
- `fade-up-right` - Diagonal fade

### Zoom Animations

- `zoom-in` - Scale from 0 to 1
- `zoom-in-up` - Scale in from bottom
- `zoom-in-down` - Scale in from top
- `zoom-in-left` - Scale in from right
- `zoom-in-right` - Scale in from left

### Flip Animations

- `flip-left` - 3D flip
- `flip-right` - 3D flip

### Slide Animations

- `slide-up` - Slide in from bottom
- `slide-down` - Slide in from top
- `slide-left` - Slide in from right
- `slide-right` - Slide in from left

### Bounce Animations

- `bounce-in` - Bouncy entrance
- `bounce-in-up` - Bounce from bottom
- `bounce-in-down` - Bounce from top
- `bounce-in-left` - Bounce from right
- `bounce-in-right` - Bounce from left

## 💻 Usage Examples

### Basic Usage

```jsx
<div data-aos="fade-up">Simple fade-up animation</div>
```

### With Duration

```jsx
<div data-aos="zoom-in" data-aos-duration="1000">
  Slower zoom animation (1 second)
</div>
```

### With Delay

```jsx
<div data-aos="fade-up" data-aos-delay="200">
  Wait 200ms before animating
</div>
```

### Staggered Animations

```jsx
{
  items.map((item, index) => (
    <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
      {item}
    </div>
  ));
}
```

### Advanced Configuration

```jsx
<div
  data-aos="flip-left"
  data-aos-duration="1200"
  data-aos-delay="200"
  data-aos-easing="ease-in-out"
  data-aos-once="false"
>
  Complex animation
</div>
```

## 📊 Implementation Status

| Component       | Status | Animation           |
| --------------- | ------ | ------------------- |
| Home            | ✅     | ——                  |
| Features        | ✅     | fade-up (staggered) |
| ProductCard     | ✅     | zoom-in             |
| Products Page   | ✅     | ——                  |
| ProductListView | ⏳     | Pending             |
| Footer          | ⏳     | Pending             |
| Category        | ⏳     | Pending             |

## 🚀 Performance Tips

✅ **Good Practices:**

- Use `once: true` to prevent re-animations (default)
- Set appropriate `duration` (300-1000ms)
- Use `offset` to trigger early (better perceived performance)
- Avoid animating too many elements at once

❌ **Avoid:**

- `once: false` unless necessary (causes reflows)
- Very long durations (> 2000ms)
- Too many simultaneous animations
- Animations on critical images/content

## 🔧 Custom Hook Options

Pass custom options to useAOS:

```jsx
useAOS({
  duration: 600,
  easing: "ease-out",
  offset: 50,
});
```

## 📱 Mobile Consideration

AOS is mobile-friendly but consider:

- Reducing animation duration on mobile
- Using `mirror: true` on mobile for better feel
- Disabling animations for very slow devices

```jsx
const isMobile = window.innerWidth < 768;
useAOS({
  duration: isMobile ? 400 : 800,
});
```

## 📚 Resources

- [AOS Documentation](https://michalsnik.github.io/aos/)
- [Easing Functions](https://easings.net/)
- [Animation Best Practices](https://web.dev/animations-guide/)
