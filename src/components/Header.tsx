"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CurrencySwitcher from "./CurrencySwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import { MenuIcon, HomeIcon, BookOpenIcon, PhoneIcon } from "./BrandIcons";

interface HeaderProps {
  locale: string;
  dict: Record<string, any>;
}

export default function Header({ locale, dict }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        width: "100%",
        backgroundColor: "#F7F2E7",
        borderBottom: "2px solid rgba(156, 122, 63, 0.35)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          maxWidth: "1024px",
          margin: "0 auto",
          padding: "0 16px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo */}
        <Link
          href={`/${locale}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "48px",
              height: "48px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/splash/logo-original.webp"
              alt="Cihangir Ev Yemekleri Pide"
              fill
              priority
              style={{ objectFit: "contain" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "17px",
                fontWeight: 900,
                color: "#2B2620",
                lineHeight: 1,
                fontFamily: "var(--font-cairo), sans-serif",
              }}
            >
              Cihangir
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#9C7A3F",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginTop: "2px",
              }}
            >
              Ev Yemekleri & Pide
            </span>
          </div>
        </Link>

        {/* Right Side Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CurrencySwitcher />
          <LanguageSwitcher currentLocale={locale} />

          {/* Navigation Drawer Button */}
          <div style={{ position: "relative" }} ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                width: "38px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                border: isMenuOpen
                  ? "1px solid #9C7A3F"
                  : "1px solid rgba(156, 122, 63, 0.35)",
                backgroundColor: isMenuOpen ? "rgba(156, 122, 63, 0.15)" : "#F7F2E7",
                color: isMenuOpen ? "#9C7A3F" : "#2B2620",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              aria-label="Navigation Menu"
            >
              <MenuIcon size={20} />
            </button>

            {isMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  marginTop: "8px",
                  width: "220px",
                  borderRadius: "8px",
                  backgroundColor: "#F7F2E7",
                  border: "1px solid rgba(156, 122, 63, 0.3)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                  zIndex: 50,
                  padding: "6px 0",
                }}
              >
                <Link
                  href={`/${locale}`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2B2620",
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#EDE3CE")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <span style={{ color: "#4E5F4C" }}>
                    <HomeIcon size={18} />
                  </span>
                  <span>{dict.home || "Ana Sayfa"}</span>
                </Link>

                <Link
                  href={`/${locale}/menu`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2B2620",
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#EDE3CE")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <span style={{ color: "#4E5F4C" }}>
                    <BookOpenIcon size={18} />
                  </span>
                  <span>{dict.menu || "Menü"}</span>
                </Link>

                <div style={{ height: "1px", backgroundColor: "rgba(156, 122, 63, 0.2)", margin: "4px 0" }} />

                <a
                  href="tel:+902122513696"
                  style={{
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#9C7A3F",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#EDE3CE")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <PhoneIcon size={16} />
                  <span>{dict.contact || "İletişim & Sipariş"}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
