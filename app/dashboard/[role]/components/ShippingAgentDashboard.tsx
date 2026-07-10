"use client";

import RoleDashboardShell from "./RoleDashboardShell";

export default function ShippingAgentDashboard() {
  return (
    <RoleDashboardShell
      role="Shipping Agent"
      focusItems={[
        "Vessel submissions",
        "Clearance status",
        "Agency documents",
      ]}
      workspaceCopy="Submit vessel information, track clearance status, manage agency documents, and monitor service requests."
    />
  );
}
