import React from 'react';
import Link from 'next/link';

export default function RichWorldLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`rich-top-logo ${className}`}>
      <Link href="/" className="rich-top-logo-badge" title="RICH WORLD Homepage">
        <svg
          className="rich-logo-globe"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Deep Navy/Black globe circle */}
          <circle cx="50" cy="50" r="48" fill="#0b193d" />
          
          {/* Subtle grid lines */}
          <circle cx="50" cy="50" r="47" stroke="#1e3a8a" strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M 3 50 H 97" stroke="#1e3a8a" strokeWidth="1.2" strokeOpacity="0.35" />
          <ellipse cx="50" cy="50" rx="28" ry="47" stroke="#1e3a8a" strokeWidth="1.2" strokeOpacity="0.35" />

          {/* Continents - stylized to match the reference globe */}
          {/* North/South America */}
          <path
            d="M 28 20 C 35 18 43 23 45 28 C 42 32 35 32 30 35 C 26 38 27 44 31 47 C 35 50 37 57 39 65 C 38 73 34 81 30 85 C 28 83 29 76 32 70 C 30 65 27 59 24 53 C 22 47 23 38 26 31 Z"
            fill="#ffffff"
          />
          {/* Europe, Africa, Asia */}
          <path
            d="M 54 22 C 63 19 75 22 81 29 C 78 32 72 30 67 33 C 63 35 62 39 66 44 C 69 48 68 53 64 57 C 60 61 61 69 65 75 C 61 76 57 73 55 68 C 53 63 55 57 53 52 C 50 47 49 41 51 34 C 52 28 49 25 54 22 Z"
            fill="#ffffff"
          />
          {/* East Asia Islands / Australia */}
          <ellipse cx="78" cy="62" rx="5" ry="4" fill="#ffffff" />
          <ellipse cx="76" cy="74" rx="6" ry="4" fill="#ffffff" />
        </svg>

        <div className="rich-logo-text">
          <span className="rich-logo-title">RICH WORLD</span>
          <span className="rich-logo-subtitle">TURNING IDEAS INTO REALITY.</span>
        </div>
      </Link>
    </div>
  );
}
