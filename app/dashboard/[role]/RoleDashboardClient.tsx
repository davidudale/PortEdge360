"use client";

import type { ReactNode } from "react";
import { UserRole } from "../../Auth/roles";
import AssetIotOfficerDashboard from "./components/AssetIotOfficerDashboard";
import BerthingHarbourMasterDashboard from "./components/BerthingHarbourMasterDashboard";
import BillingRevenueOfficerDashboard from "./components/BillingRevenueOfficerDashboard";
import ExecutiveDirectorDashboard from "./components/ExecutiveDirectorDashboard";
import ItAdminDashboard from "./components/ItAdminDashboard";
import MarineOperationsOfficerDashboard from "./components/MarineOperationsOfficerDashboard";
import MarineServicesOfficerDashboard from "./components/MarineServicesOfficerDashboard";
import RecordsDmsAdminDashboard from "./components/RecordsDmsAdminDashboard";
import RegulatorAuditorDashboard from "./components/RegulatorAuditorDashboard";
import ShippingAgentDashboard from "./components/ShippingAgentDashboard";
import SlaComplianceLeadDashboard from "./components/SlaComplianceLeadDashboard";
import SuperAdminDashboard from "./components/SuperAdminDashboard";
import TerminalOperatorDashboard from "./components/TerminalOperatorDashboard";

const roleDashboards: Record<UserRole, () => ReactNode> = {
  "Super Admin": SuperAdminDashboard,
  "Executive Director": ExecutiveDirectorDashboard,
  "SLA Officer / Compliance Lead": SlaComplianceLeadDashboard,
  "Marine Operations Officer": MarineOperationsOfficerDashboard,
  "Berthing Officer / Harbour Master": BerthingHarbourMasterDashboard,
  "Billing Officer / Revenue Officer": BillingRevenueOfficerDashboard,
  "Marine Services Officer": MarineServicesOfficerDashboard,
  "Asset IoT Officer": AssetIotOfficerDashboard,
  "Records Admin / DMS Admin": RecordsDmsAdminDashboard,
  "IT Admin": ItAdminDashboard,
  "Shipping Agent": ShippingAgentDashboard,
  "Terminal Operator": TerminalOperatorDashboard,
  "Regulator Auditor": RegulatorAuditorDashboard,
};

export default function RoleDashboardClient({ role }: { role: UserRole }) {
  const Dashboard = roleDashboards[role];

  return <Dashboard />;
}
