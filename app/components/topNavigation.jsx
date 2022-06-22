import { Link, Form } from "remix";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navigation({ networkStateUpdate, themeChange }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div id="nav-links" className="grid grid-cols-2 ">
      <div id="header-user-toolbar-main" className="grid grid-cols-1">
        <button
          type="button"
          onClick={() => {
            networkStateUpdate();
            if (navigator.onLine) {
              return navigate("/snippets");
            }
          }}
          className="hover:text-orange-400 text-neutral-50 text-4xl text-left"
        >
          KeepSnip
        </button>
        <button onClick={networkStateUpdate}>Change network state</button>
      </div>
      <div
        id="header-user-toolbar"
        className="grid grid-cols-1 justify-items-end "
      >
        <div className="flex items-center justify-between py-3">
          <nav>
            {/* Mobile menu */}
            <section className="flex lg:hidden">
              {/* Burger menu icon */}
              <div
                className="space-y-2"
                onClick={() => setIsNavOpen((prev) => !prev)}
              >
                <span className="block h-0.5 w-8 bg-orange-400"></span>
                <span className="block h-0.5 w-8 bg-orange-400"></span>
                <span className="block h-0.5 w-8 bg-orange-400"></span>
              </div>

              <div
                className={
                  isNavOpen
                    ? "bg-slate-100 text-slate-800 dark:bg-neutral-800 dark:text-neutral-50 showMenuNav"
                    : "hideMenuNav"
                }
              >
                <div
                  className="absolute top-0 right-0 px-2 py-10"
                  onClick={() => setIsNavOpen(false)}
                >
                  <svg
                    className="h-8 w-8 text-orange-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <ul className="flex flex-col items-center justify-between min-h-[250px]">
                  <li className="border-b border-orange-400 my-8 uppercase">
                    <a href="/profile">Profile</a>
                  </li>
                  <li className="border-b border-orange-400 my-8 uppercase">
                    <a href="/snippets/new">New code snippet</a>
                  </li>
                  <li className="border-b border-orange-400 my-8 uppercase">
                    <a href="/snippets/seed">Default snippets</a>
                  </li>
                  <button
                    className="border-b border-orange-400 my-8 uppercase"
                    onClick={() => themeChange()}
                  >
                    Light / Dark
                  </button>

                    <Form method="post" action="/logout">
                      <button
                        type="submit"
                        onClick={() => setIsNavOpen(false)}
                        className="border-b border-orange-400 my-8 uppercase"
                      >
                        Log out
                      </button>
                  </Form>
                  
                  
                  {/*
                  
                  It's not really working since my networkState useState() is in root. I need to figure out how to acces it from this component
                  https://www.youtube.com/watch?v=c05OL7XbwXU ------------ usefull link

                  {sessionState ? (
              <div id="nav-links" className="grid grid-cols-2">
                <div id="header-user-toolbar-main" className="grid grid-cols-1">
                  
                  
                  <Form method="post" action="/logout">
                    {networkState === "online" ? (
                      <button
                        type="button"
                        onClick={() => {
                          networkStateUpdate();
                          if (navigator.onLine) {
                            document.getElementById("logOut").click();
                          }
                        }} // this button checks if online and clicks invisible logOut button
                        cclassName="border-b border-orange-400 my-8 uppercase"
                      >
                        Log out
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          networkStateUpdate();
                        }} // this button is showing if youre offline
                        className="border-b border-red-600 text-red-600 my-8 uppercase"
                      >
                        Log out
                      </button>
                    )}
                    <button
                      type="submit"
                      id="logOut" // this button submits the form, which logs the user out
                      className="hidden"
                    ></button>
                  </Form>
                </div>
                <div
                  id="header-user-toolbar"
                  className="grid grid-cols-1 justify-items-end "
                >
                  {networkState === "online" ? (
                    <button
                      type="button"
                      onClick={() => {
                        networkStateUpdate();
                        if (navigator.onLine) {
                          console.log("online");
                          return navigate("/snippets/seed");
                        }
                      }}
                      className="hover:text-neutral-50 text-orange-400"
                    >
                      Default snippets
                    </button>
                  ) : (
                    <button
                      className="text-red-600"
                      onClick={() => {
                        networkStateUpdate();
                      }}
                    >
                      Default snippets
                    </button>
                  )}
                  <button
                    className="hover:text-neutral-50 text-orange-400"
                    onClick={() => themeToggle()}
                  >
                    Light / Dark
                  </button>
                  {networkState === "online" ? (
                    <button
                      type="button"
                      onClick={() => {
                        networkStateUpdate();
                        if (navigator.onLine) {
                          console.log("online");
                          return navigate("/snippets/new");
                        }
                      }}
                      className="hover:text-neutral-50 text-orange-400"
                    >
                      New code snippet
                    </button>
                  ) : (
                    <button
                      className="text-red-600"
                      onClick={() => {
                        networkStateUpdate();
                      }}
                    >
                      New code snippet
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="animate-pulse">
                <p className="text-white">
                  Hey there, welcome to KeepSnip! Login to get started.
                </p>
              </div>
            )} */}

                </ul>
              </div>
            </section>
            {/* Desktop menu */}
            <ul className="hidden space-x-8 lg:flex">
              <li className="border-b border-orange-400 my-8 uppercase">
                <a href="/profile">Profile</a>
              </li>
              <li className="border-b border-orange-400 my-8 uppercase">
                <a href="/snippets/new">New code snippet</a>
              </li>
              <li className="border-b border-orange-400 my-8 uppercase">
                <a href="/snippets/seed">Default snippets</a>
              </li>
              <button
                className="border-b border-orange-400 my-8 uppercase"
                onClick={() => themeChange()}
              >
                Light / Dark
              </button>
              <li>
                <Form method="post" action="/logout">
                  <button
                    type="submit"
                    onClick={() => setIsNavOpen(false)}
                    className="border-b border-orange-400 my-8 uppercase"
                  >
                    Log out
                  </button>
                </Form>
              </li>
            </ul>
          </nav>
          <style>{`
      .hideMenuNav {
        display: none;
      }
      .showMenuNav {
        display: block;
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    `}</style>
        </div>
      </div>
    </div>
  );
}
