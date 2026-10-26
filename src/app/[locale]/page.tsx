import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PriceDisplay from "@/components/PriceDisplay";
import { OttomanSeal, StoneOven, CookingPot, OttomanStar } from "@/components/BrandIcons";
import {
  MapPin,
  PhoneCall,
  ArrowRight,
  ArrowLeft,
  Truck,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  BookOpen,
} from "lucide-react";
import { getDictionary, SUPPORTED_LOCALES } from "@/i18n/translations";
import { prisma } from "@/lib/db/prisma";
import RestaurantJsonLd from "@/components/RestaurantJsonLd";
import { menuData } from "@/data/menuData";
import { getDishDisplay } from "@/data/dishTranslations";
import { RESTAURANT_CONFIG } from "@/data/restaurantConfig";

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
  let displayItems: {
    id: string;
    turkishTitle: string;
    localizedName: string;
    desc: string;
    price: number | string;
    image?: string;
    isPide: boolean;
  }[] = [];

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        translations: { where: { locale: { in: [locale, "tr"] } } },
        category: {
          include: { translations: { where: { locale } } },
        },
      },
      take: 6,
      orderBy: { orderIndex: "asc" },
    });

    if (products.length > 0) {
      displayItems = products.map((prod) => {
        const trans = prod.translations.find((t) => t.locale === locale);
        const trTrans = prod.translations.find((t) => t.locale === "tr");
        const turkishTitle = trTrans?.name || prod.slug;
        const localizedName = trans?.name || turkishTitle;

        return {
          id: prod.slug || prod.id,
          turkishTitle,
          localizedName,
          desc: trans?.description || "",
          price: prod.basePriceTRY.toString(),
          image: prod.imageUrl || undefined,
          isPide: Boolean(prod.category?.slug.includes("pide")),
        };
      });
    }
  } catch (err) {
    // Graceful fallback to static menuData below
  }

  // Fallback to signature dishes from verified menuData
  if (displayItems.length === 0) {
    const signatureDishes = menuData
      .flatMap((c) => c.items)
      .filter((i) => i.tags?.includes("signature") || i.trending)
      .slice(0, 6);

    displayItems = signatureDishes.map((item) => {
      const { turkishTitle, localizedName, localizedDesc } = getDishDisplay(item, locale);
      return {
        id: item.id,
        turkishTitle,
        localizedName,
        desc: localizedDesc || "",
        price: item.price,
        image: item.image,
        isPide: item.id.includes("pide"),
      };
    });
  }

  const isRtl = locale === "ar" || locale === "fa";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {displayItems.map((dish) => (
        <Link
          key={dish.id}
          href={`/${locale}/dish/${dish.id}`}
          className="group rounded-2xl bg-[#F7F2E7] border border-[#9C7A3F]/25 hover:border-[#9C7A3F]/60 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between text-start"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Dish Image / Icon Banner */}
          <div className="relative w-full h-44 sm:h-48 bg-[#EDE3CE] overflow-hidden flex items-center justify-center border-b border-[#9C7A3F]/20">
            {dish.image ? (
              <Image
                src={dish.image}
                alt={dish.turkishTitle}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="text-[#9C7A3F]/60 flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                {dish.isPide ? <StoneOven size={44} /> : <CookingPot size={44} />}
                <span className="text-[11px] font-bold text-[#7A7364] tracking-wide uppercase">
                  {dish.isPide ? "Taş Fırın" : "Ev Yemeği"}
                </span>
              </div>
            )}

            {/* Daily Fresh Tag */}
            <div className="absolute top-2.5 start-2.5 z-10">
              <span className="px-2.5 py-1 bg-[#4E5F4C] text-[#FFFFFF] text-[10px] font-bold rounded-md shadow-xs uppercase tracking-wide">
                {locale === "ar" ? "طازج يومياً" : locale === "en" ? "Fresh Daily" : "Günlük Taze"}
              </span>
            </div>
          </div>

          {/* Dish Content */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3
                  className="text-base sm:text-lg font-bold text-[#2B2620] group-hover:text-[#9C7A3F] transition-colors line-clamp-1"
                  style={{ fontFamily: "var(--font-cairo)" }}
                >
                  {dish.turkishTitle}
                </h3>
              </div>

              {locale !== "tr" && dish.localizedName && dish.localizedName !== dish.turkishTitle && (
                <p className="text-xs font-semibold text-[#5A5344] mb-2 line-clamp-1">
                  {dish.localizedName}
                </p>
              )}

              {dish.desc && (
                <p className="text-xs text-[#7A7364] leading-relaxed line-clamp-2 mb-4">
                  {dish.desc}
                </p>
              )}
            </div>

            {/* Bottom: Price & Detail Action */}
            <div className="pt-3 border-t border-[#9C7A3F]/20 flex items-center justify-between">
              <PriceDisplay priceTRY={dish.price} />
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#9C7A3F] group-hover:translate-x-1 transition-transform">
                <span>{locale === "ar" ? "التفاصيل" : locale === "en" ? "Details" : "Detaylar"}</span>
                {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
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

  const featureCards = [
    {
      title: locale === "ar" ? "فرن حجري تقليدي" : locale === "en" ? "Stone Oven Pide" : "Geleneksel Taş Fırın",
      desc:
        locale === "ar"
          ? "فطائر بيدة طازجة مقرمشة تُخبز فور طلبكم على نار الحجر الأصيل."
          : locale === "en"
          ? "Crispy artisan pide rolled and stone-baked fresh to your order."
          : "Siparişinizle taze açılıp taş fırında pişen sıcacık çıtır pideler.",
      icon: <StoneOven size={26} />,
    },
    {
      title: locale === "ar" ? "طبخ بيتي يومي طازج" : locale === "en" ? "Daily Home Stews" : "Günlük Taze Tencere",
      desc:
        locale === "ar"
          ? "يخنات وطواجن تركية عريقة وشوربات ساخنة تُطهى كل صباح بكل حب."
          : locale === "en"
          ? "Slow-simmered Turkish home stews and warm soups prepared daily."
          : "Her sabah sevgiyle kaynayan sulu ev yemekleri ve taze çorbalar.",
      icon: <CookingPot size={26} />,
    },
    {
      title: locale === "ar" ? "توصيل بيوغلو وجيهانغير" : locale === "en" ? "Local Beyoğlu Delivery" : "Hızlı Yerel Teslimat",
      desc:
        locale === "ar"
          ? "توصيل سريع ساخن ومحكم لجميع شوارع جيهانغير ومحيط بيوغلو."
          : locale === "en"
          ? "Fast, piping-hot delivery across Cihangir & central Beyoğlu."
          : "Cihangir ve Beyoğlu çevresine sıcacık paket servis veya gel-al.",
      icon: <Truck size={26} />,
    },
    {
      title: locale === "ar" ? "مكونات نقية وطبيعية" : locale === "en" ? "Finest Halal Ingredients" : "Özenli & Helal Malzeme",
      desc:
        locale === "ar"
          ? "سمن طبيعي، خضروات طازجة يومية، ولحوم حلال طازجة وموثوقة."
          : locale === "en"
          ? "Natural butter, fresh seasonal vegetables, and trusted halal meats."
          : "Doğal tereyağı, taze sebzeler ve güvenilir yerel kasaplardan etler.",
      icon: <Sparkles size={26} />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#EDE3CE] text-[#2B2620]">
      {/* Schema.org Structured Data */}
      <RestaurantJsonLd locale={locale} />

      {/* Top Header */}
      <Header locale={locale} dict={dict} />

      {/* Hero Section */}
      <section className={`relative hero-cover ${isRtl ? "hero-cover-rtl" : "hero-cover-ltr"}`}>
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

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-28 flex justify-start">
          <div className={`max-w-2xl ${isRtl ? "text-right" : "text-left"}`}>
            {/* Ottoman Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9C7A3F]/35 border border-[#9C7A3F]/70 text-[#F7E3B5] text-xs sm:text-sm font-bold mb-5 backdrop-blur-md shadow-md">
              <OttomanSeal size={18} />
              <span>{heroBadge}</span>
            </div>

            {/* Main H1 Title */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4"
              style={{
                fontFamily: "var(--font-cairo)",
                textShadow: "0 2px 14px rgba(0,0,0,0.75)",
              }}
            >
              {heroTitle}
            </h1>

            {/* Subtitle */}
            <p
              className="text-base sm:text-lg text-white/95 leading-relaxed max-w-xl mb-7 font-medium"
              style={{
                fontFamily: isRtl ? "var(--font-cairo)" : "var(--font-inter)",
                textShadow: "0 1px 6px rgba(0,0,0,0.8)",
              }}
            >
              {dict.subtitle ||
                "Geleneksel Türk mutfağının seçkin tencere yemekleri, sıcacık çorbalar ve taş fırından yeni çıkmış çıtır pideler."}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#EDE3CE] bg-black/40 border border-[#EDE3CE]/20 backdrop-blur-md">
                <CookingPot size={15} className="text-[#F7E3B5]" />
                <span>{isRtl ? "أطباق يومية طازجة" : "Günlük Taze Ev Yemekleri"}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#EDE3CE] bg-black/40 border border-[#EDE3CE]/20 backdrop-blur-md">
                <StoneOven size={15} className="text-[#F7E3B5]" />
                <span>{isRtl ? "بيدة الفرن الحجري" : "Taş Fırın Pide"}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#EDE3CE] bg-black/40 border border-[#EDE3CE]/20 backdrop-blur-md">
                <MapPin size={15} className="text-[#F7E3B5]" />
                <span>{isRtl ? "جيهانغير، بيوغلو" : "Cihangir, Beyoğlu"}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3.5">
              <Link
                href={`/${locale}/menu`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#4E5F4C] hover:bg-[#3D4B3B] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border border-white/20"
              >
                <span>{dict.heroCta || "Menüyü Keşfet"}</span>
                {isRtl ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
              </Link>

              <a
                href={`tel:${RESTAURANT_CONFIG.phone.tel}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-black/35 hover:bg-black/50 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/40 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <PhoneCall size={17} className="text-[#F7E3B5]" />
                <span>{dict.callNow || "Hemen Ara"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Value Pillars */}
      <section className="bg-[#FAF7F0] border-y border-[#9C7A3F]/25 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featureCards.map((feat, idx) => (
              <div
                key={idx}
                className="bg-[#F7F2E7] border border-[#9C7A3F]/25 rounded-2xl p-5 shadow-2xs hover:shadow-sm hover:border-[#9C7A3F]/60 transition-all duration-200 text-start flex flex-col justify-between"
                dir={isRtl ? "rtl" : "ltr"}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#EDE3CE] border border-[#9C7A3F]/30 flex items-center justify-center text-[#9C7A3F] mb-3.5">
                    {feat.icon}
                  </div>
                  <h3
                    className="text-base font-bold text-[#2B2620] mb-1.5"
                    style={{ fontFamily: "var(--font-cairo)" }}
                  >
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#7A7364] leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Signature Dishes Showcase */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 text-start">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9C7A3F] uppercase tracking-widest mb-1.5">
              <OttomanStar size={14} />
              <span>{locale === "ar" ? "أطباقنا المميزة" : locale === "en" ? "Chef's Recommendations" : "Şefin İmzası"}</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-black text-[#2B2620]"
              style={{ fontFamily: "var(--font-cairo)" }}
            >
              {dict.signatureDishes || "Öne Çıkan Lezzetlerimiz"}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7364] mt-1 font-medium">
              {locale === "ar"
                ? "طواجن لحم طازجة، بيدة بالفرن الحجري، ومأكولات منزلية يومية أصيلة."
                : locale === "en"
                ? "Authentic slow-simmered stews, stone-oven pides, and traditional daily specials."
                : "Günlük taze tencere yemekleri ve taş fırından sıcak çıkan çıtır lezzetler."}
            </p>
          </div>

          <Link
            href={`/${locale}/menu`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#4E5F4C] hover:text-[#3D4B3B] transition-colors py-1 group"
          >
            <span>{dict.allMenuCta || "Tüm Menüyü İncele"}</span>
            {isRtl ? (
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            )}
          </Link>
        </div>

        <Suspense fallback={<div className="text-center py-20 text-[#7A7364]">Yükleniyor...</div>}>
          <FeaturedDishes locale={locale} />
        </Suspense>
      </main>

      {/* Restaurant Hours & Visit Card */}
      <section className="bg-[#F7F2E7] border-t border-[#9C7A3F]/30 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-[#FAF7F0] border-2 border-[#9C7A3F]/35 rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8 text-start" dir={isRtl ? "rtl" : "ltr"}>
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4E5F4C]/15 text-[#4E5F4C] text-xs font-bold uppercase tracking-wider mb-3">
                <MapPin size={14} />
                <span>{locale === "ar" ? "موقعنا في جيهانغير" : locale === "en" ? "Visit Our Restaurant" : "Restoranımıza Bekleriz"}</span>
              </span>
              <h2
                className="text-2xl sm:text-3xl font-black text-[#2B2620] mb-3"
                style={{ fontFamily: "var(--font-cairo)" }}
              >
                {locale === "ar"
                  ? "تفضل بزيارتنا في قلب جيهانغير، بيوغلو"
                  : locale === "en"
                  ? "Taste Authentic Turkish Hospitality in Cihangir"
                  : "Cihangir'in Kalbinde Sıcak Bir Sofra"}
              </h2>
              <p className="text-xs sm:text-sm text-[#7A7364] leading-relaxed mb-5">
                {RESTAURANT_CONFIG.address.street}, {RESTAURANT_CONFIG.address.district} / {RESTAURANT_CONFIG.address.city}
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#5A5344]">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#9C7A3F]" />
                  <span>{locale === "ar" ? "يومياً: 08:30 - 22:30" : "Her gün: 08:30 - 22:30"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#4E5F4C]" />
                  <span>{locale === "ar" ? "لحوم حلال 100%" : "%100 Helal Et & Malzeme"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <a
                href={RESTAURANT_CONFIG.address.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FAF7F0] border-2 border-[#9C7A3F] text-[#2B2620] hover:bg-[#EDE3CE] font-bold text-xs sm:text-sm transition-all shadow-xs"
              >
                <MapPin size={17} className="text-[#9C7A3F]" />
                <span>{locale === "ar" ? "افتح خرائط Google" : locale === "en" ? "Open Google Maps" : "Google Haritalar"}</span>
              </a>

              <a
                href={`tel:${RESTAURANT_CONFIG.phone.tel}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#4E5F4C] hover:bg-[#3D4B3B] text-white font-bold text-xs sm:text-sm transition-all shadow-md"
              >
                <PhoneCall size={17} />
                <span>{locale === "ar" ? "اتصل للطلب" : locale === "en" ? "Call to Order" : "Telefonla Sipariş"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
