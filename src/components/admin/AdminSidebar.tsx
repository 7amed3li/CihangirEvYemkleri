"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SquaresFour,
  CookingPot,
  Folders,
  CalendarCheck,
  Tag,
  GearSix,
  SignOut,
  ArrowSquareOut,
  List,
  X,
  ShieldCheck,
} from "@phosphor-icons/react";

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

const NAV_ITEMS = [
  { href: "/admin", label: "Genel Bakış", icon: SquaresFour },
  { href: "/admin/products", label: "Ürün Yönetimi", icon: CookingPot },
  { href: "/admin/categories", label: "Kategoriler", icon: Folders },
  { href: "/admin/daily-menu", label: "Günün Menüsü", icon: CalendarCheck },
  { href: "/admin/offers", label: "Fırsat Paketleri", icon: Tag },
  { href: "/admin/settings", label: "Ayarlar & Ekip", icon: GearSix },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "OWNER":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "MANAGER":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "EDITOR":
        return "bg-blue-100 text-blue-900 border-blue-300";
      default:
        return "bg-stone-200 text-stone-700 border-stone-300";
    }
  };

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#2B2620] text-[#EDE3CE] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#9C7A3F] flex items-center justify-center font-bold text-white text-sm">
            C
          </div>
          <span className="font-semibold text-sm tracking-wide">Cihangir Panel</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Menüyü Aç"
        >
          {mobileOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </header>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#2B2620] text-[#EDE3CE] z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-[#4E5F4C]/30 shadow-xl ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand / Logo */}
        <div>
          <div className="px-5 py-6 border-b border-white/10 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9C7A3F] to-[#4E5F4C] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                C
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-tight text-white group-hover:text-[#EDE3CE] transition-colors">
                  Cihangir
                </h1>
                <p className="text-[11px] text-[#EDE3CE]/60">Restoran Yönetimi</p>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 mt-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#9C7A3F] text-white shadow-md font-semibold"
                      : "text-[#EDE3CE]/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={19} weight={isActive ? "fill" : "regular"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {/* Public Menu link */}
          <Link
            href="/tr/menu"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#EDE3CE]/80 transition-colors"
          >
            <span>Canlı Menüyü Gör</span>
            <ArrowSquareOut size={14} />
          </Link>

          {/* User profile card */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#4E5F4C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold border ${getRoleBadge(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-white/10 transition-colors ml-1 shrink-0"
              title="Çıkış Yap"
            >
              <SignOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
