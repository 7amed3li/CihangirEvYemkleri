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
  showSplash = true,
  children,
}: {
  lang: string;
  dir?: "ltr" | "rtl";
  showSplash?: boolean;
  children: React.ReactNode;
}) {
  return (
    <html lang={lang} dir={dir} className={`${inter.variable} ${cairo.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('cihangir_skip_splash')==='1'||document.cookie.indexOf('cihangir_skip_splash=1')!==-1){document.documentElement.classList.add('splash-dismissed');}}catch(e){}`,
          }}
        />
        {showSplash && (
          <>
            <link rel="preload" as="image" href="/splash/red-ring.webp" type="image/webp" />
            <link rel="preload" as="image" href="/splash/pot-spoon.webp" type="image/webp" />
            <link rel="preload" as="image" href="/splash/pide.webp" type="image/webp" />
            <link rel="preload" as="image" href="/splash/typography.webp" type="image/webp" />
            <link rel="preload" as="image" href="/splash/logo-original.webp" type="image/webp" />
          </>
        )}
      </head>
      <body>
        <AppProvider>
          <CurrencyProvider>
            {showSplash && <SmartSplash />}
            {children}
          </CurrencyProvider>
        </AppProvider>
      </body>
    </html>
  );
}
