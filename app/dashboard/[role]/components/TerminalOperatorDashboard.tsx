"use client";

import { Boxes, Handshake, Radio } from "lucide-react";
import RoleDashboardShell from "./RoleDashboardShell";

export default function TerminalOperatorDashboard() {
  return (
    <RoleDashboardShell
      role="Terminal Operator"
      focusItems={[
        {
          label: "Terminal activity",
          icon: <Radio aria-hidden="true" className="size-4" />,
          href: "/dashboard/terminal-operator/terminal-activity",
        },
        {
          label: "Cargo handoff",
          icon: <Boxes aria-hidden="true" className="size-4" />,
          href: "/dashboard/terminal-operator/cargo-handoff",
        },
        {
          label: "Operational updates",
          icon: <Handshake aria-hidden="true" className="size-4" />,
          href: "/dashboard/terminal-operator/operational-updates",
        },
      ]}
      workspaceCopy="Track terminal activity, cargo handoff events, berth-side updates, and operational coordination tasks."
    />
  );
}
