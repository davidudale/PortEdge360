"use client";

import { HeartPulse, Shield, UserCog } from "lucide-react";
import RoleDashboardShell from "./RoleDashboardShell";

export default function ItAdminDashboard() {
  return (
    <RoleDashboardShell
      role="IT Admin"
      focusItems={[
        {
          label: "User access",
          icon: <UserCog aria-hidden="true" className="size-4" />,
          href: "/dashboard/it-admin/user-access",
        },
        {
          label: "System health",
          icon: <HeartPulse aria-hidden="true" className="size-4" />,
          href: "/dashboard/it-admin/system-health",
        },
        {
          label: "Security controls",
          icon: <Shield aria-hidden="true" className="size-4" />,
          href: "/dashboard/it-admin/security-controls",
        },
      ]}
      workspaceCopy="Administer user access, system health checks, technical controls, and portal support operations."
    />
  );
}
