import { z } from "zod";

// Every error in the API goes out in one shape: { error: { message, fields? } }
// Defined once here so both route files stay consistent.
export function errorResponse(message: string, status: number) {
    return Response.json({ error: { message } }, { status });
}

// 400 for a body that failed validation.
// z.flattenError gives { fieldErrors: { field: [msg, ...] } } — one array per
// field, since a field can break several rules. We keep the first message,
// which is what the form shows under the input.
export function validationErrorResponse(error: z.ZodError) {
    // Cast because a bare ZodError isn't tied to one schema, so TS widens this to {}.
    const fieldErrors = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;

    const fields = Object.fromEntries(
        Object.entries(fieldErrors).map(([field, messages]) => [
            field,
            messages?.[0] ?? "Invalid value",
        ])
    );

    return Response.json(
        { error: { message: "Validation failed", fields } },
        { status: 400 }
    );
}
