import Database from "better-sqlite3";
import { hashPassword } from "../helpers/auth.js";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "sp-pickles.db");

const email = process.argv[2] ?? "admin@sppickles.com";
const password = process.argv[3] ?? "sp-pickles-admin";

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password>");
  console.error("Example: node scripts/create-admin.mjs admin@pickles.com mypassword");
  process.exit(1);
}

try {
  const db = new Database(dbPath);
  
  // Enable foreign keys
  db.pragma("foreign_keys = ON");

  const passwordHash = hashPassword(password);
  const userId = randomUUID();
  
  const stmt = db.prepare(`
    INSERT INTO admin_users (id, email, password_hash) 
    VALUES (?, ?, ?)
  `);

  stmt.run(userId, email, passwordHash);
  
  console.log("✅ Admin user created successfully!");
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Admin ID:     ${userId}`);
  console.log(`Email:        ${email}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Password:     [HIDDEN FOR SECURITY]`);
  console.log(`\n⚠️  Keep your password secure!`);
  console.log(`⚠️  Never share credentials in messages or logs.`);
  console.log(`⚠️  Access admin panel at: /admin/login\n`);

  db.close();
} catch (error) {
  if (error.message.includes("UNIQUE constraint failed")) {
    console.error("❌ Admin user with this email already exists.");
  } else {
    console.error("❌ Error creating admin user:", error.message);
  }
  process.exit(1);
}
