import { useState, useEffect } from "react";

const getIsPortrait = () => window.innerHeight > window.innerWidth;

const useOrientation = () => {
  const [isPortrait, setIsPortrait] = useState(getIsPortrait());

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(getIsPortrait());
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isPortrait;
};

export default useOrientation;
