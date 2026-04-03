const DEFAULT_BODY_LIMIT = 1_000_000;

const getAllowedOrigin = () => process.env.CORS_ORIGIN || "http://localhost:8080";

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

export const setCorsHeaders = (res) => {
  res.setHeader("Access-Control-Allow-Origin", getAllowedOrigin());
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Request-ID");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400");
};

export const handleCors = (req, res) => {
  setSecurityHeaders(res);
  setCorsHeaders(res);

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
    "Cache-Control": statusCode === 200 ? "public, max-age=60" : "no-cache, no-store, must-revalidate"
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
