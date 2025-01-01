"use client";
import { Editor } from "@monaco-editor/react";
import { useRef } from "react";
import type { editor } from "monaco-editor";

interface CodeEditorProps {
  language?: string;
  defaultValue?: string;
  height?: string;
  onMount?: (editor: editor.IStandaloneCodeEditor) => void;
}

export default function CodeEditor({
  language = "cpp",
  defaultValue = "",
  height = "80vh",
  onMount
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    if (onMount) {
      onMount(editor);
    }
  };

  return (
    <Editor 
      height={height}
      defaultLanguage={language}
      defaultValue={defaultValue}
      theme="vs-dark"
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
}