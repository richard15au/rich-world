import { Building, Road, EnvironmentObject, PlayerCharacter } from './types';

export const WORLD_WIDTH = 2752;
export const WORLD_HEIGHT = 1536;

export const INITIAL_PLAYER: PlayerCharacter = {
  position: { x: 1376, y: 780 }, // Spawns in Central Plaza in front of the fountain
  velocity: { x: 0, y: 0 },
  speed: 240, // pixels per second
  facing: 'down',
  state: 'idle',
  isMoving: false,
  jumpProgress: 0,
  walkTimer: 0,
  idleTimer: 0,
  name: 'Richard',
  role: 'Architect & Builder',
};

export const BUILDINGS: Building[] = [
  // 1. Central Business District (CBD)
  {
    id: 'rich-hq',
    name: 'RICH WORLD HQ',
    category: 'Global Headquarters',
    tagline: 'Main Civic Landmark & Innovation Core',
    themeColor: '#0284c7', // Sky Blue / Rich World Cyan
    accentColor: '#38bdf8',
    lightBg: '#e0f2fe',
    bounds: { x: 1180, y: 100, width: 390, height: 490 },
    door: { x: 1376, y: 630 },
    interactionRadius: 110,
    description:
      'The premier global headquarters of RICH WORLD. An iconic architectural glass skyscraper featuring stepped curtain walls, executive suites, clock tower crown, and a welcoming atrium entrance.',
    features: ['Executive Boardrooms', 'Innovation Observatory', 'Digital Showcase Hub', 'Atrium Lobby'],
  },
  {
    id: 'richfinance',
    name: 'RichFinance',
    category: 'Financial Technology',
    tagline: 'Capital Systems & Financial Services',
    themeColor: '#0f766e', // Corporate Dark Teal / Emerald
    accentColor: '#14b8a6',
    lightBg: '#ccfbf1',
    bounds: { x: 1670, y: 220, width: 340, height: 370 },
    door: { x: 1840, y: 620 },
    interactionRadius: 105,
    description:
      'Modern financial technology center and corporate office tower. Houses capital analytics systems, automated transactional infrastructure, and wealth tech architectures.',
    features: ['Fintech Analytics Floor', 'Trading Floor Terminal', 'Capital Solutions Suite', 'Secure Vaults'],
  },
  {
    id: 'tech-ai',
    name: 'Technology & AI Studio',
    category: 'Software & Intelligent Systems',
    tagline: 'Autonomous Agents & LLM Pipelines',
    themeColor: '#2563eb', // Royal Blue / Tech Indigo
    accentColor: '#60a5fa',
    lightBg: '#dbeafe',
    bounds: { x: 650, y: 220, width: 380, height: 370 },
    door: { x: 840, y: 620 },
    interactionRadius: 105,
    description:
      'The central technology and AI research facility. Built with aerodynamic blue glass, white modern framing, rooftop solar arrays, and interactive developer terminals.',
    features: ['Agent Workstations', 'Inference Supercluster', 'Neural Cleanroom', 'Prompt Architecture Lab'],
  },

  // 2. Education & Community District
  {
    id: 'richacademy',
    name: 'RichAcademy',
    category: 'Education & Training',
    tagline: 'Learning Campus, Syllabi & Student Labs',
    themeColor: '#4f46e5', // Deep Indigo & Stone
    accentColor: '#818cf8',
    lightBg: '#e0e7ff',
    bounds: { x: 2150, y: 200, width: 500, height: 370 },
    door: { x: 2400, y: 600 },
    interactionRadius: 110,
    description:
      'The comprehensive educational campus of RICH WORLD. Designed in red-brick neoclassical collegiate style with white portico columns, clock cupola, and adjacent regulation basketball court.',
    features: ['Collegiate Portico', 'Interactive Syllabi', 'Student Labs', 'Regulation Basketball Court'],
  },
  {
    id: 'richhealth',
    name: 'RichHealth',
    category: 'Healthcare & Wellness',
    tagline: 'Modern Medical Center & Diagnostics',
    themeColor: '#0891b2', // Professional Healthcare Cyan/Teal
    accentColor: '#22d3ee',
    lightBg: '#cffafe',
    bounds: { x: 2170, y: 820, width: 380, height: 290 },
    door: { x: 2360, y: 1140 },
    interactionRadius: 105,
    description:
      'State-of-the-art medical pavilion and clinical informatics center. Features clean modern clinical wings, dedicated emergency ambulance bay, and rooftop helipad.',
    features: ['Emergency Bay', 'Clinical Diagnostics', 'Rooftop Helipad', 'Wellness Gardens'],
  },

  // 3. Retail & Hospitality District
  {
    id: 'richmart',
    name: 'RichMart',
    category: 'Retail & E-Commerce',
    tagline: 'Flagship Supermarket & Marketplace',
    themeColor: '#ea580c', // Vibrant Retail Orange/Amber
    accentColor: '#fb923c',
    lightBg: '#ffedd5',
    bounds: { x: 670, y: 960, width: 380, height: 280 },
    door: { x: 860, y: 1280 },
    interactionRadius: 105,
    description:
      'Modern retail flagship supermarket and marketplace. Features bright striped storefront awnings, extensive customer parking with parked cars, and order pickup kiosks.',
    features: ['Storefront Displays', 'Customer Parking Lot', 'Curbside Pickup Bay', 'Marketplace Aisles'],
  },
  {
    id: 'richstay',
    name: 'RichStay',
    category: 'Hospitality & Hotel',
    tagline: 'Mid-Rise Lifestyle Hotel & Suites',
    themeColor: '#7c3aed', // Luxury Purple / Gold
    accentColor: '#a78bfa',
    lightBg: '#ede9fe',
    bounds: { x: 1180, y: 960, width: 390, height: 380 },
    door: { x: 1376, y: 1380 },
    interactionRadius: 105,
    description:
      'Mid-rise modern luxury hotel. Features a grand architectural porte-cochère driveway canopy, guest balconies, luxury vehicles, and rooftop pool deck.',
    features: ['Porte-Cochère Canopy', 'Luxury Suites', 'Rooftop Pool Deck', 'Executive Lobby'],
  },
  {
    id: 'richfoods',
    name: 'RichFoods',
    category: 'Food & Culinary',
    tagline: 'Artisan Restaurant & Outdoor Patio',
    themeColor: '#dc2626', // Warm Crimson / Terracotta
    accentColor: '#f87171',
    lightBg: '#fee2e2',
    bounds: { x: 1650, y: 1020, width: 340, height: 330 },
    door: { x: 1820, y: 1380 },
    interactionRadius: 105,
    description:
      'Street-level gourmet bistro and cafe. Features red striped awnings, warm brick architecture, and an expansive outdoor dining patio with umbrella tables and garden planters.',
    features: ['Outdoor Patio Dining', 'Artisan Kitchen', 'Street-Side Cafe', 'Espresso Bar'],
  },

  // 4. Industrial & Services District
  {
    id: 'richlogistics',
    name: 'RichLogistics',
    category: 'Logistics & Distribution',
    tagline: 'Fulfillment Core & Delivery Fleet',
    themeColor: '#d97706', // Industrial Amber & Navy
    accentColor: '#f59e0b',
    lightBg: '#fef3c7',
    bounds: { x: 90, y: 1020, width: 420, height: 380 },
    door: { x: 300, y: 1440 },
    interactionRadius: 105,
    description:
      'Advanced fulfillment and logistics center. Features heavy-duty roll-up loading dock bays, white delivery box trucks, freight pallets, and perimeter security fencing.',
    features: ['Roll-Up Loading Docks', 'Delivery Box Trucks', 'Freight Pallet Staging', 'Automated Sorting'],
  },
  {
    id: 'richbuild',
    name: 'RichBuild',
    category: 'Construction & Infrastructure',
    tagline: 'Engineering Studio & Property Showroom',
    themeColor: '#475569', // Structural Steel & Safety Yellow
    accentColor: '#64748b',
    lightBg: '#f1f5f9',
    bounds: { x: 90, y: 240, width: 420, height: 380 },
    door: { x: 300, y: 660 },
    interactionRadius: 105,
    description:
      'Civil engineering and property development showroom. Prominently features an active yellow lattice tower crane, construction equipment, scaffolding, and digital blueprints.',
    features: ['Tower Crane', 'Architectural Showroom', 'Heavy Equipment Staging', 'Civil Planning Kiosk'],
  },

  // 5. Civic Transit Landmark
  {
    id: 'transit',
    name: 'Transit Station',
    category: 'Metropolitan Transit',
    tagline: 'Rapid Metro & City Transit Terminal',
    themeColor: '#059669', // Transit Emerald & Glass
    accentColor: '#10b981',
    lightBg: '#d1fae5',
    bounds: { x: 2170, y: 1140, width: 460, height: 260 },
    door: { x: 2400, y: 1440 },
    interactionRadius: 105,
    description:
      'Modern rapid-transit civic terminal. Features a sweeping curved glass vaulted canopy, passenger railway tracks with high-speed commuter train, and city transit bus staging.',
    features: ['Curved Glass Canopy', 'Commuter Train on Tracks', 'City Transit Bus', 'Passenger Platforms'],
  },
];

