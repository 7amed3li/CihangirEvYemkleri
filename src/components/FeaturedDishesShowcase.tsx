"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { menuData } from "@/data/menuData";
import { CookingPot, StoneOven } from "./BrandIcons";
import DishModal from "./DishModal";

interface FeaturedDish {
  id: string;
  badge: {
    tr: string;
    en: string;
    ar: string;
  };
  image?: string;
}

const featuredDishes: FeaturedDish[] = [
  {
    id: "asci-tabagi",
    badge: { tr: "ŞEFİN SEÇİMİ", en: "CHEF'S SPECIAL", ar: "اختيار الشيف" },
  },
  {
    id: "kavurma",
    badge: { tr: "EN ÇOK SATAN", en: "BEST SELLER", ar: "الأكثر طلباً" },
  },
  {
    id: "karisik-pide",
    badge: { tr: "TAŞ FIRIN", en: "STONE OVEN", ar: "فرن حجري" },
  },
  {
    id: "et-sote",
    badge: { tr: "EN ÇOK SATAN", en: "BEST SELLER", ar: "الأكثر طلباً" },
  },
  {
    id: "karniyarik",
    badge: { tr: "GELENEKSEL", en: "TRADITIONAL", ar: "تقليدي أصيل" },
  },
  {
    id: "ezogelin",
    badge: { tr: "SICACIK ÇORBA", en: "HOT SOUP", ar: "شوربة ساخنة" },
  },
  {
    id: "kayseri-mantisi",
    badge: { tr: "ŞEFİN İMZASI", en: "SIGNATURE", ar: "توقيع الشيف" },
  },
  {
    id: "kusbasili-kasarli",
    badge: { tr: "TAŞ FIRIN", en: "STONE OVEN", ar: "فرن حجري" },
  },
  {
    id: "kuzu-incik",
    badge: { tr: "ÖZEL LEZZET", en: "SPECIAL", ar: "طبق مميز" },
  },
  {
    id: "firinda-sutlac",
    badge: { tr: "GÜNLÜK TATLI", en: "DAILY DESSERT", ar: "حلوى طازجة" },
  },
];

interface FeaturedDishesShowcaseProps {
  items?: any[];
}

export default function FeaturedDishesShowcase({ items }: FeaturedDishesShowcaseProps = {}) {
  const { lang } = useAppContext();
  const [selectedDish, setSelectedDish] = useState<any | null>(null);

  const isRTL = lang === "ar" || lang === "fa";

  const getBestSellersTitle = () => {
    if (lang === "ar") return "الأكثر طلباً ومبيعاً";
    if (lang === "en") return "Best Sellers & Specials";
    if (lang === "ru") return "Хиты продаж";
    if (lang === "fa") return "پرفروش‌ترین‌ها";
    if (lang === "fr") return "Meilleures Ventes";
    if (lang === "de") return "Bestseller";
    return "En Çok Satanlar";
  };

  const allItems = items && items.length > 0 ? items : menuData.flatMap((c) => c.items);

  return (
    <section className="relative w-full overflow-hidden bg-[#F7F2E7] pt-2.5 pb-2">
      <div className="max-w-5xl mx-auto px-2.5 sm:px-5">
        <div className="bg-[#FAF7F0] border-2 border-[#9C7A3F]/35 rounded-xl p-3 sm:p-4 shadow-xs relative">
          <h2
            className="text-base sm:text-lg font-black text-[#2B2620] mb-2.5 flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-cairo)" }}
          >
            <span className="text-[#9C7A3F]">
              <CookingPot size={18} />
            </span>
            <span>{getBestSellersTitle()}</span>
          </h2>

          <div className="flex overflow-x-auto gap-2.5 sm:gap-4 no-scrollbar pb-1 px-0.5 snap-x snap-mandatory">
            {featuredDishes.map((feat) => {
              const item = allItems.find((i) => i.id === feat.id);
              if (!item) return null;

              const translatedName =
                item.name?.[lang as "tr" | "en" | "ar"] || item.name?.tr;
              const translatedBadge =
                feat.badge[lang as "tr" | "en" | "ar"] || feat.badge.tr;

              return (
                <div
                  key={feat.id}
                  className="relative flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group w-[78px] sm:w-[96px] snap-center"
                  onClick={() => setSelectedDish(item)}
                >
                  {/* Flat Circular Avatar */}
                  <div className="relative w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-full p-[2px] bg-[#9C7A3F]/30 group-hover:bg-[#9C7A3F] transition-colors shadow-xs">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-[#EDE3CE] border border-[#F7F2E7] flex items-center justify-center">
                      {feat.image || item.image ? (
                        <Image
                          src={feat.image || item.image!}
                          alt={translatedName}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="84px"
                          className="transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="text-[#9C7A3F] group-hover:scale-110 transition-transform">
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
                      <span className="px-1.5 py-0.5 bg-[#4E5F4C] text-[#EAF0E6] rounded text-[8px] sm:text-[9px] font-bold whitespace-nowrap shadow-xs uppercase tracking-tight scale-90 max-w-full overflow-hidden text-ellipsis">
                        {translatedBadge}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <span
                    className="text-[10px] sm:text-[11px] text-center font-bold text-[#2B2620] leading-tight mt-0.5 group-hover:text-[#9C7A3F] transition-colors line-clamp-2 px-0.5"
                    style={{ fontFamily: "var(--font-cairo)" }}
                  >
                    {translatedName}
                  </span>
                </div>
              );
            })}
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
