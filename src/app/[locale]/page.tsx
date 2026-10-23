import React, { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PriceDisplay from "@/components/PriceDisplay";
import { OttomanSeal, StoneOven, CookingPot } from "@/components/BrandIcons";
import { getDictionary, SUPPORTED_LOCALES } from "@/i18n/translations";
import { prisma } from "@/lib/db/prisma";

export const revalidate = 0;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

async function FeaturedDishes({ locale }: { locale: string }) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        translations: { where: { locale } },
        category: {
          include: { translations: { where: { locale } } },
        },
      },
      take: 6,
      orderBy: { orderIndex: "asc" },
    });

    if (products.length === 0) {
      return (
        <div className="flat-card" style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
          <p style={{ fontWeight: 600 }}>Henüz ürün eklenmedi.</p>
        </div>
      );
    }

    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {products.map((prod) => {
          const name = prod.translations[0]?.name || prod.slug;
          const desc = prod.translations[0]?.description || "";
          const isPide = prod.category?.slug.includes("pide");

          return (
            <div
              key={prod.id}
              className="flat-card food-card-hover"
              style={{
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "var(--accent)" }}>
                      {isPide ? <StoneOven size={18} /> : <CookingPot size={18} />}
                    </span>
                    <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-cairo)" }}>
                      {name}
                    </h4>
                  </div>
                </div>
                {desc && (
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "14px" }}>
                    {desc}
                  </p>
                )}
              </div>

              <div style={{ borderTop: "1px solid rgba(156, 122, 63, 0.2)", paddingTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <PriceDisplay priceTRY={prod.basePriceTRY.toString()} />
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>
                  Taze Günlük
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  } catch (err) {
    return (
      <div className="flat-card" style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)" }}>
        Ürünler yükleniyor...
      </div>
    );
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg)" }}>
      {/* Top Header matching Kardeşler design */}
      <Header locale={locale} dict={dict} />

      {/* Hero Section with Ottoman Marble styling */}
      <section
        style={{
          padding: "48px 16px 40px",
          textAlign: "center",
          background: "linear-gradient(180deg, #EDE3CE 0%, #F7F2E7 100%)",
          borderBottom: "1px solid rgba(156, 122, 63, 0.2)",
        }}
      >
        <div style={{ maxWidth: "768px", margin: "0 auto" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "20px",
              backgroundColor: "rgba(78, 95, 76, 0.12)",
              color: "var(--primary)",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            <OttomanSeal size={18} />
            <span>Cihangir'in Kalbinde Geleneksel Tatlar</span>
          </div>

          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 36px)",
              fontWeight: 900,
              color: "var(--text)",
              lineHeight: 1.25,
              fontFamily: "var(--font-cairo)",
              marginBottom: "16px",
            }}
          >
            Ev Yemekleri & Taş Fırın Pide
          </h2>

          <p
            style={{
              fontSize: "15px",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              maxWidth: "600px",
              margin: "0 auto 28px",
            }}
          >
            {dict.subtitle || "Geleneksel Türk mutfağının seçkin tencere yemekleri, sıcacık çorbalar ve taş fırından yeni çıkmış çıtır pideler."}
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
            <Link
              href={`/${locale}/menu`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 28px",
                borderRadius: "var(--radius-btn)",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
                boxShadow: "0 4px 14px rgba(78, 95, 76, 0.25)",
              }}
            >
              <span>{dict.menu || "Menüyü Gör"}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <main style={{ maxWidth: "1024px", margin: "0 auto", padding: "36px 16px", width: "100%", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-cairo)" }}>
              Öne Çıkan Lezzetlerimiz
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Günlük taze çıkan tencere yemekleri ve taş fırın çeşitleri
            </p>
          </div>
          <Link
            href={`/${locale}/menu`}
            style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)" }}
          >
            Tüm Menü →
          </Link>
        </div>

        <Suspense fallback={<div style={{ textAlign: "center", padding: "20px" }}>Yükleniyor...</div>}>
          <FeaturedDishes locale={locale} />
        </Suspense>
      </main>

      {/* Footer matching Kardesler Ottoman design */}
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
