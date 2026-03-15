import Link from "next/link";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
};

export function EmptyState({
  icon = "📋",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-mist/30 px-6 py-12 text-center">
      <span className="text-4xl">{icon}</span>
      <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-4 inline-flex rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink/90"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
