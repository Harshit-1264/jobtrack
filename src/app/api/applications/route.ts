import { prisma } from '@/lib/prisma';
import { applicationSchema } from '@/lib/validations';
import { errorResponse, validationErrorResponse } from '@/lib/api-response';

// GET /api/applications  — list every application, newest first
export async function GET() {
    try {
        const applications = await prisma.application.findMany({
            orderBy: { applicationDate: 'desc' },
        });

        return Response.json({ data: applications });
    } catch (error) {
        console.error('GET /api/applications error:', error);
        return errorResponse('Could not fetch applications', 500);
    }
}

// POST /api/applications  — create one
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate before touching the database. safeParse returns a result
        // instead of throwing, so bad input becomes a 400 here rather than
        // falling into catch below and being reported as a 500.
        const result = applicationSchema.safeParse(body);

        if (!result.success) {
            return validationErrorResponse(result.error);
        }

        // result.data is parsed, typed, and stripped of unknown keys — so a
        // client cannot smuggle in id or createdAt (mass assignment).
        // applicationDate is already a Date; no new Date() needed.
        const application = await prisma.application.create({
            data: result.data,
        });

        return Response.json({ data: application }, { status: 201 });
    } catch (error) {
        console.error('POST /api/applications error:', error);
        return errorResponse('Could not create application', 500);
    }
}
