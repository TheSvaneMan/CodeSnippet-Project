import { Form, redirect, json, useActionData, useLoaderData } from "remix";
import connectDb from "~/db/connectDb.server";

export async function loader({ params }) {
  const db = await connectDb();
  const snip = await db.models.snip.findById(params.snipId);
  return snip;
}
console.log(loader);

export async function action({ request, params }) {
  const form = await request.formData();
  const db = await connectDb();
 
  try {
    await db.models.snip.updateOne({ _id: params.snipId }, { title: form.get("title"), description: form.get("description"), language: form.get("language"), code: form.get("code") });
    return redirect(`snippets/${params.snipId}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function UpdateSnip() {
  const actionData = useActionData();
  const snip = useLoaderData();
  return (
    <div className="m-6 w-1/2">
      <h1 className="text-2xl font-bold mb-4">Edit</h1>
      <Form method="post">
        <label htmlFor="title" className="block font-bold">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={snip.title}
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
          defaultValue={snip.description}
          id="description"
          className="w-full h-20 py-1 px-2 rounded-lg"
        />
        {actionData?.errors.description && (
          <p className="text-red-500">{actionData.errors.description.message}</p>
        )}
        <label htmlFor="language" className="block font-bold">
        Language
        </label>
        <input
          type="text"
          name="language"
          defaultValue={snip.language}
          id="language"
          className="py-1 px-2 rounded-lg"
        />
        {actionData?.errors.language && (
          <p className="text-red-500">{actionData.errors.language.message}</p>
        )}
        <label htmlFor="code" className="block font-bold">
        Code
        </label>
        <textarea
          name="code"
          defaultValue={snip.code}
          id="code"
          className="w-full h-60 py-1 px-2 rounded-lg"
        />
        {actionData?.errors.description && (
          <p className="text-red-500">{actionData.errors.code.message}</p>
        )}

        <button type="submit" className="mt-2 mb-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Save</button>
      </Form>
    </div>
  );
}
