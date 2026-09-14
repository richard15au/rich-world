import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, ExternalLink, Briefcase, Layers, AppWindow, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Businesses & Offices | RICH WORLD',
  description: 'Commercial ventures, studios, and operational structures powered by software applications in Rich World.',
};

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

export default async function BusinessesPage() {
  const businesses = await prisma.business.findMany({
    where: { isPublic: true },
    include: {
      applications: {
        include: {
          application: {
            select: {
              id: true,
              name: true,
              slug: true,
              appType: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={24} color="var(--accent-purple)" />
          <h1 style={{ fontSize: '2rem' }}>Offices & Businesses</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px' }}>
          Commercial ventures, studios, and operational structures powered by software applications.
        </p>
      </header>

      {businesses.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
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
            <Building2 size={32} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxWidth: '420px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>No public businesses yet.</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Commercial ventures, studios, and operations will appear here as they are published.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          {businesses.map((biz) => {
            const legalBadgeClass = LEGAL_TYPE_BADGE[biz.legalType] ?? 'badge-slate';
            const statusConfig = STATUS_CONFIG[biz.status] ?? {
              label: biz.status,
              badgeClass: 'badge-slate',
            };

            return (
              <article
                key={biz.id}
                className="glass-panel interactive"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {/* Top Row: Icon, Legal Type Badge, Status Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                    <span className={`badge ${legalBadgeClass}`}>{biz.legalType}</span>
                  </div>
                  <span className={`badge ${statusConfig.badgeClass}`}>{statusConfig.label}</span>
                </div>

                {/* Business Name as Link */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <Link
                    href={`/businesses/${biz.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      width: 'fit-content',
                    }}
                  >
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>{biz.name}</h2>
                    <ArrowRight size={15} color="var(--accent-purple)" />
                  </Link>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <Briefcase size={14} color="var(--accent-purple)" />
                    <span>Role:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{biz.role}</strong>
                  </div>
                </div>

                {/* Summary */}
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                  {biz.summary}
                </p>

                {/* Connected Applications Section */}
                {biz.applications && biz.applications.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      <Layers size={13} color="var(--accent-indigo)" />
                      <span>Powered By</span>
                    </div>

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
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '0.4rem',
                              }}
                            >
                              <Link
                                href={`/applications/${link.application.slug}`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  color: 'var(--accent-cyan)',
                                }}
                                title={`View ${link.application.name} details`}
                              >
                                <AppWindow size={14} />
                                <span>{link.application.name}</span>
                              </Link>
                              <span className={`badge ${appBadge}`} style={{ fontSize: '0.65rem' }}>
                                {link.application.appType}
                              </span>
                            </div>

                            <p
                              style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)',
                                fontStyle: 'italic',
                                lineHeight: 1.45,
                                margin: 0,
                                paddingLeft: '1.25rem',
                              }}
                            >
                              &ldquo;{link.purpose}&rdquo;
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer: Details link and independent External Website Link */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <Link
                    href={`/businesses/${biz.slug}`}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>Details</span>
                    <ArrowRight size={13} />
                  </Link>

                  {biz.websiteUrl && (
                    <a
                      href={biz.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
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
    </div>
  );
}
