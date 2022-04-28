import { useLoaderData, Link, useFormAction, redirect } from "remix";
import connectDb from "~/db/connectDb.server.js";
import React, { useState } from 'react';
import { requireUserSession } from "~/sessions";


export async function loader({ params, request }) {
  const session = await requireUserSession(request);
  const db = await connectDb();
  return await db.models.snip.findById(params.snipId);
}

 
export default function snipPage() {
  const snip = useLoaderData();
  const [show, setShow] = useState(null);
  const [sort, setSort] = useState("");


  return (
    <div className="m-6 w-1/2">
          
              <div key={snip._id} id={snip._id}>
                <h1 className="text-2xl font-bold mb-4">{snip.title}</h1>
                <h1>
                <b>Date:</b> {snip.date}
                </h1>
                <h1>
                <b>Language:</b> {snip.language}
                </h1>
                <h1>
                <b>Description:</b> {snip.description}
                </h1>
                
                <p>
                 <b>Code:</b>
                  <pre>
                  <code>{snip.code}
                  </code>
                  </pre>
                </p>
                
                <h1>
                <b>Favorite:</b> {snip.favorite ? 'Yes' : 'No'}
                </h1>

                {/* Adding to favorite with Form and POST */}
                <form method="post" action={useFormAction("favorite")}>
                
                  <input type="hidden" name="favorite" value={snip.favorite}></input>
                  <button type="submit" className="mt-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Toggle favorite</button>
                </form>
          
                {/* Deleting post method with Form and POST */}
                <form method="post" action={useFormAction("delete")}>
                  <input type="hidden" name="inputID" value={snip._id}></input>
                  <button type="submit" className="mt-2 mb-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Delete</button>
                </form>
          
                {/* Editing post method with passing ID in the link */}
                <Link to="update" className="mt-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Update</Link>
              
                
      </div>
      
      
            </div>
          
            )
        
  
}
