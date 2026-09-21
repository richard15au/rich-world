import { PlayerCharacter } from './types';

export interface RenderPlayerOptions {
  prefersReducedMotion?: boolean;
  showNameTag?: boolean;
  isNearbyBuilding?: boolean;
}

/**
 * Premium vector-based player avatar renderer for RICH WORLD.
 * Features:
 * - High-fidelity character silhouette with stylish modern tech-wear outfit
 * - Directional awareness (front, back, left, right) with expressive facial details
 * - Natural walking/running kinematics (leg rotation arcs, torso bounce, arm swing with depth)
 * - Periodic eye blink animation and breathing cycle for lifelike presence
 * - Ground contact and ambient occlusion shadow layers
 * - Floating glassmorphic name badge with verified builder beacon
 */
export function renderPlayer(
  ctx: CanvasRenderingContext2D,
  player: PlayerCharacter,
  options: RenderPlayerOptions = {}
): void {
  const { prefersReducedMotion = false, showNameTag = true, isNearbyBuilding = false } = options;
  const { x, y } = player.position;

  // 1. Motion & Animation Kinematics
  const isMoving = player.state === 'walking' || player.state === 'running';
  const isJumping = player.state === 'jumping';
  const speedFreq = player.state === 'running' ? 14 : 9;

  // Jump vertical height
  const jumpHeight = isJumping && !prefersReducedMotion
    ? -Math.sin(player.jumpProgress * Math.PI) * 36
    : 0;

  // Natural torso/head bob during walking/running or idle breathing
  const stridePhase = player.walkTimer * speedFreq;
  const walkBob = isMoving && !prefersReducedMotion
    ? -Math.abs(Math.sin(stridePhase)) * 3.5
    : 0;
  const idleBreathing = !isMoving && !isJumping && !prefersReducedMotion
    ? Math.sin(player.idleTimer * 2.6) * 1.4
    : 0;

  const totalYOffset = jumpHeight + walkBob + idleBreathing;

  // Leg swing angles (radians)
  const leftLegAngle = isMoving && !prefersReducedMotion
    ? Math.sin(stridePhase) * 0.45
    : 0;
  const rightLegAngle = isMoving && !prefersReducedMotion
    ? -Math.sin(stridePhase) * 0.45
    : 0;

  // Arm swing angles (radians)
  const armSwing = isMoving && !prefersReducedMotion
    ? Math.sin(stridePhase) * 0.55
    : 0;

  // Eye blink calculation (blinks every ~3.5 seconds for 0.15s)
  const blinkCycle = (player.idleTimer + player.walkTimer * 0.5) % 3.6;
  const isBlinking = blinkCycle > 3.45 && !prefersReducedMotion;

  ctx.save();
  ctx.translate(x, y);

  // 2. Ground Shadows (stays anchored at ground level)
  ctx.save();
  const shadowProgress = isJumping ? Math.sin(player.jumpProgress * Math.PI) : 0;
  const shadowScale = Math.max(0.55, 1 - shadowProgress * 0.42);
  const shadowAlpha = Math.max(0.1, 0.32 - shadowProgress * 0.2);

  // Soft ambient outer shadow
  ctx.beginPath();
  ctx.ellipse(0, 15, 16 * shadowScale, 6.5 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(15, 23, 42, ${shadowAlpha * 0.6})`;
  ctx.fill();

  // Crisp contact shadow under feet
  ctx.beginPath();
  ctx.ellipse(0, 15, 10 * shadowScale, 4 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(15, 23, 42, ${shadowAlpha})`;
  ctx.fill();
  ctx.restore();

  // Apply character height offset
  ctx.translate(0, totalYOffset);

  // 3. Render Layers based on Facing Direction
  // When facing UP: draw face/front first, then back
  // When facing DOWN/SIDE: draw back layers first, then front
  if (player.facing === 'up') {
    renderLegs(ctx, player, leftLegAngle, rightLegAngle, isJumping);
    renderTorsoBack(ctx, player, armSwing);
    renderHeadBack(ctx);
  } else if (player.facing === 'left') {
    renderLegsProfile(ctx, player, -leftLegAngle, isJumping, 'left');
    renderTorsoProfile(ctx, player, armSwing, 'left');
    renderHeadProfile(ctx, 'left', isBlinking);
  } else if (player.facing === 'right') {
    renderLegsProfile(ctx, player, leftLegAngle, isJumping, 'right');
    renderTorsoProfile(ctx, player, armSwing, 'right');
    renderHeadProfile(ctx, 'right', isBlinking);
  } else {
    // Facing 'down' (Front)
    renderLegs(ctx, player, leftLegAngle, rightLegAngle, isJumping);
    renderTorsoFront(ctx, player, armSwing);
    renderHeadFront(ctx, isBlinking);
  }

  // 4. Overhead Name Badge & Indicator
  if (showNameTag) {
    renderNameTag(ctx, player, isNearbyBuilding);
  }

  ctx.restore();
}

/* ==================================================
   LEGS & SNEAKERS RENDERING
   ================================================== */
function renderLegs(
  ctx: CanvasRenderingContext2D,
  player: PlayerCharacter,
  leftAngle: number,
  rightAngle: number,
  isJumping: boolean
) {
  const pantColor = '#1e293b'; // Charcoal tech cargo
  const seamColor = '#334155';
  const sneakerSole = '#ffffff';
  const sneakerUpper = '#0284c7';
  const sneakerAccent = '#38bdf8';

  // Left Leg
  ctx.save();
  ctx.translate(-6, 4);
  if (isJumping) {
    ctx.rotate(-0.2);
  } else {
    ctx.rotate(leftAngle);
  }

  // Pant thigh/shin
  ctx.fillStyle = pantColor;
  ctx.beginPath();
  ctx.roundRect(-2.5, 0, 5, 11, 2);
  ctx.fill();
  ctx.strokeStyle = seamColor;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-2.5, 6);
  ctx.lineTo(2.5, 6);
  ctx.stroke();

  // Sneaker Upper
  ctx.fillStyle = sneakerUpper;
  ctx.beginPath();
  ctx.roundRect(-3, 10, 6, 4, [2, 2, 0, 0]);
  ctx.fill();

  // Sneaker Accent Stripe
  ctx.fillStyle = sneakerAccent;
  ctx.fillRect(-2, 11, 4, 1.2);

  // Sneaker Thick White Sole
  ctx.fillStyle = sneakerSole;
  ctx.beginPath();
  ctx.roundRect(-3.5, 13, 7, 2.5, [0, 0, 1.5, 1.5]);
  ctx.fill();
  ctx.restore();

  // Right Leg
  ctx.save();
  ctx.translate(6, 4);
  if (isJumping) {
    ctx.rotate(0.2);
  } else {
    ctx.rotate(rightAngle);
  }

  // Pant thigh/shin
  ctx.fillStyle = pantColor;
  ctx.beginPath();
  ctx.roundRect(-2.5, 0, 5, 11, 2);
  ctx.fill();
  ctx.strokeStyle = seamColor;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-2.5, 6);
  ctx.lineTo(2.5, 6);
  ctx.stroke();

  // Sneaker Upper
  ctx.fillStyle = sneakerUpper;
  ctx.beginPath();
  ctx.roundRect(-3, 10, 6, 4, [2, 2, 0, 0]);
  ctx.fill();

  // Sneaker Accent Stripe
  ctx.fillStyle = sneakerAccent;
  ctx.fillRect(-2, 11, 4, 1.2);

  // Sneaker Thick White Sole
  ctx.fillStyle = sneakerSole;
  ctx.beginPath();
  ctx.roundRect(-3.5, 13, 7, 2.5, [0, 0, 1.5, 1.5]);
  ctx.fill();
  ctx.restore();
}

