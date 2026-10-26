"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Utensils, Wheat, Crown, Leaf, Flame, CalendarDays, X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

interface SmartFiltersProps {
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
  dict?: Record<string, any>;
  hasDailyMenu?: boolean;
}

const FILTER_ITEMS = [
  {
    id: "all",
    icon: Utensils,
    label: {
      tr: "Tümü",
      en: "All Dishes",
      ar: "الكل",
      ru: "Все блюда",
      fa: "همه",
      fr: "Tous",
      de: "Alle",
      it: "Tutti",
      es: "Todos",
      zh: "全部",
    },
  },
  {
    id: "gluten-free",
    icon: Wheat,
    label: {
      tr: "Glütensiz",
      en: "Gluten-Free",
      ar: "خالي من الغلوتين",
      ru: "Без глютена",
      fa: "بدون گلوتن",
      fr: "Sans gluten",
      de: "Glutenfrei",
      it: "Senza glutine",
      es: "Sin gluten",
      zh: "无麸质",
    },
  },
  {
    id: "signature",
    icon: Crown,
    label: {
      tr: "Şefin Seçimi",
      en: "Chef's Special",
      ar: "توصية الشيف",
      ru: "Выбор шефа",
      fa: "پیشنهاد سرآشپز",
      fr: "Spécialité du chef",
      de: "Empfehlung des Chefs",
      it: "Scelta dello chef",
      es: "Sugerencia del chef",
      zh: "主厨推荐",
    },
  },
  {
    id: "vegetarian",
    icon: Leaf,
    label: {
      tr: "Vejetaryen",
      en: "Vegetarian",
      ar: "نباتي",
      ru: "Вегетарианское",
      fa: "گیاهی",
      fr: "Végétarien",
      de: "Vegetarisch",
      it: "Vegetariano",
      es: "Vegetariano",
      zh: "素食",
    },
  },
  {
    id: "spicy",
    icon: Flame,
    label: {
      tr: "Acılı",
      en: "Spicy",
      ar: "حار",
      ru: "Острое",
      fa: "تند",
      fr: "Épicé",
      de: "Scharf",
      it: "Piccante",
      es: "Picante",
      zh: "辛辣",
    },
  },
  {
    id: "daily",
    icon: CalendarDays,
    isDaily: true,
    label: {
      tr: "Bugünün Menüsü",
      en: "Today's Specials",
      ar: "أطباق اليوم",
      ru: "Блюда дня",
      fa: "غذاهای امروز",
      fr: "Plats du jour",
      de: "Tagesgerichte",
      it: "Piatti del giorno",
      es: "Platos del día",
      zh: "今日特选",
    },
  },
];

export default function SmartFilters({
  activeFilter,
  setActiveFilter,
  dict,
  hasDailyMenu = false,
}: SmartFiltersProps) {
  const { lang } = useAppContext();
  const params = useParams();
  const activeLang =
    (typeof params?.locale === "string" ? params.locale : null) ||
    lang ||
    "tr";

  const availableFilters = FILTER_ITEMS.filter(
    (f) => !f.isDaily || (f.isDaily && hasDailyMenu)
  );

  return (
    <div className="py-2 flex items-center justify-start md:justify-center gap-2 sm:gap-2.5 md:gap-3 overflow-x-auto no-scrollbar scroll-smooth">
      {availableFilters.map((f) => {
        const isAll = f.id === "all";
        const isActive = isAll
          ? !activeFilter || activeFilter === "all"
          : activeFilter === f.id;

        const localizedLabel =
          (f.label as any)[activeLang] || f.label.tr;

        const Icon = f.icon;

        const handleClick = () => {
          if (isAll) {
            setActiveFilter(null);
          } else {
            setActiveFilter(isActive ? null : f.id);
          }
        };

        return (
          <button
            key={f.id}
            onClick={handleClick}
            className={`shrink-0 flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer select-none shadow-2xs ${
              isActive
                ? "bg-[#4E5F4C] text-[#FFFFFF] border border-[#4E5F4C] ring-2 ring-[#4E5F4C]/25 shadow-xs scale-[1.02]"
                : "bg-[#FAF7F0] border border-[#9C7A3F]/30 text-[#4A4335] hover:bg-[#EDE3CE] hover:border-[#9C7A3F]/60"
            }`}
          >
            <Icon size={14} className={isActive ? "text-white" : "text-[#9C7A3F]"} />
            <span>{localizedLabel}</span>
            {isActive && !isAll && (
              <X size={12} className="ms-0.5 opacity-80 hover:opacity-100" />
            )}
          </button>
        );
      })}
    </div>
  );
}
