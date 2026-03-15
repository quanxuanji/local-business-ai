import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ToastProvider } from "../components/toast-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local Business AI",
  description: "AI-powered customer operations scaffold for local service businesses.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
