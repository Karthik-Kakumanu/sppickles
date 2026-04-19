import http from "node:http";
import { createHmac, randomInt, randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, stat } from "node:fs/promises";
import Razorpay from "razorpay";
import { pool } from "./db.js";
import {
  clearAdminSessionCookie,
  hashPassword,
  setAdminSessionCookie,
  signAdminToken,
  verifyAdminToken,
  verifyPassword,
} from "./helpers/auth.js";
import {
  getRequestUrl,
  handleCors,
  matchRoute,
  parseJsonBody,
  sendError,
  sendSuccess,
} from "./helpers/http.js";

const PORT = Number(process.env.PORT || 5000);
const ENABLE_LOGGING = process.env.ENABLE_REQUEST_LOGGING !== "false";
const NODE_ENV = String(process.env.NODE_ENV || "development").trim().toLowerCase();
const API_PREFIX = "/api";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIST_DIRS = [
  path.resolve(__dirname, "../dist"),
  path.resolve(__dirname, "../frontend/dist"),
];
const VALID_WEIGHTS = new Set(["250g", "500g", "1kg"]);
const PHONE_PATTERN = /^\d{10}$/;
const PINCODE_PATTERN = /^\d{6}$/;
const ORDER_STATUS_ALIASES = {
  new: "pending",
  pending: "pending",
  processing: "processing",
  shipped: "delivered",
  delivered: "delivered",
  cancelled: "cancelled",
};
const VALID_ORDER_STATUSES = new Set(["pending", "processing", "delivered", "cancelled"]);
const VALID_PRODUCT_CATEGORIES = new Set(["pickles", "powders", "fryums"]);
const VALID_PRODUCT_SUBCATEGORIES = new Set(["salt", "asafoetida"]);
const VALID_COUPON_DISCOUNT_TYPES = new Set(["percentage", "fixed"]);
const VALID_COUPON_SCOPES = new Set(["all", "category", "product"]);
const VALID_COUPON_CATEGORY_SCOPES = new Set([
  "pickles",
  "powders",
  "fryums",
  "salted-pickles",
  "tempered-pickles",
]);
const VALID_AD_MEDIA_TYPES = new Set(["image", "video"]);
const ORDER_CANCEL_WINDOW_MS = 6 * 60 * 60 * 1000;
const DUMMY_ADMIN_PASSWORD_HASH = hashPassword("sp-pickles-dummy-password");
const ADMIN_LOGIN_MAX_ATTEMPTS = Number(process.env.ADMIN_LOGIN_MAX_ATTEMPTS || 5);
const ADMIN_LOGIN_WINDOW_MS = Number(process.env.ADMIN_LOGIN_WINDOW_MS || 15 * 60 * 1000);
const ADMIN_LOGIN_LOCKOUT_MS = Number(process.env.ADMIN_LOGIN_LOCKOUT_MS || 30 * 60 * 1000);
const ADMIN_SESSION_IDLE_TIMEOUT_MINUTES = Number(process.env.ADMIN_SESSION_IDLE_TIMEOUT_MINUTES || 30);
const ADMIN_PASSWORD_RESET_ALLOWED_PHONE = String(
  process.env.ADMIN_PASSWORD_RESET_ALLOWED_PHONE || "+91 79813 70664",
)
  .replace(/\D/g, "")
  .replace(/^91/, "");
const ADMIN_PASSWORD_RESET_OTP_TTL_MS = Number(process.env.ADMIN_PASSWORD_RESET_OTP_TTL_MS || 10 * 60 * 1000);
const ADMIN_PASSWORD_RESET_OTP_MAX_ATTEMPTS = Number(process.env.ADMIN_PASSWORD_RESET_OTP_MAX_ATTEMPTS || 5);
const OTP_PROVIDER = String(process.env.OTP_PROVIDER || "none").trim().toLowerCase();
const FAST2SMS_API_KEY = String(process.env.FAST2SMS_API_KEY || "").trim();
const FAST2SMS_ENDPOINT = String(process.env.FAST2SMS_ENDPOINT || "https://www.fast2sms.com/dev/bulkV2").trim();
const FAST2SMS_ROUTE = String(process.env.FAST2SMS_ROUTE || "otp").trim().toLowerCase();
const FAST2SMS_SENDER_ID = String(process.env.FAST2SMS_SENDER_ID || "").trim();
const FAST2SMS_TEMPLATE_ID = String(process.env.FAST2SMS_TEMPLATE_ID || "").trim();
const FAST2SMS_ENTITY_ID = String(process.env.FAST2SMS_ENTITY_ID || "").trim();
const FAST2SMS_MESSAGE_TEMPLATE = String(
  process.env.FAST2SMS_MESSAGE_TEMPLATE || "Your SP Pickles admin OTP is {{OTP}}. It is valid for 10 minutes.",
).trim();
const RAZORPAY_MODE = String(process.env.RAZORPAY_MODE ?? "auto").trim().toLowerCase();
const RAZORPAY_KEY_ID = String(process.env.RAZORPAY_KEY_ID ?? "").trim();
const RAZORPAY_KEY_SECRET = String(process.env.RAZORPAY_KEY_SECRET ?? "").trim();
const RAZORPAY_LIVE_KEY_ID = String(process.env.RAZORPAY_LIVE_KEY_ID ?? "").trim();
const RAZORPAY_LIVE_KEY_SECRET = String(process.env.RAZORPAY_LIVE_KEY_SECRET ?? "").trim();
const RAZORPAY_TEST_KEY_ID = String(process.env.RAZORPAY_TEST_KEY_ID ?? "").trim();
const RAZORPAY_TEST_KEY_SECRET = String(process.env.RAZORPAY_TEST_KEY_SECRET ?? "").trim();
const RAZORPAY_CURRENCY = String(process.env.RAZORPAY_CURRENCY ?? "INR").trim().toUpperCase();
const adminLoginAttempts = new Map();
const couponEventClients = new Set();
const adminPasswordResetOtps = new Map();

const normalizeIndianMobile = (value) => {
  const digitsOnly = String(value ?? "").replace(/\D/g, "");

  if (digitsOnly.length < 10) {
    return null;
  }

  const lastTenDigits = digitsOnly.slice(-10);
  return `+91${lastTenDigits}`;
};

const isEligibleAdminResetMobile = (mobileNumber) => {
  const normalizedMobile = normalizeIndianMobile(mobileNumber);

  if (!normalizedMobile) {
    return false;
  }

  const normalizedDigits = normalizedMobile.replace(/^\+91/, "");
  return normalizedDigits === ADMIN_PASSWORD_RESET_ALLOWED_PHONE;
};

const maskMobileNumber = (mobileNumber) => {
  const normalized = normalizeIndianMobile(mobileNumber);

  if (!normalized) {
    return "";
  }

  const localNumber = normalized.replace(/^\+91/, "");
  return `+91******${localNumber.slice(-4)}`;
};

const generateSixDigitOtp = () => String(randomInt(0, 1_000_000)).padStart(6, "0");

const getIndianMobileDigits = (mobileNumber) => {
  const normalized = normalizeIndianMobile(mobileNumber);

  if (!normalized) {
    return null;
  }

  return normalized.replace(/^\+91/, "");
};

const sendFast2SmsOtp = async (mobileNumber, otp) => {
  if (!FAST2SMS_API_KEY) {
    throw new Error("FAST2SMS_API_KEY is missing.");
  }

  const phoneDigits = getIndianMobileDigits(mobileNumber);

  if (!phoneDigits) {
    throw new Error("Invalid recipient mobile number.");
  }

  const body = new URLSearchParams();
  body.set("numbers", phoneDigits);

  if (FAST2SMS_ROUTE === "dlt") {
    body.set("route", "dlt");

    if (FAST2SMS_SENDER_ID) {
      body.set("sender_id", FAST2SMS_SENDER_ID);
    }

    if (FAST2SMS_TEMPLATE_ID) {
      body.set("template_id", FAST2SMS_TEMPLATE_ID);
    }

    if (FAST2SMS_ENTITY_ID) {
      body.set("entity_id", FAST2SMS_ENTITY_ID);
    }

    body.set("message", FAST2SMS_MESSAGE_TEMPLATE.replace(/\{\{OTP\}\}/g, otp));
  } else {
    body.set("route", "otp");
    body.set("variables_values", otp);
    body.set("flash", "0");

    if (FAST2SMS_SENDER_ID) {
      body.set("sender_id", FAST2SMS_SENDER_ID);
    }
  }

  const response = await fetch(FAST2SMS_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: FAST2SMS_API_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  });

  const payload = await response.json().catch(() => ({}));
  const isSuccess =
    response.ok &&
    (payload?.return === true || payload?.status_code === 200 || payload?.request_id || payload?.message?.includes("SMS"));

  if (!isSuccess) {
    throw new Error(`Fast2SMS request failed with status ${response.status}.`);
  }

  return payload;
};

const sendPasswordResetOtp = async (mobileNumber, otp) => {
  if (OTP_PROVIDER === "fast2sms") {
    return sendFast2SmsOtp(mobileNumber, otp);
  }

  return null;
};

const getAdminUsersForPasswordReset = async () => {
  const result = await pool.query(
    `
      select id, email
      from admin_users
      order by created_at asc
    `,
  );

  return result.rows;
};

const requestAdminPasswordResetOtp = async (body) => {
  if (!isPlainObject(body)) {
    throw { statusCode: 400, message: "Request body must be a JSON object." };
  }

  const mobile = normalizeIndianMobile(body.mobile);

  if (!mobile) {
    throw { statusCode: 400, message: "Valid Indian mobile number is required." };
  }

  if (!isEligibleAdminResetMobile(mobile)) {
    throw { statusCode: 403, message: "This mobile number is not eligible for admin password reset." };
  }

  const adminUsers = await getAdminUsersForPasswordReset();

  if (!adminUsers || adminUsers.length === 0) {
    throw { statusCode: 404, message: "No admin account found." };
  }

  const otp = generateSixDigitOtp();
  const expiresAt = Date.now() + ADMIN_PASSWORD_RESET_OTP_TTL_MS;

  adminPasswordResetOtps.set(mobile, {
    otp,
    adminUserIds: adminUsers.map((adminUser) => String(adminUser.id)),
    expiresAt,
    attempts: 0,
  });

  try {
    await sendPasswordResetOtp(mobile, otp);
  } catch (error) {
    adminPasswordResetOtps.delete(mobile);
    throw {
      statusCode: 502,
      message: "Failed to deliver OTP SMS. Check Fast2SMS configuration and try again.",
      details: { cause: error instanceof Error ? error.message : "Unknown provider error" },
    };
  }

  log("info", "Generated admin password reset OTP", {
    mobile: maskMobileNumber(mobile),
    expiresAt: new Date(expiresAt).toISOString(),
    otpPreview: NODE_ENV === "production" ? "hidden" : otp,
  });

  const response = {
    eligible: true,
    expiresInSeconds: Math.floor(ADMIN_PASSWORD_RESET_OTP_TTL_MS / 1000),
  };

  if (NODE_ENV !== "production" && OTP_PROVIDER !== "fast2sms") {
    response.devOtp = otp;
  }

  return response;
};

const resetAdminPasswordWithOtp = async (body) => {
  if (!isPlainObject(body)) {
    throw { statusCode: 400, message: "Request body must be a JSON object." };
  }

  const mobile = normalizeIndianMobile(body.mobile);
  const otp = String(body.otp ?? "").trim();
  const newPassword = String(body.newPassword ?? "");

  if (!mobile) {
    throw { statusCode: 400, message: "Valid Indian mobile number is required." };
  }

  if (!isEligibleAdminResetMobile(mobile)) {
    throw { statusCode: 403, message: "This mobile number is not eligible for admin password reset." };
  }

  if (!/^\d{6}$/.test(otp)) {
    throw { statusCode: 400, message: "A valid 6-digit OTP is required." };
  }

  if (newPassword.length < 6) {
    throw { statusCode: 400, message: "New password must be at least 6 characters." };
  }

  const otpRecord = adminPasswordResetOtps.get(mobile);

  if (!otpRecord || Date.now() > otpRecord.expiresAt) {
    adminPasswordResetOtps.delete(mobile);
    throw { statusCode: 410, message: "OTP expired. Request a new OTP." };
  }

  if (otpRecord.attempts >= ADMIN_PASSWORD_RESET_OTP_MAX_ATTEMPTS) {
    adminPasswordResetOtps.delete(mobile);
    throw { statusCode: 429, message: "Too many OTP attempts. Request a new OTP." };
  }

  if (otpRecord.otp !== otp) {
    otpRecord.attempts += 1;
    adminPasswordResetOtps.set(mobile, otpRecord);
    throw { statusCode: 401, message: "Invalid OTP." };
  }

  const adminUserIds = Array.isArray(otpRecord.adminUserIds)
    ? otpRecord.adminUserIds.map((id) => String(id).trim()).filter(Boolean)
    : [];

  if (adminUserIds.length === 0) {
    throw { statusCode: 404, message: "Admin account not found." };
  }

  const nextPasswordHash = hashPassword(newPassword);
  const updatedAdminResult = await pool.query(
    `
      update admin_users
      set password_hash = $2
      where id::text = any($1::text[])
      returning id, email
    `,
    [adminUserIds, nextPasswordHash],
  );

  if (updatedAdminResult.rowCount === 0) {
    throw { statusCode: 404, message: "Admin account not found." };
  }

  await pool.query(
    `
      update admin_sessions
      set revoked_at = CURRENT_TIMESTAMP
      where admin_user_id::text = any($1::text[]) and revoked_at is null
    `,
    [adminUserIds],
  );

  adminPasswordResetOtps.delete(mobile);

  return {
    passwordUpdated: true,
    sessionsRevoked: true,
    updatedAdminCount: updatedAdminResult.rowCount,
  };
};

