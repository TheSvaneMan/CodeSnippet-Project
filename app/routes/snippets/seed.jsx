// app/routes/snippets/seed.jsx
import {
  useLoaderData,
  json,
  Form,
  redirect,
  useNavigation,
  useNavigate,
} from "@remix-run/react";
import { useState } from "react";
import connectDb from "~/db/connectDb.server";
import { getSession, requireUserSession } from "~/sessions.server";
import snippetSeed from "~/db/seed.json"; // Assuming this is your JSON data

// Material 3 Web Components
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";

export async function loader({ request }) {
  await requireUserSession(request);
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const userID = session.get("userID");

  // Only count snippets belonging to this specific user
  const currentSnippetAmount = await db.models.snip.countDocuments({
    user: userID,
  });

  return json({ currentSnippetAmount, seedCount: snippetSeed.length });
}

export async function action({ request }) {
  await requireUserSession(request);
  const form = await request.formData();
  const snippetCount = parseInt(form.get("snippetCount"), 10);
  const db = await connectDb();

  try {
    const session = await getSession(request.headers.get("Cookie"));
    const userID = session.get("userID");

    // If they already have snippets, wipe them clean before seeding
    if (snippetCount > 0) {
      await db.models.snip.deleteMany({ user: userID });
    }

    // Map the seed data to include the current user's ID
    const seedDataWithUser = snippetSeed.map((snippet) => ({
      title: snippet.title,
      language: snippet.language,
      code: snippet.code,
      description: snippet.description,
      tags: snippet.tags || [],
      favorite: snippet.favorite || false,
      shareable: snippet.shareable || false,
      user: userID.toString(),
    }));

    // Perform a bulk insert for performance instead of looping .create()
    await db.models.snip.insertMany(seedDataWithUser);

    return redirect("/snippets");
  } catch (error) {
    console.error("Seeding error:", error);
    return json({ error: "Failed to seed database." }, { status: 500 });
  }
}

export default function SeedDatabase() {
  const { currentSnippetAmount, seedCount } = useLoaderData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [offlineWarning, setOfflineWarning] = useState("");

  const handleSubmit = (e) => {
    if (!navigator.onLine) {
      e.preventDefault();
      setOfflineWarning(
        "You are offline. An internet connection is required to seed the database."
      );
    }
  };

  const handleDecline = () => {
    if (!navigator.onLine) {
      setOfflineWarning(
        "You are offline. An internet connection is required to navigate."
      );
      return;
    }
    navigate("/snippets");
  };

  const isDestructive = currentSnippetAmount > 0;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <div className="max-w-xl w-full flex flex-col gap-6 p-8 rounded-[28px] bg-surface-container-high shadow-md animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="text-center">
          <md-icon className="text-5xl text-primary mb-4">dataset</md-icon>
          <h1 className="text-3xl font-bold text-on-surface mb-2">
            Database Setup
          </h1>
          <p className="text-on-surface-variant text-lg">
            You currently have{" "}
            <b className="text-primary">{currentSnippetAmount}</b> snippets in
            your library.
          </p>
        </div>

        {/* Dynamic Context Panel */}
        {isDestructive ? (
          <div className="p-6 rounded-2xl bg-error-container text-on-error-container flex flex-col gap-3 border border-error/20">
            <div className="flex items-center gap-2 font-bold text-lg">
              <md-icon>warning</md-icon>
              Action Required
            </div>
            <p>
              Do you want to <b>delete all your current snippets</b> and re-seed
              the database with {seedCount} default templates?
            </p>
            <p className="text-sm opacity-90 mt-2 font-medium">
              ⚠️ This action is permanent and cannot be undone.
            </p>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-secondary-container text-on-secondary-container flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold text-lg">
              <md-icon>lightbulb</md-icon>
              Quick Start
            </div>
            <p>
              Would you like to populate your empty database with {seedCount}{" "}
              useful default snippets to get started?
            </p>
          </div>
        )}

        {/* Offline Warning Alert */}
        {offlineWarning && (
          <div className="p-4 rounded-xl bg-surface-variant text-error font-medium flex items-center gap-3">
            <md-icon>wifi_off</md-icon>
            {offlineWarning}
          </div>
        )}

        {/* Actions */}
        <Form
          method="post"
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 mt-4"
        >
          <input
            type="hidden"
            name="snippetCount"
            value={currentSnippetAmount}
          />

          <md-outlined-button
            type="button"
            className="flex-1"
            onClick={handleDecline}
            disabled={isSubmitting}
          >
            Decline
          </md-outlined-button>

          <md-filled-button
            type="submit"
            className="flex-1"
            disabled={isSubmitting}
            // M3 styling override for destructive actions
            style={
              isDestructive
                ? {
                    "--md-filled-button-container-color":
                      "var(--md-sys-color-error)",
                    "--md-filled-button-label-text-color":
                      "var(--md-sys-color-on-error)",
                  }
                : {}
            }
          >
            <md-icon slot="icon">
              {isSubmitting ? "hourglass_empty" : "check"}
            </md-icon>
            {isSubmitting ? "Processing..." : "Accept & Seed"}
          </md-filled-button>
        </Form>
      </div>
    </div>
  );
}
