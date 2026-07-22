"use client";

import {
  Activity,
  Bookmark,
  Building2,
  Calendar,
  ChartBar,
  ClipboardCheck,
  Container,
  CreditCard,
  FileCheck,
  FileText,
  Fingerprint,
  FolderKanban,
  Gauge,
  Globe,
  Handshake,
  Headphones,
  HelpCircle,
  Home,
  KeyRound,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  PieChart,
  Receipt,
  Rocket,
  Route,
  ScrollText,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Ship,
  Timer,
  UserCircle,
  UsersRound,
  Warehouse,
  Wrench,
} from "lucide-react";
import RoleDashboardShell from "./RoleDashboardShell";
import SuperAdminUsersTable from "./SuperAdminUsersTable";
import NewCallRegistrationForm from "./NewCallRegistrationForm";
import CargoDetailsForm from "./CargoDetailsForm";
import VesselVoyageDetailsForm from "./VesselVoyageDetailsForm";

export default function SuperAdminDashboard() {
  return (
    <RoleDashboardShell
      role="Super Admin"
      focusItems={[
        {
          label: "Project Management",
          icon: <KeyRound aria-hidden="true" className="size-4" />,
          description: "Manage shipment calls, project templates, resources, reports, and operational coordination workflows.",
          href: "/dashboard/project-management",
          children: [
            {
              label: "Shipment Call",
              icon: <Ship aria-hidden="true" className="size-4" />,
              children: [
                {
                  label: "Shipment Call Setup & Details",
                  icon: <Fingerprint aria-hidden="true" className="size-4" />,
                  children: [
                    { label: "New Call Registration", icon: <Rocket aria-hidden="true" className="size-4" />, content: <NewCallRegistrationForm /> },
                    { label: "Vessel & Voyage Details", icon: <Route aria-hidden="true" className="size-4" />, content: <VesselVoyageDetailsForm /> },
                    { label: "ETA / ETB / ETD Management", icon: <Timer aria-hidden="true" className="size-4" /> },
                    { label: "Cargo Details", icon: <Layers aria-hidden="true" className="size-4" />, content: <CargoDetailsForm /> },
                  ],
                },
                {
                  label: "Timeline & Planning",
                  icon: <Calendar aria-hidden="true" className="size-4" />,
                  children: [
                    { label: "Call Timeline / Gantt View", icon: <ChartBar aria-hidden="true" className="size-4" /> },
                    {
                      label: "Milestones Tracker",
                      icon: <Bookmark aria-hidden="true" className="size-4" />,
                      children: [
                        { label: "NOR Tendered", icon: <FileText aria-hidden="true" className="size-4" /> },
                        { label: "Berthing", icon: <Ship aria-hidden="true" className="size-4" /> },
                        { label: "Cargo Ops Start/End", icon: <Layers aria-hidden="true" className="size-4" /> },
                        { label: "Sailing", icon: <Rocket aria-hidden="true" className="size-4" /> },
                      ],
                    },
                    { label: "Delay & Event Log", icon: <Activity aria-hidden="true" className="size-4" /> },
                  ],
                },
                {
                  label: "Tasks & Coordination",
                  icon: <ListChecks aria-hidden="true" className="size-4" />,
                  children: [
                    { label: "Task Assignment", icon: <UsersRound aria-hidden="true" className="size-4" /> },
                    {
                      label: "Checklists",
                      icon: <ClipboardCheck aria-hidden="true" className="size-4" />,
                      children: [
                        { label: "Pre-Arrival Checklist", icon: <ClipboardCheck aria-hidden="true" className="size-4" /> },
                        { label: "Pre-Berthing Checklist", icon: <ClipboardCheck aria-hidden="true" className="size-4" /> },
                        { label: "During Operations Checklist", icon: <ClipboardCheck aria-hidden="true" className="size-4" /> },
                        { label: "Pre-Departure Checklist", icon: <ClipboardCheck aria-hidden="true" className="size-4" /> },
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
                  icon: <Wrench aria-hidden="true" className="size-4" />,
                  children: [
                    { label: "Berth Allocation", icon: <Warehouse aria-hidden="true" className="size-4" /> },
                    { label: "Pilot / Tug / Mooring Booking", icon: <Ship aria-hidden="true" className="size-4" /> },
                    { label: "Stevedore & Gang Allocation", icon: <UsersRound aria-hidden="true" className="size-4" /> },
                    {
                      label: "Cargo Operations Tracker",
                      icon: <Container aria-hidden="true" className="size-4" />,
                      children: [
                        { label: "Load/Discharge Plan", icon: <Layers aria-hidden="true" className="size-4" /> },
                        { label: "Tonnage & Productivity", icon: <Gauge aria-hidden="true" className="size-4" /> },
                      ],
                    },
                    { label: "Bunker / Provisions / Waste Requests", icon: <Receipt aria-hidden="true" className="size-4" /> },
                  ],
                },
                {
                  label: "Documentation & Compliance",
                  icon: <ScrollText aria-hidden="true" className="size-4" />,
                  children: [
                    {
                      label: "Document Repository",
                      icon: <FileText aria-hidden="true" className="size-4" />,
                      children: [
                        { label: "BL / Cargo Manifest", icon: <FileText aria-hidden="true" className="size-4" /> },
                        { label: "NOR / SOF", icon: <FileCheck aria-hidden="true" className="size-4" /> },
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
                  icon: <CreditCard aria-hidden="true" className="size-4" />,
                  children: [
                    { label: "Cost Estimate", icon: <PieChart aria-hidden="true" className="size-4" /> },
                    { label: "Disbursement Account (DA)", icon: <Receipt aria-hidden="true" className="size-4" /> },
                    { label: "Invoice & Payment Tracking", icon: <Receipt aria-hidden="true" className="size-4" /> },
                    { label: "Demurrage / Despatch Calculator", icon: <ClipboardCheck aria-hidden="true" className="size-4" /> },
                    { label: "Actual Cost vs Budget", icon: <Gauge aria-hidden="true" className="size-4" /> },
                  ],
                },
                {
                  label: "Reports & Analytics",
                  icon: <ChartBar aria-hidden="true" className="size-4" />,
                  children: [
                    { label: "Call Closure Report", icon: <FileText aria-hidden="true" className="size-4" /> },
                    {
                      label: "KPI Dashboard",
                      icon: <LayoutDashboard aria-hidden="true" className="size-4" />,
                      children: [
                        { label: "Turnaround Time", icon: <Timer aria-hidden="true" className="size-4" /> },
                        { label: "Berth Productivity", icon: <Ship aria-hidden="true" className="size-4" /> },
                        { label: "Agent Performance", icon: <UsersRound aria-hidden="true" className="size-4" /> },
                      ],
                    },
                    { label: "Issue & Delay Analysis", icon: <Activity aria-hidden="true" className="size-4" /> },
                    { label: "Lessons Learned", icon: <Bookmark aria-hidden="true" className="size-4" /> },
                  ],
                },
              ],
            },
            { label: "Project Templates", icon: <FolderKanban aria-hidden="true" className="size-4" />, children: ["Template Library", "Standard Operating Procedures (SOPs)"] },
            { label: "Resource Management", icon: <UsersRound aria-hidden="true" className="size-4" />, children: ["Teams & Users", "Equipment & Assets"] },
            { label: "Project Reports", icon: <FileText aria-hidden="true" className="size-4" />, children: ["Executive Summary", "Custom Reports"] },
          ],
        },
        {
          label: "Operation",
          icon: <Building2 aria-hidden="true" className="size-4" />,
          children: [
            { label: "Terminal Operations", icon: <Warehouse aria-hidden="true" className="size-4" />, content: " ", href: "#" },
            { label: "Vessel & Voyage Management", icon: <Route aria-hidden="true" className="size-4" />, content: " ", href: "#" },
            { label: "Cargo Management", icon: <Container aria-hidden="true" className="size-4" />, content: " ", href: "#" },
            { label: "Resource Management", icon: <Wrench aria-hidden="true" className="size-4" />, content: " ", href: "#" },
          ],
          description: "Manage operational workflows, cargo, vessels, and resources.",
          href: "#",
        },
        {
          label: "Finance",
          icon: <CreditCard aria-hidden="true" className="size-4" />,
          children: [
            { label: "Documentation & Compliance", icon: <ScrollText aria-hidden="true" className="size-4" />, content: <SuperAdminUsersTable />, href: "#" },
            { label: "Disbursement Account (DA)", icon: <Receipt aria-hidden="true" className="size-4" />, content: <SuperAdminUsersTable />, href: "#" },
            { label: "Invoicing & Billing", icon: <Receipt aria-hidden="true" className="size-4" />, content: <SuperAdminUsersTable />, href: "#" },
            { label: "Payment & Reconciliation", icon: <CreditCard aria-hidden="true" className="size-4" />, content: <SuperAdminUsersTable />, href: "#" },
          ],
          description: "Manage financial operations, invoicing, payments, and reconciliation.",
          href: "#",
        },
        {
          label: "Report",
          icon: <ChartBar aria-hidden="true" className="size-4" />,
          children: [
            { label: "KPI Dashboards", icon: <LayoutDashboard aria-hidden="true" className="size-4" />, content: <SuperAdminUsersTable />, href: "#" },
            { label: "Call Closure Reports", icon: <FileText aria-hidden="true" className="size-4" />, content: <SuperAdminUsersTable />, href: "#" },
            { label: "Analytics & Insights", icon: <PieChart aria-hidden="true" className="size-4" />, content: <SuperAdminUsersTable />, href: "#" },
            { label: "Custom Reports", icon: <FileText aria-hidden="true" className="size-4" />, content: <SuperAdminUsersTable />, href: "#" },
          ],
          description: "Access reports, analytics, KPIs, and insights.",
          href: "#",
        },
        {
          label: "Support",
          icon: <Headphones aria-hidden="true" className="size-4" />,
          children: [
            { label: "Helpdesk", icon: <LifeBuoy aria-hidden="true" className="size-4" />, content: <SuperAdminUsersTable />, href: "#" },
          ],
          description: "Get help, raise tickets, and access support resources.",
          href: "#",
        },
        {
          label: "System Setup",
          icon: <Settings aria-hidden="true" className="size-4" />,
          children: [
            { label: "User Management", icon: <UsersRound aria-hidden="true" className="size-4" />, content: <SuperAdminUsersTable />, href: "#" },
          ],
          description: "Configure system settings, roles, and permissions.",
          href: "#",
        },
        {
          label: "Profile",
          icon: <UserCircle aria-hidden="true" className="size-4" />,
          children: [
            { label: "Account Settings", icon: <Settings aria-hidden="true" className="size-4" />, content: <SuperAdminUsersTable />, href: "#" },
          ],
          description: "Manage your profile, preferences, and account settings.",
          href: "#",
        },
      ]}
      workspaceCopy="Manage platform-wide access, system settings, security oversight, and administrative controls across PortView360."
    />
  );
}
