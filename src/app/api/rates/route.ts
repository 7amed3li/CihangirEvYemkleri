import { NextResponse } from "next/server";

// Server-side cached exchange rate proxy.
// Fetches from the internet AT MOST once every 12 hours.
// All other requests are served instantly from in-memory cache.
let cachedRates: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

const cacheHeaders = {
  "Cache-Control": "public, max-age=0, s-maxage=43200, stale-while-revalidate=43200",
};

export const LEGAL_CURRENCY_DISCLAIMER = {
  tr: "Menüdeki tüm döviz karşılıkları yalnızca anlık yaklaşık bilgilendirme amaçlıdır. Yasal ve bağlayıcı hesaplama masada sadece Türk Lirası (₺) üzerinden tahsil edilir.",
  en: "All foreign currency amounts are purely approximate indicative estimates. Legally binding bills and payments are settled strictly in Turkish Lira (₺).",
  ar: "جميع الأسعار بالعملات الأجنبية هي أسعار تقريبية إرشادية فقط. الحساب الرسمي والملزم قانونياً يُدفع حصراً بالليرة التركية (₺) في المطعم.",
  ru: "Все цены в иностранной валюте являются ориентировочными. Официальный и юридически обязательный расчет производится строго в турецких лирах (₺).",
};

export const DEFAULT_FALLBACK_RATES = {
  rates: {
    TRY: { symbol: "₺", rate: 1 },
    USD: { symbol: "$", rate: 0.0201 },
    EUR: { symbol: "€", rate: 0.018 },
    GBP: { symbol: "£", rate: 0.0151 },
    RUB: { symbol: "₽", rate: 1.62 },
    SAR: { symbol: "ر.س", rate: 0.0752 },
  },
  source: "fallback",
  isLive: false,
  disclaimer: LEGAL_CURRENCY_DISCLAIMER,
  lastUpdated: new Date().toISOString().split("T")[0],
  fetchedAt: new Date().toISOString(),
};

export async function GET() {
  const now = Date.now();

  // Return cached rates if still fresh
  if (cachedRates && now - cacheTimestamp < CACHE_DURATION_MS) {
    const remainingMs = CACHE_DURATION_MS - (now - cacheTimestamp);
    return NextResponse.json(
      {
        ...cachedRates,
        cached: true,
        isLive: true,
        disclaimer: LEGAL_CURRENCY_DISCLAIMER,
        nextRefreshIn: `${Math.round(remainingMs / 1000 / 60)} دقيقة / ${(remainingMs / 1000 / 60 / 60).toFixed(1)}h`,
        nextRefreshInMs: Math.round(remainingMs),
      },
      { headers: cacheHeaders }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch("https://api.exchangerate-api.com/v4/latest/TRY", {
      cache: "no-store",
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!res.ok) throw new Error(`API responded with ${res.status}`);

    const data = await res.json();

    cachedRates = {
      rates: {
        TRY: { symbol: "₺", rate: 1 },
        USD: { symbol: "$", rate: data.rates?.USD || 0.0201 },
        EUR: { symbol: "€", rate: data.rates?.EUR || 0.018 },
        GBP: { symbol: "£", rate: data.rates?.GBP || 0.0151 },
        RUB: { symbol: "₽", rate: data.rates?.RUB || 1.62 },
        SAR: {
          symbol: "ر.س",
          rate: data.rates?.SAR || (data.rates?.USD ? Number((data.rates.USD * 3.75).toFixed(5)) : 0.0752),
        },
      },
      source: "exchangerate-api.com",
      isLive: true,
      disclaimer: LEGAL_CURRENCY_DISCLAIMER,
      lastUpdated: data.date || new Date().toISOString().split("T")[0],
      fetchedAt: new Date().toISOString(),
    };
    cacheTimestamp = now;

    return NextResponse.json({ ...cachedRates, cached: false }, { headers: cacheHeaders });
  } catch (error) {
    const fallback = cachedRates || DEFAULT_FALLBACK_RATES;
    return NextResponse.json(
      {
        ...fallback,
        cached: Boolean(cachedRates),
        isLive: false,
        warning: "Live rates temporarily unavailable. Using approximate fallback.",
        disclaimer: LEGAL_CURRENCY_DISCLAIMER,
        error: error instanceof Error ? error.message : "Fetch failed",
      },
      { headers: cacheHeaders }
    );
  }
}
