import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Compass,
  Code2,
  Briefcase,
  Gamepad2,
  Server,
  Bot,
  Layers,
  ArrowRight,
  Sparkles,
  MapPin,
  Mail,
  GraduationCap,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | Richard Vitug — RICH WORLD',
  description:
    'Learn about Richard Vitug, IT Student based in Sydney, Australia, and the architectural vision behind RICH WORLD.',
};

const PILLARS = [
  {
    icon: Code2,
    title: 'Software Development',
    color: '#0284c7',
    badge: 'Modern Web & Systems',
    desc: 'Building scalable, modular web applications with Next.js, React, TypeScript, and Prisma ORM backed by PostgreSQL.',
  },
  {
    icon: Bot,
    title: 'AI & Intelligent Systems',
    color: '#7c3aed',
    badge: 'Autonomous Agents',
    desc: 'Designing agentic orchestration workflows, LLM tool-calling loops, and intelligent assistants that automate complex processes.',
  },
  {
    icon: Server,
    title: 'Networks & Infrastructure',
    color: '#d97706',
    badge: 'Virtualization & Labs',
    desc: 'Hands-on network design utilizing OPNsense firewalls, VLAN bridges, Debian/Ubuntu system administration, and secure topologies.',
  },
  {
    icon: Briefcase,
    title: 'Business Solutions',
    color: '#059669',
    badge: 'Real-World Impact',
    desc: 'Translating software capability into practical commercial solutions for education, healthcare, and digital enterprises.',
  },
];

export default function AboutPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header Section */}
      <header style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: '10px',
              background: 'rgba(2, 132, 199, 0.1)',
              border: '1px solid rgba(2, 132, 199, 0.25)',
              display: 'inline-flex',
              color: 'var(--accent-cyan)',
            }}
          >
            <User size={22} />
          </div>
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 750,
                letterSpacing: '0.12em',
                color: 'var(--accent-cyan)',
                textTransform: 'uppercase',
              }}
            >
              Identity & Vision
            </span>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              About Richard Vitug
            </h1>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '780px' }}>
          IT Student based in Sydney, Australia — turning ideas into reality through software,
          networks, and intelligent systems.
        </p>
      </header>

      {/* Main Profile & Story Card */}
      <section
        className="glass-panel"
        style={{
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '82px',
                height: '98px',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <Image
                src="/images/profile-transparent.png"
                alt="Richard Vitug"
                fill
                sizes="82px"
                style={{ objectFit: 'contain', objectPosition: 'center bottom' }}
                priority
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Richard Vitug
                </h2>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="rich-verified-badge"
                  aria-label="Verified Builder"
                >
                  <title>Verified Builder</title>
                  <path
                    d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6 0.457-1.52.197-3.19-.8-4.19s-2.67-1.26-4.19-.8C14.7 2.64 13.33 1.77 11.75 1.77s-2.95 0.87-3.61 2.14c-1.52-0.46-3.19-0.2-4.19 0.8s-1.26 2.67-0.8 4.19C1.88 9.55 1 10.92 1 12.5s0.88 2.95 2.15 3.6c-0.46 1.52-0.2 3.19 0.8 4.19s2.67 1.26 4.19 0.8c0.66 1.27 2.03 2.14 3.61 2.14s2.95-0.87 3.61-2.14c1.52 0.46 3.19 0.2 4.19-0.8s1.26-2.67 0.8-4.19c1.27-0.65 2.15-2.02 2.15-3.6z"
                    fill="#2563eb"
                  />
                  <path
                    d="M7.75 12.5l3 3 6.5-6.5"
                    stroke="#ffffff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
                IT Student
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={13} color="var(--accent-cyan)" />
                  Sydney, Australia
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <GraduationCap size={13} color="var(--accent-indigo)" />
                  Information Technology
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href="mailto:richardvitug015@gmail.com"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <Mail size={14} color="var(--accent-cyan)" />
              <span>Contact Me</span>
            </a>
            <Link
              href="/projects"
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <span>Explore Projects</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            color: 'var(--text-secondary)',
            fontSize: '0.975rem',
            lineHeight: 1.7,
            maxWidth: '960px',
          }}
        >
          <p>
            Welcome to <strong>RICH WORLD</strong>. This space is not just a standard resume or project catalogue — it
            is my personal digital world where every concept, application, network lab, and business solution connects
            into an interconnected reality.
          </p>
          <p>
            As an IT student with an ambition to engineer intelligent systems and autonomous software agents, I believe
            in understanding technology end-to-end: from network packets, routers, firewalls, and operating system
            fundamentals, to production web frontends, databases, and generative AI orchestration.
          </p>
          <p>
            My philosophy is grounded in one statement: <em>&ldquo;Turning ideas into reality.&rdquo;</em> Whether
            designing an educational platform architecture like <strong>EduFlex</strong>, configuring OPNsense virtual
            laboratories, or architecting future interactive simulations in <strong>2D Rich World</strong>, every build
            is a step forward.
          </p>
        </div>
      </section>

      {/* Core Technical Pillars Grid */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--accent-cyan)',
              textTransform: 'uppercase',
            }}
          >
            Engineering Foundation
          </span>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Core Focus Areas
          </h2>
        </div>

        <div className="grid-2">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.title}
                className="glass-panel interactive"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      padding: '0.55rem',
                      borderRadius: '8px',
                      background: 'rgba(2, 132, 199, 0.08)',
                      border: '1px solid rgba(2, 132, 199, 0.18)',
                      display: 'inline-flex',
                      color: pillar.color,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="badge badge-slate" style={{ fontSize: '0.725rem' }}>
                    {pillar.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {pillar.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {pillar.desc}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Ecosystem Quick Navigation Links */}
      <section
        className="glass-panel"
        style={{
          padding: '2rem 2.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Explore The Rich World Ecosystem
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Dive deeper into technical builds, business solutions, and the upcoming interactive 2D simulation.
            </p>
          </div>
        </div>

        <div className="grid-3" style={{ gap: '1rem' }}>
          <Link
            href="/projects"
            className="glass-panel interactive"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
              textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-indigo)' }}>
              <Code2 size={18} />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Projects & Practices</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Architectural initiatives, software builds, and hands-on lab experiments.
            </p>
          </Link>

          <Link
            href="/businesses"
            className="glass-panel interactive"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
              textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-emerald)' }}>
              <Briefcase size={18} />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Business Solutions</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Technology applied to practical commercial domains and real problems.
            </p>
          </Link>

          <Link
            href="/world"
            className="glass-panel interactive"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
              textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-cyan)' }}>
              <Compass size={18} />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>2D Rich City</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Preview the planned interactive virtual city and living NPC simulation.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
