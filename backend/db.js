import pkg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");

  fileContents.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex < 0) {
      return;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    let value = trimmedLine.slice(separatorIndex + 1).trim();

    if (!key || process.env[key] !== undefined) {
      return;
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
};

loadEnvFile(path.join(__dirname, ".env"));

const DATABASE_URL = String(process.env.DATABASE_URL ?? "").trim();

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is required. This backend is configured to use Railway PostgreSQL tables only.",
  );
}

const IS_PRODUCTION = process.env.NODE_ENV === "production";

console.log("[db] Using PostgreSQL from DATABASE_URL");
const pgPool = new Pool({
  connectionString: DATABASE_URL,
  ssl: IS_PRODUCTION ? { rejectUnauthorized: false } : false,
});

pgPool.on("error", (err) => {
  console.error("[db] Unexpected error on idle client", err);
});

// Initialize schema
const initializeSchema = async () => {
  const schema = `
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stock_status (
      product_id TEXT PRIMARY KEY,
      is_available BOOLEAN NOT NULL DEFAULT true,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      customer_city TEXT NOT NULL DEFAULT '',
      customer_state TEXT NOT NULL DEFAULT '',
      customer_country TEXT NOT NULL DEFAULT 'IN',
      customer_pincode TEXT NOT NULL DEFAULT '',
      shipping INTEGER NOT NULL DEFAULT 0,
      subtotal INTEGER NOT NULL,
      total INTEGER NOT NULL,
      payment_method TEXT NOT NULL DEFAULT 'cod',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      weight TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price INTEGER NOT NULL,
      total_price INTEGER NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
  `;

  try {
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    for (const stmt of statements) {
      await pgPool.query(stmt);
    }
    console.log("[db] PostgreSQL schema initialized");
  } catch (error) {
    console.error("[db] Failed to initialize PostgreSQL schema:", error.message);
    throw error;
  }
};

await initializeSchema();

// PostgreSQL Connection Wrapper
class PostgreSQLConnection {
  constructor(client) {
    this.client = client;
    this.inTransaction = false;
  }

  async query(sql, params) {
    const result = await this.client.query(sql, params);
    return {
      rows: result.rows || [],
      rowCount: result.rowCount || 0,
    };
  }

  async begin() {
    await this.client.query("BEGIN");
    this.inTransaction = true;
  }

  async commit() {
    await this.client.query("COMMIT");
    this.inTransaction = false;
  }

  async rollback() {
    await this.client.query("ROLLBACK");
    this.inTransaction = false;
  }

  release() {
    this.client.release();
  }
}

// Pool wrapper for PostgreSQL
export const pool = {
  connect: async () => {
    const client = await pgPool.connect();
    return new PostgreSQLConnection(client);
  },

  query: async (sql, params) => {
    const result = await pgPool.query(sql, params);
    return {
      rows: result.rows || [],
      rowCount: result.rowCount || 0,
    };
  },

  close: async () => {
    if (pgPool) {
      await pgPool.end();
    }
  },
};


