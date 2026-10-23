"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SUPPORTED_LOCALES, Locale } from "@/i18n/translations";

const LOCALE_NAMES: Record<Locale, string> = {
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
    // Replace current locale segment in pathname
    const segments = pathname.split("/").filter(Boolean);
    if (SUPPORTED_LOCALES.includes(segments[0] as Locale)) {
      segments[0] = locale;
    } else {
      segments.unshift(locale);
    }
    router.push(`/${segments.join("/")}`);
  };

  const currentLabel = LOCALE_NAMES[currentLocale as Locale] || "Türkçe";

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Current Language: ${currentLabel}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid rgba(78, 95, 76, 0.4)",
          background: "#F7F2E7",
          color: "#2B2620",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <span>🌐</span>
        <span>{currentLabel}</span>
        <span style={{ fontSize: "9px", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            width: "160px",
            maxHeight: "320px",
            overflowY: "auto",
            background: "#F7F2E7",
            border: "1px solid rgba(78, 95, 76, 0.3)",
            borderRadius: "6px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 100,
            padding: "4px",
          }}
        >
          {SUPPORTED_LOCALES.map((loc) => {
            const isSelected = currentLocale === loc;
            return (
              <button
                key={loc}
                onClick={() => handleSelect(loc)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  border: "none",
                  background: isSelected ? "#4E5F4C" : "transparent",
                  color: isSelected ? "#ffffff" : "#2B2620",
                  fontSize: "12px",
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span>{LOCALE_NAMES[loc]}</span>
                {isSelected && <span>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
