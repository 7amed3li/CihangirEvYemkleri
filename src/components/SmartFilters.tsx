"use client";

import React from "react";
import { X } from "lucide-react";

interface SmartFiltersProps {
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
  dict?: Record<string, any>;
  hasDailyMenu?: boolean;
}

export default function SmartFilters({
  activeFilter,
  setActiveFilter,
  dict,
  hasDailyMenu = false,
}: SmartFiltersProps) {
  const filters = [
    ...(hasDailyMenu
      ? [{ id: "daily", label: dict?.dailyDishes || "Bugünün Yemekleri" }]
      : []),
    { id: "signature", label: dict?.signature || "Şefin Seçimi" },
    { id: "vegetarian", label: dict?.vegetarian || "Vejetaryen" },
    { id: "spicy", label: dict?.spicy || "Acılı" },
    { id: "vegan", label: dict?.vegan || "Vegan" },
  ];

  return (
    <div className="px-3 py-1.5 flex items-center gap-1.5 bg-transparent overflow-x-auto no-scrollbar">
      {filters.map((f) => {
        const isActive = activeFilter === f.id;

        return (
          <button
            key={f.id}
            onClick={() => setActiveFilter(isActive ? null : f.id)}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-colors border ${
              isActive
                ? "bg-[#4E5F4C] text-white border-[#4E5F4C]"
                : "bg-[#F7F2E7] border-[#9C7A3F]/30 text-[#2B2620] hover:border-[#9C7A3F]"
            }`}
          >
            <span>{f.label}</span>
            {isActive && <X size={11} className="ms-1 opacity-80" />}
          </button>
        );
      })}
    </div>
  );
}
