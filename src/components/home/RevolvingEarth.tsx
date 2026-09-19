'use client';

import React, { useEffect, useRef } from 'react';

interface RevolvingEarthProps {
  size?: number;
  className?: string;
}

export default function RevolvingEarth({ size = 56, className = '' }: RevolvingEarthProps) {
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
        const globeR = size * 0.27; // Globe radius (~15.1px)
        const globeTilt = 0.22;     // Globe axial tilt ~12.5 deg

        // 3D Orbital Plane Geometry
        const orbitTiltZ = -0.22;   // Diagonal tilt of orbit plane (~-12.6 deg)
        const orbitTiltX = 0.38;    // Inclination tilt (~21.8 deg)
        const orbitR = size * 0.46; // Orbit major radius (~25.8px)
        const orbitRy = orbitR * Math.sin(orbitTiltX); // Orbit minor radius (~9.6px)

        // Orbital revolution angle (1 full revolution every ~3.6s)
        const orbitSpeed = 1.75;
        const orbitAngle = time * orbitSpeed;
        const globeAngle = time * 0.85;

        // Position in untilted orbit plane
        const cosA = Math.cos(orbitAngle);
        const sinA = Math.sin(orbitAngle);
        const x0 = orbitR * cosA;
        const y0 = orbitRy * sinA;

        // Apply orbitTiltZ rotation to get screen position
        const cosZ = Math.cos(orbitTiltZ);
        const sinZ = Math.sin(orbitTiltZ);
        const rwX = cx + (x0 * cosZ - y0 * sinZ);
        const rwY = cy + (x0 * sinZ + y0 * cosZ);

        // z > 0: In front of the globe; z < 0: Behind the globe
        const rwZ = sinA;
        const rwScale = 1.0 + rwZ * 0.32; // Perspective scaling (0.68x in back, 1.32x in front)
        const rwWidthScale = 0.72 + 0.28 * Math.abs(sinA); // Foreshortening width as it turns edges

        // Exact tangent vector along the tilted orbit to ALIGN the text while orbiting
        const dx0 = -orbitR * sinA;
        const dy0 = orbitRy * cosA;
        const tx = dx0 * cosZ - dy0 * sinZ;
        const ty = dx0 * sinZ + dy0 * cosZ;

        // Tangent slope angle normalized to [-PI/2, PI/2] so text never turns upside-down
        let alignAngle = Math.atan2(ty, tx);
        while (alignAngle > Math.PI / 2) alignAngle -= Math.PI;
        while (alignAngle < -Math.PI / 2) alignAngle += Math.PI;

        // Helper to draw 3D Extruded Block "RW" Text
        const draw3DRW = (isFront: boolean) => {
          ctx.font = '900 13px "Inter", "Segoe UI", system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.letterSpacing = '1.2px';

          if (isFront) {
            // 1. Ambient Drop Shadow cast onto the globe & space
            ctx.shadowColor = 'rgba(2, 6, 23, 0.85)';
            ctx.shadowBlur = 9;
            ctx.shadowOffsetX = 1.5;
            ctx.shadowOffsetY = 3.0;
            ctx.fillStyle = 'rgba(2, 6, 23, 0.55)';
            ctx.fillText('RW', 0, 0);

            // 2. Multi-layered 3D Extrusion Walls (real physical block thickness)
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            const depthLayers = 5;
            const stepX = 0.40;
            const stepY = 0.55;

            for (let i = depthLayers; i >= 1; i--) {
              const ox = i * stepX;
              const oy = i * stepY;
              const wallColor = i === depthLayers
                ? '#081530'
                : i > 2
                ? '#102a6b'
                : '#1d4ed8';
              ctx.fillStyle = wallColor;
              ctx.fillText('RW', ox, oy);
              ctx.strokeStyle = '#0a1a3e';
              ctx.lineWidth = 0.6;
              ctx.strokeText('RW', ox, oy);
            }

            // 3. Electric Cyan Outer Glow Bevel
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 12;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.8;
            ctx.strokeText('RW', 0, 0);

            // 4. Luminous Front Face (pure white)
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.fillText('RW', 0, 0);

            // 5. Metallic Inner Border
            ctx.strokeStyle = '#93c5fd';
            ctx.lineWidth = 0.8;
            ctx.strokeText('RW', 0, 0);

            // 6. Top Specular Glint Highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.fillText('RW', -0.2, -0.3);
          } else {
            // Back holographic 3D text (smoothly visible in distance through globe)
            for (let i = 3; i >= 1; i--) {
              ctx.fillStyle = 'rgba(15, 35, 80, 0.45)';
              ctx.fillText('RW', i * 0.25, i * 0.35);
            }

            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 8;
            ctx.fillStyle = 'rgba(147, 197, 253, 0.85)';
            ctx.fillText('RW', 0, 0);

            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
            ctx.lineWidth = 1.2;
            ctx.strokeText('RW', 0, 0);
          }
        };

        // -------------------------------------------------------------
        // 1. DRAW BACK ELEMENTS (Z < 0: Behind the Globe)
        // -------------------------------------------------------------

        // Back half of the glowing 3D orbit ring (sinA < 0)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(orbitTiltZ);
        ctx.beginPath();
        ctx.ellipse(0, 0, orbitR, orbitRy, 0, Math.PI, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.38)';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.restore();

        // If RW is currently behind the globe (rwZ < 0)
        if (rwZ < 0) {
          // Stardust particle trail behind moving RW
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
            ctx.fillStyle = `rgba(56, 189, 248, ${0.45 - i * 0.1})`;
            ctx.fill();
          }

          // Draw back 3D "RW" aligned with orbit
          ctx.save();
          ctx.translate(rwX, rwY);
          ctx.rotate(alignAngle);
          ctx.scale(rwScale * rwWidthScale, rwScale);
          draw3DRW(false);
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

        // Holographic 3D Sphere Base (transparency ~0.86 allows seeing the orbiting RW through globe)
        const sphereGrad = ctx.createRadialGradient(
          cx - globeR * 0.32,
          cy - globeR * 0.32,
          globeR * 0.05,
          cx,
          cy,
          globeR
        );
        sphereGrad.addColorStop(0, 'rgba(37, 99, 235, 0.90)');   // Luminous top-left sun highlight
        sphereGrad.addColorStop(0.35, 'rgba(29, 78, 216, 0.88)'); // Royal blue midtone
        sphereGrad.addColorStop(0.72, 'rgba(11, 25, 61, 0.86)');  // Deep navy brand core
        sphereGrad.addColorStop(1, 'rgba(3, 8, 22, 0.92)');       // Dark limb shadow

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
        glint.addColorStop(0, 'rgba(255, 255, 255, 0.48)');
        glint.addColorStop(0.5, 'rgba(147, 197, 253, 0.18)');
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

        // If RW is currently in front of the globe (rwZ >= 0)
        if (rwZ >= 0) {
          // Stardust particle trail behind front RW
          for (let i = 1; i <= 5; i++) {
            const trailA = orbitAngle - i * 0.08;
            const tCos = Math.cos(trailA);
            const tSin = Math.sin(trailA);
            const tx0 = orbitR * tCos;
            const ty0 = orbitRy * tSin;
            const tx = cx + (tx0 * cosZ - ty0 * sinZ);
            const ty = cy + (tx0 * sinZ + ty0 * cosZ);

            ctx.beginPath();
            ctx.arc(tx, ty, Math.max(0.8, 1.5 - i * 0.22), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(56, 189, 248, ${0.75 - i * 0.13})`;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 5;
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Draw front 3D "RW" block text aligned with orbit
          ctx.save();
          ctx.translate(rwX, rwY);
          ctx.rotate(alignAngle);
          ctx.scale(rwScale * rwWidthScale, rwScale);
          draw3DRW(true);
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
      aria-label="3D Revolving Globe with Orbiting RW"
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
