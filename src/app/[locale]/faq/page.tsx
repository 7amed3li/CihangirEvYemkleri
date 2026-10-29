import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary, SUPPORTED_LOCALES, Locale } from "@/i18n/translations";
import { PAGES_META } from "@/data/pagesContent";
import { RESTAURANT_CONFIG } from "@/data/restaurantConfig";
import { Question, CaretDown, Phone } from "@phosphor-icons/react/dist/ssr";

import { FAQ_PAGE_CONTENT } from "@/data/subpagesContent";

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = PAGES_META.faq[locale as Locale] || PAGES_META.faq.tr;
  const canonicalUrl = `https://www.cihangirevyemekler.com.tr/${locale}/faq`;

  const languageAlternates: Record<string, string> = {};
  SUPPORTED_LOCALES.forEach((l) => {
    languageAlternates[l] = `https://www.cihangirevyemekler.com.tr/${l}/faq`;
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

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const isRtl = locale === "ar" || locale === "fa";
  const t = FAQ_PAGE_CONTENT[locale as Locale] || FAQ_PAGE_CONTENT.tr;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFAF0]" dir={isRtl ? "rtl" : "ltr"}>
      <Header locale={locale} dict={dict} />

      <main className="flex-1 py-10 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Title Banner */}
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
            <p className="text-sm sm:text-base text-[#76816E] leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Accordion / List */}
          <div className="space-y-4">
            {t.items.map((faq, index) => (
              <details
                key={index}
                className="group bg-[#FFFFFF] border border-[#C64C32]/15 rounded-2xl p-5 shadow-xs text-start open:border-[#C64C32]/50 transition-all"
              >
                <summary className="font-bold text-sm sm:text-base text-[#253D2C] cursor-pointer flex items-center justify-between gap-3 list-none select-none">
                  <span style={{ fontFamily: "var(--font-cairo)" }}>{faq.q}</span>
                  <span className="w-7 h-7 rounded-full bg-[#FFFAF0] text-[#C64C32] flex items-center justify-center shrink-0 group-open:rotate-180 transition-transform">
                    <CaretDown size={14} weight="bold" />
                  </span>
                </summary>
                <p className="text-xs sm:text-sm text-[#596752] leading-relaxed mt-3 pt-3 border-t border-[#C64C32]/10">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          {/* Contact prompt */}
          <div className="bg-[#FFFFFF] border border-[#C64C32]/20 rounded-2xl p-6 text-center space-y-3 shadow-xs">
            <p className="text-sm text-[#253D2C] font-semibold">
              {t.callNotice}
            </p>
            <a
              href={`tel:${RESTAURANT_CONFIG.phone.tel}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C64C32] hover:bg-[#A83F29] text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              <Phone size={16} weight="bold" />
              <span>{t.callBtn}</span>
            </a>
          </div>
        </div>
      </main>

      <Footer locale={locale} dict={dict} />
    </div>
  );
}
