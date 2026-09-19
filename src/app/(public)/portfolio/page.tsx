import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FolderGit2,
  Layers,
  ArrowRight,
  ExternalLink,
  MapPin,
  Mail,
  Network,
  Milestone,
  Compass,
  Sparkles,
  Bot,
  GraduationCap,
  Activity,
  Server,
  Briefcase,
  Terminal,
  ShieldCheck,
  Database,
  Cloud,
  Code2,
} from 'lucide-react';
import { prisma } from '@/lib/db';
import ToolsMarquee from '@/components/ToolsMarquee';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Portfolio | Richard Vitug — IT Student',
  description:
    'Professional portfolio and engineering dashboard of Richard Vitug: IT Student based in Sydney, Australia.',
};

export default async function PortfolioPage() {
  // Fetch real data from Prisma/Neon
  const [projects, applications, networkLabs, milestones] = await Promise.all([
    prisma.project.findMany({
      where: { isPublic: true },
      include: {
        applications: {
          where: { isPublic: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.application.findMany({
      where: { isPublic: true },
      include: {
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.networkLab.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.journeyMilestone.findMany({
      where: { isPublic: true },
      orderBy: { date: 'desc' },
      take: 4,
    }),
  ]);

  // Real featured project (EduFlex or first public project)
  const featuredProject =
    projects.find((p) => p.featured || p.slug === 'eduflex') || projects[0];

  const focusAreas = [
    { name: 'Software Development', icon: Code2, desc: 'Next.js, TypeScript, React, modular architectures' },
    { name: 'AI / AI Engineering', icon: Bot, desc: 'LLM orchestration, agentic workflows, prompt systems' },
    { name: 'Cloud & Infrastructure', icon: Cloud, desc: 'AWS, virtualization, automated deployments' },
    { name: 'Linux & Systems', icon: Terminal, desc: 'Debian/Ubuntu administration, shell scripting, services' },
    { name: 'Networking & Security', icon: ShieldCheck, desc: 'OPNsense firewalls, VLANs, routing, security baselines' },
    { name: 'Databases & Storage', icon: Database, desc: 'PostgreSQL, Prisma ORM, Neon serverless architecture' },
  ];

  const cityDistricts = [
    { name: 'RichAcademy', icon: GraduationCap, tag: 'Education Hub', color: 'var(--accent-indigo)' },
    { name: 'Healthcare', icon: Activity, tag: 'Medical Systems', color: 'var(--accent-emerald)' },
    { name: 'AI / Technology Studio', icon: Bot, tag: 'Intelligent Systems', color: 'var(--accent-cyan)' },
    { name: 'Network Labs', icon: Server, tag: 'Virtualization & Routing', color: 'var(--accent-amber)' },
    { name: 'Future Ventures', icon: Briefcase, tag: 'Incubation & Ventures', color: 'var(--accent-purple)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '3rem' }}>
      {/* ============================================================ */}
      {/* 1. PROFILE HEADER */}
      {/* ============================================================ */}
      <section
        className="glass-panel"
        style={{
          padding: '2.5rem',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 15, 29, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.18)',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 40px -10px rgba(56, 189, 248, 0.08)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
            }}
          >
            {/* Avatar + Main Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(99, 102, 241, 0.35) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '0.05em',
                  boxShadow: '0 8px 24px -6px rgba(56, 189, 248, 0.3)',
                }}
              >
                RV
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                    Richard Vitug
                  </h1>
                  <span
                    className="badge badge-cyan"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.25rem 0.65rem',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-cyan)',
                        boxShadow: '0 0 8px var(--accent-cyan)',
                      }}
                    />
                    Building RICH WORLD
                  </span>
                </div>

                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  IT Student
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    marginTop: '0.15rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={13} color="var(--accent-cyan)" />
                    Sydney, Australia
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href="https://github.com/richard15au"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                title="GitHub Profile"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span>GitHub</span>
                <ExternalLink size={12} />
              </a>

              <a
                href="mailto:richardvitug015@gmail.com"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Mail size={14} color="var(--accent-cyan)" />
                <span>Contact</span>
              </a>

              <Link
                href="/world"
                className="btn-glow"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <Compass size={14} />
                <span>Enter 2D World</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div
            style={{
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              maxWidth: '850px',
            }}
          >
            Turning ideas into reality. Focused on modern software architectures, enterprise networks, and intelligent
            systems — building towards a unified, persistent digital world where projects, businesses, and automated AI
            agents coexist.
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. TOOLS I WORK WITH MARQUEE */}
      {/* ============================================================ */}
      <section>
        <ToolsMarquee />
      </section>

      {/* ============================================================ */}
      {/* 3. FEATURED BUILD (REAL DATA ONLY) */}
      {/* ============================================================ */}
      {featuredProject && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>Featured Build</h2>
            </div>
            <Link
              href="/projects"
              style={{
                fontSize: '0.85rem',
                color: 'var(--accent-cyan)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>All Projects</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(13, 20, 36, 0.9) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                padding: '0.45rem 1.25rem',
                background: 'rgba(56, 189, 248, 0.12)',
                borderBottomLeftRadius: 'var(--radius-md)',
                borderLeft: '1px solid rgba(56, 189, 248, 0.3)',
                borderBottom: '1px solid rgba(56, 189, 248, 0.3)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent-cyan)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Spotlight Architecture
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '750px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span className="badge badge-cyan">{featuredProject.status}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Project Architecture</span>
              </div>

              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
                {featuredProject.title}
              </h3>

              <p style={{ fontSize: '1.05rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
                {featuredProject.tagline}
              </p>

              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {featuredProject.description}
              </p>
            </div>

            {/* Linked Applications for this Project */}
            {featuredProject.applications && featuredProject.applications.length > 0 && (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Deployable Applications
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  {featuredProject.applications.map((app) => (
                    <div
                      key={app.id}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Layers size={14} color="var(--accent-indigo)" />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>{app.name}</span>
                        <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>{app.appType}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{app.summary}</p>
                      {app.techStack && app.techStack.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                          {app.techStack.map((tech) => (
                            <span
                              key={tech}
                              style={{
                                fontSize: '0.7rem',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '4px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--text-muted)',
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions: Strictly real links only */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                flexWrap: 'wrap',
                paddingTop: '0.5rem',
              }}
            >
              <Link
                href={`/projects/${featuredProject.slug}`}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <span>Explore {featuredProject.title} Details</span>
                <ArrowRight size={14} />
              </Link>

              {featuredProject.liveUrl && (
                <a
                  href={featuredProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <ExternalLink size={14} />
                  <span>Live Platform</span>
                </a>
              )}

              {featuredProject.repoUrl && (
                <a
                  href={featuredProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <ExternalLink size={14} />
                  <span>Repository</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 4. BUILDS (PROJECTS + APPLICATIONS CONCEPTUALLY TOGETHER) */}
      {/* ============================================================ */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FolderGit2 size={20} color="var(--accent-indigo)" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>BUILDS</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Projects and applications powering the RICH WORLD digital ecosystem
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/projects" className="btn btn-secondary btn-sm">
              All Projects ({projects.length})
            </Link>
            <Link href="/applications" className="btn btn-secondary btn-sm">
              All Applications ({applications.length})
            </Link>
          </div>
        </div>

        <div className="grid-2">
          {/* Projects Column */}
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderGit2 size={16} color="var(--accent-indigo)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Architectural Projects</h3>
              </div>
              <span className="badge badge-slate">{projects.length} Total</span>
            </div>

            {projects.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No public projects recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {projects.map((proj) => (
                  <Link
                    key={proj.id}
                    href={`/projects/${proj.slug}`}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(241, 245, 249, 0.65)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                    className="interactive"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{proj.title}</span>
                      <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>{proj.status}</span>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{proj.tagline}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Applications Column */}
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={16} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Deployable Applications</h3>
              </div>
              <span className="badge badge-slate">{applications.length} Total</span>
            </div>

            {applications.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No public applications recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {applications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/applications/${app.slug}`}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(241, 245, 249, 0.65)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                    className="interactive"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{app.name}</span>
                      <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{app.appType}</span>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{app.summary}</p>
                    {app.techStack && app.techStack.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                        {app.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            style={{
                              fontSize: '0.65rem',
                              padding: '0.1rem 0.35rem',
                              borderRadius: '3px',
                              background: 'rgba(56, 189, 248, 0.08)',
                              color: 'var(--accent-cyan)',
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. ABOUT ME & FOCUS AREAS (INTEGRATED COMPACT SKILLS) */}
      {/* ============================================================ */}
      <section
        className="glass-panel"
        style={{
          padding: '2.25rem',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Background & Focus
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>About Me</h2>
          </div>
          <Link
            href="/skills"
            style={{
              fontSize: '0.85rem',
              color: 'var(--accent-cyan)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>Detailed Skills Directory</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '900px' }}>
          <p style={{ marginBottom: '0.75rem' }}>
            I am an IT Student based in Sydney, Australia. My work is anchored in understanding
            how foundational technologies connect — starting from physical and virtual networks, through production web
            applications, up to intelligent systems and autonomous software agents.
          </p>
          <p>
            RICH WORLD serves as my personal architectural canvas: rather than building isolated portfolio projects,
            every repository, database schema, and virtual machine represents a building block of a cohesive digital
            world.
          </p>
        </div>

        {/* Focus Areas Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Areas of Interest & Technical Experience
          </h3>
          <div className="grid-3" style={{ gap: '0.85rem' }}>
            {focusAreas.map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.name}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(241, 245, 249, 0.65)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon size={15} color="var(--accent-cyan)" />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{area.name}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{area.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. 2D RICH WORLD (PROMINENT SECTION) */}
      {/* ============================================================ */}
      <section
        className="glass-panel"
        style={{
          padding: '2.5rem',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(20, 26, 45, 0.9) 0%, rgba(10, 14, 26, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                }}
              >
                <Compass size={18} />
              </span>
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--accent-cyan)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Future Interactive Simulation
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>2D RICH WORLD</h2>
              </div>
            </div>

            <span
              className="badge badge-indigo"
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                padding: '0.35rem 0.75rem',
              }}
            >
              In Architectural Planning
            </span>
          </div>

          <p style={{ fontSize: '1.05rem', color: '#e2e8f0', lineHeight: 1.6, maxWidth: '850px' }}>
            &ldquo;One persistent digital city where future businesses, applications, infrastructure and intelligent
            systems come together.&rdquo;
          </p>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '850px' }}>
            In the upcoming 2D interactive world, visitors will control a character walking through city streets,
            entering distinct district buildings, discovering live applications, inspecting network lab infrastructure,
            and interacting with AI agent NPCs.
          </p>

          {/* Planned Districts Overview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Planned City Districts & Buildings
            </div>
            <div className="grid-5" style={{ gap: '0.75rem' }}>
              {cityDistricts.map((district) => {
                const Icon = district.icon;
                return (
                  <div
                    key={district.name}
                    style={{
                      padding: '1rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.45rem',
                    }}
                  >
                    <Icon size={20} color={district.color} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{district.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{district.tag}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Interactive character simulation & district entry under development.
            </span>

            <Link
              href="/world"
              className="btn-glow"
              style={{
                padding: '0.65rem 1.35rem',
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>EXPLORE THE WORLD</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. JOURNEY & NETWORK LABS (STRICTLY REAL DATA OR CLEAN EMPTY) */}
      {/* ============================================================ */}
      <div className="grid-2">
        {/* Network Labs Section */}
        <section
          className="glass-panel"
          style={{
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Network size={18} color="var(--accent-amber)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Network Labs</h2>
            </div>
            <Link
              href="/labs"
              style={{
                fontSize: '0.8rem',
                color: 'var(--accent-cyan)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span>View All Labs</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {networkLabs.length === 0 ? (
            <div
              style={{
                padding: '2rem 1.5rem',
                textAlign: 'center',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Server size={24} color="var(--text-muted)" />
              <p style={{ fontSize: '0.875rem', color: '#cbd5e1', fontWeight: 600 }}>
                Lab Infrastructure In Configuration
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '320px', lineHeight: 1.5 }}>
                Virtualization topologies, OPNsense firewalls, and enterprise routing environments are being staged.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {networkLabs.map((lab) => (
                <Link
                  key={lab.id}
                  href={`/labs`}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(241, 245, 249, 0.65)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                  className="interactive"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{lab.name}</span>
                    <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>{lab.status}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{lab.summary}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Journey Milestones Section */}
        <section
          className="glass-panel"
          style={{
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Milestone size={18} color="var(--accent-emerald)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Journey</h2>
            </div>
            <Link
              href="/journey"
              style={{
                fontSize: '0.8rem',
                color: 'var(--accent-cyan)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span>Explore Timeline</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {milestones.length === 0 ? (
            <div
              style={{
                padding: '2rem 1.5rem',
                textAlign: 'center',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Milestone size={24} color="var(--text-muted)" />
              <p style={{ fontSize: '0.875rem', color: '#cbd5e1', fontWeight: 600 }}>
                Chronicle Under Continuous Documentation
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '320px', lineHeight: 1.5 }}>
                Milestones are published as new architectural phases of RICH WORLD, EduFlex, and network systems deploy.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {milestones.map((m) => (
                <div
                  key={m.id}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(241, 245, 249, 0.65)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{m.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(m.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{m.narrative}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ============================================================ */}
      {/* 8. CONTACT / VISION */}
      {/* ============================================================ */}
      <section
        className="glass-panel"
        style={{
          padding: '3rem 2rem',
          borderRadius: 'var(--radius-xl)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.7) 0%, rgba(9, 13, 22, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--accent-cyan)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Vision & Alignment
        </span>

        <h2
          style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            maxWidth: '650px',
            lineHeight: 1.25,
          }}
        >
          BUILDING THE FUTURE,
          <br />
          <span style={{ color: 'var(--accent-cyan)' }}>ONE IDEA AT A TIME.</span>
        </h2>

        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            maxWidth: '520px',
            lineHeight: 1.6,
          }}
        >
          Open to graduate and junior opportunities in AI engineering, software development, and cloud/network infrastructure.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          <a
            href="mailto:richardvitug015@gmail.com"
            className="btn-glow"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Mail size={15} />
            <span>Get in Touch</span>
          </a>

          <Link
            href="/about"
            className="btn-outline-glow"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>Read Full Story</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
