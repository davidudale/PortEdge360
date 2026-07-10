"use client";

import RoleDashboardShell from "./RoleDashboardShell";

export default function RecordsDmsAdminDashboard() {
  return (
    <RoleDashboardShell
      role="Records Admin / DMS Admin"
      focusItems={[
        "Document intake",
        "Records control",
        "Archive requests",
      ]}
      workspaceCopy="Manage document intake, records classification, archive requests, and DMS administration workflows."
    />
  );
}
