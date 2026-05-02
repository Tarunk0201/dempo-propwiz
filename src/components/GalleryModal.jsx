import React, { useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

const GalleryModal = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = useMemo(() => {
    // Import all images from the gallery folder
    const imageModules = import.meta.glob("/src/assets/gallery/*", {
      eager: true,
    });

    return Object.entries(imageModules).map(([path, module]) => {
      const fileName = path.split("/").pop();
      const label = fileName
        .split(".")
        .slice(0, -1)
        .join(".")
        .replace(/[-_]/g, " ");
      // Assuming default export for images in Vite
      return { src: module.default || module, label };
    });
  }, []);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const glassStyle =
    "bg-black/20 backdrop-blur-md border border-white/20 text-white transition-all duration-300";

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[70] p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className={`${glassStyle} rounded-2xl max-w-7xl w-full h-[85vh] flex flex-col relative overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D0BF7A] rounded-lg text-black">
              <ImageIcon size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white uppercase">
                Project Gallery
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
          >
            <X size={28} />
          </button>
        </div>

        {/* GRID CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative flex flex-col gap-3 cursor-pointer"
                onClick={() => setSelectedImage(index)}
              >
                <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 shadow-lg">
                  <img
                    src={image.src}
                    alt={image.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-[#D0BF7A] text-black p-2 rounded-full scale-75 group-hover:scale-100 transition-transform">
                      <Maximize size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FULLSCREEN PREVIEW */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center z-[80] animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-8 right-8 text-white/50 hover:text-white z-50 transition-colors"
          >
            <X size={40} />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevImage}
            className="absolute left-6 p-4 text-white/30 hover:text-[#D0BF7A] hover:bg-white/5 rounded-full transition-all z-50"
          >
            <ChevronLeft size={48} strokeWidth={1} />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
            <img
              src={images[selectedImage].src}
              alt={images[selectedImage].label}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {/* Image Label Overlay */}
            {/* <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
              <p className="text-white font-light tracking-[2px] uppercase text-sm">
                {images[selectedImage].label}
              </p>
            </div> */}
          </div>

          <button
            onClick={handleNextImage}
            className="absolute right-6 p-4 text-white/30 hover:text-[#D0BF7A] hover:bg-white/5 rounded-full transition-all z-50"
          >
            <ChevronRight size={48} strokeWidth={1} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryModal;

// Mock internal component to avoid missing import error
const Maximize = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 3 6 6M9 21l-6-6M21 3v6h-6M3 21v-6h6" />
  </svg>
);
