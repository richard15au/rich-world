import * as THREE from 'three';
import { BUILDINGS, ROADS, ENVIRONMENT_OBJECTS, WORLD_WIDTH, WORLD_HEIGHT } from './constants';
import { Building, Road, EnvironmentObject } from './types';
import { getBuildingElevationHeight } from './worldRenderer';

export interface ThreeWorldScene {
  scene: THREE.Scene;
  sunLight: THREE.DirectionalLight;
  trafficCars: THREE.Group[];
  fountainWater: THREE.Mesh;
  fountainParticles: THREE.Points;
  hqBeaconLight: THREE.PointLight;
  healthHelipadLight: THREE.PointLight;
  update: (time: number, dt: number, prefersReducedMotion: boolean) => void;
  dispose: () => void;
}

/**
 * Procedural 3D World Scene Builder for RICH CITY.
 * Faithfully constructs the 3D miniature digital city matching the reference image.
 */
export function createThreeWorldScene(): ThreeWorldScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbbf7d0); // Soft civic lawn green
  scene.fog = new THREE.FogExp2(0xbbf7d0, 0.00045);

  // Shared Materials Palette
  const materials = {
    grass: new THREE.MeshStandardMaterial({ color: 0xbbf7d0, roughness: 0.85 }),
    grassStripe: new THREE.MeshStandardMaterial({ color: 0xb1f0c7, roughness: 0.85 }),
    asphalt: new THREE.MeshStandardMaterial({ color: 0x242e3d, roughness: 0.75 }),
    sidewalk: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 }),
    curb: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 }),
    roadYellow: new THREE.MeshBasicMaterial({ color: 0xfacc15 }),
    roadWhite: new THREE.MeshBasicMaterial({ color: 0xf8fafc }),
    plazaStone: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 }),
    marble: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 }),
    fountainWater: new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      transmission: 0.6,
      ior: 1.33,
    }),
    glassBlue: new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.85,
      roughness: 0.15,
      metalness: 0.2,
      clearcoat: 0.8,
    }),
    glassDark: new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.8,
    }),
    brickRed: new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.8 }),
    roofDark: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 }),
    roofGrey: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 }),
    roofConcrete: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6 }),
    safetyYellow: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 }),
    industrialAmber: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 }),
    hotelPurple: new THREE.MeshStandardMaterial({ color: 0x4c1d95, roughness: 0.4 }),
    bistroCrimson: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 }),
    hospitalCyan: new THREE.MeshStandardMaterial({ color: 0x0891b2, roughness: 0.4 }),
    transitGreen: new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4 }),
    goldBronze: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.7 }),
    whiteTrim: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }),
    steelLattice: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.5 }),
    treeBark: new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.9 }),
    treeFoliage1: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.75 }),
    treeFoliage2: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.75 }),
    basketballBlue: new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 }),
  };

  // 1. Lighting Rig
  const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x86efac, 1.25);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
  sunLight.position.set(400, 600, 350);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 100;
  sunLight.shadow.camera.far = 1400;
  const shadowRange = 850;
  sunLight.shadow.camera.left = -shadowRange;
  sunLight.shadow.camera.right = shadowRange;
  sunLight.shadow.camera.top = shadowRange;
  sunLight.shadow.camera.bottom = -shadowRange;
  sunLight.shadow.bias = -0.0004;
  scene.add(sunLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambientLight);

  // 2. Ground Terrain & Manicured Lawn
  const groundGeo = new THREE.PlaneGeometry(WORLD_WIDTH + 800, WORLD_HEIGHT + 800);
  groundGeo.rotateX(-Math.PI / 2);
  const groundMesh = new THREE.Mesh(groundGeo, materials.grass);
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  // Manicured lawn alternating bands
  const bandH = 64;
  for (let z = -WORLD_HEIGHT / 2; z < WORLD_HEIGHT / 2; z += bandH * 2) {
    const stripeGeo = new THREE.PlaneGeometry(WORLD_WIDTH + 800, bandH);
    stripeGeo.rotateX(-Math.PI / 2);
    const stripeMesh = new THREE.Mesh(stripeGeo, materials.grassStripe);
    stripeMesh.position.set(0, 0.02, z + bandH / 2);
    stripeMesh.receiveShadow = true;
    scene.add(stripeMesh);
  }

  // 3. Roads, Curbs, Sidewalks
  for (const road of ROADS) {
    render3DRoad(scene, road, materials);
  }

  // 4. Central Roundabout Plaza & Fountain
  const fountainObj = render3DCentralPlaza(scene, materials);

  // 5. Ground-Level Context Fixtures (Basketball Court, Parking Lots, Pallets)
  render3DGroundFixtures(scene, ENVIRONMENT_OBJECTS, materials);

  // 6. All 11 Detailed 3D Buildings
  const buildingLights = render3DBuildings(scene, BUILDINGS, materials);

  // 7. 3D Trees, Streetlights, Benches, Planters
  render3DUrbanObjects(scene, ENVIRONMENT_OBJECTS, materials);

  // 8. Animated 3D Moving Traffic
  const trafficCars = create3DTrafficCars(scene);

  return {
    scene,
    sunLight,
    trafficCars,
    fountainWater: fountainObj.waterMesh,
    fountainParticles: fountainObj.particles,
    hqBeaconLight: buildingLights.hqBeacon,
    healthHelipadLight: buildingLights.helipadLight,
    update: (time: number, dt: number, prefersReducedMotion: boolean) => {
      // 1. Animate Moving Traffic along Grand Civic Boulevard & Promenade
      if (!prefersReducedMotion) {
        // Car 1: Westbound along Grand Civic Boulevard (Z = -155)
        const car1 = trafficCars[0];
        if (car1) {
          car1.position.x = 1200 - ((time * 95) % 2400);
          car1.rotation.y = -Math.PI / 2;
        }

        // Car 2: Eastbound along Grand Civic Boulevard (Z = -90)
        const car2 = trafficCars[1];
        if (car2) {
          car2.position.x = -1200 + ((time * 85 + 400) % 2400);
          car2.rotation.y = Math.PI / 2;
        }

        // Car 3: Southbound along Central Promenade (X = -80)
        const car3 = trafficCars[2];
        if (car3) {
          const zPos = -500 + ((time * 70 + 200) % 1300);
          // Hide inside fountain circle
          if (Math.hypot(-80 - (-50), zPos - 0) < 185) {
            car3.visible = false;
          } else {
            car3.visible = true;
            car3.position.z = zPos;
            car3.rotation.y = 0;
          }
        }
      }

      // 2. Animate Fountain Water Ripple & Spray Particles
      if (!prefersReducedMotion) {
        const positions = fountainObj.particles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += (dt * 18);
          if (positions[i + 1] > 18) {
            positions[i + 1] = 4;
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 8;
            positions[i] = -50 + Math.cos(angle) * radius;
            positions[i + 2] = Math.sin(angle) * radius;
          }
        }
        fountainObj.particles.geometry.attributes.position.needsUpdate = true;
      }

      // 3. Strobe & Beacon Lights
      if (!prefersReducedMotion) {
        buildingLights.hqBeacon.intensity = 1.2 + Math.sin(time * 6) * 0.8;
        buildingLights.helipadLight.intensity = Math.sin(time * 8) > 0 ? 2 : 0;
      }
    },
    dispose: () => {
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    },
  };
}

