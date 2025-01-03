import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

function getPoints(
    problemId: string,
    contestId: string,
    userId: string,
    startTime: Date,
    endTime: Date,
): number {
    return 100;
}
const statusMap = (status: string) => {
    switch (status) {
      case "Accepted":
        return "AC";
      case "Wrong Answer":
        return "FAILED";
      case "Time Limit Exceeded":
        return "TLE";
      case "Memory Limit Exceeded":
        return "MLE";
      case "Runtime Error":
        return "RUNTIME_ERROR";
      case "Compilation Error":
        return "COMPILATION_ERROR";
      default:
        return "FAILED";
    }
}

async function updateTestCase(req: Request) {
    const timeTaken = parseFloat(req.body.time);
    return prisma.testCase.update({
        where: { judge0TrackingId: req.body.token },
        data: {
            status: statusMap(req.body.status.description),
            time: timeTaken,
            memory: req.body.memory,
        },
    });
}

async function findAllTestCases(submissionId: string) {
    return prisma.testCase.findMany({ where: { submissionId } });
}

async function updateSubmission(testcase: any, allTestCases: any[]) {
    const accepted = allTestCases.every(testcase => testcase.status !== 'FAILED');
    return prisma.submission.update({
        where: { id: testcase.submissionId },
        data: {
            status: accepted ? 'AC' : 'FAILED',
            time: allTestCases.reduce((acc, curr) => acc + (curr.time ?? 0), 0),
            memory: allTestCases.reduce((acc, curr) => acc + (curr.memory ?? 0), 0),
        },
        include: { problem: true, activeContest: true },
    });
}

async function upsertContestSubmission(response: any, points: number) {
    return prisma.contestSubmission.upsert({
        where: {
            userId_contestId_problemId: {
                userId: response.userId,
                contestId: response.activeContestId,
                problemId: response.problemId,
            },
        },
        create: {
            userId: response.userId,
            contestId: response.activeContestId,
            problemId: response.problemId,
            submissionId: response.id,
            points: points || 0,
        },
        update: { points: points || 0 },
    });
}

app.put('/submission-webhook', async (req: Request, res: Response) => {
    console.log(req.body)
    const testcase = await updateTestCase(req);
    console.log(testcase)
    if (!testcase) {
        return res.status(404).json({ error: 'Test case not found' });
    }

    const allTestCases = await findAllTestCases(testcase.submissionId);
    const pendingTestCases = allTestCases.filter(testcase => testcase.status === 'PENDING');
    console.log(pendingTestCases)
    if (pendingTestCases.length === 0) {
        const response = await updateSubmission(testcase, allTestCases);

        if (response.activeContest && response.activeContestId) {
            const points = getPoints(
                response.problemId,
                response.activeContestId,
                response.userId,
                response.activeContest.startTime,
                response.activeContest.endTime,
            );

            await upsertContestSubmission(response, points);
        }

        return res.status(200).json({ message: 'Submission processed successfully' }) as any;
    }

    return res.status(200).json({ message: 'Submission still pending' });
    return;
});

app.listen(5001, () => {
    console.log('Webhook Server is running on port 5001')
});