import { jwtVerify, SignJWT } from "jose";

const ADMIN_SECRET = new TextEncoder().encode("sp-pickles-admin-demo-secret");

export type AdminTokenPayload = {
  sub: string;
  role: "admin";
  email: string;
};

export const createAdminToken = async (email: string) =>
  new SignJWT({
    role: "admin",
    email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(ADMIN_SECRET);

export const verifyAdminToken = async (token: string) => {
  try {
    const result = await jwtVerify(token, ADMIN_SECRET);
    return result.payload as unknown as AdminTokenPayload;
  } catch {
    return null;
  }
};
