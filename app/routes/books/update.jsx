import { Form, redirect, json, useActionData } from "remix";
import connectDb from "~/db/connectDb.server";


export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  try {
    await db.models.Book.updateOne({_id:"6240c45a15edf84f3a33f138"}, { title: form.get("title"), description: form.get("description") });
    return redirect(`/`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function UpdateSnip() {
  const actionData = useActionData();
  console.log(actionData);
  return (
    <div>
      <h1>Edit</h1>
      <Form method="post">
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
