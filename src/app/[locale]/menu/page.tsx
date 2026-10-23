import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuClient from "./MenuClient";
import { getDictionary, SUPPORTED_LOCALES } from "@/i18n/translations";
import {
  getDatabaseMenu,
  getPublishedDailyMenu,
  getActivePublicOffers,
} from "@/lib/db/menu-loader";

export const revalidate = 60; // 60-second ISR for fresh menu updates from admin panel

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  // Fetch live categories, daily menu, and offers in parallel
  const [{ categories }, dailyMenu, offers] = await Promise.all([
    getDatabaseMenu(),
    getPublishedDailyMenu(locale),
    getActivePublicOffers(locale),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#EDE3CE]">
      {/* Sticky Ottoman Header */}
      <Header locale={locale} dict={dict} />

      {/* Main Interactive Menu Client */}
      <main className="flex-1">
        <MenuClient
          dict={dict}
          categories={categories}
          dailyMenu={dailyMenu}
          offers={offers}
        />
      </main>

      {/* Ottoman Divider & Footer */}
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
