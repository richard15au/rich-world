import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  FolderGit2,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ExternalLink,
  AppWindow,
  Building2,
  Briefcase,
  Code2,
  Clock,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  ACTIVE: { label: 'Active', badgeClass: 'badge-emerald' },
  MAINTENANCE: { label: 'Maintenance', badgeClass: 'badge-amber' },
  ARCHIVED: { label: 'Archived', badgeClass: 'badge-slate' },
};

const APP_TYPE_BADGE: Record<string, string> = {
  WEB: 'badge-cyan',
  API: 'badge-indigo',
  CLI: 'badge-amber',
  SERVICE: 'badge-purple',
  MOBILE: 'badge-emerald',
};

const LEGAL_TYPE_BADGE: Record<string, string> = {
  STUDIO: 'badge-purple',
  COMPANY: 'badge-cyan',
  AGENCY: 'badge-indigo',
  FREELANCE: 'badge-amber',
};

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    select: {
      title: true,
      tagline: true,
      isPublic: true,
    },
  });

  if (!project || !project.isPublic) {
    return {
      title: 'Project Not Found | RICH WORLD',
    };
  }

  return {
    title: `${project.title} | Projects | RICH WORLD`,
    description: project.tagline,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      applications: {
        where: { isPublic: true },
        include: {
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
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!project || !project.isPublic) {
    notFound();
  }

  const statusConfig = STATUS_CONFIG[project.status] ?? {
    label: project.status,
    badgeClass: 'badge-slate',
  };

  const createdDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '960px', margin: '0 auto' }}>
      {/* Navigation Header */}
      <div>
        <Link
          href="/projects"
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={14} />
          <span>Back to Projects</span>
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
              <FolderGit2 size={22} />
            </div>
            <span className={`badge ${statusConfig.badgeClass}`}>{statusConfig.label}</span>
            {project.featured && <span className="badge badge-cyan">Featured</span>}
            <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={12} />
              <span>Public Initiative</span>
            </span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
            <Clock size={14} />
            <span>Published {createdDate}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.15 }}>
            {project.title}
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--accent-cyan)', fontWeight: 500 }}>
            {project.tagline}
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {project.description}
          </p>
        </div>

        {/* Action Buttons: Live Application & Repository (only when real values exist) */}
        {(project.liveUrl || project.repoUrl) && (
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
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <ExternalLink size={15} />
                <span>Launch Live Application</span>
              </a>
            )}

            {project.repoUrl && (
              <a
                href={project.repoUrl}
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

      {/* Ecosystem Architecture & Hierarchy Flow (Project → Application → Business) */}
      {project.applications.length > 0 && (
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
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', color: 'var(--accent-cyan)' }}>
              <Layers size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Ecosystem Architecture & Flow
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              Engineering to Operations Pipeline
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto' }}>
              How {project.title} architects deployable software systems and powers downstream commercial businesses.
            </p>
          </div>

          <div
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
            {/* 1. Top Node: Project */}
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
                gap: '0.35rem',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderGit2 size={22} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {project.title}
                </h3>
              </div>
              <span className={`badge ${statusConfig.badgeClass}`}>{project.status}</span>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {project.tagline}
              </div>
            </div>

            {project.applications.map((app) => {
              const appBadge = APP_TYPE_BADGE[app.appType] ?? 'badge-slate';
              const stackDisplay = app.techStack && app.techStack.length > 0
                ? app.techStack.map((s) => s.replace(/ \d+$/, '')).join(' • ')
                : null;

              return (
                <div key={app.id} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
                  {/* Arrow Connector 1: Project ↓ Application */}
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

                  {/* 2. Second Node: Application */}
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
                      Deployable Application
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

                  {/* Downstream Businesses connected to this Application */}
                  {app.businessUsages.map((usage) => {
                    const biz = usage.business;
                    const legalBadge = LEGAL_TYPE_BADGE[biz.legalType] ?? 'badge-slate';

                    return (
                      <div key={usage.id} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
                        {/* Arrow Connector 2: Application ↓ Business */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-purple)',
                            padding: '0.15rem 0',
                          }}
                        >
                          <ArrowDown size={22} />
                        </div>

                        {/* 3. Third Node: Business */}
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
                          <div
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              color: 'var(--accent-purple)',
                            }}
                          >
                            Powered Business / Office
                          </div>

                          <Link
                            href={`/businesses/${biz.slug}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              fontSize: '1.35rem',
                              fontWeight: 800,
                              color: 'var(--text-primary)',
                            }}
                          >
                            <Building2 size={20} color="var(--accent-purple)" />
                            <span>{biz.name}</span>
                            <ArrowRight size={15} color="var(--accent-purple)" />
                          </Link>

                          <span className={`badge ${legalBadge}`}>{biz.legalType}</span>

                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {biz.role}
                          </div>

                          <p
                            style={{
                              fontSize: '0.825rem',
                              color: 'var(--text-secondary)',
                              fontStyle: 'italic',
                              marginTop: '0.35rem',
                              lineHeight: 1.45,
                            }}
                          >
                            &ldquo;{usage.purpose}&rdquo;
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Contained Applications Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AppWindow size={20} color="var(--accent-indigo)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Contained Applications</h2>
          <span className="badge badge-slate" style={{ fontSize: '0.75rem' }}>
            {project.applications.length} {project.applications.length === 1 ? 'Application' : 'Applications'}
          </span>
        </div>

        {project.applications.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No software applications currently cataloged under this project initiative.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {project.applications.map((app) => {
              const appBadge = APP_TYPE_BADGE[app.appType] ?? 'badge-slate';

              return (
                <article
                  key={app.id}
                  className="glass-panel"
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

                    <span className={`badge ${appBadge}`}>{app.appType}</span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {app.summary}
                  </p>

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

                  {/* Connected Businesses powering this Application */}
                  {app.businessUsages && app.businessUsages.length > 0 && (
                    <div
                      style={{
                        padding: '0.9rem 1.15rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(168, 85, 247, 0.06)',
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <Building2 size={13} />
                        <span>Powers Business Operations:</span>
                      </div>

                      {app.businessUsages.map((usage) => (
                        <div key={usage.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <Link
                              href={`/businesses/${usage.business.slug}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                color: 'var(--accent-purple)',
                              }}
                            >
                              <span>{usage.business.name}</span>
                              <ArrowRight size={13} />
                            </Link>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span className={`badge ${LEGAL_TYPE_BADGE[usage.business.legalType] ?? 'badge-slate'}`} style={{ fontSize: '0.65rem' }}>
                                {usage.business.legalType}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <Briefcase size={12} />
                                <span>{usage.business.role}</span>
                              </div>
                            </div>
                          </div>

                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                            &ldquo;{usage.purpose}&rdquo;
                          </p>
                        </div>
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
