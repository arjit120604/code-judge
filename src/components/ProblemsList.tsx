"use client";

import { Problem } from "@prisma/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import Link from "next/link";

type ProblemsListProps = {
  initialProblems: Problem[];
};

export default function ProblemsList({ initialProblems }: ProblemsListProps) {
  const [problems, setProblems] = useState(initialProblems);
  const [difficulty, setDifficulty] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filteredProblems = problems.filter((problem) => {
    const matchesDifficulty = difficulty === "ALL" || problem.difficulty === difficulty;
    const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="EASY">Easy</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HARD">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
          <div className="col-span-6">Title</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-2">Points</div>
          <div className="col-span-2">Action</div>
        </div>
        
        {filteredProblems.map((problem) => (
          <div key={problem.problemId} className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/50">
            <div className="col-span-6">{problem.title}</div>
            <div className="col-span-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                problem.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                problem.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {problem.difficulty}
              </span>
            </div>
            <div className="col-span-2">{problem.points || '-'}</div>
            <div className="col-span-2">
              <Link href={`/problems/${problem.problemId}`}>
                <Button variant="outline" size="sm">Solve</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}