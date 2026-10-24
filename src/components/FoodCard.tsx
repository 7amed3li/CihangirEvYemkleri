"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { Plus, Minus, CaretRight } from "@phosphor-icons/react";
import { CookingPot, StoneOven } from "./BrandIcons";
import DishModal from "./DishModal";
import { getDishDisplay } from "@/data/dishTranslations";

interface MenuItemProps {
  item: {
    id: string;
    name: any;
    price: number;
    image?: string;
    description?: string;
    descriptions?: any;
    tags?: string[];
    trending?: boolean;
    isAvailable?: boolean;
  };
}

export default function FoodCard({ item }: MenuItemProps) {
  const { convertPrice, getCurrencySymbol, addToCart, removeFromCart, getItemQuantity, lang } =
    useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { turkishTitle, localizedName, localizedDesc, formattedDesc } =
    getDishDisplay(item, lang);

  const isAvailable = item.isAvailable !== false;
  const isRTL = lang === "ar" || lang === "fa";
  const displayPrice = convertPrice(item.price);
  const symbol = getCurrencySymbol();
  const qty = getItemQuantity(item.id);
  const isFeatured = item.tags?.includes("signature") || item.trending;
  const outOfStockLabel =
    lang === "ar" ? "غير متوفر" : lang === "en" ? "Out of Stock" : "Tükendi";

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Rule: Name in the cart must ALWAYS be in Turkish
    addToCart({
      id: item.id,
      name: turkishTitle,
      price: item.price,
      image: item.image,
    });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromCart(item.id);
  };

  return (
    <>
      <div
        id={item.id}
        dir={isRTL ? "rtl" : "ltr"}
        className={`group relative rounded-xl bg-[#F7F2E7] ${
          !isAvailable
            ? "border border-[#A0422E]/30 opacity-90"
            : isFeatured
            ? "border border-[#9C7A3F]/60 shadow-xs"
            : "border border-[#9C7A3F]/20 hover:border-[#9C7A3F]/50"
        } overflow-hidden transition-all duration-200 flex flex-row items-stretch min-h-[9rem] sm:min-h-[10rem] text-start`}
      >
        {/* Image / Thumbnail Section */}
        <div
          className="w-32 sm:w-40 h-full shrink-0 relative overflow-hidden bg-[#EDE3CE] z-10 cursor-pointer flex items-center justify-center border-e border-[#9C7A3F]/15"
          onClick={() => setIsModalOpen(true)}
        >
          {item.image ? (
            <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
              <Image
                src={item.image}
                alt={turkishTitle}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 128px, 160px"
              />
            </div>
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #EDE3CE 0%, #E0D5BF 100%)",
              }}
            >
              <div className="text-[#9C7A3F]/50 group-hover:scale-110 transition-transform duration-300">
                {item.id.includes("pide") ? (
                  <StoneOven size={40} />
                ) : (
                  <CookingPot size={40} />
                )}
              </div>
            </div>
          )}

          {/* Price Tag Badge */}
          <div className="absolute top-2 start-2 z-20 flex items-center pointer-events-none">
            <span
              className="flex items-center px-2.5 py-1 rounded-[4px] bg-[#9C7A3F] text-[#EAF0E6] font-bold text-xs tracking-wide shadow-xs"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {displayPrice != null ? (
                <>
                  {displayPrice} {symbol}
                </>
              ) : (
                "-"
              )}
            </span>
          </div>

          {/* Text Badges */}
          <div className="absolute bottom-2 start-2 z-20 flex flex-wrap gap-1 pointer-events-none">
            {!isAvailable && (
              <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white bg-[#A0422E] rounded-[3px] font-bold shadow-xs">
                {outOfStockLabel}
              </span>
            )}
            {item.tags?.includes("signature") && (
              <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#EAF0E6] bg-[#9C7A3F] rounded-[3px] font-bold">
                Şef
              </span>
            )}
            {item.tags?.includes("spicy") && (
              <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#EAF0E6] bg-[#A0422E] rounded-[3px] font-bold">
                Acılı
              </span>
            )}
            {item.tags?.includes("vegetarian") && (
              <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#EAF0E6] bg-[#4E5F4C] rounded-[3px] font-bold">
                Veg
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="flex flex-col flex-grow p-3 sm:p-4 justify-between relative z-10 w-full min-w-0 bg-[#F7F2E7] text-start"
        >
          {/* Top part - clickable to open modal */}
          <div
            className="cursor-pointer flex-1 text-start flex flex-col"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                className="font-bold text-sm sm:text-base text-[#2B2620] leading-snug truncate md:whitespace-normal group-hover:text-[#9C7A3F] transition-colors text-start"
                style={{ fontFamily: "var(--font-cairo)" }}
              >
                {turkishTitle}
              </h3>
              {/* Click Affordance Chevron */}
              <div className="shrink-0 w-6 h-6 rounded-full bg-[#9C7A3F]/10 flex items-center justify-center text-[#9C7A3F] group-hover:bg-[#9C7A3F] group-hover:text-white transition-colors">
                <CaretRight
                  size={14}
                  weight="bold"
                  className={`transition-transform ${isRTL ? "-scale-x-100" : ""}`}
                />
              </div>
            </div>

            {formattedDesc && (
              <p
                className="text-xs text-[#7A7364] mt-1 line-clamp-2 leading-relaxed font-medium text-start"
                style={{ fontFamily: isRTL ? "var(--font-cairo)" : "var(--font-inter)" }}
              >
                {lang !== "tr" ? (
                  <>
                    <span className="font-semibold text-[#5A5344]">{localizedName}: </span>
                    {localizedDesc}
                  </>
                ) : (
                  localizedDesc
                )}
              </p>
            )}
          </div>

          {/* Bottom part - counter controls */}
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#9C7A3F]/15">
            <span
              className="text-[#9C7A3F] font-bold text-xs"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {displayPrice} {symbol}
            </span>

            {/* Cart Counter or Out of Stock */}
            {!isAvailable ? (
              <span className="text-[11px] font-bold text-[#A0422E] px-2 py-1 rounded bg-[#A0422E]/10 border border-[#A0422E]/30 tracking-wide select-none">
                {outOfStockLabel}
              </span>
            ) : qty === 0 ? (
              <button
                onClick={handleAdd}
                aria-label="Add to cart"
                className="w-8 h-8 flex items-center justify-center rounded-md border border-[#9C7A3F] text-[#9C7A3F] hover:bg-[#9C7A3F] hover:text-white transition-colors"
              >
                <Plus size={16} weight="bold" />
              </button>
            ) : (
              <div
                className="flex items-center min-h-[36px] rounded-lg border border-[#9C7A3F]/30 bg-[#EDE3CE] px-1.5 py-0.5 gap-1 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleRemove}
                  aria-label="Decrease quantity"
                  className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-md text-[#2B2620] hover:text-[#A0422E] transition-colors"
                >
                  <Minus size={14} weight="bold" />
                </button>
                <span className="text-center font-bold text-[#2B2620] w-5 text-xs">
                  {qty}
                </span>
                <button
                  onClick={handleAdd}
                  aria-label="Increase quantity"
                  className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-md text-[#2B2620] hover:text-[#4E5F4C] transition-colors"
                >
                  <Plus size={14} weight="bold" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quantity Badge Over Thumbnail */}
        {qty > 0 && (
          <div className="absolute top-2.5 end-2.5 z-20 w-5 h-5 rounded-full bg-[#4E5F4C] text-[#EAF0E6] text-[10px] font-bold flex items-center justify-center border-2 border-[#F7F2E7] pointer-events-none">
            {qty}
          </div>
        )}
      </div>

      {/* Dish Modal */}
      <DishModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        item={item}
      />
    </>
  );
}
