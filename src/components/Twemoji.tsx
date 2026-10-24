"use client";

import React from "react";
import twemoji from "twemoji";

interface TwemojiProps {
  emoji: string;
  size?: number;
  className?: string;
}

/**
 * Standard Twemoji renderer using pure SVG vector graphics from official CDN.
 * Ensures identical, high-definition, cross-platform emoji rendering across Windows, iOS, Android, and macOS.
 */
export default function Twemoji({ emoji, size = 16, className = "" }: TwemojiProps) {
  const parsedHtml = twemoji.parse(emoji, {
    folder: "svg",
    ext: ".svg",
    base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
  });

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 [&>img]:w-full [&>img]:h-full [&>img]:object-contain ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: parsedHtml }}
    />
  );
}
