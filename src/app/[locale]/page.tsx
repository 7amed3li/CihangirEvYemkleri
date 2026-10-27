import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SofraHome from "@/components/SofraHome";
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
  const canonicalUrl = `https://cihangirevyemekler.com.tr/${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [
          l,
          `https://cihangirevyemekler.com.tr/${l}`,
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
          url: "https://cihangirevyemekler.com.tr/splash/logo-original.webp",
          width: 800,
          alt: "Cihangir Ev Yemekleri & Pide",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://cihangirevyemekler.com.tr/splash/logo-original.webp"],
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
          className="group rounded-2xl bg-[#FFFAF0] border border-[#253D2C]/14 hover:border-[#253D2C]/35 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between text-start"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Dish Image / Icon Banner */}
          <div className="relative w-full h-44 sm:h-48 bg-[#F6F1E7] overflow-hidden flex items-center justify-center border-b border-[#253D2C]/12">
            {dish.image ? (
              <Image
                src={dish.image}
                alt={dish.turkishTitle}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="text-[#596752]/60 flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                {dish.isPide ? <StoneOven size={44} /> : <CookingPot size={44} />}
                <span className="text-[11px] font-bold text-[#76816E] tracking-wide uppercase">
                  {dish.isPide ? "Taş Fırın" : "Ev Yemeği"}
                </span>
              </div>
            )}

            {/* Daily Fresh Tag */}
            <div className="absolute top-2.5 start-2.5 z-10">
              <span className="px-2.5 py-1 bg-[#354D37] text-[#FFFFFF] text-[10px] font-bold rounded-md shadow-xs uppercase tracking-wide">
                {locale === "ar" ? "طازج يومياً" : locale === "en" ? "Fresh Daily" : "Günlük Taze"}
              </span>
            </div>
          </div>

          {/* Dish Content */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3
                  className="text-base sm:text-lg font-bold text-[#253D2C] group-hover:text-[#C64C32] transition-colors line-clamp-1"
                  style={{ fontFamily: "var(--font-cairo)" }}
                >
                  {dish.turkishTitle}
                </h3>
              </div>

              {locale !== "tr" && dish.localizedName && dish.localizedName !== dish.turkishTitle && (
                <p className="text-xs font-semibold text-[#596752] mb-2 line-clamp-1">
                  {dish.localizedName}
                </p>
              )}

              {dish.desc && (
                <p className="text-xs text-[#76816E] leading-relaxed line-clamp-2 mb-4">
                  {dish.desc}
                </p>
              )}
            </div>

            {/* Bottom: Price & Detail Action */}
            <div className="pt-3 border-t border-[#253D2C]/12 flex items-center justify-between">
              <PriceDisplay priceTRY={dish.price} />
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#596752] group-hover:translate-x-1 transition-transform">
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
    <div className="min-h-screen flex flex-col bg-[#F6F1E7] text-[#253D2C]">
      {/* Schema.org Structured Data */}
      <RestaurantJsonLd locale={locale} />

      {/* Top Header */}
      <Header locale={locale} dict={dict} />

      <SofraHome locale={locale} />

      {/* Footer */}
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
