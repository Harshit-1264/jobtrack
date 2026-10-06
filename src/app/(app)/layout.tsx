// Layout for every signed-in page: the sidebar/header/bottom-nav frame.
// The folder is named (app) — parentheses make it a ROUTE GROUP, so it does NOT
// appear in the URL. (app)/applications/page.tsx still serves /applications.
// Phase 2's login page will live in a separate (auth) group with no sidebar.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen">
      {/* TODO step 3: <Sidebar />  — hidden md:flex, 240px */}

      <div className="flex min-h-screen flex-1 flex-col">
        {/* TODO step 4: <Header /> */}

        {/* pb-24 clears the fixed bottom nav on mobile; md:pb-8 is normal spacing */}
        <main className="flex-1 px-4 pb-24 pt-6 md:px-7 md:pb-8">{children}</main>
      </div>

      {/* TODO step 5: <BottomNav /> — flex md:hidden, fixed bottom */}
    </div>
  );
}
