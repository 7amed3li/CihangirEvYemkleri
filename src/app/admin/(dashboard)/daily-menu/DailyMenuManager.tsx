"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CalendarCheck,
  Plus,
  Trash,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Clock,
  CircleNotch,
  CookingPot,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import { formatIstanbulReadable } from "@/lib/date";

interface EligibleProduct {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  basePriceTRY: number;
}

interface MenuEntry {
  productId: string;
  displayOrder: number;
  productName: string;
  categoryName: string;
  basePriceTRY: number;
}

export default function DailyMenuManager() {
  // Istanbul today default (YYYY-MM-DD)
  const getTodayStr = () => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Istanbul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  };

  const [dateString, setDateString] = useState(getTodayStr());
  const [notes, setNotes] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [entries, setEntries] = useState<MenuEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Eligible products for picker
  const [eligibleProducts, setEligibleProducts] = useState<EligibleProduct[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");

  const fetchMenu = useCallback(async (date: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/daily-menu?dateString=${date}`);
      const data = await res.json();
      if (res.ok && data.dailyMenu) {
        setNotes(data.dailyMenu.notes || "");
        setIsPublished(data.dailyMenu.isPublished ?? true);
        setEntries(data.dailyMenu.entries || []);
      }
    } catch {
      setMessage({ type: "error", text: "Menü yüklenirken hata oluştu." });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEligibleProducts = async () => {
    try {
      const res = await fetch("/api/admin/daily-menu/eligible-products");
      const data = await res.json();
      if (res.ok && data.eligibleProducts) {
        setEligibleProducts(data.eligibleProducts);
      }
    } catch (err) {
      console.error("Failed to load eligible products:", err);
    }
  };

  useEffect(() => {
    fetchMenu(dateString);
    fetchEligibleProducts();
  }, [dateString, fetchMenu]);

  // Add Product to Daily Menu
  const handleAddProduct = (prod: EligibleProduct) => {
    if (entries.some((e) => e.productId === prod.id)) {
      return; // Already added
    }

    const newEntry: MenuEntry = {
      productId: prod.id,
      displayOrder: entries.length + 1,
      productName: prod.name,
      categoryName: prod.categoryName,
      basePriceTRY: prod.basePriceTRY,
    };

    setEntries([...entries, newEntry]);
    setPickerOpen(false);
  };

  // Remove Entry
  const handleRemoveEntry = (productId: string) => {
    const updated = entries
      .filter((e) => e.productId !== productId)
      .map((e, idx) => ({ ...e, displayOrder: idx + 1 }));
    setEntries(updated);
  };

  // Move Entry Up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newEntries = [...entries];
    const temp = newEntries[index];
    newEntries[index] = newEntries[index - 1];
    newEntries[index - 1] = temp;
    setEntries(newEntries.map((e, idx) => ({ ...e, displayOrder: idx + 1 })));
  };

  // Move Entry Down
  const handleMoveDown = (index: number) => {
    if (index >= entries.length - 1) return;
    const newEntries = [...entries];
    const temp = newEntries[index];
    newEntries[index] = newEntries[index + 1];
    newEntries[index + 1] = temp;
    setEntries(newEntries.map((e, idx) => ({ ...e, displayOrder: idx + 1 })));
  };

  // Save Daily Menu
  const handleSave = async (publishState: boolean) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/daily-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateString,
          notes,
          isPublished: publishState,
          productIds: entries.map((e) => e.productId),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Menü kaydedilemedi." });
        setSaving(false);
        return;
      }

      setIsPublished(publishState);
      setMessage({
        type: "success",
        text: publishState
          ? "Günün menüsü başarıyla yayınlandı!"
          : "Günün menüsü taslak olarak kaydedildi.",
      });
    } catch {
      setMessage({ type: "error", text: "Bağlantı hatası oluştu." });
    } finally {
      setSaving(false);
    }
  };

  const filteredEligible = eligibleProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(pickerSearch.toLowerCase());
    const notSelected = !entries.some((e) => e.productId === p.id);
    return matchesSearch && notSelected;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE3CE]">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2620] tracking-tight">
            Günün Menüsü Yönetimi
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            İstanbul İşletme Tarihi: <span className="font-semibold text-[#9C7A3F]">{formatIstanbulReadable(dateString)}</span>
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateString}
            onChange={(e) => setDateString(e.target.value)}
            className="px-3 py-1.5 bg-white border border-[#EDE3CE] rounded-xl text-xs font-semibold text-stone-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
          />
          <button
            onClick={() => setDateString(getTodayStr())}
            className="px-3 py-1.5 bg-[#EDE3CE] hover:bg-[#E2D9C8] text-[#2B2620] rounded-xl text-xs font-semibold transition-colors"
          >
            Bugün
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {message && (
        <div
          className={`p-3 rounded-xl text-xs font-medium flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="p-1">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Entries List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#EDE3CE] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <CalendarCheck size={20} className="text-[#9C7A3F]" weight="duotone" />
                <h2 className="font-bold text-sm text-[#2B2620]">
                  Günün Seçili Yemekleri ({entries.length})
                </h2>
              </div>
              <button
                onClick={() => setPickerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4E5F4C] hover:bg-[#3D4B3B] text-white text-xs font-semibold shadow-xs transition-all"
              >
                <Plus size={14} weight="bold" />
                <span>Yemek Ekle</span>
              </button>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center text-stone-400">
                <CircleNotch size={24} className="animate-spin text-[#9C7A3F]" />
              </div>
            ) : entries.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400 space-y-2">
                <CookingPot size={32} className="mx-auto text-stone-300" />
                <p>Bugün için henüz yemek seçilmedi.</p>
                <button
                  onClick={() => setPickerOpen(true)}
                  className="text-xs font-semibold text-[#9C7A3F] hover:underline"
                >
                  Listeden yemek ekleyin
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {entries.map((entry, index) => (
                  <div
                    key={entry.productId}
                    className="p-3 bg-stone-50 hover:bg-[#F7F2E7]/80 rounded-xl border border-stone-200/80 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center font-mono font-bold text-[11px] text-stone-500">
                        {index + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-stone-800">{entry.productName}</div>
                        <div className="text-[10px] text-stone-400">
                          {entry.categoryName} •{" "}
                          <span className="font-semibold text-stone-600">
                            {entry.basePriceTRY.toFixed(2)} ₺
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMoveUp(index)}
                        className="p-1 rounded text-stone-400 hover:text-stone-700 disabled:opacity-30"
                        title="Yukarı Taşı"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        disabled={index === entries.length - 1}
                        onClick={() => handleMoveDown(index)}
                        className="p-1 rounded text-stone-400 hover:text-stone-700 disabled:opacity-30"
                        title="Aşağı Taşı"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={() => handleRemoveEntry(entry.productId)}
                        className="p-1 rounded text-stone-400 hover:text-red-600 ml-2"
                        title="Listeden Çıkar"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Publish Controls & Notes (1 col) */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#EDE3CE] shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-sm text-[#2B2620]">Yayın Durumu</h3>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <span className="font-semibold text-stone-600">Mevcut Durum:</span>
              {isPublished ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                  <CheckCircle size={14} weight="fill" />
                  <span>Yayında</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                  <Clock size={14} weight="fill" />
                  <span>Taslak (Gizli)</span>
                </span>
              )}
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Günün Aşçı Notu / Menü Mesajı
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Örn: Taş fırınımızda pişen taze güveç ve özel İspir fasulyesi..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave(true)}
                className="w-full py-2.5 rounded-xl bg-[#4E5F4C] hover:bg-[#3D4B3B] text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                {saving && <CircleNotch size={14} className="animate-spin" />}
                <span>Menüyü Kaydet ve Yayınla</span>
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave(false)}
                className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>Taslak Olarak Kaydet (Gizle)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dish Picker Modal */}
      {pickerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#EDE3CE] overflow-hidden max-h-[85vh] flex flex-col text-xs">
            <div className="px-5 py-3.5 bg-[#2B2620] text-[#EDE3CE] flex items-center justify-between">
              <h3 className="font-bold text-xs">Günün Menüsüne Yemek Ekle</h3>
              <button
                onClick={() => setPickerOpen(false)}
                className="p-1 text-white/60 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3 border-b border-stone-200 bg-stone-50">
              <div className="relative">
                <MagnifyingGlass
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="text"
                  placeholder="Yemek veya kategori ara..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                />
              </div>
            </div>

            <div className="p-3 overflow-y-auto flex-1 space-y-1.5">
              {filteredEligible.length === 0 ? (
                <p className="py-8 text-center text-stone-400">
                  Eklenebilecek uygun aktif yemek bulunamadı.
                </p>
              ) : (
                filteredEligible.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-2.5 rounded-xl hover:bg-[#F7F2E7] border border-stone-100 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-stone-800">{prod.name}</div>
                      <div className="text-[10px] text-stone-400">
                        {prod.categoryName} •{" "}
                        <span className="font-semibold text-[#9C7A3F]">
                          {prod.basePriceTRY.toFixed(2)} ₺
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddProduct(prod)}
                      className="px-3 py-1 rounded-lg bg-[#9C7A3F] hover:bg-[#836531] text-white font-semibold text-[11px] transition-colors"
                    >
                      Ekle
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
