import { redirect } from "remix";
import { getSession } from "~/sessions.server";

export async function loader({ request }) {
  
    // get the session
    const cookie = request.headers.get("cookie");
    const session = await getSession(cookie);
    
    if (!session.has("userID")) {
        // if there is no user session, redirect to login
        return redirect("/login");
    }
    else {
        return redirect("/snippets");
    }
}