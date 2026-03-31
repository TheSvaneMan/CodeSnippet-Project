// app/components/snipView.jsx
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";

// Import M3 Icons
import "@material/web/icon/icon.js";

export default function SnipView({ snip }) {
  // 1. Dynamic Language Selection
  const getLanguageExtension = (language) => {
    switch (language?.toLowerCase()) {
      case "javascript":
        return javascript({ jsx: true });
      case "html":
        return html();
      case "css":
        return css();
      case "python":
        return python();
      case "java":
      case "c":
        return java();
      default:
        return javascript(); // Fallback
    }
  };

  // 2. Safe Date Formatting
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(snip.updatedAt));

  return (
    <div className="flex flex-col gap-6 mb-6">
      {/* Header Area */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-2">
          {snip.title}
        </h1>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-on-surface-variant">
          <div className="flex items-center gap-1">
            <md-icon className="text-base">calendar_today</md-icon>
            {formattedDate}
          </div>
          <div className="flex items-center gap-1">
            <md-icon className="text-base">code</md-icon>
            <span className="capitalize">{snip.language}</span>
          </div>
          <div className="flex items-center gap-1">
            <md-icon className="text-base">
              {snip.shareable ? "public" : "lock"}
            </md-icon>
            {snip.shareable ? "Public" : "Private"}
          </div>
        </div>
      </div>

      {/* Tags (M3 Chip Style) */}
      <div className="flex flex-wrap gap-2">
        {snip.tags.length === 0 ? (
          <span className="text-sm italic text-outline">No tags applied</span>
        ) : (
          snip.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm font-medium rounded-full bg-secondary-container text-on-secondary-container"
            >
              {tag}
            </span>
          ))
        )}
      </div>

      {/* Description */}
      <div className="p-4 rounded-2xl bg-surface-container-low text-on-surface leading-relaxed border border-outline-variant">
        <p>{snip.description}</p>
      </div>

      {/* CodeMirror Container */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-bold tracking-wider uppercase text-primary">
            Source Code
          </span>
        </div>

        {/* The Editor is wrapped in an M3 surface container with hidden overflow for perfect rounded corners */}
        <div className="overflow-hidden rounded-2xl border border-outline-variant shadow-sm bg-surface-container-highest">
          <CodeMirror
            value={snip.code}
            extensions={[getLanguageExtension(snip.language)]}
            readOnly={true}
            editable={false}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              highlightActiveLine: false, // Disabled for pure viewing
            }}
            theme="dark" // Forces a dark theme for the code block which generally looks better and highlights syntax clearly
            className="text-sm md:text-base"
          />
        </div>
      </div>
    </div>
  );
}
