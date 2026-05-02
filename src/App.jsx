import { useState, useEffect, useCallback, useRef } from "react";
import Navigation from "./components/Navigation";
import PanoramaViewer from "./utils/PanoramaViewer";
import { panoramas } from "./data/panoramas.js";
import {
  hotspots,
  startScene,
  navigationLinks,
  pulsingHotspots,
  labelHotspots,
} from "./data/hotspots.js";
import useOrientation from "./components/hooks/useOrientation";
import useIsMobile from "./components/hooks/useIsMobile";
import RotateDevice from "./components/RotateDevice";
import GalleryModal from "./components/GalleryModal";
import Preloader from "./components/Preloader";
import VideoModal from "./components/VideoModal";
import Watermark from "./components/Watermark";
import InformationModal from "./components/InformationModal";
import VRViewer from "./components/VRViewer";

const scenes = panoramas.map((p) => ({
  ...p,
  hotspots: hotspots[p.id] || {},
}));

const panoramaImageSources = panoramas.map((p) => p.image);
const galleryImageModules = import.meta.glob("/src/assets/gallery/*", {
  eager: true,
  query: "?url",
  import: "default",
});
const galleryImageSources = Object.values(galleryImageModules);

const allImagesToPreload = [
  ...panoramaImageSources,
  ...galleryImageSources,
  "./logo.png",
];

function App() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const [isGyroActive, setIsGyroActive] = useState(false);
  const [isVRMode, setIsVRMode] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const isAppReady = imagesLoaded && viewerReady;
  const showContent = isAppReady && hasEntered;

  const [currentSceneId, setCurrentSceneId] = useState(
    startScene || localStorage.getItem("currentSceneId") || "mg1",
  );

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const isPortrait = useOrientation();
  const isMobile = useIsMobile();

  // 🎵 AUDIO SETUP
  useEffect(() => {
    audioRef.current = new Audio("/song.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
  }, []);

  const handleEnter = () => {
    setHasEntered(true);
    if (!isMuted && audioRef.current) {
      audioRef.current.play().catch((e) => {
        console.error("Audio play failed on enter", e);
      });
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (audioRef.current) {
      if (newMutedState) {
        audioRef.current.pause();
      } else {
        if (hasEntered) {
          audioRef.current.play().catch((e) => {
            console.error("Audio play failed on unmute", e);
          });
        }
      }
    }
  };
  const toggleGallery = () => setIsGalleryOpen((prev) => !prev);
  const toggleVideoModal = () => setIsVideoModalOpen((prev) => !prev);
  const toggleInfoModal = () => setIsInfoModalOpen((prev) => !prev);
  const toggleGyro = () => setIsGyroActive((prev) => !prev);

  const toggleVR = () => {
    setIsVRMode(true);
  };

  const handleSceneChange = useCallback((sceneId) => {
    setCurrentSceneId(sceneId);
    localStorage.setItem("currentSceneId", sceneId);
  }, []);

  const handleImagesLoaded = useCallback(() => setImagesLoaded(true), []);
  const handleViewerReady = useCallback(() => setViewerReady(true), []);
  const currentScene = scenes.find((s) => s.id === currentSceneId);
  const navigationHotspots = Object.values(currentScene?.hotspots || {});
  const aerialHotspots = pulsingHotspots[currentSceneId] || [];
  const vrHotspots = [...navigationHotspots, ...aerialHotspots];

  const handleSelectScene = (linkName) => {
    const sceneId = navigationLinks[linkName]?.sceneId;
    if (sceneId) setCurrentSceneId(sceneId);
  };

  return (
    <>
      {!isAppReady && (
        <Preloader images={allImagesToPreload} onLoaded={handleImagesLoaded} />
      )}

      {isAppReady && !hasEntered && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <button
            onClick={handleEnter}
            className="px-8 py-4 text-2xl font-bold text-white bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            Click to Enter
          </button>
        </div>
      )}

      {showContent && <Watermark />}

      {imagesLoaded &&
        (isVRMode ? (
          <VRViewer
            panoramas={panoramas}
            initialSceneId={currentSceneId}
            hotspotsMap={hotspots}
            pulsingHotspots={pulsingHotspots}
            labelHotspotsMap={labelHotspots}
            navLinks={navigationLinks}
          />
        ) : (
          <PanoramaViewer
            scenesConfig={scenes}
            currentSceneId={currentSceneId}
            onSceneChange={handleSceneChange}
            autoRotate={true}
            isMobile={isMobile}
            isGyroActive={isGyroActive}
            onReady={handleViewerReady}
          />
        ))}

      {/* 🧭 UI */}
      <div
        style={{ visibility: showContent ? "visible" : "hidden" }}
        className="relative z-10"
      >
        {isMobile && isPortrait ? (
          <RotateDevice />
        ) : (
          <>
            <Navigation
              navLinks={navigationLinks}
              currentSceneId={currentSceneId}
              onSelectScene={handleSelectScene}
              onToggleGallery={toggleGallery}
              onToggleVideoModal={toggleVideoModal}
              onToggleInfoModal={toggleInfoModal}
              isMuted={isMuted}
              onToggleMute={toggleMute}
              isVRMode={isVRMode}
              onToggleVR={toggleVR}
            />

            {isGalleryOpen && <GalleryModal onClose={toggleGallery} />}

            {isInfoModalOpen && <InformationModal onClose={toggleInfoModal} />}

            {isVideoModalOpen && (
              <VideoModal
                isOpen={isVideoModalOpen}
                onClose={toggleVideoModal}
                videoUrl="https://www.youtube.com/watch?v=LXb3EKWsInQ"
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;
