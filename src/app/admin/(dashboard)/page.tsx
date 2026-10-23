import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { getIstanbulDateString, formatIstanbulReadable } from "@/lib/date";
import {
  CookingPot,
  Folders,
  CalendarCheck,
  Tag,
  Plus,
  ArrowRight,
  WarningCircle,
  CheckCircle,
  Clock,
  ArrowSquareOut,
} from "@phosphor-icons/react/dist/ssr";

export default async function AdminDashboardPage() {
  const today = getIstanbulDateString();

  const [
    totalProducts,
    activeProducts,
    outOfStockProducts,
    totalCategories,
    activeOffersCount,
    todayMenu,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true, isAvailable: false } }),
    prisma.category.count(),
    prisma.offer.count({ where: { isActive: true } }),
    prisma.dailyMenu.findUnique({
      where: { dateString: today },
      include: {
        _count: { select: { entries: true } },
      },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        user: { select: { name: true, role: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE3CE]">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2620] tracking-tight">
            Restoran Kontrol Paneli
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            İşletme Tarihi: <span className="font-semibold text-[#9C7A3F]">{formatIstanbulReadable(today)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/tr/menu"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#EDE3CE] hover:border-[#9C7A3F] text-xs font-medium text-stone-700 hover:text-[#9C7A3F] shadow-xs transition-all"
          >
            <span>Canlı Menü</span>
            <ArrowSquareOut size={14} />
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Active Products */}
        <div className="bg-white p-5 rounded-2xl border border-[#EDE3CE] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Aktif Ürünler</span>
            <div className="p-2 rounded-xl bg-amber-50 text-[#9C7A3F]">
              <CookingPot size={20} weight="duotone" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#2B2620]">{activeProducts}</span>
            <span className="text-[11px] text-stone-400">/ {totalProducts} toplam</span>
          </div>
          {outOfStockProducts > 0 && (
            <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded-md font-medium">
              <WarningCircle size={13} weight="fill" />
              <span>{outOfStockProducts} ürün tükendi</span>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="bg-white p-5 rounded-2xl border border-[#EDE3CE] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Kategoriler</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-[#4E5F4C]">
              <Folders size={20} weight="duotone" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#2B2620]">{totalCategories}</span>
            <span className="text-[11px] text-stone-400 ml-2">aktif kategori</span>
          </div>
        </div>

        {/* Today's Daily Menu */}
        <div className="bg-white p-5 rounded-2xl border border-[#EDE3CE] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Bugünün Menüsü</span>
            <div
              className={`p-2 rounded-xl ${
                todayMenu?.isPublished
                  ? "bg-emerald-50 text-emerald-700"
                  : todayMenu
                  ? "bg-amber-50 text-amber-700"
                  : "bg-stone-100 text-stone-500"
              }`}
            >
              <CalendarCheck size={20} weight="duotone" />
            </div>
          </div>
          <div className="mt-2">
            {todayMenu?.isPublished ? (
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
                <CheckCircle size={16} weight="fill" />
                <span>Yayında ({todayMenu._count.entries} Ürün)</span>
              </div>
            ) : todayMenu ? (
              <div className="flex items-center gap-1.5 text-amber-700 font-bold text-sm">
                <Clock size={16} weight="fill" />
                <span>Taslak ({todayMenu._count.entries} Ürün)</span>
              </div>
            ) : (
              <span className="text-stone-400 font-medium text-sm">Henüz Ayarlanmadı</span>
            )}
          </div>
          <Link
            href="/admin/daily-menu"
            className="mt-2 text-[11px] text-[#9C7A3F] hover:underline font-semibold flex items-center gap-1"
          >
            <span>{todayMenu ? "Menüyü Düzenle" : "Şimdi Menü Oluştur"}</span>
            <ArrowRight size={11} />
          </Link>
        </div>

        {/* Active Offers */}
        <div className="bg-white p-5 rounded-2xl border border-[#EDE3CE] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Fırsat Paketleri</span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-700">
              <Tag size={20} weight="duotone" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#2B2620]">{activeOffersCount}</span>
            <span className="text-[11px] text-stone-400 ml-2">aktif kampanya</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="bg-white p-5 rounded-2xl border border-[#EDE3CE] shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
          Hızlı Kısayollar
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/products"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F2E7] hover:bg-[#EDE3CE] border border-[#EDE3CE] text-xs font-semibold text-[#2B2620] transition-colors"
          >
            <Plus size={16} className="text-[#9C7A3F]" />
            <span>Yeni Ürün Ekle</span>
          </Link>
          <Link
            href="/admin/daily-menu"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F2E7] hover:bg-[#EDE3CE] border border-[#EDE3CE] text-xs font-semibold text-[#2B2620] transition-colors"
          >
            <CalendarCheck size={16} className="text-[#4E5F4C]" />
            <span>Günün Menüsünü Belirle</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F2E7] hover:bg-[#EDE3CE] border border-[#EDE3CE] text-xs font-semibold text-[#2B2620] transition-colors"
          >
            <Folders size={16} className="text-[#9C7A3F]" />
            <span>Kategorileri Yönet</span>
          </Link>
          <Link
            href="/admin/offers"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F2E7] hover:bg-[#EDE3CE] border border-[#EDE3CE] text-xs font-semibold text-[#2B2620] transition-colors"
          >
            <Tag size={16} className="text-orange-600" />
            <span>Fırsat Paketi Ekle</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity Log Section */}
      <div className="bg-white p-5 rounded-2xl border border-[#EDE3CE] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#2B2620]">
            Son Yönetim Aktiviteleri (Audit Log)
          </h2>
          <Link
            href="/admin/settings"
            className="text-xs text-[#9C7A3F] hover:underline font-medium"
          >
            Tüm Kayıtlar
          </Link>
        </div>

        {recentAuditLogs.length === 0 ? (
          <p className="text-xs text-stone-400 py-4 text-center">
            Henüz kaydedilmiş bir aktivite kaydı bulunmuyor.
          </p>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentAuditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#9C7A3F]" />
                  <div>
                    <span className="font-semibold text-stone-800">{log.action}</span>
                    <span className="text-stone-400 mx-1.5">•</span>
                    <span className="text-stone-500">{log.entityType}</span>
                    {log.user && (
                      <span className="text-stone-400 ml-1.5 font-mono text-[10px]">
                        ({log.user.name})
                      </span>
                    )}
                  </div>
                </div>
                <time className="text-[11px] text-stone-400">
                  {new Date(log.createdAt).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </time>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
