# Backend API Routes - Complete Reference

## Base URL
```
http://localhost:5000
```

---

## ✅ HEALTH CHECK

### GET /health
Health check endpoint.

**Response (200):**
```json
{
  "ok": true
}
```

---

## ✅ ROOT INFO

### GET /
API information and available endpoints.

**Response (200):**
```json
{
  "name": "SP Pickles Backend API",
  "ok": true,
  "message": "Backend is running...",
  "frontendUrl": "http://localhost:8080",
  "endpoints": { ... }
}
```

---

## 🏪 PRODUCTS

### GET /products
Fetch all products with optional category filter.

**Query Parameters:**
- `category` (optional): "pickles" | "powders" | "snacks"

**Response (200):**
```json
{
  "products": [
    {
      "id": "mango-pickle-1234567890ab",
      "name": "Mango Pickle",
      "category": "pickles",
      "price_per_kg": 350,
      "image": "https://...",
      "description": "...",
      "isAvailable": true,
      "isBestSeller": true,
      "createdAt": "2026-03-30T...",
      "updatedAt": "2026-03-30T..."
    }
  ]
}
```

---

### POST /products
Create a new product (requires admin authentication).

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Mango Pickle",
  "category": "pickles",
  "price_per_kg": 350,
  "image": "https://...",
  "description": "Traditional mango pickle...",
  "isAvailable": true,
  "isBestSeller": false,
  "id": "custom-id" // optional
}
```

**Response (201):**
```json
{
  "product": {
    "id": "mango-pickle-1234567890ab",
    ...
  }
}
```

**Errors:**
- `400`: Missing/invalid fields
- `401`: Not authenticated
- `409`: Product ID already exists

---

### PUT /products/:id
Update existing product (requires admin authentication).

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Updated Mango Pickle",
  "price_per_kg": 380,
  ...
}
```

**Response (200):**
```json
{
  "product": { ... }
}
```

**Errors:**
- `400`: Invalid fields
- `401`: Not authenticated
- `404`: Product not found

---

### DELETE /products/:id
Delete product (requires admin authentication).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "message": "Product deleted successfully.",
  "product": {
    "id": "mango-pickle-1234567890ab",
    "name": "Mango Pickle"
  }
}
```

**Errors:**
- `401`: Not authenticated
- `404`: Product not found

---

## 📦 ORDERS

### POST /orders
Create new customer order (public endpoint).

**Body:**
```json
{
  "customer_name": "John Doe",
  "customer_phone": "9876543210",
  "customer_address": "123 Main St, City, State",
  "pincode": "560001",
  "region": "South India",
  "items": [
    {
      "product_id": "mango-pickle-1234567890ab",
      "quantity": 2,
      "weight": "250g",
      "price": 87.50
    }
  ]
}
```

**Response (201):**
```json
{
  "order": {
    "id": "SP-ABC123DEF456",
    "customer": {
      "name": "John Doe",
      "phone": "9876543210",
      "address": "123 Main St, City, State"
    },
    "items": [
      {
        "productId": "mango-pickle-1234567890ab",
        "name": "Mango Pickle",
        "weight": "250g",
        "quantity": 2,
        "unitPrice": 87.50,
        "totalPrice": 175
      }
    ],
    "subtotal": 175,
    "total": 375,
    "status": "new",
    "createdAt": "2026-03-30T..."
  }
}
```

**Errors:**
- `400`: Missing/invalid fields, product unavailable
- `409`: Database conflict

---

### GET /orders
Fetch all orders (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "orders": [
    {
      "id": "SP-ABC123DEF456",
      "customer": { ... },
      "items": [ ... ],
      "subtotal": 175,
      "total": 375,
      "status": "new",
      "createdAt": "2026-03-30T..."
    }
  ]
}
```

**Errors:**
- `401`: Not authenticated

---

## 🔐 ADMIN AUTHENTICATION

### POST /admin/login
Admin login - returns JWT token for subsequent requests.

**Body:**
```json
{
  "email": "admin@sppickles.in",
  "password": "YourSecurePassword"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "admin-123",
    "email": "admin@sppickles.in"
  }
}
```

**Token Usage:**
- Store token in localStorage
- Include in Authorization header: `Bearer <token>`
- Valid for 7 days
- Expires after 7 days - requires re-login

**Errors:**
- `400`: Email or password missing
- `401`: Invalid credentials

---

## 📋 VALIDATION RULES

### Products
- **name**: Required, non-empty string
- **category**: Required, must be "pickles", "powders", or "snacks"
- **price_per_kg**: Required, positive number
- **image**: Required, non-empty URL string
- **description**: Required, non-empty string
- **isAvailable**: Boolean (default: true)
- **isBestSeller**: Boolean (default: false)

### Orders
- **customer_name**: Required, non-empty string
- **customer_phone**: Required, 10-digit phone number
- **customer_address**: Required, non-empty string
- **pincode**: Required, 6-digit code
- **items**: Required, non-empty array
  - **product_id**: Required, must exist in products table
  - **quantity**: Required, positive integer
  - **weight**: Required, one of: "250g", "500g", "1kg"
  - **price**: Optional, calculated from product

### Admin Login
- **email**: Required, valid email format
- **password**: Required, non-empty string

---

## ❌ ERROR CODES

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Missing/invalid token |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate or constraint violation |
| 500 | Internal Server Error |

---

## 🔒 CORS Configuration

All endpoints support CORS with:
- **Origins**: *
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization

---

## 🚀 ENVIRONMENT VARIABLES

Required in `.env`:
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/sp_pickles
JWT_SECRET=your_super_secret_key_min_32_chars
```

---

## 📝 NOTES

- All timestamps are ISO 8601 format
- All prices are in ₹ (Indian Rupees)
- Database uses PostgreSQL with transactions
- Admin operations require valid JWT token
- Public endpoints (products, orders) don't require auth
- Order creation is transactional (all-or-nothing)
