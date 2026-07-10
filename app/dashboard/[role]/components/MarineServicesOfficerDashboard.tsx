"use client";

import RoleDashboardShell from "./RoleDashboardShell";

export default function MarineServicesOfficerDashboard() {
  return (
    <RoleDashboardShell
      role="Marine Services Officer"
      focusItems={[
        "Service requests",
        "Resource allocation",
        "Task completion",
      ]}
      workspaceCopy="Coordinate marine service requests, resource assignments, service delivery, and task completion records."
    />
  );
}
