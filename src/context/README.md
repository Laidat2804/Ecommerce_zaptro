# Context State Management

## 📁 Structure

```
context/
├── contexts.js           # Context definitions (CartContext, DataContext)
├── useCart.js           # Custom hook for Cart Context
├── useData.js           # Custom hook for Data Context
├── CartProvider.jsx     # Cart Provider component
├── DataProvider.jsx     # Data Provider component
└── README.md           # This file
```

## 🎯 Context Overview

### CartContext

**File**: `CartProvider.jsx`

Manages shopping cart state with localStorage persistence and Clerk authentication.

**Features**:

- Add/remove products from cart
- Update product quantities
- Persistent storage per user
- Guest cart support
- Clear cart functionality

**Usage**:

```jsx
import { useCart } from "@/context/useCart";

function MyComponent() {
  const { cartItem, addToCart, deleteItem, updateQuantity } = useCart();
  // Use cart functionality
}
```

**Methods**:

- `addToCart(product)` - Add or increase quantity
- `updateQuantity(cartItems, productId, action)` - Update quantity (increase/decrease)
- `deleteItem(productId)` - Remove product from cart
- `clearCart()` - Clear entire cart

---

### DataContext

**File**: `DataProvider.jsx`

Manages product data fetching and filtering logic.

**Features**:

- Fetch all products from API
- Extract unique categories and brands
- Calculate price range
- Loading and error states

**Usage**:

```jsx
import { useData } from "@/context/useData";

function MyComponent() {
  const { data, loading, fetchAllProducts, categoryOnlyData } = useData();
  // Use data functionality
}
```

**Methods**:

- `fetchAllProducts()` - Fetch products from API
- `getUniqueValues(data, property)` - Extract unique values
- `getPriceRange()` - Get min/max prices

**Available State**:

- `data` - Array of products
- `loading` - Loading state
- `error` - Error message if fetch fails
- `categoryOnlyData` - Unique categories
- `brandOnlyData` - Unique brands

---

## 🔧 Adding New Context

To add a new context:

1. **Define context in `contexts.js`**:

   ```jsx
   export const MyContext = createContext(null);
   ```

2. **Create provider component** (e.g., `MyProvider.jsx`):

   ```jsx
   export const MyProvider = ({ children }) => {
     const [state, setState] = useState();
     // Provider logic
     return (
       <MyContext.Provider value={{ state, setState }}>
         {children}
       </MyContext.Provider>
     );
   };
   ```

3. **Create custom hook** (e.g., in appropriate `.js` file):

   ```jsx
   export const useMyContext = () => {
     const context = useContext(MyContext);
     if (!context) {
       throw new Error("useMyContext must be used within MyProvider");
     }
     return context;
   };
   ```

4. **Add provider to `main.jsx`**:
   ```jsx
   <MyProvider>
     <App />
   </MyProvider>
   ```

---

## ✨ Best Practices

- ✅ Always use custom hooks instead of directly using `useContext`
- ✅ Add proper error messages when context is used outside provider
- ✅ Document context methods with JSDoc comments
- ✅ Keep context focused on specific domain (Cart, Data, etc.)
- ✅ Use TypeScript interfaces for better type safety (future improvement)

---

## 🚀 Future Improvements

- [ ] Add TypeScript interfaces
- [ ] Implement error boundaries
- [ ] Add context logging/debugging utilities
- [ ] Create useReducer version for complex state management
- [ ] Add persistence middleware for DataContext
