'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  GraduationCap,
  Activity,
  Bot,
  Building2,
  Landmark,
  ShoppingBag,
  Hotel,
  Utensils,
  Truck,
  HardHat,
  TrainTrack,
  X,
  Compass,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Building, DistrictId, InputState } from '@/lib/world/types';
import { BUILDINGS } from '@/lib/world/constants';

interface WorldHUDProps {
  nearbyBuilding: Building | null;
  activeDistrictModal: Building | null;
  setActiveDistrictModal: (b: Building | null) => void;
  teleportToDistrict: (id: DistrictId) => void;
  setVirtualInput: (key: keyof InputState, value: boolean) => void;
}

export default function WorldHUD({
  nearbyBuilding,
  activeDistrictModal,
  setActiveDistrictModal,
  teleportToDistrict,
  setVirtualInput,
}: WorldHUDProps) {
  const getDistrictIcon = (id: DistrictId) => {
    switch (id) {
      case 'rich-hq':
        return Building2;
      case 'richacademy':
        return GraduationCap;
      case 'tech-ai':
        return Bot;
      case 'richhealth':
        return Activity;
      case 'richfinance':
        return Landmark;
      case 'richmart':
        return ShoppingBag;
      case 'richstay':
        return Hotel;
      case 'richfoods':
        return Utensils;
      case 'richlogistics':
        return Truck;
      case 'richbuild':
        return HardHat;
      case 'transit':
        return TrainTrack;
      default:
        return Building2;
    }
  };

  return (
    <>
      <div className="rich-world-hud">
        {/* TOP BAR */}
        <header className="rich-world-hud-top">
          {/* Requirement 6: Clearly visible "← Back to RICH WORLD" control that returns to / */}
          <Link href="/" className="rich-world-back-btn" title="Exit 2D World and Return to Homepage">
            <ArrowLeft size={16} />
            <span>← Back to RICH WORLD</span>
          </Link>

          {/* District Quick-Locators */}
          <div className="rich-world-districts-bar" aria-label="District Navigation Quick-Links">
            {BUILDINGS.map((b) => {
              const Icon = getDistrictIcon(b.id);
              return (
                <button
                  key={b.id}
                  type="button"
                  className="rich-district-pill-btn"
                  onClick={() => teleportToDistrict(b.id)}
                  title={`Fast-travel to ${b.name}`}
                >
                  <Icon size={12} style={{ color: b.themeColor }} />
                  <span>{b.name}</span>
                </button>
              );
            })}
          </div>

          {/* World Status Badge */}
          <div className="rich-world-title-badge">
            <span className="rich-world-status-beacon" />
            <span className="rich-world-title-text">RICH CITY</span>
            <span className="rich-world-title-sub">2.5D Interactive World</span>
          </div>
        </header>

        {/* BOTTOM BAR */}
        <footer className="rich-world-hud-bottom">
          {/* Controls Guide Card */}
          <div className="rich-world-controls-card">
            <div className="rich-world-controls-header">
              <Compass size={13} color="#0284c7" />
              <span>Navigation & Controls</span>
            </div>
            <div className="rich-world-controls-keys">
              <span>Move:</span>
              <span className="rich-key-badge">W</span>
              <span className="rich-key-badge">A</span>
              <span className="rich-key-badge">S</span>
              <span className="rich-key-badge">D</span>
              <span style={{ color: '#94a3b8' }}>or</span>
              <span className="rich-key-badge">Arrows</span>
            </div>
            <div className="rich-world-controls-keys" style={{ fontSize: '0.72rem' }}>
              <span>Run:</span>
              <span className="rich-key-badge">Shift</span>
              <span style={{ marginLeft: '0.5rem' }}>Jump:</span>
              <span className="rich-key-badge">Space</span>
              <span style={{ marginLeft: '0.5rem' }}>Zoom:</span>
              <span className="rich-key-badge">Scroll</span>
            </div>
          </div>

          {/* Proximity Interaction Banner (Appears when near a district) */}
          {nearbyBuilding && (
            <div className="rich-world-proximity-card" role="region" aria-label="District Proximity Notice">
              <div className="rich-proximity-info">
                <span className="rich-proximity-cat" style={{ color: nearbyBuilding.themeColor }}>
                  {nearbyBuilding.category}
                </span>
                <span className="rich-proximity-title">{nearbyBuilding.name}</span>
              </div>
              <button
                type="button"
                className="rich-proximity-btn"
                onClick={() => setActiveDistrictModal(nearbyBuilding)}
                title="Inspect district details"
              >
                <span>Inspect District</span>
                <span className="rich-key-badge" style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', borderColor: 'transparent' }}>
                  E
                </span>
              </button>
            </div>
          )}

          {/* Empty spacer for flex alignment when proximity card is not visible */}
          {!nearbyBuilding && <div style={{ flex: 1 }} />}

          {/* District Counter Badge */}
          <div
            style={{
              pointerEvents: 'auto',
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              padding: '0.45rem 0.85rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              fontSize: '0.74rem',
              color: '#475569',
              fontWeight: 600,
            }}
          >
            <span>{BUILDINGS.length} City Locations</span>
          </div>
        </footer>

        {/* MOBILE VIRTUAL CONTROLS */}
        <div className="rich-world-touch-dpad" aria-label="Touch Directional Pad">
          <button
            type="button"
            className="rich-dpad-btn rich-dpad-up"
            onPointerDown={() => setVirtualInput('up', true)}
            onPointerUp={() => setVirtualInput('up', false)}
            aria-label="Move Up"
          >
            <ArrowUp size={18} />
          </button>
          <button
            type="button"
            className="rich-dpad-btn rich-dpad-down"
            onPointerDown={() => setVirtualInput('down', true)}
            onPointerUp={() => setVirtualInput('down', false)}
            aria-label="Move Down"
          >
            <ArrowDown size={18} />
          </button>
          <button
            type="button"
            className="rich-dpad-btn rich-dpad-left"
            onPointerDown={() => setVirtualInput('left', true)}
            onPointerUp={() => setVirtualInput('left', false)}
            aria-label="Move Left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="rich-dpad-btn rich-dpad-right"
            onPointerDown={() => setVirtualInput('right', true)}
            onPointerUp={() => setVirtualInput('right', false)}
            aria-label="Move Right"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="rich-world-touch-actions" aria-label="Touch Action Buttons">
          <button
            type="button"
            className="rich-action-btn"
            onPointerDown={() => setVirtualInput('jump', true)}
            onPointerUp={() => setVirtualInput('jump', false)}
            title="Jump"
          >
            JUMP
          </button>
          <button
            type="button"
            className="rich-action-btn"
            onPointerDown={() => setVirtualInput('shift', true)}
            onPointerUp={() => setVirtualInput('shift', false)}
            title="Sprint"
            style={{ color: '#2563eb' }}
          >
            <Zap size={18} />
          </button>
        </div>
      </div>

      {/* DISTRICT DETAILS MODAL */}
      {activeDistrictModal && (
        <div
          className="rich-world-modal-backdrop"
          onClick={() => setActiveDistrictModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="rich-world-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="rich-world-modal-header">
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: activeDistrictModal.themeColor,
                    fontFamily: 'monospace',
                  }}
                >
                  {activeDistrictModal.category}
                </span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 850, color: '#0f172a', marginTop: '0.2rem' }}>
                  {activeDistrictModal.name}
                </h2>
                <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '0.15rem' }}>
                  {activeDistrictModal.tagline}
                </p>
              </div>
              <button
                type="button"
                className="rich-world-modal-close"
                onClick={() => setActiveDistrictModal(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#334155' }}>
              {activeDistrictModal.description}
            </p>

            <div>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                Key District Facilities
              </h3>
              <div className="rich-modal-feature-list">
                {activeDistrictModal.features.map((feature, idx) => (
                  <div key={idx} className="rich-modal-feature-item">
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: activeDistrictModal.themeColor,
                        flexShrink: 0,
                      }}
                    />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setActiveDistrictModal(null)}
                style={{
                  background: activeDistrictModal.themeColor,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.5rem 1.35rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
