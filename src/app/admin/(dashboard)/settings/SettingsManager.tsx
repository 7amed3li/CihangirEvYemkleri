"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  ClockCounterClockwise,
  Plus,
  Trash,
  CircleNotch,
  X,
  PencilSimple,
  CheckCircle,
  XCircle,
  Info,
} from "@phosphor-icons/react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "MANAGER" | "EDITOR" | "VIEWER";
  isActive: boolean;
  createdAt: string;
}

interface AuditLogItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
  user: { name: string; email?: string; role: string } | null;
}

interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function SettingsManager() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "audit" | "system">("users");

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submittingUser, setSubmittingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "EDITOR" as "OWNER" | "MANAGER" | "EDITOR" | "VIEWER",
  });

  // Audit state
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // Fetch current user
  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(console.error);
  }, []);

  // Fetch Users
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch Audit Logs
  const fetchAuditLogs = async () => {
    setAuditLoading(true);
    try {
      const res = await fetch("/api/admin/audit-logs?limit=50");
      const data = await res.json();
      if (res.ok && data.auditLogs) {
        setAuditLogs(data.auditLogs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "audit") fetchAuditLogs();
  }, [activeTab]);

  // Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError(null);
    setSubmittingUser(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserData),
      });

      const data = await res.json();
      if (!res.ok) {
        setUserError(data.error || "Kullanıcı oluşturulamadı.");
        setSubmittingUser(false);
        return;
      }

      setCreateModalOpen(false);
      fetchUsers();
    } catch {
      setUserError("Bağlantı hatası oluştu.");
    } finally {
      setSubmittingUser(false);
    }
  };

  // Toggle user status
  const handleToggleUserStatus = async (user: AdminUser) => {
    if (user.id === currentUser?.id) {
      alert("Kendi hesabınızı pasife alamazsınız.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete user
  const handleDeleteUser = async (user: AdminUser) => {
    if (user.id === currentUser?.id) {
      alert("Kendi hesabınızı silemezsiniz.");
      return;
    }
    if (!confirm(`${user.name} kullanıcısını silmek istediğinize emin misiniz?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const isOwner = currentUser?.role === "OWNER";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE3CE]">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2620] tracking-tight">
            Ayarlar ve Güvenlik
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Ekip yetkilendirmesi, denetim kayıtları ve restoran sistem yapılandırması
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#EDE3CE] text-xs font-semibold">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "users"
                ? "bg-[#9C7A3F] text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Yönetim Ekibi
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "audit"
                ? "bg-[#9C7A3F] text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            İşlem Geçmişi (Audit)
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "system"
                ? "bg-[#9C7A3F] text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Sistem Bilgileri
          </button>
        </div>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#2B2620]">
              Yetkili Ekip Üyeleri ({users.length})
            </h2>
            {isOwner && (
              <button
                onClick={() => {
                  setNewUserData({ name: "", email: "", password: "", role: "EDITOR" });
                  setUserError(null);
                  setCreateModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#9C7A3F] hover:bg-[#836531] text-white text-xs font-semibold shadow-xs transition-all"
              >
                <Plus size={15} weight="bold" />
                <span>Yeni Kullanıcı Tanımla</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-[#EDE3CE] shadow-xs overflow-hidden">
            {usersLoading ? (
              <div className="py-16 flex justify-center text-stone-400">
                <CircleNotch size={24} className="animate-spin text-[#9C7A3F]" />
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400">
                Kullanıcı listesi görüntülenemiyor veya yetkiniz bulunmuyor.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F2E7] text-[#2B2620] border-b border-[#EDE3CE]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Ad Soyad</th>
                      <th className="py-3 px-4 font-semibold">E-Posta</th>
                      <th className="py-3 px-4 font-semibold text-center">Rol</th>
                      <th className="py-3 px-4 font-semibold text-center">Durum</th>
                      <th className="py-3 px-4 font-semibold text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-stone-800">
                          {u.name}
                          {u.id === currentUser?.id && (
                            <span className="ml-2 text-[10px] text-[#9C7A3F] font-bold">
                              (Siz)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">
                          {u.email}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                              u.role === "OWNER"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : u.role === "MANAGER"
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                : u.role === "EDITOR"
                                ? "bg-blue-100 text-blue-900 border border-blue-300"
                                : "bg-stone-100 text-stone-700 border border-stone-300"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              u.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {u.isActive ? "Aktif" : "Pasif"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isOwner && u.id !== currentUser?.id && (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleToggleUserStatus(u)}
                                className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 text-[11px]"
                              >
                                {u.isActive ? "Pasife Al" : "Aktifleştir"}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u)}
                                className="p-1.5 rounded text-stone-400 hover:text-red-600 hover:bg-red-50"
                                title="Kullanıcıyı Sil"
                              >
                                <Trash size={15} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#2B2620]">
              İşlem Denetim Kayıtları (Son 50 İşlem)
            </h2>
            <button
              onClick={fetchAuditLogs}
              className="text-xs text-[#9C7A3F] font-semibold hover:underline"
            >
              Yenile
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#EDE3CE] shadow-xs overflow-hidden">
            {auditLoading ? (
              <div className="py-16 flex justify-center text-stone-400">
                <CircleNotch size={24} className="animate-spin text-[#9C7A3F]" />
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400">
                Kayıtlı denetim geçmişi bulunmuyor.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F2E7] text-[#2B2620] border-b border-[#EDE3CE]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Tarih & Saat</th>
                      <th className="py-3 px-4 font-semibold">İşlem (Action)</th>
                      <th className="py-3 px-4 font-semibold">Varlık (Entity)</th>
                      <th className="py-3 px-4 font-semibold">Yapan Kullanıcı</th>
                      <th className="py-3 px-4 font-semibold">Detaylar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString("tr-TR")}
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-800">
                          {log.action}
                        </td>
                        <td className="py-3 px-4 text-stone-600">
                          {log.entityType}
                        </td>
                        <td className="py-3 px-4">
                          {log.user ? (
                            <div className="text-stone-800">
                              <span className="font-semibold">{log.user.name}</span>
                              <span className="text-[10px] text-stone-400 ml-1">
                                ({log.user.role})
                              </span>
                            </div>
                          ) : (
                            <span className="text-stone-400">Sistem / Misafir</span>
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-[11px] text-stone-500 font-mono">
                          {log.details || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === "system" && (
        <div className="bg-white p-6 rounded-2xl border border-[#EDE3CE] shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 text-stone-800 font-bold text-sm border-b border-stone-100 pb-3">
            <Info size={18} className="text-[#9C7A3F]" />
            <span>Restoran Sistem Yapılandırması</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-50 rounded-xl space-y-1">
              <span className="text-stone-400 text-[11px] block">İşletme Taban Para Birimi</span>
              <span className="font-bold text-sm text-[#2B2620]">Türk Lirası (TRY / ₺)</span>
              <p className="text-[11px] text-stone-500">
                Veritabanındaki tüm ürün ve fırsat fiyatları yalnızca TRY olarak saklanır. Müşteri arayüzündeki döviz dönüşümleri anlık `/api/rates` kuru üzerinden hesaplanır.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl space-y-1">
              <span className="text-stone-400 text-[11px] block">İşletme Zaman Dilimi</span>
              <span className="font-bold text-sm text-[#2B2620]">Europe/Istanbul (UTC+3)</span>
              <p className="text-[11px] text-stone-500">
                Günün menüsü ve tarih hesaplamaları sunucu konumu ne olursa olsun Türkiye yerel saatiyle çalışır.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl space-y-1 sm:col-span-2">
              <span className="text-stone-400 text-[11px] block">Desteklenen Diller (10 Dil)</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Türkçe (TR)", "İngilizce (EN)", "Arapça (AR - RTL)", "Farsça (FA - RTL)", "Fransızca (FR)", "Almanca (DE)", "Rusça (RU)", "İtalyanca (IT)", "İspanyolca (ES)", "Çince (ZH)"].map((lang) => (
                  <span key={lang} className="px-2 py-1 rounded bg-white border border-stone-200 text-stone-700 font-medium text-[11px]">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#EDE3CE] overflow-hidden text-xs">
            <div className="px-6 py-4 bg-[#2B2620] text-[#EDE3CE] flex items-center justify-between">
              <h3 className="font-bold text-sm">Yeni Ekip Üyesi Ekle</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-3.5">
              {userError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  {userError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  required
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  placeholder="Ahmet Yılmaz"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  E-Posta Adresi *
                </label>
                <input
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="ahmet@cihangir.com"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Şifre (En az 6 karakter) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Erişim Rolü *
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e: any) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="MANAGER">MANAGER (Ürün, Kategori, Günün Menüsü, Teklifler ve Silme)</option>
                  <option value="EDITOR">EDITOR (Ürün, Kategori, Günün Menüsü, Teklifler Ekleme & Düzenleme)</option>
                  <option value="VIEWER">VIEWER (Salt Okunur - Değişiklik Yapamaz)</option>
                  <option value="OWNER">OWNER (Tam Sistem Sahibi Yetkisi)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submittingUser}
                  className="px-5 py-2 rounded-xl bg-[#9C7A3F] hover:bg-[#836531] text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {submittingUser && <CircleNotch size={14} className="animate-spin" />}
                  <span>Kullanıcıyı Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
