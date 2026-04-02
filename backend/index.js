import http from "node:http";
import { randomUUID } from "node:crypto";
import { pool } from "./db.js";
import { hashPassword, requireAdmin, signAdminToken, verifyPassword } from "./helpers/auth.js";
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
const API_PREFIX = "/api";
const VALID_WEIGHTS = new Set(["250g", "500g", "1kg"]);
const PHONE_PATTERN = /^\d{10}$/;
const PINCODE_PATTERN = /^\d{6}$/;
const ORDER_STATUS_ALIASES = {
  new: "pending",
  pending: "pending",
  processing: "processing",
  shipped: "delivered",
  delivered: "delivered",
  cancelled: "pending",
};
const VALID_ORDER_STATUSES = new Set(["pending", "processing", "delivered"]);
const DUMMY_ADMIN_PASSWORD_HASH = hashPassword("sp-pickles-dummy-password");
const ADMIN_LOGIN_MAX_ATTEMPTS = Number(process.env.ADMIN_LOGIN_MAX_ATTEMPTS || 5);
const ADMIN_LOGIN_WINDOW_MS = Number(process.env.ADMIN_LOGIN_WINDOW_MS || 15 * 60 * 1000);
const ADMIN_LOGIN_LOCKOUT_MS = Number(process.env.ADMIN_LOGIN_LOCKOUT_MS || 30 * 60 * 1000);
const adminLoginAttempts = new Map();

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
  const paymentMethod = String(body.paymentMethod ?? "cod").trim();
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

  if (!["upi", "bank", "cod"].includes(paymentMethod)) {
    throw { statusCode: 400, message: "Payment method must be 'upi', 'bank', or 'cod'." };
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
    paymentMethod,
    items: normalizedItems,
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
        total: Number(row.total),
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
    order by product_id asc
  `);

  return result.rows;
};

const updateStock = async (productId, body) => {
  const payload = normalizeStockPayload(body);
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
    [productId, payload.isAvailable],
  );

  return result.rows[0];
};

const createOrder = async (body) => {
  const payload = normalizeOrderPayload(body);
  const subtotal = payload.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const total = subtotal + payload.shipping;
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
          total,
          payment_method,
          status
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending')
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
        total,
        payload.paymentMethod,
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
    total,
    paymentMethod: payload.paymentMethod,
    status: "pending",
    createdAt: new Date().toISOString(),
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
      o.total,
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
        o.total,
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
      set status = $2
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

  return {
    token: signAdminToken(adminUser),
    admin: {
      id: adminUser.id,
      email: adminUser.email,
    },
  };
};

const handleError = (res, error, requestId) => {
  const errorId = randomUUID();
  
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
  
  sendError(res, 500, "Internal server error.", { errorId });
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
          stock: `GET ${API_PREFIX}/stock`,
          updateStock: `PUT ${API_PREFIX}/stock/:product_id`,
          createOrder: `POST ${API_PREFIX}/orders`,
          getOrders: `GET ${API_PREFIX}/orders?limit=20&offset=0`,
          getOrder: `GET ${API_PREFIX}/orders/:order_id`,
          updateOrderStatus: `PATCH ${API_PREFIX}/orders/:order_id/status`,
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
            updateStatus: {
              path: "/orders/:order_id/status",
              method: "PATCH",
              description: "Update order status (requires admin auth)",
              auth: "Bearer token",
              body: { status: "pending|processing|delivered" },
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

    const stockRoute = matchRoute(routePathname, "/stock/:product_id");
    if (stockRoute) {
      if (method !== "PUT") {
        sendError(res, 405, "Method not allowed.");
        return;
      }

      if (!requireAdmin(req, res)) {
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

    const orderStatusRoute = matchRoute(routePathname, "/orders/:order_id/status");
    if (orderStatusRoute) {
      if (method !== "PATCH") {
        sendError(res, 405, "Method not allowed.");
        return;
      }

      if (!requireAdmin(req, res)) {
        return;
      }

      const body = await parseJsonBody(req);
      const order = await updateOrderStatus(orderStatusRoute.order_id, body);
      sendSuccess(res, 200, order);
      return;
    }

    if (method === "GET" && routePathname === "/orders") {
      if (!requireAdmin(req, res)) {
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
      if (method !== "GET") {
        sendError(res, 405, "Method not allowed.");
        return;
      }

      if (!requireAdmin(req, res)) {
        return;
      }

      const order = await getOrderById(getOrderRoute.order_id);
      sendSuccess(res, 200, order);
      return;
    }

    if (method === "POST" && routePathname === "/admin/login") {
      const body = await parseJsonBody(req);
      const login = await loginAdmin(body, req);
      sendSuccess(res, 200, login);
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
  });
});
