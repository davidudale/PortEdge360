"use client";

import { Archive, FileInput, FolderCog } from "lucide-react";
import RoleDashboardShell from "./RoleDashboardShell";

export default function RecordsDmsAdminDashboard() {
  return (
    <RoleDashboardShell
      role="Records Admin / DMS Admin"
      focusItems={[
        {
          label: "Document intake",
          icon: <FileInput aria-hidden="true" className="size-4" />,
          href: "/dashboard/records-dms-admin/document-intake",
        },
        {
          label: "Records control",
          icon: <FolderCog aria-hidden="true" className="size-4" />,
          href: "/dashboard/records-dms-admin/records-control",
        },
        {
          label: "Archive requests",
          icon: <Archive aria-hidden="true" className="size-4" />,
          href: "/dashboard/records-dms-admin/archive-requests",
        },
      ]}
      workspaceCopy="Manage document intake, records classification, archive requests, and DMS administration workflows."
    />
  );
}