export const ROADS: Road[] = [
  // 1. Grand Civic Avenue (East-West Arterial connecting West to East through Central Plaza)
  {
    x: 100,
    y: 820,
    width: 2600,
    height: 120,
    direction: 'horizontal',
    name: 'Grand Civic Boulevard',
  },
  // 2. Central Nexus Promenade (North-South connecting CBD to South District)
  {
    x: 1290,
    y: 420,
    width: 120,
    height: 1400,
    direction: 'vertical',
    name: 'Central Promenade',
  },
  // 3. Retail & Hospitality Walkway (East-West Street in South District)
  {
    x: 680,
    y: 1140,
    width: 1300,
    height: 80,
    direction: 'horizontal',
    name: 'Commerce Promenade',
  },
  // 4. North CBD High Street (Access road north of HQ and Finance)
  {
    x: 740,
    y: 520,
    width: 1240,
    height: 70,
    direction: 'horizontal',
    name: 'Innovation Way',
  },
  // 5. West Industrial Road (North-South connector for Logistics and Build)
  {
    x: 680,
    y: 680,
    width: 80,
    height: 850,
    direction: 'vertical',
    name: 'Industrial Corridor',
  },
  // 6. East Campus Boulevard (North-South connector for Academy, Health, Transit)
  {
    x: 1940,
    y: 460,
    width: 90,
    height: 1100,
    direction: 'vertical',
    name: 'Academy Parkway',
  },
];

