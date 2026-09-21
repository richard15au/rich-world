import { Building, Road, EnvironmentObject, Camera, AmbientParticle, PlayerCharacter } from './types';
import { WORLD_WIDTH, WORLD_HEIGHT } from './constants';
import { renderPlayer } from './characterRenderer';

export interface WorldRenderContext {
  ctx: CanvasRenderingContext2D;
  camera: Camera;
  player?: PlayerCharacter;
  buildings: Building[];
  roads: Road[];
  environmentObjects: EnvironmentObject[];
  particles: AmbientParticle[];
  nearbyBuildingId: string | null;
  time: number;
  prefersReducedMotion: boolean;
}

interface DepthEntity {
  y: number;
  render: () => void;
}

// Master City Map Image Cache
let cityExpandedImage: HTMLImageElement | null = null;
let cityMapImage: HTMLImageElement | null = null;

export function getCityExpandedMapImage(): HTMLImageElement | null {
  if (typeof window === 'undefined') return null;
  if (!cityExpandedImage) {
    cityExpandedImage = new Image();
    cityExpandedImage.src = '/world/rich_city_expanded_map.jpg';
  }
  return cityExpandedImage;
}

export function getCityMapImage(): HTMLImageElement | null {
  if (typeof window === 'undefined') return null;
  if (!cityMapImage) {
    cityMapImage = new Image();
    cityMapImage.src = '/world/rich_city_map.jpg';
  }
  return cityMapImage;
}

/**
 * High-Fidelity 2.5D / Isometric World Renderer for RICH CITY.
 * Closely follows the visual language, depth, density and presentation
 * of the reference miniature city.
 */
export function renderWorld(renderCtx: WorldRenderContext): void {
  const {
    ctx,
    player,
    buildings,
    roads,
    environmentObjects,
    particles,
    nearbyBuildingId,
    time,
    prefersReducedMotion,
  } = renderCtx;

  // 0. Base sky & terrain gradients covering extreme zoom-out
  renderSurroundingEnvironment(ctx, time, prefersReducedMotion);

  // Check if expanded high-resolution 2.5D city map image is loaded
  const expandedImg = getCityExpandedMapImage();
  const hasExpanded = expandedImg && expandedImg.complete && expandedImg.naturalWidth > 0;

  if (hasExpanded) {
    // 1. Draw seamless 4600x2400 expanded artwork where inner city aligns perfectly at (0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    ctx.drawImage(expandedImg, -917, -432, 4600, 2400);

    // 2. Dynamic Animated Water Ripples and Spray at Central Fountain (1376, 720)
    renderDynamicFountainEffects(ctx, 1376, 720, time, prefersReducedMotion);

    // 3. Dynamic Moving 2.5D Traffic Cars on Boulevards & Avenues
    renderDynamicTrafficCars(ctx, time, prefersReducedMotion);

    // 4. Emergency Strobe Lightbar at RichHealth & Rooftop Aviation Beacon at RICH WORLD HQ
    renderDynamicBeacons(ctx, time, prefersReducedMotion);

    // 5. Interactive Doorway Beacons & Proximity Badges for all 11 Buildings
    renderDoorwayInteractionBeacons(ctx, buildings, nearbyBuildingId, time, prefersReducedMotion);

    // 6. Y-Sorted Player Character
    if (player) {
      renderPlayer(ctx, player, {
        prefersReducedMotion,
        showNameTag: true,
        isNearbyBuilding: !!nearbyBuildingId,
      });
    }

    // 7. Ambient Atmospheric Motes
    if (!prefersReducedMotion) {
      renderParticles(ctx, particles);
    }
    return;
  }

  // Fallback: standard city map image if expanded still loading
  const cityImg = getCityMapImage();
  const hasImage = cityImg && cityImg.complete && cityImg.naturalWidth > 0;

  if (hasImage) {
    ctx.drawImage(cityImg, 0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    renderCityEdgeTransitions(ctx);

    // 2. Dynamic Animated Water Ripples and Spray at Central Fountain (1376, 720)
    renderDynamicFountainEffects(ctx, 1376, 720, time, prefersReducedMotion);

    // 3. Dynamic Moving 2.5D Traffic Cars on Boulevards & Avenues
    renderDynamicTrafficCars(ctx, time, prefersReducedMotion);

    // 4. Emergency Strobe Lightbar at RichHealth & Rooftop Aviation Beacon at RICH WORLD HQ
    renderDynamicBeacons(ctx, time, prefersReducedMotion);

    // 5. Interactive Doorway Beacons & Proximity Badges for all 11 Buildings
    renderDoorwayInteractionBeacons(ctx, buildings, nearbyBuildingId, time, prefersReducedMotion);

    // 6. Y-Sorted Player Character
    if (player) {
      renderPlayer(ctx, player, {
        prefersReducedMotion,
        showNameTag: true,
        isNearbyBuilding: !!nearbyBuildingId,
      });
    }

    // 7. Ambient Atmospheric Motes
    if (!prefersReducedMotion) {
      renderParticles(ctx, particles);
    }
    return;
  }

  // =========================================================================
  // FALLBACK PASS 1: PROCEDURAL GROUND PLANE (If map image still loading)
  // =========================================================================

  // 0. Surrounding Environment
  renderSurroundingEnvironment(ctx, time, prefersReducedMotion);

  // 1. Manicured Urban Green Space Ground with Subtle Striping
  renderUrbanGround(ctx);

  // 2. Realistic Roads, Curbs, Sidewalks & Central Roundabout
  renderUrbanRoadSystem(ctx, roads);

  // 3. Central Plaza Ground Paving & Roundabout Pedestrian Ring
  renderCentralPlazaGround(ctx);

  // 4. Ground-Level Fixtures (Basketball Court, Parking Lot, Loading Apron)
  renderGroundFixtures(ctx, environmentObjects);

  // 5. Deep Directional Ground Shadows for all 11 Buildings (Cast to South-East)
  renderGroundBuildingShadows(ctx, buildings);

  // =========================================================================
  // PASS 2: Y-SORTED UPRIGHT ENTITIES (True 2.5D Depth Ordering)
  // =========================================================================

  const entities: DepthEntity[] = [];

  // A. Buildings (Anchor at bottom footprint: b.bounds.y + b.bounds.height)
  for (const building of buildings) {
    entities.push({
      y: building.bounds.y + building.bounds.height,
      render: () => {
        render2p5DBuilding(
          ctx,
          building,
          building.id === nearbyBuildingId,
          time,
          prefersReducedMotion
        );
      },
    });
  }

  // B. Player Character (Anchor at ground contact: player.position.y)
  if (player) {
    entities.push({
      y: player.position.y,
      render: () => {
        renderPlayer(ctx, player, {
          prefersReducedMotion,
          showNameTag: false, // Name tag drawn in Overlay Pass
          isNearbyBuilding: !!nearbyBuildingId,
        });
      },
    });
  }

  // C. Urban Objects (Anchor at object foot / base)
  for (const obj of environmentObjects) {
    // Skip ground-layer objects already drawn in Pass 1
    if (
      obj.type === 'basketball-court' ||
      obj.type === 'shopping-cart-corral' ||
      obj.type === 'cargo-pallets'
    ) {
      continue;
    }

    const anchorY = getObjectAnchorY(obj);
    entities.push({
      y: anchorY,
      render: () => {
        renderSingleUrbanObject(ctx, obj, time, prefersReducedMotion);
      },
    });
  }

  // D. Moving City Traffic (Cars cruising along Grand Civic Boulevard & Promenade)
  addMovingTrafficEntities(entities, ctx, time, prefersReducedMotion);

  // E. Central Tiered Fountain Upper Structure & Splashing Spray (At cx=1350, cy=1000)
  entities.push({
    y: 1000,
    render: () => {
      renderCentralFountainUpper(ctx, time, prefersReducedMotion);
    },
  });

  // Sort all upright entities back-to-front (lowest Y to highest Y)
  entities.sort((a, b) => a.y - b.y);

  // Render sorted entities in painter's order
  for (const entity of entities) {
    entity.render();
  }

  // =========================================================================
  // PASS 3: OVERLAYS (Floating UI, Signboards, Name Tags, Atmosphere)
  // =========================================================================

  // Floating Architectural District Signboards
  for (const building of buildings) {
    const H = getBuildingElevationHeight(building.id);
    render2p5DSignboard(
      ctx,
      building,
      building.bounds.x + building.bounds.width / 2,
      building.bounds.y - H - 20,
      building.id === nearbyBuildingId,
      time,
      prefersReducedMotion
    );
  }

  // Floating Player Name Tag & Interaction Reticle
  if (player) {
    renderPlayerNameTagOverlay(ctx, player, !!nearbyBuildingId);
  }

  // Ambient Digital Atmosphere Motes
  if (!prefersReducedMotion) {
    renderParticles(ctx, particles);
  }
}

/* ==========================================================================
   PASS 1: GROUND PLANE & ROAD SYSTEM
   ========================================================================== */

function renderUrbanGround(ctx: CanvasRenderingContext2D) {
  // Base soft lawn green
  ctx.fillStyle = '#bbf7d0';
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  // Manicured civic park lawn stripes (alternating 64px bands)
  ctx.fillStyle = '#b1f0c7';
  const bandH = 64;
  for (let y = 0; y < WORLD_HEIGHT; y += bandH * 2) {
    ctx.fillRect(0, y, WORLD_WIDTH, bandH);
  }

  // Soft landscaped turf texture spots
  ctx.fillStyle = '#9fe8b8';
  for (let x = 120; x < WORLD_WIDTH; x += 240) {
    for (let y = 100; y < WORLD_HEIGHT; y += 240) {
      ctx.beginPath();
      ctx.ellipse(x, y, 22, 11, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function renderUrbanRoadSystem(ctx: CanvasRenderingContext2D, roads: Road[]) {
  const sidewalkWidth = 18;

  // Concrete Sidewalk Aprons with Raised Curbs
  for (const road of roads) {
    // Sidewalk Base Slab
    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(
      road.x - sidewalkWidth,
      road.y - sidewalkWidth,
      road.width + sidewalkWidth * 2,
      road.height + sidewalkWidth * 2,
      14
    );
    ctx.fill();
    ctx.stroke();

    // Sidewalk Pavement Expansion Joints
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    if (road.direction === 'horizontal') {
      for (let sx = road.x; sx < road.x + road.width; sx += 36) {
        ctx.beginPath();
        ctx.moveTo(sx, road.y - sidewalkWidth);
        ctx.lineTo(sx, road.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(sx, road.y + road.height);
        ctx.lineTo(sx, road.y + road.height + sidewalkWidth);
        ctx.stroke();
      }
    } else {
      for (let sy = road.y; sy < road.y + road.height; sy += 36) {
        ctx.beginPath();
        ctx.moveTo(road.x - sidewalkWidth, sy);
        ctx.lineTo(road.x, sy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(road.x + road.width, sy);
        ctx.lineTo(road.x + road.width + sidewalkWidth, sy);
        ctx.stroke();
      }
    }

    // Raised Granite Curb Face (3D step up from asphalt to sidewalk)
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(road.x - 3, road.y - 3, road.width + 6, road.height + 6);
    ctx.fillStyle = '#64748b'; // Curb bottom shadow
    ctx.fillRect(road.x - 3, road.y + road.height, road.width + 6, 3);

    // Dark Asphalt Road Surface
    ctx.fillStyle = '#263140';
    ctx.fillRect(road.x, road.y, road.width, road.height);

    // Road Markings
    if (road.direction === 'horizontal') {
      const centerY = road.y + road.height / 2;

      // Double Yellow Centerline
      if (road.height >= 100) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(road.x + 10, centerY - 3.5);
        ctx.lineTo(road.x + road.width - 10, centerY - 3.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(road.x + 10, centerY + 3.5);
        ctx.lineTo(road.x + road.width - 10, centerY + 3.5);
        ctx.stroke();

        // Dashed White Lane Dividers
        renderDashedLine(ctx, road.x + 15, centerY - road.height / 4, road.width - 30, true);
        renderDashedLine(ctx, road.x + 15, centerY + road.height / 4, road.width - 30, true);
      } else {
        renderDashedLine(ctx, road.x + 10, centerY, road.width - 20, true);
      }

      // Zebra Pedestrian Crossings
      renderZebraCrossingH(ctx, road.x + 80, road.y, road.height);
      renderZebraCrossingH(ctx, road.x + road.width - 140, road.y, road.height);
      if (road.width > 1200) {
        renderZebraCrossingH(ctx, road.x + road.width / 2 - 220, road.y, road.height);
        renderZebraCrossingH(ctx, road.x + road.width / 2 + 180, road.y, road.height);
      }
    } else {
      const centerX = road.x + road.width / 2;

      if (road.width >= 100) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(centerX - 3.5, road.y + 10);
        ctx.lineTo(centerX - 3.5, road.y + road.height - 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX + 3.5, road.y + 10);
        ctx.lineTo(centerX + 3.5, road.y + road.height - 10);
        ctx.stroke();

        renderDashedLine(ctx, centerX - road.width / 4, road.y + 15, road.height - 30, false);
        renderDashedLine(ctx, centerX + road.width / 4, road.y + 15, road.height - 30, false);
      } else {
        renderDashedLine(ctx, centerX, road.y + 10, road.height - 20, false);
      }

      renderZebraCrossingV(ctx, road.x, road.y + 80, road.width);
      renderZebraCrossingV(ctx, road.x, road.y + road.height - 140, road.width);
    }
  }

  // Central Roundabout Roadway
  const cx = 1350;
  const cy = 1000;
  const roundRadius = 180;

  // Roundabout Sidewalk Ring
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.arc(cx, cy, roundRadius + 24, 0, Math.PI * 2);
  ctx.fill();

  // Roundabout Raised Curb
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.arc(cx, cy, roundRadius + 4, 0, Math.PI * 2);
  ctx.fill();

  // Roundabout Asphalt Ring
  ctx.fillStyle = '#263140';
  ctx.beginPath();
  ctx.arc(cx, cy, roundRadius, 0, Math.PI * 2);
  ctx.fill();

  // Roundabout Dashed Center Lane Ring
  ctx.save();
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 2;
  ctx.setLineDash([16, 16]);
  ctx.beginPath();
  ctx.arc(cx, cy, roundRadius - 28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function renderDashedLine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  isHorizontal: boolean
) {
  ctx.save();
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 2;
  ctx.setLineDash([16, 16]);
  ctx.beginPath();
  if (isHorizontal) {
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y);
  } else {
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + length);
  }
  ctx.stroke();
  ctx.restore();
}

function renderZebraCrossingH(
  ctx: CanvasRenderingContext2D,
  x: number,
  roadY: number,
  roadHeight: number
) {
  const stripeWidth = 8;
  const stripeGap = 6;
  const numStripes = 6;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < numStripes; i++) {
    const sx = x + i * (stripeWidth + stripeGap);
    ctx.fillRect(sx, roadY + 4, stripeWidth, roadHeight - 8);
  }
}

function renderZebraCrossingV(
  ctx: CanvasRenderingContext2D,
  roadX: number,
  y: number,
  roadWidth: number
) {
  const stripeHeight = 8;
  const stripeGap = 6;
  const numStripes = 6;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < numStripes; i++) {
    const sy = y + i * (stripeHeight + stripeGap);
    ctx.fillRect(roadX + 4, sy, roadWidth - 8, stripeHeight);
  }
}

/* ==========================================================================
   CENTRAL PLAZA GROUND & ROUNDABOUT
   ========================================================================== */

function renderCentralPlazaGround(ctx: CanvasRenderingContext2D) {
  const cx = 1350;
  const cy = 1000;

  // Outer Circular Plaza Raised Stone Terrace (Radius 120)
  ctx.fillStyle = '#94a3b8'; // Curb shadow step
  ctx.beginPath();
  ctx.arc(cx, cy + 4, 122, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Radial Stone Joint Pavers
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 52, cy + Math.sin(angle) * 52);
    ctx.lineTo(cx + Math.cos(angle) * 116, cy + Math.sin(angle) * 116);
    ctx.stroke();
  }

  // Concentric Paver Rings
  ctx.beginPath();
  ctx.arc(cx, cy, 96, 0, Math.PI * 2);
  ctx.arc(cx, cy, 70, 0, Math.PI * 2);
  ctx.stroke();

  // "RICH CITY" Entry Monument Stone Plaque (Just below fountain, as in reference image)
  const signW = 96;
  const signH = 24;
  const signX = cx - signW / 2;
  const signY = cy + 54;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
  ctx.beginPath();
  ctx.roundRect(signX + 2, signY + 3, signW, signH, 5);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(signX, signY, signW, signH, 4);
  ctx.fill();

  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(signX, signY, signW, signH);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RICH CITY', cx, signY + signH / 2 - 3);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 5.5px monospace';
  ctx.fillText('INNOVATION • COMMUNITY', cx, signY + signH / 2 + 5);
}

function renderCentralFountainUpper(
  ctx: CanvasRenderingContext2D,
  time: number,
  prefersReducedMotion: boolean
) {
  const cx = 1350;
  const cy = 1000;

  // Outer Granite Fountain Basin (Raised 2.5D Rim)
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.arc(cx, cy + 5, 46, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 44, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Sparkling Aquamarine Water Pool
  const waterGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 40);
  waterGrad.addColorStop(0, '#7dd3fc');
  waterGrad.addColorStop(0.65, '#38bdf8');
  waterGrad.addColorStop(1, '#0284c7');
  ctx.fillStyle = waterGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, Math.PI * 2);
  ctx.fill();

  // Water Ripple Animation
  const ripple1 = prefersReducedMotion ? 1 : 1 + Math.sin(time * 3) * 0.08;
  const ripple2 = prefersReducedMotion ? 1 : 1 + Math.cos(time * 2.5) * 0.07;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 26 * ripple1, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 16 * ripple2, 0, Math.PI * 2);
  ctx.stroke();

  // Tiered Marble Center Fountain Pedestal (2.5D Raised)
  ctx.fillStyle = '#e2e8f0';
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy - 4, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Upper Water Spout
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy - 9, 6, 0, Math.PI * 2);
  ctx.fill();

  // Splashing Water Spray Droplets
  if (!prefersReducedMotion) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let i = 0; i < 8; i++) {
      const dropAngle = (i * Math.PI) / 4 + time * 2;
      const dropDist = 18 + Math.sin(time * 4 + i) * 8;
      ctx.beginPath();
      ctx.arc(
        cx + Math.cos(dropAngle) * dropDist,
        cy - 8 + Math.sin(dropAngle) * dropDist,
        2.2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
}

/* ==========================================================================
   GROUND FIXTURES (Basketball Court, Parking Lot, Loading Aprons)
   ========================================================================== */

function renderGroundFixtures(
  ctx: CanvasRenderingContext2D,
  objects: EnvironmentObject[]
) {
  for (const obj of objects) {
    if (obj.type === 'basketball-court') {
      renderBasketballCourt(ctx, obj.x, obj.y, obj.width || 150, obj.height || 210);
    } else if (obj.type === 'shopping-cart-corral') {
      renderShoppingCartCorral(ctx, obj.x, obj.y);
    } else if (obj.type === 'cargo-pallets') {
      renderCargoPallets(ctx, obj.x, obj.y);
    }
  }

  // RichMart Front Customer Parking Lot Lines
  renderMartParkingLot(ctx, 840, 1130, 240, 44);

  // RichStay Drop-Off Driveway Loop (in front of porte-cochère)
  renderStayDrivewayLoop(ctx, 1230, 1200, 240, 36);

  // RichLogistics Loading Bay Concrete Apron
  renderLogisticsApron(ctx, 360, 1140, 290, 34);
}

/**
 * Vibrant Blue Acrylic Outdoor Basketball Court beside RichAcademy (from reference image)
 */
function renderBasketballCourt(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Concrete Border / Court Apron
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(x - 6, y - 6, w + 12, h + 12);

  // Vibrant Blue Acrylic Court Surface
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(x, y, w, h);

  // Painted White Regulation Lines
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);

  // Center Court Line & Center Jump Circle
  const midY = y + h / 2;
  ctx.beginPath();
  ctx.moveTo(x + 4, midY);
  ctx.lineTo(x + w - 4, midY);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x + w / 2, midY, 22, 0, Math.PI * 2);
  ctx.stroke();

  // Top Key & Free Throw Circle
  ctx.strokeRect(x + w / 2 - 20, y + 4, 40, 42);
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 46, 20, 0, Math.PI);
  ctx.stroke();

  // Bottom Key & Free Throw Circle
  ctx.strokeRect(x + w / 2 - 20, y + h - 46, 40, 42);
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h - 46, 20, Math.PI, 0);
  ctx.stroke();

  // Basketball Hoops & Backboards (North & South)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + w / 2 - 14, y + 10, 28, 3.5);
  ctx.fillRect(x + w / 2 - 14, y + h - 13.5, 28, 3.5);

  // Orange Rims
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 16, 4.5, 0, Math.PI * 2);
  ctx.arc(x + w / 2, y + h - 19.5, 4.5, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Customer Parking Lot in front of RichMart (from reference image)
 */
function renderMartParkingLot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = '#334155';
  ctx.fillRect(x, y, w, h);

  // Diagonal White Parking Bay Lines
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  for (let px = x + 18; px < x + w - 18; px += 26) {
    ctx.beginPath();
    ctx.moveTo(px, y + 4);
    ctx.lineTo(px + 10, y + h - 4);
    ctx.stroke();
  }

  // Disabled Parking Stall (Blue square with white wheelchair icon)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x + 8, y + 6, 22, h - 12);
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(x + 8, y + 6, 22, h - 12);
}

