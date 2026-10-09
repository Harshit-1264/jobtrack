// Layout for every signed-in page: the sidebar/header/bottom-nav frame.
// The folder is named (app) — parentheses make it a ROUTE GROUP, so it does NOT
// appear in the URL. (app)/applications/page.tsx still serves /applications.

import Sidebar from "@/components/layout/Sidebar"
import Header from "@/components/layout/Header"
import BottomNav from "@/components/layout/BottomNav"

// Phase 2's login page will live in a separate (auth) group with no sidebar.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header />

        {/* pb-24 clears the fixed bottom nav on mobile; md:pb-8 is normal spacing */}
        {/* w-full + max-w-7xl: fluid up to 1280px, then centred so text lines
            do not stretch across an ultrawide monitor. */}
        <main className="w-full flex-1 px-4 pb-24 pt-6 md:px-7 md:pb-8 xl:mx-auto xl:max-w-7xl">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
