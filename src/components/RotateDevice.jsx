import { Smartphone } from "lucide-react";

const RotateDevice = () => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col justify-center items-center z-[9999]">
      <Smartphone size={64} className="text-white mb-6 animate-pulse" />
      <p className="text-white text-lg text-center px-4">
        Please rotate your device for the best experience.
      </p>
    </div>
  );
};

export default RotateDevice;
