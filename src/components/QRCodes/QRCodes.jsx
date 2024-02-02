import React from "react";
import AndroidQR from "../../assets/qrcodes/andriod.svg";
import IOSQR from "../../assets/qrcodes/ios.svg";

const QRCodes = () => {
  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200 ">
      <div className="columns-2 ">
        <div className="p-11">
          <div className="text-center underline font-bold ">iOS</div>
          <div>
            <img
              src={IOSQR}
              alt=""
              className="h-[400px] object-cover rounded-md"
            />
          </div>
        </div>
        <div className="p-11">
          <div className="text-center underline font-bold">Android</div>
          <div>
            <img
              src={AndroidQR}
              alt=""
              className="h-[400px] object-cover rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodes;
