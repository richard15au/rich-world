import Link from 'next/link';
import {
  Lightbulb,
  FolderGit2,
  AppWindow,
  Building2,
  Server,
  Sparkles,
  Milestone,
  ArrowRight,
} from 'lucide-react';

const ADMIN_CARDS = [
  { href: '/admin/ideas', title: 'Manage Ideas', icon: Lightbulb, color: 'var(--accent-amber)' },
  { href: '/admin/projects', title: 'Manage Projects', icon: FolderGit2, color: 'var(--accent-indigo)' },
  { href: '/admin/applications', title: 'Manage Applications', icon: AppWindow, color: 'var(--accent-indigo)' },
  { href: '/admin/businesses', title: 'Manage Businesses', icon: Building2, color: 'var(--accent-purple)' },
  { href: '/admin/labs', title: 'Manage Labs', icon: Server, color: 'var(--accent-cyan)' },
  { href: '/admin/skills', title: 'Manage Skills', icon: Sparkles, color: 'var(--accent-emerald)' },
  { href: '/admin/journey', title: 'Manage Journey', icon: Milestone, color: 'var(--accent-amber)' },
];

export default function AdminDashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <h1 style={{ fontSize: '1.85rem' }}>Command Center</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Owner control panel for managing public visibility, entities, and status attributes.
        </p>
      </header>

      <div className="grid-3">
        {ADMIN_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="glass-panel interactive"
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'inline-flex',
                  }}
                >
                  <Icon size={18} color={card.color} />
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{card.title}</span>
              </div>
              <ArrowRight size={15} color="var(--text-muted)" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
