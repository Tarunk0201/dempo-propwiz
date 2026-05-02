import { useState } from "react";
import { Car, Bike, Footprints } from "lucide-react";

const LabelHotspot = ({ label }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="label-wrapper relative">
      <div
        className={`label-banner absolute bottom-full left-1/2 -translate-x-1/2 bg-[#1a1a1a]/60 backdrop-blur-md font-lato mb-3 transition-all duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="label-title">{label.title}</div>
        <div className="label-distance">{label.distance}</div>
        <div className="label-travel flex items-center gap-x-4">
          <span className="flex items-center">
            <Car className="mr-1 h-4 w-4 md:h-5 md:w-5" /> {label.travel.car}
          </span>
          <span className="flex items-center">
            <Bike className="mr-1 h-4 w-4 md:h-5 md:w-5" /> {label.travel.bike}
          </span>
          <span className="flex items-center">
            <Footprints className="mr-1 h-4 w-4 md:h-5 md:w-5" />{" "}
            {label.travel.walk}
          </span>
        </div>
      </div>
      <div
        className="label-pointer cursor-pointer pt-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src="/pin.png" alt="Map Pin" className="h-8 md:h-10" />
      </div>
    </div>
  );
};

export default LabelHotspot;
