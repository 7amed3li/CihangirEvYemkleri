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
  metadataBase: new URL("https://www.cihangirevyemekler.com.tr"),
  title: {
    default: "Cihangir Ev Yemekleri & Pide",
    template: "%s | Cihangir Ev Yemekleri & Pide",
  },
  description:
    "Anne şefkatiyle pişen taze tencere yemekleri, fırından yeni çıkmış çıtır pideler ve Cihangir'in en samimi esnaf sofrası. Beyoğlu'nda evinizin lezzeti ve sıcaklığı.",
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
