import bcrypt from "bcryptjs/dist/bcrypt";
import { Form, redirect, json, useActionData } from "remix";
import connectDb from "~/db/connectDb.server";
import { getSession, commitSession } from "~/sessions.server";

export async function action({ request }) {
  const form = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));
  const db = await connectDb();

    //hashedPassword ruins everything :(
    //if you remove it it works
    const hashedPassword = await bcrypt.hash(form.get("password").trim());
  
    await db.models.user.create({ username: form.get("username"), password: hashedPassword });
    let user = db.model.user;
    session.set("userID", user._id);
    return redirect("/snippets", {
      headers: {
      "Set-Cookie": await commitSession(session),
      },
      });
  
}

export default function SingUp() {
  const actionData = useActionData();
  return (
    <div className="m-6 w-1/2">
      <h1 className="text-2xl font-bold mb-4">Sign up</h1>
      <Form method="post">
        <label htmlFor="username" className="block font-bold">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="py-1 px-2 rounded-lg"
        />
        {actionData?.errors.username && (
          <p className="text-red-500">{actionData.errors.username.message}</p>
        )}
        
        <label htmlFor="language" className="block font-bold">
        Password
        </label>
        <input
          type="text"
          name="password"
          id="password"
          className="py-1 px-2 rounded-lg"
        />
        {actionData?.errors.password && (
          <p className="text-red-500">{actionData.errors.password.message}</p>
        )}
    
        <button type="submit" className="mt-3 mb-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Register</button>
      </Form>
    </div>
  );
}
