"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Wifi, Signal, Battery, ShoppingBag, Plus, Check } from "lucide-react";

interface OrderDemoProps {
  lang: string;
}

const DEMO_CURRENCIES = [
  { code: "TRY", symbol: "₺", rate: 1 },
  { code: "USD", symbol: "$", rate: 0.026 },
  { code: "EUR", symbol: "€", rate: 0.024 },
  { code: "SAR", symbol: "﷼", rate: 0.098 },
];

const DEMO_ITEMS = {
  pots: [
    {
      id: "tas-kebabi",
      title: { tr: "Geleneksel Tas Kebabı", en: "Traditional Tas Kebab", ar: "كباب حلة تقليدي" },
      subtitle: { tr: "Lokum gibi dana eti & patates", en: "Tender beef & roasted potatoes", ar: "لحم بقري شهي مع البطاطس" },
      basePrice: 420,
      image: "/images/products/tas-kebabi-350.jpg",
      tag: { tr: "ŞEFİN ÖNERİSİ", en: "CHEF'S PICK", ar: "اختيار الشيف" },
    },
    {
      id: "elbasan",
      title: { tr: "Elbasan Tava", en: "Elbasan Casserole", ar: "طاجن إلباسان بصوص الزبادي" },
      subtitle: { tr: "Kuzu eti & sarımsaklı yoğurt sosu", en: "Slow-baked lamb with yoghurt sauce", ar: "لحم ضأن مطهو بصلصة الثوم" },
      basePrice: 370,
      image: "/images/products/elbasan.jpg",
      tag: { tr: "POPÜLER", en: "POPULAR", ar: "الأكثر طلباً" },
    },
  ],
  pide: [
    {
      id: "kiymali-kasarli",
      title: { tr: "Kıymalı Kaşarlı Taş Fırın", en: "Minced Meat & Kaşar Pide", ar: "فطيرة باللحم المفروم والجبن" },
      subtitle: { tr: "Meşe odunu ateşinde çıtır lezzet", en: "Wood-fired crispy artisan crust", ar: "مخبوزة على الحطب ومقرمشة" },
      basePrice: 310,
      image: "/images/products/sucuklu-pide.jpg",
      tag: { tr: "FIRINDAN TAZE", en: "FRESH FROM OVEN", ar: "طازجة من الفرن" },
    },
    {
      id: "karisik-pide",
      title: { tr: "Cihangir Spesiyal Pide", en: "Cihangir Special Pide", ar: "فطيرة جهانجير المشكلة" },
      subtitle: { tr: "Kavurma, sucuk, pastırma & peynir", en: "Braised beef, soujouk, pastrami", ar: "لحم، سجق، بسطرمة، وأجبان" },
      basePrice: 390,
      image: "/sofra/karisik-pide.jpg",
      tag: { tr: "İMZA LEZZET", en: "SIGNATURE", ar: "طبق مميز" },
    },
  ],
};

export default function OrderDemo({ lang }: OrderDemoProps) {
  const [activeTab, setActiveTab] = useState<"pots" | "pide">("pots");
  const [selectedCurrency, setSelectedCurrency] = useState(DEMO_CURRENCIES[0]);
  const [cartCount, setCartCount] = useState(1);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const isRTL = lang === "ar" || lang === "fa";
  const locale = (["tr", "en", "ar"].includes(lang) ? lang : "tr") as "tr" | "en" | "ar";

  const handleAdd = (id: string) => {
    setAddedItem(id);
    setCartCount((prev) => prev + 1);
    setTimeout(() => setAddedItem(null), 900);
  };

  const formatPrice = (base: number) => {
    const val = base * selectedCurrency.rate;
    if (selectedCurrency.code === "TRY") return `${Math.round(val)} ₺`;
    return `${selectedCurrency.symbol}${val.toFixed(selectedCurrency.code === "SAR" ? 1 : 2)}`;
  };

  return (
    <div className="order-phone-mockup" dir={isRTL ? "rtl" : "ltr"}>
      {/* Phone Chrome Speaker & Notch */}
      <div className="phone-notch">
        <span className="notch-speaker" />
        <span className="notch-camera" />
      </div>

      {/* Status Bar */}
      <div className="phone-status-bar">
        <span className="status-time">12:30</span>
        <div className="status-icons">
          <Signal size={12} />
          <Wifi size={12} />
          <Battery size={13} />
        </div>
      </div>

      {/* Simulated App Header */}
      <div className="phone-app-header">
        <div className="phone-brand-title">
          <span className="phone-brand-dot" />
          <div>
            <strong>Cihangir Ev Yemekleri</strong>
            <small>Beyoğlu · Açık / Open</small>
          </div>
        </div>

        {/* Currency Switcher inside phone */}
        <div className="phone-currency-pills">
          {DEMO_CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              className={`phone-currency-btn ${selectedCurrency.code === c.code ? "active" : ""}`}
              onClick={() => setSelectedCurrency(c)}
            >
              {c.code}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="phone-category-nav">
        <button
          type="button"
          className={`phone-cat-btn ${activeTab === "pots" ? "active" : ""}`}
          onClick={() => setActiveTab("pots")}
        >
          🥘 {locale === "ar" ? "أواني اليوم" : locale === "en" ? "Daily Pots" : "Günün Tenceresi"}
        </button>
        <button
          type="button"
          className={`phone-cat-btn ${activeTab === "pide" ? "active" : ""}`}
          onClick={() => setActiveTab("pide")}
        >
          🔥 {locale === "ar" ? "فرن الحجر" : locale === "en" ? "Stone Oven Pide" : "Taş Fırın Pide"}
        </button>
      </div>

      {/* Dish List */}
      <div className="phone-item-list">
        {DEMO_ITEMS[activeTab].map((item) => (
          <div key={item.id} className="phone-item-card">
            <div className="phone-item-image-wrap">
              <Image
                src={item.image}
                alt={item.title[locale]}
                fill
                sizes="80px"
                className="phone-item-img"
              />
              <span className="phone-item-tag">{item.tag[locale]}</span>
            </div>

            <div className="phone-item-details">
              <h4>{item.title[locale]}</h4>
              <p>{item.subtitle[locale]}</p>
              <div className="phone-item-bottom">
                <span className="phone-item-price">{formatPrice(item.basePrice)}</span>
                <button
                  type="button"
                  className={`phone-add-btn ${addedItem === item.id ? "added" : ""}`}
                  onClick={() => handleAdd(item.id)}
                  aria-label="Sepete Ekle"
                >
                  {addedItem === item.id ? <Check size={14} /> : <Plus size={14} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Bottom Cart Bar */}
      <div className="phone-cart-bar">
        <div className="cart-bar-info">
          <div className="cart-bar-badge">
            <ShoppingBag size={14} />
            <span>{cartCount}</span>
          </div>
          <div>
            <b>{locale === "ar" ? "جاهز للطلب" : locale === "en" ? "Order Ready" : "Siparişe Hazır"}</b>
            <small>{locale === "ar" ? "توصيل سريع في بيوغلو" : locale === "en" ? "Fast Beyoğlu delivery" : "Hızlı Cihangir teslimatı"}</small>
          </div>
        </div>
        <Link href={`/${lang}/menu`} className="cart-bar-action">
          {locale === "ar" ? "المنيو الحي ↗" : locale === "en" ? "Live Menu ↗" : "Canlı Menü ↗"}
        </Link>
      </div>
    </div>
  );
}

