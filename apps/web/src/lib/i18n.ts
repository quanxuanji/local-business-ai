export const locales = ["en", "zh"] as const;

export type Locale = (typeof locales)[number];

export type SectionKey =
  | "dashboard"
  | "customers"
  | "appointments"
  | "calendar"
  | "workflows"
  | "reviews"
  | "settings";

type Dictionary = {
  appName: string;
  appTagline: string;
  loginTitle: string;
  loginDescription: string;
  sectionLabels: Record<SectionKey, string>;
};

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    appName: "Local Business AI",
    appTagline: "Customer operations for local service teams",
    loginTitle: "Operator login",
    loginDescription:
      "Workspace-aware authentication will live here once the auth module is implemented.",
    sectionLabels: {
      dashboard: "Dashboard",
      customers: "Customers",
      appointments: "Appointments",
      calendar: "Calendar",
      workflows: "Workflows",
      reviews: "Reviews",
      settings: "Settings",
    },
  },
  zh: {
    appName: "Local Business AI",
    appTagline: "面向本地服务团队的客户运营平台",
    loginTitle: "运营人员登录",
    loginDescription: "认证模块完成后，这里会承载按工作区隔离的登录流程。",
    sectionLabels: {
      dashboard: "仪表盘",
      customers: "客户",
      appointments: "预约",
      calendar: "日历",
      workflows: "工作流",
      reviews: "评价",
      settings: "设置",
    },
  },
};

export function isSupportedLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function getLocaleFromValue(value: string): Locale | null {
  return isSupportedLocale(value) ? value : null;
}
