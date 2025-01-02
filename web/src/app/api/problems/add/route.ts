import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import prisma from "@/lib/prisma";


export async function POST(req: NextRequest){
    try{
        // add zod validation
        const data = await req.json();
        const problemsDir = process.env.PROBLEMS_DIR as string;
        
        const response = await prisma.problem.create({
            data:{
                title: data.title,
                description: data.description,
                difficulty: data.difficulty ?? 'EASY',
                slug: data.slug,
                inputs: data.inputs,
                outputs: data.outputs
            }
        })
    }
}