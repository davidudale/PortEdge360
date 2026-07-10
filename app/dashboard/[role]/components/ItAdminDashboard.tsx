"use client";

import RoleDashboardShell from "./RoleDashboardShell";

export default function ItAdminDashboard() {
  return (
    <RoleDashboardShell
      role="IT Admin"
      focusItems={["User access", "System health", "Security controls"]}
      workspaceCopy="Administer user access, system health checks, technical controls, and portal support operations."
    />
  );
}
