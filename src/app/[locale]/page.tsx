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
import { buildPageMetadata } from "@/lib/seo";
import { menuData } from "@/data/menuData";
import { getDishDisplay } from "@/data/dishTranslations";
import { RESTAURANT_CONFIG } from "@/data/restaurantConfig";

export const revalidate = 0;

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

const HOME_DESCRIPTIONS: Record<string, string> = {
  tr: "Anne şefkatiyle pişen taze tencere yemekleri, fırından yeni çıkmış çıtır pideler ve Cihangir'in en samimi esnaf sofrası. Beyoğlu'nda evinizin sıcaklığı.",
  en: "Fresh home-cooked stews made with love, oven-fresh crispy pides, and Cihangir's warmest neighborhood table. The comforting taste of home in Beyoğlu, Istanbul.",
  ar: "أطباق بيتيّة يومية طازجة تفيض بدفء البيت، وفطائر بيدة مقرمشة وشهية من قلب جيهانغير. كرم الضيافة وأصالة المائدة في بيوغلو، إسطنبول.",
  de: "Täglich frisch zubereitete Hausmannskost mit Liebe gekocht, ofenfrische knusprige Pide und Cihangirs herzlichste Nachbarschaftstafel. Beyoğlu, Istanbul.",
  fr: "Plats mijotés maison préparés avec amour, pides chauds et croustillants et l'atmosphère chaleureuse de Cihangir. La vraie saveur du fait maison à Beyoğlu, Istanbul.",
  ru: "Домашняя турецкая кухня, приготовленная с душой, горячие хрустящие пиде и самое уютное гостеприимство Джихангира. Бейоглу, Стамбул.",
  es: "Guisos caseros preparados con amor, pides recién horneados y crujientes, y la calidez del barrio de Cihangir. El sabor de casa en Beyoğlu, Estambul.",
  it: "Cucina casalinga tradizionale preparata con passione, pide appena sfornato e la calda accoglienza di Cihangir. Il sapore di casa a Beyoğlu, Istanbul.",
  zh: "每日用心熬煮的温暖家常热菜、新鲜出炉的香脆皮得，以及贾汉吉尔街区最真诚热情的待客之道。贝伊奥卢，伊斯坦布尔。",
  fa: "خوراک‌های خانگی روزانه با عشق، پیده‌های تازه و ترد، و گرمای صمیمی سفره محلی در قلب جیهانگیر، بیوغلو، استانبول.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const titles: Record<string, string> = {
    tr: "Cihangir Ev Yemekleri & Pide | Ana Sayfa",
    en: "Cihangir Home Kitchen & Pide | Home",
    ar: "جيهانغير للمطبخ البيتي وفطائر البيدة | الرئيسية",
    de: "Cihangir Hausküche & Pide | Startseite",
    fr: "Cihangir Cuisine Maison & Pide | Accueil",
    ru: "Cihangir Домашняя Кухня & Пиде | Главная",
    es: "Cihangir Cocina Casera & Pide | Inicio",
    it: "Cihangir Cucina Casalinga & Pide | Home",
    zh: "贾汉吉尔家常菜 & 皮得 | 首页",
    fa: "آشپزخانه خانگی جیهانگیر و پیده | صفحه اصلی",
  };

  const descriptions = HOME_DESCRIPTIONS;

  const title = titles[locale] ?? titles.tr;
  const description = descriptions[locale] ?? descriptions.tr;
  return buildPageMetadata({ locale, path: "", title, description });
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
                  {dish.isPide ? "Pide" : "Ev Yemeği"}
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
    tr: "Cihangir Ev Yemekleri & Pide",
    en: "Cihangir Home Kitchen & Pide",
    ar: "جيهانغير للمطبخ البيتي وفطائر البيدة",
    fa: "آشپزخانه خانگی جیهانگیر و پیده",
    de: "Cihangir Hausküche & Pide",
    fr: "Cihangir Cuisine Maison & Pide",
    ru: "Cihangir Домашняя Кухня & Пиде",
    es: "Cihangir Cocina Casera & Pide",
    it: "Cihangir Cucina Casalinga & Pide",
    zh: "贾汉吉尔家常菜 & 皮得",
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
      <RestaurantJsonLd locale={locale} description={HOME_DESCRIPTIONS[locale] ?? HOME_DESCRIPTIONS.tr} />

      {/* Top Header */}
      <Header locale={locale} dict={dict} />

      <SofraHome locale={locale} />

      {/* Footer */}
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
