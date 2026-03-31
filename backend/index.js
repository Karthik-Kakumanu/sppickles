import http from "node:http";
import { randomUUID } from "node:crypto";
import { pool } from "./db.js";
import { requireAdmin, signAdminToken, verifyPassword } from "./helpers/auth.js";
import {
  getRequestUrl,
  handleCors,
  matchRoute,
  parseJsonBody,
  sendError,
  sendSuccess,
} from "./helpers/http.js";

const PORT = Number(process.env.PORT || 5000);
const VALID_WEIGHTS = new Set(["250g", "500g", "1kg"]);
const PHONE_PATTERN = /^\d{10}$/;
const PINCODE_PATTERN = /^\d{6}$/;

const buildOrderId = () =>
  `SP-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`;

const isPlainObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeStockPayload = (body) => {
  if (!isPlainObject(body)) {
    throw { statusCode: 400, message: "Request body must be a JSON object." };
  }

  const isAvailable = body.is_available ?? body.isAvailable;

  if (typeof isAvailable !== "boolean") {
    throw { statusCode: 400, message: "is_available must be a boolean value." };
  }

  return { isAvailable };
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
    items: normalizedItems,
  };
};

const serializeOrderRows = (rows) => {
  const orders = new Map();

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
        status: row.status,
        createdAt: row.created_at,
      });
    }

    if (row.item_id) {
      orders.get(row.id).items.push({
        id: row.item_id,
        productId: row.product_id,
        name: row.product_name,
        weight: row.weight,
        quantity: Number(row.quantity),
        unitPrice: Number(row.unit_price),
        totalPrice: Number(row.total_price),
      });
    }
  }

  return [...orders.values()];
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
      values ($1, $2, now())
      on conflict (product_id)
      do update set
        is_available = excluded.is_available,
        updated_at = now()
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
          status
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'new')
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
      ],
    );

    for (const item of payload.items) {
      await client.query(
        `
          insert into order_items (
            order_id,
            product_id,
            product_name,
            weight,
            quantity,
            unit_price,
            total_price
          )
          values ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
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
    status: "new",
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

const loginAdmin = async (body) => {
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    throw { statusCode: 400, message: "Email and password are required." };
  }

  const result = await pool.query(
    "select id, email, password_hash from admin_users where email = $1 limit 1",
    [email],
  );

  if (result.rowCount === 0 || !verifyPassword(password, result.rows[0].password_hash)) {
    throw { statusCode: 401, message: "Invalid email or password." };
  }

  const adminUser = result.rows[0];

  return {
    token: signAdminToken(adminUser),
    admin: {
      id: adminUser.id,
      email: adminUser.email,
    },
  };
};

const handleError = (res, error) => {
  if (error?.statusCode) {
    sendError(res, error.statusCode, error.message, error.details);
    return;
  }

  if (error?.code === "23505") {
    sendError(res, 409, "A record with the same value already exists.");
    return;
  }

  console.error("[backend] unexpected error", error);
  sendError(res, 500, "Internal server error.");
};

const server = http.createServer(async (req, res) => {
  if (handleCors(req, res)) {
    return;
  }

  try {
    const method = req.method || "GET";
    const url = getRequestUrl(req);
    const { pathname } = url;

    if (method === "GET" && pathname === "/") {
      sendSuccess(res, 200, {
        name: "SP Traditional Pickles API",
        ok: true,
        endpoints: {
          health: "GET /health",
          stock: "GET /stock",
          updateStock: "PUT /stock/:product_id",
          createOrder: "POST /orders",
          orders: "GET /orders",
          adminLogin: "POST /admin/login",
        },
      });
      return;
    }

    if (method === "GET" && pathname === "/health") {
      sendSuccess(res, 200, { ok: true });
      return;
    }

    if (method === "GET" && pathname === "/stock") {
      const stock = await getStock();
      sendSuccess(res, 200, stock);
      return;
    }

    const stockRoute = matchRoute(pathname, "/stock/:product_id");
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

    if (method === "POST" && pathname === "/orders") {
      const body = await parseJsonBody(req);
      const order = await createOrder(body);
      sendSuccess(res, 201, order);
      return;
    }

    if (method === "GET" && pathname === "/orders") {
      if (!requireAdmin(req, res)) {
        return;
      }

      const orders = await getOrders();
      sendSuccess(res, 200, orders);
      return;
    }

    if (method === "POST" && pathname === "/admin/login") {
      const body = await parseJsonBody(req);
      const login = await loginAdmin(body);
      sendSuccess(res, 200, login);
      return;
    }

    sendError(res, 404, "Route not found.");
  } catch (error) {
    handleError(res, error);
  }
});

server.listen(PORT, () => {
  console.log(`[backend] SP Traditional Pickles API listening on ${PORT}`);
});
