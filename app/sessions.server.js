import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { sessionCookie } from "./cookies.server";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: sessionCookie,
  });

export async function requireUserSession(request) {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);

  if (!session.has("userID")) {
    throw redirect("/login");
  }

  return session;
}

export { getSession, commitSession, destroySession };
