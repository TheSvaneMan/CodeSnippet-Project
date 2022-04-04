import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "remix";
import styles from "~/tailwind.css";
import connectDb from "~/db/connectDb.server.js";
import React, { useRef, useState } from 'react';

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export function meta() {
  return {
    charset: "utf-8",
    title: "KeepSnip",
    viewport: "width=device-width,initial-scale=1",
  };
}

export async function loader() {
  const db = await connectDb();
  const books = await db.models.Book.find();
  return books;
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("");
  const books = useLoaderData();

  // sorting
  let sortedBooks = [];
  if (sort == "sortByName") {
    sortedBooks = [...books].sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });;
  }
  else if (sort == "showFavorite") {
    sortedBooks = books.filter(function (book) {
      return book.favorite == true;
    })
  }

  else {
    sortedBooks = books;
  }
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 text-slate-800 font-sans">
        <header className="p-4 border-b-4 border-orange-400 bg-neutral-800">
          <Link to="/" className="hover:text-orange-400 text-neutral-50 text-3xl mr-28">
            KeepSnip
          </Link>
          <Link to="/books/new" className="ml-5 hover:text-neutral-50 text-orange-400">
            New code snippet
          </Link>
          <Link to="/books/seed" className="ml-5 hover:text-neutral-50 text-orange-400">
            Defualt snippets
          </Link>
        </header>
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
              {sortedBooks.filter((book) => {
                if (searchTerm == "") {
                  return book
                }
                else if (book.title.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
                  return book
                }
              }).map((book, i) => {
                return (
                  <Link to={`/books/${book._id}`} key={book._id}>{i+1+". "+book.title}</Link>
                  //<button className="text-left mb-2" key={i} onClick={() => toggle(i)}>{i+1+". "+book.title}</button>
                );
              })}
            </div>
          </div>
          <Outlet/>
        </section>
        
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
