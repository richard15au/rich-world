import React from 'react';
import Link from 'next/link';
import RevolvingEarth from './RevolvingEarth';
import AdminHeaderTrigger from './AdminHeaderTrigger';

export default function RichWorldLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`rich-top-logo-container ${className}`}>
      {/* Admin button on the top right before the logo (stealth mode for visitors) */}
      <AdminHeaderTrigger />
      <div className="rich-top-logo">
        <Link href="/" className="rich-top-logo-badge" title="RICH WORLD Homepage">
          <RevolvingEarth size={52} />
          <div className="rich-logo-text">
            <span className="rich-logo-title">RICH WORLD</span>
            <span className="rich-logo-subtitle">TURNING IDEAS INTO REALITY.</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
