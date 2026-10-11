import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function sessionToken(): string {
  // Deriving the token from the password means rotating the password
  // immediately invalidates existing sessions
  return createHmac("sha256", adminPassword()).update("portfolio-admin-v1").digest("hex");
}

export function checkPassword(input: string): boolean {
  const expected = Buffer.from(adminPassword());
  const provided = Buffer.from(input);
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

export async function isAuthed(): Promise<boolean> {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  return Boolean(value) && value === sessionToken();
}

export async function signIn(): Promise<void> {
  (await cookies()).set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function signOut(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

export function isDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD;
}
