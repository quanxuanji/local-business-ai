import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  baseHref: string;
  locale: string;
};

export function Pagination({
  currentPage,
  totalPages,
  baseHref,
  locale,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageRange(currentPage, totalPages);
  const prevLabel = locale === "zh" ? "上一页" : "Previous";
  const nextLabel = locale === "zh" ? "下一页" : "Next";

  return (
    <nav
      className="flex items-center justify-between border-t border-stone-200 pt-4"
      aria-label="Pagination"
    >
      <p className="text-sm text-slate">
        {locale === "zh"
          ? `第 ${currentPage} / ${totalPages} 页`
          : `Page ${currentPage} of ${totalPages}`}
      </p>
      <div className="flex items-center gap-1">
        {currentPage > 1 ? (
          <Link
            href={`${baseHref}?page=${currentPage - 1}`}
            className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-ink hover:bg-mist"
          >
            {prevLabel}
          </Link>
        ) : (
          <span className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-400">
            {prevLabel}
          </span>
        )}

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-slate">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={`${baseHref}?page=${p}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                p === currentPage
                  ? "bg-ink text-white"
                  : "border border-stone-200 text-ink hover:bg-mist"
              }`}
            >
              {p}
            </Link>
          ),
        )}

        {currentPage < totalPages ? (
          <Link
            href={`${baseHref}?page=${currentPage + 1}`}
            className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-ink hover:bg-mist"
          >
            {nextLabel}
          </Link>
        ) : (
          <span className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-400">
            {nextLabel}
          </span>
        )}
      </div>
    </nav>
  );
}

function buildPageRange(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}
