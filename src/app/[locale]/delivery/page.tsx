import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary, SUPPORTED_LOCALES, Locale } from "@/i18n/translations";
import { PAGES_META } from "@/data/pagesContent";
import { RESTAURANT_CONFIG } from "@/data/restaurantConfig";
import { Phone, Bag, Scooter, Clock, MapPin, Info } from "@phosphor-icons/react/dist/ssr";

import { DELIVERY_PAGE_CONTENT } from "@/data/subpagesContent";

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = PAGES_META.delivery[locale as Locale] || PAGES_META.delivery.tr;
  return buildPageMetadata({
    locale,
    path: "/delivery",
    title: meta.title,
    description: meta.description,
  });
}

export default async function DeliveryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const isRtl = locale === "ar" || locale === "fa";
  const t = DELIVERY_PAGE_CONTENT[locale as Locale] || DELIVERY_PAGE_CONTENT.tr;

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

          {/* Polite Disclaimer Alert Box */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#C64C32]/20 shadow-xs flex items-start gap-3.5 text-start">
            <div className="w-9 h-9 rounded-xl bg-[#C64C32]/10 text-[#C64C32] flex items-center justify-center shrink-0 mt-0.5">
              <Info size={20} weight="bold" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-bold text-[#253D2C] mb-1">
                {t.coverageTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#596752] leading-relaxed mb-3">
                {t.coverageText} — {t.paymentText}
              </p>
              <div>
                <a
                  href={`tel:${RESTAURANT_CONFIG.phone.tel}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C64C32] hover:bg-[#A83F29] text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Phone size={15} weight="bold" />
                  <span>{t.callBtn}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Two Core Options Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
            {/* Pick-Up */}
            <div className="bg-[#FFFFFF] border border-[#C64C32]/15 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C64C32] text-white flex items-center justify-center mb-4 shadow-xs">
                  <Bag size={24} weight="bold" />
                </div>
                <h3 className="text-base font-bold text-[#253D2C] mb-2">
                  {t.option1Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#76816E] leading-relaxed mb-4">
                  {t.option1Desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#C64C32]/15 text-xs text-[#596752]">
                <p className="font-semibold text-[#253D2C] mb-1">{t.option1Notice}</p>
                <p>{RESTAURANT_CONFIG.address.fullText}</p>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-[#FFFFFF] border border-[#253D2C]/14 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C64C32] text-white flex items-center justify-center mb-4 shadow-xs">
                  <Scooter size={24} weight="bold" />
                </div>
                <h3 className="text-base font-bold text-[#253D2C] mb-2">
                  {t.option2Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#76816E] leading-relaxed mb-4">
                  {t.option2Desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#253D2C]/12 text-xs text-[#596752]">
                <p className="font-semibold text-[#253D2C] mb-1">{t.option2Notice}</p>
                <p className="text-[#76816E]">{RESTAURANT_CONFIG.delivery.serviceAreas.join(", ")}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} dict={dict} />
    </div>
  );
}
