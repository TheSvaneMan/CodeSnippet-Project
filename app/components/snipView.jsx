import React from "react";
import CodeMirror from "@uiw/react-codemirror";
//import { languages } from "@codemirror/language-data";
//import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
//https://codesandbox.io/s/iudnj?file=/src/App.js - support for all languages
import {javascript} from "@codemirror/lang-javascript"



export default function SnipView({ snip }) {
  const onChange = React.useCallback((value, viewUpdate) => {
    console.log("value:", value);
  }, []);
  return (
    <div id="Snippet-Data" className="grid grid-cols-1 space-y-2 mb-5">
      <h1 className="text-2xl font-bold mb-2">{snip.title}</h1>
      <h1>
        <b>Date:</b> {snip.updatedAt.slice(0, 10)}
      </h1>
      <h1>
        <b>Language:</b> {snip.language}
      </h1>
      <h1>
      <b>Tags:</b>
    </h1>
      <div
            className={
              snip.tags.length === 0
                ? "grid grid-cols-1 text-orange-400"
                : "grid grid-cols-4"
            }
          >
            {snip.tags.length === 0 ? (
              <p>No tags for this code snippet.</p>
            ) : (
              snip.tags.toString().split(',').map((tag) => {
                return (
                  <button
                    key={tag}
                    className="cursor-default justify-items-center mr-2 mb-2 p-2 align-middle bg-orange-400 rounded-lg text-neutral-800"
                    value={tag}
                  >
                    {tag}
                  </button>
                );
              })
            )}
          </div>
      <h1>
        <b>Description:</b> {snip.description}
      </h1>
      <div id="Code-block" className="grid grid-cols-1 space-y-4">
        <b>Code:</b>
        <CodeMirror
          value={snip.code}
          height="300px"
          onChange={onChange}
/*           extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages })
          ]} */
          extensions={[javascript({ jsx: true })]}
          className="text-neutral-800 bg-neutral-100 rounded-xl"
        />
      </div>
      <h1>
        <b>Favorite:</b> {snip.favorite ? "Yes" : "No"}
      </h1>
      <p>
        <b>Privacy: </b> {snip.shareable ? "Public" : "Private"}
      </p>
      <style>{`
      .cm-editor {
          border-radius: 12px;
      }
      .cm-scroller {
        border-radius: 12px;
      }
        `}
      </style>
    </div>
  );
}
