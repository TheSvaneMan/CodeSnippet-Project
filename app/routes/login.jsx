import { useLoaderData } from "@remix-run/react";
import { Form, redirect } from "remix";
import { getSession, commitSession } from "~/sessions";

export async function loader({request}) {
    const session = await getSession(request.headers.get("Cookie"));
    
    return (
        { userID: session.get("userID") }
    )
}

export default function Index() {
    const { userID }  = useLoaderData();
    return (
        <div>
            <p>{userID}</p>
            
            <Form method="post" reloadDocument>
            <button type="submit">Log in</button>
            </Form>

            <Form method="post" action="/logout">
            <button type="submit">Log out</button>
            </Form>
        </div>
    )
}

export async function action({ request }) {
    const session = await getSession(request.headers.get("Cookie"));
    session.set( "userID", "1001" )
    
    return redirect("/login", {
        headers: {
            "Set-Cookie": await commitSession(session),
          },
      });
}
