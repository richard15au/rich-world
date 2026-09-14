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
  Database,
  Terminal,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const FLOW_STEPS = [
  {
    step: '01',
    title: 'Ideas',
    href: '/ideas',
    description: 'Problem statements, architectural hypotheses, and initial concepts.',
    icon: Lightbulb,
    badge: 'Inception',
    color: 'var(--accent-amber)',
  },
  {
    step: '02',
    title: 'Projects',
    href: '/projects',
    description: 'Umbrella initiatives grouping solutions and defining system bounds.',
    icon: FolderGit2,
    badge: 'Architecture',
    color: 'var(--accent-indigo)',
  },
  {
    step: '03',
    title: 'Applications',
    href: '/applications',
    description: 'Concrete deployable web apps, APIs, microservices, and CLIs.',
    icon: AppWindow,
    badge: 'Software',
    color: 'var(--accent-indigo)',
  },
  {
    step: '04',
    title: 'Businesses',
    href: '/businesses',
    description: 'Operational offices and commercial ventures powered by applications.',
    icon: Building2,
    badge: 'Operations',
    color: 'var(--accent-purple)',
  },
  {
    step: '05',
    title: 'Network Labs',
    href: '/labs',
    description: 'Isolated VMware hypervisors, OPNsense firewalls, and Docker testing rigs.',
    icon: Server,
    badge: 'Infrastructure',
    color: 'var(--accent-cyan)',
  },
];

const FEATURED_AREAS = [
  {
    href: '/journey',
    title: 'The Idea → Reality Journey',
    tagline: 'Chronological timeline of milestones and architectural evolution.',
    icon: Milestone,
    tag: 'Timeline',
    badgeClass: 'badge-amber',
  },
  {
    href: '/projects',
    title: 'Projects & Systems',
    tagline: 'High-level engineering initiatives and their contained software artifacts.',
    icon: FolderGit2,
    tag: 'Core Systems',
    badgeClass: 'badge-indigo',
  },
  {
    href: '/applications',
    title: 'Applications Catalog',
    tagline: 'Explore deployable web applications, APIs, services, and developer tools.',
    icon: AppWindow,
    tag: 'Software Units',
    badgeClass: 'badge-indigo',
  },
  {
    href: '/businesses',
    title: 'Offices & Ventures',
    tagline: 'Commercial structures and internal studios running on portfolio applications.',
    icon: Building2,
    tag: 'Ventures',
    badgeClass: 'badge-purple',
  },
  {
    href: '/labs',
    title: 'Network Labs',
    tagline: 'VMware ESXi/Workstation, OPNsense firewall routing, and Linux/Docker testbeds.',
    icon: Server,
    tag: 'Virtualization',
    badgeClass: 'badge-cyan',
  },
  {
    href: '/skills',
    title: 'Demonstrated Skills',
    tagline: 'Verified technical competencies backed by real projects and lab infrastructure.',
    icon: Sparkles,
    tag: 'Competencies',
    badgeClass: 'badge-emerald',
  },
];

