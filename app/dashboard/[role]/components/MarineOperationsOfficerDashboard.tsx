"use client";

import RoleDashboardShell from "./RoleDashboardShell";

export default function MarineOperationsOfficerDashboard() {
  return (
    <RoleDashboardShell
      role="Marine Operations Officer"
      focusItems={[
        "Vessel movement",
        "Marine workflow",
        "Operational readiness",
      ]}
      workspaceCopy="Coordinate vessel movement, marine workflow activities, operating conditions, and readiness updates."
    />
  );
}
