"use client";

import ProtectedRoute from "../../../Auth/ProtectedRoute";
import { UserRole } from "../../../Auth/roles";
import { useAuth } from "../../../Auth/AuthContext";

export default function RoleDashboardShell({
  focusItems,
  role,
  workspaceCopy,
}: {
  focusItems: string[];
  role: UserRole;
  workspaceCopy: string;
}) {
  const { profile, signOutUser } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[role]}>
      <main className="min-h-screen bg-zinc-50 text-zinc-950">
        <div className="mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-[280px_1fr]">
          <aside className="border-b border-zinc-200 bg-white px-5 py-5 shadow-sm lg:border-b-0 lg:border-r">
            <div className="flex items-start justify-between gap-4 lg:block">
              <div>
                <p className="text-sm font-medium text-zinc-500">PortView360</p>
                <h2 className="mt-1 text-xl font-semibold text-zinc-950">
                  {role}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {profile?.displayName ?? profile?.email ?? "Authorized user"}
                </p>
              </div>
              <button
                className="shrink-0 rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 lg:mt-5 lg:w-full"
                type="button"
                onClick={signOutUser}
              >
                Sign out
              </button>
            </div>

            <nav
              aria-label={`${role} focus menu`}
              className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
            >
              {focusItems.map((item) => (
                <a
                  className="whitespace-nowrap rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-zinc-950 lg:whitespace-normal"
                  href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                  key={item}
                >
                  {item}
                </a>
              ))}
            </nav>
          </aside>

          <section className="px-5 py-8 sm:px-6 lg:px-8">
            <header className="border-b border-zinc-200 pb-6">
              <p className="text-sm font-medium text-zinc-500">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold">{role} Dashboard</h1>
            </header>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {focusItems.map((item, index) => (
                <article
                  className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
                  id={item.toLowerCase().replaceAll(" ", "-")}
                  key={item}
                >
                  <p className="text-sm font-medium text-zinc-500">
                    Focus {index + 1}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-zinc-950">
                    {item}
                  </p>
                </article>
              ))}
            </div>

            <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold">Workspace</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                {workspaceCopy}
              </p>
            </section>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
