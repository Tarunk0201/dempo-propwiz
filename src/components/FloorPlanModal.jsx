import React from "react";
import { X } from "lucide-react";

const FloorPlanModal = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-lg max-w-4xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <img
          src="./floor-plan.png"
          alt="Floor Plan"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default FloorPlanModal;
