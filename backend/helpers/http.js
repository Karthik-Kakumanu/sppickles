const DEFAULT_BODY_LIMIT = 1_000_000;

const normalizeOrigin = (value) => String(value ?? "").trim().replace(/\/+$/, "");

const isRenderOrigin = (origin) => {
  try {
    const parsedUrl = new URL(origin);
    return parsedUrl.protocol === "https:" && parsedUrl.hostname.endsWith(".onrender.com");
  } catch {
    return false;
  }
};

const parseAllowedOrigins = (value) =>
  String(value ?? "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

const getAllowedOrigins = () => {
  const explicitOrigins = parseAllowedOrigins(process.env.CORS_ALLOWED_ORIGINS);

  if (explicitOrigins.length > 0) {
    return explicitOrigins;
  }

  const singleOrigin = normalizeOrigin(process.env.CORS_ORIGIN);

  if (singleOrigin) {
    return [singleOrigin];
  }

  return process.env.NODE_ENV === "production"
    ? ["https://sppickles.com", "https://www.sppickles.com"]
    : [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:8070",
        "http://127.0.0.1:8070",
        "http://localhost:5173",
      ];
};

const appendVaryHeader = (res, headerName) => {
  const currentValue = String(res.getHeader("Vary") ?? "").trim();

  if (!currentValue) {
    res.setHeader("Vary", headerName);
    return;
  }

  const existing = currentValue.split(",").map((item) => item.trim().toLowerCase());

  if (!existing.includes(headerName.toLowerCase())) {
    res.setHeader("Vary", `${currentValue}, ${headerName}`);
  }
};

const resolveAllowedOrigin = (req) => {
  const requestOrigin = normalizeOrigin(req?.headers?.origin);
  const allowedOrigins = getAllowedOrigins();

  if (!requestOrigin) {
    return allowedOrigins[0] ?? "";
  }

  if (allowedOrigins.includes(requestOrigin) || isRenderOrigin(requestOrigin)) {
    return requestOrigin;
  }

  return allowedOrigins[0] ?? "";
};

const getSecurityHeaders = () => ({
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
});

export const setSecurityHeaders = (res) => {
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
};

export const setCorsHeaders = (res, req = res.__request) => {
  const allowedOrigin = resolveAllowedOrigin(req);

  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  }

  appendVaryHeader(res, "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Request-ID");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400");
};

export const handleCors = (req, res) => {
  setSecurityHeaders(res);
  res.__request = req;
  setCorsHeaders(res, req);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return true;
  }

  return false;
};

export const sendJson = (res, statusCode, payload) => {
  setSecurityHeaders(res);
  setCorsHeaders(res);
  res.writeHead(statusCode, { 
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  });
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    timestamp: new Date().toISOString(),
    ...payload,
  };
  res.end(JSON.stringify(response));
};

export const sendSuccess = (res, statusCode, data, message = null) => {
  const payload = { data };
  if (message) payload.message = message;
  sendJson(res, statusCode, payload);
};

export const sendError = (res, statusCode, message, details) => {
  sendJson(res, statusCode, {
    error: message,
    ...(details ? { details } : {}),
  });
};

export const parseJsonBody = (req, options = {}) =>
  new Promise((resolve, reject) => {
    const limit = options.limit ?? DEFAULT_BODY_LIMIT;
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk.toString();

      if (rawBody.length > limit) {
        reject({ statusCode: 413, message: "Request body is too large." });
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!rawBody.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch {
        reject({ statusCode: 400, message: "Invalid JSON body." });
      }
    });

    req.on("error", (error) => {
      reject({
        statusCode: 400,
        message: "Unable to read request body.",
        details: error.message,
      });
    });
  });

export const getRequestUrl = (req) => new URL(req.url || "/", "http://localhost");

export const matchRoute = (pathname, template) => {
  const pathParts = pathname.split("/").filter(Boolean);
  const templateParts = template.split("/").filter(Boolean);

  if (pathParts.length !== templateParts.length) {
    return null;
  }

  const params = {};

  for (let index = 0; index < templateParts.length; index += 1) {
    const templatePart = templateParts[index];
    const pathPart = pathParts[index];

    if (templatePart.startsWith(":")) {
      params[templatePart.slice(1)] = decodeURIComponent(pathPart);
      continue;
    }

    if (templatePart !== pathPart) {
      return null;
    }
  }

  return params;
};
