"use client";

import { BarChart3, ClipboardCheck, ScanEye } from "lucide-react";
import RoleDashboardShell from "./RoleDashboardShell";

export default function ExecutiveDirectorDashboard() {
  return (
    <RoleDashboardShell
      role="Executive Director"
      focusItems={[
        {
          label: "Overview",
          icon: <BarChart3 aria-hidden="true" className="size-4" />,
          href: "/dashboard/executive-director/overview",
        },
        {
          label: "Operations",
          icon: <BarChart3 aria-hidden="true" className="size-4" />,
          href: "/dashboard/executive-director/operations",
        },

        {
          label: "Finance",
          icon: <BarChart3 aria-hidden="true" className="size-4" />,
          href: "/dashboard/executive-director/finance",
        },
        {
          label: "Compliance",
          icon: <ClipboardCheck aria-hidden="true" className="size-4" />,
          href: "/dashboard/executive-director/compliance",
        },
        {
          label: "Reports",
          icon: <ScanEye aria-hidden="true" className="size-4" />,
          href: "/dashboard/executive-director/reports",
        },
        {
          label: "Alerts",
          icon: <ClipboardCheck aria-hidden="true" className="size-4" />,
          href: "/dashboard/executive-director/alerts",
        },
      ]}
      workspaceCopy="Review executive summaries, operational performance, strategic approvals, and port-wide management indicators."
    />
  );
}
