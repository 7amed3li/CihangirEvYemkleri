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
  const meta = PAGES_META.cancellation[locale as Locale] || PAGES_META.cancellation.tr;
  const canonicalUrl = `https://cihangir-ev-yemkleri.vercel.app/${locale}/cancellation`;

  const languageAlternates: Record<string, string> = {};
  SUPPORTED_LOCALES.forEach((l) => {
    languageAlternates[l] = `https://cihangir-ev-yemkleri.vercel.app/${l}/cancellation`;
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

export default async function CancellationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const isRtl = locale === "ar" || locale === "fa";

  const t = {
    badge: isRtl ? "سياسة الإلغاء والاسترداد" : "İptal & İade Koşulları",
    title: isRtl ? "سياسة إلغاء وتعديل الطلبات" : "Sipariş İptal ve İade Şartları",
    notice: isRtl
      ? "نظراً لأن أطباقنا وفطائر البيدة تُعد وتُخبز طازجة وساخنة فور تأكيد الطلب، نوضح فيما يلي الضوابط المعمول بها."
      : "Yemeklerimiz ve taş fırın pidelerimiz sipariş anında taze ve sıcak olarak hazırlandığından iptal süreçleri aşağıda belirtilmiştir.",
    sec1Title: isRtl ? "1. إلغاء الطلبات الفورية" : "1. Hazırlık Aşamasında İptal",
    sec1Body: isRtl
      ? "يمكن للعميل تعديل أو إلغاء الطلب عبر الاتصال الهاتفي الفوري بالمطعم قبل البدء في فرد العجين أو غرف الوجبة وتعبئتها. بمجرد بدء الطهي أو خروج الكابتن للتوصيل، يتعذر الإلغاء."
      : "Siparişinizi fırına verilmeden veya paketlenmeye başlamadan önce doğrudan telefonla arayarak iptal edebilirsiniz. Hazırlığı tamamlanan veya kuryeye teslim edilen siparişlerde iptal yapılamamaktadır.",
    sec2Title: isRtl ? "2. المنتجات التالفة أو الخطأ في الطلب" : "2. Yanlış veya Hasarlı Teslimat",
    sec2Body: isRtl
      ? "في حال وجود أي خطأ غير مقصود في الصنف المستلم، نرجو إبلاغ طاقم المطعم فوراً هاتفياً لنقوم بإعادة تحضير الطبق الصحيح أو تسوية الأمر بما يرضي العميل."
      : "Teslim aldığınız siparişte herhangi bir eksiklik veya hata bulunması durumunda lütfen derhal telefonla bize ulaşınız; memnuniyetiniz için hızlıca telafi sağlanacaktır.",
    sec3Title: isRtl ? "3. التواصل للاستفسار" : "3. İletişim",
    sec3Body: isRtl
      ? `لأي استفسار يتعلق بالطلبات، يرجى الاتصال المباشر على رقم المطعم: ${RESTAURANT_CONFIG.phone.display}`
      : `İptal ve iade süreçleriyle ilgili tüm sorularınız için doğrudan bize ulaşabilirsiniz: ${RESTAURANT_CONFIG.phone.display}`,
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
              {RESTAURANT_CONFIG.name} — {RESTAURANT_CONFIG.phone.display}
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
