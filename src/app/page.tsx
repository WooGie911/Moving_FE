import { CircleTextLabel } from "@/components/common/Chips/CircleTextLabel";
import { MoveTypeLabel } from "@/components/common/Chips/MoveTypeLabel";
import React from "react";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-5 px-10 py-10">
      <MoveTypeLabel type="small" size="sm" />
      <MoveTypeLabel type="home" size="md" />
      <MoveTypeLabel type="office" size="responsive" />
      <MoveTypeLabel type="document" size="responsive" />
      <CircleTextLabel text="도로명" Clickable={false} />
      <CircleTextLabel text="상세주소" Clickable={false} />
      <CircleTextLabel text="부산" Clickable={true} size="sm" />
      <CircleTextLabel text="소형이사" Clickable={true} size="sm" />
      <CircleTextLabel text="서울" Clickable={true} size="md" />
      <CircleTextLabel text="사무실이사" Clickable={true} size="md" />
      <CircleTextLabel text="가정이사" Clickable={true} size="responsive" />
      <CircleTextLabel text="서울" Clickable={true} size="responsive" />
      <div className="flex text-red-500">랜딩 페이지 입니다</div>;
    </div>
  );
};

export default HomePage;
