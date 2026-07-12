"use client";

import { Anchor, ListChecks, Waves } from "lucide-react";
import RoleDashboardShell from "./RoleDashboardShell";

export default function MarineOperationsOfficerDashboard() {
  return (
    <RoleDashboardShell
      role="Marine Operations Officer"
      focusItems={[
        {
          label: "Vessel movement",
          icon: <Anchor aria-hidden="true" className="size-4" />,
          href: "/dashboard/marine-operations-officer/vessel-movement",
        },
        {
          label: "Marine workflow",
          icon: <Waves aria-hidden="true" className="size-4" />,
          href: "/dashboard/marine-operations-officer/marine-workflow",
        },
        {
          label: "Operational readiness",
          icon: <ListChecks aria-hidden="true" className="size-4" />,
          href: "/dashboard/marine-operations-officer/operational-readiness",
        },
      ]}
      workspaceCopy="Coordinate vessel movement, marine workflow activities, operating conditions, and readiness updates."
    />
  );
}
