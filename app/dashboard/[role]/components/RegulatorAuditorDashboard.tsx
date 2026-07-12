"use client";

import { FileSearch, FolderCheck, ShieldCheck } from "lucide-react";
import RoleDashboardShell from "./RoleDashboardShell";

export default function RegulatorAuditorDashboard() {
  return (
    <RoleDashboardShell
      role="Regulator Auditor"
      focusItems={[
        {
          label: "Audit trails",
          icon: <FileSearch aria-hidden="true" className="size-4" />,
          href: "/dashboard/regulator-auditor/audit-trails",
        },
        {
          label: "Inspection records",
          icon: <FolderCheck aria-hidden="true" className="size-4" />,
          href: "/dashboard/regulator-auditor/inspection-records",
        },
        {
          label: "Compliance evidence",
          icon: <ShieldCheck aria-hidden="true" className="size-4" />,
          href: "/dashboard/regulator-auditor/compliance-evidence",
        },
      ]}
      workspaceCopy="Review audit trails, inspection records, compliance evidence, and regulator-facing reports."
    />
  );
}
