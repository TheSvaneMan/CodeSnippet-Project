import { redirect } from "remix";
import { getSession, destroySession } from "../sessions.server";

export async function loader({ request }) {
    const session = await getSession(request.headers.get("Cookie"));

    return redirect("/", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}
