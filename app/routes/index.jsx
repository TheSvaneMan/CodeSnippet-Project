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

  const toggle = (i) => {
    if (show == i) {
      return setShow(null)
    }
    setShow(i);
    //console.log(books);
  }

  return (
    <section className="flex">
      <div className="m-6">
      <h2 className="text-lg font-bold mb-3">
      Categories:
        </h2>
      </div>
      <div className="m-6">
        <h2 className="text-lg font-bold mb-3">
          Code snippets:
        </h2>
        <div className="ml-5 list-disc flex flex-col">
          {books.map((book, i) => {
            return (
              <button className="text-left" key={book._id} onClick={() => toggle(i)}>{book.title}</button>
              
            );
          })} 
        </div>
      </div>
      <div className="m-6">
        <h2 className="text-lg font-bold mb-3">
          Code:
        </h2>
        {books.map((book, i) => {
          return (
            <div className={show == i ? 'block' : 'hidden'}  key={book._id} id={book._id}>
          <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
          <h1>
            Author: {book.author}
          </h1>
          <h1>
            Price: {book.price}USD
          </h1>
          <h1>
            ID: {book._id}
          </h1>
          <h1>
            Description: {book.description}
          </h1>
          
          {/* Deleting post method with Form and POST */}
          <form method="post" action="./books/delete">
          <input type="hidden" name="inputID" value={book._id}></input>
          <button type="submit">Delete</button>
          </form>
          
          {/* Editing post method with passing ID in the link */}
          <Link to={`books/${book._id}/update`}>Update</Link>
              
            </div>
          
          
              );
            })} 
      </div>
    </section>
  );

}
