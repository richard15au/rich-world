import * as THREE from 'three';
import { PlayerCharacter } from './types';

export interface ThreeCharacterController {
  group: THREE.Group;
  update: (dt: number, player: PlayerCharacter, time: number, prefersReducedMotion: boolean) => void;
  dispose: () => void;
}

/**
 * High-fidelity 3D Player Character for RICH WORLD / RICH CITY.
 * Features:
 * - Stylized miniature / diorama anime avatar
 * - Layered tech-wear jacket with zipper and illuminated crest
 * - Yellow trainer backpack
 * - Red trainer cap with visor and emblem
 * - Articulated legs and arms with walking/running gait cycles
 * - Ground contact soft shadow
 */
export function createThreeCharacter(): ThreeCharacterController {
  const group = new THREE.Group();
  group.name = 'player-character';

  // Materials
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });
  const capMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const jacketMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.45 });
  const darkJacketMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 });
  const backpackMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.5 });
  const pantMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
  const sneakerMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
  const soleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

  // 1. Root Character Body (pivot at feet)
  const bodyRoot = new THREE.Group();
  group.add(bodyRoot);

  // 2. Legs
  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(-2.2, 5.5, 0);
  const leftLegMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 2.2), pantMat);
  leftLegMesh.position.y = -2.5;
  leftLegMesh.castShadow = true;
  leftLegGroup.add(leftLegMesh);

  const leftSneakerMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 3.4), sneakerMat);
  leftSneakerMesh.position.set(0, -4.5, 0.4);
  leftSneakerMesh.castShadow = true;
  leftLegGroup.add(leftSneakerMesh);

  const leftSoleMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 3.6), soleMat);
  leftSoleMesh.position.set(0, -5.2, 0.4);
  leftLegGroup.add(leftSoleMesh);
  bodyRoot.add(leftLegGroup);

  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(2.2, 5.5, 0);
  const rightLegMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 2.2), pantMat);
  rightLegMesh.position.y = -2.5;
  rightLegMesh.castShadow = true;
  rightLegGroup.add(rightLegMesh);

  const rightSneakerMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 3.4), sneakerMat);
  rightSneakerMesh.position.set(0, -4.5, 0.4);
  rightSneakerMesh.castShadow = true;
  rightLegGroup.add(rightSneakerMesh);

  const rightSoleMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 3.6), soleMat);
  rightSoleMesh.position.set(0, -5.2, 0.4);
  rightLegGroup.add(rightSoleMesh);
  bodyRoot.add(rightLegGroup);

  // 3. Torso & Jacket
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 9.5, 0);

  const jacketMesh = new THREE.Mesh(new THREE.BoxGeometry(6.5, 7.5, 4.2), jacketMat);
  jacketMesh.castShadow = true;
  jacketMesh.receiveShadow = true;
  torsoGroup.add(jacketMesh);

  // Collar / Inner Shirt
  const innerShirt = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.5, 0.4), whiteMat);
  innerShirt.position.set(0, 2.8, 2.12);
  torsoGroup.add(innerShirt);

  // Jacket Hem
  const jacketHem = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.2, 4.4), darkJacketMat);
  jacketHem.position.y = -3.4;
  torsoGroup.add(jacketHem);

  // Yellow Backpack
  const backpackMesh = new THREE.Mesh(new THREE.BoxGeometry(5.2, 6, 2.8), backpackMat);
  backpackMesh.position.set(0, 0.2, -2.8);
  backpackMesh.castShadow = true;
  torsoGroup.add(backpackMesh);

  const backpackPocket = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.8, 1), darkJacketMat);
  backpackPocket.position.set(0, -1.2, -4.2);
  torsoGroup.add(backpackPocket);

  bodyRoot.add(torsoGroup);

  // 4. Arms
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-4.2, 12.5, 0);
  const leftSleeveMesh = new THREE.Mesh(new THREE.BoxGeometry(1.8, 5.5, 2), jacketMat);
  leftSleeveMesh.position.y = -2.6;
  leftSleeveMesh.castShadow = true;
  leftArmGroup.add(leftSleeveMesh);

  const leftHandMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), skinMat);
  leftHandMesh.position.y = -5.5;
  leftArmGroup.add(leftHandMesh);
  bodyRoot.add(leftArmGroup);

  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(4.2, 12.5, 0);
  const rightSleeveMesh = new THREE.Mesh(new THREE.BoxGeometry(1.8, 5.5, 2), jacketMat);
  rightSleeveMesh.position.y = -2.6;
  rightSleeveMesh.castShadow = true;
  rightArmGroup.add(rightSleeveMesh);

  const rightHandMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), skinMat);
  rightHandMesh.position.y = -5.5;
  rightArmGroup.add(rightHandMesh);
  bodyRoot.add(rightArmGroup);

  // 5. Head, Hair & Red Trainer Cap
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 16.2, 0);

  // Head Base
  const headMesh = new THREE.Mesh(new THREE.BoxGeometry(5.4, 5.2, 5), skinMat);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Hair Back & Sides
  const hairBackMesh = new THREE.Mesh(new THREE.BoxGeometry(5.6, 4.5, 2.2), hairMat);
  hairBackMesh.position.set(0, -0.4, -2.2);
  headGroup.add(hairBackMesh);

  // Red Trainer Cap Dome
  const capDomeMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(3.2, 3.4, 3, 16),
    capMat
  );
  capDomeMesh.position.set(0, 2.2, 0);
  capDomeMesh.castShadow = true;
  headGroup.add(capDomeMesh);

  // White Cap Visor pointing forward
  const visorMesh = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.6, 3.6), whiteMat);
  visorMesh.position.set(0, 1.2, 3);
  visorMesh.rotation.x = 0.15;
  visorMesh.castShadow = true;
  headGroup.add(visorMesh);

  // Cap Poké-Emblem White Button
  const emblemMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2, 8), whiteMat);
  emblemMesh.rotation.x = Math.PI / 2;
  emblemMesh.position.set(0, 2.4, 3.25);
  headGroup.add(emblemMesh);

  bodyRoot.add(headGroup);

  // 6. Soft Ground Contact Shadow (follows on ground plane Y = 0.05)
  const shadowGeo = new THREE.CircleGeometry(4.2, 16);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x0f172a,
    transparent: true,
    opacity: 0.32,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.position.y = 0.08;
  group.add(shadowMesh);

  let targetRotationY = 0;
  let currentRotationY = 0;

  return {
    group,
    update: (_dt: number, player: PlayerCharacter, _time: number, prefersReducedMotion: boolean) => {
      // Position translation (World coords centered at 1400, 1000)
      const posX = player.position.x - 1400;
      const posZ = player.position.y - 1000;
      group.position.x = posX;
      group.position.z = posZ;

      // Vertical jumping physics
      const isJumping = player.state === 'jumping';
      const jumpHeight = isJumping && !prefersReducedMotion
        ? Math.sin(player.jumpProgress * Math.PI) * 14
        : 0;

      bodyRoot.position.y = jumpHeight;

      // Scale ground shadow down when jumping
      const shadowScale = isJumping ? Math.max(0.45, 1 - (jumpHeight / 14) * 0.5) : 1;
      shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);

      // Facing Rotation
      switch (player.facing) {
        case 'down':
          targetRotationY = 0; // Facing south towards camera
          break;
        case 'up':
          targetRotationY = Math.PI; // Facing north away from camera
          break;
        case 'left':
          targetRotationY = Math.PI * 0.5; // Facing west
          break;
        case 'right':
          targetRotationY = -Math.PI * 0.5; // Facing east
          break;
      }

      // Smooth rotation lerp
      let diff = targetRotationY - currentRotationY;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      currentRotationY += diff * 0.25;
      bodyRoot.rotation.y = currentRotationY;

      // Animation Kinematics
      const isMoving = player.state === 'walking' || player.state === 'running';
      const speedFreq = player.state === 'running' ? 14 : 9;
      const walkCycle = player.walkTimer * speedFreq;

      if (isMoving && !prefersReducedMotion) {
        const legAngle = Math.sin(walkCycle) * 0.65;
        leftLegGroup.rotation.x = legAngle;
        rightLegGroup.rotation.x = -legAngle;

        const armAngle = Math.sin(walkCycle) * 0.7;
        leftArmGroup.rotation.x = -armAngle;
        rightArmGroup.rotation.x = armAngle;

        // Torso slight bob
        torsoGroup.position.y = 9.5 + Math.abs(Math.sin(walkCycle * 2)) * 0.6;
        headGroup.position.y = 16.2 + Math.abs(Math.sin(walkCycle * 2)) * 0.8;
      } else {
        // Idle breathing
        const breath = prefersReducedMotion ? 0 : Math.sin(player.idleTimer * 2.5) * 0.3;
        leftLegGroup.rotation.x = 0;
        rightLegGroup.rotation.x = 0;
        leftArmGroup.rotation.x = 0;
        rightArmGroup.rotation.x = 0;
        torsoGroup.position.y = 9.5 + breath;
        headGroup.position.y = 16.2 + breath * 1.2;
      }
    },
    dispose: () => {
      // Clean up geometries and materials
      group.traverse((obj) => {
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