function renderLegsProfile(
  ctx: CanvasRenderingContext2D,
  player: PlayerCharacter,
  angle: number,
  isJumping: boolean,
  dir: 'left' | 'right'
) {
  const mult = dir === 'right' ? 1 : -1;
  const pantColor = '#1e293b';
  const sneakerSole = '#ffffff';
  const sneakerUpper = '#0284c7';

  // Far Leg (darker shaded for depth)
  ctx.save();
  ctx.translate(-2 * mult, 4);
  ctx.rotate(-angle);
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(-2.5, 0, 5, 10, 2);
  ctx.fill();
  ctx.fillStyle = '#0369a1';
  ctx.beginPath();
  ctx.roundRect(-3 * mult, 9, 6 * mult, 4, 1);
  ctx.fill();
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-3.5 * mult, 12.5, 7 * mult, 2.5);
  ctx.restore();

  // Near Leg
  ctx.save();
  ctx.translate(1 * mult, 4);
  ctx.rotate(angle);
  ctx.fillStyle = pantColor;
  ctx.beginPath();
  ctx.roundRect(-2.5, 0, 5, 11, 2);
  ctx.fill();

  // Sneaker toe pointing in walking direction
  ctx.fillStyle = sneakerUpper;
  ctx.beginPath();
  ctx.roundRect(-2, 10, 7 * mult, 4, [2, 2, 1, 1]);
  ctx.fill();

  ctx.fillStyle = sneakerSole;
  ctx.beginPath();
  ctx.roundRect(-2.5, 13, 8 * mult, 2.5, [1, 1, 1.5, 1.5]);
  ctx.fill();
  ctx.restore();
}

