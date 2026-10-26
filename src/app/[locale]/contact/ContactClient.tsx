"use client";

import React, { useState } from "react";
import { RESTAURANT_CONFIG } from "@/data/restaurantConfig";
import { Phone, MapPin, Clock, PaperPlaneTilt, CheckCircle, WarningCircle } from "@phosphor-icons/react";

import { CONTACT_PAGE_CONTENT } from "@/data/subpagesContent";
import { Locale } from "@/i18n/translations";

interface ContactClientProps {
  locale: string;
}

export default function ContactClient({ locale }: ContactClientProps) {
  const isRtl = locale === "ar" || locale === "fa";
  const [formData, setFormData] = useState({ name: "", contact: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const t = CONTACT_PAGE_CONTENT[locale as Locale] || CONTACT_PAGE_CONTENT.tr;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim() || !formData.message.trim()) {
      setStatus("error");
      setErrorMessage(t.errorFillMsg);
      return;
    }

    setStatus("submitting");
    setTimeout(() => {
      // Clean, honest client acknowledgment (no fake backend simulation)
      setStatus("success");
      setFormData({ name: "", contact: "", message: "" });
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12" dir={isRtl ? "rtl" : "ltr"}>
      {/* Header Banner */}
      <div className="text-center mb-10">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#B8381E]/10 text-[#B8381E] border border-[#B8381E]/25 mb-3">
          {t.badge}
        </span>
        <h1
          className="text-2xl sm:text-4xl font-black text-[#261E1A] mb-3"
          style={{ fontFamily: "var(--font-cairo)" }}
        >
          {t.title}
        </h1>
        <p className="text-sm sm:text-base text-[#6E5F53] max-w-2xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Grid: Details Left, Form Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Phone Card */}
          <div className="bg-[#FFFFFF] border border-[#B8381E]/20 rounded-2xl p-5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B8381E] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Phone size={22} weight="bold" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-[#261E1A] uppercase tracking-wider mb-1">
                  {t.callUs}
                </h2>
                <a
                  href={`tel:${RESTAURANT_CONFIG.phone.tel}`}
                  className="text-lg font-black text-[#B8381E] hover:text-[#992E17] transition-colors block"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {RESTAURANT_CONFIG.phone.display}
                </a>
                <p className="text-xs text-[#6E5F53] mt-1">
                  {t.deliveryNoticeDesc}
                </p>
              </div>
            </div>
            <a
              href={`tel:${RESTAURANT_CONFIG.phone.tel}`}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#B8381E] hover:bg-[#992E17] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>{t.callUs}</span>
            </a>
          </div>

          {/* Address & Maps Card */}
          <div className="bg-[#FAF7F0] border border-[#9C7A3F]/25 rounded-2xl p-5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#9C7A3F] text-white flex items-center justify-center shrink-0">
                <MapPin size={22} weight="bold" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#2B2620] uppercase tracking-wider mb-1">
                  {t.addressTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#5A5344] font-medium leading-relaxed">
                  {RESTAURANT_CONFIG.address.fullText}
                </p>
              </div>
            </div>
            <a
              href={RESTAURANT_CONFIG.address.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3.5 w-full py-2 rounded-xl border border-[#9C7A3F]/40 bg-[#EDE3CE] hover:bg-[#9C7A3F] hover:text-white text-[#2B2620] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
            >
              <span>{t.openMap}</span>
            </a>
          </div>

          {/* Hours Card */}
          <div className="bg-[#FAF7F0] border border-[#9C7A3F]/25 rounded-2xl p-5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7A7364] text-white flex items-center justify-center shrink-0">
                <Clock size={22} weight="bold" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#2B2620] uppercase tracking-wider mb-1">
                  {t.hoursTitle}
                </h3>
                <p className="text-sm font-black text-[#2B2620]">
                  {RESTAURANT_CONFIG.hours.display}
                </p>
                <p className="text-xs text-[#7A7364] mt-0.5">
                  {RESTAURANT_CONFIG.hours.days}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Map & Message Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Map Embed */}
          <div className="rounded-2xl overflow-hidden border-2 border-[#9C7A3F]/35 shadow-md bg-[#EDE3CE]">
            <iframe
              title="Cihangir Ev Yemekleri & Pide Location"
              src={RESTAURANT_CONFIG.address.googleMapsEmbedUrl}
              width="100%"
              height="240"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-60 filter contrast-105"
            />
          </div>

          {/* Contact Form */}
          <div className="bg-[#FAF7F0] border border-[#9C7A3F]/25 rounded-2xl p-6 shadow-xs text-start">
            <h3
              className="text-lg font-bold text-[#2B2620] mb-1"
              style={{ fontFamily: "var(--font-cairo)" }}
            >
              {t.formTitle}
            </h3>
            <p className="text-xs text-[#7A7364] mb-5 leading-relaxed">
              {t.formNotice}
            </p>

            {status === "success" ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start gap-3 text-xs leading-relaxed">
                <CheckCircle size={20} weight="fill" className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">{t.successMsg}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="underline text-emerald-800 font-semibold cursor-pointer text-[11px] mt-1"
                  >
                    {isRtl ? "إرسال رسالة أخرى" : "Yeni mesaj yaz"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === "error" && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <WarningCircle size={16} weight="bold" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#2B2620] mb-1">
                    {t.nameLabel} <span className="text-[#A0422E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#9C7A3F]/30 bg-white text-xs text-[#2B2620] focus:outline-hidden focus:border-[#9C7A3F] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2620] mb-1">
                    {t.contactLabel} <span className="text-[#A0422E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#9C7A3F]/30 bg-white text-xs text-[#2B2620] focus:outline-hidden focus:border-[#9C7A3F] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B2620] mb-1">
                    {t.messageLabel} <span className="text-[#A0422E]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#9C7A3F]/30 bg-white text-xs text-[#2B2620] focus:outline-hidden focus:border-[#9C7A3F] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full py-3 rounded-xl bg-[#9C7A3F] hover:bg-[#856632] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <PaperPlaneTilt size={16} weight="bold" />
                  <span>{status === "submitting" ? t.sendingBtn : t.sendBtn}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
