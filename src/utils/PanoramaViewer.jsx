import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { labelHotspots, pulsingHotspots } from "../data/hotspots";
import LabelHotspot from "../components/LabelHotspot";

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const PanoramaViewer = ({
  scenesConfig,
  currentSceneId,
  isMobile,
  isVRActive,
  isGyroActive,
  onSceneChange,
  onReady,
  autoRotate,
  ...props
}) => {
  const ref = useRef();
  const viewerRef = useRef(null);
  const [adjustedHotspots, setAdjustedHotspots] = useState(labelHotspots);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .pnlm-orientation-button, .pnlm-compass { display: none !important; }
      .pnlm-hotspot.custom-hotspot { background: transparent !important; }
      .custom-hotspot .pnlm-tooltip { display: none !important; }
      .pnlm-load-box { display: none !important; }
      
      .custom-hotspot .custom-hotspot-tooltip {
        position: absolute; bottom: 35px; left: 50%; transform: translateX(-50%);
        padding: 0; background: transparent; color: white;
        border-radius: 0; white-space: nowrap; font-size: 22px;
        font-family: 'Arial Black', sans-serif; font-weight: bold; text-transform: uppercase;
        text-shadow: -1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000;
        box-shadow: none; border: none;
        visibility: hidden; opacity: 0;
        transition: opacity 0.2s ease, visibility 0.2s ease; z-index: 10;
      }
      .custom-hotspot:hover .custom-hotspot-tooltip { visibility: visible; opacity: 1; }

      .pulsing-white-dot {
        width: 10px; height: 10px; background-color: white; border-radius: 50%;
        animation: pulse-white 1.5s infinite; box-shadow: 0 0 0 0 rgba(255, 255, 255, 1);
      }
      @keyframes pulse-white {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.9); }
        70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(255, 255, 255, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
      }

      .pnlm-hotspot.aerial-hotspot {
        background-color: rgba(255, 0, 0, 0.5); border-radius: 50%;
        width: 20px; height: 20px; animation: pulse 1.5s infinite;
        background-image: none !important;
      }
      @keyframes pulse {
        0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
        70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
        100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const calculateAdjustments = () => {
      const newAdjustedHotspots = JSON.parse(JSON.stringify(labelHotspots));
      const baseAspectRatio = 16 / 9;
      const currentAspectRatio = window.innerWidth / window.innerHeight;
      if (Math.abs(baseAspectRatio - currentAspectRatio) > 0.1) {
        const adjustmentFactor = currentAspectRatio / baseAspectRatio;
        Object.keys(newAdjustedHotspots).forEach((sceneId) => {
          newAdjustedHotspots[sceneId].forEach((hotspot) => {
            hotspot.pitch *= adjustmentFactor;
          });
        });
      }
      setAdjustedHotspots(newAdjustedHotspots);
    };
    const debouncedHandler = debounce(calculateAdjustments, 100);
    calculateAdjustments();
    window.addEventListener("resize", debouncedHandler);
    return () => {
      window.removeEventListener("resize", debouncedHandler);
    };
  }, []);

  useEffect(() => {
    if (
      viewerRef.current &&
      typeof viewerRef.current.setConfig === "function"
    ) {
      try {
        viewerRef.current.setConfig(
          "orientationOn",
          isVRActive || isGyroActive,
        );
        if (
          (isVRActive || isGyroActive) &&
          typeof viewerRef.current.startOrientation === "function"
        ) {
          viewerRef.current.startOrientation();
        } else if (
          !isVRActive &&
          !isGyroActive &&
          typeof viewerRef.current.stopOrientation === "function"
        ) {
          viewerRef.current.stopOrientation();
        }
      } catch (err) {
        console.warn("Gyro Error:", err);
      }
    }
  }, [isVRActive, isGyroActive]);

  useEffect(() => {
    if (ref.current && window.pannellum && scenesConfig) {
      if (!viewerRef.current) {
        const pannellumConfig = {
          default: { firstScene: currentSceneId || "aerial" },
          scenes: {},
          autoLoad: true,
          sceneFadeDuration: 500,
          ...props,
          autoRotate: autoRotate ? -2 : 0,
          loadingLabel: "",
          showZoomCtrl: false,
          showFullscreenCtrl: false,
          hfov: 120,
        };

        scenesConfig.forEach((scene) => {
          const sceneConfig = {
            type: "equirectangular",
            panorama: scene.image,
            // Force limit texture size to prevent "panorama too big" error on iPhone 15/iPad
            maxTextureSize: 4096,
            hotSpots: [
              ...(scene.hotspots ? Object.entries(scene.hotspots) : []).map(
                ([direction, link]) => ({
                  pitch: link.pitch || 0,
                  yaw: link.yaw || 0,
                  cssClass:
                    scene.id === "aerial" ? "aerial-hotspot" : "custom-hotspot",
                  createTooltipFunc:
                    scene.id !== "aerial"
                      ? (hotSpotDiv) => {
                          hotSpotDiv.innerHTML = `<img src="./hotspot.gif" style="width: 120px; height: 60px;" />`;
                        }
                      : undefined,
                  clickHandlerFunc: (e, args) => {
                    const viewer = viewerRef.current;
                    if (viewer) {
                      viewer.loadScene(
                        args.sceneId,
                        undefined,
                        args.targetYaw,
                        120, // Start HFOV (zoomed-in)
                        500, // Fade duration
                      );
                    }
                  },
                  clickHandlerArgs: {
                    sceneId: link.sceneId,
                    targetYaw: link.facing,
                  },
                }),
              ),
              ...(adjustedHotspots[scene.id] || []).map((hotspot) => ({
                pitch: hotspot.pitch,
                yaw: hotspot.yaw,
                cssClass: "custom-label-hotspot",
                createTooltipFunc: (hotSpotDiv) => {
                  const root = createRoot(hotSpotDiv);
                  root.render(<LabelHotspot label={hotspot.label} />);
                },
              })),
            ],
          };

          if (scene.id === "aerial") {
            sceneConfig.pitch = -90;
            sceneConfig.yaw = 0;
            sceneConfig.maxPitch = 30;
            sceneConfig.minPitch = -120;
            // Adjusted FOV for mobile/iPad to keep hotspots within view
            sceneConfig.hfov = isMobile ? 110 : 120;
            sceneConfig.minHfov = 50;
          }

          pannellumConfig.scenes[scene.id] = sceneConfig;
        });

        if (pannellumConfig.scenes.aerial && pulsingHotspots.aerial) {
          const aerialHotspots = pulsingHotspots.aerial.map((hotspot) => ({
            pitch: hotspot.pitch,
            yaw: hotspot.yaw,
            cssClass: "custom-hotspot",
            createTooltipFunc: (hotSpotDiv) => {
              const dot = document.createElement("div");
              dot.className = "pulsing-white-dot";
              hotSpotDiv.appendChild(dot);
              const tooltip = document.createElement("span");
              tooltip.innerHTML = hotspot.text;
              tooltip.className = "custom-hotspot-tooltip";
              hotSpotDiv.appendChild(tooltip);
            },
            clickHandlerFunc: (e, args) => {
              const viewer = viewerRef.current;
              if (viewer) {
                viewer.loadScene(args.sceneId, undefined, undefined, 80, 500);
              }
            },
            clickHandlerArgs: { sceneId: hotspot.sceneId },
          }));
          pannellumConfig.scenes.aerial.hotSpots.push(...aerialHotspots);
        }

        viewerRef.current = window.pannellum.viewer(
          ref.current,
          pannellumConfig,
        );
        viewerRef.current.on("load", () => onReady && onReady());
        viewerRef.current.on("scenechange", (id) => {
          if (onSceneChange) onSceneChange(id);
          const viewer = viewerRef.current;
          if (viewer) {
            const sceneConfig = viewer.getConfig().scenes[id];
            const targetHfov =
              sceneConfig && sceneConfig.hfov ? sceneConfig.hfov : 120;
            viewer.setHfov(targetHfov, 500);
          }
        });
      } else if (viewerRef.current.getScene() !== currentSceneId) {
        const viewer = viewerRef.current;
        if (viewer) {
          viewer.loadScene(currentSceneId, undefined, undefined, 80, 500);
        }
      }
    }
  }, [scenesConfig, currentSceneId, adjustedHotspots, isMobile]);

  return (
    <div
      ref={ref}
      id="viewer-container"
      className="fixed inset-0"
      style={{ zIndex: 0, backgroundColor: "#000" }}
    />
  );
};

export default PanoramaViewer;