/* ==================================================
   TORSO & TECH JACKET RENDERING
   ================================================== */
function renderTorsoFront(
  ctx: CanvasRenderingContext2D,
  _player: PlayerCharacter,
  armSwing: number
) {
  // Left Arm
  ctx.save();
  ctx.translate(-12, -10);
  ctx.rotate(armSwing);
  renderArm(ctx, '#1d4ed8', '#fed7aa');
  ctx.restore();

  // Right Arm
  ctx.save();
  ctx.translate(12, -10);
  ctx.rotate(-armSwing);
  renderArm(ctx, '#1d4ed8', '#fed7aa');
  ctx.restore();

  // Main Tech Jacket Body
  const jacketGrad = ctx.createLinearGradient(0, -16, 0, 7);
  jacketGrad.addColorStop(0, '#2563eb');
  jacketGrad.addColorStop(0.7, '#1d4ed8');
  jacketGrad.addColorStop(1, '#1e40af');

  ctx.fillStyle = jacketGrad;
  ctx.beginPath();
  ctx.roundRect(-11, -15, 22, 21, [6, 6, 4, 4]);
  ctx.fill();

  // Inner White Tech Undershirt at Collar
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(-3, -15);
  ctx.lineTo(3, -15);
  ctx.lineTo(0, -9);
  ctx.closePath();
  ctx.fill();

  // Jacket Lapels / Collar fold
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.moveTo(-5, -15);
  ctx.lineTo(-2, -9);
  ctx.lineTo(-4, -5);
  ctx.lineTo(-9, -15);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(5, -15);
  ctx.lineTo(2, -9);
  ctx.lineTo(4, -5);
  ctx.lineTo(9, -15);
  ctx.closePath();
  ctx.fill();

  // Silver Zipper & Seam
  ctx.strokeStyle = '#93c5fd';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.lineTo(0, 6);
  ctx.stroke();

  // Glowing Cyan Tech Badge / LED Crest on Left Chest
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.arc(-6, -8, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Bottom Jacket Hem
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.roundRect(-11, 4, 22, 2.5, [0, 0, 3, 3]);
  ctx.fill();
}

function renderTorsoBack(
  ctx: CanvasRenderingContext2D,
  _player: PlayerCharacter,
  armSwing: number
) {
  // Left Arm
  ctx.save();
  ctx.translate(-12, -10);
  ctx.rotate(-armSwing);
  renderArm(ctx, '#1e40af', '#fed7aa');
  ctx.restore();

  // Right Arm
  ctx.save();
  ctx.translate(12, -10);
  ctx.rotate(armSwing);
  renderArm(ctx, '#1e40af', '#fed7aa');
  ctx.restore();

  // Back of Jacket
  const jacketGrad = ctx.createLinearGradient(0, -16, 0, 7);
  jacketGrad.addColorStop(0, '#1d4ed8');
  jacketGrad.addColorStop(1, '#1e3a8a');

  ctx.fillStyle = jacketGrad;
  ctx.beginPath();
  ctx.roundRect(-11, -15, 22, 21, [6, 6, 4, 4]);
  ctx.fill();

  // Yellow Trainer Backpack (from reference picture)
  ctx.fillStyle = '#eab308';
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-8, -12, 16, 15, [4, 4, 6, 6]);
  ctx.fill();
  ctx.stroke();

  // Backpack Pocket & Black Straps
  ctx.fillStyle = '#fde047';
  ctx.fillRect(-6, -5, 12, 6);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-7.5, -12, 2.5, 14);
  ctx.fillRect(5, -12, 2.5, 14);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-6, -2, 12, 1.5); // silver zipper
}

function renderTorsoProfile(
  ctx: CanvasRenderingContext2D,
  player: PlayerCharacter,
  armSwing: number,
  dir: 'left' | 'right'
) {
  const mult = dir === 'right' ? 1 : -1;

  // Yellow Backpack in profile (behind back)
  ctx.fillStyle = '#eab308';
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-8 * mult, -12, 5 * mult, 14, 3);
  ctx.fill();
  ctx.stroke();

  // Torso side profile
  const jacketGrad = ctx.createLinearGradient(0, -16, 0, 7);
  jacketGrad.addColorStop(0, '#2563eb');
  jacketGrad.addColorStop(1, '#1d4ed8');

  ctx.fillStyle = jacketGrad;
  ctx.beginPath();
  ctx.roundRect(-6 * mult, -15, 12, 21, [5, 5, 3, 3]);
  ctx.fill();

  // Profile arm swinging
  ctx.save();
  ctx.translate(0, -10);
  ctx.rotate(armSwing * mult);
  renderArm(ctx, '#1d4ed8', '#fed7aa');
  ctx.restore();
}

