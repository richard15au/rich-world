'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  User,
  Code2,
  Briefcase,
  Gamepad2,
  MessageSquare,
  Moon,
  Menu,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: User },
  { href: '/projects', label: 'Projects & Practices', icon: Code2 },
  { href: '/businesses', label: 'Business Solutions', icon: Briefcase },
  { href: '/world', label: '2D World', icon: Gamepad2 },
];

export default function HomeSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Topbar with Hamburger */}
      <div className="rich-mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className="rich-sidebar-avatar-blank" style={{ width: '34px', height: '34px' }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="8" r="4" fill="#cbd5e1" stroke="none" />
              <path
                d="M 4 21 C 4 16.5 7.5 13 12 13 C 16.5 13 20 16.5 20 21"
                fill="#cbd5e1"
                stroke="none"
              />
            </svg>
          </div>
          <span style={{ fontWeight: 750, fontSize: '0.95rem', color: '#0f172a' }}>
            Richard Vitug
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '0.4rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
          }}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="rich-mobile-drawer open">
          <div className="rich-sidebar-nav" style={{ marginTop: 0 }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rich-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="rich-sidebar-socials">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rich-social-btn"
              title="GitHub"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rich-social-btn"
              title="LinkedIn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <span className="rich-social-btn" title="Discord">
              <MessageSquare size={14} />
            </span>
            <span className="rich-social-btn" title="Theme Toggle">
              <Moon size={14} />
            </span>
          </div>
        </div>
      )}

      {/* Desktop Fixed Left Sidebar */}
      <aside className="rich-home-sidebar" aria-label="Main Navigation Sidebar">
        {/* Profile Card Section */}
        <div className="rich-sidebar-profile">
          {/* Blank profile avatar silhouette */}
          <div className="rich-sidebar-avatar-blank" aria-label="Blank profile avatar placeholder">
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="12" cy="8" r="4.2" fill="#cbd5e1" />
              <path
                d="M 4 21 C 4 16.2 7.5 13 12 13 C 16.5 13 20 16.2 20 21"
                fill="#cbd5e1"
              />
            </svg>
          </div>

          <h2 className="rich-sidebar-name">Richard Vitug</h2>
          <p className="rich-sidebar-role">IT Student | Aspiring AI Engineer</p>
          <p className="rich-sidebar-builder">Builder of RICH WORLD</p>
          <p className="rich-sidebar-location">Sydney, Australia</p>

          {/* Social / Contact Icons */}
          <div className="rich-sidebar-socials">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rich-social-btn"
              title="GitHub"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rich-social-btn"
              title="LinkedIn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <span className="rich-social-btn" title="Discord / Community" style={{ cursor: 'pointer' }}>
              <MessageSquare size={14} />
            </span>
            <span className="rich-social-btn" title="Theme Mode" style={{ cursor: 'pointer' }}>
              <Moon size={14} />
            </span>
          </div>
        </div>

        {/* Vertical Navigation Menu */}
        <nav className="rich-sidebar-nav" aria-label="Public Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rich-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Handwritten Accent & Version */}
        <div className="rich-sidebar-bottom">
          <div className="rich-sidebar-notes">
            Ideas<br />
            Projects<br />
            Solutions<br />
            A Better Tomorrow
            <svg
              className="rich-sidebar-underline"
              viewBox="0 0 100 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 2 5 C 25 2, 60 7, 98 3"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="rich-sidebar-version">v1.0</span>
        </div>
      </aside>
    </>
  );
}
