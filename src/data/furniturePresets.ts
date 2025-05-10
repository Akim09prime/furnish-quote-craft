
interface FurnitureDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface FurniturePreset {
  id: string;
  name: string;
  type: string;
  dimensions: FurnitureDimensions;
  description: string;
  // Proprietăți opționale pentru caracteristici specifice
  hasDrawers?: boolean;
  hasDoors?: boolean;
  shelves?: number;
  materials?: string[];
  minWidth?: number; // Pentru corpuri care pot fi dimensionate
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

export interface RoomPresets {
  name: string;
  id: string;
  description: string;
  furniturePieces: FurniturePreset[];
}

const kitchenPresets: FurniturePreset[] = [
  {
    id: "k-base-cabinet",
    name: "Corp bază",
    type: "dulap",
    dimensions: { width: 60, height: 82, depth: 60 },
    description: "Corp bază standard pentru bucătărie",
    hasDrawers: false,
    hasDoors: true,
    shelves: 1,
    minWidth: 30,
    maxWidth: 120
  },
  {
    id: "k-drawer-cabinet",
    name: "Corp cu sertare",
    type: "dulap",
    dimensions: { width: 60, height: 82, depth: 60 },
    description: "Corp cu sertare pentru bucătărie",
    hasDrawers: true,
    hasDoors: false,
    minWidth: 30,
    maxWidth: 90
  },
  {
    id: "k-tall-cabinet",
    name: "Dulap înalt",
    type: "dulap",
    dimensions: { width: 60, height: 200, depth: 60 },
    description: "Dulap înalt pentru bucătărie, ideal pentru cămară",
    hasDrawers: false,
    hasDoors: true,
    shelves: 4,
    minWidth: 40,
    maxWidth: 90
  },
  {
    id: "k-wall-cabinet",
    name: "Corp suspendat",
    type: "biblioteca",
    dimensions: { width: 60, height: 70, depth: 35 },
    description: "Corp suspendat pentru bucătărie",
    hasDrawers: false,
    hasDoors: true,
    shelves: 1,
    minWidth: 30,
    maxWidth: 120,
    minHeight: 40,
    maxHeight: 100
  },
  {
    id: "k-corner-cabinet",
    name: "Corp colț",
    type: "dulap",
    dimensions: { width: 90, height: 82, depth: 90 },
    description: "Corp de colț pentru bucătărie",
    hasDrawers: false,
    hasDoors: true,
    shelves: 1
  },
  {
    id: "k-sink-cabinet",
    name: "Corp chiuvetă",
    type: "dulap",
    dimensions: { width: 80, height: 82, depth: 60 },
    description: "Corp special pentru chiuvetă",
    hasDrawers: false,
    hasDoors: true,
    minWidth: 60,
    maxWidth: 120
  },
  {
    id: "k-microwave-cabinet",
    name: "Corp cuptor/microunde",
    type: "dulap",
    dimensions: { width: 60, height: 82, depth: 60 },
    description: "Corp pentru cuptor sau microunde încorporabil",
    hasDrawers: false,
    hasDoors: false
  },
  {
    id: "k-island",
    name: "Insulă de bucătărie",
    type: "masa",
    dimensions: { width: 120, height: 90, depth: 80 },
    description: "Insulă de bucătărie cu spațiu de depozitare",
    hasDrawers: true,
    hasDoors: true,
    minWidth: 80,
    maxWidth: 240,
    minHeight: 82,
    maxHeight: 95
  }
];

const livingRoomPresets: FurniturePreset[] = [
  {
    id: "lr-tv-stand",
    name: "Comodă TV",
    type: "dulap",
    dimensions: { width: 160, height: 50, depth: 45 },
    description: "Comodă pentru televizor și echipamente media",
    hasDrawers: true,
    hasDoors: true,
    shelves: 1,
    minWidth: 100,
    maxWidth: 240
  },
  {
    id: "lr-bookcase",
    name: "Bibliotecă",
    type: "biblioteca",
    dimensions: { width: 100, height: 200, depth: 40 },
    description: "Bibliotecă pentru cărți și decorațiuni",
    hasDrawers: false,
    hasDoors: false,
    shelves: 5,
    minWidth: 60,
    maxWidth: 180,
    minHeight: 120,
    maxHeight: 240
  },
  {
    id: "lr-sofa",
    name: "Canapea",
    type: "canapea",
    dimensions: { width: 200, height: 85, depth: 90 },
    description: "Canapea confortabilă pentru living",
    minWidth: 140,
    maxWidth: 300
  },
  {
    id: "lr-coffee-table",
    name: "Măsuță de cafea",
    type: "masa",
    dimensions: { width: 90, height: 45, depth: 60 },
    description: "Măsuță de cafea pentru living",
    minWidth: 60,
    maxWidth: 120
  },
  {
    id: "lr-cabinet",
    name: "Vitrină",
    type: "dulap",
    dimensions: { width: 80, height: 180, depth: 40 },
    description: "Vitrină pentru expunerea obiectelor decorative",
    hasDrawers: false,
    hasDoors: true,
    shelves: 3,
    minWidth: 60,
    maxWidth: 120
  }
];

const bedroomPresets: FurniturePreset[] = [
  {
    id: "br-bed",
    name: "Pat",
    type: "pat",
    dimensions: { width: 160, height: 45, depth: 200 },
    description: "Pat dublu pentru dormitor",
    materials: ["lemn masiv", "pal", "mdf"],
    minWidth: 90,
    maxWidth: 200
  },
  {
    id: "br-wardrobe",
    name: "Șifonier",
    type: "dulap",
    dimensions: { width: 200, height: 220, depth: 60 },
    description: "Șifonier pentru haine cu uși glisante",
    hasDrawers: true,
    hasDoors: true,
    shelves: 2,
    minWidth: 120,
    maxWidth: 300,
    minHeight: 200,
    maxHeight: 240
  },
  {
    id: "br-dresser",
    name: "Comodă",
    type: "dulap",
    dimensions: { width: 100, height: 80, depth: 45 },
    description: "Comodă cu sertare pentru dormitor",
    hasDrawers: true,
    hasDoors: false,
    minWidth: 60,
    maxWidth: 140
  },
  {
    id: "br-nightstand",
    name: "Noptieră",
    type: "dulap",
    dimensions: { width: 45, height: 55, depth: 40 },
    description: "Noptieră pentru dormitor",
    hasDrawers: true,
    hasDoors: false,
    minWidth: 35,
    maxWidth: 60
  }
];

const officePresets: FurniturePreset[] = [
  {
    id: "of-desk",
    name: "Birou",
    type: "masa",
    dimensions: { width: 140, height: 75, depth: 70 },
    description: "Birou pentru lucru sau studiu",
    hasDrawers: true,
    minWidth: 100,
    maxWidth: 200
  },
  {
    id: "of-chair",
    name: "Scaun birou",
    type: "scaun",
    dimensions: { width: 50, height: 110, depth: 50 },
    description: "Scaun ergonomic pentru birou"
  },
  {
    id: "of-bookcase",
    name: "Bibliotecă",
    type: "biblioteca",
    dimensions: { width: 100, height: 180, depth: 35 },
    description: "Bibliotecă pentru cărți și documente",
    shelves: 5,
    minWidth: 60,
    maxWidth: 160
  },
  {
    id: "of-cabinet",
    name: "Cabinet documente",
    type: "dulap",
    dimensions: { width: 80, height: 120, depth: 40 },
    description: "Cabinet pentru documente și dosare",
    hasDrawers: true,
    hasDoors: true,
    shelves: 2
  }
];

const bathroomPresets: FurniturePreset[] = [
  {
    id: "bt-vanity",
    name: "Mobilier lavoar",
    type: "dulap",
    dimensions: { width: 80, height: 85, depth: 50 },
    description: "Mobilier pentru lavoar cu spațiu de depozitare",
    hasDrawers: true,
    hasDoors: true,
    minWidth: 60,
    maxWidth: 120
  },
  {
    id: "bt-tall-cabinet",
    name: "Dulap înalt",
    type: "dulap",
    dimensions: { width: 40, height: 180, depth: 35 },
    description: "Dulap înalt pentru baie",
    hasDrawers: false,
    hasDoors: true,
    shelves: 4,
    minWidth: 30,
    maxWidth: 60
  },
  {
    id: "bt-mirror-cabinet",
    name: "Dulap cu oglindă",
    type: "dulap",
    dimensions: { width: 60, height: 70, depth: 15 },
    description: "Dulap cu oglindă pentru baie",
    hasDrawers: false,
    hasDoors: true,
    shelves: 2,
    minWidth: 40,
    maxWidth: 100
  }
];

const hallwayPresets: FurniturePreset[] = [
  {
    id: "hw-wardrobe",
    name: "Cuier",
    type: "dulap",
    dimensions: { width: 100, height: 200, depth: 40 },
    description: "Cuier pentru haine și accesorii",
    hasDrawers: false,
    hasDoors: true,
    minWidth: 60,
    maxWidth: 180
  },
  {
    id: "hw-shoe-cabinet",
    name: "Pantofar",
    type: "dulap",
    dimensions: { width: 80, height: 120, depth: 35 },
    description: "Dulap pentru încălțăminte",
    hasDrawers: false,
    hasDoors: true,
    shelves: 3,
    minWidth: 60,
    maxWidth: 120
  },
  {
    id: "hw-console",
    name: "Consolă",
    type: "masa",
    dimensions: { width: 100, height: 85, depth: 35 },
    description: "Consolă pentru hol",
    hasDrawers: true,
    minWidth: 60,
    maxWidth: 120
  }
];

export const roomPresets: RoomPresets[] = [
  {
    id: "kitchen",
    name: "Bucătărie",
    description: "Mobilier pentru bucătărie",
    furniturePieces: kitchenPresets
  },
  {
    id: "living",
    name: "Living",
    description: "Mobilier pentru living",
    furniturePieces: livingRoomPresets
  },
  {
    id: "dormitor",
    name: "Dormitor",
    description: "Mobilier pentru dormitor",
    furniturePieces: bedroomPresets
  },
  {
    id: "birou",
    name: "Birou",
    description: "Mobilier pentru birou",
    furniturePieces: officePresets
  },
  {
    id: "baie",
    name: "Baie",
    description: "Mobilier pentru baie",
    furniturePieces: bathroomPresets
  },
  {
    id: "hol",
    name: "Hol",
    description: "Mobilier pentru hol",
    furniturePieces: hallwayPresets
  }
];

export const getFurniturePresetById = (presetId: string): FurniturePreset | undefined => {
  for (const room of roomPresets) {
    const found = room.furniturePieces.find(piece => piece.id === presetId);
    if (found) return found;
  }
  return undefined;
};

export const getPresetsByRoom = (roomId: string): FurniturePreset[] => {
  const room = roomPresets.find(r => r.id === roomId);
  return room ? room.furniturePieces : [];
};
