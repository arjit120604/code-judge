"use client";

import { useEffect, useState, useRef } from "react";
import CodeEditor from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { editor } from "monaco-editor";

const DEFAULT_BOILERPLATE: Record<string, string> = {
  python: "",
  javascript: "",
  cpp: ""
};

export default function CodeEditorSection({ problemId }: { problemId: string }) {
  const [language, setLanguage] = useState("python");
  const [boilerplate, setBoilerplate] = useState<Record<string, string>>(DEFAULT_BOILERPLATE);
  const [loading, setLoading] = useState(true);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    async function fetchBoilerplate() {
      try {
        const response = await fetch(`/api/problems/${problemId}/boilerplate`);
        const data = await response.json();
        if (data.boilerplate) {
          // Extract minimal versions from the boilerplate
          const minimalVersions = Object.entries(data.boilerplate).reduce((acc, [lang, code]) => ({
            ...acc,
            [lang]: code.minimal
          }), {});
          setBoilerplate(minimalVersions);
        }
      } catch (error) {
        console.error("Failed to fetch boilerplate:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBoilerplate();
  }, [problemId]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (editorRef.current) {
      const code = isFullBoilerplate ? 
        boilerplate[newLanguage].full : 
        boilerplate[newLanguage].minimal;
      
      editorRef.current.setValue(code || "");
      const monaco = editorRef.current.getModel();
      if (monaco) {
        monaco.setLanguage(newLanguage);
      }
    }
  };

  const toggleBoilerplateType = () => {
    setIsFullBoilerplate(!isFullBoilerplate);
    if (editorRef.current) {
      const code = !isFullBoilerplate ? 
        boilerplate[language].full : 
        boilerplate[language].minimal;
      editorRef.current.setValue(code || "");
    }
  };

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const handleSubmit = async () => {
    // Submit logic will be implemented later
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={toggleBoilerplateType}
          >
            {isFullBoilerplate ? "Simple Mode" : "Full Mode"}
          </Button>
        </div>
        <Button onClick={handleSubmit}>Submit Solution</Button>
      </div>

      <div className="h-[calc(100vh-8rem)] border rounded-lg overflow-hidden">
        <CodeEditor
          language={language}
          defaultValue={isFullBoilerplate ? 
            boilerplate[language].full : 
            boilerplate[language].minimal}
          height="100%"
          onMount={handleEditorMount}
        />
      </div>
    </div>
  );
} 