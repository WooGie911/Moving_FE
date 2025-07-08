import { ListTab } from "@/components/estimate/list/ListTab";
import React from "react";

const UserWaitingEstimatesPage = () => {
  return (
    <>
      <ListTab userType="User" />
      <div>아래는 작업중</div>
    </>
  );
};

export default UserWaitingEstimatesPage;
