import { redirect, Link, useCatch } from "remix";
import { getSession } from "~/sessions.server";

export async function loader({ request }) {
    // get the session
    const cookie = request.headers.get("cookie");
    const session = await getSession(cookie);

    if (!session.has("userID")) {
        // if there is no user session, redirect to login
        return redirect("/login");
    }
    else {
        return redirect("/snippets");
    }
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div className='grid grid-cols-1 bg-neutral-900 p-4 rounded-lg shadow-lg mt-5 space-y-10'>
      <h3>Whoopsies</h3>
      <div className='px-10 animate-pulse transition delay-300'> 
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <h2><b>{caught.data}</b></h2>
      </div>
      <Link to="/" className="ml-3 transition hover:bg-neutral-500 bg-neutral-600 p-4 rounded-lg">
          Return to Home Page :)
      </Link>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
   
    <div className='grid grid-cols-1 bg-neutral-900 p-4 rounded-lg shadow-lg mt-5 space-y-10'>
      <h3>Whoopsies, Error found:</h3>
      <div className='px-10 animate-pulse transition delay-300'> 
         <h1 className="text-white font-bold">
            {error.name}: {error.message}
        </h1>
      </div>
      <Link to="/" className="ml-3 transition hover:bg-neutral-500 bg-neutral-600 p-4 rounded-lg">
          Return to Home Page :)
      </Link>
    </div>
  );
}