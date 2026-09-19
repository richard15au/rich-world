'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  tag?: string;
  phase: number;
}

interface Pulse {
  p1: number;
  p2: number;
  progress: number;
  speed: number;
}

export default function AmbientTechBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let disposed = false;
    let visible = document.visibilityState === 'visible';

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Subtle project-related tech tokens
    const tags = ['AI', '</>', 'IDEA', 'REALITY', '✦', 'DATA', 'RW', 'λ'];
    const colors = [
      'rgba(56, 189, 248, 0.55)', // Cyan
      'rgba(37, 99, 235, 0.45)',  // Royal Blue
      'rgba(99, 102, 241, 0.40)', // Indigo
      'rgba(14, 165, 233, 0.50)', // Sky Blue
    ];

    // Minimal count of particles (clean & non-intrusive)
    const particleCount = Math.min(36, Math.floor((width * height) / 38000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        radius: Math.random() * 1.6 + 1.2,
        color: colors[i % colors.length],
        tag: i < tags.length ? tags[i] : undefined,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Occasional data packet pulses traveling along connections
    const pulses: Pulse[] = [];
    const maxPulses = 5;

    // Track mouse for gentle ambient repulsion
    let mouseX = -1000;
    let mouseY = -1000;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const connectionDist = 130;
    let lastTime = performance.now();

    const render = (now: number) => {
      if (disposed) return;

      if (visible) {
        const dt = Math.min(0.1, (now - lastTime) / 1000);
        lastTime = now;

        ctx.clearRect(0, 0, width, height);

        // 1. Update and draw connection lines
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDist) {
              const alpha = (1 - dist / connectionDist) * 0.16;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 0.9;
              ctx.stroke();

              // Randomly spawn a subtle traveling pulse
              if (pulses.length < maxPulses && Math.random() < 0.0015) {
                pulses.push({
                  p1: i,
                  p2: j,
                  progress: 0,
                  speed: 0.65 + Math.random() * 0.5,
                });
              }
            }
          }
        }

        // 2. Render and update traveling data pulses
        for (let k = pulses.length - 1; k >= 0; k--) {
          const pulse = pulses[k];
          pulse.progress += pulse.speed * dt;

          if (pulse.progress >= 1) {
            pulses.splice(k, 1);
            continue;
          }

          const p1 = particles[pulse.p1];
          const p2 = particles[pulse.p2];
          if (!p1 || !p2) {
            pulses.splice(k, 1);
            continue;
          }

          const px = p1.x + (p2.x - p1.x) * pulse.progress;
          const py = p1.y + (p2.y - p1.y) * pulse.progress;

          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // 3. Update and draw nodes
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Gentle ambient float
          p.x += p.vx;
          p.y += p.vy;

          // Gentle mouse avoidance
          const mdx = p.x - mouseX;
          const mdy = p.y - mouseY;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 100 && mdist > 0) {
            const force = (1 - mdist / 100) * 0.45;
            p.x += (mdx / mdist) * force;
            p.y += (mdy / mdist) * force;
          }

          // Screen bounds wrap
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;

          // Pulse breathing
          p.phase += dt * 1.5;
          const currentRadius = p.radius + Math.sin(p.phase) * 0.4;

          // Node core
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Subtle glowing halo
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
          ctx.fill();

          // If node has an idea tag, render subtle floating label
          if (p.tag) {
            ctx.font = '650 9px "Inter", system-ui, sans-serif';
            ctx.fillStyle = 'rgba(71, 85, 105, 0.38)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.tag, p.x, p.y - 8);
          }
        }
      } else {
        lastTime = now;
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
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="rich-ambient-tech-bg"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.85,
      }}
      aria-hidden="true"
    />
  );
}
