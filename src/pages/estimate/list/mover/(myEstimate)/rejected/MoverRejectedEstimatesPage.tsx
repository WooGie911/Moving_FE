import { ListTab } from "@/components/estimate/list/ListTab";
import React from "react";

const MoverRejectedEstimatesPage = () => {
  return (
    <>
      <ListTab userType="Mover" />
      <div>아래는 작업중</div>
    </>
  );
};

export default MoverRejectedEstimatesPage;
