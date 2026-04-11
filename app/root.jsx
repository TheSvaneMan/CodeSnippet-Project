import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useLocation,
} from "@remix-run/react";
import { useState, useEffect } from "react";
import "./tailwind.css";
import Navigation from "~/components/Navigation";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
  },
];

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [networkState, setNetworkState] = useState("online");
  const location = useLocation();

  useEffect(() => {
    const handleState = () =>
      setNetworkState(navigator.onLine ? "online" : "offline");
    window.addEventListener("online", handleState);
    window.addEventListener("offline", handleState);
    return () => {
      window.removeEventListener("online", handleState);
      window.removeEventListener("offline", handleState);
    };
  }, []);

  const hideNav = ["/login", "/signup"].includes(location.pathname);

  return (
    <html lang="en" className={theme}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-surface text-on-surface min-h-screen flex flex-col antialiased transition-colors duration-300">
        {!hideNav && (
          <Navigation
            themeChange={() =>
              setTheme((t) => (t === "light" ? "dark" : "light"))
            }
            networkState={networkState}
          />
        )}
        <Outlet context={[networkState]} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let heading = "Something went wrong";
  let message = "An unexpected error occurred.";
  let icon = "warning";

  if (isRouteErrorResponse(error)) {
    heading = `${error.status} ${error.statusText}`;
    message = error.data || "Page not found.";
    icon = error.status === 404 ? "travel_explore" : "gpp_bad";
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <html lang="en">
      <head>
        <title>Error | KeepSnip</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-surface text-on-surface min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 flex flex-col items-center gap-4 text-center bg-error-container text-on-error-container rounded-[28px] shadow-lg">
          <span className="material-symbols-outlined text-6xl">{icon}</span>
          <h1 className="text-3xl font-bold">{heading}</h1>
          <p className="text-lg opacity-90">{message}</p>
          <a
            href="/"
            className="px-6 py-3 bg-on-error-container text-error-container rounded-full font-medium"
          >
            Return to Safety
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
