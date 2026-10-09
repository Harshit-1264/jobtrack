import { Briefcase, KanbanSquare, LayoutDashboard, User } from "lucide-react";

// One source of truth for both Sidebar (desktop) and BottomNav (mobile).
// Four items max: that is what fits on a 390px screen at a 44px touch target.
export const navItems = [
    { label: "Dashboard",    shortLabel: "Dashboard", href: "/dashboard",    icon: LayoutDashboard, phase2: true },
    { label: "Applications", shortLabel: "Apps",      href: "/applications", icon: Briefcase },
    { label: "Kanban Board", shortLabel: "Kanban",    href: "/kanban",       icon: KanbanSquare,    phase2: true },
    { label: "Profile",      shortLabel: "Profile",   href: "/profile",      icon: User,            phase2: true },
];