/* ==========================================================================
   ROAD NETWORK & CENTRAL ROUNDABOUT
   ========================================================================== */

function render3DRoad(
  scene: THREE.Scene,
  road: Road,
  mats: Record<string, THREE.Material>
) {
  // Translate from 2D coordinates (x, y) to centered 3D coords (x - 1400, z = y - 1000)
  const posX = road.x + road.width / 2 - 1400;
  const posZ = road.y + road.height / 2 - 1000;
  const sw = 18; // Sidewalk width

  // 1. Concrete Sidewalk Slab
  const sidewalkGeo = new THREE.BoxGeometry(road.width + sw * 2, 1.2, road.height + sw * 2);
  const sidewalkMesh = new THREE.Mesh(sidewalkGeo, mats.sidewalk);
  sidewalkMesh.position.set(posX, 0.6, posZ);
  sidewalkMesh.receiveShadow = true;
  scene.add(sidewalkMesh);

  // 2. Asphalt Road Bed
  const roadGeo = new THREE.BoxGeometry(road.width, 1.3, road.height);
  const roadMesh = new THREE.Mesh(roadGeo, mats.asphalt);
  roadMesh.position.set(posX, 0.65, posZ);
  roadMesh.receiveShadow = true;
  scene.add(roadMesh);

  // 3. Raised Granite Curbs
  const curbMat = mats.curb;
  if (road.direction === 'horizontal') {
    const curbGeo = new THREE.BoxGeometry(road.width, 1.5, 2.5);
    const topCurb = new THREE.Mesh(curbGeo, curbMat);
    topCurb.position.set(posX, 0.75, posZ - road.height / 2);
    scene.add(topCurb);

    const botCurb = new THREE.Mesh(curbGeo, curbMat);
    botCurb.position.set(posX, 0.75, posZ + road.height / 2);
    scene.add(botCurb);

    // Double Yellow Centerline
    if (road.height >= 100) {
      const lineGeo = new THREE.PlaneGeometry(road.width - 20, 1.5);
      lineGeo.rotateX(-Math.PI / 2);
      const line1 = new THREE.Mesh(lineGeo, mats.roadYellow);
      line1.position.set(posX, 1.32, posZ - 2);
      scene.add(line1);

      const line2 = new THREE.Mesh(lineGeo, mats.roadYellow);
      line2.position.set(posX, 1.32, posZ + 2);
      scene.add(line2);
    }
  } else {
    const curbGeo = new THREE.BoxGeometry(2.5, 1.5, road.height);
    const leftCurb = new THREE.Mesh(curbGeo, curbMat);
    leftCurb.position.set(posX - road.width / 2, 0.75, posZ);
    scene.add(leftCurb);

    const rightCurb = new THREE.Mesh(curbGeo, curbMat);
    rightCurb.position.set(posX + road.width / 2, 0.75, posZ);
    scene.add(rightCurb);

    // Double Yellow Centerline
    if (road.width >= 100) {
      const lineGeo = new THREE.PlaneGeometry(1.5, road.height - 20);
      lineGeo.rotateX(-Math.PI / 2);
      const line1 = new THREE.Mesh(lineGeo, mats.roadYellow);
      line1.position.set(posX - 2, 1.32, posZ);
      scene.add(line1);

      const line2 = new THREE.Mesh(lineGeo, mats.roadYellow);
      line2.position.set(posX + 2, 1.32, posZ);
      scene.add(line2);
    }
  }
}

function render3DCentralPlaza(
  scene: THREE.Scene,
  mats: Record<string, THREE.Material>
) {
  // Center of plaza in 3D: (1350 - 1400 = -50, 1000 - 1000 = 0)
  const cx = -50;
  const cz = 0;

  // 1. Outer Roundabout Asphalt Ring
  const roundRadius = 180;
  const roundGeo = new THREE.RingGeometry(roundRadius - 40, roundRadius, 48);
  roundGeo.rotateX(-Math.PI / 2);
  const roundMesh = new THREE.Mesh(roundGeo, mats.asphalt);
  roundMesh.position.set(cx, 1.32, cz);
  roundMesh.receiveShadow = true;
  scene.add(roundMesh);

  // 2. Circular Plaza Raised Stone Terrace
  const plazaRadius = 120;
  const plazaGeo = new THREE.CylinderGeometry(plazaRadius, plazaRadius, 2, 48);
  const plazaMesh = new THREE.Mesh(plazaGeo, mats.plazaStone);
  plazaMesh.position.set(cx, 1.8, cz);
  plazaMesh.receiveShadow = true;
  scene.add(plazaMesh);

  // 3. Multi-Tiered Marble Fountain
  // Outer Marble Basin
  const basinRadius = 44;
  const basinGeo = new THREE.CylinderGeometry(basinRadius, basinRadius, 4, 32);
  const basinMesh = new THREE.Mesh(basinGeo, mats.marble);
  basinMesh.position.set(cx, 4, cz);
  basinMesh.castShadow = true;
  basinMesh.receiveShadow = true;
  scene.add(basinMesh);

  // Sparkling Aquamarine Water Pool
  const waterRadius = 40;
  const waterGeo = new THREE.CylinderGeometry(waterRadius, waterRadius, 0.5, 32);
  const waterMesh = new THREE.Mesh(waterGeo, mats.fountainWater);
  waterMesh.position.set(cx, 5.8, cz);
  scene.add(waterMesh);

  // Fountain Center Tier Pedestal
  const pedGeo = new THREE.CylinderGeometry(14, 16, 8, 24);
  const pedMesh = new THREE.Mesh(pedGeo, mats.marble);
  pedMesh.position.set(cx, 7.5, cz);
  pedMesh.castShadow = true;
  scene.add(pedMesh);

  // Upper Spout
  const spoutGeo = new THREE.CylinderGeometry(4, 6, 4, 16);
  const spoutMesh = new THREE.Mesh(spoutGeo, mats.marble);
  spoutMesh.position.set(cx, 12, cz);
  scene.add(spoutMesh);

  // Water Spray Particles
  const particleCount = 64;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 14;
    particlePositions[i * 3] = cx + Math.cos(angle) * r;
    particlePositions[i * 3 + 1] = 12 + Math.random() * 10;
    particlePositions[i * 3 + 2] = cz + Math.sin(angle) * r;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2.2,
    transparent: true,
    opacity: 0.85,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // 4. "RICH CITY" Entry Monument Stone Plaque
  const signW = 96;
  const signH = 14;
  const signD = 6;
  const signGeo = new THREE.BoxGeometry(signW, signH, signD);
  const signMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
  const signMesh = new THREE.Mesh(signGeo, signMat);
  signMesh.position.set(cx, 8, cz + 58);
  signMesh.castShadow = true;
  scene.add(signMesh);

  // Blue Accent Frame on Monument
  const frameGeo = new THREE.BoxGeometry(signW + 2, signH + 2, signD - 1);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
  const frameMesh = new THREE.Mesh(frameGeo, frameMat);
  frameMesh.position.set(cx, 8, cz + 58);
  scene.add(frameMesh);

  return { waterMesh, particles };
}

