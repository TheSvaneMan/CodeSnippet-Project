import { createCookie } from "@remix-run/node";

export const sessionCookie = createCookie("__session", {
  httpOnly: true,
  expires: new Date(Date.now() + 60_000),
  maxAge: 60 * 60 * 24 * 7,
  secrets: [process.env.COOKIE_SECRET],
});

// console.log(sessionCookie.isSigned); // true