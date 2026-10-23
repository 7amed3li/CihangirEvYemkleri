"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  PencilSimple,
  Trash,
  CircleNotch,
  X,
  WarningCircle,
  ArrowsDownUp,
} from "@phosphor-icons/react";

interface CategoryItem {
  id: string;
  slug: string;
  orderIndex: number;
  isActive: boolean;
  productCount: number;
  name: string;
  description: string;
  name_en: string;
  name_ar: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState<CategoryItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    name_en: "",
    name_ar: "",
    slug: "",
    description: "",
    orderIndex: 0,
    isActive: true,
  });

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kategoriler yüklenemedi.");
        return;
      }
      setCategories(data.categories || []);
    } catch {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      name_en: "",
      name_ar: "",
      slug: "",
      description: "",
      orderIndex: categories.length + 1,
      isActive: true,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: CategoryItem) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      name_en: c.name_en || "",
      name_ar: c.name_ar || "",
      slug: c.slug,
      description: c.description || "",
      orderIndex: c.orderIndex,
      isActive: c.isActive,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, name: val };
      if (!editingCategory) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

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
      fetchCategories();
    } catch {
      setFormError("Sunucu bağlantı hatası oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!catToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${catToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Silme işlemi başarısız.");
        setDeleteLoading(false);
        return;
      }
      setDeleteModalOpen(false);
      setCatToDelete(null);
      fetchCategories();
    } catch {
      alert("Hata oluştu.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE3CE]">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2620] tracking-tight">
            Kategori Yönetimi
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Menü bölümlerini ve görüntüleme sıralarını düzenleyin
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9C7A3F] hover:bg-[#836531] text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus size={16} weight="bold" />
          <span>Yeni Kategori Ekle</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#EDE3CE] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-stone-400">
            <CircleNotch size={28} className="animate-spin text-[#9C7A3F]" />
            <span className="text-xs">Kategoriler yükleniyor...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-600">{error}</div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-400">
            Henüz kategori eklenmemiş.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F2E7] text-[#2B2620] border-b border-[#EDE3CE]">
                <tr>
                  <th className="py-3 px-4 font-semibold w-16 text-center">Sıra</th>
                  <th className="py-3 px-4 font-semibold">Kategori Adı</th>
                  <th className="py-3 px-4 font-semibold">Slug (URL)</th>
                  <th className="py-3 px-4 font-semibold text-center">Ürün Sayısı</th>
                  <th className="py-3 px-4 font-semibold text-center">Durum</th>
                  <th className="py-3 px-4 font-semibold text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-center text-stone-600">
                      #{c.orderIndex}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-800">{c.name}</div>
                      {(c.name_en || c.name_ar) && (
                        <div className="text-[10px] text-stone-400 flex items-center gap-2 mt-0.5">
                          {c.name_en && <span>EN: {c.name_en}</span>}
                          {c.name_ar && <span>AR: {c.name_ar}</span>}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                      {c.slug}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold">
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        {c.productCount} ürün
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          c.isActive ? "bg-emerald-500" : "bg-stone-300"
                        }`}
                        title={c.isActive ? "Aktif" : "Pasif"}
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-[#9C7A3F] hover:bg-stone-100 transition-colors"
                          title="Düzenle"
                        >
                          <PencilSimple size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setCatToDelete(c);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Sil"
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
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#EDE3CE] overflow-hidden">
            <div className="px-6 py-4 bg-[#2B2620] text-[#EDE3CE] flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Kategori Adı (Türkçe) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Örn: Çorbalar"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      İngilizce İsim (EN)
                    </label>
                    <input
                      type="text"
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                      placeholder="Soups"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Arapça İsim (AR)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formData.name_ar}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                      placeholder="الشوربات"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Slug (URL) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="corbalar"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                    />
                  </div>
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
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Açıklama (Opsiyonel)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Geleneksel lezzetler..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C7A3F]/50"
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded text-[#9C7A3F] focus:ring-[#9C7A3F]"
                    />
                    <span className="font-semibold text-stone-700">Aktif Olarak Yayında</span>
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
                  <span>{editingCategory ? "Değişiklikleri Kaydet" : "Kategori Oluştur"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && catToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#EDE3CE] overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-full bg-red-50">
                <WarningCircle size={24} weight="bold" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#2B2620]">Kategoriyi Sil</h3>
                <p className="text-stone-500">{catToDelete.name}</p>
              </div>
            </div>

            {catToDelete.productCount > 0 ? (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl leading-relaxed">
                Bu kategoride kayıtlı <strong>{catToDelete.productCount}</strong> adet ürün bulunmaktadır. Kategoriyi silebilmek için önce bu ürünleri silmeli veya başka bir kategoriye taşımalısınız.
              </div>
            ) : (
              <p className="text-stone-600 leading-relaxed">
                Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50"
              >
                Vazgeç
              </button>
              {catToDelete.productCount === 0 && (
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={confirmDelete}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
                >
                  Kategoriyi Sil
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
