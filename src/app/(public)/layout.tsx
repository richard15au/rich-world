'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isFullWidthPage = pathname === '/world';

  if (isHomePage) {
    return <main style={{ minHeight: '100vh' }}>{children}</main>;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      {isFullWidthPage ? (
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      ) : (
        <main
          className="container"
          style={{
            flex: 1,
            paddingTop: '2rem',
            paddingBottom: '3.5rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </main>
      )}
      <Footer />
    </div>
  );
}
