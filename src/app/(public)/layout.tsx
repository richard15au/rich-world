'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home as HomeIcon, ChevronRight } from 'lucide-react';
import HomeSidebar from '@/components/home/HomeSidebar';
import RichWorldLogo from '@/components/home/RichWorldLogo';
import { ShaderBackground } from '@/components/ui/silk-shader';
import AmbientTechBackground from '@/components/home/AmbientTechBackground';
import VisitCounter from '@/components/VisitCounter';
import '@/components/home/home.css';
import '@/components/world/world.css';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isWorldPage = pathname === '/world' || pathname.startsWith('/world');

  // Full-screen viewport mode for RICH CITY 2D World
  if (isWorldPage) {
    return (
      <div className="rich-world-layout-root">
        {children}
        <VisitCounter />
      </div>
    );
  }

  // Helper to format breadcrumb title for subpages
  const getBreadcrumbTitle = (path: string) => {
    if (path === '/about' || path.startsWith('/about/')) return 'About';
    if (path === '/projects' || path.startsWith('/projects/')) return 'Projects & Practices';
    if (path === '/businesses' || path.startsWith('/businesses/')) return 'Business Solutions';
    if (path === '/world' || path.startsWith('/world/')) return '2D World';
    if (path === '/contact' || path.startsWith('/contact/')) return 'Contact & Inquiries';
    if (path === '/portfolio' || path.startsWith('/portfolio/')) return 'Portfolio Hub';
    if (path === '/skills' || path.startsWith('/skills/')) return 'Skills & Capabilities';
    if (path === '/labs' || path.startsWith('/labs/')) return 'Network Labs';
    if (path === '/ideas' || path.startsWith('/ideas/')) return 'Ideas & Concepts';
    if (path === '/journey' || path.startsWith('/journey/')) return 'Journey & Milestones';
    if (path === '/applications' || path.startsWith('/applications/')) return 'Applications';

    const parts = path.split('/').filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return 'Directory';
  };

  return (
    <div className="rich-home-root">
      {/* Animated Silk Shader & Minimal Ambient Tech Motion Layer */}
      <div className="rich-home-shader-bg" aria-hidden="true">
        <ShaderBackground />
        <AmbientTechBackground />
      </div>

      {/* Left Sidebar: Fixed/Sticky Desktop & Mobile Drawer */}
      <HomeSidebar />

      {/* Dedicated Vertical Partition Line */}
      <div className="rich-sidebar-partition" aria-hidden="true" />

      {/* Main Content Area */}
      {isHomePage ? (
        children
      ) : (
        <div className="rich-subpage-main">
          {/* Subpage Top Bar with Breadcrumbs on Left & 3D Revolving Globe Logo on Right */}
          <header className="rich-subpage-top-bar">
            <div className="rich-subpage-breadcrumbs">
              <Link href="/" className="rich-breadcrumb-link" title="Return to Home">
                <HomeIcon size={14} />
                <span>Home</span>
              </Link>
              <ChevronRight size={13} className="rich-breadcrumb-chevron" />
              <span className="rich-breadcrumb-active">{getBreadcrumbTitle(pathname)}</span>
            </div>

            <div className="rich-subpage-branding">
              <RichWorldLogo />
            </div>
          </header>

          {/* Subpage Content Container with sleek vertical scrolling */}
          <main className="rich-subpage-content">
            {children}
          </main>

          {/* Subpage Subtle Footer Brand Line */}
          <footer className="rich-subpage-footer">
            <div className="rich-footer-divider" />
            <div className="rich-footer-brand">
              <span className="rich-footer-title">RICH WORLD</span>
              <span className="rich-footer-subtitle">TURNING IDEAS INTO REALITY</span>
            </div>
            <div className="rich-footer-divider" />
          </footer>
        </div>
      )}

      {/* Stealth bottom-right visit counter (invisible to visitors) */}
      <VisitCounter />
    </div>
  );
}
