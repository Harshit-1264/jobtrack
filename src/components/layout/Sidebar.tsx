"use client";

import { Briefcase } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { navItems } from "@/lib/nav";

export default function Sidebar() {
    const pathname = usePathname();   // usePathname() is a React/Next.js hook that needs to run in the browser.

    return (
        // hidden md:flex — the sidebar disappears below 768px, where BottomNav takes over.
        // w-60 is exactly 240px.
        <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-6 md:flex">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2 pb-7">
                <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-blue-500">
                    <Briefcase className="h-[18px] w-[18px] text-white" strokeWidth={2} />
                </div>
                <span className="text-[17px] font-bold tracking-tight">JobTrack</span>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                    // Capitalised: React treats a lowercase name as an HTML tag and
                    // renders nothing. `Icon` works, `icon` silently does not.
                    const Icon = item.icon;

                    // startsWith, not ===, so /applications/23 keeps Applications active.
                    const isActive = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href} //Identifies the item for React
                            href={item.href} // Defines the destination URL
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                                isActive
                                    ? "bg-blue-50 font-semibold text-blue-700"
                                    : item.phase2
                                      ? "text-gray-400"
                                      : "text-gray-600"
                            }`}
                        >
                            <Icon className="h-[17px] w-[17px]" />
                            <span className="flex-1">{item.label}</span>

                            {/* Honest about scope: these three are not built yet. */}
                            {item.phase2 && (
                                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500">
                                    P2
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="flex-1" />

            <div className="rounded-lg border border-dashed border-gray-300 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-gray-700">Phase 1 scope</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">
                    Applications CRUD only. No auth, filters or pagination yet.
                </p>
            </div>
        </aside>
    );
}
