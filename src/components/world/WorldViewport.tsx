'use client';

import React, { useRef, useEffect } from 'react';
import { useWorldEngine } from '@/lib/world/useWorldEngine';
import WorldHUD from './WorldHUD';
import './world.css';

export default function WorldViewport() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    nearbyBuilding,
    activeDistrictModal,
    setActiveDistrictModal,
    setVirtualInput,
    teleportToDistrict,
  } = useWorldEngine(canvasRef);

  // Automatically focus canvas on mount so keyboard controls work immediately
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
  }, []);

  return (
    <div className="rich-world-viewport">
      {/* 2.5D Isometric World Canvas Element */}
      <canvas
        ref={canvasRef}
        className="rich-world-canvas"
        tabIndex={0}
        aria-label="RICH CITY 2.5D Interactive World Viewport. Use WASD or Arrow keys to explore, mouse wheel to zoom."
        role="application"
      />

      {/* Heads-Up Display & UI Overlays */}
      <WorldHUD
        nearbyBuilding={nearbyBuilding}
        activeDistrictModal={activeDistrictModal}
        setActiveDistrictModal={setActiveDistrictModal}
        teleportToDistrict={teleportToDistrict}
        setVirtualInput={setVirtualInput}
      />
    </div>
  );
}
