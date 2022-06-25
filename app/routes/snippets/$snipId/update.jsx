import { Form, redirect, json, useActionData, useLoaderData } from "remix";
import connectDb from "~/db/connectDb.server";
import { useState } from "react";

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
    await db.models.snip.updateOne(
      { _id: params.snipId },
      {
        title: form.get("title"),
        description: form.get("description"),
        language: form.get("language"),
        code: form.get("code"),
        tags: form.get("tags"),
      }
    );
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
  const [tags, setTags] = useState(snip.tags.toString().split(','));

  // Add Tags
  const handleTag = (e) => {
    e.preventDefault();
    const tag = document.getElementById("tag").value;
    // Check if tag already exists, if it does - do nothing
    const hasMatch = tags.some(function (storedTag) {
      return storedTag == tag;
    });
    if (!hasMatch) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (e) => {
    e.preventDefault();
    const updatedTags = tags.filter((tag) => {
      return tag !== e.target.value;
    });
    setTags(updatedTags);
  };

  return (
    <div id="Snippet Update" className="grid grid-cols-1 p-4 lg:col-span-3">
      <h1 className="text-2xl font-bold">Edit</h1>
      <Form method="post">
        <label htmlFor="title" className="block font-bold">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={snip.title}
          id="title"
          className="py-1 px-2 rounded-lg dark:text-neutral-800 focus:outline-orange-400"
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
          className="w-full h-20 py-1 px-2 rounded-lg dark:text-neutral-800 focus:outline-orange-400"
        />
        {actionData?.errors.description && (
          <p className="text-red-500">
            {actionData.errors.description.message}
          </p>
        )}
        <label htmlFor="language" className="block font-bold">
          Language
        </label>
        <input
          type="text"
          name="language"
          defaultValue={snip.language}
          id="language"
          className="py-1 px-2 rounded-lg dark:text-neutral-800 focus:outline-orange-400"
        />
        {actionData?.errors.language && (
          <p className="text-red-500">{actionData.errors.language.message}</p>
        )}
        <div className="form-element grid">
          <label htmlFor="tags" className="block mt-2 font-bold">
            Tags
          </label>
          <input type="hidden" value={tags} id="tags" name="tags" />
          <div
            className={
              tags.length === 0
                ? "grid grid-cols-1 text-orange-400"
                : "grid grid-cols-4"
            }
          >
            {tags.length === 0 ? (
              <p>No tags for this code snippet.</p>
            ) : (
              tags.map((tag) => {
                return (
                  <button
                    key={tag}
                    className="justify-items-center mr-2 mb-2 p-2 align-middle bg-orange-400 rounded-lg text-neutral-800"
                    value={tag}
                    onClick={removeTag}
                  >
                    {tag}
                  </button>
                );
              })
            )}
          </div>
          {actionData?.errors.tags && (
            <p className="text-red-500">{actionData?.errors.tag.message}</p>
          )}
          <input
            placeholder="tag"
            type="text"
            id="tag"
            name="tag"
            maxLength="8"
            minLength="1"
            className="text-lg mb-2 text-neutral-800 rounded-lg p-2 focus:outline-orange-400"
          />
          <div
            id="codeTag"
            className="grid grid-cols-1 justify-items-start space-y-4"
          >
            <button
              onClick={handleTag}
              className="pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400"
            >
              Add Tag
            </button>
          </div>
        </div>
        <label htmlFor="code" className="block font-bold">
          Code
        </label>
        <textarea
          name="code"
          defaultValue={snip.code}
          id="code"
          className="w-full h-60 py-1 px-2 rounded-lg dark:text-neutral-800 focus:outline-orange-400"
        />
        {actionData?.errors.description && (
          <p className="text-red-500">{actionData.errors.code.message}</p>
        )}

        <button
          type="submit"
          className="px-4 py-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400"
        >
          Save
        </button>
      </Form>
    </div>
  );
}
