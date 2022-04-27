import { Form, redirect, json, useActionData } from "remix";
import connectDb from "~/db/connectDb.server";
import { getSession } from "~/sessions";

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  try {
    await db.models.snip.create({ title: form.get("title"), description: form.get("description"), date: form.get("date"), language: form.get("language"), code: form.get("code") });
    return redirect(`/`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  let userID = session.get("userID") 
  if (userID == null) {
    return redirect("./login")
  }
  return { userID: session.get("userID") };
};



export default function Createsnip() {
  const actionData = useActionData();
  console.log(actionData);
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
  return (
    <div className="m-6 w-1/2">
      <h1 className="text-2xl font-bold mb-4">Create code snippet</h1>
      <Form method="post">
        <input type="text" name="date" value={date} id="date" className="hidden"/>
        <label htmlFor="title" className="block font-bold">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={actionData?.values.title}
          id="title"
          className="py-1 px-2 rounded-lg"
        />
        {actionData?.errors.title && (
          <p className="text-red-500">{actionData.errors.title.message}</p>
        )}
        <label htmlFor="description" className="block font-bold">
          Description
        </label>
        <textarea
          name="description"
          defaultValue={actionData?.values.description}
          id="description"
          className="w-full h-20 py-1 px-2 rounded-lg"
        />
        {actionData?.errors.description && (
          <p className="text-red-500">{actionData.errors.description.message}</p>
        )}
        <label htmlFor="language" className="block font-bold">
        Language
        </label>

        
        {/*
        Checkbox with already checked defaultValue
          if ({actionData?.values.language} == "JS"){
          <input type="checkbox" name="language" value="JS" checked />
          <label>JavaScript</label>  
          }
        
        <input type="checkbox" name="language" value="JS" />
        <label>JavaScript</label>  
        <input type="checkbox" name="language" value="HTML" />
        <label>HTML</label>  
        <input type="checkbox" name="language" value="CSS" />
        <label>CSS</label>
        */}

        <input
          type="text"
          name="language"
          defaultValue={actionData?.values.language}
          id="language"
          className="py-1 px-2 rounded-lg"
        />
        {actionData?.errors.language && (
          <p className="text-red-500">{actionData.errors.language.message}</p>
        )}
        <label htmlFor="code" className="block font-bold">
        Code
        </label>
        <input
          type="text"
          name="code"
          defaultValue={actionData?.values.code}
          id="code"
          className="w-full h-60 py-1 px-2 rounded-lg"
        />
        {actionData?.errors.description && (
          <p className="text-red-500">{actionData.errors.code.message}</p>
        )}
    
        <button type="submit" className="mt-3 mb-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Save</button>
      </Form>
    </div>
  );
}
