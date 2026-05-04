import React from "react";

const Watermark = () => {
  return (
    <div className="fixed mb-15 lg:mb-0 bottom-2 rounded-lg p-1 right-2 z-[5] flex items-center bg-white/20 backdrop-blur-2xl border border-white/10 shadow-lg md:bottom-4 md:right-4">
      <img
        src="./prop.png"
        alt="Company Logo"
        className="h-8 w-auto  lg:h-16"
      />
    </div>
  );
};

export default Watermark;
