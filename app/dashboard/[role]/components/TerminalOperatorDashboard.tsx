"use client";

import RoleDashboardShell from "./RoleDashboardShell";

export default function TerminalOperatorDashboard() {
  return (
    <RoleDashboardShell
      role="Terminal Operator"
      focusItems={[
        "Terminal activity",
        "Cargo handoff",
        "Operational updates",
      ]}
      workspaceCopy="Track terminal activity, cargo handoff events, berth-side updates, and operational coordination tasks."
    />
  );
}
