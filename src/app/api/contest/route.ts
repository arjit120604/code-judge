import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { contestSchema } from "@/lib/zod";

export async function GET() {
  try {
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
    return NextResponse.json(contests);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch contests" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // const session = await getServerSession();
    // const user = await prisma.user.findUnique({
    //     where:{
    //         email:session?.user?.email??""
    //     }
    // })
    
    // if (!user) {
    //   return NextResponse.json(
    //     { error: "User not found" },
    //     { status: 404 }
    //   );
    // }

    const body = await req.json();
    console.log(body);
    const validatedFields = contestSchema.safeParse(body);
    console.log(validatedFields.error)
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const { description, startTime, endTime, hidden } = validatedFields.data
    const contest = await prisma.contest.create({
      data: {
        contestId: crypto.randomUUID(),
        title: "hey",
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        hidden,
        // adminId: user.userId || "cm57ahqms0000ro9qslpp424z"
        adminId: "cm57ahqms0000ro9qslpp424z"
      }
    });

    return NextResponse.json({ contest });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create contest" },
      { status: 500 }
    );
  }
}