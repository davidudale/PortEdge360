"use client";

import {
  Bookmark,
  Calendar,
  ClipboardCheck,
  FileText,
  Fingerprint,
  Gauge,
  Globe,
  Handshake,
  Home,
  KeyRound,
  Layers,
  ListChecks,
  Receipt,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Ship,
  Timer,
  UsersRound,
} from "lucide-react";
import RoleDashboardShell from "./RoleDashboardShell";
import SuperAdminUsersTable from "./SuperAdminUsersTable";

export default function SuperAdminDashboard() {
  return (
    <RoleDashboardShell
      role="Super Admin"
      focusItems={[
        {
          label: "Project Management",
          children: [
            {
              label: "Shipment Call",
              icon: <Ship aria-hidden="true" className="size-4" />,
              children: [
                {
                  label: "Shipment_Call Dashboard",
                  icon: <Home aria-hidden="true" className="size-4" />,
                  children: [
                    {
                      label: "Active Calls",
                      icon: <Timer aria-hidden="true" className="size-4" />,
                    },
                    {
                      label: "Upcoming Calls",
                      icon: <Calendar aria-hidden="true" className="size-4" />,
                    },
                    {
                      label: "Completed Calls",
                      icon: <ClipboardCheck aria-hidden="true" className="size-4" />,
                    },
                    {
                      label: "Call Overview / Summary",
                      icon: <Gauge aria-hidden="true" className="size-4" />,
                    },
                  ],
                },
                {
                  label: "Shipment Call Setup & Details",
                  icon: <Fingerprint aria-hidden="true" className="size-4" />,
                  children: [
                    { label: "New Call Registration", icon: <UsersRound aria-hidden="true" className="size-4" /> },
                    { label: "Vessel & Voyage Details", icon: <Globe aria-hidden="true" className="size-4" /> },
                    { label: "ETA / ETB / ETD Management", icon: <Timer aria-hidden="true" className="size-4" /> },
                    { label: "Cargo Details", icon: <Layers aria-hidden="true" className="size-4" /> },
                  ],
                },
                {
                  label: "Timeline & Planning",
                  icon: <Timer aria-hidden="true" className="size-4" />,
                  children: [
                    {
                      label: "Call Timeline / Gantt View",
                      icon: <Calendar aria-hidden="true" className="size-4" />,
                    },
                    {
                      label: "Milestones Tracker",
                      icon: <Bookmark aria-hidden="true" className="size-4" />,
                      children: [
                        { label: "NOR Tendered", icon: <FileText aria-hidden="true" className="size-4" /> },
                        { label: "Berthing", icon: <Ship aria-hidden="true" className="size-4" /> },
                        { label: "Cargo Ops Start/End", icon: <Layers aria-hidden="true" className="size-4" /> },
                        { label: "Sailing", icon: <Gauge aria-hidden="true" className="size-4" /> },
                      ],
                    },
                    {
                      label: "Delay & Event Log",
                      icon: <Handshake aria-hidden="true" className="size-4" />,
                    },
                  ],
                },
                {
                  label: "Tasks & Coordination",
                  icon: <Handshake aria-hidden="true" className="size-4" />,
                  children: [
                    { label: "Task Assignment", icon: <UsersRound aria-hidden="true" className="size-4" /> },
                    {
                      label: "Checklists",
                      icon: <ListChecks aria-hidden="true" className="size-4" />,
                      children: [
                        {
                          label: "Pre-Arrival Checklist",
                          icon: <ClipboardCheck aria-hidden="true" className="size-4" />,
                        },
                        {
                          label: "Pre-Berthing Checklist",
                          icon: <ClipboardCheck aria-hidden="true" className="size-4" />,
                        },
                        {
                          label: "During Operations Checklist",
                          icon: <ClipboardCheck aria-hidden="true" className="size-4" />,
                        },
                        {
                          label: "Pre-Departure Checklist",
                          icon: <ClipboardCheck aria-hidden="true" className="size-4" />,
                        },
                      ],
                    },
                    {
                      label: "Meetings",
                      icon: <Calendar aria-hidden="true" className="size-4" />,
                      children: [
                        { label: "Pre-Call Meeting", icon: <Calendar aria-hidden="true" className="size-4" /> },
                        { label: "Pre-Sailing Meeting", icon: <Calendar aria-hidden="true" className="size-4" /> },
                      ],
                    },
                    { label: "Communication Log", icon: <Globe aria-hidden="true" className="size-4" /> },
                  ],
                },
                {
                  label: "Operations & Resources",
                  icon: <Layers aria-hidden="true" className="size-4" />,
                  children: [
                    { label: "Berth Allocation", icon: <Ship aria-hidden="true" className="size-4" /> },
                    { label: "Pilot / Tug / Mooring Booking", icon: <Handshake aria-hidden="true" className="size-4" /> },
                    { label: "Stevedore & Gang Allocation", icon: <UsersRound aria-hidden="true" className="size-4" /> },
                    {
                      label: "Cargo Operations Tracker",
                      icon: <Gauge aria-hidden="true" className="size-4" />,
                      children: [
                        { label: "Load/Discharge Plan", icon: <Layers aria-hidden="true" className="size-4" /> },
                        { label: "Tonnage & Productivity", icon: <Receipt aria-hidden="true" className="size-4" /> },
                      ],
                    },
                    { label: "Bunker / Provisions / Waste Requests", icon: <Receipt aria-hidden="true" className="size-4" /> },
                  ],
                },
                {
                  label: "Documentation & Compliance",
                  icon: <FileText aria-hidden="true" className="size-4" />,
                  children: [
                    {
                      label: "Document Repository",
                      icon: <FileText aria-hidden="true" className="size-4" />,
                      children: [
                        { label: "BL / Cargo Manifest", icon: <FileText aria-hidden="true" className="size-4" /> },
                        { label: "NOR / SOF", icon: <FileText aria-hidden="true" className="size-4" /> },
                        { label: "Port Clearance", icon: <Bookmark aria-hidden="true" className="size-4" /> },
                        { label: "Certificates", icon: <Bookmark aria-hidden="true" className="size-4" /> },
                      ],
                    },
                    {
                      label: "Compliance Tracker",
                      icon: <ShieldCheck aria-hidden="true" className="size-4" />,
                      children: [
                        { label: "Customs", icon: <ShieldAlert aria-hidden="true" className="size-4" /> },
                        { label: "Immigration", icon: <ShieldAlert aria-hidden="true" className="size-4" /> },
                        { label: "Quarantine", icon: <ShieldAlert aria-hidden="true" className="size-4" /> },
                        { label: "ISPS / HSSE Permits", icon: <ShieldCheck aria-hidden="true" className="size-4" /> },
                      ],
                    },
                    { label: "Approval Workflow", icon: <Settings aria-hidden="true" className="size-4" /> },
                  ],
                },
                {
                  label: "Finance",
                  icon: <Receipt aria-hidden="true" className="size-4" />,
                  children: [
                    { label: "Cost Estimate", icon: <Gauge aria-hidden="true" className="size-4" /> },
                    { label: "Disbursement Account (DA)", icon: <Receipt aria-hidden="true" className="size-4" /> },
                    { label: "Invoice & Payment Tracking", icon: <Receipt aria-hidden="true" className="size-4" /> },
                    { label: "Demurrage / Despatch Calculator", icon: <ClipboardCheck aria-hidden="true" className="size-4" /> },
                    { label: "Actual Cost vs Budget", icon: <Gauge aria-hidden="true" className="size-4" /> },
                  ],
                },
                {
                  label: "Reports & Analytics",
                  icon: <Gauge aria-hidden="true" className="size-4" />,
                  children: [
                    { label: "Call Closure Report", icon: <FileText aria-hidden="true" className="size-4" /> },
                    {
                      label: "KPI Dashboard",
                      icon: <Gauge aria-hidden="true" className="size-4" />,
                      children: [
                        { label: "Turnaround Time", icon: <Timer aria-hidden="true" className="size-4" /> },
                        { label: "Berth Productivity", icon: <Ship aria-hidden="true" className="size-4" /> },
                        { label: "Agent Performance", icon: <UsersRound aria-hidden="true" className="size-4" /> },
                      ],
                    },
                    { label: "Issue & Delay Analysis", icon: <FileText aria-hidden="true" className="size-4" /> },
                    { label: "Lessons Learned", icon: <Bookmark aria-hidden="true" className="size-4" /> },
                  ],
                },
              ],
            },

            {
              label: "Project Templates",
              children: [
                "Template Library",
                "Standard Operating Procedures (SOPs)",
              ],
            },

            {
              label: "Resource Management",
              children: ["Teams & Users", "Equipment & Assets"],
            },

            {
              label: "Project Reports",
              children: ["Executive Summary", "Custom Reports"],
            },
          ],
          description:
            "Manage shipment calls, project templates, resources, reports, and operational coordination workflows.",
          icon: <KeyRound aria-hidden="true" className="size-4" />,
          href: "/dashboard/project-management",
        },
        {
          label: "Operation",
          children: [
            {
              label: "Terminal Operations",
              content: " ",
              description:
                        "Review registered portal users, verification status, assigned roles, and department records.",
              icon: <UsersRound aria-hidden="true" className="size-4" />,
              href: "/dashboard/super-admin/users",
            },
            {
              label: "vessel & Voyage Management",
              content: " ",
              description:
                        "Review registered portal users, verification status, assigned roles, and department records.",
              icon: <UsersRound aria-hidden="true" className="size-4" />,
              href: "/dashboard/super-admin/users",
            },
            {
              label: "Cargo Management",
              content: " ",
              description:
                        "Review registered portal users, verification status, assigned roles, and department records.",
              icon: <UsersRound aria-hidden="true" className="size-4" />,
              href: "/dashboard/super-admin/users",
            },
            {
              label: "Resource Management",
              content: " ",
              description:
                        "Review registered portal users, verification status, assigned roles, and department records.",
              icon: <UsersRound aria-hidden="true" className="size-4" />,
              href: "/dashboard/super-admin/users",
            },
           
           
          ],
          description:
            "Manage platform roles, permissions, approvals, and security access controls.",
          icon: <ShieldCheck aria-hidden="true" className="size-4" />,
          href: "/dashboard/super-admin/global-access-control",
        },
        {
          label: "Finance",
          children: [
            {
              label: "Documentation & Compliance",
              content: <SuperAdminUsersTable />,
              description:
                        "Review registered portal users, verification status, assigned roles, and department records.",
              icon: <UsersRound aria-hidden="true" className="size-4" />,
              href: "/dashboard/super-admin/users",
            },
            {
              label: "Disbursement Account (DA)",
              content: <SuperAdminUsersTable />,
              description:
                        "Review registered portal users, verification status, assigned roles, and department records.",
              icon: <UsersRound aria-hidden="true" className="size-4" />,
              href: "/dashboard/super-admin/users",
            },
            {
              label: "Invoicing & Billing",
              content: <SuperAdminUsersTable />,
              description:
                        "Review registered portal users, verification status, assigned roles, and department records.",
              icon: <UsersRound aria-hidden="true" className="size-4" />,
              href: "/dashboard/super-admin/users",
            },
            {
              label: "Payment & Reconciliation",
              content: <SuperAdminUsersTable />,
              description:
                        "Review registered portal users, verification status, assigned roles, and department records.",
              icon: <UsersRound aria-hidden="true" className="size-4" />,
              href: "/dashboard/super-admin/users",
            },
           
          ],
          description:
            "Manage platform roles, permissions, approvals, and security access controls.",
          icon: <ShieldCheck aria-hidden="true" className="size-4" />,
          href: "/dashboard/super-admin/global-access-control",
        },
       {
          label: "Report",
          children: [
            {
              label: "KPI Dashboards",
              content: <SuperAdminUsersTable />,
              description:
                        "Review registered portal users, verification status, assigned roles, and department records.",
              icon: <UsersRound aria-hidden="true" className="size-4" />,
              href: "/dashboard/super-admin/users",
            },
            {
              label: "Call Closure Reports",
              content: <SuperAdminUsersTable />,
              description:
                        "Review registered portal users, verification status, assigned roles, and department records.",
              icon: <UsersRound aria-hidden="true" className="size-4" />,
              href: "/dashboard/super-admin/users",
            },
            {
              label: "Analytics & Insights",
              content: <SuperAdminUsersTable />,
              description:
                        "Review registered portal users, verification status, assigned roles, and department records.",
              icon: <UsersRound aria-hidden="true" className="size-4" />,
              href: "/dashboard/super-admin/users",
            },
            {
              label: "Custom Reports",
              content: <SuperAdminUsersTable />,
              description:
                        "Review registered portal users, verification status, assigned roles, and department records.",
              icon: <UsersRound aria-hidden="true" className="size-4" />,
              href: "/dashboard/super-admin/users",
            },
           
          ],
          description:
            "Manage platform roles, permissions, approvals, and security access controls.",
          icon: <ShieldCheck aria-hidden="true" className="size-4" />,
          href: "/dashboard/super-admin/global-access-control",
        },
       
        {
          label: "Support",
          children: [
            {
              label: "Helpdesk",
              content: <SuperAdminUsersTable />,
              description:
                        "Review registered portal users, verification status, assigned roles, and department records.",
              icon: <UsersRound aria-hidden="true" className="size-4" />,
              href: "/dashboard/super-admin/users",
            },
           
          ],
          description:
            "Manage platform roles, permissions, approvals, and security access controls.",
          icon: <ShieldCheck aria-hidden="true" className="size-4" />,
          href: "/dashboard/super-admin/global-access-control",
        },
        {
          label: "System Setup",
          children: [
            {
              label: "User management",
              content: <SuperAdminUsersTable />,
              description:
                        "Review registered portal users, verification status, assigned roles, and department records.",
              icon: <UsersRound aria-hidden="true" className="size-4" />,
              href: "/dashboard/super-admin/users",
            },
           
          ],
          description:
            "Manage platform roles, permissions, approvals, and security access controls.",
          icon: <ShieldCheck aria-hidden="true" className="size-4" />,
          href: "/dashboard/super-admin/global-access-control",
        },
        {
          label: "Profile",
          children: [
            {
              label: "Account Settings",
              content: <SuperAdminUsersTable />,
              description:
                        "Review registered portal users, verification status, assigned roles, and department records.",
              icon: <UsersRound aria-hidden="true" className="size-4" />,
              href: "/dashboard/super-admin/users",
            },
           
          ],
          description:
            "Manage platform roles, permissions, approvals, and security access controls.",
          icon: <ShieldCheck aria-hidden="true" className="size-4" />,
          href: "/dashboard/super-admin/global-access-control",
        },
      ]}
      workspaceCopy="Manage platform-wide access, system settings, security oversight, and administrative controls across PortView360."
    />
  );
}
