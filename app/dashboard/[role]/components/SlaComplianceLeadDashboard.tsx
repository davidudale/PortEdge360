"use client";

import { BadgeCheck, FileWarning, Scale } from "lucide-react";
import RoleDashboardShell from "./RoleDashboardShell";

export default function SlaComplianceLeadDashboard() {
  return (
    <RoleDashboardShell
      role="SLA Officer / Compliance Lead"
      focusItems={[
        {
          label: "SLA monitoring",
          icon: <BadgeCheck aria-hidden="true" className="size-4" />,
          href: "/dashboard/sla-compliance-lead/sla-monitoring",
        },
        {
          label: "Compliance exceptions",
          icon: <FileWarning aria-hidden="true" className="size-4" />,
          href: "/dashboard/sla-compliance-lead/compliance-exceptions",
        },
        {
          label: "Regulatory follow-up",
          icon: <Scale aria-hidden="true" className="size-4" />,
          href: "/dashboard/sla-compliance-lead/regulatory-follow-up",
        },
      ]}
      workspaceCopy="Track SLA performance, compliance exceptions, escalation queues, and regulatory follow-up tasks."
    />
  );
}
