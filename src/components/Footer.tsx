import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        padding: '2rem 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          fontSize: '0.825rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              RICH WORLD
            </span>{' '}
            — Turning ideas into reality.
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            A persistent digital world of ideas, builds, and intelligent systems.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <Link href="/portfolio" style={{ color: 'var(--text-secondary)' }}>
            Portfolio
          </Link>
          <Link href="/projects" style={{ color: 'var(--text-secondary)' }}>
            Builds
          </Link>
          <Link href="/world" style={{ color: 'var(--text-secondary)' }}>
            2D World
          </Link>
          <Link href="/journey" style={{ color: 'var(--text-secondary)' }}>
            Journey
          </Link>
          <Link href="/about" style={{ color: 'var(--text-secondary)' }}>
            About
          </Link>
          <Link
            href="/admin"
            title="Admin Console"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              opacity: 0.6,
            }}
          >
            <Shield size={12} />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
