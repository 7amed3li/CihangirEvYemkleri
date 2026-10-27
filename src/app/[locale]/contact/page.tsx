import React from "react";
import type { Metadata } from "next";
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
  const canonicalUrl = `https://cihangirevyemekler.com.tr/${locale}/contact`;

  const languageAlternates: Record<string, string> = {};
  SUPPORTED_LOCALES.forEach((l) => {
    languageAlternates[l] = `https://cihangirevyemekler.com.tr/${l}/contact`;
  });

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonicalUrl,
      siteName: "Cihangir Ev Yemekleri & Pide",
      locale,
      type: "website",
    },
  };
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
