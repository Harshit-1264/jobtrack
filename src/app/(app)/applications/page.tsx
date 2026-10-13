import ModalTest from "@/components/applications/ModalTest";
import StatusBadge from "@/components/ui/StatusBadge";
import { prisma } from "@/lib/prisma";
import { Briefcase, Pencil, Plus, Trash2 } from "lucide-react";

const companyColors = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
];

// Table and card list both call this, so a company keeps one colour on every screen size.
function companyColor(id: number) {
  return companyColors[id % companyColors.length];
}

// Same reason: one date format, used in two places.
function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

// Rendered in two places, so the styling lives in one.
function AddApplicationButton() {
  return (
    <button
      type="button"
      className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-blue-500 px-4 text-sm font-semibold text-white hover:bg-blue-600"
    >
      <Plus className="h-4 w-4" />
      <span className="hidden sm:inline">Add Application</span>
      <span className="sm:hidden">Add</span>
    </button>
  );
}

// Server Component: runs on the server, so it queries Prisma directly.
// No fetch, no useEffect — the API routes are for what the browser does later.
export default async function ApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: {
      applicationDate: "desc", // newest first
    }
  });

  return (
    <div className="space-y-6">
      {/* Step C: Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your job applications in one place.
          </p>
        </div>

        <AddApplicationButton />
        <ModalTest />
      </div>

      {applications.length === 0 ? (
        /* Step F: Empty state — replaces BOTH layouts, so it needs no breakpoint classes */
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
            <Briefcase className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-gray-900">
            No applications yet
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
            Track every role you apply for — company, status and dates in one
            place. Add your first one to get started.
          </p>
          <div className="mt-6 flex justify-center">
            <AddApplicationButton />
          </div>
        </div>
      ) : (
        <>
        {/* Step D: Desktop table — hidden below 768px, where the card list takes over */}
        <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Company</th>
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Position</th>
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Location</th>
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Applied On</th>
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="transition-colors hover:bg-gray-50">
                  {/* Company */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${companyColor(app.id)}`}>
                        {app.companyName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {app.companyName}
                      </span>
                    </div>
                  </td>

                  {/* Position */}
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {app.jobTitle}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={app.status} />
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {app.location || "—"}
                  </td>

                  {/* Application date */}
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                    {formatDate(app.applicationDate)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Edit ${app.companyName} application`}
                        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        aria-label={`Delete ${app.companyName} application`}
                        className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Step E: Mobile card list — same data, same order, different shape */}
        <div className="space-y-3 md:hidden">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              {/* Company + status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${companyColor(app.id)}`}>
                    {app.companyName.charAt(0).toUpperCase()}
                  </div>
                  {/* truncate needs min-w-0 on every flex ancestor, or it never shrinks */}
                  <span className="truncate font-semibold text-gray-900">
                    {app.companyName}
                  </span>
                </div>

                <div className="shrink-0">
                  <StatusBadge status={app.status} />
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-600">{app.jobTitle}</p>

              <p className="mt-1 text-xs text-gray-500">
                {app.location || "—"} · {formatDate(app.applicationDate)}
              </p>

              {/* Actions — 44px minimum so a thumb can hit them */}
              <div className="mt-3 flex justify-end gap-1">
                <button
                  type="button"
                  aria-label={`Edit ${app.companyName} application`}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  aria-label={`Delete ${app.companyName} application`}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
            </div>
        </>
      )}
    </div>
  );
}
