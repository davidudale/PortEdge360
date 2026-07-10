"use client";

import RoleDashboardShell from "./RoleDashboardShell";

export default function SuperAdminDashboard() {
  return (
    <RoleDashboardShell
      role="Super Admin"
      focusItems={[
        "Global access control",
        "System configuration",
        "Platform audit oversight",
      ]}
      workspaceCopy="Manage platform-wide access, system settings, security oversight, and administrative controls across PortView360."
    />
  );
}
