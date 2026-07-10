"use client";

import RoleDashboardShell from "./RoleDashboardShell";

export default function AssetIotOfficerDashboard() {
  return (
    <RoleDashboardShell
      role="Asset IoT Officer"
      focusItems={[
        "Sensor health",
        "Asset telemetry",
        "Maintenance alerts",
      ]}
      workspaceCopy="Review connected asset status, IoT telemetry, sensor health, and maintenance alert activity."
    />
  );
}
