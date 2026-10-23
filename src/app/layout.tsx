import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Cihangir Ev Yemekleri Pide",
  description:
    "Cihangir'in kalbinde geleneksel ev yemekleri ve taş fırın pide lezzetleri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${cairo.variable}`}>
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
