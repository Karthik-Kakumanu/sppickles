import pkg from "pg";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "sp-pickles.db");

// Determine which database to use
const USE_POSTGRESQL = !!process.env.DATABASE_URL;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

let pgPool = null;
let sqlite = null;

// Initialize PostgreSQL pool if DATABASE_URL is set
if (USE_POSTGRESQL) {
  console.log("[db] Using PostgreSQL from DATABASE_URL");
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: IS_PRODUCTION ? { rejectUnauthorized: false } : false,
  });

  pgPool.on("error", (err) => {
    console.error("[db] Unexpected error on idle client", err);
  });
} else {
  // Fall back to SQLite for local development
  console.log("[db] Using SQLite (local development)");
  sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
}

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

  if (USE_POSTGRESQL) {
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
    }
  } else {
    try {
      sqlite.exec(schema);
      console.log("[db] SQLite schema initialized");
    } catch (error) {
      console.error("[db] Failed to initialize SQLite schema:", error.message);
    }
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

// SQLite Connection Wrapper
class SQLiteConnection {
  constructor() {
    this.inTransaction = false;
  }

  async query(sql, params) {
    // Convert PostgreSQL $1, $2 params to SQLite ? params
    let sqliteQuery = sql;
    let orderedParams = params || [];

    if (params && params.length > 0) {
      const paramIndices = [];
      sql.replace(/\$(\d+)/g, (match, index) => {
        paramIndices.push(parseInt(index) - 1);
        return match;
      });

      if (paramIndices.length > 0) {
        orderedParams = paramIndices.map((i) => params[i]);
        sqliteQuery = sql.replace(/\$\d+/g, "?");
      }
    }

    const stmt = sqlite.prepare(sqliteQuery);

    if (sqliteQuery.trim().toLowerCase().startsWith("insert")) {
      const info = stmt.run(...orderedParams);
      return {
        rows: [{ id: info.lastInsertRowid }],
        rowCount: info.changes,
      };
    } else if (sqliteQuery.trim().toLowerCase().startsWith("update")) {
      const info = stmt.run(...orderedParams);
      return {
        rows: [],
        rowCount: info.changes,
      };
    } else if (sqliteQuery.trim().toLowerCase().startsWith("delete")) {
      const info = stmt.run(...orderedParams);
      return {
        rows: [],
        rowCount: info.changes,
      };
    } else if (sqliteQuery.trim().toLowerCase().startsWith("select")) {
      const rows = stmt.all(...orderedParams);
      return {
        rows: rows || [],
        rowCount: rows?.length || 0,
      };
    } else {
      if (sqliteQuery.trim().toUpperCase() === "BEGIN") {
        this.inTransaction = true;
        sqlite.exec("BEGIN");
      } else if (sqliteQuery.trim().toUpperCase() === "COMMIT") {
        this.inTransaction = false;
        sqlite.exec("COMMIT");
      } else if (sqliteQuery.trim().toUpperCase() === "ROLLBACK") {
        this.inTransaction = false;
        sqlite.exec("ROLLBACK");
      } else {
        sqlite.exec(sqliteQuery);
      }
      return { rows: [], rowCount: 0 };
    }
  }

  async begin() {
    sqlite.exec("BEGIN");
    this.inTransaction = true;
  }

  async commit() {
    sqlite.exec("COMMIT");
    this.inTransaction = false;
  }

  async rollback() {
    sqlite.exec("ROLLBACK");
    this.inTransaction = false;
  }

  release() {
    // SQLite doesn't need connection pooling
  }
}

// Create a pool-like interface that works with both PostgreSQL and SQLite
export const pool = {
  connect: async () => {
    if (USE_POSTGRESQL) {
      const client = await pgPool.connect();
      return new PostgreSQLConnection(client);
    } else {
      return new SQLiteConnection();
    }
  },

  query: async (sql, params) => {
    if (USE_POSTGRESQL) {
      const result = await pgPool.query(sql, params);
      return {
        rows: result.rows || [],
        rowCount: result.rowCount || 0,
      };
    } else {
      const conn = new SQLiteConnection();
      return conn.query(sql, params);
    }
  },

  close: async () => {
    if (USE_POSTGRESQL && pgPool) {
      await pgPool.end();
    }
  },
};


