# Frontend-Backend Integration Guide

This guide explains how to run the complete Andhra Kitchen Delights application with frontend-backend integration.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│            React Frontend (Vite)                    │
│  - Port: 5173                                       │
│  - Uses React Query for server state management     │
│  - src/lib/api.ts contains all backend calls        │
└─────────────────┬───────────────────────────────────┘
                  │ (HTTP/JSON)
                  │
┌─────────────────▼───────────────────────────────────┐
│            Node.js Backend                          │
│  - Port: 5000                                       │
│  - Pure Node.js (no Express)                        │
│  - PostgreSQL database                              │
│  - JWT authentication                               │
└─────────────────────────────────────────────────────┘
```

## Prerequisites

- Node.js 18+ 
- Bun package manager (or npm/yarn)
- PostgreSQL running locally
- .env.local file configured

## Step 1: Environment Setup

### Frontend Configuration

Create `.env.local` in the frontend root:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

### Backend Configuration

Create `.env` in the backend root (or verify backend/index.js):

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=andhra_kitchen_delights
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_key_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=hashed_password_here
```

## Step 2: Database Setup

```bash
# Start PostgreSQL (Windows)
# Or use: pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start

# Create database
createdb andhra_kitchen_delights

# Run schema
psql -U postgres -d andhra_kitchen_delights -f database/schema.sql

# Verify tables
psql -U postgres -d andhra_kitchen_delights -c "\dt"
```

## Step 3: Install Dependencies

```bash
# Frontend dependencies
cd f:\downloads\andhra-kitchen-delights-main
bun install

# Backend dependencies
cd backend
bun install
```

## Step 4: Run Both Servers

### Option A: Two Terminal Windows (Recommended)

**Terminal 1 - Frontend:**
```bash
cd f:\downloads\andhra-kitchen-delights-main
bun run dev
# Frontend runs at: http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd f:\downloads\andhra-kitchen-delights-main\backend
node index.js
# Backend runs at: http://localhost:5000
```

### Option B: Single Terminal (Using Concurrently)

```bash
# Install concurrently globally
npm install -g concurrently

# In root directory, add to package.json:
"dev:all": "concurrently \"bun run dev\" \"cd backend && node index.js\""

# Then run:
bun run dev:all
```

## Step 5: Test the Integration

### 1. Health Check

Open browser: `http://localhost:5000`
Should see: `{"message":"Welcome to Andhra Kitchen Delights API","version":"1.0.0"}`

### 2. Fetch Products (React Query)

Open `http://localhost:5173` and check browser console:
```javascript
// Console should show data from:
fetch('http://localhost:5000/products')
```

### 3. Test Admin Login

```bash
# Terminal: Test login endpoint
curl -X POST http://localhost:5000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Should return: {"token":"eyJhbGc...","userId":1}
```

### 4. Create Order (Checkout Flow)

1. Go to homepage
2. Add products to cart
3. Go to checkout
4. Enter customer details + pincode
5. Click "Place Order"
6. Frontend calls `POST /orders` via React Query
7. Backend creates order, returns order ID
8. Success message shows

## API Endpoints Reference

All endpoints are accessed through the frontend via `src/lib/api.ts`:

### Products
- `GET /products` - List all products
- `GET /products?category=pickles` - Filter by category
- `POST /products` - Create new product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Orders
- `POST /orders` - Create new order
- `GET /orders` - List all orders (admin)

### Authentication
- `POST /admin/login` - Admin login (returns JWT token)
- `GET /admin/verify` - Verify admin token (internal use)

## React Query Usage in Components

### Hook-based (Recommended)

```typescript
// In your component
import { useProductsQuery, useCreateOrderMutation } from "@/lib/api";

function MyComponent() {
  // Fetch products with caching
  const { data: products, isLoading } = useProductsQuery();
  
  // Mutation for creating orders
  const createOrderMutation = useCreateOrderMutation();
  
  const handleOrder = async (orderData) => {
    const order = await createOrderMutation.mutateAsync(orderData);
    // Order created successfully
  };
}
```

### Direct API calls (if React Query is not available)

```typescript
import { getProducts, createOrder, adminLogin } from "@/lib/api";

// Fetch
const products = await getProducts();

// Create
const order = await createOrder({ name, phone, address, items });

// Auth
const response = await adminLogin({ email, password });
```

