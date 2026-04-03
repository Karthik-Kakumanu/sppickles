# 🔒 Admin Credentials Security Guide

## Current Setup

**Admin Account:**
- Email: `admin@sppickles.com`
- Password: stored hashed in the database

## Security Implementation

### ✅ Password Security
1. **Hashing Algorithm**: Scrypt (industry standard)
2. **Salt**: Per-user random salt generated on creation
3. **Verification**: Timing-safe comparison to prevent timing attacks
4. **Storage**: Only hashed password stored in database (`sp-pickles.db`)

### ✅ Frontend Security
- Credentials are **NOT** hardcoded in React components
- No environment variables expose credentials to browser
- Frontend only receives a login success response
- JWT is stored in an HttpOnly cookie and never exposed to JavaScript

### ✅ Backend Security
- Rate limiting: 5 failed attempts before lockout
- Lockout duration: 30 minutes
- Failed attempts tracked per IP + email
- Automatic cleanup of expired attempts
- All login attempts logged with request ID

### ✅ Environment Security
- `.env` file in backend only (NOT frontend)
- `.env` added to `.gitignore` - never committed
- Production: Use environment variables, never .env files
- Credentials never printed in logs (only `[HIDDEN FOR SECURITY]`)

## How Password Verification Works

```
1. User enters password at login form
2. Frontend sends POST /api/admin/login with email + password
3. Backend retrieves user from database
4. Backend uses scrypt to verify password against stored hash
5. If valid: JWT token generated and returned
6. If invalid: Request is throttled and error is returned
```

## Creating New Admin Users

```bash
cd backend
node scripts/create-admin.mjs "email@example.com" "secure_password_here"
```

**Output shows:**
- ✓ Success confirmation
- ✓ Admin ID (UUID)
- ✓ Email used
- ✗ Password shows as `[HIDDEN FOR SECURITY]`

## Deployment Best Practices

### Development (SQLite)
```
✓ Password: sppickles
✓ Email: SPPICKLES
✓ Database: sp-pickles.db (local file)
```

### Production (PostgreSQL)
```
REQUIRED STEPS:

1. Change admin password to strong random password
   node scripts/create-admin.mjs "admin@company.com" "generate-strong-password"

2. Use environment variables for secrets:
   export JWT_SECRET="strong-random-32-char-secret"
   export NODE_ENV="production"
   
3. Enable HTTPS
   REQUIRE_HTTPS=true

4. Use production database with encryption

5. Enable audit logging for admin activities

6. Setup monitoring for failed login attempts

7. Rotate JWT_SECRET periodically
```

## Security Headers Implemented

✓ Strict-Transport-Security (1 year HSTS)
✓ X-Frame-Options: DENY
✓ X-Content-Type-Options: nosniff
✓ X-XSS-Protection: 1; mode=block
✓ Referrer-Policy: strict-origin-when-cross-origin
✓ Permissions-Policy: geolocation, microphone, camera disabled

## What's NOT Exposed

❌ Plain text passwords never visible
❌ Database connection strings not in frontend
❌ JWT_SECRET not in frontend code
❌ Credentials never logged to console
❌ Error messages don't leak auth details

## Testing Login

```bash
# Email: admin@sppickles.com
# Password: use the database-seeded admin password

# Frontend: http://localhost:8080/admin/login
# API: POST http://localhost:5000/api/admin/login
```

## Monitoring

Monitor these for security:

1. **Failed Login Attempts**
   - Log level: WARN
   - Includes error ID for tracking
   - Throttled after 5 attempts

2. **Successful Logins**
   - Log level: INFO
   - Includes request ID
   - No sensitive data logged

3. **API Requests**
   - All requests logged with ID
   - Duration tracked
   - IP address recorded

## Questions?

For security concerns:
- Check logs for error IDs
- Review request timings
- Verify JWT tokens are valid
- Test rate limiting with intentional failures

---

**Last Updated**: April 2, 2026
**Status**: Secure ✓
