import { Briefcase } from "lucide-react";

// No "use client" here: no hooks, no handlers. It stays a Server Component,
// so none of this ships as JavaScript to the browser.
export default function Header() {
    return (
        <header className="flex h-14 items-center gap-2.5 border-b border-gray-200 bg-white px-4 md:h-16 md:px-7">
            {/* md:hidden — the mirror of the Sidebar's hidden md:flex.
                On mobile the sidebar is gone, so the branding lives here instead. */}
            <div className="flex items-center gap-2.5 md:hidden">
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-blue-500">
                    <Briefcase className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
                <span className="text-base font-bold tracking-tight">JobTrack</span>
            </div>

            {/* Pushes the avatar right whether or not the logo above is showing. */}
            <div className="flex-1" />

            <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
                    HK
                </div>
                {/* Initials alone on very narrow screens. Becomes the session user in Phase 2. */}
                <span className="hidden text-sm font-medium text-gray-700 sm:block">
                    Harshit Mishra
                </span>
            </div>
        </header>
    );
}
