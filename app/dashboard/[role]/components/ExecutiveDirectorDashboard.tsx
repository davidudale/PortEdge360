"use client";

import RoleDashboardShell from "./RoleDashboardShell";

export default function ExecutiveDirectorDashboard() {
  return (
    <RoleDashboardShell
      role="Executive Director"
      focusItems={[
        "Executive performance",
        "Strategic approvals",
        "Port-wide oversight",
      ]}
      workspaceCopy="Review executive summaries, operational performance, strategic approvals, and port-wide management indicators."
    />
  );
}
