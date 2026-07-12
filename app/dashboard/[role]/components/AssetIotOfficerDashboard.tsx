"use client";

import { Activity, RadioTower, Wrench } from "lucide-react";
import RoleDashboardShell from "./RoleDashboardShell";

export default function AssetIotOfficerDashboard() {
  return (
    <RoleDashboardShell
      role="Asset IoT Officer"
      focusItems={[
        {
          label: "Sensor health",
          icon: <Activity aria-hidden="true" className="size-4" />,
          href: "/dashboard/asset-iot-officer/sensor-health",
        },
        {
          label: "Asset telemetry",
          icon: <RadioTower aria-hidden="true" className="size-4" />,
          href: "/dashboard/asset-iot-officer/asset-telemetry",
        },
        {
          label: "Maintenance alerts",
          icon: <Wrench aria-hidden="true" className="size-4" />,
          href: "/dashboard/asset-iot-officer/maintenance-alerts",
        },
      ]}
      workspaceCopy="Review connected asset status, IoT telemetry, sensor health, and maintenance alert activity."
    />
  );
}
