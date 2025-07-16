import React from "react";
import Chip from "./Chip";
import MoverIntro from "./MoverIntro";

const DetailInformation = () => {
  return (
    <div className="mt-[35px] flex w-full justify-center px-5 md:mt-[46px] md:px-18 lg:mt-[62px] lg:px-[135px]">
      <div>
        <div>
          <MoverIntro />
        </div>
        <div className="mt-8 lg:mt-10">
          <Chip />
        </div>
      </div>
    </div>
  );
};

export default DetailInformation;
