import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DeveloperProfile from "@/components/DeveloperProfile";
import { devCaseStudyContent } from "@/data/developerCaseStudy";
import { getDictionary, SUPPORTED_LOCALES } from "@/i18n/translations";

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = devCaseStudyContent[locale] || devCaseStudyContent.tr;

  return buildPageMetadata({
    locale,
    path: "/tasarim-gelistirme",
    title: content.meta.title,
    description: content.meta.description,
  });
}

export default async function TasarimGelistirmePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const content = devCaseStudyContent[locale] || devCaseStudyContent.tr;
  const isRTL = locale === "ar" || locale === "fa";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: content.meta.title,
            description: content.meta.description,
            mainEntity: {
              "@type": "Person",
              name: "Hamed Mohamed",
              jobTitle: "Product Designer & Full-Stack Engineer",
              url: "https://hamedmohamed.dev",
              sameAs: [
                "https://hamedmohamed.dev",
                "https://wa.me/905060453906",
              ],
            },
          }),
        }}
      />
      <Header locale={locale} dict={dict} />
      <main id="main-content">
        <DeveloperProfile content={content} isRTL={isRTL} lang={locale} />
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}

