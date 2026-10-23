import { NextResponse } from "next/server";

// Server-side cached exchange rate proxy adapted from Kardeşler
// 5 minutes in-memory caching + stale-while-revalidate headers
let cachedRates: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const cacheHeaders = {
  "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=300",
};

export const DEFAULT_FALLBACK_RATES = {
  rates: {
    TRY: { symbol: "₺", rate: 1 },
    USD: { symbol: "$", rate: 0.02121 },
    EUR: { symbol: "€", rate: 0.01855 },
    GBP: { symbol: "£", rate: 0.01579 },
    RUB: { symbol: "₽", rate: 2.65 },
    SAR: { symbol: "ر.س", rate: 0.0795 },
  },
  source: "fallback",
  lastUpdated: new Date().toISOString().split("T")[0],
  fetchedAt: new Date().toISOString(),
};

export async function GET() {
  const now = Date.now();

  // Return cached rates if fresh
  if (cachedRates && now - cacheTimestamp < CACHE_DURATION_MS) {
    return NextResponse.json(
      {
        ...cachedRates,
        cached: true,
        nextUpdate: Math.round((CACHE_DURATION_MS - (now - cacheTimestamp)) / 1000),
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
        USD: { symbol: "$", rate: data.rates?.USD || 0.02121 },
        EUR: { symbol: "€", rate: data.rates?.EUR || 0.01855 },
        GBP: { symbol: "£", rate: data.rates?.GBP || 0.01579 },
        RUB: { symbol: "₽", rate: 2.65 },
        SAR: {
          symbol: "ر.س",
          rate: data.rates?.SAR || (data.rates?.USD ? Number((data.rates.USD * 3.75).toFixed(5)) : 0.0795),
        },
      },
      source: "exchangerate-api.com",
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
        cached: true,
        error: error instanceof Error ? error.message : "Fetch failed",
      },
      { headers: cacheHeaders }
    );
  }
}