/* ==========================================================================
   GROUND CONTEXT FIXTURES (Basketball Court, Customer Parking, Pallets)
   ========================================================================== */

function render3DGroundFixtures(
  scene: THREE.Scene,
  objects: EnvironmentObject[],
  mats: Record<string, THREE.Material>
) {
  for (const obj of objects) {
    if (obj.type === 'basketball-court') {
      const posX = obj.x + (obj.width || 150) / 2 - 1400;
      const posZ = obj.y + (obj.height || 210) / 2 - 1000;
      const w = obj.width || 150;
      const h = obj.height || 210;

      // Concrete Apron
      const apronGeo = new THREE.BoxGeometry(w + 14, 1.2, h + 14);
      const apronMesh = new THREE.Mesh(apronGeo, mats.sidewalk);
      apronMesh.position.set(posX, 0.6, posZ);
      apronMesh.receiveShadow = true;
      scene.add(apronMesh);

      // Vibrant Blue Acrylic Court
      const courtGeo = new THREE.BoxGeometry(w, 1.3, h);
      const courtMesh = new THREE.Mesh(courtGeo, mats.basketballBlue);
      courtMesh.position.set(posX, 0.65, posZ);
      courtMesh.receiveShadow = true;
      scene.add(courtMesh);

      // Basketball Hoops & Poles (North & South)
      render3DBasketballHoop(scene, posX, posZ - h / 2 + 14, 0, mats);
      render3DBasketballHoop(scene, posX, posZ + h / 2 - 14, Math.PI, mats);
    }
  }

  // RichMart Customer Parking Lot
  const martX = 840 + 120 - 1400;
  const martZ = 1130 + 22 - 1000;
  const parkingGeo = new THREE.BoxGeometry(240, 1.2, 44);
  const parkingMesh = new THREE.Mesh(parkingGeo, mats.asphalt);
  parkingMesh.position.set(martX, 0.6, martZ);
  parkingMesh.receiveShadow = true;
  scene.add(parkingMesh);

  // Parked 3D Customer Cars in RichMart Parking Lot
  render3DCustomerCar(scene, martX - 70, martZ, 0x38bdf8);
  render3DCustomerCar(scene, martX - 30, martZ, 0xef4444);
  render3DCustomerCar(scene, martX + 20, martZ, 0xffffff);
  render3DCustomerCar(scene, martX + 60, martZ, 0x0f172a);
}

function render3DBasketballHoop(
  scene: THREE.Scene,
  x: number,
  z: number,
  rotY: number,
  mats: Record<string, THREE.Material>
) {
  const poleGroup = new THREE.Group();
  poleGroup.position.set(x, 0, z);
  poleGroup.rotation.y = rotY;

  // Steel Pole
  const poleGeo = new THREE.CylinderGeometry(1.2, 1.2, 28, 8);
  const poleMesh = new THREE.Mesh(poleGeo, mats.whiteTrim);
  poleMesh.position.set(0, 14, -4);
  poleMesh.castShadow = true;
  poleGroup.add(poleMesh);

  // Backboard
  const bbGeo = new THREE.BoxGeometry(22, 14, 1.2);
  const bbMesh = new THREE.Mesh(bbGeo, mats.whiteTrim);
  bbMesh.position.set(0, 24, 2);
  bbMesh.castShadow = true;
  poleGroup.add(bbMesh);

  // Orange Rim
  const rimGeo = new THREE.TorusGeometry(3.5, 0.5, 8, 16);
  rimGeo.rotateX(Math.PI / 2);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xea580c });
  const rimMesh = new THREE.Mesh(rimGeo, rimMat);
  rimMesh.position.set(0, 20, 6);
  poleGroup.add(rimMesh);

  scene.add(poleGroup);
}

function render3DCustomerCar(
  scene: THREE.Scene,
  x: number,
  z: number,
  color: number
) {
  const car = createCarMesh(color);
  car.position.set(x, 1.2, z);
  car.rotation.y = Math.PI / 6; // Angled parking bay
  scene.add(car);
}

/* ==========================================================================
   ALL 11 DETAILED 3D BUILDINGS (Directly from Reference Image)
   ========================================================================== */

function render3DBuildings(
  scene: THREE.Scene,
  buildings: Building[],
  mats: Record<string, THREE.Material>
) {
  let hqBeacon: THREE.PointLight | null = null;
  let helipadLight: THREE.PointLight | null = null;

  for (const b of buildings) {
    const posX = b.bounds.x + b.bounds.width / 2 - 1400;
    const posZ = b.bounds.y + b.bounds.height / 2 - 1000;
    const sizeX = b.bounds.width;
    const sizeZ = b.bounds.height;
    const H = getBuildingElevationHeight(b.id);

    const bGroup = new THREE.Group();
    bGroup.position.set(posX, 0, posZ);

    switch (b.id) {
      case 'rich-hq':
        hqBeacon = render3DRichWorldHQ(bGroup, sizeX, sizeZ, H, mats);
        break;
      case 'tech-ai':
        render3DTechAiStudio(bGroup, sizeX, sizeZ, H, mats);
        break;
      case 'richbuild':
        render3DRichBuild(bGroup, sizeX, sizeZ, H, mats);
        break;
      case 'richfinance':
        render3DRichFinance(bGroup, sizeX, sizeZ, H, mats);
        break;
      case 'richacademy':
        render3DRichAcademy(bGroup, sizeX, sizeZ, H, mats);
        break;
      case 'richlogistics':
        render3DRichLogistics(bGroup, sizeX, sizeZ, H, mats);
        break;
      case 'richmart':
        render3DRichMart(bGroup, sizeX, sizeZ, H, mats);
        break;
      case 'richstay':
        render3DRichStay(bGroup, sizeX, sizeZ, H, mats);
        break;
      case 'richfoods':
        render3DRichFoods(bGroup, sizeX, sizeZ, H, mats);
        break;
      case 'richhealth':
        helipadLight = render3DRichHealth(bGroup, sizeX, sizeZ, H, mats);
        break;
      case 'transit':
        render3DTransitStation(bGroup, sizeX, sizeZ, H, mats);
        break;
    }

    scene.add(bGroup);
  }

  return {
    hqBeacon: hqBeacon || new THREE.PointLight(0xef4444, 1),
    helipadLight: helipadLight || new THREE.PointLight(0xfacc15, 1),
  };
}

/* --------------------------------------------------------------------------
   1. RICH WORLD HQ - Stepped Cylindrical Faceted Glass Skyscraper
   -------------------------------------------------------------------------- */
