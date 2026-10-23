import React from "react";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Yönetici Girişi | Cihangir Ev Yemekleri & Pide",
};

export default async function AdminLoginPage() {
  let userCount = 0;
  try {
    userCount = await prisma.adminUser.count();
  } catch (err) {
    console.warn("[AdminLoginPage] DB check failed (tables may be uninitialized):", err);
    userCount = 0;
  }

  if (userCount === 0) {
    redirect("/admin/setup");
  }

  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[#F7F2E7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#EDE3CE] overflow-hidden">
        {/* Header with Ottoman styling */}
        <div className="bg-[#2B2620] p-6 text-center text-[#EDE3CE] relative">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#9C7A3F] to-[#4E5F4C] flex items-center justify-center text-white font-bold text-xl shadow-md">
            C
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Cihangir Ev Yemekleri & Pide
          </h1>
          <p className="text-xs text-[#EDE3CE]/70 mt-1">
            Restoran Yönetim Portalı
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
