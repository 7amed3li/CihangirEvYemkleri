"use client";

import React from "react";
import { useCurrency } from "@/context/CurrencyContext";

interface PriceDisplayProps {
  priceTRY: number | string;
  originalPriceTRY?: number | string | null;
  className?: string;
}

export default function PriceDisplay({
  priceTRY,
  originalPriceTRY,
  className,
}: PriceDisplayProps) {
  const { convertPrice, getCurrencySymbol, currency } = useCurrency();

  const formattedCurrent = convertPrice(priceTRY);
  const formattedOriginal = originalPriceTRY
    ? convertPrice(originalPriceTRY)
    : null;
  const symbol = getCurrencySymbol();

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: "6px",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span style={{ fontWeight: 800, fontSize: "1.15em", color: "#253D2C" }}>
        {currency !== "TRY" ? `≈ ${formattedCurrent}` : formattedCurrent} {symbol}
      </span>
      {formattedOriginal && (
        <span
          style={{
            textDecoration: "line-through",
            color: "#76816E",
            fontSize: "0.85em",
          }}
        >
          {currency !== "TRY" ? `≈ ${formattedOriginal}` : formattedOriginal} {symbol}
        </span>
      )}
      {currency !== "TRY" && (
        <span style={{ fontSize: "0.75em", color: "#C64C32", fontWeight: 700 }}>
          ({priceTRY} ₺ Esas Fiyat)
        </span>
      )}
    </div>
  );
}