function render3DRichWorldHQ(
  group: THREE.Group,
  w: number,
  d: number,
  H: number,
  mats: Record<string, THREE.Material>
): THREE.PointLight {
  // Tier 1: Ground Atrium Base
  const baseRadius = Math.min(w, d) * 0.46;
  const baseH = H * 0.35;
  const baseGeo = new THREE.CylinderGeometry(baseRadius, baseRadius * 1.05, baseH, 32);
  const baseMesh = new THREE.Mesh(baseGeo, mats.glassBlue);
  baseMesh.position.y = baseH / 2;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Tier 2: Stepped Mid-Tower
  const midRadius = baseRadius * 0.85;
  const midH = H * 0.45;
  const midGeo = new THREE.CylinderGeometry(midRadius, midRadius, midH, 32);
  const midMesh = new THREE.Mesh(midGeo, mats.glassBlue);
  midMesh.position.y = baseH + midH / 2;
  midMesh.castShadow = true;
  group.add(midMesh);

  // Sky Garden Hedges on Tier 1 Setback
  const hedgeGeo = new THREE.TorusGeometry((baseRadius + midRadius) / 2, 2.5, 8, 24);
  hedgeGeo.rotateX(Math.PI / 2);
  const hedgeMesh = new THREE.Mesh(hedgeGeo, mats.treeFoliage1);
  hedgeMesh.position.y = baseH + 1;
  group.add(hedgeMesh);

  // Tier 3: Circular Penthouse Crown
  const crownRadius = midRadius * 0.65;
  const crownH = H * 0.2;
  const crownGeo = new THREE.CylinderGeometry(crownRadius, crownRadius, crownH, 24);
  const crownMesh = new THREE.Mesh(crownGeo, mats.whiteTrim);
  crownMesh.position.y = baseH + midH + crownH / 2;
  crownMesh.castShadow = true;
  group.add(crownMesh);

  // Communications Spire
  const spireGeo = new THREE.CylinderGeometry(1, 2, 45, 12);
  const spireMesh = new THREE.Mesh(spireGeo, mats.whiteTrim);
  spireMesh.position.y = baseH + midH + crownH + 22.5;
  group.add(spireMesh);

  // Pulsing Red Aviation Warning Beacon Light
  const beaconLight = new THREE.PointLight(0xef4444, 1.8, 120);
  beaconLight.position.y = baseH + midH + crownH + 45;
  group.add(beaconLight);

  const beaconGeo = new THREE.SphereGeometry(2.5, 8, 8);
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
  beaconMesh.position.y = baseH + midH + crownH + 45;
  group.add(beaconMesh);

  // Double-height Curved Glass Entrance Canopy
  const canopyGeo = new THREE.CylinderGeometry(28, 28, 6, 16, 1, false, 0, Math.PI);
  const canopyMesh = new THREE.Mesh(canopyGeo, mats.whiteTrim);
  canopyMesh.position.set(0, 12, baseRadius - 4);
  canopyMesh.rotation.y = Math.PI / 2;
  group.add(canopyMesh);

  return beaconLight;
}

/* --------------------------------------------------------------------------
   2. TECHNOLOGY & AI STUDIO - Blue Glass Facility with Chillers & Solar Panels
   -------------------------------------------------------------------------- */
function render3DTechAiStudio(
  group: THREE.Group,
  w: number,
  d: number,
  H: number,
  mats: Record<string, THREE.Material>
) {
  // Main Body
  const bodyGeo = new THREE.BoxGeometry(w, H, d);
  const bodyMesh = new THREE.Mesh(bodyGeo, mats.glassBlue);
  bodyMesh.position.y = H / 2;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // White Exoskeleton Frame Corners
  const frameMat = mats.whiteTrim;
  const colGeo = new THREE.BoxGeometry(4, H + 2, 4);
  const col1 = new THREE.Mesh(colGeo, frameMat);
  col1.position.set(-w / 2, H / 2, -d / 2);
  group.add(col1);

  const col2 = new THREE.Mesh(colGeo, frameMat);
  col2.position.set(w / 2, H / 2, -d / 2);
  group.add(col2);

  const col3 = new THREE.Mesh(colGeo, frameMat);
  col3.position.set(-w / 2, H / 2, d / 2);
  group.add(col3);

  const col4 = new THREE.Mesh(colGeo, frameMat);
  col4.position.set(w / 2, H / 2, d / 2);
  group.add(col4);

  // Sunken Roof Parapet
  const roofTray = new THREE.Mesh(new THREE.BoxGeometry(w - 6, 2, d - 6), mats.roofDark);
  roofTray.position.y = H - 0.5;
  group.add(roofTray);

  // Rooftop Dual HVAC Chillers
  render3DHvacChiller(group, -w / 4, H + 6, 0, mats);
  render3DHvacChiller(group, -w / 4 + 32, H + 6, 0, mats);

  // Rooftop Solar Panel Array
  const solarGeo = new THREE.BoxGeometry(65, 2, 35);
  const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.2, metalness: 0.8 });
  const solarMesh = new THREE.Mesh(solarGeo, solarMat);
  solarMesh.position.set(w / 4, H + 4, 0);
  solarMesh.rotation.x = 0.2;
  solarMesh.castShadow = true;
  group.add(solarMesh);

  // Cantilevered Glass Entrance
  const doorGeo = new THREE.BoxGeometry(50, 24, 18);
  const doorMesh = new THREE.Mesh(doorGeo, mats.whiteTrim);
  doorMesh.position.set(0, 12, d / 2 + 6);
  doorMesh.castShadow = true;
  group.add(doorMesh);
}

function render3DHvacChiller(
  group: THREE.Group,
  x: number,
  y: number,
  z: number,
  mats: Record<string, THREE.Material>
) {
  const chillerGeo = new THREE.BoxGeometry(26, 12, 22);
  const chillerMesh = new THREE.Mesh(chillerGeo, mats.roofGrey);
  chillerMesh.position.set(x, y, z);
  chillerMesh.castShadow = true;
  group.add(chillerMesh);

  // Circular Fan Grille
  const fanGeo = new THREE.CylinderGeometry(6, 6, 1.5, 16);
  const fanMesh = new THREE.Mesh(fanGeo, mats.roofDark);
  fanMesh.position.set(x, y + 6.5, z);
  group.add(fanMesh);
}

/* --------------------------------------------------------------------------
   3. RICHBUILD - Construction Showroom with Yellow Lattice Tower Crane
   -------------------------------------------------------------------------- */
