import React, { useState, useEffect } from "react";

const Preloader = ({ images, onLoaded, imagesLoaded }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (imagesLoaded) {
      setProgress(100);
      onLoaded();
      return;
    }

    let loadedCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      onLoaded();
      return;
    }

    const handleImageLoad = () => {
      loadedCount++;
      const newProgress = Math.round((loadedCount / totalImages) * 100);
      setProgress(newProgress);

      if (loadedCount === totalImages) {
        // A small delay to ensure the 100% is visible before disappearing
        setTimeout(() => {
          onLoaded();
        }, 500);
      }
    };

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Treat errors as loaded to not block the app
    });
  }, [images, onLoaded]);

  return (
    <div className="fixed inset-0 bg-[#1a1a1a] flex flex-col items-center justify-center z-[100]">
      <div className="w-1/2 max-w-md">
        <img
          src="./logo.png"
          alt="Drushika Real Estate"
          className="w-48 object-contain mx-auto mb-8"
        />
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-[#D0BF7A] h-2.5 rounded-full transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-white text-center mt-4 text-lg">
          {progress < 100 ? `${progress}%` : "Preparing 360° Tour..."}
        </p>
      </div>
    </div>
  );
};

export default Preloader;
