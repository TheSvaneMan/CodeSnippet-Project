import { Link, Form } from "remix";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navigation({
  networkStateUpdate,
  themeChange,
  networkState,
}) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div id="nav-links" className="grid grid-cols-2 lg:grid-cols-4 ">
      <div id="header-user-toolbar-main" className="grid grid-cols-1">
        <button
          type="button"
          onClick={() => {
            networkStateUpdate();
            
              // Checking if the snippets are visible, if they are not then clicking "Show snippets" button
              if (document.getElementById("showSnippsCheck")) {
                const checkbox =
                  document.getElementById("showSnippsCheck").checked;
                if (checkbox === true) {
                  document.getElementById("showSnippsCheck").click();
                  console.log("checbkox clicked");
                }
              }
              return navigate("/snippets");
            
          }}
          className="hover:text-orange-400 text-neutral-800 dark:text-neutral-50 text-4xl text-left"
        >
          KeepSnip
        </button>
      </div>
      <div
        id="header-user-toolbar"
        className="grid grid-cols-1 lg:col-span-3 justify-items-end "
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
                    ? "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-50 showMenuNav"
                    : "hidden"
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
                  <Link
                    to="/snippets"
                    className="border-b border-orange-400 my-8 uppercase"
                    onClick={() => {
                      setIsNavOpen(false);
                    }}
                  >
                    Snippets
                  </Link>
                  {networkState === "online" ? (
                    <button
                      type="button"
                      onClick={() => {
                        networkStateUpdate();
                        if (navigator.onLine) {
                          console.log("online");
                          setIsNavOpen(false);
                          // Checking if the snippets are visible, if they are then clicking "Show snippets" button
                          if (document.getElementById("showSnippsCheck")) {
                            const checkbox =
                              document.getElementById("showSnippsCheck").checked;
                            if (checkbox === true) {
                              document.getElementById("showSnippsCheck").click();
                              console.log("snippets hidden");
                            }
                          }
                            return navigate("/snippets/new");
                        }
                      }}
                      className="border-b border-orange-400 my-8 uppercase"
                    >
                      New code snippet
                    </button>
                  ) : (
                    <button
                      className="border-b border-red-600 text-red-600 my-8 uppercase"
                      onClick={() => {
                        networkStateUpdate();
                      }}
                    >
                      New code snippet
                    </button>
                  )}
                  {networkState === "online" ? (
                    <button
                      type="button"
                      onClick={() => {
                        networkStateUpdate();
                        if (navigator.onLine) {
                          console.log("online");
                          setIsNavOpen(false);
                          // Checking if the snippets are visible, if they are then clicking "Show snippets" button
                          if (document.getElementById("showSnippsCheck")) {
                            const checkbox = document.getElementById("showSnippsCheck").checked;
                            if (checkbox === true) {
                              document.getElementById("showSnippsCheck").click();
                              console.log("snippets hidden");
                            }
                          }
                            return navigate("/snippets/seed");
                        }
                      }}
                      className="border-b border-orange-400 my-8 uppercase"
                    >
                      Default snippets
                    </button>
                  ) : (
                    <button
                      className="border-b border-red-600 text-red-600 my-8 uppercase"
                      onClick={() => {
                        networkStateUpdate();
                      }}
                    >
                      Default snippets
                    </button>
                  )}
                  <button
                    className="border-b border-orange-400 my-8 uppercase"
                    onClick={() => themeChange()}
                  >
                    Light / Dark
                  </button>

                  <Form method="post" action="/logout" name="mobileLogoutForm">
                    {networkState === "online" ? (
                      <button
                        type="submit"
                        className="border-b border-orange-400 my-8 uppercase"
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
                  </Form>
                </ul>
              </div>
            </section>
            {/* Desktop menu */}
            <ul className="hidden space-x-8 lg:flex">
            <li className="border-b border-orange-400 my-2 uppercase">
                    <a href="/profile">Profile</a>
                  </li>
                  <Link
                    to="/snippets"
                    className="border-b border-orange-400 my-2 uppercase"
                    onClick={() => {
                      setIsNavOpen(false);
                    }}
                  >
                    Snippets
                  </Link>
                  {networkState === "online" ? (
                    <button
                      type="button"
                      onClick={() => {
                        networkStateUpdate();
                        if (navigator.onLine) {
                          console.log("online");
                          setIsNavOpen(false);
                          // Checking if the snippets are visible, if they are then clicking "Show snippets" button
                          if (document.getElementById("showSnippsCheck")) {
                            const checkbox =
                              document.getElementById("showSnippsCheck").checked;
                            if (checkbox === false) {
                              document.getElementById("showSnippsCheck").click();
                              console.log("snippets hidden");
                            }
                          }
                            return navigate("/snippets/new");
                        }
                      }}
                      className="border-b border-orange-400 my-2 uppercase"
                    >
                      New code snippet
                    </button>
                  ) : (
                    <button
                      className="border-b border-red-600 text-red-600 my-2 uppercase"
                      onClick={() => {
                        networkStateUpdate();
                      }}
                    >
                      New code snippet
                    </button>
                  )}
                  {networkState === "online" ? (
                    <button
                      type="button"
                      onClick={() => {
                        networkStateUpdate();
                        if (navigator.onLine) {
                          console.log("online");
                          setIsNavOpen(false);
                          // Checking if the snippets are visible, if they are then clicking "Show snippets" button
                          if (document.getElementById("showSnippsCheck")) {
                            const checkbox = document.getElementById("showSnippsCheck").checked;
                            if (checkbox === false) {
                              document.getElementById("showSnippsCheck").click();
                              console.log("snippets hidden");
                            }
                          }
                            return navigate("/snippets/seed");
                        }
                      }}
                      className="border-b border-orange-400 my-2 uppercase"
                    >
                      Default snippets
                    </button>
                  ) : (
                    <button
                      className="border-b border-red-600 text-red-600 my-2 uppercase"
                      onClick={() => {
                        networkStateUpdate();
                      }}
                    >
                      Default snippets
                    </button>
                  )}
                  <button
                    className="border-b border-orange-400 my-2 uppercase"
                    onClick={() => themeChange()}
                  >
                    Light / Dark
                  </button>

                  <Form method="post" action="/logout" name="mobileLogoutForm">
                    {networkState === "online" ? (
                      <button
                        type="submit"
                        className="border-b border-orange-400 my-2 uppercase"
                      >
                        Log out
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          networkStateUpdate();
                        }} // this button is showing if youre offline
                        className="border-b border-red-600 text-red-600 my-2 uppercase"
                      >
                        Log out
                      </button>
                    )}
                  </Form>
            </ul>
          </nav>
          <style>{`
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
