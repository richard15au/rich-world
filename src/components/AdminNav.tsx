'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Lightbulb,
  FolderGit2,
  AppWindow,
  Building2,
  Server,
  Sparkles,
  Milestone,
  ExternalLink,
  LogOut,
} from 'lucide-react';

const ADMIN_LINKS = [
  { href: '/admin', label: 'Overview', icon: Shield },
  { href: '/admin/ideas', label: 'Ideas', icon: Lightbulb },
  { href: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { href: '/admin/applications', label: 'Applications', icon: AppWindow },
  { href: '/admin/businesses', label: 'Businesses', icon: Building2 },
  { href: '/admin/labs', label: 'Labs', icon: Server },
  { href: '/admin/skills', label: 'Skills', icon: Sparkles },
  { href: '/admin/journey', label: 'Journey', icon: Milestone },
];

export default function AdminNav() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#0a0e1a',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            href="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              fontSize: '0.95rem',
            }}
          >
            <Shield size={16} color="var(--accent-amber)" />
            <span>Admin Console</span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
            {ADMIN_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.825rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>Public Site</span>
            <ExternalLink size={12} />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