function render3DRichBuild(
  group: THREE.Group,
  w: number,
  d: number,
  H: number,
  mats: Record<string, THREE.Material>
) {
  // Showroom Main Building
  const bodyGeo = new THREE.BoxGeometry(w, H, d);
  const bodyMesh = new THREE.Mesh(bodyGeo, mats.roofConcrete);
  bodyMesh.position.y = H / 2;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Architectural Blueprint Display Windows
  const bpGeo = new THREE.BoxGeometry(w - 20, 24, 2);
  const bpMesh = new THREE.Mesh(bpGeo, mats.glassBlue);
  bpMesh.position.set(0, 22, d / 2 + 1);
  group.add(bpMesh);

  // FULL 3D YELLOW LATTICE TOWER CRANE (Exact signature from reference image!)
  const craneGroup = new THREE.Group();
  craneGroup.position.set(-w / 3, 0, 0);

  // Vertical Lattice Mast
  const mastH = H + 85;
  const mastGeo = new THREE.BoxGeometry(6, mastH, 6);
  const mastMesh = new THREE.Mesh(mastGeo, mats.safetyYellow);
  mastMesh.position.y = mastH / 2;
  mastMesh.castShadow = true;
  craneGroup.add(mastMesh);

  // Crane Operator Cab
  const cabGeo = new THREE.BoxGeometry(10, 10, 12);
  const cabMesh = new THREE.Mesh(cabGeo, mats.glassDark);
  cabMesh.position.set(4, mastH - 8, 0);
  cabMesh.castShadow = true;
  craneGroup.add(cabMesh);

  // Horizontal Lattice Boom / Jib (160px forward length)
  const boomL = 160;
  const boomGeo = new THREE.BoxGeometry(boomL, 5, 5);
  const boomMesh = new THREE.Mesh(boomGeo, mats.safetyYellow);
  boomMesh.position.set(boomL / 2 - 10, mastH + 2.5, 0);
  boomMesh.castShadow = true;
  craneGroup.add(boomMesh);

  // Counter-Jib (rear length 45px) with Concrete Counterweight Block
  const counterGeo = new THREE.BoxGeometry(45, 5, 5);
  const counterMesh = new THREE.Mesh(counterGeo, mats.safetyYellow);
  counterMesh.position.set(-30, mastH + 2.5, 0);
  counterMesh.castShadow = true;
  craneGroup.add(counterMesh);

  const weightGeo = new THREE.BoxGeometry(16, 12, 12);
  const weightMesh = new THREE.Mesh(weightGeo, mats.roofGrey);
  weightMesh.position.set(-42, mastH + 4, 0);
  weightMesh.castShadow = true;
  craneGroup.add(weightMesh);

  // Hoist Cable & Hook hanging down
  const cableGeo = new THREE.CylinderGeometry(0.3, 0.3, 50, 4);
  const cableMat = mats.roofDark;
  const cableMesh = new THREE.Mesh(cableGeo, cableMat);
  cableMesh.position.set(80, mastH - 25, 0);
  craneGroup.add(cableMesh);

  const hookGeo = new THREE.BoxGeometry(4, 6, 4);
  const hookMesh = new THREE.Mesh(hookGeo, mats.safetyYellow);
  hookMesh.position.set(80, mastH - 52, 0);
  craneGroup.add(hookMesh);

  group.add(craneGroup);
}

/* --------------------------------------------------------------------------
   4. RICHFINANCE - Dark Bronze Corporate Tower with Vertical Fins
   -------------------------------------------------------------------------- */
function render3DRichFinance(
  group: THREE.Group,
  w: number,
  d: number,
  H: number,
  mats: Record<string, THREE.Material>
) {
  // Dark Glass Tower
  const bodyGeo = new THREE.BoxGeometry(w, H, d);
  const bodyMesh = new THREE.Mesh(bodyGeo, mats.glassDark);
  bodyMesh.position.y = H / 2;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Vertical Gold / Bronze Architectural Sun Fins (Louvers)
  const finMat = mats.goldBronze;
  for (let x = -w / 2 + 14; x < w / 2; x += 18) {
    const finGeo = new THREE.BoxGeometry(2, H - 18, 3.5);
    const finMesh = new THREE.Mesh(finGeo, finMat);
    finMesh.position.set(x, H / 2, d / 2 + 1.2);
    group.add(finMesh);
  }

  // Live Digital Ticker Tape Bar
  const tickerGeo = new THREE.BoxGeometry(w - 16, 8, 2);
  const tickerMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const tickerMesh = new THREE.Mesh(tickerGeo, tickerMat);
  tickerMesh.position.set(0, H - 10, d / 2 + 2);
  group.add(tickerMesh);

  // Corporate Entrance Portico
  const porticoGeo = new THREE.BoxGeometry(55, 20, 14);
  const porticoMesh = new THREE.Mesh(porticoGeo, mats.goldBronze);
  porticoMesh.position.set(0, 10, d / 2 + 6);
  porticoMesh.castShadow = true;
  group.add(porticoMesh);
}

/* --------------------------------------------------------------------------
   5. RICHACADEMY - Collegiate Red Brick School with Clock Tower
   -------------------------------------------------------------------------- */
