import { useLoaderData, Link, Links, Outlet } from "remix";
import connectDb from "~/db/connectDb.server.js";
import React, { useRef, useState } from 'react';

export async function loader() {
  const db = await connectDb();
  const snipps = await db.models.Book.find();
  return snipps;
}

export default function Index() {
  const snipps = useLoaderData();
  const [show, setShow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("");

  // sorting
  let sortedsnipps = [];
  if (sort == "sortByName") {
    sortedsnipps = [...snipps].sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });;
  }
  else if (sort == "showFavorite") {
    sortedsnipps = snipps.filter(function (book) {
      return book.favorite == true;
    })
  }

  else {
    sortedsnipps = snipps;
  }

    return (
      <section className="flex">
          <div className="p-6 flex flex-col items-start h-screen bg-neutral-800 text-neutral-50">
            <h2 className="text-lg font-bold mb-4">
              Filters:
            </h2>
            <input type="text" placeholder="Search..." className="rounded-3xl pt-1 pb-1 pr-2 pl-2 border-2 border-orange-400"
              name="search" onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
            />
            <button className="mt-4 hover:underline" onClick={() => setSort("")}>Sort by date</button>
            <button className="mt-4 hover:underline" onClick={() => setSort("sortByName")}>Sort by name</button>
            <button className="mt-4 hover:underline" onClick={() => setSort("showFavorite")}>Show favorite only</button>
          </div>
          <div className="p-6 flex flex-col items-start border-r-2 border-neutral-800">
            <h2 className="text-lg font-bold mb-3">
              Code snippets:
            </h2>
            <div className="list-disc flex flex-col">
              {sortedsnipps.filter((book) => {
                if (searchTerm == "") {
                  return book
                }
                else if (book.title.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
                  return book
                }
              }).map((book, i) => {
                return (
                  <Link to={`/snipps/${book._id}`} key={book._id}>{i+1+". "+book.title}</Link>
                );
              })}
          </div>
          </div>
          <Outlet/>
        </section>
    );

  }

