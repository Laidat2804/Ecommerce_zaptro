# Wishlist Feature Documentation

## 📦 Overview

The Wishlist feature allows users to save products they like for later purchase. It's fully integrated with Clerk authentication and persists data per user using localStorage.

## 🏗️ Architecture

### Context Structure

```
WishlistContext
├── WishlistProvider (WishlistProvider.jsx)
├── useWishlist hook (useWishlist.js)
└── contexts.js (WishlistContext definition)
```

### Components

- **ProductCard**: Heart icon button to toggle wishlist
- **Wishlist Page**: Display all wishlist items with actions
- **Navbar**: Wishlist counter badge

### Pages

- **Wishlist Page** (`pages/Wishlist.jsx`): Full wishlist management page

## 🎯 Features

✅ **Add/Remove to Wishlist**

- Heart icon on product cards
- Toast notifications for user feedback
- Instant visual feedback (filled/empty heart)

✅ **Wishlist Page**

- Grid view of wishlist products
- Product details (price, discount)
- "Add to Cart" button (removes from wishlist)
- "Remove" button
- "Clear Wishlist" option
- Empty state with call-to-action

✅ **Data Persistence**

- Stored per user with Clerk authentication
- Fallback for guest users
- Auto-sync on login/logout
- Saved in localStorage

✅ **Navbar Integration**

- Heart icon with badge counter
- Links to wishlist page
- Protected route (requires login)

## 💻 Usage

### Using the Wishlist Hook

```jsx
import { useWishlist } from "@/context/useWishlist";

function MyComponent() {
  const {
    wishlistItems, // Array of wishlist products
    toggleWishlist, // Add/remove product
    isInWishlist, // Check if product in wishlist
    removeFromWishlist, // Remove specific product
    clearWishlist, // Clear all
  } = useWishlist();

  return (
    <button onClick={() => toggleWishlist(product)}>
      {isInWishlist(product.id) ? "❤️" : "🤍"}
    </button>
  );
}
```

### Component Integration

#### ProductCard

```jsx
<button onClick={() => toggleWishlist(product)} className="heart-button">
  <Heart filled={isInWishlist(product.id)} />
</button>
```

#### Navbar

```jsx
<Link to="/wishlist">
  <Heart />
  <span>{wishlistItems.length}</span>
</Link>
```

## 📊 Data Structure

### Wishlist Item

```javascript
{
  id: 1,
  title: "Product Name",
  price: 29.99,
  discountPercentage: 10,
  images: ["url1", "url2"],
  // ... other product fields
}
```

### localStorage Keys

```
wishlist_${userId}    // For authenticated users
wishlist_guest        // For guest users
```

## 🔄 User Flow

1. **Add to Wishlist**
   - User clicks heart icon on product
   - Product added to wishlistItems
   - Heart turns red/filled
   - Toast: "Added to wishlist ❤️"
   - localStorage updated

2. **View Wishlist**
   - User clicks wishlist icon in navbar
   - Navigates to `/wishlist` page
   - Requires authentication (ProtectedRoute)
   - Displays all wishlist products

3. **Remove from Wishlist**
   - User clicks remove button or heart again
   - Product removed from wishlistItems
   - Toast: "Removed from wishlist"
   - localStorage updated

4. **Add to Cart from Wishlist**
   - User clicks "Add to Cart"
   - Product added to cart
   - Product automatically removed from wishlist
   - Redirects to cart

5. **Login/Logout**
   - Wishlist switched based on user
   - Data persists across sessions
   - Guest wishlist preserved if user logs out

## 🔐 Authentication

The Wishlist feature uses Clerk authentication:

```jsx
// Wishlist page is protected
<ProtectedRoute>
  <Wishlist />
</ProtectedRoute>
```

Per-user wishlist keys:

```javascript
const getWishlistKey = () => {
  return user ? `wishlist_${user.id}` : "wishlist_guest";
};
```

## 🎨 UI Components

### Heart Icon Button

- Located on ProductCard
- Positioned: top-right corner
- States: filled (red) / empty (gray)
- Hover effect: scale up

### Wishlist Page

- Grid layout (3 columns on desktop)
- Product cards with images
- Price and discount display
- Action buttons
- Empty state with Lottie animation

### Navbar Badge

- Heart icon with counter
- Red badge for count
- Links to wishlist page

## 🚀 Performance Considerations

✅ **Optimizations**

- useMemo for wishlist filtering
- Lazy loading for product images
- localStorage for instant access
- Reduced re-renders with context

⚠️ **Limitations**

- localStorage ~5-10MB limit
- Per-user limit depends on product count
- No cloud sync (localStorage only)

## 📈 Future Enhancements

- [ ] Cloud sync (Firebase/backend)
- [ ] Wishlist sharing
- [ ] Price drop notifications
- [ ] Wishlist categories/folders
- [ ] Move to cart with quantity
- [ ] Share wishlist feature
- [ ] Wishlist history/analytics
- [ ] Integration with email notifications

## 🐛 Debugging

### Check Wishlist State

```jsx
const { wishlistItems } = useWishlist();
console.log(wishlistItems); // Array of products
```

### Check localStorage

```javascript
console.log(localStorage.getItem("wishlist_userId"));
```

### Verify Provider

```jsx
// Error: "useWishlist must be used within WishlistProvider"
// Solution: Ensure WishlistProvider wraps App in main.jsx
```

## 📱 Mobile Responsiveness

- Heart button: Touch-friendly (44px min)
- Wishlist page: Responsive grid
- Navbar badge: Visible on all sizes
- Toast notifications: Mobile-optimized

## 🧪 Testing Checklist

- [ ] Add product to wishlist
- [ ] Remove product from wishlist
- [ ] View wishlist page
- [ ] Add wishlist item to cart
- [ ] Login/logout switches wishlists
- [ ] localStorage persists data
- [ ] Toast notifications appear
- [ ] Badge counter updates
- [ ] Empty state displays
- [ ] Responsive on mobile

## 💡 Tips

1. **Clear wishlist on app reset**: `localStorage.clear()`
2. **Export wishlist data**: Convert to JSON for sharing
3. **Bulk operations**: Implement batch add-to-cart
4. **Analytics**: Track most-wishlisted products
