"use client";

import RoleDashboardShell from "./RoleDashboardShell";

export default function SlaComplianceLeadDashboard() {
  return (
    <RoleDashboardShell
      role="SLA Officer / Compliance Lead"
      focusItems={[
        "SLA monitoring",
        "Compliance exceptions",
        "Regulatory follow-up",
      ]}
      workspaceCopy="Track SLA performance, compliance exceptions, escalation queues, and regulatory follow-up tasks."
    />
  );
}
