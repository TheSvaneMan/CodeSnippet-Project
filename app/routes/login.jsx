import { Form, redirect, useActionData, useLoaderData } from "remix";
import { getSession, commitSession } from "~/sessions";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return { userID: session.get("userID") };
}

export default function Index() {
  const { userID } = useLoaderData();
  const loginStatus = useActionData();

  if (userID != null) {
    return (
      <div>
        <p>{userID}</p>
        <Form method="post" action="/logout">
          <button type="submit">Log out</button>
        </Form>
      </div>
    );
  } else {
    return (
      <Form method="post" reloadDocument>
        <input type="text" name="username" placeholder="username"></input>
        <input type="text" name="password" placeholder="password"></input>
        <button type="submit">Log in</button>
        <h1 className="text-red-500"> {loginStatus} </h1>
      </Form>
    );
  }
}

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const db = await connectDb();
  const form = await request.formData();
  let data = "";
  
  
  const user = await db.models.user.findOne({
   username: form.get("username"),
  });
  if (user != null) {
    const isCorrectPassword = await bcrypt.compare(form.get("password"), user.password);
  
  if (user != null && isCorrectPassword == true) {
    session.set("userID", user._id);
    return redirect("/login", {
      headers: {
      "Set-Cookie": await commitSession(session),
      },
      });
  }
  else {
    data = "wrong login or password";
    return data;
    }
  }
  else {
    data = "wrong login or password";
    return data;
    }
}
