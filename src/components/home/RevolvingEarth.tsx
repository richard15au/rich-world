'use client';

import React, { useEffect, useRef } from 'react';

interface RevolvingEarthProps {
  size?: number;
  className?: string;
}

export default function RevolvingEarth({ size = 52, className = '' }: RevolvingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let disposed = false;
    let visible = document.visibilityState === 'visible';

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    // Landmass / continent node points on sphere surface [lat (deg), lon (deg), radius]
    const landmassNodes: [number, number, number][] = [
      // North America
      [42, -95, 2.2], [32, -85, 1.8], [55, -110, 2.0],
      // South America
      [-15, -55, 2.0], [-28, -60, 1.7],
      // Europe
      [50, 15, 2.0], [45, 5, 1.6],
      // Africa
      [8, 22, 2.4], [-18, 26, 2.0], [24, 18, 1.8],
      // Asia
      [38, 85, 2.6], [52, 95, 2.2], [22, 105, 2.0],
      // Australia
      [-25, 135, 2.0], [-32, 145, 1.7]
    ];

    const startTime = performance.now();

    const render = (now: number) => {
      if (disposed) return;

      if (visible) {
        const time = (now - startTime) / 1000;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(dpr, dpr);

        const cx = size / 2;
        const cy = size / 2;
        const globeR = size * 0.28; // Globe radius (~14.6px)
        const globeTilt = 0.22;     // Globe axial tilt ~12.5 deg

        // 3D Orbital Plane Geometry
        const orbitTiltZ = -0.22;   // Diagonal tilt of orbit plane (~-12.6 deg)
        const orbitTiltX = 0.38;    // Inclination tilt (~21.8 deg)
        const orbitR = size * 0.46; // Orbit major radius (~24px)
        const orbitRy = orbitR * Math.sin(orbitTiltX); // Orbit minor radius (~9px)

        // Orbital revolution angle (1 full revolution every ~3.6s)
        const orbitSpeed = 1.75;
        const orbitAngle = time * orbitSpeed;
        const globeAngle = time * 0.85;

        // Position of the orbiting satellite beacon along the 3D ring
        const cosA = Math.cos(orbitAngle);
        const sinA = Math.sin(orbitAngle);
        const cosZ = Math.cos(orbitTiltZ);
        const sinZ = Math.sin(orbitTiltZ);

        const x0 = orbitR * cosA;
        const y0 = orbitRy * sinA;
        const beaconX = cx + (x0 * cosZ - y0 * sinZ);
        const beaconY = cy + (x0 * sinZ + y0 * cosZ);
        // z > 0: In front of the globe; z < 0: Behind the globe
        const beaconZ = sinA;

        // -------------------------------------------------------------
        // 1. DRAW BACK ELEMENTS (Z < 0: Behind the Globe)
        // -------------------------------------------------------------

        // Back half of the glowing 3D orbit ring (sinA < 0)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(orbitTiltZ);
        ctx.beginPath();
        ctx.ellipse(0, 0, orbitR, orbitRy, 0, Math.PI, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1.3;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.restore();

        // If satellite beacon is currently behind the globe (beaconZ < 0)
        if (beaconZ < 0) {
          // Stardust particle trail behind moving satellite
          for (let i = 1; i <= 4; i++) {
            const trailA = orbitAngle - i * 0.09;
            const tCos = Math.cos(trailA);
            const tSin = Math.sin(trailA);
            const tx0 = orbitR * tCos;
            const ty0 = orbitRy * tSin;
            const tx = cx + (tx0 * cosZ - ty0 * sinZ);
            const ty = cy + (tx0 * sinZ + ty0 * cosZ);

            ctx.beginPath();
            ctx.arc(tx, ty, Math.max(0.6, 1.2 - i * 0.2), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(56, 189, 248, ${0.40 - i * 0.08})`;
            ctx.fill();
          }

          // Back satellite beacon
          ctx.save();
          ctx.beginPath();
          ctx.arc(beaconX, beaconY, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(147, 197, 253, 0.75)';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.restore();
        }

        // -------------------------------------------------------------
        // 2. DRAW 3D GLOBE SPHERE (At Z = 0)
        // -------------------------------------------------------------
        ctx.save();

        // Atmospheric corona glow around globe
        const coronaGrad = ctx.createRadialGradient(cx, cy, globeR * 0.85, cx, cy, globeR * 1.38);
        coronaGrad.addColorStop(0, 'rgba(56, 189, 248, 0.38)');
        coronaGrad.addColorStop(0.55, 'rgba(37, 99, 235, 0.18)');
        coronaGrad.addColorStop(1, 'rgba(11, 25, 61, 0)');
        ctx.fillStyle = coronaGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, globeR * 1.38, 0, Math.PI * 2);
        ctx.fill();

        // 3D Sphere Base with Rich Directional Shading
        const sphereGrad = ctx.createRadialGradient(
          cx - globeR * 0.32,
          cy - globeR * 0.32,
          globeR * 0.05,
          cx,
          cy,
          globeR
        );
        sphereGrad.addColorStop(0, '#2563eb');    // Luminous top-left sunlit sapphire
        sphereGrad.addColorStop(0.35, '#1d4ed8'); // Royal blue midtone
        sphereGrad.addColorStop(0.72, '#0b193d'); // Deep navy brand core
        sphereGrad.addColorStop(1, '#030816');    // Dark limb shadow

        ctx.fillStyle = sphereGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, globeR, 0, Math.PI * 2);
        ctx.fill();

        // Clip subsequent sphere features to globe circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, globeR, 0, Math.PI * 2);
        ctx.clip();

        // 3D Rotating Longitude Meridians
        for (let i = 0; i < 4; i++) {
          const meridianAngle = globeAngle + (i * Math.PI) / 4;
          const cosM = Math.cos(meridianAngle);

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(globeTilt);

          ctx.beginPath();
          ctx.ellipse(0, 0, Math.abs(cosM) * globeR, globeR, 0, 0, Math.PI * 2);

          if (cosM > 0) {
            // Front meridian: glowing cyan
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.30 + cosM * 0.32})`;
            ctx.lineWidth = 1.1;
          } else {
            // Back meridian: subtle translucent deep blue
            ctx.strokeStyle = 'rgba(30, 58, 138, 0.25)';
            ctx.lineWidth = 0.8;
          }
          ctx.stroke();
          ctx.restore();
        }

        // 3D Latitude Parallels
        const lats = [0, 0.42, -0.42]; // Equator, 24°N, 24°S
        for (const latFrac of lats) {
          const latY = latFrac * globeR;
          const latR = Math.sqrt(Math.max(0, globeR * globeR - latY * latY));

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(globeTilt);
          ctx.beginPath();
          ctx.ellipse(0, latY, latR, latR * 0.32, 0, 0, Math.PI * 2);
          ctx.strokeStyle = latFrac === 0 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(30, 58, 138, 0.30)';
          ctx.lineWidth = latFrac === 0 ? 1.2 : 0.8;
          ctx.stroke();
          ctx.restore();
        }

        // Rotating Continents / Landmass Nodes
        for (const [latDeg, lonDeg, nodeSize] of landmassNodes) {
          const latRad = (latDeg * Math.PI) / 180;
          const lonRad = (lonDeg * Math.PI) / 180 + globeAngle;

          // 3D Spherical Coordinates
          const pX0 = globeR * Math.cos(latRad) * Math.sin(lonRad);
          const pY0 = -globeR * Math.sin(latRad);
          const pZ0 = globeR * Math.cos(latRad) * Math.cos(lonRad);

          // Axial tilt
          const cosT = Math.cos(globeTilt);
          const sinT = Math.sin(globeTilt);
          const pX1 = pX0 * cosT - pY0 * sinT;
          const pY1 = pX0 * sinT + pY0 * cosT;
          const pZ1 = pZ0;

          // Render nodes on the front-facing hemisphere
          if (pZ1 > 0) {
            const nodeAlpha = Math.min(1.0, pZ1 / (globeR * 0.85));
            ctx.beginPath();
            ctx.arc(cx + pX1, cy + pY1, nodeSize * (0.8 + 0.4 * (pZ1 / globeR)), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(56, 189, 248, ${nodeAlpha * 0.85})`;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 4;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }

        // Top-left Specular Glint (Sun reflection)
        const glint = ctx.createRadialGradient(
          cx - globeR * 0.42,
          cy - globeR * 0.42,
          1,
          cx - globeR * 0.42,
          cy - globeR * 0.42,
          globeR * 0.55
        );
        glint.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
        glint.addColorStop(0.5, 'rgba(147, 197, 253, 0.20)');
        glint.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glint;
        ctx.beginPath();
        ctx.arc(cx, cy, globeR, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore(); // Restore clip

        // Atmospheric Rayleigh Fresnel Rim
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.80)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(cx, cy, globeR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

        // -------------------------------------------------------------
        // 3. DRAW FRONT ELEMENTS (Z > 0: In Front of the Globe)
        // -------------------------------------------------------------

        // Front half of the glowing 3D orbit ring (sinA >= 0)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(orbitTiltZ);
        ctx.beginPath();
        ctx.ellipse(0, 0, orbitR, orbitRy, 0, 0, Math.PI);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();

        // If satellite beacon is currently in front of the globe (beaconZ >= 0)
        if (beaconZ >= 0) {
          // Stardust particle trail behind front satellite
          for (let i = 1; i <= 5; i++) {
            const trailA = orbitAngle - i * 0.08;
            const tCos = Math.cos(trailA);
            const tSin = Math.sin(trailA);
            const tx0 = orbitR * tCos;
            const ty0 = orbitRy * tSin;
            const tx = cx + (tx0 * cosZ - ty0 * sinZ);
            const ty = cy + (tx0 * sinZ + ty0 * cosZ);

            ctx.beginPath();
            ctx.arc(tx, ty, Math.max(0.8, 1.6 - i * 0.25), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(56, 189, 248, ${0.75 - i * 0.13})`;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 5;
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Front glowing satellite beacon with flare
          ctx.save();
          // Outer flare glow
          const flare = ctx.createRadialGradient(beaconX, beaconY, 0.5, beaconX, beaconY, 6.0);
          flare.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          flare.addColorStop(0.3, 'rgba(56, 189, 248, 0.85)');
          flare.addColorStop(1, 'rgba(37, 99, 235, 0)');
          ctx.fillStyle = flare;
          ctx.beginPath();
          ctx.arc(beaconX, beaconY, 6.0, 0, Math.PI * 2);
          ctx.fill();

          // Bright white core
          ctx.beginPath();
          ctx.arc(beaconX, beaconY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const onVisibility = () => {
      visible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [size]);

  return (
    <div
      className={`rich-revolving-earth-wrapper ${className}`}
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      aria-label="3D Revolving Globe"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: size,
          height: size,
          display: 'block',
          borderRadius: '50%',
          filter: 'drop-shadow(0 3px 14px rgba(37, 99, 235, 0.40))',
        }}
      />
    </div>
  );
}
