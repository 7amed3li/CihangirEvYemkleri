"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { useMounted } from "@/hooks/useMounted";
import { useParams } from "next/navigation";
import { X, MagnifyingGlassPlus, Plus, Minus, ShareNetwork, Check } from "@phosphor-icons/react";
import Twemoji from "./Twemoji";
import { CookingPot, StoneOven } from "./BrandIcons";
import { getDishDisplay } from "@/data/dishTranslations";

interface DishModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  item: {
    id: string;
    name?: any;
    price: number;
    image?: string;
    description?: string;
    descriptions?: any;
    tags?: string[];
    isAvailable?: boolean;
  };
  customName?: string;
  customDesc?: string;
  customImage?: string;
}

export default function DishModal({
  isOpen,
  setIsOpen,
  item,
  customName,
  customDesc,
  customImage,
}: DishModalProps) {
  const { convertPrice, getCurrencySymbol, addToCart, removeFromCart, getItemQuantity, lang } =
    useAppContext();
  const isMounted = useMounted();
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const params = useParams();
  const activeLang =
    (typeof params?.locale === "string" ? params.locale : null) ||
    lang ||
    "tr";

  const { turkishTitle, localizedName, localizedDesc, formattedDesc } =
    getDishDisplay(item, activeLang);

  const isRTL = activeLang === "ar" || activeLang === "fa";
  const displayPrice = convertPrice(item?.price);
  const symbol = getCurrencySymbol();
  const image = customImage || item?.image;
  const tags = item?.tags || [];
  const qty = getItemQuantity(item?.id);
  const isAvailable = item?.isAvailable !== false;

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const baseUrl = window.location.origin;
      const dishUrl = `/${activeLang}/dish/${item.id}`;
      await navigator.clipboard.writeText(`${baseUrl}${dishUrl}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (!isOpen || !isMounted) return null;

  return (
    <>
      {createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            dir={isRTL ? "rtl" : "ltr"}
            className="bg-[#F7F2E7] rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative border border-[#9C7A3F]/30 text-start"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Buttons: Share & Close */}
            <div className="absolute top-4 end-4 z-50 flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                aria-label="Copy link"
                className="w-9 h-9 flex items-center justify-center rounded-md bg-[#EDE3CE] text-[#2B2620] hover:text-[#9C7A3F] transition-colors border border-[#9C7A3F]/25 shadow-xs"
              >
                {isCopied ? (
                  <Check size={16} weight="bold" className="text-green-600" />
                ) : (
                  <ShareNetwork size={16} weight="regular" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close modal"
                className="w-9 h-9 flex items-center justify-center rounded-md bg-[#EDE3CE] text-[#2B2620] hover:text-[#9C7A3F] transition-colors border border-[#9C7A3F]/25 shadow-xs"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Modal Image or Decorative Header */}
            {image ? (
              <div className="w-full h-56 sm:h-72 shrink-0 relative bg-white group">
                <Image
                  src={image}
                  alt={turkishTitle}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <button
                  onClick={() => setIsFullscreenImage(true)}
                  aria-label="View fullscreen"
                  className="absolute bottom-4 end-4 z-20 w-9 h-9 flex items-center justify-center rounded-md bg-[#2B2620] text-white hover:bg-[#9C7A3F] transition-all shadow-md"
                >
                  <MagnifyingGlassPlus size={16} weight="bold" />
                </button>
              </div>
            ) : (
              <div className="w-full h-36 shrink-0 relative bg-gradient-to-br from-[#EDE3CE] to-[#F7F2E7] border-b border-[#9C7A3F]/25 flex items-center justify-center text-[#9C7A3F]">
                {item.id.includes("pide") ? (
                  <StoneOven size={48} />
                ) : (
                  <CookingPot size={48} />
                )}
              </div>
            )}

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto no-scrollbar flex flex-col gap-4 text-start">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-0.5">
                  <h2
                    className="text-2xl font-bold text-[#2B2620] leading-tight"
                    style={{ fontFamily: "var(--font-cairo)" }}
                  >
                    {turkishTitle}
                  </h2>
                  {activeLang !== "tr" && localizedName && (
                    <span
                      className="text-sm font-semibold text-[#9C7A3F]"
                      style={{ fontFamily: isRTL ? "var(--font-cairo)" : "var(--font-inter)" }}
                    >
                      {localizedName}
                    </span>
                  )}
                </div>
                {displayPrice != null && (
                  <span
                    className="shrink-0 flex items-center gap-1 text-lg font-bold text-white bg-[#9C7A3F] px-3 py-1 rounded-md shadow-xs"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {displayPrice} {symbol}
                  </span>
                )}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.includes("signature") && (
                    <span className="px-2.5 py-0.5 bg-[#9C7A3F]/15 text-[#9C7A3F] border border-[#9C7A3F]/30 text-xs font-bold rounded-md uppercase tracking-wider">
                      Şefin Seçimi
                    </span>
                  )}
                  {tags.includes("trending") && (
                    <span className="px-2.5 py-0.5 bg-[#B8860B]/15 text-[#B8860B] border border-[#B8860B]/30 text-xs font-bold rounded-md uppercase tracking-wider">
                      En Çok Satan
                    </span>
                  )}
                  {tags.includes("spicy") && (
                    <span className="px-2.5 py-0.5 bg-[#A0422E]/15 text-[#A0422E] border border-[#A0422E]/30 text-xs font-bold rounded-md uppercase tracking-wider">
                      Acılı
                    </span>
                  )}
                  {tags.includes("gluten-free") && (
                    <span className="px-2.5 py-0.5 bg-[#5C6E58]/15 text-[#3E523A] border border-[#5C6E58]/35 text-xs font-bold rounded-md uppercase tracking-wider flex items-center gap-1.5">
                      <Twemoji emoji="🌾" size={14} />
                      <span>
                        {activeLang === "ar"
                          ? "خالي من الغلوتين"
                          : activeLang === "en"
                          ? "Gluten-Free"
                          : "Glütensiz"}
                      </span>
                    </span>
                  )}
                  {tags.includes("vegetarian") && (
                    <span className="px-2.5 py-0.5 bg-[#4E5F4C]/15 text-[#4E5F4C] border border-[#4E5F4C]/30 text-xs font-bold rounded-md uppercase tracking-wider">
                      Vejetaryen
                    </span>
                  )}
                </div>
              )}

              {/* Description */}
              {formattedDesc && (
                <div className="mt-1">
                  <h4
                    className="text-xs font-bold text-[#9C7A3F] mb-1 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-cairo)" }}
                  >
                    {activeLang === "ar"
                      ? "التفاصيل والمكونات"
                      : activeLang === "fa"
                      ? "جزئیات و ترکیبات"
                      : activeLang === "ru"
                      ? "Описание и состав"
                      : activeLang === "zh"
                      ? "菜品详情与风味"
                      : activeLang === "fr"
                      ? "Détails & Ingrédients"
                      : activeLang === "de"
                      ? "Details & Zutaten"
                      : activeLang === "it"
                      ? "Dettagli & Ingredienti"
                      : activeLang === "es"
                      ? "Detalles e Ingredientes"
                      : activeLang === "en"
                      ? "Details & Description"
                      : "Detaylar"}
                  </h4>
                  <p
                    className="text-[#7A7364] leading-relaxed text-sm font-medium"
                    style={{ fontFamily: isRTL ? "var(--font-cairo)" : "var(--font-inter)" }}
                  >
                    {activeLang !== "tr" ? (
                      <>
                        <span className="font-bold text-[#2B2620]">{localizedName}: </span>
                        {localizedDesc}
                      </>
                    ) : (
                      localizedDesc
                    )}
                  </p>
                </div>
              )}

              {/* Counter Controls */}
              <div className="mt-3 flex items-center justify-center">
                {!isAvailable ? (
                  <div className="flex items-center justify-center px-6 py-2.5 rounded-md bg-[#A0422E]/10 border border-[#A0422E]/30 text-[#A0422E] font-bold text-sm tracking-wide">
                    <span>
                      {lang === "ar"
                        ? "غير متوفر حالياً"
                        : lang === "en"
                        ? "Currently Out of Stock"
                        : "Şu Anda Tükendi"}
                    </span>
                  </div>
                ) : qty === 0 ? (
                  <button
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: turkishTitle,
                        price: item.price,
                        image: item.image,
                      })
                    }
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-[#4E5F4C] text-[#EAF0E6] hover:bg-[#3D4B3B] transition-colors font-bold text-sm shadow-xs"
                  >
                    <Plus size={16} weight="bold" />
                    <span>Sepete Ekle</span>
                  </button>
                ) : (
                  <div className="flex items-center min-h-[44px] rounded-lg border border-[#9C7A3F]/30 bg-[#EDE3CE] px-2 py-1 gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-[#2B2620] hover:text-[#A0422E]"
                    >
                      <Minus size={16} weight="bold" />
                    </button>
                    <span className="font-bold text-[#2B2620] px-2">{qty}</span>
                    <button
                      onClick={() =>
                        addToCart({
                          id: item.id,
                          name: turkishTitle,
                          price: item.price,
                          image: item.image,
                        })
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-md text-[#2B2620] hover:text-[#4E5F4C]"
                    >
                      <Plus size={16} weight="bold" />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-2 w-full py-2.5 rounded-md bg-[#EDE3CE] text-[#2B2620] font-bold hover:bg-[#9C7A3F] hover:text-white transition-colors border border-[#9C7A3F]/30 text-xs uppercase tracking-wider"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Fullscreen Image Overlay */}
      {isFullscreenImage && image &&
        createPortal(
          <div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
            onClick={() => setIsFullscreenImage(false)}
          >
            <button
              onClick={() => setIsFullscreenImage(false)}
              className="absolute top-6 end-6 z-[9999999] w-12 h-12 flex items-center justify-center rounded-full bg-[#EDE3CE] text-[#2B2620] hover:bg-[#9C7A3F] hover:text-white transition-all shadow-lg"
            >
              <X size={24} weight="bold" />
            </button>
            <div
              className="relative w-full h-full max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={image}
                alt={turkishTitle}
                fill
                style={{ objectFit: "contain" }}
                sizes="100vw"
                quality={100}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
