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
import { toast } from "sonner";

interface BoilerplateVersion {
  minimal: string;
  full: string;
}

const DEFAULT_BOILERPLATE: Record<string, BoilerplateVersion> = {
  python: { minimal: "", full: "" },
  javascript: { minimal: "", full: "" },
  cpp: { minimal: "", full: "" }
};

// Language ID mappings for Judge0 API (matches Language.judge0Id in schema)
const LANGUAGE_IDS: Record<string, number> = {
  python: 71,
  javascript: 63,
  cpp: 54
};

interface SubmissionResponse {
  id: string;
  status: 'PENDING' | 'AC' | 'FAILED';
  memory?: number;
  time?: number;
  message?: string;
}

export default function CodeEditorSection({ problemId }: { problemId: string }) {
  const [language, setLanguage] = useState("python");
  const [boilerplate, setBoilerplate] = useState<Record<string, BoilerplateVersion>>(DEFAULT_BOILERPLATE);
  const [loading, setLoading] = useState(true);
  const [isFullBoilerplate, setIsFullBoilerplate] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    async function fetchBoilerplate() {
      try {
        const response = await fetch(`/api/problems/${problemId}/boilerplate`);
        const data = await response.json();
        if (data.boilerplate) {
          setBoilerplate(data.boilerplate as Record<string, BoilerplateVersion>);
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
          languageId: LANGUAGE_IDS[language],
          fullCode: isFullBoilerplate ? 
            boilerplate[language].full : 
            boilerplate[language].minimal
        }),
      });

      const data: SubmissionResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit solution');
      }
      
      if (data.status === 'AC') {
        toast.success('Solution accepted!', {
          description: `Memory: ${data.memory}KB, Time: ${data.time}ms`
        });
      } else if (data.status === 'FAILED') {
        toast.error('Solution failed!', {
          description: 'Check the test cases for more details'
        });
      } else {
        toast.info('Solution submitted successfully!', {
          description: 'Your solution is being evaluated'
        });
      }
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
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