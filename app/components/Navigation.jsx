// app/components/Navigation.jsx
import { Link, Form, NavLink, useNavigate } from "@remix-run/react";
import { useState } from "react";

// Import Material 3 Web Components
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";

export default function Navigation({
  networkStateUpdate,
  themeChange,
  networkState,
}) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();
  const isOnline = networkState === "online";

  const handleNavClick = (path) => {
    networkStateUpdate();
    setIsNavOpen(false);
    if (isOnline) {
      navigate(path);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-4 py-3 bg-surface-container shadow-sm text-on-surface">
      {/* Brand / Logo Area */}
      <div className="flex items-center gap-2">
        <md-icon className="text-primary">code</md-icon>
        <button
          onClick={() => handleNavClick("/snippets")}
          className="text-2xl font-bold tracking-tight text-primary hover:opacity-80 transition-opacity"
        >
          KeepSnip
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-2">
        <md-text-button onClick={() => handleNavClick("/profile")}>
          Profile
        </md-text-button>
        <md-text-button onClick={() => handleNavClick("/snippets")}>
          Snippets
        </md-text-button>
        <md-text-button onClick={() => handleNavClick("/snippets/seed")}>
          Default Snippets
        </md-text-button>
        <div className="w-px h-6 bg-outline-variant mx-2"></div> {/* Divider */}
        <md-icon-button onClick={themeChange} aria-label="Toggle Theme">
          <md-icon>light_mode</md-icon>
        </md-icon-button>
        <Form method="post" action="/logout" className="inline-block">
          <md-icon-button
            type="submit"
            disabled={!isOnline}
            aria-label="Logout"
          >
            <md-icon>logout</md-icon>
          </md-icon-button>
        </Form>
        {/* Primary Action Button */}
        <div className="ml-4">
          <md-filled-button
            onClick={() => handleNavClick("/snippets/new")}
            disabled={!isOnline}
          >
            <md-icon slot="icon">add</md-icon>
            New Snippet
          </md-filled-button>
        </div>
      </nav>

      {/* Mobile Navigation Controls */}
      <div className="flex items-center lg:hidden gap-2">
        <md-icon-button onClick={themeChange}>
          <md-icon>light_mode</md-icon>
        </md-icon-button>

        <md-icon-button onClick={() => setIsNavOpen(!isNavOpen)}>
          <md-icon>{isNavOpen ? "close" : "menu"}</md-icon>
        </md-icon-button>
      </div>

      {/* Mobile Menu Overlay (M3 Full Screen Dialog Style) */}
      {isNavOpen && (
        <div className="absolute top-full left-0 w-full h-screen bg-surface-container-high flex flex-col p-4 gap-4 lg:hidden">
          {!isOnline && (
            <div className="p-3 mb-2 rounded-xl bg-error-container text-on-error-container text-sm font-medium flex items-center gap-2">
              <md-icon>wifi_off</md-icon>
              You are currently offline.
            </div>
          )}

          <md-filled-button
            className="w-full mb-4"
            onClick={() => handleNavClick("/snippets/new")}
            disabled={!isOnline}
          >
            <md-icon slot="icon">add</md-icon>
            New Snippet
          </md-filled-button>

          <button
            className="flex items-center gap-4 p-4 rounded-xl active:bg-surface-variant text-left"
            onClick={() => handleNavClick("/profile")}
          >
            <md-icon className="text-on-surface-variant">person</md-icon>
            <span className="text-title-medium font-medium text-on-surface">
              Profile
            </span>
          </button>

          <button
            className="flex items-center gap-4 p-4 rounded-xl active:bg-surface-variant text-left"
            onClick={() => handleNavClick("/snippets")}
          >
            <md-icon className="text-on-surface-variant">data_object</md-icon>
            <span className="text-title-medium font-medium text-on-surface">
              My Snippets
            </span>
          </button>

          <button
            className="flex items-center gap-4 p-4 rounded-xl active:bg-surface-variant text-left"
            onClick={() => handleNavClick("/snippets/seed")}
          >
            <md-icon className="text-on-surface-variant">library_books</md-icon>
            <span className="text-title-medium font-medium text-on-surface">
              Default Snippets
            </span>
          </button>

          <Form method="post" action="/logout" className="mt-auto pb-20 w-full">
            <button
              type="submit"
              disabled={!isOnline}
              className="flex items-center gap-4 p-4 w-full rounded-xl active:bg-surface-variant text-error disabled:opacity-50"
            >
              <md-icon>logout</md-icon>
              <span className="text-title-medium font-medium">Log out</span>
            </button>
          </Form>
        </div>
      )}
    </header>
  );
}
