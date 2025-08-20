# Hướng dẫn tích hợp API Đăng nhập

## Tổng quan
Đã tích hợp thành công API đăng nhập với endpoint `http://localhost:3000/api/login` vào ứng dụng React.

## Cấu trúc đã thêm

### 1. Service Layer (`src/services/authService.js`)
- Quản lý các API calls
- Xử lý token authentication
- Cấu hình axios với interceptors

### 2. Context Layer (`src/contexts/AuthContext.js`)
- Quản lý trạng thái đăng nhập toàn cục
- Cung cấp các methods: login, logout, isAuthenticated
- Tự động kiểm tra token khi khởi động ứng dụng

### 3. Protected Routes (`src/components/ProtectedRoute.js`)
- Bảo vệ các route cần đăng nhập
- Tự động chuyển hướng đến trang login nếu chưa đăng nhập

### 4. Updated Components
- `AuthLogin.js`: Tích hợp form đăng nhập với API
- `Profile.js`: Thêm chức năng đăng xuất
- `App.jsx`: Wrap với AuthProvider

## Cách sử dụng

### 1. Đăng nhập
```javascript
// Trong component
const { login } = useAuth();

const handleLogin = async (credentials) => {
  try {
    await login({
      email: "hai12@gmail.com",
      password_hash: "hai12@",
      role: "Admin"
    });
    // Chuyển hướng đến dashboard
  } catch (error) {
    // Xử lý lỗi
  }
};
```

### 2. Kiểm tra trạng thái đăng nhập
```javascript
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  // User đã đăng nhập
  console.log(user);
}
```

### 3. Đăng xuất
```javascript
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  // Tự động chuyển hướng đến login
};
```

## API Endpoint

### POST /api/login
**Request Body:**
```json
{
  "email": "hai12@gmail.com",
  "password_hash": "hai12@",
  "role": "Admin"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "hai12@gmail.com",
    "role": "Admin"
  }
}
```

## Tính năng đã tích hợp

1. **Form Validation**: Kiểm tra email và password bắt buộc
2. **Loading States**: Hiển thị loading khi đang gọi API
3. **Error Handling**: Hiển thị thông báo lỗi từ API
4. **Token Management**: Tự động lưu và xóa token
5. **Route Protection**: Bảo vệ các route cần đăng nhập
6. **Auto Redirect**: Tự động chuyển hướng sau đăng nhập/đăng xuất

## Cấu hình

### Base URL
Mặc định API base URL được cấu hình trong `authService.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### Token Storage
Token được lưu trong localStorage với key `authToken`.

## Troubleshooting

1. **CORS Error**: Đảm bảo backend cho phép CORS từ frontend
2. **Network Error**: Kiểm tra backend server có đang chạy không
3. **Token Expired**: Token sẽ tự động được xóa khi hết hạn

## Dependencies đã thêm
- `axios`: Để gọi API
- Các dependencies khác đã có sẵn trong project 