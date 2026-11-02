"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe, ArrowRight, ArrowLeft } from "lucide-react";

const LANGUAGE_SPECS = [
  { id: "tr", label: "TR", name: "Türkçe", dir: "ltr" },
  { id: "en", label: "EN", name: "English", dir: "ltr" },
  { id: "ar", label: "عربي", name: "العربية", dir: "rtl" },
  { id: "ru", label: "RU", name: "Русский", dir: "ltr" },
  { id: "de", label: "DE", name: "Deutsch", dir: "ltr" },
  { id: "fr", label: "FR", name: "Français", dir: "ltr" },
  { id: "es", label: "ES", name: "Español", dir: "ltr" },
  { id: "zh", label: "中文", name: "简体中文", dir: "ltr" },
];

const LOCALIZED_COPY: Record<string, {
  eyebrow: string;
  title: string;
  description: string;
  action: string;
  dishName: string;
  dishDesc: string;
  kicker: string;
  note: string;
}> = {
  tr: {
    eyebrow: "CİHANGİR EV YEMEKLERİ & TAŞ FIRIN PİDE · İSTANBUL",
    title: "Beyoğlu'nun kalbinde, sıcacık bir tencere lezzeti.",
    description: "Her sabah taş fırında pişen çıtır pideler ve meşe odunu ateşiyle kaynayan geleneksel ev yemekleri.",
    action: "Günün Menüsünü Keşfet",
    dishName: "Kıymalı Kaşarlı Taş Fırın Pide",
    dishDesc: "Özel yoğrulmuş mayalı hamur, taze dana kıyma ve eriyen kaşar peyniri.",
    kicker: "DİL ÖNİZLEMESİ",
    note: "Arapça seçildiğinde tam RTL düzeni ve Cairo tipografisi devreye girer.",
  },
  en: {
    eyebrow: "CİHANGİR HOME COOKING & STONE OVEN PIDE · ISTANBUL",
    title: "Warm comforting stews in the heart of bohemian Beyoğlu.",
    description: "Crispy stone-oven pides baked over oak wood, paired with slow-simmered heritage Turkish casseroles.",
    action: "Explore Daily Specials",
    dishName: "Minced Meat & Kaşar Stone Oven Pide",
    dishDesc: "Hand-stretched artisan sourdough, seasoned ground beef, and golden molten cheese.",
    kicker: "LANGUAGE PREVIEW",
    note: "Selecting Arabic seamlessly flips interface flow to native right-to-left (RTL).",
  },
  ar: {
    eyebrow: "مطعم جهانجير للأكلات المنزلية وفطائر فرن الحجر · إسطنبول",
    title: "دفء الأكلات المنزلية في قلب شوارع بيوغلو البوهيمية.",
    description: "فطائر طازجة تُخبز على الحطب، إلى جانب طواجن وأواني المطبخ التركي العريق الطازجة يومياً.",
    action: "اكتشف أطباق اليوم",
    dishName: "فطيرة باللحم المفروم وجبن القشقوان",
    dishDesc: "عجينة مخمرة يدوياً مع لحم بقري متبل وجبن قشقوان ذائب من فوهة الفرن الحجري.",
    kicker: "معاينة اللغات التفاعلية",
    note: "عند اختيار اللغة العربية، يتحول اتجاه كامل الواجهة تلقائياً إلى اليمين (RTL) مع خط Cairo.",
  },
  ru: {
    eyebrow: "ДОМАШНЯЯ КУХНЯ И ПИДЕ ДЖИХАНГИР · СТАМБУЛ",
    title: "Уютные домашние блюда в самом сердце исторического Бейоглу.",
    description: "Хрустящие пиде из каменной печи на дубовых дровах и традиционные горячие тушеные блюда.",
    action: "Открыть меню дня",
    dishName: "Пиде с фаршем и сыром кашар",
    dishDesc: "Тонкое тесто ручной лепки, сочный говяжий фарш и расплавленный золотистый сыр.",
    kicker: "ПРЕДПРОСМОТР ЯЗЫКОВ",
    note: "Арабский язык автоматически переключает всю сетку и компоненты в режим RTL.",
  },
  de: {
    eyebrow: "CİHANGİR HAUSMANNSKOST & STEINOFEN-PIDE · ISTANBUL",
    title: "Traditionelle Eintöpfe im Herzen von Beyoğlu.",
    description: "Knusprige Holzofen-Pides und täglich frisch zubereitete türkische Spezialitäten.",
    action: "Tagesmenü Entdecken",
    dishName: "Hackfleisch & Kaşar Steinofen-Pide",
    dishDesc: "Handgezogener Sauerteig mit gewürztem Rinderhack und geschmolzenem Käse.",
    kicker: "SPRACHVORSCHAU",
    note: "Arabisch schaltet das gesamte Layout nahtlos auf Rechts-nach-Links (RTL) um.",
  },
  fr: {
    eyebrow: "CİHANGİR PLATS MAISON & PIDE AU FOUR À PIERRE · ISTANBUL",
    title: "La douceur des plats mijotés au cœur de Beyoğlu.",
    description: "Pides croustillantes cuites au feu de bois et ragoûts artisanaux mijotés chaque matin.",
    action: "Découvrir le Menu du Jour",
    dishName: "Pide à la viande hachée & fromage Kaşar",
    dishDesc: "Pâte artisanale étirée à la main, bœuf haché assaisonné et fromage fondant doré.",
    kicker: "APERÇU LINGUISTIQUE",
    note: "L'arabe active automatiquement le mode d'affichage de droite à gauche (RTL).",
  },
  es: {
    eyebrow: "CİHANGİR COMIDA CASERA & PIDE AL HORNO DE PIEDRA · ESTAMBUL",
    title: "Guisos reconfortantes en el corazón bohemio de Beyoğlu.",
    description: "Pides crujientes al horno de leña de roble y platos caseros turcos recién cocinados.",
    action: "Explorar Menú del Día",
    dishName: "Pide de carne picada y queso Kaşar",
    dishDesc: "Masa artesanal estirada a mano, ternera sazonada y queso fundido dorado.",
    kicker: "VISTA PREVIA",
    note: "El árabe invierte la orientación de lectura y la cuadrícula al modo RTL.",
  },
  zh: {
    eyebrow: "CİHANGİR 传统家常菜与石炉披得 · 伊斯坦布尔",
    title: "贝尤鲁文艺街区的地道土耳其家常美味。",
    description: "橡木明火石炉现烤香脆皮得，搭配每日慢火炖煮的传统砂锅佳肴。",
    action: "探索今日每日菜单",
    dishName: "牛肉碎与黄芝士石炉披得",
    dishDesc: "纯手工揉面醒发，鲜香调味牛肉馅搭配金黄拉丝芝士。",
    kicker: "多语言动态预览",
    note: "选择阿拉伯语时，整套排版架构与字体将毫秒级无缝切换为从右至左 (RTL)。",
  },
};

