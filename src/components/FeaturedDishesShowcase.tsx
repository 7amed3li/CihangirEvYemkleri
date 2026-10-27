"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { menuData } from "@/data/menuData";
import { CookingPot, StoneOven } from "./BrandIcons";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import DishModal from "./DishModal";

interface FeaturedDish {
  id: string;
  badge: {
    tr: string;
    en: string;
    ar: string;
    ru?: string;
    fa?: string;
    fr?: string;
    de?: string;
    it?: string;
    es?: string;
    zh?: string;
  };
  image?: string;
  color: string;
}

const featuredDishes: FeaturedDish[] = [
  {
    id: "asci-tabagi",
    color: "#C64C32",
    badge: { tr: "ŞEFİN SEÇİMİ", en: "CHEF'S SPECIAL", ar: "اختيار الشيف" },
  },
  {
    id: "kavurma",
    color: "#354D37",
    badge: { tr: "EN ÇOK SATAN", en: "BEST SELLER", ar: "الأكثر طلباً" },
  },
  {
    id: "karisik-pide",
    color: "#A8683B",
    badge: { tr: "TAŞ FIRIN", en: "STONE OVEN", ar: "فرن حجري" },
  },
  {
    id: "et-sote",
    color: "#354D37",
    badge: { tr: "EN ÇOK SATAN", en: "BEST SELLER", ar: "الأكثر طلباً" },
  },
  {
    id: "karniyarik",
    color: "#4F7A45",
    badge: { tr: "GELENEKSEL", en: "TRADITIONAL", ar: "تقليدي أصيل" },
  },
  {
    id: "ezogelin",
    color: "#A8281C",
    badge: { tr: "SICACIK ÇORBA", en: "HOT SOUP", ar: "شوربة ساخنة" },
  },
  {
    id: "kayseri-mantisi",
    color: "#7A3E5C",
    badge: { tr: "ŞEFİN İMZASI", en: "SIGNATURE", ar: "توقيع الشيف" },
  },
  {
    id: "kusbasili-kasarli",
    color: "#A8683B",
    badge: { tr: "TAŞ FIRIN", en: "STONE OVEN", ar: "فرن حجري" },
  },
  {
    id: "kuzu-incik",
    color: "#2F6F73",
    badge: { tr: "ÖZEL LEZZET", en: "SPECIAL", ar: "طبق مميز" },
  },
  {
    id: "firinda-sutlac",
    color: "#B5547A",
    badge: { tr: "GÜNLÜK TATLI", en: "DAILY DESSERT", ar: "حلوى طازجة" },
  },
];

interface FeaturedDishesShowcaseProps {
  items?: any[];
}

