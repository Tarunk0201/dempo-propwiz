import React, { useState, useEffect } from "react";
import {
  Maximize,
  Minimize,
  X,
  Info,
  MapPin,
  Camera,
  Play,
  Music,
  VolumeX,
  RectangleGoggles,
  Menu,
} from "lucide-react";

const Navigation = ({
  navLinks = {},
  currentSceneId,
  onSelectScene,
  onToggleGallery,
  onToggleVideoModal,
  onToggleInfoModal,
  isMuted,
  onToggleMute,
  isVRMode,
  onToggleVR,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVRSupported, setIsVRSupported] = useState(false);

  useEffect(() => {
    const checkVRSupport = async () => {
      if (navigator.xr) {
        try {
          const supported =
            await navigator.xr.isSessionSupported("immersive-vr");
          setIsVRSupported(supported);
        } catch (e) {
          console.error("Error checking VR support:", e);
          setIsVRSupported(false);
        }
      } else {
        setIsVRSupported(false);
      }
    };
    checkVRSupport();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () =>
      setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  const glassStyle =
    "bg-black/40 backdrop-blur-md border border-white/20 text-white transition-all duration-300";

  const utilityItems = [
    { label: "Information", icon: <Info size={24} /> },
    // {
    //   label: "Location",
    //   icon: <MapPin size={24} />,
    //   url: "https://maps.app.goo.gl/7jedVvpx7wJNoXAX7",
    // },
    { label: "Gallery", icon: <Camera size={24} /> },
    {
      label: "Cinematic Video",
      icon: <Play size={24} />,
    },
    { label: "VR Mode", icon: <RectangleGoggles size={24} /> },
  ];

  const handleUtilityClick = (item) => {
    if (item.label === "VR Mode") {
      if (isVRSupported) {
        onToggleVR();
      } else {
        alert("You need a VR headset for this action.");
      }
    } else if (item.url) {
      window.open(item.url, "_blank");
    } else if (item.label === "Gallery") {
      onToggleGallery();
    } else if (item.label === "Cinematic Video") {
      onToggleVideoModal();
    } else if (item.label === "Information") {
      onToggleInfoModal();
    }

    if (isMobile) setIsSidebarOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none p-4 md:p-6 font-sans select-none">
      {/* TOP RIGHT */}
      <div className="absolute top-6 right-6 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={toggleFullScreen}
          className={`${glassStyle} p-2 rounded hover:bg-[#D0BF7A] hover:text-black`}
        >
          {isFullScreen ? <Minimize size={22} /> : <Maximize size={20} />}
        </button>

        <button
          onClick={onToggleMute}
          className={`${glassStyle} p-2 rounded hover:bg-[#D0BF7A] hover:text-black ${
            isMuted ? "bg-red-600/50" : ""
          }`}
        >
          {isMuted ? <VolumeX size={20} /> : <Music size={20} />}
        </button>

        {isMobile && !isVRMode && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`${glassStyle} p-2 rounded`}
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      {/* DESKTOP UTILITIES */}
      {!isMobile && !isVRMode && (
        <div className="absolute bottom-10 left-6 flex flex-col gap-2 pointer-events-auto">
          {utilityItems.map((item, idx) => {
            const isVRButton = item.label === "VR Mode";
            const isDisabled = isVRButton && !isVRSupported;

            return (
              <button
                key={idx}
                onClick={() => handleUtilityClick(item)}
                className={`${glassStyle} w-12 h-12 rounded-full hover:bg-white/20 flex items-center justify-center ${
                  isDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title={item.label}
                disabled={isDisabled}
              >
                <span className="pointer-events-none">{item.icon}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* MOBILE SIDEBAR */}
      {isMobile && !isVRMode && (
        <>
          <div
            className={`fixed top-0 right-0 h-full ${glassStyle} z-[60] transform transition pointer-events-auto ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-4 flex justify-between items-center border-b border-white/10">
              <span className="text-[#D0BF7A] font-bold text-xs">
                Navigation
              </span>
              <button onClick={() => setIsSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col">
              {utilityItems.map((item, idx) => {
                const isVRButton = item.label === "VR Mode";
                const isDisabled = isVRButton && !isVRSupported;

                return (
                  <button
                    key={idx}
                    onClick={() => handleUtilityClick(item)}
                    className={`flex items-center gap-4 px-4 py-3 hover:bg-white/10 ${
                      isDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isDisabled}
                  >
                    <span className="pointer-events-none">{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-[55] pointer-events-auto"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </>
      )}

      {/* SCENE NAVIGATION */}
      {!isVRMode && (
        <div className="absolute bottom-3 left-1/2 mb-5 -translate-x-1/2 w-full max-w-[95%] flex justify-center pointer-events-auto">
          <div className="bg-black/20 backdrop-blur-md p-2 rounded-xl flex gap-2 overflow-x-auto">
            {Object.keys(navLinks).map((linkName) => {
              const isActive = currentSceneId === navLinks[linkName].sceneId;
              return (
                <button
                  key={linkName}
                  onClick={() => onSelectScene(linkName)}
                  className={`px-1 lg:px-3 text-sm lg:text-lg py-1 rounded ${
                    isActive
                      ? "bg-[#D0BF7A] text-black"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {linkName}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
