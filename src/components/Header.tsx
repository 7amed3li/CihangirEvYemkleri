"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CurrencySwitcher from "./CurrencySwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import { MenuIcon, HomeIcon, BookOpenIcon, PhoneIcon } from "./BrandIcons";
import { Info, Truck, Wheat, HelpCircle, MapPin } from "lucide-react";

interface HeaderProps {
  locale: string;
  dict: Record<string, any>;
}

export default function Header({ locale, dict }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F0] border-b border-[#B8381E]/20 shadow-xs">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-4 md:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink group select-none"
        >
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center">
            <Image
              src="/splash/logo-original.webp"
              alt="Cihangir Ev Yemekleri Pide"
              fill
              sizes="(max-width: 640px) 36px, 44px"
              priority
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className="text-sm sm:text-base md:text-lg font-black text-[#261E1A] leading-none tracking-tight truncate group-hover:text-[#B8381E] transition-colors"
              style={{ fontFamily: "var(--font-cairo), sans-serif" }}
            >
              Cihangir
            </span>
            <span className="text-[8px] sm:text-[9.5px] font-bold text-[#C87D17] uppercase tracking-wider truncate mt-0.5 sm:mt-1">
              Ev Yemekleri & Pide
            </span>
          </div>
        </Link>

        {/* Right Controls: Currency, Language & Navigation Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <CurrencySwitcher />
          <LanguageSwitcher currentLocale={locale} />

          {/* Navigation Drawer Menu Button */}
          <div className="relative inline-block" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border text-[#261E1A] transition-colors cursor-pointer shadow-2xs ${
                isMenuOpen
                  ? "border-[#B8381E] bg-[#B8381E]/10 text-[#B8381E]"
                  : "border-[#B8381E]/25 bg-[#FFFFFF] hover:bg-[#FAF7F0]"
              }`}
              aria-label="Navigation Menu"
            >
              <MenuIcon size={19} />
            </button>

            {isMenuOpen && (
              <div className="absolute top-[calc(100%+6px)] end-0 w-64 rounded-2xl bg-[#FFFFFF] border border-[#B8381E]/20 shadow-2xl overflow-hidden z-50 p-2.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 text-start">
                <nav className="flex flex-col space-y-1">
                  {[
                    {
                      href: `/${locale}`,
                      icon: <HomeIcon size={16} />,
                      label: {
                        tr: "Ana Sayfa",
                        en: "Home",
                        ar: "الرئيسية",
                        ru: "Главная",
                        fa: "صفحه اصلی",
                        fr: "Accueil",
                        de: "Startseite",
                        it: "Home",
                        es: "Inicio",
                        zh: "首页",
                      }[locale] || "Ana Sayfa",
                    },
                    {
                      href: `/${locale}/menu`,
                      icon: <BookOpenIcon size={16} />,
                      label: {
                        tr: "Menü",
                        en: "Full Menu",
                        ar: "قائمة الطعام",
                        ru: "Полное меню",
                        fa: "منوی کامل",
                        fr: "Menu complet",
                        de: "Speisekarte",
                        it: "Menu completo",
                        es: "Menú completo",
                        zh: "完整菜单",
                      }[locale] || "Menü",
                    },
                    {
                      href: `/${locale}/about`,
                      icon: <Info size={16} />,
                      label: {
                        tr: "Hakkımızda",
                        en: "About Us",
                        ar: "عن المطعم",
                        ru: "О нас",
                        fa: "درباره ما",
                        fr: "À propos",
                        de: "Über uns",
                        it: "Chi siamo",
                        es: "Sobre nosotros",
                        zh: "关于我们",
                      }[locale] || "Hakkımızda",
                    },
                    {
                      href: `/${locale}/delivery`,
                      icon: <Truck size={16} />,
                      label: {
                        tr: "Teslimat & Gel-Al",
                        en: "Delivery & Takeaway",
                        ar: "التوصيل والاستلام",
                        ru: "Доставка и самовывоз",
                        fa: "ارسال و تحویل حضوری",
                        fr: "Livraison & À emporter",
                        de: "Lieferung & Abholung",
                        it: "Consegna e asporto",
                        es: "Entrega y para llevar",
                        zh: "外送与自取",
                      }[locale] || "Teslimat & Gel-Al",
                    },
                    {
                      href: `/${locale}/allergens`,
                      icon: <Wheat size={16} />,
                      label: {
                        tr: "Alerjen Bilgisi",
                        en: "Allergen Guide",
                        ar: "دليل الحساسية",
                        ru: "Информация об аллергенах",
                        fa: "راهنمای آلرژی",
                        fr: "Guide des allergènes",
                        de: "Allergenhinweise",
                        it: "Informazioni allergeni",
                        es: "Guía de alérgenos",
                        zh: "过敏原指南",
                      }[locale] || "Alerjen Bilgisi",
                    },
                    {
                      href: `/${locale}/faq`,
                      icon: <HelpCircle size={16} />,
                      label: {
                        tr: "Sıkça Sorulanlar",
                        en: "FAQ",
                        ar: "الأسئلة الشائعة",
                        ru: "Частые вопросы",
                        fa: "سوالات متداول",
                        fr: "Questions fréquentes",
                        de: "Häufige Fragen",
                        it: "Domande frequenti",
                        es: "Preguntas frecuentes",
                        zh: "常见问题",
                      }[locale] || "Sıkça Sorulanlar",
                    },
                    {
                      href: `/${locale}/contact`,
                      icon: <MapPin size={16} />,
                      label: {
                        tr: "İletişim & Konum",
                        en: "Contact & Location",
                        ar: "التواصل والموقع",
                        ru: "Контакты и адрес",
                        fa: "تماس و موقعیت",
                        fr: "Contact & Localisation",
                        de: "Kontakt & Anfahrt",
                        it: "Contatti e posizione",
                        es: "Contacto y ubicación",
                        zh: "联系与地址",
                      }[locale] || "İletişim & Konum",
                    },
                  ].map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-semibold text-[#261E1A] hover:bg-[#FAF7F0] transition-colors"
                    >
                      <span className="w-7 h-7 rounded-lg bg-[#B8381E]/10 text-[#B8381E] flex items-center justify-center shrink-0 group-hover:bg-[#B8381E] group-hover:text-white transition-colors">
                        {item.icon}
                      </span>
                      <span className="truncate group-hover:text-[#B8381E] transition-colors">{item.label}</span>
                    </Link>
                  ))}

                  <div className="h-px bg-[#B8381E]/15 my-1.5" />

                  <a
                    href="tel:+902122513696"
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#B8381E] text-white hover:bg-[#992E17] transition-all shadow-sm active:scale-[0.98]"
                  >
                    <PhoneIcon size={15} />
                    <span>
                      {{
                        tr: "Ara: 0212 251 36 96",
                        en: "Call: 0212 251 36 96",
                        ar: "اتصال مباشر: 251 36 96",
                        ru: "Позвонить: 0212 251 36 96",
                        fa: "تماس تلفنی: 0212 251 36 96",
                        fr: "Appeler: 0212 251 36 96",
                        de: "Anrufen: 0212 251 36 96",
                        it: "Chiama: 0212 251 36 96",
                        es: "Llamar: 0212 251 36 96",
                        zh: "电话点餐: 0212 251 36 96",
                      }[locale] || "Ara: 0212 251 36 96"}
                    </span>
                  </a>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
