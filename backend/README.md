# SP Traditional Pickles Backend API

Production-ready Node.js REST API for pickle ordering and inventory management.

## Features

- **Order Management**: Create, list, and track orders
- **Stock Management**: Real-time product availability tracking
- **Admin Authentication**: JWT-based secure admin access
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Detailed error responses with error IDs for debugging
- **Security**: CORS, security headers, rate limiting, password hashing
- **Logging**: Structured JSON logging with request tracking
- **Database**: SQLite (development) or PostgreSQL compatible

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Hash passwords
npm run hash-password
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /health
```

### Stock Management

**Get all stock status**
```
GET /stock
```

**Update product stock** (admin only)
```
PUT /stock/:product_id
Authorization: Bearer <token>

Body: { "is_available": true }
```

### Orders

**Create order**
```
POST /orders
Content-Type: application/json

{
  "customer": {
    "name": "John Doe",
    "phone": "9876543210",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "IN",
    "pincode": "400001"
  },
  "items": [
    {
      "product_id": "pickle_01",
      "name": "Uppu Pachchalu",
      "weight": "250g",
      "quantity": 2,
      "price": 199
    }
  ],
  "shipping": 50,
  "paymentMethod": "upi"
}
```

### Online Payments (Razorpay)

**Create Razorpay order**
```
POST /payments/razorpay/order
Content-Type: application/json

{
  "customer": {
    "name": "John Doe",
    "phone": "9876543210",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "IN",
    "pincode": "400001"
  },
  "items": [
    {
      "product_id": "pickle_01",
      "name": "Uppu Pachchalu",
      "weight": "250g",
      "quantity": 2,
      "price": 199
    }
  ],
  "shipping": 50,
  "paymentMethod": "upi"
}
```

**Verify Razorpay payment and create final order**
```
POST /payments/razorpay/verify
Content-Type: application/json

{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "checkoutPayload": { ...same checkout payload used while creating razorpay order... }
}
```

**Get all orders** (admin only)
```
GET /orders?limit=20&offset=0
Authorization: Bearer <token>
```

**Get specific order** (admin only)
```
GET /orders/:order_id
Authorization: Bearer <token>
```

**Update order status** (admin only)
```
PATCH /orders/:order_id/status
Authorization: Bearer <token>

{
  "status": "processing"  // pending, processing, or delivered
}
```

### Admin Authentication

**Login**
```
POST /admin/login

