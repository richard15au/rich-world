'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Plus,
  ExternalLink,
  CheckCircle2,
  Globe,
  Clock,
  Briefcase,
  Layers,
  AppWindow,
} from 'lucide-react';
import BusinessCreateForm from './BusinessCreateForm';

interface ApplicationOption {
  id: string;
  name: string;
  slug: string;
  appType: string;
}

interface LinkedApplication {
  id: string;
  purpose: string;
  application: {
    id: string;
    name: string;
    slug: string;
    appType: string;
  };
}

interface BusinessRecord {
  id: string;
  slug: string;
  name: string;
  legalType: string;
  role: string;
  summary: string;
  websiteUrl: string | null;
  status: string;
  isPublic: boolean;
  createdAt: Date | string;
  applications: LinkedApplication[];
}

interface BusinessesAdminClientProps {
  initialBusinesses: BusinessRecord[];
  availableApplications: ApplicationOption[];
  initialMode?: 'list' | 'create';
}

const LEGAL_TYPE_BADGE: Record<string, string> = {
  STUDIO: 'badge-purple',
  COMPANY: 'badge-cyan',
  AGENCY: 'badge-indigo',
  FREELANCE: 'badge-amber',
};

const APP_TYPE_BADGE: Record<string, string> = {
  WEB: 'badge-cyan',
  API: 'badge-indigo',
  CLI: 'badge-amber',
  SERVICE: 'badge-purple',
  MOBILE: 'badge-emerald',
};

export default function BusinessesAdminClient({
  initialBusinesses,
  availableApplications,
  initialMode = 'list',
}: BusinessesAdminClientProps) {
  const [mode, setMode] = useState<'list' | 'create'>(initialMode);
  const [justCreatedSlug, setJustCreatedSlug] = useState<string | null>(null);

  const handleBusinessCreated = (newBiz: { id: string; slug: string; name: string }) => {
    setJustCreatedSlug(newBiz.slug);
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
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              display: 'inline-flex',
              color: 'var(--accent-purple)',
            }}
          >
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.85rem' }}>Businesses & Offices Management</h1>
              <span className="badge badge-slate" style={{ fontSize: '0.75rem' }}>
                {initialBusinesses.length}{' '}
                {initialBusinesses.length === 1 ? 'Record' : 'Records'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Commercial ventures, studios, and operational structures powered by software applications.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            href="/businesses"
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
              <span>New Business</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode('list')}
              className="btn btn-secondary btn-sm"
            >
              <span>Back to Businesses List</span>
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
              Business entity created successfully! View the entry below.
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

      {/* Main View: Create Form vs Businesses List */}
      {mode === 'create' ? (
        <BusinessCreateForm
          availableApplications={availableApplications}
          onSuccess={handleBusinessCreated}
          onCancel={() => setMode('list')}
        />
      ) : initialBusinesses.length === 0 ? (
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
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              display: 'inline-flex',
              color: 'var(--accent-purple)',
            }}
          >
            <Building2 size={36} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxWidth: '460px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>No businesses recorded yet</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Register real operational businesses, studios, and consultancies, and link the applications that drive their success.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMode('create')}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}
          >
            <Plus size={16} />
            <span>Register Your First Business</span>
          </button>
        </div>
      ) : (
        /* Business Listing */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {initialBusinesses.map((biz) => {
            const legalBadgeClass = LEGAL_TYPE_BADGE[biz.legalType] ?? 'badge-slate';
            const statusBadgeClass = biz.status === 'ACTIVE' ? 'badge-emerald' : 'badge-slate';
            const createdDate = new Date(biz.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <article
                key={biz.id}
                className="glass-panel"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderColor: justCreatedSlug === biz.slug ? 'var(--accent-purple)' : undefined,
                }}
              >
                {/* Header Row: Title, Slug, Badges */}
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
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{biz.name}</h3>
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
                      /{biz.slug}
                    </code>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${legalBadgeClass}`}>{biz.legalType}</span>
                    <span className={`badge ${statusBadgeClass}`}>{biz.status}</span>
                    {biz.isPublic ? (
                      <span className="badge badge-cyan">Public</span>
                    ) : (
                      <span className="badge badge-slate">Private / Draft</span>
                    )}
                  </div>
                </div>

                {/* Role */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.875rem' }}>
                  <Briefcase size={14} color="var(--accent-purple)" />
                  <span style={{ color: 'var(--text-secondary)' }}>Role:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{biz.role}</strong>
                </div>

                {/* Summary */}
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {biz.summary}
                </p>

                {/* Connected Applications Section */}
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <Layers size={13} color="var(--accent-indigo)" />
                    <span>Applications & Powered Services</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({biz.applications.length})</span>
                  </div>

                  {biz.applications.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                      No applications currently connected to this business.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {biz.applications.map((link) => {
                        const appBadge = APP_TYPE_BADGE[link.application.appType] ?? 'badge-slate';
                        return (
                          <div
                            key={link.id}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.3rem',
                              padding: '0.75rem 0.9rem',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid rgba(255, 255, 255, 0.04)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AppWindow size={15} color="var(--accent-cyan)" />
                                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {link.application.name}
                                </span>
                                <code
                                  style={{
                                    fontSize: '0.725rem',
                                    fontFamily: 'var(--font-mono)',
                                    color: 'var(--text-muted)',
                                  }}
                                >
                                  /{link.application.slug}
                                </code>
                              </div>
                              <span className={`badge ${appBadge}`} style={{ fontSize: '0.65rem' }}>
                                {link.application.appType}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.4rem' }}>
                              <span style={{ color: 'var(--accent-indigo)', fontWeight: 600, flexShrink: 0 }}>Purpose:</span>
                              <span style={{ fontStyle: 'italic' }}>&ldquo;{link.purpose}&rdquo;</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer metadata and website link */}
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
                    <span>Created {createdDate}</span>
                  </span>

                  {biz.websiteUrl && (
                    <a
                      href={biz.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: 'var(--accent-purple)',
                        fontSize: '0.775rem',
                      }}
                    >
                      <Globe size={12} />
                      <span>{biz.websiteUrl.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
