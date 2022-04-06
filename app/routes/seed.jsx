import { redirect } from "remix";
import { useLoaderData, Form } from "remix";
import connectDb from "~/db/connectDb.server";


export async function loader() {
    const db = await connectDb();
    const numberOfsnipps = await db.models.snip.find()
    return (
        { snipps: numberOfsnipps.length }
    )
}

export async function action() {
    const db = await connectDb();

    await db.models.snip.deleteMany({});

    await db.models.snip.insertMany([
        {
            "title": "HTML form",
            "description": "A webform, web form or HTML form on a web page allows a user to enter data that is sent to a server for processing. Forms can resemble paper or database forms because web users fill out the forms using checkboxes, radio buttons, or text fields.",
            "favorite": true,
            "date": "29/03/2022"
        },
        {
            "title": "Tailwind",
            "description": "A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.",
            "favorite": false,
            "date": "30/03/2022"
        },
        {
            "title": "React",
            "description": "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.",
            "favorite": true,
            "date": "02/04/2022"
        },{
            "title": "Remix routing",
            "description": "In Remix, routes are more than just the page. When routes are nested we're able to know a little more about your app than just a single page, and do a lot more because of it.",
            "favorite": false,
            "date": "04/04/2022"
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
  
