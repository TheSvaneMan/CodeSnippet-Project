import { useLoaderData, Link, useFormAction, json, useCatch } from "remix";
import connectDb from "~/db/connectDb.server.js";
import React, { useState } from 'react';
import { getSession, requireUserSession } from "~/sessions.server";
import SnipView from '~/components/snipView';

export function headers({
  actionHeaders,
  loaderHeaders,
  parentHeaders,
}) {
  return {
    "Cache-Control": "private, max-age=300",
  };
}

export async function loader({ params, request }) {
  await requireUserSession(request);
  const db = await connectDb();
  const snippet = await db.models.snip.findById(params.snipId);
  if (!snippet) {
    throw new Response(`Couldn't find snippet with id ${params.snippetId}`, {
      status: 404,
    });
  }
  let snippetResponseObject = {
    currentSnippet: snippet,
    url: request.url,
    owner: false,
    userID: ""
  }
  const session = await getSession(request.headers.get("Cookie"));
  const userID = session.get("userID");
  snippetResponseObject.userID = userID;
  if (snippet.user === userID) {
    snippetResponseObject.owner = true
  }
  return json(snippetResponseObject, { status: 200, headers: { 'cache-control': 'private, max-age=604800, stale-while-revalidate' } });
}

export default function SnipPage() {
  const snippetData = useLoaderData();
  const [show, setShow] = useState(null);
  const [sort, setSort] = useState("");
  const [networkState, setNetworkState] = useState();
  const [shareSnippet, setShareSnippet] = useState(false);

  // We can use snippetData as an struct to pass data
  const snip = snippetData.currentSnippet;
  const snippetURL = snippetData.url;
  const userSnippetOwner = snippetData.owner;
  const userID = snippetData.userID;

  // Add Tags
  const toggleShareSnippet = (e) => {
    e.preventDefault();
    setShareSnippet(!shareSnippet);
  }

  // Copy to clipboard function
  const copySnippetURL = (e) => {
    e.preventDefault();
    /* Get the text field */
    var copyText = document.getElementById("snippetURL");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);

    /* Alert the copied text */
    alert("Copied the snippet url: " + copyText.value);
  }

  return (
    <div key={snip._id} id={snip._id} className="grid grid-cols-1 lg:col-span-3 p-4">
      {
        // Different experience depending whether current user owns the snippet or not
        userSnippetOwner ? <SnippetViewer snip={snip} userID={userID} userSnippetOwner={userSnippetOwner} toggleShareSnippet={toggleShareSnippet} shareSnippet={shareSnippet} snippetURL={snippetURL} copySnippetURL={copySnippetURL} /> :
        snip.shareable ? <SnippetViewer snip={snip} userID={userID} userSnippetOwner={userSnippetOwner} toggleShareSnippet={toggleShareSnippet} shareSnippet={shareSnippet} snippetURL={snippetURL} copySnippetURL={copySnippetURL} /> :
        <SnippetPrivate />
      }
    </div>
  )
}

// ----------- Snippet Viewer Component ------------------- //
function SnippetViewer({ snip, userID, userSnippetOwner, toggleShareSnippet, shareSnippet, snippetURL, copySnippetURL}) {
  return (
    <div id="snippet-view">
      <SnipView snip={snip} />
      <div id="Snippet-Form-Handler" className='grid grid-cols-2 md:grid-cols-5 justify-items-center gap-5 lg:flex'>
        {
          userSnippetOwner ? <>  
            <UpdateSnippet />
            <FavoriteSnippet snip={snip} />
            <DeleteSnippet snip={snip} />
          </>
            : null
        }
        {
          shareSnippet ? <ShareSnippet copySnippetURL={copySnippetURL} snippetURL={snippetURL} /> : null
        }
        {
          userSnippetOwner ? <TogglePrivacy snip={snip} />
            : <FollowUpdates snip={snip} userID={userID} />
        }
        <ToggleShareSnippet toggleShareSnippet={toggleShareSnippet} shareSnippet={shareSnippet} />     
      </div>
    </div>
  )
}

