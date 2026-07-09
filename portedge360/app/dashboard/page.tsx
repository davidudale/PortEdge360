export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <section className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-zinc-500">PortEdge360</p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
            Dashboard
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">Shipments</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">24</p>
          </article>

          <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">Pending</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">7</p>
          </article>

          <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">Completed</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">17</p>
          </article>
        </div>
      </section>
    </main>
  );
}
