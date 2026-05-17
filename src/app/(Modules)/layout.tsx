"use client";

import { Suspense } from "react";
import ModuleProtected from "@/Layout/ModuleProtected";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  </div>
);

const ModulesLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <ModuleProtected>
      <main className="min-h-screen  overflow-y-auto">
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </main>
    </ModuleProtected>
  );
};

export default ModulesLayout;
