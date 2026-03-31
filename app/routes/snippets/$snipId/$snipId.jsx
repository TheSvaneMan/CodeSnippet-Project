// app/routes/snippets/$snipId.jsx
import { useLoaderData, Form, Link, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import connectDb from "~/db/connectDb.server.js";
import { getSession, requireUserSession } from "~/sessions.server";
import SnipView from "~/components/snipView"; // We will refactor this next

// Material 3 Web Components
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/iconbutton/filled-icon-button.js";
import "@material/web/icon/icon.js";
import "@material/web/elevation/elevation.js";
import "@material/web/textfield/outlined-text-field.js";

export async function loader({ params, request }) {
  await requireUserSession(request);
  const db = await connectDb();

  // .lean() optimizes the Mongoose query by returning a plain JS object
  const snippet = await db.models.snip.findById(params.snipId).lean();

  if (!snippet) {
    throw new Response("Snippet not found", { status: 404 });
  }

  const session = await getSession(request.headers.get("Cookie"));
  const userID = session.get("userID");
  const user = await db.models.user.findById(userID).lean();
  const isFollowing = user?.following?.includes(params.snipId.toString());

  return json(
    {
      snippet,
      isOwner: snippet.user === userID,
      isFollowing,
      userID,
      url: request.url,
    },
    {
      headers: {
        "cache-control": "private, max-age=5, stale-while-revalidate=86400",
      },
    }
  );
}

export async function action({ request, params }) {
  await requireUserSession(request);
  const db = await connectDb();
  const formData = await request.formData();
  const intent = formData.get("intent");

  const session = await getSession(request.headers.get("Cookie"));
  const userID = session.get("userID");

  // Security Check: Verify ownership for restricted actions
  const snippet = await db.models.snip.findById(params.snipId);
  if (!snippet) throw new Response("Not Found", { status: 404 });
  const isOwner = snippet.user === userID;

  switch (intent) {
    case "delete":
      if (!isOwner) throw new Response("Unauthorized", { status: 403 });
      await db.models.snip.deleteOne({ _id: params.snipId });
      return redirect("/snippets");

    case "toggleFavorite":
      if (!isOwner) throw new Response("Unauthorized", { status: 403 });
      await db.models.snip.updateOne(
        { _id: params.snipId },
        { favorite: !snippet.favorite }
      );
      return null; // Return null to stay on the page and let Remix re-fetch

    case "togglePrivacy":
      if (!isOwner) throw new Response("Unauthorized", { status: 403 });
      await db.models.snip.updateOne(
        { _id: params.snipId },
        { shareable: !snippet.shareable }
      );
      return null;

    case "toggleFollow":
      const isFollowing = formData.get("isFollowing") === "true";
      if (isFollowing) {
        await db.models.user.updateOne(
          { _id: userID },
          { $pull: { following: params.snipId } }
        );
      } else {
        await db.models.user.updateOne(
          { _id: userID },
          { $push: { following: params.snipId } }
        );
      }
      return null;

    default:
      return null;
  }
}

export default function SnipPage() {
  const { snippet, isOwner, isFollowing, url } = useLoaderData();
  const [showShare, setShowShare] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Snippet URL copied to clipboard!");
      setShowShare(false);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Privacy Guard
  if (!isOwner && !snippet.shareable) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-on-surface-variant">
        <md-icon className="text-6xl mb-4 opacity-50">lock</md-icon>
        <h2 className="text-2xl font-semibold text-on-surface mb-2">
          Private Snippet
        </h2>
        <p>The owner has made this snippet private. You cannot view it.</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full max-w-4xl mx-auto p-4 lg:p-8">
      {/* Code Viewer Component */}
      <SnipView snip={snippet} />

      {/* M3 Action Toolbar */}
      <div className="mt-6 p-2 flex flex-wrap items-center gap-3 bg-surface-container-low rounded-2xl shadow-sm border border-outline-variant">
        {isOwner && (
          <>
            <Link to="update" className="flex-shrink-0">
              <md-filled-button>
                <md-icon slot="icon">edit</md-icon>
                Edit Snippet
              </md-filled-button>
            </Link>
            <Form method="post" className="flex-shrink-0">
              <input type="hidden" name="intent" value="toggleFavorite" />
              <md-icon-button type="submit" aria-label="Toggle Favorite">
                <md-icon className={snippet.favorite ? "text-tertiary" : ""}>
                  {snippet.favorite ? "star" : "star_border"}
                </md-icon>
              </md-icon-button>
            </Form>
            <Form method="post" className="flex-shrink-0">
              <input type="hidden" name="intent" value="togglePrivacy" />
              <md-outlined-button type="submit">
                <md-icon slot="icon">
                  {snippet.shareable ? "public" : "lock"}
                </md-icon>
                {snippet.shareable ? "Public" : "Private"}
              </md-outlined-button>
            </Form>
            <div className="flex-1"></div> {/* Spacer */}
            <Form
              method="post"
              onSubmit={(e) => {
                if (!confirm("Are you sure you want to delete this snippet?"))
                  e.preventDefault();
              }}
            >
              <input type="hidden" name="intent" value="delete" />
              <md-icon-button
                type="submit"
                className="text-error"
                aria-label="Delete"
              >
                <md-icon>delete</md-icon>
              </md-icon-button>
            </Form>
          </>
        )}

        {!isOwner && (
          <Form method="post" className="flex-shrink-0">
            <input type="hidden" name="intent" value="toggleFollow" />
            <input
              type="hidden"
              name="isFollowing"
              value={isFollowing.toString()}
            />
            <md-outlined-button type="submit">
              <md-icon slot="icon">
                {isFollowing ? "notifications_off" : "notifications_active"}
              </md-icon>
              {isFollowing ? "Unfollow" : "Follow Updates"}
            </md-outlined-button>
          </Form>
        )}

        <md-outlined-button onClick={() => setShowShare(!showShare)}>
          <md-icon slot="icon">share</md-icon>
          Share
        </md-outlined-button>
      </div>

      {/* Share Dialog/Drawer (M3 Style) */}
      {showShare && (
        <div className="mt-4 p-4 bg-surface-container-high rounded-2xl shadow-md border border-outline-variant animate-in fade-in slide-in-from-top-2">
          <h3 className="text-title-medium font-medium mb-3">Share Snippet</h3>
          <div className="flex gap-2 items-center">
            <md-outlined-text-field
              value={url}
              readOnly
              className="flex-1"
            ></md-outlined-text-field>
            <md-filled-icon-button onClick={copyToClipboard}>
              <md-icon>content_copy</md-icon>
            </md-filled-icon-button>
          </div>
        </div>
      )}
    </div>
  );
}

// Remix v2 standard Error Boundary
export function ErrorBoundary() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-error-container text-on-error-container rounded-3xl m-4">
      <md-icon className="text-6xl mb-4">error_outline</md-icon>
      <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
      <p className="mb-6">
        We couldn't load this snippet. It may have been deleted.
      </p>
      <Link to="/snippets">
        <md-filled-button>Back to Snippets</md-filled-button>
      </Link>
    </div>
  );
}