function render3DRichAcademy(
  group: THREE.Group,
  w: number,
  d: number,
  H: number,
  mats: Record<string, THREE.Material>
) {
  // Red Brick Campus Main Building
  const bodyGeo = new THREE.BoxGeometry(w, H, d);
  const bodyMesh = new THREE.Mesh(bodyGeo, mats.brickRed);
  bodyMesh.position.y = H / 2;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Pitched Roof
  const roofGeo = new THREE.ConeGeometry(w * 0.65, 22, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roofMesh = new THREE.Mesh(roofGeo, mats.roofDark);
  roofMesh.position.y = H + 11;
  roofMesh.scale.set(1, 1, d / w);
  roofMesh.castShadow = true;
  group.add(roofMesh);

  // Central Clock Tower
  const towerW = 38;
  const towerH = 45;
  const towerGeo = new THREE.BoxGeometry(towerW, towerH, towerW);
  const towerMesh = new THREE.Mesh(towerGeo, mats.whiteTrim);
  towerMesh.position.y = H + towerH / 2;
  towerMesh.castShadow = true;
  group.add(towerMesh);

  // Clock Face
  const clockGeo = new THREE.CylinderGeometry(8, 8, 1, 24);
  clockGeo.rotateX(Math.PI / 2);
  const clockMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const clockMesh = new THREE.Mesh(clockGeo, clockMat);
  clockMesh.position.set(0, H + towerH - 12, towerW / 2 + 1);
  group.add(clockMesh);

  // Bronze Bell Cupola
  const cupolaGeo = new THREE.SphereGeometry(7, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const cupolaMat = mats.goldBronze;
  const cupolaMesh = new THREE.Mesh(cupolaGeo, cupolaMat);
  cupolaMesh.position.y = H + towerH;
  group.add(cupolaMesh);

  // Neoclassical White Columns Entrance
  const colGeo = new THREE.CylinderGeometry(2, 2, 26, 12);
  const colMat = mats.whiteTrim;
  const col1 = new THREE.Mesh(colGeo, colMat);
  col1.position.set(-22, 13, d / 2 + 6);
  col1.castShadow = true;
  group.add(col1);

  const col2 = new THREE.Mesh(colGeo, colMat);
  col2.position.set(22, 13, d / 2 + 6);
  col2.castShadow = true;
  group.add(col2);

  const pedimentGeo = new THREE.BoxGeometry(58, 8, 16);
  const pedimentMesh = new THREE.Mesh(pedimentGeo, colMat);
  pedimentMesh.position.set(0, 28, d / 2 + 6);
  pedimentMesh.castShadow = true;
  group.add(pedimentMesh);
}

/* --------------------------------------------------------------------------
   6. RICHLOGISTICS - Industrial Warehouse with Loading Bays & Trucks
   -------------------------------------------------------------------------- */
function render3DRichLogistics(
  group: THREE.Group,
  w: number,
  d: number,
  H: number,
  mats: Record<string, THREE.Material>
) {
  // Main Industrial Warehouse
  const bodyGeo = new THREE.BoxGeometry(w, H, d);
  const bodyMesh = new THREE.Mesh(bodyGeo, mats.whiteTrim);
  bodyMesh.position.y = H / 2;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Safety Amber Hazard Stripe
  const stripeGeo = new THREE.BoxGeometry(w + 1, 6, d + 1);
  const stripeMesh = new THREE.Mesh(stripeGeo, mats.industrialAmber);
  stripeMesh.position.y = H - 8;
  group.add(stripeMesh);

  // 3 Roll-Up Loading Dock Bays
  const bayW = 46;
  const bayH = 36;
  const bays = [-w / 3, 0, w / 3 - 25];

  for (const bx of bays) {
    const bayGeo = new THREE.BoxGeometry(bayW, bayH, 6);
    const bayMesh = new THREE.Mesh(bayGeo, mats.roofGrey);
    bayMesh.position.set(bx, bayH / 2, d / 2 + 2);
    group.add(bayMesh);

    // Parked Delivery Box Truck backed up to bay
    render3DDeliveryTruck(group, bx, d / 2 + 32, mats);
  }
}

function render3DDeliveryTruck(
  group: THREE.Group,
  x: number,
  z: number,
  mats: Record<string, THREE.Material>
) {
  const truckGroup = new THREE.Group();
  truckGroup.position.set(x, 0, z);

  // Cargo Box
  const boxGeo = new THREE.BoxGeometry(26, 22, 36);
  const boxMesh = new THREE.Mesh(boxGeo, mats.whiteTrim);
  boxMesh.position.set(0, 14, -6);
  boxMesh.castShadow = true;
  truckGroup.add(boxMesh);

  // Truck Cab
  const cabGeo = new THREE.BoxGeometry(24, 16, 16);
  const cabMesh = new THREE.Mesh(cabGeo, mats.industrialAmber);
  cabMesh.position.set(0, 10, 18);
  cabMesh.castShadow = true;
  truckGroup.add(cabMesh);

  // Cab Windshield
  const wsGeo = new THREE.BoxGeometry(22, 8, 2);
  const wsMesh = new THREE.Mesh(wsGeo, mats.glassDark);
  wsMesh.position.set(0, 12, 26.2);
  truckGroup.add(wsMesh);

  group.add(truckGroup);
}

/* --------------------------------------------------------------------------
   7. RICHMART - Supermarket with Red/Orange Striped Canopy
   -------------------------------------------------------------------------- */
function render3DRichMart(
  group: THREE.Group,
  w: number,
  d: number,
  H: number,
  mats: Record<string, THREE.Material>
) {
  // Main Store Body
  const bodyGeo = new THREE.BoxGeometry(w, H, d);
  const bodyMesh = new THREE.Mesh(bodyGeo, mats.whiteTrim);
  bodyMesh.position.y = H / 2;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Red & White Striped Canopy Awning spanning the storefront
  const canopyW = w - 10;
  const canopyGeo = new THREE.BoxGeometry(canopyW, 8, 20);
  const canopyMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.5 });
  const canopyMesh = new THREE.Mesh(canopyGeo, canopyMat);
  canopyMesh.position.set(0, 26, d / 2 + 8);
  canopyMesh.rotation.x = 0.15;
  canopyMesh.castShadow = true;
  group.add(canopyMesh);

  // Floor-to-Ceiling Glass Windows
  const glassGeo = new THREE.BoxGeometry(w - 24, 20, 2);
  const glassMesh = new THREE.Mesh(glassGeo, mats.glassBlue);
  glassMesh.position.set(0, 12, d / 2 + 1);
  group.add(glassMesh);
}

/* --------------------------------------------------------------------------
   8. RICHSTAY - Hotel with Porte-Cochère Canopy & Balconies
   -------------------------------------------------------------------------- */
function render3DRichStay(
  group: THREE.Group,
  w: number,
  d: number,
  H: number,
  mats: Record<string, THREE.Material>
) {
  // Main Hotel Body
  const bodyGeo = new THREE.BoxGeometry(w, H, d);
  const bodyMesh = new THREE.Mesh(bodyGeo, mats.whiteTrim);
  bodyMesh.position.y = H / 2;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Multi-Story Guest Balconies
  for (let y = 30; y < H - 15; y += 22) {
    for (let x = -w / 2 + 25; x < w / 2 - 20; x += 36) {
      const balcGeo = new THREE.BoxGeometry(26, 6, 8);
      const balcMesh = new THREE.Mesh(balcGeo, mats.glassBlue);
      balcMesh.position.set(x, y, d / 2 + 4);
      balcMesh.castShadow = true;
      group.add(balcMesh);
    }
  }

  // Grand Porte-Cochère Driveway Canopy (from reference image)
  const canopyW = 90;
  const canopyD = 38;
  const canopyGeo = new THREE.BoxGeometry(canopyW, 6, canopyD);
  const canopyMesh = new THREE.Mesh(canopyGeo, mats.hotelPurple);
  canopyMesh.position.set(0, 22, d / 2 + canopyD / 2);
  canopyMesh.castShadow = true;
  group.add(canopyMesh);

  // Brass Support Pillars
  const pillarGeo = new THREE.CylinderGeometry(1.8, 1.8, 22, 12);
  const p1 = new THREE.Mesh(pillarGeo, mats.goldBronze);
  p1.position.set(-canopyW / 2 + 6, 11, d / 2 + canopyD - 4);
  group.add(p1);

  const p2 = new THREE.Mesh(pillarGeo, mats.goldBronze);
  p2.position.set(canopyW / 2 - 6, 11, d / 2 + canopyD - 4);
  group.add(p2);

  // Red Carpet Runner Under Canopy
  const carpetGeo = new THREE.BoxGeometry(24, 0.4, canopyD + 10);
  const carpetMesh = new THREE.Mesh(carpetGeo, mats.bistroCrimson);
  carpetMesh.position.set(0, 0.8, d / 2 + canopyD / 2);
  group.add(carpetMesh);

  // Rooftop Swimming Pool
  const poolGeo = new THREE.BoxGeometry(50, 2, 28);
  const poolMesh = new THREE.Mesh(poolGeo, mats.fountainWater);
  poolMesh.position.set(-w / 4, H + 0.5, 0);
  group.add(poolMesh);
}

/* --------------------------------------------------------------------------
   9. RICHFOODS - Restaurant & Bistro with Outdoor Dining Patio
   -------------------------------------------------------------------------- */
