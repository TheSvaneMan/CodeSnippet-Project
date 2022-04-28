import { redirect, Form  } from "remix";
import connectDb from "~/db/connectDb.server";
import { requireUserSession } from "~/sessions";


export async function loader({request}) {
    const db = await connectDb();
    const numberOfsnipps = await db.models.snip.find()
    const session = await requireUserSession(request);
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
            "date": "29/03/2022",
            "language": "HTML",
            "code": `<form>
            <label for="fname">First name:</label><br>
            <input type="text" id="fname" name="fname"><br>
            <label for="lname">Last name:</label><br>
            <input type="text" id="lname" name="lname">
          </form>`
        },
        {
            "title": "Tailwind",
            "description": "A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.",
            "favorite": false,
            "date": "30/03/2022",
            "language": "CSS",
            "code": `<figure class="bg-slate-100 rounded-xl p-8 dark:bg-slate-800">
            <img class="w-24 h-24 rounded-full mx-auto" src="/sarah-dayan.jpg" alt="" width="384" height="512">
            <div class="pt-6 space-y-4">`
        },
        {
            "title": "React",
            "description": "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.",
            "favorite": true,
            "date": "02/04/2022",
            "language": "JS",
            "code": `export async function loader({ params }) {
                const db = await connectDb();
                const snip = await db.models.snip.findById(params.snipId);
                return snip;
              }`
        },{
            "title": "Remix routing",
            "description": "In Remix, routes are more than just the page. When routes are nested we're able to know a little more about your app than just a single page, and do a lot more because of it.",
            "favorite": false,
            "date": "04/04/2022",
            "language": "JS",
            "code": `import { Outlet } from "@remix-run/react";
                export default function Root() {
                return (
                    <Document>
                    <Sidebar />
                    <Outlet />
                    </Document>
                );
            }`
        }
    ]);
    return redirect("/")
}

export default function Index() {
    return (
        <Form method="post">
            <button type="submit" className="mt-5 ml-5 mb-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Delete all snippets and add defualt ones</button>
        </Form>
        
    )
}
  
