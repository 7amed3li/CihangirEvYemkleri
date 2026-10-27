"use client";

import React from "react";
import * as Flags from "country-flag-icons/react/3x2";

/**
 * Renders a proper SVG country flag from the `country-flag-icons` library.
 * Pass an ISO 3166-1 alpha-2 country code (e.g. "TR", "SA", "GB").
 */
interface FlagIconProps {
  country: string; // ISO 3166-1 alpha-2 code (uppercase or lowercase)
  size?: number;
  className?: string;
}

export default function FlagIcon({ country, size = 18, className = "" }: FlagIconProps) {
  const code = country.toUpperCase() as keyof typeof Flags;
  const FlagComponent = Flags[code] as React.ComponentType<{ width: number; height: number; className?: string }> | undefined;

  if (!FlagComponent) {
    // Fallback: globe using a simple SVG
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#D5CFBC"
        strokeWidth="1.5"
        className={`shrink-0 ${className}`}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10A15 15 0 0 1 8 12 15 15 0 0 1 12 2z" />
      </svg>
    );
  }

  return (
    <span
      className={`inline-flex items-center overflow-hidden shrink-0 ${className}`}
      style={{
        width: size * 1.4,
        height: size,
        borderRadius: "3px",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
      }}
    >
      <FlagComponent width={size * 1.4} height={size} className="w-full h-full object-cover" />
    </span>
  );
}