function render3DRichFoods(
  group: THREE.Group,
  w: number,
  d: number,
  H: number,
  mats: Record<string, THREE.Material>
) {
  // Main Bistro Body
  const bodyGeo = new THREE.BoxGeometry(w, H, d);
  const bodyMesh = new THREE.Mesh(bodyGeo, mats.brickRed);
  bodyMesh.position.y = H / 2;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Striped Canvas Awning
  const awningGeo = new THREE.BoxGeometry(w - 12, 6, 16);
  const awningMesh = new THREE.Mesh(awningGeo, mats.bistroCrimson);
  awningMesh.position.set(0, 22, d / 2 + 7);
  awningMesh.rotation.x = 0.2;
  awningMesh.castShadow = true;
  group.add(awningMesh);

  // Outdoor Dining Patio with Umbrella Tables
  render3DPatioTable(group, -30, d / 2 + 20, mats);
  render3DPatioTable(group, 10, d / 2 + 20, mats);
  render3DPatioTable(group, 45, d / 2 + 20, mats);
}

function render3DPatioTable(
  group: THREE.Group,
  x: number,
  z: number,
  mats: Record<string, THREE.Material>
) {
  const tableGroup = new THREE.Group();
  tableGroup.position.set(x, 0, z);

  // Table top
  const topGeo = new THREE.CylinderGeometry(8, 8, 1, 16);
  const topMesh = new THREE.Mesh(topGeo, mats.whiteTrim);
  topMesh.position.y = 7;
  topMesh.castShadow = true;
  tableGroup.add(topMesh);

  // Pole
  const poleGeo = new THREE.CylinderGeometry(0.6, 0.6, 18, 8);
  const poleMesh = new THREE.Mesh(poleGeo, mats.roofDark);
  poleMesh.position.y = 9;
  tableGroup.add(poleMesh);

  // Parasol Umbrella Cone
  const umbrellaGeo = new THREE.ConeGeometry(14, 6, 16);
  const umbrellaMesh = new THREE.Mesh(umbrellaGeo, mats.bistroCrimson);
  umbrellaMesh.position.y = 18;
  umbrellaMesh.castShadow = true;
  tableGroup.add(umbrellaMesh);

  group.add(tableGroup);
}

/* --------------------------------------------------------------------------
   10. RICHHEALTH - Hospital & Medical Center with Helipad & Ambulance Bay
   -------------------------------------------------------------------------- */
function render3DRichHealth(
  group: THREE.Group,
  w: number,
  d: number,
  H: number,
  mats: Record<string, THREE.Material>
): THREE.PointLight {
  // Main Clinical Pavilion
  const bodyGeo = new THREE.BoxGeometry(w, H, d);
  const bodyMesh = new THREE.Mesh(bodyGeo, mats.whiteTrim);
  bodyMesh.position.y = H / 2;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Red Medical Cross Emblem
  const crossH = new THREE.Mesh(new THREE.BoxGeometry(18, 5, 2), mats.bistroCrimson);
  crossH.position.set(-w / 3, H - 15, d / 2 + 1.2);
  group.add(crossH);

  const crossV = new THREE.Mesh(new THREE.BoxGeometry(5, 18, 2), mats.bistroCrimson);
  crossV.position.set(-w / 3, H - 15, d / 2 + 1.2);
  group.add(crossV);

  // Emergency Wing (Right Side)
  const erGeo = new THREE.BoxGeometry(70, H * 0.7, 20);
  const erMesh = new THREE.Mesh(erGeo, mats.whiteTrim);
  erMesh.position.set(w / 2 - 35, (H * 0.7) / 2, d / 2 + 8);
  erMesh.castShadow = true;
  group.add(erMesh);

  // Red "EMERGENCY" Header
  const erSignGeo = new THREE.BoxGeometry(60, 6, 2);
  const erSignMesh = new THREE.Mesh(erSignGeo, mats.bistroCrimson);
  erSignMesh.position.set(w / 2 - 35, H * 0.7 - 5, d / 2 + 18.2);
  group.add(erSignMesh);

  // Rooftop Helipad
  const helipadRadius = 22;
  const helipadGeo = new THREE.CylinderGeometry(helipadRadius, helipadRadius, 1.5, 32);
  const helipadMat = mats.roofDark;
  const helipadMesh = new THREE.Mesh(helipadGeo, helipadMat);
  helipadMesh.position.set(w / 3, H + 0.8, 0);
  helipadMesh.receiveShadow = true;
  group.add(helipadMesh);

  // Helipad Yellow Perimeter Strobe Light
  const helipadLight = new THREE.PointLight(0xfacc15, 2, 80);
  helipadLight.position.set(w / 3, H + 8, 0);
  group.add(helipadLight);

  // Parked 3D Ambulance
  render3DAmbulance(group, w / 2 - 35, d / 2 + 30, mats);

  return helipadLight;
}

function render3DAmbulance(
  group: THREE.Group,
  x: number,
  z: number,
  mats: Record<string, THREE.Material>
) {
  const ambGroup = new THREE.Group();
  ambGroup.position.set(x, 0, z);

  // Van Body
  const bodyGeo = new THREE.BoxGeometry(22, 16, 44);
  const bodyMesh = new THREE.Mesh(bodyGeo, mats.whiteTrim);
  bodyMesh.position.y = 10;
  bodyMesh.castShadow = true;
  ambGroup.add(bodyMesh);

  // Red Stripe
  const stripeGeo = new THREE.BoxGeometry(22.5, 3.5, 44.5);
  const stripeMesh = new THREE.Mesh(stripeGeo, mats.bistroCrimson);
  stripeMesh.position.y = 9;
  ambGroup.add(stripeMesh);

  // Flashing Lightbar on Roof
  const lightbarGeo = new THREE.BoxGeometry(12, 3, 5);
  const lightbarMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const lightbarMesh = new THREE.Mesh(lightbarGeo, lightbarMat);
  lightbarMesh.position.set(0, 19.5, 6);
  ambGroup.add(lightbarMesh);

  group.add(ambGroup);
}

/* --------------------------------------------------------------------------
   11. TRANSIT STATION - Vaulted Arched Terminal with Commuter Train & Bus
   -------------------------------------------------------------------------- */
function render3DTransitStation(
  group: THREE.Group,
  w: number,
  d: number,
  H: number,
  mats: Record<string, THREE.Material>
) {
  // Vaulted Arched Glass & Tubular Steel Canopy (from reference image)
  const archGeo = new THREE.CylinderGeometry(w * 0.48, w * 0.48, d, 24, 1, true, 0, Math.PI);
  archGeo.rotateZ(Math.PI / 2);
  const archMesh = new THREE.Mesh(archGeo, mats.glassBlue);
  archMesh.position.set(0, H, 0);
  archMesh.castShadow = true;
  group.add(archMesh);

  // Passenger Boarding Platform
  const platGeo = new THREE.BoxGeometry(w - 20, 4, d - 20);
  const platMesh = new THREE.Mesh(platGeo, mats.sidewalk);
  platMesh.position.set(0, 2, 0);
  platMesh.receiveShadow = true;
  group.add(platMesh);

  // 3D Passenger Commuter Train on Platform Tracks
  const trainW = 20;
  const trainH = 22;
  const trainL = w - 40;
  const trainGeo = new THREE.BoxGeometry(trainL, trainH, trainW);
  const trainMesh = new THREE.Mesh(trainGeo, mats.whiteTrim);
  trainMesh.position.set(0, 14, -d / 4);
  trainMesh.castShadow = true;
  group.add(trainMesh);

  // Blue Transit Stripe on Train
  const tStripeGeo = new THREE.BoxGeometry(trainL + 0.5, 4, trainW + 0.5);
  const tStripeMesh = new THREE.Mesh(tStripeGeo, mats.glassBlue);
  tStripeMesh.position.set(0, 12, -d / 4);
  group.add(tStripeMesh);

  // 3D City Transit Bus at Curbside Bus Stop
  render3DCityBus(group, 0, d / 2 + 20, mats);
}

