import React from "react";
import { X } from "lucide-react";

const VideoModal = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId
      ? `https://www.youtube.com/embed/tQKJti9W3xA?autoplay=1&rel=0&modestbranding=1`
      : url;
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] animate-in fade-in duration-300"
      onClick={onClose} // Clicking the background closes the modal
    >
      {/* CLOSE BUTTON - Increased Z-index and explicit click handling */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent event bubbling
          onClose();
        }}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-red-500/80 backdrop-blur-md rounded-full text-white transition-all z-[110] border border-white/20 pointer-events-auto cursor-pointer"
        aria-label="Close video"
      >
        <X size={32} />
      </button>

      {/* VIDEO CONTAINER */}
      <div
        className="relative w-[90%] max-w-6xl aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black pointer-events-auto"
        onClick={(e) => e.stopPropagation()} // Clicking the video area won't close the modal
      >
        {!videoUrl ? (
          <div className="absolute inset-0 flex items-center justify-center text-white/40">
            <p className="uppercase tracking-[2px] text-xs">
              Video link not provided
            </p>
          </div>
        ) : (
          <iframe
            src={getEmbedUrl(videoUrl)}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default VideoModal;
