"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { OttomanSeal } from "./BrandIcons";
import { RESTAURANT_CONFIG } from "@/data/restaurantConfig";
import { FOOTER_TRANSLATIONS } from "@/data/footerTranslations";
import { Locale } from "@/i18n/translations";

interface FooterProps {
  locale: string;
  dict?: Record<string, any>;
}

export default function Footer({ locale, dict }: FooterProps) {
  const isRtl = locale === "ar" || locale === "fa";
  const t = FOOTER_TRANSLATIONS[(locale as Locale) || "tr"] || FOOTER_TRANSLATIONS.tr;

  return (
    <footer
      dir={isRtl ? "rtl" : "ltr"}
      className="bg-[#FFFAF0] border-t-2 border-[#253D2C]/14 pt-10 pb-20 sm:pb-28 px-4 text-start"
    >
      <div className="max-w-6xl mx-auto">
        {/* Ottoman Divider */}
        <div className="ottoman-divider max-w-md mx-auto mb-10"></div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10 text-start">
          {/* Brand Column */}
          <div className="flex flex-col items-start text-start">
            <Link href={`/${locale}`} className="flex items-center gap-3 mb-2 group">
              <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                <Image
                  src="/splash/logo-original.webp"
                  alt="Cihangir Ev Yemekleri Pide"
                  fill
                  sizes="44px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <h2
                  className="text-2xl sm:text-3xl font-black text-[#253D2C] tracking-wide group-hover:text-[#C64C32] transition-colors"
                  style={{ fontFamily: "var(--font-cairo)" }}
                >
                  Cihangir
                </h2>
                <span
                  className="text-[#C64C32] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Ev Yemekleri & Pide
                </span>
              </div>
            </Link>
            <p
              className="text-[#76816E] text-xs sm:text-sm font-normal leading-relaxed max-w-xs"
              style={{ fontFamily: isRtl ? "var(--font-cairo)" : "var(--font-inter)" }}
            >
              {t.brandSubtitle}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start text-start w-full">
            <h3 className="text-xs sm:text-sm font-bold text-[#C64C32] tracking-widest uppercase mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C64C32]"></span>
              <span>{t.quickLinksTitle}</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-[#76816E] hover:text-[#253D2C] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#596752]">{isRtl ? "‹" : "›"}</span>
                  <span>{t.home}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/menu`}
                  className="text-[#76816E] hover:text-[#253D2C] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#596752]">{isRtl ? "‹" : "›"}</span>
                  <span>{t.menu}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-[#76816E] hover:text-[#253D2C] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#596752]">{isRtl ? "‹" : "›"}</span>
                  <span>{t.about}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/delivery`}
                  className="text-[#76816E] hover:text-[#253D2C] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#596752]">{isRtl ? "‹" : "›"}</span>
                  <span>{t.delivery}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/allergens`}
                  className="text-[#76816E] hover:text-[#253D2C] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#596752]">{isRtl ? "‹" : "›"}</span>
                  <span>{t.allergens}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/faq`}
                  className="text-[#76816E] hover:text-[#253D2C] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#596752]">{isRtl ? "‹" : "›"}</span>
                  <span>{t.faq}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-[#76816E] hover:text-[#253D2C] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#596752]">{isRtl ? "‹" : "›"}</span>
                  <span>{t.contact}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="flex flex-col items-start text-start w-full">
            <h3 className="text-xs sm:text-sm font-bold text-[#C64C32] tracking-widest uppercase mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C64C32]"></span>
              <span>{t.contactTitle}</span>
            </h3>
            <div className="flex items-start gap-2.5 mb-3 text-start">
              <svg
                className="w-4 h-4 text-[#354D37] mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p
                className="text-[#253D2C] text-xs sm:text-sm font-medium leading-relaxed"
                style={{ fontFamily: isRtl ? "var(--font-cairo)" : "var(--font-inter)" }}
              >
                Cihangir, Yeni Yuva Sk. no:50A, 34433 Beyoğlu / İstanbul
              </p>
            </div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <svg
                className="w-4 h-4 text-[#354D37] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <a
                href="tel:+902122513696"
                className="text-[#253D2C] text-xs sm:text-sm font-semibold hover:text-[#C64C32] transition-colors"
                dir="ltr"
              >
                +90 (212) 251 36 96
              </a>
            </div>
            <div className="flex items-center gap-2.5 mb-4">
              <svg
                className="w-4 h-4 text-[#354D37] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              </svg>
              <p className="text-[#76816E] text-xs sm:text-sm font-medium">
                {t.hours}
              </p>
            </div>
            <a
              href="tel:+902122513696"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#354D37] text-[#E4EADB] hover:bg-[#293F30] transition-colors font-bold text-xs sm:text-sm shadow-xs"
            >
              <span>{t.callBtn}</span>
            </a>
          </div>

          {/* Interactive Google Map Preview Card */}
          <div className="flex flex-col items-start text-start w-full">
            <h3 className="text-xs sm:text-sm font-bold text-[#C64C32] tracking-widest uppercase mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C64C32]"></span>
              <span>{t.mapTitle}</span>
            </h3>
            
            <div className="w-full rounded-xl overflow-hidden border border-[#253D2C]/20 shadow-xs bg-[#F6F1E7] relative group">
              <iframe
                title="Cihangir Ev Yemekleri & Pide Location"
                src={RESTAURANT_CONFIG.address.googleMapsEmbedUrl}
                width="100%"
                height="140"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-36 filter contrast-105"
              />
            </div>

            <a
              href={RESTAURANT_CONFIG.address.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg border border-[#253D2C]/24 bg-[#FFFAF0] hover:bg-[#F6F1E7] text-[#253D2C] hover:text-[#C64C32] transition-all font-semibold text-xs shadow-2xs"
            >
              <svg
                className="w-4 h-4 text-[#596752]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <span>{t.directionsLabel}</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="ottoman-divider max-w-sm mx-auto mb-6"></div>

        {/* Bottom Bar with Policy Links */}
        <div className="pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-start">
          <div className="space-y-1">
            <p
              className="text-[#76816E] text-xs font-medium"
              style={{ fontFamily: isRtl ? "var(--font-cairo)" : "var(--font-inter)" }}
            >
              {t.rights}
            </p>
            {/* Policy Links */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#596752]">
              <Link href={`/${locale}/terms`} className="hover:underline">
                {t.terms}
              </Link>
              <span>•</span>
              <Link href={`/${locale}/privacy`} className="hover:underline">
                {t.privacy}
              </Link>
              <span>•</span>
              <Link href={`/${locale}/cancellation`} className="hover:underline">
                {t.cancellation}
              </Link>
            </div>
          </div>
          <p className="text-[#76816E] text-[10px] tracking-widest uppercase flex items-center gap-1">
            {t.devCredit}
            <span className="text-[#596752] font-bold">Hamed Mohamed</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
