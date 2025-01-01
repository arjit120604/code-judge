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
const testcaseSchema = z.object({
    input: z.string(),
    hidden: z.boolean().default(true)
});
  
const boilerplateSchema = z.object({
  python: z.object({
    full: z.string(),
    minimal: z.string()
  }),
  javascript: z.object({
    full: z.string(),
    minimal: z.string()
  }),
  cpp: z.object({
    full: z.string(),
    minimal: z.string()
  })
});

const problemSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    points: z.number().int().positive().optional(),
    testcases: z.array(testcaseSchema).min(1),
    solution: z.string().min(1),
    boilerplate: boilerplateSchema,
    fullBoilerplate: boilerplateSchema
});

const contestSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    startTime: z.string(),
    endTime: z.string(),
    hidden: z.boolean().default(false),
    problems: z.array(z.object({
      title: z.string().min(3),
      description: z.string(),
      difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
      points: z.number().int().positive().optional(),
      testcases: z.array(testcaseSchema).min(1),
      problemId: z.string().optional(),
    })).min(1)
  });

type SignupInput = z.infer<typeof signupSchema>;
type AuthInput = z.infer<typeof authSchema>;
type TestcaseInput = z.infer<typeof testcaseSchema>;
type ProblemInput = z.infer<typeof problemSchema>;
type ContestInput = z.infer<typeof contestSchema>;
export { authSchema, signupSchema, testcaseSchema, problemSchema, contestSchema };
export type { AuthInput, SignupInput, TestcaseInput, ProblemInput, ContestInput };