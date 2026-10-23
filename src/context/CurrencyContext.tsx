"use client";

import React from "react";
import { useAppContext, CurrencyCode } from "@/context/AppContext";

export type { CurrencyCode };

/**
 * CurrencyProvider is kept for backwards compatibility in root layout,
 * delegating all currency state to the unified single source of truth in AppProvider.
 */
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/**
 * Hook to access the unified single source of truth for display currency and exchange rates.
 */
export function useCurrency() {
  const app = useAppContext();
  return {
    currency: app.currency,
    changeCurrency: app.changeCurrency,
    convertPrice: app.convertPrice,
    getCurrencySymbol: app.getCurrencySymbol,
    rates: app.rates,
    ratesSource: app.ratesSource,
  };
}
