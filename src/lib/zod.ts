import {z} from 'zod';

const authSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(6).max(100),
})
const signupSchema = z.object({
    username: z.string().min(3).max(50),
    name: z.string().min(3).max(50),
    password: z.string().min(6).max(100),
    email: z.string().email(),
})

type SignupInput = z.infer<typeof signupSchema>;
type AuthInput = z.infer<typeof authSchema>;
export {authSchema, signupSchema};
export type { AuthInput, SignupInput };