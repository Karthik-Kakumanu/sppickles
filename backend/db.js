import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const shouldUseSsl =
  Boolean(connectionString) &&
  !connectionString.includes("localhost") &&
  !connectionString.includes("127.0.0.1");

export const pool = new Pool({
  connectionString,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
});

