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
    color: "#354D37",
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
    color: "#A8683B",
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
    color: "#C64C32",
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
    color: "#4F7A45",
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
    color: "#A8281C",
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
    color: "#2F6F73",
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
            style={{
              backgroundColor: f.color,
              borderColor: f.color,
              color: "#fff",
              boxShadow: isActive ? `0 0 0 3px #FFFAF0, 0 0 0 5px ${f.color}, 0 8px 18px ${f.color}55` : `0 3px 8px ${f.color}30`,
              opacity: activeFilter && !isActive && !isAll ? 0.55 : 1,
            }}
            className={`group shrink-0 flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer select-none border hover:-translate-y-0.5 hover:brightness-110 hover:!opacity-100 ${
              isActive ? "scale-[1.06]" : ""
            }`}
          >
            <Icon size={14} className="text-white" />
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
