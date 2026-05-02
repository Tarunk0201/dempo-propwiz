import React from "react";
import Lottie from "lottie-react";

const LottieMarker = ({ animationData }) => {
  return (
    <div style={{ width: 100, height: 100 }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default LottieMarker;
