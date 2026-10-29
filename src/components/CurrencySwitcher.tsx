"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCurrency, CurrencyCode } from "@/context/CurrencyContext";
import FlagIcon from "./FlagIcon";

const CURRENCIES: {
  code: CurrencyCode;
  label: string;
  symbol: string;
  country: string;
}[] = [
  { code: "TRY", label: "Türk Lirası", symbol: "₺", country: "tr" },
  { code: "USD", label: "US Dollar", symbol: "$", country: "us" },
  { code: "EUR", label: "Euro", symbol: "€", country: "eu" },
  { code: "GBP", label: "British Pound", symbol: "£", country: "gb" },
  { code: "SAR", label: "ريال سعودي", symbol: "ر.س", country: "sa" },
  { code: "RUB", label: "Рубль", symbol: "₽", country: "ru" },
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
        className="flex items-center gap-1.5 h-9 px-2 sm:px-2.5 rounded-lg border border-[#253D2C]/24 bg-[#FFFAF0] hover:bg-[#F6F1E7] text-[#253D2C] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
      >
        <FlagIcon country={currentObj.country} size={17} />
        <span className="font-bold text-[#596752]">{currentObj.symbol}</span>
        <span className="hidden sm:inline font-semibold text-[#253D2C] text-xs">{currentObj.code}</span>
        <span
          className={`text-[8px] text-[#76816E] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] end-0 w-44 bg-[#FFFAF0] border border-[#253D2C]/20 rounded-xl shadow-xl z-50 p-1.5 backdrop-blur-md">
          <div className="px-2 py-1 text-[10px] font-bold text-[#C64C32] uppercase tracking-wider border-b border-[#253D2C]/12 mb-1 flex items-center justify-between">
            <span>Döviz / Currency</span>
            <span className="text-[9px] font-normal text-[#76816E]">Tahmini / Est.</span>
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
                      ? "bg-[#C64C32] text-[#FFFFFF] font-bold shadow-xs"
                      : "hover:bg-[#F6F1E7] text-[#253D2C]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FlagIcon country={c.country} size={16} />
                    <span>{c.code}</span>
                    <span
                      className={`text-[11px] ${
                        isSelected ? "text-[#F6F1E7]" : "text-[#76816E]"
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

          <div className="mt-1 pt-1.5 border-t border-[#253D2C]/10 px-1 text-[9px] text-[#76816E] leading-tight text-center">
            <span>Kurlar tahmini göstergedir. Yasal hesap ve ödeme masada <strong>Türk Lirası (₺)</strong> iledir.</span>
          </div>
        </div>
      )}
    </div>
  );
}
