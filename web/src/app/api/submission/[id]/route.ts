import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
    const id = params.id;
    const submissions = await prisma.submission.findUnique({
        where: {id}
    })

  return NextResponse.json(submissions);
}