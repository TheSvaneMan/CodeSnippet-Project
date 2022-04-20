import { useLoaderData } from "@remix-run/react";
import { Form, redirect } from "remix";
import sessionCookie from "../cookies"

export async function loader({request}) {
    const cookies = request.headers.get("Cookie");
    
    return (
        await sessionCookie.parse(
            { cookies }
        )
    )
}

export default function Index() {
    const { cookies } = useLoaderData();
    const string = JSON.stringify({ cookies });
    return (
        <div>
            <p>{string}</p>
        <Form method="post" reloadDocument>
            <button type="submit">Submit</button>
            </Form>
        </div>
    )
}

export async function action() {
    
    return redirect("/login", {
        headers: {
            "Set-Cookie": await sessionCookie.serialize({ userId: "1001" }),
          },
      });
}
