import React from "react";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import SetupForm from "./SetupForm";

export const metadata = {
  title: "İlk Kurulum | Cihangir Ev Yemekleri & Pide",
};

export default async function AdminSetupPage() {
  const userCount = await prisma.adminUser.count();
  if (userCount > 0) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#F7F2E7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#EDE3CE] overflow-hidden">
        <div className="bg-[#2B2620] p-6 text-center text-[#EDE3CE]">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#9C7A3F] to-[#4E5F4C] flex items-center justify-center text-white font-bold text-xl shadow-md">
            C
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            İlk Sistem Kurulumu
          </h1>
          <p className="text-xs text-[#EDE3CE]/70 mt-1">
            Restoran Sahibi (OWNER) Hesabının Oluşturulması
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-relaxed">
            Sistemde henüz yönetici hesabı bulunmamaktadır. Bu ekran yalnızca bir defaya mahsus ilk sahip (OWNER) hesabını tanımlamak içindir. Kurulum sonrası bu ekran kalıcı olarak kapanacaktır.
          </div>
          <SetupForm />
        </div>
      </div>
    </main>
  );
}
