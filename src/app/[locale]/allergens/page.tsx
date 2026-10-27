import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary, SUPPORTED_LOCALES, Locale } from "@/i18n/translations";
import { PAGES_META } from "@/data/pagesContent";
import { RESTAURANT_CONFIG } from "@/data/restaurantConfig";
import { Warning, Phone, ShieldCheck, CheckCircle } from "@phosphor-icons/react/dist/ssr";

import { ALLERGENS_PAGE_CONTENT } from "@/data/subpagesContent";

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = PAGES_META.allergens[locale as Locale] || PAGES_META.allergens.tr;
  const canonicalUrl = `https://cihangirevyemekler.com.tr/${locale}/allergens`;

  const languageAlternates: Record<string, string> = {};
  SUPPORTED_LOCALES.forEach((l) => {
    languageAlternates[l] = `https://cihangirevyemekler.com.tr/${l}/allergens`;
  });

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonicalUrl,
      siteName: "Cihangir Ev Yemekleri & Pide",
      locale,
      type: "website",
    },
  };
}

export default async function AllergensPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const isRtl = locale === "ar" || locale === "fa";
  const t = ALLERGENS_PAGE_CONTENT[locale as Locale] || ALLERGENS_PAGE_CONTENT.tr;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFAF0]" dir={isRtl ? "rtl" : "ltr"}>
      <Header locale={locale} dict={dict} />

      <main className="flex-1 py-10 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#C64C32]/10 text-[#C64C32] border border-[#C64C32]/25">
              {t.badge}
            </span>
            <h1
              className="text-2xl sm:text-4xl font-black text-[#253D2C] leading-tight"
              style={{ fontFamily: "var(--font-cairo)" }}
            >
              {t.title}
            </h1>
            <p className="text-sm sm:text-base text-[#76816E] max-w-2xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Urgent Warning Box */}
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#C64C32]/30 text-start shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#C64C32]">
              <Warning size={24} weight="fill" className="text-[#C64C32] shrink-0" />
              <h2 className="text-base font-bold" style={{ fontFamily: "var(--font-cairo)" }}>
                {t.warningTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#596752] leading-relaxed">
              {t.warningText}
            </p>
            <div className="pt-2">
              <a
                href={`tel:${RESTAURANT_CONFIG.phone.tel}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C64C32] hover:bg-[#A83F29] text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Phone size={14} weight="bold" />
                <span>{t.callBtn}</span>
              </a>
            </div>
          </div>

          {/* Allergen Breakdown Cards */}
          <div className="space-y-4 text-start">
            <h2 className="text-lg font-bold text-[#253D2C]" style={{ fontFamily: "var(--font-cairo)" }}>
              {t.itemsTitle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#FFFFFF] border border-[#C64C32]/15 rounded-xl p-5 shadow-xs">
                <h3 className="font-bold text-sm sm:text-base text-[#253D2C] mb-1.5 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C64C32]"></span>
                  <span>{t.glutenTitle}</span>
                </h3>
                <p className="text-xs text-[#76816E] leading-relaxed">
                  {t.glutenDesc}
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-[#253D2C]/14 rounded-xl p-5 shadow-xs">
                <h3 className="font-bold text-sm sm:text-base text-[#253D2C] mb-1.5 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C64C32]"></span>
                  <span>{t.dairyTitle}</span>
                </h3>
                <p className="text-xs text-[#76816E] leading-relaxed">
                  {t.dairyDesc}
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-[#C64C32]/15 rounded-xl p-5 shadow-xs">
                <h3 className="font-bold text-sm sm:text-base text-[#253D2C] mb-1.5 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#76816E]"></span>
                  <span>{t.nutsTitle}</span>
                </h3>
                <p className="text-xs text-[#76816E] leading-relaxed">
                  {t.nutsDesc}
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-[#C64C32]/15 rounded-xl p-5 shadow-xs">
                <h3 className="font-bold text-sm sm:text-base text-[#253D2C] mb-1.5 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#354D37]"></span>
                  <span>{t.meatTitle}</span>
                </h3>
                <p className="text-xs text-[#76816E] leading-relaxed">
                  {t.meatDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} dict={dict} />
    </div>
  );
}
