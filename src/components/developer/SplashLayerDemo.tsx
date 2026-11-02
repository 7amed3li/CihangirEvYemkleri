"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Layers, Play, RotateCcw } from "lucide-react";

const LAYERS = [
  { id: "all", name: { tr: "Tam Amblem (Birleşik)", en: "Master Emblem (Unified)", ar: "الشعار المكتمل" }, src: "/splash/logo-original.webp", desc: { tr: "Tüm zanaat katmanlarının bir araya geldiği nihai logo.", en: "Final brandmark harmonizing all hand-crafted layers.", ar: "الشعار النهائي بعد اتحاد كافة الطبقات." } },
  { id: "ring", name: { tr: "01. Kırmızı Ocak Çemberi", en: "01. Red Artisan Ring", ar: "01. حلقة الموقد الحمراء" }, src: "/splash/red-ring.webp", desc: { tr: "Tarihi taş fırının sıcaklığını temsil eden kırmızı halka.", en: "Symbolic red hearth ring echoing the heat of stone ovens.", ar: "حلقة الفرن الحجري الحمراء المعبرة عن لهيب الحطب." } },
  { id: "pot", name: { tr: "02. Bakır Tencere & Kepçe", en: "02. Cooking Pot & Spoon", ar: "02. قدر الطهي والمغرفة" }, src: "/splash/pot-spoon.webp", desc: { tr: "Geleneksel ev yemeklerinin pişirildiği tencere ikonu.", en: "Hand-drawn stew pot honoring daily home-cooked cuisine.", ar: "قدر الطهي التراثي الذي يعبر عن الأكلات المنزلية." } },
  { id: "pide", name: { tr: "03. Taş Fırın Pidesi", en: "03. Stone-Oven Pide", ar: "03. فطيرة فرن الحجر" }, src: "/splash/pide.webp", desc: { tr: "Fırından yeni çıkmış, nar gibi kızarmış taş fırın pidesi.", en: "Freshly baked artisan pide straight from the hearth.", ar: "فطيرة البيدا الذهبية المقرمشة المخبوزة على الحطب." } },
  { id: "steam", name: { tr: "04. Tüten Buhar Dalgaları", en: "04. Steam Wisps", ar: "04. خيوط البخار المتصاعدة" }, src: "/splash/steam-b.webp", desc: { tr: "Yemeğin sıcacık ve taptaze olduğunu vurgulayan buhar.", en: "Subtle animated steam conveying fresh steaming dishes.", ar: "خيوط البخار التي ترمز لطزاجة وسخونة الأواني." } },
  { id: "garnish", name: { tr: "05. Taze Baharat & Süs", en: "05. Fresh Herb Garnish", ar: "05. بهارات وأعشاب طازجة" }, src: "/splash/garnish.webp", desc: { tr: "Tabaklara lezzet ve renk katan taze otlar.", en: "Aromatic herbs and spices crowning the dish.", ar: "لمسات الأعشاب والتوابل الطازجة فوق الأطباق." } },
  { id: "type", name: { tr: "06. Özgün Tipografi", en: "06. Custom Typography", ar: "06. خط جهانجير الأصيل" }, src: "/splash/typography.webp", desc: { tr: "Cihangir Ev Yemekleri & Pide kaligrafik yazı katmanı.", en: "Artisan lettering crafted for brand balance.", ar: "كتابة الاسم بخط مخصص يعكس هوية المطعم." } },
];

export default function SplashLayerDemo({ lang = "tr" }: { lang?: string }) {
  const [selectedLayer, setSelectedLayer] = useState(LAYERS[0]);
  const [isAssembling, setIsAssembling] = useState(false);
  const locale = (["tr", "en", "ar"].includes(lang) ? lang : "tr") as "tr" | "en" | "ar";

  const handleSimulate = () => {
    setIsAssembling(true);
    setTimeout(() => {
      setIsAssembling(false);
    }, 2800);
  };

  return (
    <div className="splash-layer-inspector" aria-label="Smart Splash Micro-Layer Inspector">
      <div className="inspector-controls-header">
        <div className="inspector-title">
          <Layers size={14} className="text-[#C64C32]" />
          <span>
            {locale === "ar"
              ? "محلل طبقات الاسبلاش الذكي (10 طبقات)"
              : locale === "en"
              ? "Smart Splash Micro-Layer Inspector (10 Layers)"
              : "Smart Splash Mikro-Katman İnceleyicisi (10 Katman)"}
          </span>
        </div>
        <button
          type="button"
          className="inspector-play-btn"
          onClick={handleSimulate}
          disabled={isAssembling}
        >
          {isAssembling ? (
            <>
              <RotateCcw size={13} className="animate-spin" />
              <span>{locale === "ar" ? "جاري التركيب..." : locale === "en" ? "Assembling..." : "Montaj Yapılıyor..."}</span>
            </>
          ) : (
            <>
              <Play size={13} />
              <span>{locale === "ar" ? "محاكاة التجميع الحركي" : locale === "en" ? "Simulate Assembly" : "Montajı Simüle Et"}</span>
            </>
          )}
        </button>
      </div>

      <div className="inspector-stage-grid">
        {/* Layer Buttons */}
        <div className="inspector-layer-nav">
          {LAYERS.map((layer) => (
            <button
              key={layer.id}
              type="button"
              className={`layer-nav-item ${selectedLayer.id === layer.id ? "active" : ""}`}
              onClick={() => setSelectedLayer(layer)}
            >
              <span className="layer-dot" />
              <div className="layer-item-text">
                <b>{layer.name[locale]}</b>
                <small>{layer.desc[locale]}</small>
              </div>
            </button>
          ))}
        </div>

        {/* Visual Preview Screen */}
        <div className="inspector-viewport">
          <div className="viewport-stage">
            {isAssembling ? (
              <div className="viewport-assembly-mode">
                <Image
                  src="/splash/red-ring.webp"
                  alt=""
                  width={340}
                  height={340}
                  className="anim-layer anim-ring"
                />
                <Image
                  src="/splash/pot-spoon.webp"
                  alt=""
                  width={340}
                  height={340}
                  className="anim-layer anim-pot"
                />
                <Image
                  src="/splash/pide.webp"
                  alt=""
                  width={340}
                  height={340}
                  className="anim-layer anim-pide"
                />
                <Image
                  src="/splash/typography.webp"
                  alt=""
                  width={340}
                  height={340}
                  className="anim-layer anim-type"
                />
                <Image
                  src="/splash/logo-original.webp"
                  alt=""
                  width={340}
                  height={340}
                  className="anim-layer anim-master"
                />
              </div>
            ) : (
              <div className="viewport-isolated-layer">
                <Image
                  key={selectedLayer.src}
                  src={selectedLayer.src}
                  alt={selectedLayer.name[locale]}
                  width={320}
                  height={320}
                  className="isolated-img"
                  priority
                />
              </div>
            )}
          </div>

          <div className="viewport-caption">
            <span>
              {isAssembling
                ? locale === "ar"
                  ? "تركيب سينمائي خفيف بدون فيديو · 318KB إجمالي"
                  : locale === "en"
                  ? "Hardware-accelerated CSS keyframe assembly · 318KB total"
                  : "Donanım hızlandırmalı CSS keyframe montajı · Toplam 318KB"
                : selectedLayer.name[locale]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

