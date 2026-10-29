import React from "react";
import { notFound } from "next/navigation";
import { SUPPORTED_LOCALES, Locale } from "@/i18n/translations";

import CartDrawer from "@/components/CartDrawer";

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const isRtl = locale === "ar" || locale === "fa";

  return (
    <div
      id="app-root"
      dir={isRtl ? "rtl" : "ltr"}
      lang={locale}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: isRtl ? "var(--font-cairo), sans-serif" : "inherit",
      }}
    >
      {children}
      <CartDrawer />
    </div>
  );
}
