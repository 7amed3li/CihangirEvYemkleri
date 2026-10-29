"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { useMounted } from "@/hooks/useMounted";
import { useParams } from "next/navigation";
import { X, MagnifyingGlassPlus, Plus, Minus, ShareNetwork, Check } from "@phosphor-icons/react";
import { Wheat, Coffee, CupSoda, GlassWater } from "lucide-react";
import { CookingPot, StoneOven } from "./BrandIcons";
import { getDishDisplay } from "@/data/dishTranslations";

const HOT_BEVERAGES = new Set(["cay", "turk-kahvesi", "nescafe", "bitki-caylari"]);
const COLD_BEVERAGES = new Set(["ayran", "cola", "fanta", "meyve-sulari", "soda", "su"]);

function getBeverageType(id: string): "hot" | "cold" | null {
  if (HOT_BEVERAGES.has(id)) return "hot";
  if (COLD_BEVERAGES.has(id)) return "cold";
  return null;
}

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
  const isBeverage = getBeverageType(item?.id || "") !== null;
  const image = isBeverage ? undefined : (customImage || item?.image);
  const tags = item?.tags || [];
  const qty = getItemQuantity(item?.id);
  const isAvailable = item?.isAvailable !== false;

  const addToCartText =
    activeLang === "ar"
      ? "إضافة إلى السلة"
      : activeLang === "en"
      ? "Add to Basket"
      : activeLang === "ru"
      ? "В корзину"
      : activeLang === "de"
      ? "In den Warenkorb"
      : activeLang === "fr"
      ? "Ajouter au panier"
      : activeLang === "fa"
      ? "افزودن به سبد"
      : "Sepete Ekle";

  const closeText =
    activeLang === "ar"
      ? "إغلاق"
      : activeLang === "en"
      ? "Close"
      : activeLang === "ru"
      ? "Закрыть"
      : activeLang === "de"
      ? "Schließen"
      : activeLang === "fr"
      ? "Fermer"
      : activeLang === "fa"
      ? "بستن"
      : "Kapat";

  const currencyDisclaimerText =
    activeLang === "ar"
      ? "تنبيه قانوني: السعر بالعملة الأجنبية تقريبي استرشادي فقط. الحساب الرسمي والملزم قانونياً عند الدفع هو بالليرة التركية (₺) في المطعم."
      : activeLang === "en"
      ? "Legal Notice: Foreign currency amount is an indicative estimate only. The official and legally binding bill is strictly in Turkish Lira (₺)."
      : activeLang === "ru"
      ? "Юридическое примечание: Цена в иностранной валюте является ориентировочной. Официальный расчет производится строго в турецких лирах (₺)."
      : "Yasal Bilgilendirme: Döviz fiyatı yalnızca yaklaşık bilgilendirme amaçlıdır. Restoranda yasal ve bağlayıcı ödeme Türk Lirası (₺) iledir.";

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
            className="bg-[#FFFAF0] rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative border border-[#253D2C]/17 text-start"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Buttons: Share & Close */}
            <div className="absolute top-4 end-4 z-50 flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                aria-label="Copy link"
                className="w-9 h-9 flex items-center justify-center rounded-md bg-[#F6F1E7] text-[#253D2C] hover:text-[#C64C32] transition-colors border border-[#253D2C]/14 shadow-xs"
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
                className="w-9 h-9 flex items-center justify-center rounded-md bg-[#F6F1E7] text-[#253D2C] hover:text-[#C64C32] transition-colors border border-[#253D2C]/14 shadow-xs"
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
                  className="absolute bottom-4 end-4 z-20 w-9 h-9 flex items-center justify-center rounded-md bg-[#253D2C] text-white hover:bg-[#C64C32] transition-all shadow-md"
                >
                  <MagnifyingGlassPlus size={16} weight="bold" />
                </button>
              </div>
            ) : (
              <div className="w-full h-28 sm:h-32 shrink-0 relative bg-gradient-to-br from-[#F6F1E7] via-[#FFFAF0] to-[#E5DAC4] border-b border-[#253D2C]/14 flex items-center justify-center text-[#596752]">
                <div className="w-14 h-14 rounded-full bg-[#FFFAF0] border border-[#253D2C]/17 flex items-center justify-center shadow-xs">
                  {getBeverageType(item?.id || "") === "hot" ? (
                    <Coffee size={28} />
                  ) : getBeverageType(item?.id || "") === "cold" ? (
                    item?.id === "su" || item?.id === "soda" ? (
                      <GlassWater size={28} />
                    ) : (
                      <CupSoda size={28} />
                    )
                  ) : item.id.includes("pide") ? (
                    <StoneOven size={32} />
                  ) : (
                    <CookingPot size={32} />
                  )}
                </div>
              </div>
            )}

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto no-scrollbar flex flex-col gap-4 text-start">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-0.5">
                  <h2
                    className="text-2xl font-bold text-[#253D2C] leading-tight"
                    style={{ fontFamily: "var(--font-cairo)" }}
                  >
                    {turkishTitle}
                  </h2>
                  {activeLang !== "tr" && localizedName && (
                    <span
                      className="text-sm font-semibold text-[#596752]"
                      style={{ fontFamily: isRTL ? "var(--font-cairo)" : "var(--font-inter)" }}
                    >
                      {localizedName}
                    </span>
                  )}
                </div>
                {displayPrice != null && (
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span
                      className="flex items-center gap-1 text-lg font-bold text-white bg-[#C64C32] px-3 py-1 rounded-md shadow-xs"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {symbol !== "₺" ? `≈ ${displayPrice} ${symbol}` : `${item?.price} ₺`}
                    </span>
                    {symbol !== "₺" && (
                      <span className="text-[11px] font-bold text-[#C64C32]">
                        {item?.price} ₺ ({activeLang === "ar" ? "السعر الرسمي" : activeLang === "en" ? "Official Price" : "Esas Fiyat"})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {symbol !== "₺" && (
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                  {currencyDisclaimerText}
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.includes("signature") && (
                    <span className="px-2.5 py-0.5 bg-[#253D2C]/7 text-[#C64C32] border border-[#253D2C]/17 text-xs font-bold rounded-md uppercase tracking-wider">
                      Şefin Seçimi
                    </span>
                  )}
                  {tags.includes("trending") && (
                    <span className="px-2.5 py-0.5 bg-[#253D2C]/7 text-[#C64C32] border border-[#253D2C]/17 text-xs font-bold rounded-md uppercase tracking-wider">
                      En Çok Satan
                    </span>
                  )}
                  {tags.includes("spicy") && (
                    <span className="px-2.5 py-0.5 bg-[#C64C32]/15 text-[#C64C32] border border-[#C64C32]/30 text-xs font-bold rounded-md uppercase tracking-wider">
                      Acılı
                    </span>
                  )}
                  {tags.includes("gluten-free") && (
                    <span className="px-2.5 py-0.5 bg-[#4A6350]/15 text-[#293F30] border border-[#4A6350]/35 text-xs font-bold rounded-md uppercase tracking-wider flex items-center gap-1.5">
                      <Wheat size={14} className="text-[#293F30]" />
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
                    <span className="px-2.5 py-0.5 bg-[#354D37]/15 text-[#354D37] border border-[#354D37]/30 text-xs font-bold rounded-md uppercase tracking-wider">
                      Vejetaryen
                    </span>
                  )}
                </div>
              )}

              {/* Description */}
              {formattedDesc && (
                <div className="mt-1">
                  <h4
                    className="text-xs font-bold text-[#C64C32] mb-1 uppercase tracking-widest"
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
                    className="text-[#76816E] leading-relaxed text-sm font-medium"
                    style={{ fontFamily: isRTL ? "var(--font-cairo)" : "var(--font-inter)" }}
                  >
                    {activeLang !== "tr" ? (
                      <>
                        <span className="font-bold text-[#253D2C]">{localizedName}: </span>
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
                  <div className="flex items-center justify-center px-6 py-2.5 rounded-md bg-[#C64C32]/10 border border-[#C64C32]/30 text-[#C64C32] font-bold text-sm tracking-wide">
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
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-[#354D37] text-[#E4EADB] hover:bg-[#293F30] transition-colors font-bold text-sm shadow-xs cursor-pointer"
                  >
                    <Plus size={16} weight="bold" />
                    <span>{addToCartText}</span>
                  </button>
                ) : (
                  <div className="flex items-center min-h-[44px] rounded-lg border border-[#253D2C]/17 bg-[#F6F1E7] px-2 py-1 gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-md text-[#253D2C] hover:text-[#C64C32]"
                    >
                      <Minus size={16} weight="bold" />
                    </button>
                    <span className="font-bold text-[#253D2C] px-2">{qty}</span>
                    <button
                      onClick={() =>
                        addToCart({
                          id: item.id,
                          name: turkishTitle,
                          price: item.price,
                          image: item.image,
                        })
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-md text-[#253D2C] hover:text-[#354D37]"
                    >
                      <Plus size={16} weight="bold" />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-2 w-full py-2.5 rounded-md bg-[#F6F1E7] text-[#253D2C] font-bold hover:bg-[#C64C32] hover:text-white transition-colors border border-[#253D2C]/17 text-xs uppercase tracking-wider cursor-pointer"
              >
                {closeText}
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
              className="absolute top-6 end-6 z-[9999999] w-12 h-12 flex items-center justify-center rounded-full bg-[#F6F1E7] text-[#253D2C] hover:bg-[#C64C32] hover:text-white transition-all shadow-lg"
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
