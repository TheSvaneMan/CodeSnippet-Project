import bcrypt from "bcryptjs/dist/bcrypt";
import { Form, redirect, json, useActionData, Link} from "remix";
import connectDb from "~/db/connectDb.server";
import { getSession, commitSession } from "~/sessions.server";

export async function action({ request }) {
  const form = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));
  const db = await connectDb();

  if (form.get("password").trim() !== form.get("repeatPassword").trim()) {
    return json(
      { errorMessage: "Passwords are not the same!" },
      { status: 400 }
    );
  }
  if (form.get("password").trim()?.length < 8) {
    return json(
      { errorMessage: "Password is too short!" },
      { status: 400 }
    );
  }

    const hashedPassword = await bcrypt.hash(form.get("password").trim(),10);
  try {
    let user = await db.models.user.create({ username: form.get("username"), password: hashedPassword });
    if (user) {
      session.set("userID", user._id);
      return redirect("/snippets", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } else {
      return json(
        { errorMessage: "User couldn't be created" },
        { status: 400 }
      );
    }
  } catch (error) {
      return json(
        {
          errorMessage:
            error.message ??
            error.errors?.map((error) => error.message).join(", "),
        },
        { status: 400 }
      );
    }
};

export default function SignUp() {
  const actionData = useActionData();
  return (
    <div id="SignUpPage" className='grid grid-cols-1 justify-items-center align-middle min-h-full'>
      <h1 className="text-2xl font-bold my-4">Sign up</h1>
      <Form method="post" className="w-56">
      <div id="signup-input-fields" className='grid grid-cols-1 space-y-5'>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="username"
          className="py-1 px-2 rounded-lg dark:text-neutral-800 focus:outline-orange-400"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="password"
          className="py-1 px-2 rounded-lg mt-4 dark:text-neutral-800 focus:outline-orange-400"
        />
        <input
          type="password"
          name="repeatPassword"
          id="repeatPassword"
          placeholder="repeat password"
          className="py-1 px-2 rounded-lg mt-4 dark:text-neutral-800 focus:outline-orange-400"
        />
        <button type="submit" className="mt-3 mb-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Register</button>
        {actionData?.errorMessage ? (
        <p className="text-red-500 font-bold my-3">{actionData.errorMessage}</p>
          ) : null}
          <div className="text-center">
          You have an account?
          <Link to="/login" className="ml-5 hover:text-neutral-50 text-orange-400">
          Log in!
          </Link>
          </div>
          </div>
      </Form>
    </div>
  );
}