export default function LanguageDemo({ initialLang = "tr" }: { initialLang?: string }) {
  const [activeLang, setActiveLang] = useState(
    LANGUAGE_SPECS.some((l) => l.id === initialLang) ? initialLang : "tr"
  );

  const currentSpec = LANGUAGE_SPECS.find((l) => l.id === activeLang) || LANGUAGE_SPECS[0];
  const copy = LOCALIZED_COPY[activeLang] || LOCALIZED_COPY.tr;
  const isRTL = currentSpec.dir === "rtl";

  return (
    <div className="case-lang-demo" aria-label="10-Language Architecture Sandbox">
      <div className="case-lang-topline">
        <span className="case-lang-kicker">
          <Globe size={13} className="inline-block mr-1 text-[#C64C32]" />
          {copy.kicker}
        </span>
        <span className="case-lang-count">08 / 10 DESTEKLENEN</span>
      </div>

      {/* Language Selector Buttons */}
      <div className="case-lang-tabs" role="tablist">
        {LANGUAGE_SPECS.map((spec) => (
          <button
            key={spec.id}
            type="button"
            role="tab"
            aria-selected={activeLang === spec.id}
            className={`case-lang-tab ${activeLang === spec.id ? "active" : ""}`}
            onClick={() => setActiveLang(spec.id)}
          >
            <span>{spec.label}</span>
            <small>{spec.name}</small>
          </button>
        ))}
      </div>

      {/* Live Preview Card */}
      <div
        className="case-lang-preview-card"
        dir={currentSpec.dir}
        key={activeLang}
      >
        <span className="case-preview-eyebrow">{copy.eyebrow}</span>
        <h3 className="case-preview-title">{copy.title}</h3>
        <p className="case-preview-desc">{copy.description}</p>

        {/* Featured Dish Preview Pill */}
        <div className="case-dish-badge-row">
          <div className="case-dish-badge">
            <span className="badge-flame">🔥</span>
            <div>
              <b>{copy.dishName}</b>
              <small>{copy.dishDesc}</small>
            </div>
          </div>
        </div>

        <div className="case-preview-footer">
          <Link href={`/${activeLang}/menu`} className="case-preview-cta">
            <span>{copy.action}</span>
            {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </Link>
          <span className="case-preview-note">{copy.note}</span>
        </div>
      </div>
    </div>
  );
}

