import React from 'react'
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import { Controlled as ControlledEditor } from "react-codemirror2";

export default function editor({ props }) {
    const { 
        displayName,
        langauge,
        value,
        onChange
    } = props

    function handleChange(editor, data, value) {
        onChange(value);
    }

  return (
    <div className="editor-container">
        <div className="editorTitle">
              {displayName}
          </div>
          <ControlledEditor
              onBeforeChange={handleChange}
              value={value}
              className="code-mirror-wrapper"
              options={{ lineWrapping: true, lint: true, mode: langauge, lineNumbers: true }}
          />
    </div>
  )
}