## Common Issues & Fixes

### Issue 1: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:** Ensure `VITE_API_BASE_URL` matches backend URL exactly (http://localhost:5000)

### Issue 2: JWT Token Errors
```
401 Unauthorized - Invalid token
```

**Fix:** 
- Login again to get new token
- Token stored in localStorage: check `console.log(localStorage.getItem('auth_token'))`
- Verify JWT_SECRET in backend matches where token was created

### Issue 3: Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Fix:**
- Start PostgreSQL service
- Verify DB credentials in backend .env
- Check database exists: `psql -l`

### Issue 4: React Query Cache Issues
```
Old data displayed after update
```

**Fix:** 
- Mutations automatically invalidate cache
- Manual invalidation: 
```typescript
queryClient.invalidateQueries({ queryKey: ['products'] })
```

## Performance Tips

### Frontend Optimization

1. **React Query Settings** (in api.ts)
   - Products cache: 5 minutes (staleTime: 5 * 60 * 1000)
   - Orders cache: 2 minutes (staleTime: 2 * 60 * 1000)

2. **Lazy Loading**
   - Use `@tanstack/react-query`'s `useInfiniteQuery` for paginated products
   - Implement virtual scrolling for large lists

3. **Image Optimization**
   - Use ImageFrame component for consistent sizing
   - Images auto-compressed via Cloudinary

### Backend Optimization

1. **Database Queries**
   - Indexes on: category, status, customer_phone
   - Connection pooling: 5-10 connections

2. **Response Compression**
   - Gzip enabled automatically
   - JSON responses minified

## Deployment

### Production Environment Variables

Create `.env.production` or set in deployment platform:

```bash
# Frontend
VITE_API_BASE_URL=https://api.andhra-kitchen-delights.com

# Backend
DB_HOST=your_prod_db_host
JWT_SECRET=your_prod_secret_key
NODE_ENV=production
```

### Build & Deploy

```bash
# Frontend build
bun run build
# Output: dist/

# Backend deployment
# No build needed, just copy backend/ folder
# Ensure Node.js 18+ is available
```

## Development Workflow

### 1. Daily Development Setup

```bash
# Terminal 1: Frontend dev server
cd f:\downloads\andhra-kitchen-delights-main
bun run dev

# Terminal 2: Backend
cd f:\downloads\andhra-kitchen-delights-main\backend
node index.js

# Terminal 3: (Optional) Watch backend changes
nodemon backend/index.js
```

### 2. Making API Changes

**Backend:**
1. Edit `backend/index.js` (API logic)
2. Server auto-restarts (if using nodemon)
3. Test via curl or frontend

**Frontend:**
1. Edit component using React Query hook
2. Vite hot-reloads automatically
3. React Query handles caching

### 3. Testing API Changes

```bash
# Backend tests
cd backend && bun test

# Frontend tests
cd frontend && bun test

# E2E tests (Playwright)
bun run test:e2e
```

## Debugging

### Frontend Debugging

```javascript
// In browser console
localStorage.getItem('auth_token') // Check if user is logged in

// React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// Add to App.tsx: <ReactQueryDevtools initialIsOpen={false} />
```

### Backend Debugging

```bash
# Add console.logs in backend/index.js
console.log('Received order:', req.body);

# Run with debug logging
DEBUG=* node backend/index.js
```

### Network Debugging

```javascript
// In browser Network tab:
// 1. Check request headers (Authorization: Bearer <token>)
// 2. Check response status (200, 201, 400, 401, etc)
// 3. Check request body (JSON payload)
```

## Next Steps

1. ✅ Run dev server (`bun run dev`)
2. ✅ Test product fetching (homepage should load products)
3. ✅ Test admin login (go to /admin/login)
4. ✅ Test checkout (add to cart → checkout → place order)
5. ✅ Verify order in database: `SELECT * FROM orders;`
6. ✅ Test admin dashboard (create/edit/delete products)

## Support Files

- **API Documentation:** [BACKEND_API.md](./BACKEND_API.md)
- **Usage Examples:** [src/lib/api-examples.ts](./src/lib/api-examples.ts)
- **API Service:** [src/lib/api.ts](./src/lib/api.ts)
- **Environment Template:** [.env.local.example](./.env.local.example)

---

**Status**: ✅ Full-stack integration ready. Both frontend and backend are production-ready.
