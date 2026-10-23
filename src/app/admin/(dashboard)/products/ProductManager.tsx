"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  MagnifyingGlass,
  Funnel,
  PencilSimple,
  Trash,
  ClockCounterClockwise,
  CheckCircle,
  XCircle,
  Star,
  CircleNotch,
  X,
  Warning,
} from "@phosphor-icons/react";

interface ProductItem {
  id: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  basePriceTRY: number;
  imageUrl: string | null;
  isAvailable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  orderIndex: number;
  name: string;
  description: string;
  name_en: string;
  name_ar: string;
  lastPriceChange: string;
}

interface CategoryOption {
  id: string;
  slug: string;
  name: string;
}

interface PriceHistoryEntry {
  id: string;
  oldPrice: number;
  newPrice: number;
  changedBy: string | null;
  reason: string | null;
  createdAt: string;
}

export default function ProductManager() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "inStock" | "outOfStock">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Price history modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyProductName, setHistoryProductName] = useState("");

  // Delete / Safe Deactivate modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    name_en: "",
    name_ar: "",
    description: "",
    categoryId: "",
    slug: "",
    basePriceTRY: 0,
    imageUrl: "",
    isActive: true,
    isAvailable: true,
    isFeatured: false,
    orderIndex: 0,
    priceChangeReason: "",
  });

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok && data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "15");
      if (search.trim()) params.set("search", search.trim());
      if (selectedCategory) params.set("categoryId", selectedCategory);
      if (statusFilter === "active") params.set("isActive", "true");
      if (statusFilter === "inactive") params.set("isActive", "false");
      if (availabilityFilter === "inStock") params.set("isAvailable", "true");
      if (availabilityFilter === "outOfStock") params.set("isAvailable", "false");

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ürünler yüklenemedi.");
        return;
      }

      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch {
      setError("Ürünler listelenirken bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory, statusFilter, availabilityFilter]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      name_en: "",
      name_ar: "",
      description: "",
      categoryId: categories[0]?.id || "",
      slug: "",
      basePriceTRY: 100,
      imageUrl: "",
      isActive: true,
      isAvailable: true,
      isFeatured: false,
      orderIndex: 0,
      priceChangeReason: "",
    });
    setFormError(null);
    setEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      name_en: p.name_en || "",
      name_ar: p.name_ar || "",
      description: p.description || "",
      categoryId: p.categoryId,
      slug: p.slug,
      basePriceTRY: p.basePriceTRY,
      imageUrl: p.imageUrl || "",
      isActive: p.isActive,
      isAvailable: p.isAvailable,
      isFeatured: p.isFeatured,
      orderIndex: p.orderIndex,
      priceChangeReason: "",
    });
    setFormError(null);
    setEditModalOpen(true);
  };

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, name: val };
      if (!editingProduct) {
        // Simple Turkish slugify
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

  // Handle Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "İşlem başarısız.");
        setFormSubmitting(false);
        return;
      }

      setEditModalOpen(false);
      fetchProducts();
    } catch {
      setFormError("Sunucu bağlantı hatası oluştu.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // View Price History
  const handleViewPriceHistory = async (p: ProductItem) => {
    setHistoryProductName(p.name);
    setHistoryLoading(true);
    setHistoryModalOpen(true);
    try {
      const res = await fetch(`/api/admin/products/${p.id}`);
      const data = await res.json();
      if (res.ok && data.product?.priceHistory) {
        setPriceHistory(data.product.priceHistory);
      }
    } catch {
      console.error("Failed to load price history");
    } finally {
      setHistoryLoading(false);
    }
  };

  // Handle Delete / Safe Deactivate
  const confirmDelete = async (forceDeactivate: boolean = false) => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(
        `/api/admin/products/${productToDelete.id}?deactivate=${forceDeactivate ? "true" : "false"}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Silme işlemi başarısız.");
        setDeleteLoading(false);
        return;
      }

      setDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch {
      alert("İşlem sırasında hata oluştu.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Quick toggle availability switch
  const handleQuickToggleAvailability = async (p: ProductItem) => {
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...p,
          isAvailable: !p.isAvailable,
        }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === p.id ? { ...item, isAvailable: !item.isAvailable } : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle availability:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE3CE]">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2620] tracking-tight">
            Ürün Yönetimi
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Toplam <span className="font-semibold text-[#9C7A3F]">{totalCount}</span> ürün kayıtlı
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9C7A3F] hover:bg-[#836531] text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus size={16} weight="bold" />
          <span>Yeni Ürün Ekle</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EDE3CE] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <MagnifyingGlass
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              placeholder="Ürün adı veya slug ile ara..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/40"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/40"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={availabilityFilter}
              onChange={(e: any) => {
                setAvailabilityFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/40"
            >
              <option value="all">Tüm Stok Durumu</option>
              <option value="inStock">Satışta / Stokta</option>
              <option value="outOfStock">Tükendi / Stok Dışı</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#EDE3CE] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-stone-400">
            <CircleNotch size={28} className="animate-spin text-[#9C7A3F]" />
            <span className="text-xs">Ürünler yükleniyor...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-400">
            Kriterlere uygun ürün bulunamadı.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F2E7] text-[#2B2620] border-b border-[#EDE3CE]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ürün Adı</th>
                  <th className="py-3 px-4 font-semibold">Kategori</th>
                  <th className="py-3 px-4 font-semibold">Fiyat (TRY)</th>
                  <th className="py-3 px-4 font-semibold text-center">Stokta</th>
                  <th className="py-3 px-4 font-semibold text-center">Aktif</th>
                  <th className="py-3 px-4 font-semibold text-center">Öne Çıkan</th>
                  <th className="py-3 px-4 font-semibold text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-800">{p.name}</div>
                      <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                        /{p.slug}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px]">
                        {p.categoryName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#2B2620]">
                          {p.basePriceTRY.toFixed(2)} ₺
                        </span>
                        <button
                          onClick={() => handleViewPriceHistory(p)}
                          title="Fiyat Geçmişini Gör"
                          className="p-1 rounded text-stone-400 hover:text-[#9C7A3F] hover:bg-stone-100 transition-colors"
                        >
                          <ClockCounterClockwise size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleQuickToggleAvailability(p)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                          p.isAvailable
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {p.isAvailable ? (
                          <>
                            <CheckCircle size={12} weight="fill" />
                            <span>Stokta</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={12} weight="fill" />
                            <span>Tükendi</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          p.isActive ? "bg-emerald-500" : "bg-stone-300"
                        }`}
                        title={p.isActive ? "Aktif" : "Pasif"}
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      {p.isFeatured && (
                        <Star size={16} weight="fill" className="text-amber-500 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-[#9C7A3F] hover:bg-stone-100 transition-colors"
                          title="Düzenle"
                        >
                          <PencilSimple size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setProductToDelete(p);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Sil veya Pasife Al"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="p-3 bg-[#F7F2E7]/60 border-t border-[#EDE3CE] flex items-center justify-between text-xs">
            <span className="text-stone-500">
              Sayfa {page} / {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded bg-white border border-stone-200 text-stone-700 disabled:opacity-40"
              >
                Önceki
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded bg-white border border-stone-200 text-stone-700 disabled:opacity-40"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Create / Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#EDE3CE] overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-[#2B2620] text-[#EDE3CE] flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Turkish Name */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Ürün Adı (Türkçe) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Örn: Kuru Fasulye"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                  />
                </div>

                {/* English Name */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    İngilizce İsim (EN)
                  </label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="White Bean Stew"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                  />
                </div>

                {/* Arabic Name */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Arapça İsim (AR)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    placeholder="فاصولياء بيضاء"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Slug */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Slug (URL Kimliği) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="kuru-fasulye"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                  />
                </div>

                {/* Canonical Base Price TRY */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Taban Satış Fiyatı (TRY) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      required
                      value={formData.basePriceTRY}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          basePriceTRY: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full pl-3 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">
                      ₺
                    </span>
                  </div>
                </div>

                {/* Order Index */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Görüntüleme Sırası
                  </label>
                  <input
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) =>
                      setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                  />
                </div>

                {/* Price change reason if editing */}
                {editingProduct &&
                  Math.abs(editingProduct.basePriceTRY - formData.basePriceTRY) >= 0.01 && (
                    <div className="sm:col-span-2 p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                      <label className="block font-semibold text-amber-900">
                        Fiyat Değişiklik Gerekçesi (Fiyat Geçmişine Kaydedilir)
                      </label>
                      <input
                        type="text"
                        value={formData.priceChangeReason}
                        onChange={(e) =>
                          setFormData({ ...formData, priceChangeReason: e.target.value })
                        }
                        placeholder="Örn: Hammadde maliyet artışı"
                        className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                      />
                    </div>
                  )}

                {/* Image URL */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Ürün Görseli (URL veya Dosya Yolu)
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/images/kuru-fasulye.webp"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Açıklama / Malzeme Notları
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Özel tereyağlı geleneksel İspir kuru fasulyesi..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                  />
                </div>

                {/* Checkbox Toggles */}
                <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded text-[#9C7A3F] focus:ring-[#9C7A3F]"
                    />
                    <span className="font-semibold text-stone-700">Menüde Aktif</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-600"
                    />
                    <span className="font-semibold text-stone-700">Satışta / Stokta Mevcut</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-stone-700">Öne Çıkan</span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#9C7A3F] hover:bg-[#836531] text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {formSubmitting && <CircleNotch size={14} className="animate-spin" />}
                  <span>{editingProduct ? "Değişiklikleri Kaydet" : "Ürünü Oluştur"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Price History Modal */}
      {historyModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#EDE3CE] overflow-hidden">
            <div className="px-5 py-3.5 bg-[#2B2620] text-[#EDE3CE] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs">Fiyat Değişiklik Geçmişi</h3>
                <p className="text-[10px] text-stone-400">{historyProductName}</p>
              </div>
              <button
                onClick={() => setHistoryModalOpen(false)}
                className="p-1 text-white/60 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto text-xs">
              {historyLoading ? (
                <div className="py-8 flex justify-center text-stone-400">
                  <CircleNotch size={20} className="animate-spin text-[#9C7A3F]" />
                </div>
              ) : priceHistory.length === 0 ? (
                <p className="py-6 text-center text-stone-400">
                  Kayıtlı fiyat geçmişi bulunmuyor.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {priceHistory.map((h) => (
                    <div
                      key={h.id}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-stone-400 line-through">
                            {h.oldPrice.toFixed(2)} ₺
                          </span>
                          <span className="font-bold text-[#2B2620]">
                            {h.newPrice.toFixed(2)} ₺
                          </span>
                        </div>
                        {h.reason && (
                          <div className="text-[10px] text-stone-500 mt-0.5">
                            {h.reason}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-stone-400 font-mono">
                          {new Date(h.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                        {h.changedBy && (
                          <div className="text-[9px] text-stone-400 mt-0.5">
                            {h.changedBy}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete / Safe Deactivate Modal */}
      {deleteModalOpen && productToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#EDE3CE] overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2.5 rounded-full bg-amber-50">
                <Warning size={24} weight="bold" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#2B2620]">
                  Ürünü Sil veya Pasife Al
                </h3>
                <p className="text-xs text-stone-500">{productToDelete.name}</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Ürün geçmiş siparişler, günün menüsü veya tekliflerde yer alıyorsa veritabanı bütünlüğünü korumak adına tamamen silinmeyip <strong>güvenli bir şekilde pasife alınacaktır</strong>.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => confirmDelete(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold disabled:opacity-50"
              >
                Güvenli Pasife Al
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => confirmDelete(false)}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold disabled:opacity-50"
              >
                Kalıcı Olarak Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
