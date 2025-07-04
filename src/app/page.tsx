import { CircleTextLabel } from "@/components/common/Chips/CircleTextLabel";
import { MoveTypeLabel } from "@/components/common/Chips/MoveTypeLabel";
import React from "react";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-10 px-20 py-20">
      <div className="flex flex-col gap-3">
        <h1>이사유형 라벨</h1>
        <MoveTypeLabel type="small" />
        <MoveTypeLabel type="home" />
        <MoveTypeLabel type="office" />
        <MoveTypeLabel type="document" />
      </div>
      <div className="flex flex-col gap-3">
        <h1>텍스트라벨</h1>
        <CircleTextLabel text="도로명" />
        <CircleTextLabel text="소형이사" clickAble={true} />
        <CircleTextLabel text="서울" clickAble={true} />
        <CircleTextLabel text="경기" clickAble={true} />
      </div>
      <div className="flex text-red-500">랜딩 페이지 입니다</div>
    </div>
  );
};

export default HomePage;
