import { Form, redirect, json, useActionData } from "remix";
import connectDb from "~/db/connectDb.server";

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  try {
    await db.models.Book.create({ title: form.get("title"), description: form.get("description"), date: form.get("date") });
    return redirect(`/`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function CreateBook() {
  const actionData = useActionData();
  console.log(actionData);
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
  return (
    <div>
      <h1>Create code snippet</h1>
      <Form method="post">
        <input type="text" name="date" value={date} id="date"/>
        <label htmlFor="title" className="block">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={actionData?.values.title}
          id="title"
          className={
            actionData?.errors.title ? "border-2 border-red-500" : null
          }
        />
        {actionData?.errors.title && (
          <p className="text-red-500">{actionData.errors.title.message}</p>
        )}
        <label htmlFor="description" className="block">
          Description
        </label>
        <input
          type="text"
          name="description"
          defaultValue={actionData?.values.description}
          id="description"
          className={
            actionData?.errors.description ? "border-2 border-red-500" : null
          }
        />
        {actionData?.errors.description && (
          <p className="text-red-500">{actionData.errors.description.message}</p>
        )}
        <br />
        <button type="submit">Save</button>
      </Form>
    </div>
  );
}
