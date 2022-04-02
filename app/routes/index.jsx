import { useLoaderData, Link, Links } from "remix";
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
        <div className="p-6 flex flex-col items-start h-screen bg-neutral-800 text-neutral-50">
          <h2 className="text-lg font-bold mb-4">
            Filters:
          </h2>
          <input type="text" placeholder="Search..." className="pt-1 pb-1 pr-2 pl-2 border-2 border-orange-400"
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
                <button className="text-left mb-2" key={i} onClick={() => toggle(i)}>{i+1+". "+book.title}</button>
              );
            })}
          
          
          </div>
        </div>
        <div className="m-6 w-1/2">
          <h2 className="text-lg font-bold mb-3">
            Snippet code:
          </h2>
          {sortedBooks.map((book, i) => {
            return (
              <div className={show == i ? 'block' : 'hidden'} key={book._id} id={book._id}>
                <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
                <h1>
                  Date: {book.date}
                </h1>
                <h1>
                  ID: {book._id}
                </h1>
                <h1>
                  Description: {book.description}
                </h1>
            
                <h1>
                  Favorite: <b>{book.favorite ? 'Yes' : 'No'}</b>
                </h1>

                {/* Adding to favorite with Form and POST */}
                <form method="post" action="./books/favorite">
                  <input type="hidden" name="inputID" value={book._id}></input>
                  <input type="hidden" name="favorite" value={book.favorite}></input>
                  <button type="submit" className="mt-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Toggle favorite</button>
                </form>
          
                {/* Deleting post method with Form and POST */}
                <form method="post" action="./books/delete">
                  <input type="hidden" name="inputID" value={book._id}></input>
                  <button type="submit" className="mt-2 mb-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Delete</button>
                </form>
          
                {/* Editing post method with passing ID in the link */}
                <Link to={`books/${book._id}/update`} className="mt-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Update</Link>
              
                
          
              </div>
          
          
            );
          })}
        </div>
      </section>
    );

  }

