import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  AppWindow,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FolderGit2,
  Building2,
  Briefcase,
  Code2,
  Clock,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface ApplicationDetailPageProps {
  params: Promise<{ slug: string }>;
}

const APP_TYPE_BADGE: Record<string, string> = {
  WEB: 'badge-cyan',
  API: 'badge-indigo',
  CLI: 'badge-amber',
  SERVICE: 'badge-purple',
  MOBILE: 'badge-emerald',
};

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  ACTIVE: { label: 'Active', badgeClass: 'badge-emerald' },
  MAINTENANCE: { label: 'Maintenance', badgeClass: 'badge-amber' },
  ARCHIVED: { label: 'Archived', badgeClass: 'badge-slate' },
  INACTIVE: { label: 'Inactive', badgeClass: 'badge-slate' },
};

const LEGAL_TYPE_BADGE: Record<string, string> = {
  STUDIO: 'badge-purple',
  COMPANY: 'badge-cyan',
  AGENCY: 'badge-indigo',
  FREELANCE: 'badge-amber',
};

export async function generateMetadata({ params }: ApplicationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const application = await prisma.application.findUnique({
    where: { slug },
    select: {
      name: true,
      summary: true,
      isPublic: true,
    },
  });

  if (!application || !application.isPublic) {
    return {
      title: 'Application Not Found | RICH WORLD',
    };
  }

  return {
    title: `${application.name} | Applications | RICH WORLD`,
    description: application.summary,
  };
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { slug } = await params;

  const application = await prisma.application.findUnique({
    where: { slug },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          slug: true,
          tagline: true,
          status: true,
        },
      },
      businessUsages: {
        where: {
          business: {
            isPublic: true,
          },
        },
        include: {
          business: true,
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  // Return proper 404 when application does not exist or is not public
  if (!application || !application.isPublic) {
    notFound();
  }

  const typeBadge = APP_TYPE_BADGE[application.appType] ?? 'badge-slate';
  const projectStatus = STATUS_CONFIG[application.project.status] ?? {
    label: application.project.status,
    badgeClass: 'badge-slate',
  };

  const createdDate = new Date(application.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '960px', margin: '0 auto' }}>
      {/* Navigation Header */}
      <div>
        <Link
          href="/applications"
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={14} />
          <span>Back to Applications</span>
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
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'inline-flex',
                color: 'var(--accent-indigo)',
              }}
            >
              <AppWindow size={22} />
            </div>
            <span className={`badge ${typeBadge}`}>{application.appType}</span>
            <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={12} />
              <span>Public System</span>
            </span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
            <Clock size={14} />
            <span>Published {createdDate}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.15 }}>
            {application.name}
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {application.summary}
          </p>
        </div>

        {/* Action Buttons: Live Application & Repository */}
        {(application.liveUrl || application.repoUrl) && (
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
            {application.liveUrl && (
              <a
                href={application.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <ExternalLink size={15} />
                <span>Launch Live Application</span>
              </a>
            )}

            {application.repoUrl && (
              <a
                href={application.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <ExternalLink size={15} />
                <span>View Source Repository</span>
              </a>
            )}
          </div>
        )}
      </section>

      {/* Grid: Parent Project & Technology Stack */}
      <div className="grid-2" style={{ gap: '1.5rem' }}>
        {/* Parent Project Card */}
        <section
          className="glass-panel"
          style={{
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-indigo)' }}>
                <FolderGit2 size={18} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Parent Project
                </span>
              </div>
              <span className={`badge ${projectStatus.badgeClass}`}>{projectStatus.label}</span>
            </div>

            <div>
              <Link
                href={`/projects/${application.project.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                  {application.project.title}
                </h2>
                <ArrowRight size={15} color="var(--accent-cyan)" />
              </Link>
              <p style={{ fontSize: '0.875rem', color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
                {application.project.tagline}
              </p>
            </div>

            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              This application is an architectural software component built under the {application.project.title} project umbrella.
            </p>
          </div>

          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <Link
              href={`/projects/${application.project.slug}`}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', width: '100%', justifyContent: 'center' }}
            >
              <FolderGit2 size={14} />
              <span>Explore {application.project.title}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* Technology Stack Card */}
        <section
          className="glass-panel"
          style={{
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-cyan)' }}>
            <Code2 size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Technology Stack
            </span>
          </div>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Frameworks, libraries, databases, and architectural tools powering this system:
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {application.techStack && application.techStack.length > 0 ? (
              application.techStack.map((tech) => (
                <span
                  key={tech}
                  className="tech-tag"
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.825rem',
                  }}
                >
                  {tech}
                </span>
              ))
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No stack specified</span>
            )}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              <Layers size={13} />
              <span>System Category: Level 03 Application</span>
            </div>
          </div>
        </section>
      </div>

      {/* Used By Businesses Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={20} color="var(--accent-purple)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Used By Businesses</h2>
          <span className="badge badge-slate" style={{ fontSize: '0.75rem' }}>
            {application.businessUsages.length} {application.businessUsages.length === 1 ? 'Business' : 'Businesses'}
          </span>
        </div>

        {application.businessUsages.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No active commercial businesses currently powered by this application.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {application.businessUsages.map((usage) => {
              const biz = usage.business;
              const legalBadge = LEGAL_TYPE_BADGE[biz.legalType] ?? 'badge-slate';
              const bizStatus = STATUS_CONFIG[biz.status] ?? {
                label: biz.status,
                badgeClass: 'badge-slate',
              };

              return (
                <article
                  key={usage.id}
                  className="glass-panel interactive"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.15rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Link
                        href={`/businesses/${biz.slug}`}
                        style={{
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(168, 85, 247, 0.1)',
                          border: '1px solid rgba(168, 85, 247, 0.2)',
                          display: 'inline-flex',
                          color: 'var(--accent-purple)',
                        }}
                        title={`View ${biz.name} details`}
                      >
                        <Building2 size={18} />
                      </Link>

                      <Link
                        href={`/businesses/${biz.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                        }}
                      >
                        <span>{biz.name}</span>
                        <ArrowRight size={14} color="var(--accent-purple)" />
                      </Link>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className={`badge ${legalBadge}`}>{biz.legalType}</span>
                      <span className={`badge ${bizStatus.badgeClass}`}>{bizStatus.label}</span>
                    </div>
                  </div>

                  {/* Role / Leadership */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <Briefcase size={14} color="var(--accent-purple)" />
                    <span>Leadership Role:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{biz.role}</strong>
                  </div>

                  {/* Summary */}
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {biz.summary}
                  </p>

                  {/* Purpose Callout */}
                  <div
                    style={{
                      padding: '0.9rem 1.15rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(168, 85, 247, 0.06)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Operational Purpose for {biz.name}:
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                      &ldquo;{usage.purpose}&rdquo;
                    </p>
                  </div>

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
                      href={`/businesses/${biz.slug}`}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Building2 size={13} />
                      <span>Business Details</span>
                      <ArrowRight size={13} />
                    </Link>

                    {biz.websiteUrl && (
                      <a
                        href={biz.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <ExternalLink size={13} />
                        <span>Visit Website</span>
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