// ------------- Private Snippet Alert Message -------------- //
// Will definitely be better to handle this in the loader, to prevent private data being passed in the first place.
// For now, visually - it does the trick but for privacy and security concerns it is not the best. 
function SnippetPrivate() {
  return (
    <div id="private-code" className='grid grid-cols-1 lg:col-span-3 p-4 animate-pulse'>
      <h1>
        Sorry, seems like the owner of this snippet has made it private - you are unable to view it at this time.
      </h1>
    </div>
  )
}

// ------------- Snippet Interaction Components -------------- //
// We could further improve this by moving them to dedicated component folders: decoupling the files.
function ShareSnippet({ copySnippetURL, snippetURL }) {
  return (
    <div className='grid grid-cols-1 lg:col-span-3 space-y-4 bg-neutral-900 p-4 border-2 border-orange-400 rounded-lg text-neutral-50'>
      <h1>Share your code snippet</h1>
      <input className='bg-neutral-900 p-2 border-2 border-orange-300 rounded-lg text-neutral-50' id="snippetURL" defaultValue={snippetURL} />
      <button className="py-1 px-4 border-2 
                  border-orange-400 bg-neutral-900 text-neutral-50 rounded-3xl
                  hover:bg-orange-400" onClick={copySnippetURL}>Copy link</button>
      <input placeholder="email" type="text" />
    </div>
  )
}

function DeleteSnippet({ snip }) {
  return (
    <form method="post" action={useFormAction("delete")}>
    <input type="hidden" name="inputID" value={snip._id}></input>
    <button type="submit" className="py-1 px-4 border-2
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400 lg:mr-4">Delete</button>
  </form>)
 
}
function FavoriteSnippet({ snip }) {
  return (
    <form method="post" action={useFormAction("favorite")}>

          <input type="hidden" name="favorite" value={snip.favorite}></input>
          <button type="submit" className="py-1 px-4 border-2 lg:mr-4 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Favorite</button>
    </form>
  )
}

function ToggleShareSnippet({toggleShareSnippet, shareSnippet}) {
  return (
    <button type="submit" className="py-1 px-4 border-2 lg:mr-4 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400" onClick={toggleShareSnippet}>{shareSnippet ? "Close" : "Share"}</button>

  )
}

function UpdateSnippet() {
  return (
    <Link to="update" className="py-1 px-4 border-2 lg:mr-4 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Update</Link>
  )
}
function TogglePrivacy({ snip }) {
  return (
    <form method="post" action={useFormAction("shareable")}>

      <input type="hidden" name="shareable" value={snip.shareable}></input>
      <button type="submit" className="py-1 px-4 border-2 lg:mx-4 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">{snip.shareable ? 'public' : 'private'}</button>
    </form>
  )
}

function FollowUpdates({ snip, userID }) {
  return (
    <form method="post" action={useFormAction("followSnip")}>
      <input type="hidden" name="userID" value={userID} />
      <input type="hidden" name="followSnip" value={snip.following}></input>
      <button type="submit" className="py-1 px-4 border-2 lg:mx-4 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">{snip.following ? 'unfollow' : 'follow'}</button>
    </form>
  )
}

// --------------- Error Handling ------------------------------------------------- //
export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div className='grid grid-cols-1 lg:col-span-3 bg-neutral-900 p-4 rounded-lg shadow-lg mt-5 space-y-10'>
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

    <div className='grid grid-cols-1 lg:col-span-3 bg-neutral-900 p-4 rounded-lg shadow-lg mx-5 space-y-10'>
      <h3>Oh no, seems like we couldn't find that snippet:</h3>
      <div className='px-10 animate-pulse transition delay-300'>
        <p className="text-white font-bold">
          {error.name}: {error.message}
        </p>
      </div>
      <Link to="/" className="py-1 px-4 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Try clicking on another snippet</Link>
    </div>
  );
}