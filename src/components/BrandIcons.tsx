import React from "react";

function getDims(size?: number, width?: number, height?: number, def = 24) {
  return { width: width || size || def, height: height || size || def };
}

export function OttomanSeal({ className = "", size = 24, width, height, ...props }: any) {
  const dims = getDims(size, width, height, 24);
  return (
    <svg viewBox="0 0 100 100" width={dims.width} height={dims.height} className={className} aria-hidden="true" {...props}>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
      <path d="M50 20 L58 38 L78 38 L62 50 L68 68 L50 56 L32 68 L38 50 L22 38 L42 38 Z" fill="currentColor" />
    </svg>
  );
}

export function OttomanStar({ className = "", size = 16, width, height, ...props }: any) {
  const dims = getDims(size, width, height, 16);
  return (
    <svg viewBox="0 0 24 24" width={dims.width} height={dims.height} className={className} aria-hidden="true" {...props}>
      <path d="M12 2l2.4 5.6L20 10l-4.4 4.4L17 20l-5-3.2L7 20l1.4-5.6L4 10l5.6-2.4Z" fill="currentColor" />
    </svg>
  );
}

export function KebabSkewer({ className = "", size = 20, width, height, ...props }: any) {
  const dims = getDims(size, width, height, 20);
  return (
    <svg viewBox="0 0 24 24" width={dims.width} height={dims.height} className={className} aria-hidden="true" {...props}>
      <path
        d="M3 21l3-3m0 0l2-2m-2 2l-2-2m4 2l1.5 1.5M12 7l-2 2m0 0L8 7m2 2l2 2M8 7L6.5 5.5M17 2l-2 2m0 0l-2-2m2 2l2 2m-2-2l1.5-1.5M12 12l2-2m2 2l2-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="7" y="15" width="4" height="4" rx="1" fill="currentColor" />
      <rect x="11" y="10" width="4" height="4" rx="1" fill="currentColor" />
      <rect x="15" y="5" width="4" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

export function StoneOven({ className = "", size = 20, width, height, ...props }: any) {
  const dims = getDims(size, width, height, 20);
  return (
    <svg viewBox="0 0 24 24" width={dims.width} height={dims.height} className={className} aria-hidden="true" {...props}>
      <path d="M3 19v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M7 19v-4a5 5 0 0 1 10 0v4" fill="currentColor" opacity="0.3" />
      <path d="M12 14v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CookingPot({ className = "", size = 20, width, height, ...props }: any) {
  const dims = getDims(size, width, height, 20);
  return (
    <svg viewBox="0 0 24 24" width={dims.width} height={dims.height} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12h20" />
      <path d="M20 12v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6" />
      <path d="M12 4v4" />
      <path d="M4 8h16" />
      <path d="M12 12v3" />
    </svg>
  );
}

export function MenuIcon({ className = "", size = 20, width, height, ...props }: any) {
  const dims = getDims(size, width, height, 20);
  return (
    <svg viewBox="0 0 24 24" width={dims.width} height={dims.height} className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function HomeIcon({ className = "", size = 18, width, height, ...props }: any) {
  const dims = getDims(size, width, height, 18);
  return (
    <svg viewBox="0 0 24 24" width={dims.width} height={dims.height} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function BookOpenIcon({ className = "", size = 18, width, height, ...props }: any) {
  const dims = getDims(size, width, height, 18);
  return (
    <svg viewBox="0 0 24 24" width={dims.width} height={dims.height} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function PhoneIcon({ className = "", size = 18, width, height, ...props }: any) {
  const dims = getDims(size, width, height, 18);
  return (
    <svg viewBox="0 0 24 24" width={dims.width} height={dims.height} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
