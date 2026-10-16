import { ApplicationStatus } from "@/generated/prisma/enums"
// Labels live in one shared file so the badge and the form always agree.
import { statusLabels } from "@/lib/labels"

type StatusBadgeProps = {
    status: ApplicationStatus;
}

// Every status has its own complete Tailwind class string.
// Don't construct these class names dynamically.
const statusStyles: Record<ApplicationStatus, string> = {
    APPLIED: "bg-blue-50 text-blue-700",
    SHORTLISTED:"bg-emerald-50 text-emerald-700",
    INTERVIEW: "bg-amber-50 text-amber-700",
    OFFER: "bg-indigo-50 text-indigo-700",
    REJECTED: "bg-red-50 text-red-700",
    WITHDRAWN: "bg-gray-100 text-gray-700"
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
        >
            {statusLabels[status]}
        </span>
    )
}