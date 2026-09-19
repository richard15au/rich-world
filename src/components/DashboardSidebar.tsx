'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FolderGit2,
  AppWindow,
  Building2,
  Server,
  Sparkles,
  Milestone,
  User,
  Shield,
  MapPin,
  Mail,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react';

function GithubIcon({ size = 13, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/projects', label: 'Projects', icon: FolderGit2 },
  { href: '/applications', label: 'Applications', icon: AppWindow },
  { href: '/businesses', label: 'Businesses', icon: Building2 },
  { href: '/labs', label: 'Network Labs', icon: Server },
  { href: '/skills', label: 'Skills', icon: Sparkles },
  { href: '/journey', label: 'Journey', icon: Milestone },
  { href: '/about', label: 'About', icon: User },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header Bar */}
      <div
        className="dash-card"
        style={{
          display: 'none',
          marginBottom: '0.75rem',
          padding: '0.65rem 0.85rem',
        }}
        id="mobile-header-bar"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '-0.02em',
              }}
              aria-label="Richard Vitug initials"
            >
              RV
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>
                  Richard Vitug
                </span>
                <CheckCircle2 size={12} color="#2563eb" fill="#eff6ff" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: '#64748b' }}>
                <span className="dash-pulse-beacon" style={{ width: '5px', height: '5px' }} />
                <span>Building the Future</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Link
              href="/admin"
              className="btn-dash-secondary btn-dash-sm"
              style={{ padding: '0.3rem 0.55rem' }}
              title="Admin Console"
            >
              <Shield size={12} />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn-dash-secondary btn-dash-sm"
              style={{ padding: '0.3rem 0.55rem' }}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              marginTop: '0.75rem',
              paddingTop: '0.65rem',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`dash-nav-item ${isActive ? 'active' : ''}`}
                  style={{ padding: '0.45rem 0.65rem' }}
                >
                  <Icon size={14} color={isActive ? '#2563eb' : '#64748b'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                paddingTop: '0.5rem',
                marginTop: '0.35rem',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <a
                href="https://github.com/richard15au"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dash-secondary btn-dash-sm"
                style={{ flex: 1, padding: '0.35rem' }}
              >
                <GithubIcon size={13} />
                <span>GitHub</span>
              </a>
              <a
                href="mailto:richard15.au@gmail.com"
                className="btn-dash-secondary btn-dash-sm"
                style={{ flex: 1, padding: '0.35rem' }}
              >
                <Mail size={13} />
                <span>Email</span>
              </a>
            </div>
          </nav>
        )}
      </div>

      {/* Desktop Left Sidebar */}
      <aside className="dashboard-sidebar" id="desktop-sidebar-wrapper">
        {/* Profile Card */}
        <div className="dash-card" style={{ padding: '0.9rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  letterSpacing: '-0.02em',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.12)',
                  border: '2px solid #ffffff',
                }}
                aria-label="Richard Vitug initials"
              >
                RV
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Richard Vitug
                  </span>
                  <CheckCircle2 size={13} color="#2563eb" fill="#eff6ff" />
                </div>
              </div>
            </div>

            <div
              className="dash-badge dash-badge-emerald"
              style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}
              title="System Status"
            >
              <span className="dash-pulse-beacon" style={{ width: '5px', height: '5px' }} />
              <span>Future</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb' }}>
              IT Student
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.7rem',
                color: '#94a3b8',
              }}
            >
              <MapPin size={11} color="#94a3b8" />
              <span>Sydney, Australia</span>
            </div>
          </div>

          {/* Social / Contact Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', paddingTop: '0.45rem', borderTop: '1px solid #f1f5f9' }}>
            <a
              href="https://github.com/richard15au"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-dash-secondary btn-dash-sm"
              style={{ flex: 1, padding: '0.3rem 0.5rem', fontSize: '0.72rem' }}
              title="GitHub Profile"
            >
              <GithubIcon size={12} />
              <span>GitHub</span>
            </a>

            <a
              href="mailto:richard15.au@gmail.com"
              className="btn-dash-secondary btn-dash-sm"
              style={{ flex: 1, padding: '0.3rem 0.5rem', fontSize: '0.72rem' }}
              title="Send Email"
            >
              <Mail size={12} />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Sidebar Navigation Card */}
        <div className="dash-card" style={{ padding: '0.5rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <div
            style={{
              padding: '0.2rem 0.5rem 0.35rem',
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#94a3b8',
            }}
          >
            Navigation
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dash-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={14} color={isActive ? '#2563eb' : '#64748b'} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div style={{ marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid #f1f5f9' }}>
            <Link
              href="/admin"
              className="dash-nav-item"
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#1e293b',
                fontWeight: 600,
                fontSize: '0.76rem',
                padding: '0.35rem 0.6rem',
              }}
            >
              <Shield size={13} color="#2563eb" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
