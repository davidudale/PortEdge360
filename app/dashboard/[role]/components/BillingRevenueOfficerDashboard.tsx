"use client";

import RoleDashboardShell from "./RoleDashboardShell";

export default function BillingRevenueOfficerDashboard() {
  return (
    <RoleDashboardShell
      role="Billing Officer / Revenue Officer"
      focusItems={[
        "Invoice queues",
        "Revenue assurance",
        "Payment reconciliation",
      ]}
      workspaceCopy="Monitor invoice queues, revenue assurance checks, payment reconciliation, and billing exceptions."
    />
  );
}
