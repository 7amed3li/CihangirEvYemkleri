import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary, SUPPORTED_LOCALES, Locale } from "@/i18n/translations";
import { PAGES_META } from "@/data/pagesContent";
import { RESTAURANT_CONFIG } from "@/data/restaurantConfig";
import { CookingPot, StoneOven, OttomanSeal } from "@/components/BrandIcons";
import { MapPin, Phone, ForkKnife, Sparkle } from "@phosphor-icons/react/dist/ssr";

import { ABOUT_PAGE_CONTENT } from "@/data/subpagesContent";

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = PAGES_META.about[locale as Locale] || PAGES_META.about.tr;
  const canonicalUrl = `https://cihangir-ev-yemkleri.vercel.app/${locale}/about`;

  const languageAlternates: Record<string, string> = {};
  SUPPORTED_LOCALES.forEach((l) => {
    languageAlternates[l] = `https://cihangir-ev-yemkleri.vercel.app/${l}/about`;
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const isRtl = locale === "ar" || locale === "fa";
  const t = ABOUT_PAGE_CONTENT[locale as Locale] || ABOUT_PAGE_CONTENT.tr;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0]" dir={isRtl ? "rtl" : "ltr"}>
      <Header locale={locale} dict={dict} />

      <main className="flex-1 py-10 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Main Title Section */}
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#B8381E]/10 text-[#B8381E] border border-[#B8381E]/25">
              <OttomanSeal size={16} />
              <span>{t.badge}</span>
            </span>
            <h1
              className="text-2xl sm:text-4xl font-black text-[#261E1A] leading-tight"
              style={{ fontFamily: "var(--font-cairo)" }}
            >
              {t.title}
            </h1>
            <p className="text-sm sm:text-base text-[#6E5F53] max-w-2xl mx-auto leading-relaxed">
              {RESTAURANT_CONFIG.address.fullText}
            </p>
          </div>

          {/* Narrative Overview Card */}
          <div className="bg-[#FFFFFF] border border-[#B8381E]/15 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 text-start">
            <p className="text-sm sm:text-base text-[#261E1A] leading-relaxed font-medium">
              {t.p1}
            </p>
            <p className="text-sm sm:text-base text-[#5A4D43] leading-relaxed">
              {t.p2}
            </p>
          </div>

          {/* Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#FFFFFF] border border-[#B8381E]/15 rounded-2xl p-5 shadow-xs text-start">
              <div className="w-10 h-10 rounded-xl bg-[#B8381E] text-white flex items-center justify-center mb-3 shadow-xs">
                <CookingPot size={22} />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#261E1A] mb-1.5">
                {t.pillar1Title}
              </h3>
              <p className="text-xs text-[#6E5F53] leading-relaxed">
                {t.pillar1Desc}
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#C87D17]/25 rounded-2xl p-5 shadow-xs text-start">
              <div className="w-10 h-10 rounded-xl bg-[#C87D17] text-white flex items-center justify-center mb-3 shadow-xs">
                <StoneOven size={22} />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#261E1A] mb-1.5">
                {t.pillar2Title}
              </h3>
              <p className="text-xs text-[#6E5F53] leading-relaxed">
                {t.pillar2Desc}
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#B8381E]/15 rounded-2xl p-5 shadow-xs text-start">
              <div className="w-10 h-10 rounded-xl bg-[#2E6544] text-white flex items-center justify-center mb-3 shadow-xs">
                <ForkKnife size={22} weight="bold" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#261E1A] mb-1.5">
                {t.pillar3Title}
              </h3>
              <p className="text-xs text-[#6E5F53] leading-relaxed">
                {t.pillar3Desc}
              </p>
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href={`/${locale}/menu`}
              className="px-7 py-3.5 rounded-xl bg-[#B8381E] hover:bg-[#992E17] text-white font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>{t.viewMenuBtn}</span>
              <span>{isRtl ? "←" : "→"}</span>
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="px-7 py-3.5 rounded-xl border border-[#B8381E]/30 bg-[#FFFFFF] hover:bg-[#FAF7F0] text-[#261E1A] font-bold text-xs sm:text-sm shadow-xs transition-colors"
            >
              <span>{t.contactBtn}</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer locale={locale} dict={dict} />
    </div>
  );
}
