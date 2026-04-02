import { hashPassword } from "../helpers/auth.js";

const password = String(process.argv[2] ?? "");

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <plain-text-password>");
  process.exit(1);
}

if (password.length < 12) {
  console.error("Use a password with at least 12 characters.");
  process.exit(1);
}

console.log(hashPassword(password));
