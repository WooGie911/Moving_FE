import { CircleTextLabel } from "@/components/common/Chips/CircleTextLabel";
import { ListTab } from "@/components/estimate/list/ListTab";
import React from "react";

const MoverRequestedEstimatesPage = () => {
  return (
    <>
      <ListTab userType="Mover" />
      <div className="flex flex-col gap-10 px-10 md:flex-row">
        아래는 작업중
        <CircleTextLabel text="요청중" />
        <CircleTextLabel text="서울" clickAble={true} />
        <CircleTextLabel text="경기" clickAble={true} />
      </div>
    </>
  );
};

export default MoverRequestedEstimatesPage;
