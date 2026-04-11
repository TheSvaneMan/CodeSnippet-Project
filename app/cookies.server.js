import { createCookie } from "@remix-run/node";

export const sessionCookie = createCookie("__session", {
  // Use an environment variable for the secret!
  secrets: [process.env.SESSION_SECRET || "default_secret_for_dev"],
  sameSite: "lax",
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
});
