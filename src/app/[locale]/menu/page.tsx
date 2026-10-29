import React from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuClient from "./MenuClient";
import { getDictionary, SUPPORTED_LOCALES } from "@/i18n/translations";
import { buildPageMetadata } from "@/lib/seo";
import {
  getDatabaseMenu,
  getPublishedDailyMenu,
  getActivePublicOffers,
} from "@/lib/db/menu-loader";

export const revalidate = 60;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

const MENU_TITLES: Record<string, string> = {
  tr: "Menü | Cihangir Ev Yemekleri & Taş Fırın Pide",
  en: "Menu | Cihangir Home Kitchen & Stone Oven Pide",
  ar: "قائمة الطعام | جيهانغير للمطبخ البيتي، بيوغلو، إسطنبول",
  de: "Menü | Cihangir Hausküche & Steinofenpide",
  fr: "Menu | Cihangir Cuisine Maison & Pide au Four",
  ru: "Меню | Cihangir Домашняя Кухня & Пиде",
  es: "Menú | Cihangir Cocina Casera & Pide",
  it: "Menù | Cihangir Cucina Casalinga & Pide",
  zh: "菜单 | 贾汉吉尔家常菜 & 石炉皮得",
  fa: "منو | آشپزخانه خانگی جیهانگیر",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles = MENU_TITLES;

  const descriptions: Record<string, string> = {
    tr: "Ana yemekler, çorbalar, taş fırın pide çeşitleri, tatlılar ve içecekler. Cihangir Ev Yemekleri & Pide menüsü, Beyoğlu, İstanbul.",
    en: "Main dishes, soups, stone-oven pide varieties, desserts and drinks. Cihangir Home Kitchen & Pide menu, Beyoğlu, Istanbul.",
    ar: "الأطباق الرئيسية، الشوربات، فطائر الفرن الحجري، الحلويات والمشروبات. قائمة جيهانغير للمطبخ البيتي.",
    de: "Hauptgerichte, Suppen, Steinofenpide, Desserts und Getränke. Cihangir Hausküche & Pide, Beyoğlu, Istanbul.",
    fr: "Plats principaux, soupes, pide au four, desserts et boissons. Cihangir Cuisine Maison & Pide, Beyoğlu, Istanbul.",
    ru: "Главные блюда, супы, пиде из каменной печи, десерты и напитки. Cihangir, Бейоглу, Стамбул.",
    es: "Platos principales, sopas, pide de horno de piedra, postres y bebidas. Cihangir, Beyoğlu, Estambul.",
    it: "Piatti principali, zuppe, pide dal forno a pietra, dolci e bevande. Cihangir, Beyoğlu, Istanbul.",
    zh: "主菜、汤、石炉皮得、甜点和饮料。贾汉吉尔家常菜 & 皮得菜单。",
    fa: "غذاهای اصلی، سوپ، پیده فر سنگی، دسر و نوشیدنی. منوی جیهانگیر.",
  };

  const title = titles[locale] ?? titles.tr;
  const description = descriptions[locale] ?? descriptions.tr;
  return buildPageMetadata({ locale, path: "/menu", title, description });
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
    <div className="min-h-screen flex flex-col bg-[#F6F1E7]">
      {/* Sticky Ottoman Header */}
      <Header locale={locale} dict={dict} />

      {/* Main Interactive Menu Client */}
      <main className="flex-1">
        <h1
          className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 text-lg sm:text-xl font-black text-[#253D2C] text-start"
          style={{ fontFamily: "var(--font-cairo)" }}
        >
          {(MENU_TITLES[locale] ?? MENU_TITLES.tr).replace(" | ", " · ")}
        </h1>
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