const inferRazorpayModeFromKey = (keyId) => {
  if (keyId.startsWith("rzp_live_")) {
    return "live";
  }

  if (keyId.startsWith("rzp_test_")) {
    return "test";
  }

  return "unknown";
};

const resolveActiveRazorpayCredentials = () => {
  if (RAZORPAY_MODE === "live") {
    return {
      keyId: RAZORPAY_LIVE_KEY_ID || RAZORPAY_KEY_ID,
      keySecret: RAZORPAY_LIVE_KEY_SECRET || RAZORPAY_KEY_SECRET,
    };
  }

  if (RAZORPAY_MODE === "test") {
    return {
      keyId: RAZORPAY_TEST_KEY_ID || RAZORPAY_KEY_ID,
      keySecret: RAZORPAY_TEST_KEY_SECRET || RAZORPAY_KEY_SECRET,
    };
  }

  if (NODE_ENV === "production" && RAZORPAY_LIVE_KEY_ID && RAZORPAY_LIVE_KEY_SECRET) {
    return {
      keyId: RAZORPAY_LIVE_KEY_ID,
      keySecret: RAZORPAY_LIVE_KEY_SECRET,
    };
  }

  if (NODE_ENV !== "production" && RAZORPAY_TEST_KEY_ID && RAZORPAY_TEST_KEY_SECRET) {
    return {
      keyId: RAZORPAY_TEST_KEY_ID,
      keySecret: RAZORPAY_TEST_KEY_SECRET,
    };
  }

  return {
    keyId: RAZORPAY_KEY_ID || RAZORPAY_LIVE_KEY_ID || RAZORPAY_TEST_KEY_ID,
    keySecret: RAZORPAY_KEY_SECRET || RAZORPAY_LIVE_KEY_SECRET || RAZORPAY_TEST_KEY_SECRET,
  };
};

const activeRazorpayCredentials = resolveActiveRazorpayCredentials();
const ACTIVE_RAZORPAY_KEY_ID = activeRazorpayCredentials.keyId;
const ACTIVE_RAZORPAY_KEY_SECRET = activeRazorpayCredentials.keySecret;
const ACTIVE_RAZORPAY_MODE = inferRazorpayModeFromKey(ACTIVE_RAZORPAY_KEY_ID);

const razorpayClient =
  ACTIVE_RAZORPAY_KEY_ID && ACTIVE_RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: ACTIVE_RAZORPAY_KEY_ID,
        key_secret: ACTIVE_RAZORPAY_KEY_SECRET,
      })
    : null;

// Logging utility
const log = (level, message, metadata = {}) => {
  if (!ENABLE_LOGGING) return;
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({
    timestamp,
    level,
    message,
    ...metadata,
  }));
};

// Request ID generator and tracking
const getRequestId = (req) => req.headers["x-request-id"] || randomUUID();

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const isApiRequestPath = (pathname) =>
  pathname === API_PREFIX || pathname.startsWith(`${API_PREFIX}/`);

const getContentType = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  return MIME_TYPES[extension] || "application/octet-stream";
};

const resolveFrontendDistDir = async () => {
  for (const candidateDir of FRONTEND_DIST_DIRS) {
    try {
      const indexFile = path.join(candidateDir, "index.html");
      const indexStats = await stat(indexFile);

      if (indexStats.isFile()) {
        return candidateDir;
      }
    } catch {
      // Try the next candidate.
    }
  }

  return null;
};

const sendStaticFile = async (res, filePath, method) => {
  const body = await readFile(filePath);
  const isHtml = filePath.endsWith(".html");

  res.writeHead(200, {
    "Content-Type": getContentType(filePath),
    "Cache-Control": isHtml ? "no-cache" : "public, max-age=31536000, immutable",
  });

  if (method === "HEAD") {
    res.end();
    return;
  }

  res.end(body);
};

const serveFrontendApp = async (res, pathname, method) => {
  if (method !== "GET" && method !== "HEAD") {
    return false;
  }

  const frontendDistDir = await resolveFrontendDistDir();

  if (!frontendDistDir) {
    return false;
  }

  const normalizedPath = decodeURIComponent(pathname).replace(/^\/+/, "");
  let targetFilePath = path.join(frontendDistDir, "index.html");

  if (normalizedPath) {
    const candidatePath = path.resolve(frontendDistDir, normalizedPath);

    if (candidatePath.startsWith(frontendDistDir)) {
      try {
        const candidateStats = await stat(candidatePath);

        if (candidateStats.isFile()) {
          targetFilePath = candidatePath;
        }
      } catch {
        // Non-file route falls back to index.html for client-side routing.
      }
    }
  }

  try {
    await sendStaticFile(res, targetFilePath, method);
    return true;
  } catch {
    return false;
  }
};

const clearExpiredAdminLoginAttempts = (now = Date.now()) => {
  for (const [key, attempt] of adminLoginAttempts.entries()) {
    const expiryTime = Math.max(attempt.lockUntil ?? 0, attempt.firstAttemptAt + ADMIN_LOGIN_WINDOW_MS);

    if (expiryTime <= now) {
      adminLoginAttempts.delete(key);
    }
  }
};

const getClientIp = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket?.remoteAddress ?? "unknown";
};

const getUserAgent = (req) => String(req.headers["user-agent"] ?? "").trim();

const getDeviceLabel = (userAgent) => {
  const normalized = String(userAgent ?? "").toLowerCase();

  if (normalized.includes("iphone")) return "iPhone";
  if (normalized.includes("ipad")) return "iPad";
  if (normalized.includes("android") && normalized.includes("mobile")) return "Android phone";
  if (normalized.includes("android")) return "Android tablet";
  if (normalized.includes("mac os") || normalized.includes("macintosh")) return "Mac";
  if (normalized.includes("windows")) return "Windows PC";
  if (normalized.includes("linux")) return "Linux PC";

  return "Web browser";
};

const mapAdminSessionRow = (row, currentSessionId = null) => ({
  id: row.id,
  adminUserId: row.admin_user_id,
  adminEmail: row.admin_email,
  deviceLabel: row.device_label || "Web browser",
  userAgent: row.user_agent || "",
  ipAddress: row.ip_address || "",
  createdAt: row.created_at ?? null,
  lastSeenAt: row.last_seen_at ?? null,
  expiresAt: row.expires_at ?? null,
  revokedAt: row.revoked_at ?? null,
  isCurrent: currentSessionId ? row.id === currentSessionId : false,
});

const getCurrentAdminSessionId = (req) => {
  const payload = verifyAdminToken(req);
  return payload?.jti ? String(payload.jti) : null;
};

const getAdminLoginThrottleKey = (req, email) => `${getClientIp(req)}::${email || "unknown"}`;

const assertAdminLoginAllowed = (key) => {
  const now = Date.now();
  clearExpiredAdminLoginAttempts(now);
  const attempt = adminLoginAttempts.get(key);

  if (attempt?.lockUntil && attempt.lockUntil > now) {
    throw {
      statusCode: 429,
      message: "Too many login attempts. Please wait before trying again.",
    };
  }
};

const recordFailedAdminLogin = (key) => {
  const now = Date.now();
  clearExpiredAdminLoginAttempts(now);
  const existingAttempt = adminLoginAttempts.get(key);

  if (!existingAttempt || now - existingAttempt.firstAttemptAt > ADMIN_LOGIN_WINDOW_MS) {
    adminLoginAttempts.set(key, {
      count: 1,
      firstAttemptAt: now,
      lockUntil: null,
    });
    return;
  }

  const nextCount = existingAttempt.count + 1;
  adminLoginAttempts.set(key, {
    count: nextCount,
    firstAttemptAt: existingAttempt.firstAttemptAt,
    lockUntil: nextCount >= ADMIN_LOGIN_MAX_ATTEMPTS ? now + ADMIN_LOGIN_LOCKOUT_MS : null,
  });
};

const clearAdminLoginAttempts = (key) => {
  adminLoginAttempts.delete(key);
};

