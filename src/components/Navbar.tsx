'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutDashboard,
  FolderGit2,
  Globe,
  Milestone,
  User,
  Menu,
  X,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/portfolio', label: 'Portfolio', icon: LayoutDashboard },
  { href: '/projects', label: 'Builds', icon: FolderGit2 },
  { href: '/world', label: '2D World', icon: Globe },
  { href: '/journey', label: 'Journey', icon: Milestone },
  { href: '/about', label: 'About', icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(7, 9, 14, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '3.75rem',
          gap: '1rem',
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 800,
            fontSize: '1.05rem',
            letterSpacing: '-0.02em',
          }}
        >
          <span className="pulse-beacon" />
          <span className="gradient-text">RICH WORLD</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Icon size={14} color={isActive ? 'var(--accent-cyan)' : 'currentColor'} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action button / Mobile toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link
            href="/portfolio"
            className="btn btn-primary btn-sm desktop-nav"
            style={{
              padding: '0.35rem 0.85rem',
              fontSize: '0.78rem',
              fontWeight: 600,
            }}
          >
            <span>Portfolio</span>
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              padding: '0.4rem',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(7, 9, 14, 0.96)',
            padding: '1rem 1.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(6, 182, 212, 0.2)' : '1px solid transparent',
                }}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          :global(.desktop-nav) {
            display: none !important;
          }
          :global(.mobile-menu-btn) {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}
