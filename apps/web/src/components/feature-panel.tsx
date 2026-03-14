import type { ReactNode } from "react";

type FeaturePanelProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function FeaturePanel({
  title,
  description,
  children,
}: FeaturePanelProps) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-mist/65 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate">
            {description}
          </p>
        </div>
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}