const writeCouponEvent = (res, payload) => {
  try {
    res.write(`event: coupon-update\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  } catch {
    couponEventClients.delete(res);
    try {
      res.end();
    } catch {
      // Ignore stream close errors.
    }
  }
};

const broadcastCouponUpdate = (payload = { updatedAt: Date.now() }) => {
  for (const client of couponEventClients) {
    writeCouponEvent(client, payload);
  }
};

const handleCouponEventsStream = (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  couponEventClients.add(res);
  writeCouponEvent(res, { type: "connected", updatedAt: Date.now() });

  const keepAlive = setInterval(() => {
    try {
      res.write(`: keepalive ${Date.now()}\n\n`);
    } catch {
      // Ignore keepalive write failures.
    }
  }, 20000);

  req.on("close", () => {
    clearInterval(keepAlive);
    couponEventClients.delete(res);
    try {
      res.end();
    } catch {
      // Ignore close errors.
    }
  });
};

const getAdminSessionIdleTimeoutSeconds = () => {
  if (!Number.isFinite(ADMIN_SESSION_IDLE_TIMEOUT_MINUTES) || ADMIN_SESSION_IDLE_TIMEOUT_MINUTES <= 0) {
    return 30 * 60;
  }

  return Math.floor(ADMIN_SESSION_IDLE_TIMEOUT_MINUTES * 60);
};

// Generate Order ID in format: SP-YYYYMMDD-XXXX
// Example: SP-20260331-1023
const buildOrderId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const randomSuffix = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `SP-${year}${month}${day}-${randomSuffix}`;
};

const isPlainObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeOrderStatus = (value, fallback = "pending") =>
  ORDER_STATUS_ALIASES[String(value ?? "").trim().toLowerCase()] ?? fallback;

const normalizeCustomerPhone = (value) => String(value ?? "").replace(/\D/g, "").slice(-10);

const isWithinOrderCancelWindow = (createdAt) => {
  const createdAtMs = Date.parse(String(createdAt ?? ""));

  if (!Number.isFinite(createdAtMs)) {
    return false;
  }

  return Date.now() - createdAtMs <= ORDER_CANCEL_WINDOW_MS;
};

const normalizeApiPathname = (pathname) => {
  if (pathname === API_PREFIX) {
    return "/";
  }

  if (pathname.startsWith(`${API_PREFIX}/`)) {
    return pathname.slice(API_PREFIX.length);
  }

  return pathname;
};

const parseOrderStatus = (value) => {
  const status = normalizeOrderStatus(value, "");

  if (!VALID_ORDER_STATUSES.has(status)) {
    throw {
      statusCode: 400,
      message: "Status must be one of: pending, processing, delivered.",
    };
  }

  return status;
};

const normalizeStockPayload = (body) => {
  if (!isPlainObject(body)) {
    throw { statusCode: 400, message: "Request body must be a JSON object." };
  }

  const isAvailable = body.is_available ?? body.isAvailable;

  if (typeof isAvailable !== "boolean") {
    throw { statusCode: 400, message: "is_available must be a boolean value." };
  }

  // Convert boolean to 0/1 for SQLite compatibility
  return { isAvailable: isAvailable ? 1 : 0 };
};

const slugifyProductName = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildProductId = (name) => `product-${Date.now()}-${slugifyProductName(name) || randomUUID().slice(0, 8)}`;

const normalizeProductBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") {
    return value;
  }

  return fallback;
};

const normalizeOptionalProductTag = (value) => {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return null;
  }

  if (normalized.length > 30) {
    throw { statusCode: 400, message: "Product tag must be 30 characters or fewer." };
  }

  return normalized;
};

const normalizeProductPayload = (body, { fallbackId = null } = {}) => {
  if (!isPlainObject(body)) {
    throw { statusCode: 400, message: "Product payload must be a JSON object." };
  }

  const id = String(body.id ?? fallbackId ?? "").trim();
  const name = String(body.name ?? "").trim();
  const category = String(body.category ?? "").trim();
  const subcategory = String(body.subcategory ?? "").trim();
  const pricePerKg = Number(body.price_per_kg ?? body.pricePerKg ?? body.price ?? 0);
  const image = String(body.image ?? body.image_url ?? body.imageUrl ?? "").trim();
  const description = String(body.description ?? "").trim();
  const customTag = normalizeOptionalProductTag(body.customTag ?? body.custom_tag ?? body.tag);
  const isAvailable = normalizeProductBoolean(body.isAvailable ?? body.is_available, true);
  const isBestSeller = normalizeProductBoolean(body.isBestSeller ?? body.is_best_seller, false);
  const isBrahminHeritage = normalizeProductBoolean(
    body.isBrahminHeritage ?? body.is_brahmin_heritage,
    true,
  );
  const isGreenTouch = normalizeProductBoolean(body.isGreenTouch ?? body.is_green_touch, true);

  if (!name) {
    throw { statusCode: 400, message: "Product name is required." };
  }

  if (!VALID_PRODUCT_CATEGORIES.has(category)) {
    throw { statusCode: 400, message: "Category must be one of: pickles, powders, fryums." };
  }

  if (subcategory && !VALID_PRODUCT_SUBCATEGORIES.has(subcategory)) {
    throw { statusCode: 400, message: "Subcategory must be salt or asafoetida." };
  }

  if (!Number.isFinite(pricePerKg) || pricePerKg <= 0) {
    throw { statusCode: 400, message: "Price per kg must be a positive number." };
  }

  if (!image) {
    throw { statusCode: 400, message: "Product image is required." };
  }

  if (!description) {
    throw { statusCode: 400, message: "Product description is required." };
  }

  return {
    id: id || buildProductId(name),
    name,
    category,
    subcategory: subcategory || null,
    pricePerKg: Math.round(pricePerKg),
    image,
    description,
    customTag,
    isAvailable,
    isBestSeller,
    isBrahminHeritage,
    isGreenTouch,
  };
};

const serializeProductRow = (row) => ({
  id: String(row.id ?? ""),
  name: String(row.name ?? ""),
  category: String(row.category ?? "pickles"),
  subcategory: row.subcategory ? String(row.subcategory) : undefined,
  price_per_kg: Number(row.price_per_kg ?? 0),
  image: String(row.image ?? ""),
  description: String(row.description ?? ""),
  customTag: row.custom_tag ? String(row.custom_tag) : null,
  isAvailable: Boolean(row.is_available ?? row.effective_is_available ?? false),
  isBestSeller: Boolean(row.is_best_seller ?? false),
  isBrahminHeritage: Boolean(row.is_brahmin_heritage ?? true),
  isGreenTouch: Boolean(row.is_green_touch ?? true),
  createdAt: row.created_at ?? null,
  updatedAt: row.updated_at ?? null,
  deletedAt: row.deleted_at ?? null,
});

const getProducts = async ({ includeDeleted = false, deletedOnly = false } = {}) => {
  const filters = [];

  if (deletedOnly) {
    filters.push("p.deleted_at is not null");
  } else if (!includeDeleted) {
    filters.push("p.deleted_at is null");
  }

  const whereClause = filters.length > 0 ? `where ${filters.join(" and ")}` : "";

  const result = await pool.query(`
    select
      p.id,
      p.name,
      p.category,
      p.subcategory,
      p.price_per_kg,
      p.image,
      p.description,
      p.custom_tag,
      p.is_best_seller,
      p.is_brahmin_heritage,
      p.is_green_touch,
      p.created_at,
      p.updated_at,
      p.deleted_at,
      coalesce(s.is_available, p.is_available) as is_available
    from products p
    left join stock_status s on s.product_id = p.id
    ${whereClause}
    order by p.deleted_at desc nulls last, p.updated_at desc, p.created_at desc, p.name asc
  `);

  return result.rows.map(serializeProductRow);
};

const getProductById = async (productId) => {
  const result = await pool.query(
    `
      select
        p.id,
        p.name,
        p.category,
        p.subcategory,
        p.price_per_kg,
        p.image,
        p.description,
        p.custom_tag,
        p.is_best_seller,
        p.is_brahmin_heritage,
        p.is_green_touch,
        p.created_at,
        p.updated_at,
        p.deleted_at,
        coalesce(s.is_available, p.is_available) as is_available
      from products p
      left join stock_status s on s.product_id = p.id
      where p.id = $1 and p.deleted_at is null
      limit 1
    `,
    [productId],
  );

  if (result.rowCount === 0) {
    throw { statusCode: 404, message: "Product not found." };
  }

  return serializeProductRow(result.rows[0]);
};

const upsertProduct = async (body, fallbackId = null) => {
  const payload = normalizeProductPayload(body, { fallbackId });

  const result = await pool.query(
    `
      insert into products (
        id,
        name,
        category,
        subcategory,
        price,
        price_per_kg,
        image,
        description,
        custom_tag,
        is_available,
        is_best_seller,
        is_brahmin_heritage,
        is_green_touch,
        deleted_at,
        created_at,
        updated_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      on conflict (id)
      do update set
        name = excluded.name,
        category = excluded.category,
        subcategory = excluded.subcategory,
        price = excluded.price,
        price_per_kg = excluded.price_per_kg,
        image = excluded.image,
        description = excluded.description,
        custom_tag = excluded.custom_tag,
        is_available = excluded.is_available,
        is_best_seller = excluded.is_best_seller,
        is_brahmin_heritage = excluded.is_brahmin_heritage,
        is_green_touch = excluded.is_green_touch,
        deleted_at = null,
        updated_at = CURRENT_TIMESTAMP
      returning *
    `,
    [
      payload.id,
      payload.name,
      payload.category,
      payload.subcategory,
      payload.pricePerKg,
      payload.pricePerKg,
      payload.image,
      payload.description,
      payload.customTag,
      payload.isAvailable,
      payload.isBestSeller,
      payload.isBrahminHeritage,
      payload.isGreenTouch,
    ],
  );

  await pool.query(
    `
      insert into stock_status (product_id, is_available, updated_at)
      values ($1, $2, CURRENT_TIMESTAMP)
      on conflict (product_id)
      do update set
        is_available = excluded.is_available,
        updated_at = CURRENT_TIMESTAMP
    `,
    [payload.id, payload.isAvailable],
  );

  return serializeProductRow(result.rows[0]);
};

const createProduct = async (body) => upsertProduct(body);

const updateProduct = async (productId, body) => {
  const payload = normalizeProductPayload(body, { fallbackId: productId });

  const result = await pool.query(
    `
      update products
      set
        name = $2,
        category = $3,
        subcategory = $4,
        price = $5,
        price_per_kg = $6,
        image = $7,
        description = $8,
        custom_tag = $9,
        is_available = $10,
        is_best_seller = $11,
        is_brahmin_heritage = $12,
        is_green_touch = $13,
        updated_at = CURRENT_TIMESTAMP
      where id = $1
      returning *
    `,
    [
      productId,
      payload.name,
      payload.category,
      payload.subcategory,
      payload.pricePerKg,
      payload.pricePerKg,
      payload.image,
      payload.description,
      payload.customTag,
      payload.isAvailable,
      payload.isBestSeller,
      payload.isBrahminHeritage,
      payload.isGreenTouch,
    ],
  );

  if (result.rowCount === 0) {
    throw { statusCode: 404, message: "Product not found." };
  }

  await pool.query(
    `
      insert into stock_status (product_id, is_available, updated_at)
      values ($1, $2, CURRENT_TIMESTAMP)
      on conflict (product_id)
      do update set
        is_available = excluded.is_available,
        updated_at = CURRENT_TIMESTAMP
    `,
    [productId, payload.isAvailable],
  );

  return serializeProductRow(result.rows[0]);
};

const deleteProduct = async (productId) => {
  const result = await pool.query(
    `
      update products
      set deleted_at = CURRENT_TIMESTAMP,
          is_available = false,
          updated_at = CURRENT_TIMESTAMP
      where id = $1
        and deleted_at is null
      returning *
    `,
    [productId],
  );

  if (result.rowCount === 0) {
    throw { statusCode: 404, message: "Product not found." };
  }

  await pool.query(
    `
      insert into stock_status (product_id, is_available, updated_at)
      values ($1, false, CURRENT_TIMESTAMP)
      on conflict (product_id)
      do update set
        is_available = excluded.is_available,
        updated_at = CURRENT_TIMESTAMP
    `,
    [productId],
  );

  return {
    ...serializeProductRow(result.rows[0]),
    deleted: true,
  };
};

const restoreProduct = async (productId) => {
  const result = await pool.query(
    `
      update products
      set deleted_at = null,
          updated_at = CURRENT_TIMESTAMP
      where id = $1
        and deleted_at is not null
      returning *
    `,
    [productId],
  );

  if (result.rowCount === 0) {
    throw { statusCode: 404, message: "Deleted product not found." };
  }

  return serializeProductRow(result.rows[0]);
};

const importProducts = async (body) => {
  if (!isPlainObject(body) || !Array.isArray(body.products)) {
    throw { statusCode: 400, message: "products must be an array." };
  }

  const client = await pool.connect();

  try {
    await client.begin();

    const imported = [];

    for (const product of body.products) {
      const normalized = normalizeProductPayload(product, { fallbackId: product?.id ?? null });
      const result = await client.query(
        `
          insert into products (
            id,
            name,
            category,
            subcategory,
            price,
            price_per_kg,
            image,
            description,
            custom_tag,
            is_available,
            is_best_seller,
            is_brahmin_heritage,
            is_green_touch,
            deleted_at,
            created_at,
            updated_at
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          on conflict (id)
          do update set
            name = excluded.name,
            category = excluded.category,
            subcategory = excluded.subcategory,
            price = excluded.price,
            price_per_kg = excluded.price_per_kg,
            image = excluded.image,
            description = excluded.description,
            custom_tag = excluded.custom_tag,
            is_available = excluded.is_available,
            is_best_seller = excluded.is_best_seller,
            is_brahmin_heritage = excluded.is_brahmin_heritage,
            is_green_touch = excluded.is_green_touch,
            deleted_at = null,
            updated_at = CURRENT_TIMESTAMP
          returning *
        `,
        [
          normalized.id,
          normalized.name,
          normalized.category,
          normalized.subcategory,
          normalized.pricePerKg,
          normalized.pricePerKg,
          normalized.image,
          normalized.description,
          normalized.customTag,
          normalized.isAvailable,
          normalized.isBestSeller,
          normalized.isBrahminHeritage,
          normalized.isGreenTouch,
        ],
      );

      await client.query(
        `
          insert into stock_status (product_id, is_available, updated_at)
          values ($1, $2, CURRENT_TIMESTAMP)
          on conflict (product_id)
          do update set
            is_available = excluded.is_available,
            updated_at = CURRENT_TIMESTAMP
        `,
        [normalized.id, normalized.isAvailable],
      );

      imported.push(serializeProductRow(result.rows[0]));
    }

    await client.commit();
    return imported;
  } catch (error) {
    await client.rollback();
    throw error;
  } finally {
    client.release();
  }
};

const normalizeCouponCode = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "-");

const parseOptionalCurrency = (value, fieldName) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw { statusCode: 400, message: `${fieldName} must be a valid non-negative amount.` };
  }

  return Number(parsed.toFixed(2));
};

const parseRequiredCurrency = (value, fieldName) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw { statusCode: 400, message: `${fieldName} must be greater than 0.` };
  }

  return Number(parsed.toFixed(2));
};

const parseOptionalTimestamp = (value, fieldName) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    throw { statusCode: 400, message: `${fieldName} must be a valid date.` };
  }

  return date.toISOString();
};

const serializeCouponRow = (row) => ({
  id: String(row.id ?? ""),
  code: String(row.code ?? ""),
  title: String(row.title ?? ""),
  description: String(row.description ?? ""),
  discountType: String(row.discount_type ?? "percentage"),
  discountValue: Number(row.discount_value ?? 0),
  appliesTo: String(row.applies_to ?? "all"),
  targetCategory: row.target_category ? String(row.target_category) : null,
  targetProductId: row.target_product_id ? String(row.target_product_id) : null,
  targetProductName: row.target_product_name ? String(row.target_product_name) : null,
  minOrderAmount: row.min_order_amount === null ? null : Number(row.min_order_amount),
  startsAt: row.starts_at ?? null,
  endsAt: row.ends_at ?? null,
  isActive: Boolean(row.is_active ?? true),
  createdAt: row.created_at ?? null,
  updatedAt: row.updated_at ?? null,
});

const isWithinScheduleWindow = (startsAt, endsAt, now = Date.now()) => {
  const startTime = startsAt ? new Date(startsAt).getTime() : null;
  const endTime = endsAt ? new Date(endsAt).getTime() : null;

  if (startTime !== null && Number.isFinite(startTime) && now < startTime) {
    return false;
  }

  if (endTime !== null && Number.isFinite(endTime) && now > endTime) {
    return false;
  }

  return true;
};

const getCouponById = async (couponId) => {
  const result = await pool.query(
    `
      select
        c.*,
        p.name as target_product_name
      from coupons c
      left join products p on p.id = c.target_product_id
      where c.id = $1
      limit 1
    `,
    [couponId],
  );

  if (result.rowCount === 0) {
    throw { statusCode: 404, message: "Coupon not found." };
  }

  return serializeCouponRow(result.rows[0]);
};

const normalizeCouponPayload = async (body, { fallbackId = null } = {}) => {
  if (!isPlainObject(body)) {
    throw { statusCode: 400, message: "Coupon payload must be a JSON object." };
  }

  const id = String(body.id ?? fallbackId ?? "").trim() || `coupon-${randomUUID().slice(0, 8)}`;
  const code = normalizeCouponCode(body.code);
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const discountType = String(body.discountType ?? body.discount_type ?? "").trim().toLowerCase();
  const discountValue = parseRequiredCurrency(body.discountValue ?? body.discount_value, "Discount value");
  const appliesTo = String(body.appliesTo ?? body.applies_to ?? "all").trim().toLowerCase();
  const targetCategoryRaw = String(body.targetCategory ?? body.target_category ?? "").trim().toLowerCase();
  const targetProductIdRaw = String(body.targetProductId ?? body.target_product_id ?? "").trim();
  const minOrderAmount = parseOptionalCurrency(body.minOrderAmount ?? body.min_order_amount, "Min order amount");
  const startsAt = parseOptionalTimestamp(body.startsAt ?? body.starts_at, "Start date");
  const endsAt = parseOptionalTimestamp(body.endsAt ?? body.ends_at, "End date");
  const isActive = typeof (body.isActive ?? body.is_active) === "boolean" ? Boolean(body.isActive ?? body.is_active) : true;

  if (!code || !/^[A-Z0-9][A-Z0-9-]{2,29}$/.test(code)) {
    throw {
      statusCode: 400,
      message: "Coupon code must be 3-30 characters and contain only letters, numbers, and hyphens.",
    };
  }

  if (!title) {
    throw { statusCode: 400, message: "Coupon title is required." };
  }

  if (!VALID_COUPON_DISCOUNT_TYPES.has(discountType)) {
    throw { statusCode: 400, message: "discountType must be one of: percentage, fixed." };
  }

  if (discountType === "percentage" && discountValue > 100) {
    throw { statusCode: 400, message: "Percentage discount cannot exceed 100." };
  }

  if (discountType === "fixed" && minOrderAmount === null) {
    throw { statusCode: 400, message: "Min order amount is required for fixed discount coupons." };
  }

  if (!VALID_COUPON_SCOPES.has(appliesTo)) {
    throw { statusCode: 400, message: "appliesTo must be one of: all, category, product." };
  }

  const targetCategory = appliesTo === "category" ? targetCategoryRaw : null;
  const targetProductId = appliesTo === "product" ? targetProductIdRaw : null;

  if (appliesTo === "category" && !VALID_COUPON_CATEGORY_SCOPES.has(targetCategory)) {
    throw {
      statusCode: 400,
      message: "targetCategory must be one of: pickles, powders, fryums, salted-pickles, tempered-pickles.",
    };
  }

  if (appliesTo === "product") {
    if (!targetProductId) {
      throw { statusCode: 400, message: "targetProductId is required when appliesTo is product." };
    }

    const productResult = await pool.query(
      "select id from products where id = $1 and deleted_at is null limit 1",
      [targetProductId],
    );

    if (productResult.rowCount === 0) {
      throw { statusCode: 400, message: "Selected targetProductId does not exist in active products." };
    }
  }

  if (startsAt && endsAt && new Date(endsAt).getTime() <= new Date(startsAt).getTime()) {
    throw { statusCode: 400, message: "End date must be after start date." };
  }

  return {
    id,
    code,
    title,
    description,
    discountType,
    discountValue,
    appliesTo,
    targetCategory,
    targetProductId,
    minOrderAmount,
    startsAt,
    endsAt,
    isActive,
  };
};

const getAdminCoupons = async () => {
  const result = await pool.query(
    `
      select
        c.*,
        p.name as target_product_name
      from coupons c
      left join products p on p.id = c.target_product_id
      order by c.is_active desc, c.updated_at desc, c.created_at desc
    `,
  );

  return result.rows.map(serializeCouponRow);
};

const getStorefrontCoupons = async () => {
  const result = await pool.query(
    `
      select
        c.*,
        p.name as target_product_name
      from coupons c
      left join products p on p.id = c.target_product_id
      where
        c.is_active = true
        and (c.starts_at is null or c.starts_at <= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'))
        and (c.ends_at is null or c.ends_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'))
      order by c.updated_at desc, c.created_at desc
    `,
  );

  return result.rows.map(serializeCouponRow);
};

const createCoupon = async (body) => {
  const payload = await normalizeCouponPayload(body);

  await pool.query(
    `
      insert into coupons (
        id,
        code,
        title,
        description,
        discount_type,
        discount_value,
        applies_to,
        target_category,
        target_product_id,
        min_order_amount,
        starts_at,
        ends_at,
        is_active,
        created_at,
        updated_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    [
      payload.id,
      payload.code,
      payload.title,
      payload.description,
      payload.discountType,
      payload.discountValue,
      payload.appliesTo,
      payload.targetCategory,
      payload.targetProductId,
      payload.minOrderAmount,
      payload.startsAt,
      payload.endsAt,
      payload.isActive,
    ],
  );

  const coupon = await getCouponById(payload.id);
  broadcastCouponUpdate({ action: "created", couponId: coupon.id, updatedAt: Date.now() });
  return coupon;
};

const updateCoupon = async (couponId, body) => {
  const existingCoupon = await getCouponById(couponId);
  const mergedPayload = {
    ...existingCoupon,
    ...body,
    targetCategory:
      body?.targetCategory ?? body?.target_category ?? existingCoupon.targetCategory ?? undefined,
    targetProductId:
      body?.targetProductId ?? body?.target_product_id ?? existingCoupon.targetProductId ?? undefined,
  };
  const payload = await normalizeCouponPayload(mergedPayload, { fallbackId: couponId });

  const result = await pool.query(
    `
      update coupons
      set
        code = $2,
        title = $3,
        description = $4,
        discount_type = $5,
        discount_value = $6,
        applies_to = $7,
        target_category = $8,
        target_product_id = $9,
        min_order_amount = $10,
        starts_at = $11,
        ends_at = $12,
        is_active = $13,
        updated_at = CURRENT_TIMESTAMP
      where id = $1
      returning id
    `,
    [
      couponId,
      payload.code,
      payload.title,
      payload.description,
      payload.discountType,
      payload.discountValue,
      payload.appliesTo,
      payload.targetCategory,
      payload.targetProductId,
      payload.minOrderAmount,
      payload.startsAt,
      payload.endsAt,
      payload.isActive,
    ],
  );

  if (result.rowCount === 0) {
    throw { statusCode: 404, message: "Coupon not found." };
  }

  const coupon = await getCouponById(couponId);
  broadcastCouponUpdate({ action: "updated", couponId: coupon.id, updatedAt: Date.now() });
  return coupon;
};

const deleteCoupon = async (couponId) => {
  const result = await pool.query(
    `
      delete from coupons
      where id = $1
      returning id, code
    `,
    [couponId],
  );

  if (result.rowCount === 0) {
    throw { statusCode: 404, message: "Coupon not found." };
  }

  const response = {
    id: String(result.rows[0].id),
    code: String(result.rows[0].code),
    deleted: true,
  };

  broadcastCouponUpdate({ action: "deleted", couponId: response.id, updatedAt: Date.now() });
  return response;
};

const parseOptionalUrl = (value, fieldName, { allowDataUrl = false } = {}) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const urlValue = String(value).trim();

  if (allowDataUrl && /^data:(image|video)\//i.test(urlValue)) {
    return urlValue;
  }

  try {
    const parsed = new URL(urlValue);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("unsupported protocol");
    }
  } catch {
    throw { statusCode: 400, message: `${fieldName} must be a valid http(s) URL.` };
  }

  return urlValue;
};

const serializeAdRow = (row) => ({
  id: String(row.id ?? ""),
  title: String(row.title ?? ""),
  description: String(row.description ?? ""),
  mediaType: String(row.media_type ?? "image"),
  mediaUrl: String(row.media_url ?? ""),
  ctaText: row.cta_text ? String(row.cta_text) : null,
  ctaUrl: row.cta_url ? String(row.cta_url) : null,
  displayOrder: Number(row.display_order ?? 0),
  startsAt: row.starts_at ?? null,
  endsAt: row.ends_at ?? null,
  isActive: Boolean(row.is_active ?? true),
  createdAt: row.created_at ?? null,
  updatedAt: row.updated_at ?? null,
});

const getAdById = async (adId) => {
  const result = await pool.query(
    `
      select *
      from ads
      where id = $1
      limit 1
    `,
    [adId],
  );

  if (result.rowCount === 0) {
    throw { statusCode: 404, message: "Ad not found." };
  }

  return serializeAdRow(result.rows[0]);
};

const normalizeAdPayload = (body, { fallbackId = null } = {}) => {
  if (!isPlainObject(body)) {
    throw { statusCode: 400, message: "Ad payload must be a JSON object." };
  }

  const id = String(body.id ?? fallbackId ?? "").trim() || `ad-${randomUUID().slice(0, 8)}`;
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const mediaType = String(body.mediaType ?? body.media_type ?? "").trim().toLowerCase();
  const mediaUrl = parseOptionalUrl(body.mediaUrl ?? body.media_url, "mediaUrl", {
    allowDataUrl: true,
  });
  const ctaText = String(body.ctaText ?? body.cta_text ?? "").trim() || null;
  const ctaUrl = parseOptionalUrl(body.ctaUrl ?? body.cta_url, "ctaUrl");
  const displayOrder = Math.max(Number.parseInt(String(body.displayOrder ?? body.display_order ?? 0), 10) || 0, 0);
  const startsAt = parseOptionalTimestamp(body.startsAt ?? body.starts_at, "Start date");
  const endsAt = parseOptionalTimestamp(body.endsAt ?? body.ends_at, "End date");
  const isActive = typeof (body.isActive ?? body.is_active) === "boolean" ? Boolean(body.isActive ?? body.is_active) : true;

  if (!title) {
    throw { statusCode: 400, message: "Ad title is required." };
  }

  if (!VALID_AD_MEDIA_TYPES.has(mediaType)) {
    throw { statusCode: 400, message: "mediaType must be one of: image, video." };
  }

  if (!mediaUrl) {
    throw { statusCode: 400, message: "mediaUrl is required." };
  }

  if (startsAt && endsAt && new Date(endsAt).getTime() <= new Date(startsAt).getTime()) {
    throw { statusCode: 400, message: "End date must be after start date." };
  }

  return {
    id,
    title,
    description,
    mediaType,
    mediaUrl,
    ctaText,
    ctaUrl,
    displayOrder,
    startsAt,
    endsAt,
    isActive,
  };
};

const getAdminAds = async () => {
  const result = await pool.query(
    `
      select *
      from ads
      order by is_active desc, updated_at desc, created_at desc
    `,
  );

  return result.rows.map(serializeAdRow);
};

const getStorefrontAds = async () => {
  const result = await pool.query(
    `
      select *
      from ads
      where
        is_active = true
        and (starts_at is null or starts_at <= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'))
        and (ends_at is null or ends_at >= (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'))
      order by display_order asc, updated_at desc, created_at desc
    `,
  );

  return result.rows.map(serializeAdRow);
};

const createAd = async (body) => {
  const payload = normalizeAdPayload(body);

  await pool.query(
    `
      insert into ads (
        id,
        title,
        description,
        media_type,
        media_url,
        cta_text,
        cta_url,
        display_order,
        starts_at,
        ends_at,
        is_active,
        created_at,
        updated_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    [
      payload.id,
      payload.title,
      payload.description,
      payload.mediaType,
      payload.mediaUrl,
      payload.ctaText,
      payload.ctaUrl,
      payload.displayOrder,
      payload.startsAt,
      payload.endsAt,
      payload.isActive,
    ],
  );

  return getAdById(payload.id);
};

const updateAd = async (adId, body) => {
  const existingAd = await getAdById(adId);
  const payload = normalizeAdPayload({ ...existingAd, ...body }, { fallbackId: adId });

  const result = await pool.query(
    `
      update ads
      set
        title = $2,
        description = $3,
        media_type = $4,
        media_url = $5,
        cta_text = $6,
        cta_url = $7,
        display_order = $8,
        starts_at = $9,
        ends_at = $10,
        is_active = $11,
        updated_at = CURRENT_TIMESTAMP
      where id = $1
      returning id
    `,
    [
      adId,
      payload.title,
      payload.description,
      payload.mediaType,
      payload.mediaUrl,
      payload.ctaText,
      payload.ctaUrl,
      payload.displayOrder,
      payload.startsAt,
      payload.endsAt,
      payload.isActive,
    ],
  );

  if (result.rowCount === 0) {
    throw { statusCode: 404, message: "Ad not found." };
  }

  return getAdById(adId);
};

const deleteAd = async (adId) => {
  const result = await pool.query(
    `
      delete from ads
      where id = $1
      returning id, title
    `,
    [adId],
  );

  if (result.rowCount === 0) {
    throw { statusCode: 404, message: "Ad not found." };
  }

  return {
    id: String(result.rows[0].id),
    title: String(result.rows[0].title),
    deleted: true,
  };
};

const getAdminAnalytics = async () => {
  const [ordersResult, itemCountResult, statusResult, revenueResult, topProductsResult, stockResult] = await Promise.all([
    pool.query(`
      select
        id,
        total,
        status,
        created_at,
        customer_name,
        customer_phone,
        payment_status,
        payment_captured_at
      from orders
      order by created_at desc
    `),
    pool.query(`
      select order_id, count(*)::int as item_count
      from order_items
      group by order_id
    `),
    pool.query(`
      select status, count(*)::int as count
      from orders
      group by status
    `),
    pool.query(`
      select date_trunc('day', created_at)::date as day, coalesce(sum(total), 0)::int as revenue, count(*)::int as orders
      from orders
      where created_at >= CURRENT_DATE - INTERVAL '13 days'
      group by day
      order by day asc
    `),
    pool.query(`
      select
        oi.product_id,
        max(oi.product_name) as product_name,
        max(p.category) as category,
        sum(oi.quantity)::int as units_sold,
        sum(oi.total_price)::int as revenue
      from order_items oi
      left join products p on p.id = oi.product_id
      group by oi.product_id
      order by units_sold desc, revenue desc
      limit 6
    `),
    pool.query(`
      select
        count(*) filter (where coalesce(s.is_available, p.is_available) = true)::int as in_stock,
        count(*) filter (where coalesce(s.is_available, p.is_available) = false)::int as out_of_stock
      from products p
      left join stock_status s on s.product_id = p.id
    `),
  ]);

  const totalRevenue = ordersResult.rows.reduce((sum, row) => sum + Number(row.total ?? 0), 0);
  const totalOrders = ordersResult.rows.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const itemCountsByOrder = new Map(
    itemCountResult.rows.map((row) => [String(row.order_id ?? ""), Number(row.item_count ?? 0)]),
  );

  const statusCounts = statusResult.rows.reduce((accumulator, row) => {
    accumulator[normalizeOrderStatus(row.status)] = Number(row.count ?? 0);
    return accumulator;
  }, { pending: 0, processing: 0, delivered: 0, cancelled: 0 });

  const revenueByDay = revenueResult.rows.map((row) => ({
    label: new Date(row.day).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    revenue: Number(row.revenue ?? 0),
    orders: Number(row.orders ?? 0),
  }));

  const topProducts = topProductsResult.rows.map((row) => ({
    productId: String(row.product_id ?? ""),
    name: String(row.product_name ?? row.product_id ?? "Unnamed product"),
    category: String(row.category ?? "pickles"),
    unitsSold: Number(row.units_sold ?? 0),
    revenue: Number(row.revenue ?? 0),
  }));

  return {
    summary: {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      inStock: Number(stockResult.rows[0]?.in_stock ?? 0),
      outOfStock: Number(stockResult.rows[0]?.out_of_stock ?? 0),
      pending: Number(statusCounts.pending ?? 0),
      processing: Number(statusCounts.processing ?? 0),
      delivered: Number(statusCounts.delivered ?? 0),
      cancelled: Number(statusCounts.cancelled ?? 0),
    },
    revenueByDay,
    topProducts,
    recentOrders: ordersResult.rows.slice(0, 8).map((row) => ({
      id: row.id,
      total: Number(row.total ?? 0),
      status: normalizeOrderStatus(row.status),
      createdAt: row.created_at,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      paymentStatus: row.payment_status,
      itemCount: Number(itemCountsByOrder.get(String(row.id ?? "")) ?? 0),
    })),
  };
};

const parseStockNumericId = (productId) => {
  const match = String(productId ?? "")
    .trim()
    .match(/^product-(?:product-)?(\d+)-/);

  return match ? match[1] : null;
};

const isCanonicalStockProductId = (productId) => {
  const rawProductId = String(productId ?? "").trim();
  return /^product-\d+-/.test(rawProductId);
};

const buildCanonicalStockIdMap = (rows) => {
  const canonicalByNumericId = new Map();

  rows.forEach((row) => {
    const rawProductId = String(row.product_id ?? "").trim();

    if (!isCanonicalStockProductId(rawProductId)) {
      return;
    }

    const numericId = parseStockNumericId(rawProductId);

    if (numericId && !canonicalByNumericId.has(numericId)) {
      canonicalByNumericId.set(numericId, rawProductId);
    }
  });

  return canonicalByNumericId;
};

const normalizeStockProductId = (productId, canonicalByNumericId = new Map()) => {
  const rawProductId = String(productId ?? "").trim();

  if (!rawProductId) {
    return rawProductId;
  }

  if (rawProductId.startsWith("product-NaN-")) {
    return null;
  }

  const numericId = parseStockNumericId(rawProductId);
  const canonicalProductId = numericId ? canonicalByNumericId.get(numericId) : null;

  if (canonicalProductId) {
    return canonicalProductId;
  }

  if (rawProductId.startsWith("product-product-")) {
    return rawProductId.slice("product-".length);
  }

  return rawProductId;
};

const normalizeStockRows = (rows) => {
  const canonicalByNumericId = buildCanonicalStockIdMap(rows);
  const normalizedRows = new Map();

  rows.forEach((row, index) => {
    const normalizedProductId = normalizeStockProductId(row.product_id, canonicalByNumericId);

    if (!normalizedProductId) {
      return;
    }

    const timestamp = Date.parse(String(row.updated_at ?? "")) || index;
    const previous = normalizedRows.get(normalizedProductId);

    if (!previous || timestamp >= previous.timestamp) {
      normalizedRows.set(normalizedProductId, {
        timestamp,
        row: {
          ...row,
          product_id: normalizedProductId,
        },
      });
    }
  });

  return Array.from(normalizedRows.values(), ({ row }) => row).sort((left, right) =>
    String(left.product_id).localeCompare(String(right.product_id)),
  );
};

const resolveCanonicalStockProductId = async (productId) => {
  const rawProductId = String(productId ?? "").trim();

  if (!rawProductId) {
    throw { statusCode: 400, message: "product_id is required." };
  }

  if (rawProductId.startsWith("product-NaN-")) {
    throw { statusCode: 400, message: "Invalid product_id." };
  }

  const numericId = parseStockNumericId(rawProductId);

  if (!numericId) {
    return rawProductId;
  }

  const result = await pool.query(
    `
      select product_id, updated_at
      from stock_status
      where product_id like $1
      order by updated_at desc, product_id asc
    `,
    [`product-${numericId}-%`],
  );

  const canonicalByNumericId = buildCanonicalStockIdMap(result.rows);
  return normalizeStockProductId(rawProductId, canonicalByNumericId) ?? rawProductId;
};

const cleanupLegacyStockAliases = async (canonicalProductId) => {
  const numericId = parseStockNumericId(canonicalProductId);

  if (!numericId) {
    return;
  }

  const slug = String(canonicalProductId).replace(/^product-\d+-/, "");

  await pool.query(
    `
      delete from stock_status
      where product_id <> $1
        and (
          product_id like $2
          or product_id = $3
        )
    `,
    [canonicalProductId, `product-product-${numericId}-%`, `product-NaN-${slug}`],
  );
};

const normalizeOrderPayload = (body) => {
  if (!isPlainObject(body)) {
    throw { statusCode: 400, message: "Order payload must be a JSON object." };
  }

  const customerSource = isPlainObject(body.customer) ? body.customer : body;
  const name = String(customerSource.name ?? "").trim();
  const phone = String(customerSource.phone ?? "").trim();
  const address = String(customerSource.address ?? "").trim();
  const city = String(customerSource.city ?? "").trim();
  const state = String(customerSource.state ?? "").trim();
  const country = String(customerSource.country ?? "IN").trim();
  const pincode = String(customerSource.pincode ?? "").trim();
  const shipping = Number(body.shipping ?? 0);
  const couponCode = normalizeCouponCode(body.couponCode ?? body.coupon_code ?? "");
  const paymentMethod = String(body.paymentMethod ?? "upi").trim();
  const items = Array.isArray(body.items) ? body.items : [];

  if (name.length < 2) {
    throw { statusCode: 400, message: "Name must be at least 2 characters." };
  }

  if (!PHONE_PATTERN.test(phone)) {
    throw { statusCode: 400, message: "Phone must be exactly 10 digits." };
  }

  if (address.length < 5) {
    throw { statusCode: 400, message: "Address must be at least 5 characters." };
  }

  if (city.length < 2) {
    throw { statusCode: 400, message: "City must be at least 2 characters." };
  }

  if (state.length < 2) {
    throw { statusCode: 400, message: "State must be at least 2 characters." };
  }

  if (!country) {
    throw { statusCode: 400, message: "Country is required." };
  }

  // Only validate pincode for India orders
  if (country === "IN" || country === "india") {
    if (!PINCODE_PATTERN.test(pincode)) {
      throw { statusCode: 400, message: "Pincode must be exactly 6 digits for India orders." };
    }
  }

  if (!Number.isFinite(shipping) || shipping < 0) {
    throw { statusCode: 400, message: "Shipping must be zero or a positive number." };
  }

  if (!["upi", "cod"].includes(paymentMethod)) {
    throw { statusCode: 400, message: "Payment method must be 'upi' or 'cod'." };
  }

  if (items.length === 0) {
    throw { statusCode: 400, message: "At least one order item is required." };
  }

  const normalizedItems = items.map((item, index) => {
    if (!isPlainObject(item)) {
      throw { statusCode: 400, message: `Item ${index + 1} must be an object.` };
    }

    const productId = String(item.product_id ?? item.productId ?? "").trim();
    const itemName = String(item.name ?? "").trim();
    const weight = String(item.weight ?? "").trim();
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.price ?? item.unit_price ?? item.unitPrice);

    if (!productId) {
      throw { statusCode: 400, message: `Item ${index + 1} is missing product_id.` };
    }

    if (!itemName) {
      throw { statusCode: 400, message: `Item ${index + 1} is missing name.` };
    }

    if (!VALID_WEIGHTS.has(weight)) {
      throw {
        statusCode: 400,
        message: `Item ${index + 1} has an invalid weight. Use 250g, 500g, or 1kg.`,
      };
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw { statusCode: 400, message: `Item ${index + 1} quantity must be a positive integer.` };
    }

    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      throw { statusCode: 400, message: `Item ${index + 1} price must be positive.` };
    }

    return {
      productId,
      name: itemName,
      weight,
      quantity,
      unitPrice: Math.round(unitPrice),
      totalPrice: Math.round(unitPrice) * quantity,
    };
  });

  return {
    customer: { name, phone, address, city, state, country, pincode },
    shipping: Math.round(shipping),
    couponCode: couponCode || null,
    paymentMethod,
    items: normalizedItems,
  };
};

const assertRazorpayConfigured = () => {
  if (!razorpayClient || !ACTIVE_RAZORPAY_KEY_ID || !ACTIVE_RAZORPAY_KEY_SECRET) {
    throw {
      statusCode: 503,
      message:
        "Online payment is not configured. Set Razorpay credentials on the backend (RAZORPAY_MODE + live/test keys, or RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET).",
    };
  }
};

const toRazorpayAmount = (rupees) => {
  const numericRupees = Number(rupees);

  if (!Number.isFinite(numericRupees) || numericRupees <= 0) {
    throw { statusCode: 400, message: "Order total must be greater than zero for online payment." };
  }

  return Math.round(numericRupees * 100);
};

const buildRazorpayReceipt = () => `sp_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

const getEligibleCategoryKey = (category, subcategory) => {
  if (String(category ?? "") !== "pickles") {
    return String(category ?? "");
  }

  if (String(subcategory ?? "") === "salt") {
    return "salted-pickles";
  }

  if (String(subcategory ?? "") === "asafoetida") {
    return "tempered-pickles";
  }

  return "pickles";
};

const resolveCouponDiscount = async (payload, subtotal) => {
  const couponCode = payload.couponCode;

  if (!couponCode) {
    return { couponCode: null, discountAmount: 0 };
  }

  const couponResult = await pool.query(
    `
      select
        c.*,
        p.name as target_product_name
      from coupons c
      left join products p on p.id = c.target_product_id
      where c.code = $1
      limit 1
    `,
    [couponCode],
  );

  if (couponResult.rowCount === 0) {
    throw { statusCode: 400, message: "Coupon code is invalid." };
  }

  const coupon = serializeCouponRow(couponResult.rows[0]);

  if (!coupon.isActive || !isWithinScheduleWindow(coupon.startsAt, coupon.endsAt)) {
    throw { statusCode: 400, message: "Coupon is not active right now." };
  }

  if (coupon.minOrderAmount !== null && subtotal < Number(coupon.minOrderAmount)) {
    throw {
      statusCode: 400,
      message: `Coupon requires a minimum order of ${coupon.minOrderAmount}.`,
    };
  }

  const productIds = [...new Set(payload.items.map((item) => item.productId))];
  const productResult = productIds.length
    ? await pool.query(
        `
          select id, category, subcategory
          from products
          where id = any($1::text[])
        `,
        [productIds],
      )
    : { rows: [] };
  const productMetaById = new Map(
    productResult.rows.map((row) => [String(row.id), { category: row.category, subcategory: row.subcategory }]),
  );

  let eligibleSubtotal = subtotal;

  if (!Number.isFinite(eligibleSubtotal)) {
    throw { statusCode: 400, message: "Unable to apply coupon due to invalid cart totals." };
  }

  if (coupon.appliesTo === "category") {
    eligibleSubtotal = payload.items.reduce((sum, item) => {
      const productMeta = productMetaById.get(item.productId);

      if (!productMeta) {
        return sum;
      }

      const categoryKey = getEligibleCategoryKey(productMeta.category, productMeta.subcategory);

      return categoryKey === coupon.targetCategory ? sum + item.totalPrice : sum;
    }, 0);
  }

  if (coupon.appliesTo === "product") {
    eligibleSubtotal = payload.items.reduce(
      (sum, item) => (item.productId === coupon.targetProductId ? sum + item.totalPrice : sum),
      0,
    );
  }

  if (eligibleSubtotal <= 0) {
    throw { statusCode: 400, message: "Coupon is not applicable to items in this cart." };
  }

  const couponDiscountValue = Number(coupon.discountValue);

  if (!Number.isFinite(couponDiscountValue)) {
    throw { statusCode: 400, message: "Coupon configuration is invalid. Please remove the coupon and retry." };
  }

  let discountAmount =
    coupon.discountType === "percentage"
      ? Math.round((eligibleSubtotal * couponDiscountValue) / 100)
      : Math.round(couponDiscountValue);

  if (coupon.maxDiscountAmount !== null) {
    const maxDiscountAmount = Number(coupon.maxDiscountAmount);

    if (!Number.isFinite(maxDiscountAmount)) {
      throw { statusCode: 400, message: "Coupon configuration is invalid. Please remove the coupon and retry." };
    }

    discountAmount = Math.min(discountAmount, Math.round(maxDiscountAmount));
  }

  discountAmount = Math.max(0, Math.min(discountAmount, eligibleSubtotal));

  if (!Number.isFinite(discountAmount)) {
    throw { statusCode: 400, message: "Unable to apply coupon due to invalid discount value." };
  }

  return {
    couponCode: coupon.code,
    discountAmount,
  };
};

const buildOrderTotals = async (payload) => {
  const subtotal = payload.items.reduce((sum, item) => sum + item.totalPrice, 0);

  if (!Number.isFinite(subtotal)) {
    throw { statusCode: 400, message: "Order subtotal is invalid." };
  }

  const { couponCode, discountAmount } = await resolveCouponDiscount(payload, subtotal);

  if (!Number.isFinite(discountAmount)) {
    throw { statusCode: 400, message: "Order discount is invalid." };
  }

  const total = Math.max(0, subtotal + payload.shipping - discountAmount);

  if (!Number.isFinite(total)) {
    throw { statusCode: 400, message: "Order total is invalid." };
  }

  if (total <= 0) {
    throw { statusCode: 400, message: "Order total must be greater than zero after discount." };
  }

  return { subtotal, discountAmount, couponCode, total };
};

const createRazorpayPaymentOrder = async (body) => {
  assertRazorpayConfigured();

  const payload = normalizeOrderPayload({
    ...body,
    paymentMethod: "upi",
  });

  const { total } = await buildOrderTotals(payload);
  const amount = toRazorpayAmount(total);

  const razorpayOrder = await razorpayClient.orders.create({
    amount,
    currency: RAZORPAY_CURRENCY,
    receipt: buildRazorpayReceipt(),
    notes: {
      customer_name: payload.customer.name,
      customer_phone: payload.customer.phone,
    },
  });

  return {
    keyId: ACTIVE_RAZORPAY_KEY_ID,
    currency: razorpayOrder.currency,
    amount: razorpayOrder.amount,
    orderId: razorpayOrder.id,
  };
};

const serializeOrderRows = (rows) => {
  const orders = new Map();
  console.log("[serializeOrderRows] Processing", rows.length, "rows");

  for (const row of rows) {
    if (!orders.has(row.id)) {
      orders.set(row.id, {
        id: row.id,
        customer: {
          name: row.customer_name,
          phone: row.customer_phone,
          address: row.customer_address,
          city: row.customer_city,
          state: row.customer_state,
          country: row.customer_country,
          pincode: row.customer_pincode,
        },
        items: [],
        subtotal: Number(row.subtotal),
        shipping: Number(row.shipping),
        discountAmount: Number(row.discount_amount ?? 0),
        couponCode: row.coupon_code ? String(row.coupon_code) : null,
        total: Number(row.total),
        paymentMethod: row.payment_method,
        paymentStatus: row.payment_status,
        paymentId: row.razorpay_payment_id,
        paymentTime: row.payment_captured_at ?? row.created_at,
        cancelledAt: row.cancelled_at ?? null,
        cancellationReason: row.cancellation_reason ?? null,
        refundId: row.refund_id ?? null,
        refundStatus: row.refund_status ?? null,
        refundAmount: Number(row.refund_amount ?? 0),
        refundedAt: row.refunded_at ?? null,
        cancelEligibleUntil: Number.isFinite(Date.parse(String(row.created_at ?? "")))
          ? new Date(Date.parse(String(row.created_at ?? "")) + ORDER_CANCEL_WINDOW_MS).toISOString()
          : null,
        status: normalizeOrderStatus(row.status),
        createdAt: row.created_at,
      });
    }

    if (row.item_id) {
      console.log("[serializeOrderRows] Adding item:", row.product_name, "to order", row.id);
      orders.get(row.id).items.push({
        id: row.item_id,
        productId: row.product_id,
        name: row.product_name,
        weight: row.weight,
        quantity: Number(row.quantity),
        unitPrice: Number(row.unit_price),
        totalPrice: Number(row.total_price),
      });
    } else {
      console.log("[serializeOrderRows] No item_id for row, id:", row.id, "item_id:", row.item_id);
    }
  }

  const result = [...orders.values()];
  console.log("[serializeOrderRows] Final result:", result.map(o => ({id: o.id, itemCount: o.items.length})));
  return result;
};

const getStock = async () => {
  const result = await pool.query(`
    select product_id, is_available, updated_at
    from stock_status
    order by updated_at desc, product_id asc
  `);

  return normalizeStockRows(result.rows);
};

const updateStock = async (productId, body) => {
  const payload = normalizeStockPayload(body);
  const canonicalProductId = await resolveCanonicalStockProductId(productId);
  const result = await pool.query(
    `
      insert into stock_status (product_id, is_available, updated_at)
      values ($1, $2, CURRENT_TIMESTAMP)
      on conflict (product_id)
      do update set
        is_available = excluded.is_available,
        updated_at = CURRENT_TIMESTAMP
      returning product_id, is_available, updated_at
    `,
    [canonicalProductId, payload.isAvailable],
  );

  await cleanupLegacyStockAliases(canonicalProductId);
  return result.rows[0];
};

const createOrderFromPayload = async (payload, paymentDetails = null) => {
  const { subtotal, discountAmount, couponCode, total } = await buildOrderTotals(payload);
  const orderId = buildOrderId();
  const client = await pool.connect();

  try {
    await client.query("begin");

    await client.query(
      `
        insert into orders (
          id,
          customer_name,
          customer_phone,
          customer_address,
          customer_city,
          customer_state,
          customer_country,
          customer_pincode,
          shipping,
          subtotal,
          discount_amount,
          coupon_code,
          total,
          payment_method,
          razorpay_order_id,
          razorpay_payment_id,
          payment_status,
          payment_captured_at,
          status
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'pending')
      `,
      [
        orderId,
        payload.customer.name,
        payload.customer.phone,
        payload.customer.address,
        payload.customer.city,
        payload.customer.state,
        payload.customer.country,
        payload.customer.pincode,
        payload.shipping,
        subtotal,
        discountAmount,
        couponCode,
        total,
        payload.paymentMethod,
        paymentDetails?.razorpayOrderId ?? null,
        paymentDetails?.razorpayPaymentId ?? null,
        paymentDetails?.paymentStatus ?? "pending",
        paymentDetails?.paymentCapturedAt ?? null,
      ],
    );

    for (const item of payload.items) {
      const itemId = randomUUID();
      await client.query(
        `
          insert into order_items (
            id,
            order_id,
            product_id,
            product_name,
            weight,
            quantity,
            unit_price,
            total_price
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          itemId,
          orderId,
          item.productId,
          item.name,
          item.weight,
          item.quantity,
          item.unitPrice,
          item.totalPrice,
        ],
      );
    }

    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }

  return {
    id: orderId,
    customer: payload.customer,
    items: payload.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      weight: item.weight,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    })),
    subtotal,
    shipping: payload.shipping,
    discountAmount,
    couponCode,
    total,
    paymentMethod: payload.paymentMethod,
    razorpayOrderId: paymentDetails?.razorpayOrderId ?? null,
    razorpayPaymentId: paymentDetails?.razorpayPaymentId ?? null,
    paymentStatus: paymentDetails?.paymentStatus ?? "pending",
    paymentTime: paymentDetails?.paymentCapturedAt ?? new Date().toISOString(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
};

const createOrder = async (body, paymentDetails = null) => {
  const payload = normalizeOrderPayload(body);
  return createOrderFromPayload(payload, paymentDetails);
};

const createManualOrder = async (body) => {
  if (!isPlainObject(body)) {
    throw { statusCode: 400, message: "Request body must be a JSON object." };
  }

  const manualPaymentId = String(body.payment_id ?? body.paymentId ?? body.razorpay_payment_id ?? "").trim();

  if (manualPaymentId.length > 120) {
    throw { statusCode: 400, message: "Payment ID must be 120 characters or fewer." };
  }

  if (manualPaymentId) {
    const existingOrderResult = await pool.query(
      `
        select id
        from orders
        where razorpay_payment_id = $1
        limit 1
      `,
      [manualPaymentId],
    );

    if (existingOrderResult.rowCount > 0) {
      throw {
        statusCode: 409,
        message: "An order with this payment ID already exists.",
        details: { orderId: existingOrderResult.rows[0].id },
      };
    }
  }

  const paymentStatusInput = String(body.payment_status ?? body.paymentStatus ?? "captured")
    .trim()
    .toLowerCase();
  const paymentStatus = paymentStatusInput || "captured";

  if (!["captured", "authorized", "pending", "failed"].includes(paymentStatus)) {
    throw {
      statusCode: 400,
      message: "payment_status must be one of: captured, authorized, pending, failed.",
    };
  }

  const payload = normalizeOrderPayload({
    ...body,
    paymentMethod: "upi",
  });

  return createOrderFromPayload(payload, {
    razorpayOrderId: null,
    razorpayPaymentId: manualPaymentId || null,
    paymentStatus,
    paymentCapturedAt: new Date().toISOString(),
  });
};

const verifyRazorpayPaymentAndCreateOrder = async (body) => {
  assertRazorpayConfigured();

  if (!isPlainObject(body)) {
    throw { statusCode: 400, message: "Request body must be a JSON object." };
  }

  const razorpayOrderId = String(body.razorpay_order_id ?? "").trim();
  const razorpayPaymentId = String(body.razorpay_payment_id ?? "").trim();
  const razorpaySignature = String(body.razorpay_signature ?? "").trim();
  const checkoutPayload = body.checkoutPayload;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw {
      statusCode: 400,
      message: "razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.",
    };
  }

  const payload = normalizeOrderPayload({
    ...checkoutPayload,
    paymentMethod: "upi",
  });
  const { total } = await buildOrderTotals(payload);
  const expectedAmount = toRazorpayAmount(total);

  const expectedSignature = createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw { statusCode: 400, message: "Payment signature verification failed." };
  }

  const payment = await razorpayClient.payments.fetch(razorpayPaymentId);

  if (String(payment.order_id ?? "") !== razorpayOrderId) {
    throw { statusCode: 400, message: "Payment does not belong to the provided Razorpay order." };
  }

  if (Number(payment.amount) !== expectedAmount) {
    throw { statusCode: 400, message: "Payment amount mismatch." };
  }

  if (!["captured", "authorized"].includes(String(payment.status ?? ""))) {
    throw { statusCode: 400, message: "Payment is not successful yet." };
  }

  const existingOrderResult = await pool.query(
    `
      select id
      from orders
      where razorpay_payment_id = $1
      limit 1
    `,
    [razorpayPaymentId],
  );

  if (existingOrderResult.rowCount > 0) {
    const existingOrder = await getOrderById(existingOrderResult.rows[0].id);
    return {
      order: existingOrder,
      payment: {
        provider: "razorpay",
        razorpayOrderId,
        razorpayPaymentId,
        status: String(payment.status ?? "pending"),
      },
    };
  }

  const order = await createOrderFromPayload(payload, {
    razorpayOrderId,
    razorpayPaymentId,
    paymentStatus: String(payment.status ?? "pending"),
    paymentCapturedAt: payment.created_at
      ? new Date(Number(payment.created_at) * 1000).toISOString()
      : new Date().toISOString(),
  });

  return {
    order,
    payment: {
      provider: "razorpay",
      razorpayOrderId,
      razorpayPaymentId,
      status: String(payment.status ?? "pending"),
    },
  };
};

const getOrders = async () => {
  const result = await pool.query(`
    select
      o.id,
      o.customer_name,
      o.customer_phone,
      o.customer_address,
      o.customer_city,
      o.customer_state,
      o.customer_country,
      o.customer_pincode,
      o.shipping,
      o.subtotal,
      o.discount_amount,
      o.coupon_code,
      o.total,
      o.payment_method,
      o.razorpay_payment_id,
      o.payment_status,
      o.payment_captured_at,
      o.status,
      o.created_at,
      oi.id as item_id,
      oi.product_id,
      oi.product_name,
      oi.weight,
      oi.quantity,
      oi.unit_price,
      oi.total_price
    from orders o
    left join order_items oi on oi.order_id = o.id
    order by o.created_at desc, oi.id asc
  `);

  return serializeOrderRows(result.rows);
};

const getOrderById = async (orderId) => {
  const result = await pool.query(
    `
      select
        o.id,
        o.customer_name,
        o.customer_phone,
        o.customer_address,
        o.customer_city,
        o.customer_state,
        o.customer_country,
        o.customer_pincode,
        o.shipping,
        o.subtotal,
        o.discount_amount,
        o.coupon_code,
        o.total,
        o.payment_method,
        o.razorpay_payment_id,
        o.payment_status,
        o.payment_captured_at,
        o.status,
        o.created_at,
        oi.id as item_id,
        oi.product_id,
        oi.product_name,
        oi.weight,
        oi.quantity,
        oi.unit_price,
        oi.total_price
      from orders o
      left join order_items oi on oi.order_id = o.id
      where o.id = $1
      order by oi.id asc
    `,
    [orderId],
  );

  if (result.rowCount === 0) {
    throw { statusCode: 404, message: "Order not found." };
  }

  return serializeOrderRows(result.rows)[0];
};

const updateOrderStatus = async (orderId, body) => {
  if (!isPlainObject(body)) {
    throw { statusCode: 400, message: "Request body must be a JSON object." };
  }

  const status = parseOrderStatus(body.status);
  const result = await pool.query(
    `
      update orders
      set
        status = $2,
        cancelled_at = case when $2 = 'cancelled' then coalesce(cancelled_at, CURRENT_TIMESTAMP) else cancelled_at end
      where id = $1
      returning id
    `,
    [orderId, status],
  );

  if (result.rowCount === 0) {
    throw { statusCode: 404, message: "Order not found." };
  }

  return getOrderById(orderId);
};

const cancelOrderByCustomer = async (orderId, body) => {
  if (!isPlainObject(body)) {
    throw { statusCode: 400, message: "Request body must be a JSON object." };
  }

  const customerPhone = normalizeCustomerPhone(body.phone ?? body.customerPhone ?? body.mobile);
  const cancellationReason = String(body.reason ?? body.cancellationReason ?? "").trim().slice(0, 500) || null;

  if (customerPhone.length !== 10) {
    throw { statusCode: 400, message: "A valid 10-digit phone number is required." };
  }

  const result = await pool.query(
    `
      select id, customer_phone, status, created_at
      from orders
      where id = $1
      limit 1
    `,
    [orderId],
  );

  if (result.rowCount === 0) {
    throw { statusCode: 404, message: "Order not found." };
  }

  const order = result.rows[0];

  if (normalizeCustomerPhone(order.customer_phone) !== customerPhone) {
    throw { statusCode: 403, message: "Phone number does not match this order." };
  }

  if (normalizeOrderStatus(order.status) === "cancelled") {
    return getOrderById(orderId);
  }

  if (!isWithinOrderCancelWindow(order.created_at)) {
    throw { statusCode: 403, message: "Cancellation is only available within 6 hours of purchase." };
  }

  await pool.query(
    `
      update orders
      set
        status = 'cancelled',
        cancelled_at = coalesce(cancelled_at, CURRENT_TIMESTAMP),
        cancellation_reason = coalesce($2, cancellation_reason),
        payment_status = case
          when payment_status in ('captured', 'authorized', 'refunded') then payment_status
          else 'cancelled'
        end
      where id = $1
    `,
    [orderId, cancellationReason],
  );

  return getOrderById(orderId);
};

const refundCancelledOrder = async (orderId) => {
  assertRazorpayConfigured();

  const order = await getOrderById(orderId);

  if (normalizeOrderStatus(order.status) !== "cancelled") {
    throw { statusCode: 400, message: "Only cancelled orders can be refunded." };
  }

  if (!order.paymentId) {
    throw { statusCode: 400, message: "This order does not have a Razorpay payment to refund." };
  }

  const paymentStatus = String(order.paymentStatus ?? "").toLowerCase();

  if (!["captured", "authorized", "refunded"].includes(paymentStatus)) {
    throw { statusCode: 400, message: "Only captured or authorized Razorpay payments can be refunded." };
  }

  if (["refunded", "refund_initiated"].includes(String(order.refundStatus ?? "").toLowerCase()) || String(order.paymentStatus ?? "").toLowerCase() === "refunded") {
    return order;
  }

  const refundAmount = Math.max(Number(order.total ?? 0), 0) * 100;
  const refund = await razorpayClient.payments.refund(order.paymentId, {
    amount: refundAmount,
    notes: {
      order_id: order.id,
      customer_phone: order.customer?.phone ?? "",
    },
  });

  await pool.query(
    `
      update orders
      set
        refund_id = $2,
        refund_status = $3,
        refund_amount = $4,
        refunded_at = CURRENT_TIMESTAMP,
        payment_status = 'refunded'
      where id = $1
    `,
    [orderId, String(refund.id ?? ""), String(refund.status ?? "initiated"), Math.round(refundAmount / 100)],
  );

  return getOrderById(orderId);
};

const deleteOrder = async (orderId) => {
  const result = await pool.query(
    `
      delete from orders
      where id = $1
      returning id
    `,
    [orderId],
  );

  if (result.rowCount === 0) {
    throw { statusCode: 404, message: "Order not found." };
  }

  return {
    id: result.rows[0].id,
    deleted: true,
  };
};

const loginAdmin = async (body, req) => {
  if (!isPlainObject(body)) {
    throw { statusCode: 400, message: "Request body must be a JSON object." };
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    throw { statusCode: 400, message: "Email and password are required." };
  }

  const throttleKey = getAdminLoginThrottleKey(req, email);
  assertAdminLoginAllowed(throttleKey);

  const result = await pool.query(
    "select id, email, password_hash from admin_users where email = $1 limit 1",
    [email],
  );

  const adminUser = result.rows[0] ?? null;
  const passwordHash = adminUser?.password_hash ?? DUMMY_ADMIN_PASSWORD_HASH;
  const isPasswordValid = verifyPassword(password, passwordHash);

  if (!adminUser || !isPasswordValid) {
    recordFailedAdminLogin(throttleKey);
    throw { statusCode: 401, message: "Invalid email or password." };
  }

  clearAdminLoginAttempts(throttleKey);

  const sessionId = randomUUID();
  const userAgent = getUserAgent(req);
  const ipAddress = getClientIp(req);
  const deviceLabel = getDeviceLabel(userAgent);
  const token = signAdminToken(adminUser, sessionId);

  await pool.query(
    `
      insert into admin_sessions (
        id,
        admin_user_id,
        admin_email,
        device_label,
        user_agent,
        ip_address,
        created_at,
        last_seen_at,
        expires_at
      ) values (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP + ($7::bigint * interval '1 second')
      )
      on conflict (id) do update set
        admin_user_id = excluded.admin_user_id,
        admin_email = excluded.admin_email,
        device_label = excluded.device_label,
        user_agent = excluded.user_agent,
        ip_address = excluded.ip_address,
        last_seen_at = CURRENT_TIMESTAMP,
        expires_at = CURRENT_TIMESTAMP + ($7::bigint * interval '1 second'),
        revoked_at = null
    `,
    [
      sessionId,
      adminUser.id,
      adminUser.email,
      deviceLabel,
      userAgent,
      ipAddress,
      getAdminSessionIdleTimeoutSeconds(),
    ],
  );

  return {
    token,
    admin: {
      id: adminUser.id,
      email: adminUser.email,
    },
  };
};

const getAdminSession = (req) => {
  const payload = verifyAdminToken(req);

  if (!payload) {
    return null;
  }

  const sessionId = String(payload.jti ?? `legacy:${payload.sub ?? "unknown"}:${payload.email ?? "unknown"}`).trim();

  if (!sessionId) {
    return null;
  }

  return {
    id: String(payload.sub ?? ""),
    email: String(payload.email ?? ""),
    sessionId,
  };
};

const requireActiveAdminSession = async (req, res) => {
  const admin = getAdminSession(req);

  if (!admin) {
    sendError(res, 401, "Admin session required.");
    return null;
  }

  const currentSession = await ensureAdminSessionRow(req, admin, admin.sessionId);

  if (!currentSession) {
    clearAdminSessionCookie(res);
    sendError(res, 401, "Admin session expired. Please login again.");
    return null;
  }

  await touchAdminSession(admin.sessionId);
  return admin;
};

const ensureAdminSessionRow = async (req, admin, sessionId) => {
  if (!sessionId) {
    return;
  }

  const currentSession = await loadCurrentAdminSession(sessionId);

  if (currentSession) {
    return currentSession;
  }

  if (!sessionId.startsWith("legacy:")) {
    return null;
  }

  const userAgent = getUserAgent(req);
  const ipAddress = getClientIp(req);
  const deviceLabel = getDeviceLabel(userAgent);

  await pool.query(
    `
      insert into admin_sessions (
        id,
        admin_user_id,
        admin_email,
        device_label,
        user_agent,
        ip_address,
        created_at,
        last_seen_at,
        expires_at
      ) values (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP + ($7::bigint * interval '1 second')
      )
      on conflict (id) do nothing
    `,
    [
      sessionId,
      admin.id,
      admin.email,
      deviceLabel,
      userAgent,
      ipAddress,
      getAdminSessionIdleTimeoutSeconds(),
    ],
  );

  return loadCurrentAdminSession(sessionId);
};

const touchAdminSession = async (sessionId) => {
  if (!sessionId) {
    return;
  }

  await pool.query(
    `
      update admin_sessions
      set
        last_seen_at = CURRENT_TIMESTAMP,
        expires_at = CURRENT_TIMESTAMP + ($2::bigint * interval '1 second')
      where id = $1 and revoked_at is null
    `,
    [sessionId, getAdminSessionIdleTimeoutSeconds()],
  );
};

const revokeAdminSession = async (sessionId) => {
  if (!sessionId) {
    return;
  }

  await pool.query(
    `
      update admin_sessions
      set revoked_at = CURRENT_TIMESTAMP
      where id = $1 and revoked_at is null
    `,
    [sessionId],
  );
};

const loadCurrentAdminSession = async (sessionId) => {
  if (!sessionId) {
    return null;
  }

  const result = await pool.query(
    `
      select
        id,
        admin_user_id,
        admin_email,
        device_label,
        user_agent,
        ip_address,
        created_at,
        last_seen_at,
        expires_at,
        revoked_at
      from admin_sessions
      where
        id = $1
        and revoked_at is null
        and expires_at > CURRENT_TIMESTAMP
        and COALESCE(last_seen_at, created_at) >= CURRENT_TIMESTAMP - ($2::bigint * interval '1 second')
      limit 1
    `,
    [sessionId, getAdminSessionIdleTimeoutSeconds()],
  );

  const row = result.rows[0] ?? null;
  return row ? mapAdminSessionRow(row, sessionId) : null;
};

const listAdminSessions = async (adminUserId, currentSessionId = null) => {
  const result = await pool.query(
    `
      select
        id,
        admin_user_id,
        admin_email,
        device_label,
        user_agent,
        ip_address,
        created_at,
        last_seen_at,
        expires_at,
        revoked_at
      from admin_sessions
      where
        admin_user_id = $1
        and revoked_at is null
        and expires_at > CURRENT_TIMESTAMP
        and COALESCE(last_seen_at, created_at) >= CURRENT_TIMESTAMP - ($2::bigint * interval '1 second')
      order by last_seen_at desc, created_at desc
    `,
    [adminUserId, getAdminSessionIdleTimeoutSeconds()],
  );

  return result.rows.map((row) => mapAdminSessionRow(row, currentSessionId));
};

const handleError = (res, error, requestId) => {
  const errorId = randomUUID();
  const isProduction = NODE_ENV === "production";
  
  if (error?.statusCode) {
    log("warn", "API error", {
      requestId,
      errorId,
      statusCode: error.statusCode,
      message: error.message,
    });
    sendError(res, error.statusCode, error.message, { ...error.details, errorId });
    return;
  }

  if (error?.code === "23505") {
    log("warn", "Database constraint violation", { requestId, errorId });
    sendError(res, 409, "A record with the same value already exists.", { errorId });
    return;
  }

  log("error", "Unexpected error", {
    requestId,
    errorId,
    error: error?.message || String(error),
    stack: error?.stack,
  });

  if (isProduction) {
    sendError(res, 500, "Internal server error.", { errorId });
    return;
  }

  sendError(
    res,
    500,
    error?.message || "Internal server error.",
    {
      errorId,
      errorCode: error?.code || null,
      errorName: error?.name || null,
    },
  );
};

const server = http.createServer(async (req, res) => {
  const requestId = getRequestId(req);
  const startTime = Date.now();
  
  if (handleCors(req, res)) {
    return;
  }

  try {
    const method = req.method || "GET";
    const url = getRequestUrl(req);
    const { pathname } = url;

    if (!isApiRequestPath(pathname)) {
      const served = await serveFrontendApp(res, pathname, method);

      if (served) {
        return;
      }

      sendError(res, 404, "Frontend app is not available.");
      return;
    }

    const routePathname = normalizeApiPathname(pathname);

    log("info", "API request", {
      requestId,
      method,
      path: routePathname,
      ip: getClientIp(req),
    });

    if (method === "GET" && routePathname === "/") {
      sendSuccess(res, 200, {
        name: "SP Traditional Pickles API",
        version: "1.0.0",
        ok: true,
        apiBase: API_PREFIX,
        documentation: `${API_PREFIX}/docs`,
        endpoints: {
          health: `GET ${API_PREFIX}/health`,
          docs: `GET ${API_PREFIX}/docs`,
          products: `GET ${API_PREFIX}/products`,
          createProduct: `POST ${API_PREFIX}/products`,
          updateProduct: `PATCH ${API_PREFIX}/products/:product_id`,
          deleteProduct: `DELETE ${API_PREFIX}/products/:product_id`,
          importProducts: `POST ${API_PREFIX}/admin/products/import`,
          adminAnalytics: `GET ${API_PREFIX}/admin/analytics`,
          adminCoupons: `GET ${API_PREFIX}/admin/coupons`,
          createCoupon: `POST ${API_PREFIX}/admin/coupons`,
          updateCoupon: `PATCH ${API_PREFIX}/admin/coupons/:coupon_id`,
          deleteCoupon: `DELETE ${API_PREFIX}/admin/coupons/:coupon_id`,
          adminAds: `GET ${API_PREFIX}/admin/ads`,
          createAd: `POST ${API_PREFIX}/admin/ads`,
          updateAd: `PATCH ${API_PREFIX}/admin/ads/:ad_id`,
          deleteAd: `DELETE ${API_PREFIX}/admin/ads/:ad_id`,
          stock: `GET ${API_PREFIX}/stock`,
          updateStock: `PUT ${API_PREFIX}/stock/:product_id`,
          createOrder: `POST ${API_PREFIX}/orders`,
          createRazorpayOrder: `POST ${API_PREFIX}/payments/razorpay/order`,
          verifyRazorpayPayment: `POST ${API_PREFIX}/payments/razorpay/verify`,
          getOrders: `GET ${API_PREFIX}/orders?limit=20&offset=0`,
          getOrder: `GET ${API_PREFIX}/orders/:order_id`,
          updateOrderStatus: `PATCH ${API_PREFIX}/orders/:order_id/status`,
          deleteOrder: `DELETE ${API_PREFIX}/orders/:order_id`,
          adminLogin: `POST ${API_PREFIX}/admin/login`,
        },
      });
      return;
    }

    if (method === "GET" && routePathname === "/health") {
      sendSuccess(res, 200, { ok: true, timestamp: new Date().toISOString() });
      return;
    }

    if (method === "GET" && routePathname === "/docs") {
      sendSuccess(res, 200, {
        title: "SP Traditional Pickles API Documentation",
        version: "1.0.0",
        baseUrl: API_PREFIX,
        endpoints: {
          products: {
            get: {
              path: "/products",
              method: "GET",
              description: "List products",
            },
            post: {
              path: "/products",
              method: "POST",
              description: "Create a product (requires admin auth)",
              auth: "Bearer token",
            },
            patch: {
              path: "/products/:product_id",
              method: "PATCH",
              description: "Update a product (requires admin auth)",
              auth: "Bearer token",
            },
            delete: {
              path: "/products/:product_id",
              method: "DELETE",
              description: "Delete a product (requires admin auth)",
              auth: "Bearer token",
            },
            import: {
              path: "/admin/products/import",
              method: "POST",
              description: "Import legacy catalog rows into the database (requires admin auth)",
              auth: "Bearer token",
            },
          },
          analytics: {
            dashboard: {
              path: "/admin/analytics",
              method: "GET",
              description: "Analytics summary for the premium admin dashboard (requires admin auth)",
              auth: "Bearer token",
            },
          },
          coupons: {
            list: {
              path: "/admin/coupons",
              method: "GET",
              description: "List all coupons with scope metadata (requires admin auth)",
              auth: "Bearer token",
            },
            create: {
              path: "/admin/coupons",
              method: "POST",
              description: "Create a new coupon (requires admin auth)",
              auth: "Bearer token",
            },
            update: {
              path: "/admin/coupons/:coupon_id",
              method: "PATCH",
              description: "Update an existing coupon (requires admin auth)",
              auth: "Bearer token",
            },
            delete: {
              path: "/admin/coupons/:coupon_id",
              method: "DELETE",
              description: "Delete a coupon permanently (requires admin auth)",
              auth: "Bearer token",
            },
          },
          ads: {
            list: {
              path: "/admin/ads",
              method: "GET",
              description: "List all ads with media details (requires admin auth)",
              auth: "Bearer token",
            },
            create: {
              path: "/admin/ads",
              method: "POST",
              description: "Create a new ad with image/video media (requires admin auth)",
              auth: "Bearer token",
            },
            update: {
              path: "/admin/ads/:ad_id",
              method: "PATCH",
              description: "Update an existing ad (requires admin auth)",
              auth: "Bearer token",
            },
            delete: {
              path: "/admin/ads/:ad_id",
              method: "DELETE",
              description: "Delete an ad permanently (requires admin auth)",
              auth: "Bearer token",
            },
          },
          stock: {
            get: {
              path: "/stock",
              method: "GET",
              description: "Get all product stock status",
              response: "Array of {product_id, is_available, updated_at}",
            },
            put: {
              path: "/stock/:product_id",
              method: "PUT",
              description: "Update product stock status (requires admin auth)",
              auth: "Bearer token",
              body: { is_available: "boolean" },
            },
          },
          orders: {
            post: {
              path: "/orders",
              method: "POST",
              description: "Create new order",
              body: "See schema in response",
            },
            get: {
              path: "/orders",
              method: "GET",
              description: "List all orders (requires admin auth)",
              auth: "Bearer token",
              query: { limit: "number (default: 20)", offset: "number (default: 0)" },
            },
            getById: {
              path: "/orders/:order_id",
              method: "GET",
              description: "Get specific order (requires admin auth)",
              auth: "Bearer token",
            },
            delete: {
              path: "/orders/:order_id",
              method: "DELETE",
              description: "Delete specific order completely (requires admin auth)",
              auth: "Bearer token",
            },
            updateStatus: {
              path: "/orders/:order_id/status",
              method: "PATCH",
              description: "Update order status (requires admin auth)",
              auth: "Bearer token",
              body: { status: "pending|processing|delivered" },
            },
          },
          payments: {
            createRazorpayOrder: {
              path: "/payments/razorpay/order",
              method: "POST",
              description: "Create a Razorpay order for online payment",
            },
            verifyRazorpayPayment: {
              path: "/payments/razorpay/verify",
              method: "POST",
              description: "Verify Razorpay payment signature and create final order",
            },
          },
          auth: {
            login: {
              path: "/admin/login",
              method: "POST",
              description: "Admin login",
              body: { email: "string", password: "string" },
              response: { token: "JWT token", admin: { id: "string", email: "string" } },
            },
          },
        },
      });
      return;
    }

    if (method === "GET" && routePathname === "/stock") {
      const stock = await getStock();
      sendSuccess(res, 200, stock);
      return;
    }

    if (method === "GET" && routePathname === "/products") {
      const products = await getProducts();
      sendSuccess(res, 200, products);
      return;
    }

    if (method === "GET" && routePathname === "/coupons") {
      const coupons = await getStorefrontCoupons();
      sendSuccess(res, 200, coupons);
      return;
    }

    if (method === "GET" && routePathname === "/coupon-events") {
      handleCouponEventsStream(req, res);
      return;
    }

    if (method === "GET" && routePathname === "/ads") {
      const ads = await getStorefrontAds();
      sendSuccess(res, 200, ads);
      return;
    }

    if (method === "GET" && routePathname === "/admin/products/deleted") {
      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      const products = await getProducts({ includeDeleted: true, deletedOnly: true });
      sendSuccess(res, 200, products);
      return;
    }

    const productRoute = matchRoute(routePathname, "/products/:product_id");
    if (productRoute) {
      if (method === "GET") {
        const product = await getProductById(productRoute.product_id);
        sendSuccess(res, 200, product);
        return;
      }

      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      if (method === "PATCH") {
        const body = await parseJsonBody(req);
        const product = await updateProduct(productRoute.product_id, body);
        sendSuccess(res, 200, product, "Product updated successfully.");
        return;
      }

      if (method === "DELETE") {
        const deletedProduct = await deleteProduct(productRoute.product_id);
        sendSuccess(res, 200, deletedProduct, "Product deleted successfully.");
        return;
      }

      sendError(res, 405, "Method not allowed.");
      return;
    }

    const restoreRoute = matchRoute(routePathname, "/products/:product_id/restore");
    if (restoreRoute) {
      if (method !== "POST") {
        sendError(res, 405, "Method not allowed.");
        return;
      }

      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      const restoredProduct = await restoreProduct(restoreRoute.product_id);
      sendSuccess(res, 200, restoredProduct, "Product restored successfully.");
      return;
    }

    if (method === "POST" && routePathname === "/products") {
      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      const body = await parseJsonBody(req);
      const product = await createProduct(body);
      sendSuccess(res, 201, product, "Product created successfully.");
      return;
    }

    if (method === "POST" && routePathname === "/admin/products/import") {
      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      const body = await parseJsonBody(req);
      const importedProducts = await importProducts(body);
      sendSuccess(
        res,
        200,
        { imported: importedProducts.length, products: importedProducts },
        "Products imported successfully.",
      );
      return;
    }

    if (method === "GET" && routePathname === "/admin/analytics") {
      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      const analytics = await getAdminAnalytics();
      sendSuccess(res, 200, analytics);
      return;
    }

    if (routePathname === "/admin/coupons") {
      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      if (method === "GET") {
        const coupons = await getAdminCoupons();
        sendSuccess(res, 200, coupons);
        return;
      }

      if (method === "POST") {
        const body = await parseJsonBody(req);
        const coupon = await createCoupon(body);
        sendSuccess(res, 201, coupon, "Coupon created successfully.");
        return;
      }

      sendError(res, 405, "Method not allowed.");
      return;
    }

    const couponRoute = matchRoute(routePathname, "/admin/coupons/:coupon_id");
    if (couponRoute) {
      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      if (method === "GET") {
        const coupon = await getCouponById(couponRoute.coupon_id);
        sendSuccess(res, 200, coupon);
        return;
      }

      if (method === "PATCH") {
        const body = await parseJsonBody(req);
        const coupon = await updateCoupon(couponRoute.coupon_id, body);
        sendSuccess(res, 200, coupon, "Coupon updated successfully.");
        return;
      }

      if (method === "DELETE") {
        const deletedCoupon = await deleteCoupon(couponRoute.coupon_id);
        sendSuccess(res, 200, deletedCoupon, "Coupon deleted successfully.");
        return;
      }

      sendError(res, 405, "Method not allowed.");
      return;
    }

    if (routePathname === "/admin/ads") {
      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      if (method === "GET") {
        const ads = await getAdminAds();
        sendSuccess(res, 200, ads);
        return;
      }

      if (method === "POST") {
        const body = await parseJsonBody(req);
        const ad = await createAd(body);
        sendSuccess(res, 201, ad, "Ad created successfully.");
        return;
      }

      sendError(res, 405, "Method not allowed.");
      return;
    }

    const adRoute = matchRoute(routePathname, "/admin/ads/:ad_id");
    if (adRoute) {
      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      if (method === "GET") {
        const ad = await getAdById(adRoute.ad_id);
        sendSuccess(res, 200, ad);
        return;
      }

      if (method === "PATCH") {
        const body = await parseJsonBody(req);
        const ad = await updateAd(adRoute.ad_id, body);
        sendSuccess(res, 200, ad, "Ad updated successfully.");
        return;
      }

      if (method === "DELETE") {
        const deletedAd = await deleteAd(adRoute.ad_id);
        sendSuccess(res, 200, deletedAd, "Ad deleted successfully.");
        return;
      }

      sendError(res, 405, "Method not allowed.");
      return;
    }

    const stockRoute = matchRoute(routePathname, "/stock/:product_id");
    if (stockRoute) {
      if (method !== "PUT") {
        sendError(res, 405, "Method not allowed.");
        return;
      }

      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      const body = await parseJsonBody(req);
      const stock = await updateStock(stockRoute.product_id, body);
      sendSuccess(res, 200, stock);
      return;
    }

    if (method === "POST" && routePathname === "/orders") {
      const body = await parseJsonBody(req);
      const order = await createOrder(body);
      sendSuccess(res, 201, order);
      return;
    }

    const cancelOrderRoute = matchRoute(routePathname, "/orders/:order_id/cancel");
    if (cancelOrderRoute) {
      if (method !== "POST") {
        sendError(res, 405, "Method not allowed.");
        return;
      }

      const body = await parseJsonBody(req);
      const order = await cancelOrderByCustomer(cancelOrderRoute.order_id, body);
      sendSuccess(res, 200, order, "Order cancelled successfully.");
      return;
    }

    if (method === "POST" && routePathname === "/admin/orders/manual") {
      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      const body = await parseJsonBody(req);
      const order = await createManualOrder(body);
      sendSuccess(res, 201, order, "Manual order created successfully.");
      return;
    }

    if (method === "POST" && routePathname === "/payments/razorpay/order") {
      const body = await parseJsonBody(req);
      const razorpayOrder = await createRazorpayPaymentOrder(body);
      sendSuccess(res, 200, razorpayOrder);
      return;
    }

    if (method === "POST" && routePathname === "/payments/razorpay/verify") {
      const body = await parseJsonBody(req);
      const verifiedPayment = await verifyRazorpayPaymentAndCreateOrder(body);
      sendSuccess(res, 201, verifiedPayment);
      return;
    }

    const orderStatusRoute = matchRoute(routePathname, "/orders/:order_id/status");
    if (orderStatusRoute) {
      if (method !== "PATCH") {
        sendError(res, 405, "Method not allowed.");
        return;
      }

      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      const body = await parseJsonBody(req);
      const order = await updateOrderStatus(orderStatusRoute.order_id, body);
      sendSuccess(res, 200, order);
      return;
    }

    const orderRefundRoute = matchRoute(routePathname, "/admin/orders/:order_id/refund");
    if (orderRefundRoute) {
      if (method !== "POST") {
        sendError(res, 405, "Method not allowed.");
        return;
      }

      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      const refundedOrder = await refundCancelledOrder(orderRefundRoute.order_id);
      sendSuccess(res, 200, refundedOrder, "Refund initiated successfully.");
      return;
    }

    if (method === "GET" && routePathname === "/orders") {
      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      const url = getRequestUrl(req);
      const limit = Math.min(Number(url.searchParams.get("limit")) || 20, 100);
      const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);
      
      const orders = await getOrders();
      const paginatedOrders = orders.slice(offset, offset + limit);
      
      sendSuccess(res, 200, {
        orders: paginatedOrders,
        pagination: {
          limit,
          offset,
          total: orders.length,
          hasMore: offset + limit < orders.length,
        },
      });
      return;
    }

    const getOrderRoute = matchRoute(routePathname, "/orders/:order_id");
    if (getOrderRoute) {
      if (method !== "GET" && method !== "DELETE") {
        sendError(res, 405, "Method not allowed.");
        return;
      }

      if (!(await requireActiveAdminSession(req, res))) {
        return;
      }

      if (method === "DELETE") {
        const deletedOrder = await deleteOrder(getOrderRoute.order_id);
        sendSuccess(res, 200, deletedOrder, "Order deleted successfully.");
        return;
      }

      const order = await getOrderById(getOrderRoute.order_id);
      sendSuccess(res, 200, order);
      return;
    }

    if (method === "POST" && routePathname === "/admin/login") {
      const body = await parseJsonBody(req);
      const login = await loginAdmin(body, req);
      setAdminSessionCookie(res, login.token);
      sendSuccess(res, 200, { admin: login.admin }, "Login successful.");
      return;
    }

    if (method === "POST" && routePathname === "/admin/password-reset/request-otp") {
      const body = await parseJsonBody(req);
      const response = await requestAdminPasswordResetOtp(body);
      sendSuccess(res, 200, response, "OTP sent successfully.");
      return;
    }

    if (method === "POST" && routePathname === "/admin/password-reset/confirm") {
      const body = await parseJsonBody(req);
      const response = await resetAdminPasswordWithOtp(body);
      clearAdminSessionCookie(res);
      sendSuccess(res, 200, response, "Password reset successful.");
      return;
    }

    if (method === "GET" && routePathname === "/admin/session") {
      const admin = getAdminSession(req);

      if (!admin) {
        sendError(res, 401, "Not authenticated.");
        return;
      }

      const currentSession = await ensureAdminSessionRow(req, admin, admin.sessionId);

      if (!currentSession) {
        sendError(res, 401, "Not authenticated.");
        return;
      }

      await touchAdminSession(admin.sessionId);

      sendSuccess(res, 200, { admin, session: currentSession });
      return;
    }

    if (method === "GET" && routePathname === "/admin/sessions") {
      const admin = getAdminSession(req);

      if (!admin) {
        sendError(res, 401, "Not authenticated.");
        return;
      }

      const currentSession = await ensureAdminSessionRow(req, admin, admin.sessionId);

      if (!currentSession) {
        sendError(res, 401, "Not authenticated.");
        return;
      }

      await touchAdminSession(admin.sessionId);

      const sessions = await listAdminSessions(admin.id, admin.sessionId);

      sendSuccess(res, 200, { sessions });
      return;
    }

    if (method === "POST" && routePathname === "/admin/logout") {
      const admin = getAdminSession(req);

      if (admin?.sessionId) {
        await revokeAdminSession(admin.sessionId);
      }

      clearAdminSessionCookie(res);
      sendSuccess(res, 200, { loggedOut: true }, "Logged out successfully.");
      return;
    }

    sendError(res, 404, "Route not found.");
  } catch (error) {
    handleError(res, error, requestId);
  } finally {
    const duration = Date.now() - startTime;
    log("info", "API response", {
      requestId,
      durationMs: duration,
    });
  }
});

// Graceful shutdown
const gracefulShutdown = () => {
  log("info", "Graceful shutdown initiated");
  
  server.close(() => {
    log("info", "Server closed");
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    log("error", "Forced shutdown due to timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

server.listen(PORT, () => {
  log("info", "API server started", {
    port: PORT,
    nodeEnv: process.env.NODE_ENV || "development",
    apiBase: API_PREFIX,
    razorpayMode: ACTIVE_RAZORPAY_MODE,
  });
});
