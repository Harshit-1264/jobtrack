// Imported from Prisma, never retyped by hand. If schema.prisma changes,
// TypeScript breaks this file until the labels are updated to match.
import {ApplicationStatus, JobType} from "@/generated/prisma/enums";

// The database stores FULLTIME. People read "Full Time".
// Record<JobType, string> = one key for every JobType, no extras, no misses.
export const jobTypeLabels: Record<JobType, string>= {
    FULLTIME: 'Full Time',
    PARTTIME: 'Part Time',
    INTERNSHIP: 'Internship',
    CONTRACT: 'Contract',
    FREELANCE: 'Freelance'
}

// Shared by the status dropdown and StatusBadge, so the two can never disagree.
export const statusLabels: Record<ApplicationStatus, string>= {
    APPLIED: "Applied",
    SHORTLISTED: "Shortlisted",
    INTERVIEW: "Interview",
    OFFER: "Offer",
    REJECTED: "Rejected",
    WITHDRAWN: "Withdrawn",
}