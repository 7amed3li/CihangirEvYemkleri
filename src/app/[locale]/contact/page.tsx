import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactClient from "./ContactClient";
import { getDictionary, SUPPORTED_LOCALES, Locale } from "@/i18n/translations";
import { PAGES_META } from "@/data/pagesContent";

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = PAGES_META.contact[locale as Locale] || PAGES_META.contact.tr;
  return buildPageMetadata({
    locale,
    path: "/contact",
    title: meta.title,
    description: meta.description,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1E7]">
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <ContactClient locale={locale} />
      </main>
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
