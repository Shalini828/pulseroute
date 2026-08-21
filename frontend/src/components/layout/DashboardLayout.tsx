import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="h-screen w-full overflow-hidden bg-slate-950">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main application area */}
      <div className="flex h-full min-w-0 flex-col lg:pl-72">
        {/* Fixed Navbar */}
        <div className="shrink-0">
          <Navbar />
        </div>

        {/* Only this area scrolls */}
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1600px]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}