import { useLoaderData, Link } from "remix";
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
        <ul className="ml-5 list-disc">
          {books.map((book, i) => {
            let checkID = "check" + book._id
            return (
              <li key={book._id}>
                <input id={checkID} onClick={() =>toggle(i)} type="checkbox"/><label>{book.title}</label>
              </li>
            );
          })} 
        </ul>
      </div>
      <div className="m-6">
        <h2 className="text-lg font-bold mb-3">
          Code:
        </h2>
        {books.map((book, i) => {
          let codeID = "code" + book._id
          return (
              
            <div className={show == i ? 'block' : 'hidden'}  key={book._id} id={codeID}>
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
            </div>
          
              );
            })} 
      </div>
    </section>
  );

}
