"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { MenuCategory } from "@/data/menuData";
import { CaretLeft, CaretRight, ForkKnife, Coffee } from "@phosphor-icons/react";
import { CupSoda, Soup, Salad, Wheat, CakeSlice, UtensilsCrossed } from "lucide-react";
import { CookingPot, StoneOven, OttomanStar } from "./BrandIcons";
import { CATEGORY_TRANSLATIONS } from "@/data/dishTranslations";
import { Locale } from "@/i18n/translations";

interface MenuCategoryBarProps {
  categories: MenuCategory[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

export default function MenuCategoryBar({
  categories,
  activeCategory,
  setActiveCategory,
}: MenuCategoryBarProps) {
  const { lang } = useAppContext();
  const params = useParams();
  const activeLang =
    (typeof params?.locale === "string" ? params.locale : null) ||
    lang ||
    "tr";
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
    if (el) el.addEventListener("scroll", checkScroll);
    return () => el?.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const target = el.querySelector(`[data-cat="${activeCategory}"]`) as HTMLElement;
    if (target) {
      const containerRect = el.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const offset =
        targetRect.left -
        containerRect.left -
        containerRect.width / 2 +
        targetRect.width / 2;
      el.scrollBy({ left: offset, behavior: "smooth" });
    }
  }, [activeCategory]);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 180, behavior: "smooth" });
  };

  const getCategoryIcon = (catId: string) => {
    if (catId === "ana-yemekler") {
      return <CookingPot size={22} />;
    }
    if (catId.includes("pide")) {
      return <StoneOven size={22} />;
    }
    if (catId === "corbalar") {
      return <Soup size={22} strokeWidth={1.8} />;
    }
    if (catId === "az-menu") {
      return <UtensilsCrossed size={22} strokeWidth={1.8} />;
    }
    if (catId === "yan-urunler") {
      return <Wheat size={22} strokeWidth={1.8} />;
    }
    if (catId === "salatalar") {
      return <Salad size={22} strokeWidth={1.8} />;
    }
    if (catId === "tatlilar") {
      return <CakeSlice size={22} strokeWidth={1.8} />;
    }
    if (catId === "icecekler") {
      return <CupSoda size={22} strokeWidth={1.8} />;
    }
    return <ForkKnife size={22} weight="regular" />;
  };

  const categoryTitle =
    activeLang === "ar"
      ? "تصفح أقسام القائمة"
      : activeLang === "fa"
      ? "دسته‌بندی‌های منو"
      : activeLang === "en"
      ? "Explore Categories"
      : activeLang === "ru"
      ? "Категории меню"
      : activeLang === "fr"
      ? "Parcourir les catégories"
      : activeLang === "de"
      ? "Kategorien durchsuchen"
      : activeLang === "it"
      ? "Sfoglia le categorie"
      : activeLang === "es"
      ? "Explorar categorías"
      : activeLang === "zh"
      ? "浏览菜单分类"
      : "Menüyü İncele";

  return (
    <div className="w-full bg-[#FFFAF0] pt-2 pb-1">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-5">
        <div className="bg-[#FFFAF0] border-2 border-[#253D2C]/20 rounded-xl p-2.5 sm:p-3.5 shadow-xs relative">
          <div className="px-1 mb-2 flex items-center justify-between">
            <h3
              className="text-xs sm:text-sm font-bold text-[#76816E] tracking-wide flex items-center gap-1.5"
              style={{ fontFamily: "var(--font-cairo)" }}
            >
              <span className="text-[#596752]">
                <ForkKnife size={15} weight="bold" />
              </span>
              <span>{categoryTitle}</span>
            </h3>
            <span className="text-[11px] font-bold text-[#596752] hidden sm:inline-block">
              {categories.length} {activeLang === "ar" ? "أقسام" : activeLang === "en" ? "Categories" : "Kategori"}
            </span>
          </div>

          <div className="relative">
            {/* Scroll Left Button (hidden on desktop where items fit) */}
            {canScrollLeft && (
              <button
                onClick={() => scroll(-1)}
                aria-label="Scroll left"
                className="absolute start-0 top-0 bottom-0 z-10 w-7 sm:w-9 flex items-center justify-center bg-gradient-to-r from-[#FFFAF0] via-[#FFFAF0]/90 to-transparent md:hidden"
              >
                <CaretLeft size={18} weight="bold" className="text-[#253D2C]" />
              </button>
            )}

            {/* Scroll Right Button (hidden on desktop where items fit) */}
            {canScrollRight && (
              <button
                onClick={() => scroll(1)}
                aria-label="Scroll right"
                className="absolute end-0 top-0 bottom-0 z-10 w-7 sm:w-9 flex items-center justify-center bg-gradient-to-l from-[#FFFAF0] via-[#FFFAF0]/90 to-transparent md:hidden"
              >
                <CaretRight size={18} weight="bold" className="text-[#253D2C]" />
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex items-start gap-1.5 sm:gap-2.5 md:gap-3 px-1 overflow-x-auto no-scrollbar pb-1 pt-0.5 justify-start md:justify-between w-full"
            >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              const catTrans = CATEGORY_TRANSLATIONS[cat.id];
              const catName =
                catTrans?.[activeLang as Locale] ||
                (cat.category as any)?.[activeLang] ||
                cat.category.tr;

              return (
                <button
                  key={cat.id}
                  data-cat={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative shrink-0 md:shrink md:flex-1 flex flex-col items-center gap-1.5 w-[70px] sm:w-[82px] md:w-auto group transition-all duration-200 cursor-pointer ${
                    isActive ? "scale-105" : "hover:scale-105"
                  }`}
                >
                  {/* Thumbnail / Icon Container */}
                  <div
                    className={`relative w-[48px] h-[48px] sm:w-[54px] sm:h-[54px] md:w-[58px] md:h-[58px] rounded-xl overflow-hidden transition-all duration-200 flex items-center justify-center ${
                      isActive
                        ? "border-2 border-[#354D37] bg-[#F6F1E7] shadow-sm text-[#354D37] ring-2 ring-[#354D37]/20"
                        : "border border-[#253D2C]/17 bg-[#F6F1E7]/60 text-[#596752] group-hover:bg-[#F6F1E7] group-hover:border-[#253D2C]"
                    }`}
                  >
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={catName}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="58px"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center">
                        {getCategoryIcon(cat.id)}
                      </div>
                    )}
                  </div>

                  <span
                    className={`text-[10px] sm:text-[11px] md:text-xs font-bold text-center leading-tight px-0.5 transition-colors line-clamp-2 w-full ${
                      isActive
                        ? "text-[#253D2C]"
                        : "text-[#76816E] group-hover:text-[#253D2C]"
                    }`}
                    style={{ fontFamily: "var(--font-cairo)" }}
                  >
                    {catName}
                  </span>

                  {/* Active bottom indicator bar */}
                  {isActive && (
                    <div className="w-5 h-1 bg-[#354D37] rounded-full mt-0.5" />
                  )}
                </button>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

