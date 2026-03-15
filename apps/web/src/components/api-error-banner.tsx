import type { Locale } from "../lib/i18n";

type ApiErrorBannerProps = {
  locale: Locale;
  message?: string;
};

export function ApiErrorBanner({ locale, message }: ApiErrorBannerProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <h3 className="text-sm font-semibold text-red-900">
        {locale === "zh" ? "数据加载失败" : "Failed to load data"}
      </h3>
      <p className="mt-1 text-sm text-red-700">
        {message ??
          (locale === "zh"
            ? "无法从服务器获取数据。当前显示的可能是缓存或占位数据。请检查后端服务是否正常运行。"
            : "Could not fetch data from the server. You may be seeing cached or placeholder data. Please check that the backend is running.")}
      </p>
    </div>
  );
}
