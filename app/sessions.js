import { sessionCookie } from "./cookies"
import { createCookieSessionStorage, redirect } from "remix";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
      cookie: {
          sessionCookie
    },
  });

  export async function requireUserSession(request) {
    // get the session
    const cookie = request.headers.get("cookie");
    const session = await getSession(cookie);
  
    // validate the session, `userId` is just an example, use whatever value you
    // put in the session when the user authenticated
    if (!session.has("userId")) {
      // if there is no user session, redirect to login
      throw redirect("/login");
    }
  
    return session;
  }

export { getSession, commitSession, destroySession };