export interface Vector2D {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type DistrictId =
  | 'rich-hq'
  | 'richacademy'
  | 'tech-ai'
  | 'richhealth'
  | 'richfinance'
  | 'richmart'
  | 'richstay'
  | 'richfoods'
  | 'richlogistics'
  | 'richbuild'
  | 'transit';

export interface Building {
  id: DistrictId;
  name: string;
  category: string;
  tagline: string;
  themeColor: string;
  accentColor: string;
  lightBg: string;
  bounds: Rect;
  door: Vector2D;
  interactionRadius: number;
  description: string;
  features: string[];
}

export interface Road {
  x: number;
  y: number;
  width: number;
  height: number;
  direction: 'horizontal' | 'vertical';
  name?: string;
}

export interface EnvironmentObject {
  id: string;
  type:
    | 'tree'
    | 'bush'
    | 'streetlight'
    | 'planter'
    | 'bench'
    | 'fountain'
    | 'car'
    | 'van'
    | 'ambulance'
    | 'patio-table'
    | 'bike-rack'
    | 'trash-bin'
    | 'parking-spot'
    | 'shopping-cart-corral'
    | 'cargo-pallets'
    | 'flagpole'
    | 'bus'
    | 'basketball-court';
  x: number;
  y: number;
  width?: number;
  height?: number;
  variant?: number;
  direction?: 'horizontal' | 'vertical';
  color?: string;
  label?: string;
}

export type CharacterFacing = 'up' | 'down' | 'left' | 'right';
export type CharacterState = 'idle' | 'walking' | 'running' | 'jumping';

export interface PlayerCharacter {
  position: Vector2D;
  velocity: Vector2D;
  speed: number;
  facing: CharacterFacing;
  state: CharacterState;
  isMoving: boolean;
  jumpProgress: number; // 0 to 1 during jump
  walkTimer: number;    // used for step cycle
  idleTimer: number;    // used for idle breathing
  name: string;
  role: string;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
  target: Vector2D;
  viewportWidth: number;
  viewportHeight: number;
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shift: boolean;
  jump: boolean;
  interact: boolean;
}

export interface AmbientParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;
  color: string;
  phase: number;
}
