import React, { useEffect, useRef } from "react";

const VideoSplashScreen = ({ onFinished }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.play().catch((error) => {
        console.error("Video autoplay failed:", error);
        // If autoplay is blocked, skip the video to not block the user.
        onFinished();
      });
    }
  }, [onFinished]);

  const handleInteraction = () => {
    onFinished();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        zIndex: 9999,
        cursor: "pointer",
      }}
      onDoubleClick={handleInteraction}
    >
      <video
        ref={videoRef}
        src="/video.mp4"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        muted
        playsInline
        onEnded={handleInteraction}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "8px 16px",
          borderRadius: "12px",
          fontSize: "14px",
          textAlign: "center",
        }}
      >
        Double-click to skip
      </div>
    </div>
  );
};

export default VideoSplashScreen;
