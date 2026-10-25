import React, { Suspense } from "react";
import type { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const titles: Record<string, string> = {
    tr: "Cihangir Ev Yemekleri & Taş Fırın Pide | Ana Sayfa",
    en: "Cihangir Home Kitchen & Stone Oven Pide | Home",
    ar: "جيهانغير للمطبخ البيتي وبيدة الفرن الحجري | الرئيسية",
    de: "Cihangir Hausküche & Steinofenpide | Startseite",
    fr: "Cihangir Cuisine Maison & Pide au Four | Accueil",
    ru: "Cihangir Домашняя Кухня & Пиде | Главная",
    es: "Cihangir Cocina Casera & Pide | Inicio",
    it: "Cihangir Cucina Casalinga & Pide | Home",
    zh: "贾汉吉尔家常菜 & 石炉皮得 | 首页",
    fa: "آشپزخانه خانگی جیهانگیر و پیده | صفحه اصلی",
  };

  const descriptions: Record<string, string> = {
    tr: "Cihangir'in kalbinde geleneksel ev yemekleri ve taş fırından çıkan sıcak pide çeşitleri. Beyoğlu, İstanbul.",
    en: "Authentic Turkish home-cooked meals and stone-oven pide in the heart of Cihangir, Beyoğlu, Istanbul.",
    ar: "أطباق المطبخ البيتي التركي الأصيل وبيدة الفرن الحجري في قلب جيهانغير، بيوغلو، إسطنبول.",
    de: "Traditionelle türkische Hausmannskost und Steinofenpide im Herzen von Cihangir, Beyoğlu, Istanbul.",
    fr: "Cuisine familiale turque traditionnelle et pide au four en pierre au cœur de Cihangir, Beyoğlu, Istanbul.",
    ru: "Традиционная турецкая домашняя кухня и пиде из каменной печи в сердце Джихангира, Бейоглу, Стамбул.",
    es: "Cocina casera turca tradicional y pide al horno de piedra en el corazón de Cihangir, Beyoğlu, Estambul.",
    it: "Cucina casalinga turca tradizionale e pide dal forno a pietra nel cuore di Cihangir, Beyoğlu, Istanbul.",
    zh: "伊斯坦布尔贾汉吉尔正宗土耳其家常菜和石炉皮得。",
    fa: "غذاهای خانگی سنتی ترکی و پیده از فر سنگی در قلب جیهانگیر، بیوغلو، استانبول.",
  };

  const title = titles[locale] ?? titles.tr;
  const description = descriptions[locale] ?? descriptions.tr;
  const canonicalUrl = `https://cihangir-ev-yemkleri.vercel.app/${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [
          l,
          `https://cihangir-ev-yemkleri.vercel.app/${l}`,
        ])
      ),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Cihangir Ev Yemekleri & Pide",
      locale: locale,
      type: "website",
      images: [
        {
          url: "https://cihangir-ev-yemkleri.vercel.app/splash/logo-original.webp",
          width: 800,
          alt: "Cihangir Ev Yemekleri & Pide",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://cihangir-ev-yemkleri.vercel.app/splash/logo-original.webp"],
    },
  };
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
  const isRtl = locale === "ar" || locale === "fa";

  const heroTitles: Record<string, string> = {
    tr: "Cihangir Ev Yemekleri & Taş Fırın Pide",
    en: "Cihangir Home Kitchen & Stone Oven Pide",
    ar: "جيهانغير للمطبخ البيتي وبيدة الفرن الحجري",
    fa: "آشپزخانه خانگی جیهانگیر و پیده تنوری",
    de: "Cihangir Hausküche & Steinofenpide",
    fr: "Cihangir Cuisine Maison & Pide au Four",
    ru: "Cihangir Домашняя Кухня & Пиде",
    es: "Cihangir Cocina Casera & Pide al Horno",
    it: "Cihangir Cucina Casalinga & Pide",
    zh: "贾汉吉尔家常菜 & 石炉皮得",
  };

  const heroBadges: Record<string, string> = {
    tr: "Cihangir'in Kalbinde Geleneksel Tatlar",
    en: "Traditional Flavors in the Heart of Cihangir",
    ar: "نكهات أصيلة في قلب جيهانغير",
    fa: "طعم‌های اصیل در قلب جیهانگیر",
    de: "Traditionelle Aromen im Herzen von Cihangir",
    fr: "Saveurs Traditionnelles au Cœur de Cihangir",
    ru: "Традиционные Вкусы в Сердце Джихангира",
    es: "Sabores Tradicionales en el Corazón de Cihangir",
    it: "Sapori Tradizionali nel Cuore di Cihangir",
    zh: "贾汉吉尔核心地带的正宗风味",
  };

  const heroTitle = heroTitles[locale] ?? heroTitles.tr;
  const heroBadge = heroBadges[locale] ?? heroBadges.tr;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg)" }}>
      {/* Top Header matching Kardeşler design */}
      <Header locale={locale} dict={dict} />

      {/* Dynamic Hero Cover (Food on right for LTR, Food on left for RTL) */}
      <section className={`hero-cover ${isRtl ? "hero-cover-rtl" : "hero-cover-ltr"}`}>
        {/* Contrast Overlay tailored for LTR / RTL text positioning */}
        <div
          className={isRtl ? "hero-overlay-rtl" : "hero-overlay-ltr"}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1140px",
            width: "100%",
            margin: "0 auto",
            padding: "64px 20px",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              textAlign: isRtl ? "right" : "left",
            }}
          >
            {/* Ottoman Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "30px",
                backgroundColor: "rgba(156, 122, 63, 0.28)",
                border: "1px solid rgba(156, 122, 63, 0.65)",
                color: "#F7E3B5",
                fontSize: "13px",
                fontWeight: 700,
                marginBottom: "20px",
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              <OttomanSeal size={18} />
              <span>{heroBadge}</span>
            </div>

            {/* Main H1 Title */}
            <h1
              style={{
                fontSize: "clamp(28px, 4.2vw, 42px)",
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 1.25,
                fontFamily: "var(--font-cairo)",
                marginBottom: "16px",
                textShadow: "0 2px 12px rgba(0,0,0,0.7)",
              }}
            >
              {heroTitle}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "16px",
                color: "rgba(255, 255, 255, 0.92)",
                lineHeight: 1.65,
                maxWidth: "540px",
                marginBottom: "24px",
                textShadow: "0 1px 6px rgba(0,0,0,0.8)",
              }}
            >
              {dict.subtitle || "Geleneksel Türk mutfağının seçkin tencere yemekleri, sıcacık çorbalar ve taş fırından yeni çıkmış çıtır pideler."}
            </p>

            {/* Feature tags */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "28px",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#EAE3D2",
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(6px)",
                }}
              >
                🍲 {isRtl ? "أطباق يومية طازجة" : "Günlük Taze Ev Yemekleri"}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#EAE3D2",
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(6px)",
                }}
              >
                🔥 {isRtl ? "بيدة الفرن الحجري" : "Taş Fırın Pide"}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#EAE3D2",
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(6px)",
                }}
              >
                📍 {isRtl ? "جيهانغير، بيوغلو" : "Cihangir, Beyoğlu"}
              </span>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link
                href={`/${locale}/menu`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 30px",
                  borderRadius: "var(--radius-btn)",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "15px",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  transition: "transform 0.15s ease, background-color 0.15s ease",
                }}
              >
                <span>{dict.heroCta || "Menüyü Keşfet"}</span>
                <span>{isRtl ? "←" : "→"}</span>
              </Link>
              <a
                href="tel:+902122513696"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 26px",
                  borderRadius: "var(--radius-btn)",
                  border: "1.5px solid rgba(255, 255, 255, 0.45)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "15px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
                }}
              >
                <span>📞</span>
                <span>{dict.callNow || "Hemen Ara"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <main style={{ maxWidth: "1024px", margin: "0 auto", padding: "36px 16px", width: "100%", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-cairo)" }}>
              {dict.signatureDishes || "Öne Çıkan Lezzetlerimiz"}
            </h2>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              {dict.subtitle?.split(".")[0] || "Günlük taze tencere yemekleri ve taş fırın çeşitleri"}
            </p>
          </div>
          <Link
            href={`/${locale}/menu`}
            style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)" }}
          >
            {dict.allMenuCta || "Tüm Menü"} →
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
