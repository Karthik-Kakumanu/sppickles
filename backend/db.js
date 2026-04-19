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

    CREATE TABLE IF NOT EXISTS admin_sessions (
      id TEXT PRIMARY KEY,
      admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      admin_email TEXT NOT NULL,
      device_label TEXT NOT NULL DEFAULT 'Web browser',
      user_agent TEXT NOT NULL DEFAULT '',
      ip_address TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_seen_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL,
      revoked_at TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS admin_sessions_admin_user_id_idx ON admin_sessions(admin_user_id);
    CREATE INDEX IF NOT EXISTS admin_sessions_active_idx ON admin_sessions(admin_user_id, revoked_at, expires_at);

    CREATE TABLE IF NOT EXISTS stock_status (
      product_id TEXT PRIMARY KEY,
      is_available BOOLEAN NOT NULL DEFAULT true,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      price_per_kg INTEGER NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      is_available BOOLEAN NOT NULL DEFAULT true,
      is_best_seller BOOLEAN NOT NULL DEFAULT false,
      is_brahmin_heritage BOOLEAN NOT NULL DEFAULT true,
      is_green_touch BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP
    );

    ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS price INTEGER;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS image TEXT NOT NULL DEFAULT '';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS custom_tag TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS is_brahmin_heritage BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS is_green_touch BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

    UPDATE products
    SET price = COALESCE(price, price_per_kg, 0)
    WHERE price IS NULL;

    ALTER TABLE products ALTER COLUMN price SET DEFAULT 0;
    ALTER TABLE products ALTER COLUMN price SET NOT NULL;

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
      discount_amount INTEGER NOT NULL DEFAULT 0,
      coupon_code TEXT,
      total INTEGER NOT NULL,
      payment_method TEXT NOT NULL DEFAULT 'upi',
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      payment_captured_at TIMESTAMP,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending';
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_captured_at TIMESTAMP;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;

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

    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      discount_type TEXT NOT NULL,
      discount_value NUMERIC(10,2) NOT NULL,
      applies_to TEXT NOT NULL,
      target_category TEXT,
      target_product_id TEXT,
      min_order_amount NUMERIC(10,2),
      max_discount_amount NUMERIC(10,2),
      starts_at TIMESTAMP,
      ends_at TIMESTAMP,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ads (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      media_type TEXT NOT NULL,
      media_url TEXT NOT NULL,
      cta_text TEXT,
      cta_url TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      starts_at TIMESTAMP,
      ends_at TIMESTAMP,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE coupons ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';
    ALTER TABLE coupons ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
    ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount_type TEXT NOT NULL DEFAULT 'percentage';
    ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount_value NUMERIC(10,2) NOT NULL DEFAULT 0;
    ALTER TABLE coupons ADD COLUMN IF NOT EXISTS applies_to TEXT NOT NULL DEFAULT 'all';
    ALTER TABLE coupons ADD COLUMN IF NOT EXISTS target_category TEXT;
    ALTER TABLE coupons ADD COLUMN IF NOT EXISTS target_product_id TEXT;
    ALTER TABLE coupons ADD COLUMN IF NOT EXISTS min_order_amount NUMERIC(10,2);
    ALTER TABLE coupons ADD COLUMN IF NOT EXISTS max_discount_amount NUMERIC(10,2);
    ALTER TABLE coupons ADD COLUMN IF NOT EXISTS starts_at TIMESTAMP;
    ALTER TABLE coupons ADD COLUMN IF NOT EXISTS ends_at TIMESTAMP;
    ALTER TABLE coupons ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE coupons ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE coupons ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

    ALTER TABLE ads ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';
    ALTER TABLE ads ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
    ALTER TABLE ads ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'image';
    ALTER TABLE ads ADD COLUMN IF NOT EXISTS media_url TEXT NOT NULL DEFAULT '';
    ALTER TABLE ads ADD COLUMN IF NOT EXISTS cta_text TEXT;
    ALTER TABLE ads ADD COLUMN IF NOT EXISTS cta_url TEXT;
    ALTER TABLE ads ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE ads ADD COLUMN IF NOT EXISTS starts_at TIMESTAMP;
    ALTER TABLE ads ADD COLUMN IF NOT EXISTS ends_at TIMESTAMP;
    ALTER TABLE ads ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE ads ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE ads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id ON orders(razorpay_payment_id) WHERE razorpay_payment_id IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products(updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products(deleted_at DESC);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
    CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
    CREATE INDEX IF NOT EXISTS idx_coupons_applies_to ON coupons(applies_to);
    CREATE INDEX IF NOT EXISTS idx_coupons_target_category ON coupons(target_category);
    CREATE INDEX IF NOT EXISTS idx_coupons_target_product_id ON coupons(target_product_id);
    CREATE INDEX IF NOT EXISTS idx_ads_is_active ON ads(is_active);
    CREATE INDEX IF NOT EXISTS idx_ads_display_order ON ads(display_order);
    CREATE INDEX IF NOT EXISTS idx_ads_created_at ON ads(created_at DESC);
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

const seedInitialProducts = () => {
  const seedFilePath = path.join(__dirname, "data", "productCatalog.json");

  if (!fs.existsSync(seedFilePath)) {
    console.warn("[db] Product seed file not found, skipping catalog bootstrap.");
    return;
  }

  return (async () => {
    const existingProducts = await pgPool.query("select count(*)::int as count from products");
    const productCount = Number(existingProducts.rows[0]?.count ?? 0);

    if (productCount > 0) {
      return;
    }

    const seedProducts = JSON.parse(fs.readFileSync(seedFilePath, "utf8"));

    if (!Array.isArray(seedProducts) || seedProducts.length === 0) {
      console.warn("[db] Product seed file is empty, skipping catalog bootstrap.");
      return;
    }

    const client = await pgPool.connect();

    try {
      await client.query("BEGIN");

      for (const product of seedProducts) {
        await client.query(
          `
            insert into products (
              id,
              name,
              category,
              subcategory,
              price_per_kg,
              image,
              description,
              is_available,
              is_best_seller,
              is_brahmin_heritage,
              is_green_touch,
              created_at,
              updated_at,
              deleted_at
            )
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL)
          `,
          [
            String(product.id ?? ""),
            String(product.name ?? ""),
            String(product.category ?? "pickles"),
            product.subcategory ?? null,
            Number(product.price_per_kg ?? 0),
            String(product.image ?? ""),
            String(product.description ?? ""),
            Boolean(product.isAvailable ?? true),
            Boolean(product.isBestSeller ?? false),
            Boolean(product.isBrahminHeritage ?? true),
            Boolean(product.isGreenTouch ?? true),
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
          [String(product.id ?? ""), Boolean(product.isAvailable ?? true)],
        );
      }

      await client.query("COMMIT");
      console.log(`[db] Seeded ${seedProducts.length} products into PostgreSQL`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  })();
};

await seedInitialProducts();

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


