import { redirect } from "@remix-run/node";
import { Link, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import { getSession } from "~/sessions.server";

export async function loader({ request }) {
  // get the session
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);

  if (!session.has("userID")) {
    // if there is no user session, redirect to login
    return redirect("/login");
  } else {
    return redirect("/snippets");
  }
}

export function ErrorBoundary() {
  const error = useRouteError();

  // 1. Handle expected "thrown" responses (formerly CatchBoundary)
  if (isRouteErrorResponse(error)) {
    return (
      <div className="grid grid-cols-1 bg-neutral-900 p-4 rounded-lg shadow-lg mt-5 space-y-10">
        <h3>Whoopsies</h3>
        <div className="px-10 animate-pulse transition delay-300">
          <h1>
            {error.status} {error.statusText}
          </h1>
          <h2>
            <b>{error.data}</b>
          </h2>
        </div>
        <Link
          to="/"
          className="ml-3 transition hover:bg-neutral-500 bg-neutral-600 p-4 rounded-lg"
        >
          Return to Home Page :)
        </Link>
      </div>
    );
  }

  // 2. Handle unexpected runtime errors (formerly ErrorBoundary)
  let errorMessage = "Unknown error occurred";
  let errorName = "Error";

  if (error instanceof Error) {
    errorMessage = error.message;
    errorName = error.name;
  }

  return (
    <div className="grid grid-cols-1 bg-neutral-900 p-4 rounded-lg shadow-lg mt-5 space-y-10">
      <h3>Whoopsies, Error found:</h3>
      <div className="px-10 animate-pulse transition delay-300">
        <h1 className="text-white font-bold">
          {errorName}: {errorMessage}
        </h1>
      </div>
      <Link
        to="/"
        className="ml-3 transition hover:bg-neutral-500 bg-neutral-600 p-4 rounded-lg"
      >
        Return to Home Page :)
      </Link>
    </div>
  );
}
