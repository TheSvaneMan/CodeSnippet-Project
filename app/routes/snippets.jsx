import {
  Link,
  Outlet,
  useLoaderData, json
} from "remix";
import styles from "~/tailwind.css";
import connectDb from "~/db/connectDb.server.js";
import { useState } from "react";
import { requireUserSession, getSession } from "~/sessions.server";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export function meta() {
  return {
    charset: "utf-8",
    title: "KeepSnip",
    viewport: "width=device-width,initial-scale=1",
  };
}

export async function loader({ request }) {
  const db = await connectDb();
  await requireUserSession(request);
  const session = await getSession(request.headers.get("Cookie"));
  const userID = session.get("userID");
  const snipps = await db.models.snip.find({ user: { $in: [userID, ""] } });
  return snipps;
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLanguage, setLanguage] = useState("");
  const [sort, setSort] = useState("");
  const snipps = useLoaderData();
  const finalSnipps = [];
  const [theme, setTheme] = useState("light");

  // sorting
  let sortedSnipps = [];
  if (sort == "sortByName") {
    sortedSnipps = [...snipps].sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  } else if (sort == "showFavorite") {
    sortedSnipps = snipps.filter(function (snip) {
      return snip.favorite == true;
    });
  } else {
    sortedSnipps = snipps;
  }

  return (
    <section
      className={
        theme == "light" ? "light grid lg:h-screen" : "dark grid lg:h-screen"
      }
    >
      <div id="Snippet-Page" className="grid grid-cols-1 lg:grid-cols-5 ">
        <input
          className="showSnippsCheck"
          type="checkbox"
          id="showSnippsCheck"
        />
        <label
          className="showSnippsBtn mt-3 py-1 px-3 border-2 w-36 text-center relative left-1/2 transform -translate-x-1/2
                  border-orange-400 bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-50 rounded-3xl
                  hover:bg-orange-400"
          htmlFor="showSnippsCheck"
        >
          Show snippets
        </label>

        <div className="dropdown block lg:grid lg:grid-cols-3 lg:col-span-2">
          <div
            className="flex flex-col w-full p-4 lg:col-span-2 dark:bg-neutral-800 dark:text-neutral-50 space-y-2
         bg-neutral-100 text-neutral-800 border-orange-400 lg:border-r-2 lg:h-full"
          >
            <div id="Snippet-Sorting" className="grid grid-cols-4">
              <button className="hover:underline" onClick={() => setSort("")}>
                Date
              </button>
              <button
                className="hover:underline"
                onClick={() => setSort("sortByName")}
              >
                Name
              </button>
              <button
                className="hover:underline"
                onClick={() => setSort("showFavorite")}
              >
                Favorites
              </button>
              <button className="hover:underline" onClick={() => setSort("")}>
                All
              </button>
            </div>

            <select
              id="languageList"
              name="language"
              className="lg:grid-cols-2 rounded-lg p-2 border-2 h-11 my-4 border-orange-400 text-neutral-800 focus:outline-orange-400"
              onChange={(event) => {
                setLanguage(event.target.value);
              }}
            >
              <option value="">All languages</option>
              <option value="JavaScript">JavaScript</option>
              <option value="HTML">HTML</option>
              <option value="CSS">CSS</option>
              <option value="Python">Python</option>
              <option value="C">C</option>
              <option value="Java">Java</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              className="rounded-lg p-2 border-2 h-11 my-4 border-orange-400 text-neutral-800 focus:outline-orange-400"
              name="search"
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>

          <div id="Code-Snippet-Panel" className="">
            <div
              id="Code-Snippet-List"
              className="p-4 lg:border-r-2 border-orange-400 lg:h-full"
            >
              <h2 className="text-lg font-bold mb-2">Code snippets:</h2>
              {sortedSnipps.length === 0 ? (
                <div className="grid grid-cols-1 p-2 justify-items-end">
                  <p className="animate-pulse transition delay-150 mb-4">
                    You currently have no code snippets, click here to add a new
                    one to get started :)
                  </p>
                  <Link
                    to="/snippets/new"
                    className="py-1 px-4 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400"
                  >
                    Create new Snippet
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col">
                  {sortedSnipps
                    .filter((snip) => {
                      if (searchTerm == "") {
                        return snip;
                      } else if (
                        snip.title
                          .toString()
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      ) {
                        return snip;
                      }
                      else if (
                        snip.tags
                          .toString()
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      ) {
                        return snip;
                      }
                    })
                    .map((snip, i) => {
                      finalSnipps.push(snip);
                    })}
                  {finalSnipps
                    .filter((snip) => {
                      if (searchLanguage == "") {
                        return snip;
                      } else if (
                        snip.language
                          .toString()
                          .toLowerCase()
                          .includes(searchLanguage.toLowerCase())
                      ) {
                        return snip;
                      }
                    })
                    .map((snip, i) => {
                      return (
                        <Link
                          className="hover:underline py-2"
                          onClick={() => {
                            var w = window.innerWidth;
                            if (w < 1024) {
                              document
                                .getElementById("showSnippsCheck")
                                .click();
                            }
                          }}
                          to={`/snippets/${snip._id}`}
                          key={snip._id}
                        >
                          {i + 1 + ". " + snip.title}
                        </Link>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
        <Outlet />
      </div>
      <style>
        {`.showSnippsBtn {
          cursor: pointer;
          display: block;
      }

      .showSnippsCheck {
          display: none;
      }

      .showSnippsCheck:checked ~ .dropdown {
          display: none;
      }
      @media (min-width: 1024px) {
        .showSnippsBtn {
            display: none;
        }
    }
      `}
      </style>
    </section>
  );
}
