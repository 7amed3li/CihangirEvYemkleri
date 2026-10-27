"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SUPPORTED_LOCALES, Locale } from "@/i18n/translations";
import FlagIcon from "./FlagIcon";

export const LOCALE_NAMES: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
  ru: "Русский",
  fa: "فارسی",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  es: "Español",
  zh: "中文",
};

export const LOCALE_SHORT_CODES: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  ar: "AR",
  ru: "RU",
  fa: "FA",
  fr: "FR",
  de: "DE",
  it: "IT",
  es: "ES",
  zh: "ZH",
};

// ISO 3166-1 alpha-2 country codes for each locale
const LOCALE_FLAG_CODES: Record<Locale, string> = {
  tr: "TR",
  en: "GB",
  ar: "SA",
  ru: "RU",
  fa: "IR",
  fr: "FR",
  de: "DE",
  it: "IT",
  es: "ES",
  zh: "CN",
};

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (locale: Locale) => {
    setIsOpen(false);
    const segments = pathname.split("/").filter(Boolean);
    if (SUPPORTED_LOCALES.includes(segments[0] as Locale)) {
      segments[0] = locale;
    } else {
      segments.unshift(locale);
    }
    router.push(`/${segments.join("/")}`);
  };

  const activeLocale = (currentLocale as Locale) || "tr";
  const currentLabel = LOCALE_NAMES[activeLocale] || "Türkçe";
  const currentShort = LOCALE_SHORT_CODES[activeLocale] || "TR";
  const currentFlagCode = LOCALE_FLAG_CODES[activeLocale] || "TR";

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Language: ${currentLabel}`}
        className="flex items-center gap-1.5 h-9 px-2 sm:px-2.5 rounded-lg border border-[#354D37]/35 bg-[#FFFAF0] hover:bg-[#F6F1E7] text-[#253D2C] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
      >
        <FlagIcon country={currentFlagCode} size={16} />
        <span className="hidden sm:inline font-medium">{currentLabel}</span>
        <span className="inline sm:hidden font-bold text-[11px] text-[#354D37]">{currentShort}</span>
        <span
          className={`text-[8px] text-[#596752] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] end-0 w-44 max-h-72 overflow-y-auto bg-[#FFFAF0] border border-[#354D37]/30 rounded-xl shadow-xl z-50 p-1.5">
          <div className="px-2 py-1 text-[10px] font-bold text-[#354D37] uppercase tracking-wider border-b border-[#354D37]/15 mb-1 flex items-center justify-between">
            <span>Diller / Languages</span>
            <span className="text-[9px] font-normal text-[#76816E]">10 Dil</span>
          </div>

          <div className="flex flex-col gap-0.5">
            {SUPPORTED_LOCALES.map((loc) => {
              const isSelected = activeLocale === loc;
              const flagCode = LOCALE_FLAG_CODES[loc];
              const label = LOCALE_NAMES[loc];

              return (
                <button
                  key={loc}
                  onClick={() => handleSelect(loc)}
                  className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-start ${
                    isSelected
                      ? "bg-[#354D37] text-[#FFFFFF] font-bold"
                      : "hover:bg-[#F6F1E7] text-[#253D2C]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FlagIcon country={flagCode} size={15} />
                    <span>{label}</span>
                  </div>
                  {isSelected && <span className="text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
