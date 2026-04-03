import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import jwt from "jsonwebtoken";
import { sendError } from "./http.js";

const DEFAULT_DEV_JWT_SECRET = "sp-pickles-dev-secret";
const ADMIN_SESSION_COOKIE_NAME = "sp_pickles_admin_session";
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

const parseCookieHeader = (cookieHeader) => {
  if (!cookieHeader) {
    return {};
  }

  return String(cookieHeader)
    .split(";")
    .reduce((cookies, pair) => {
      const separatorIndex = pair.indexOf("=");

      if (separatorIndex < 0) {
        return cookies;
      }

      const name = pair.slice(0, separatorIndex).trim();
      const value = pair.slice(separatorIndex + 1).trim();

      if (name) {
        cookies[name] = value;
      }

      return cookies;
    }, {});
};

const buildCookie = (name, value, options = {}) => {
  const parts = [`${name}=${value}`];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }

  if (options.expires) {
    parts.push(`Expires=${options.expires.toUTCString()}`);
  }

  parts.push(`Path=${options.path ?? "/"}`);
  parts.push("HttpOnly");
  parts.push(`SameSite=${options.sameSite ?? "Lax"}`);

  if (options.secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
};

export const getAdminTokenFromRequest = (req) => {
  const authorization = req.headers.authorization || "";

  if (authorization.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  const cookies = parseCookieHeader(req.headers.cookie);
  return cookies[ADMIN_SESSION_COOKIE_NAME] || null;
};

export const verifyAdminToken = (req) => {
  const token = getAdminTokenFromRequest(req);

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());

    if (payload.role !== "admin") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

export const setAdminSessionCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  const maxAgeSeconds = 8 * 60 * 60;

  res.setHeader(
    "Set-Cookie",
    buildCookie(ADMIN_SESSION_COOKIE_NAME, token, {
      maxAge: maxAgeSeconds,
      secure: isProduction,
      sameSite: "Lax",
      path: "/",
    }),
  );
};

export const clearAdminSessionCookie = (res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.setHeader(
    "Set-Cookie",
    buildCookie(ADMIN_SESSION_COOKIE_NAME, "", {
      maxAge: 0,
      expires: new Date(0),
      secure: isProduction,
      sameSite: "Lax",
      path: "/",
    }),
  );
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
  const payload = verifyAdminToken(req);

  if (!payload) {
    sendError(res, 401, "Admin session required.");
    return null;
  }

  return payload;
};
