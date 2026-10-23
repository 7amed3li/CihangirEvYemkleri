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
      <span style={{ fontWeight: 800, fontSize: "1.15em", color: "#2B2620" }}>
        {formattedCurrent} {symbol}
      </span>
      {formattedOriginal && (
        <span
          style={{
            textDecoration: "line-through",
            color: "#7A7364",
            fontSize: "0.85em",
          }}
        >
          {formattedOriginal} {symbol}
        </span>
      )}
      {currency !== "TRY" && (
        <span style={{ fontSize: "0.75em", color: "#9C7A3F" }}>
          (≈ {priceTRY} ₺)
        </span>
      )}
    </div>
  );
}
