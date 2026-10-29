import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SUPPORTED_LOCALES } from "@/i18n/translations";
import RootDocument from "@/components/RootDocument";
import { SITE_URL, SITE_NAME, isRtlLocale, isSupportedLocale } from "@/lib/seo";

import CartDrawer from "@/components/CartDrawer";

// Unknown first segments (e.g. /xx) are not valid locales → 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

/** Root layout for all public, localized pages. */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const isRtl = isRtlLocale(locale);

  return (
    <RootDocument lang={locale} dir={isRtl ? "rtl" : "ltr"}>
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
    </RootDocument>
  );
}
