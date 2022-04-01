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

  // sort by name
  //How to make books = sortByName after the funcition runs?
  const sortByName = () => {
    books.sort(function (a, b) {
      const snipA = a.title.toString().toLowerCase();
      const snipB = b.title.toString().toLowerCase();
      if (snipA < snipB) {
        return -1;
      }
      if (snipA > snipB) {
        return 1;
      }
      return 0;
    });
  }

  //How to display add and update on the right side of the screen insead of another page?
  //Use router!
  
  //Do I import everything from these 2 pages, add it to Index() and display onClick like I did with snippet details?

  

  const toggle = (i) => {
    if (show == i) {
      return setShow(null)
    }
    setShow(i);
    console.log(books);
  }

  return (
    <section className="flex">
      <div className="m-6 flex flex-col">
      <h2 className="text-lg font-bold mb-3">
          Filters:
        </h2>
        <input type="text" placeholder="Search..." name="search" onChange={(event) => {
          setSearchTerm(event.target.value);
        }}
        />
        <button className="mt-6" onClick={() =>sortByName()}>Sort by name</button>
      </div>
      <div className="m-6">
        <h2 className="text-lg font-bold mb-3">
          Code snippets:
        </h2>
        <div className="ml-5 list-disc flex flex-col">
          { books.filter((book) => {
            if (searchTerm == "") {
              return book
            }
            else if (book.title.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
              return book
            }
          }).map((book, i) => {
            return (
              <button className="text-left" key={i} onClick={() => toggle(i)}>{book.title}</button>
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
            Date: {book.date}
          </h1>
          <h1>
            ID: {book._id}
          </h1>
          <h1>
            Description: {book.description}
              </h1>
            
          <h1>
                Favorite: <b>{book.favorite? 'Yes' : 'No'}</b>
          </h1>
          
          {/* Deleting post method with Form and POST */}
          <form method="post" action="./books/delete">
          <input type="hidden" name="inputID" value={book._id}></input>
          <button type="submit">Delete</button>
          </form>
          
          {/* Editing post method with passing ID in the link */}
          <Link to={`books/${book._id}/update`}>Update</Link>
              
          {/* Adding to favorite with Form and POST */}
          <form method="post" action="./books/favorite">
          <input type="hidden" name="inputID" value={book._id}></input>
          <input type="hidden" name="favorite" value={book.favorite}></input>
          <button type="submit">Toggle favorite</button>
          </form>
          
        </div>
          
          
              );
            })} 
      </div>
    </section>
  );

}
