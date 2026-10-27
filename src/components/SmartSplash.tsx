"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SPLASH_SESSION_KEY = "cihangir_splash_seen_session";

export default function SmartSplash() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

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

    // First eligible visit in session: show splash
    setShow(true);

    const finish = () => {
      setIsExiting(true);
      try {
        sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
      } catch (_) {}
      setTimeout(() => setShow(false), 350);
    };

    // Reduced motion check: fast transition (150ms)
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      const t = setTimeout(finish, 150);
      return () => clearTimeout(t);
    }

    // Default duration: 1.9s with 2.2s safe fallback
    const mainTimer = setTimeout(finish, 1900);
    const fallbackTimer = setTimeout(finish, 2200);

    return () => {
      clearTimeout(mainTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (!mounted || !show) return null;

  return (
    <div
      id="cihangir-smart-splash"
      className={`cihangir-splash ${isExiting ? "is-exiting" : ""}`}
      role="presentation"
      aria-hidden="true"
    >
      <style jsx>{`
        .cihangir-splash {
          position: fixed;
          inset: 0;
          z-index: 9999999;
          display: grid;
          place-items: center;
          background: #fdfcf7;
          overflow: hidden;
          opacity: 1;
          visibility: visible;
          transition: opacity 0.35s ease, visibility 0.35s ease;
          pointer-events: auto;
          /* CSS-only fallback to ensure hide even if JS freezes */
          animation: css-fail-safe 0.1s 3.5s forwards;
        }

        @keyframes css-fail-safe {
          to {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
          }
        }

        .cihangir-splash.is-exiting {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .stage {
          position: relative;
          width: min(85vw, 85vh, 600px);
          aspect-ratio: 1;
          isolation: isolate;
        }

        .stage::before {
          content: "";
          position: absolute;
          z-index: -1;
          left: 20%;
          top: 17%;
          width: 60%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(37, 61, 44, 0.2) 0,
            rgba(37, 61, 44, 0.08) 38%,
            rgba(37, 61, 44, 0) 72%
          );
          opacity: 0;
          transform: scale(0.82);
          animation: hearth-glow 1.42s ease-out 0.12s both;
        }

        .layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          user-select: none;
          pointer-events: none;
        }

        .layer-ring {
          opacity: 1;
          animation: signature-fade 0.6s ease-out 0.05s both;
        }

        .layer-pot {
          opacity: 0;
          animation: pot-arrive 0.68s cubic-bezier(0.2, 0.8, 0.2, 1) 0.16s both;
        }

        .layer-pide {
          opacity: 0;
          animation: pide-arrive 0.62s cubic-bezier(0.2, 0.8, 0.2, 1) 0.39s both;
        }

        .layer-garnish {
          opacity: 0;
          animation: garnish-arrive 0.4s ease-out 0.6s both;
        }

        .layer-steam {
          opacity: 0;
          animation: wisp-rise 0.82s ease-in-out both;
          transform-origin: 50% 25%;
        }

        .layer-steam-a {
          animation-delay: 0.55s;
        }

        .layer-steam-b {
          animation-delay: 0.62s;
        }

        .layer-steam-c {
          animation-delay: 0.69s;
        }

        .layer-type {
          opacity: 0;
          animation: type-land 0.48s cubic-bezier(0.2, 0.7, 0.2, 1) 0.8s both;
        }

        .layer-detail {
          opacity: 0;
          animation: detail-fill 0.34s ease-out 1s both;
        }

        .layer-master {
          opacity: 0;
          animation: final-logo 0.3s ease-out 1.48s both;
        }

        @keyframes signature-fade {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes hearth-glow {
          0% {
            opacity: 0;
            transform: scale(0.82);
          }
          48% {
            opacity: 0.85;
            transform: scale(1.05);
          }
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
        }

        @keyframes pot-arrive {
          0% {
            opacity: 0;
            transform: translateY(14px) scale(0.972);
          }
          74% {
            opacity: 1;
            transform: translateY(-3px) scale(1.008);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pide-arrive {
          0% {
            opacity: 0;
            transform: translate(15px, 16px) scale(0.978);
          }
          74% {
            opacity: 1;
            transform: translate(-2px, -2px) scale(1.007);
          }
          100% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
        }

        @keyframes garnish-arrive {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wisp-rise {
          0% {
            opacity: 0;
            transform: translateY(10px) rotate(-0.5deg);
          }
          50% {
            opacity: 0.9;
            transform: translateY(0) rotate(0.4deg);
          }
          100% {
            opacity: 0.85;
            transform: translateY(-6px) rotate(0);
          }
        }

        @keyframes type-land {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes detail-fill {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes final-logo {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      <div className="stage" ref={stageRef}>
        <Image
          className="layer layer-ring"
          src="/splash/red-ring.webp"
          alt=""
          width={600}
          height={600}
          priority
        />
        <Image
          className="layer layer-steam layer-steam-a"
          src="/splash/steam-a.webp"
          alt=""
          width={600}
          height={600}
          priority
        />
        <Image
          className="layer layer-steam layer-steam-b"
          src="/splash/steam-b.webp"
          alt=""
          width={600}
          height={600}
          priority
        />
        <Image
          className="layer layer-steam layer-steam-c"
          src="/splash/steam-c.webp"
          alt=""
          width={600}
          height={600}
          priority
        />
        <Image
          className="layer layer-pot"
          src="/splash/pot-spoon.webp"
          alt=""
          width={600}
          height={600}
          priority
        />
        <Image
          className="layer layer-pide"
          src="/splash/pide.webp"
          alt=""
          width={600}
          height={600}
          priority
        />
        <Image
          className="layer layer-garnish"
          src="/splash/garnish.webp"
          alt=""
          width={600}
          height={600}
          priority
        />
        <Image
          className="layer layer-type"
          src="/splash/typography.webp"
          alt=""
          width={600}
          height={600}
          priority
        />
        <Image
          className="layer layer-detail"
          src="/splash/detail-rest.webp"
          alt=""
          width={600}
          height={600}
          priority
        />
        <Image
          className="layer layer-master"
          src="/splash/logo-original.webp"
          alt="Cihangir Ev Yemekleri Pide"
          width={600}
          height={600}
          priority
        />
      </div>
    </div>
  );
}
