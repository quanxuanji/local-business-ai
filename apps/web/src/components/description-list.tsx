type DescriptionListItem = {
  label: string;
  value: string;
};

type DescriptionListProps = {
  items: DescriptionListItem[];
};

export function DescriptionList({ items }: DescriptionListProps) {
  return (
    <dl className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-stone-200 bg-white px-4 py-3"
        >
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
            {item.label}
          </dt>
          <dd className="mt-2 text-sm font-medium text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
