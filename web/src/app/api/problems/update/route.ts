import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";

const languages = [
    { name: "cpp", judge0Id: 54, extension: "cpp", id: 3 },
    { name: "python", judge0Id: 71, extension: "py", id: 1 },
    { name: "javascript", judge0Id: 63, extension: "js", id: 2 },
    // { name: 'java', judge0Id: 62, extension: 'java' },
];

export async function POST(req: NextRequest) {
    try {
        const problemDir = process.env.PROBLEM_PATH;
        if (!problemDir) {
            return NextResponse.json({ message: "Problem path is not configured" }, { status: 500 });
        }

        let data;
        try {
            data = await req.json();
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
        }

        if (!data || typeof data !== "object" || !data.slug || !data.title) {
            return NextResponse.json({
                message: "Invalid payload. Required fields: slug, title",
            }, { status: 400 });
        }

        const { slug: problemSlug, title: problemTitle, difficulty = "EASY" } = data;
        const problemPath = path.join(problemDir, problemSlug);

        // Check if problem directory exists
        try {
            await fs.access(problemPath);
        } catch (err) {
            console.log(err);
            return NextResponse.json({ 
                message: `Problem directory not found: ${problemSlug}` 
            }, { status: 404 });
        }

        // Read description file
        let description;
        try {
            description = await fs.readFile(
                path.join(problemPath, "description.txt"),
                "utf-8"
            );
        } catch (err) {
            console.log(err);
            return NextResponse.json({ 
                message: "Failed to read description file" 
            }, { status: 500 });
        }

        // Update problem in database
        const problem = await prisma.problem.upsert({
            where: { slug: problemSlug },
            create: {
                title: problemTitle,
                slug: problemSlug,
                description,
                difficulty,
            },
            update: {
                title: problemTitle,
                description,
                difficulty,
            },
        });

        // Update boilerplate code for each language
        for (const language of languages) {
            try {
                const codePath = path.join(
                    problemPath,
                    "boilerplate",
                    `function.${language.extension}`
                );
                const code: string = (await fs.readFile(codePath, "utf-8")).toString();
                
                await prisma.defaultCode.upsert({
                    where: {
                        languageId_problemId: {
                            languageId: language.id,
                            problemId: problem.id,
                        },
                    },
                    create: {
                        code,
                        languageId: language.id,
                        problemId: problem.id,
                    },
                    update: { code },
                });
            } catch (err) {
                console.error(`Failed to process ${language.name} boilerplate:`, err);
                // Continue with other languages even if one fails
            }
        }

        return NextResponse.json({ 
            message: "Problem updated successfully",
            problemId: problem.id 
        });

    } catch (err) {
        console.error("Unexpected error:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
