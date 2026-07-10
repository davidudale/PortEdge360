import { notFound } from "next/navigation";
import {
  getRoleByDashboardSlug,
  roleSlugs,
} from "../../Auth/roles";
import RoleDashboardClient from "./RoleDashboardClient";

export function generateStaticParams() {
  return roleSlugs.map((role) => ({ role }));
}

export default async function RoleDashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role: slug } = await params;
  const role = getRoleByDashboardSlug(slug);

  if (!role) {
    notFound();
  }

  return <RoleDashboardClient role={role} />;
}