export const ENVIRONMENT_OBJECTS: EnvironmentObject[] = [
  // Central Civic Plaza Fountain
  { id: 'plaza-fountain', type: 'fountain', x: 1350, y: 1000, label: 'Central Civic Fountain' },

  // Plaza Benches & Streetlamps
  { id: 'plaza-bench-1', type: 'bench', x: 1280, y: 960 },
  { id: 'plaza-bench-2', type: 'bench', x: 1420, y: 960 },
  { id: 'plaza-bench-3', type: 'bench', x: 1280, y: 1040 },
  { id: 'plaza-bench-4', type: 'bench', x: 1420, y: 1040 },
  { id: 'plaza-lamp-1', type: 'streetlight', x: 1260, y: 940 },
  { id: 'plaza-lamp-2', type: 'streetlight', x: 1440, y: 940 },
  { id: 'plaza-lamp-3', type: 'streetlight', x: 1260, y: 1060 },
  { id: 'plaza-lamp-4', type: 'streetlight', x: 1440, y: 1060 },

  // Plaza Planters & Trash Bins
  { id: 'plaza-planter-1', type: 'planter', x: 1310, y: 930 },
  { id: 'plaza-planter-2', type: 'planter', x: 1390, y: 930 },
  { id: 'plaza-bin-1', type: 'trash-bin', x: 1250, y: 1000 },
  { id: 'plaza-bin-2', type: 'trash-bin', x: 1450, y: 1000 },

  // RichFoods Patio Dining Tables with Umbrellas
  { id: 'patio-tbl-1', type: 'patio-table', x: 1640, y: 1170, color: '#dc2626' },
  { id: 'patio-tbl-2', type: 'patio-table', x: 1690, y: 1170, color: '#dc2626' },
  { id: 'patio-tbl-3', type: 'patio-table', x: 1740, y: 1170, color: '#dc2626' },

  // RichLogistics Delivery Vans in Loading Bays
  { id: 'van-1', type: 'van', x: 420, y: 1140, direction: 'vertical', color: '#f59e0b' },
  { id: 'van-2', type: 'van', x: 480, y: 1140, direction: 'vertical', color: '#0284c7' },

  // Parked Sedan Cars in Parking Bays
  { id: 'car-1', type: 'car', x: 1540, y: 805, direction: 'horizontal', color: '#38bdf8' },
  { id: 'car-2', type: 'car', x: 1820, y: 805, direction: 'horizontal', color: '#ffffff' },
  { id: 'car-3', type: 'car', x: 880, y: 805, direction: 'horizontal', color: '#1e293b' },
  { id: 'car-4', type: 'car', x: 1060, y: 805, direction: 'horizontal', color: '#ef4444' },

  // Streetlamps along Main Boulevards
  { id: 'lamp-b-1', type: 'streetlight', x: 920, y: 810 },
  { id: 'lamp-b-2', type: 'streetlight', x: 1120, y: 810 },
  { id: 'lamp-b-3', type: 'streetlight', x: 1560, y: 810 },
  { id: 'lamp-b-4', type: 'streetlight', x: 1780, y: 810 },
  { id: 'lamp-b-5', type: 'streetlight', x: 920, y: 950 },
  { id: 'lamp-b-6', type: 'streetlight', x: 1120, y: 950 },
  { id: 'lamp-b-7', type: 'streetlight', x: 1560, y: 950 },
  { id: 'lamp-b-8', type: 'streetlight', x: 1780, y: 950 },

  // Landscaped Street Trees (Tasteful urban trees in sidewalk tree grates)
  { id: 'tree-u-1', type: 'tree', x: 1040, y: 810, variant: 0 },
  { id: 'tree-u-2', type: 'tree', x: 1660, y: 810, variant: 1 },
  { id: 'tree-u-3', type: 'tree', x: 1040, y: 950, variant: 1 },
  { id: 'tree-u-4', type: 'tree', x: 1660, y: 950, variant: 0 },
  { id: 'tree-u-5', type: 'tree', x: 1280, y: 650, variant: 2 },
  { id: 'tree-u-6', type: 'tree', x: 1420, y: 650, variant: 0 },
  { id: 'tree-u-7', type: 'tree', x: 1280, y: 1350, variant: 1 },
  { id: 'tree-u-8', type: 'tree', x: 1420, y: 1350, variant: 2 },

  // Landscaped Bushes & Hedge Planters
  { id: 'bush-1', type: 'bush', x: 1180, y: 800 },
  { id: 'bush-2', type: 'bush', x: 1520, y: 800 },
  { id: 'bush-3', type: 'bush', x: 1190, y: 1220 },
  { id: 'bush-4', type: 'bush', x: 1510, y: 1220 },

  // Bike Rack & School Flagpole at RichAcademy
  { id: 'academy-bike-rack', type: 'bike-rack', x: 2040, y: 785 },
  { id: 'academy-flagpole', type: 'flagpole', x: 2130, y: 785, color: '#4f46e5' },

  // Ambulance at RichHealth Emergency Bay
  { id: 'health-ambulance', type: 'ambulance', x: 2280, y: 1100, direction: 'vertical' },

  // Shopping Cart Corral at RichMart
  { id: 'mart-cart-corral', type: 'shopping-cart-corral', x: 850, y: 1150 },

  // Cargo Pallets at RichLogistics
  { id: 'logistics-pallets', type: 'cargo-pallets', x: 580, y: 1145 },

  // Flagpoles at RICH WORLD HQ Plaza
  { id: 'hq-flag-1', type: 'flagpole', x: 1280, y: 825, color: '#0284c7' },
  { id: 'hq-flag-2', type: 'flagpole', x: 1420, y: 825, color: '#0284c7' },

  // Bike Rack at Transit Station
  { id: 'bike-rack-1', type: 'bike-rack', x: 2000, y: 1220 },

  // Basketball Court beside RichAcademy (from reference image)
  { id: 'academy-basketball-court', type: 'basketball-court', x: 2360, y: 550, width: 150, height: 210 },

  // City Transit Bus at Transit Station (from reference image)
  { id: 'transit-bus-1', type: 'bus', x: 2280, y: 1420, direction: 'horizontal', color: '#0284c7' },
];
