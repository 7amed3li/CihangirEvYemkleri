"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCurrency, CurrencyCode } from "@/context/CurrencyContext";

const CURRENCIES: {
  code: CurrencyCode;
  label: string;
  symbol: string;
  flag: string;
}[] = [
  { code: "TRY", label: "Türk Lirası", symbol: "₺", flag: "🇹🇷" },
  { code: "USD", label: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", label: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", label: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "SAR", label: "ريال سعودي", symbol: "ر.س", flag: "🇸🇦" },
  { code: "RUB", label: "Рубль", symbol: "₽", flag: "🇷🇺" },
];

export default function CurrencySwitcher() {
  const { currency, changeCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

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

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Currency: ${currency}`}
        className="flex items-center gap-1 sm:gap-1.5 h-9 px-2 sm:px-2.5 rounded-lg border border-[#9C7A3F]/40 bg-[#F7F2E7] hover:bg-[#EDE3CE] text-[#2B2620] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
      >
        <span className="text-sm sm:text-base leading-none select-none">{currentObj.flag}</span>
        <span className="font-bold text-[#9C7A3F]">{currentObj.symbol}</span>
        <span className="font-semibold text-[#2B2620] text-[11px] sm:text-xs">{currentObj.code}</span>
        <span
          className={`text-[8px] text-[#7A7364] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] end-0 w-44 bg-[#F7F2E7] border border-[#9C7A3F]/35 rounded-xl shadow-xl z-50 p-1.5 backdrop-blur-md">
          <div className="px-2 py-1 text-[10px] font-bold text-[#9C7A3F] uppercase tracking-wider border-b border-[#9C7A3F]/20 mb-1 flex items-center justify-between">
            <span>Döviz / Currency</span>
            <span className="text-[9px] font-normal text-[#7A7364]">Canlı Kur</span>
          </div>

          <div className="flex flex-col gap-0.5">
            {CURRENCIES.map((c) => {
              const isSelected = currency === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    changeCurrency(c.code);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-start ${
                    isSelected
                      ? "bg-[#9C7A3F] text-[#FFFFFF] font-bold shadow-xs"
                      : "hover:bg-[#EDE3CE] text-[#2B2620]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{c.flag}</span>
                    <span>{c.code}</span>
                    <span
                      className={`text-[11px] ${
                        isSelected ? "text-[#EDE3CE]" : "text-[#7A7364]"
                      }`}
                    >
                      ({c.symbol})
                    </span>
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
