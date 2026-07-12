"use client";

import {
  ClipboardCheck,
  Settings,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import RoleDashboardShell from "./RoleDashboardShell";
import SuperAdminUsersTable from "./SuperAdminUsersTable";

export default function SuperAdminDashboard() {
  return (
    <RoleDashboardShell
      role="Super Admin"
      focusItems={[
        {
          label: "Global access control",
          icon: <ShieldCheck aria-hidden="true" className="size-4" />,
          href: "/dashboard/super-admin/global-access-control",
        },
        {
          label: "System configuration",
          icon: <Settings aria-hidden="true" className="size-4" />,
          href: "/dashboard/super-admin/system-configuration",
        },
        {
          label: "Platform audit oversight",
          icon: <ClipboardCheck aria-hidden="true" className="size-4" />,
          href: "/dashboard/super-admin/platform-audit-oversight",
        },
        {
          label: "User management",
          content: <SuperAdminUsersTable />,
          description:
            "Review registered portal users, verification status, assigned roles, and department records.",
          icon: <UsersRound aria-hidden="true" className="size-4" />,
          href: "/dashboard/super-admin/users",
        },
      ]}
      workspaceCopy="Manage platform-wide access, system settings, security oversight, and administrative controls across PortView360."
    />
  );
}
