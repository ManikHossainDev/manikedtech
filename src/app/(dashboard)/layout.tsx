"use client";
import Headerdashboard from "@/components/dashboard/Headerdashboard";
import Sidebar from "@/components/Sidebar/Sidebar";
import ModuleProtected from "@/Layout/ModuleProtected";
import { useState, Suspense } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  </div>
);

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const showDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <ModuleProtected>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar - Desktop only, Mobile drawer */}
        <Sidebar drawerOpen={drawerOpen} onDrawerClose={closeDrawer} />

        {/* Main Content Area */}
        <div className=" flex-1 flex flex-col w-full">
          {/* Header with mobile menu button */}
          <Headerdashboard onMenuClick={showDrawer} />

          {/* Page Content */}
          <main className="flex-1 px-2 md:pl-4 overflow-y-auto">
            <div className="">
              <Suspense fallback={<LoadingFallback />}>
                {children}
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </ModuleProtected>
  );
};

export default DashboardLayout;
