"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  PencilSimple,
  Trash,
  CircleNotch,
  X,
  Tag,
  CheckCircle,
  XCircle,
  CalendarBlank,
} from "@phosphor-icons/react";

interface OfferItem {
  id: string;
  productId: string;
  quantity: number;
  productName: string;
  productPriceTRY: number;
}

interface Offer {
  id: string;
  slug: string;
  sellingPriceTRY: number;
  isActive: boolean;
  validFrom: string | null;
  validUntil: string | null;
  imageUrl: string | null;
  orderIndex: number;
  title: string;
  description: string;
  title_en: string;
  title_ar: string;
  items: OfferItem[];
}

interface EligibleProduct {
  id: string;
  name: string;
  basePriceTRY: number;
}

export default function OfferManager() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableProducts, setAvailableProducts] = useState<EligibleProduct[]>([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    title_en: "",
    title_ar: "",
    description: "",
    slug: "",
    sellingPrice: 150,
    imageUrl: "",
    isActive: true,
    validFrom: "",
    validUntil: "",
    orderIndex: 0,
    items: [] as { productId: string; quantity: number }[],
  });

  // Fetch Offers
  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/offers");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Fırsatlar yüklenemedi.");
        return;
      }
      setOffers(data.offers || []);
    } catch {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch eligible products for offer item selection
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/daily-menu/eligible-products");
      const data = await res.json();
      if (res.ok && data.eligibleProducts) {
        setAvailableProducts(
          data.eligibleProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            basePriceTRY: p.basePriceTRY,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load products for offer items:", err);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setFormData({
      title: "",
      title_en: "",
      title_ar: "",
      description: "",
      slug: "",
      sellingPrice: 200,
      imageUrl: "",
      isActive: true,
      validFrom: "",
      validUntil: "",
      orderIndex: 0,
      items: availableProducts.length > 0 ? [{ productId: availableProducts[0].id, quantity: 1 }] : [],
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (o: Offer) => {
    setEditingOffer(o);
    setFormData({
      title: o.title,
      title_en: o.title_en || "",
      title_ar: o.title_ar || "",
      description: o.description || "",
      slug: o.slug,
      sellingPrice: o.sellingPriceTRY,
      imageUrl: o.imageUrl || "",
      isActive: o.isActive,
      validFrom: o.validFrom || "",
      validUntil: o.validUntil || "",
      orderIndex: o.orderIndex,
      items: o.items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
      })),
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (!editingOffer) {
        const slug = val
          .toLowerCase()
          .replace(/ğ/g, "g")
          .replace(/ü/g, "u")
          .replace(/ş/g, "s")
          .replace(/ı/g, "i")
          .replace(/ö/g, "o")
          .replace(/ç/g, "c")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        updated.slug = slug;
      }
      return updated;
    });
  };

  const handleAddItem = () => {
    if (availableProducts.length === 0) return;
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: availableProducts[0].id, quantity: 1 }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, productId: string, quantity: number) => {
    setFormData((prev) => {
      const items = [...prev.items];
      items[index] = { productId, quantity: Math.max(1, quantity) };
      return { ...prev, items };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      setFormError("Fırsat paketine en az bir ürün eklenmelidir.");
      return;
    }

    setFormError(null);
    setSubmitting(true);

    try {
      const url = editingOffer
        ? `/api/admin/offers/${editingOffer.id}`
        : "/api/admin/offers";
      const method = editingOffer ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "İşlem başarısız.");
        setSubmitting(false);
        return;
      }

      setModalOpen(false);
      fetchOffers();
    } catch {
      setFormError("Sunucu bağlantı hatası oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu fırsat paketini silmek istediğinizden emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchOffers();
      }
    } catch {
      alert("Silme işlemi başarısız.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE3CE]">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2620] tracking-tight">
            Fırsat ve Menü Paketleri
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Kombine ürün paketlerini ve bağımsız sabit satış fiyatlarını yönetin
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9C7A3F] hover:bg-[#836531] text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus size={16} weight="bold" />
          <span>Yeni Fırsat Paketi Ekle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center gap-2 text-stone-400">
            <CircleNotch size={28} className="animate-spin text-[#9C7A3F]" />
            <span className="text-xs">Fırsatlar yükleniyor...</span>
          </div>
        ) : error ? (
          <div className="col-span-full p-8 text-center text-xs text-red-600">
            {error}
          </div>
        ) : offers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-stone-400">
            Henüz tanımlanmış bir fırsat paketi bulunmuyor.
          </div>
        ) : (
          offers.map((o) => (
            <div
              key={o.id}
              className="bg-white p-5 rounded-2xl border border-[#EDE3CE] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-[#2B2620]">{o.title}</h3>
                    <p className="text-[10px] text-stone-400 font-mono mt-0.5">/{o.slug}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      o.isActive
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {o.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>

                {o.description && (
                  <p className="text-xs text-stone-500 mt-2 line-clamp-2">
                    {o.description}
                  </p>
                )}

                {/* Package Items */}
                <div className="mt-3 p-3 bg-stone-50 rounded-xl space-y-1.5 text-xs border border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Paket İçeriği:
                  </span>
                  {o.items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-stone-700">
                        {it.quantity}x {it.productName}
                      </span>
                      <span className="text-stone-400 font-mono">
                        {(it.productPriceTRY * it.quantity).toFixed(2)} ₺
                      </span>
                    </div>
                  ))}
                </div>

                {/* Dates */}
                {(o.validFrom || o.validUntil) && (
                  <div className="mt-3 flex items-center gap-1 text-[11px] text-stone-400">
                    <CalendarBlank size={13} />
                    <span>
                      {o.validFrom || "—"} / {o.validUntil || "—"}
                    </span>
                  </div>
                )}
              </div>

              {/* Price and Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block">Paket Fiyatı</span>
                  <span className="text-base font-bold text-[#9C7A3F]">
                    {o.sellingPriceTRY.toFixed(2)} ₺
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(o)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-[#9C7A3F] hover:bg-stone-100 transition-colors"
                    title="Düzenle"
                  >
                    <PencilSimple size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(o.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Sil"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#EDE3CE] overflow-hidden max-h-[90vh] flex flex-col text-xs">
            <div className="px-6 py-4 bg-[#2B2620] text-[#EDE3CE] flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingOffer ? "Fırsat Paketini Düzenle" : "Yeni Fırsat Paketi Ekle"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Fırsat Paketi Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Örn: Cihangir Doyuran Menü"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Slug (URL Kimliği) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="cihangir-doyuran-menu"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Paket Satış Fiyatı (TRY) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      required
                      value={formData.sellingPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full pl-3 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">
                      ₺
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Başlangıç Tarihi (Opsiyonel)
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Bitiş Tarihi (Opsiyonel)
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="2 Kişilik zengin menü..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                  />
                </div>

                {/* Items Builder */}
                <div className="sm:col-span-2 space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-800">Pakete Dahil Ürünler *</span>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9C7A3F] hover:underline"
                    >
                      <Plus size={14} />
                      <span>Ürün Ekle</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <select
                          value={it.productId}
                          onChange={(e) => handleItemChange(idx, e.target.value, it.quantity)}
                          className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                        >
                          {availableProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.basePriceTRY.toFixed(2)} ₺)
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          value={it.quantity}
                          onChange={(e) =>
                            handleItemChange(idx, it.productId, parseInt(e.target.value) || 1)
                          }
                          className="w-16 px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-center font-bold"
                          title="Adet"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded text-[#9C7A3F] focus:ring-[#9C7A3F]"
                    />
                    <span className="font-semibold text-stone-700">Fırsat Paketi Aktif</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#9C7A3F] hover:bg-[#836531] text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting && <CircleNotch size={14} className="animate-spin" />}
                  <span>{editingOffer ? "Değişiklikleri Kaydet" : "Paketi Oluştur"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
