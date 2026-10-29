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
import { Info } from "lucide-react";
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
            className="pointer-events-auto w-full max-w-lg bg-[#253D2C] hover:bg-[#3D372E] text-[#FFFAF0] p-2.5 sm:p-3 rounded-2xl shadow-2xl border-2 border-[#253D2C]/40 flex items-center justify-between transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
          >
            {/* Left side: Icon + Counter */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-xl bg-[#C64C32] text-[#FFFAF0] flex items-center justify-center shrink-0 shadow-xs">
                <ShoppingBag size={20} weight="bold" />
                <span className="absolute -top-1.5 -end-1.5 bg-[#C64C32] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#253D2C]">
                  {cartCount}
                </span>
              </div>
              <div className="flex flex-col text-start">
                <span
                  className="text-xs sm:text-sm font-bold text-[#FFFAF0] leading-tight"
                  style={{ fontFamily: "var(--font-cairo)" }}
                >
                  {cartTitle}
                </span>
                <span
                  className="text-[11px] text-[#F6F1E7]/80"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {cartCount} {lang === "ar" ? "أصناف" : lang === "en" ? "items" : "ürün"}
                </span>
              </div>
            </div>

            {/* Right side: Price + View Cart Arrow */}
            <div className="flex items-center gap-2">
              <div
                className="px-3 py-1 rounded-lg bg-[#FFFAF0]/10 border border-[#253D2C]/24 text-sm font-black text-[#F6F1E7] tracking-wide"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {displayTotal} {symbol}
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#C64C32] text-white flex items-center justify-center shrink-0">
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
              className="w-full max-w-md h-full bg-[#FFFAF0] shadow-2xl flex flex-col border-s border-[#253D2C]/17 overflow-hidden text-start animate-slideInRight"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-[#253D2C]/12 bg-[#FFFAF0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#C64C32] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShoppingBag size={20} weight="bold" />
                  </div>
                  <div>
                    <h2
                      className="text-base sm:text-lg font-black text-[#253D2C] leading-none"
                      style={{ fontFamily: "var(--font-cairo)" }}
                    >
                      {cartTitle}
                    </h2>
                    <span
                      className="text-[11px] text-[#76816E] font-medium"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {cartCount} {lang === "ar" ? "أصناف محددة" : lang === "en" ? "items in basket" : "ürün"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close cart"
                  className="w-8 h-8 rounded-lg bg-[#F6F1E7] hover:bg-[#C64C32] hover:text-white text-[#253D2C] flex items-center justify-center transition-colors"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Kitchen Note Badge */}
              <div className="bg-[#253D2C]/5 border-b border-[#253D2C]/12 px-4 py-2 text-[11px] text-[#596752] leading-relaxed flex items-center gap-1.5">
                <Info size={14} className="text-[#596752] shrink-0" />
                <p style={{ fontFamily: isRTL ? "var(--font-cairo)" : "var(--font-inter)" }}>
                  {noteText}
                </p>
              </div>

              {/* Drawer Body: Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#76816E]">
                    <div className="w-16 h-16 rounded-full bg-[#F6F1E7] flex items-center justify-center text-[#596752] mb-3">
                      <CookingPot size={32} />
                    </div>
                    <p
                      className="text-base font-bold text-[#253D2C] mb-1"
                      style={{ fontFamily: "var(--font-cairo)" }}
                    >
                      {emptyText}
                    </p>
                    <p className="text-xs text-[#76816E] max-w-xs">{emptySub}</p>
                  </div>
                ) : (
                  cart.map((item) => {
                    const itemSubtotal = convertPrice(item.priceTRY * item.qty);
                    const itemUnit = convertPrice(item.priceTRY);

                    return (
                      <div
                        key={item.id}
                        className="bg-[#FFFAF0] border border-[#253D2C]/14 rounded-xl p-3 flex items-center gap-3 shadow-xs hover:border-[#253D2C]/30 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-lg bg-[#F6F1E7] overflow-hidden shrink-0 relative flex items-center justify-center border border-[#253D2C]/9">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name || "Yemek"}
                              fill
                              style={{ objectFit: "cover" }}
                              sizes="56px"
                            />
                          ) : (
                            <div className="text-[#596752]/60">
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
                            className="font-bold text-sm text-[#253D2C] leading-snug truncate"
                            style={{ fontFamily: "var(--font-cairo)" }}
                          >
                            {item.name || item.id}
                          </h4>
                          <div
                            className="text-xs text-[#596752] font-bold mt-0.5"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {itemUnit} {symbol}
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center bg-[#F6F1E7] rounded-lg border border-[#253D2C]/17 px-1 py-0.5 gap-1 shrink-0">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Decrease quantity"
                            className="w-6 h-6 flex items-center justify-center rounded text-[#253D2C] hover:text-[#C64C32] transition-colors"
                          >
                            <Minus size={12} weight="bold" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-[#253D2C]">
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
                            className="w-6 h-6 flex items-center justify-center rounded text-[#253D2C] hover:text-[#354D37] transition-colors"
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
                <div className="p-4 sm:p-5 border-t border-[#253D2C]/14 bg-[#FFFAF0] space-y-3">
                  {/* Total calculation with Primary TRY */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-bold text-[#76816E]"
                        style={{ fontFamily: "var(--font-cairo)" }}
                      >
                        {lang === "ar" ? "المجموع بالليرة التركية:" : lang === "en" ? "Total in TRY:" : "Toplam Tutar (TRY):"}
                      </span>
                      <span
                        className="text-xl font-black text-[#253D2C]"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {cartTotalTRY} ₺
                      </span>
                    </div>

                    {symbol !== "₺" && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span>{lang === "ar" ? "السعر التقديري بالعملة:" : lang === "en" ? "Estimated Currency Total:" : "Yaklaşık Döviz Tutarı:"}</span>
                          <span className="text-sm font-black text-[#C64C32]">≈ {displayTotal} {symbol}</span>
                        </div>
                        <p className="text-[11px] text-amber-800">
                          {lang === "ar"
                            ? `⚠️ تنبيه قانوني: الحساب الرسمي والملزم قانونياً عند الدفع هو بالليرة التركية (₺) فقط بمبلغ ${cartTotalTRY} ₺. أسعار العملات الأخرى تقريبية استرشادية.`
                            : lang === "en"
                            ? `⚠️ Legal Notice: The official and legally binding payment at the restaurant is strictly in Turkish Lira (${cartTotalTRY} ₺). Foreign currency amounts are indicative estimates only.`
                            : lang === "ru"
                            ? `⚠️ Юридическое примечание: Официальный счет к оплате составляет строго ${cartTotalTRY} ₺. Суммы в валюте ориентировочные.`
                            : `⚠️ Yasal Bilgilendirme: Masada geçerli ve yasal olarak bağlayıcı tutar istisnasız Türk Lirası (${cartTotalTRY} ₺)'dir. Döviz karşılığı yalnızca yaklaşık göstergedir.`}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-[#76816E] leading-tight text-center">
                    {lang === "ar"
                      ? "يتم الدفع بالليرة التركية نقداً أو بالبطاقة عند الطاولة أو عند الاستلام سفري (Gel-Al)."
                      : lang === "en"
                      ? "Payment is settled in TRY at the table or upon pick-up by cash or credit/debit card."
                      : "Ödeme masada veya gel-al tesliminde nakit veya kredi/banka kartı ile yapılır."}
                  </p>

                  {/* Direct Phone Call - Primary reliable channel */}
                  <a
                    href="tel:+902122513696"
                    className="w-full py-3 px-4 rounded-xl bg-[#354D37] hover:bg-[#293F30] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                    style={{ fontFamily: "var(--font-cairo)" }}
                  >
                    <PhoneCall size={18} weight="bold" />
                    <span>
                      {lang === "ar"
                        ? "الاتصال لتأكيد الطلب فوراً: 251 36 96 (0212)"
                        : lang === "en"
                        ? "Call to Confirm Order: +90 212 251 36 96"
                        : "Siparişi Hemen Ara: 0212 251 36 96"}
                    </span>
                  </a>

                  {/* WhatsApp Order Button */}
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366] text-[#1E7E34] hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                    style={{ fontFamily: "var(--font-cairo)" }}
                  >
                    <WhatsappLogo size={18} weight="fill" />
                    <span>
                      {lang === "ar"
                        ? "تجهيز رسالة الطلب عبر واتساب (WhatsApp)"
                        : lang === "en"
                        ? "Prepare Order Message for WhatsApp"
                        : "Sipariş Metnini WhatsApp ile Gönder"}
                    </span>
                  </button>

                  {/* Clear cart */}
                  <div className="text-center pt-1">
                    <button
                      onClick={clearCart}
                      className="text-[11px] font-semibold text-[#C64C32] hover:underline transition-colors"
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
