"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import "@/app/smart-splash.css";

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
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const hasFinishedRef = useRef(false);

  const finish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsExiting(true);
    setTimeout(() => {
      setIsDismissed(true);
    }, 480);
  }, []);

  useEffect(() => {
    // Check if splash should be bypassed (e.g. user is switching language)
    try {
      const skipSession = sessionStorage.getItem("cihangir_skip_splash") === "1";
      const skipCookie = document.cookie.indexOf("cihangir_skip_splash=1") !== -1;
      if (skipSession || skipCookie) {
        sessionStorage.removeItem("cihangir_skip_splash");
        document.cookie = "cihangir_skip_splash=; path=/; max-age=0";
        document.documentElement.classList.remove("splash-dismissed");
        setIsDismissed(true);
        return;
      }
    } catch (_) {}

    // Preload all layers into browser memory immediately
    SPLASH_LAYERS.forEach((layer) => {
      const img = new window.Image();
      img.src = layer.src;
    });

    // Accessibility: Reduced motion check
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      const t = setTimeout(finish, 150);
      return () => clearTimeout(t);
    }

    // 2.95s full duration:
    // 0.0s - 1.4s: Layers assemble smoothly into place
    // 1.4s - 2.8s: Complete brand logo displayed
    // 2.8s - 3.2s: Smooth fade-out into the ready website
    const timer = setTimeout(finish, 2850);
    const fallbackTimer = setTimeout(finish, 3400);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [finish]);

  if (isDismissed) return null;

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
