import { sessionCookie } from "./cookies"
import { createCookieSessionStorage } from "remix";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
      cookie: {
          sessionCookie
    },
  });

export { getSession, commitSession, destroySession };