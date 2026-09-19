import React from 'react';
import type { Metadata } from 'next';
import {
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | Richard Vitug — RICH WORLD',
  description:
    'Get in touch with Richard Vitug: IT Student based in Sydney, Australia. Open for software projects, network engineering, tech discussions, and business inquiries.',
};

export default function ContactPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header Section */}
      <header style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
            }}
          >
            <Send size={20} />
          </div>
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#2563eb',
              }}
            >
              Communications & Inquiries
            </span>
            <h1
              style={{
                fontSize: '2.1rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              Get in Touch
            </h1>
          </div>
        </div>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            maxWidth: '780px',
          }}
        >
          Have a question, collaboration idea, or want to discuss modern web systems, networks, or business solutions?
          I am always open to meaningful connections and technical conversations.
        </p>
      </header>

      {/* Main Grid: Contact Channels (Left) & Inquiry Form (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
        }}
      >
        {/* Left Column: Direct Communication Channels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email Direct Card */}
          <div
            className="glass-panel"
            style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                }}
              >
                <Mail size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Direct Email
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Preferred channel for all inquiries
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Feel free to send an email directly to my inbox. I typically respond within 24–48 hours.
            </p>

            <a
              href="mailto:richardvitug015@gmail.com"
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                padding: '0.55rem 1rem',
                marginTop: '0.25rem',
                textDecoration: 'none',
              }}
            >
              <Mail size={14} />
              <span>richardvitug015@gmail.com</span>
            </a>
          </div>

          {/* Location & Availability Card */}
          <div
            className="glass-panel"
            style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                }}
              >
                <MapPin size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Location & Timezone
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Sydney, New South Wales, Australia
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Clock size={14} color="#2563eb" />
                <span>Australian Eastern Time (AEST / UTC+10)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={14} color="#10b981" />
                <span>Available for IT projects, practice labs & technical collaborations</span>
              </div>
            </div>
          </div>

          {/* Social Profiles Grid */}
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Connected Platforms
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  padding: '0.45rem',
                  textDecoration: 'none',
                }}
              >
                <span>GitHub</span>
                <ExternalLink size={11} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  padding: '0.45rem',
                  textDecoration: 'none',
                }}
              >
                <span>LinkedIn</span>
                <ExternalLink size={11} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  padding: '0.45rem',
                  textDecoration: 'none',
                }}
              >
                <span>Facebook</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Inquiry Form */}
        <div
          className="glass-panel"
          style={{
            padding: '2.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <Sparkles size={16} color="#2563eb" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Send a Message
              </h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Fill in your details below and your default email client will draft a direct message to me.
            </p>
          </div>

          <form
            action="mailto:richardvitug015@gmail.com"
            method="GET"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label
                  htmlFor="contact-name"
                  style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}
                >
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Alex Smith"
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '0.875rem',
                    color: '#0f172a',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label
                  htmlFor="contact-email"
                  style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}
                >
                  Your Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '0.875rem',
                    color: '#0f172a',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label
                htmlFor="contact-subject"
                style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}
              >
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                required
                placeholder="Collaboration / Inquiry about RICH WORLD"
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label
                htmlFor="contact-message"
                style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="body"
                rows={5}
                required
                placeholder="Write your message here..."
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                marginTop: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <Send size={15} />
              <span>Draft & Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
