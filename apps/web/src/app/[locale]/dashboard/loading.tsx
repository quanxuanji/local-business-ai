import { PageSkeleton } from "../../../components/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:flex-row">
        <aside className="w-full rounded-2xl bg-white/85 p-6 shadow-panel backdrop-blur lg:w-72">
          <div className="h-4 w-32 animate-pulse rounded bg-stone-200" />
          <div className="mt-3 h-7 w-48 animate-pulse rounded bg-stone-200" />
          <div className="mt-6 space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-stone-100" />
            ))}
          </div>
        </aside>
        <main className="flex-1">
          <div className="rounded-[2rem] bg-white/90 px-8 py-8 shadow-panel backdrop-blur">
            <div className="border-b border-stone-200 pb-6">
              <div className="h-3 w-24 animate-pulse rounded bg-stone-200" />
              <div className="mt-3 h-8 w-64 animate-pulse rounded bg-stone-200" />
              <div className="mt-3 h-4 w-96 animate-pulse rounded bg-stone-200" />
            </div>
            <div className="mt-8">
              <PageSkeleton />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
