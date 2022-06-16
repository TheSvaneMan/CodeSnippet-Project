import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  Link,
  useCatch,
  json,
} from "remix";
import { getSession, commitSession } from "~/sessions.server";
import { useState, useEffect } from "react";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session) {
    throw new Response(`Couldn't handle login while offline`, {
      status: 404,
    });
  }
  return { userID: session.get("userID") };
}

export default function Index() {
  const { userID } = useLoaderData();
  const loginStatus = useActionData();
  const [networkState, setNetworkState] = useState();
  const [showSignUpWarning, setSignUpWarning] = useState(false);
  const navigate = useNavigate();

  // App network state

  useEffect(() => {
    // Update the document title using the browser API
    // Client
    if (navigator.onLine) {
      setNetworkState("online");
    } else {
      setNetworkState("offline");
    }
  }, []);
  
  function networkStateUpdate() {
    if (navigator.onLine) {
      setNetworkState("online");
    } else {
      setNetworkState("offline");
    }
  }

  // --------- UX ---------------- //
  const toggleSignUpWarning = (e) => {
    e.preventDefault();
    setSignUpWarning(!showSignUpWarning);
  };

  if (userID != null) {
    return redirect("/snippets");
  } else {
    return (
      <div
        id="SignInPage"
        className="grid grid-cols-1 justify-items-center align-middle min-h-full"
      >
        <h1 className="text-2xl font-bold my-4">Log in</h1>
        <Form method="post" reloadDocument className="w-56">
          <div id="login-input-fields" className="grid grid-cols-1 space-y-5">
            <input
              type="text"
              name="username"
              placeholder="username"
              className="py-1 px-2 rounded-lg dark:text-neutral-800 focus:outline-orange-400"
            ></input>
            <input
              type="password"
              name="password"
              placeholder="password"
              className="py-1 px-2 rounded-lg mt-4 dark:text-neutral-800 focus:outline-orange-400"
            ></input>
            {networkState === "online" ? (
              <button
                type="button"
                onClick={() => {
                  networkStateUpdate();
                  if (navigator.onLine) {
                    document.getElementById("login").click();
                  }
                }} // this button checks if online and clicks invisible logOut button
                className="mt-3 mb-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400"
              >
                Log in
              </button>
            ) : (
              <button
                type="button"
                disabled
                onClick={() => {
                  networkStateUpdate();
                }} // this button is showing if youre offline
                className="mt-3 mb-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-red-800 text-neutral-50 rounded-3xl"
              >
                Log in
              </button>
            )}
            <button
              type="submit"
              id="login" // this button submits the form, which logs the user in
              className="hidden"
            ></button>
          </div>
          <p className="text-red-500 font-bold my-3 text-center">
            {" "}
            {loginStatus}{" "}
          </p>
          <div className="flex justify-between">
            No account yet?
            {networkState === "online" ? (
                    <button
                      type="button"
                      onClick={() => {
                        networkStateUpdate();
                        if (navigator.onLine) {
                          return navigate("/signup");
                        }
                      }}
                      className="ml-5 hover:text-neutral-800 dark:hover:text-neutral-50 text-orange-400"
                    >
                      Sign up!
                    </button>
                  ) : (
                    <button
                  className="text-red-600 ml-5"
                  type="button"
                      onClick={() => {
                        networkStateUpdate();
                        setSignUpWarning(!showSignUpWarning);
                        // Warning -  could be added on all buttons
                      }}
                    >
                      Sign up!
                    </button>
                  )}
          </div>
        </Form>
        <div
          id="signUpWarning"
          className={showSignUpWarning ? "py-1 px-2 mt-4 my-10" : "hidden"}
        >
          <p>
            You are offline - to sign up, please make sure you have an internet
            connection to continue.
          </p>
        </div>
      </div>
    );
  }
}

export async function action({ request }) {
  console.log(request);
  try {
    const session = await getSession(request.headers.get("Cookie"));
    const db = await connectDb();
    const form = await request.formData();
    let data = "";

    const user = await db.models.user.findOne({
      username: form.get("username"),
    });
    if (user != null) {
      const isCorrectPassword = await bcrypt.compare(
        form.get("password"),
        user.password
      );

      if (user != null && isCorrectPassword == true) {
        session.set("userID", user._id);
        return redirect("/snippets", {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      } else {
        data = "wrong login or password";
        return data;
      }
    } else {
      data = "wrong login or password";
      return data;
    }
  } catch (error) {
    return json({
      errors: error.errors,
      message: "error message",
      status: 400,
    });
  }
}

export function ErrorBoundary({ error }) {
  return (
    <div className="grid grid-cols-1 bg-slate-900 p-4 rounded-lg shadow-lg mt-5 space-y-10">
      <h1>You are already logged in :)</h1>
      <b>
        We could merely prevent this from happening but I want to show this
        error that occurs
      </b>
      <div className="px-10 animate-pulse transition delay-300">
        <h1 className="text-white font-bold">
          {error.name}: {error.message}
        </h1>
      </div>
      <Link
        to="/"
        className="py-1 px-4 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400"
      >
        Check your snippets
      </Link>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div className="grid grid-cols-1 bg-slate-900 p-4 rounded-lg shadow-lg mt-5 space-y-10">
      <h3>Sorry, you cannot login while offline</h3>
      <p>Please make sure you have an internet connection and try again.</p>
      <div className="px-10 animate-pulse transition delay-300">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <h2>
          <b>{caught.data}</b>
        </h2>
      </div>
      <Link
        to="/"
        className="ml-3 transition hover:bg-slate-500 bg-slate-600 p-4 rounded-lg"
      >
        Return to Home Page :)
      </Link>
    </div>
  );
}
