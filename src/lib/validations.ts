import { z } from "zod";
// Enums come from Prisma's generated types, so they can never drift from the
// database. Retyping the strings is how SHORTLISTED went missing.
import { ApplicationStatus, JobType } from "@/generated/prisma/enums";

export const applicationSchema = z.object({
    companyName: z
        .string()
        .min(1, "Company name is required"),

    jobTitle: z
        .string()
        .min(1, "Job title is required"),

    location: z
        .string()
        .min(1, "Location is required"),

    jobType: z.enum(JobType, { message: "Invalid job type" }),

    status: z.enum(ApplicationStatus, { message: "Invalid application status" }),

    // coerce turns the incoming ISO string into a real Date, so routes no
    // longer need new Date() — and a missing date fails here, not in Prisma.
    applicationDate: z.coerce.date({ message: "Application date is required" }),

    salary: z
        .number()
        .int("Salary must be a whole number")
        .positive("Salary must be greater than 0")
        .optional(),

    jobUrl: z
        .url("Please enter a valid job URL")
        .optional(),

    notes: z
        .string()
        .optional(),
});

// The TypeScript type of a validated application, derived from the schema above. (// Create a TypeScript type from the validation schema.)
export type ApplicationInput = z.infer<typeof applicationSchema>;
