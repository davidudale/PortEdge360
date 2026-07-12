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
  return getUserRole(role) !== null;
}

export function getUserRole(role: unknown): UserRole | null {
  if (typeof role !== "string") {
    return null;
  }

  const normalizedRole = role.trim().toLowerCase();

  return (
    roles.find((knownRole) => knownRole.toLowerCase() === normalizedRole) ??
    roles.find((knownRole) => {
      const rolePath = roleDashboardPaths[knownRole].replace("/dashboard/", "");
      return rolePath === normalizedRole;
    }) ??
    null
  );
}

export function getUserRoleFromProfile(profile: Record<string, unknown>) {
  return (
    getUserRole(profile.role) ??
    getUserRole(profile.requestedAccessLevel) ??
    getUserRole(profile.accessLevel) ??
    getUserRole(profile.userRole) ??
    getUserRole(profile.dashboardRole)
  );
}

export function getDashboardPathForRole(role: UserRole) {
  return roleDashboardPaths[role];
}

export function getRoleByDashboardSlug(slug: string) {
  return roles.find((role) => roleDashboardPaths[role].endsWith(`/${slug}`));
}
