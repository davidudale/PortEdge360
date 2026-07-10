"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import { UserRole, getDashboardPathForRole } from "./roles";

function LoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-5 text-white">
      <div className="rounded-lg border border-white/15 bg-white/10 px-5 py-4 text-sm font-medium shadow-2xl shadow-slate-950/30 backdrop-blur">
        Checking access...
      </div>
    </main>
  );
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles?: UserRole[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { dashboardPath, isLoading, role, signOutUser, user } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!user.emailVerified) {
      signOutUser();
      toast.info("Verify your email before accessing the portal.");
      router.replace("/login");
      return;
    }

    if (!role || !dashboardPath) {
      toast.error("Your account does not have an assigned dashboard role.");
      router.replace("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
      router.replace(getDashboardPathForRole(role));
      return;
    }

    if (!allowedRoles && pathname === "/dashboard") {
      router.replace(dashboardPath);
    }
  }, [
    allowedRoles,
    dashboardPath,
    isLoading,
    pathname,
    role,
    router,
    signOutUser,
    user,
  ]);

  if (
    isLoading ||
    !user ||
    !user.emailVerified ||
    !role ||
    !dashboardPath ||
    (allowedRoles && !allowedRoles.includes(role)) ||
    (!allowedRoles && pathname === "/dashboard")
  ) {
    return <LoadingScreen />;
  }

  return children;
}
