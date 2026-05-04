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
            Project Information
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
              This is a high-fidelity 3D interactive visualization of a 3 BHK
              Luxury Apartment, developed by Propwizard Studio for demonstration
              purposes.
            </span>
          </p>
          <p>
            The layout, spatial proportions, and architectural elements are
            based on standard technical blueprints. This demo serves as an
            immersive 3D representation to showcase potential interior finishes,
            space utilization, and lifestyle flow.
          </p>
          <p>
            <span className="text-[#D0BF7A] italic">Note:</span> All textures,
            lighting effects, and furniture placements are artistic 3D
            interpretations. Final construction materials, hardware, and
            surrounding views may vary based on specific site conditions and
            developer finalizations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InformationModal;