function renderArm(ctx: CanvasRenderingContext2D, sleeveColor: string, handColor: string) {
  // Sleeve
  ctx.fillStyle = sleeveColor;
  ctx.beginPath();
  ctx.roundRect(-2.5, 0, 5, 12, [2, 2, 2, 2]);
  ctx.fill();

  // White cuff
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-2.5, 11, 5, 1.5);

  // Hand
  ctx.fillStyle = handColor;
  ctx.beginPath();
  ctx.arc(0, 14.5, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

/* ==================================================
   HEAD, HAIR & EXPRESSIONS
   ================================================== */
function renderHeadFront(ctx: CanvasRenderingContext2D, isBlinking: boolean) {
  const headY = -25;

  // Ears
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(-10.5, headY + 1, 2.8, 0, Math.PI * 2);
  ctx.arc(10.5, headY + 1, 2.8, 0, Math.PI * 2);
  ctx.fill();

  // Face Base (smooth soft skin)
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.roundRect(-10, headY - 8, 20, 18, [7, 7, 9, 9]);
  ctx.fill();

  // Subtle Cheek Blush
  ctx.fillStyle = 'rgba(251, 146, 60, 0.28)';
  ctx.beginPath();
  ctx.arc(-6, headY + 5, 2.2, 0, Math.PI * 2);
  ctx.arc(6, headY + 5, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Eyes & Eyebrows
  if (isBlinking) {
    // Closed relaxed blink eyes
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-7, headY + 1);
    ctx.quadraticCurveTo(-5, headY + 2.5, -3, headY + 1);
    ctx.moveTo(3, headY + 1);
    ctx.quadraticCurveTo(5, headY + 2.5, 7, headY + 1);
    ctx.stroke();
  } else {
    // Open vibrant anime/chibi eyes
    renderEye(ctx, -5, headY + 1);
    renderEye(ctx, 5, headY + 1);

    // Eyebrows
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-7.5, headY - 3);
    ctx.lineTo(-3.5, headY - 3.5);
    ctx.moveTo(3.5, headY - 3.5);
    ctx.lineTo(7.5, headY - 3);
    ctx.stroke();
  }

  // Friendly Smile
  ctx.strokeStyle = '#9a3412';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.arc(0, headY + 5, 2.5, 0.2, Math.PI - 0.2, false);
  ctx.stroke();

  // Stylish Layered Hair (Dark Espresso with modern bangs)
  renderHairFront(ctx, headY);
}

function renderEye(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  // Eye white
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 3.2, 3.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Iris (Cyan/Deep Navy)
  ctx.fillStyle = '#0369a1';
  ctx.beginPath();
  ctx.arc(cx, cy + 0.3, 2.3, 0, Math.PI * 2);
  ctx.fill();

  // Dark pupil
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(cx, cy + 0.3, 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Specular Sparkle Highlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx - 0.9, cy - 0.9, 0.9, 0, Math.PI * 2);
  ctx.fill();
}

function renderHairFront(ctx: CanvasRenderingContext2D, headY: number) {
  const hairDark = '#18181b'; // Espresso/Black hair under cap

  // Hair Bangs peeking out under cap
  ctx.fillStyle = hairDark;
  ctx.beginPath();
  ctx.moveTo(-10, headY - 2);
  ctx.quadraticCurveTo(-6, headY + 1, -2, headY - 1);
  ctx.lineTo(0, headY + 2);
  ctx.quadraticCurveTo(4, headY, 10, headY - 2);
  ctx.lineTo(7, headY - 6);
  ctx.lineTo(-7, headY - 6);
  ctx.closePath();
  ctx.fill();

  // Red Trainer Cap Dome (Iconic Trainer Cap from screenshot)
  ctx.fillStyle = '#ef4444';
  ctx.strokeStyle = '#b91c1c';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, headY - 6, 12, Math.PI * 0.9, Math.PI * 2.1, false);
  ctx.fill();
  ctx.stroke();

  // White Visor / Cap Bill
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, headY - 3, 13, 4, 0, 0, Math.PI);
  ctx.fill();
  ctx.stroke();

  // White Semi-Circle Poké-emblem on Cap Front
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, headY - 9, 4.5, 0, Math.PI, true);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(0, headY - 9, 2.5, 0, Math.PI, true);
  ctx.fill();
}

