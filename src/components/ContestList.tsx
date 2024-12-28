"use client";

import { Contest, User } from "@prisma/client";
import { Button } from "./ui/button";
import Link from "next/link";
import {  format } from "date-fns";

type ContestWithRelations = Contest & {
  admin: Pick<User, 'name' | 'username'>;
  problems: { problemId: string }[];
};

type ContestsListProps = {
  initialContests: ContestWithRelations[];
};

export default function ContestsList({ initialContests }: ContestsListProps) {
  return (
    <div className="space-y-4">
      {initialContests.map((contest) => (
        <div key={contest.contestId} className="border rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold mb-2">{contest.description}</h3>
              <p className="text-sm text-muted-foreground">
                Created by {contest.admin.name} (@{contest.admin.username})
              </p>
            </div>
            <Link href={`/contests/${contest.contestId}`}>
              <Button variant="outline">View Details</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Start Time</p>
              <p className="font-medium">
                {contest.startTime ? format(contest.startTime, 'PPp') : 'TBA'}
              </p>
              <p className="text-xs text-muted-foreground">
                {contest.startTime && format(contest.startTime, 'PPp')}
              </p>
            </div>
            
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">
                {contest.startTime && contest.endTime ? 
                  format(contest.endTime, 'PPp') : 
                  'TBA'
                }
              </p>
            </div>
            
            <div>
              <p className="text-muted-foreground">Problems</p>
              <p className="font-medium">{contest.problems.length}</p>
            </div>
          </div>
        </div>
      ))}
      
      {initialContests.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No active contests at the moment.
        </div>
      )}
    </div>
  );
}