function renderStayDrivewayLoop(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 8);
  ctx.fill();

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function renderLogisticsApron(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = '#475569';
  ctx.fillRect(x, y, w, h);

  // Yellow hazard parking guides
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(x + 10, y + h - 4);
  ctx.lineTo(x + w - 10, y + h - 4);
  ctx.stroke();
  ctx.setLineDash([]);
}

/* ==========================================================================
   DIRECTIONAL GROUND SHADOWS FOR BUILDINGS
   ========================================================================== */

function renderGroundBuildingShadows(
  ctx: CanvasRenderingContext2D,
  buildings: Building[]
) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';

  for (const b of buildings) {
    const { x, y, width, height } = b.bounds;
    const H = getBuildingElevationHeight(b.id);
    const shadowOffsetX = 18;
    const shadowOffsetY = Math.round(H * 0.22) + 12;

    // Ground cast shadow polygon extending to South-East
    ctx.beginPath();
    ctx.moveTo(x + 8, y + height);
    ctx.lineTo(x + 8 + shadowOffsetX, y + height + shadowOffsetY);
    ctx.lineTo(x + width + shadowOffsetX + 6, y + height + shadowOffsetY);
    ctx.lineTo(x + width, y + height);
    ctx.closePath();
    ctx.fill();

    // Additional soft ambient base shadow
    ctx.beginPath();
    ctx.roundRect(x + 4, y + height - 2, width - 8, 12, 6);
    ctx.fill();
  }

  ctx.restore();
}

/* ==========================================================================
   PASS 2: 2.5D ISOMETRIC BUILDINGS (10 BUSINESSES + CIVIC TRANSIT LANDMARK)
   ========================================================================== */

function render2p5DBuilding(
  ctx: CanvasRenderingContext2D,
  b: Building,
  isNearby: boolean,
  time: number,
  prefersReducedMotion: boolean
) {
  const { x, y, width, height } = b.bounds;
  const H = getBuildingElevationHeight(b.id);

  ctx.save();

  // Raised Foundation / Ground Plinth Step
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(x - 4, y + height - 6, width + 8, 8);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(x - 4, y + height - 10, width + 8, 4);

  // Render specific building's true 2.5D isometric geometry
  switch (b.id) {
    case 'rich-hq':
      render2p5DRichWorldHQ(ctx, b, x, y, width, height, H, isNearby, time, prefersReducedMotion);
      break;
    case 'richacademy':
      render2p5DRichAcademy(ctx, b, x, y, width, height, H, isNearby);
      break;
    case 'tech-ai':
      render2p5DTechAiStudio(ctx, b, x, y, width, height, H, isNearby, time, prefersReducedMotion);
      break;
    case 'richhealth':
      render2p5DRichHealth(ctx, b, x, y, width, height, H, isNearby, time, prefersReducedMotion);
      break;
    case 'richfinance':
      render2p5DRichFinance(ctx, b, x, y, width, height, H, isNearby, time);
      break;
    case 'richmart':
      render2p5DRichMart(ctx, b, x, y, width, height, H, isNearby);
      break;
    case 'richstay':
      render2p5DRichStay(ctx, b, x, y, width, height, H, isNearby);
      break;
    case 'richfoods':
      render2p5DRichFoods(ctx, b, x, y, width, height, H, isNearby);
      break;
    case 'richlogistics':
      render2p5DRichLogistics(ctx, b, x, y, width, height, H, isNearby);
      break;
    case 'richbuild':
      render2p5DRichBuild(ctx, b, x, y, width, height, H, isNearby);
      break;
    case 'transit':
      render2p5DTransitStation(ctx, b, x, y, width, height, H, isNearby, time, prefersReducedMotion);
      break;
  }

  ctx.restore();
}

export function getBuildingElevationHeight(id: string): number {
  switch (id) {
    case 'rich-hq':
      return 110; // Tallest iconic glass skyscraper landmark
    case 'richfinance':
      return 92;  // High-rise corporate financial tower
    case 'richstay':
      return 82;  // Mid-rise hotel
    case 'tech-ai':
      return 78;  // Technology center
    case 'richhealth':
      return 74;  // Medical pavilion
    case 'richacademy':
      return 72;  // Two-story school with clock tower
    case 'richbuild':
      return 68;  // Construction showroom with tower crane
    case 'richlogistics':
      return 58;  // Industrial warehouse
    case 'richmart':
      return 54;  // Supermarket
    case 'transit':
      return 54;  // Vaulted transit terminal
    case 'richfoods':
      return 50;  // Restaurant
    default:
      return 65;
  }
}

/* --------------------------------------------------------------------------
   1. RICH WORLD HQ - Stepped Faceted Glass Skyscraper (North Center)
   -------------------------------------------------------------------------- */
