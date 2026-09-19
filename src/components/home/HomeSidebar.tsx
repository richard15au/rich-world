'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  User,
  Code2,
  Briefcase,
  Gamepad2,
  Mail,
  Send,
  Menu,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: User },
  { href: '/projects', label: 'Projects & Practices', icon: Code2 },
  { href: '/businesses', label: 'Business Solutions', icon: Briefcase },
  { href: '/world', label: '2D World', icon: Gamepad2 },
  { href: '/contact', label: 'Contact', icon: Send },
];

export default function HomeSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Topbar with Hamburger */}
      <div className="rich-mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '38px',
              height: '42px',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <Image
              src="/images/profile-transparent.png"
              alt="Richard Vitug"
              fill
              sizes="38px"
              style={{ objectFit: 'contain', objectPosition: 'center bottom' }}
              priority
            />
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontWeight: 750, fontSize: '0.95rem', color: '#0f172a' }}>
              Richard Vitug
            </span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              className="rich-verified-badge"
              aria-label="Verified Builder"
            >
              <title>Verified Builder</title>
              <path
                d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6 0.457-1.52.197-3.19-.8-4.19s-2.67-1.26-4.19-.8C14.7 2.64 13.33 1.77 11.75 1.77s-2.95 0.87-3.61 2.14c-1.52-0.46-3.19-0.2-4.19 0.8s-1.26 2.67-0.8 4.19C1.88 9.55 1 10.92 1 12.5s0.88 2.95 2.15 3.6c-0.46 1.52-0.2 3.19 0.8 4.19s2.67 1.26 4.19 0.8c0.66 1.27 2.03 2.14 3.61 2.14s2.95-0.87 3.61-2.14c1.52 0.46 3.19 0.2 4.19-0.8s1.26-2.67 0.8-4.19c1.27-0.65 2.15-2.02 2.15-3.6z"
                fill="#2563eb"
              />
              <path
                d="M7.75 12.5l3 3 6.5-6.5"
                stroke="#ffffff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
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
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rich-social-btn"
              title="Facebook"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="mailto:richardvitug015@gmail.com"
              className="rich-social-btn"
              title="Gmail"
              aria-label="Gmail"
            >
              <Mail size={14} />
            </a>
          </div>
        </div>
      )}

      {/* Desktop Fixed Left Sidebar */}
      <aside className="rich-home-sidebar" aria-label="Main Navigation Sidebar">
        {/* Profile Card Section */}
        <div className="rich-sidebar-profile">
          {/* Transparent Blended Portrait (Sample 1 Style: no circle, no frame, bottom feathered fade) */}
          <div className="rich-sidebar-avatar-sample1" aria-label="Richard Vitug Profile Portrait">
            <Image
              src="/images/profile-transparent.png"
              alt="Richard Vitug"
              width={380}
              height={460}
              className="rich-sidebar-photo-sample1"
              priority
            />
          </div>

          <div className="rich-sidebar-name-row">
            <h2 className="rich-sidebar-name">Richard Vitug</h2>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              className="rich-verified-badge"
              aria-label="Verified Builder"
            >
              <title>Verified Builder</title>
              <path
                d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6 0.457-1.52.197-3.19-.8-4.19s-2.67-1.26-4.19-.8C14.7 2.64 13.33 1.77 11.75 1.77s-2.95 0.87-3.61 2.14c-1.52-0.46-3.19-0.2-4.19 0.8s-1.26 2.67-0.8 4.19C1.88 9.55 1 10.92 1 12.5s0.88 2.95 2.15 3.6c-0.46 1.52-0.2 3.19 0.8 4.19s2.67 1.26 4.19 0.8c0.66 1.27 2.03 2.14 3.61 2.14s2.95-0.87 3.61-2.14c1.52 0.46 3.19 0.2 4.19-0.8s1.26-2.67 0.8-4.19c1.27-0.65 2.15-2.02 2.15-3.6z"
                fill="#2563eb"
              />
              <path
                d="M7.75 12.5l3 3 6.5-6.5"
                stroke="#ffffff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="rich-sidebar-role">IT Student</p>
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
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rich-social-btn"
              title="Facebook"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="mailto:richardvitug015@gmail.com"
              className="rich-social-btn"
              title="Gmail"
              aria-label="Gmail"
            >
              <Mail size={14} />
            </a>
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
