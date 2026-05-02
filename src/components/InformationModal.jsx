import React from "react";
import { X } from "lucide-react";

const InformationModal = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 text-white flex justify-center items-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-[#1a1a1a] border border-white/20 rounded-lg p-6 md:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#D0BF7A]">
            Information
          </h1>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X size={28} />
          </button>
        </div>
        <div className="text-left space-y-4 text-sm md:text-base text-gray-300">
          <p>
            <span className="font-bold text-white">
              This virtual tour was captured on 31st March 2026 by Propwizard
              Studio.
            </span>{" "}
            The on-site data and visuals are accurate as of this date, and any
            subsequent changes to the project’s construction, appearance, or
            development are subject to the developer’s discretion.
          </p>
          <p>
            All images, layouts, and representations are for illustrative
            purposes only and may include artistic impressions, enhancements, or
            simulated environments. Actual project specifications, colors,
            materials, and surroundings may vary.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InformationModal;