export default async function HomePage() {
  let counts = {
    ideas: 0,
    projects: 0,
    applications: 0,
    businesses: 0,
    labs: 0,
    skills: 0,
    milestones: 0,
  };

  try {
    const [ideas, projects, applications, businesses, labs, skills, milestones] = await Promise.all([
      prisma.idea.count({ where: { isPublic: true } }),
      prisma.project.count({ where: { isPublic: true } }),
      prisma.application.count({ where: { isPublic: true } }),
      prisma.business.count({ where: { isPublic: true } }),
      prisma.networkLab.count({ where: { isPublic: true } }),
      prisma.skill.count(),
      prisma.journeyMilestone.count({ where: { isPublic: true } }),
    ]);
    counts = { ideas, projects, applications, businesses, labs, skills, milestones };
  } catch {
    // Database fallback count remains 0
  }

  const totalEntities =
    counts.ideas +
    counts.projects +
    counts.applications +
    counts.businesses +
    counts.labs +
    counts.skills +
    counts.milestones;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
      {/* Hero Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="badge badge-cyan">
            <span className="pulse-beacon" style={{ width: '6px', height: '6px' }} />
            Personal Engineering Atlas
          </span>
          <span className="badge badge-slate">Next.js 16 • PostgreSQL • Prisma</span>
        </div>

        <div style={{ maxWidth: '840px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: 1.1, fontWeight: 800 }}>
            RICH <span className="gradient-text-accent">WORLD</span>
          </h1>
          <p
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              color: 'var(--accent-cyan)',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            Turning ideas into reality.
          </p>
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            Rich World is my personal digital world — a place that documents my ideas, projects,
            applications, businesses, network labs, skills, experiments, and journey.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="hero-ctas" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <Link href="/projects" className="btn btn-primary">
            <span>Explore Projects</span>
            <ArrowRight size={16} />
          </Link>
          <Link href="/journey" className="btn btn-secondary">
            <Milestone size={16} />
            <span>The Idea → Reality Journey</span>
          </Link>
        </div>
      </section>

      {/* Ecosystem Flow Pipeline */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.4rem' }}>The Ecosystem Pipeline</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            The progressive lifecycle of how concepts advance from initial formulation to physical & virtual infrastructure.
          </p>
        </div>

        <div className="flow-container">
          {FLOW_STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.step}
                href={item.href}
                className="flow-step"
                style={{ position: 'relative' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {item.step}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      color: item.color,
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {item.badge}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      display: 'inline-flex',
                    }}
                  >
                    <Icon size={18} color={item.color} />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{item.title}</h3>
                </div>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                  {item.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.75rem',
                    color: 'var(--accent-cyan)',
                    marginTop: 'auto',
                    paddingTop: '0.5rem',
                  }}
                >
                  <span>Explore</span>
                  {index < FLOW_STEPS.length - 1 ? <ChevronRight size={13} /> : <ArrowRight size={13} />}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Live Ecosystem Metrics / Overview */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={17} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: '1.25rem' }}>Live Ecosystem Metrics</h2>
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            Neon PostgreSQL • Schema Synchronized
          </span>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Ideas
            </span>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {counts.ideas}
            </span>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              {counts.ideas === 0 ? 'Awaiting entry' : 'Published'}
            </span>
          </div>

          <div className="stat-card">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Projects
            </span>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {counts.projects}
            </span>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              {counts.projects === 0 ? 'Awaiting entry' : 'Active systems'}
            </span>
          </div>

          <div className="stat-card">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Applications
            </span>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {counts.applications}
            </span>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              {counts.applications === 0 ? 'Awaiting entry' : 'Deployments'}
            </span>
          </div>

          <div className="stat-card">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Businesses
            </span>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {counts.businesses}
            </span>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              {counts.businesses === 0 ? 'Awaiting entry' : 'Ventures'}
            </span>
          </div>

          <div className="stat-card">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Network Labs
            </span>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {counts.labs}
            </span>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              {counts.labs === 0 ? 'Awaiting entry' : 'Configured'}
            </span>
          </div>

          <div className="stat-card">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Milestones
            </span>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {counts.milestones}
            </span>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              {counts.milestones === 0 ? 'Awaiting entry' : 'Documented'}
            </span>
          </div>
        </div>

        {totalEntities === 0 && (
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              borderStyle: 'dashed',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Terminal size={18} color="var(--accent-amber)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Database connected to live Neon instance. Real records will populate here once published through the admin command center.
              </span>
            </div>
            <Link href="/about" className="btn btn-secondary btn-sm">
              Read Architecture Notes
            </Link>
          </div>
        )}
      </section>

      {/* Featured Public Areas */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <h2 style={{ fontSize: '1.4rem' }}>Explore the Atlas</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Navigate into dedicated public zones for projects, applications, network topologies, and demonstrated skills.
          </p>
        </div>

        <div className="grid-3">
          {FEATURED_AREAS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="glass-panel interactive"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        padding: '0.55rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        display: 'inline-flex',
                      }}
                    >
                      <Icon size={20} color="var(--accent-cyan)" />
                    </div>
                    <span className={`badge ${item.badgeClass}`}>{item.tag}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {item.tagline}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8rem',
                    color: 'var(--accent-cyan)',
                    fontWeight: 600,
                  }}
                >
                  <span>View Section</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
