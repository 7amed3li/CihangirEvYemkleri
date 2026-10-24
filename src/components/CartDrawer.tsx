"use client";

import React, { useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useAppContext } from "@/context/AppContext";
import { useMounted } from "@/hooks/useMounted";
import {
  X,
  Plus,
  Minus,
  Trash,
  WhatsappLogo,
  PhoneCall,
  ShoppingBag,
  ArrowRight,
  CaretRight,
} from "@phosphor-icons/react";
import Twemoji from "./Twemoji";
import { CookingPot, StoneOven } from "./BrandIcons";

export default function CartDrawer() {
  const {
    cart,
    cartCount,
    cartTotalTRY,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    clearCart,
    convertPrice,
    getCurrencySymbol,
    lang,
  } = useAppContext();

  const isMounted = useMounted();
  const isRTL = lang === "ar" || lang === "fa";
  const symbol = getCurrencySymbol();
  const displayTotal = convertPrice(cartTotalTRY);

  if (!isMounted) return null;

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const itemsList = cart
      .map(
        (i) =>
          `• ${i.qty}x ${i.name || i.id} - ${convertPrice(i.priceTRY * i.qty)} ${symbol}`
      )
      .join("\n");

    const message = `Merhaba Cihangir Ev Yemekleri,\nSipariş vermek istiyorum:\n\n${itemsList}\n\nToplam Tutar: ${displayTotal} ${symbol}\n\nTeşekkürler!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/902122513696?text=${encoded}`, "_blank");
  };

  const cartTitle =
    lang === "ar"
      ? "سلة الطلبات"
      : lang === "ru"
      ? "Корзина заказов"
      : lang === "fa"
      ? "سبد سفارش"
      : lang === "fr"
      ? "Panier de commande"
      : lang === "de"
      ? "Bestellübersicht"
      : lang === "zh"
      ? "点餐购物车"
      : lang === "en"
      ? "Order Basket"
      : "Sipariş Sepeti";

  const emptyText =
    lang === "ar"
      ? "سلة الطلبات فارغة حالياً"
      : lang === "en"
      ? "Your basket is currently empty"
      : "Sepetiniz henüz boş";

  const emptySub =
    lang === "ar"
      ? "يمكنك تصفح القائمة وإضافة أشهى الأطباق التركية"
      : lang === "en"
      ? "Explore our delicious home-style menu and add your favorite dishes"
      : "Menümüzden dilediğiniz ev yemeklerini ve pideleri ekleyebilirsiniz";

  const noteText =
    lang === "ar"
      ? "تظهر أسماء الأطباق باللغة التركية في السلة لتسهيل التواصل مع طاقم المطعم والمطبخ."
      : lang === "fa"
      ? "نام غذاها در سبد به زبان ترکی نمایش داده می‌شود تا سفارش به راحتی به آشپزخانه منتقل شود."
      : lang === "ru"
      ? "Названия блюд в корзине отображаются на турецком языке для точного заказа на кухне."
      : lang === "zh"
      ? "购物车内菜品名称按土耳其语原文显示，方便后厨与侍者精准对接。"
      : lang === "fr"
      ? "Les noms des plats sont affichés en turc pour faciliter la commande en cuisine."
      : lang === "de"
      ? "Die Gerichte werden im Warenkorb auf Türkisch angezeigt für eine reibungslose Bestellung."
      : lang === "en"
      ? "Dish names in the basket are displayed in Turkish for accurate ordering with restaurant staff."
      : "Yemekler mutfağa ve servis personeline Türkçe isimleriyle iletilir.";

  return (
    <>
      {/* 1. Floating Bottom Cart Bar (appears when items are in cart) */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none flex justify-center animate-bounce-slight">
          <button
            onClick={() => setIsCartOpen(true)}
            dir={isRTL ? "rtl" : "ltr"}
            className="pointer-events-auto w-full max-w-lg bg-[#2B2620] hover:bg-[#3D372E] text-[#F7F2E7] p-2.5 sm:p-3 rounded-2xl shadow-2xl border-2 border-[#9C7A3F] flex items-center justify-between transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
          >
            {/* Left side: Icon + Counter */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-xl bg-[#9C7A3F] text-[#F7F2E7] flex items-center justify-center shrink-0 shadow-xs">
                <ShoppingBag size={20} weight="bold" />
                <span className="absolute -top-1.5 -end-1.5 bg-[#A0422E] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#2B2620]">
                  {cartCount}
                </span>
              </div>
              <div className="flex flex-col text-start">
                <span
                  className="text-xs sm:text-sm font-bold text-[#F7F2E7] leading-tight"
                  style={{ fontFamily: "var(--font-cairo)" }}
                >
                  {cartTitle}
                </span>
                <span
                  className="text-[11px] text-[#EDE3CE]/80"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {cartCount} {lang === "ar" ? "أصناف" : lang === "en" ? "items" : "ürün"}
                </span>
              </div>
            </div>

            {/* Right side: Price + View Cart Arrow */}
            <div className="flex items-center gap-2">
              <div
                className="px-3 py-1 rounded-lg bg-[#F7F2E7]/10 border border-[#9C7A3F]/40 text-sm font-black text-[#EDE3CE] tracking-wide"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {displayTotal} {symbol}
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#9C7A3F] text-white flex items-center justify-center shrink-0">
                <CaretRight
                  size={16}
                  weight="bold"
                  className={isRTL ? "-scale-x-100" : ""}
                />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* 2. Slide-Over Cart Drawer */}
      {isCartOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex justify-end bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          >
            <div
              dir={isRTL ? "rtl" : "ltr"}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md h-full bg-[#F7F2E7] shadow-2xl flex flex-col border-s border-[#9C7A3F]/30 overflow-hidden text-start animate-slideInRight"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-[#9C7A3F]/20 bg-[#FAF7F0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#9C7A3F] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShoppingBag size={20} weight="bold" />
                  </div>
                  <div>
                    <h2
                      className="text-base sm:text-lg font-black text-[#2B2620] leading-none"
                      style={{ fontFamily: "var(--font-cairo)" }}
                    >
                      {cartTitle}
                    </h2>
                    <span
                      className="text-[11px] text-[#7A7364] font-medium"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {cartCount} {lang === "ar" ? "أصناف محددة" : lang === "en" ? "items in basket" : "ürün"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close cart"
                  className="w-8 h-8 rounded-lg bg-[#EDE3CE] hover:bg-[#9C7A3F] hover:text-white text-[#2B2620] flex items-center justify-center transition-colors"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Kitchen Note Badge */}
              <div className="bg-[#9C7A3F]/10 border-b border-[#9C7A3F]/20 px-4 py-2 text-[11px] text-[#5A5344] leading-relaxed flex items-center gap-1.5">
                <Twemoji emoji="💡" size={14} />
                <p style={{ fontFamily: isRTL ? "var(--font-cairo)" : "var(--font-inter)" }}>
                  {noteText}
                </p>
              </div>

              {/* Drawer Body: Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#7A7364]">
                    <div className="w-16 h-16 rounded-full bg-[#EDE3CE] flex items-center justify-center text-[#9C7A3F] mb-3">
                      <CookingPot size={32} />
                    </div>
                    <p
                      className="text-base font-bold text-[#2B2620] mb-1"
                      style={{ fontFamily: "var(--font-cairo)" }}
                    >
                      {emptyText}
                    </p>
                    <p className="text-xs text-[#7A7364] max-w-xs">{emptySub}</p>
                  </div>
                ) : (
                  cart.map((item) => {
                    const itemSubtotal = convertPrice(item.priceTRY * item.qty);
                    const itemUnit = convertPrice(item.priceTRY);

                    return (
                      <div
                        key={item.id}
                        className="bg-[#FAF7F0] border border-[#9C7A3F]/25 rounded-xl p-3 flex items-center gap-3 shadow-xs hover:border-[#9C7A3F]/50 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-lg bg-[#EDE3CE] overflow-hidden shrink-0 relative flex items-center justify-center border border-[#9C7A3F]/15">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name || "Yemek"}
                              fill
                              style={{ objectFit: "cover" }}
                              sizes="56px"
                            />
                          ) : (
                            <div className="text-[#9C7A3F]/60">
                              {item.id.includes("pide") ? (
                                <StoneOven size={24} />
                              ) : (
                                <CookingPot size={24} />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Title & Price - strictly Turkish */}
                        <div className="flex-1 min-w-0">
                          <h4
                            className="font-bold text-sm text-[#2B2620] leading-snug truncate"
                            style={{ fontFamily: "var(--font-cairo)" }}
                          >
                            {item.name || item.id}
                          </h4>
                          <div
                            className="text-xs text-[#9C7A3F] font-bold mt-0.5"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {itemUnit} {symbol}
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center bg-[#EDE3CE] rounded-lg border border-[#9C7A3F]/30 px-1 py-0.5 gap-1 shrink-0">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Decrease quantity"
                            className="w-6 h-6 flex items-center justify-center rounded text-[#2B2620] hover:text-[#A0422E] transition-colors"
                          >
                            <Minus size={12} weight="bold" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-[#2B2620]">
                            {item.qty}
                          </span>
                          <button
                            onClick={() =>
                              addToCart({
                                id: item.id,
                                name: item.name,
                                price: item.priceTRY,
                                image: item.image,
                              })
                            }
                            aria-label="Increase quantity"
                            className="w-6 h-6 flex items-center justify-center rounded text-[#2B2620] hover:text-[#4E5F4C] transition-colors"
                          >
                            <Plus size={12} weight="bold" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-[#9C7A3F]/25 bg-[#FAF7F0] space-y-3">
                  {/* Total calculation */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-bold text-[#7A7364]"
                      style={{ fontFamily: "var(--font-cairo)" }}
                    >
                      {lang === "ar" ? "المجموع الكلي:" : lang === "en" ? "Total Amount:" : "Toplam Tutar:"}
                    </span>
                    <span
                      className="text-xl font-black text-[#2B2620]"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {displayTotal} {symbol}
                    </span>
                  </div>

                  {/* WhatsApp Order Button */}
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                    style={{ fontFamily: "var(--font-cairo)" }}
                  >
                    <WhatsappLogo size={20} weight="fill" />
                    <span>
                      {lang === "ar"
                        ? "إرسال الطلب عبر واتساب (WhatsApp)"
                        : lang === "en"
                        ? "Order via WhatsApp"
                        : "WhatsApp ile Sipariş Ver"}
                    </span>
                  </button>

                  {/* Direct Phone Call */}
                  <a
                    href="tel:+902122513696"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#4E5F4C] hover:bg-[#3D4B3B] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                    style={{ fontFamily: "var(--font-cairo)" }}
                  >
                    <PhoneCall size={16} weight="bold" />
                    <span>
                      {lang === "ar"
                        ? "الاتصال بالمطعم مباشرة: 0212 251 36 96"
                        : lang === "en"
                        ? "Call Restaurant: +90 212 251 36 96"
                        : "Restoranı Ara: 0212 251 36 96"}
                    </span>
                  </a>

                  {/* Clear cart */}
                  <div className="text-center pt-1">
                    <button
                      onClick={clearCart}
                      className="text-[11px] font-semibold text-[#A0422E] hover:underline transition-colors"
                    >
                      {lang === "ar" ? "إفراغ السلة بالكامل" : lang === "en" ? "Clear entire basket" : "Sepeti Temizle"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
