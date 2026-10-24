"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CurrencySwitcher from "./CurrencySwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import { MenuIcon, HomeIcon, BookOpenIcon, PhoneIcon } from "./BrandIcons";

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
    <header className="sticky top-0 z-40 w-full bg-[#F7F2E7] border-b-2 border-[#9C7A3F]/35 shadow-xs">
      <div className="max-w-5xl mx-auto px-2.5 sm:px-4 md:px-6 h-16 flex items-center justify-between gap-2">
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
              priority
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className="text-sm sm:text-base md:text-lg font-black text-[#2B2620] leading-none tracking-tight truncate group-hover:text-[#9C7A3F] transition-colors"
              style={{ fontFamily: "var(--font-cairo), sans-serif" }}
            >
              Cihangir
            </span>
            <span className="text-[8px] sm:text-[9.5px] font-bold text-[#9C7A3F] uppercase tracking-wider truncate mt-0.5 sm:mt-1">
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
              className={`w-9 h-9 flex items-center justify-center rounded-lg border text-[#2B2620] transition-colors cursor-pointer shadow-2xs ${
                isMenuOpen
                  ? "border-[#9C7A3F] bg-[#9C7A3F]/15 text-[#9C7A3F]"
                  : "border-[#9C7A3F]/35 bg-[#F7F2E7] hover:bg-[#EDE3CE]"
              }`}
              aria-label="Navigation Menu"
            >
              <MenuIcon size={19} />
            </button>

            {isMenuOpen && (
              <div className="absolute top-[calc(100%+6px)] end-0 w-52 rounded-xl bg-[#F7F2E7] border border-[#9C7A3F]/30 shadow-xl overflow-hidden z-50 p-1.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                <Link
                  href={`/${locale}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#2B2620] hover:bg-[#EDE3CE] transition-colors"
                >
                  <span className="text-[#4E5F4C]">
                    <HomeIcon size={18} />
                  </span>
                  <span>{dict.home || "Ana Sayfa"}</span>
                </Link>

                <Link
                  href={`/${locale}/menu`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#2B2620] hover:bg-[#EDE3CE] transition-colors"
                >
                  <span className="text-[#4E5F4C]">
                    <BookOpenIcon size={18} />
                  </span>
                  <span>{dict.menu || "Menü"}</span>
                </Link>

                <div className="h-px bg-[#9C7A3F]/20 my-1" />

                <a
                  href="tel:+902122513696"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-[#9C7A3F] hover:bg-[#EDE3CE] transition-colors"
                >
                  <PhoneIcon size={16} />
                  <span>{dict.contact || "İletişim & Sipariş"}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
