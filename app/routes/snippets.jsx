import {
    Links, Link, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, Form
  } from "remix";
  import styles from "~/tailwind.css";
  import connectDb from "~/db/connectDb.server.js";
import React, { useState } from 'react';
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
      });;
    }
    else if (sort == "showFavorite") {
      sortedSnipps = snipps.filter(function (snip) {
        return snip.favorite == true;
      })
    }
    else {
      sortedSnipps = snipps;
    }
  
    return (
          <section className={theme == "light" ? 'light flex' : 'dark flex'}>
            <div className="p-6 flex flex-col items-start h-screen bg-neutral-800 text-neutral-50">
              <h2 className="text-lg font-bold mb-4">
                Filters:
              </h2>
              <input type="text" placeholder="Search..." className="rounded-lg pt-1 pb-1 pr-2 pl-2 border-2 border-orange-400 text-neutral-800"
                name="search" onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              />
              <button className="mt-4 hover:underline" onClick={() => setSort("")}>Sort by date</button>
              <button className="mt-4 hover:underline" onClick={() => setSort("sortByName")}>Sort by name</button>
              <div>
              <button className="mt-4 hover:underline" onClick={() => setSort("showFavorite")}>Show favorite only&nbsp;</button>
              /
              <button className="mt-4 hover:underline" onClick={() => setSort("")}>&nbsp;all</button>
              </div>
              {/* Use Penda's tagging solution */}
              <select id="languageList" name="language" className="mt-4 rounded-lg pt-1 pb-1 pr-2 pl-2 border-2 border-orange-400 text-neutral-800" onChange={(event) => {
                setLanguage(event.target.value);
              }}>
              <option value="">All languages</option>
              <option value="JS">JS</option>
              <option value="HTML">HTML</option>
              <option value="CSS">CSS</option>
              <option value="Python">Python</option>
              <option value="C">C</option>
              <option value="Java">Java</option>
              </select>
            </div>
            <div className={'p-6 flex flex-col items-start border-r-2 border-neutral-800 dark:bg-neutral-800 dark:text-neutral-50 dark:border-l-2 dark:border-orange-400'}>
              <h2 className="text-lg font-bold mb-3">
                Code snippets:
              </h2>
              <div className="list-disc flex flex-col">
                {sortedSnipps.filter((snip) => {
                  if (searchTerm == "") {
                    return snip
                  }
                  else if (snip.title.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
                    return snip
                  }
                }).map((snip, i) => {
                  finalSnipps.push(snip);
                })}
                {finalSnipps.filter((snip) => {
                  if (searchLanguage == "") {
                    return snip
                  }
                  else if (snip.language.toString().toLowerCase().includes(searchLanguage.toLowerCase())) {
                    return snip
                  }
                }).map((snip, i) => {
                  return (
                    <Link className="hover:underline" to={`/snippets/${snip._id}`} key={snip._id}>{i+1+". "+snip.title}</Link>
                  );
                })}
              </div>
            </div>
            <Outlet />
          </section>
    );
  }
  