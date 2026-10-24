"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { MenuCategory } from "@/data/menuData";
import { CaretLeft, CaretRight, ForkKnife, Coffee } from "@phosphor-icons/react";
import { CupSoda } from "lucide-react";
import { CookingPot, StoneOven, OttomanStar } from "./BrandIcons";

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
    if (catId.includes("pide")) {
      return <StoneOven size={22} />;
    }
    if (catId === "icecekler") {
      return <CupSoda size={22} strokeWidth={1.75} />;
    }
    if (catId === "tatlilar") {
      return <Coffee size={22} weight="regular" />;
    }
    if (catId === "corbalar" || catId === "ana-yemekler") {
      return <CookingPot size={22} />;
    }
    return <ForkKnife size={22} weight="regular" />;
  };

  return (
    <div className="relative w-full bg-[#F7F2E7] pt-1 pb-2">
      {/* Decorative Star Divider */}
      <div className="max-w-5xl mx-auto px-4 my-1 flex items-center justify-center gap-2">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#9C7A3F]/30 to-transparent flex-grow max-w-[120px]" />
        <OttomanStar size={10} className="text-[#9C7A3F]/50 shrink-0" />
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#9C7A3F]/30 to-transparent flex-grow max-w-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-2.5 sm:px-5">
        <div className="bg-[#FAF7F0] border-2 border-[#9C7A3F]/35 rounded-xl p-2.5 sm:p-3.5 shadow-xs relative">
          <div className="px-0.5 mb-2 hidden sm:block">
            <h3
              className="text-xs sm:text-sm font-bold text-[#7A7364] tracking-wide"
              style={{ fontFamily: "var(--font-cairo)" }}
            >
              {lang === "ar"
                ? "تصفح أقسام القائمة"
                : lang === "en"
                ? "Explore Categories"
                : "Menüyü İncele"}
            </h3>
          </div>

          <div className="relative">
            {/* Scroll Left Button */}
            {canScrollLeft && (
              <button
                onClick={() => scroll(-1)}
                aria-label="Scroll left"
                className="absolute start-0 top-0 bottom-0 z-10 w-7 sm:w-9 flex items-center justify-center bg-gradient-to-r from-[#FAF7F0] via-[#FAF7F0]/90 to-transparent"
              >
                <CaretLeft size={18} weight="bold" className="text-[#2B2620]" />
              </button>
            )}

            {/* Scroll Right Button */}
            {canScrollRight && (
              <button
                onClick={() => scroll(1)}
                aria-label="Scroll right"
                className="absolute end-0 top-0 bottom-0 z-10 w-7 sm:w-9 flex items-center justify-center bg-gradient-to-l from-[#FAF7F0] via-[#FAF7F0]/90 to-transparent"
              >
                <CaretRight size={18} weight="bold" className="text-[#2B2620]" />
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex items-start gap-2 sm:gap-3 px-0.5 pe-8 overflow-x-auto no-scrollbar pb-0.5 pt-0.5"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const catName =
                  cat.category[lang as "tr" | "en" | "ar"] || cat.category.tr;

                return (
                  <button
                    key={cat.id}
                    data-cat={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`relative shrink-0 flex flex-col items-center gap-1 w-[68px] sm:w-[80px] group transition-all duration-200 ${
                      isActive ? "scale-105" : "hover:scale-105"
                    }`}
                  >
                    {/* Thumbnail / Icon Container */}
                    <div
                      className={`relative w-[46px] h-[46px] sm:w-[56px] sm:h-[56px] rounded-lg sm:rounded-xl overflow-hidden transition-all duration-200 flex items-center justify-center ${
                        isActive
                          ? "border-2 border-[#4E5F4C] bg-[#EDE3CE] shadow-xs text-[#4E5F4C]"
                          : "border border-[#9C7A3F]/30 bg-[#EDE3CE] text-[#9C7A3F] group-hover:border-[#9C7A3F]"
                      }`}
                    >
                      {cat.image ? (
                        <Image
                          src={cat.image}
                          alt={catName}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="56px"
                          className="transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center">
                          {getCategoryIcon(cat.id)}
                        </div>
                      )}
                    </div>

                    <span
                      className={`text-[9px] sm:text-[10px] font-bold text-center leading-tight px-0.5 transition-colors line-clamp-2 w-full ${
                        isActive
                          ? "text-[#2B2620]"
                          : "text-[#7A7364] group-hover:text-[#2B2620]"
                      }`}
                      style={{ fontFamily: "var(--font-cairo)" }}
                    >
                      {catName}
                    </span>
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
