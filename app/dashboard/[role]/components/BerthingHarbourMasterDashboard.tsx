"use client";

import { Compass, MapPinned, ShipWheel } from "lucide-react";
import RoleDashboardShell from "./RoleDashboardShell";

export default function BerthingHarbourMasterDashboard() {
  return (
    <RoleDashboardShell
      role="Berthing Officer / Harbour Master"
      focusItems={[
        {
          label: "Berth planning",
          icon: <MapPinned aria-hidden="true" className="size-4" />,
          href: "/dashboard/berthing-harbour-master/berth-planning",
        },
        {
          label: "Harbour control",
          icon: <ShipWheel aria-hidden="true" className="size-4" />,
          href: "/dashboard/berthing-harbour-master/harbour-control",
        },
        {
          label: "Pilotage coordination",
          icon: <Compass aria-hidden="true" className="size-4" />,
          href: "/dashboard/berthing-harbour-master/pilotage-coordination",
        },
      ]}
      workspaceCopy="Manage berth allocation, harbour movement coordination, pilotage activity, and port traffic decisions."
    />
  );
}
