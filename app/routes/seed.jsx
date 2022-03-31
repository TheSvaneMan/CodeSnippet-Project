import { redirect } from "remix";
import { useLoaderData, Form } from "remix";
import connectDb from "~/db/connectDb.server";


export async function loader() {
    const db = await connectDb();
    const numberOfBooks = await db.models.Book.find()
    return (
        { books: numberOfBooks.length }
    )
}

export async function action() {
    const db = await connectDb();

    await db.models.Book.deleteMany({});

    await db.models.Book.insertMany([
        {
            "title": "HTML form",
            "description": "some description...",
            "favorite": true,
            "date": "29/03/2022"
        },
        {
            "title": "Tailwind",
            "description": "some description...",
            "favorite": false,
            "date": "30/03/2022"
        }
    ]);
    return redirect("/")
}

export default function Index() {
    return (
        <Form method="post">
            <button type="submit">Delete all snippets and add defualt ones</button>
        </Form>
        
    )
}
  
