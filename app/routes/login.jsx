import { Form, redirect, useActionData, useLoaderData } from "remix";
import { getSession, commitSession } from "~/sessions";
import connectDb from "~/db/connectDb.server";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));

  return { userID: session.get("userID") };
}

export default function Index() {
  const { userID } = useLoaderData();
  const login = useActionData();
  if (userID != null) {
    return (
      <div>
        <p>{userID}</p>
        <Form method="post" action="/logout">
          <button type="submit">Log out</button>
          <h1>You logged in!</h1>
          {/*login.data.ok ? (
            <p>You logged in!
              {login.data.ok}
            </p>

          ) : login.data.error ? (
            <p data-error>{login.data.error}</p>
          ) : null*/}
        </Form>
      </div>
    );
  } else {
    return (
      <Form method="post" reloadDocument>
        <input type="text" name="username" placeholder="username"></input>
        <input type="text" name="password" placeholder="password"></input>
        <button type="submit">Log in</button>
      </Form>
    );
  }
}

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const db = await connectDb();
  const form = await request.formData();
  const user = await db.models.user.findOne({
    username: form.get("username"),
    password: form.get("password"),
  });
  
  if (user != null) {
    session.set("userID", user._id);
    let data = {
      ok: "you logged in!"
    };
  }
  else {
    let data = {
      error: "wrong login or password"
    };
    //return json data property, with ok and error "wrong password" - becomes actionData
    // remove redirect("/login");
  }
  return redirect("/login", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
