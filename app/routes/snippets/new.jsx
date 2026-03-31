// app/routes/snippets/new.jsx
import {
  Form,
  redirect,
  json,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { useState } from "react";
import connectDb from "~/db/connectDb.server";
import { requireUserSession, getSession } from "~/sessions.server";

// Material 3 Web Components
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/icon/icon.js";

export async function loader({ request }) {
  await requireUserSession(request);
  return null; // No data needed, just ensuring the user is logged in
}

export async function action({ request }) {
  await requireUserSession(request);
  const form = await request.formData();
  const db = await connectDb();

  // Securely get the user ID from the session, NOT the form data
  const session = await getSession(request.headers.get("Cookie"));
  const userID = session.get("userID");

  try {
    // Convert comma-separated tags string back into an array
    const tagsString = form.get("tags") || "";
    const tagsArray = tagsString
      ? tagsString.split(",").map((t) => t.trim())
      : [];

    const newSnippet = await db.models.snip.create({
      title: form.get("title"),
      description: form.get("description"),
      language: form.get("language"),
      code: form.get("code"),
      user: userID, // Secure assignment
      tags: tagsArray,
      favorite: form.get("favorite") === "on",
      shareable: form.get("shareable") === "on",
    });

    return redirect(`/snippets/${newSnippet._id}`);
  } catch (error) {
    return json({ errors: error.errors }, { status: 400 });
  }
}

export default function CreateSnip() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // State for Tag Management
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  const handleAddTag = (e) => {
    e?.preventDefault();
    const trimmedTag = currentTag.trim().toLowerCase();

    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleAddTag();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">
          Create Snippet
        </h1>
        <p className="text-on-surface-variant mt-2">
          Save a new piece of code to your library.
        </p>
      </div>

      <Form method="post" className="flex flex-col gap-6">
        {/* Title & Language Row */}
        <div className="flex flex-col md:flex-row gap-4">
          <md-outlined-text-field
            label="Title *"
            name="title"
            required
            className="flex-1"
            error={actionData?.errors?.title ? "true" : undefined}
            error-text={actionData?.errors?.title?.message}
          ></md-outlined-text-field>

          <md-outlined-text-field
            label="Language *"
            name="language"
            required
            className="md:w-1/3"
            placeholder="e.g. javascript, python"
            error={actionData?.errors?.language ? "true" : undefined}
            error-text={actionData?.errors?.language?.message}
          ></md-outlined-text-field>
        </div>

        {/* Description */}
        <md-outlined-text-field
          type="textarea"
          label="Description *"
          name="description"
          required
          rows="2"
          className="w-full"
          error={actionData?.errors?.description ? "true" : undefined}
          error-text={actionData?.errors?.description?.message}
        ></md-outlined-text-field>

        {/* Code Editor Area */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-on-surface-variant px-1">
            Source Code *
          </span>
          <textarea
            name="code"
            required
            className="w-full h-64 p-4 rounded-xl bg-surface-container-highest text-on-surface font-mono text-sm border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
            placeholder="// Paste or type your code here..."
          ></textarea>
          {actionData?.errors?.code && (
            <span className="text-error text-xs px-1 mt-1">
              {actionData.errors.code.message}
            </span>
          )}
        </div>

        {/* Tags Management */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl border border-outline-variant bg-surface-container-low">
          <span className="text-sm font-medium text-on-surface-variant">
            Tags (Max 10)
          </span>

          {/* Hidden input to pass the array to Remix */}
          <input type="hidden" name="tags" value={tags.join(",")} />

          <div className="flex gap-2">
            <md-outlined-text-field
              placeholder="Add a tag..."
              value={currentTag}
              onInput={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="flex-1"
            ></md-outlined-text-field>
            <md-filled-button
              type="button"
              onClick={handleAddTag}
              disabled={!currentTag.trim()}
            >
              Add Tag
            </md-filled-button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {tags.length === 0 ? (
              <span className="text-sm text-outline italic">
                No tags added yet.
              </span>
            ) : (
              tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="group flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container hover:bg-error-container hover:text-on-error-container transition-colors text-sm font-medium"
                  title="Click to remove"
                >
                  {tag}
                  <md-icon className="text-sm opacity-50 group-hover:opacity-100">
                    close
                  </md-icon>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Toggles: Favorite & Privacy */}
        <div className="flex flex-wrap gap-8 py-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <md-checkbox name="favorite" touch-target="wrapper"></md-checkbox>
            <span className="text-on-surface font-medium">
              Mark as Favorite
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <md-checkbox name="shareable" touch-target="wrapper"></md-checkbox>
            <span className="text-on-surface font-medium">
              Make Public (Shareable)
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
          <md-text-button type="button" onClick={() => window.history.back()}>
            Cancel
          </md-text-button>
          <md-filled-button type="submit" disabled={isSubmitting}>
            <md-icon slot="icon">
              {isSubmitting ? "hourglass_empty" : "save"}
            </md-icon>
            {isSubmitting ? "Saving..." : "Save Snippet"}
          </md-filled-button>
        </div>
      </Form>
    </div>
  );
}
