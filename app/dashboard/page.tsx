import ProtectedRoute from "../Auth/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="grid min-h-screen place-items-center bg-zinc-50 px-6 py-10">
        <section className="rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-zinc-500">PortView360</p>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-950">
            Opening your dashboard...
          </h1>
        </section>
      </main>
    </ProtectedRoute>
  );
}
