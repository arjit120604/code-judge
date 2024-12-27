import { Suspense } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Problems from "./problems/page";

async function getProblems() {
//   const problems = await prisma.problem.findMany({
//     orderBy: {
//       createdAt: 'desc'
//     },
//     take: 6,
//     where: {
//       hidden: false
//     }
//   });
//   return problems;
return [];
}

export default async function Home() {
  const [session, problems] = await Promise.all([
    getServerSession(),
    getProblems()
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to CodeJudge</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Practice coding problems, participate in contests, and improve your programming skills.
          </p>
          
          {!session && (
            <div className="flex gap-4 justify-center">
              <Link href="/signin">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/problems">
                <Button variant="outline" size="lg">Browse Problems</Button>
              </Link>
            </div>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Featured Problems</h2>
            <Link href="/problems">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 rounded-lg animate-pulse bg-muted" />
              ))}
            </div>
          }>
            <Problems problems={problems} />
          </Suspense>
        </section>

        {session && (
          <section className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready for a Challenge?</h2>
            <Link href="/contests">
              <Button size="lg">View Active Contests</Button>
            </Link>
          </section>
        )}
      </main>

      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} CodeJudge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}