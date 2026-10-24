"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { DEFAULT_FALLBACK_RATES } from "@/app/api/rates/route";
import { DISH_TRANSLATIONS } from "@/data/dishTranslations";

export type CurrencyCode = "TRY" | "USD" | "EUR" | "GBP" | "RUB" | "SAR";

interface RateInfo {
  symbol: string;
  rate: number;
}

export interface CartItem {
  id: string;
  name?: string;
  priceTRY: number;
  image?: string;
  qty: number;
}

interface AppContextType {
  lang: string;
  currency: CurrencyCode;
  changeCurrency: (c: CurrencyCode) => void;
  convertPrice: (priceInTRY: number | string | null | undefined) => string | null;
  getCurrencySymbol: () => string;
  cart: CartItem[];
  addToCart: (item: { id: string; name?: string; price: number; image?: string }) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
  cartCount: number;
  cartTotalTRY: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  rates: Record<CurrencyCode, RateInfo>;
  ratesSource: string;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY_CURRENCY = "cihangir_currency";
const STORAGE_KEY_CART = "cihangir_cart";
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export function AppProvider({
  children,
  initialLocale = "tr",
}: {
  children: React.ReactNode;
  initialLocale?: string;
}) {
  const [lang] = useState(initialLocale);
  const [currency, setCurrency] = useState<CurrencyCode>("TRY");
  const [rates, setRates] = useState<Record<CurrencyCode, RateInfo>>(
    DEFAULT_FALLBACK_RATES.rates as Record<CurrencyCode, RateInfo>
  );
  const [ratesSource, setRatesSource] = useState<string>("fallback");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch exchange rates
  const fetchRates = useCallback(async () => {
    try {
      const res = await fetch("/api/rates");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.rates) {
        setRates(data.rates);
        setRatesSource(data.source || "api");
      }
    } catch (err) {
      console.warn("Using fallback rates:", err);
    }
  }, []);

  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem(STORAGE_KEY_CURRENCY) as CurrencyCode;
      if (savedCurrency && ["TRY", "USD", "EUR", "GBP", "RUB", "SAR"].includes(savedCurrency)) {
        setCurrency(savedCurrency);
      }
      const savedCart = localStorage.getItem(STORAGE_KEY_CART);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          const sanitized = parsed.map((i: any) => ({
            ...i,
            name: DISH_TRANSLATIONS[i.id]?.name?.tr || i.name || i.id,
          }));
          setCart(sanitized);
        }
      }
    } catch (_) {}

    fetchRates();
    const interval = setInterval(fetchRates, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchRates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch (_) {}
  }, [cart]);

  const changeCurrency = (c: CurrencyCode) => {
    setCurrency(c);
    try {
      localStorage.setItem(STORAGE_KEY_CURRENCY, c);
    } catch (_) {}
  };

  const convertPrice = useCallback(
    (priceInTRY: number | string | null | undefined): string | null => {
      if (priceInTRY == null) return null;
      const num = typeof priceInTRY === "string" ? parseFloat(priceInTRY) : priceInTRY;
      if (isNaN(num)) return null;

      const rateData = rates[currency] || DEFAULT_FALLBACK_RATES.rates[currency];
      const rate = rateData?.rate ?? 1;
      return (num * rate).toFixed(2);
    },
    [currency, rates]
  );

  const getCurrencySymbol = useCallback((): string => {
    const rateData = rates[currency] || DEFAULT_FALLBACK_RATES.rates[currency];
    return rateData?.symbol ?? "₺";
  }, [currency, rates]);

  const addToCart = useCallback(
    (item: { id: string; name?: string; price: number; image?: string }) => {
      if (item.price == null) return;
      // Rule: Name in the cart must ALWAYS be in Turkish
      const turkishName =
        DISH_TRANSLATIONS[item.id]?.name?.tr ||
        item.name ||
        item.id;

      setCart((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + 1 } : i
          );
        }
        return [
          ...prev,
          {
            id: item.id,
            name: turkishName,
            priceTRY: item.price,
            image: item.image,
            qty: 1,
          },
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (!existing) return prev;
      if (existing.qty <= 1) {
        return prev.filter((i) => i.id !== itemId);
      }
      return prev.map((i) =>
        i.id === itemId ? { ...i, qty: i.qty - 1 } : i
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getItemQuantity = useCallback(
    (itemId: string) => {
      return cart.find((i) => i.id === itemId)?.qty || 0;
    },
    [cart]
  );

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotalTRY = cart.reduce((sum, i) => sum + i.priceTRY * i.qty, 0);

  return (
    <AppContext.Provider
      value={{
        lang,
        currency,
        changeCurrency,
        convertPrice,
        getCurrencySymbol,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getItemQuantity,
        cartCount,
        cartTotalTRY,
        isCartOpen,
        setIsCartOpen,
        rates,
        ratesSource,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return ctx;
}
