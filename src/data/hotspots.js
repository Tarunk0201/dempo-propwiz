import { panoramas } from "./panoramas.js";

export const startScene = "p1";

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
  "Scene 1": { sceneId: "p1", facing: 0 },
  "Scene 2": { sceneId: "p2", facing: 0 },
  "Scene 3": { sceneId: "p3", facing: 0 },
  "Scene 4": { sceneId: "p4", facing: 0 },
  "Scene 5": { sceneId: "p5", facing: 0 },
  "Scene 6": { sceneId: "p6", facing: 0 },
  "Scene 7": { sceneId: "p7", facing: 0 },
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
  // p1: {
  //   toP2: { sceneId: "p2", pitch: -5, yaw: 4 },
  //   toP7: { sceneId: "p7", pitch: -7, yaw: 60 },
  // },
  // p2: {
  //   toP1: { sceneId: "p1", pitch: -7, yaw: 150 },
  //   toP3: { sceneId: "p3", pitch: -8, yaw: -30, facing: 180 },
  // },
  // p3: {
  //   toP2: { sceneId: "p2", pitch: -15, yaw: 260 },
  //   toP4: { sceneId: "p4", pitch: -8, yaw: 140 },
  // },
  // p4: {
  //   toP3: { sceneId: "p3", pitch: -9, yaw: 190 },
  //   toP5: { sceneId: "p5", pitch: -15, yaw: 30 },
  // },
  // p5: {
  //   toP4: { sceneId: "p4", pitch: -15, yaw: 35, facing: 180 },
  //   toP6: { sceneId: "p6", pitch: -15, yaw: 250 },
  // },
  // p6: {
  //   toP5: { sceneId: "p5", pitch: -15, yaw: 45 },
  //   toP7: { sceneId: "p7", pitch: -10, yaw: 200 },
  // },
  // p7: {
  //   toP6: { sceneId: "p6", pitch: -8, yaw: 30 },
  //   toP1: { sceneId: "p1", pitch: -5, yaw: 290 },
  // },
};

export const scenes = panoramas.map((p) => ({
  ...p,
  hotspots: hotspots[p.id] || {},
}));
