import { Form, redirect, json, useActionData, useLoaderData } from "remix";
import connectDb from "~/db/connectDb.server";
import { requireUserSession, getSession } from "~/sessions.server";
import { useState } from "react";

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  try {
    await db.models.snip.create({ title: form.get("title"), description: form.get("description"), date: form.get("date"), language: form.get("language"), code: form.get("code"), user: form.get("user") });
    return redirect(`/snippets/`);//new snip
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export async function loader({ request }) {
  await requireUserSession(request);
  const session = await getSession(request.headers.get("Cookie"));
  return { userID: session.get("userID") };
};




export default function Createsnip() {
  const actionData = useActionData();
  const [tags, setTags] = useState([]);
  const { userID } = useLoaderData();
  console.log(actionData);
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
  
  // Add Tags
  const handleTag = (e) => {
      e.preventDefault();
      const tag = document.getElementById('tag').value;
      // Check if tag already exists, if it does - do nothing
      const hasMatch = tags.some(function (storedTag) {
        return storedTag == tag
      });
      if (!hasMatch) {
        setTags([...tags, tag]);
      }
  }

  const removeTag = (e) => {
    e.preventDefault();
    const updatedTags = tags.filter((tag) => { return tag !== e.target.value })
    setTags(updatedTags);
  }

  return (
    <div className="m-6 w-1/2">
      <h1 className="text-2xl font-bold mb-4">Create code snippet</h1>
      <Form method="post">
        <input type="text" name="date" defaultValue={date} id="date" className="hidden" />
        <input type="text" name="user" defaultValue={userID} id="user" className="hidden"/>
         <div className="formElement grid">
          <label htmlFor="title" className="block">
            Title
          </label>
          <input
            type="text"
            name="title"
            defaultValue={actionData?.values.title}
            id="title"
            placeholder='Enter code snippet title'
            className={
              actionData?.errors.title ? "border-2 border-red-500 text-neutral-800 p-4 rounded-lg" : "text-neutral-800 p-4 rounded-lg focus:outline-orange-400"
            }
          />
          {actionData?.errors.title && (
            <p className="text-red-500">{actionData.errors.title.message}</p>
          )}
        </div>
        <div className="formElement grid">
          <label htmlFor="language" className="block">
            Language
          </label>
          <input
            type="text"
            name="language"
            defaultValue={actionData?.values.language}
            placeholder='Enter code snippet language'
            id="language"
            className={
              actionData?.errors.title ? "border-2 border-red-500 text-neutral-800 p-4 rounded-lg" : "text-neutral-800 p-4 rounded-lg focus:outline-orange-400"
            }
          />
          {actionData?.errors.language && (
            <p className="text-red-500">{actionData.errors.language.message}</p>
          )}
        </div>
        <div className="form-element grid">
        <label htmlFor="tags" className="block">
            Tags
          </label>
          <input type="hidden" value={tags} id="tags" name="tags" />
          <div className={tags.length === 0 ? "grid grid-cols-1 text-orange-600" : "grid grid-cols-4"}>
          {
            tags.length === 0 ? <p>No tags for this code snippet.</p> : tags.map(tag => {
              return (
                <button key={tag} className='justify-items-center ml-2 mb-2 p-2 align-middle bg-lime-600 rounded-lg text-white' value={tag} onClick={removeTag}>
                    {tag}
                </button>)
            })
          }
          </div>
          {actionData?.errors.tags && (
            <p className="text-red-500">{actionData?.errors.tag.message}</p>
          )}
        <input placeholder='tag' type="text" id="tag" name="tag" maxLength="8" minLength="1" className="text-lg my-2 text-neutral-800 rounded-lg p-2 focus:outline-orange-400" />
        <div id="codeTag" className='grid grid-cols-1 justify-items-end space-y-4'>
          <button onClick={handleTag} className='bg-orange-600 p-2 rounded-lg hover:bg-orange-300 hover:-translate-y-2 hover:text-neutral-800 transition ' >Add Tag</button>
        </div>
      </div>
        
         <div className="formElement grid">
          <label htmlFor="code" className="block">
            Code
          </label>
          <textarea
            type="text"
            name="code"
            defaultValue={actionData?.values.code}
            placeholder='Enter code snippet'
            id="code"
            className={
              actionData?.errors.code ? "border-2 border-red-500 text-neutral-800 p-4 rounded-lg" : "text-neutral-800 p-4 rounded-lg focus:outline-orange-400"
            }
          />
          {actionData?.errors.code && (
            <p className="text-red-500">{actionData.errors.code.message}</p>
          )}
        </div>
        <div className="formElement grid">
          <label htmlFor="description" className="block">
            Description
          </label>
          <input
            type="text"
            name="description"
            defaultValue={actionData?.values.description}
            id="description"
            placeholder='Enter code snippet description'
            className={
              actionData?.errors.description ? "border-2 border-red-500 text-neutral-800 p-4 rounded-lg" : "text-neutral-800 p-4 rounded-lg focus:outline-orange-400"
            }
          />
          {actionData?.errors.description && (
            <p className="text-red-500">{actionData.errors.description.message}</p>
          )}
        </div>
        <div className="formElement grid grid-cols-1 justify-items-center space-y-5">
          <label htmlFor="favorite" className="block">
            Favorite
          </label>
          <input
            type="checkbox"
            name="favorite"
            defaultValue={actionData?.values.favorite}
            id="favorite"
            value="favorite"
            className="appearance-none bg-slate-800 h-10 w-10 border-2 border-white hover:-translate-y-1 transition rounded-3xl default:ring-2 checked:bg-orange-400"
          />
          {actionData?.errors.favorite && (
            <p className="text-red-500">{actionData.errors.favorite.message}</p>
          )}
        </div>
        <button type="submit" className="mt-3 mb-2 pr-3 pl-3 pt-0 pb-1 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">Save</button>
      </Form>
    </div>
  );
}
