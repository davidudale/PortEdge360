"use client";

import { Banknote, FileText, ReceiptText } from "lucide-react";
import RoleDashboardShell from "./RoleDashboardShell";

export default function BillingRevenueOfficerDashboard() {
  return (
    <RoleDashboardShell
      role="Billing Officer / Revenue Officer"
      focusItems={[
        {
          label: "Invoice queues",
          icon: <ReceiptText aria-hidden="true" className="size-4" />,
          href: "/dashboard/billing-revenue-officer/invoice-queues",
        },
        {
          label: "Revenue assurance",
          icon: <Banknote aria-hidden="true" className="size-4" />,
          href: "/dashboard/billing-revenue-officer/revenue-assurance",
        },
        {
          label: "Payment reconciliation",
          icon: <FileText aria-hidden="true" className="size-4" />,
          href: "/dashboard/billing-revenue-officer/payment-reconciliation",
        },
      ]}
      workspaceCopy="Monitor invoice queues, revenue assurance checks, payment reconciliation, and billing exceptions."
    />
  );
}