{
  "email": "admin@example.com",
  "password": "your_password"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "admin": {
      "id": "uuid",
      "email": "admin@example.com"
    }
  }
}
```

## Configuration

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/sppickles
CORS_ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:5173
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
ENABLE_REQUEST_LOGGING=true
OTP_PROVIDER=fast2sms
FAST2SMS_API_KEY=your-fast2sms-api-key
FAST2SMS_ENDPOINT=https://www.fast2sms.com/dev/bulkV2
FAST2SMS_ROUTE=otp
ADMIN_PASSWORD_RESET_ALLOWED_PHONE=your-admin-mobile-number
ADMIN_PASSWORD_RESET_OTP_TTL_MS=600000
RAZORPAY_MODE=auto
RAZORPAY_TEST_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_TEST_KEY_SECRET=replace-with-your-razorpay-test-secret
RAZORPAY_LIVE_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_LIVE_KEY_SECRET=replace-with-your-razorpay-live-secret
RAZORPAY_CURRENCY=INR
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Environment (development/production) |
| `PORT` | 5000 | Server port |
| `DATABASE_URL` | - | PostgreSQL connection string |
| `CORS_ALLOWED_ORIGINS` | - | Comma-separated list of allowed origins |
| `CORS_ORIGIN` | http://localhost:8080 | Fallback single allowed origin |
| `JWT_SECRET` | - | JWT signing secret (min 32 chars in production) |
| `ENABLE_REQUEST_LOGGING` | true | Enable structured request logging |
| `OTP_PROVIDER` | none | Set to `fast2sms` to send admin password reset OTP SMS |
| `FAST2SMS_API_KEY` | - | Fast2SMS API authorization key |
| `FAST2SMS_ENDPOINT` | https://www.fast2sms.com/dev/bulkV2 | Fast2SMS API endpoint |
| `FAST2SMS_ROUTE` | otp | Fast2SMS route (`otp` or `dlt`) |
| `FAST2SMS_SENDER_ID` | - | Required when `FAST2SMS_ROUTE=dlt` |
| `FAST2SMS_TEMPLATE_ID` | - | Required when `FAST2SMS_ROUTE=dlt`; this is the approved Fast2SMS message/template ID |
| `ADMIN_PASSWORD_RESET_ALLOWED_PHONE` | +91 79813 70664 | Mobile number allowed to request admin password reset OTP |
| `ADMIN_PASSWORD_RESET_OTP_TTL_MS` | 600000 | Password reset OTP validity window |
| `RAZORPAY_MODE` | auto | Razorpay credential mode (`auto`, `test`, `live`) |
| `RAZORPAY_TEST_KEY_ID` | - | Razorpay test key ID |
| `RAZORPAY_TEST_KEY_SECRET` | - | Razorpay test key secret |
| `RAZORPAY_LIVE_KEY_ID` | - | Razorpay live key ID |
| `RAZORPAY_LIVE_KEY_SECRET` | - | Razorpay live key secret |
| `RAZORPAY_KEY_ID` | - | Legacy fallback key ID |
| `RAZORPAY_KEY_SECRET` | - | Legacy fallback key secret |
| `RAZORPAY_CURRENCY` | INR | Razorpay currency code |
| `ADMIN_LOGIN_MAX_ATTEMPTS` | 5 | Max failed login attempts |
| `ADMIN_LOGIN_WINDOW_MS` | 900000 | Login attempt window (15 min default) |
| `ADMIN_LOGIN_LOCKOUT_MS` | 1800000 | Lockout duration (30 min default) |

## Error Handling

All error responses include:
- `error`: Error message
- `details`: Additional details (if available)
- `errorId`: Unique ID for server-side debugging

Example:
```json
{
  "success": false,
  "error": "Invalid email or password.",
  "timestamp": "2026-04-02T10:30:00.000Z",
  "errorId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Validation Rules

### Orders
- Customer name: min 2 characters
- Phone: exactly 10 digits
- Address: min 5 characters
- City: min 2 characters
- State: min 2 characters
- Pincode: exactly 6 digits (India only)
- Weight options: 250g, 500g, 1kg
- Quantity: positive integer
- Items: at least 1 item required

### Stock Updates
- `is_available`: boolean value required

## Logging

Structured logs include:
- Request method, path, IP
- Response status and duration
- Error details with error ID
- Timestamp in ISO 8601 format

Example log output:
```json
{
  "timestamp": "2026-04-02T10:30:00.000Z",
  "level": "info",
  "message": "API request",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "path": "/orders",
  "ip": "192.168.1.1"
}
```

## Security Features

- **HTTPS Support**: Configure `REQUIRE_HTTPS=true` for production
- **Security Headers**: Includes multiple security headers (HSTS, X-Frame-Options, etc.)
- **Rate Limiting**: Built-in login attempt throttling
- **Password Hashing**: Scrypt with proper salt handling
- **JWT Verification**: Token validation on protected routes
- **CORS**: Configurable cross-origin access
- **Input Validation**: Comprehensive request validation

## Development

### Adding New Endpoints

1. Define routes in `index.js`
2. Add validation logic in normalization functions
3. Use `sendSuccess()` for successful responses
4. Use `sendError()` for error responses
5. Require admin auth with `requireAdmin(req, res)`

### Project Structure

```
backend/
├── index.js              # Main server and routes
├── db.js                 # Database connection and schema
├── helpers/
│   ├── auth.js          # Authentication utilities
│   └── http.js          # HTTP and CORS utilities
├── scripts/
│   ├── hash-password.mjs # Password hashing helper
│   └── create-admin.mjs  # Admin user creation
├── database/
│   └── schema.sql       # PostgreSQL schema
├── package.json
└── .env.example
```

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Set strong `JWT_SECRET` (min 32 characters)
- [ ] Configure `CORS_ORIGIN` for production domain
- [ ] Enable HTTPS with `REQUIRE_HTTPS=true`
- [ ] Set up database (PostgreSQL recommended)
- [ ] Configure environment variables
- [ ] Enable request logging for monitoring
- [ ] Set up error tracking with error IDs
- [ ] Configure rate limiting per needs
- [ ] Test admin authentication
- [ ] Backup database regularly

## Support

For issues or questions, check the error ID in logs and refer to the error handling section.

