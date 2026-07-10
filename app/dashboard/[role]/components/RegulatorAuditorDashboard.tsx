"use client";

import RoleDashboardShell from "./RoleDashboardShell";

export default function RegulatorAuditorDashboard() {
  return (
    <RoleDashboardShell
      role="Regulator Auditor"
      focusItems={[
        "Audit trails",
        "Inspection records",
        "Compliance evidence",
      ]}
      workspaceCopy="Review audit trails, inspection records, compliance evidence, and regulator-facing reports."
    />
  );
}
