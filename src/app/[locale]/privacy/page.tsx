import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
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
  const meta = PAGES_META.privacy[locale as Locale] || PAGES_META.privacy.tr;
  return buildPageMetadata({
    locale,
    path: "/privacy",
    title: meta.title,
    description: meta.description,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const isRtl = locale === "ar" || locale === "fa";

  const t = {
    badge: isRtl ? "حماية البيانات والخصوصية" : "Kişisel Verilerin Korunması",
    title: isRtl ? "سياسة الخصوصية وحماية البيانات" : "Gizlilik ve Çerez Politikası",
    notice: isRtl
      ? "نلتزم في مطعم جيهانغير بحماية خصوصية زوارنا وعملائنا الكرام. لا نجمع أي بيانات شخصية غير ضرورية لعملية إعداد وتسليم وجباتكم."
      : "Cihangir Ev Yemekleri & Pide olarak misafirlerimizin gizliliğine ve kişisel verilerinin korunmasına azami özen göstermekteyiz.",
    sec1Title: isRtl ? "1. البيانات التي يتم جمعها" : "1. Toplanan Bilgiler",
    sec1Body: isRtl
      ? "عند التواصل هاتفياً أو عبر نموذج الاستفسار، قد نطلب فقط الاسم ورقم الهاتف وعنوان التوصيل لإتمام خدمة الطلب. لا نطلب أي معلومات مصرفية أو بطاقات دفع عبر الموقع."
      : "Sipariş teslimatı ve iletişim süreçlerinde yalnızca ad, telefon numarası ve teslimat adresi gibi asgari gerekli bilgiler işlenir. Sitemiz kredi kartı veya banka şifresi gibi hassas finansal verileri toplamaz.",
    sec2Title: isRtl ? "2. التفضيلات وملفات تعريف الارتباط" : "2. Çerezler ve Tercihler",
    sec2Body: isRtl
      ? "يستخدم موقعنا التخزين المحلي (LocalStorage) فقط لحفظ تفضيلات العملة واللغة وسلة الطلبات على جهازكم لتوفير تجربة تصفح مريحة."
      : "Web sitemiz dil, para birimi ve sepet içeriklerini tarayıcınızda hatırlamak amacıyla yerel depolama (LocalStorage) kullanır. Bu veriler üçüncü şahıslarla paylaşılmaz.",
    sec3Title: isRtl ? "3. حقوق العميل والتواصل" : "3. Veri Sahibi Hakları",
    sec3Body: isRtl
      ? "يحق لأي عميل الاستفسار عن بياناته أو طلب تصحيحها أو حذفها عبر الاتصال المباشر بإدارة المطعم."
      : "Kişisel verilerinizle ilgili her türlü soru ve talebiniz için doğrudan restoranımızla iletişime geçebilirsiniz.",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1E7]" dir={isRtl ? "rtl" : "ltr"}>
      <Header locale={locale} dict={dict} />

      <main className="flex-1 py-10 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-6 text-start">
          <div className="text-center space-y-2 mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#253D2C]/7 text-[#596752] border border-[#253D2C]/17">
              {t.badge}
            </span>
            <h1
              className="text-2xl sm:text-3xl font-black text-[#253D2C]"
              style={{ fontFamily: "var(--font-cairo)" }}
            >
              {t.title}
            </h1>
            <p className="text-xs text-[#76816E]">
              {RESTAURANT_CONFIG.name} — {RESTAURANT_CONFIG.phone.display}
            </p>
          </div>

          <div className="bg-[#FFFAF0] border border-[#253D2C]/14 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs leading-relaxed text-xs sm:text-sm text-[#596752]">
            <p className="font-medium text-[#253D2C]">{t.notice}</p>

            <div>
              <h2 className="text-base font-bold text-[#253D2C] mb-2">{t.sec1Title}</h2>
              <p>{t.sec1Body}</p>
            </div>

            <div>
              <h2 className="text-base font-bold text-[#253D2C] mb-2">{t.sec2Title}</h2>
              <p>{t.sec2Body}</p>
            </div>

            <div>
              <h2 className="text-base font-bold text-[#253D2C] mb-2">{t.sec3Title}</h2>
              <p>{t.sec3Body}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} dict={dict} />
    </div>
  );
}
