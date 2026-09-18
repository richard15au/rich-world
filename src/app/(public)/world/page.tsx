import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Activity,
  Bot,
  Server,
  Briefcase,
  Layers,
  Sparkles,
  Users,
  Building2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '2D RICH WORLD | Coming Soon',
  description:
    'A living persistent 2D digital city where Richard Vitug’s ideas, applications, businesses, and AI agents coexist in an interactive virtual world.',
};

const CITY_DISTRICTS = [
  {
    id: 'richacademy',
    name: 'RichAcademy',
    category: 'Education District',
    icon: GraduationCap,
    color: '#6366f1',
    description:
      'The learning and curriculum center of RICH WORLD. Houses interactive course modules, study labs, student dashboards, and the EduFlex education architecture.',
    features: ['Classroom interiors', 'Interactive syllabus', 'EduFlex engine integration', 'Learning NPCs'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare District',
    category: 'Medical & Wellness',
    icon: Activity,
    color: '#10b981',
    description:
      'Dedicated to digital health systems, medical research data simulations, patient records architectural demos, and biomedical informatics integrations.',
    features: ['Clinical clinic exterior', 'Health metric displays', 'Emergency telemetry labs'],
  },
  {
    id: 'ai-studio',
    name: 'Technology / AI Studio',
    category: 'Intelligent Systems',
    icon: Bot,
    color: '#38bdf8',
    description:
      'The AI research and engineering workshop. Here, autonomous agents, LLM orchestration pipelines, and pairing assistants operate with real-time reasoning loops.',
    features: ['Agent workstation desks', 'Model inference terminals', 'NPC dialogue trees', 'Prompt labs'],
  },
  {
    id: 'network-labs',
    name: 'Network Labs',
    category: 'Infrastructure & Virtualization',
    icon: Server,
    color: '#f59e0b',
    description:
      'The server core and infrastructure nexus of the digital city. Visualizes hypervisor racks, OPNsense firewalls, VLAN bridges, and live network topology maps.',
    features: ['Server rack room', 'Virtual switchboards', 'Firewall security gateway', 'Telemetry monitors'],
  },
  {
    id: 'future-ventures',
    name: 'Future Ventures',
    category: 'Incubation & Business',
    icon: Briefcase,
    color: '#a855f7',
    description:
      'The commercial high-rises and enterprise incubator. Houses active companies like RichAcademy and future commercial software products as they graduate from prototype.',
    features: ['Corporate boardrooms', 'Project launchpads', 'Client demonstration suites'],
  },
];

const SIMULATION_PILLARS = [
  {
    icon: Users,
    title: 'One Player Character',
    desc: 'Walk through city avenues, enter district buildings, and interact with the environment in real time.',
  },
  {
    icon: Building2,
    title: 'Interiors & Districts',
    desc: 'Each building contains navigable floors, computer terminals, and contextual engineering dashboards.',
  },
  {
    icon: Layers,
    title: 'Real Software & Hardware',
    desc: 'Interact with real databases, deployable web applications, and network infrastructure behind the scenes.',
  },
  {
    icon: Bot,
    title: 'Intelligent AI NPCs',
    desc: 'Converse with AI-driven NPCs explaining projects, simulating technical interviews, and answering inquiries.',
  },
];

export default function WorldComingSoonPage() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background radial ambient lights */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(99, 102, 241, 0.05) 45%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '1000px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Navigation breadcrumb back */}
        <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft size={14} />
            <span>Return to Landing</span>
          </Link>
          <span style={{ color: 'var(--border-subtle)' }}>/</span>
          <Link
            href="/portfolio"
            style={{
              color: 'var(--accent-cyan)',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            View Professional Portfolio →
          </Link>
        </div>

        {/* Hero Banner */}
        <header
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            maxWidth: '750px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--accent-cyan)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-cyan)',
                boxShadow: '0 0 8px var(--accent-cyan)',
              }}
            />
            Architecture & Simulation Under Construction
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#ffffff',
            }}
          >
            THE 2D PERSISTENT <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 60%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              DIGITAL CITY
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '620px',
            }}
          >
            RICH WORLD is evolving into an interactive virtual world where ideas, applications, network infrastructure,
            and intelligent AI systems live together in a persistent virtual environment.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: '0.5rem',
            }}
          >
            <Link
              href="/portfolio"
              className="btn-glow"
              style={{
                padding: '0.85rem 1.85rem',
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>EXPLORE PORTFOLIO DASHBOARD</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/projects"
              className="btn-outline-glow"
              style={{
                padding: '0.85rem 1.5rem',
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>View Production Builds</span>
            </Link>
          </div>
        </header>

        {/* Conceptual World Simulation Grid */}
        <section
          className="glass-panel"
          style={{
            width: '100%',
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 15, 29, 0.95) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={20} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                How the 2D City Will Work
              </h2>
            </div>
            <span className="badge badge-cyan">Future Interactive Layer</span>
          </div>

          <div className="grid-2" style={{ gap: '1.25rem' }}>
            {SIMULATION_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      color: 'var(--accent-cyan)',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{pillar.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Planned Districts & Buildings */}
        <section
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              City Blueprint
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
              Planned Districts & Buildings
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '560px' }}>
              Every building in the city maps to a real vertical in Richard&apos;s engineering and venture ecosystem.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {CITY_DISTRICTS.map((district) => {
              const Icon = district.icon;
              return (
                <div
                  key={district.id}
                  className="glass-panel"
                  style={{
                    padding: '1.75rem',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    background: 'rgba(15, 23, 42, 0.6)',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div
                        style={{
                          padding: '0.65rem',
                          borderRadius: 'var(--radius-md)',
                          background: `${district.color}15`,
                          border: `1px solid ${district.color}35`,
                          color: district.color,
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>{district.name}</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{district.category}</span>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#94a3b8',
                      }}
                    >
                      District Concept
                    </span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {district.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {district.features.map((feature) => (
                      <span
                        key={feature}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          background: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        • {feature}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer Navigation CTA */}
        <section
          className="glass-panel"
          style={{
            width: '100%',
            padding: '2.5rem 2rem',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.7) 0%, rgba(10, 15, 29, 0.9) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
          }}
        >
          <Sparkles size={24} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Ready to explore the active architecture today?
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: 1.5 }}>
            While the persistent 2D simulation is being mapped, the complete technical portfolio, live applications,
            and codebase architectures are accessible now.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/portfolio" className="btn-glow" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}>
              <span>VIEW PORTFOLIO DASHBOARD</span>
              <ArrowRight size={15} />
            </Link>
            <Link href="/" className="btn-outline-glow" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}>
              <span>RETURN TO LANDING</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
