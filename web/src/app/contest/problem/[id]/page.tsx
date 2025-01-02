import { Suspense } from "react";
import CodeEditorSection from "@/components/problems/CodeEditorSection";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";

async function getProblem(id: string) {
  const problem = await prisma.problem.findUnique({
    where: { id: id },
    },
  );

  if (!problem) {
    notFound();
  }

  return problem;
}

export default async function ProblemPage({
  params,
}: {
  params: { id: string };
}) {
    const id = (await params).id;
  const problem = await getProblem(id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-4">
        <div className="grid grid-cols-2 gap-4 h-[calc(100vh-5rem)]">
          <div className="space-y-4 overflow-y-auto">
            <div className="border rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
              <div className="prose dark:prose-invert max-w-none">
                {problem.description}
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Sample Test Cases</h3>
                <div className="space-y-4">
                  {/* {problem.map((testcase) => (
                    <div key={testcase.testcaseId} className="border rounded-lg p-4">
                      <div className="font-mono">
                        <p className="text-sm text-muted-foreground">Input:</p>
                        <pre className="bg-muted p-2 rounded mt-1">{testcase.input}</pre>
                      </div>
                      <div className="font-mono mt-2">
                        <p className="text-sm text-muted-foreground">Output:</p>
                        <pre className="bg-muted p-2 rounded mt-1">{testcase.output}</pre>
                      </div>
                    </div>
                  ))} */}
                </div>
              </div>
            </div>
          </div>
          <Suspense fallback={<Skeleton className="h-full" />}>
            <CodeEditorSection problemId={id} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}