export default function FeaturedDishesShowcase({ items }: FeaturedDishesShowcaseProps = {}) {
  const { lang } = useAppContext();
  const params = useParams();
  const activeLang =
    (typeof params?.locale === "string" ? params.locale : null) ||
    lang ||
    "tr";
  const [selectedDish, setSelectedDish] = useState<any | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  const getBestSellersTitle = () => {
    switch (activeLang) {
      case "ar":
        return "الأكثر طلباً ومبيعاً";
      case "fa":
        return "پرفروش‌ترین‌ها";
      case "en":
        return "Best Sellers & Specials";
      case "ru":
        return "Хиты продаж";
      case "fr":
        return "Meilleures Ventes";
      case "de":
        return "Bestseller";
      case "it":
        return "I Più Venduti";
      case "es":
        return "Los Más Vendidos";
      case "zh":
        return "热销推荐";
      default:
        return "En Çok Satanlar";
    }
  };

  const allItems = items && items.length > 0 ? items : menuData.flatMap((c) => c.items);

  return (
    <section className="relative w-full overflow-hidden bg-[#FFFAF0] pt-2.5 pb-2">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-5">
        <div className="bg-[#FFFAF0] border-2 border-[#253D2C]/20 rounded-xl p-3 sm:p-4 shadow-xs relative">
          <div className="flex items-center justify-between mb-2.5">
            <h2
              className="text-base sm:text-lg font-black text-[#253D2C] flex items-center gap-1.5"
              style={{ fontFamily: "var(--font-cairo)" }}
            >
              <span className="text-[#596752]">
                <CookingPot size={18} />
              </span>
              <span>{getBestSellersTitle()}</span>
            </h2>
          </div>

          <div className="relative">
            {/* Scroll Left Button */}
            {canScrollLeft && (
              <button
                onClick={() => scroll(-1)}
                aria-label="Scroll left"
                className="absolute -start-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#FFFAF0] border border-[#253D2C]/30 shadow-md flex items-center justify-center text-[#253D2C] hover:bg-[#F6F1E7] transition-all cursor-pointer"
              >
                <CaretLeft size={18} weight="bold" />
              </button>
            )}

            {/* Scroll Right Button */}
            {canScrollRight && (
              <button
                onClick={() => scroll(1)}
                aria-label="Scroll right"
                className="absolute -end-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#FFFAF0] border border-[#253D2C]/30 shadow-md flex items-center justify-center text-[#253D2C] hover:bg-[#F6F1E7] transition-all cursor-pointer"
              >
                <CaretRight size={18} weight="bold" />
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-2.5 sm:gap-3.5 md:gap-4 no-scrollbar pb-1 px-1 snap-x snap-mandatory justify-start md:justify-center lg:justify-between items-start"
            >
              {featuredDishes.map((feat) => {
                const item = allItems.find((i) => i.id === feat.id);
                if (!item) return null;

                const turkishTitle = item.name?.tr || feat.id;
                const translatedBadge =
                  (feat.badge as any)[activeLang] || feat.badge.tr;

                return (
                  <div
                    key={feat.id}
                    className="relative flex flex-col items-center gap-1.5 shrink-0 md:shrink md:flex-1 cursor-pointer group w-[78px] sm:w-[88px] md:w-auto snap-center transition-transform hover:scale-105"
                    onClick={() => setSelectedDish(item)}
                  >
                    {/* Flat Circular Avatar */}
                    <div className="relative w-[68px] h-[68px] sm:w-[78px] sm:h-[78px] md:w-[82px] md:h-[82px] rounded-full p-[2px] transition-colors shadow-xs" style={{ backgroundColor: `${feat.color}55` }}>
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-[#F6F1E7] border border-[#FFFAF0] flex items-center justify-center">
                        {feat.image || item.image ? (
                          <Image
                            src={feat.image || item.image!}
                            alt={turkishTitle}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="82px"
                            className="transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="text-[#596752] group-hover:scale-110 transition-transform">
                            {item.id.includes("pide") ? (
                              <StoneOven size={28} />
                            ) : (
                              <CookingPot size={28} />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Badge Overlapping Bottom */}
                      <div className="absolute -bottom-1.5 inset-x-0 flex justify-center z-10">
                        <span style={{ backgroundColor: feat.color, boxShadow: `0 3px 8px ${feat.color}55` }} className="px-1.5 py-0.5 text-white border border-[#FFFAF0] rounded text-[8px] sm:text-[9px] font-bold whitespace-nowrap uppercase tracking-tight scale-90 max-w-full overflow-hidden text-ellipsis">
                          {translatedBadge}
                        </span>
                      </div>
                    </div>

                    {/* Title - strictly Turkish */}
                    <span
                      className="text-[10px] sm:text-[11px] md:text-xs text-center font-bold text-[#253D2C] leading-tight mt-0.5 group-hover:text-[#C64C32] transition-colors line-clamp-2 px-0.5 w-full"
                      style={{ fontFamily: "var(--font-cairo)" }}
                    >
                      {turkishTitle}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for clicked dish */}
      {selectedDish && (
        <DishModal
          isOpen={true}
          setIsOpen={() => setSelectedDish(null)}
          item={selectedDish}
        />
      )}
    </section>
  );
}
