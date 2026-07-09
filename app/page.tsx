import Link from "next/link";

const navItems = ["Operations", "Vessels", "Compliance", "Analytics"];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative isolate min-h-[88svh] overflow-hidden px-5 py-5 sm:px-8 lg:px-12">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/port-authority-hero.png')" }}
        />
       <div className="absolute inset-0 -z-10 bg-slate-950/55" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t from-slate-950 to-transparent" />

        <header className="mx-auto flex max-w-7xl items-center justify-between rounded-lg border border-white/20 bg-white/10 px-4 py-3 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:px-6">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid size-10 place-items-center rounded-md border border-white/25 bg-white/15 text-sm font-bold shadow-inner shadow-white/10">
              PE
            </span>
            <span>
              <span className="block text-base font-semibold leading-5">
                PortEdge360
              </span>
              <span className="block text-xs font-medium text-cyan-100/80">
                Port Authority
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-md border border-white/10 bg-white/5 p-1 backdrop-blur md:flex">
            {navItems.map((item) => (
              <a
                className="rounded px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/15 hover:text-white"
                href={`#${item.toLowerCase()}`}
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              className="hidden rounded-md px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white sm:inline-flex"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-slate-950/20 transition hover:bg-cyan-50"
              href="/login"
            >
              Login
            </Link>
          </div>
        </header>

       <div className="mx-auto flex min-h-[calc(88svh-92px)] max-w-7xl items-center py-16">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-md border border-cyan-200/30 bg-cyan-100/10 px-3 py-1 text-sm font-medium text-cyan-50 backdrop-blur">
              Maritime command, cargo flow, and berth intelligence
            </div>
            <h1 className="text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              Port Authority operations with a clearer command view.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100/90">
              Coordinate vessel movement, terminal activity, compliance checks,
              and cargo throughput from one calm control surface built for
              modern harbor teams.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-md bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-950/25 transition hover:bg-cyan-200"
                href="/login"
              >
                Enter PortEdge360
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-md border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                href="/dashboard"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="grid border-y border-white/10 bg-slate-950 px-5 py-5 sm:grid-cols-3 sm:px-8 lg:px-12"
        id="operations"
      >
        {[
          ["Berth Windows", "Live scheduling"],
          ["Cargo Flow", "Terminal visibility"],
          ["Harbor Control", "Authority oversight"],
        ].map(([label, value]) => (
          <div className="py-3 sm:border-l sm:border-white/10 sm:px-6" key={label}>
            <p className="text-sm font-medium text-cyan-200">{label}</p>
            <p className="mt-1 text-lg font-semibold text-white">{value}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
