import React from "react";

const Disclaimer = ({ onAccept }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full cursor-pointer bg-cover bg-center z-[9999]"
      style={{ backgroundImage: "url(/disclaimer.jpeg)" }}
      onClick={onAccept}
    >
      <div className="w-full h-full bg-black/80 bg-opacity-70 text-white flex flex-col justify-center items-center text-center p-4">
        <div className="max-w-[80%] flex flex-col justify-center items-center">
          <h1 className="text-2xl mb-4">Disclaimer</h1>
          <p className="text-sm lg:text-2xl mb-8 font-semibold">
            MP RERA Registration No. P-OTH-25-5339 (Project: Paradise Grande) is
            valid up to 30th June 2027, and MP RERA Registration No.
            P-OTH-24-4784 (Project: Drushika Imperial) is valid up to 31st
            December 2026. Details are available at{" "}
            <a href="https://www.rera.mp.gov.in" target="_blank">
              https://www.rera.mp.gov.in
            </a>{" "}
            . The completion certification is issued by IMC/IDA.
          </p>
          <p className="text-xs md:text-lg lg:w-5xl">
            Both projects are being developed by Drushika Real Estate. This
            virtual tour presents a combined visualization of Paradise Grande
            and Drushika Imperial. While they are separate projects as per
            official records, they are showcased together due to their
            integrated theme and continuous construction layout.
          </p>
          <p className="text-xl font-bold lg:pt-20">
            Click anywhere to continue
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
