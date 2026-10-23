import React from "react";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Yönetim Paneli | Cihangir Ev Yemekleri & Pide",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userCount = await prisma.adminUser.count();
  if (userCount === 0) {
    redirect("/admin/setup");
  }

  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F7F2E7] flex flex-col lg:flex-row text-[#2B2620]">
      {/* Responsive Sidebar */}
      <AdminSidebar
        user={{
          name: session.name,
          email: session.email,
          role: session.role,
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
