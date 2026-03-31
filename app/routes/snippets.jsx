// app/routes/snippets.jsx
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useLocation,
  Link,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession, getSession } from "~/sessions.server";

// Import Material 3 Components
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "@material/web/list/list.js";
import "@material/web/list/list-item.js";
import "@material/web/divider/divider.js";
import "@material/web/icon/icon.js";

export async function loader({ request }) {
  await requireUserSession(request);
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const userID = session.get("userID");

  // Fetch snippets belonging to the user OR default public ones
  const snipps = await db.models.snip
    .find({ user: { $in: [userID, ""] } })
    .lean();

  return json(snipps, {
    headers: {
      "cache-control": "private, max-age=60, stale-while-revalidate=86400",
    },
  });
}

export default function SnippetsLayout() {
  const snipps = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();

  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLanguage, setSearchLanguage] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Determine if we are viewing a specific snippet (for mobile responsive hiding)
  const isViewingSnippet =
    location.pathname !== "/snippets" && location.pathname !== "/snippets/";

  // Highly optimized filtering and sorting chain
  const filteredSnippets = snipps
    .filter((snip) => {
      const matchesSearch =
        snip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snip.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesLang = searchLanguage
        ? snip.language.toLowerCase() === searchLanguage.toLowerCase()
        : true;
      return matchesSearch && matchesLang;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "favorite")
        return a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1;
      return new Date(b.createdAt) - new Date(a.createdAt); // Default: Newest first
    });

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-surface text-on-surface">
      {/* Sidebar: Hidden on mobile IF a snippet is open, otherwise visible */}
      <aside
        className={`w-full lg:w-96 flex-shrink-0 flex flex-col border-r border-outline-variant bg-surface-container-low transition-all duration-300 ${
          isViewingSnippet ? "hidden lg:flex" : "flex"
        }`}
      >
        {/* Search & Filter Controls */}
        <div className="p-4 flex flex-col gap-4 bg-surface-container shadow-sm z-10">
          <md-outlined-text-field
            label="Search Snippets or Tags"
            value={searchTerm}
            onInput={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          >
            <md-icon slot="leading-icon">search</md-icon>
          </md-outlined-text-field>

          <div className="flex gap-2">
            <md-outlined-select
              label="Sort By"
              className="flex-1"
              onInput={(e) => setSortBy(e.target.value)}
            >
              <md-select-option value="date" selected={sortBy === "date"}>
                <div slot="headline">Date</div>
              </md-select-option>
              <md-select-option value="name" selected={sortBy === "name"}>
                <div slot="headline">Name</div>
              </md-select-option>
              <md-select-option
                value="favorite"
                selected={sortBy === "favorite"}
              >
                <div slot="headline">Favorites</div>
              </md-select-option>
            </md-outlined-select>

            <md-outlined-select
              label="Language"
              className="flex-1"
              onInput={(e) => setSearchLanguage(e.target.value)}
            >
              <md-select-option value="">
                <div slot="headline">All</div>
              </md-select-option>
              <md-select-option value="javascript">
                <div slot="headline">JavaScript</div>
              </md-select-option>
              <md-select-option value="python">
                <div slot="headline">Python</div>
              </md-select-option>
              <md-select-option value="html">
                <div slot="headline">HTML/CSS</div>
              </md-select-option>
            </md-outlined-select>
          </div>
        </div>

        {/* Snippet List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredSnippets.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant flex flex-col items-center gap-3">
              <md-icon className="text-4xl opacity-50">code_off</md-icon>
              <p>No snippets found.</p>
              <Link
                to="/snippets/new"
                className="text-primary font-medium hover:underline"
              >
                Create one now
              </Link>
            </div>
          ) : (
            <md-list className="bg-transparent">
              {filteredSnippets.map((snip) => (
                <md-list-item
                  key={snip._id}
                  type="button"
                  onClick={() => navigate(`/snippets/${snip._id}`)}
                  className="rounded-xl mb-1 cursor-pointer"
                >
                  <div slot="headline" className="font-medium text-on-surface">
                    {snip.title}
                  </div>
                  <div
                    slot="supporting-text"
                    className="text-on-surface-variant capitalize"
                  >
                    {snip.language}
                  </div>
                  {snip.favorite && (
                    <md-icon slot="end" className="text-tertiary">
                      star
                    </md-icon>
                  )}
                </md-list-item>
              ))}
            </md-list>
          )}
        </div>
      </aside>

      {/* Main Content Area (Outlet for specific snippet or 'new' form) */}
      <main
        className={`flex-1 overflow-y-auto bg-surface relative ${
          !isViewingSnippet ? "hidden lg:block" : "block"
        }`}
      >
        {/* Mobile back button (only visible on mobile when viewing a snippet) */}
        {isViewingSnippet && (
          <div className="lg:hidden sticky top-0 bg-surface-container p-2 border-b border-outline-variant z-10">
            <md-text-button onClick={() => navigate("/snippets")}>
              <md-icon slot="icon">arrow_back</md-icon>
              Back to List
            </md-text-button>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
}
