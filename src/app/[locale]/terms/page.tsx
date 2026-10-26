import React from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary, SUPPORTED_LOCALES, Locale } from "@/i18n/translations";
import { PAGES_META } from "@/data/pagesContent";
import { RESTAURANT_CONFIG } from "@/data/restaurantConfig";

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = PAGES_META.terms[locale as Locale] || PAGES_META.terms.tr;
  const canonicalUrl = `https://cihangir-ev-yemkleri.vercel.app/${locale}/terms`;

  const languageAlternates: Record<string, string> = {};
  SUPPORTED_LOCALES.forEach((l) => {
    languageAlternates[l] = `https://cihangir-ev-yemkleri.vercel.app/${l}/terms`;
  });

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const isRtl = locale === "ar" || locale === "fa";

  const t = {
    badge: isRtl ? "المعلومات القانونية والشروط" : "Kullanım ve Hizmet Şartları",
    title: isRtl ? "شروط الاستخدام والخدمة" : "Web Sitesi Kullanım Koşulları",
    notice: isRtl
      ? "تنبيه تنظيمي: هذه الشروط تنظم تصفح الموقع وعرض القائمة والطلب من مطعم جيهانغير للمطبخ البيتي وبيدة الفرن الحجري."
      : "Bu kullanım koşulları, Cihangir Ev Yemekleri & Pide web sitesi üzerinden sunulan menü inceleme ve sipariş bilgilendirme hizmetlerini kapsar.",
    sec1Title: isRtl ? "1. طبيعة الخدمات المعروضة" : "1. Hizmetin Niteliği",
    sec1Body: isRtl
      ? "الموقع مخصص لعرض قائمة أطباق اليوم وفطائر البيدة وأسعارها بالليرة التركية وتسهيل التواصل والطلب الهاتفي أو عبر المراسلة. لا تتم أي عمليات دفع إلكتروني بنكية مباشرة عبر الموقع حالياً."
      : "Web sitemiz restoranımızın günlük tencere yemeklerini, pide çeşitlerini ve fiyatlarını tanıtmak; telefon ve mesajla sipariş süreçlerini kolaylaştırmak amacıyla hizmet vermektedir. Sitemiz üzerinden doğrudan online kredi kartı tahsilatı yapılmamaktadır.",
    sec2Title: isRtl ? "2. دقة الأسعار وتوافر الأطباق" : "2. Fiyatlar ve Ürün Stok Durumu",
    sec2Body: isRtl
      ? "نظراً لأن الوجبات تُطهى طازجة يومياً، فقد ينفد أحد أصناف اليوم قبل موعد إغلاق المطعم. الأسعار الرسمية هي المعروضة بالليرة التركية (TRY) في صالة المطعم."
      : "Günlük ev yemeklerinin porsiyonları taze olarak hazırlandığından gün içinde tükenebilir. Nihai geçerli fiyatlar restoran kasasındaki Türk Lirası fiyatlarıdır. Yabancı para birimleri yaklaşık kur göstergesidir.",
    sec3Title: isRtl ? "3. حقوق الملكية الفكرية" : "3. Fikri Mülkiyet",
    sec3Body: isRtl
      ? "جميع النصوص والتصاميم والصور الفوتوغرافية الخاصة بأطباق المطعم محمية بحقوق النشر لصالح مطعم جيهانغير."
      : "Sitede yer alan ürün fotoğrafları, menü metinleri ve tasarım öğeleri Cihangir Ev Yemekleri & Pide mülkiyetindedir.",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EDE3CE]" dir={isRtl ? "rtl" : "ltr"}>
      <Header locale={locale} dict={dict} />

      <main className="flex-1 py-10 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-6 text-start">
          <div className="text-center space-y-2 mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#9C7A3F]/15 text-[#9C7A3F] border border-[#9C7A3F]/30">
              {t.badge}
            </span>
            <h1
              className="text-2xl sm:text-3xl font-black text-[#2B2620]"
              style={{ fontFamily: "var(--font-cairo)" }}
            >
              {t.title}
            </h1>
            <p className="text-xs text-[#7A7364]">
              {RESTAURANT_CONFIG.name} — {RESTAURANT_CONFIG.address.fullText}
            </p>
          </div>

          <div className="bg-[#FAF7F0] border border-[#9C7A3F]/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs leading-relaxed text-xs sm:text-sm text-[#5A5344]">
            <p className="font-medium text-[#2B2620]">{t.notice}</p>

            <div>
              <h2 className="text-base font-bold text-[#2B2620] mb-2">{t.sec1Title}</h2>
              <p>{t.sec1Body}</p>
            </div>

            <div>
              <h2 className="text-base font-bold text-[#2B2620] mb-2">{t.sec2Title}</h2>
              <p>{t.sec2Body}</p>
            </div>

            <div>
              <h2 className="text-base font-bold text-[#2B2620] mb-2">{t.sec3Title}</h2>
              <p>{t.sec3Body}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} dict={dict} />
    </div>
  );
}
