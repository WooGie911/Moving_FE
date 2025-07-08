import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import { ListTab } from "@/components/estimate/list/ListTab";
import React from "react";

const MoverRequestedEstimatesPage = () => {
  return (
    <>
      <ListTab userType="Mover" />
      <div className="flex flex-col gap-10 px-10 md:flex-row">아래는 작업중</div>
    </>
  );
};

export default MoverRequestedEstimatesPage;
