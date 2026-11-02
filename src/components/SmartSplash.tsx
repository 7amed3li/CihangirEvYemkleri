"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "@/app/smart-splash.css";

const SPLASH_SESSION_KEY = "cihangir_splash_seen_session";

const SPLASH_LAYERS = [
  { className: "splash-layer-ring", src: "/splash/red-ring.webp", alt: "" },
  { className: "splash-layer-steam splash-layer-steam-a", src: "/splash/steam-a.webp", alt: "" },
  { className: "splash-layer-steam splash-layer-steam-b", src: "/splash/steam-b.webp", alt: "" },
  { className: "splash-layer-steam splash-layer-steam-c", src: "/splash/steam-c.webp", alt: "" },
  { className: "splash-layer-pot", src: "/splash/pot-spoon.webp", alt: "" },
  { className: "splash-layer-pide", src: "/splash/pide.webp", alt: "" },
  { className: "splash-layer-garnish", src: "/splash/garnish.webp", alt: "" },
  { className: "splash-layer-type", src: "/splash/typography.webp", alt: "" },
  { className: "splash-layer-detail", src: "/splash/detail-rest.webp", alt: "" },
  { className: "splash-layer-master", src: "/splash/logo-original.webp", alt: "Cihangir Ev Yemekleri & Pide" },
];

export default function SmartSplash() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const hasFinishedRef = useRef(false);

  const finish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsExiting(true);
    try {
      sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    } catch (_) {}
    setTimeout(() => setShow(false), 500);
  }, []);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    setMounted(true);

    // Replay policy: Show only once per browser session
    try {
      const seen = sessionStorage.getItem(SPLASH_SESSION_KEY);
      if (seen) {
        return;
      }
    } catch (_) {}

    // Preload all layers into browser memory immediately
    SPLASH_LAYERS.forEach((layer) => {
      const img = new window.Image();
      img.src = layer.src;
    });

    // Show splash
    setShow(true);

    // Accessibility: Reduced motion check
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      const t = setTimeout(finish, 150);
      return () => clearTimeout(t);
    }

    // 3.1s full cinematic duration:
    // Layers assemble from 0.05s to 1.5s
    // Complete brand logo settles and displays for 1.6s
    // Smooth 0.5s fade-out into the loaded website
    const mainTimer = setTimeout(finish, 3100);
    const fallbackTimer = setTimeout(finish, 3600);

    return () => {
      clearTimeout(mainTimer);
      clearTimeout(fallbackTimer);
    };
  }, [pathname, finish]);

  if (!mounted || !show) return null;

  return (
    <div
      id="cihangir-smart-splash"
      className={`cihangir-splash ${isExiting ? "is-exiting" : ""}`}
      role="presentation"
      aria-hidden="true"
      onClick={finish}
    >
      <div className="splash-stage">
        {SPLASH_LAYERS.map((layer, idx) => (
          <Image
            key={layer.src + idx}
            className={`splash-layer ${layer.className}`}
            src={layer.src}
            alt={layer.alt}
            width={520}
            height={520}
            priority
            unoptimized
          />
        ))}
      </div>

      <div className="splash-skip-hint">
        ✕ Atlamak için dokunun · Skip
      </div>
    </div>
  );
}
