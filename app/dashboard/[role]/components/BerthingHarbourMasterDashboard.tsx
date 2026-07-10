"use client";

import RoleDashboardShell from "./RoleDashboardShell";

export default function BerthingHarbourMasterDashboard() {
  return (
    <RoleDashboardShell
      role="Berthing Officer / Harbour Master"
      focusItems={[
        "Berth planning",
        "Harbour control",
        "Pilotage coordination",
      ]}
      workspaceCopy="Manage berth allocation, harbour movement coordination, pilotage activity, and port traffic decisions."
    />
  );
}
