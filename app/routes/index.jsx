import { useLoaderData, Link, Links, Outlet } from "remix";
import connectDb from "~/db/connectDb.server.js";
import React, { useRef, useState } from 'react';

export async function loader() {
  const db = await connectDb();
  const books = await db.models.Book.find();
  return books;
}

export default function Index() {
  const books = useLoaderData();
  const [show, setShow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("");

  // sorting
  let sortedBooks;
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




    const toggle = (i) => {
      if (show == i) {
        return setShow(null)
      }
      setShow(i);
      console.log(books);
    }

    return (
      <section className="flex">
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
    );

  }

