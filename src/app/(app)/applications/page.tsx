import StatusBadge from "@/components/ui/StatusBadge";
import { prisma } from "@/lib/prisma";
import { Pencil, Plus, Trash2 } from "lucide-react";

const companyColors = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
];

// Server Component: runs on the server, so it queries Prisma directly.
// No fetch, no useEffect — the API routes are for what the browser does later.
export default async function ApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: {
      applicationDate: "desc", // newest first
    }
  });

  // Prints in the terminal, not the browser — this runs server-side.
  console.log("Applications count:", applications.length);

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

      <button
        type="button"
        className="flex items-center h-11 gap-2 rounded-lg bg-blue-500 px-4 text-sm font-semibold text-white hover:bg-blue-600"
      >
        <Plus className="h-4 w-4" />
        Add Application
      </button>
      </div>

      {/* Step D: Desktop table */}
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
            {applications.map((app) => {
              const companyColor = companyColors[app.id % companyColors.length]; // Just a simple way to assign colors based on ID

              return (
                <tr
                  key={app.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  {/* Company */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${companyColor}`}>
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
                    {app.applicationDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
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
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
