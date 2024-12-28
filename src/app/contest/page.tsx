import { Suspense } from "react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ContestsList from "@/components/ContestList";
import prisma from "@/lib/prisma";

async function getContests() {
  const contests = await prisma.contest.findMany({
    where: {
      hidden: false,
      endTime: {
        gte: new Date()
      }
    },
    include: {
      admin: {
        select: {
          name: true,
          username: true
        }
      },
      problems: {
        select: {
          problemId: true
        }
      }
    },
    orderBy: {
      startTime: 'asc'
    }
  });
  return contests;
}

export default async function ContestsPage() {
  const [session, contests] = await Promise.all([
    getServerSession(),
    getContests()
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Contests</h1>
            <p className="text-muted-foreground">
              Participate in coding contests and compete with others
            </p>
          </div>
          
          {session && (
            <Link href="/contests/new">
              <Button>Create Contest</Button>
            </Link>
          )}
        </div>

        <Suspense fallback={
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-lg animate-pulse bg-muted" />
            ))}
          </div>
        }>
          <ContestsList initialContests={contests} />
        </Suspense>
      </main>
    </div>
  );
}