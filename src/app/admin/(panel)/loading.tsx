export default function PanelLoading() {
  return (
    <div>
      <div className="nav-progress" aria-hidden />
      <div className="animate-pulse">
        <div className="h-8 w-52 rounded-lg bg-line/70" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-line/50" />

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-2xl border border-line bg-paper" />
          ))}
        </div>

        <div className="mt-6 h-36 rounded-2xl border border-line bg-paper" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="h-40 rounded-2xl border border-line bg-paper" />
          <div className="h-40 rounded-2xl border border-line bg-paper" />
        </div>
      </div>
    </div>
  );
}
