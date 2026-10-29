"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Plus, Minus, CaretRight } from "@phosphor-icons/react";
import { CookingPot, StoneOven } from "./BrandIcons";
import { Coffee, CupSoda, GlassWater } from "lucide-react";
import DishModal from "./DishModal";
import { getDishDisplay } from "@/data/dishTranslations";

const HOT_BEVERAGES = new Set(["cay", "turk-kahvesi", "nescafe", "bitki-caylari"]);
const COLD_BEVERAGES = new Set(["ayran", "cola", "fanta", "meyve-sulari", "soda", "su"]);

function getBeverageType(id: string): "hot" | "cold" | null {
  if (HOT_BEVERAGES.has(id)) return "hot";
  if (COLD_BEVERAGES.has(id)) return "cold";
  return null;
}

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
  const [imageError, setImageError] = useState(false);
  const params = useParams();
  const activeLang =
    (typeof params?.locale === "string" ? params.locale : null) ||
    lang ||
    "tr";

  const { turkishTitle, localizedName, localizedDesc, formattedDesc } =
    getDishDisplay(item, activeLang);

  const isAvailable = item.isAvailable !== false;
  const isRTL = activeLang === "ar" || activeLang === "fa";
  const displayPrice = convertPrice(item.price);
  const symbol = getCurrencySymbol();
  const qty = getItemQuantity(item.id);
  const isFeatured = item.tags?.includes("signature") || item.trending;
  const outOfStockLabel =
    activeLang === "ar" ? "غير متوفر" : activeLang === "en" ? "Out of Stock" : "Tükendi";

  const bevType = getBeverageType(item.id);
  const isBeverage = bevType !== null;
  const isImageless = !item.image || isBeverage || imageError;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Rule: Name in the cart must ALWAYS be in Turkish
    addToCart({
      id: item.id,
      name: turkishTitle,
      price: item.price,
      image: isImageless ? undefined : item.image,
    });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromCart(item.id);
  };

  // Dedicated elegant layout for products without images (e.g. beverages)
  if (isImageless) {
    const isPide = item.id.includes("pide");

    return (
      <>
        <div
          id={item.id}
          dir={isRTL ? "rtl" : "ltr"}
          className={`group relative rounded-xl bg-[#FFFAF0] ${
            !isAvailable
              ? "border border-[#C64C32]/30 opacity-90"
              : isFeatured
              ? "border border-[#253D2C]/35 shadow-xs"
              : "border border-[#253D2C]/12 hover:border-[#253D2C]/30"
          } overflow-hidden transition-all duration-200 flex flex-col justify-between p-3.5 sm:p-4 min-h-[9rem] sm:min-h-[10rem] text-start`}
        >
          {/* Top part - clickable to open modal */}
          <div
            className="cursor-pointer flex-1 text-start flex flex-col"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className="font-bold text-base sm:text-lg text-[#253D2C] leading-snug group-hover:text-[#C64C32] transition-colors text-start"
                    style={{ fontFamily: "var(--font-cairo)" }}
                  >
                    {turkishTitle}
                  </h3>
                  {/* Status & Characteristic Badges */}
                  {!isAvailable && (
                    <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider text-white bg-[#C64C32] rounded-[3px] font-bold shadow-xs">
                      {outOfStockLabel}
                    </span>
                  )}
                  {item.tags?.includes("signature") && (
                    <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#E4EADB] bg-[#C64C32] rounded-[3px] font-bold shadow-2xs">
                      {activeLang === "ar" ? "مميز" : "Şef"}
                    </span>
                  )}
                  {bevType === "cold" && (
                    <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#C64C32] bg-[#C64C32]/8 border border-[#C64C32]/30 rounded-[3px] font-bold">
                      {activeLang === "ar" ? "بارد" : activeLang === "en" ? "Cold" : "Soğuk"}
                    </span>
                  )}
                  {bevType === "hot" && (
                    <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#C64C32] bg-[#253D2C]/5 border border-[#253D2C]/14 rounded-[3px] font-bold">
                      {activeLang === "ar" ? "ساخن" : activeLang === "en" ? "Hot" : "Sıcak"}
                    </span>
                  )}
                </div>

                {activeLang !== "tr" && localizedName && localizedName !== turkishTitle && (
                  <p className="text-xs font-semibold text-[#596752] mt-0.5 line-clamp-1">
                    {localizedName}
                  </p>
                )}
              </div>

              {/* Decorative Icon Pill + Chevron */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#F6F1E7] border border-[#253D2C]/14 flex items-center justify-center text-[#596752] group-hover:bg-[#C64C32] group-hover:text-white transition-colors">
                  {bevType === "hot" ? (
                    <Coffee size={16} />
                  ) : bevType === "cold" ? (
                    item.id === "su" || item.id === "soda" ? (
                      <GlassWater size={16} />
                    ) : (
                      <CupSoda size={16} />
                    )
                  ) : isPide ? (
                    <StoneOven size={18} />
                  ) : (
                    <CookingPot size={18} />
                  )}
                </div>
                <div className="shrink-0 w-6 h-6 rounded-full bg-[#253D2C]/5 flex items-center justify-center text-[#596752] group-hover:bg-[#C64C32] group-hover:text-white transition-colors">
                  <CaretRight
                    size={14}
                    weight="bold"
                    className={`transition-transform ${isRTL ? "-scale-x-100" : ""}`}
                  />
                </div>
              </div>
            </div>

            {/* Description if present */}
            {formattedDesc && (
              <div className="mt-1">
                <p
                  className="text-xs text-[#76816E] line-clamp-2 leading-relaxed font-medium text-start"
                  style={{ fontFamily: isRTL ? "var(--font-cairo)" : "var(--font-inter)" }}
                >
                  {localizedDesc}
                </p>
                <span className="text-[10px] font-bold text-[#596752] hover:underline inline-block mt-0.5">
                  {activeLang === "ar" ? "عرض التفاصيل الكاملة ←" : activeLang === "en" ? "View full details →" : "Detayları gör →"}
                </span>
              </div>
            )}
          </div>

          {/* Bottom part - single clear price and counter controls */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#253D2C]/12">
            <div className="flex flex-col">
              <span
                className="text-sm sm:text-base font-black text-[#253D2C]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {symbol !== "₺" ? `≈ ${displayPrice} ${symbol}` : `${item.price} ₺`}
              </span>
              {symbol !== "₺" && (
                <span className="text-[10px] text-[#C64C32] font-bold">
                  {item.price} ₺ ({activeLang === "ar" ? "السعر الرسمي الملزم" : activeLang === "en" ? "Official Price" : activeLang === "ru" ? "Официальная цена" : "Esas Fiyat"})
                </span>
              )}
            </div>

            {/* Cart Counter or Out of Stock */}
            {!isAvailable ? (
              <span className="text-[11px] font-bold text-[#C64C32] px-2 py-1 rounded bg-[#C64C32]/10 border border-[#C64C32]/30 tracking-wide select-none">
                {outOfStockLabel}
              </span>
            ) : qty === 0 ? (
              <button
                onClick={handleAdd}
                aria-label="Add to cart"
                className="w-8 h-8 flex items-center justify-center rounded-md border border-[#253D2C]/40 text-[#596752] hover:bg-[#C64C32] hover:text-white transition-colors cursor-pointer"
              >
                <Plus size={16} weight="bold" />
              </button>
            ) : (
              <div
                className="flex items-center min-h-[36px] rounded-lg border border-[#253D2C]/17 bg-[#F6F1E7] px-1.5 py-0.5 gap-1 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleRemove}
                  aria-label="Decrease quantity"
                  className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-md text-[#253D2C] hover:text-[#C64C32] transition-colors cursor-pointer"
                >
                  <Minus size={14} weight="bold" />
                </button>
                <span className="text-center font-bold text-[#253D2C] w-5 text-xs">
                  {qty}
                </span>
                <button
                  onClick={handleAdd}
                  aria-label="Increase quantity"
                  className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-md text-[#253D2C] hover:text-[#354D37] transition-colors cursor-pointer"
                >
                  <Plus size={14} weight="bold" />
                </button>
              </div>
            )}
          </div>

          {/* Quantity Badge */}
          {qty > 0 && (
            <div className="absolute top-2.5 end-2.5 z-20 w-5 h-5 rounded-full bg-[#354D37] text-[#E4EADB] text-[10px] font-bold flex items-center justify-center border-2 border-[#FFFAF0] pointer-events-none">
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

  return (
    <>
      <div
        id={item.id}
        dir={isRTL ? "rtl" : "ltr"}
        className={`group relative rounded-xl bg-[#FFFAF0] ${
          !isAvailable
            ? "border border-[#C64C32]/30 opacity-90"
            : isFeatured
            ? "border border-[#253D2C]/35 shadow-xs"
            : "border border-[#253D2C]/12 hover:border-[#253D2C]/30"
        } overflow-hidden transition-all duration-200 flex flex-row items-stretch min-h-[9rem] sm:min-h-[10rem] text-start`}
      >
        {/* Image / Thumbnail Section */}
        <div
          className="w-28 sm:w-36 lg:w-32 xl:w-36 h-full shrink-0 relative overflow-hidden bg-[#F6F1E7] z-10 cursor-pointer flex items-center justify-center border-e border-[#253D2C]/9"
          onClick={() => setIsModalOpen(true)}
        >
          {item.image ? (
            <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
              <Image
                src={item.image}
                alt={turkishTitle}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 640px) 112px, (max-width: 1024px) 144px, 130px"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #F6F1E7 0%, #E0D5BF 100%)",
              }}
            >
              <div className="text-[#596752]/50 group-hover:scale-110 transition-transform duration-300">
                {item.id.includes("pide") ? (
                  <StoneOven size={40} />
                ) : (
                  <CookingPot size={40} />
                )}
              </div>
            </div>
          )}

          {/* Category / Status Badges on Thumbnail */}
          <div className="absolute top-2 start-2 z-20 flex flex-wrap gap-1 pointer-events-none">
            {!isAvailable && (
              <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider text-white bg-[#C64C32] rounded-[3px] font-bold shadow-xs">
                {outOfStockLabel}
              </span>
            )}
            {item.tags?.includes("signature") && (
              <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#E4EADB] bg-[#C64C32] rounded-[3px] font-bold shadow-2xs">
                {activeLang === "ar" ? "مميز" : "Şef"}
              </span>
            )}
            {item.tags?.includes("spicy") && (
              <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#E4EADB] bg-[#C64C32] rounded-[3px] font-bold shadow-2xs">
                Acılı
              </span>
            )}
            {item.tags?.includes("vegetarian") && (
              <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#C64C32] bg-[#FFFAF0] border border-[#C64C32]/40 rounded-[3px] font-bold shadow-2xs">
                Veg
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="flex flex-col flex-grow p-3 sm:p-4 justify-between relative z-10 w-full min-w-0 bg-[#FFFAF0] text-start"
        >
          {/* Top part - clickable to open modal */}
          <div
            className="cursor-pointer flex-1 text-start flex flex-col"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                className="font-bold text-sm sm:text-base text-[#253D2C] leading-snug group-hover:text-[#C64C32] transition-colors text-start"
                style={{ fontFamily: "var(--font-cairo)" }}
              >
                {turkishTitle}
              </h3>
              {/* Click Affordance Chevron */}
              <div className="shrink-0 w-6 h-6 rounded-full bg-[#253D2C]/5 flex items-center justify-center text-[#596752] group-hover:bg-[#C64C32] group-hover:text-white transition-colors">
                <CaretRight
                  size={14}
                  weight="bold"
                  className={`transition-transform ${isRTL ? "-scale-x-100" : ""}`}
                />
              </div>
            </div>

            {formattedDesc && (
              <div className="mt-1">
                <p
                  className="text-xs text-[#76816E] line-clamp-2 leading-relaxed font-medium text-start"
                  style={{ fontFamily: isRTL ? "var(--font-cairo)" : "var(--font-inter)" }}
                >
                  {activeLang !== "tr" ? (
                    <>
                      <span className="font-semibold text-[#596752]">{localizedName}: </span>
                      {localizedDesc}
                    </>
                  ) : (
                    localizedDesc
                  )}
                </p>
                <span className="text-[10px] font-bold text-[#596752] hover:underline inline-block mt-0.5">
                  {activeLang === "ar" ? "عرض التفاصيل الكاملة ←" : activeLang === "en" ? "View full details →" : "Detayları gör →"}
                </span>
              </div>
            )}
          </div>

          {/* Bottom part - single clear price and counter controls */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#253D2C]/12">
            <div className="flex flex-col">
              <span
                className="text-sm font-black text-[#253D2C]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {symbol !== "₺" ? `≈ ${displayPrice} ${symbol}` : `${item.price} ₺`}
              </span>
              {symbol !== "₺" && (
                <span className="text-[10px] text-[#C64C32] font-bold">
                  {item.price} ₺ ({activeLang === "ar" ? "السعر الرسمي الملزم" : activeLang === "en" ? "Official Price" : activeLang === "ru" ? "Официальная цена" : "Esas Fiyat"})
                </span>
              )}
            </div>

            {/* Cart Counter or Out of Stock */}
            {!isAvailable ? (
              <span className="text-[11px] font-bold text-[#C64C32] px-2 py-1 rounded bg-[#C64C32]/10 border border-[#C64C32]/30 tracking-wide select-none">
                {outOfStockLabel}
              </span>
            ) : qty === 0 ? (
              <button
                onClick={handleAdd}
                aria-label="Add to cart"
                className="w-8 h-8 flex items-center justify-center rounded-md border border-[#253D2C]/40 text-[#596752] hover:bg-[#C64C32] hover:text-white transition-colors"
              >
                <Plus size={16} weight="bold" />
              </button>
            ) : (
              <div
                className="flex items-center min-h-[36px] rounded-lg border border-[#253D2C]/17 bg-[#F6F1E7] px-1.5 py-0.5 gap-1 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleRemove}
                  aria-label="Decrease quantity"
                  className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-md text-[#253D2C] hover:text-[#C64C32] transition-colors"
                >
                  <Minus size={14} weight="bold" />
                </button>
                <span className="text-center font-bold text-[#253D2C] w-5 text-xs">
                  {qty}
                </span>
                <button
                  onClick={handleAdd}
                  aria-label="Increase quantity"
                  className="min-w-[28px] min-h-[28px] flex items-center justify-center rounded-md text-[#253D2C] hover:text-[#354D37] transition-colors"
                >
                  <Plus size={14} weight="bold" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quantity Badge Over Thumbnail */}
        {qty > 0 && (
          <div className="absolute top-2.5 end-2.5 z-20 w-5 h-5 rounded-full bg-[#354D37] text-[#E4EADB] text-[10px] font-bold flex items-center justify-center border-2 border-[#FFFAF0] pointer-events-none">
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
