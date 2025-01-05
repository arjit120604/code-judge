import { NextResponse } from "next/server";
import { signupSchema } from "@/lib/zod";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";

export async function POST(req: Request){
    try {
        const body = await req.json();
        const validatedFields = signupSchema.safeParse(body);
        const exists = await prisma.user.findFirst({
            where: {
                OR:[
                    {email: validatedFields.data?.email},
                    {name: validatedFields.data?.username}
                ]
            }
        })

        if (exists){
            return NextResponse.json({error: "User already exists"},
                {status: 400})
        }
        const hashedPassword = await hash(validatedFields.data?.password ?? "", 10);
        const user = await prisma.user.create({
            data: {
                email: validatedFields.data?.email ?? "",
                name: validatedFields.data?.name ?? "",
                password: hashedPassword,
                updatedAt: new Date(),
            }
        })
        return NextResponse.json({user})
    } catch (e) {
        console.log(e);
        return NextResponse.json({error: "internal server error + "}, {status: 500})
    }
}