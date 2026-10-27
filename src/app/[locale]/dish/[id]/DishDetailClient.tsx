"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Plus, Minus, ShareNetwork, Check } from "@phosphor-icons/react";
import { Wheat } from "lucide-react";
import CartDrawer from "@/components/CartDrawer";

interface DishDetailClientProps {
  item: {
    id: string;
    price: number;
    image?: string;
    tags?: string[];
    isAvailable?: boolean;
  };
  locale: string;
  turkishTitle: string;
  localizedName: string;
  localizedDesc: string;
  formattedDesc: string;
  isRTL: boolean;
}

export default function DishDetailClient({
  item,
  locale,
  turkishTitle,
  localizedName,
  localizedDesc,
  formattedDesc,
  isRTL,
}: DishDetailClientProps) {
  const { convertPrice, getCurrencySymbol, addToCart, removeFromCart, getItemQuantity } =
    useAppContext();
  const [isCopied, setIsCopied] = useState(false);

  const displayPrice = convertPrice(item.price);
  const symbol = getCurrencySymbol();
  const qty = getItemQuantity(item.id);
  const isAvailable = item.isAvailable !== false;
  const tags = item.tags || [];

  const handleCopyLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleAdd = () => {
    // Rule: item in cart must ALWAYS be in Turkish
    addToCart({
      id: item.id,
      name: turkishTitle,
      price: item.price,
      image: item.image,
    });
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const shareText =
    locale === "ar"
      ? "مشاركة الطبق"
      : locale === "en"
      ? "Share Dish"
      : "Paylaş";

  const copiedText =
    locale === "ar"
      ? "تم نسخ الرابط!"
      : locale === "en"
      ? "Link Copied!"
      : "Kopyalandı!";

  const addToCartText =
    locale === "ar"
      ? "إضافة إلى السلة"
      : locale === "en"
      ? "Add to Basket"
      : "Sepete Ekle";

  const detailsLabel =
    locale === "ar"
      ? "تفاصيل الطبق"
      : locale === "en"
      ? "Details"
      : "Detaylar";

  return (
    <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
      <div>
        {/* Title & Share Button */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-[#253D2C] leading-tight"
              style={{ fontFamily: "var(--font-cairo)" }}
            >
              {turkishTitle}
            </h1>
            {locale !== "tr" && localizedName && (
              <p className="text-sm sm:text-base font-semibold text-[#76816E] mt-0.5">
                {localizedName}
              </p>
            )}
          </div>

          <button
            onClick={handleCopyLink}
            aria-label="Share"
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6F1E7] hover:bg-[#C64C32] hover:text-white text-[#253D2C] text-xs font-bold transition-all border border-[#253D2C]/14 cursor-pointer shadow-2xs"
          >
            {isCopied ? (
              <>
                <Check size={14} weight="bold" className="text-green-600" />
                <span className="text-green-700 font-bold">{copiedText}</span>
              </>
            ) : (
              <>
                <ShareNetwork size={14} weight="bold" />
                <span>{shareText}</span>
              </>
            )}
          </button>
        </div>

        {/* Live Converted Price & Tags */}
        <div className="flex items-center gap-3 my-4">
          <div
            className="px-3.5 py-1.5 bg-[#C64C32] text-[#E4EADB] font-extrabold text-lg sm:text-xl rounded-lg shadow-xs"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {displayPrice != null ? (
              <>
                {displayPrice} {symbol}
              </>
            ) : (
              "-"
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {tags.includes("signature") && (
              <span className="px-2.5 py-1 bg-[#253D2C]/7 text-[#C64C32] border border-[#253D2C]/17 text-xs font-bold rounded-md uppercase tracking-wider">
                Şefin Seçimi
              </span>
            )}
            {tags.includes("gluten-free") && (
              <span className="px-2.5 py-1 bg-[#4A6350]/15 text-[#293F30] border border-[#4A6350]/35 text-xs font-bold rounded-md uppercase tracking-wider flex items-center gap-1.5">
                <Wheat size={13} className="text-[#293F30]" />
                <span>
                  {locale === "ar"
                    ? "خالي من الغلوتين"
                    : locale === "en"
                    ? "Gluten-Free"
                    : "Glütensiz"}
                </span>
              </span>
            )}
            {tags.includes("vegetarian") && (
              <span className="px-2.5 py-1 bg-[#354D37]/15 text-[#354D37] border border-[#354D37]/30 text-xs font-bold rounded-md uppercase tracking-wider">
                Vejetaryen
              </span>
            )}
            {tags.includes("spicy") && (
              <span className="px-2.5 py-1 bg-[#C64C32]/15 text-[#C64C32] border border-[#C64C32]/30 text-xs font-bold rounded-md uppercase tracking-wider">
                Acılı
              </span>
            )}
          </div>
        </div>

        {/* Description formatted according to user rule */}
        <div className="mt-4 pt-4 border-t border-[#253D2C]/12">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#C64C32] mb-1.5">
            {detailsLabel}
          </h3>
          <p
            className="text-sm sm:text-base text-[#3F5442] leading-relaxed"
            style={{ fontFamily: isRTL ? "var(--font-cairo)" : "var(--font-inter)" }}
          >
            {formattedDesc}
          </p>
        </div>
      </div>

      {/* Cart Actions */}
      <div className="mt-8 pt-4 border-t border-[#253D2C]/12">
        {!isAvailable ? (
          <div className="w-full py-3 text-center bg-[#C64C32]/15 text-[#C64C32] font-bold rounded-xl border border-[#C64C32]/30 text-sm">
            {locale === "ar" ? "الطبق غير متوفر حالياً" : "Şu an mevcut değil"}
          </div>
        ) : qty > 0 ? (
          <div className="flex items-center justify-between bg-[#F6F1E7] border border-[#354D37]/30 rounded-xl p-1.5">
            <button
              onClick={handleRemove}
              className="w-10 h-10 rounded-lg bg-[#FFFAF0] hover:bg-[#C64C32] hover:text-white text-[#253D2C] flex items-center justify-center font-bold transition-colors cursor-pointer"
            >
              <Minus size={18} weight="bold" />
            </button>
            <span className="font-extrabold text-base text-[#253D2C]">
              {qty}
            </span>
            <button
              onClick={handleAdd}
              className="w-10 h-10 rounded-lg bg-[#354D37] hover:bg-[#293F30] text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
            >
              <Plus size={18} weight="bold" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="w-full py-3.5 px-4 bg-[#354D37] hover:bg-[#293F30] text-white font-extrabold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Plus size={18} weight="bold" />
            <span>{addToCartText}</span>
          </button>
        )}
      </div>

      {/* Floating Bottom Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
