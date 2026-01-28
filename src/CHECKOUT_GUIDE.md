# Checkout Feature Guide

## ✅ Tính Năng Thanh Toán Mock

Đã triển khai một hệ thống thanh toán mock hoàn chỉnh cho dự án e-commerce.

## 📁 Files Tạo Mới

### 1. **useCheckout.js** (`src/hooks/useCheckout.js`)

- Custom hook xử lý logic thanh toán
- Features:
  - Mô phỏng xử lý thanh toán 2 giây
  - Lấy dữ liệu giỏ hàng từ localStorage
  - Tạo đối tượng Order mới với:
    - `orderId`: Mã đơn hàng duy nhất (ORD-{timestamp}-{randomId})
    - `date`: Ngày giờ hiện tại
    - `totalPrice`: Tổng giá tiền
    - `items`: Danh sách sản phẩm trong đơn hàng
  - Lưu đơn hàng vào `order_history` trong localStorage
  - Xóa giỏ hàng sau thanh toán
  - Hiển thị toast notifications
  - Return loading state để disable button

### 2. **OrderConfirmation.jsx** (`src/pages/OrderConfirmation.jsx`)

- Trang cảm ơn sau thanh toán
- Hiển thị:
  - ✅ Icon thành công (CheckCircle)
  - Mã đơn hàng
  - Tổng giá tiền
  - 2 buttons: "Xem Lịch Sử Đơn Hàng" & "Tiếp Tục Mua Sắm"
- Lấy dữ liệu từ `location.state`
- AOS animation

### 3. **OrderHistory.jsx** (`src/pages/OrderHistory.jsx`)

- Trang xem lịch sử đơn hàng
- Features:
  - Danh sách tất cả đơn hàng (mới nhất trước)
  - Expandable order details
  - Hiển thị chi tiết sản phẩm trong mỗi đơn hàng
  - Hình ảnh sản phẩm, giá, số lượng
  - Tính toán tổng tiền cho mỗi sản phẩm
  - Empty state khi chưa có đơn hàng
  - AOS animation cho từng order

## 🔄 Files Cập Nhật

### Cart.jsx

```jsx
// Thêm import
import { useCheckout } from "../hooks/useCheckout";

// Thêm hook trong component
const { handleCheckout, isProcessing } = useCheckout();

// Cập nhật button
<button
  onClick={handleCheckout}
  disabled={isProcessing}
  className={`${
    isProcessing
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-red-500 hover:bg-red-600 cursor-pointer"
  } text-white px-3 py-2 rounded-md w-full mt-3 transition-colors font-semibold`}
>
  {isProcessing ? "Processing..." : "Proceed to Checkout"}
</button>;
```

### App.jsx

```jsx
// Thêm imports
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";

// Thêm routes
<Route path="/order-confirmation" element={<OrderConfirmation />} />
<Route
  path="/orders"
  element={
    <ProtectedRoute>
      <OrderHistory />
    </ProtectedRoute>
  }
/>
```

## 🔐 localStorage Structure

### order_history

```javascript
[
  {
    orderId: "ORD-1705123456789-ABC123DEF",
    date: "27/1/2026, 14:30:45",
    totalPrice: "99.97",
    items: [
      {
        id: 1,
        title: "Product Name",
        price: 29.99,
        quantity: 2,
        image: "image_url",
      },
    ],
  },
];
```

## 🔗 User Flow

1. **Giỏ Hàng** → Người dùng xem sản phẩm trong giỏ
2. **Thanh Toán** → Click "Proceed to Checkout"
3. **Processing** → Button hiển thị "Processing..." (2 giây)
4. **Xác Nhận** → Chuyển tới `/order-confirmation`
5. **Lịch Sử** → Có thể xem đơn hàng trong `/orders`

## 💾 Data Persistence

- Đơn hàng được lưu vào localStorage dưới key `order_history`
- Không yêu cầu backend (mock payment)
- Dữ liệu tồn tại cho đến khi localStorage bị xóa
- Mỗi user có cart riêng (`cartItem_${userId}`)
- Lịch sử đơn hàng là global (shared across users nếu needed)

## 🎨 UI/UX Features

- ✅ Loading state trên button thanh toán
- ✅ Toast notifications (success/error)
- ✅ Smooth transitions
- ✅ Expandable order details
- ✅ Empty state messaging
- ✅ AOS scroll animations
- ✅ Responsive design
- ✅ Clear date/price formatting

## 🚀 Có Thể Mở Rộng

Để integrate thật Stripe/PayPal:

1. Thay `setTimeout(2000)` bằng thực tế payment processing
2. Lấy payment token từ Stripe/PayPal
3. Gửi order tới backend để lưu vào database
4. Xử lý webhook confirmations
5. Update order status từ "pending" → "completed"

## ✨ Highlights Cho Recruiters

- **Clean Architecture**: Custom hook pattern cho reusability
- **Error Handling**: Toast notifications + try-catch
- **UX Polish**: Loading states, animations, expandable details
- **Data Persistence**: localStorage integration
- **Scalability**: Ready for backend integration
- **Code Quality**: Descriptive variable names, clear flow
