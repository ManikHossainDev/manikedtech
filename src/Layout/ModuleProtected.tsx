"use client";
import { useEffect, useState } from "react";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const ModuleProtected = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/");
    } else {
      setIsChecking(false);
    }
  }, [user, router]);

  // Show loading while checking authentication
  if (isChecking) {
    if (!user) {
      return null; // Will redirect via useEffect
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ModuleProtected;
