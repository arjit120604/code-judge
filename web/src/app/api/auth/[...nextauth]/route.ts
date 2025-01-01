import NextAuth from "next-auth/next";
import  CredentialsProvider  from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { authSchema } from "@/lib/zod";
import Google from "next-auth/providers/google";
const handler = NextAuth({
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            username: { label: "Username", type: "text" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            if (!credentials?.username || !credentials?.password) {
              return null
            }
            const validatedFields = authSchema.safeParse(credentials);
            
            if (!validatedFields.success) {
              return null
            }
            const user = await prisma.user.findUnique({
              where: {
                username: validatedFields.data.username
              }
            })

            if (!user) {
              return null
            }
            const passwordMatch = await compare(validatedFields.data.password, user.password)
            if (!passwordMatch) {
              return null
            }
            return {
              id:user.userId,
              ...user
            }

          }
        }),
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID ?? "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET?? "",
        })
      ],
      callbacks: {
        async signIn({user, account}){
          if (account?.provider === "google"){
            const existingUser = await prisma.user.findUnique({
              where:{
                email: user.email!
              }
            })

            if (!existingUser){
              await prisma.user.create({
                data:{
                  email:user.email!,
                  name:user.name!,
                  username: user.email!.split('@')[0],
                  password: ""
                }
              })
            }
          }
          return true;
        },
      },
      pages:{
        signIn: '/signin'
      },
      secret: process.env.NEXTAUTH_SECRET

})

export {handler as GET, handler as POST};