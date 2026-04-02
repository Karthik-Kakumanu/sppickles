import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import jwt from "jsonwebtoken";
import { sendError } from "./http.js";

const DEFAULT_DEV_JWT_SECRET = "sp-pickles-dev-secret";
let hasWarnedAboutJwtSecret = false;

const getJwtSecret = () => {
  const configuredSecret = String(process.env.JWT_SECRET ?? "").trim();
  const isProduction = process.env.NODE_ENV === "production";

  if (!configuredSecret) {
    if (isProduction) {
      throw new Error("JWT_SECRET must be set in production.");
    }

    if (!hasWarnedAboutJwtSecret) {
      console.warn("[auth] JWT_SECRET is not set. Using an insecure development fallback.");
      hasWarnedAboutJwtSecret = true;
    }

    return DEFAULT_DEV_JWT_SECRET;
  }

  if (isProduction && configuredSecret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long in production.");
  }

  if (!isProduction && configuredSecret.length < 32 && !hasWarnedAboutJwtSecret) {
    console.warn("[auth] JWT_SECRET is shorter than recommended. Use at least 32 characters.");
    hasWarnedAboutJwtSecret = true;
  }

  return configuredSecret;
};

const safeCompare = (left, right) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

export const hashPassword = (password) => {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derivedKey}`;
};

export const verifyPassword = (password, storedHash) => {
  if (!storedHash) {
    return false;
  }

  if (storedHash.startsWith("scrypt:")) {
    const [, salt, hash] = storedHash.split(":");

    if (!salt || !hash) {
      return false;
    }

    try {
      const expected = Buffer.from(hash, "hex");
      const actual = scryptSync(password, salt, expected.length);
      return timingSafeEqual(actual, expected);
    } catch {
      return false;
    }
  }

  if (storedHash.startsWith("sha256:")) {
    const digest = createHash("sha256").update(password).digest("hex");
    return safeCompare(digest, storedHash.slice("sha256:".length));
  }

  return safeCompare(password, storedHash);
};

export const signAdminToken = (adminUser) =>
  jwt.sign(
    {
      sub: adminUser.id,
      email: adminUser.email,
      role: "admin",
    },
    getJwtSecret(),
    { expiresIn: "8h" },
  );

export const requireAdmin = (req, res) => {
  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    sendError(res, 401, "Missing bearer token.");
    return null;
  }

  const token = authorization.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, getJwtSecret());

    if (payload.role !== "admin") {
      sendError(res, 403, "Admin access required.");
      return null;
    }

    return payload;
  } catch {
    sendError(res, 401, "Invalid or expired token.");
    return null;
  }
};
