import { useLoaderData, Link } from "remix";
import connectDb from "~/db/connectDb.server.js";
import React, { useRef, useState } from 'react';

export async function loader({ params }) {
  const db = await connectDb();
  return db.models.Book.findById(params.bookId);
}



export default function BookPage() {
  const books = useLoaderData();
  const [show, setShow] = useState(null);
  const [sort, setSort] = useState("");

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

  return (
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
  );
}
