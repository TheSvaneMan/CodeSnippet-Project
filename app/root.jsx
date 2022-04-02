import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import styles from "~/tailwind.css";

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

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 text-slate-800 font-sans">
        <header className="p-4 border-b-4 border-orange-400 bg-neutral-800">
          <Link to="/" className="hover:text-orange-400 text-neutral-50 text-3xl mr-28">
            KeepSnip
          </Link>
          <Link to="/books/new" className="ml-5 hover:text-neutral-50 text-orange-400">
            New code snippet
          </Link>
          <Link to="/seed" className="ml-5 hover:text-neutral-50 text-orange-400">
            Defualt snippets
          </Link>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
