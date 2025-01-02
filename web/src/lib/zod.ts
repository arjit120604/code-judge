import { z } from 'zod';

// Enums matching Prisma schema
const DifficultyEnum = z.enum(["EASY", "MEDIUM", "HARD"]);
const SubmissionResultEnum = z.enum(["AC", "FAILED", "PENDING"]);
const TestCaseResultEnum = z.enum(["AC", "FAILED", "TLE", "MLE", "COMPILATION_ERROR", "RUNTIME_ERROR", "PENDING"]);
const UserRoleEnum = z.enum(["ADMIN", "USER"]);

const authSchema = z.object({
    email: z.string().min(3).max(50),
    password: z.string().min(6).max(100),
});

const signupSchema = z.object({
    username: z.string().min(3).max(50),
    name: z.string().min(3).max(50),
    password: z.string().min(6).max(100),
    email: z.string().email(),
});

const testcaseSchema = z.object({
    input: z.string(),
    hidden: z.boolean().default(true),
    status: TestCaseResultEnum.optional(),
    memory: z.number().optional(),
    time: z.number().optional(),
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
    difficulty: DifficultyEnum,
    hidden: z.boolean().default(false),
    slug: z.string(),
    solved: z.number().default(0),
    testcases: z.array(testcaseSchema).min(1),
    boilerplate: boilerplateSchema,
});

const submissionSchema = z.object({
    code: z.string(),
    fullCode: z.string(),
    languageId: z.number(),
    problemId: z.string(),
    status: SubmissionResultEnum.default("PENDING"),
    memory: z.number().optional(),
    time: z.number().optional(),
});

const contestSchema = z.object({
    title: z.string().min(3),
    description: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    hidden: z.boolean().default(false),
    problems: z.array(z.object({
        problemId: z.string(),
        index: z.number(),
    })).min(1)
});

type SignupInput = z.infer<typeof signupSchema>;
type AuthInput = z.infer<typeof authSchema>;
type TestcaseInput = z.infer<typeof testcaseSchema>;
type ProblemInput = z.infer<typeof problemSchema>;
type ContestInput = z.infer<typeof contestSchema>;
type SubmissionInput = z.infer<typeof submissionSchema>;

export {
    authSchema,
    signupSchema,
    testcaseSchema,
    problemSchema,
    contestSchema,
    submissionSchema,
    DifficultyEnum,
    SubmissionResultEnum,
    TestCaseResultEnum,
    UserRoleEnum,
};

export type {
    AuthInput,
    SignupInput,
    TestcaseInput,
    ProblemInput,
    ContestInput,
    SubmissionInput,
};