function render3DCityBus(
  group: THREE.Group,
  x: number,
  z: number,
  mats: Record<string, THREE.Material>
) {
  const busGroup = new THREE.Group();
  busGroup.position.set(x, 0, z);

  // Bus Body
  const bodyGeo = new THREE.BoxGeometry(75, 20, 22);
  const bodyMesh = new THREE.Mesh(bodyGeo, mats.whiteTrim);
  bodyMesh.position.y = 11;
  bodyMesh.castShadow = true;
  busGroup.add(bodyMesh);

  // Blue Lower Stripe
  const stripeGeo = new THREE.BoxGeometry(75.5, 6, 22.5);
  const stripeMesh = new THREE.Mesh(stripeGeo, mats.glassBlue);
  stripeMesh.position.y = 5;
  busGroup.add(stripeMesh);

  group.add(busGroup);
}

/* ==========================================================================
   3D URBAN OBJECTS & CARS
   ========================================================================== */

function render3DUrbanObjects(
  scene: THREE.Scene,
  objects: EnvironmentObject[],
  mats: Record<string, THREE.Material>
) {
  for (const obj of objects) {
    const posX = obj.x - 1400;
    const posZ = obj.y - 1000;

    if (obj.type === 'tree') {
      render3DTree(scene, posX, posZ, mats);
    } else if (obj.type === 'streetlight') {
      render3DStreetlight(scene, posX, posZ, mats);
    } else if (obj.type === 'bench') {
      render3DBench(scene, posX, posZ, mats);
    }
  }
}

function render3DTree(
  scene: THREE.Scene,
  x: number,
  z: number,
  mats: Record<string, THREE.Material>
) {
  const treeGroup = new THREE.Group();
  treeGroup.position.set(x, 0, z);

  // Cast-iron sidewalk grate
  const grateGeo = new THREE.BoxGeometry(16, 0.4, 16);
  const grateMesh = new THREE.Mesh(grateGeo, mats.roofDark);
  grateMesh.position.y = 1.35;
  treeGroup.add(grateMesh);

  // Trunk
  const trunkGeo = new THREE.CylinderGeometry(1.5, 2.2, 16, 8);
  const trunkMesh = new THREE.Mesh(trunkGeo, mats.treeBark);
  trunkMesh.position.y = 8;
  trunkMesh.castShadow = true;
  treeGroup.add(trunkMesh);

  // Layered 3D Foliage
  const foliageGeo1 = new THREE.SphereGeometry(14, 12, 12);
  const foliage1 = new THREE.Mesh(foliageGeo1, mats.treeFoliage1);
  foliage1.position.y = 20;
  foliage1.castShadow = true;
  treeGroup.add(foliage1);

  const foliageGeo2 = new THREE.SphereGeometry(10, 10, 10);
  const foliage2 = new THREE.Mesh(foliageGeo2, mats.treeFoliage2);
  foliage2.position.y = 28;
  foliage2.castShadow = true;
  treeGroup.add(foliage2);

  scene.add(treeGroup);
}

function render3DStreetlight(
  scene: THREE.Scene,
  x: number,
  z: number,
  mats: Record<string, THREE.Material>
) {
  const poleGeo = new THREE.CylinderGeometry(0.8, 1.2, 24, 8);
  const poleMesh = new THREE.Mesh(poleGeo, mats.roofGrey);
  poleMesh.position.set(x, 12, z);
  poleMesh.castShadow = true;
  scene.add(poleMesh);

  // Luminaire Head
  const headGeo = new THREE.BoxGeometry(8, 1.5, 3);
  const headMesh = new THREE.Mesh(headGeo, mats.roofDark);
  headMesh.position.set(x + 3, 24, z);
  scene.add(headMesh);

  // Warm LED Light Bulb
  const bulbLight = new THREE.PointLight(0xfef08a, 0.85, 45);
  bulbLight.position.set(x + 5, 23, z);
  scene.add(bulbLight);
}

function render3DBench(
  scene: THREE.Scene,
  x: number,
  z: number,
  mats: Record<string, THREE.Material>
) {
  const benchGeo = new THREE.BoxGeometry(16, 4, 6);
  const benchMesh = new THREE.Mesh(benchGeo, mats.treeBark);
  benchMesh.position.set(x, 3, z);
  benchMesh.castShadow = true;
  scene.add(benchMesh);
}

/* ==========================================================================
   ANIMATED 3D MOVING TRAFFIC
   ========================================================================== */

function create3DTrafficCars(
  scene: THREE.Scene
): THREE.Group[] {
  const car1 = createCarMesh(0xef4444); // Red Sedan
  car1.position.set(200, 1.3, -155);
  scene.add(car1);

  const car2 = createCarMesh(0xfacc15); // Yellow Taxi
  car2.position.set(-300, 1.3, -90);
  scene.add(car2);

  const car3 = createCarMesh(0xffffff); // White Sedan
  car3.position.set(-80, 1.3, -400);
  scene.add(car3);

  return [car1, car2, car3];
}

function createCarMesh(color: number): THREE.Group {
  const carGroup = new THREE.Group();

  // Car Body
  const bodyGeo = new THREE.BoxGeometry(32, 7.5, 15);
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.3 });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.position.y = 5.5;
  bodyMesh.castShadow = true;
  carGroup.add(bodyMesh);

  // Cabin / Roof
  const cabGeo = new THREE.BoxGeometry(18, 6.5, 13);
  const cabMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
  const cabMesh = new THREE.Mesh(cabGeo, cabMat);
  cabMesh.position.set(-2, 11, 0);
  cabMesh.castShadow = true;
  carGroup.add(cabMesh);

  // Wheels
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
  const wheelGeo = new THREE.CylinderGeometry(3, 3, 2, 12);
  wheelGeo.rotateX(Math.PI / 2);

  const wPositions = [
    [-9, 3, -7.5],
    [9, 3, -7.5],
    [-9, 3, 7.5],
    [9, 3, 7.5],
  ];
  for (const pos of wPositions) {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.position.set(pos[0], pos[1], pos[2]);
    carGroup.add(wheel);
  }

  // Headlights
  const hlMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const hl1 = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 2.5), hlMat);
  hl1.position.set(16, 5.5, -4.5);
  carGroup.add(hl1);

  const hl2 = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 2.5), hlMat);
  hl2.position.set(16, 5.5, 4.5);
  carGroup.add(hl2);

  return carGroup;
}
