import { MoveTypeLabel } from "@/components/common/chips/MoveTypeLabel";
import Image from "next/image";
import React from "react";
import badge from "@/assets/icon/etc/icon-chat.png";
import like from "@/assets/icon/like/icon-like-black-lg.png";
import star from "@/assets/icon/star/icon-star-active-lg.png";

const MoverIntro = () => {
  return (
    <div>
      <MoveTypeLabel type="small" />
      <h2 className="text-2lg mt-2 mb-4 font-semibold md:mt-3 md:mb-5 md:text-2xl">
        고객님의 물품을 안전하게 운송해 드립니다.
      </h2>
      <div className="mb-4 flex justify-between">
        <div className="flex items-center gap-1">
          <Image src={badge} alt="badge-image" className="h-[23px] w-[20px]" />
          <p className="md:text-2lg text-lg font-semibold">김코드 기사님</p>
        </div>
        <div className="flex items-center gap-1">
          <p className="text-md md:text-2lg font-medium text-[#808080]">136</p>
          <Image src={like} alt="like-image" className="h-6 w-6" />
        </div>
      </div>
      <p className="text-md mb-8 leading-6 font-normal text-[#808080] md:text-lg md:leading-[26px]">
        안녕하세요. 이사업계 경력 7년으로 안전한 이사를 도와드리는 김코드입니다. <br />
        고객님의 물품을 소중하고 안전하게 운송하여 드립니다. 소형이사 및 가정이사 서비스를 제공하며 서비스 가능 지역은
        서울과 경기권입니다.
      </p>
      <div className="flex items-center justify-center gap-9 rounded-xl border border-gray-200 py-[24.5px] md:gap-[97px] md:rounded-2xl md:py-8 lg:gap-42">
        <div className="flex flex-col items-center">
          <p className="text-[13px] text-[#808080] md:mb-1 md:text-lg md:text-[#302F2D]">진행</p>
          <p className="text-lg font-semibold md:text-xl md:font-bold">334건</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[13px] text-[#808080] md:mb-1 md:text-lg md:text-[#302F2D]">리뷰</p>
          <div className="flex items-center gap-[6px]">
            <Image src={star} alt="star-image" className="h-5 w-5 md:h-6 md:w-6" />
            <p className="text-lg font-semibold md:text-xl md:font-bold">5.0</p>
            <p className="text-md font-medium text-[#ABABAB] md:text-lg">(178)</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[13px] text-[#808080] md:mb-1 md:text-lg md:text-[#302F2D]">총 경력</p>
          <p className="text-lg font-semibold md:text-xl md:font-bold">7년</p>
        </div>
      </div>
    </div>
  );
};

export default MoverIntro;
