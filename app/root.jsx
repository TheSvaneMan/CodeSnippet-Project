// app/root.jsx
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
import tailwindStylesheetUrl from "~/tailwind.css";

// Import the Navigation component we built earlier
import Navigation from "~/components/Navigation";

export const links = () => [
  { rel: "stylesheet", href: tailwindStylesheetUrl },
  // Material 3 Core Fonts & Icons
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

export const meta = () => [
  { charset: "utf-8" },
  { title: "KeepSnip | Code Library" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
];

export default function App() {
  const [theme, setTheme] = useState("dark"); // M3 Dark mode looks great for code editors
  const [networkState, setNetworkState] = useState("online");
  const location = useLocation();

  // 1. Global Network Detection
  useEffect(() => {
    setNetworkState(navigator.onLine ? "online" : "offline");

    const handleOnline = () => setNetworkState("online");
    const handleOffline = () => setNetworkState("offline");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const themeChange = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const networkStateUpdate = () => {
    setNetworkState(navigator.onLine ? "online" : "offline");
  };

  // Hide the navigation bar on Auth pages for a cleaner focus
  const hideNav =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <html lang="en" className={theme}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-surface text-on-surface m-0 p-0 min-h-screen flex flex-col antialiased transition-colors duration-300">
        {!hideNav && (
          <Navigation
            themeChange={themeChange}
            networkState={networkState}
            networkStateUpdate={networkStateUpdate}
          />
        )}

        {/* Global Context Provider for Child Routes */}
        <Outlet context={[networkState, networkStateUpdate]} />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// 2. Unified Remix v2 Error Boundary (M3 Styled)
export function ErrorBoundary() {
  const error = useRouteError();

  let heading = "Something went wrong";
  let message = "An unexpected error occurred while loading this page.";
  let icon = "warning";

  if (isRouteErrorResponse(error)) {
    heading = `${error.status} ${error.statusText}`;
    message = error.data || "We couldn't find the page you were looking for.";
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
      <body className="bg-surface text-on-surface m-0 p-0 min-h-screen flex items-center justify-center antialiased">
        <div className="max-w-md w-full p-8 flex flex-col items-center gap-4 text-center bg-error-container text-on-error-container rounded-[28px] shadow-lg mx-4">
          <span className="material-symbols-outlined text-6xl opacity-90">
            {icon}
          </span>
          <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
          <p className="text-lg opacity-90 leading-relaxed mb-4">{message}</p>
          <a
            href="/"
            className="px-6 py-3 font-medium bg-on-error-container text-error-container rounded-full hover:opacity-90 transition-opacity"
          >
            Return to Safety
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
