import React from "react";

export const metadata = {
  title: "Cihangir Panel",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-portal antialiased">{children}</div>;
}
