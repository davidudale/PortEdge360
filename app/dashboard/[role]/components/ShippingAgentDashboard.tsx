"use client";

import { FileStack, Send, Ship } from "lucide-react";
import RoleDashboardShell from "./RoleDashboardShell";

export default function ShippingAgentDashboard() {
  return (
    <RoleDashboardShell
      role="Shipping Agent"
      focusItems={[
        {
          label: "Vessel submissions",
          icon: <Send aria-hidden="true" className="size-4" />,
          href: "/dashboard/shipping-agent/vessel-submissions",
        },
        {
          label: "Clearance status",
          icon: <Ship aria-hidden="true" className="size-4" />,
          href: "/dashboard/shipping-agent/clearance-status",
        },
        {
          label: "Agency documents",
          icon: <FileStack aria-hidden="true" className="size-4" />,
          href: "/dashboard/shipping-agent/agency-documents",
        },
      ]}
      workspaceCopy="Submit vessel information, track clearance status, manage agency documents, and monitor service requests."
    />
  );
}
