"use client";
import { Editor } from "@monaco-editor/react";
import { useRef } from "react";
import type { editor } from "monaco-editor";

export default function CodeEditor({}){
    const ref = useRef<editor.IStandaloneCodeEditor | null>(null);
    const handleOnMount = (editor: editor.IStandaloneCodeEditor)=>{
        ref.current = editor;
    }
    const handleOnChange = ()=>{
        console.log(ref.current?.getValue());
    }
    return (
    <>
        <Editor 
        height="80vh"
        defaultLanguage="cpp"
        theme="vs-dark"
        onMount={handleOnMount}
        onChange={handleOnChange}
        width="50vw"
        options={{
            minimap:{enabled: false},
            fontSize:14
        }}
        />
    </>
    )
}