import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Problem = {
  problemId: string;
  title: string;
  difficulty: string;
  points: number;
};

export function ExistingProblemSelect({ onSelect }: { onSelect: (problem: Problem) => void }) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const response = await fetch('/api/problems');
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProblems();
  }, []);

  if (loading) {
    return <div>Loading problems...</div>;
  }

  return (
    <div className="flex gap-2">
      <Select onValueChange={(value) => {
        const problem = problems.find(p => p.problemId === value);
        if (problem) onSelect(problem);
      }}>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select an existing problem" />
        </SelectTrigger>
        <SelectContent>
          {problems.map((problem) => (
            <SelectItem key={problem.problemId} value={problem.problemId}>
              {problem.title} ({problem.difficulty})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 