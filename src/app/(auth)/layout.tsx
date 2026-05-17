import React, { Suspense } from "react";

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  </div>
);

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </section>
  );
};
export default AuthLayout;
