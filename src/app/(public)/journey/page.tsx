import { Milestone } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journey | RICH WORLD',
  description: 'Chronological roadmap and architectural milestones of the Rich World ecosystem.',
};

export default function JourneyPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Milestone size={24} color="var(--accent-amber)" />
          <h1 style={{ fontSize: '2rem' }}>The Idea → Reality Journey</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px' }}>
          Chronological milestones tracking the evolution of ideas into projects, applications, businesses, and infrastructure.
        </p>
      </header>

      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Public Journey timeline shell — read-only view connected to PostgreSQL.</p>
      </div>
    </div>
  );
}
