"use client";

import React from "react";
import Link from "next/link";
import { OttomanSeal } from "./BrandIcons";

interface FooterProps {
  locale: string;
  dict?: Record<string, any>;
}

export default function Footer({ locale, dict }: FooterProps) {
  const isRtl = locale === "ar" || locale === "fa";

  return (
    <footer
      dir={isRtl ? "rtl" : "ltr"}
      className="bg-[#F7F2E7] border-t border-[#9C7A3F]/25 pt-12 pb-24 sm:pb-32 px-4 text-start"
    >
      <div className="max-w-6xl mx-auto">
        {/* Ottoman Divider */}
        <div className="ottoman-divider max-w-md mx-auto mb-12"></div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10 text-start">
          {/* Brand Column */}
          <div className="flex flex-col items-start text-start">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#9C7A3F]">
                <OttomanSeal size={28} />
              </span>
              <h2
                className="text-2xl sm:text-3xl font-black text-[#2B2620] tracking-wide"
                style={{ fontFamily: "var(--font-cairo)" }}
              >
                Cihangir
              </h2>
            </div>
            <p
              className="text-[#9C7A3F] text-xs font-semibold tracking-[0.25em] uppercase mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Ev Yemekleri & Pide
            </p>
            <p
              className="text-[#7A7364] text-xs sm:text-sm font-normal leading-relaxed max-w-xs"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {dict?.subtitle ||
                "Cihangir'in kalbinde, geleneksel ev yemekleri ve taş fırın pide lezzetleri."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start text-start w-full">
            <h3 className="text-xs sm:text-sm font-bold text-[#9C7A3F] tracking-widest uppercase mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9C7A3F]"></span>
              <span>{dict?.quickLinks || "Hızlı Bağlantılar"}</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-[#7A7364] hover:text-[#2B2620] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#9C7A3F]">›</span>
                  <span>{dict?.home || "Ana Sayfa"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/menu`}
                  className="text-[#7A7364] hover:text-[#2B2620] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#9C7A3F]">›</span>
                  <span>{dict?.menu || "Menü"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/menu#ana-yemekler`}
                  className="text-[#7A7364] hover:text-[#2B2620] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#9C7A3F]">›</span>
                  <span>Geleneksel Ev Yemekleri</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/menu#pideler`}
                  className="text-[#7A7364] hover:text-[#2B2620] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#9C7A3F]">›</span>
                  <span>Taş Fırın Pideler</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="flex flex-col items-start text-start w-full">
            <h3 className="text-xs sm:text-sm font-bold text-[#9C7A3F] tracking-widest uppercase mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9C7A3F]"></span>
              <span>{dict?.contact || "İletişim & Konum"}</span>
            </h3>
            <div className="flex items-start gap-2.5 mb-3 text-start">
              <svg
                className="w-4 h-4 text-[#4E5F4C] mt-0.5 shrink-0"
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
                className="text-[#2B2620] text-xs sm:text-sm font-medium leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Cihangir, Beyoğlu, İstanbul
              </p>
            </div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <svg
                className="w-4 h-4 text-[#4E5F4C] shrink-0"
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
                className="text-[#2B2620] text-xs sm:text-sm font-semibold hover:text-[#9C7A3F] transition-colors"
              >
                +90 (212) 251 36 96
              </a>
            </div>
            <div className="flex items-center gap-2.5 mb-4">
              <svg
                className="w-4 h-4 text-[#4E5F4C] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              </svg>
              <p className="text-[#7A7364] text-xs sm:text-sm font-medium">
                {dict?.hours || "Her gün: 08:30 - 22:30"}
              </p>
            </div>
            <a
              href="tel:+902122513696"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-[#4E5F4C] text-[#EAF0E6] hover:bg-[#3D4B3B] transition-colors font-bold text-xs sm:text-sm shadow-xs"
            >
              <span>{dict?.orderPhone || "Telefonla Sipariş"}</span>
            </a>
          </div>

          {/* Location & Map Preview Card */}
          <div className="flex flex-col items-start text-start w-full">
            <h3 className="text-xs sm:text-sm font-bold text-[#9C7A3F] tracking-widest uppercase mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9C7A3F]"></span>
              <span>Harita ve Ulaşım</span>
            </h3>
            <div className="w-full h-36 rounded-xl relative bg-[#EDE3CE] overflow-hidden border border-[#9C7A3F]/35 shadow-xs flex flex-col items-center justify-center p-3">
              <div className="w-8 h-8 rounded-full bg-[#4E5F4C] flex items-center justify-center text-white mb-2 shadow-xs">
                <svg
                  className="w-4 h-4"
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
              </div>
              <p
                className="text-xs font-bold text-[#2B2620] mb-1"
                style={{ fontFamily: "var(--font-cairo)" }}
              >
                Cihangir Ev Yemekleri
              </p>
              <span className="text-[11px] font-semibold text-[#7A7364]">
                Taksim Meydanı'na 5 dk
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods Section (Identical to Kardeşler) */}
        <div className="my-8 p-5 sm:p-7 rounded-2xl bg-[#F7F2E7] border border-[#9C7A3F]/30 shadow-xs text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-1.5">
            <span className="h-px w-8 bg-[#9C7A3F]/40"></span>
            <p
              className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#9C7A3F]"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {dict?.acceptedPayments || "Kabul Edilen Ödeme Yöntemleri"}
            </p>
            <span className="h-px w-8 bg-[#9C7A3F]/40"></span>
          </div>
          <p
            className="text-xs text-[#7A7364] mb-5 font-medium"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Nakit, tüm kredi kartları, temassız İstanbulkart ve kurumsal yemek kartları geçerlidir.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 max-w-4xl mx-auto">
            {/* Nakit */}
            <div className="h-11 rounded-lg px-3 py-1 flex items-center justify-center bg-[#2B2620] border border-[#2B2620]">
              <span className="text-[11px] font-black text-[#EDE3CE] tracking-wider">
                NAKİT / CASH
              </span>
            </div>

            {/* Visa */}
            <div className="h-11 rounded-lg px-3 py-1 flex items-center justify-center bg-white border border-[#9C7A3F]/20">
              <span className="text-sm font-black text-[#1A1F71] tracking-widest italic">
                VISA
              </span>
            </div>

            {/* Mastercard */}
            <div className="h-11 rounded-lg px-3 py-1 flex items-center justify-center bg-white border border-[#9C7A3F]/20 gap-1.5">
              <div className="flex -space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-[#EB001B] inline-block"></span>
                <span className="w-4 h-4 rounded-full bg-[#F79E1B]/90 inline-block"></span>
              </div>
              <span className="text-[10px] font-black text-black">mastercard</span>
            </div>

            {/* TROY */}
            <div className="h-11 rounded-lg px-3 py-1 flex items-center justify-center bg-white border border-[#9C7A3F]/20">
              <span className="text-xs font-black text-[#00579F] tracking-wider">
                TR<span className="text-[#E30613]">O</span>Y
              </span>
            </div>

            {/* İstanbulkart */}
            <div className="h-11 rounded-lg px-3 py-1 flex items-center justify-center bg-white border border-[#9C7A3F]/20">
              <span className="text-[10px] font-extrabold text-[#008375]">
                istanbul<span className="text-[#E30613]">kart</span>
              </span>
            </div>

            {/* Multinet */}
            <div className="h-11 rounded-lg px-3 py-1 flex items-center justify-center bg-white border border-[#9C7A3F]/20">
              <span className="text-[11px] font-extrabold text-[#E30613]">
                multi<span className="text-[#2D3192]">net</span>
              </span>
            </div>

            {/* Metropol */}
            <div className="h-11 rounded-lg px-3 py-1 flex items-center justify-center bg-white border border-[#9C7A3F]/20">
              <span className="text-xs font-black text-[#0A2540]">
                metropol<span className="text-[#FF5A00]">card</span>
              </span>
            </div>

            {/* Setcard */}
            <div className="h-11 rounded-lg px-3 py-1 flex items-center justify-center bg-white border border-[#9C7A3F]/20">
              <span className="text-xs font-black text-[#E6332A]">
                SET<span className="text-[#1A1A1A]">CARD</span>
              </span>
            </div>

            {/* Pluxee */}
            <div className="h-11 rounded-lg px-3 py-1 flex items-center justify-center bg-[#2B2620] border border-[#2B2620]">
              <span className="text-xs font-black text-[#00EB5E]">pluxee</span>
            </div>

            {/* Ticket */}
            <div className="h-11 rounded-lg px-3 py-1 flex items-center justify-center bg-white border border-[#9C7A3F]/20">
              <span className="text-[11px] font-black text-[#ED1C24]">Ticket</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="ottoman-divider max-w-sm mx-auto mb-6"></div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-start">
          <p
            className="text-[#7A7364] text-xs font-medium"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            © 2026 Cihangir Ev Yemekleri & Pide. Tüm hakları saklıdır.
          </p>
          <p className="text-[#7A7364] text-[10px] tracking-widest uppercase flex items-center gap-1">
            Tasarım ve Geliştirme:
            <span className="text-[#9C7A3F] font-bold">Hamed Mohamed</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
