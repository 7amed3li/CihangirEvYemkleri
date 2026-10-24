import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { menuData } from "@/data/menuData";
import { getDishDisplay } from "@/data/dishTranslations";
import { SUPPORTED_LOCALES, Locale, getDictionary } from "@/i18n/translations";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Twemoji from "@/components/Twemoji";
import DishDetailClient from "./DishDetailClient";

export async function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];
  menuData.forEach((category) => {
    category.items.forEach((item) => {
      if (item.id) {
        SUPPORTED_LOCALES.forEach((locale) => {
          params.push({ locale, id: item.id });
        });
      }
    });
  });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const allItems = menuData.flatMap((c) => c.items);
  const item = allItems.find((i) => i.id === id);

  if (!item) return { title: "Dish Not Found" };

  const { turkishTitle, localizedName, localizedDesc } = getDishDisplay(
    item,
    locale
  );

  const title =
    locale === "tr"
      ? `${turkishTitle} | Cihangir Ev Yemekleri & Pide`
      : `${turkishTitle} (${localizedName}) | Cihangir Ev Yemekleri`;

  const description =
    localizedDesc ||
    `${turkishTitle} - Cihangir Ev Yemekleri & Pide İstanbul Beyoğlu`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: item.image ? [{ url: item.image }] : [],
    },
  };
}

export default async function DishPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const dict = getDictionary(locale);
  const allItems = menuData.flatMap((c) => c.items);
  const item = allItems.find((i) => i.id === id);

  if (!item) {
    notFound();
  }

  const { turkishTitle, localizedName, localizedDesc, formattedDesc } =
    getDishDisplay(item, locale);

  const isRTL = locale === "ar" || locale === "fa";

  const backToMenuText =
    locale === "ar"
      ? "العودة إلى القائمة"
      : locale === "fa"
      ? "بازگشت به منو"
      : locale === "en"
      ? "Back to Menu"
      : locale === "ru"
      ? "Назад в меню"
      : locale === "fr"
      ? "Retour au menu"
      : locale === "de"
      ? "Zurück zur Speisekarte"
      : locale === "it"
      ? "Torna al menu"
      : locale === "es"
      ? "Volver al menú"
      : locale === "zh"
      ? "返回菜单"
      : "Menüye Dön";

  return (
    <div className="min-h-screen flex flex-col bg-[#EDE3CE]" dir={isRTL ? "rtl" : "ltr"}>
      {/* Sticky Header with active language & currency support */}
      <Header locale={locale} dict={dict} />

      <main className="flex-1 py-8 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        {/* Back Button linking directly to the dish anchor on the menu */}
        <Link
          href={`/${locale}/menu#${item.id}`}
          className="inline-flex items-center gap-2 text-[#9C7A3F] hover:text-[#2B2620] font-bold text-sm mb-6 transition-colors group cursor-pointer"
        >
          <CaretLeft
            size={18}
            weight="bold"
            className={`transition-transform group-hover:-translate-x-1 ${
              isRTL ? "rotate-180 group-hover:translate-x-1" : ""
            }`}
          />
          <span>{backToMenuText}</span>
        </Link>

        {/* Dish Showcase Card */}
        <div className="bg-[#FAF7F0] rounded-2xl shadow-xl overflow-hidden border-2 border-[#9C7A3F]/35 flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="w-full md:w-1/2 min-h-[300px] md:min-h-[420px] relative bg-[#EDE3CE] flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-e border-[#9C7A3F]/20">
            {item.image ? (
              <Image
                src={item.image}
                alt={turkishTitle}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-[#9C7A3F]/60">
                <span className="text-5xl mb-2">🍽️</span>
                <span className="text-sm font-bold text-[#7A7364]">{turkishTitle}</span>
              </div>
            )}
          </div>

          {/* Dish Details Section with Live Currency & Cart Interaction */}
          <DishDetailClient
            item={item}
            locale={locale}
            turkishTitle={turkishTitle}
            localizedName={localizedName}
            localizedDesc={localizedDesc}
            formattedDesc={formattedDesc}
            isRTL={isRTL}
          />
        </div>
      </main>

      <Footer locale={locale} dict={dict} />
    </div>
  );
}
