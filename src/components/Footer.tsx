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

  const getMapTitle = () => {
    switch (locale) {
      case "ar":
        return "الخريطة والموقع";
      case "fa":
        return "نقشه و موقعیت";
      case "en":
        return "Location & Map";
      case "ru":
        return "Карта и адрес";
      case "fr":
        return "Carte & Emplacement";
      case "de":
        return "Standort & Karte";
      case "it":
        return "Mappa e Posizione";
      case "es":
        return "Ubicación y Mapa";
      case "zh":
        return "地图与地址";
      default:
        return "Harita ve Ulaşım";
    }
  };

  const getDirectionsLabel = () => {
    switch (locale) {
      case "ar":
        return "فتح في خرائط جوجل";
      case "fa":
        return "مسیریابی با گوگل مپ";
      case "en":
        return "Open in Google Maps";
      case "ru":
        return "Открыть в Google Maps";
      case "fr":
        return "Ouvrir dans Google Maps";
      case "de":
        return "In Google Maps öffnen";
      case "it":
        return "Apri in Google Maps";
      case "es":
        return "Abrir en Google Maps";
      case "zh":
        return "在谷歌地图中打开";
      default:
        return "Google Haritalar'da Aç";
    }
  };

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
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#596752]">
                <OttomanSeal size={28} />
              </span>
              <h2
                className="text-2xl sm:text-3xl font-black text-[#253D2C] tracking-wide"
                style={{ fontFamily: "var(--font-cairo)" }}
              >
                Cihangir
              </h2>
            </div>
            <p
              className="text-[#C64C32] text-xs font-semibold tracking-[0.25em] uppercase mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Ev Yemekleri & Pide
            </p>
            <p
              className="text-[#76816E] text-xs sm:text-sm font-normal leading-relaxed max-w-xs"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {dict?.subtitle ||
                "Cihangir'in kalbinde, geleneksel ev yemekleri ve taş fırın pide lezzetleri."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start text-start w-full">
            <h3 className="text-xs sm:text-sm font-bold text-[#C64C32] tracking-widest uppercase mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C64C32]"></span>
              <span>{dict?.quickLinks || (isRtl ? "روابط سريعة" : "Hızlı Bağlantılar")}</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-[#76816E] hover:text-[#253D2C] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#596752]">›</span>
                  <span>{dict?.home || (isRtl ? "الرئيسية" : "Ana Sayfa")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/menu`}
                  className="text-[#76816E] hover:text-[#253D2C] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#596752]">›</span>
                  <span>{dict?.menu || (isRtl ? "قائمة الطعام" : "Menü")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-[#76816E] hover:text-[#253D2C] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#596752]">›</span>
                  <span>{isRtl ? "عن المطعم" : locale === "en" ? "About Us" : "Hakkımızda"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/delivery`}
                  className="text-[#76816E] hover:text-[#253D2C] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#596752]">›</span>
                  <span>{isRtl ? "التوصيل والاستلام" : locale === "en" ? "Delivery & Pick-up" : "Teslimat & Gel-Al"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/allergens`}
                  className="text-[#76816E] hover:text-[#253D2C] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#596752]">›</span>
                  <span>{isRtl ? "دليل الحساسية" : locale === "en" ? "Allergens" : "Alerjen Bilgisi"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/faq`}
                  className="text-[#76816E] hover:text-[#253D2C] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#596752]">›</span>
                  <span>{isRtl ? "الأسئلة الشائعة" : locale === "en" ? "FAQ" : "Sıkça Sorulanlar"}</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-[#76816E] hover:text-[#253D2C] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[#596752]">›</span>
                  <span>{isRtl ? "تواصل معنا والموقع" : locale === "en" ? "Contact & Location" : "İletişim & Konum"}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="flex flex-col items-start text-start w-full">
            <h3 className="text-xs sm:text-sm font-bold text-[#C64C32] tracking-widest uppercase mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C64C32]"></span>
              <span>{dict?.contact || (isRtl ? "التواصل والموقع" : "İletişim & Konum")}</span>
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
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Firuzağa, Firuzağa Camii Sk. No:1 A, 34425 Beyoğlu / İstanbul
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
                {dict?.hours || "Her gün: 08:30 - 22:30"}
              </p>
            </div>
            <a
              href="tel:+902122513696"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#354D37] text-[#E4EADB] hover:bg-[#293F30] transition-colors font-bold text-xs sm:text-sm shadow-xs"
            >
              <span>{isRtl ? "اتصال هاتفي مباشر" : "Doğrudan Telefonla Arayın"}</span>
            </a>
          </div>

          {/* Interactive Google Map Preview Card */}
          <div className="flex flex-col items-start text-start w-full">
            <h3 className="text-xs sm:text-sm font-bold text-[#C64C32] tracking-widest uppercase mb-4 sm:mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C64C32]"></span>
              <span>{getMapTitle()}</span>
            </h3>
            
            <div className="w-full rounded-xl overflow-hidden border border-[#253D2C]/20 shadow-xs bg-[#F6F1E7] relative group">
              <iframe
                title="Cihangir Ev Yemekleri & Pide Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.8437998399587!2d28.981881676579626!3d41.03204907134707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab764fa6a1249%3A0x8e8fa65fecae72f2!2zRmnJtnV6YcSfYSwgRmnJtnV6YcSfYSBDYW1paSBTay4gTm86MSBBLCAzNDQyNSBCZXlvxJ9sdS_EsHN0YW5idWwsIFTDvHJraXll!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
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
              href="https://maps.google.com/?q=Firuza%C4%9Fa,+Firuza%C4%9Fa+Camii+Sk.+No:1+A,+34425+Beyo%C4%9Flu/%C4%B0stanbul"
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
              <span>{getDirectionsLabel()}</span>
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
              style={{ fontFamily: "var(--font-inter)" }}
            >
              © 2026 Cihangir Ev Yemekleri & Pide. Tüm hakları saklıdır.
            </p>
            {/* Policy Links */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#596752]">
              <Link href={`/${locale}/terms`} className="hover:underline">
                {isRtl ? "شروط الاستخدام" : locale === "en" ? "Terms" : "Kullanım Koşulları"}
              </Link>
              <span>•</span>
              <Link href={`/${locale}/privacy`} className="hover:underline">
                {isRtl ? "سياسة الخصوصية" : locale === "en" ? "Privacy Policy" : "Gizlilik"}
              </Link>
              <span>•</span>
              <Link href={`/${locale}/cancellation`} className="hover:underline">
                {isRtl ? "سياسة الإلغاء" : locale === "en" ? "Cancellation" : "İptal ve İade"}
              </Link>
            </div>
          </div>
          <p className="text-[#76816E] text-[10px] tracking-widest uppercase flex items-center gap-1">
            Tasarım ve Geliştirme:
            <span className="text-[#596752] font-bold">Hamed Mohamed</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