function renderHeadBack(ctx: CanvasRenderingContext2D) {
  const headY = -25;
  const hairDark = '#18181b';

  // Hair tufts peeking out from neck under cap
  ctx.fillStyle = hairDark;
  ctx.beginPath();
  ctx.moveTo(-11, headY + 2);
  ctx.lineTo(-6, headY + 8);
  ctx.lineTo(0, headY + 4);
  ctx.lineTo(6, headY + 8);
  ctx.lineTo(11, headY + 2);
  ctx.closePath();
  ctx.fill();

  // Red Trainer Cap Back Dome (like in screenshot)
  ctx.fillStyle = '#ef4444';
  ctx.strokeStyle = '#b91c1c';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, headY - 4, 12.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Cap Arch Opening / Adjustment Strap at back
  ctx.fillStyle = hairDark;
  ctx.beginPath();
  ctx.arc(0, headY + 2, 4.5, Math.PI, 0, false);
  ctx.fill();

  ctx.fillStyle = '#ffffff'; // White snap strap
  ctx.fillRect(-4, headY + 1, 8, 2);
}

function renderHeadProfile(ctx: CanvasRenderingContext2D, dir: 'left' | 'right', isBlinking: boolean) {
  const mult = dir === 'right' ? 1 : -1;
  const headY = -25;

  // Face Base Profile
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.roundRect(-8 * mult, headY - 7, 16, 16, [6, 6, 7, 7]);
  ctx.fill();

  // Cute Nose slope
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.moveTo(6 * mult, headY + 1);
  ctx.lineTo(9 * mult, headY + 3);
  ctx.lineTo(6 * mult, headY + 4);
  ctx.closePath();
  ctx.fill();

  // Profile Eye
  if (isBlinking) {
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(3 * mult, headY + 2);
    ctx.lineTo(6 * mult, headY + 2);
    ctx.stroke();
  } else {
    renderEye(ctx, 4 * mult, headY + 1.5);
  }

  // Hair peeking from cap
  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  ctx.moveTo(-5 * mult, headY + 4);
  ctx.lineTo(0, headY + 8);
  ctx.lineTo(5 * mult, headY + 4);
  ctx.closePath();
  ctx.fill();

  // Red Trainer Cap in Profile
  ctx.fillStyle = '#ef4444';
  ctx.strokeStyle = '#b91c1c';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(-mult * 1, headY - 4, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // White Cap Visor projecting forward in walking direction
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(4 * mult, headY - 5, 8 * mult, 3.5, [1, 1, 2, 2]);
  ctx.fill();
  ctx.stroke();
}

/* ==================================================
   OVERHEAD NAME TAG & STATUS BADGE
   ================================================== */
function renderNameTag(
  ctx: CanvasRenderingContext2D,
  player: PlayerCharacter,
  isNearbyBuilding: boolean
) {
  const tagY = -46;
  const name = player.name;

  ctx.font = '700 11px system-ui, -apple-system, sans-serif';
  const nameWidth = ctx.measureText(name).width;
  const pillW = nameWidth + 30;
  const pillH = 20;

  ctx.save();

  // Glassmorphic Name Pill Background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
  ctx.shadowColor = 'rgba(15, 23, 42, 0.16)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;

  ctx.beginPath();
  ctx.roundRect(-pillW / 2, tagY - pillH / 2, pillW, pillH, 9999);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Light Blue Border
  ctx.strokeStyle = '#93c5fd';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Downward Pointer Triangle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
  ctx.beginPath();
  ctx.moveTo(-3, tagY + pillH / 2);
  ctx.lineTo(3, tagY + pillH / 2);
  ctx.lineTo(0, tagY + pillH / 2 + 3.5);
  ctx.closePath();
  ctx.fill();

  // Live Pulse Dot
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(-pillW / 2 + 9, tagY, 3, 0, Math.PI * 2);
  ctx.fill();

  // Player Name Text
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, -pillW / 2 + 16, tagY);

  // Nearby Building Interactive "E" Bubble
  if (isNearbyBuilding) {
    const bubbleY = -68;
    ctx.fillStyle = '#2563eb';
    ctx.shadowColor = 'rgba(37, 99, 235, 0.5)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, bubbleY, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('E', 0, bubbleY);
  }

  ctx.restore();
}
