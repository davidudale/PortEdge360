"use client";

import { CheckCircle2, ClipboardList, Route } from "lucide-react";
import RoleDashboardShell from "./RoleDashboardShell";

export default function MarineServicesOfficerDashboard() {
  return (
    <RoleDashboardShell
      role="Marine Services Officer"
      focusItems={[
        {
          label: "Service requests",
          icon: <ClipboardList aria-hidden="true" className="size-4" />,
          href: "/dashboard/marine-services-officer/service-requests",
        },
        {
          label: "Resource allocation",
          icon: <Route aria-hidden="true" className="size-4" />,
          href: "/dashboard/marine-services-officer/resource-allocation",
        },
        {
          label: "Task completion",
          icon: <CheckCircle2 aria-hidden="true" className="size-4" />,
          href: "/dashboard/marine-services-officer/task-completion",
        },
      ]}
      workspaceCopy="Coordinate marine service requests, resource assignments, service delivery, and task completion records."
    />
  );
}
