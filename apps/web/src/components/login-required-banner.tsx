import Link from "next/link";
import type { Locale } from "../lib/i18n";

type LoginRequiredBannerProps = {
  locale: Locale;
};

export function LoginRequiredBanner({ locale }: LoginRequiredBannerProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
      <h3 className="text-sm font-semibold text-amber-900">
        {locale === "zh" ? "需要登录" : "Sign in required"}
      </h3>
      <p className="mt-2 text-sm text-amber-700">
        {locale === "zh"
          ? "请先登录以查看真实数据和使用完整功能。当前显示为空或占位数据。"
          : "Please sign in to view real data and use full features. Currently showing empty or placeholder data."}
      </p>
      <Link
        href={`/${locale}/login`}
        className="mt-3 inline-flex rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
      >
        {locale === "zh" ? "前往登录" : "Sign in"}
      </Link>
    </div>
  );
}
