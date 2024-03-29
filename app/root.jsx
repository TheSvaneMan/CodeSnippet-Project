import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useCatch,
  json
} from "remix";
import styles from "~/tailwind.css";
import { useState, useEffect } from "react";
import { getSession } from "~/sessions.server";
import { useNavigate } from "react-router-dom";
import Navigation from './components/topNavigation';

export async function loader({ request }) {
  // get the session
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);

  if (!session.has("userID")) {
    // if there is no user session, don't show top navigation
    let showNav = false;
    return json(showNav, { status: 200, headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' } });
  } else {
    // if there is a user session, show top navigation
    let showNav = true;
    return json(showNav, { status: 200, headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' } });
  }
}


export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "manifest",
    crossOrigin: "use-credentials",
    href: "/app.webmanifest",
  },
  {
    rel: "apple-touch-icon",
    href: "/assets/logo/apple-touch-icon.png",
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
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        console.log("Client: Service worker was registered on page load")
      } else {
        console.log("Client: No service worker is currently registered")
        register();
      }
    } else {
      console.log("Client: Service workers API not available or push messages");
    }
  }

  // Registers a service worker
  async function register() {
    if ('serviceWorker' in navigator) {
      try {
        // Change the service worker URL to see what happens when the SW doesn't exist
        const registration = await navigator.serviceWorker.register("sw.js");
        console.log("Client: Service worker registered");
      } catch (error) {
        console.log("Client: Error while registering " + error.message);
      }
    } else {
      console.log("Client: Servive workers API not available");
    }
  }

  // Unregister a currently registered service worker 
  /* async function unregister() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          const result = await registration.unregister();
          console.log(result ? "Client: Service worker unregistered" : "Client: Service worker couldn't be unregistered");
        } else {
          console.log("There is no service worker to unregister");
        }
      } catch (error) {
        console.log("Client: Error while unregistering: " + error.message);
      }
    } else {
      console.log("Client: Service workers API not available");
    }
  } */

  // Register service worker
  checkRegistration();
}

export default function App() {
  const [networkState, setNetworkState] = useState();
  let [theme, setTheme] = useState();
  useEffect(() => {
    setTheme(localStorage.getItem('theme'));
  }, []);
  const themeToggle = () => {
    theme == "light" ? setTheme("dark") : setTheme("light");
    theme == "light" ? theme = "dark" : theme = "light";
    localStorage.setItem('theme', theme);
    const storedTheme = localStorage.getItem('theme');
  }
  
  const sessionState = useLoaderData();
  //  setInterval(function () { networkStateUpdate() }, 3000);
  useEffect(() => {
    // Update the document title using the browser API
    // Client
    if (navigator.onLine) {
      setNetworkState("online");
    } else {
      setNetworkState("offline");
    }
  }, []);

  function networkStateUpdate() {
    if (navigator.onLine) {
      setNetworkState("online");
    } else {
      setNetworkState("offline");
    }
  }

  return (
    <html lang="en" className={theme == "light" ? "light" : "dark"}>
      <head>
        <Meta />
        <Links />
        <meta name="description" content="The root home page of Keep Snipp - Code Snippet PWA" />
        <meta name="theme-color" content="#fb923c" />
      </head>
      <body className="overflow-y-scroll grid grid-cols-1 bg-neutral-100 text-neutral-800 font-sans dark:bg-neutral-800 dark:text-neutral-50">
        <div onClick={() => networkStateUpdate()} className={networkState === 'online' ? 'grid grid-cols-1 justify-items-center bg-green-400 text-black z-20' : 'grid grid-cols-1 justify-items-center bg-red-600 text-white animate-pulse transition delay-300 z-20'} >{networkState}</div>
        <header className="p-2 border-b-4 border-orange-400 dark:bg-neutral-800 bg-neutral-100">
          <div>
            {sessionState ? <div id="TopNavigation">
              <Navigation networkStateUpdate={networkStateUpdate} themeChange={themeToggle} networkState={networkState} /></div>
              : <div className='animate-pulse'>
                  <p className='dark:text-neutral-50 text-neutral-800 text-center'>Hey there, welcome to KeepSnip!<br/> Login to get started.</p>
                </div>}
          </div>
        </header>
        <Outlet context={[networkState, networkStateUpdate]}/>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html lang="en" className='dark'>
      <head>
        <title>Whoopsies</title>
        <Meta />
        <Links />
      </head>
      <body className="grid grid-cols-1 justify-center space-y-5 px-5 max-w-md bg-neutral-100 text-neutral-800 font-sans dark:bg-neutral-800 dark:text-neutral-50">
        <h1 className='mt-10'>Hey there, sorry for the inconvenience - but it seems like the page you're looking for doesn't exist</h1>
        <div className='p-10 animate-pulse transition delay-300'>
          <h1>
            {caught.status} {caught.statusText}
          </h1>
          <h2><b>{caught.data}</b></h2>
        </div>
        <Link to="/" className="py-1 px-4 border-2 
                  border-orange-400 bg-neutral-800 text-neutral-50 rounded-3xl
                  hover:bg-orange-400">
          Click here to return to home
        </Link>

        <Scripts />
      </body>
    </html>
  );
}
