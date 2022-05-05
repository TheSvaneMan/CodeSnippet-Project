import { Form, redirect, useActionData, useLoaderData, Link } from "remix";
import { getSession, commitSession } from "~/sessions.server";
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
    return redirect("/snippets");
  } else {
    return (
      <div className="m-6 w-1/2">
      <h1 className="text-2xl font-bold mb-4">Log in</h1>
      <Form method="post" reloadDocument>
        <input type="text" name="username" placeholder="username" className="py-1 px-2 rounded-lg dark:text-neutral-800 focus:outline-orange-400"></input>
        <br />
        <input type="text" name="password" placeholder="password" className="py-1 px-2 rounded-lg mt-4 dark:text-neutral-800 focus:outline-orange-400"></input>
        <br />
        <button type="submit" className="mt-3 mb-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Log in</button>
          <p className="text-red-500 font-bold my-3"> {loginStatus} </p>
          No account yet?
          <Link to="/signup" className="ml-5 hover:text-neutral-50 text-orange-400">
          Sign up!
          </Link>
        </Form>
        </div>
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
    return redirect("/snippets", {
      headers: {
      "Set-Cookie": await commitSession(session),
      },
      });
  }
  else {
    data = "Wrong login or password!";
    return data;
    }
  }
  else {
    data = "Wrong login or password!";
    return data;
    }
}
