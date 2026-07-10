export const roles = [
  "Super Admin",
  "Executive Director",
  "SLA Officer / Compliance Lead",
  "Marine Operations Officer",
  "Berthing Officer / Harbour Master",
  "Billing Officer / Revenue Officer",
  "Marine Services Officer",
  "Asset IoT Officer",
  "Records Admin / DMS Admin",
  "IT Admin",
  "Shipping Agent",
  "Terminal Operator",
  "Regulator Auditor",
] as const;

export type UserRole = (typeof roles)[number];

export const roleDashboardPaths: Record<UserRole, string> = {
  "Super Admin": "/dashboard/super-admin",
  "Executive Director": "/dashboard/executive-director",
  "SLA Officer / Compliance Lead": "/dashboard/sla-compliance-lead",
  "Marine Operations Officer": "/dashboard/marine-operations-officer",
  "Berthing Officer / Harbour Master": "/dashboard/berthing-harbour-master",
  "Billing Officer / Revenue Officer": "/dashboard/billing-revenue-officer",
  "Marine Services Officer": "/dashboard/marine-services-officer",
  "Asset IoT Officer": "/dashboard/asset-iot-officer",
  "Records Admin / DMS Admin": "/dashboard/records-dms-admin",
  "IT Admin": "/dashboard/it-admin",
  "Shipping Agent": "/dashboard/shipping-agent",
  "Terminal Operator": "/dashboard/terminal-operator",
  "Regulator Auditor": "/dashboard/regulator-auditor",
};

export const roleSlugs = Object.values(roleDashboardPaths).map((path) =>
  path.replace("/dashboard/", ""),
);

export function isUserRole(role: unknown): role is UserRole {
  return typeof role === "string" && roles.includes(role as UserRole);
}

export function getDashboardPathForRole(role: UserRole) {
  return roleDashboardPaths[role];
}

export function getRoleByDashboardSlug(slug: string) {
  return roles.find((role) => roleDashboardPaths[role].endsWith(`/${slug}`));
}
