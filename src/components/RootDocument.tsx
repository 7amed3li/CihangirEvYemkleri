import React from "react";
import { Inter, Cairo } from "next/font/google";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { AppProvider } from "@/context/AppContext";
import SmartSplash from "@/components/SmartSplash";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

/**
 * Shared <html>/<body> shell for every root layout ([locale] and admin).
 * Lets each root layout server-render the correct `lang` and `dir`
 * instead of a hard-coded lang="tr" for all ten locales.
 */
export default function RootDocument({
  lang,
  dir = "ltr",
  children,
}: {
  lang: string;
  dir?: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  return (
    <html lang={lang} dir={dir} className={`${inter.variable} ${cairo.variable}`}>
      <body>
        <AppProvider>
          <CurrencyProvider>
            <SmartSplash />
            {children}
          </CurrencyProvider>
        </AppProvider>
      </body>
    </html>
  );
}
