"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { navItems } from "@/lib/nav";

export default function BottomNav() {
    const pathname = usePathname();

    return (
        // flex md:hidden — the exact mirror of the Sidebar's hidden md:flex.
        // fixed, so it floats over content; <main> carries pb-24 to clear it.
        // pb-[env(safe-area-inset-bottom)] keeps it above the iPhone home indicator.
        <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[68px] items-stretch border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        // flex-1 divides the width evenly; min-h-[44px] is the touch target floor.
                        className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 ${
                            isActive ? "font-semibold text-blue-700" : "text-gray-400"
                        }`}
                    >
                        <Icon className="h-5 w-5" />
                        {/* Short labels on the narrowest phones, full ones from 360px up. */}
                        <span className="text-[11px] leading-none">
                            <span className="xs:hidden">{item.shortLabel}</span>
                            <span className="hidden xs:inline">{item.label}</span>
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
