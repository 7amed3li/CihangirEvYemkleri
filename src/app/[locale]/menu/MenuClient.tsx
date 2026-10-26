"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { menuData as staticMenuData, MenuCategory } from "@/data/menuData";
import FoodCard from "@/components/FoodCard";
import FeaturedDishesShowcase from "@/components/FeaturedDishesShowcase";
import MenuCategoryBar from "@/components/MenuCategoryBar";
import SmartFilters from "@/components/SmartFilters";
import CartDrawer from "@/components/CartDrawer";
import DishModal from "@/components/DishModal";
import { OttomanStar } from "@/components/BrandIcons";
import { PublicDailyMenu, PublicOffer } from "@/lib/db/menu-loader";

interface MenuClientProps {
  dict?: Record<string, any>;
  categories?: MenuCategory[];
  dailyMenu?: PublicDailyMenu | null;
  offers?: PublicOffer[];
}

export default function MenuClient({
  dict,
  categories = staticMenuData,
  dailyMenu = null,
  offers = [],
}: MenuClientProps) {
  // Use passed categories or fallback
  const activeCategories = useMemo(
    () => (categories && categories.length > 0 ? categories : staticMenuData),
    [categories]
  );

  const initialCatId = activeCategories[0]?.id || "ana-yemekler";
  const [activeCategory, setActiveCategory] = useState(initialCatId);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const menuSectionRef = useRef<HTMLDivElement>(null);

  // Set of product IDs/slugs present in today's published Daily Menu
  const dailyProductIds = useMemo(() => {
    if (!dailyMenu || !dailyMenu.entries || dailyMenu.entries.length === 0) {
      return new Set<string>();
    }
    const set = new Set<string>();
    dailyMenu.entries.forEach((e) => {
      if (e.slug) set.add(e.slug);
      if (e.productId) set.add(e.productId);
    });
    return set;
  }, [dailyMenu]);

  const hasDailyMenu = dailyProductIds.size > 0;

  // If daily menu is absent/unpublished, reset daily filter if active
  useEffect(() => {
    if (!hasDailyMenu && activeFilter === "daily") {
      setActiveFilter(null);
    }
  }, [hasDailyMenu, activeFilter]);

  // If categories change or current category is not in list, keep a valid one
  useEffect(() => {
    if (!activeCategories.some((c) => c.id === activeCategory)) {
      setActiveCategory(activeCategories[0]?.id || "ana-yemekler");
    }
  }, [activeCategories, activeCategory]);

  const [selectedDishModal, setSelectedDishModal] = useState<any | null>(null);

  // Restore state from URL hash (supports category, filter, and direct dish ID e.g. #kara-lahana-dolmasi)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const [targetPart, queryPart] = hash.split("?");
    const cleanId = targetPart?.trim();

    if (cleanId) {
      // 1. Check if hash matches a category
      const matchedCat = activeCategories.find((c) => c.id === cleanId);
      if (matchedCat) {
        setActiveCategory(matchedCat.id);
      } else {
        // 2. Check if hash matches a specific dish item ID
        for (const cat of activeCategories) {
          const matchedItem = cat.items.find((i) => i.id === cleanId);
          if (matchedItem) {
            setActiveCategory(cat.id);
            setSelectedDishModal(matchedItem);
            setTimeout(() => {
              const el = document.getElementById(cleanId);
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }, 300);
            break;
          }
        }
      }
    }

    if (queryPart) {
      const params = new URLSearchParams(queryPart);
      const filter = params.get("filter");
      if (filter) {
        if (filter === "daily" && !hasDailyMenu) {
          // ignore daily filter if no published daily menu
        } else {
          setActiveFilter(filter);
        }
      }
    }
  }, [activeCategories, hasDailyMenu]);

  // Sync state to URL hash
  useEffect(() => {
    const hash = activeFilter
      ? `${activeCategory}?filter=${activeFilter}`
      : activeCategory;
    const url = `${window.location.pathname}${window.location.search}#${hash}`;
    window.history.replaceState(null, "", url);
  }, [activeCategory, activeFilter]);

  const scrollToMenu = () => {
    menuSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
    scrollToMenu();
  };

  const handleFilterSelect = (filter: string | null) => {
    setActiveFilter(filter);
    scrollToMenu();
  };

  const allItems = useMemo(
    () => activeCategories.flatMap((c) => c.items),
    [activeCategories]
  );

  return (
    <div className="pb-12 bg-[#EDE3CE] min-h-screen text-[#2B2620]">
      {/* Appetite-Inducing Featured Specials Showcase (Exact Kardesler Style) */}
      <FeaturedDishesShowcase items={allItems} />

      {/* Anchor for smooth scrolling */}
      <div ref={menuSectionRef} className="invisible h-0 w-0 -mt-20 pt-20" />

      {/* Sticky Category Tabs & Smart Filters (Exact Kardesler Style) */}
      <div className="sticky top-[64px] z-30 shadow-xs">
        <MenuCategoryBar
          categories={activeCategories}
          activeCategory={activeCategory}
          setActiveCategory={handleCategorySelect}
        />

        {/* Smart Filters with optional Bugünün Yemekleri filter */}
        <div className="bg-[#F7F2E7] border-b border-[#9C7A3F]/20 py-1">
          <div className="max-w-6xl mx-auto px-2.5 sm:px-5">
            <SmartFilters
              activeFilter={activeFilter}
              setActiveFilter={handleFilterSelect}
              dict={dict}
              hasDailyMenu={hasDailyMenu}
            />
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <section className="max-w-6xl mx-auto px-3 sm:px-6 py-6 min-h-[60vh] bg-[#EDE3CE]">
        {activeCategories.map((category) => {
          if (activeCategory !== category.id) return null;

          const filteredItems = category.items.filter((item) => {
            if (!activeFilter || activeFilter === "all" || activeFilter === "tumu") {
              return true;
            }
            if (activeFilter === "daily") {
              return dailyProductIds.has(item.id);
            }
            return item.tags?.includes(activeFilter);
          });

          return (
            <div
              key={category.id}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-fadeIn"
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-[#7A7364] font-medium tracking-wide">
                    {dict?.noResults || "Bu filtreye uygun yemek bulunamadı."}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Floating Cart Button & Slide-Over Drawer */}
      <CartDrawer />

      {/* Auto-opened Dish Modal from URL Hash (e.g. #kara-lahana-dolmasi) */}
      {selectedDishModal && (
        <DishModal
          isOpen={Boolean(selectedDishModal)}
          setIsOpen={(open) => {
            if (!open) setSelectedDishModal(null);
          }}
          item={selectedDishModal}
        />
      )}
    </div>
  );
}
