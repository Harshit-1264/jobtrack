import { prisma } from '@/lib/prisma';
import { applicationSchema } from '@/lib/validations';
import { errorResponse, validationErrorResponse } from '@/lib/api-response';

// URL segments are always strings, and /applications/abc reaches this file too.
// Returns the numeric id, or null if it isn't usable.
// Rejects "abc" (NaN), "1.5" (not an integer) and "-5" (not positive).
function parseApplicationId(id: string): number | null {
    const applicationId = Number(id);
    if (!Number.isInteger(applicationId) || applicationId <= 0) return null;
    return applicationId;
}

// GET /api/applications/[id]  — fetch one
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // params is a Promise in Next.js 16
) {
    try {
        const { id } = await params;

        const applicationId = parseApplicationId(id);
        if (applicationId === null) {
            return errorResponse('Invalid application ID', 400);
        }

        const application = await prisma.application.findUnique({
            where: { id: applicationId },
        });

        // findUnique returns null for a missing row — it does not throw
        if (!application) {
            return errorResponse('Application not found', 404);
        }

        return Response.json({ data: application }, { status: 200 });
    } catch (error) {
        console.error('GET /api/applications/[id] error:', error);
        return errorResponse('Internal server error', 500);
    }
}

// PUT /api/applications/[id]  — update one
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const applicationId = parseApplicationId(id);
        if (applicationId === null) {
            return errorResponse('Invalid application ID', 400);
        }

        // Check it exists first — update() throws if the row is missing
        const existingApplication = await prisma.application.findUnique({
            where: { id: applicationId },
        });

        if (!existingApplication) {
            return errorResponse('Application not found', 404);
        }

        const body = await request.json();

        // Same validation as POST — one schema, both routes
        const result = applicationSchema.safeParse(body);

        if (!result.success) {
            return validationErrorResponse(result.error);
        }

        const application = await prisma.application.update({
            where: { id: applicationId },
            data: result.data,
        });

        return Response.json({ data: application }, { status: 200 });
    } catch (error) {
        console.error('PUT /api/applications/[id] error:', error);
        return errorResponse('Internal server error', 500);
    }
}

// DELETE /api/applications/[id]  — remove one
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const applicationId = parseApplicationId(id);
        if (applicationId === null) {
            return errorResponse('Invalid application ID', 400);
        }

        const existingApplication = await prisma.application.findUnique({
            where: { id: applicationId },
        });

        if (!existingApplication) {
            return errorResponse('Application not found', 404);
        }

        await prisma.application.delete({
            where: { id: applicationId },
        });

        // 204 No Content — the record is gone, so there is deliberately no body.
        // Response.json() always writes one, so this needs a plain Response.
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('DELETE /api/applications/[id] error:', error);
        return errorResponse('Internal server error', 500);
    }
}
