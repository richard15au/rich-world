import Link from 'next/link';
import {
  Lightbulb,
  FolderGit2,
  AppWindow,
  Building2,
  Server,
  Sparkles,
  Milestone,
  User,
  Shield,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/journey', label: 'Journey', icon: Milestone },
  { href: '/ideas', label: 'Ideas', icon: Lightbulb },
  { href: '/projects', label: 'Projects', icon: FolderGit2 },
  { href: '/applications', label: 'Applications', icon: AppWindow },
  { href: '/businesses', label: 'Businesses', icon: Building2 },
  { href: '/labs', label: 'Labs', icon: Server },
  { href: '/skills', label: 'Skills', icon: Sparkles },
  { href: '/about', label: 'About', icon: User },
];

export default function Navbar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-surface-glass)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4rem',
          gap: '1rem',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 700,
            fontSize: '1.05rem',
            letterSpacing: '-0.02em',
          }}
        >
          <span className="pulse-beacon" />
          <span className="gradient-text">RICH WORLD</span>
        </Link>

        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            flexWrap: 'wrap',
          }}
        >
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  transition: 'color var(--transition-fast), background var(--transition-fast)',
                }}
              >
                <Icon size={14} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link
            href="/admin"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Shield size={14} />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
