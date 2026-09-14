import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Building2,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ExternalLink,
  Globe,
  Layers,
  AppWindow,
  FolderGit2,
  Code2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface BusinessDetailPageProps {
  params: Promise<{ slug: string }>;
}

const LEGAL_TYPE_BADGE: Record<string, string> = {
  STUDIO: 'badge-purple',
  COMPANY: 'badge-cyan',
  AGENCY: 'badge-indigo',
  FREELANCE: 'badge-amber',
};

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  ACTIVE: { label: 'Active', badgeClass: 'badge-emerald' },
  INACTIVE: { label: 'Inactive', badgeClass: 'badge-slate' },
};

const APP_TYPE_BADGE: Record<string, string> = {
  WEB: 'badge-cyan',
  API: 'badge-indigo',
  CLI: 'badge-amber',
  SERVICE: 'badge-purple',
  MOBILE: 'badge-emerald',
};

export async function generateMetadata({ params }: BusinessDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug },
    select: {
      name: true,
      summary: true,
      isPublic: true,
    },
  });

  if (!business || !business.isPublic) {
    return {
      title: 'Business Not Found | RICH WORLD',
    };
  }

  return {
    title: `${business.name} | Businesses | RICH WORLD`,
    description: business.summary,
  };
}

export default async function BusinessDetailPage({ params }: BusinessDetailPageProps) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      applications: {
        include: {
          application: {
            include: {
              project: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  tagline: true,
                  status: true,
                  liveUrl: true,
                  repoUrl: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  // Return proper 404 when business does not exist or is not public
  if (!business || !business.isPublic) {
    notFound();
  }

  const legalBadgeClass = LEGAL_TYPE_BADGE[business.legalType] ?? 'badge-slate';
  const statusConfig = STATUS_CONFIG[business.status] ?? {
    label: business.status,
    badgeClass: 'badge-slate',
  };

  const createdDate = new Date(business.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '960px', margin: '0 auto' }}>
      {/* Navigation Header */}
      <div>
        <Link
          href="/businesses"
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={14} />
          <span>Back to Businesses</span>
        </Link>
      </div>

      {/* Hero Overview */}
      <section
        className="glass-panel"
        style={{
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                padding: '0.6rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                display: 'inline-flex',
                color: 'var(--accent-purple)',
              }}
            >
              <Building2 size={22} />
            </div>
            <span className={`badge ${legalBadgeClass}`}>{business.legalType}</span>
            <span className={`badge ${statusConfig.badgeClass}`}>{statusConfig.label}</span>
            <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={12} />
              <span>Public Entity</span>
            </span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
            <Clock size={14} />
            <span>Established {createdDate}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.15 }}>
            {business.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <Briefcase size={16} color="var(--accent-purple)" />
            <span style={{ color: 'var(--text-secondary)' }}>Leadership Role:</span>
            <strong style={{ color: 'var(--text-primary)' }}>{business.role}</strong>
          </div>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {business.summary}
          </p>
        </div>

        {/* Website Action Link */}
        {business.websiteUrl && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <a
              href={business.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <Globe size={15} />
              <span>Visit Official Website</span>
              <ExternalLink size={13} />
            </a>
          </div>
        )}
      </section>

      {/* Ecosystem Architecture & Hierarchy */}
      {business.applications && business.applications.length > 0 && (
        <section
          className="glass-panel"
          style={{
            padding: '2.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', color: 'var(--accent-purple)' }}>
              <Layers size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Ecosystem Architecture & Flow
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              Operational to Engineering Pipeline
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto' }}>
              How {business.name} connects to supporting software applications and underlying engineering projects.
            </p>
          </div>

          {business.applications.map((link) => {
            const app = link.application;
            const appBadge = APP_TYPE_BADGE[app.appType] ?? 'badge-slate';
            const proj = app.project;
            const projStatus = proj ? (STATUS_CONFIG[proj.status] ?? { label: proj.status, badgeClass: 'badge-slate' }) : null;

            const legalLabel = business.name === 'RichAcademy'
              ? 'Educational Studio'
              : (business.legalType === 'STUDIO' ? 'Studio' : business.legalType);

            const stackDisplay = app.slug === 'eduflex-app'
              ? 'Next.js • TypeScript • Prisma • PostgreSQL'
              : (app.techStack && app.techStack.length > 0
                  ? app.techStack.map((s) => s.replace(/ \d+$/, '')).join(' • ')
                  : null);

            const targetLiveUrl = app.liveUrl || proj?.liveUrl;
            const targetRepoUrl = app.repoUrl || proj?.repoUrl;

            return (
              <div
                key={link.id}
                style={{
                  maxWidth: '560px',
                  width: '100%',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                {/* 1. Top Node: Business Entity */}
                <div
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(168, 85, 247, 0.08)',
                    border: '1px solid rgba(168, 85, 247, 0.35)',
                    boxShadow: '0 8px 24px -6px rgba(168, 85, 247, 0.2)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={22} color="var(--accent-purple)" />
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {business.name}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--accent-purple)', fontWeight: 600 }}>
                    {legalLabel}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {business.role}
                  </div>
                </div>

                {/* Arrow Connector 1 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-indigo)',
                    padding: '0.15rem 0',
                  }}
                >
                  <ArrowDown size={22} />
                </div>

                {/* 2. Second Node: Powered By -> Application */}
                <div
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.35)',
                    boxShadow: '0 8px 24px -6px rgba(99, 102, 241, 0.2)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--accent-indigo)',
                    }}
                  >
                    Powered By
                  </div>

                  <Link
                    href={`/applications/${app.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                    }}
                  >
                    <span>{app.name}</span>
                    <ArrowRight size={15} color="var(--accent-cyan)" />
                  </Link>

                  <span className={`badge ${appBadge}`}>{app.appType}</span>

                  {stackDisplay && (
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--accent-cyan)',
                        fontFamily: 'var(--font-mono)',
                        marginTop: '0.25rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {stackDisplay}
                    </p>
                  )}
                </div>

                {/* Arrow Connector 2 */}
                {proj && (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-cyan)',
                        padding: '0.15rem 0',
                      }}
                    >
                      <ArrowDown size={22} />
                    </div>

                    {/* 3. Third Node: Project */}
                    <div
                      style={{
                        width: '100%',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        background: 'rgba(6, 182, 212, 0.08)',
                        border: '1px solid rgba(6, 182, 212, 0.35)',
                        boxShadow: '0 8px 24px -6px rgba(6, 182, 212, 0.2)',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.45rem',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: 'var(--accent-cyan)',
                        }}
                      >
                        Project
                      </div>

                      <Link
                        href={`/projects/${proj.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          fontSize: '1.35rem',
                          fontWeight: 800,
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span>{proj.title}</span>
                        <ArrowRight size={15} color="var(--accent-cyan)" />
                      </Link>

                      <span className={`badge ${projStatus?.badgeClass ?? 'badge-emerald'}`}>
                        {proj.status}
                      </span>
                    </div>

                    {/* Arrow Connector 3 */}
                    {(targetLiveUrl || targetRepoUrl) && (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-emerald)',
                            padding: '0.15rem 0',
                          }}
                        >
                          <ArrowDown size={22} />
                        </div>

                        {/* 4. Fourth Node: Live Application | Repository */}
                        <div
                          style={{
                            width: '100%',
                            padding: '1.25rem 1.5rem',
                            borderRadius: 'var(--radius-lg)',
                            background: 'rgba(16, 185, 129, 0.08)',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            boxShadow: '0 8px 24px -6px rgba(16, 185, 129, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem',
                          }}
                        >
                          {targetLiveUrl && (
                            <a
                              href={targetLiveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                              <ExternalLink size={14} />
                              <span>Live Application</span>
                            </a>
                          )}

                          {targetLiveUrl && targetRepoUrl && (
                            <span style={{ color: 'var(--border-medium)', fontWeight: 300 }}>|</span>
                          )}

                          {targetRepoUrl && (
                            <a
                              href={targetRepoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                              <ExternalLink size={14} />
                              <span>Repository</span>
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Detailed Applications Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AppWindow size={20} color="var(--accent-indigo)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Powered By Applications</h2>
          <span className="badge badge-slate" style={{ fontSize: '0.75rem' }}>
            {business.applications.length} {business.applications.length === 1 ? 'System' : 'Systems'}
          </span>
        </div>

        {business.applications.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No software applications currently connected to this business.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {business.applications.map((link) => {
              const app = link.application;
              const appBadge = APP_TYPE_BADGE[app.appType] ?? 'badge-slate';

              return (
                <article
                  key={link.id}
                  className="glass-panel"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.15rem',
                  }}
                >
                  {/* Top: Name, Type, Project */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Link
                        href={`/applications/${app.slug}`}
                        style={{
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(99, 102, 241, 0.1)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          display: 'inline-flex',
                          color: 'var(--accent-indigo)',
                        }}
                      >
                        <AppWindow size={18} />
                      </Link>
                      <div>
                        <Link
                          href={`/applications/${app.slug}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                          }}
                        >
                          <span>{app.name}</span>
                          <ArrowRight size={14} color="var(--accent-cyan)" />
                        </Link>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className={`badge ${appBadge}`}>{app.appType}</span>
                      {app.project && (
                        <Link
                          href={`/projects/${app.project.slug}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.775rem',
                            fontFamily: 'var(--font-mono)',
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--accent-cyan)',
                          }}
                          title={`Belongs to Project: ${app.project.title}`}
                        >
                          <FolderGit2 size={12} />
                          <span>{app.project.title}</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {app.summary}
                  </p>

                  {/* Operational Role Callout */}
                  <div
                    style={{
                      padding: '0.9rem 1.15rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(99, 102, 241, 0.06)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-indigo)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Operational Role for {business.name}:
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                      &ldquo;{link.purpose}&rdquo;
                    </p>
                  </div>

                  {/* Tech Stack */}
                  {app.techStack && app.techStack.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <Code2 size={13} color="var(--text-muted)" />
                      {app.techStack.map((tech) => (
                        <span key={tech} className="tech-tag" style={{ fontSize: '0.75rem' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <Link
                      href={`/applications/${app.slug}`}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <AppWindow size={13} />
                      <span>Application Details</span>
                      <ArrowRight size={13} />
                    </Link>

                    {app.liveUrl && (
                      <a
                        href={app.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <ExternalLink size={13} />
                        <span>Live Application</span>
                      </a>
                    )}

                    {app.repoUrl && (
                      <a
                        href={app.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <ExternalLink size={13} />
                        <span>Repository</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
