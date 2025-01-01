import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { problemSchema } from "@/lib/zod";

export async function GET() {
  try {
    const problems = await prisma.problem.findMany({
      where: {
        contestId: null,
        hidden: false
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        testcases: {
          where: {
            hidden: false
          }
        }
      }
    });
    return NextResponse.json(problems);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Failed to fetch problems" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedFields = problemSchema.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }
    const { title, description, difficulty, points, testcases } = validatedFields.data;

    const boilerplateCode = generateBoilerplate({
      "Function name": title.toLowerCase().replace(/\s+/g, '_'),
      "Input Fields": testcases.map(t => t.input),
      "Output Field": "void" 
    });

    const problem = await prisma.problem.create({
      data: {
        problemId: crypto.randomUUID(),
        title,
        description,
        difficulty,
        points,
        boilerplateCode: boilerplateCode,
        testcases: {
          create: testcases.map(testcase => ({
            testcaseId: crypto.randomUUID(),
            input: testcase.input,
            hidden: testcase.hidden
          }))
        }
      },
      include: {
        testcases: true
      }
    });

    return NextResponse.json({ problem });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create problem" },
      { status: 500 }
    );
  }
}