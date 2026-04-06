import pkg from "pg";
import { hashPassword } from "../helpers/auth.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const { Pool } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");

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

loadEnvFile(envPath);

const email = process.argv[2] ?? "admin@sppickles.com";
const password = process.argv[3] ?? "sp-pickles-admin";
const databaseUrl = String(process.env.DATABASE_URL ?? "").trim();

if (!databaseUrl) {
  console.error("❌ DATABASE_URL is required. This script seeds Railway PostgreSQL only.");
  process.exit(1);
}

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password>");
  console.error("Example: node scripts/create-admin.mjs admin@pickles.com mypassword");
  process.exit(1);
}

try {
  const passwordHash = hashPassword(password);
  const userId = randomUUID();
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(
    `INSERT INTO admin_users (id, email, password_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET
       id = EXCLUDED.id,
       password_hash = EXCLUDED.password_hash,
       created_at = CURRENT_TIMESTAMP`,
    [userId, email, passwordHash],
  );

  await pool.end();

  console.log("✅ Admin user created successfully!");
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Admin ID:     ${userId}`);
  console.log(`Email:        ${email}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Password:     [HIDDEN FOR SECURITY]`);
  console.log(`\n⚠️  Keep your password secure!`);
  console.log(`⚠️  Never share credentials in messages or logs.`);
  console.log(`⚠️  Access admin panel at: /admin/login\n`);
} catch (error) {
  if (error.message.includes("UNIQUE constraint failed")) {
    console.error("❌ Admin user with this email already exists.");
  } else if (error.message.includes("duplicate key value violates unique constraint")) {
    console.error("❌ Admin user with this email already exists.");
  } else {
    console.error("❌ Error creating admin user:", error.message);
  }
  process.exit(1);
}
