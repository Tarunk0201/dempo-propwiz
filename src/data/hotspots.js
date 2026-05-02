import { panoramas } from "./panoramas.js";

export const startScene = "entry";

export const pulsingHotspots = {
  aerial: [
    {
      pitch: -60,
      yaw: 173,
      sceneId: "mg1",
      text: "Main Entrance",
    },
    {
      pitch: -89,
      yaw: 0,
      sceneId: "pa1",
      text: "Park 1",
    },
    {
      pitch: -53,
      yaw: 0,
      sceneId: "pc6",
      text: "Park 2",
    },
    {
      pitch: -70,
      yaw: 65,
      sceneId: "pb1",
      text: "Park 3",
    },
    {
      pitch: -44,
      yaw: 28,
      sceneId: "pe3",
      text: "Park 4",
    },
    {
      pitch: -44,
      yaw: -24,
      sceneId: "pd1",
      text: "Cricket Turf",
    },
  ],
};

export const navigationLinks = {
  ENTRANCE: { sceneId: "entry", pitch: 0, yaw: 0 },
  "LIVING ROOM": { sceneId: "living-room", facing: 0 },
  DINING: { sceneId: "dining", facing: 0 },
  KITCHEN: { sceneId: "kitchen", facing: 0 },
  "BEDROOM 1": { sceneId: "master-bed-1", facing: 0 },
  "BEDROOM 2": { sceneId: "kids-room", facing: 0 },
  BATH: { sceneId: "bath-1", facing: 0 },
};

export const labelHotspots = {
  aerial: [
    {
      pitch: -3,
      yaw: 260,
      label: {
        title: "Palia Railway Station",
        distance: "3 km away",
        travel: {
          car: "6 min",
          bike: "5 min",
          walk: "30 min",
        },
      },
    },
    {
      pitch: -1,
      yaw: 80,
      label: {
        title: "Veerangana Jhalkari Bai Metro Station",
        distance: "4 km away",
        travel: {
          car: "8 min",
          bike: "7 min",
          walk: "50 min",
        },
      },
    },
    {
      pitch: -1,
      yaw: 90,
      label: {
        title: "Tata Consultancy Servics (TCS)",
        distance: "5 km away",
        travel: {
          car: "13 min",
          bike: "9 min",
          walk: "60 min",
        },
      },
    },
    {
      pitch: -1,
      yaw: 0,
      label: {
        title: "Aurbindo Hospital",
        distance: "8.5 km away",
        travel: {
          car: "18 min",
          bike: "15 min",
          walk: "1 h 30 min ",
        },
      },
    },
    {
      pitch: -1,
      yaw: 10,
      label: {
        title: "Luvkush Square",
        distance: "7.5 km away",
        travel: {
          car: "14 min",
          bike: "12 min",
          walk: "1h 20 min",
        },
      },
    },
    {
      pitch: -1,
      yaw: 305,
      label: {
        title: "Indore - Ujjain Highway",
        distance: "8 km away",
        travel: {
          car: "15 min",
          bike: "13 min",
          walk: "1h 40 min",
        },
      },
    },
    {
      pitch: -1,
      yaw: 125,
      label: {
        title: "Devi Ahilyabai Holkar International Airport",
        distance: "10 km away",
        travel: {
          car: "18 min",
          bike: "16 min",
          walk: "2 hr",
        },
      },
    },
    {
      pitch: -1,
      yaw: 135,
      label: {
        title: "Symbiosis University",
        distance: "8 km away",
        travel: {
          car: "15 min",
          bike: "12 min",
          walk: "1h 30 min",
        },
      },
    },
  ],
};

export const hotspots = {
  entry: {
    toLivingRoom: { sceneId: "living-room", pitch: -30, yaw: 10 },
    toKitchen: { sceneId: "kitchen", pitch: -40, yaw: 250 },
    toBath1: { sceneId: "bath-1", pitch: -30, yaw: 285 },
    toKidsRoom: { sceneId: "kids-room", pitch: -25, yaw: 306 },
    toMasterBed1: { sceneId: "master-bed-1", pitch: -19, yaw: 90 },
    toDining: { sceneId: "dining", pitch: -40, yaw: -30 },
  },
  "living-room": {
    toEntry: { sceneId: "entry", pitch: -30, yaw: 73 },
    toKitchen: { sceneId: "kitchen", pitch: -20, yaw: 100 },
    toBath1: { sceneId: "bath-1", pitch: -25, yaw: 120 },
    toMasterBed1: { sceneId: "master-bed-1", pitch: -30, yaw: 30 },
    toDining: { sceneId: "dining", pitch: -35, yaw: 120 },
  },
  "bath-1": {
    toEntry: { sceneId: "entry", pitch: -27, yaw: 114 },
    toMasterBed1: { sceneId: "master-bed-1", pitch: -12, yaw: 97 },
    toLivingRoom: { sceneId: "living-room", pitch: -25, yaw: 70 },
    toDining: { sceneId: "dining", pitch: -40, yaw: 70 },
  },
  kitchen: {
    toLivingRoom: { sceneId: "living-room", pitch: -20, yaw: 230 },
    toEntry: { sceneId: "entry", pitch: -45, yaw: 270 },
    toMasterBed1: { sceneId: "master-bed-1", pitch: -18, yaw: 270 },
    toDining: { sceneId: "dining", pitch: -30, yaw: 213 },
  },
  dining: {
    toLivingRoom: { sceneId: "living-room", pitch: -34, yaw: 60 },
    toMasterBed1: { sceneId: "master-bed-1", pitch: -20, yaw: 110 },
    toEntry: { sceneId: "entry", pitch: -37, yaw: 150 },
    toKitchen: { sceneId: "kitchen", pitch: -25, yaw: 195 },
    toBath1: { sceneId: "bath-1", pitch: -45, yaw: 245 },
    toKidsRoom: { sceneId: "kids-room", pitch: -45, yaw: 296 },
  },
  "kids-room": {
    toMasterBed1: { sceneId: "master-bed-1", pitch: -14, yaw: 175 },
    toLivingRoom: { sceneId: "living-room", pitch: -40, yaw: 170 },
  },
  "master-bed-1": {
    toLivingRoom: { sceneId: "living-room", pitch: -40, yaw: 230 },
    toMasterBed2: { sceneId: "master-bed-2", pitch: -25, yaw: 74 },
  },
  "master-bed-2": {
    toMasterBed1: { sceneId: "master-bed-1", pitch: -25, yaw: -33 },
    toBath2: { sceneId: "bath-2", pitch: -45, yaw: 277 },
  },
  "bath-2": {
    toMasterBed2: { sceneId: "master-bed-2", pitch: -40, yaw: 180 },
  },
};

export const scenes = panoramas.map((p) => ({
  ...p,
  hotspots: hotspots[p.id] || {},
}));
