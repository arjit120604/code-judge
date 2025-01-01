import { Suspense } from "react";
import prisma from "@/lib/prisma";
import ProblemsList from "@/components/ProblemsList";
import Navbar from "@/components/Navbar";

async function getProblems() {
  const problems = await prisma.problem.findMany({
    where: {
      hidden: false
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return problems;
}

export default async function ProblemsPage() {
  const problems = await getProblems();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Practice Problems</h1>
          <p className="text-muted-foreground">
            Solve coding problems and improve your skills
          </p>
        </div>

        <Suspense fallback={
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-lg animate-pulse bg-muted" />
            ))}
          </div>
        }>
          <ProblemsList initialProblems={problems} />
        </Suspense>
      </main>
    </div>
  );
}