function render2p5DRichWorldHQ(
  ctx: CanvasRenderingContext2D,
  _b: Building,
  x: number,
  y: number,
  w: number,
  h: number,
  H: number,
  isNearby: boolean,
  time: number,
  prefersReducedMotion: boolean
) {
  const roofY = y - H;

  // A. Rooftop Tiers & Penthouse Observatory (Viewed from elevated 2.5D angle)
  // Outer Roof Deck
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(x + 12, roofY, w - 24, h - 30, [16, 16, 6, 6]);
  ctx.fill();

  // Roof Parapet Raised Lip with Cyan Accent
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Sky Garden Terraces (Tier 2 Setback)
  ctx.fillStyle = '#15803d';
  ctx.fillRect(x + 24, roofY + 16, w - 48, 12);
  ctx.fillRect(x + 36, roofY + 38, w - 72, 10);

  // Stepped Penthouse Crown (Tier 3 Setback)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(x + w / 2 - 40, roofY + 54, 80, 28, 6);
  ctx.fill();
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Communications Spire with Aviation Warning Beacon
  const spireX = x + w / 2;
  const spireY = roofY + 10;
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(spireX, spireY);
  ctx.lineTo(spireX, spireY - 54);
  ctx.stroke();

  const beaconFlash = prefersReducedMotion ? 1 : 1 + Math.sin(time * 5) * 0.4;
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(spireX, spireY - 54, 4.5 * beaconFlash, 0, Math.PI * 2);
  ctx.fill();

  // B. Front Facade (South Curved Glass Curtain Wall)
  const facadeY = roofY + 68;
  const facadeH = y + h - facadeY;

  const glassGrad = ctx.createLinearGradient(x, facadeY, x + w, facadeY + facadeH);
  glassGrad.addColorStop(0, '#0369a1');
  glassGrad.addColorStop(0.25, '#38bdf8');
  glassGrad.addColorStop(0.6, '#bae6fd');
  glassGrad.addColorStop(1, '#0284c7');

  ctx.fillStyle = glassGrad;
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(x, facadeY, w, facadeH, [6, 6, 0, 0]);
  ctx.fill();
  ctx.stroke();

  // Vertical Structural Mullions Curving Around Cylinder
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 2;
  for (let mx = x + 24; mx < x + w - 10; mx += 26) {
    ctx.beginPath();
    ctx.moveTo(mx, facadeY);
    ctx.lineTo(mx, facadeY + facadeH);
    ctx.stroke();
  }

  // Horizontal Floor Spandrels
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
  ctx.lineWidth = 2.5;
  for (let fy = facadeY + 30; fy < facadeY + facadeH - 45; fy += 30) {
    ctx.beginPath();
    ctx.moveTo(x, fy);
    ctx.lineTo(x + w, fy);
    ctx.stroke();
  }

  // Grand Curved Glass Atrium Entrance
  const doorW = 92;
  const doorH = 62;
  const doorX = x + w / 2 - doorW / 2;
  const doorY = y + h - doorH;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(doorX - 16, doorY - 14, doorW + 32, 14);

  ctx.fillStyle = isNearby ? '#e0f2fe' : '#f0f9ff';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(doorX, doorY, doorW, doorH, [6, 6, 0, 0]);
  ctx.fill();
  ctx.stroke();

  // Illuminated RICH WORLD HQ Emblem
  ctx.fillStyle = '#0284c7';
  ctx.font = '800 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RICH WORLD HQ', x + w / 2, doorY - 20);

  // Ceremonial Plaza Entrance Flags
  renderPlazaFlag(ctx, x + 30, y + h - 10, '#0284c7', time, prefersReducedMotion);
  renderPlazaFlag(ctx, x + w - 30, y + h - 10, '#0284c7', time, prefersReducedMotion);
}

function renderPlazaFlag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  time: number,
  prefersReducedMotion: boolean
) {
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 40);
  ctx.stroke();

  const wave = prefersReducedMotion ? 0 : Math.sin(time * 3 + x) * 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - 38);
  ctx.lineTo(x + 18, y - 35 + wave);
  ctx.lineTo(x + 18, y - 25 + wave);
  ctx.lineTo(x, y - 28);
  ctx.closePath();
  ctx.fill();
}

/* --------------------------------------------------------------------------
   2. TECHNOLOGY & AI STUDIO - Blue Glass Tech Innovation Lab (North Mid-Left)
   -------------------------------------------------------------------------- */
function render2p5DTechAiStudio(
  ctx: CanvasRenderingContext2D,
  _b: Building,
  x: number,
  y: number,
  w: number,
  h: number,
  H: number,
  isNearby: boolean,
  time: number,
  prefersReducedMotion: boolean
) {
  const roofY = y - H;

  // A. 2.5D East (Right) Side Wall (Darker shaded tech indigo showing depth)
  const sideW = 26;
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.moveTo(x + w, roofY + 14);
  ctx.lineTo(x + w + sideW, roofY + 28);
  ctx.lineTo(x + w + sideW, y + h + 8);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();

  // B. 2.5D Roof Deck (Viewed from elevated vantage point)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x, roofY, w, 54);
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, roofY, w, 54);

  // Rooftop Dual HVAC Chillers (from reference image)
  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 22, roofY + 14, 38, 28);
  ctx.fillRect(x + 72, roofY + 14, 38, 28);

  // Chiller Fan Grilles
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x + 41, roofY + 28, 9, 0, Math.PI * 2);
  ctx.arc(x + 91, roofY + 28, 9, 0, Math.PI * 2);
  ctx.stroke();

  // Solar Panel Arrays on the Right side of Roof
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(x + w - 86, roofY + 14, 68, 26);
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + w - 86, roofY + 14, 68, 26);

  // C. Front Glass Facade
  const facadeY = roofY + 48;
  const facadeH = y + h - facadeY;

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, facadeY, w, facadeH);

  // Large Blue Glass Curtain Windows
  const winGrad = ctx.createLinearGradient(x, facadeY, x + w, facadeY + facadeH);
  winGrad.addColorStop(0, '#1d4ed8');
  winGrad.addColorStop(0.5, '#38bdf8');
  winGrad.addColorStop(1, '#2563eb');
  ctx.fillStyle = winGrad;
  ctx.fillRect(x + 14, facadeY + 10, w - 28, facadeH - 66);

  // Window Grid Mullions
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  for (let wx = x + 40; wx < x + w - 20; wx += 40) {
    ctx.beginPath();
    ctx.moveTo(wx, facadeY + 10);
    ctx.lineTo(wx, facadeY + facadeH - 56);
    ctx.stroke();
  }

  // Cleanroom Server LED Indicators
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(x + 26, facadeY + 30, 4, 4);
  ctx.fillRect(x + 26, facadeY + 42, 4, 4);

  // Animated Telemetry Pulse Line
  const streamOffset = prefersReducedMotion ? 0 : (time * 65) % (w - 32);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + 16 + streamOffset, facadeY + facadeH - 62, 26, 4);

  // Modern Cantilevered Glass Entrance
  const doorW = 76;
  const doorH = 52;
  const doorX = x + w / 2 - doorW / 2;
  const doorY = y + h - doorH;

  ctx.fillStyle = isNearby ? '#3b82f6' : '#1d4ed8';
  ctx.beginPath();
  ctx.roundRect(doorX, doorY, doorW, doorH, [6, 6, 0, 0]);
  ctx.fill();

  // Signage: Technology & AI Studio
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 10.5px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Technology & AI Studio', x + w / 2, facadeY + 24);
}

/* --------------------------------------------------------------------------
   3. RICHBUILD - Construction Showroom with Yellow Tower Crane (North Far-Left)
   -------------------------------------------------------------------------- */
function render2p5DRichBuild(
  ctx: CanvasRenderingContext2D,
  _b: Building,
  x: number,
  y: number,
  w: number,
  h: number,
  H: number,
  isNearby: boolean
) {
  const roofY = y - H;

  // A. 2.5D East (Right) Side Wall
  const sideW = 24;
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(x + w, roofY + 12);
  ctx.lineTo(x + w + sideW, roofY + 24);
  ctx.lineTo(x + w + sideW, y + h + 6);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();

  // B. 2.5D Roof Deck
  ctx.fillStyle = '#475569';
  ctx.fillRect(x, roofY, w, 48);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, roofY, w, 48);

  // Rooftop HVAC units and vents
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x + 76, roofY + 12, 38, 26);
  ctx.fillRect(x + 130, roofY + 14, 30, 22);

  // TALL YELLOW CONSTRUCTION TOWER CRANE (Signature feature directly from reference image!)
  const craneX = x + 38;
  const craneBaseY = y + h - 10;
  const craneTopY = roofY - 76;

  // Yellow Lattice Mast
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(craneX, craneBaseY);
  ctx.lineTo(craneX, craneTopY);
  ctx.stroke();

  // Lattice Diagonal Cross-Bracing on Mast
  ctx.lineWidth = 1.8;
  for (let cy = craneBaseY; cy > craneTopY; cy -= 16) {
    ctx.beginPath();
    ctx.moveTo(craneX - 5, cy);
    ctx.lineTo(craneX + 5, cy - 8);
    ctx.stroke();
  }

  // Crane Operator Cab
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(craneX - 7, craneTopY + 10, 14, 12);

  // Horizontal Lattice Boom / Jib extending across building (150px length)
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(craneX - 34, craneTopY + 6); // Counter-jib
  ctx.lineTo(craneX + 140, craneTopY + 6); // Forward jib
  ctx.stroke();

  // Crane Apex Tower & Stay Cables
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(craneX, craneTopY + 6);
  ctx.lineTo(craneX, craneTopY - 14);
  ctx.lineTo(craneX + 110, craneTopY + 6);
  ctx.moveTo(craneX, craneTopY - 14);
  ctx.lineTo(craneX - 30, craneTopY + 6);
  ctx.stroke();

  // Concrete Counterweight Block
  ctx.fillStyle = '#64748b';
  ctx.fillRect(craneX - 42, craneTopY + 2, 16, 12);

  // Hoist Cable and Hook Block hanging down
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(craneX + 96, craneTopY + 6);
  ctx.lineTo(craneX + 96, craneTopY + 50);
  ctx.stroke();
  ctx.fillStyle = '#facc15';
  ctx.fillRect(craneX + 93, craneTopY + 50, 6, 8);

  // C. Front Facade
  const facadeY = roofY + 44;
  const facadeH = y + h - facadeY;

  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(x, facadeY, w, facadeH);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, facadeY, w, facadeH);

  // Architectural Blueprint Gallery Display Window
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x + 22, facadeY + 30, w - 44, 50);
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(x + 22, facadeY + 30, w - 44, 50);

  // CAD Blueprint Grid in Window
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 34, facadeY + 36, 44, 38);
  ctx.strokeRect(x + 90, facadeY + 36, 44, 38);

  // Entrance
  const doorW = 70;
  const doorH = 52;
  const doorX = x + w / 2 - doorW / 2;
  const doorY = y + h - doorH;

  ctx.fillStyle = isNearby ? '#ea580c' : '#c2410c';
  ctx.fillRect(doorX, doorY, doorW, doorH);

  // Signage: RichBuild • BUILDING A BETTER TOMORROW
  ctx.fillStyle = '#0f172a';
  ctx.font = '800 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RichBuild', x + w / 2, facadeY + 20);
}

/* --------------------------------------------------------------------------
   4. RICHFINANCE - Dark Bronze Corporate Tower (North Mid-Right)
   -------------------------------------------------------------------------- */
function render2p5DRichFinance(
  ctx: CanvasRenderingContext2D,
  _b: Building,
  x: number,
  y: number,
  w: number,
  h: number,
  H: number,
  isNearby: boolean,
  time: number
) {
  const roofY = y - H;

  // A. 2.5D West (Left) Side Wall (Dark emerald/slate shaded side)
  const sideW = 24;
  ctx.fillStyle = '#022c22';
  ctx.beginPath();
  ctx.moveTo(x, roofY + 12);
  ctx.lineTo(x - sideW, roofY + 24);
  ctx.lineTo(x - sideW, y + h + 8);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fill();

  // B. 2.5D Roof Deck
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x, roofY, w, 48);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, roofY, w, 48);

  // Rooftop Executive Terrace & Elevator Penthouse
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x + w / 2 - 34, roofY + 10, 68, 26);

  // C. Front Corporate Facade
  const facadeY = roofY + 44;
  const facadeH = y + h - facadeY;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x, facadeY, w, facadeH);
  ctx.strokeStyle = '#0f766e';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, facadeY, w, facadeH);

  // Vertical Gold / Bronze Architectural Sun Fins (Louvers)
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.2;
  for (let fx = x + 22; fx < x + w - 10; fx += 28) {
    ctx.beginPath();
    ctx.moveTo(fx, facadeY + 32);
    ctx.lineTo(fx, facadeY + facadeH - 48);
    ctx.stroke();
  }

  // Dark Reflective Corporate Window Grid
  for (let wy = facadeY + 38; wy < facadeY + facadeH - 52; wy += 34) {
    for (let wx = x + 26; wx < x + w - 26; wx += 28) {
      ctx.fillStyle = '#14b8a6';
      ctx.globalAlpha = 0.45;
      ctx.fillRect(wx, wy, 20, 22);
      ctx.globalAlpha = 1.0;
    }
  }

  // Live Scrolling Fintech Ticker Ribbon
  const tickerY = facadeY + facadeH - 62;
  ctx.fillStyle = '#022c22';
  ctx.fillRect(x + 12, tickerY, w - 24, 16);
  ctx.fillStyle = '#10b981';
  ctx.font = '700 8px monospace';
  ctx.textAlign = 'left';
  const tickerText = '▲ RICH +3.8%  ▲ FINTECH +2.4%  ▲ CAPITAL +1.9%';
  const offset = ((time * 32) % 220) - 10;
  ctx.fillText(tickerText, x + 18 - offset, tickerY + 11);

  // Corporate Entrance
  const doorW = 72;
  const doorH = 50;
  const doorX = x + w / 2 - doorW / 2;
  const doorY = y + h - doorH;

  ctx.fillStyle = isNearby ? '#0d9488' : '#042f2e';
  ctx.fillRect(doorX, doorY, doorW, doorH);

  // Signage: RichFinance
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RichFinance', x + w / 2, facadeY + 24);
}

/* --------------------------------------------------------------------------
   5. RICHACADEMY - School / Campus with Clock Tower (North Far-Right)
   -------------------------------------------------------------------------- */
