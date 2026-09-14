'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AppWindow,
  Plus,
  ExternalLink,
  FolderGit2,
  CheckCircle2,
  Globe,
  Radio,
  Clock,
  Code2,
} from 'lucide-react';
import ApplicationCreateForm from './ApplicationCreateForm';

interface ProjectOption {
  id: string;
  title: string;
  slug: string;
}

interface ApplicationRecord {
  id: string;
  slug: string;
  name: string;
  summary: string;
  appType: string;
  techStack: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  isPublic: boolean;
  createdAt: Date | string;
  project: {
    id: string;
    title: string;
    slug: string;
  };
}

interface ApplicationsAdminClientProps {
  initialApplications: ApplicationRecord[];
  availableProjects: ProjectOption[];
  initialMode?: 'list' | 'create';
}

const APP_TYPE_BADGE: Record<string, string> = {
  WEB: 'badge-cyan',
  API: 'badge-indigo',
  CLI: 'badge-amber',
  SERVICE: 'badge-purple',
  MOBILE: 'badge-emerald',
};

export default function ApplicationsAdminClient({
  initialApplications,
  availableProjects,
  initialMode = 'list',
}: ApplicationsAdminClientProps) {
  const [mode, setMode] = useState<'list' | 'create'>(initialMode);
  const [justCreatedSlug, setJustCreatedSlug] = useState<string | null>(null);

  const handleApplicationCreated = (newApp: { id: string; slug: string; name: string }) => {
    setJustCreatedSlug(newApp.slug);
    setMode('list');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'inline-flex',
              color: 'var(--accent-indigo)',
            }}
          >
            <AppWindow size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.85rem' }}>Applications Management</h1>
              <span className="badge badge-slate" style={{ fontSize: '0.75rem' }}>
                {initialApplications.length}{' '}
                {initialApplications.length === 1 ? 'Record' : 'Records'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Owner control for cataloging deployable software applications linked to umbrella engineering projects.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            href="/applications"
            target="_blank"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <ExternalLink size={13} />
            <span>Public Catalog</span>
          </Link>

          {mode === 'list' ? (
            <button
              type="button"
              onClick={() => {
                setJustCreatedSlug(null);
                setMode('create');
              }}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={15} />
              <span>New Application</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode('list')}
              className="btn btn-secondary btn-sm"
            >
              <span>Back to Applications List</span>
            </button>
          )}
        </div>
      </header>

      {/* Just created notification banner */}
      {justCreatedSlug && mode === 'list' && (
        <div
          className="glass-panel"
          style={{
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            background: 'rgba(16, 185, 129, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#34d399' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: '0.875rem' }}>
              Application created successfully! View the entry below.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setJustCreatedSlug(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main View: Create Form vs Application List */}
      {mode === 'create' ? (
        <ApplicationCreateForm
          availableProjects={availableProjects}
          onSuccess={handleApplicationCreated}
          onCancel={() => setMode('list')}
        />
      ) : initialApplications.length === 0 ? (
        /* Empty State */
        <div
          className="glass-panel"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
          }}
        >
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              display: 'inline-flex',
              color: 'var(--accent-indigo)',
            }}
          >
            <AppWindow size={36} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxWidth: '440px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>No applications recorded yet</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Register concrete deployable software systems and link them directly to your architectural projects.
            </p>
          </div>

          {availableProjects.length > 0 ? (
            <button
              type="button"
              onClick={() => setMode('create')}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}
            >
              <Plus size={16} />
              <span>Create Your First Application</span>
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-amber)' }}>
                You must have at least one Project registered before creating an application.
              </p>
              <Link href="/admin/projects/new" className="btn btn-primary">
                <FolderGit2 size={16} />
                <span>Create a Project First</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* Application Listing */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {initialApplications.map((app) => {
            const typeBadgeClass = APP_TYPE_BADGE[app.appType] ?? 'badge-slate';
            const createdDate = new Date(app.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <article
                key={app.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  borderColor: justCreatedSlug === app.slug ? 'var(--accent-cyan)' : undefined,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{app.name}</h3>
                    <code
                      style={{
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      /{app.slug}
                    </code>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${typeBadgeClass}`}>{app.appType}</span>
                    {app.isPublic ? (
                      <span className="badge badge-cyan">Public</span>
                    ) : (
                      <span className="badge badge-slate">Private / Draft</span>
                    )}
                  </div>
                </div>

                {/* Parent Project Link */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Belongs to:</span>
                  <Link
                    href={`/admin/projects`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: 'var(--accent-indigo)',
                      fontWeight: 600,
                    }}
                  >
                    <FolderGit2 size={14} />
                    <span>{app.project.title}</span>
                  </Link>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {app.summary}
                </p>

                {/* Tech Stack Tags */}
                {app.techStack && app.techStack.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <Code2 size={13} color="var(--text-muted)" />
                    {app.techStack.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer metadata and links */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={13} />
                    <span>{createdDate}</span>
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {app.repoUrl && (
                      <a
                        href={app.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: 'var(--text-secondary)',
                          fontSize: '0.775rem',
                        }}
                      >
                        <Radio size={12} />
                        <span>Repo</span>
                      </a>
                    )}
                    {app.liveUrl && (
                      <a
                        href={app.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: 'var(--accent-cyan)',
                          fontSize: '0.775rem',
                        }}
                      >
                        <Globe size={12} />
                        <span>Live</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
