import React from "react";
import type { Metadata } from "next";
import RootDocument from "@/components/RootDocument";

export const metadata: Metadata = {
  title: "Cihangir Panel",
  // Private back-office: never index, even if a URL leaks.
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootDocument lang="tr">
      <div className="admin-portal antialiased">{children}</div>
    </RootDocument>
  );
}
