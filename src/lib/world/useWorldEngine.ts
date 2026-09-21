'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  PlayerCharacter,
  InputState,
  Building,
  DistrictId,
  Camera,
  AmbientParticle,
} from './types';
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  INITIAL_PLAYER,
  BUILDINGS,
  ROADS,
  ENVIRONMENT_OBJECTS,
} from './constants';
import { renderWorld } from './worldRenderer';

export function useWorldEngine(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  // Reactive UI state
  const [playerState, setPlayerState] = useState<PlayerCharacter>(INITIAL_PLAYER);
  const [nearbyBuilding, setNearbyBuilding] = useState<Building | null>(null);
  const [activeDistrictModal, setActiveDistrictModal] = useState<Building | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Engine refs for 60fps loop
  const playerRef = useRef<PlayerCharacter>({ ...INITIAL_PLAYER });
  const cameraRef = useRef<Camera>({
    x: INITIAL_PLAYER.position.x,
    y: INITIAL_PLAYER.position.y,
    zoom: 0.85,
    target: { x: INITIAL_PLAYER.position.x, y: INITIAL_PLAYER.position.y },
    viewportWidth: 1920,
    viewportHeight: 1080,
  });

  const inputRef = useRef<InputState>({
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false,
    jump: false,
    interact: false,
  });

  const lastTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Listen for prefers-reduced-motion changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input / textarea is focused
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const input = inputRef.current;
      let handled = false;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          input.up = true;
          handled = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          input.down = true;
          handled = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          input.left = true;
          handled = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          input.right = true;
          handled = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          input.shift = true;
          handled = true;
          break;
        case 'Space':
          input.jump = true;
          if (playerRef.current.state !== 'jumping') {
            playerRef.current.state = 'jumping';
            playerRef.current.jumpProgress = 0;
          }
          handled = true;
          break;
        case 'KeyE':
        case 'Enter':
          input.interact = true;
          if (nearbyBuilding) {
            setActiveDistrictModal(nearbyBuilding);
          }
          handled = true;
          break;
      }

      if (handled && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const input = inputRef.current;
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          input.up = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          input.down = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          input.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          input.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          input.shift = false;
          break;
        case 'Space':
          input.jump = false;
          break;
        case 'KeyE':
        case 'Enter':
          input.interact = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyBuilding]);

  // Programmatic direction controls for Touch / HUD buttons
  const setVirtualInput = useCallback((key: keyof InputState, value: boolean) => {
    inputRef.current[key] = value;
    if (key === 'jump' && value && playerRef.current.state !== 'jumping') {
      playerRef.current.state = 'jumping';
      playerRef.current.jumpProgress = 0;
    }
    if (key === 'interact' && value && nearbyBuilding) {
      setActiveDistrictModal(nearbyBuilding);
    }
  }, [nearbyBuilding]);

  // Teleport helper for District Navigation
  const teleportToDistrict = useCallback((districtId: DistrictId) => {
    const b = BUILDINGS.find((item) => item.id === districtId);
    if (!b) return;

    playerRef.current.position = { x: b.door.x, y: b.door.y + 35 };
    playerRef.current.facing = 'up';
    playerRef.current.velocity = { x: 0, y: 0 };
    cameraRef.current.x = b.door.x;
    cameraRef.current.y = b.door.y + 35;
    setPlayerState({ ...playerRef.current });
    setNearbyBuilding(b);
  }, []);

  // Main 2.5D Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Zoom state (0.85 gives an expansive view of the miniature city; scroll to zoom in/out)
    const zoomState = { current: 0.85 };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.001;
      zoomState.current = Math.max(0.45, Math.min(1.8, zoomState.current - delta));
    };

    let touchStartDist = 0;
    let initialZoom = 0.85;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialZoom = zoomState.current;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStartDist > 0) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = dist / touchStartDist;
        zoomState.current = Math.max(0.45, Math.min(1.8, initialZoom * factor));
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Ambient floating particles
    const particles: AmbientParticle[] = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT,
        size: Math.random() * 2.5 + 1.2,
        speedY: (Math.random() - 0.5) * 12,
        opacity: Math.random() * 0.4 + 0.2,
        color: Math.random() > 0.5 ? '#38bdf8' : '#fef08a',
        phase: Math.random() * Math.PI * 2,
      });
    }

    let lastNearbyCheck = 0;

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      const player = playerRef.current;
      const camera = cameraRef.current;
      const input = inputRef.current;

      // 1. Calculate direction vector
      let moveX = 0;
      let moveY = 0;

      if (input.up) moveY -= 1;
      if (input.down) moveY += 1;
      if (input.left) moveX -= 1;
      if (input.right) moveX += 1;

      // Normalize diagonal
      if (moveX !== 0 && moveY !== 0) {
        const len = Math.sqrt(moveX * moveX + moveY * moveY);
        moveX /= len;
        moveY /= len;
      }

      const isMoving = moveX !== 0 || moveY !== 0;
      player.isMoving = isMoving;

      // Update facing direction
      if (moveY < 0) player.facing = 'up';
      else if (moveY > 0) player.facing = 'down';
      else if (moveX < 0) player.facing = 'left';
      else if (moveX > 0) player.facing = 'right';

      // Speed & State
      const speedMultiplier = input.shift ? 1.6 : 1.0;
      const currentSpeed = player.speed * speedMultiplier;

      // Jump progression
      if (player.state === 'jumping') {
        player.jumpProgress += dt * 2.2;
        if (player.jumpProgress >= 1) {
          player.jumpProgress = 0;
          player.state = isMoving ? (input.shift ? 'running' : 'walking') : 'idle';
        }
      } else {
        player.state = isMoving ? (input.shift ? 'running' : 'walking') : 'idle';
      }

      // Animation timers
      if (isMoving) {
        player.walkTimer += dt;
      } else {
        player.idleTimer += dt;
      }

      // 2. Compute New Position with Collision Detection
      let nextX = player.position.x + moveX * currentSpeed * dt;
      let nextY = player.position.y + moveY * currentSpeed * dt;

      // Clamp to World Bounds (restrict player to the city proper)
      nextX = Math.max(0, Math.min(WORLD_WIDTH, nextX));
      nextY = Math.max(0, Math.min(WORLD_HEIGHT, nextY));

      // Building Footprint Collision
      const pRadius = 14;
      for (const b of BUILDINGS) {
        const bx = b.bounds.x - pRadius;
        const by = b.bounds.y - pRadius;
        const bw = b.bounds.width + pRadius * 2;
        const bh = b.bounds.height + pRadius * 2;

        if (nextX > bx && nextX < bx + bw && nextY > by && nextY < by + bh) {
          const distToDoor = Math.hypot(nextX - b.door.x, nextY - b.door.y);
          if (distToDoor > 28) {
            const fromLeft = Math.abs(nextX - bx);
            const fromRight = Math.abs(bx + bw - nextX);
            const fromTop = Math.abs(nextY - by);
            const fromBottom = Math.abs(by + bh - nextY);
            const minEdge = Math.min(fromLeft, fromRight, fromTop, fromBottom);

            if (minEdge === fromLeft) nextX = bx;
            else if (minEdge === fromRight) nextX = bx + bw;
            else if (minEdge === fromTop) nextY = by;
            else nextY = by + bh;
          }
        }
      }

      // Central Fountain collision (Radius 100 at 1376, 720)
      const fx = 1376;
      const fy = 720;
      const fDist = Math.hypot(nextX - fx, nextY - fy);
      const fMinDist = 95 + pRadius;
      if (fDist < fMinDist) {
        const angle = Math.atan2(nextY - fy, nextX - fx);
        nextX = fx + Math.cos(angle) * fMinDist;
        nextY = fy + Math.sin(angle) * fMinDist;
      }

      player.position.x = nextX;
      player.position.y = nextY;
      player.velocity.x = moveX * currentSpeed;
      player.velocity.y = moveY * currentSpeed;

      // 3. Smooth Camera Tracking
      const camLerp = prefersReducedMotion ? 1 : Math.min(dt * 7, 1);
      camera.x += (player.position.x - camera.x) * camLerp;
      camera.y += (player.position.y - camera.y) * camLerp;
      camera.zoom = zoomState.current;
      camera.target = { x: player.position.x, y: player.position.y };

      // 4. Update Ambient Particles
      for (const p of particles) {
        p.phase += dt * 1.5;
        p.x += Math.cos(p.phase) * 8 * dt + 6 * dt;
        p.y += p.speedY * dt;
        if (p.x < 0) p.x = WORLD_WIDTH;
        if (p.x > WORLD_WIDTH) p.x = 0;
        if (p.y < 0) p.y = WORLD_HEIGHT;
        if (p.y > WORLD_HEIGHT) p.y = 0;
      }

      // 5. Check Building Proximity periodically (every 100ms)
      if (timestamp - lastNearbyCheck > 100) {
        lastNearbyCheck = timestamp;
        let closestBuilding: Building | null = null;
        let closestDist = Infinity;

        for (const b of BUILDINGS) {
          const dist = Math.hypot(player.position.x - b.door.x, player.position.y - b.door.y);
          if (dist < b.interactionRadius && dist < closestDist) {
            closestDist = dist;
            closestBuilding = b;
          }
        }

        setNearbyBuilding((prev) => (prev?.id !== closestBuilding?.id ? closestBuilding : prev));
        setPlayerState({ ...player });
      }

      // 6. Canvas Resize & High-DPI Handling
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewW = canvas.clientWidth || window.innerWidth;
      const viewH = canvas.clientHeight || window.innerHeight;

      if (canvas.width !== Math.floor(viewW * dpr) || canvas.height !== Math.floor(viewH * dpr)) {
        canvas.width = Math.floor(viewW * dpr);
        canvas.height = Math.floor(viewH * dpr);
      }

      // 7. Render 2.5D World
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const zoom = zoomState.current;
      ctx.scale(dpr * zoom, dpr * zoom);
      ctx.translate(
        -camera.x + (viewW / 2) / zoom,
        -camera.y + (viewH / 2) / zoom
      );

      renderWorld({
        ctx,
        camera,
        player,
        buildings: BUILDINGS,
        roads: ROADS,
        environmentObjects: ENVIRONMENT_OBJECTS,
        particles,
        nearbyBuildingId: nearbyBuilding?.id || null,
        time: timestamp * 0.001,
        prefersReducedMotion,
      });

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvasRef, nearbyBuilding, prefersReducedMotion]);

  return {
    player: playerState,
    nearbyBuilding,
    activeDistrictModal,
    setActiveDistrictModal,
    setVirtualInput,
    teleportToDistrict,
    prefersReducedMotion,
  };
}
