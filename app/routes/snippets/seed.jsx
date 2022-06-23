import { useLoaderData, json, Link, Form, redirect, useCatch } from "remix";
import connectDb from "~/db/connectDb.server";
import { requireUserSession } from "~/sessions.server";
import snippetSeed from "~/db/seed.json";
import { useNavigate } from "react-router-dom";

export async function loader({ request }) {
  const db = await connectDb();
  const currentSnippetAmount = await db.models.snip.countDocuments();
  await requireUserSession(request);
  return json(currentSnippetAmount);
}

export async function action({ request }) {
  const form = await request.formData();
  const params = form._fields;
  console.log(params);
  const db = await connectDb();
  try {
    // Delete all Snippets on Database if not already empty
    if (params.snippetCount.toString() !== "0") {
      const deletedManySnippets = await db.models.snip.deleteMany();
      // Inset Default Seed to Database
      const insertDefaultSeedSnippets = await db.models.snip.insertMany(
        snippetSeed
      );
      return redirect("/snippets");
    } else {
      const insertDefaultSeedSnippets = await db.models.snip.insertMany(
        snippetSeed
      );
      return redirect("/snippets");
    }
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function Index() {
  const snippetCount = useLoaderData();
  const snippetJSON = snippetSeed;
  const navigate = useNavigate();
  return (
    <Form method="post" className="p-4" name="seedForm">
      <h1 className="text-2xl mb-5">Seeding the database</h1>
      <h2 className="text-xl mb-10">
        You currently have <b>{snippetCount}</b> snipppets in your database.
      </h2>
      {snippetCount === 0 ? (
        <>
          <p className="mb-4 text-lg">
            Would you like to repopulate your database with{" "}
            <b>{snippetJSON.length}</b> default snippets?
          </p>
        </>
      ) : (
        <>
          <p className="mb-4 text-lg">
            Do you want to delete them and re-seed the database with{" "}
            <b>{snippetJSON.length}</b> default snippets?
          </p>
          <p id="blackBox" className="text-red-500 bg-black rounded-lg p-4">
            You are about to reseed your database, are you sure you want to
            continue? This action is irreversible.
          </p>
        </>
      )}
      <div id="seed-options" className="grid grid-cols-2 mt-5">
        <input
          type="hidden"
          id="snippetCount"
          name="snippetCount"
          defaultValue={snippetCount}
        />
        {/* <input type="submit" name="acceptSeed" id="acceptSeed" value="Accept" className="text-white transition hover:bg-red-600 bg-red-800 m-4 rounded-lg h-10" /> */}
        <button
          type="button"
          onClick={() => {
            if (navigator.onLine) {
              document.seedForm.submit();
            }
            else {
              document.getElementById('blackBox').innerHTML = "<br/>You are not connected to the internet<br/><br/>";
            }
          }}
          className="text-white transition hover:bg-red-600 bg-red-800 m-4 rounded-lg h-10"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => {
            if (navigator.onLine) {
              return navigate("/snippets");
            }
            else {
              document.getElementById('blackBox').innerHTML = "<br/>You are not connected to the internet<br/><br/>";
            }
          }}
          className="text-white transition hover:bg-blue-500 bg-blue-600 text-center rounded-lg m-4 h-10 leading-10"
        >
          Decline
        </button>
      </div>
    </Form>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <h2>{caught.data}</h2>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <h1 className="text-red-500 font-bold">
      {error.name}: {error.message}
    </h1>
  );
}
