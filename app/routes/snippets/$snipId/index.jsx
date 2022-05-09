import { useLoaderData, Link, useFormAction, json, redirect, useCatch } from "remix";
import connectDb from "~/db/connectDb.server.js";
import React, { useState } from 'react';
import { requireUserSession } from "~/sessions.server";


export async function loader({ params, request }) {
  await requireUserSession(request);
  const db = await connectDb();
  const snippet = await db.models.snip.findById(params.snipId);
  if (!snippet) {
    throw new Response(`Couldn't find snippet with id ${params.snippetId}`, {
      status: 404,
    });
  }
  return json(snippet);
}


export default function SnipPage() {
  const snip = useLoaderData();
  const [show, setShow] = useState(null);
  const [sort, setSort] = useState("");

  return (
    <div key={snip._id} id={snip._id} className="grid grid-cols-1 p-2">
      <div id="Snippet-Data" className='grid grid-cols-1 space-y-2 '>
        <h1 className="text-2xl font-bold mb-2">{snip.title}</h1>
        <h1>
          <b>Date:</b> {snip.date}
        </h1>
        <h1>
          <b>Language:</b> {snip.language}
        </h1>
        <h1>
          <b>Description:</b> {snip.description}
        </h1>
        <div id="Code-block" className='my-10'>
          <b>Code:</b>
          <p>
            <code className='text-black bg-white'>
              {snip.code}
            </code>
          </p>
        </div>

        <h1>
          <b>Favorite:</b> {snip.favorite ? 'Yes' : 'No'}
        </h1>
      </div>

      <div id="Snippet-Form-Handler" className='grid grid-cols-3 justify-items-center mt-4'>
        {/* Deleting post method with Form and POST */}
        <form method="post" action={useFormAction("delete")}>
          <input type="hidden" name="inputID" value={snip._id}></input>
          <button type="submit" className="py-1 px-4 border-2 
                  border-orange-400 bg-neutral-900 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Delete</button>
        </form>

        {/* Adding to favorite with Form and POST */}
        <form method="post" action={useFormAction("favorite")}>

          <input type="hidden" name="favorite" value={snip.favorite}></input>
          <button type="submit" className="py-1 px-4 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Favorite</button>
        </form>



        {/* Editing post method with passing ID in the link */}
        <Link to="update" className="py-1 px-4 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Update</Link>
      </div>
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div className='grid grid-cols-1 bg-slate-900 p-4 rounded-lg shadow-lg mt-5 space-y-10'>
      <h3>Whoopsies</h3>
      <div className='px-10 animate-pulse transition delay-300'> 
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <h2><b>{caught.data}</b></h2>
      </div>
      <Link to="/" className="ml-3 transition hover:bg-slate-500 bg-slate-600 p-4 rounded-lg">
          Return to Home Page :)
      </Link>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
   
    <div className='grid grid-cols-1 bg-neutral-900 p-4 rounded-lg shadow-lg mx-5 space-y-10'>
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