function render2p5DRichAcademy(
  ctx: CanvasRenderingContext2D,
  _b: Building,
  x: number,
  y: number,
  w: number,
  h: number,
  H: number,
  isNearby: boolean
) {
  const roofY = y - H;

  // A. 2.5D West (Left) Side Wall (Red Brick Shaded)
  const sideW = 24;
  ctx.fillStyle = '#7f1d1d';
  ctx.beginPath();
  ctx.moveTo(x, roofY + 14);
  ctx.lineTo(x - sideW, roofY + 26);
  ctx.lineTo(x - sideW, y + h + 6);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fill();

  // B. 2.5D Roof Deck (Pitched Academic Roof)
  ctx.fillStyle = '#3730a3';
  ctx.fillRect(x, roofY, w, 48);
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, roofY, w, 48);

  // Central Clock Tower & Cupola with Bronze Bell
  const towerW = 58;
  const towerX = x + w / 2 - towerW / 2;
  const towerY = roofY - 48;

  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#4f46e5';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(towerX, towerY, towerW, 52, [6, 6, 0, 0]);
  ctx.fill();
  ctx.stroke();

  // Clock Face
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x + w / 2, towerY + 20, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Clock Hands
  ctx.beginPath();
  ctx.moveTo(x + w / 2, towerY + 20);
  ctx.lineTo(x + w / 2, towerY + 11);
  ctx.moveTo(x + w / 2, towerY + 20);
  ctx.lineTo(x + w / 2 + 6, towerY + 20);
  ctx.stroke();

  // Bell Cupola on Top of Tower
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(x + w / 2, towerY - 6, 7, Math.PI, 0);
  ctx.fill();

  // C. Front Facade (Red Brick with Neoclassical White Stone Trim)
  const facadeY = roofY + 44;
  const facadeH = y + h - facadeY;

  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(x, facadeY, w, facadeH);
  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, facadeY, w, facadeH);

  // Symmetrical Institutional Classroom Windows (Multi-Pane)
  for (let wy = facadeY + 30; wy < facadeY + facadeH - 50; wy += 38) {
    renderClassroomWindow(ctx, x + 18, wy, 64, 26);
    renderClassroomWindow(ctx, x + w - 82, wy, 64, 26);
  }

  // Neoclassical White Portico Entrance with Columns
  const porticoW = 82;
  const porticoH = 60;
  const porticoX = x + w / 2 - porticoW / 2;
  const porticoY = y + h - porticoH;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(porticoX - 6, porticoY - 10, porticoW + 12, 10); // Pediment beam
  ctx.fillRect(porticoX, porticoY, 9, porticoH); // Left column
  ctx.fillRect(porticoX + porticoW - 9, porticoY, 9, porticoH); // Right column

  // Double Wood Entrance Doors
  ctx.fillStyle = isNearby ? '#6366f1' : '#4338ca';
  ctx.fillRect(porticoX + 13, porticoY, porticoW - 26, porticoH);

  // Signage: RichAcademy
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 13px serif';
  ctx.textAlign = 'center';
  ctx.fillText('RichAcademy', x + w / 2, facadeY + 22);
}

function renderClassroomWindow(
  ctx: CanvasRenderingContext2D,
  wx: number,
  wy: number,
  ww: number,
  wh: number
) {
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(wx, wy, ww, wh);

  const grad = ctx.createLinearGradient(wx, wy, wx, wy + wh);
  grad.addColorStop(0, '#0284c7');
  grad.addColorStop(0.6, '#38bdf8');
  grad.addColorStop(1, '#bae6fd');
  ctx.fillStyle = grad;
  ctx.fillRect(wx + 2, wy + 2, ww - 4, wh - 4);

  // Window Panes
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(wx + ww / 2, wy);
  ctx.lineTo(wx + ww / 2, wy + wh);
  ctx.stroke();
}

/* --------------------------------------------------------------------------
   6. RICHLOGISTICS - Warehouse with Roll-Up Loading Bays (South Far-Left)
   -------------------------------------------------------------------------- */
function render2p5DRichLogistics(
  ctx: CanvasRenderingContext2D,
  _b: Building,
  x: number,
  y: number,
  w: number,
  h: number,
  H: number,
  isNearby: boolean
) {
  const roofY = y - H;

  // A. 2.5D East (Right) Side Wall
  const sideW = 26;
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.moveTo(x + w, roofY + 12);
  ctx.lineTo(x + w + sideW, roofY + 24);
  ctx.lineTo(x + w + sideW, y + h + 6);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();

  // B. 2.5D Roof Deck (with solar arrays & vents)
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(x, roofY, w, 48);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, roofY, w, 48);

  // Solar Panels on Roof
  for (let px = x + 24; px < x + w - 40; px += 46) {
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(px, roofY + 12, 38, 20);
  }

  // C. Front Facade (Industrial Ribbed Siding with Yellow Hazard Trim)
  const facadeY = roofY + 44;
  const facadeH = y + h - facadeY;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, facadeY, w, facadeH);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, facadeY, w, facadeH);

  // Safety Amber Stripe
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(x, facadeY + 30, w, 9);

  // 3 Deep Loading Dock Bays with Roll-Up Doors (from reference image)
  const bayW = 72;
  const bayH = 72;
  const bays = [x + 24, x + 108, x + 192];

  for (const bx of bays) {
    // Metal Shutter Roll Door
    ctx.fillStyle = '#475569';
    ctx.fillRect(bx, y + h - bayH, bayW, bayH);

    // Roll Slats
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    for (let sy = y + h - bayH; sy < y + h; sy += 8) {
      ctx.beginPath();
      ctx.moveTo(bx, sy);
      ctx.lineTo(bx + bayW, sy);
      ctx.stroke();
    }

    // Dock Rubber Bumpers
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bx - 3, y + h - 16, 3, 16);
    ctx.fillRect(bx + bayW, y + h - 16, 3, 16);
  }

  // Office Annex Entrance (Right Side)
  const doorW = 52;
  const doorH = 48;
  const doorX = x + w - 64;
  const doorY = y + h - doorH;

  ctx.fillStyle = isNearby ? '#f59e0b' : '#b45309';
  ctx.fillRect(doorX, doorY, doorW, doorH);

  // Signage: RichLogistics
  ctx.fillStyle = '#0f172a';
  ctx.font = '800 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RichLogistics', x + w / 2, facadeY + 20);
}

/* --------------------------------------------------------------------------
   7. RICHMART - Supermarket with Red/Orange Striped Canopy (South Mid-Left)
   -------------------------------------------------------------------------- */
function render2p5DRichMart(
  ctx: CanvasRenderingContext2D,
  _b: Building,
  x: number,
  y: number,
  w: number,
  h: number,
  H: number,
  isNearby: boolean
) {
  const roofY = y - H;

  // A. 2.5D East (Right) Side Wall
  const sideW = 22;
  ctx.fillStyle = '#c2410c';
  ctx.beginPath();
  ctx.moveTo(x + w, roofY + 10);
  ctx.lineTo(x + w + sideW, roofY + 22);
  ctx.lineTo(x + w + sideW, y + h + 6);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();

  // B. 2.5D Roof Deck
  ctx.fillStyle = '#fff7ed';
  ctx.fillRect(x, roofY, w, 44);
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, roofY, w, 44);

  // C. Front Facade with Red/Orange Striped Canopy (from reference image)
  const facadeY = roofY + 40;
  const facadeH = y + h - facadeY;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, facadeY, w, facadeH);
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, facadeY, w, facadeH);

  // Red & White Striped Awning across the storefront
  const awningH = 24;
  const awningY = facadeY + 28;
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(x, awningY, w, awningH);

  ctx.fillStyle = '#ffffff';
  for (let ax = x; ax < x + w; ax += 16) {
    ctx.fillRect(ax, awningY, 8, awningH);
  }

  // Display Vitrine Windows
  const winW = 88;
  const winH = 54;
  renderClassroomWindow(ctx, x + 16, facadeY + 58, winW, winH);
  renderClassroomWindow(ctx, x + w - winW - 16, facadeY + 58, winW, winH);

  // Customer Automatic Entrance
  const doorW = 72;
  const doorH = 52;
  const doorX = x + w / 2 - doorW / 2;
  const doorY = y + h - doorH;

  ctx.fillStyle = isNearby ? '#f97316' : '#c2410c';
  ctx.fillRect(doorX, doorY, doorW, doorH);

  // Signage: RichMart
  ctx.fillStyle = '#ea580c';
  ctx.font = '800 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RichMart', x + w / 2, facadeY + 20);
}

/* --------------------------------------------------------------------------
   8. RICHSTAY - Hotel with Porte-Cochère Canopy & Balconies (South Center)
   -------------------------------------------------------------------------- */
function render2p5DRichStay(
  ctx: CanvasRenderingContext2D,
  _b: Building,
  x: number,
  y: number,
  w: number,
  h: number,
  H: number,
  isNearby: boolean
) {
  const roofY = y - H;

  // A. 2.5D Roof Deck with Cocktail Terrace & Swimming Pool (from reference image)
  ctx.fillStyle = '#f5f3ff';
  ctx.fillRect(x + 10, roofY, w - 20, 48);
  ctx.strokeStyle = '#7c3aed';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x + 10, roofY, w - 20, 48);

  // Rooftop Swimming Pool & Parasols
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + 26, roofY + 12, 52, 22);

  // B. Front Facade with Multi-Floor Balconies
  const facadeY = roofY + 44;
  const facadeH = y + h - facadeY;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, facadeY, w, facadeH);
  ctx.strokeStyle = '#7c3aed';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, facadeY, w, facadeH);

  // Guest Room Balconies
  for (let by = facadeY + 36; by < facadeY + facadeH - 64; by += 40) {
    for (let bx = x + 20; bx < x + w - 40; bx += 60) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(bx + 6, by - 6, 38, 28);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.strokeStyle = '#7c3aed';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by + 14, 50, 14);
      ctx.fillRect(bx, by + 14, 50, 14);
    }
  }

  // Grand Porte-Cochère Driveway Canopy (from reference image)
  const canopyW = 114;
  const canopyH = 28;
  const canopyX = x + w / 2 - canopyW / 2;
  const canopyY = y + h - 60;

  ctx.fillStyle = '#4c1d95';
  ctx.beginPath();
  ctx.roundRect(canopyX, canopyY, canopyW, canopyH, [12, 12, 2, 2]);
  ctx.fill();

  // Dual Support Brass Pillars
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(canopyX + 8, canopyY + canopyH, 6, 32);
  ctx.fillRect(canopyX + canopyW - 14, canopyY + canopyH, 6, 32);

  // Red Carpet Runner Under Canopy
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(canopyX + canopyW / 2 - 16, canopyY + canopyH, 32, 32);

  // Lobby Entrance
  const doorW = 62;
  const doorH = 48;
  const doorX = x + w / 2 - doorW / 2;
  const doorY = y + h - doorH;

  ctx.fillStyle = isNearby ? '#a78bfa' : '#6d28d9';
  ctx.fillRect(doorX, doorY, doorW, doorH);

  // Signage: RichStay
  ctx.fillStyle = '#7c3aed';
  ctx.font = '800 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RichStay', x + w / 2, facadeY + 22);
}

/* --------------------------------------------------------------------------
   9. RICHFOODS - Restaurant & Cafe with Outdoor Patio (South Mid-Right)
   -------------------------------------------------------------------------- */
function render2p5DRichFoods(
  ctx: CanvasRenderingContext2D,
  _b: Building,
  x: number,
  y: number,
  w: number,
  h: number,
  H: number,
  isNearby: boolean
) {
  const roofY = y - H;

  // A. 2.5D West (Left) Side Wall
  const sideW = 22;
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.moveTo(x, roofY + 10);
  ctx.lineTo(x - sideW, roofY + 22);
  ctx.lineTo(x - sideW, y + h + 6);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fill();

  // B. 2.5D Roof Deck
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(x, roofY, w, 40);
  ctx.strokeStyle = '#450a0a';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, roofY, w, 40);

  // Exhaust Duct on Roof
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(x + 30, roofY + 8, 16, 20);

  // C. Front Facade with Striped Awning & Dining Windows
  const facadeY = roofY + 36;
  const facadeH = y + h - facadeY;

  ctx.fillStyle = '#fee2e2';
  ctx.fillRect(x, facadeY, w, facadeH);
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, facadeY, w, facadeH);

  // Crimson & Cream Striped Canvas Dining Awning
  const awningH = 28;
  const awningY = facadeY + 28;
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(x + 8, awningY, w - 16, awningH);

  ctx.fillStyle = '#fef2f2';
  for (let ax = x + 8; ax < x + w - 16; ax += 18) {
    ctx.fillRect(ax, awningY, 9, awningH);
  }

  // Large Dining Room Windows
  renderClassroomWindow(ctx, x + 16, facadeY + 62, 72, 44);
  renderClassroomWindow(ctx, x + w - 88, facadeY + 62, 72, 44);

  // Bistro Entrance
  const doorW = 54;
  const doorH = 50;
  const doorX = x + w / 2 - doorW / 2;
  const doorY = y + h - doorH;

  ctx.fillStyle = isNearby ? '#ef4444' : '#b91c1c';
  ctx.fillRect(doorX, doorY, doorW, doorH);

  // Signage: RichFoods
  ctx.fillStyle = '#dc2626';
  ctx.font = '800 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RichFoods', x + w / 2, facadeY + 20);
}

/* --------------------------------------------------------------------------
   10. RICHHEALTH - Hospital & Medical Center with Helipad (South Right)
   -------------------------------------------------------------------------- */
