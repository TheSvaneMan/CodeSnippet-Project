import { useLoaderData, json, Link, Form, redirect, useCatch } from "remix";
import connectDb from "~/db/connectDb.server";
import { getSession, requireUserSession } from "~/sessions.server";
import snippetSeed from "~/db/seed.json";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export async function loader({ request }) {
  const db = await connectDb();
  const currentSnippetAmount = await db.models.snip.countDocuments();
  await requireUserSession(request);
  return json(currentSnippetAmount);
}

export async function action({ request }) {
  const form = await request.formData();
  const snippetCount = form.get("snippetCount");
  const db = await connectDb();
  try {
    await requireUserSession(request);
    const session = await getSession(request.headers.get("Cookie"));
    const userID = session.get("userID");
    // Delete all Snippets on Database if not already empty
    if (snippetCount !== 0) {
      const deletedManySnippets = await db.models.snip.deleteMany({ user: userID });
      // Inset Default Seed to Database -> Data pumping to add more data

      snippetSeed.forEach((snippetData, i) => {
        CreateDefaultSnippets(db, snippetData, userID, i);
      });

      return redirect("/snippets");
    } else {
      snippetSeed.forEach((snippetData, i) => {
        CreateDefaultSnippets(db, snippetData, userID, i);
      });

      return redirect("/snippets");
    }
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

async function CreateDefaultSnippets(db, snippetData, userID, i) {
  const snipTitle = snippetData.title;
  let defaultSnippet = await db.models.snip.create({ title: snipTitle, language: snippetData.language, code: snippetData.code, description: snippetData.description, tags: snippetData.tags, favorite: snippetData.favorite, shareable: snippetData.shareable, user: userID.toString() });
}

export default function Index() {
  const snippetCount = useLoaderData();
  const snippetJSON = snippetSeed;
  const navigate = useNavigate();
  useEffect(() => {
    document.getElementById('showSnippsCheck').click();
  }, []);
  return (
    <Form method="post" className="p-4 lg:col-span-3" name="seedForm">
      <ReseedBanner snippetCount={snippetCount} />
      <ConditionalReseedBanner snippetCount={snippetCount} snippetJSON={snippetJSON} />
      <div id="seed-options" className="grid grid-cols-2 mt-5">
        <input
          type="text"
          id="snippetCount"
          name="snippetCount"
          defaultValue={snippetCount}
          className="hidden"
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

function ReseedBanner({ snippetCount }) {
  return (
    <>
      <h1 className="text-2xl mb-5">Seeding the database</h1>
      <h2 className="text-xl mb-10">
        You currently have <b>{snippetCount}</b> snipppets in your database.
      </h2>
    </>
  )
}

function ConditionalReseedBanner({ snippetCount, snippetJSON }) {
  return (
    <>
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
    </>
  )
}


export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
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