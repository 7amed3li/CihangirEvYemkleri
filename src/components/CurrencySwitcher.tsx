"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCurrency, CurrencyCode } from "@/context/CurrencyContext";

const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: "TRY", label: "Türk Lirası", symbol: "₺" },
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "SAR", label: "ريال سعودي", symbol: "ر.س" },
  { code: "RUB", label: "Российский рубль", symbol: "₽" },
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
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Current Currency: ${currency}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid rgba(156, 122, 63, 0.4)",
          background: "#F7F2E7",
          color: "#2B2620",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <span style={{ color: "#9C7A3F", fontWeight: 700 }}>{currentObj.symbol}</span>
        <span>{currency}</span>
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
            background: "#F7F2E7",
            border: "1px solid rgba(156, 122, 63, 0.3)",
            borderRadius: "6px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 100,
            padding: "4px",
          }}
        >
          <div
            style={{
              padding: "6px 8px",
              fontSize: "10px",
              fontWeight: 700,
              color: "#9C7A3F",
              borderBottom: "1px solid rgba(156, 122, 63, 0.2)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Döviz / Currency
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "4px" }}>
            {CURRENCIES.map((c) => {
              const isSelected = currency === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    changeCurrency(c.code);
                    setIsOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 8px",
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
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "18px",
                        height: "18px",
                        borderRadius: "3px",
                        background: isSelected ? "rgba(255,255,255,0.2)" : "#EDE3CE",
                        color: isSelected ? "#ffffff" : "#9C7A3F",
                        fontSize: "10px",
                        fontWeight: 700,
                      }}
                    >
                      {c.symbol}
                    </span>
                    <span>{c.code}</span>
                  </span>
                  {isSelected && <span style={{ fontSize: "11px" }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