function render2p5DRichHealth(
  ctx: CanvasRenderingContext2D,
  _b: Building,
  x: number,
  y: number,
  w: number,
  h: number,
  H: number,
  isNearby: boolean,
  time: number,
  prefersReducedMotion: boolean
) {
  const roofY = y - H;

  // A. 2.5D West (Left) Side Wall
  const sideW = 24;
  ctx.fillStyle = '#0e7490';
  ctx.beginPath();
  ctx.moveTo(x, roofY + 12);
  ctx.lineTo(x - sideW, roofY + 24);
  ctx.lineTo(x - sideW, y + h + 6);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fill();

  // B. 2.5D Roof Deck (with Emergency Helipad on the Right)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(x, roofY, w, 48);
  ctx.strokeStyle = '#0891b2';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, roofY, w, 48);

  // Helipad on the Right Side of Roof (from reference image)
  const heliX = x + w - 48;
  const heliY = roofY + 24;
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(heliX, heliY, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(heliX, heliY, 17, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('H', heliX, heliY);

  const strobe = prefersReducedMotion ? 1 : Math.sin(time * 6);
  ctx.fillStyle = strobe > 0 ? '#facc15' : '#713f12';
  ctx.beginPath();
  ctx.arc(heliX - 17, heliY, 2.8, 0, Math.PI * 2);
  ctx.arc(heliX + 17, heliY, 2.8, 0, Math.PI * 2);
  ctx.fill();

  // C. Front Facade: Main Clinical Tower + Emergency Wing (from reference image)
  const facadeY = roofY + 44;
  const facadeH = y + h - facadeY;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, facadeY, w, facadeH);
  ctx.strokeStyle = '#0891b2';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, facadeY, w, facadeH);

  // Red Medical Cross Emblem
  const crossX = x + 40;
  const crossY = facadeY + 20;
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(crossX - 3.5, crossY - 11, 7, 22);
  ctx.fillRect(crossX - 11, crossY - 3.5, 22, 7);

  // Emergency Wing (Right Side) with Red "EMERGENCY" Sign
  const erW = 92;
  const erX = x + w - erW;
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(erX + 8, facadeY + 14, erW - 16, 18);
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 8.5px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('EMERGENCY', erX + erW / 2, facadeY + 23);

  // Emergency Bay Hatched Markings on Ground
  ctx.fillStyle = '#fee2e2';
  ctx.fillRect(erX + 8, y + h - 42, erW - 16, 40);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 1.8;
  for (let hx = erX + 12; hx < erX + erW - 12; hx += 12) {
    ctx.beginPath();
    ctx.moveTo(hx, y + h - 42);
    ctx.lineTo(hx + 12, y + h - 2);
    ctx.stroke();
  }

  // Clinical Windows
  renderClassroomWindow(ctx, x + 22, facadeY + 42, 74, 26);

  // Main Outpatient Entrance
  const doorW = 64;
  const doorH = 50;
  const doorX = x + 64;
  const doorY = y + h - doorH;

  ctx.fillStyle = isNearby ? '#22d3ee' : '#0891b2';
  ctx.fillRect(doorX, doorY, doorW, doorH);

  // Signage: RichHealth
  ctx.fillStyle = '#0891b2';
  ctx.font = '800 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RichHealth', x + 118, facadeY + 20);
}

/* --------------------------------------------------------------------------
   11. TRANSIT STATION - Modern Vaulted Arched Terminal (South Far-Right)
   -------------------------------------------------------------------------- */
function render2p5DTransitStation(
  ctx: CanvasRenderingContext2D,
  _b: Building,
  x: number,
  y: number,
  w: number,
  h: number,
  H: number,
  isNearby: boolean,
  time: number,
  prefersReducedMotion: boolean
) {
  const roofY = y - H;

  // Modern Vaulted Arched Glass & Tubular Steel Canopy (from reference image)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(x, roofY, w, 48);
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, roofY, w, 48);

  // Vaulted Glass Ribs
  ctx.strokeStyle = 'rgba(5, 150, 105, 0.75)';
  ctx.lineWidth = 3.5;
  for (let cx = x + 34; cx < x + w - 20; cx += 48) {
    ctx.beginPath();
    ctx.arc(cx, roofY + 24, 24, Math.PI, 0);
    ctx.stroke();
  }

  // Railway Tracks with Ballast Gravel & Twin Steel Rails
  const trackY = y + 10;
  const trackW = w - 20;
  const trackX = x + 10;

  ctx.fillStyle = '#64748b'; // Ballast
  ctx.fillRect(trackX, trackY, trackW, 26);

  // Wooden Sleepers
  ctx.fillStyle = '#78350f';
  for (let sx = trackX + 6; sx < trackX + trackW - 6; sx += 12) {
    ctx.fillRect(sx, trackY + 2, 5, 22);
  }

  // Twin Steel Rails
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(trackX, trackY + 5, trackW, 3);
  ctx.fillRect(trackX, trackY + 18, trackW, 3);

  // HIGH-SPEED PASSENGER COMMUTER TRAIN ON TRACKS (from reference image)
  const trainW = trackW - 44;
  const trainH = 28;
  const trainX = trackX + 22;
  const trainY = trackY - 5;

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(trainX, trainY, trainW, trainH, [10, 10, 2, 2]);
  ctx.fill();
  ctx.stroke();

  // Transit Blue / Green Line Stripe
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(trainX, trainY + 15, trainW, 5);

  // Train Passenger Windows
  for (let twx = trainX + 16; twx < trainX + trainW - 16; twx += 28) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(twx, trainY + 4, 18, 9);
  }

  // Passenger Boarding Platform (Raised with Yellow Tactile Warning Pavers)
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(x + 10, y + 44, w - 20, h - 52);

  ctx.fillStyle = '#facc15';
  ctx.fillRect(x + 10, y + 44, w - 20, 6); // Yellow tactile warning edge

  // Live Digital Departures Board
  const boardX = x + w / 2 - 76;
  const boardY = y + 56;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(boardX, boardY, 152, 18);

  ctx.fillStyle = '#34d399';
  ctx.font = '700 8.5px monospace';
  ctx.textAlign = 'center';
  const dot = prefersReducedMotion || Math.floor(time * 2) % 2 === 0 ? '●' : ' ';
  ctx.fillText(`${dot} LINE 1 - ARRIVING NOW`, x + w / 2, boardY + 12);

  // Concourse Entrance
  const doorW = 82;
  const doorH = 46;
  const doorX = x + w / 2 - doorW / 2;
  const doorY = y + h - doorH;

  ctx.fillStyle = isNearby ? '#10b981' : '#047857';
  ctx.fillRect(doorX, doorY, doorW, doorH);

  // Signage: Transit Station
  ctx.fillStyle = '#059669';
  ctx.font = '800 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Transit Station', x + w / 2, roofY + 36);
}

/* ==========================================================================
   URBAN OBJECTS & VEHICLES (Cars, Vans, Ambulance, Bus, Trees, Streetlights)
   ========================================================================== */

function getObjectAnchorY(obj: EnvironmentObject): number {
  if (obj.type === 'tree') return obj.y + 16;
  if (obj.type === 'car') return obj.direction === 'vertical' ? obj.y + 24 : obj.y + 14;
  if (obj.type === 'van') return obj.direction === 'vertical' ? obj.y + 30 : obj.y + 16;
  if (obj.type === 'ambulance') return obj.direction === 'vertical' ? obj.y + 28 : obj.y + 15;
  if (obj.type === 'bus') return obj.direction === 'vertical' ? obj.y + 40 : obj.y + 16;
  if (obj.type === 'patio-table') return obj.y + 12;
  if (obj.type === 'streetlight') return obj.y + 6;
  if (obj.type === 'bench') return obj.y + 8;
  if (obj.type === 'planter') return obj.y + 8;
  if (obj.type === 'flagpole') return obj.y + 2;
  return obj.y;
}

function renderSingleUrbanObject(
  ctx: CanvasRenderingContext2D,
  obj: EnvironmentObject,
  time: number,
  prefersReducedMotion: boolean
) {
  switch (obj.type) {
    case 'car':
      renderCar(ctx, obj.x, obj.y, obj.direction === 'vertical', obj.color || '#38bdf8');
      break;
    case 'van':
      renderDeliveryVan(ctx, obj.x, obj.y, obj.direction === 'vertical', obj.color || '#f59e0b');
      break;
    case 'ambulance':
      renderAmbulance(ctx, obj.x, obj.y, obj.direction === 'vertical', time, prefersReducedMotion);
      break;
    case 'bus':
      renderCityBus(ctx, obj.x, obj.y, obj.direction === 'vertical', obj.color || '#0284c7');
      break;
    case 'patio-table':
      renderPatioTable(ctx, obj.x, obj.y, obj.color || '#dc2626');
      break;
    case 'streetlight':
      renderModernStreetlight(ctx, obj.x, obj.y, time, prefersReducedMotion);
      break;
    case 'bench':
      renderModernBench(ctx, obj.x, obj.y);
      break;
    case 'planter':
      renderModernPlanter(ctx, obj.x, obj.y);
      break;
    case 'trash-bin':
      renderTrashBin(ctx, obj.x, obj.y);
      break;
    case 'bike-rack':
      renderBikeRack(ctx, obj.x, obj.y);
      break;
    case 'flagpole':
      renderFlagpole(ctx, obj.x, obj.y, obj.color || '#0284c7', time, prefersReducedMotion);
      break;
    case 'tree':
      renderUrbanTree(ctx, obj.x, obj.y, obj.variant || 0);
      break;
    case 'bush':
      renderManicuredBush(ctx, obj.x, obj.y);
      break;
  }
}

/**
 * Animated City Traffic moving along Grand Civic Boulevard
 */
function addMovingTrafficEntities(
  entities: DepthEntity[],
  ctx: CanvasRenderingContext2D,
  time: number,
  prefersReducedMotion: boolean
) {
  if (prefersReducedMotion) return;

  // Car 1: Westbound on North lane of Grand Civic Boulevard (y = 845)
  const car1X = 2600 - ((time * 85) % 2500);
  entities.push({
    y: 845 + 12,
    render: () => {
      renderCar(ctx, car1X, 845, false, '#ef4444');
    },
  });

  // Car 2: Eastbound on South lane of Grand Civic Boulevard (y = 910)
  const car2X = 150 + ((time * 75 + 400) % 2500);
  entities.push({
    y: 910 + 12,
    render: () => {
      renderCar(ctx, car2X, 910, false, '#facc15');
    },
  });

  // Car 3: Southbound on Central Promenade (x = 1320)
  const car3Y = 460 + ((time * 60 + 200) % 1300);
  // Only draw if outside fountain roundabout circle
  if (Math.hypot(1320 - 1350, car3Y - 1000) > 190) {
    entities.push({
      y: car3Y + 22,
      render: () => {
        renderCar(ctx, 1320, car3Y, true, '#ffffff');
      },
    });
  }
}

/**
 * 2.5D Parked / Moving Sedan Car
 */
function renderCar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  isVertical: boolean,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);

  const length = 48;
  const width = 24;

  if (isVertical) {
    // Drop shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.26)';
    ctx.beginPath();
    ctx.roundRect(-width / 2 + 3, -length / 2 + 5, width, length, 8);
    ctx.fill();

    // Car Body
    ctx.fillStyle = color;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-width / 2, -length / 2, width, length, 6);
    ctx.fill();
    ctx.stroke();

    // Windshield & Rear Window
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-width / 2 + 3, -length / 2 + 9, width - 6, 7);
    ctx.fillRect(-width / 2 + 3, length / 2 - 15, width - 6, 6);

    // Roof Highlight
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(-width / 2 + 4, -length / 2 + 16, width - 8, length - 31);
    ctx.globalAlpha = 1.0;

    // Headlights
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-width / 2 + 2, -length / 2, 4, 2.5);
    ctx.fillRect(width / 2 - 6, -length / 2, 4, 2.5);

    // Tail lights
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-width / 2 + 2, length / 2 - 2.5, 4, 2.5);
    ctx.fillRect(width / 2 - 6, length / 2 - 2.5, 4, 2.5);
  } else {
    // Drop shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.26)';
    ctx.beginPath();
    ctx.roundRect(-length / 2 + 4, -width / 2 + 5, length, width, 8);
    ctx.fill();

    // Car Body
    ctx.fillStyle = color;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-length / 2, -width / 2, length, width, 6);
    ctx.fill();
    ctx.stroke();

    // Windshield & Rear Window
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-length / 2 + 9, -width / 2 + 3, 7, width - 6);
    ctx.fillRect(length / 2 - 15, -width / 2 + 3, 6, width - 6);

    // Roof Highlight
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(-length / 2 + 16, -width / 2 + 3, length - 31, width - 6);
    ctx.globalAlpha = 1.0;

    // Headlights
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-length / 2, -width / 2 + 2, 2.5, 4);
    ctx.fillRect(-length / 2, width / 2 - 6, 2.5, 4);

    // Tail lights
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(length / 2 - 2.5, -width / 2 + 2, 2.5, 4);
    ctx.fillRect(length / 2 - 2.5, width / 2 - 6, 2.5, 4);
  }

  ctx.restore();
}

/**
 * 2.5D Delivery Box Truck (RichLogistics Fleet)
 */
function renderDeliveryVan(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  _isVertical: boolean,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);

  const length = 58;
  const width = 30;

  // Drop shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.32)';
  ctx.beginPath();
  ctx.roundRect(-width / 2 + 4, -length / 2 + 5, width, length, 6);
  ctx.fill();

  // Truck Body
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-width / 2, -length / 2, width, length, 4);
  ctx.fill();
  ctx.stroke();

  // Cab Front
  ctx.fillStyle = color;
  ctx.fillRect(-width / 2, -length / 2, width, 15);

  // Cab Windshield
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-width / 2 + 3, -length / 2 + 6, width - 6, 7);

  // Cargo Box Roof Ribs
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.16)';
  ctx.lineWidth = 1.5;
  for (let ry = -length / 2 + 22; ry < length / 2 - 4; ry += 7) {
    ctx.beginPath();
    ctx.moveTo(-width / 2 + 3, ry);
    ctx.lineTo(width / 2 - 3, ry);
    ctx.stroke();
  }

  // Logistics Logo on Truck Roof
  ctx.fillStyle = '#f59e0b';
  ctx.font = '800 7.5px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RL', 0, 9);

  ctx.restore();
}

/**
 * 2.5D Hospital Ambulance Vehicle
 */
