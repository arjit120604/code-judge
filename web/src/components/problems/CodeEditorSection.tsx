"use client";

import { useState, useRef } from "react";
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
import { toast } from "sonner";
import { DefaultCode } from "@prisma/client";
import axios from "axios";

interface CodeEditorSectionProps {
  problemId: string;
  defaultCodes: DefaultCode[];
}

const JUDGE0ID: Record<string, number> = {
  python: 71,
  javascript: 63,
  cpp: 54
};

const idToLanguage: Record<string, number> = {
    python: 1,
    javascript: 2,
    cpp: 3,
}

export default function CodeEditorSection({ problemId, defaultCodes }: CodeEditorSectionProps) {
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  
  const currentCode = defaultCodes.find(code => idToLanguage[language] === code.languageId)?.code || "";

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (editorRef.current) {
      const code = defaultCodes.find(code => idToLanguage[newLanguage] === code.languageId)?.code || "";
      editorRef.current.setValue(code);
    }
  };

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const poll = async(submissionId: string, retries: number) => {
    if (retries === 0){
      return;
    }

    const response = await axios.get(
      `/api/submission/?id=${submissionId}`
    )
    if (response.data.submission.status === "PENDING"){
      await new Promise((resolve) => setTimeout(resolve, 1000));

      poll(submissionId, retries - 1);
    }else{
      return ;
    }
    
  }

  const handleSubmit = async () => {
    if (!editorRef.current) return;
    
    try {
      setLoading(true);
      const code = editorRef.current.getValue();
      
      const response = await fetch('/api/submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          problemId,
          languageId: idToLanguage[language],
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit solution');
      }
      
      toast.success('Solution submitted successfully!');
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
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
          onClick={handleSubmit} 
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Solution"}
        </Button>
      </div>

      <div className="h-[calc(100vh-8rem)] border rounded-lg overflow-hidden">
        <CodeEditor
          language={language}
          defaultValue={currentCode}
          height="100%"
          onMount={handleEditorMount}
        />
      </div>
    </div>
  );
} 