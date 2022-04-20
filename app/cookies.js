import { createCookie } from "@remix-run/{runtime}";

export const sessionCookie = createCookie("__session", {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
});