function renderAmbulance(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  _isVertical: boolean,
  time: number,
  prefersReducedMotion: boolean
) {
  ctx.save();
  ctx.translate(x, y);

  const length = 54;
  const width = 28;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
  ctx.beginPath();
  ctx.roundRect(-width / 2 + 3, -length / 2 + 5, width, length, 6);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-width / 2, -length / 2, width, length, 6);
  ctx.fill();
  ctx.stroke();

  // Red & Cyan Emergency Side Stripes
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-width / 2, -2, width, 4.5);
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(-width / 2, 2.5, width, 2.5);

  // Cab Windshield
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-width / 2 + 3, -length / 2 + 7, width - 6, 8);

  // Red Medical Cross on Roof
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-3.5, 9, 7, 16);
  ctx.fillRect(-8, 13.5, 16, 7);

  // Flashing Emergency Lightbar
  const flash = prefersReducedMotion ? 1 : Math.sin(time * 8);
  ctx.fillStyle = flash > 0 ? '#ef4444' : '#3b82f6';
  ctx.beginPath();
  ctx.roundRect(-width / 2 + 6, -length / 2 + 16, width - 12, 4.5, 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 2.5D City Transit Bus at Transit Station (from reference image)
 */
function renderCityBus(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  _isVertical: boolean,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);

  const length = 78;
  const width = 28;

  // Drop shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
  ctx.beginPath();
  ctx.roundRect(-length / 2 + 4, -width / 2 + 5, length, width, 6);
  ctx.fill();

  // Bus White & Blue Body
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-length / 2, -width / 2, length, width, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.fillRect(-length / 2, width / 2 - 7, length, 7);

  // Tinted Windows along both sides
  ctx.fillStyle = '#0f172a';
  for (let wx = -length / 2 + 8; wx < length / 2 - 10; wx += 14) {
    ctx.fillRect(wx, -width / 2 + 3, 10, 6);
    ctx.fillRect(wx, width / 2 - 9, 10, 6);
  }

  // Front Destination LED Sign
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-length / 2 + 2, -width / 2 + 6, 4, width - 12);

  ctx.restore();
}

function renderShoppingCartCorral(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.16)';
  ctx.fillRect(x - 16, y - 6, 32, 24);

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 14, y - 10, 28, 22);

  ctx.fillStyle = '#facc15';
  ctx.fillRect(x - 16, y - 12, 4, 6);
  ctx.fillRect(x + 12, y - 12, 4, 6);

  ctx.fillStyle = '#94a3b8';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  for (let cy = y - 6; cy < y + 8; cy += 4) {
    ctx.strokeRect(x - 10, cy, 20, 3);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x - 10, cy, 20, 1.2);
  }
}

function renderCargoPallets(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
  ctx.fillRect(x - 14, y - 4, 30, 20);

  ctx.fillStyle = '#92400e';
  ctx.fillRect(x - 12, y - 2, 26, 16);

  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1.5;
  for (let py = y; py < y + 14; py += 4) {
    ctx.beginPath();
    ctx.moveTo(x - 12, py);
    ctx.lineTo(x + 14, py);
    ctx.stroke();
  }

  ctx.fillStyle = '#d97706';
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1;
  ctx.fillRect(x - 10, y - 10, 12, 10);
  ctx.strokeRect(x - 10, y - 10, 12, 10);

  ctx.fillRect(x + 3, y - 8, 10, 8);
  ctx.strokeRect(x + 3, y - 8, 10, 8);
}

function renderFlagpole(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  flagColor: string,
  time: number,
  prefersReducedMotion: boolean
) {
  ctx.fillStyle = '#475569';
  ctx.fillRect(x - 3, y - 2, 6, 4);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 36);
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(x, y - 36, 2.5, 0, Math.PI * 2);
  ctx.fill();

  const wave = prefersReducedMotion ? 0 : Math.sin(time * 3 + x) * 2;
  ctx.fillStyle = flagColor;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y - 35);
  ctx.lineTo(x + 18, y - 32 + wave);
  ctx.lineTo(x + 18, y - 22 + wave);
  ctx.lineTo(x, y - 28);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function renderPatioTable(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  umbrellaColor: string
) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
  ctx.beginPath();
  ctx.arc(x + 5, y + 6, 17, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = umbrellaColor;
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fffbeb';
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, 16, (i * Math.PI) / 2, (i * Math.PI) / 2 + Math.PI / 4);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
}

function renderModernStreetlight(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number,
  prefersReducedMotion: boolean
) {
  const pulse = prefersReducedMotion ? 1 : 1 + Math.sin(time * 2 + x) * 0.04;
  const radius = 34 * pulse;
  const glow = ctx.createRadialGradient(x, y + 8, 2, x, y + 8, radius);
  glow.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
  glow.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y + 8, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.arc(x, y + 2, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#64748b';
  ctx.fillRect(x - 1.5, y - 24, 3, 26);

  ctx.fillStyle = '#334155';
  ctx.fillRect(x - 1.5, y - 26, 12, 3);

  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x + 4, y - 24, 6, 2);
}

function renderModernBench(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.16)';
  ctx.fillRect(x - 14, y + 4, 28, 6);

  ctx.fillStyle = '#334155';
  ctx.fillRect(x - 13, y - 4, 3, 10);
  ctx.fillRect(x + 10, y - 4, 3, 10);

  ctx.fillStyle = '#b45309';
  ctx.fillRect(x - 14, y - 6, 28, 4);
  ctx.fillRect(x - 14, y - 1, 28, 4);

  ctx.fillStyle = '#d97706';
  ctx.fillRect(x - 13, y - 5, 26, 1.5);
}

function renderModernPlanter(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
  ctx.beginPath();
  ctx.roundRect(x - 14, y - 6, 28, 16, 4);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x - 12, y - 8, 24, 16, 3);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - 9, y - 6, 18, 12);

  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.arc(x - 4, y, 6, 0, Math.PI * 2);
  ctx.arc(x + 4, y, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.arc(x, y - 2, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(x, y - 2, 2, 0, Math.PI * 2);
  ctx.fill();
}

function renderTrashBin(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
  ctx.fillRect(x - 9, y + 2, 18, 5);

  ctx.fillStyle = '#475569';
  ctx.fillRect(x - 8, y - 12, 7, 14);

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x + 1, y - 12, 7, 14);

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(x - 9, y - 14, 18, 3);
}

function renderBikeRack(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  for (let ox = -14; ox <= 14; ox += 14) {
    ctx.beginPath();
    ctx.roundRect(x + ox - 4, y - 14, 8, 16, [4, 4, 0, 0]);
    ctx.stroke();
  }
}

function renderUrbanTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  variant: number
) {
  // Cast-Iron Sidewalk Tree Grate
  ctx.fillStyle = '#475569';
  ctx.fillRect(x - 14, y - 4, 28, 18);
  ctx.fillStyle = '#334155';
  ctx.fillRect(x - 12, y - 2, 24, 14);

  // Soft Ground Shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.24)';
  ctx.beginPath();
  ctx.ellipse(x + 5, y + 16, 26, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tree Trunk
  ctx.fillStyle = '#854d0e';
  ctx.fillRect(x - 4, y - 14, 8, 22);

  const palettes = [
    ['#15803d', '#22c55e', '#86efac'],
    ['#166534', '#16a34a', '#4ade80'],
    ['#047857', '#10b981', '#6ee7b7'],
  ];
  const [dark, mid, light] = palettes[variant % palettes.length];

  // Layered 2.5D Foliage Canopy
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.arc(x - 12, y - 22, 18, 0, Math.PI * 2);
  ctx.arc(x + 12, y - 22, 18, 0, Math.PI * 2);
  ctx.arc(x, y - 36, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = mid;
  ctx.beginPath();
  ctx.arc(x - 8, y - 28, 15, 0, Math.PI * 2);
  ctx.arc(x + 8, y - 28, 15, 0, Math.PI * 2);
  ctx.arc(x, y - 40, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = light;
  ctx.beginPath();
  ctx.arc(x - 4, y - 44, 7, 0, Math.PI * 2);
  ctx.fill();
}

function renderManicuredBush(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
  ctx.beginPath();
  ctx.ellipse(x + 2, y + 4, 16, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.roundRect(x - 16, y - 10, 32, 16, 8);
  ctx.fill();

  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.roundRect(x - 14, y - 12, 28, 12, 6);
  ctx.fill();
}

/* ==========================================================================
   PASS 3: OVERLAYS (Integrated Signboards, Name Tags, Particles)
   ========================================================================== */

function render2p5DSignboard(
  ctx: CanvasRenderingContext2D,
  b: Building,
  cx: number,
  cy: number,
  isNearby: boolean,
  time: number,
  prefersReducedMotion: boolean
) {
  const floatY = prefersReducedMotion ? cy : cy + Math.sin(time * 2.5 + cx) * 2;

  ctx.save();
  ctx.translate(cx, floatY);

  ctx.font = '800 12px system-ui, -apple-system, sans-serif';
  const nameWidth = ctx.measureText(b.name).width;
  ctx.font = '700 8px monospace';
  const catWidth = ctx.measureText(b.category.toUpperCase()).width;

  const cardWidth = Math.max(nameWidth, catWidth) + 38;
  const cardHeight = 34;

  // Drop shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.24)';
  ctx.beginPath();
  ctx.roundRect(-cardWidth / 2 + 3, -cardHeight / 2 + 4, cardWidth, cardHeight, 8);
  ctx.fill();

  // Frosted Glass Base
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = isNearby ? b.themeColor : '#cbd5e1';
  ctx.lineWidth = isNearby ? 2.5 : 1.5;
  ctx.beginPath();
  ctx.roundRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 8);
  ctx.fill();
  ctx.stroke();

  // Category Tag
  ctx.fillStyle = b.themeColor;
  ctx.font = '800 7.5px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(b.category.toUpperCase(), -cardWidth / 2 + 12, -cardHeight / 2 + 5);

  // Building Name
  ctx.fillStyle = '#0f172a';
  ctx.font = '800 11.5px system-ui, -apple-system, sans-serif';
  ctx.textBaseline = 'bottom';
  ctx.fillText(b.name, -cardWidth / 2 + 12, cardHeight / 2 - 4);

  // Status Indicator Beacon
  ctx.fillStyle = isNearby ? '#10b981' : b.themeColor;
  ctx.beginPath();
  ctx.arc(cardWidth / 2 - 10, 0, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function renderPlayerNameTagOverlay(
  ctx: CanvasRenderingContext2D,
  player: PlayerCharacter,
  isNearbyBuilding: boolean
) {
  const { x, y } = player.position;
  const tagY = y - 48;
  const name = player.name;

  ctx.save();
  ctx.font = '700 11px system-ui, -apple-system, sans-serif';
  const nameWidth = ctx.measureText(name).width;
  const pillW = nameWidth + 30;
  const pillH = 20;

  // Glassmorphic Name Pill Background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.shadowColor = 'rgba(15, 23, 42, 0.16)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;

  ctx.beginPath();
  ctx.roundRect(x - pillW / 2, tagY - pillH / 2, pillW, pillH, 9999);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Light Blue Border
  ctx.strokeStyle = '#93c5fd';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Downward Pointer Triangle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.moveTo(x - 3, tagY + pillH / 2);
  ctx.lineTo(x + 3, tagY + pillH / 2);
  ctx.lineTo(x, tagY + pillH / 2 + 3.5);
  ctx.closePath();
  ctx.fill();

  // Live Pulse Dot
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(x - pillW / 2 + 9, tagY, 3, 0, Math.PI * 2);
  ctx.fill();

  // Player Name Text
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, x - pillW / 2 + 16, tagY);

  // Nearby Building Interactive "E" Bubble
  if (isNearbyBuilding) {
    const bubbleY = y - 70;
    ctx.fillStyle = '#2563eb';
    ctx.shadowColor = 'rgba(37, 99, 235, 0.5)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(x, bubbleY, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('E', x, bubbleY);
  }

  ctx.restore();
}

function renderParticles(ctx: CanvasRenderingContext2D, particles: AmbientParticle[]) {
  ctx.save();
  for (const p of particles) {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* ==========================================================================
   DYNAMIC 2.5D OVERLAYS (Fountain Ripples, Traffic Fleet, Beacons, Doors)
   ========================================================================== */

function renderDynamicFountainEffects(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  time: number,
  prefersReducedMotion: boolean
) {
  ctx.save();

  // Translucent glowing water pool core
  const glow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 68);
  glow.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
  glow.addColorStop(0.7, 'rgba(2, 132, 199, 0.22)');
  glow.addColorStop(1, 'rgba(2, 132, 199, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, 68, 0, Math.PI * 2);
  ctx.fill();

  if (!prefersReducedMotion) {
    // 3 Animated expanding ripple rings
    for (let i = 0; i < 3; i++) {
      const r = 18 + ((time * 26 + i * 22) % 48);
      const alpha = Math.max(0, (1 - r / 52) * 0.5);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(186, 230, 253, ${alpha})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    // Center spray sparkles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2 + time * 0.7;
      const spread = 8 + Math.sin(time * 3 + i) * 12;
      const px = cx + Math.cos(angle) * spread;
      const py = cy - 6 + Math.sin(angle) * spread * 0.5 - Math.abs(Math.sin(time * 4 + i * 1.5)) * 14;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

interface DynamicTrafficVehicle {
  y: number;
  speed: number;
  dir: 'left' | 'right';
  color: string;
  roofColor: string;
  offset: number;
}

const DYNAMIC_FLEET: DynamicTrafficVehicle[] = [
  // Westbound Boulevard (Moving Left at y ≈ 890)
  { y: 890, speed: 135, dir: 'left', color: '#0284c7', roofColor: '#0c4a6e', offset: 120 },
  { y: 890, speed: 120, dir: 'left', color: '#f8fafc', roofColor: '#334155', offset: 1500 },
  // Eastbound Boulevard (Moving Right at y ≈ 955)
  { y: 955, speed: 140, dir: 'right', color: '#dc2626', roofColor: '#450a0a', offset: 450 },
  { y: 955, speed: 125, dir: 'right', color: '#64748b', roofColor: '#1e293b', offset: 1800 },
];

function renderDynamicTrafficCars(
  ctx: CanvasRenderingContext2D,
  time: number,
  prefersReducedMotion: boolean
) {
  if (prefersReducedMotion) return;

  const t = time;
  const loopW = WORLD_WIDTH + 160;

  for (const car of DYNAMIC_FLEET) {
    let carX = 0;
    if (car.dir === 'right') {
      carX = ((t * car.speed + car.offset) % loopW) - 80;
    } else {
      carX = WORLD_WIDTH + 80 - ((t * car.speed + car.offset) % loopW);
    }

    ctx.save();
    ctx.translate(carX, car.y);

    // Car Ground Shadow
    ctx.beginPath();
    ctx.ellipse(0, 10, 24, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.fill();

    // Car Body (Stylized 2.5D isometric car)
    const isFacingLeft = car.dir === 'left';
    ctx.beginPath();
    ctx.roundRect(-22, -10, 44, 18, 5);
    ctx.fillStyle = car.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Glass Roof Cabin
    ctx.beginPath();
    ctx.roundRect(-12, -8, 22, 14, 3);
    ctx.fillStyle = car.roofColor;
    ctx.fill();

    // Windshield reflection
    ctx.beginPath();
    ctx.moveTo(isFacingLeft ? -10 : 8, -6);
    ctx.lineTo(isFacingLeft ? -6 : 4, 4);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Headlights casting soft beam
    const headX = isFacingLeft ? -22 : 22;
    const tailX = isFacingLeft ? 22 : -22;

    // Headlight bulbs
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(headX, -3, 2, 0, Math.PI * 2);
    ctx.arc(headX, 3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Soft headlight glow cone
    const beamGrad = ctx.createRadialGradient(
      headX, 0, 2,
      headX + (isFacingLeft ? -35 : 35), 0, 40
    );
    beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
    beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(headX, -5);
    ctx.lineTo(headX + (isFacingLeft ? -40 : 40), -16);
    ctx.lineTo(headX + (isFacingLeft ? -40 : 40), 16);
    ctx.lineTo(headX, 5);
    ctx.closePath();
    ctx.fill();

    // Taillights
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(tailX, -3, 1.8, 0, Math.PI * 2);
    ctx.arc(tailX, 3, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

function renderDynamicBeacons(
  ctx: CanvasRenderingContext2D,
  time: number,
  prefersReducedMotion: boolean
) {
  if (prefersReducedMotion) return;

  // 1. RICH WORLD HQ Spire Aviation Strobe (x: 1376, y: 75)
  const hqAlpha = 0.3 + Math.sin(time * 5) * 0.45;
  if (hqAlpha > 0.4) {
    ctx.save();
    const hqGlow = ctx.createRadialGradient(1376, 75, 1, 1376, 75, 20);
    hqGlow.addColorStop(0, `rgba(239, 68, 68, ${hqAlpha})`);
    hqGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = hqGlow;
    ctx.beginPath();
    ctx.arc(1376, 75, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.arc(1376, 75, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 2. RichHealth Ambulance Emergency Lightbar (x: 2360, y: 1140)
  ctx.save();
  const strobePhase = Math.floor(time * 6) % 2;
  const isRed = strobePhase === 0;
  const strobeColor = isRed ? '239, 68, 68' : '14, 165, 233';

  const ambGlow = ctx.createRadialGradient(2360, 1140, 2, 2360, 1140, 28);
  ambGlow.addColorStop(0, `rgba(${strobeColor}, 0.5)`);
  ambGlow.addColorStop(1, `rgba(${strobeColor}, 0)`);
  ctx.fillStyle = ambGlow;
  ctx.beginPath();
  ctx.arc(2360, 1140, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function renderDoorwayInteractionBeacons(
  ctx: CanvasRenderingContext2D,
  buildings: Building[],
  nearbyBuildingId: string | null,
  time: number,
  prefersReducedMotion: boolean
) {
  for (const b of buildings) {
    const isNearby = b.id === nearbyBuildingId;
    const { x, y } = b.door;

    ctx.save();
    ctx.translate(x, y);

    // Ground interaction circle
    const baseR = isNearby ? 28 : 20;
    const pulse = prefersReducedMotion ? 0 : Math.sin(time * 3 + b.door.x) * 3;
    const r = baseR + pulse;

    // Ground glow fill
    const ringGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, r);
    if (isNearby) {
      ringGrad.addColorStop(0, 'rgba(250, 204, 21, 0.45)');
      ringGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.35)');
      ringGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    } else {
      ringGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      ringGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    }
    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Subtle ring border
    ctx.strokeStyle = isNearby ? '#facc15' : 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = isNearby ? 2.2 : 1.2;
    ctx.stroke();

    // If nearby: draw floating hover badge
    if (isNearby) {
      const hoverY = -48 + (prefersReducedMotion ? 0 : Math.sin(time * 4) * 4);
      const label = `${b.name}  •  [E] Inspect`;

      ctx.font = '600 12px Inter, sans-serif';
      const textWidth = ctx.measureText(label).width;
      const pillW = textWidth + 24;
      const pillH = 26;

      // Shadow
      ctx.shadowColor = 'rgba(15, 23, 42, 0.35)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 3;

      // Glassmorphic pill
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.beginPath();
      ctx.roundRect(-pillW / 2, hoverY - pillH / 2, pillW, pillH, 13);
      ctx.fill();

      // Border
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = b.themeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Theme colored dot
      ctx.fillStyle = b.themeColor;
      ctx.beginPath();
      ctx.arc(-pillW / 2 + 10, hoverY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 4, hoverY);
    }

    ctx.restore();
  }
}

/* ==========================================================================
   EXTENDED SURROUNDING ENVIRONMENT (Seamlessly eliminates white space)
   ========================================================================== */

const EXT_LEFT = -1600;
const EXT_TOP = -1400;
const EXT_RIGHT = WORLD_WIDTH + 1600; // 4352
const EXT_BOTTOM = WORLD_HEIGHT + 1400; // 2936
const EXT_WIDTH = EXT_RIGHT - EXT_LEFT; // 5952
const EXT_HEIGHT = EXT_BOTTOM - EXT_TOP; // 4336

export function renderSurroundingEnvironment(
  ctx: CanvasRenderingContext2D,
  time: number,
  prefersReducedMotion: boolean
): void {
  ctx.save();

  // -------------------------------------------------------------
  // 1. BASE TERRAIN (South, West, East ground)
  // -------------------------------------------------------------
  ctx.fillStyle = '#5e7043';
  ctx.fillRect(EXT_LEFT, 0, EXT_WIDTH, EXT_BOTTOM);

  // Manicured lawn mowing stripes (isometric diagonal strips) in outer parklands
  ctx.save();
  ctx.fillStyle = 'rgba(110, 130, 78, 0.32)';
  for (let sx = EXT_LEFT - EXT_HEIGHT; sx < EXT_RIGHT; sx += 90) {
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx + 45, 0);
    ctx.lineTo(sx + 45 + EXT_HEIGHT, EXT_BOTTOM);
    ctx.lineTo(sx + EXT_HEIGHT, EXT_BOTTOM);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // -------------------------------------------------------------
  // 2. NORTH SKY DOME & DISTANT HORIZON (y: EXT_TOP .. 0)
  // -------------------------------------------------------------
  const skyGrad = ctx.createLinearGradient(0, EXT_TOP, 0, 40);
  skyGrad.addColorStop(0, '#3b82f6');
  skyGrad.addColorStop(0.35, '#60a5fa');
  skyGrad.addColorStop(0.7, '#93c5fd');
  skyGrad.addColorStop(0.95, '#b2d6f4'); // Matches map top edge rgb(178, 214, 244)
  skyGrad.addColorStop(1, '#b2d6f4');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(EXT_LEFT, EXT_TOP, EXT_WIDTH, -EXT_TOP + 40);

  // Subtle warm sun glow in upper right sky
  const sunGlow = ctx.createRadialGradient(3200, EXT_TOP + 300, 50, 3200, EXT_TOP + 300, 900);
  sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
  sunGlow.addColorStop(0.4, 'rgba(254, 243, 199, 0.2)');
  sunGlow.addColorStop(1, 'rgba(254, 243, 199, 0)');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(EXT_LEFT, EXT_TOP, EXT_WIDTH, -EXT_TOP);

  // Distant rolling mountain ridges & skyline hills along horizon (y: -140 .. 0)
  ctx.fillStyle = 'rgba(125, 165, 205, 0.45)';
  ctx.beginPath();
  ctx.moveTo(EXT_LEFT, 0);
  for (let x = EXT_LEFT; x <= EXT_RIGHT; x += 300) {
    const h = 70 + Math.sin(x * 0.003) * 35 + Math.cos(x * 0.007) * 20;
    ctx.lineTo(x, -h);
  }
  ctx.lineTo(EXT_RIGHT, 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(92, 130, 115, 0.55)';
  ctx.beginPath();
  ctx.moveTo(EXT_LEFT, 0);
  for (let x = EXT_LEFT; x <= EXT_RIGHT; x += 220) {
    const h = 45 + Math.cos(x * 0.004 + 1.2) * 25 + Math.sin(x * 0.009) * 15;
    ctx.lineTo(x, -h);
  }
  ctx.lineTo(EXT_RIGHT, 0);
  ctx.closePath();
  ctx.fill();

  // Distant soft cumulus clouds floating across upper sky
  const cloudOffset = prefersReducedMotion ? 0 : (time * 8) % 1800;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  const cloudClusters = [
    { x: -1200, y: -950, w: 320, h: 70 },
    { x: -400, y: -1150, w: 420, h: 85 },
    { x: 500, y: -800, w: 360, h: 75 },
    { x: 1400, y: -1050, w: 480, h: 90 },
    { x: 2300, y: -750, w: 340, h: 70 },
    { x: 3100, y: -1100, w: 400, h: 80 },
    { x: 3900, y: -850, w: 350, h: 75 },
  ];
  for (const c of cloudClusters) {
    let cx = c.x + cloudOffset;
    if (cx > EXT_RIGHT + 200) cx -= (EXT_WIDTH + 400);
    ctx.beginPath();
    ctx.ellipse(cx, c.y, c.w * 0.5, c.h * 0.5, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - c.w * 0.22, c.y + 6, c.w * 0.35, c.h * 0.45, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + c.w * 0.22, c.y + 8, c.w * 0.38, c.h * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // -------------------------------------------------------------
  // 3. WEST GRAND CIVIC BOULEVARD & PARKLAND (x: EXT_LEFT .. 0)
  // -------------------------------------------------------------
  const westRoadY = 810;
  const westRoadH = 140;

  // Concrete sidewalk borders
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(EXT_LEFT, westRoadY - 18, -EXT_LEFT + 20, 18);
  ctx.fillRect(EXT_LEFT, westRoadY + westRoadH, -EXT_LEFT + 20, 18);

  // Raised granite curb lines
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(EXT_LEFT, westRoadY);
  ctx.lineTo(20, westRoadY);
  ctx.moveTo(EXT_LEFT, westRoadY + westRoadH);
  ctx.lineTo(20, westRoadY + westRoadH);
  ctx.stroke();

  // Dark asphalt roadway
  ctx.fillStyle = '#334155';
  ctx.fillRect(EXT_LEFT, westRoadY, -EXT_LEFT + 20, westRoadH);

  // Painted double-yellow centerlines
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(EXT_LEFT, westRoadY + westRoadH / 2 - 2);
  ctx.lineTo(20, westRoadY + westRoadH / 2 - 2);
  ctx.moveTo(EXT_LEFT, westRoadY + westRoadH / 2 + 2);
  ctx.lineTo(20, westRoadY + westRoadH / 2 + 2);
  ctx.stroke();

  // White dashed lane dividers
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([18, 14]);
  ctx.beginPath();
  ctx.moveTo(EXT_LEFT, westRoadY + westRoadH * 0.25);
  ctx.lineTo(20, westRoadY + westRoadH * 0.25);
  ctx.moveTo(EXT_LEFT, westRoadY + westRoadH * 0.75);
  ctx.lineTo(20, westRoadY + westRoadH * 0.75);
  ctx.stroke();
  ctx.setLineDash([]);

  // Streetlamps along West Boulevard
  for (let x = -100; x >= EXT_LEFT; x -= 140) {
    drawCivicLampPost(ctx, x, westRoadY - 18);
    drawCivicLampPost(ctx, x, westRoadY + westRoadH + 18);
  }

  // Boulevard avenue trees lining the sidewalk
  for (let x = -60; x >= EXT_LEFT + 60; x -= 120) {
    drawSurroundingTree(ctx, x, westRoadY - 36, 18, '#3b6f2e');
    drawSurroundingTree(ctx, x + 30, westRoadY + westRoadH + 36, 19, '#437c35');
  }

  // -------------------------------------------------------------
  // 4. EAST TRANSIT CORRIDOR & RAILWAY EXTENSION (x: WORLD_WIDTH .. EXT_RIGHT)
  // -------------------------------------------------------------
  const eastRoadY = 810;
  const eastRoadH = 120;
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(WORLD_WIDTH - 20, eastRoadY - 16, EXT_RIGHT - WORLD_WIDTH + 20, 16);
  ctx.fillRect(WORLD_WIDTH - 20, eastRoadY + eastRoadH, EXT_RIGHT - WORLD_WIDTH + 20, 16);
  ctx.fillStyle = '#334155';
  ctx.fillRect(WORLD_WIDTH - 20, eastRoadY, EXT_RIGHT - WORLD_WIDTH + 20, eastRoadH);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(WORLD_WIDTH - 20, eastRoadY + eastRoadH / 2);
  ctx.lineTo(EXT_RIGHT, eastRoadY + eastRoadH / 2);
  ctx.stroke();

  // Dual Commuter Railway Tracks (y: 1210..1310, 100px wide)
  const railY = 1210;
  const railH = 100;
  ctx.fillStyle = '#78716c';
  ctx.fillRect(WORLD_WIDTH - 20, railY, EXT_RIGHT - WORLD_WIDTH + 20, railH);

  ctx.fillStyle = '#57534e';
  ctx.fillRect(WORLD_WIDTH - 20, railY, EXT_RIGHT - WORLD_WIDTH + 20, 6);
  ctx.fillRect(WORLD_WIDTH - 20, railY + railH - 6, EXT_RIGHT - WORLD_WIDTH + 20, 6);

  ctx.fillStyle = '#44403c';
  for (let rx = WORLD_WIDTH - 20; rx <= EXT_RIGHT; rx += 14) {
    ctx.fillRect(rx, railY + 12, 6, 32);
    ctx.fillRect(rx, railY + 56, 6, 32);
  }

  const railLines = [
    railY + 16,
    railY + 38,
    railY + 60,
    railY + 82,
  ];
  for (const ry of railLines) {
    ctx.fillStyle = '#292524';
    ctx.fillRect(WORLD_WIDTH - 20, ry + 2, EXT_RIGHT - WORLD_WIDTH + 20, 2);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(WORLD_WIDTH - 20, ry, EXT_RIGHT - WORLD_WIDTH + 20, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(WORLD_WIDTH - 20, ry, EXT_RIGHT - WORLD_WIDTH + 20, 1);
  }

  // -------------------------------------------------------------
  // 5. SOUTH CIVIC PARKLANDS & BOULEVARD (y: WORLD_HEIGHT .. EXT_BOTTOM)
  // -------------------------------------------------------------
  const southRoadX = 1280;
  const southRoadW = 140;

  // Sidewalks
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(southRoadX - 20, WORLD_HEIGHT - 20, 20, EXT_BOTTOM - WORLD_HEIGHT + 20);
  ctx.fillRect(southRoadX + southRoadW, WORLD_HEIGHT - 20, 20, EXT_BOTTOM - WORLD_HEIGHT + 20);

  // Raised granite curb lines
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(southRoadX, WORLD_HEIGHT - 20);
  ctx.lineTo(southRoadX, EXT_BOTTOM);
  ctx.moveTo(southRoadX + southRoadW, WORLD_HEIGHT - 20);
  ctx.lineTo(southRoadX + southRoadW, EXT_BOTTOM);
  ctx.stroke();

  // Dark asphalt roadway
  ctx.fillStyle = '#334155';
  ctx.fillRect(southRoadX, WORLD_HEIGHT - 20, southRoadW, EXT_BOTTOM - WORLD_HEIGHT + 20);

  // Painted double-yellow centerlines
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(southRoadX + southRoadW / 2 - 2, WORLD_HEIGHT - 20);
  ctx.lineTo(southRoadX + southRoadW / 2 - 2, EXT_BOTTOM);
  ctx.moveTo(southRoadX + southRoadW / 2 + 2, WORLD_HEIGHT - 20);
  ctx.lineTo(southRoadX + southRoadW / 2 + 2, EXT_BOTTOM);
  ctx.stroke();

  // White dashed lane dividers
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([18, 14]);
  ctx.beginPath();
  ctx.moveTo(southRoadX + southRoadW * 0.25, WORLD_HEIGHT - 20);
  ctx.lineTo(southRoadX + southRoadW * 0.25, EXT_BOTTOM);
  ctx.moveTo(southRoadX + southRoadW * 0.75, WORLD_HEIGHT - 20);
  ctx.lineTo(southRoadX + southRoadW * 0.75, EXT_BOTTOM);
  ctx.stroke();
  ctx.setLineDash([]);

  // Streetlamps along South Boulevard
  for (let y = WORLD_HEIGHT + 60; y <= EXT_BOTTOM; y += 140) {
    drawCivicLampPost(ctx, southRoadX - 10, y);
    drawCivicLampPost(ctx, southRoadX + southRoadW + 10, y);
  }

  // Secondary East-South Parkway extension at x: 2160..2270 (110px wide)
  const seRoadX = 2160;
  const seRoadW = 110;
  ctx.fillStyle = '#334155';
  ctx.fillRect(seRoadX, WORLD_HEIGHT - 20, seRoadW, EXT_BOTTOM - WORLD_HEIGHT + 20);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([18, 14]);
  ctx.beginPath();
  ctx.moveTo(seRoadX + seRoadW / 2, WORLD_HEIGHT - 20);
  ctx.lineTo(seRoadX + seRoadW / 2, EXT_BOTTOM);
  ctx.stroke();
  ctx.setLineDash([]);

  // Winding Pedestrian Stone Paths through Southern Park
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(600, WORLD_HEIGHT);
  ctx.bezierCurveTo(550, WORLD_HEIGHT + 300, 300, WORLD_HEIGHT + 500, 150, WORLD_HEIGHT + 900);
  ctx.bezierCurveTo(50, WORLD_HEIGHT + 1100, -200, WORLD_HEIGHT + 1200, -500, EXT_BOTTOM);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(1750, WORLD_HEIGHT);
  ctx.bezierCurveTo(1800, WORLD_HEIGHT + 250, 1950, WORLD_HEIGHT + 500, 2050, WORLD_HEIGHT + 850);
  ctx.bezierCurveTo(2150, WORLD_HEIGHT + 1100, 2400, WORLD_HEIGHT + 1200, 2700, EXT_BOTTOM);
  ctx.stroke();

  // Inner path joints
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // -------------------------------------------------------------
  // 6. 2.5D PARK TREE GROVES & CIVIC AMENITIES
  // -------------------------------------------------------------
  const surroundingTrees = [
    // South-West park groves
    { x: -1100, y: 1100, r: 26, c: '#3b6f2e' },
    { x: -950, y: 1180, r: 22, c: '#488237' },
    { x: -1200, y: 1250, r: 30, c: '#2f5b24' },
    { x: -800, y: 1400, r: 24, c: '#3b6f2e' },
    { x: -650, y: 1550, r: 28, c: '#488237' },
    { x: -450, y: 1350, r: 22, c: '#3b6f2e' },
    { x: -300, y: 1600, r: 27, c: '#2f5b24' },
    { x: 100, y: 1680, r: 25, c: '#3b6f2e' },
    { x: 250, y: 1800, r: 30, c: '#488237' },
    { x: 420, y: 1650, r: 22, c: '#3b6f2e' },
    { x: 580, y: 1950, r: 28, c: '#2f5b24' },
    { x: 750, y: 1750, r: 24, c: '#488237' },
    { x: 920, y: 2100, r: 32, c: '#3b6f2e' },
    { x: 1080, y: 1850, r: 26, c: '#2f5b24' },

    // South-East park groves
    { x: 1550, y: 1800, r: 26, c: '#3b6f2e' },
    { x: 1720, y: 2050, r: 30, c: '#488237' },
    { x: 1900, y: 1750, r: 24, c: '#2f5b24' },
    { x: 2350, y: 1800, r: 28, c: '#3b6f2e' },
    { x: 2520, y: 2100, r: 32, c: '#488237' },
    { x: 2750, y: 1750, r: 26, c: '#2f5b24' },
    { x: 2950, y: 2000, r: 28, c: '#3b6f2e' },
    { x: 3200, y: 1850, r: 30, c: '#488237' },
    { x: 3450, y: 2150, r: 34, c: '#2f5b24' },
    { x: 3750, y: 1750, r: 28, c: '#3b6f2e' },

    // Deep South outer green belt
    { x: -400, y: 2400, r: 32, c: '#3b6f2e' },
    { x: 150, y: 2550, r: 28, c: '#488237' },
    { x: 700, y: 2450, r: 34, c: '#2f5b24' },
    { x: 1450, y: 2600, r: 30, c: '#3b6f2e' },
    { x: 2200, y: 2500, r: 32, c: '#488237' },
    { x: 2800, y: 2650, r: 30, c: '#2f5b24' },
    { x: 3500, y: 2500, r: 35, c: '#3b6f2e' },

    // Far West outer belt
    { x: -1400, y: 450, r: 30, c: '#3b6f2e' },
    { x: -1250, y: 600, r: 26, c: '#488237' },
    { x: -1350, y: 1050, r: 32, c: '#2f5b24' },
    { x: -800, y: 350, r: 28, c: '#3b6f2e' },
    { x: -550, y: 550, r: 25, c: '#488237' },
    { x: -350, y: 300, r: 24, c: '#2f5b24' },
    { x: -180, y: 520, r: 26, c: '#3b6f2e' },

    // Far East outer belt
    { x: 2900, y: 350, r: 28, c: '#3b6f2e' },
    { x: 3100, y: 550, r: 32, c: '#488237' },
    { x: 3350, y: 400, r: 26, c: '#2f5b24' },
    { x: 3600, y: 650, r: 34, c: '#3b6f2e' },
    { x: 3850, y: 500, r: 30, c: '#488237' },
    { x: 3200, y: 1050, r: 28, c: '#2f5b24' },
    { x: 3450, y: 1150, r: 32, c: '#3b6f2e' },
    { x: 3750, y: 1350, r: 30, c: '#488237' },
  ];

  for (const tree of surroundingTrees) {
    drawSurroundingTree(ctx, tree.x, tree.y, tree.r, tree.c);
  }

  // Park benches along paths
  const benches = [
    { x: 480, y: 1680, angle: 0.3 },
    { x: 220, y: 1820, angle: 0.5 },
    { x: 1850, y: 1780, angle: -0.4 },
    { x: 2020, y: 1980, angle: -0.2 },
  ];
  for (const b of benches) {
    drawParkBench(ctx, b.x, b.y, b.angle);
  }

  ctx.restore();
}

/**
 * 2.5D Shaded Tree with contact drop shadow, multi-toned canopy & specular leaves
 */
function drawSurroundingTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  baseColor: string
): void {
  ctx.save();
  // Contact ground shadow
  ctx.fillStyle = 'rgba(20, 35, 15, 0.28)';
  ctx.beginPath();
  ctx.ellipse(x + radius * 0.25, y + radius * 0.2, radius * 1.1, radius * 0.5, 0.25, 0, Math.PI * 2);
  ctx.fill();

  // Trunk
  ctx.fillStyle = '#5c4033';
  ctx.fillRect(x - radius * 0.15, y - radius * 0.7, radius * 0.3, radius * 0.75);

  // Canopy Shadow tier
  ctx.fillStyle = '#1e3f17';
  ctx.beginPath();
  ctx.arc(x + 2, y - radius * 0.7, radius * 0.95, 0, Math.PI * 2);
  ctx.fill();

  // Canopy Body tier
  ctx.fillStyle = baseColor;
  ctx.beginPath();
  ctx.arc(x, y - radius * 0.85, radius * 0.9, 0, Math.PI * 2);
  ctx.fill();

  // Canopy Highlight tier
  ctx.fillStyle = 'rgba(163, 230, 53, 0.4)';
  ctx.beginPath();
  ctx.arc(x - radius * 0.28, y - radius * 1.05, radius * 0.55, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Civic Lamp Post
 */
function drawCivicLampPost(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.beginPath();
  ctx.ellipse(x + 3, y + 1, 5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 24);
  ctx.lineTo(x + 4, y - 27);
  ctx.stroke();

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(x + 4, y - 27, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(254, 240, 138, 0.18)';
  ctx.beginPath();
  ctx.arc(x + 4, y - 27, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Park Bench
 */
function drawParkBench(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
  ctx.fillRect(-12, 1, 24, 7);

  ctx.fillStyle = '#92400e';
  ctx.fillRect(-12, -4, 24, 5);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-12, -7, 24, 2.5);

  ctx.fillStyle = '#334155';
  ctx.fillRect(-12, -7, 2.5, 9);
  ctx.fillRect(9.5, -7, 2.5, 9);

  ctx.restore();
}

/**
 * Soft Edge Feathering / Seam Elimination between city photo and surroundings
 */
export function renderCityEdgeTransitions(ctx: CanvasRenderingContext2D): void {
  ctx.save();

  const featherSize = 28;

  // 1. North Edge Seam (y: 0 .. featherSize)
  const northGrad = ctx.createLinearGradient(0, 0, 0, featherSize);
  northGrad.addColorStop(0, 'rgba(178, 214, 244, 0.95)');
  northGrad.addColorStop(1, 'rgba(178, 214, 244, 0)');
  ctx.fillStyle = northGrad;
  ctx.fillRect(0, 0, WORLD_WIDTH, featherSize);

  // 2. South Edge Seam (y: WORLD_HEIGHT - featherSize .. WORLD_HEIGHT)
  const southGrad = ctx.createLinearGradient(0, WORLD_HEIGHT, 0, WORLD_HEIGHT - featherSize);
  southGrad.addColorStop(0, 'rgba(94, 112, 67, 0.95)');
  southGrad.addColorStop(1, 'rgba(94, 112, 67, 0)');
  ctx.fillStyle = southGrad;
  ctx.fillRect(0, WORLD_HEIGHT - featherSize, WORLD_WIDTH, featherSize);

  // 3. West Edge Seam (x: 0 .. featherSize)
  const westGrad = ctx.createLinearGradient(0, 0, featherSize, 0);
  westGrad.addColorStop(0, 'rgba(117, 133, 113, 0.95)');
  westGrad.addColorStop(1, 'rgba(117, 133, 113, 0)');
  ctx.fillStyle = westGrad;
  ctx.fillRect(0, 0, featherSize, WORLD_HEIGHT);

  // 4. East Edge Seam (x: WORLD_WIDTH - featherSize .. WORLD_WIDTH)
  const eastGrad = ctx.createLinearGradient(WORLD_WIDTH, 0, WORLD_WIDTH - featherSize, 0);
  eastGrad.addColorStop(0, 'rgba(119, 129, 100, 0.95)');
  eastGrad.addColorStop(1, 'rgba(119, 129, 100, 0)');
  ctx.fillStyle = eastGrad;
  ctx.fillRect(WORLD_WIDTH - featherSize, 0, featherSize, WORLD_HEIGHT);

  ctx.restore();
}
