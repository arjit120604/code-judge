import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { TestCaseResult } from "@prisma/client";
// import { authOptions } from "@/lib/auth";
import { getProblem } from "@/lib/problems";
import { languages } from "monaco-editor";
import axios from 'axios'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const data = await req.json();
    console.log(data);
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    console.log(user);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const dbProblem = await prisma.problem.findUnique({
      where: { id: data.problemId }
    });
    console.log(dbProblem);
    if (!dbProblem) {
      return NextResponse.json({ message: "Problem not found" }, { status: 404 });
    }

    const problem = await getProblem(dbProblem.slug, data.languageId);
    problem.fullBoilerPlate = problem.fullBoilerPlate.replace(
        'user_code',
        data.code
    )
    console.log(process.env.JUDGE0_URI);
    const response = await axios.post(
        `${process.env.JUDGE0_URI}/submissions?base64_encoded=false`,
        {
            submission: problem.inputs.map((input, index) => ({
                language_id: data.languageId,
                source_code: problem.fullBoilerPlate,
                stdin: input,
                expected_output: problem.outputs[index],
                callback_url: `${process.env.WEBHOOK_URI}/submission-webhook`
            }))
        }
    )
    console.log(response.statusText)
    // console.log(response.data);
    // Create submission record
    const submission = await prisma.submission.create({
      data:{
        userId: user.id,
        problemId: data.problemId,
        languageId: data.languageId,
        code: data.code,
        fullCode: problem.fullBoilerPlate,
        status: "PENDING",
        activeContestId: data.activeContestId,
      }
    });
    console.log(submission)
    // Create test cases for the submission
    await prisma.testCase.createMany({
      data: problem.inputs.map((input,index)=>({
        submissionId: submission.id,
        status: "PENDING",
        index,
        judge0TrackingId: response.data[index].token
      }))
    });
    console.log(submission);
    return NextResponse.json({ 
      message: "Submission created successfully",
      submissionId: submission.id 
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}