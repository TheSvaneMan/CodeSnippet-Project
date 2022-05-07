import {
  Links, Link, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useActionData, useLoaderData
} from "remix";
import styles from "~/tailwind.css";
import { useState } from 'react';
import { getSession } from "~/sessions.server";

export async function loader({ request }) {
  // get the session
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);

  if (!session.has("userID")) {
    // if there is no user session, don't show top navigation
    let showNav = false;
    return showNav;
  }
  else {
    // if there is a user session, show top navigation
    let showNav = true;
    return showNav;
  }
}

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

 // This check is !important
  if (typeof document === "undefined") {
    // running in a server environment
  } else {
    // running in a browser environment
    // Check for a service worker registration status
    async function checkRegistration() {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          console.log("Service worker was registered on page load")
        } else {
          console.log("No service worker is currently registered")
        }
      } else {
        console.log("Service workers API not available");
      }
    }

    // Registers a service worker
    async function register() {
      if ('serviceWorker' in navigator) {
        try {
          // Change the service worker URL to see what happens when the SW doesn't exist
          const registration = await navigator.serviceWorker.register("sw.js");
          console.log("Service worker registered");
        } catch (error) {
          console.log("Error while registering " + error.message);
        }
      } else {
        console.log("Servive workers API not available");
      }
    }

    // Unregister a currently registered service worker 
    async function unregister() {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            const result = await registration.unregister();
            console.log(result ? "Service worker unregistered" : "Service worker couldn't be unregistered");
          } else {
            console.log("There is no service worker to unregister");
          }
        } catch (error) {
          console.log("Error while unregistering: " + error.message);
        }
      } else {
        console.log("Service workers API not available");
      }
    }

    // Register service worker
    register();  
}

export default function App() {
  let storedTheme = "";
  let [theme, setTheme] = useState(storedTheme);
  const themeToggle = () => {
    theme == "light" ? setTheme("dark") : setTheme("light");
    theme == "light" ? theme = "dark" : theme = "light";
    localStorage.setItem('theme', theme);
    storedTheme = localStorage.getItem('theme');
  }
  const sessionState = useLoaderData();
  
  return (
    <html lang="en" className={theme == "light" ? 'light' : 'dark'}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="grid grid-cols-1 bg-slate-100 text-slate-800 font-sans dark:bg-neutral-800 dark:text-neutral-50">
        <header className="p-2 border-b-4 border-orange-400 bg-neutral-800">
          <div>
            {sessionState ? <div id="nav-links" className='grid grid-cols-2 lg:grid-cols-4'>
              <div id="header-user-toolbar-main" className='grid grid-cols-1'>
                <Link to="/" className="hover:text-orange-400 text-neutral-50 text-4xl">
                  KeepSnip
                </Link>
                <Link to="/logout" className="hover:text-neutral-50 text-orange-600">
                  Log out
                </Link>
              </div>
              <div id="header-user-toolbar" className='grid grid-cols-1 justify-items-end '>
                <Link to="/snippets/seed" className="hover:text-neutral-50 text-orange-400">
                  Default snippets
                </Link>
                <button className="hover:text-neutral-50 text-orange-400" onClick={() => themeToggle()}>Light / Dark</button>
                <Link to="/snippets/new" className="hover:text-neutral-50 text-orange-600">
                  New code snippet
                </Link>
              </div>
            </div> : <div className='animate-pulse'>
              <p className='text-white'>Hey there, welcome to KeepSnip! Login to get started.</p>
            </div>}
          </div>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

